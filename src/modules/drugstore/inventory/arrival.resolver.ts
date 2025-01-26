
import { Arrival, ArrivalItem, PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext, IArrivalCreateArgs, IArrivalUpdateArgs, IArrivalItemCreateArgs, IArrivalItemUpdateArgs } from '../../../support/types'
import { now, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'

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

	async findOneItem(_, { id }: { id: number }, { db }: IContext): Promise<ArrivalItem> {
		const arrivalItem = await db.arrivalItem.findUnique({
			where: {
				id,
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

		return { ...arrivalItem, total: arrivalItem.price.mul(arrivalItem.quantity) } as ArrivalItem
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

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Arrival> {
		const record = await db.arrival.update({
			where: { id },
			data: {
				...withAuditForDelete(user),
				items: {
					updateMany: {
						where: { arrivalId: id },
						data: withAuditForDelete(user)
					}
				}
			}
		})
		const { DELETED, UPSERTED } = SubscriptionEvent.Arrival
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ arrivalDeleted: record }, { arrivalUpserted: record }]
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

		// const inventory = await db.inventory.findUnique({
		// 	where: {
		// 		pharmacyId_medicationId: {
		// 			pharmacyId: arrival.pharmacyId,
		// 			medicationId: batch.medicationId
		// 		}
		// 	},
		// 	select: { stock: true, price: true }
		// })

		const [record, inventoryUpserted] = await db.$transaction([
			db.arrivalItem.create({
				data: withAuditForCreate(user, data)
			}),
			// db.inventory.upsert({
			// 	where: {
			// 		pharmacyId_medicationId: {
			// 			pharmacyId: arrival.pharmacyId,
			// 			medicationId: batch.medicationId
			// 		}
			// 	},
			// 	create: withAuditForCreate(user, {
			// 		pharmacyId: arrival.pharmacyId,
			// 		medicationId: batch.medicationId,
			// 		stock: data.quantity,
			// 		price: data.price
			// 	}),
			// 	update: withAuditForUpdate(user, {
			// 		stock: { increment: data.quantity },
			// 		price: inventory ? inventory.price.mul(inventory.stock).add(data.price.mul(data.quantity)).dividedBy(new Decimal(inventory.stock + data.quantity)) : data.price
			// 	})
			// }),
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

	async updateItem(_, { id, data }: { id: number, data: IArrivalItemUpdateArgs }, { db, pubsub, user }: IContext): Promise<ArrivalItem> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ArrivalItem
		const arrivalItem = await db.arrivalItem.findUnique({
			where: { id, NOT: { status: Status.Removed } },
			include: { batch: true }
		})
		if (!arrivalItem) throw new Error('Item de ingreso no encontrado.')
		if (data.batchId) {
			const batch = await db.batch.findUnique({
				where: { id: data.batchId, NOT: { status: Status.Removed } }
			})
			if (!batch) throw new Error('Lote no encontrado.')
		}
		const arrival = await db.arrival.findUnique({
			where: { id: arrivalItem.arrivalId, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		// const inventory = await db.inventory.findUnique({
		// 	where: {
		// 		pharmacyId_medicationId: {
		// 			pharmacyId: arrival.pharmacyId,
		// 			medicationId: arrivalItem.batch.medicationId
		// 		}
		// 	},
		// 	select: { stock: true, price: true }
		// })

		// const calcStock = () => {
		// 	if (data.quantity) {
		// 		if (arrivalItem.quantity > data.quantity) {
		// 			return { decrement: arrivalItem.quantity - data.quantity }
		// 		} else if (arrivalItem.quantity < data.quantity) {
		// 			return { increment: data.quantity - arrivalItem.quantity }
		// 		}
		// 	}
		// 	return undefined
		// }
		// const calcPrice = () => {
		// 	const price = data.price ? data.price : arrivalItem.price
		// 	const quantity = data.quantity | arrivalItem.quantity
			
		// 	if (inventory.stock > arrivalItem.quantity) {
		// 		const stock = inventory.stock - arrivalItem.quantity
		// 		return inventory.price.mul(stock).add(price.mul(quantity)).dividedBy(new Decimal(stock + quantity))
		// 	}

		// 	return price
		// }

		const [record, inventoryUpserted] = await db.$transaction([
			db.arrivalItem.update({
				where: { id },
				data: withAuditForUpdate(user, data)
			}),
			// db.inventory.update({
			// 	where: {
			// 		pharmacyId_medicationId: {
			// 			pharmacyId: arrival.pharmacyId,
			// 			medicationId: arrivalItem.batch.medicationId
			// 		}
			// 	},
			// 	data: withAuditForUpdate(user, {
			// 		stock: calcStock(),
			// 		price: calcPrice()
			// 	})
			// }),
			db.arrival.update({
				where: { id: arrivalItem.arrivalId },
				data: withAuditForUpdate(user, {
					approvalState: 0,
					approvalDate: null,
					approvalUserName: null
				})
			})
		])
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ arrivalItemUpdated: record }, { arrivalItemUpserted: record }, { inventoryUpserted }]
		})
		return record
	}

	async deleteItem(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<ArrivalItem> {
		const { DELETED, UPSERTED } = SubscriptionEvent.ArrivalItem
		const arrivalItem = await db.arrivalItem.findUnique({
			where: { id, NOT: { status: Status.Removed } },
			include: { batch: true }
		})
		if (!arrivalItem) throw new Error('Item de ingreso no encontrado.')
		const arrival = await db.arrival.findUnique({
			where: { id: arrivalItem.arrivalId, NOT: { status: Status.Removed } }
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const [record, inventoryUpserted] = await db.$transaction([
			db.arrivalItem.update({
				where: { id },
				data: withAuditForDelete(user)
			}),
			db.arrival.update({
				where: { id: arrivalItem.arrivalId },
				data: withAuditForUpdate(user, {
					approvalState: 0,
					approvalDate: null,
					approvalUserName: null
				})
			})
		])
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ arrivalItemDeleted: record }, { arrivalItemUpserted: record }, { inventoryUpserted }]
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
			where: { id, NOT: { status: Status.Removed } },
			include: {
				items: {
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						batch: true
					}
				}
			}
		})
		if (!arrival) throw new Error('Ingreso no encontrado.')
		if (arrival.approvalState !== 1) throw new Error('Ingreso no aprobado.')
		if (arrival.closed) throw new Error('Ingreso ya finalizado.')

		const operations = []

		for (const element of arrival.items) {
			const inventory = await db.inventory.findUnique({
				where: {
					pharmacyId_medicationId: {
						pharmacyId: arrival.pharmacyId,
						medicationId: element.batch.medicationId
					}
				},
				select: { stock: true, price: true }
			})
			operations.push(
				db.inventory.upsert({
					where: {
						pharmacyId_medicationId: {
							pharmacyId: arrival.pharmacyId,
							medicationId: element.batch.medicationId
						}
					},
					create: withAuditForCreate(user, {
						pharmacyId: arrival.pharmacyId,
						medicationId: element.batch.medicationId,
						stock: element.quantity,
						price: element.price
					}),
					update: withAuditForUpdate(user, {
						stock: { increment: element.quantity },
						price: inventory ? inventory.price.mul(inventory.stock).add(element.price.mul(element.quantity)).dividedBy(new Decimal(inventory.stock + element.quantity)) : element.price
					})
				})
			)
		}

		const [record] = await db.$transaction([
			db.arrival.update({
				where: { id },
				data: withAuditForUpdate(user, {
					closed: true
				})
			}),
			...operations
		])

		const { UPDATED, UPSERTED } = SubscriptionEvent.Arrival
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ arrivalUpdated: record }, { arrivalUpserted: record }]
		})
		return record
	}
}
