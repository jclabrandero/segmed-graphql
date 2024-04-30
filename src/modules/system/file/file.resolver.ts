
import { File } from '../../../support/classes'
import { IContext } from '../../../support/types'


export class FileResolver {

	async download(_, { md5 }: { md5: string }, { db }: IContext) {
		const directory = process.env.FILE_UPLOAD_DIR
		const info = await db.fileUpload.findUnique({
			where: { md5 }
		})
		if (!info) throw new Error('No existe el archivo en la base de datos')
		
		const file = new File({ info })
		await file.read({ directory })

		return {
			info,
			data: file.data.toString('base64')
		}
	}

}
