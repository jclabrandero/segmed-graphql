
import { Person } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IPersonCreateArgs, IPersonUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class PersonResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Person)
	}

	async index(_, args, { db }: IContext): Promise<Array<Person>> {
		const total = await db.person.count({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		let result = []
		
		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await db.person.findMany({
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						personDocumentType: true
					},
					skip: i,
					take: 1000
				})
			)
		}

		return result
	}

	async active(_, args, { db }: IContext): Promise<Array<Person>> {
		const total = await db.person.count({
			where: {
				status: Status.Active
			}
		})

		let result = []
		
		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await db.person.findMany({
					where: {
						status: Status.Active
					},
					include: {
						personDocumentType: true
					},
					skip: i,
					take: 1000
				})
			)
		}

		return result
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Person> {
		return await db.person.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				personDocumentType: true
			},
		})
	}

	async create(_, { data }: { data: IPersonCreateArgs }, { db, pubsub }: IContext): Promise<Person> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Person
		const record = await db.person.create({
			data
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ personCreated: record }, { personUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IPersonUpdateArgs }, { db, pubsub }: IContext): Promise<Person> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Person
		const record = await db.person.update({
			where: { id },
			data
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ personUpdated: record }, { personUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub }: IContext): Promise<Person> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Person

		const record = await db.person.update({
			where: { id },
			data: { status: Status.Removed }
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ personDeleted: record }, { personUpserted: record }]
		})
		return record
	}

}
