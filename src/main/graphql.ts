
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers, mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode, GraphQLScalarType } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import Big from 'big.js'

import { IContext } from '../support/types'

import { SessionResolver, UserResolver, GroupResolver, PermissionResolver } from '../modules/authorization'
import { FileResolver } from '../modules/system'
import {
	PersonDocumentTypeResolver,
	EmployeeTypeResolver, EmployeePositionResolver,
	InsuredTypeResolver,
	MedicalSubspecialtyResolver, MedicalSpecialtyResolver, MedicalGroupResolver,
	DrugClassResolver, DrugUnitResolver,
	ClinicalCareStateResolver, DisabilityTypeResolver
} from '../modules/catalog'
import { BelongingResolver, MedicalOfficeResolver, ProviderResolver } from '../modules/reference'
import { PersonResolver, ClerkResolver, InsuredResolver } from '../modules/folk'
import { MedicationResolver } from '../modules/drugstore/medication/medication.resolver'
import { PharmacyResolver } from '../modules/drugstore/pharmacy/pharmacy.resolver'
import { BatchResolver } from '../modules/drugstore/batch/batch.resolver'
import { InventoryResolver } from '../modules/drugstore/inventory/inventory.resolver'
import { ArrivalResolver } from '../modules/drugstore/inventory/arrival.resolver'
import { DepartureResolver } from '../modules/drugstore/inventory/departure.resolver'
import {
	ClinicCareResolver, ClinicCarePrimaryResolver,
	InterclinicalResolver,
	PrescriptionResolver,
	MedicalLeaveResolver
} from '../modules/health'
import { Decimal } from '@prisma/client/runtime/library'

export class GraphqlResolver {
	schema:	GraphQLSchema
	pubsub:	PubSub

	constructor() {
		this.pubsub = new PubSub()

		const basicSchema = makeExecutableSchema({
			typeDefs: this.buildTypeDefs(),
			resolvers: this.buildResolvers()
		})

		this.schema = this.buildDirectives(basicSchema)
	}

	buildDirectives(schema: GraphQLSchema): GraphQLSchema {
		const session = new SessionResolver()

		return mapSchema(schema, {
			[MapperKind.OBJECT_FIELD]: fieldConfig => {
				const authDirective = getDirective(schema, fieldConfig, 'authorized')
				if (authDirective) {
					const hasDirective = getDirective(schema, fieldConfig, 'has')
					if (hasDirective) {
						fieldConfig.resolve = session.authorized(session.has(fieldConfig.resolve, hasDirective[0].permissions))
					}
					fieldConfig.resolve = session.authorized(fieldConfig.resolve)
				}

				return fieldConfig
			}
		})
	}

	buildTypeDefs(): DocumentNode {
		const typesArray = loadFilesSync(__dirname, { extensions: ['graphql'] })
		return mergeTypeDefs(typesArray)
	}

	buildResolvers<TSource>(): IResolvers<TSource, IContext> {
		const pubsub = this.pubsub
		const user = new UserResolver()
			, session = new SessionResolver()
			, group = new GroupResolver()
			, permission = new PermissionResolver()
			, file = new FileResolver()
			, personDocumentType = new PersonDocumentTypeResolver()
			, employeeType = new EmployeeTypeResolver()
			, employeePosition = new EmployeePositionResolver()
			, insuredType = new InsuredTypeResolver()
			, medicalSubspecialty = new MedicalSubspecialtyResolver()
			, medicalSpecialty = new MedicalSpecialtyResolver()
			, medicalGroup = new MedicalGroupResolver()
			, drugClass = new DrugClassResolver()
			, drugUnit = new DrugUnitResolver()
			, clinicalCareState = new ClinicalCareStateResolver()
			, disabilityType = new DisabilityTypeResolver()
			, belonging = new BelongingResolver()
			, medicalOffice = new MedicalOfficeResolver()
			, provider = new ProviderResolver()
			, person = new PersonResolver()
			, clerk = new ClerkResolver()
			, insured = new InsuredResolver()
			, medication = new MedicationResolver()
			, pharmacy = new PharmacyResolver()
			, batch = new BatchResolver()
			, inventory = new InventoryResolver()
			, arrival = new ArrivalResolver()
			, departure = new DepartureResolver()
			, clinicCare = new ClinicCareResolver()
			, clinicCarePrimary = new ClinicCarePrimaryResolver()
			, interclinical = new InterclinicalResolver()
			, prescription = new PrescriptionResolver()
			, medicalLeave = new MedicalLeaveResolver()

		return mergeResolvers([{
			DateTime: new GraphQLScalarType({
				name: 'DateTime',
				description: 'Date custom scalar type',
				// value from the client
				parseValue: (value: number) => new Date(value),
				// value sent to the client
				serialize: (value: Date) => value.getTime()
			}),
			Decimal: new GraphQLScalarType({
				name: 'Decimal',
				description: 'The `Decimal` scalar type to represent currency values',
				// value from the client
				parseValue: (value: number) => new Decimal(value),
				// value sent to the client
				serialize: (value) => new Big(value),
			}),
			Query: {
				users: user.index,
				currentUser: user.current,
				user: user.findOne,
				userByUserName: user.findOneByUserName,
				userByMyUserName: user.findOneSelf,
				groups: group.index,
				activeGroups: group.active,
				group: group.findOne,
				permissions: permission.index,
				activePermissions: permission.active,

				downloadFile: file.download,

				personDocumentTypes: personDocumentType.index,
				activePersonDocumentTypes: personDocumentType.active,
				personDocumentType: personDocumentType.findOne,
				employeeTypes: employeeType.index,
				activeEmployeeTypes: employeeType.active,
				employeeType: employeeType.findOne,
				employeePositions: employeePosition.index,
				activeEmployeePositions: employeePosition.active,
				employeePosition: employeePosition.findOne,
				insuredTypes: insuredType.index,
				activeInsuredTypes: insuredType.active,
				insuredType: insuredType.findOne,
				medicalSubspecialties: medicalSubspecialty.index,
				activeMedicalSubspecialties: medicalSubspecialty.active,
				medicalSubspecialty: medicalSubspecialty.findOne,
				medicalSpecialties: medicalSpecialty.index,
				activeMedicalSpecialties: medicalSpecialty.active,
				medicalSpecialty: medicalSpecialty.findOne,
				medicalGroups: medicalGroup.index,
				activeMedicalGroups: medicalGroup.active,
				medicalGroup: medicalGroup.findOne,
				drugClasess: drugClass.index,
				activeDrugClasess: drugClass.active,
				drugClass: drugClass.findOne,
				drugUnits: drugUnit.index,
				activeDrugUnits: drugUnit.active,
				drugUnit: drugUnit.findOne,
				clinicalCareStates: clinicalCareState.index,
				activeClinicalCareState: clinicalCareState.active,
				clinicalCareState: clinicalCareState.findOne,
				disabilityTypes: disabilityType.index,
				activeDisabilityTypes: disabilityType.active,
				disabilityType: disabilityType.findOne,

				belongings: belonging.index,
				activeBelongings: belonging.active,
				belonging: belonging.findOne,
				medicalOffices: medicalOffice.index,
				activeMedicalOffices: medicalOffice.active,
				medicalOffice: medicalOffice.findOne,
				providers: provider.index,
				activeProviders: provider.filter,
				provider: provider.findOne,

				persons: person.index,
				activePersons: person.active,
				person: person.findOne,
				clerks: clerk.index,
				activeClerks: clerk.active,
				clerk: clerk.findOne,
				insureds: insured.index,
				activeInsureds: insured.active,
				activeHolderInsureds: insured.activeHolders,
				insured: insured.findOne,

				medications: medication.index,
				medicationsLiname: medication.liname,
				medication: medication.findOne,
				pharmacies: pharmacy.index,
				activePharmacies: pharmacy.active,
				pharmacy: pharmacy.findOne,
				pharmacyStock: pharmacy.stock,
				batches: batch.index,
				batchesStocks: batch.stocks,
				inventories: inventory.index,
				arrivals: arrival.index,
				arrival: arrival.findOne,
				arrivalItems: arrival.items,
				arrivalItem: arrival.findOneItem,
				departures: departure.index,
				departureItems: departure.items,

				clinicCares: clinicCare.index,
				clinicCare: clinicCare.findOne,
				clinicCareState: clinicCare.findState,
				filterClinicCares: clinicCare.filter,
				clinicCaresWithoutDeparturePrescriptions: clinicCare.withoutDeparturePrescriptions,
				clinicCarePrimary: clinicCarePrimary.findOne,
				interclinical: interclinical.findOne,
				prescription: prescription.findOne,
				prescriptionsFromPharmacyWithoutDeparture: prescription.prescriptionsFromPharmacyWithoutDeparture,
				prescriptionExtern: prescription.findOneExtern,
				medicalLeave: medicalLeave.findOne
			},
			Mutation: {
				signIn: session.signIn,
				signOut: session.signOut,
				createGroup: group.create,
				updateGroup: group.update,
				createUser: user.create,
				updateUser: user.update,

				createPersonDocumentType: personDocumentType.create,
				updatePersonDocumentType: personDocumentType.update,
				deletePersonDocumentType: personDocumentType.delete,
				createEmployeeType: employeeType.create,
				updateEmployeeType: employeeType.update,
				deleteEmployeeType: employeeType.delete,
				createEmployeePosition: employeePosition.create,
				updateEmployeePosition: employeePosition.update,
				deleteEmployeePosition: employeePosition.delete,
				createInsuredType: insuredType.create,
				updateInsuredType: insuredType.update,
				deleteInsuredType: insuredType.delete,
				createMedicalSubspecialty: medicalSubspecialty.create,
				updateMedicalSubspecialty: medicalSubspecialty.update,
				deleteMedicalSubspecialty: medicalSubspecialty.delete,
				createMedicalSpecialty:	medicalSpecialty.create,
				updateMedicalSpecialty: medicalSpecialty.update,
				deleteMedicalSpecialty: medicalSpecialty.delete,
				createMedicalGroup: medicalGroup.create,
				updateMedicalGroup: medicalGroup.update,
				deleteMedicalGroup:	medicalGroup.delete,
				createDrugClass: drugClass.create,
				updateDrugClass: drugClass.update,
				deleteDrugClass: drugClass.delete,
				createDrugUnit: drugUnit.create,
				updateDrugUnit: drugUnit.update,
				deleteDrugUnit: drugUnit.delete,
				createClinicalCareState: clinicalCareState.create,
				updateClinicalCareState: clinicalCareState.update,
				deleteClinicalCareState: clinicalCareState.delete,
				createDisabilityType: disabilityType.create,
				updateDisabilityType: disabilityType.update,
				deleteDisabilityType: disabilityType.delete,

				createBelonging: belonging.create,
				updateBelonging: belonging.update,
				deleteBelonging: belonging.delete,
				createMedicalOffice: medicalOffice.create,
				updateMedicalOffice: medicalOffice.update,
				deleteMedicalOffice: medicalOffice.delete,
				createProvider: provider.create,
				updateProvider: provider.update,
				deleteProvider: provider.delete,

				createPerson: person.create,
				updatePerson: person.update,
				deletePerson: person.delete,
				createClerk: clerk.create,
				updateClerk: clerk.update,
				deleteClerk: clerk.delete,
				createInsured: insured.create,
				updateInsured: insured.update,
				deleteInsured: insured.delete,

				createMedication: medication.create,
				updateMedication: medication.update,
				deleteMedication: medication.delete,
				createPharmacy: pharmacy.create,
				updatePharmacy: pharmacy.update,
				deletePharmacy: pharmacy.delete,
				createBatch: batch.create,
				updateBatch: batch.update,
				deleteBatch: batch.delete,
				createArrival: arrival.create,
				approveArrival: arrival.approve,
				closeArrival: arrival.close,
				updateArrival: arrival.update,
				deleteArrival: arrival.delete,
				createArrivalItem: arrival.createItem,
				updateArrivalItem: arrival.updateItem,
				deleteArrivalItem: arrival.deleteItem,
				createDeparture: departure.create,
				createDepartureItem: departure.createItem,
				printReport: inventory.printReport,

				createClinicCare: clinicCare.create,
				updateClinicCareState: clinicCare.updateState,
				upsertClinicCarePrimary: clinicCarePrimary.upsert,
				createInterclinical: interclinical.create,
				updateInterclinical: interclinical.update,
				deleteInterclinical: interclinical.delete,
				printInterclinical: interclinical.print,
				createPrescription: prescription.create,
				updatePrescription: prescription.update,
				deletePrescription: prescription.delete,
				createPrescriptionExtern: prescription.createExtern,
				updatePrescriptionExtern: prescription.updateExtern,
				deletePrescriptionExtern: prescription.deleteExtern,
				printPrescription: prescription.print,
				printPrescriptionExtern: prescription.printExtern,
				createMedicalLeave: medicalLeave.create,
				updateMedicalLeave: medicalLeave.update,
				deleteMedicalLeave: medicalLeave.delete,
				approveMedicalLeave: medicalLeave.approve,
				printMedicalLeave: medicalLeave.print
			},
			Subscription: {
				userCreated: user.created({ pubsub }),
				userUpdated: user.updated({ pubsub }),
				userUpserted: user.upserted({ pubsub }),
				groupCreated: group.created({ pubsub }),
				groupUpdated: group.updated({ pubsub }),
				groupDeleted: group.deleted({ pubsub }),
				groupUpserted: group.upserted({ pubsub }),

				personDocumentTypeCreated: personDocumentType.created({ pubsub }),
				personDocumentTypeUpdated: personDocumentType.updated({ pubsub }),
				personDocumentTypeDeleted: personDocumentType.deleted({ pubsub }),
				personDocumentTypeUpserted: personDocumentType.upserted({ pubsub }),
				employeeTypeCreated: employeeType.created({ pubsub }),
				employeeTypeUpdated: employeeType.updated({ pubsub }),
				employeeTypeDeleted: employeeType.deleted({ pubsub }),
				employeeTypeUpserted: employeeType.upserted({ pubsub }),
				employeePositionCreated: employeePosition.created({ pubsub }),
				employeePositionUpdated: employeePosition.updated({ pubsub }),
				employeePositionDeleted: employeePosition.deleted({ pubsub }),
				employeePositionUpserted: employeePosition.upserted({ pubsub }),
				insuredTypeCreated: insuredType.created({ pubsub }),
				insuredTypeUpdated: insuredType.updated({ pubsub }),
				insuredTypeDeleted: insuredType.deleted({ pubsub }),
				insuredTypeUpserted: insuredType.upserted({ pubsub }),
				medicalSubspecialtyCreated: medicalSubspecialty.created({ pubsub }),
				medicalSubspecialtyUpdated: medicalSubspecialty.updated({ pubsub }),
				medicalSubspecialtyDeleted: medicalSubspecialty.deleted({ pubsub }),
				medicalSubspecialtyUpserted: medicalSubspecialty.upserted({ pubsub }),
				medicalSpecialtyCreated: medicalSpecialty.created({ pubsub }),
				medicalSpecialtyUpdated: medicalSpecialty.updated({ pubsub }),
				medicalSpecialtyDeleted: medicalSpecialty.deleted({ pubsub }),
				medicalSpecialtyUpserted: medicalSpecialty.upserted({ pubsub }),
				medicalGroupCreated: medicalGroup.created({ pubsub }),
				medicalGroupUpdated: medicalGroup.updated({ pubsub }),
				medicalGroupDeleted: medicalGroup.deleted({ pubsub }),
				medicalGroupUpserted: medicalGroup.upserted({ pubsub }),
				drugClassCreated: drugClass.created({ pubsub }),
				drugClassUpdated: drugClass.updated({ pubsub }),
				drugClassDeleted: drugClass.deleted({ pubsub }),
				drugClassUpserted: drugClass.upserted({ pubsub }),
				drugUnitCreated: drugUnit.created({ pubsub }),
				drugUnitUpdated: drugUnit.updated({ pubsub }),
				drugUnitDeleted: drugUnit.deleted({ pubsub }),
				drugUnitUpserted: drugUnit.upserted({ pubsub }),
				clinicalCareStateCreated: clinicalCareState.created({ pubsub }),
				clinicalCareStateUpdated: clinicalCareState.updated({ pubsub }),
				clinicalCareStateDeleted: clinicalCareState.deleted({ pubsub }),
				clinicalCareStateUpserted: clinicalCareState.upserted({ pubsub }),
				disabilityTypeCreated: disabilityType.created({ pubsub }),
				disabilityTypeUpdated: disabilityType.updated({ pubsub }),
				disabilityTypeDeleted: disabilityType.deleted({ pubsub }),
				disabilityTypeUpserted: disabilityType.upserted({ pubsub }),

				belongingCreated: belonging.created({ pubsub }),
				belongingUpdated: belonging.updated({ pubsub }),
				belongingDeleted: belonging.deleted({ pubsub }),
				belongingUpserted: belonging.upserted({ pubsub }),
				medicalOfficeCreated: medicalOffice.created({ pubsub }),
				medicalOfficeUpdated: medicalOffice.updated({ pubsub }),
				medicalOfficeDeleted: medicalOffice.deleted({ pubsub }),
				medicalOfficeUpserted: medicalOffice.upserted({ pubsub }),
				providerCreated: provider.created({ pubsub }),
				providerUpdated: provider.updated({ pubsub }),
				providerDeleted: provider.deleted({ pubsub }),
				providerUpserted: provider.upserted({ pubsub }),

				personCreated: person.created({ pubsub }),
				personUpdated: person.updated({ pubsub }),
				personDeleted: person.deleted({ pubsub }),
				personUpserted: person.upserted({ pubsub }),
				clerkCreated: clerk.created({ pubsub }),
				clerkUpdated: clerk.updated({ pubsub }),
				clerkDeleted: clerk.deleted({ pubsub }),
				clerkUpserted: clerk.upserted({ pubsub }),
				insuredCreated: insured.created({ pubsub }),
				insuredUpdated: insured.updated({ pubsub }),
				insuredDeleted: insured.deleted({ pubsub }),
				insuredUpserted: insured.upserted({ pubsub }),

				medicationCreated: medication.created({ pubsub }),
				medicationUpdated: medication.updated({ pubsub }),
				medicationDeleted: medication.deleted({ pubsub }),
				medicationUpserted: medication.upserted({ pubsub }),
				pharmacyCreated: pharmacy.created({ pubsub }),
				pharmacyUpdated: pharmacy.updated({ pubsub }),
				pharmacyDeleted: pharmacy.deleted({ pubsub }),
				pharmacyUpserted: pharmacy.upserted({ pubsub }),
				batchCreated: batch.created({ pubsub }),
				batchUpdated: batch.updated({ pubsub }),
				batchDeleted: batch.deleted({ pubsub }),
				batchUpserted: batch.upserted({ pubsub }),
				arrivalCreated: arrival.created({ pubsub }),
				arrivalUpdated: arrival.updated({ pubsub }),
				arrivalDeleted: arrival.deleted({ pubsub }),
				arrivalUpserted: arrival.upserted({ pubsub }),
				arrivalItemUpserted: arrival.upsertedItem({ pubsub }),
				departureCreated: departure.created({ pubsub }),
				departureUpdated: departure.updated({ pubsub }),
				departureDeleted: departure.deleted({ pubsub }),
				departureUpserted: departure.upserted({ pubsub }),
				departureItemUpserted: departure.upsertedItem({ pubsub }),

				clinicCareCreated: clinicCare.created({ pubsub }),
				clinicCareUpdated: clinicCare.updated({ pubsub }),
				clinicCareDeleted: clinicCare.deleted({ pubsub }),
				clinicCareUpserted: clinicCare.upserted({ pubsub })
			}
		}])
	}

	buildContext(db, pubsub) {
		return async ({ req }): Promise<IContext> => {
			return { req, db, pubsub }
		}
	}
}
