
import { Departure, DepartureItem } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext, IDepartureCreateArgs, IDepartureItemCreateArgs } from '../../../support/types'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'
import { BatchResolver } from '../batch/batch.resolver'

export class DepartureResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Departure)
	}

	async index(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<Departure>> {
		return await db.departure.findMany({
			where: {
				pharmacyId,
				NOT: { status: Status.Removed }
			},
		})
	}

	async items(_, { departureId }: { departureId: number }, { db }: IContext): Promise<Array<DepartureItem>> {
		return await db.departureItem.findMany({
			where: {
				departureId,
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
	}

	async create(_, { data }: { data: IDepartureCreateArgs }, { db, pubsub, user }: IContext): Promise<Departure> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Departure
		const record = await db.departure.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ departureCreated: record }, { departureUpserted: record }]
		})
		return record
	}

	async createItem(_, { data }: { data: IDepartureItemCreateArgs }, context: IContext): Promise<DepartureItem> {
		const { db, pubsub, user } = context
		const { CREATED, UPSERTED } = SubscriptionEvent.DepartureItem

		const departure = await db.departure.findUnique({
			where: { id: data.departureId, NOT: { status: Status.Removed } }
		})
		if (!departure) throw new Error('Salida no encontrada.')

		const { batch, stock} = await BatchResolver.stock({
			batchId: data.batchId,
			pharmacyId: departure.pharmacyId
		}, context)
		
		if (stock < data.quantity) throw new Error('Stock de lote insuficiente.')
		
		const inventory = await db.inventory.findUnique({
			where: {
				pharmacyId_medicationId: {
					pharmacyId: departure.pharmacyId,
					medicationId: batch.medicationId
				}
			}
		})
		// if (!inventory) throw new Error('Inventario no encontrado.')
		if (inventory.stock - inventory.min < data.quantity) throw new Error('Stock insuficiente.')

		const [record, inventoryRecord] = await db.$transaction([
			db.departureItem.create({
				data: withAuditForCreate(user, data)
			}),
			db.inventory.update({
				where: {
					pharmacyId_medicationId: {
						pharmacyId: departure.pharmacyId,
						medicationId: batch.medicationId
					}
				},
				data: withAuditForUpdate(user, {
					stock: { decrement: data.quantity }
				})
			})
		])

		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ departureItemCreated: record }, { departureItemUpserted: record }, { inventoryUpserted: inventoryRecord }]
		})
		return record
	}
}
