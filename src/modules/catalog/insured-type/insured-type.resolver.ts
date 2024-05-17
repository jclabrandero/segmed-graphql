
import { InsuredType } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IInsuredTypeCreateArgs, IInsuredTypeUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class InsuredTypeResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.InsuredType)
	}

	async index(_, args, { db }: IContext): Promise<Array<InsuredType>> {
		return await db.insuredType.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<InsuredType>> {
		return await db.insuredType.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<InsuredType> {
		return await db.insuredType.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IInsuredTypeCreateArgs }, { db, pubsub, user }: IContext): Promise<InsuredType> {
		const { CREATED, UPSERTED } = SubscriptionEvent.InsuredType
		const record = await db.insuredType.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ insuredTypeCreated: record }, { insuredTypeUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IInsuredTypeUpdateArgs }, { db, pubsub, user }: IContext): Promise<InsuredType> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.InsuredType
		const record = await db.insuredType.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ insuredTypeUpdated: record }, { insuredTypeUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<InsuredType> {
		const { DELETED, UPSERTED } = SubscriptionEvent.InsuredType
		const found = await super.findOneOrFail(db.insuredType, id)
		const insureds = await db.insured.findMany({ where: { insuredTypeId: id, NOT: { status: Status.Removed } } })
		if (insureds.length) throw 'Existen beneficiarios que dependen de éste registro.'

		const record = await db.insuredType.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ insuredTypeDeleted: record }, { insuredTypeUpserted: record }]
		})
		return record
	}

}
