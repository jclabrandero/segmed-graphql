
import { PrismaClient, User } from '@prisma/client'
import { Auth } from '../classes'
import { withAuditForCreate } from '../functions'


const data = {
	permisos: [
		{ code: 'SEGMED', description: 'Acceso básico' },

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
		},
		{
			group: {
				name: 'Médicos',
				description: 'Médico de atención en clínica',
			},
			permissions: [
				'SEGMED'
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
			password: 'company',
			groups: ['Administradores']
		},
		{
			user: {
				userName: 'medico',
				displayName: 'Medina',
				email: 'medina@company.com'
			},
			password: 'medina',
			groups: ['Médicos']
		}
	],

	ext: require('./demo-data.json')
}

async function create(iterable, model, title, user: User) {
	console.log('...Creando', title)
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
	console.log('...Creando autorizacion')

	const user = await client.user.create({
		data: {
			userName: 'sys'
		}
	})

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
		const groups = await client.group.findMany()
		//const adminGroup = await client.group.findUnique({ where: { name: 'Administradores' }})
		for (const seed of data.usuarios) {
			await client.user.create({
				data: {
					...seed.user,
					passwords: {
						create: [{ encrypted: await Auth.hash(seed.password) }]
					},
					groups: {
						create: seed.groups.map(grp => withAuditForCreate(user, { groupId: groups.find(g => g.name == grp).id}))
						//[withAuditForCreate(user, { groupId: adminGroup.id })]
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	return user
}

async function createCatalog(client: PrismaClient, user: User) {
	console.log('...Creando catalogo')

	await create(data.ext.personDocumentTypes, client.personDocumentType, 'personDocumentTypes', user)
	await create(data.ext.employeePositions, client.employeePosition, 'employeePositions', user)
	await create(data.ext.employeeTypes, client.employeeType, 'employeeTypes', user)
	await create(data.ext.insuredTypes, client.insuredType, 'insuredTypes', user)
	await create(data.ext.medicalSubspecialties, client.medicalSubspecialty, 'medicalSubspecialties', user)

	console.log('...Creando medicalSpecialties')
	try {
		const subspecialties = await client.medicalSubspecialty.findMany()
		for (const seed of data.ext.medicalSpecialties) {
			await client.medicalSpecialty.create({
				data: {
					...withAuditForCreate(user, seed.specialty),
					subspecialties: {
						create: seed.subspecialties.map(subspecialtyName => withAuditForCreate(user, { medicalSubspecialtyId: subspecialties.find(ss => ss.name == subspecialtyName).id }))
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	console.log('...Creando medicalGroups')
	try {
		const specialties = await client.medicalSpecialty.findMany()
		for (const seed of data.ext.medicalGroups) {
			await client.medicalGroup.create({
				data: {
					...withAuditForCreate(user, seed.group),
					specialties: {
						create: seed.specialties.map(specialtyName => withAuditForCreate(user, { medicalSpecialtyId: specialties.find(ss => ss.name == specialtyName).id }))
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	await create(data.ext.drugClasess, client.drugClass, 'drugClasess', user)
	await create(data.ext.drugUnits, client.drugUnit, 'drugUnits', user)
	await create(data.ext.clinicalCareStates, client.clinicalCareState, 'clinicalCareStates', user)
}

async function createReference(client: PrismaClient, user: User) {
	console.log('...Creando referencias')

	await create(data.ext.belongings, client.belonging, 'belonging', user)
	const belongings = await client.belonging.findMany()

	console.log('...Creando consultorios')
	try {
		for (const seed of data.ext.medicalOffices) {
			await client.medicalOffice.create({
				data: {
					...withAuditForCreate(user, seed.medicalOffice),
					belongingId: belongings.find(b => b.name == seed.belonging).id
				}
			})
		}
	} catch (error) {
		console.log(error)
	}
}

async function createFolk(client: PrismaClient, user: User) {
	console.log('...Creando Identidades')

	const insuredTypes = await client.insuredType.findMany()
	const belongings = await client.belonging.findMany()

	console.log('...Creando injureds')
	try {
		for await (const seed of data.ext.insureds) {
			const { creatorUserName, ...payload } = withAuditForCreate(user, seed.insured)
			await client.insured.create({
				data: {
					...payload,
					creatorUser: {
						connect: {
							userName: creatorUserName
						}
					},
					person: {
						create: {
							...withAuditForCreate(user, seed.person.flat),
							documentNumber: seed.person.documentNumber,
							personDocumentTypeId: seed.person.documentNumber ? 1 : undefined
						}
					},
					insuredType: {
						connect: {
							id: insuredTypes.find(it => it.name == seed.insuredType).id
						}
					},
					belonging: {
						connect: {
							id: belongings.find(b => b.name == seed.belonging).id
						}
					},
					holderInsured: seed.holderInsuredIIN ? {
						connect: {
							id: (await client.insured.findFirst({ where: { iin: seed.holderInsuredIIN }})).id
						}
					} : undefined
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	console.log('...Creando clerks')
	try {
		const employeeTypes = await client.employeeType.findMany()
		const positions = await client.employeePosition.findMany()
		const medicalOffices = await client.medicalOffice.findMany()

		for await (const seed of data.ext.clerks) {
			const { creatorUserName, ...payload } = withAuditForCreate(user, seed.clerk)
			await client.clerk.create({
				data: {
					...payload,
					creatorUser: {
						connect: {
							userName: creatorUserName
						}
					},
					person: {
						create: {
							...withAuditForCreate(user, seed.person.flat),
							documentNumber: seed.person.documentNumber,
							personDocumentTypeId: seed.person.documentNumber ? 1 : undefined
						}
					},
					employeeType: {
						connect: {
							id: employeeTypes.find(et => et.name == seed.employeeType).id
						}
					},
					position: {
						connect: {
							id: positions.find(ep => ep.name == seed.position).id
						}
					},
					medicalOffices: {
						create: seed.medicalOffices.map(moRef => (withAuditForCreate(user, {
							medicalOfficeId: medicalOffices.find(mo => mo.name == moRef).id
						})))
					}
				}
			})
		}
	} catch (error) {
		console.log(error)
	}
}

async function createDrugstore(client: PrismaClient, user: User) {
	console.log('...Creando Almacenes')

	console.log('...Creando medications')
	try {
		for await (const payload of data.ext.medications) {
			const drugClass = await client.drugClass.findUnique({ where: { name: payload.class }})
			const drugUnit = await client.drugUnit.findUnique({ where: { name: payload.unit }})

			await client.medication.create({
				data: {
					...withAuditForCreate(user, payload.medication),
					classId: drugClass.id,
					unitId: drugUnit.id
				}
			})
		}
	} catch (error) {
		console.log(error)
	}

	console.log('...Creando pharmacies')
	try {
		const belongings = await client.belonging.findMany()
		const medications = await client.medication.findMany()
		for await (const payload of data.ext.pharmacies) {

			await client.pharmacy.create({
				data: {
					...withAuditForCreate(user, payload.parmacy),
					belongingId: belongings.find(b => b.name == payload.belonging).id,
					inventory: {
						create: payload.inventory.map(inv => withAuditForCreate(user, {
							...inv.item,
							medicationId: medications.find(m => m.code == inv.medication).id
						}))
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

	const user = await createAutorizacion(client)
	await createCatalog(client, user)
	await createReference(client, user)
	await createFolk(client, user)
	await createDrugstore(client, user)
}

build()
