
import { User } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IUserCreateArgs, IUserUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'

import { Auth } from '../../../support/classes'


export class UserResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.User)
	}

	async index(_, args, { db }: IContext): Promise<User[]> {
		const records = await db.user.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		return records
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
			}
		})

		return record
	}

	async create(_, args: { data: IUserCreateArgs }, { db, pubsub }: IContext): Promise<User> {
		const { password, confirmPassword, ...payload } = args.data
		const { CREATED, UPSERTED } = SubscriptionEvent.User
		let encrypted: string

		if (password) {
			if (password !== confirmPassword) throw 'La contraseña de confirmación no coincide.'
			encrypted = await Auth.hash(password)
		}

		const record = await db.user.create({
			data: {
				...payload,
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
		const { password, confirmPassword, ...payload } = data
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
