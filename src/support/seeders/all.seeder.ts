
import { PrismaClient, User } from '@prisma/client'
import { Auth } from '../classes'
import { withAuditForCreate } from '../functions'


const data = {
	permisos: [
		{ code: 'R_PRMSSN', description: 'Lectura de permisos' },

		{ code: 'R_GRP', description: 'Lectura de grupos' },
		{ code: 'W_GRP', description: 'Escritura de grupos' },

		{ code: 'R_USR', description: 'Lectura de usuarios' },
		{ code: 'W_USR', description: 'Escritura de usuarios' },

		{ code: 'R_PDT', description: 'Lectura de tipos de documento identidad' },
		{ code: 'W_PDT', description: 'Escritura de tipos de documento identidad' },

		{ code: 'R_PRSN', description: 'Lectura de personas' },
		{ code: 'W_PRSN', description: 'Escritura de personas' }
	],
	grupos: [
		{
			group: {
				name: 'Administradores',
				description: 'Administrador del sistema',
			},
			permissions: [
				'R_PRMSSN', 'R_GRP', 'W_GRP', 'R_USR', 'W_USR'
			]
		}
	],
	usuarios: [
		{
			user: {
				userName: 'admin',
				displayName: 'Administrador',
				email: 'admin@company.com'
			},
			password: 'company'
		}
	],

	tiposDocumentoIdentidad: [
		{ name: 'CI', description: 'Cédula de Identidad' }
	],
}

async function create(iterable, model, title, user: User) {
	console.log('...CREANDO', title)
	try {
		for (const seed of iterable) {
			await model.create({
				data: withAuditForCreate(user, seed)
			})
		}
		console.log(title, 'CORRECTO!')
	} catch (error) {
		console.log(title, 'ERROR!')
		console.log(error)
	}
}

async function createAutorizacion(client: PrismaClient) {
	const user = { userName: 'admin' } as User

	console.log('...Creando autorizacion')

	try {
		for (const seed of data.permisos) {
			await client.permission.create({
				data: { ...seed }
			})
		}
	} catch (error) {
		console.log(error)
	}

	try {
		const permissions = await client.permission.findMany()

		for (const seed of data.grupos) {
			await client.group.create({
				data: {
					...withAuditForCreate(user as User, seed.group),
					permissions: {
						create: seed.permissions.map(code => withAuditForCreate(user, { permissionId: permissions.find(p => p.code === code).id }))
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	try {
		const adminGroup = await client.group.findUnique({ where: { name: 'Administradores' }})
		for (const seed of data.usuarios) {
			await client.user.create({
				data: {
					...seed.user,
					passwords: {
						create: [{ encrypted: await Auth.hash(seed.password) }]
					},
					groups: {
						create: [{ groupId: adminGroup.id }]
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}
}

async function createCatalogo(client: PrismaClient, user: User) {
	console.log('...Creando catalogo')
	await create(data.tiposDocumentoIdentidad, client.personDocumentType, 'tiposDocumentoIdentidad', user)
}

async function build() {
	const client: PrismaClient = new PrismaClient()

	await createAutorizacion(client)
	const user = await client.user.findUnique({ where: { userName: 'admin' }})
	await createCatalogo(client, user)
}

build()
