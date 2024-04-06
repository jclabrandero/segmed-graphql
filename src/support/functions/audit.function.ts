
import { User, PrismaClient } from '@prisma/client'
import { format } from 'date-fns'

import { now } from '.'
import { Status } from '../constants/status.constant'


export function withAuditForCreate<TData>(user: User, overload: TData) {
	const utc = now().utc

	return {
		...overload,
		creatorUserName: user.userName,
		creationDate: utc
	}
}

export function withAuditForUpdate<TData>(user: User, overload: TData) {
	const utc = now().utc

	return {
		...overload,
		lastUpdateUserName: user.userName,
		lastUpdateDate: utc
	}
}

export function withAuditForDelete<TData>(user: User, prev?: TData, unique?: Array<string> | string) {
	const today = now()
	const overload = {}

	if (prev && unique) {
		if (typeof unique === 'string')
			overload[unique] = `${prev[unique]}-DELETED-${today.formated}`
		else
			for (const field of unique) {
				overload[field] = `${prev[field]}-DELETED-${today.formated}`
			}
	}

	return {
		...overload,
		status: Status.Removed,
		deletionUserName: user.userName,
		deletionDate: today.utc
	}
}

export async function auditLog(client: PrismaClient, tableName: string, oldRecord, newRecord, refValues: object) {
	const toString = (value: null | string | number | boolean | Date) => {
		if (value === null) return null

		switch(typeof value) {
		case 'string': return value
		case 'object': return format(value, 'dd/MM/yyyy HH:mm:ss')
		case 'number': return value.toString()
		case 'boolean': return value.toString()
		}
	}

	for (const entry of Object.entries(refValues)) {
		await client.audit.create({
			data: {
				tableName,
				fieldName: entry[0],
				rowId: oldRecord.id,
				oldValue: toString(oldRecord[entry[0]]),
				newValue:toString(entry[1]),
				userName: newRecord.lastUpdateUserName,
				updateDate: newRecord.lastUpdateDate
			}
		})
	}
}
