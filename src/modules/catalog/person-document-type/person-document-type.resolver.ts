
import { PersonDocumentType } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IPersonDocumentTypeCreateArgs, IPersonDocumentTypeUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class PersonDocumentTypeResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.PersonDocumentType)
	}

	async index(_, args, { db }: IContext): Promise<Array<PersonDocumentType>> {
		return await db.personDocumentType.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<PersonDocumentType>> {
		return await db.personDocumentType.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<PersonDocumentType> {
		return await db.personDocumentType.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IPersonDocumentTypeCreateArgs }, { db, pubsub, user }: IContext): Promise<PersonDocumentType> {
		const { CREATED, UPSERTED } = SubscriptionEvent.PersonDocumentType
		const record = await db.personDocumentType.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ personDocumentTypeCreated: record }, { personDocumentTypeUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IPersonDocumentTypeUpdateArgs }, { db, pubsub, user }: IContext): Promise<PersonDocumentType> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.PersonDocumentType
		const record = await db.personDocumentType.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ personDocumentTypeUpdated: record }, { personDocumentTypeUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<PersonDocumentType> {
		const { DELETED, UPSERTED } = SubscriptionEvent.PersonDocumentType
		const found = await super.findOneOrFail(db.personDocumentType, id)
		const people = await db.person.findMany({ where: { personDocumentTypeId: id, NOT: { status: Status.Removed } } })
		if (people.length) throw 'Existen personas que dependen de éste registro.'

		const record = await db.personDocumentType.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ personDocumentTypeDeleted: record }, { personDocumentTypeUpserted: record }]
		})
		return record
	}
	
}
