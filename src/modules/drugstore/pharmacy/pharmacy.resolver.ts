
import { Pharmacy } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IPharmacyCreateArgs, IPharmacyUpdateArgs, MedicationStock } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class PharmacyResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Pharmacy)
	}

	public static async findOne({ id }: { id: number }, { db }: IContext) {
		return await db.pharmacy.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true
			}
		})
	}

	async index(_, args, { db }: IContext): Promise<Array<Pharmacy>> {
		return await db.pharmacy.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<Pharmacy>> {
		return await db.pharmacy.findMany({
			where: {
				status: Status.Active
			},
			include: {
				belonging: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.pharmacy.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true,
				inventory: {
					where: {
						status: Status.Active
					},
					include: {
						medication: true
					}
				}
			}
		})

		return {
			...record,
			inventory: record.inventory.map(inv => ({
				...inv.medication,
			}))
		}
	}

	async stock(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<MedicationStock>> {
		const pharmacy = await db.pharmacy.findUnique({
			where: {
				id: pharmacyId,
				status: Status.Active
			}
		})

		if (pharmacy) {
			const inventory = await db.inventory.groupBy({
				by: 'medicationId',
				where: {
					pharmacyId,
					status: Status.Active,
					medication: {
						status: Status.Active
					}
				},
				_sum: {
					stock: true
				}
			})

			const medications = await db.medication.findMany({
				include: {
					class: true,
					unit: true
				}
			})
			return inventory.map(inv => ({
				total: inv._sum.stock,
				pharmacy,
				medication: medications.find(m => m.id === inv.medicationId)
			}))
		}

		throw `Farmacia "${pharmacy}" no existe o no está activo.`
	}

	async create(_, { data }: { data: IPharmacyCreateArgs }, { db, pubsub, user }: IContext): Promise<Pharmacy> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Pharmacy
		const record = await db.pharmacy.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ pharmacyCreated: record }, { pharmacyUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IPharmacyUpdateArgs }, { db, pubsub, user }: IContext): Promise<Pharmacy> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Pharmacy
		const record = await db.pharmacy.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ pharmacyUpdated: record }, { pharmacyUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Pharmacy> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Pharmacy
		await super.findOneOrFail(db.pharmacy, id)
		const record = await db.pharmacy.update({
			where: { id },
			data: withAuditForDelete(user, {
				inventory: {
					updateMany: {
						where: { pharmacyId: id },
						data: withAuditForDelete(user)
					}
				}
			})
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ pharmacyDeleted: record }, { pharmacyUpserted: record }]
		})
		return record
	}

}
