
import { Insured, Person } from '@prisma/client'
import { format, getMonth, addYears } from 'date-fns'

import { Resolver } from '../../../support/classes'
import { IContext, IInsuredCreateArgs, IInsuredUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { now, withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class InsuredResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Insured)
	}

	private static include() {
		return {
			person: true,
			holderInsured: true,
			insuredType: true,
			dependents: true,
			belonging: true
		}
	}

	private static async findMany(model, where) {
		const total = await model.count({ where })

		let result = []

		for (let i = 0; i < total; i += 1000) {
			result = result.concat(
				await model.findMany({
					where,
					include: InsuredResolver.include(),
					skip: i,
					take: 1000
				})
			)
		}

		return result
	}

	public static async findOne({ id }: { id: number }, { db }: IContext) {
		return await db.insured.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: InsuredResolver.include()
		})
	}

	async index(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, { NOT: { status: Status.Removed } })
	}

	async active(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, { status: Status.Active })
	}

	async activeHolders(_, args, { db }: IContext): Promise<Array<Insured>> {
		return await InsuredResolver.findMany(db.insured, {
			status: Status.Active,
			insuredType: {
				withDependents: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Insured> {
		return await db.insured.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: InsuredResolver.include()
		})
	}

	async create(_, { data }: { data: IInsuredCreateArgs }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Insured
		const { tradeUnion, inletDate, ...remaining } = data

		const person = await db.person.findUnique({
			where: { id: data.personId, NOT: { status: Status.Removed } }
		})
		if (!person) throw new Error('Persona no encontrada.')

		const insuredType = await db.insuredType.findUnique({
			where: { id: data.insuredTypeId, NOT: { status: Status.Removed } }
		})
		if (!insuredType) throw new Error('Tipo de beneficiario no encontrado.')

		const code = InsuredResolver.genCode(person, insuredType.codeFormat)
		const outletDate = InsuredResolver.genOutletDate(person, insuredType.outletAge)
		const record = await db.insured.create({
			data: withAuditForCreate(user, {
				...remaining,
				code,
				inletDate: inletDate || now().utc,
				outletDate,
				tradeUnion: Boolean(tradeUnion)
			})
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ insuredCreated: record }, { insuredUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IInsuredUpdateArgs }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Insured
		const record = await db.insured.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ insuredUpdated: record }, { insuredUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Insured> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Insured
		await super.findOneOrFail(db.insured, id)
		const record = await db.insured.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ insuredDeleted: record }, { insuredUpserted: record }]
		})
		return record
	}

	private static genCode(person: Person, codeFormat: string): string {
		const { firstName, lastName } = person
		const lastNames = lastName.split(' ')
		const isMale = (person.sex === 'M') || (person.sex == 'Masculino') || (person.sex == 'Hombre') || (person.sex == 'MACULINO') || (person.sex == 'Varon') || (person.sex == 'VARON')
		const aa = format(person.birthDate, 'yy')
		const mm = format(person.birthDate, 'MM')
		const ff = (getMonth(person.birthDate) + 51).toString()
		const dd = format(person.birthDate, 'dd')
		const xxx = lastNames[1] ? `${lastNames[0][0]}${lastNames[1][0]}${firstName[0]}` : `${lastNames[0][0]}${firstName[0]}${firstName[1]}`
		const code = codeFormat
			.replace('AA', aa)
			.replace('MM', isMale ? mm : ff)
			.replace('DD', dd)
			.replace('XXX', xxx.toUpperCase())
		return code
	}

	private static genOutletDate(person: Person, outletAge?: number): Date | undefined {
		return outletAge ? addYears(person.birthDate, outletAge) : undefined
	}
}
