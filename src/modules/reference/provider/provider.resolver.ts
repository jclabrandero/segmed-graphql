
import { Provider } from '@prisma/client'

import { Relation, Resolver } from '../../../support/classes'
import { IContext, IProviderCreateArgs, IProviderUpdateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'


interface IProviderFilterArgs {
	belongingId:	number
	medicalGroupId:	number
}

export class ProviderResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.Provider)
	}

	private static include() {
		return {
			belonging: true,
			medicalGroups: {
				where: {
					status: Status.Active,
					medicalGroup: {
						status: Status.Active
					}
				},
				include: {
					medicalGroup: true,
					specialties: {
						where: {
							status: Status.Active,
							medicalSpecialty: {
								status: Status.Active,
								groups: {
									some: {
										status: Status.Active
									}
								}
							}
						},
						include: {
							medicalSpecialty: true,
							subspecialties: {
								where: {
									status: Status.Active,
									medicalSubspecialty: {
										status: Status.Active,
										subspecialtyOf: {
											some: {
												status: Status.Active
											}
										}
									}
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

	public static format(record) {
		if (!record) return null
		const { medicalGroups, ...provider } = record
		return {
			...provider,
			medicalGroups: medicalGroups.map(um => ({
				...um.medicalGroup,
				specialties: um.specialties.map(em => ({
					...em.medicalSpecialty,
					subspecialties: em.subspecialties.map(sm => {
						return sm.medicalSubspecialty
					})
				}))
			}))
		}
	}

	public static async findOne({ id }: { id: number }, { db }: IContext) {
		const record = await db.provider.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: ProviderResolver.include()
		})

		return ProviderResolver.format(record)
	}

	async index(_, args, { db }: IContext): Promise<Array<Provider>> {
		return await db.provider.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				belonging: true
			}
		})
	}

	async filter(_, { query }: { query: IProviderFilterArgs }, { db }: IContext): Promise<Array<Provider>> {
		const { belongingId, medicalGroupId } = query

		return await db.provider.findMany({
			where: {
				status: Status.Active,
				belongingId,
				medicalGroups: medicalGroupId ? {
					some: {
						medicalGroupId
					}
				} : undefined
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.provider.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: ProviderResolver.include()
		})

		return ProviderResolver.format(record)
	}

	async create(_, { data }: { data: IProviderCreateArgs }, { db, pubsub, user }: IContext): Promise<Provider> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Provider
		const { medicalGroups, ...remaining } = data

		const record = await db.provider.create({
			data: withAuditForCreate(user, {
				...remaining,
				medicalGroups: medicalGroups ? {
					create: medicalGroups.map(({ medicalGroupId, specialties }) => withAuditForCreate(user, {
						medicalGroupId,
						specialties: {
							create: specialties.map(({ medicalSpecialtyId, subspecialties }) => withAuditForCreate(user, {
								medicalSpecialtyId,
								subspecialties: {
									create: subspecialties.map(medicalSubspecialtyId => withAuditForCreate(user, {
										medicalSubspecialtyId
									}))
								}
							}))
						}
					}))
				} : undefined
			})
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ providerCreated: record }, { providerUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IProviderUpdateArgs }, { db, pubsub, user }: IContext): Promise<Provider> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.Provider
		const { medicalGroups, ...remaining } = data

		const specialtiesData = async medicalGroup => {
			const dataset = []
			const dbMG = await db.providerMedicalGroup.findUnique({
				where: { medicalGroupId_providerId: {
					medicalGroupId: medicalGroup.medicalGroupId,
					providerId: id
				}}
			})
			const providerMedicalGroupId = dbMG ? dbMG.id : -1
			for (const specialty of medicalGroup.specialties) {
				const dbSP = await db.providerMedicalSpecialty.findUnique({
					where: {
						medicalSpecialtyId_providerMedicalGroupId: {
							medicalSpecialtyId: specialty.medicalSpecialtyId,
							providerMedicalGroupId
						}
					}
				})
				const providerMedicalSpecialtyId = dbSP ? dbSP.id : -1
				const subspecialties = await Relation.upsert({
					model: db.providerMedicalSubspecialty,
					where: { providerMedicalSpecialtyId },
					dataset: specialty.subspecialties, field: 'medicalSubspecialtyId', user
				})
				dataset.push({
					...specialty,
					subspecialties,
					__update: Boolean(subspecialties.update) || Boolean(subspecialties.create)
				})
			}
			return await Relation.upsert({
				model: db.providerMedicalSpecialty,
				where: { providerMedicalGroupId },
				dataset, field: 'medicalSpecialtyId', user
			})
		}
		const groupsData = async () => {
			const dataset = []
			for (const medicalGroup of medicalGroups) {
				const specialties = await specialtiesData(medicalGroup)
				dataset.push({
					...medicalGroup,
					specialties,
					__update: Boolean(specialties.update) || Boolean(specialties.create)
				})
			}
			return await Relation.upsert({
				model: db.providerMedicalGroup,
				where: { providerId: id },
				dataset, field: 'medicalGroupId', user
			})
		}
		const record = await db.provider.update({
			where: { id },
			data: withAuditForUpdate(user, {
				...remaining,
				medicalGroups: medicalGroups ? await groupsData() : undefined
			})
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ providerUpdated: record }, { providerUpserted: record }]
		})
		return record
	}

}
