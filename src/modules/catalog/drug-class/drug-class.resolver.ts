
import { DrugClass } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IDrugClassCreateArgs, IDrugClassUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class DrugClassResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.DrugClass)
	}

	async index(_, args, { db }: IContext): Promise<Array<DrugClass>> {
		return await db.drugClass.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<DrugClass>> {
		return await db.drugClass.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<DrugClass> {
		return await db.drugClass.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IDrugClassCreateArgs }, { db, pubsub, user }: IContext): Promise<DrugClass> {
		const { CREATED, UPSERTED } = SubscriptionEvent.DrugClass
		const record = await db.drugClass.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ drugClassCreated: record }, { drugClassUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IDrugClassUpdateArgs }, { db, pubsub, user }: IContext): Promise<DrugClass> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.DrugClass
		const record = await db.drugClass.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ drugClassUpdated: record }, { drugClassUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<DrugClass> {
		const { DELETED, UPSERTED } = SubscriptionEvent.DrugClass
		const found = await super.findOneOrFail(db.drugClass, id)
		const record = await db.drugClass.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ drugClassDeleted: record }, { drugClassUpserted: record }]
		})
		return record
	}

}
