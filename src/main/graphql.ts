
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers, mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode, GraphQLScalarType } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

import { IContext } from '../support/types'

import { SessionResolver, UserResolver, GroupResolver, PermissionResolver } from '../modules/authorization'
import {
	PersonDocumentTypeResolver,
	EmployeeTypeResolver, EmployeePositionResolver,
	InsuredTypeResolver
} from '../modules/catalog'
import { BelongingResolver, MedicalOfficeResolver } from '../modules/reference'
import { PersonResolver, ClerkResolver, InsuredResolver } from '../modules/folk'


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
			, personDocumentType = new PersonDocumentTypeResolver()
			, employeeType = new EmployeeTypeResolver()
			, employeePosition = new EmployeePositionResolver()
			, insuredType = new InsuredTypeResolver()
			, belonging = new BelongingResolver()
			, medicalOffice = new MedicalOfficeResolver()
			, person = new PersonResolver()
			, clerk = new ClerkResolver()
			, insured = new InsuredResolver()

		return mergeResolvers([{
			DateTime: new GraphQLScalarType({
				name: 'DateTime',
				description: 'Date custom scalar type',
				parseValue: (value: number) => new Date(value),
				serialize: (value: Date) => value.getTime()
			}),
			Query: {
				users: user.index,
				currentUser: user.current,
				user: user.findOne,
				groups: group.index,
				activeGroups: group.active,
				group: group.findOne,
				permissions: permission.index,
				activePermissions: permission.active,

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

				belongings: belonging.index,
				activeBelongings: belonging.active,
				belonging: belonging.findOne,
				medicalOffices: medicalOffice.index,
				activeMedicalOffices: medicalOffice.active,
				medicalOffice: medicalOffice.findOne,

				persons: person.index,
				activePersons: person.active,
				person: person.findOne,
				clerks: clerk.index,
				activeClerks: clerk.active,
				clerk: clerk.findOne,
				insureds: insured.index,
				activeInsureds: insured.active,
				activeHolderInsureds: insured.activeHolders,
				insured: insured.findOne
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

				createBelonging: belonging.create,
				updateBelonging: belonging.update,
				deleteBelonging: belonging.delete,
				createMedicalOffice: medicalOffice.create,
				updateMedicalOffice: medicalOffice.update,
				deleteMedicalOffice: medicalOffice.delete,

				createPerson: person.create,
				updatePerson: person.update,
				deletePerson: person.delete,
				createClerk: clerk.create,
				updateClerk: clerk.update,
				deleteClerk: clerk.delete,
				createInsured: insured.create,
				updateInsured: insured.update,
				deleteInsured: insured.delete
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

				belongingCreated: belonging.created({ pubsub }),
				belongingUpdated: belonging.updated({ pubsub }),
				belongingDeleted: belonging.deleted({ pubsub }),
				belongingUpserted: belonging.upserted({ pubsub }),
				medicalOfficeCreated: medicalOffice.created({ pubsub }),
				medicalOfficeUpdated: medicalOffice.updated({ pubsub }),
				medicalOfficeDeleted: medicalOffice.deleted({ pubsub }),
				medicalOfficeUpserted: medicalOffice.upserted({ pubsub }),

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
				insuredUpserted: insured.upserted({ pubsub })
			}
		}])
	}

	buildContext(db, pubsub) {
		return async ({ req }): Promise<IContext> => {
			return { req, db, pubsub }
		}
	}
}
