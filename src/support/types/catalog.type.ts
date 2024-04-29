
export interface IPersonDocumentTypeCreateArgs {
	name:			string
	description?:	string
}

export interface IPersonDocumentTypeUpdateArgs {
	name?:			string
	description?:	string
}


export interface IEmployeeTypeCreateArgs {
	name:			string
	description?:	string
}

export interface IEmployeeTypeUpdateArgs {
	name?:			string
	description?:	string
}


export interface IEmployeePositionCreateArgs {
	name:			string
	description?:	string
}

export interface IEmployeePositionUpdateArgs {
	name?:			string
	description?:	string
}


export interface IInsuredTypeCreateArgs {
	name:			string
	description?:	string
	withDependents:	boolean
}

export interface IInsuredTypeUpdateArgs {
	name?:				string
	description?:		string
	withDependents?:	boolean
}

export interface IMedicalSubspecialtyCreateArgs {
	name:				string
	description?:		string
	ageRangePatients?:	string

	dt?:	string
	si?:	string
	ot?:	string
}

export interface IMedicalSubspecialtyUpdateArgs {
	name?:				string
	description?:		string
	ageRangePatients?:	string

	dt?:	string
	si?:	string
	ot?:	string
}

export interface IMedicalSpecialtyCreateArgs {
	name:				string
	description?:		string
	subspecialties?:	Array<number>
}

export interface IMedicalSpecialtyUpdateArgs {
	name?:				string
	description?:		string
	subspecialties?:	Array<number>
}

export interface IMedicalGroupCreateArgs {
	name:			string
	description?:	string
	specialties?:	Array<number>
}

export interface IMedicalGroupUpdateArgs {
	name?:			string
	description?:	string
	specialties?:	Array<number>
}

export interface IDrugClassCreateArgs {
	name:			string
	description?:	string
}

export interface IDrugClassUpdateArgs {
	name?:			string
	description?:	string
}

export interface IDrugUnitCreateArgs {
	name:			string
	description?:	string
}

export interface IDrugUnitUpdateArgs {
	name?:			string
	description?:	string
}

export interface IClinicalCareStateCreateArgs {
	name:			string
	description?:	string
	color:			string
	lock?:			boolean
}

export interface IClinicalCareStateUpdateArgs {
	name?:			string
	description?:	string
	color?:			string
	lock?:			boolean
}
