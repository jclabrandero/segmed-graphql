
export interface AgreementCreateArgs {
	name:				string
  validFrom:	Date
  validTo?:		Date

  providerId:		number
  fileMd5:			string
}
