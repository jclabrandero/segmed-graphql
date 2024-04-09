
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
