
import { EmployeeType } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IEmployeeTypeCreateArgs, IEmployeeTypeUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { auditLog, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class EmployeeTypeResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.EmployeeType)
	}

	async index(_, args, { db }: IContext): Promise<Array<EmployeeType>> {
		return await db.employeeType.findMany({
			where: {
				NOT: { status: Status.Removed }
			}
		})
	}

	async active(_, args, { db }: IContext): Promise<Array<EmployeeType>> {
		return await db.employeeType.findMany({
			where: {
				status: Status.Active
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<EmployeeType> {
		return await db.employeeType.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			}
		})
	}

	async create(_, { data }: { data: IEmployeeTypeCreateArgs }, { db, pubsub, user }: IContext): Promise<EmployeeType> {
		const { CREATED, UPSERTED } = SubscriptionEvent.EmployeeType
		const record = await db.employeeType.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ employeeTypeCreated: record }, { employeeTypeUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IEmployeeTypeUpdateArgs }, { db, pubsub, user }: IContext): Promise<EmployeeType> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.EmployeeType
		const found = await super.findOneOrFail(db.employeeType, id)
		const record = await db.employeeType.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		await auditLog(db, 'EmployeeType', found, record, data)
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ employeeTypeUpdated: record }, { employeeTypeUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<EmployeeType> {
		const { DELETED, UPSERTED } = SubscriptionEvent.EmployeeType
		const found = await super.findOneOrFail(db.employeeType, id)
		const record = await db.employeeType.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ employeeTypeDeleted: record }, { employeeTypeUpserted: record }]
		})
		return record
	}

}
