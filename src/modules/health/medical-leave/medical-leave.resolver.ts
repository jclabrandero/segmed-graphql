
import { ClinicCare } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IMedicalLeaveCreateArgs, IMedicalLeaveUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { now, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class MedicalLeaveResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		return await db.medicalLeave.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				disabilityType: true
			}
		})
	}

	async create(_, { data }: { data: IMedicalLeaveCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data

		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				medicalLeaves: {
					create: [{
						...withAuditForCreate(user, payload)
					}]
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

}
