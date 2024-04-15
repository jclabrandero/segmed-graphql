
import { Clerk } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IClerkCreateArgs, IClerkUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class ClerkResolver extends Resolver {
	
	constructor() {
		super(SubscriptionEvent.Clerk)
	}

	static format(record) {
		if (!record) return null
		const { offices, medicalOffices, ...clerk } = record
		return {
			...clerk,
			oficinas: offices ? offices.map(of => ({
				...of.office
			})) : undefined,
			medicalOffices: medicalOffices ? medicalOffices.map(mo => ({
				...mo.medicalOffice
			})) : undefined
		}
	}

	static include() {
		return {
			person: true,
			employeeType: true,
			position: true,
			medicalOffices: {
				where: {
					status: Status.Active
				},
				include: {
					medicalOffice: true
				}
			}
		}
	}

	async index(_, args, { db }: IContext): Promise<Array<Clerk>> {
		const total = await db.clerk.count({
			where: {
				NOT: { status: Status.Removed }
			}
		})

		let result = []
		
		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await db.clerk.findMany({
					where: {
						NOT: { status: Status.Removed }
					},
					include: ClerkResolver.include(),
					skip: i,
					take: 1000
				})
			)
		}

		return result.map(fun => ClerkResolver.format(fun))
	}
	
	async active(_, args, { db }: IContext) {
		const total = await db.clerk.count({
			where: {
				status: Status.Active
			}
		})

		let result = []
		
		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await db.clerk.findMany({
					where: {
						status: Status.Active
					},
					include: ClerkResolver.include(),
					skip: i,
					take: 1000
				})
			)
		}

		return result.map(clerk => ClerkResolver.format(clerk))
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Clerk> {
		const record = await db.clerk.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: ClerkResolver.include()
		})

		return ClerkResolver.format(record)
	}

	async create(_, { data }: { data: IClerkCreateArgs }, { db, pubsub, user }: IContext): Promise<Clerk> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Clerk
		const { offices, medicalOffices, ...payload } = data
		const record = await db.clerk.create({
			data: {
				...withAuditForCreate(user, payload),
				// offices: offices ? {
				// 	create: offices.map(officeId => withAuditForCreate(user, { officeId }))
				// } : undefined,
				medicalOffices: medicalOffices ? {
					create: medicalOffices.map(medicalOfficeId => withAuditForCreate(user, { medicalOfficeId }))
				} : undefined,
			}
		})
		console.log(offices)
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ clerkCreated: record }, { clerkUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IClerkUpdateArgs }, { db, pubsub, user }: IContext): Promise<Clerk> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Clerk
		const { offices, medicalOffices, ...payload } = data
		const record = await db.clerk.update({
			where: { id },
			data: {
				...withAuditForUpdate(user, payload),
				medicalOffices: medicalOffices ? await Relation.upsert({
					model: db.clerkMedicalOffice, where: { clerkId: id }, dataset: medicalOffices, field: 'medicalOfficeId', user
				}) : undefined
			}
		})
		console.log(offices)
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clerkUpdated: record }, { clerkUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Clerk> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Clerk
		await super.findOneOrFail(db.clerk, id)
		const record = await db.clerk.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ clerkDeleted: record }, { clerkUpserted: record }]
		})
		return record
	}

}
