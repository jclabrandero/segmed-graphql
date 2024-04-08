
import { EmployeePosition } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IEmployeePositionCreateArgs, IEmployeePositionUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { auditLog, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class EmployeePositionResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.EmployeePosition)
	}

	async index(_, args, { db }: IContext): Promise<Array<EmployeePosition>> {
		return await db.employeePosition.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<EmployeePosition>> {
		return await db.employeePosition.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<EmployeePosition> {
		return await db.employeePosition.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IEmployeePositionCreateArgs }, { db, pubsub, user }: IContext): Promise<EmployeePosition> {
		const { CREATED, UPSERTED } = SubscriptionEvent.EmployeePosition
		const record = await db.employeePosition.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ employeePositionCreated: record }, { employeePositionUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IEmployeePositionUpdateArgs }, { db, pubsub, user }: IContext): Promise<EmployeePosition> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.EmployeePosition
		const found = await super.findOneOrFail(db.employeePosition, id)
		const record = await db.employeePosition.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		await auditLog(db, 'EmployeePosition', found, record, data)
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ employeePositionUpdated: record }, { employeePositionUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<EmployeePosition> {
		const { DELETED, UPSERTED } = SubscriptionEvent.EmployeePosition
		const found = await super.findOneOrFail(db.employeePosition, id)
		const record = await db.employeePosition.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ employeePositionDeleted: record }, { employeePositionUpserted: record }]
		})
		return record
	}

}
