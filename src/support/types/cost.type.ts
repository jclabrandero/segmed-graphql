import { Decimal } from '@prisma/client/runtime/library'

export interface AgreementCreateArgs {
	name:				string
  validFrom:	Date
  validTo?:		Date

  providerId:		number
  fileMd5:			string
}

export interface TariffCreateArgs {
	
    currencyUMA:    number
    exchangeRate:   Decimal
    priceBs:        Decimal

    agreementId:   number
    providerMedicalSpecialtyId:     number
    providerMedicalSubspecialtyId?: number

}

export interface InterclinicalCostCreateArgs {
  invoiceNumber: number
  invoiceDate: Date
  invoiceTotalRefPrice:	Decimal

  providerId: number
}
