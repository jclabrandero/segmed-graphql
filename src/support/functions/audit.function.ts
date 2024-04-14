
import { User } from '@prisma/client'

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
		lastUpdateUserName: user.userName,
		lastUpdateDate: today.utc
	}
}
