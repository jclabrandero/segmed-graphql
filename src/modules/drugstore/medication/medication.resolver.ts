
import { Medication } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IMedicationCreateArgs, IMedicationUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class MedicationResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Medication)
	}

	async index(_, args, { db }: IContext): Promise<Array<Medication>> {
		return await db.medication.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				class: true,
				unit: true
			}
		})
	}

	async liname(_, args, { db }: IContext): Promise<Array<Medication>> {
		return await db.medication.findMany({
			where: {
				status: Status.Active,
				liname: true
			},
			include: {
				class: true,
				unit: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Medication> {
		return await db.medication.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				class: true,
				unit: true
			}
		})
	}

	async create(_, { data }: { data: IMedicationCreateArgs }, { db, pubsub, user }: IContext): Promise<Medication> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Medication
		const { liname, ...remaining } = data
		const record = await db.medication.create({
			data: {
				...withAuditForCreate(user, remaining),
				liname: Boolean(liname)
			}
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ medicationCreated: record }, { medicationUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IMedicationUpdateArgs }, { db, pubsub, user }: IContext): Promise<Medication> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Medication
		const record = await db.medication.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ medicationUpdated: record }, { medicationUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Medication> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Medication
		await super.findOneOrFail(db.medication, id)
		const record = await db.medication.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ medicationDeleted: record }, { medicationUpserted: record }]
		})
		return record
	}

}
