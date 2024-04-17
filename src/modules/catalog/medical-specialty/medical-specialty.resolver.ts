
import { MedicalSpecialty } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IMedicalSpecialtyCreateArgs, IMedicalSpecialtyUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'


export class MedicalSpecialtyResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.MedicalSpecialty)
	}

	static format(record) {
		if (!record) return null
		const { subspecialties, ...medicalSpecialty } = record
		return {
			...medicalSpecialty,
			subspecialties: subspecialties ? subspecialties.map(sm => ({
				...sm.medicalSubspecialty
			})) : undefined
		}
	}

	private static include() {
		return {
			subspecialties: {
				where: {
					status: Status.Active
				},
				include: {
					medicalSubspecialty: true
				}
			}
		}
	}

	async index(_, args, { db }: IContext): Promise<Array<MedicalSpecialty>> {
		const records = await db.medicalSpecialty.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: MedicalSpecialtyResolver.include()
		})

		return records.map(MedicalSpecialtyResolver.format)
	}

	async active(_, args, { db }: IContext): Promise<Array<MedicalSpecialty>> {
		const records = await db.medicalSpecialty.findMany({
			where: {
				status: Status.Active
			},
			include: MedicalSpecialtyResolver.include()
		})

		return records.map(MedicalSpecialtyResolver.format)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<MedicalSpecialty> {
		const record = await db.medicalSpecialty.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: MedicalSpecialtyResolver.include()
		})

		return MedicalSpecialtyResolver.format(record)
	}

	async create(_, { data }: { data: IMedicalSpecialtyCreateArgs }, { db, pubsub, user }: IContext): Promise<MedicalSpecialty> {
		const { CREATED, UPSERTED } = SubscriptionEvent.MedicalSpecialty
		const { subspecialties, ...payload } = data
		const record = await db.medicalSpecialty.create({
			data: {
				...withAuditForCreate(user, payload),
				subspecialties: subspecialties ? {
					create: subspecialties.map(medicalSubspecialtyId => withAuditForCreate(user, { medicalSubspecialtyId }))
				}: undefined
			}
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ medicalSpecialtyCreated: record }, { medicalSpecialtyUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IMedicalSpecialtyUpdateArgs }, { db, pubsub, user }: IContext): Promise<MedicalSpecialty> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.MedicalSpecialty
		const { subspecialties, ...payload } = data
		const record = await db.medicalSpecialty.update({
			where: { id },
			data: {
				...withAuditForUpdate(user, payload),
				subspecialties: subspecialties ? await Relation.upsert({
					model: db.medicalSpecialtySubspecialty, where: { medicalSpecialtyId: id }, dataset: subspecialties, field: 'medicalSubspecialtyId', user
				}) : undefined
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ medicalSpecialtyUpdated: record }, { medicalSpecialtyUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<MedicalSpecialty> {
		const { DELETED, UPSERTED } = SubscriptionEvent.MedicalSpecialty
		await super.findOneOrFail(db.medicalSpecialty, id)
		const record = await db.medicalSpecialty.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ medicalSpecialtyDeleted: record }, { medicalSpecialtyUpserted: record }]
		})
		return record
	}

}
