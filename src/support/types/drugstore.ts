
import { Pharmacy, Medication } from "@prisma/client"

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
