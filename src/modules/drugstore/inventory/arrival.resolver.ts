
import { Arrival, ArrivalItem, PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext, IArrivalCreateArgs, IArrivalUpdateArgs, IArrivalItemCreateArgs } from '../../../support/types'
import { now, withAuditForCreate, withAuditForUpdate } from '../../../support/functions'

export class ArrivalResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Arrival)
	}

	private static async getTotal(id: number, db: PrismaClient): Promise<Decimal> {
		let total: Decimal = new Decimal(0)
		const arrivalItems = await db.arrivalItem.findMany({
			where: {
				arrivalId: id,
				NOT: { status: Status.Removed }
			},
			select: { quantity: true, price: true }
		})
		for (const { quantity, price } of arrivalItems) {
			total = total.add(price.mul(quantity))
		}

		return total
	}

	async index(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<Arrival>> {
		const data = await db.arrival.findMany({
			where: {
				pharmacyId,
				NOT: { status: Status.Removed }
			},
			include: {
				provider: true
			}
		})

		const result = []

		for (const arrival of data) {
			result.push({ ...arrival, total: await ArrivalResolver.getTotal(arrival.id, db) })
		}

		return result
	}

	async items(_, { arrivalId }: { arrivalId: number }, { db }: IContext): Promise<Array<ArrivalItem>> {
		const data = await db.arrivalItem.findMany({
			where: {
				arrivalId,
				NOT: { status: Status.Removed }
			},
			include: {
				batch: {
					include: {
						medication: {
							include: {
								unit: true
							}
						}
					}
				}
			}
		})

		const result = []

		for (const arrivalItem of data) {
			result.push({ ...arrivalItem, total: arrivalItem.price.mul(arrivalItem.quantity) })
		}

		return result
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const arrival = await db.arrival.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				provider: true,
				items: {
					where: {
						NOT: { status: Status.Removed }
					}
				}
			}
		})

		return { ...arrival, total: await ArrivalResolver.getTotal(id, db) }
	}

	async create(_, { data }: { data: IArrivalCreateArgs }, { db, pubsub, user }: IContext): Promise<Arrival> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Arrival
		const record = await db.arrival.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ arrivalCreated: record }, { arrivalUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IArrivalUpdateArgs }, { db, pubsub, user }: IContext): Promise<Arrival> {
		const arrival = await db.arrival.findUnique({
			where: { id, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const { UPDATED, UPSERTED } = SubscriptionEvent.Arrival
		const record = await db.arrival.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ arrivalUpdated: record }, { arrivalUpserted: record }]
		})
		return record
	}

	async createItem(_, { data }: { data: IArrivalItemCreateArgs }, { db, pubsub, user }: IContext): Promise<ArrivalItem> {
		const { CREATED, UPSERTED } = SubscriptionEvent.ArrivalItem
		const batch = await db.batch.findUnique({
			where: { id: data.batchId, NOT: { status: Status.Removed } }
		})
		if (!batch) throw new Error('Lote no encontrado.')
		const arrival = await db.arrival.findUnique({
			where: { id: data.arrivalId, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const inventory = await db.inventory.findUnique({
			where: {
				pharmacyId_medicationId: {
					pharmacyId: arrival.pharmacyId,
					medicationId: batch.medicationId
				}
			},
			select: { stock: true, price: true }
		})

		const [record, inventoryUpserted] = await db.$transaction([
			db.arrivalItem.create({
				data: withAuditForCreate(user, data)
			}),
			db.inventory.upsert({
				where: {
					pharmacyId_medicationId: {
						pharmacyId: arrival.pharmacyId,
						medicationId: batch.medicationId
					}
				},
				create: withAuditForCreate(user, {
					pharmacyId: arrival.pharmacyId,
					medicationId: batch.medicationId,
					stock: data.quantity,
					price: data.price
				}),
				update: withAuditForUpdate(user, {
					stock: { increment: data.quantity },
					price: inventory ? inventory.price.mul(inventory.stock).add(data.price.mul(data.quantity)).dividedBy(new Decimal(inventory.stock + data.quantity)) : data.price
				})
			}),
			db.arrival.update({
				where: { id: data.arrivalId },
				data: withAuditForUpdate(user, {
					approvalState: 0,
					approvalDate: null,
					approvalUserName: null
				})
			})
		])
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ arrivalItemCreated: record }, { arrivalItemUpserted: record }, { inventoryUpserted }]
		})
		return record
	}

	async approve(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Arrival> {
		const arrival = await db.arrival.findUnique({
			where: { id, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.approvalState === 1) throw new Error('Ingreso ya aprobado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const { UPDATED, UPSERTED } = SubscriptionEvent.Arrival
		const record = await db.arrival.update({
			where: { id },
			data: withAuditForUpdate(user, {
				approvalState: 1,
				approvalDate: now().utc,
				approvalUserName: user.userName
			})
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ arrivalUpdated: record }, { arrivalUpserted: record }]
		})
		return record
	}

	async close(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Arrival> {
		const arrival = await db.arrival.findUnique({
			where: { id, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const { UPDATED, UPSERTED } = SubscriptionEvent.Arrival
		const record = await db.arrival.update({
			where: { id },
			data: withAuditForUpdate(user, {
				closed: true
			})
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ arrivalUpdated: record }, { arrivalUpserted: record }]
		})
		return record
	}
}
