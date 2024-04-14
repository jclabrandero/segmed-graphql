
import { MedicalOffice } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IMedicalOfficeCreateArgs, IMedicalOfficeUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class MedicalOfficeResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.MedicalOffice)
	}

	async index(_, args, { db }: IContext): Promise<Array<MedicalOffice>> {
		return await db.medicalOffice.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<MedicalOffice>> {
		return await db.medicalOffice.findMany({
			where: {
				status: Status.Active
			},
			include: {
				belonging: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<MedicalOffice> {
		return await db.medicalOffice.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true
			}
		})
	}

	async create(_, { data }: { data: IMedicalOfficeCreateArgs }, { db, pubsub, user }: IContext): Promise<MedicalOffice> {
		const { CREATED, UPSERTED } = SubscriptionEvent.MedicalOffice
		const record = await db.medicalOffice.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ medicalOfficeCreated: record }, { medicalOfficeUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IMedicalOfficeUpdateArgs }, { db, pubsub, user }: IContext): Promise<MedicalOffice> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.MedicalOffice
		const record = await db.medicalOffice.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ medicalOfficeUpdated: record }, { medicalOfficeUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<MedicalOffice> {
		const { DELETED, UPSERTED } = SubscriptionEvent.MedicalOffice
		const found = await super.findOneOrFail(db.medicalOffice, id)
		const record = await db.medicalOffice.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ medicalOfficeDeleted: record }, { medicalOfficeUpserted: record }]
		})
		return record
	}

}
