
import { Group } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IGroupCreateArgs } from '../../../support/types'
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

}
