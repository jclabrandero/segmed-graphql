
enum User {
	CREATED = 'USR-C',
	UPDATED = 'USR-U',
	DELETED = 'USR-D',
	UPSERTED = 'USR-UPSERT'
}

enum Group {
	CREATED = 'GRP-C',
	UPDATED = 'GRP-U',
	DELETED = 'GRP-D',
	UPSERTED = 'GRP-UPSERT'
}


enum PersonDocumentType {
	CREATED = 'PDT-C',
	UPDATED = 'PDT-U',
	DELETED = 'PDT-D',
	UPSERTED = 'PDT-UPSERT'
}

enum EmployeeType {
	CREATED = 'EMPLYT-C',
	UPDATED = 'EMPLYT-U',
	DELETED = 'EMPLYT-D',
	UPSERTED = 'EMPLYT-UPSERT'
}

enum EmployeePosition {
	CREATED = 'EMPLYP-C',
	UPDATED = 'EMPLYP-U',
	DELETED = 'EMPLYP-D',
	UPSERTED = 'EMPLYP-UPSERT'
}

enum InsuredType {
	CREATED = 'INSRDT-C',
	UPDATED = 'INSRDT-U',
	DELETED = 'INSRDT-D',
	UPSERTED = 'INSRDT-UPSERT'
}

enum MedicalSubspecialty {
	CREATED = 'MDCLSS-C',
	UPDATED = 'MDCLSS-U',
	DELETED = 'MDCLSS-D',
	UPSERTED = 'MDCLSS-UPSERT'
}


enum Belonging {
	CREATED = 'BLNGNG-C',
	UPDATED = 'BLNGNG-U',
	DELETED = 'BLNGNG-D',
	UPSERTED = 'BLNGNG-UPSERT'
}

enum MedicalOffice {
	CREATED = 'MDCLOFFC-C',
	UPDATED = 'MDCLOFFC-U',
	DELETED = 'MDCLOFFC-D',
	UPSERTED = 'MDCLOFFC-UPSERT'
}


enum Person {
	CREATED = 'PRSN-C',
	UPDATED = 'PRSN-U',
	DELETED = 'PRSN-D',
	UPSERTED = 'PRSN-UPSERT'
}

enum Clerk {
	CREATED = 'CLRK-C',
	UPDATED = 'CLRK-U',
	DELETED = 'CLRK-D',
	UPSERTED = 'CLRK-UPSERT'
}

enum Insured {
	CREATED = 'INSRD-C',
	UPDATED = 'INSRD-U',
	DELETED = 'INSRD-D',
	UPSERTED = 'INSRD-UPSERT'
}


export const SubscriptionEvent = {
	User, Group,

	PersonDocumentType, EmployeeType, EmployeePosition, InsuredType,
	MedicalSubspecialty,

	Belonging, MedicalOffice,
	
	Person, Clerk, Insured
}
