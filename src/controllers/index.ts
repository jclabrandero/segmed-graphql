
import { HomeController } from './home.controller'
import { FileController } from './file.controller'
import { AuthController } from './auth.controller'

const home: HomeController = new HomeController()
const file: FileController = new FileController()
const auth: AuthController = new AuthController()

export {
	home,
	file,
	auth
}
