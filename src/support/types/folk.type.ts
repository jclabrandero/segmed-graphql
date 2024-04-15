
export interface IPersonCreateArgs {
	firstName:	string
	lastName:	string
	sex:		string
	birthDate:	Date

	documentNumber?:		string
	personDocumentTypeId?:	number
}

export interface IPersonUpdateArgs {
	firstName?:	string
	lastName?:	string
	sex?:		string
	birthDate?:	Date

	documentNumber?:		string
	personDocumentTypeId?:	number
}

export interface IClerkCreateArgs {
	ein:	number

	personId:		number
	employeeTypeId:	number
	positionId:		number

	offices?:			Array<number>
	medicalOffices?:	Array<number>
}

export interface IClerkUpdateArgs {
	personId?:			number
	employeeTypeId?:	number
	positionId?:		number

	offices?:			Array<number>
	medicalOffices?:	Array<number>
}
