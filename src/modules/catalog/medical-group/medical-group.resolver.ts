
import { MedicalGroup } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IMedicalGroupCreateArgs, IMedicalGroupUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'
import { MedicalSpecialtyResolver } from '../medical-specialty/medical-specialty.resolver'


export class MedicalGroupResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.MedicalGroup)
	}

	static reduce(specialties) {
		return specialties ? specialties.reduce(
			(result, { medicalSpecialty }) =>
				medicalSpecialty.status == Status.Active
					? [ ...result, {
						...medicalSpecialty,
						subspecialties: MedicalSpecialtyResolver.reduce(medicalSpecialty.subspecialties)
					}]
					: result,
			[]) : undefined
	}

	static format(record) {
		if (!record) return null
		const { specialties, ...group } = record
		return {
			...group,
			specialties: MedicalGroupResolver.reduce(specialties)
		}
	}

	private static include() {
		return {
			specialties: {
				where: {
					status: Status.Active
				},
				include: {
					medicalSpecialty: {
						include: {
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
				}
			}
		}
	}

	public static async findOneWithIndexedSpecialties({ id }: { id: number }, { db }: IContext) {
		const { specialties, ...group } = await db.medicalGroup.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: MedicalGroupResolver.include()
		})

		return {
			...group,
			specialties: specialties.reduce((indexedSpecialties, { medicalSpecialty }) => {
				const { id: specialtyId, subspecialties, ...specialty } = medicalSpecialty
				indexedSpecialties[specialtyId] = {
					...specialty,
					subspecialties: subspecialties.reduce((indexedSubspecialties, { medicalSubspecialty }) => {
						const { id: subspecialtyId, ...subspecialty } = medicalSubspecialty
						indexedSubspecialties[subspecialtyId] = subspecialty
						return indexedSubspecialties
					}, {})
				}
				return indexedSpecialties
			}, {})
		}
	}

	async index(_, args, { db }: IContext): Promise<Array<MedicalGroup>> {
		const records = await db.medicalGroup.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: MedicalGroupResolver.include()
		})

		return records.map(MedicalGroupResolver.format)
	}

	async active(_, args, { db }: IContext): Promise<Array<MedicalGroup>> {
		const records = await db.medicalGroup.findMany({
			where: {
				status: Status.Active
			},
			include: MedicalGroupResolver.include()
		})

		return records.map(MedicalGroupResolver.format)
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<MedicalGroup> {
		const record = await db.medicalGroup.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: MedicalGroupResolver.include()
		})

		return MedicalGroupResolver.format(record)
	}

	async create(_, { data }: { data: IMedicalGroupCreateArgs }, { db, pubsub, user }: IContext): Promise<MedicalGroup> {
		const { CREATED, UPSERTED } = SubscriptionEvent.MedicalGroup
		const { specialties, ...payload } = data
		const record = await db.medicalGroup.create({
			data: {
				...withAuditForCreate(user, payload),
				specialties: specialties ? {
					create: specialties.map(medicalSpecialtyId => withAuditForCreate(user, { medicalSpecialtyId }))
				}: undefined
			}
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ medicalGroupCreated: record }, { medicalGroupUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IMedicalGroupUpdateArgs }, { db, pubsub, user }: IContext): Promise<MedicalGroup> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.MedicalGroup
		const { specialties, ...payload } = data
		const record = await db.medicalGroup.update({
			where: { id },
			data: {
				...withAuditForUpdate(user, payload),
				specialties: specialties ? await Relation.upsert({
					model: db.medicalGroupSpecialty, where: { medicalGroupId: id }, dataset: specialties, field: 'medicalSpecialtyId', user
				}) : undefined
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ medicalGroupUpdated: record }, { medicalGroupUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<MedicalGroup> {
		const { DELETED, UPSERTED } = SubscriptionEvent.MedicalGroup
		const found = await super.findOneOrFail(db.medicalGroup, id)
		const providers = await db.providerMedicalGroup.findMany({ where: { providerId: id, NOT: { status: Status.Removed } } })
		if (providers.length) throw 'Existen proveedores que dependen de éste registro.'

		const record = await db.medicalGroup.update({
			where: { id },
			data: withAuditForDelete(user, found, 'name')
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ medicalGroupDeleted: record }, { medicalGroupUpserted: record }]
		})
		return record
	}

}
