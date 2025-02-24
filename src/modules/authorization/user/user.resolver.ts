
import { User } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IUserCreateArgs, IUserUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'

import { Auth } from '../../../support/classes'
import { ClerkResolver } from '../../folk'


export class UserResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.User)
	}

	static format(record) {
		if (!record) return null
		const { groups, clerkUser, ...user } = record
		const extend = groups ? {
			groups: groups.map(relation => ({
				...relation.group
			})),
			permissions: groups.reduce(
				(accumulator, { group }) => [ ...accumulator, ...group.permissions.map(({ permission }) => permission.name) ].filter((value, index, array) => array.indexOf(value) === index),
				[]
			),
			clerk: clerkUser ? ClerkResolver.format(clerkUser.clerk) : undefined
		} : {
			groups: [],
			permissions: []
		}

		return {
			...user,
			...extend,
			isAuthorized: !!extend.permissions.length
		}
	}

	static includeAll() {
		return {
			groups: {
				where: {
					status: Status.Active
				},
				include: {
					group: {
						include: {
							permissions: {
								where: {
									status: Status.Active
								},
								include: {
									permission: true
								}
							}
						}
					}
				}
			},
			clerkUser: {
				where: {
					status: Status.Active
				},
				include: {
					clerk: {
						include: {
							medicalOffices: {
								where: {
									status: Status.Active
								},
								include: {
									medicalOffice: true
								}
							},
							person: true
						}
					}
				}
			}
		}
	}

	async index(_, args, { db }: IContext): Promise<User[]> {
		const records = await db.user.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: UserResolver.includeAll()
		})

		return records.map(record => UserResolver.format(record))
	}

	async current(_, args: { sessionId: number }, context: IContext): Promise<User> {
		if (context.session.id !== args.sessionId) throw 'El portador no es válido.'

		const record = await context.db.user.findUnique({
			where: {
				id: context.user.id
			},
			include: UserResolver.includeAll()
		})

		return UserResolver.format(record)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<User> {
		const record = await db.user.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: UserResolver.includeAll()
		})

		return UserResolver.format(record)
	}

	async findOneByUserName(_, { userName }: { userName: string }, { db }: IContext): Promise<User> {
		const record = await db.user.findUnique({
			where: {
				userName,
				NOT: { status: Status.Removed }
			},
			include: UserResolver.includeAll()
		})

		return UserResolver.format(record)
	}

	async findOneSelf(_, { userName }: { userName: string }, { db, user }: IContext): Promise<User> {
		if (userName !== user.userName) throw 'Lectura incorrecta de datos de usuario.'

		const record = await db.user.findUnique({
			where: {
				userName,
				NOT: { status: Status.Removed }
			},
			include: UserResolver.includeAll()
		})

		return UserResolver.format(record)
	}

	async usersWithClinicCares(_, args, { db }: IContext): Promise<User[]> {
		const records = await db.user.findMany({
			where: {
				createdClinicCares: {
					some: {
						NOT: { status: Status.Removed }
					}
				}
			}
		})

		return records.map(record => UserResolver.format(record))
	}

	async create(_, args: { data: IUserCreateArgs }, { db, pubsub, user }: IContext): Promise<User> {
		const { groups, password, confirmPassword, clerkId, ...payload } = args.data
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
					create: groups.map(groupId => withAuditForCreate(user, { groupId }))
				} : undefined,
				passwords: encrypted ? {
					create: [{ encrypted }]
				} : undefined,
				clerkUser: clerkId ? {
					create: withAuditForCreate(user, { clerkId })
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

	async update(_, { id, data }: { id: number, data: IUserUpdateArgs }, { db, pubsub, user }: IContext): Promise<User> {
		const { groups, password, confirmPassword, clerkId, ...payload } = data
		const { UPDATED, UPSERTED } = SubscriptionEvent.User
		const found = await super.findOneOrFail(db.user, id)
		let encrypted: string
		let clerkUser = undefined

		if (password) {
			if (password !== confirmPassword) throw 'La contraseña de confirmación no coincide.'
			encrypted = await Auth.hash(password)
		}
		if (clerkId) {
			const currentClerkUser = await db.clerkUser.findFirst({ where: { userId: found.id } })
			clerkUser = currentClerkUser
				? {
					update: {
						where: { userId: found.id },
						data: withAuditForUpdate(user, { clerkId })
					}
				}
				: {
					create: withAuditForCreate(user, { clerkId })
				}
		}

		const record = await db.user.update({
			where: { id },
			data: {
				...payload,
				groups: groups ? await Relation.upsert({
					model: db.userGroup, where: { userId: id }, dataset: groups, field: 'groupId', user
				}) : undefined,
				passwords: encrypted ? {
					updateMany: {
						where: { userName: found.userName },
						data: { status: Status.Idle }
					},
					create: [{ encrypted }]
				} : undefined,
				clerkUser
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
