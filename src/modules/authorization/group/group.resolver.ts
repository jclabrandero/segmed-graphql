
import { Group } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IGroupCreateArgs, IGroupUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class GroupResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Group)
	}

	static format(record) {
		if (!record) return null
		const { permissions, ...group } = record
		return {
			...group,
			permissions: permissions ? permissions.map(relation => ({
				...relation.permission
			})) : undefined
		}
	}

	async index(_, args, { db }: IContext): Promise<Array<Group>> {
		const records = await db.group.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
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
		})

		return records.map(record => GroupResolver.format(record))
	}

	async active(_, args, { db }: IContext): Promise<Array<Group>> {
		const records = await db.group.findMany({
			where: {
				status: Status.Active
			},
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
		})

		return records.map(record => GroupResolver.format(record))
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Group> {
		const record = await db.group.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
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
		})

		return GroupResolver.format(record)
	}

	async create(_, { data }: { data: IGroupCreateArgs }, { db, pubsub }: IContext ): Promise<Group> {
		const { permissions, ...payload } = data
		const { CREATED, UPSERTED } = SubscriptionEvent.Group
		
		const record = await db.group.create({
			data: {
				...payload,
				permissions: permissions ? {
					create: permissions.map(permissionId => ({ permissionId }))
				} : undefined,
			}
		})

		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ groupCreated: record }, { groupUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IGroupUpdateArgs }, { db, pubsub }: IContext): Promise<Group> {
		const { permissions, ...payload } = data
		const { UPDATED, UPSERTED } = SubscriptionEvent.Group

		const record = await db.group.update({
			where: {
				id
			},
			data: {
				...payload,
				permissions: permissions ? await Relation.upsert({
					model: db.groupPermission, where: { groupId: id }, dataset: permissions, field: 'permissionId'
				}) : undefined
			}
		})

		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ groupUpdated: record }, { groupUpserted: record }]
		})
		return record
	}

}
