
import { User } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IUserCreateArgs, IUserUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'

import { Auth } from '../../../support/classes'


export class UserResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.User)
	}

	static format(record) {
		if (!record) return null
		const { groups, ...user } = record
		return {
			...user,
			groups: groups ? groups.map(relation => ({
				...relation.group
			})) : undefined
		}
	}

	async index(_, args, { db }: IContext): Promise<User[]> {
		const records = await db.user.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				groups: {
					where: {
						status: Status.Active
					},
					include: {
						group: true
					}
				}
			}
		})

		return records.map(record => UserResolver.format(record))
	}

	async current(_, args: { sessionId: number }, context: IContext): Promise<User> {
		if (context.session.id !== args.sessionId) throw 'El portador no es válido.'
		return context.user
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<User> {
		const record = await db.user.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				groups: {
					where: {
						status: Status.Active
					},
					include: {
						group: true
					}
				}
			}
		})

		return UserResolver.format(record)
	}

	async create(_, args: { data: IUserCreateArgs }, { db, pubsub }: IContext): Promise<User> {
		const { groups, password, confirmPassword, ...payload } = args.data
		const { CREATED, UPSERTED } = SubscriptionEvent.User
		let encrypted: string

		if (password) {
			if (password !== confirmPassword) throw 'La contraseña de confirmación no coincide.'
			encrypted = await Auth.hash(password)
		}

		const record = await db.user.create({
			data: {
				...payload,
				groups: groups ? {
					create: groups.map(groupId => ({ groupId }))
				} : undefined,
				passwords: encrypted ? {
					create: [{ encrypted }]
				} : undefined
			}
		})

		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ userCreated: record }, { userUpserted: record }]
		})

		return record
	}

	async update(_, { id, data }: { id: number, data: IUserUpdateArgs }, { db, pubsub }: IContext): Promise<User> {
		const { groups, password, confirmPassword, ...payload } = data
		const { UPDATED, UPSERTED } = SubscriptionEvent.User

		if (password) {
			if (password !== confirmPassword) throw 'La contraseña de confirmación no coincide.'
			await Auth.hash(password)
		}

		const record = await db.user.update({
			where: {
				id
			},
			data: {
				...payload,
				groups: groups ? await Relation.upsert({
					model: db.userGroup, where: { userId: id }, dataset: groups, field: 'groupId'
				}) : undefined
			}
		})

		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ userUpdated: record }, { userUpserted: record }]
		})

		return record
	}

}
