import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
 
import { ClinicCare, User } from '@prisma/client'
 
import { FileBuffer } from '../../support/types'
import { Template } from '../../support/classes'


function InsuredInfo({ label, insured, ficha }) {
	const { firstName, lastName } = insured.person
	const labelStyle = { fontSize: '9', border: 'none', textAlign: 'right' }
	const filedStyle = { fontSize: '9', border: 'none' }

	return (
		<tr>
			<td style={labelStyle}>{label}:</td>
			<td style={filedStyle}>{insured.code}</td>
			<td style={labelStyle}>Nombre:</td>
			<td style={filedStyle}>{firstName} {lastName}</td>
			{
				ficha
					? <td style={labelStyle}>Ficha: {insured.iin}</td>
					: <td style={filedStyle}></td>
			}
		</tr>
	)
}
 
function InsuredTable({ insured }) {
	return (
		<table style={{ width: '100%' }}>
			<tr>
				<td>
					<p>DATOS DEL PACIENTE</p>
					<table style={{ border: 'none' }}>
						<InsuredInfo label='Código Beneficiario' ficha={false} insured={insured}/>
						<InsuredInfo label='Código Titular' ficha={true} insured={insured.holderInsured || insured}/>
						<tr>
							<td style={{ textAlign: 'right', fontSize: '9', border: 'none' }}>Pertinencia:</td>
							<td style={{ fontSize: '9', border: 'none', colSpan: '4' }}>{insured.belonging.name}</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	)
}
 
function addBusinessDays(date, days) {
	const result = new Date(date)
	let count = 0
	while (count < days) {
		result.setDate(result.getDate() + 1)
		if (result.getDay() !== 0 && result.getDay() !== 6) { // 0: Domingo, 6: Sábado
			count++
		}
	}
	return result
}
 
function RecetaMedicaView({ data, user, logo }: { data, user, logo?: FileBuffer }) {
	const clinicCare = data
	let { startDate: fechaInicio } = clinicCare
	fechaInicio = new Date(fechaInicio)
 
	// Sumar 5 días hábiles
	const fechaFinal = addBusinessDays(fechaInicio, 5)
 
	// Formatear las fechas
	fechaInicio = new Intl.DateTimeFormat('es-MX').format(fechaInicio)
	const fechaFinal2 = new Intl.DateTimeFormat('es-MX').format(fechaFinal)
	const dataset = clinicCare.prescriptions || clinicCare.prescriptionExterns
 
	return (
		<div>
			<table style={{ width: '100%' }}>
				<tr>
					<td>
						<table>
							<tr>
								<td style={{ width: '35%', border: 'none' }}>
									{logo && <img src={`data:image/jpeg;base64,${logo.data.toString('base64')}`} alt="Logo" style={{ width: '200px' }} />}
								</td>
								<td style={{ width: '40%', textAlign: 'center', border: 'none' }}>
									<h6>RECETA MEDICA</h6>
									<table style={{ width: '100%' }}>
										<tr>
											<td style={{ fontSize: '12px' }}>Nro de Consulta:  {clinicCare.id}</td>
										</tr>
									</table>
								</td>
								<td style={{ width: '25%', textAlign: 'center', fontSize: '10', border: 'none' }}>
									<p>{clinicCare.medicalOffice.name}</p>
									<p style={{ fontSize: '8'}}>impreso por: {user.userName}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
 
			<InsuredTable insured={clinicCare.insured} />
 
			<table style={{ width: '100%', fontSize: '12px', border: 'none' }}>
				<tr>
					<td>
						<table style={{ border: 'none' }}>
							<tr>
								<th style={{ width: '15%', border: 'none' }}>Codigo</th>
								<th style={{ width: '35%', border: 'none' }}>Descripcion</th>
								<th style={{ width: '40%', border: 'none' }}>Concentracion - Presentacion</th>
								<th style={{ width: '10%', border: 'none' }}>Cantidad</th>
							</tr>
							{
								dataset.map(({ medication, quantity }, i) => (
									<tr key={i}>
										<td style={{ border: 'none' }}>{medication.code}</td>
										<td style={{ border: 'none' }}>{medication.name}</td>
										<td style={{ border: 'none' }}>{medication.concentration} - {medication.unit.name}</td>
										<td style={{ border: 'none' }}>{quantity}</td>
									</tr>
								))
							}
						</table>
					</td>
				</tr>
			</table>
 
			<div>
				<table style={{ width: '100%', border: 'none' }}>
					<tr>
						<td style={{ fontSize: '10px', border: 'none', colSpan: '3'}}>
							<p>Fecha de Solicitud: {fechaInicio} - Orden Valida hasta fecha: {fechaFinal2}</p></td>
					</tr>
					<tr>
						<td style={{border: 'none', colSpan: '3'}}>
							<p>&nbsp;</p></td>
					</tr>
					<tr>
						<td style={{ width: '30%', fontSize: '12px', textAlign: 'center', border: 'none', borderTop: '1px solid black' }}>
							<p>Firma {data.insured.person.firstName} {data.insured.person.lastName}</p>
						</td>
						<td style={{ width: '40%', fontSize: '12px', textAlign: 'center', border: 'none'}}>
							<p></p></td>
						<td style={{ width: '30%', fontSize: '12px', textAlign: 'center', border: 'none', borderTop: '1px solid black' }}>
							<p>Firma {data.creatorUser.displayName}</p>
						</td>
					</tr>
					<tr>
						<td style={{ border: 'none', fontSize: '9px', colSpan: '3'}}><p>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</p></td>
					</tr>
				</table>
			</div>
 
			<table style={{ width: '100%' }}>
				<tr>
					<td>
						<table>
							<tr>
								<td style={{ width: '35%', border: 'none' }}>
									{logo && <img src={`data:image/jpeg;base64,${logo.data.toString('base64')}`} alt="Logo" style={{ width: '200px' }} />}
								</td>
								<td style={{ width: '40%', textAlign: 'center', border: 'none' }}>
									<h6>RECETA MEDICA - COPIA BENEFICIARIO</h6>
									<table style={{ width: '100%' }}>
										<tr>
											<td style={{ fontSize: '12px' }}>Nro de Consulta:  {clinicCare.id}</td>
										</tr>
									</table>
								</td>
								<td style={{ width: '25%', textAlign: 'center', fontSize: '10', border: 'none' }}>
									<p>{clinicCare.medicalOffice.name}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
 
			<InsuredTable insured={clinicCare.insured} />
 
			<table style={{ width: '100%', fontSize: '12px',  border: 'none'}}>
				<tr>
					<td>
						<table>
							<tr>
								<th style={{ width: '15%', border: 'none' }}>Codigo</th>
								<th style={{ width: '35%', border: 'none' }}>Descripcion</th>
								<th style={{ width: '40%', border: 'none' }}>Concentracion - Presentacion</th>
								<th style={{ width: '10%', border: 'none' }}>Cantidad</th>
							</tr>
							{
								dataset.map(({ medication, quantity, indications }, i) => (
									<tbody key={i}>
										<tr>
											<td style={{ border: 'none' }}>{medication.code}</td>
											<td style={{ border: 'none' }}>{medication.name}</td>
											<td style={{ border: 'none' }}>{medication.concentration} - {medication.unit.name}</td>
											<td style={{ border: 'none' }}>{quantity}</td>
										</tr>
										<tr style={{ borderBottom: '1px solid black' }}>
											<td style={{ border: 'none' }}>Indicaciones:</td>
											<td style={{ border: 'none', colSpan: '3' }}>{indications}</td>
										</tr>
									</tbody>
								))
							}
						</table>
					</td>
				</tr>
			</table>
		</div >
	)
}

export class PrescriptionTemplate extends Template {
	async make(data: ClinicCare, user: User) {
		// const logo: FileBuffer = {} as FileBuffer
		const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo_seguro.jpg') // aca viene la ruta del logo
		const logoBuffer = fs.readFileSync(logoPath)
		const logoFileBuffer: FileBuffer = {
			info: {
				md5: 'md5hash', // Se puede calcular el hash MD5 si es necesario
				name: 'logo.jpg',
				type: 'image/jpeg',
				extension: 'jpg'
			},
			data: logoBuffer
		}
		const html = renderToString(<RecetaMedicaView data={data} user={user} logo={logoFileBuffer} />)
		return this.buildFromHTML(html)
	}
}
