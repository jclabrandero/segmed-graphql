
import { ClinicCare } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IPrescriptionCreateArgs, IPrescriptionUpdateArgs, IPrescriptionExternCreateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class PrescriptionResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		return await db.prescription.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				pharmacy: true,
				medication: {
					include: {
						unit: true
					}
				}
			}
		})
	}

	async findOneExtern(_, { id }: { id: number }, { db }: IContext) {
		return await db.prescriptionExtern.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				medication: {
					include: {
						unit: true
					}
				}
			}
		})
	}

	async create(_, { data }: { data: IPrescriptionCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { medicationId, pharmacyId, clinicCareId, ...remaining } = data
		const exists = await db.prescription.findUnique({
			where: {
				medicationId_pharmacyId_clinicCareId: {
					medicationId, pharmacyId, clinicCareId
				}
			}
		})
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptions: exists ? {
					update: {
						where: {
							medicationId_pharmacyId_clinicCareId: {
								medicationId, pharmacyId, clinicCareId
							}
						},
						data: withAuditForUpdate(user, { status: Status.Active, ...remaining })
					}
				} : {
					create: [withAuditForCreate(user, { medicationId, pharmacyId, ...remaining })]
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

	async update(_, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data
		const record = await db.clinicCare.update({
			where: {
				id: clinicCareId
			},
			data: {
				prescriptions: {
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

	async delete(source, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptions: {
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

	async createExtern(_, { data }: { data: IPrescriptionExternCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { medicationId, clinicCareId, ...remaining } = data
		const exists = await db.prescriptionExtern.findUnique({
			where: {
				medicationId_clinicCareId: {
					medicationId, clinicCareId
				}
			}
		})
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptionExterns: exists ? {
					update: {
						where: {
							medicationId_clinicCareId: {
								medicationId, clinicCareId
							}
						},
						data: withAuditForUpdate(user, { status: Status.Active, ...remaining })
					}
				} : {
					create: [withAuditForCreate(user, { medicationId, ...remaining })]
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

	async updateExtern(_, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data
		const record = await db.clinicCare.update({
			where: {
				id: clinicCareId
			},
			data: {
				prescriptionExterns: {
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

	async deleteExtern(source, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptionExterns: {
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

}
