
import { Group } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IGroupCreateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class GroupResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Group)
	}

	async index(_, args, { db }: IContext): Promise<Array<Group>> {
		const groups = await db.group.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		return groups
	}

	async active(_, args, { db }: IContext): Promise<Array<Group>> {
		const groups = await db.group.findMany({
			where: {
				status: Status.Active
			}
		})

		return groups
	}

	async create(_, { data }: { data: IGroupCreateArgs }, { db, pubsub }: IContext ): Promise<Group> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Group
		const record = await db.group.create({
			data
		})

		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ groupCreated: record }, { groupUpserted: record }]
		})
		return record
	}

}
