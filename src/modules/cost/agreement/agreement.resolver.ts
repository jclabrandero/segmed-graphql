
import { Agreement } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext } from '../../../support/types'
import { AgreementCreateArgs } from '../../../support/types/cost.type'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'

export class AgreementResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Agreement)
	}

	async index(_, {}, { db }: IContext): Promise<Array<Agreement>> {
		return await db.agreement.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				provider: true,
				file: true,
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext): Promise<Agreement> {
		const agreement = await db.agreement.findUnique({
			where: { id },
			include: {
				provider: true,
				file: true,
				tariffs: {
					where: { status: { not: Status.Removed } },
					include: {
						providerMedicalSpecialty: true,
						providerMedicalSubspecialty: true
					}
				}
			}
		})
		if (!agreement) throw new Error('Convenio no encontrado.')
		return agreement
	}

	async create(_, { data }: { data: AgreementCreateArgs }, { db, pubsub, user }: IContext): Promise<Agreement> {
		const { CREATED, UPSERTED } = SubscriptionEvent.Agreement
		const { fileMd5, ...payload } = data

		const file = await db.fileUpload.findUnique({ where: { md5: fileMd5 }})
		if (!file) throw 'Archivo no encontrado.'

		const record = await db.agreement.create({
			data: withAuditForCreate(user, { fileUploadId: file.id, ...payload })
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ agreementCreated: record }, { agreementUpserted: record }]
		})
		return record
	}

	async delete(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Agreement> {
		const { DELETED, UPSERTED } = SubscriptionEvent.Agreement
		await super.findOneOrFail(db.agreement, id)
		const record = await db.agreement.update({
			where: { id },
			data: withAuditForDelete(user)
		})
		super.publish({
			pubsub,
			events: [DELETED, UPSERTED],
			dataset: [{ agreementDeleted: record }, { agreementUpserted: record }]
		})
		return record
	}

	async upgradeAgreement(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Agreement> {
		const agreement = await db.agreement.findUnique({
			where: { id }
		})
		if (!agreement) throw 'Convenio no encontrado.'
		if (agreement.status == Status.Active) throw 'Convenio ya se encuentra activo.'
		if (agreement.status == Status.Removed) throw 'Convenio eliminado y no puede cambiarse de estado.'

		const record = await db.agreement.update({
			where: { id },
			data: withAuditForUpdate(user, {
				status: Status.Active,
			})
		})

		const { UPDATED, UPSERTED } = SubscriptionEvent.Agreement
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ agreementDeleted: record }, { agreementUpserted: record }]
		})

		return record
	}

	async downgradeAgreement(_, { id }: { id: number }, { db, pubsub, user }: IContext): Promise<Agreement> {
		const agreement = await db.agreement.findUnique({
			where: { id }
		})
		if (!agreement) throw 'Convenio no encontrado.'
		if (agreement.status == Status.Idle) throw 'Convenio ya se encuentra inactivo.'
		if (agreement.status == Status.Removed) throw 'Convenio fue eliminado y no puede cambiarse de estado.'

		const record = await db.agreement.update({
			where: { id },
			data: withAuditForUpdate(user, {
				status: Status.Idle,
			})
		})

		const { UPDATED, UPSERTED } = SubscriptionEvent.Agreement
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ agreementDeleted: record }, { agreementUpserted: record }]
		})

		return record
	}
}
