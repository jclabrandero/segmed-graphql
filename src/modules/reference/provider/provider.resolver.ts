
import { Provider } from '@prisma/client'

import { Resolver } from '../../../support/classes'
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
					status: Status.Active
				},
				include: {
					medicalGroup: true,
					specialties: {
						where: {
							status: Status.Active
						},
						include: {
							medicalSpecialty: true,
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

	public static format(record) {
		if (!record) return null
		const { medicalGroups, ...provider } = record
		return {
			...provider,
			medicalGroups: medicalGroups.map(um => ({
				...um.medicalGroup,
				specialties: um.specialties.map(em => ({
					...em.medicalSpecialty,
					subspecialties: em.subspecialties.map(sm => sm.medicalSubspecialty)
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
					every: {
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
			data: {
				...withAuditForCreate(user, remaining),
				medicalGroups: medicalGroups ? {
					create: medicalGroups.map(({ medicalGroupId, specialties }) => ({
						...withAuditForCreate(user, { medicalGroupId }),
						specialties: {
							create: specialties.map(({ medicalSpecialtyId, subspecialties }) => ({
								...withAuditForCreate(user, { medicalSpecialtyId }),
								subspecialties: {
									create: subspecialties.map(medicalSubspecialtyId => 
										withAuditForCreate(user, { medicalSubspecialtyId })
									)
								}
							}))
						}
					}))
				} : undefined
			}
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
		const record = await db.provider.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ providerUpdated: record }, { providerUpserted: record }]
		})
		return record
	}

}
