
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

export interface IInsuredCreateArgs {
	code:			string
	iin?:			number
	inletDate:		Date
	tradeUnion?:	boolean
	address?:		string
	phone?:			string

	personId:			number
	insuredTypeId: 		number
	holderInsuredId?:	number
	belongingId:		number
}

export interface IInsuredUpdateArgs {
	iin?:			number
	inletDate?:		Date
	outletDate?:	Date
	tradeUnion?:	boolean
	address?:		string
	phone?:			string

	personId?:			number
	insuredTypeId?: 	number
	holderInsuredId?:	number
	belongingId?:		number
}
