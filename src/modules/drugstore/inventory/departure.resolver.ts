
import { Departure, DepartureItem } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext, IDepartureCreateArgs, IDepartureItemCreateArgs } from '../../../support/types'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'
import { BatchResolver } from '../batch/batch.resolver'
import { ClinicCareResolver } from '../../health'

export class DepartureResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Departure)
	}

	static format(record) {
		if (!record) return null
		const { departureClinicCare, ...departure } = record
		return {
			...departure,
			clinicCare: departureClinicCare ? ClinicCareResolver.format(departureClinicCare.clinicCare) : undefined,
		}
	}

	async index(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<Departure>> {
		const records = await db.departure.findMany({
			where: {
				pharmacyId,
				NOT: { status: Status.Removed }
			},
			include: {
				departureClinicCare: {
					include: {
						clinicCare: {
							include: {
								insured: {
									include: {
										insured: {
											include: {
												person: true,
											}
										}
									}
								}
							}
						}
					}
				}
			}
		})

		return records.map(DepartureResolver.format)
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
		const { clinicCareId, ...remaining } = data
		const record = await db.departure.create({
			data: withAuditForCreate(
				user,
				clinicCareId ? {
					...remaining,
					departureClinicCare: {
						create: withAuditForCreate(user, { clinicCareId })
					}
				} : remaining
			)
		})

		const { CREATED, UPSERTED } = SubscriptionEvent.Departure
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ departureCreated: record }, { departureUpserted: record }]
		})
		return record
	}

	async createItem(_, { data }: { data: IDepartureItemCreateArgs }, context: IContext): Promise<DepartureItem> {
		const { db, pubsub, user } = context
		const { quantity, departureId, batchId, prescriptionId } = data
		let departureItemPrescription = undefined

		if (prescriptionId) {
			const prescription = await db.prescription.findUnique({
				where: { id: prescriptionId, NOT: { status: Status.Removed } }
			})
			if (!prescription) throw new Error('Receta no encontrada.')

			departureItemPrescription = {
				create: withAuditForCreate(user, {
					prescriptionId
				})
			}
		}
		
		const departure = await db.departure.findUnique({
			where: { id: departureId, NOT: { status: Status.Removed } }
		})
		if (!departure) throw new Error('Salida no encontrada.')

		const { batch, stock} = await BatchResolver.stock({
			batchId: batchId,
			pharmacyId: departure.pharmacyId
		}, context)
		
		if (stock < quantity) throw new Error('Stock de lote insuficiente.')
		
		const inventory = await db.inventory.findUnique({
			where: {
				pharmacyId_medicationId: {
					pharmacyId: departure.pharmacyId,
					medicationId: batch.medicationId
				}
			}
		})
		// if (!inventory) throw new Error('Inventario no encontrado.')
		if (inventory.stock - inventory.min < quantity) throw new Error('Stock insuficiente.')

		const [record, inventoryRecord] = await db.$transaction([
			db.departureItem.create({
				data: withAuditForCreate(user, {
					quantity,
					price: inventory.price,
					departureId,
					batchId,
					departureItemPrescription,
				})
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

		const { CREATED, UPSERTED } = SubscriptionEvent.DepartureItem
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ departureItemCreated: record }, { departureItemUpserted: record }, { inventoryUpserted: inventoryRecord }]
		})
		return record
	}

	public upsertedItem({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(SubscriptionEvent.DepartureItem.UPSERTED)
		}
	}
}
