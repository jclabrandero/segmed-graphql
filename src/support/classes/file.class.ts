
import fs from 'fs'
import path from 'path'


type TFile = {
	data:		Buffer
	md5:		string
	name:		string
	mimetype:	string
}

type FileInfo = {
	md5:		string
	name:		string
	type:		string
	extension:	string
}

export class File {
	public data:		Buffer
	public info:		FileInfo

	constructor({ upload, info }: { info?: FileInfo, upload?: TFile } = {}) {
		if (upload) {
			const splitNames = upload.name.split('.')

			this.data = upload.data
			this.info = {
				md5: upload.md5,
				name: upload.name,
				type: upload.mimetype,
				extension: splitNames.length ? '.' + splitNames[splitNames.length - 1] : '.unknown'
			}
		} else if (info) {
			this.info = info
		}
	}

	async write({ directory, replace = false }: { directory: string, replace?: boolean }) {
		const filePath = path.join(directory, this.info.md5 + this.info.extension)
			, data = this.data
			, exist = fs.existsSync(filePath)

		if (replace || !exist) {
			fs.writeFileSync(filePath, data)
		}
	}

	async read({ directory, info }: { directory: string, info?: FileInfo }) {
		if (info)
			this.info = info

		const filePath = path.join(directory, this.info.md5 + this.info.extension)
		this.data = fs.readFileSync(filePath)

		return this.data
	}
}
