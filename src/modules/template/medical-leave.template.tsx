import fs from 'fs'
import path from 'path'
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

export function MedicalLeaveView({ data, user, logo }: { data, user: User, logo?: FileBuffer }) {
	
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
									<h6>CERTIFICADO DE INCAPACIDAD TEMPORAL</h6>
									<table style={{ width: '100%' }}>
										<tr>
											<td style={{ fontSize: '12px' }}>Nro de Consulta:  {data.clinicCare.id}</td>
										</tr>
									</table>
								</td>
								<td style={{ width: '25%', textAlign: 'right', fontSize: '10', border: 'none' }}>
									<p style={{fontSize: '9'}}>{data.clinicCare.medicalOffice.medicalOfficeName}</p>
									<p style={{fontSize: '8'}}>impreso por: {user.userName}</p>
									<p style={{fontSize: '8'}}>{new Date(data.startDate).toLocaleDateString()}</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>

			<InsuredTable insured={data.clinicCare.insured.insured} />
			
			<table style={{ width: '100%', fontSize: '12px' }}>
				<tr>
					<td>
						<table style={{ border: 'none' }}>
							<tbody>
								<tr>
									<td style={{ border: 'none' }}>
										<p>DATOS DE LA INCAPACIDAD:</p>
										<span>{data.disabilityType.name}</span>
									</td>
								</tr>
								<tr>
									<td style={{ border: 'none' }}>
										<p>DIAGNOSTICO:</p>
										<span>{data.reason}</span>
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
						<td style={{ fontSize: '10px', border: 'none', colSpan: '3'}}></td>
					</tr>
					<tr>
						<td style={{border: 'none', colSpan: '3'}}>
							<p style={{fontSize: '9'}}>Fecha de baja del {new Date(data.startDate).toLocaleDateString()} al {new Date(data.endDate).toLocaleDateString()}  </p>
							<p style={{fontSize: '9'}}>Total de días de baja: {Math.ceil((new Date(new Date(data.endDate).getTime() + (1000 * 60 * 60 * 24)).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
						</td>
					</tr>
					<tr>
						<td style={{border: 'none', colSpan: '3'}}>
							<p>&nbsp;</p></td>
					</tr>
					<tr>
						<td style={{border: 'none', colSpan: '3'}}>
							<p>&nbsp;</p></td>
					</tr>
					<tr>
						<td style={{ width: '30%', fontSize: '12px', textAlign: 'center', border: 'none', borderTop: '1px solid black' }}>
							<p>Firma {data.clinicCare.insured.personFirstName} {data.clinicCare.insured.personLastName}</p>
						</td>
						<td style={{ width: '40%', fontSize: '12px', textAlign: 'center', border: 'none'}}>
							<p></p></td>
						<td style={{ width: '30%', fontSize: '12px', textAlign: 'center', border: 'none', borderTop: '1px solid black' }}>
							<p>Firma {data.clinicCare.creatorUser.displayName}</p>
						</td>
					</tr>
				</table>
			</div>
		</div>
	)
}

export class MedicalLeaveTemplate extends Template {

	async make(data: Interclinical, user: User) {
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
        	const html = renderToString(<MedicalLeaveView data={data} user={user} logo={logoFileBuffer} />)
        	return this.buildFromHTML(html)
	}

}
