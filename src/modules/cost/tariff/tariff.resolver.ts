import { Tariff } from '@prisma/client'
import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext } from '../../../support/types'
import { TariffCreateArgs } from '../../../support/types/cost.type'
import { withAuditForCreate } from '../../../support/functions'

export class TariffResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Tariff)
	}

	async index(_, { agreementId }: { agreementId: number }, { db }: IContext): Promise<Array<Tariff>> {
		return await db.tariff.findMany({
			where: {
				agreementId,
				NOT: { status: Status.Removed }
			},
			include: {
				agreement: true,
				providerMedicalSpecialty: {
					include: {
						medicalSpecialty: true // <-- necesario
					}
				},
				providerMedicalSubspecialty: {
					include: {
						medicalSubspecialty: true // <-- también necesario si existe
					}
				}
			}
		})
	}

	
	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Tariff> {
		const record = await db.tariff.findUnique({
			where: { id },
			include: {
				agreement: true,
				providerMedicalSpecialty: true,
				providerMedicalSubspecialty: true
			}
		})
		if (!record) throw new Error('Tarifa no encontrada.')
		return record
	}

	async create(_, { data }: {data: TariffCreateArgs}, { db, pubsub, user }: IContext): Promise<Tariff> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Tariff
				
		const record = await db.tariff.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ tariffCreated: record }, { tariffUpserted: record }]
		})
		return record
	}

	// async create(_, { data }: { data: TariffCreateArgs }, { db, pubsub, user }: IContext): Promise<Tariff> {
	// 	const { CREATED, UPSERTED } = SubscriptionEvent.Tariff
	// 	const { agreementId, providerMedicalSpecialtyId, providerMedicalSubspecialtyId } = data

	// 	// 1. Obtener el convenio
	// 	const agreement = await db.agreement.findUnique({
	// 		where: { id: agreementId },
	// 		select: { providerId: true }
	// 	})
	// 	if (!agreement) throw new Error('Convenio no encontrado')

	// 	// 2. Obtener la especialidad
	// 	const specialty = await db.providerMedicalSpecialty.findUnique({
	// 		where: { id: providerMedicalSpecialtyId },
	// 		include: {
	// 			providerMedicalGroup: true
	// 		}
	// 	})
	// 	if (!specialty) throw new Error('Especialidad no encontrada')

	// 	const providerFromSpecialty = specialty.providerMedicalGroup.providerId
	// 	if (providerFromSpecialty !== agreement.providerId) {
	// 		throw new Error('La especialidad no pertenece al proveedor del convenio')
	// 	}

	// 	// 3. Validar subespecialidad si existe
	// 	if (providerMedicalSubspecialtyId) {
	// 		const subspecialty = await db.providerMedicalSubspecialty.findUnique({
	// 			where: { id: providerMedicalSubspecialtyId },
	// 			select: { providerMedicalSpecialtyId: true }
	// 		})
	// 		if (!subspecialty) throw new Error('Subespecialidad no encontrada')
	// 		if (subspecialty.providerMedicalSpecialtyId !== providerMedicalSpecialtyId) {
	// 			throw new Error('La subespecialidad no pertenece a la especialidad seleccionada')
	// 		}
	// 	}

	// 	// 4. Crear la tarifa
	// 	const record = await db.tariff.create({
	// 		data: withAuditForCreate(user, data)
	// 	})

	// 	super.publish({
	// 		pubsub,
	// 		events: [CREATED, UPSERTED],
	// 		dataset: [{ tariffCreated: record }, { tariffUpserted: record }]
	// 	})

	// 	return record
	// }
}