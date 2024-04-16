
import { Insured } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IInsuredCreateArgs, IInsuredUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class InsuredResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Insured)
	}

	private static include() {
		return {
			person: true,
			holderInsured: true,
			insuredType: true,
			dependents: true,
			belonging: true
		}
	}

	private static async findMany(model, where) {
		const total = await model.count({ where })

		let result = []

		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await model.findMany({
					where,
					include: InsuredResolver.include(),
					skip: i,
					take: 1000
				})
			)
		}

		return result
	}

	async index(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, { NOT: { status: Status.Removed } })
	}

	async active(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, { status: Status.Active })
	}

	async activeHolders(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, {
			status: Status.Active,
			insuredType: {
				withDependents: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Insured> {
		return await db.insured.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: InsuredResolver.include()
		})
	}

	async create(_, { data }: { data: IInsuredCreateArgs }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Insured
		const { tradeUnion, ...remaining } = data
		const record = await db.insured.create({
			data: withAuditForCreate(user, {
				...remaining,
				tradeUnion: Boolean(tradeUnion)
			})
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ insuredCreated: record }, { insuredUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IInsuredUpdateArgs }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Insured
		const record = await db.insured.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ insuredUpdated: record }, { insuredUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Insured
		await super.findOneOrFail(db.insured, id)
		const record = await db.insured.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ insuredDeleted: record }, { insuredUpserted: record }]
		})
		return record
	}

}
