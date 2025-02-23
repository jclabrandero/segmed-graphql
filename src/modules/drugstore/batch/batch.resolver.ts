
import { Batch } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IBatchCreateArgs, IBatchUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'

export class BatchResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Batch)
	}

	async index(_, args, { db }: IContext): Promise<Array<Batch>> {
		return await db.batch.findMany({
			where: {
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

	async create(_, { data }: { data: IBatchCreateArgs }, { db, pubsub, user }: IContext): Promise<Batch> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Batch
		const record = await db.batch.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ batchCreated: record }, { batchUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IBatchUpdateArgs }, { db, pubsub, user }: IContext): Promise<Batch> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Batch
		const record = await db.batch.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ batchUpdated: record }, { batchUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Batch> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Batch
		await super.findOneOrFail(db.batch, id)
		const record = await db.batch.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ batchDeleted: record }, { batchUpserted: record }]
		})
		return record
	}

	async stocks(_, { data }: { data: { pharmacyId: number; medicationId: number } }, { db }: IContext): Promise<Array<{ batch: Batch, stock: number }>> {
		const { pharmacyId, medicationId } = data
		const arrivalItems = await db.arrivalItem.groupBy({
			by: ['batchId'],
			_sum: {
				quantity: true
			},
			where: {
				batch: {
					medicationId
				},
				arrival: {
					pharmacyId,
					closed: true
				},
				NOT: { status: Status.Removed }
			},
		})
		const departureItems = await db.departureItem.groupBy({
			by: ['batchId'],
			_sum: {
				quantity: true
			},
			where: {
				batch: {
					medicationId
				},
				departure: {
					pharmacyId
				},
				NOT: { status: Status.Removed }
			},
		})

		const results = []

		for (const { batchId, _sum } of arrivalItems) {
			const batch = await db.batch.findUnique({
				where: { id: batchId, NOT: { status: Status.Removed } }
			})
			const departureItem = departureItems.find(({ batchId }) => batchId === batch.id)
			results.push({
				batch,
				stock: departureItem ? _sum.quantity - departureItem._sum.quantity : _sum.quantity
			})
		}

		return results
	}

	static async stock(data: { pharmacyId: number; batchId: number }, { db }: IContext): Promise<{ batch: Batch, stock: number }> {
		const { pharmacyId, batchId } = data
		const batch = await db.batch.findUnique({
			where: { id: batchId, NOT: { status: Status.Removed } }
		})
		if (!batch) throw new Error('Lote no encontrado.')

		const arrivalItems = await db.arrivalItem.groupBy({
			by: ['batchId'],
			_sum: {
				quantity: true
			},
			where: {
				batchId,
				arrival: {
					pharmacyId,
					closed: true
				},
				NOT: { status: Status.Removed }
			},
		})
		if (!arrivalItems.length) throw new Error('Lote sin ingresos.')

		const departureItems = await db.departureItem.groupBy({
			by: ['batchId'],
			_sum: {
				quantity: true
			},
			where: {
				batchId,
				departure: {
					pharmacyId
				},
				NOT: { status: Status.Removed }
			},
		})

		const arrivalItem = arrivalItems[0]
		const departureItem = departureItems[0]
		return {
			batch,
			stock: departureItem ? arrivalItem._sum.quantity - departureItem._sum.quantity : arrivalItem._sum.quantity
		}
	}
}
