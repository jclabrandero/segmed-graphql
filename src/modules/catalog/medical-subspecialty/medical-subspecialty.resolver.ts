
import { MedicalSubspecialty } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IMedicalSubspecialtyCreateArgs, IMedicalSubspecialtyUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class MedicalSubspecialtyResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.MedicalSubspecialty)
	}

	async index(_, args, { db }: IContext): Promise<Array<MedicalSubspecialty>> {
		return await db.medicalSubspecialty.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<MedicalSubspecialty>> {
		return await db.medicalSubspecialty.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<MedicalSubspecialty> {
		return await db.medicalSubspecialty.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IMedicalSubspecialtyCreateArgs }, { db, pubsub, user }: IContext): Promise<MedicalSubspecialty> {
		const { CREATED, UPSERTED } = SubscriptionEvent.MedicalSubspecialty
		const record = await db.medicalSubspecialty.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ medicalSubspecialtyCreated: record }, { medicalSubspecialtyUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IMedicalSubspecialtyUpdateArgs }, { db, pubsub, user }: IContext): Promise<MedicalSubspecialty> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.MedicalSubspecialty
		const record = await db.medicalSubspecialty.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ medicalSubspecialtyUpdated: record }, { medicalSubspecialtyUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<MedicalSubspecialty> {
		const { DELETED, UPSERTED } = SubscriptionEvent.MedicalSubspecialty
		const found = await super.findOneOrFail(db.medicalSubspecialty, id)
		const record = await db.medicalSubspecialty.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ medicalSubspecialtyDeleted: record }, { medicalSubspecialtyUpserted: record }]
		})
		return record
	}

}
