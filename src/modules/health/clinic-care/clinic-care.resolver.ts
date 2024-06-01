
import { ClinicCare, ClinicalCareState } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IClinicCareCreateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'
import { InterclinicalResolver } from '../inter-clinical/inter-clinical.resolver'
import { MedicalLeaveResolver } from '../medical-leave/medical-leave.resolver'
import { PrescriptionResolver } from '../prescription/prescription.resolver'


export class ClinicCareResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	async index(_, args, { db }: IContext): Promise<Array<ClinicCare>> {
		return await db.clinicCare.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				primary: true,
				insured: {
					include: {
						person: true,
						insuredType: true
					}
				},
				state: true,
				medicalOffice: true,
				creatorUser: true
			}
		})
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.clinicCare.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: {
				insured: {
					include: {
						person: true,
						insuredType: true,
					}
				},
				primary: true,
				prescriptions: {
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						pharmacy: {
							include: {
								pharmacy: true
							}
						},
						medication: {
							include: {
								medication: {
									include: {
										class: true,
										unit: true
									}
								}
							}
						}
					}
				},
				prescriptionExterns: {
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						medication: {
							include: {
								medication: {
									include: {
										class: true,
										unit: true
									}
								}
							}
						}
					}
				},
				interclinicals: {
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						provider: {
							include: {
								provider: true
							}
						},
						medicalGroup: {
							include: {
								medicalGroup: true,
								specialties: {
									include: {
										medicalSpecialty: true,
										subspecialties: {
											include: {
												medicalSubspecialty: true
											}
										}
									}
								}
							}
						},
						files: {
							where: {
								status: Status.Active
							},
							include: {
								file: true
							}
						}
					}
				},
				medicalLeaves: {
					where: {
						NOT: { status: Status.Removed }
					},
					include: {
						disabilityType: {
							include: {
								disabilityType: true
							}
						},
						approvalUser: true
					}
				},
				state: true,
				medicalOffice: true,
				creatorUser: true
			}
		})

		return {
			...record,
			prescriptions: record.prescriptions.map(prescription => PrescriptionResolver.format(prescription)),
			prescriptionExterns: record.prescriptionExterns.map(prescriptionExtern => PrescriptionResolver.format(prescriptionExtern)),
			interclinicals: record.interclinicals.map(interclinical => InterclinicalResolver.format(interclinical)),
			medicalLeaves: record.medicalLeaves.map(medicalLeave => MedicalLeaveResolver.format(medicalLeave))
		}
	}

	async findState(_, { id }: { id: number }, { db }: IContext): Promise<ClinicalCareState> {
		const record = await db.clinicCare.findUnique({
			where: {
				id,
				NOT: { status: Status.Removed }
			},
			include: { state: true }
		})
		return record.state
	}

	async create(_, { data }: { data: IClinicCareCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { CREATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const record = await db.clinicCare.create({
			data: withAuditForCreate(user, data)
		})
		super.publish({
			pubsub,
			events: [CREATED, UPSERTED],
			dataset: [{ clinicCareCreated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async updateState(_, { id, data }: { id: number, data: { stateId: number } }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const record = await db.clinicCare.update({
			where: { id },
			data: withAuditForUpdate(user, data)
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

}
