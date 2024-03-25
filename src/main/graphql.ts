
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { IResolvers, mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { GraphQLSchema, DocumentNode, GraphQLScalarType } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

import { IContext } from '../support/types'

import { SessionResolver, UserResolver, GroupResolver } from '../modules/authorization'


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

				groups: group.index
			},
			Mutation: {
				signIn: session.signIn,
				signOut: session.signOut,

				createGroup: group.create,

				createUser: user.create,
				updateUser: user.update
			},
			Subscription: {
				userCreated: user.created({ pubsub }),
				userUpdated: user.updated({ pubsub }),
				userUpserted: user.upserted({ pubsub }),

				groupCreated: group.created({ pubsub }),
				groupUpdated: group.updated({ pubsub }),
				groupDeleted: group.deleted({ pubsub }),
				groupUpserted: group.upserted({ pubsub }),
			}
		}])
	}

	buildContext(db, pubsub) {
		return async ({ req }): Promise<IContext> => {
			return { req, db, pubsub }
		}
	}
}
