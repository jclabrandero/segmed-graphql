
import { Request } from 'express'
import { PrismaClient, User, Session } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'


export interface IContext {
	req:		Request
	db:			PrismaClient
	pubsub:		PubSub
	user?:		User & { permissions: Array<string> }
	session?:	Session
}
