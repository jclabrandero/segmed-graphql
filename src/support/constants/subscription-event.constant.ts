
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
	CREATED = 'MDCLSBSP-C',
	UPDATED = 'MDCLSBSP-U',
	DELETED = 'MDCLSBSP-D',
	UPSERTED = 'MDCLSBSP-UPSERT'
}

enum MedicalSpecialty {
	CREATED = 'MDCLSP-C',
	UPDATED = 'MDCLSP-U',
	DELETED = 'MDCLSP-D',
	UPSERTED = 'MDCLSP-UPSERT'
}

enum MedicalGroup {
	CREATED = 'MDCLGRP-C',
	UPDATED = 'MDCLGRP-U',
	DELETED = 'MDCLGRP-D',
	UPSERTED = 'MDCLGRP-UPSERT'
}

enum DrugClass {
	CREATED = 'DRGCLS-C',
	UPDATED = 'DRGCLS-U',
	DELETED = 'DRGCLS-D',
	UPSERTED = 'DRGCLS-UPSERT'
}

enum DrugUnit {
	CREATED = 'DRGUNT-C',
	UPDATED = 'DRGUNT-U',
	DELETED = 'DRGUNT-D',
	UPSERTED = 'DRGUNT-UPSERT'
}

enum ClinicalCareState {
	CREATED = 'MDCRS-C',
	UPDATED = 'MDCRS-U',
	DELETED = 'MDCRS-D',
	UPSERTED = 'MDCRS-UPSERT'
}

enum DisabilityType {
	CREATED = 'DSBLTT-C',
	UPDATED = 'DSBLTT-U',
	DELETED = 'DSBLTT-D',
	UPSERTED = 'DSBLTT-UPSERT'
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

enum Provider {
	CREATED = 'PRVDR-C',
	UPDATED = 'PRVDR-U',
	DELETED = 'PRVDR-D',
	UPSERTED = 'PRVDR-UPSERT'
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


enum Medication {
	CREATED = 'MDCTN-C',
	UPDATED = 'MDCTN-U',
	DELETED = 'MDCTN-D',
	UPSERTED = 'MDCTN-UPSERT'
}

enum Pharmacy {
	CREATED = 'PHRM-C',
	UPDATED = 'PHRM-U',
	DELETED = 'PHRM-D',
	UPSERTED = 'PHRM-UPSERT'
}

enum Batch {
	CREATED = 'BTCH-C',
	UPDATED = 'BTCH-U',
	DELETED = 'BTCH-D',
	UPSERTED = 'BTCH-UPSERT'
}

enum Arrival {
	CREATED = 'ARRVL-C',
	UPDATED = 'ARRVL-U',
	DELETED = 'ARRVL-D',
	UPSERTED = 'ARRVL-UPSERT'
}

enum ArrivalItem {
	CREATED = 'ARRVLITM-C',
	UPDATED = 'ARRVLITM-U',
	DELETED = 'ARRVLITM-D',
	UPSERTED = 'ARRVLITM-UPSERT'
}


enum Departure {
	CREATED = 'DPRTR-C',
	UPDATED = 'DPRTR-U',
	DELETED = 'DPRTR-D',
	UPSERTED = 'DPRTR-UPSERT'
}

enum DepartureItem {
	CREATED = 'DPRTRITM-C',
	UPDATED = 'DPRTRITM-U',
	DELETED = 'DPRTRITM-D',
	UPSERTED = 'DPRTRITM-UPSERT'
}


enum ClinicCare {
	CREATED = 'CLNCCR-C',
	UPDATED = 'CLNCCR-U',
	DELETED = 'CLNCCR-D',
	UPSERTED = 'CLNCCR-UPSERT'
}

enum Agreement {
	CREATED = 'AGRMNT-C',
	UPDATED = 'AGRMNT-U',
	DELETED = 'AGRMNT-D',
	UPSERTED = 'AGRMNT-UPSERT'
}

enum Tariff {
	CREATED = 'TRFF-C',
	UPDATED = 'TRFF-U',
	DELETED = 'TRFF-D',
	UPSERTED = 'TRFF-UPSERT'
}

enum InterclinicalCost {
	CREATED = 'INTRCLNCLCST-C',
	UPDATED = 'INTRCLNCLCST-U',
	DELETED = 'INTRCLNCLCST-D',
	UPSERTED = 'INTRCLNCLCST-UPSERT'
}

enum InterclinicalCostItem {
	CREATED = 'INTRCLNCLCSTITM-C',
	UPDATED = 'INTRCLNCLCSTITM-U',
	DELETED = 'INTRCLNCLCSTITM-D',
	UPSERTED = 'INTRCLNCLCSTITM-UPSERT'
}

export const SubscriptionEvent = {
	User, Group,

	PersonDocumentType, EmployeeType, EmployeePosition, InsuredType,
	MedicalSubspecialty, MedicalSpecialty, MedicalGroup,
	DrugClass, DrugUnit,
	DisabilityType, ClinicalCareState,

	Belonging, MedicalOffice, Provider,
	
	Person, Clerk, Insured,

	Medication, Pharmacy, Batch, Arrival, ArrivalItem, Departure, DepartureItem,

	ClinicCare,

	Agreement, Tariff,

	InterclinicalCost, InterclinicalCostItem

}
