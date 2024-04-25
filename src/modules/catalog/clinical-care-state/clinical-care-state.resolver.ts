
import { ClinicalCareState } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IClinicalCareStateCreateArgs, IClinicalCareStateUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class ClinicalCareStateResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.EmployeePosition)
	}

	async index(_, args, { db }: IContext): Promise<Array<ClinicalCareState>> {
		return await db.clinicalCareState.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<ClinicalCareState>> {
		return await db.clinicalCareState.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<ClinicalCareState> {
		return await db.clinicalCareState.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IClinicalCareStateCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicalCareState> {
		const { CREATED, UPSERTED } = SubscriptionEvent.ClinicalCareState
		const { lock, ...remaining } = data
		const record = await db.clinicalCareState.create({
			data: withAuditForCreate(user, { ...remaining, lock: Boolean(lock) })
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ clinicalCareStateCreated: record }, { clinicalCareStateUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IClinicalCareStateUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicalCareState> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicalCareState
		const record = await db.clinicalCareState.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicalCareStateUpdated: record }, { clinicalCareStateUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<ClinicalCareState> {
		const { DELETED, UPSERTED } = SubscriptionEvent.ClinicalCareState
		const found = await super.findOneOrFail(db.clinicalCareState, id)
		const record = await db.clinicalCareState.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ clinicalCareStateDeleted: record }, { clinicalCareStateUpserted: record }]
		})
		return record
	}

}
