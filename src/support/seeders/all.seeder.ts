
import { PrismaClient } from '@prisma/client'
import { Auth } from '../classes'


const data = {
	permisos: [
		{ code: 'R_PRMSSN', description: 'Lectura de permisos' },

		{ code: 'R_GRP', description: 'Lectura de grupos' },
		{ code: 'W_GPR', description: 'Escritura de grupos' },

		{ code: 'R_USR', description: 'Lectura de usuarios' },
		{ code: 'W_USR', description: 'Escritura de usuarios' },
	],
	grupos: [
		{
			group: {
				name: 'Administradores',
				description: 'Administrador del sistema',
			},
			permissions: [
				'R_PRMSSN', 'R_GRP', 'W_GPR', 'R_USR', 'W_USR'
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
}


async function createAutorizacion(client: PrismaClient) {
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
					...seed.group,
					permissions: {
						create: seed.permissions.map(code => ({ permissionId: permissions.find(p => p.code === code).id }))
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

async function build() {
	const client: PrismaClient = new PrismaClient()

	await createAutorizacion(client)
}

build()
