
export type FileInfo = {
	md5:		string
	name:		string
	type:		string
	extension:	string
}

export type FileBuffer = {
	info: FileInfo
	data: Buffer
}
