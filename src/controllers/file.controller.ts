
import { Request, Response } from 'express'

import { File } from '../support/classes'
import { User, PrismaClient } from '@prisma/client'
import { withAuditForCreate } from '../support/functions'


export class FileController {
	async upload(req: Request & { user: User, db: PrismaClient }, res: Response) {
		const { file: buffer } = req['files']
			, { user, db } = req

		if (buffer) {
			try {
				const directory = process.env.FILE_UPLOAD_DIR
				const file = new File({ upload: buffer })

				await file.write({ directory })

				const exist = await db.fileUpload.findUnique({ where: { md5: file.info.md5 } })
				if (!exist) {
					await db.fileUpload.create({ data: withAuditForCreate(user, {
						md5: file.info.md5,
						name: file.info.name,
						encoding: buffer.encoding,
						type: file.info.type,
						extension: file.info.extension
					})})
				}

				res.send({ md5: file.info.md5, type: file.info.type })
			} catch (error) {
				res.status(500).json({
					message: typeof(error) === 'object' ? error.message : error
				})
			}
		}
		else res.status(500).json({ message: 'Error al recibir archivo' })
	}
}
