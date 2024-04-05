
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
