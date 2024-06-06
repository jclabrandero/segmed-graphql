
import { Status } from '../constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../functions'


export class Relation {

	public static async upsert({ model, where, dataset, field, user }) {
		const records = await model.findMany({ where })
		const list = dataset.length && (typeof dataset[0] == 'number') ? dataset.map(id => JSON.parse(`{"${field}":${id}}`)) : dataset
		const useFind = e => r => e[field] == r[field]
		const update = []

		records.forEach(record => {
			const { id, status } = record
			const found = list.find(useFind(record))

			if (found) {
				const { __update, ...remaining } = found
				switch (status) {
				case Status.Active:
				case Status.Idle:
				case Status.Pending:
					if (__update) update.push({ where: { id }, data: withAuditForUpdate(user, remaining) })
					break
				case Status.Removed:
					update.push({ where: { id }, data: withAuditForUpdate(user, { ...remaining, status: Status.Active }) })
					break
				}
			} else {
				switch (status) {
				case Status.Active:
				case Status.Idle:
				case Status.Pending:
					update.push({ where: { id }, data: withAuditForDelete(user) })
					break
				}
			}
		})

		const create = list.reduce(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			(prev, { __update, ...remaining }) =>	records.find(useFind(remaining)) ? prev : [ ...prev, ...[withAuditForCreate(user, remaining)] ],
			[]
		)

		if (Boolean(update.length)) {
			return Boolean(create.length) ? { update, create } : { update } 
		} else {
			return Boolean(create.length) ? { create } : {} 
		}
	}

}
