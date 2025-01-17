
import { Pharmacy, Medication } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface IMedicationCreateArgs {
	code:			string
	name:			string
	concentration:	string
	liname:			boolean

	classId:	number
	unitId:		number
}

export interface IMedicationUpdateArgs {
	code?:			string
	name?:			string
	concentration?:	string
	liname?:		boolean

	classId?:	number
	unitId?:	number
}

export type MedicationStock = {
	total:		number
	pharmacy:	Pharmacy
	medication:	Medication
}

export interface IPharmacyCreateArgs {
	name:			string
	belongingId:	number
}

export interface IPharmacyUpdateArgs {
	name?:			string
	belongingId?:	number
}

export interface IBatchCreateArgs {
	code:			string
	expireAt:		Date
	medicationId:	number
}

export interface IBatchUpdateArgs {
	expireAt?:	Date
}

export interface IArrivalCreateArgs {
	remark:			string
	arrivalDate:	Date
	invoiceNumber:				number
	invoiceAuthorizationCode?:	string
	invoiceControlCode?:		string

	pharmacyId:		number
	providerId?:	number
}

export interface IArrivalItemCreateArgs {
	quantity:	number
	price:		Decimal
	batchId:	number
	arrivalId:	number
}

export interface IDepartureCreateArgs {
	remark:			string
	departureDate:	Date
	pharmacyId:		number
}

export interface IDepartureItemCreateArgs {
	quantity:		number
	batchId:		number
	departureId:	number
}

export interface IInventoryPrintReportArgs {
	reportId: number
	pharmacyId:	number
}
