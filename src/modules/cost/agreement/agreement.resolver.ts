
import { Agreement } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext } from '../../../support/types'
import { AgreementCreateArgs } from '../../../support/types/cost.type'
import { withAuditForCreate } from '../../../support/functions'

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
}
