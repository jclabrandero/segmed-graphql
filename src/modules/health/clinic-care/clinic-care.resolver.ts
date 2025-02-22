
import { ClinicCare, ClinicalCareState } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IClinicCareCreateArgs, IFilterClinicCare } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForUpdate } from '../../../support/functions'
import { InterclinicalResolver } from '../inter-clinical/inter-clinical.resolver'
import { MedicalLeaveResolver } from '../medical-leave/medical-leave.resolver'
import { PrescriptionResolver } from '../prescription/prescription.resolver'
import { InsuredResolver } from '../../folk'
import { MedicalOfficeResolver } from '../../reference'


export class ClinicCareResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	static format(record) {
		if (!record) return null
		const { insured, medicalOffice, prescriptions, prescriptionExterns, interclinicals, medicalLeaves, ...clinicCare } = record
		return {
			...clinicCare,
			insured: {
				...insured.insured,
				iin: insured.insuredIin,
				person: {
					firstName: insured.personFirstName,
					lastName: insured.personLastName
				},
				insuredType: {
					name: insured.insuredTypeName
				}
			},
			medicalOffice: medicalOffice ? {
				...medicalOffice.medicalOffice,
				name: medicalOffice.medicalOfficeName
			} : undefined,
			prescriptions: prescriptions ? prescriptions.map(prescription => PrescriptionResolver.format(prescription)) : undefined,
			prescriptionExterns: prescriptionExterns ? prescriptionExterns.map(prescriptionExtern => PrescriptionResolver.format(prescriptionExtern)) : undefined,
			interclinicals: interclinicals ? interclinicals.map(interclinical => InterclinicalResolver.format(interclinical)) : undefined,
			medicalLeaves: medicalLeaves ? medicalLeaves.map(medicalLeave => MedicalLeaveResolver.format(medicalLeave)) : undefined
		}
	}

	async index(_, args, { db }: IContext): Promise<Array<ClinicCare>> {
		const records = await db.clinicCare.findMany({
			where: {
				NOT: { status: Status.Removed }
			},
			include: {
				insured: {
					include: {
						insured: {
							include: {
								person: true,
								insuredType: true
							}
						}
					}
				},
				medicalOffice: {
					include: {
						medicalOffice: true
					}
				},
				primary: true,
				state: true,
				creatorUser: true
			},
			orderBy: {
				creationDate: 'desc' // Ordenar por la fecha de creación en orden descendente
			}
		})

		return records.map(ClinicCareResolver.format)
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
						insured: {
							include: {
								person: true,
								insuredType: true
							}
						}
					}
				},
				medicalOffice: {
					include: {
						medicalOffice: true
					}
				},
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
				primary: true,
				state: true,
				creatorUser: true
			}
		})

		return ClinicCareResolver.format(record)
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

	async filter(_, { filter }: { filter: IFilterClinicCare }, { db }: IContext): Promise<Array<ClinicCare>> {
		const records = await db.clinicCare.findMany({
			where: {
				insured: filter.insuredId ? {
					insuredId: filter.insuredId
				} : undefined,
				creatorUserName: filter.creatorUserName || undefined,
				NOT: { status: Status.Removed }
			},
			include: {
				insured: {
					include: {
						insured: {
							include: {
								person: true,
								insuredType: true
							}
						}
					}
				},
				medicalOffice: {
					include: {
						medicalOffice: true
					}
				},
				primary: true,
				state: true,
				creatorUser: true
			},
			orderBy: {
				creationDate: 'desc' // Ordenar por la fecha de creación en orden descendente
			}
		})
		return records.map(ClinicCareResolver.format)
	}

	async create(_, { data }: { data: IClinicCareCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { CREATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { insuredId, medicalOfficeId, ...payload } = data
		const insured = await InsuredResolver.findOne({ id: insuredId }, { db } as IContext)
		const medicalOffice = await MedicalOfficeResolver.findOne({ id: medicalOfficeId }, { db } as IContext)
		const record = await db.clinicCare.create({
			data:withAuditForCreate(user, {
				...payload,
				insured: {
					create: withAuditForCreate(user, {
						insuredId,
						insuredIin: insured.iin,
						personFirstName: insured.person.firstName,
						personLastName: insured.person.lastName,
						insuredTypeName: insured.insuredType.name
					})
				},
				medicalOffice: {
					create: withAuditForCreate(user, {
						medicalOfficeId,
						medicalOfficeName: medicalOffice.name
					})
				}
			})
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
