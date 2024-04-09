
import { Belonging } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IBelongingCreateArgs, IBelongingUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { auditLog, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class BelongingResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Belonging)
	}

	async index(_, args, { db }: IContext): Promise<Array<Belonging>> {
		return await db.belonging.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<Belonging>> {
		return await db.belonging.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Belonging> {
		return await db.belonging.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IBelongingCreateArgs }, { db, pubsub, user }: IContext): Promise<Belonging> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Belonging
		const record = await db.belonging.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ belongingCreated: record }, { belongingUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IBelongingUpdateArgs }, { db, pubsub, user }: IContext): Promise<Belonging> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Belonging
		const found = await super.findOneOrFail(db.belonging, id)
		const record = await db.belonging.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		await auditLog(db, 'Belonging', found, record, data)
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ belongingUpdated: record }, { belongingUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Belonging> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Belonging
		const found = await super.findOneOrFail(db.belonging, id)
		const record = await db.belonging.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ belongingDeleted: record }, { belongingUpserted: record }]
		})
		return record
	}

}
