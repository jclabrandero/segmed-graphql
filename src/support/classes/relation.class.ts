
import { Status } from '../constants'
import { withAuditForCreate, withAuditForDelete, withAuditForUpdate } from '../functions'


export class Relation {

	public static async upsert({ model, where, dataset, field, user }) {
		const records = await model.findMany({ where })
		const list = dataset.map(id => JSON.parse(`{"${field}":${id}}`))
		const useFind = e => r => e[field] == r[field]
		const update = []

		records.forEach(record => {
			const { id, status } = record
			const found = list.find(useFind(record))

			switch (status) {
			case Status.Active:
			case Status.Idle:
			case Status.Pending:
				if (!found) update.push({ where: { id }, data: withAuditForDelete(user) })
				break
			case Status.Removed:
				if (found) update.push({ where: { id }, data: withAuditForUpdate(user, { status: Status.Active }) })
				break
			}
		})

		const create = list.reduce(
			(prev, item) =>	records.find(useFind(item)) ? prev : [ ...prev, ...[withAuditForCreate(user, item)] ],
			[]
		)

		return { update, create }
	}

}
