
import { PrismaClient, User } from '@prisma/client'
import { Auth } from '../classes'
import { withAuditForCreate } from '../functions'


const data = {
	permisos: [
		{ code: 'SEGMED', name: 'BasicPermission', description: 'Acceso básico' },

		{ code: 'R_PRMSSN', name: 'ReadPermission', description: 'Lectura de permisos' },
		{ code: 'R_GRP', name: 'ReadGroup', description: 'Lectura de grupos' },
		{ code: 'W_GRP', name: 'WriteGroup', description: 'Escritura de grupos' },
		{ code: 'R_USR', name: 'ReadUser', description: 'Lectura de usuarios' },
		{ code: 'W_USR', name: 'WriteUser', description: 'Escritura de usuarios' },

		{ code: 'R_PDT', name: 'ReadPersonDocumentType', description: 'Lectura de tipos de documento identidad' },
		{ code: 'W_PDT', name: 'WritePersonDocumentType', description: 'Escritura de tipos de documento identidad' },
		{ code: 'R_EMP', name: 'ReadEmployeeType', description: 'Lectura de cargos de funcionarios' },
		{ code: 'W_EMP', name: 'WriteEmployeeType', description: 'Escritura de cargos de funcionarios' },
		{ code: 'R_EMT', name: 'ReadEmployeePosition', description: 'Lectura de tipos de funcionarios' },
		{ code: 'W_EMT', name: 'WriteEmployeePosition', description: 'Escritura de tipos de funcionarios' },
		{ code: 'R_INT', name: 'ReadInsuredType', description: 'Lectura de tipos de beneficiarios' },
		{ code: 'W_INT', name: 'WriteInsuredType', description: 'Escritura de tipos de beneficiarios' },
		{ code: 'R_MDGRP', name: 'ReadMedicalGroup', description: 'Lectura de unidades médicas' },
		{ code: 'W_MDGRP', name: 'WriteMedicalGroup', description: 'Escritura de unidades médicas' },
		{ code: 'R_MDSPC', name: 'ReadMedicalSpecialty', description: 'Lectura de especialidades médicas' },
		{ code: 'W_MDSPC', name: 'WriteMedicalSpecialty', description: 'Escritura de especialidades médicas' },
		{ code: 'R_MDSSP', name: 'ReadMedicalSubspecialty', description: 'Lectura de sub-especialidades médicas' },
		{ code: 'W_MDSSP', name: 'WriteMedicalSubspecialty', description: 'Escritura de sub-especialidades médicas' },
		{ code: 'R_DRGCLS', name: 'ReadDrugClass', description: 'Lectura de clases de medicamentos' },
		{ code: 'W_DRGCLS', name: 'WriteDrugClass', description: 'Escritura de clases de medicamentos' },
		{ code: 'R_DRGUNT', name: 'ReadDrugUnit', description: 'Lectura de unidades de medicamentos' },
		{ code: 'W_DRGUNT', name: 'WriteDrugUnit', description: 'Escritura de unidades de medicamentos' },
		{ code: 'R_CLNCRST', name: 'ReadClinicalCareState', description: 'Lectura de estados de consultas' },
		{ code: 'W_CLNCRST', name: 'WriteClinicalCareState', description: 'Escritura de estados de consultas' },
		{ code: 'R_DSBLTT', name: 'ReadDisabilityType', description: 'Lectura de tipos de discapacidades' },
		{ code: 'W_DSBLTT', name: 'WriteDisabilityType', description: 'Escritura de tipos de discapacidades' },

		{ code: 'R_PRSN', name: 'ReadPerson', description: 'Lectura de personas' },
		{ code: 'W_PRSN', name: 'WritePerson', description: 'Escritura de personas' },
		{ code: 'R_CLRK', name: 'ReadClerk', description: 'Lectura de funcionarios' },
		{ code: 'W_CLRK', name: 'WriteClerk', description: 'Escritura de funcionarios' },
		{ code: 'R_NSRD', name: 'ReadInsured', description: 'Lectura de beneficiarios' },
		{ code: 'W_NSRD', name: 'WriteInsured', description: 'Escritura de beneficiarios' },

		{ code: 'R_BLNG', name: 'ReadBelonging', description: 'Lectura de pertinencias' },
		{ code: 'W_BLNG', name: 'WriteBelonging', description: 'Escritura de pertinencias' },
		{ code: 'R_MDOF', name: 'ReadMedicalOffice', description: 'Lectura de consultorios' },
		{ code: 'W_MDOF', name: 'WriteMedicalOffice', description: 'Escritura de consultorios' },
		{ code: 'R_PRVD', name: 'ReadProvider', description: 'Lectura de proveedores' },
		{ code: 'W_PRVD', name: 'WriteProvider', description: 'Escritura de proveedores' },

		{ code: 'R_MDCTN', name: 'ReadMedication', description: 'Lectura de medicamentos' },
		{ code: 'W_MDCTN', name: 'WriteMedication', description: 'Escritura de medicamentos' },
		{ code: 'R_PHRMC', name: 'ReadPharmacy', description: 'Lectura de farmacias' },
		{ code: 'W_PHRMC', name: 'WritePharmacy', description: 'Escritura de farmacias' },
		{ code: 'R_BTCH', name: 'ReadBatch', description: 'Lectura de lotes' },
		{ code: 'W_BTCH', name: 'WriteBatch', description: 'Escritura de lotes' },
		{ code: 'R_INVT', name: 'ReadInventory', description: 'Lectura de inventarios' },
		{ code: 'W_INVT', name: 'WriteInventory', description: 'Escritura de inventarios' },
		{ code: 'AP_ARVL', name: 'ApproveArrival', description: 'Aprobación de ingresos de medicamentos' },

		{ code: 'R_CLNCR', name: 'ReadClinicCare', description: 'Lectura de consultas médicas' },
		{ code: 'W_CLNCR', name: 'WriteClinicCare', description: 'Escritura de consultas médicas' },
		{ code: 'AP_ML', name: 'ApprovalMedicalLeave', description: 'Aprobación de bajas médicas' }
	],
	grupos: [
		{
			group: {
				name: 'Administradores',
				description: 'Administrador del sistema',
			},
			permissions: [
				'R_PRMSSN', 'R_GRP', 'W_GRP', 'R_USR', 'W_USR', 'R_CLRK'
			]
		},
		{
			group: {
				name: 'Médicos',
				description: 'Médico de atención en clínica',
			},
			permissions: [
				'SEGMED', 'R_CLNCRST', 'R_BLNG', 'R_NSRD', 'R_CLNCR', 'W_CLNCR', 'R_MDGRP', 'R_PRVD', 'R_PHRMC', 'R_MDCTN'
			]
		},
		{
			group: {
				name: 'Administradores de catálogos',
			},
			permissions: [
				'R_PDT', 'W_PDT', 'R_EMP', 'W_EMP', 'R_EMT', 'W_EMT', 'R_INT', 'W_INT', 'R_MDGRP', 'W_MDGRP', 'R_MDSPC', 'W_MDSPC',
				'R_MDSSP', 'W_MDSSP', 'R_DRGCLS', 'W_DRGCLS', 'R_DRGUNT', 'W_DRGUNT', 'R_CLNCRST', 'W_CLNCRST', 'R_DSBLTT', 'W_DSBLTT'
			]
		},
		{
			group: {
				name: 'Administradores de almacenes',
			},
			permissions: [
				'R_MDCTN', 'W_MDCTN', 'R_PHRMC', 'W_PHRMC', 'R_INVT', 'W_INVT', 'R_BTCH', 'W_BTCH'
			]
		},
		{
			group: {
				name: 'Administradores de referencias',
			},
			permissions: [
				'R_BLNG', 'W_BLNG', 'R_MDOF', 'W_MDOF', 'R_PRVD', 'W_PRVD'
			]
		},
		{
			group: {
				name: 'Administradores de identidades',
			},
			permissions: [
				'R_PRSN', 'W_PRSN', 'R_CLRK', 'W_CLRK', 'R_NSRD', 'W_NSRD'
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
				userName: 'mmedina',
				displayName: 'Medina',
				email: 'mmedina@company.com'
			},
			password: 'company',
			groups: ['Médicos']
		},
		{
			user: {
				userName: 'pperez',
				displayName: 'Perez',
				email: 'pperez@company.com'
			},
			password: 'company',
			groups: [
				'Administradores de catálogos',
				'Administradores de almacenes',
				'Administradores de referencias',
				'Administradores de identidades'
			]
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
