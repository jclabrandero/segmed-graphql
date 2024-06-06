
export interface IBelongingCreateArgs {
	name:	string
}

export interface IBelongingUpdateArgs {
	name?:	string
}


export interface IMedicalOfficeCreateArgs {
	name:			string
	belongingId:	number
}

export interface IMedicalOfficeUpdateArgs {
	name?:			string
	belongingId?:	number
}

export interface IProviderCreateArgs {
	vendorCode:		string
	businessName:	string
	nit?:			string
	address?:		string
	phone?:			string

	belongingId:	number

	medicalGroups: Array<{
		medicalGroupId:	number
		specialties: Array<{
			medicalSpecialtyId: number
			subspecialties: Array<number>
		}>
	}>
}

export interface IProviderUpdateArgs {
	businessName?:	string
	nit?:			string
	address?:		string
	phone?:			string

	belongingId?:	number

	medicalGroups?: Array<{
		medicalGroupId:	number
		specialties: Array<{
			medicalSpecialtyId: number
			subspecialties: Array<number>
		}>
	}>
}
