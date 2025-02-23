
import { ClinicCare } from '@prisma/client'

import { Resolver } from '../../../support/classes'
import { IContext, IPrescriptionCreateArgs, IPrescriptionUpdateArgs, IPrescriptionExternCreateArgs } from '../../../support/types'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../../../support/functions'
import { PrescriptionTemplate } from '../../template/prescription.template'
import { MedicationResolver } from '../../drugstore/medication/medication.resolver'
import { PharmacyResolver } from '../../drugstore/pharmacy/pharmacy.resolver'
import { ClinicCareResolver } from '../'


export class PrescriptionResolver extends Resolver {

	constructor() {
		super(SubscriptionEvent.ClinicCare)
	}

	static format(record) {
		if (!record) return null
		const { pharmacy, medication, ...prescription } = record
		return {
			...prescription,
			medication: {
				...medication.medication,
				code: medication.medicationCode,
				name: medication.medicationName,
				concentration: medication.medicationConcentration,
				class: {
					...medication.medication.class,
					name: medication.medicationClass
				},
				unit: {
					...medication.medication.unit,
					name: medication.medicationUnit
				}
			},
			pharmacy: pharmacy ? {
				...pharmacy.pharmacy,
				name: pharmacy.pharmacyName
			} : undefined
		}
	}

	async findOne(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.prescription.findUnique({
			where: {
				id,
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
		})
		return PrescriptionResolver.format(record)
	}

	async prescriptionsFromPharmacyWithoutDeparture(_, { clinicCareId, pharmacyId }: { clinicCareId: number, pharmacyId: number }, { db }: IContext) {
		const record = await db.prescription.findMany({
			where: {
				clinicCareId,
				pharmacy: {
					pharmacyId
				},
				departureItemPrescription: null,
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
		})
		return record.map(PrescriptionResolver.format)
	}

	async findOneExtern(_, { id }: { id: number }, { db }: IContext) {
		const record = await db.prescriptionExtern.findUnique({
			where: {
				id,
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
		})
		return PrescriptionResolver.format(record)
	}

	async create(_, { data }: { data: IPrescriptionCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { medicationId, pharmacyId, clinicCareId, ...remaining } = data
		const pharmacy = await PharmacyResolver.findOne({ id: pharmacyId }, { db } as IContext)
		const medication = await MedicationResolver.findOne({ id: medicationId }, { db } as IContext)
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptions: {
					create: withAuditForCreate(user, {
						...remaining,
						pharmacy: {
							create: withAuditForCreate(user, {
								pharmacyId,
								pharmacyName: pharmacy.name
							})
						},
						medication: {
							create: withAuditForCreate(user, {
								medicationId,
								medicationCode: medication.code,
								medicationName: medication.name,
								medicationConcentration: medication.concentration,
								medicationClass: medication.class.name,
								medicationUnit: medication.unit.name
							})
						}
					})
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async update(_, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data
		const record = await db.clinicCare.update({
			where: {
				id: clinicCareId
			},
			data: {
				prescriptions: {
					update: {
						where: { id },
						data: withAuditForUpdate(user, payload)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async delete(source, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptions: {
					update: {
						where: { id },
						data: withAuditForDelete(user)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async createExtern(_, { data }: { data: IPrescriptionExternCreateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { medicationId, clinicCareId, ...remaining } = data
		const medication = await MedicationResolver.findOne({ id: medicationId }, { db } as IContext)
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptionExterns: {
					create: withAuditForCreate(user, {
						...remaining,
						medication: {
							create: withAuditForCreate(user, {
								medicationId,
								medicationCode: medication.code,
								medicationName: medication.name,
								medicationConcentration: medication.concentration,
								medicationClass: medication.class.name,
								medicationUnit: medication.unit.name
							})
						}
					})
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async updateExtern(_, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId, ...payload } = data
		const record = await db.clinicCare.update({
			where: {
				id: clinicCareId
			},
			data: {
				prescriptionExterns: {
					update: {
						where: { id },
						data: withAuditForUpdate(user, payload)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async deleteExtern(source, { id, data }: { id: number, data: IPrescriptionUpdateArgs }, { db, pubsub, user }: IContext): Promise<ClinicCare> {
		const { UPDATED, UPSERTED } = SubscriptionEvent.ClinicCare
		const { clinicCareId } = data
		const record = await db.clinicCare.update({
			where: { id: clinicCareId },
			data: {
				prescriptionExterns: {
					update: {
						where: { id },
						data: withAuditForDelete(user)
					}
				}
			}
		})
		super.publish({
			pubsub,
			events: [UPDATED, UPSERTED],
			dataset: [{ clinicCareUpdated: record }, { clinicCareUpserted: record }]
		})
		return record
	}

	async print(_, args: { data: { clinicCareId: number } }, constext: IContext) {
		const template = new PrescriptionTemplate()
		const record = await constext.db.clinicCare.findUnique({
			where: {
				id: args.data.clinicCareId,
				NOT: { status: Status.Removed }
			},
			include: {
				insured: {
					include: {
						insured: {
							include: {
								person: true,
								belonging: true,
								holderInsured: {
									include: {
										person: true
									}
								}
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
						status: Status.Active
					},
					include: {
						pharmacy: true,
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
						status: Status.Active
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
				creatorUser: true // Agregamos el campo creatorUser aquí
			}
		})
		const buffer = await template.make(ClinicCareResolver.format(record), constext.user)

		return {
			info: {
				type: 'application/pdf'
			},
			data: buffer.toString('base64')
		}
	}

}
