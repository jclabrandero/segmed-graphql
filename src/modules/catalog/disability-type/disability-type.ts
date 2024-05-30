
import { DisabilityType } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IDisabilityTypeCreateArgs, IDisabilityTypeUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class DisabilityTypeResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.DisabilityType)
	}

	public static async findOne({ id }: { id: number }, { db }: IContext) {
		return await db.disabilityType.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async index(_, args, { db }: IContext): Promise<Array<DisabilityType>> {
		return await db.disabilityType.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<DisabilityType>> {
		return await db.disabilityType.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<DisabilityType> {
		return await db.disabilityType.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IDisabilityTypeCreateArgs }, { db, pubsub, user }: IContext): Promise<DisabilityType> {
		const { CREATED, UPSERTED } = SubscriptionEvent.DisabilityType
		const record = await db.disabilityType.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ disabilityTypeCreated: record }, { disabilityTypeUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IDisabilityTypeUpdateArgs }, { db, pubsub, user }: IContext): Promise<DisabilityType> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.DisabilityType
		const record = await db.disabilityType.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ disabilityTypeUpdated: record }, { disabilityTypeUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<DisabilityType> {
		const { DELETED, UPSERTED } = SubscriptionEvent.DisabilityType
		const found = await super.findOneOrFail(db.disabilityType, id)

		const record = await db.disabilityType.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ disabilityTypeDeleted: record }, { disabilityTypeUpserted: record }]
		})
		return record
	}

}
