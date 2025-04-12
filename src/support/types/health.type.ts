
export interface IClinicCareCreateArgs {
	startDate:			Date
	insuredId:			number
	stateId:			number
	medicalOfficeId:	number
}

export interface IFilterClinicCare {
	insuredId?: number
	creatorUserName?: string
	stateId?: number
}

export interface IClinicCarePrimaryUpsertArgs {
	clinicCareId:	number

	reason?:		string
	physicalExam?:	string
	diagnosis?:		string
}

export interface IInterclinicalCreateArgs {
	clinicCareId:	number

	medicalGroupId:	number
	providerId:		number
	specialties:	Array<{
		medicalSpecialtyId:	number
		subspecialties:		Array<number>
	}>
	remark:			string
}

export interface IInterclinicalUpdateArgs {
	clinicCareId:	number
	
	remark?:		string
	approvedState?:	number
	files?:			Array<string>
}

export interface IPrescriptionCreateArgs {
	clinicCareId:	number

	pharmacyId:		number
	medicationId:	number
	quantity:		number
	indications:	string
}

export interface IPrescriptionUpdateArgs {
	clinicCareId:	number

	quantity?:		number
	indications?:	string
}

export interface IPrescriptionExternCreateArgs {
	clinicCareId:	number

	medicationId:	number
	quantity:		number
	indications:	string
}

export interface IMedicalLeaveCreateArgs {
	clinicCareId:		number
	disabilityTypeId:	number

	reason:		string
	startDate:	Date
	endDate:	Date
}

export interface IMedicalLeaveUpdateArgs {
	clinicCareId:		number
	disabilityTypeId?:	number

	reason?:	string
	startDate?:	Date
	endDate?:	Date
}
