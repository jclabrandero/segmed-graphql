
import { JSDOM } from 'jsdom'
import htmlToPdfmake from 'html-to-pdfmake'
import PdfPrinter from 'pdfmake'


export class Template {
	private fonts = {
		Roboto: {
			normal: 'resources/fonts/Roboto-Regular.ttf',
			bold: 'resources/fonts/Roboto-Bold.ttf',
			italics: 'resources/fonts/Roboto-Italic.ttf',
			bolditalics: 'resources/fonts/Roboto-BoldItalic.ttf',
		}
	}

	async toBuffer(pdfDoc) {
		return new Promise<Buffer>(resolve => {
			const buffs: unknown[] = []
			pdfDoc.on('data', function (data: readonly Uint8Array[]) {
			  buffs.push(data)
			})
			pdfDoc.on('end', function () {
			  resolve(Buffer.concat(buffs as readonly Uint8Array[]))
			})
			pdfDoc.end()
		})
	}

	async build(html: string) {
		const { window } = new JSDOM('')
		const content = htmlToPdfmake(html, { window, tableAutoSize: true })

		const docDefinition = {
			// header: (await header(saveFileDto))?.header,
			content,
			footer: function(currentPage, pageCount) { 
				return { 
					text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount, 
					alignment: 'right',
					margin: [0, 0, 40, 20],
					fontSize:10
				}
			},
		}

		const printer = new PdfPrinter(this.fonts)
		const pdfDoc = printer.createPdfKitDocument(docDefinition)

		return await this.toBuffer(pdfDoc)
	}
}
