
import express, { Router } from 'express'

import { home, file, auth } from '../controllers'


export class Routes {
	router: Router

	constructor() {
		this.router = express.Router()

		this.router.get('/', this.getHome())

		this.router.post('/api/file/upload', auth.authorized, file.upload)
	}

	getHome() { return home.index }

}
