
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

export function MedicalLeaveView({ data, user }: { data, user: User, logo?: FileBuffer }) {
	
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
									<h6>CERTIFICADO DE INCAPACIDAD TEMPORAL</h6>
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
			
			<table style={{ width: '100%', fontSize: '12px' }}>
				<tr>
					<td>
						<table style={{ border: 'none' }}>
							<tbody>
								<tr>
									<td style={{ border: 'none' }}>
										<p>DATOS DE LA INCAPACIDAD:</p>
										{
											data.medicalGroup.specialties.map((specialty) => (
												<div key={`${specialty.id}`}>
													<label>{ specialty.name }</label>
													{
														(specialty.subspecialties.length > 0) ?
															<ul>
																{
																	specialty.subspecialties.map(sbsp => (
																		<li key={`${specialty.id}-${sbsp.id}`}>{ sbsp.name }</li>
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

export class MedicalLeaveTemplate extends Template {

	async make(data: Interclinical, user: User) {
		// const logo: FileBuffer = {} as FileBuffer
		const html = renderToString(<MedicalLeaveView data={data} user={user}/>)
		return this.build(html)
	}

}
