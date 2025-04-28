
import { Inventory } from '@prisma/client'
import path from 'path'
import { Resolver, Template } from '../../../support/classes'
import { Status, SubscriptionEvent } from '../../../support/constants'
import { IContext, IInventoryPrintReportArgs } from '../../../support/types'

export class InventoryResolver extends Resolver {
	constructor() {
		super(SubscriptionEvent.Pharmacy)
	}

	async index(_, { pharmacyId }: { pharmacyId: number }, { db }: IContext): Promise<Array<Inventory>> {
		return await db.inventory.findMany({
			where: {
				pharmacyId,
				NOT: { status: Status.Removed }
			},
			include: {
				pharmacy: true,
				medication: {
					include: {
						unit: true
					}
				}
			}
		})
	}

	async printReport(_, { data: { reportId, pharmacyId } }: { data: IInventoryPrintReportArgs}, context: IContext) {
		if (reportId == 1) return await InventoryResolver.printMontlyCloseMedicationReport(pharmacyId, context)
		if (reportId == 2) return await InventoryResolver.printMontlyCloseSuppplyReport()
	}

	static async printMontlyCloseMedicationReport(pharmacyId: number, { db }: IContext) {
		const data = await db.inventory.findMany({
			where: {
				status: Status.Active,
				pharmacyId,
			},
			include: {
				medication: {
					include: {
						unit: true
					}
				}
			}
		})

		const template = new  Template
		const logoPath = path.join(__dirname, '..', 'src', 'assets', 'logo_seguro.jpg') // Ruta del logo
		const tabledata: Array<Array<{ text: string, style?: string, alignment?: string, fontSize?: string}>> = [
			[
				{ text: 'Código', style: 'tableHeader' },
				{ text: 'Nombre Medicamento', style: 'tableHeader' },
				{ text: 'Unidad', style: 'tableHeader' },
				{ text: 'Concentración', style: 'tableHeader' },
            	{ text: 'Cantidad en Stock', style: 'tableHeader' },
            	{ text: 'Cantidad Contada', style: 'tableHeader' },
            	{ text: 'Diferencia', style: 'tableHeader' }
			],
		]
		
		for (const { medication, stock } of data) {
			tabledata.push([
				{ text: medication.code, style: 'tableRow' },
				{ text: medication.name, style: 'tableRow' },
				{ text: medication.unit.name, style: 'tableRow' },
				{ text: medication.concentration, style: 'tableRow' },
            	{ text: stock.toString(), style: 'tableRow', alignment: 'center', fontSize: '10' }, // Cantidad en Stock
            	{ text: '', style: 'tableRow' }, // Cantidad Contada se llenará manualmente
            	{ text: '', style: 'tableRow' }  // Diferencia se calculará manualmente
			])
		}
		const buffer = await template.build({
			pageSize: 'LETTER',
			pageMargins: [30, 70, 30, 40],
			pageOrientation: 'landscape',
			header: () => {
				return [
					{
						table: {
							widths: ['*', '*', '*'],
							body: [
								[
									{ image: logoPath, width: 150, alignment: 'left' },
									{ text: 'Inventario Físico de Farmacia', alignment: 'center', bold: true, fontSize: 16, margin: [0, 30, 0, 0] },
									{ text: `Fecha: ${new Date().toLocaleDateString()}`, alignment: 'right', margin: [0, 30, 0, 0]}
								]
							],
						},
						margin: [30, 10, 30, 10],
						layout: 'noBorders'
					}
				]
			},
			footer: (currentPage, pageCount) => {
				return {
					columns: [
						{ text: '', alignment: 'left' },
						{ text: '', alignment: 'center' },
						{ text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', margin: [0, 0, 30, 0] }
					]
				}
			},

			content: [
				{
					table: {
						headerRows: 1, // Repetir encabezados en cada página
						dontBreakRows: true,
						widths: [50, 150, 155, 155, 50, 50, 60], // Ajuste de anchos de columnas
						body: tabledata
					},
					margin: [0, 20, 0, 0] // Ajuste de margen para evitar superposición
				},
				{
					text: 'Fecha de Conteo: ........................................',
					margin: [0, 50, 0, 0]
				},
				{
					text: 'Responsable: ........................................',
					margin: [0, 50, 0, 20]
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 11, // Ajuste de tamaño de fuente
					color: 'black',
					alignment: 'center',
					margin: [0, 5, 0, 0],
					fillColor: '#D3D3D3', // Color plomo oscuro
				},
				tableRow: {
					fontSize: 9, // Ajuste de tamaño de fuente
					//margin: [0, 5, 0, 5],
					Height: 1000, // Ajuste de altura de la celda
					//font: 'Helvetica'
				},
				tableRowCenter: {
					fontSize: 9, // Ajuste de tamaño de fuente
					alignment: 'center',
					margin: [0, 5, 0, 5],
					lineHeight: 1.2,
					//font: 'Helvetica' // Ajuste de altura de la celda
				}}
		})
		return {
			info: {
				type: 'application/pdf'
			},
			data: buffer.toString('base64')
		}
	}

	static async printMontlyCloseSuppplyReport() {
		const template = new  Template
		const buffer = await template.build({
			pageSize: 'LETTER',
			pageMargins: [30, 30, 30, 40],
			pageOrientation: 'landscape',
			content: [
				{
					columns: [
						{
							text: 'CIERRE MENSUAL SALDOS - INSUMOS'
						}
					]
				}
			]
		})
		return {
			info: {
				type: 'application/pdf'
			},
			data: buffer.toString('base64')
		}
	}
}
