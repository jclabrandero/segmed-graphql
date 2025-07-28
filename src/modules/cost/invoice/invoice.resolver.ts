import { InterclinicalCost } from '@prisma/client'
import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext } from '../../../support/types'
import { InterclinicalCostCreateArgs } from '../../../support/types/cost.type'
import { withAuditForCreate } from '../../../support/functions'

export class InterclinicalCostResolver extends Resolver {	
	// Resolver methods for Invoice-related queries and mutations
	constructor() {
		super(SubscriptionEvent.InterclinicalCost)
	}
	async index(_, {}, { db }: IContext): Promise<Array<InterclinicalCost>> {
		return await db.interclinicalCost.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				provider: true
			}
		})
	}

	async create(_, { data }: { data: InterclinicalCostCreateArgs }, { db, pubsub, user }: IContext): Promise<InterclinicalCost> {
		const { CREATED, UPSERTED } = SubscriptionEvent.InterclinicalCost
		const record = await db.interclinicalCost.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ interclinicalCostCreated: record }, { interclinicalCostUpserted: record }]
		})
		return record
	}	
}