
import { ClinicCare, ClinicCarePrimary } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IClinicCarePrimaryUpsertArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'


export class ClinicCarePrimaryResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<ClinicCarePrimary> {
		return await db.clinicCarePrimary.findUnique({
			where: {
				id,
				status: Status.Active
			}
		})
	}

	async upsert(_, { data }: { data: IClinicCarePrimaryUpsertArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...remaining } = data
		const exists = await db.clinicCarePrimary.findUnique({ where: { clinicCareId }})
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				primary: exists ? {
					update: {
						where: { clinicCareId },
						data: withAuditForUpdate(user, remaining)
					}
				} : {
					create: withAuditForCreate(user, remaining)
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
