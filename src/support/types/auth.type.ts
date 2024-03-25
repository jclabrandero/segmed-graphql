
export interface IAuthPayload {
	userName:		string
	displayName:	string
}

export interface IUserCreateArgs {
	userName:			string
	displayName?:		string
	email?:				string

	password?:			string
	confirmPassword?:	string
}

export interface IUserUpdateArgs {
	displayName?:		string
	email?:				string

	password?:			string
	confirmPassword?:	string
}

export interface IGroupCreateArgs {
	name:			string
	description?:	string
}
