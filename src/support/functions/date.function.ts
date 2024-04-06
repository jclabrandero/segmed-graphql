
import { getDate, getMonth, getYear, format } from 'date-fns'


export function now(options: { format: string } = { format: 'dd/MM/yyyy HH:mm:ss' }) {
	const d = new Date()

	return {
		day: getDate(d),
		month: getMonth(d),
		year: getYear(d),
		formated: format(d, options.format),
		local: d,
		utc: new Date(d.getTime() - d.getTimezoneOffset() * 60000)
	}
}
