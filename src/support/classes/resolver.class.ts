
import { PubSub } from 'graphql-subscriptions'

import { Status } from '../constants'
import { IEvent } from '../types'


export class Resolver {

	constructor(public event: IEvent) {}

	public created({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.CREATED)
		}
	}

	public updated({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPDATED)
		}
	}

	public deleted({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.DELETED)
		}
	}

	public upserted({ pubsub }: { pubsub: PubSub }) {
		return {
			subscribe: () => pubsub.asyncIterator(this.event.UPSERTED)
		}
	}

	public publish({ pubsub, events, dataset }: { pubsub: PubSub, events: Array<string>, dataset: Array<object> }) {
		for (let index = 0; index < events.length; index++) {
			pubsub.publish(events[index], dataset[index])
		}
	}

	public async findOneOrFail(model, id: number) {
		const found = await model.findUnique({
			where: { id, NOT: { status: Status.Removed } }
		})

		if (!found) throw 'No se encontró el registro'

		return found
	}
}
