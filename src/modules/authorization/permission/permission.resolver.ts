
import { Permission } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'


export class PermissionResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Group)
	}

	async index(_, args, { db }: IContext): Promise<Array<Permission>> {
		const records = await db.permission.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		return records
	}

	async active(_, args, { db }: IContext): Promise<Array<Permission>> {
		const records = await db.permission.findMany({
			where: {
				status: Status.Active
			}
		})

		return records
	}

}
