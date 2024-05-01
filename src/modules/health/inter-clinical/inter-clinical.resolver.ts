
import { ClinicCare } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IInterclinicalCreateArgs, IInterclinicalUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { now, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'
import { MedicalGroupResolver } from '../../catalog'
import { InterclinicalTemplate } from '../../template/inter-clinical.template'


export class InterclinicalResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	static format(record) {
		return {
			...record,
			medicalGroup: {
				...record.medicalGroup,
				specialties: record.specialties.map(specialty => ({
					...specialty.medicalSpecialty,
					subspecialties: specialty.subspecialties.map(subspecialty => subspecialty.medicalSubspecialty)
				}))
			},
			files: record.files.map(ref => ref.file)
		}
	}

	static include() {
		return {
			medicalGroup: true,
			provider: true,
			specialties: {
				include: {
					medicalSpecialty: true,
					subspecialties: {
						include: {
							medicalSubspecialty: true
						}
					}
				}
			},
			files: {
				where: {
					status: Status.Active
				},
				include: {
					file: true
				}
			}
		}
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.interclinical.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: InterclinicalResolver.include()
		})

		return InterclinicalResolver.format(record)
	}

	async create(_, { data }: { data: IInterclinicalCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, medicalGroupId, specialties, ...payload } = data
		const groups = await MedicalGroupResolver.index({ db } as IContext)
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				interclinicals: {
					create: [{
						...withAuditForCreate(user, payload),
						medicalGroupId,
						driftDate: now().local,
						specialties: {
							create: specialties.map(({ medicalSpecialtyId, subspecialties }) => ({
								...withAuditForCreate(user, { medicalSpecialtyId, specialtyName: groups[medicalGroupId].specialties[medicalSpecialtyId].name }),
								subspecialties: {
									create: subspecialties.map(medicalSubspecialtyId => 
										withAuditForCreate(user, {
											medicalSubspecialtyId,
											subspecialtyName: groups[medicalGroupId].specialties[medicalSpecialtyId].subspecialties[medicalSubspecialtyId].name
										})
									)
								}
							}))
						}
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

	async update(source, { id, data }: { id: number, data: IInterclinicalUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, files, ...payload } = data
		const md5ToId = async () => {
			const result = []
			for (const md5 of files) {
				result.push((await db.fileUpload.findUnique({ where: { md5 }})).id)
			}
			return result
		}
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				interclinicals: {
					update: {
						where: { id },
						data: {
							...withAuditForUpdate(user, payload),
							files: files ? await Relation.upsert({
								model: db.interclinicalFileUpload, where: { interclinicalId: id }, dataset: await md5ToId(), field: 'fileUploadId', user
							}) : undefined
						}
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

	async delete(source, { id, data }: { id: number, data: IInterclinicalUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				interclinicals: {
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

	async print(_, args: { id: number }, constext: IContext) {
		const template = new InterclinicalTemplate()
		const record = await constext.db.interclinical.findUnique({
			where: {
				id: args.id,
				NOT: { status: Status.Removed }
			},
			include: {
				clinicCare: {
					include: {
						medicalOffice: true,
						insured: {
							include: {
								person: true,
								belonging: true
							}
						}
					}
				},
				...InterclinicalResolver.include()
			}
		})

		const buffer = await template.make(InterclinicalResolver.format(record), constext.user)

		return {
			info: {
				type: 'application/pdf'
			},
			data: buffer.toString('base64')
		}
	}

}
