
import { Inventory } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext } from '../../../support/types'

export class InventoryResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Pharmacy)
	}

	async index(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<Inventory>> {
		return await db.inventory.findMany({
			where: {
				pharmacyId,
				NOT: { status: Status.Removed }
			},
			include: {
				pharmacy: true,
				medication: {
					include: {
						unit: true
					}
				}
			}
		})
	}
}
