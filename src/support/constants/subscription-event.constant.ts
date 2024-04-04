
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

export const SubscriptionEvent = {
	User,
	Group,
	PersonDocumentType
}
