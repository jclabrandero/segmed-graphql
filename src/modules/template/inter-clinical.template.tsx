
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Interclinical, User } from '@prisma/client'

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
						<InsuredInfo label='Código Titular' ficha={true} insured={insured.holderInsured || insured}/>
						<InsuredInfo label='Código Beneficiario' ficha={false} insured={insured}/>
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

function ProviderTable({ provider }) {
	const { vendorCode, businessName, address, phone } = provider

	return (
		<div>
			<table style={{ width: '100%' }}>
				<tr>
					<td>
						<p>DATOS DEL PROVEEDOR</p>
						<table style={{ border: 'none' }}>
							<tr>
								<td style={{ border: 'none', textAlign: 'right', fontSize: '9' }}>Código Vendor:</td>
								<td style={{ border: 'none', fontSize: '9' }}>{vendorCode}</td>
							</tr>
							<tr>
								<td style={{ border: 'none', textAlign: 'right', fontSize: '9' }}>Señores:</td>
								<td style={{ border: 'none', fontSize: '9' }}>{businessName}</td>
							</tr>
							<tr>
								<td style={{ border: 'none', textAlign: 'right', fontSize: '9' }}>Dirección:</td>
								<td style={{ border: 'none', fontSize: '9' }}>{address}</td>
							</tr>
							<tr>
								<td style={{ border: 'none', textAlign: 'right', fontSize: '9' }}>Telefonos:</td>
								<td style={{ border: 'none', fontSize: '9' }}>{phone}</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
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

function TemplateView({ data, user }: { data, user: User, logo?: FileBuffer }) {
	const { startDate } = data.clinicCare
	const sDate = new Date(startDate)

	const eDate = addBusinessDays(sDate, 5)

	const fsDate = new Intl.DateTimeFormat('es-MX').format(sDate)
	const feDate = new Intl.DateTimeFormat('es-MX').format(eDate)

	return (
		<div>
			<table style={{ width: '100%' }}>
				<tr>
					<td>
						<table>
							<tr>
								<td style={{ width: '35%', border: 'none' }}>
									{/* <img style={{ width: '200px' }} src={`data:${logo.info.mimetype};base64, ${logo.data.toString('base64')}`} /> */}
								</td>
								<td style={{ width: '40%', textAlign: 'center', border: 'none' }}>
									<h6>SERVICIO DE {data.medicalGroup.name.toUpperCase()}</h6>
									<table style={{ width: '100%' }}>
										<tr>
											<td style={{ fontSize: '12px' }}>Nro de Consulta:  {data.clinicCare.id}</td>
										</tr>
									</table>
								</td>
								<td style={{ width: '25%', textAlign: 'center', fontSize: '10', border: 'none' }}>
									<p>{data.clinicCare.medicalOffice.name}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>

			<InsuredTable insured={data.clinicCare.insured} />
			<ProviderTable provider={data.provider}/>

			<table style={{ width: '100%', fontSize: '12px' }}>
				<tr>
					<td>
						<table style={{ border: 'none' }}>
							<tbody>
								<tr>
									<td style={{ border: 'none' }}>
										<p>REALIZAR EL SIGUIENTE SERVICIO:</p>
										{
											data.specialties.map((em) => (
												<div key={`${em.medicalSpecialty.id}`}>
													<label>{ em.medicalSpecialty.name }</label>
													{
														(em.subspecialties.length > 0) ?
															<ul>
																{
																	em.subspecialties.map(srv => (
																		<li key={`${em.medicalSpecialty.id}-${srv.medicalSubspecialty.id}`}>{ srv.medicalSubspecialty.name }</li>
																	))
																}
															</ul>
															: null
													}
												</div>
											))
										}
									</td>
								</tr>
								<tr>
									<td style={{ border: 'none' }}>
										<p>OBSERVACIONES:</p>
										<span>{data.remark}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</table>

			<div>
				<table style={{ width: '100%', border: 'none' }}>
					<tr>
						<td style={{ fontSize: '12px', border: 'none', colSpan: '2' }}>
							<p>Fecha de Solicitud: {fsDate}</p>
							<p>Orden Valida hasta fecha: {feDate}</p></td>
					</tr>
					<tr>
						<td style={{ width: '70%', border: 'none', fontSize: '9px' }}>impreso por: {user.userName}</td>
						<td style={{ width: '30%', fontSize: '12px', textAlign: 'center', border: 'none', borderTop: '1px solid black' }}>
							<p>Firma del Dr. Cimar Casanova</p>
						</td>
					</tr>
					<tr>
						<td style={{ border: 'none', colSpan: '2', fontSize: '9px' }}><p>Este formulario debe ser enviado adjuntando el informe de la atencion y factura a nombre de PAN AMERICAN SILVER BOLIVIA S.A. - NIT 1002673025</p></td>
					</tr>
				</table>
			</div>
		</div>
	)
}

export class InterclinicalTemplate extends Template {

	async make(data: Interclinical, user: User) {
		// const logo: FileBuffer = {} as FileBuffer
		const html = renderToString(<TemplateView data={data} user={user}/>)
		return this.build(html)
	}

}
