
import { Inventory } from '@prisma/client'

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
		const tabledata: Array<Array<{ text: string, style?: string }>> = [
			[
				{ text: 'Código', style: 'tableHeader' },
				{ text: 'Nombre Medicamento', style: 'tableHeader' },
				{ text: 'Unidad', style: 'tableHeader' },
				{ text: 'Concentración', style: 'tableHeader' }
			],
		]
		for (const { medication } of data) {
			tabledata.push([
				{ text: medication.code, style: 'tableRow' },
				{ text: medication.name, style: 'tableRow' },
				{ text: medication.unit.name, style: 'tableRow' },
				{ text: medication.concentration, style: 'tableRow' }
			])
		}
		const buffer = await template.build({
			pageSize: 'LETTER',
			pageMargins: [30, 30, 30, 40],
			pageOrientation: 'landscape',
			header: (currentPage) => {
				return [
					{
						columns: [
							{
								text: 'CIERRE MENSUAL SALDOS - MEDICAMENTOS'
							},
							{
								text: `Pagina ${currentPage}`
							}
						]
					},
				]
			},
			content: [
				{
					table: {
						widths: '*',
						body: tabledata
					}
				}
			],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 11,
					color: 'black'
				},
				tableRow: {
					fontSize: 10,
				}
			}
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
