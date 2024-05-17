
import { DrugUnit } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IDrugUnitCreateArgs, IDrugUnitUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class DrugUnitResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.DrugUnit)
	}

	async index(_, args, { db }: IContext): Promise<Array<DrugUnit>> {
		return await db.drugUnit.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<DrugUnit>> {
		return await db.drugUnit.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<DrugUnit> {
		return await db.drugUnit.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IDrugUnitCreateArgs }, { db, pubsub, user }: IContext): Promise<DrugUnit> {
		const { CREATED, UPSERTED } = SubscriptionEvent.DrugUnit
		const record = await db.drugUnit.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ drugUnitCreated: record }, { drugUnitUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IDrugUnitUpdateArgs }, { db, pubsub, user }: IContext): Promise<DrugUnit> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.DrugUnit
		const record = await db.drugUnit.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ drugUnitUpdated: record }, { drugUnitUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<DrugUnit> {
		const { DELETED, UPSERTED } = SubscriptionEvent.DrugUnit
		const found = await super.findOneOrFail(db.drugUnit, id)
		const medications = await db.medication.findMany({ where: { unitId: id, NOT: { status: Status.Removed } } })
		if (medications.length) throw 'Existen medicamentos que dependen de éste registro.'

		const record = await db.drugUnit.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ drugUnitDeleted: record }, { drugUnitUpserted: record }]
		})
		return record
	}

}
