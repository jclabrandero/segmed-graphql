
import { ClinicCare } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IMedicalLeaveCreateArgs, IMedicalLeaveUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { now, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'
import { DisabilityTypeResolver } from '../../catalog'
import { MedicalLeaveTemplate } from '../../template/medical-leave.template'

export class MedicalLeaveResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	static format(record) {
		if (!record) return null
		const { disabilityType, ...medicalLeave } = record
		return {
			...medicalLeave,
			disabilityType: {
				...disabilityType.disabilityType,
				name: disabilityType.disabilityTypeName
			}
		}
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.medicalLeave.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				disabilityType: {
					include: {
						disabilityType: true
					}
				}
			}
		})
		return MedicalLeaveResolver.format(record)
	}

	async create(_, { data }: { data: IMedicalLeaveCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, disabilityTypeId, ...payload } = data
		const disabilityType = await DisabilityTypeResolver.findOne({ id: disabilityTypeId }, { db } as IContext)
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				medicalLeaves: {
					create: withAuditForCreate(user, {
						...payload,
						disabilityType: {
							create: withAuditForCreate(user, {
								disabilityTypeId,
								disabilityTypeName: disabilityType.name
							})
						}
					})
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async update(source, { id, data }: { id: number, data: IMedicalLeaveUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data
		const found = await super.findOneOrFail(db.medicalLeave, id)
		if (found.approvalState != 0) throw 'El estado de éste registro no permite realizar modificaciones.'

		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				medicalLeaves: {
					update: {
						where: { id },
						data: withAuditForUpdate(user, payload)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async delete(source, { id, data }: { id: number, data: IMedicalLeaveUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const found = await super.findOneOrFail(db.medicalLeave, id)
		if (found.approvalState != 0) throw 'El estado de éste registro no permite la eliminación.'

		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				medicalLeaves: {
					update: {
						where: { id },
						data: withAuditForDelete(user)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async approve(source, { id, data }: { id: number, data: IMedicalLeaveUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const found = await super.findOneOrFail(db.medicalLeave, id)
		if (found.approvalState != 0) throw 'El estado de éste registro no permite realizar modificaciones.'

		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				medicalLeaves: {
					update: {
						where: { id },
						data: withAuditForUpdate(user, {
							approvalState: 1,
							approvalDate: now().local,
							approvalUserName: user.userName
						})
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async print(_, args: { id: number }, context: IContext) {
		const template = new MedicalLeaveTemplate()
		const record = await context.db.medicalLeave.findUnique({
			where: {
				id: args.id,
				NOT: { status: Status.Removed }
			},
			include: {
				disabilityType: true,
				clinicCare: {
					include: {
						medicalOffice: true,
						insured: {
							include: {
								insured: {
									include: {
										person: true,
										belonging: true
									}
								}
							}
						}
					}
				}
			}
		})

		try {
			const buffer = await template.make(MedicalLeaveResolver.format(record), context.user)

			return {
				info: {
					type: 'application/pdf'
				},
				data: buffer.toString('base64')
			}
		} catch (error) {
			console.error(error)
			throw 'Error al generar el documento.'
		}
	}
}
