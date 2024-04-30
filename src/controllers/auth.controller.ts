
import { IAuthPayload } from '../support/types'
import { Status } from '../support/constants'
import { Auth } from '../support/classes'


export class AuthController {
	constructor() {
	}

	async authorized(req, res, next) {
		try {
			const { headers, db } = req
			if (headers && headers.authorization) {
				const authData = headers.authorization.split(' ')
					, session = await db.session.findUnique({ where: { id: Number(authData[0]) } })

				if (!session) throw 'El portador no es válido.'
				if (session.status !== Status.Active) throw 'Sesión de usuario no es válido.'

				const payload = await Auth.verify<IAuthPayload>(authData[1], session.publicKey)
					, user = await db.user.findUnique({ where: { userName: payload.userName } })

				req.user = user
				req.session = session
				
				next()
			} else
				throw 'El usuario no tiene credenciales'
		} catch (error) {
			res.status(500)
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify({ error }))
		}
	}
}
