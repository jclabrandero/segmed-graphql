BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Audit] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [tableName] NVARCHAR(1000) NOT NULL,
    [fieldName] NVARCHAR(1000) NOT NULL,
    [rowId] INT NOT NULL,
    [oldValue] NVARCHAR(1000),
    [newValue] NVARCHAR(1000),
    [host] NVARCHAR(1000) NOT NULL,
    [application] NVARCHAR(1000) NOT NULL,
    [applicationUser] NVARCHAR(1000) NOT NULL,
    [userName] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    CONSTRAINT [Audit_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Group] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [Group_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Group_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Group_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[GroupPermission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [groupId] INT NOT NULL,
    [permissionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [GroupPermission_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [GroupPermission_pkey] PRIMARY KEY CLUSTERED ([groupId],[permissionId]),
    CONSTRAINT [GroupPermission_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Permission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [Permission_status_df] DEFAULT 1,
    CONSTRAINT [Permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Permission_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [Permission_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] INT NOT NULL IDENTITY(1,1),
    [publicKey] VARCHAR(max) NOT NULL,
    [privateKey] VARCHAR(max) NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Session_status_df] DEFAULT 1,
    [userName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(1000) NOT NULL,
    [displayName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [directory] NVARCHAR(1000) NOT NULL CONSTRAINT [User_directory_df] DEFAULT 'LOCAL',
    [status] INT NOT NULL CONSTRAINT [User_status_df] DEFAULT 1,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_userName_key] UNIQUE NONCLUSTERED ([userName])
);

-- CreateTable
CREATE TABLE [dbo].[UserGroup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [groupId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [UserGroup_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [UserGroup_pkey] PRIMARY KEY CLUSTERED ([userId],[groupId]),
    CONSTRAINT [UserGroup_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[UserPassword] (
    [id] INT NOT NULL IDENTITY(1,1),
    [encrypted] NVARCHAR(1000) NOT NULL,
    [status] INT NOT NULL CONSTRAINT [UserPassword_status_df] DEFAULT 1,
    [userName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UserPassword_pkey] PRIMARY KEY CLUSTERED ([userName],[encrypted]),
    CONSTRAINT [UserPassword_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClinicalCareState] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [color] NVARCHAR(1000) NOT NULL,
    [lock] BIT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClinicalCareState_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClinicalCareState_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClinicalCareState_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DisabilityType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [DisabilityType_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DisabilityType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DisabilityType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DrugClass] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [DrugClass_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DrugClass_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DrugClass_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DrugUnit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [DrugUnit_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DrugUnit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DrugUnit_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[EmployeePosition] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [EmployeePosition_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [EmployeePosition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [EmployeePosition_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[EmployeeType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [EmployeeType_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [EmployeeType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [EmployeeType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[InsuredType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [withDependents] BIT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InsuredType_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InsuredType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InsuredType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalGroup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [MedicalGroup_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalGroup_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MedicalGroup_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalGroupSpecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalSpecialtyId] INT NOT NULL,
    [medicalGroupId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [MedicalGroupSpecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalGroupSpecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSpecialtyId],[medicalGroupId]),
    CONSTRAINT [MedicalGroupSpecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalSpecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [MedicalSpecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalSpecialty_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MedicalSpecialty_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalSpecialtySubspecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalSubspecialtyId] INT NOT NULL,
    [medicalSpecialtyId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [MedicalSpecialtySubspecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalSpecialtySubspecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSubspecialtyId],[medicalSpecialtyId]),
    CONSTRAINT [MedicalSpecialtySubspecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalSubspecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [ageRangePatients] NVARCHAR(1000),
    [dt] NVARCHAR(1000),
    [si] NVARCHAR(1000),
    [ot] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [MedicalSubspecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalSubspecialty_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MedicalSubspecialty_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[PersonDocumentType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [status] INT NOT NULL CONSTRAINT [PersonDocumentType_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [PersonDocumentType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PersonDocumentType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Medication] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [concentration] NVARCHAR(1000) NOT NULL,
    [liname] BIT NOT NULL,
    [classId] INT NOT NULL,
    [unitId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Medication_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Medication_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Medication_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[Pharmacy] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [belongingId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Pharmacy_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Pharmacy_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Inventory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [lot] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL,
    [expireAt] DATETIME2 NOT NULL,
    [pharmacyId] INT NOT NULL,
    [medicationId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Inventory_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Inventory_pkey] PRIMARY KEY CLUSTERED ([lot],[pharmacyId],[medicationId]),
    CONSTRAINT [Inventory_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Clerk] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ein] INT NOT NULL,
    [personId] INT NOT NULL,
    [employeeTypeId] INT NOT NULL,
    [positionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Clerk_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Clerk_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Clerk_ein_key] UNIQUE NONCLUSTERED ([ein]),
    CONSTRAINT [Clerk_personId_key] UNIQUE NONCLUSTERED ([personId])
);

-- CreateTable
CREATE TABLE [dbo].[ClerkUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [clerkId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClerkUser_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClerkUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClerkUser_userId_key] UNIQUE NONCLUSTERED ([userId]),
    CONSTRAINT [ClerkUser_clerkId_key] UNIQUE NONCLUSTERED ([clerkId])
);

-- CreateTable
CREATE TABLE [dbo].[ClerkMedicalOffice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalOfficeId] INT NOT NULL,
    [clerkId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClerkMedicalOffice_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClerkMedicalOffice_pkey] PRIMARY KEY CLUSTERED ([medicalOfficeId],[clerkId]),
    CONSTRAINT [ClerkMedicalOffice_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Insured] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [iin] INT,
    [inletDate] DATETIME2 NOT NULL,
    [outletDate] DATETIME2,
    [tradeUnion] BIT NOT NULL,
    [address] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [holderInsuredId] INT,
    [personId] INT NOT NULL,
    [insuredTypeId] INT NOT NULL,
    [belongingId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Insured_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Insured_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Insured_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [Insured_personId_key] UNIQUE NONCLUSTERED ([personId])
);

-- CreateTable
CREATE TABLE [dbo].[Person] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [sex] NVARCHAR(1000) NOT NULL,
    [birthDate] DATETIME2 NOT NULL,
    [documentNumber] NVARCHAR(1000),
    [personDocumentTypeId] INT,
    [status] INT NOT NULL CONSTRAINT [Person_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Person_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClinicCarePrimary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reason] NVARCHAR(1000),
    [physicalExam] NVARCHAR(1000),
    [diagnosis] NVARCHAR(1000),
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClinicCarePrimary_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClinicCarePrimary_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClinicCarePrimary_clinicCareId_key] UNIQUE NONCLUSTERED ([clinicCareId])
);

-- CreateTable
CREATE TABLE [dbo].[ClinicCare] (
    [id] INT NOT NULL IDENTITY(1,1),
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2,
    [stateId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClinicCare_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClinicCare_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ClinicCareInsured] (
    [id] INT NOT NULL IDENTITY(1,1),
    [insuredIin] INT,
    [personFirstName] NVARCHAR(1000) NOT NULL,
    [personLastName] NVARCHAR(1000) NOT NULL,
    [insuredTypeName] NVARCHAR(1000) NOT NULL,
    [insuredId] INT NOT NULL,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClinicCareInsured_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClinicCareInsured_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClinicCareInsured_clinicCareId_key] UNIQUE NONCLUSTERED ([clinicCareId])
);

-- CreateTable
CREATE TABLE [dbo].[ClinicCareMedicalOffice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalOfficeName] NVARCHAR(1000) NOT NULL,
    [medicalOfficeId] INT NOT NULL,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ClinicCareMedicalOffice_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ClinicCareMedicalOffice_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClinicCareMedicalOffice_clinicCareId_key] UNIQUE NONCLUSTERED ([clinicCareId])
);

-- CreateTable
CREATE TABLE [dbo].[Interclinical] (
    [id] INT NOT NULL IDENTITY(1,1),
    [remark] NVARCHAR(1000) NOT NULL,
    [driftDate] DATETIME2 NOT NULL,
    [approvedState] INT NOT NULL CONSTRAINT [Interclinical_approvedState_df] DEFAULT 0,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Interclinical_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Interclinical_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InterclinicalProvider] (
    [id] INT NOT NULL IDENTITY(1,1),
    [providerBusinessName] NVARCHAR(1000) NOT NULL,
    [providerId] INT NOT NULL,
    [interclinicalId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InterclinicalProvider_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InterclinicalProvider_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InterclinicalProvider_interclinicalId_key] UNIQUE NONCLUSTERED ([interclinicalId])
);

-- CreateTable
CREATE TABLE [dbo].[InterclinicalMedicalGroup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalGroupName] NVARCHAR(1000) NOT NULL,
    [medicalGroupId] INT NOT NULL,
    [interclinicalId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InterclinicalMedicalGroup_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InterclinicalMedicalGroup_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InterclinicalMedicalGroup_interclinicalId_key] UNIQUE NONCLUSTERED ([interclinicalId])
);

-- CreateTable
CREATE TABLE [dbo].[InterclinicalMedicalSpecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [specialtyName] NVARCHAR(1000) NOT NULL,
    [medicalSpecialtyId] INT NOT NULL,
    [interclinicalMedicalGroupId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InterclinicalMedicalSpecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InterclinicalMedicalSpecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSpecialtyId],[interclinicalMedicalGroupId]),
    CONSTRAINT [InterclinicalMedicalSpecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InterclinicalMedicalSubspecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [subspecialtyName] NVARCHAR(1000) NOT NULL,
    [medicalSubspecialtyId] INT NOT NULL,
    [interclinicalMedicalSpecialtyId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InterclinicalMedicalSubspecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InterclinicalMedicalSubspecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSubspecialtyId],[interclinicalMedicalSpecialtyId]),
    CONSTRAINT [InterclinicalMedicalSubspecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InterclinicalFileUpload] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fileUploadId] INT NOT NULL,
    [interclinicalId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [InterclinicalFileUpload_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [InterclinicalFileUpload_pkey] PRIMARY KEY CLUSTERED ([interclinicalId],[fileUploadId]),
    CONSTRAINT [InterclinicalFileUpload_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLeave] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reason] NVARCHAR(1000) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [approvalState] INT NOT NULL CONSTRAINT [MedicalLeave_approvalState_df] DEFAULT 0,
    [approvalDate] DATETIME2,
    [approvalUserName] NVARCHAR(1000),
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [MedicalLeave_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalLeave_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalLeaveDisabilityType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [disabilityTypeName] NVARCHAR(1000) NOT NULL,
    [disabilityTypeId] INT NOT NULL,
    [medicalLeaveId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [MedicalLeaveDisabilityType_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalLeaveDisabilityType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MedicalLeaveDisabilityType_disabilityTypeId_key] UNIQUE NONCLUSTERED ([disabilityTypeId]),
    CONSTRAINT [MedicalLeaveDisabilityType_medicalLeaveId_key] UNIQUE NONCLUSTERED ([medicalLeaveId])
);

-- CreateTable
CREATE TABLE [dbo].[Prescription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [indications] NVARCHAR(1000) NOT NULL,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Prescription_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Prescription_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PrescriptionPharmacy] (
    [id] INT NOT NULL IDENTITY(1,1),
    [pharmacyName] NVARCHAR(1000) NOT NULL,
    [pharmacyId] INT NOT NULL,
    [prescriptionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [PrescriptionPharmacy_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [PrescriptionPharmacy_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PrescriptionPharmacy_prescriptionId_key] UNIQUE NONCLUSTERED ([prescriptionId])
);

-- CreateTable
CREATE TABLE [dbo].[PrescriptionMedication] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicationCode] NVARCHAR(1000) NOT NULL,
    [medicationName] NVARCHAR(1000) NOT NULL,
    [medicationConcentration] NVARCHAR(1000) NOT NULL,
    [medicationClass] NVARCHAR(1000) NOT NULL,
    [medicationUnit] NVARCHAR(1000) NOT NULL,
    [medicationId] INT NOT NULL,
    [prescriptionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [PrescriptionMedication_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [PrescriptionMedication_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PrescriptionMedication_prescriptionId_key] UNIQUE NONCLUSTERED ([prescriptionId])
);

-- CreateTable
CREATE TABLE [dbo].[PrescriptionExtern] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [indications] NVARCHAR(1000) NOT NULL,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [PrescriptionExtern_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [PrescriptionExtern_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PrescriptionExternMedication] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicationCode] NVARCHAR(1000) NOT NULL,
    [medicationName] NVARCHAR(1000) NOT NULL,
    [medicationConcentration] NVARCHAR(1000) NOT NULL,
    [medicationClass] NVARCHAR(1000) NOT NULL,
    [medicationUnit] NVARCHAR(1000) NOT NULL,
    [medicationId] INT NOT NULL,
    [prescriptionExternId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [PrescriptionExternMedication_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [PrescriptionExternMedication_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PrescriptionExternMedication_prescriptionExternId_key] UNIQUE NONCLUSTERED ([prescriptionExternId])
);

-- CreateTable
CREATE TABLE [dbo].[Belonging] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Belonging_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Belonging_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Belonging_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[MedicalOffice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [belongingId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [MedicalOffice_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [MedicalOffice_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MedicalOffice_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Provider] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vendorCode] NVARCHAR(1000) NOT NULL,
    [businessName] NVARCHAR(1000) NOT NULL,
    [nit] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [belongingId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Provider_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Provider_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Provider_vendorCode_key] UNIQUE NONCLUSTERED ([vendorCode])
);

-- CreateTable
CREATE TABLE [dbo].[ProviderMedicalGroup] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalGroupId] INT NOT NULL,
    [providerId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ProviderMedicalGroup_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ProviderMedicalGroup_pkey] PRIMARY KEY CLUSTERED ([medicalGroupId],[providerId]),
    CONSTRAINT [ProviderMedicalGroup_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProviderMedicalSpecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalSpecialtyId] INT NOT NULL,
    [providerMedicalGroupId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ProviderMedicalSpecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ProviderMedicalSpecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSpecialtyId],[providerMedicalGroupId]),
    CONSTRAINT [ProviderMedicalSpecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProviderMedicalSubspecialty] (
    [id] INT NOT NULL IDENTITY(1,1),
    [medicalSubspecialtyId] INT NOT NULL,
    [providerMedicalSpecialtyId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ProviderMedicalSubspecialty_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ProviderMedicalSubspecialty_pkey] PRIMARY KEY CLUSTERED ([medicalSubspecialtyId],[providerMedicalSpecialtyId]),
    CONSTRAINT [ProviderMedicalSubspecialty_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FileUpload] (
    [id] INT NOT NULL IDENTITY(1,1),
    [md5] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [encoding] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [extension] NVARCHAR(1000) NOT NULL,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [FileUpload_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FileUpload_md5_key] UNIQUE NONCLUSTERED ([md5])
);

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[GroupPermission] ADD CONSTRAINT [GroupPermission_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GroupPermission] ADD CONSTRAINT [GroupPermission_permissionId_fkey] FOREIGN KEY ([permissionId]) REFERENCES [dbo].[Permission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GroupPermission] ADD CONSTRAINT [GroupPermission_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[GroupPermission] ADD CONSTRAINT [GroupPermission_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userName_fkey] FOREIGN KEY ([userName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserPassword] ADD CONSTRAINT [UserPassword_userName_fkey] FOREIGN KEY ([userName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicalCareState] ADD CONSTRAINT [ClinicalCareState_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicalCareState] ADD CONSTRAINT [ClinicalCareState_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DisabilityType] ADD CONSTRAINT [DisabilityType_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DisabilityType] ADD CONSTRAINT [DisabilityType_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DrugClass] ADD CONSTRAINT [DrugClass_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DrugClass] ADD CONSTRAINT [DrugClass_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DrugUnit] ADD CONSTRAINT [DrugUnit_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DrugUnit] ADD CONSTRAINT [DrugUnit_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeePosition] ADD CONSTRAINT [EmployeePosition_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeePosition] ADD CONSTRAINT [EmployeePosition_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeeType] ADD CONSTRAINT [EmployeeType_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmployeeType] ADD CONSTRAINT [EmployeeType_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InsuredType] ADD CONSTRAINT [InsuredType_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InsuredType] ADD CONSTRAINT [InsuredType_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroup] ADD CONSTRAINT [MedicalGroup_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroup] ADD CONSTRAINT [MedicalGroup_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroupSpecialty] ADD CONSTRAINT [MedicalGroupSpecialty_medicalSpecialtyId_fkey] FOREIGN KEY ([medicalSpecialtyId]) REFERENCES [dbo].[MedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroupSpecialty] ADD CONSTRAINT [MedicalGroupSpecialty_medicalGroupId_fkey] FOREIGN KEY ([medicalGroupId]) REFERENCES [dbo].[MedicalGroup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroupSpecialty] ADD CONSTRAINT [MedicalGroupSpecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalGroupSpecialty] ADD CONSTRAINT [MedicalGroupSpecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialty] ADD CONSTRAINT [MedicalSpecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialty] ADD CONSTRAINT [MedicalSpecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialtySubspecialty] ADD CONSTRAINT [MedicalSpecialtySubspecialty_medicalSubspecialtyId_fkey] FOREIGN KEY ([medicalSubspecialtyId]) REFERENCES [dbo].[MedicalSubspecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialtySubspecialty] ADD CONSTRAINT [MedicalSpecialtySubspecialty_medicalSpecialtyId_fkey] FOREIGN KEY ([medicalSpecialtyId]) REFERENCES [dbo].[MedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialtySubspecialty] ADD CONSTRAINT [MedicalSpecialtySubspecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSpecialtySubspecialty] ADD CONSTRAINT [MedicalSpecialtySubspecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSubspecialty] ADD CONSTRAINT [MedicalSubspecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalSubspecialty] ADD CONSTRAINT [MedicalSubspecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PersonDocumentType] ADD CONSTRAINT [PersonDocumentType_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PersonDocumentType] ADD CONSTRAINT [PersonDocumentType_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Medication] ADD CONSTRAINT [Medication_classId_fkey] FOREIGN KEY ([classId]) REFERENCES [dbo].[DrugClass]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Medication] ADD CONSTRAINT [Medication_unitId_fkey] FOREIGN KEY ([unitId]) REFERENCES [dbo].[DrugUnit]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Medication] ADD CONSTRAINT [Medication_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Medication] ADD CONSTRAINT [Medication_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pharmacy] ADD CONSTRAINT [Pharmacy_belongingId_fkey] FOREIGN KEY ([belongingId]) REFERENCES [dbo].[Belonging]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pharmacy] ADD CONSTRAINT [Pharmacy_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pharmacy] ADD CONSTRAINT [Pharmacy_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_pharmacyId_fkey] FOREIGN KEY ([pharmacyId]) REFERENCES [dbo].[Pharmacy]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_medicationId_fkey] FOREIGN KEY ([medicationId]) REFERENCES [dbo].[Medication]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Clerk] ADD CONSTRAINT [Clerk_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Clerk] ADD CONSTRAINT [Clerk_employeeTypeId_fkey] FOREIGN KEY ([employeeTypeId]) REFERENCES [dbo].[EmployeeType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Clerk] ADD CONSTRAINT [Clerk_positionId_fkey] FOREIGN KEY ([positionId]) REFERENCES [dbo].[EmployeePosition]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Clerk] ADD CONSTRAINT [Clerk_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Clerk] ADD CONSTRAINT [Clerk_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkUser] ADD CONSTRAINT [ClerkUser_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkUser] ADD CONSTRAINT [ClerkUser_clerkId_fkey] FOREIGN KEY ([clerkId]) REFERENCES [dbo].[Clerk]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkUser] ADD CONSTRAINT [ClerkUser_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkUser] ADD CONSTRAINT [ClerkUser_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkMedicalOffice] ADD CONSTRAINT [ClerkMedicalOffice_medicalOfficeId_fkey] FOREIGN KEY ([medicalOfficeId]) REFERENCES [dbo].[MedicalOffice]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkMedicalOffice] ADD CONSTRAINT [ClerkMedicalOffice_clerkId_fkey] FOREIGN KEY ([clerkId]) REFERENCES [dbo].[Clerk]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkMedicalOffice] ADD CONSTRAINT [ClerkMedicalOffice_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClerkMedicalOffice] ADD CONSTRAINT [ClerkMedicalOffice_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_holderInsuredId_fkey] FOREIGN KEY ([holderInsuredId]) REFERENCES [dbo].[Insured]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_insuredTypeId_fkey] FOREIGN KEY ([insuredTypeId]) REFERENCES [dbo].[InsuredType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_belongingId_fkey] FOREIGN KEY ([belongingId]) REFERENCES [dbo].[Belonging]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Insured] ADD CONSTRAINT [Insured_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Person] ADD CONSTRAINT [Person_personDocumentTypeId_fkey] FOREIGN KEY ([personDocumentTypeId]) REFERENCES [dbo].[PersonDocumentType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Person] ADD CONSTRAINT [Person_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Person] ADD CONSTRAINT [Person_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCarePrimary] ADD CONSTRAINT [ClinicCarePrimary_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCarePrimary] ADD CONSTRAINT [ClinicCarePrimary_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCarePrimary] ADD CONSTRAINT [ClinicCarePrimary_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCare] ADD CONSTRAINT [ClinicCare_stateId_fkey] FOREIGN KEY ([stateId]) REFERENCES [dbo].[ClinicalCareState]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCare] ADD CONSTRAINT [ClinicCare_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCare] ADD CONSTRAINT [ClinicCare_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareInsured] ADD CONSTRAINT [ClinicCareInsured_insuredId_fkey] FOREIGN KEY ([insuredId]) REFERENCES [dbo].[Insured]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareInsured] ADD CONSTRAINT [ClinicCareInsured_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareInsured] ADD CONSTRAINT [ClinicCareInsured_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareInsured] ADD CONSTRAINT [ClinicCareInsured_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareMedicalOffice] ADD CONSTRAINT [ClinicCareMedicalOffice_medicalOfficeId_fkey] FOREIGN KEY ([medicalOfficeId]) REFERENCES [dbo].[MedicalOffice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareMedicalOffice] ADD CONSTRAINT [ClinicCareMedicalOffice_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareMedicalOffice] ADD CONSTRAINT [ClinicCareMedicalOffice_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ClinicCareMedicalOffice] ADD CONSTRAINT [ClinicCareMedicalOffice_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Interclinical] ADD CONSTRAINT [Interclinical_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Interclinical] ADD CONSTRAINT [Interclinical_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Interclinical] ADD CONSTRAINT [Interclinical_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalProvider] ADD CONSTRAINT [InterclinicalProvider_providerId_fkey] FOREIGN KEY ([providerId]) REFERENCES [dbo].[Provider]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalProvider] ADD CONSTRAINT [InterclinicalProvider_interclinicalId_fkey] FOREIGN KEY ([interclinicalId]) REFERENCES [dbo].[Interclinical]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalProvider] ADD CONSTRAINT [InterclinicalProvider_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalProvider] ADD CONSTRAINT [InterclinicalProvider_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalGroup] ADD CONSTRAINT [InterclinicalMedicalGroup_medicalGroupId_fkey] FOREIGN KEY ([medicalGroupId]) REFERENCES [dbo].[MedicalGroup]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalGroup] ADD CONSTRAINT [InterclinicalMedicalGroup_interclinicalId_fkey] FOREIGN KEY ([interclinicalId]) REFERENCES [dbo].[Interclinical]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalGroup] ADD CONSTRAINT [InterclinicalMedicalGroup_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalGroup] ADD CONSTRAINT [InterclinicalMedicalGroup_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSpecialty] ADD CONSTRAINT [InterclinicalMedicalSpecialty_medicalSpecialtyId_fkey] FOREIGN KEY ([medicalSpecialtyId]) REFERENCES [dbo].[MedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSpecialty] ADD CONSTRAINT [InterclinicalMedicalSpecialty_interclinicalMedicalGroupId_fkey] FOREIGN KEY ([interclinicalMedicalGroupId]) REFERENCES [dbo].[InterclinicalMedicalGroup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSpecialty] ADD CONSTRAINT [InterclinicalMedicalSpecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSpecialty] ADD CONSTRAINT [InterclinicalMedicalSpecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSubspecialty] ADD CONSTRAINT [InterclinicalMedicalSubspecialty_medicalSubspecialtyId_fkey] FOREIGN KEY ([medicalSubspecialtyId]) REFERENCES [dbo].[MedicalSubspecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSubspecialty] ADD CONSTRAINT [InterclinicalMedicalSubspecialty_interclinicalMedicalSpecialtyId_fkey] FOREIGN KEY ([interclinicalMedicalSpecialtyId]) REFERENCES [dbo].[InterclinicalMedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSubspecialty] ADD CONSTRAINT [InterclinicalMedicalSubspecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalMedicalSubspecialty] ADD CONSTRAINT [InterclinicalMedicalSubspecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalFileUpload] ADD CONSTRAINT [InterclinicalFileUpload_fileUploadId_fkey] FOREIGN KEY ([fileUploadId]) REFERENCES [dbo].[FileUpload]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalFileUpload] ADD CONSTRAINT [InterclinicalFileUpload_interclinicalId_fkey] FOREIGN KEY ([interclinicalId]) REFERENCES [dbo].[Interclinical]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalFileUpload] ADD CONSTRAINT [InterclinicalFileUpload_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[InterclinicalFileUpload] ADD CONSTRAINT [InterclinicalFileUpload_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeave] ADD CONSTRAINT [MedicalLeave_approvalUserName_fkey] FOREIGN KEY ([approvalUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeave] ADD CONSTRAINT [MedicalLeave_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeave] ADD CONSTRAINT [MedicalLeave_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeave] ADD CONSTRAINT [MedicalLeave_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] ADD CONSTRAINT [MedicalLeaveDisabilityType_disabilityTypeId_fkey] FOREIGN KEY ([disabilityTypeId]) REFERENCES [dbo].[DisabilityType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] ADD CONSTRAINT [MedicalLeaveDisabilityType_medicalLeaveId_fkey] FOREIGN KEY ([medicalLeaveId]) REFERENCES [dbo].[MedicalLeave]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] ADD CONSTRAINT [MedicalLeaveDisabilityType_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] ADD CONSTRAINT [MedicalLeaveDisabilityType_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Prescription] ADD CONSTRAINT [Prescription_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Prescription] ADD CONSTRAINT [Prescription_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Prescription] ADD CONSTRAINT [Prescription_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionPharmacy] ADD CONSTRAINT [PrescriptionPharmacy_pharmacyId_fkey] FOREIGN KEY ([pharmacyId]) REFERENCES [dbo].[Pharmacy]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionPharmacy] ADD CONSTRAINT [PrescriptionPharmacy_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[Prescription]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionPharmacy] ADD CONSTRAINT [PrescriptionPharmacy_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionPharmacy] ADD CONSTRAINT [PrescriptionPharmacy_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionMedication] ADD CONSTRAINT [PrescriptionMedication_medicationId_fkey] FOREIGN KEY ([medicationId]) REFERENCES [dbo].[Medication]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionMedication] ADD CONSTRAINT [PrescriptionMedication_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[Prescription]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionMedication] ADD CONSTRAINT [PrescriptionMedication_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionMedication] ADD CONSTRAINT [PrescriptionMedication_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExtern] ADD CONSTRAINT [PrescriptionExtern_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExtern] ADD CONSTRAINT [PrescriptionExtern_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExtern] ADD CONSTRAINT [PrescriptionExtern_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExternMedication] ADD CONSTRAINT [PrescriptionExternMedication_medicationId_fkey] FOREIGN KEY ([medicationId]) REFERENCES [dbo].[Medication]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExternMedication] ADD CONSTRAINT [PrescriptionExternMedication_prescriptionExternId_fkey] FOREIGN KEY ([prescriptionExternId]) REFERENCES [dbo].[PrescriptionExtern]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExternMedication] ADD CONSTRAINT [PrescriptionExternMedication_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PrescriptionExternMedication] ADD CONSTRAINT [PrescriptionExternMedication_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Belonging] ADD CONSTRAINT [Belonging_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Belonging] ADD CONSTRAINT [Belonging_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalOffice] ADD CONSTRAINT [MedicalOffice_belongingId_fkey] FOREIGN KEY ([belongingId]) REFERENCES [dbo].[Belonging]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalOffice] ADD CONSTRAINT [MedicalOffice_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MedicalOffice] ADD CONSTRAINT [MedicalOffice_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Provider] ADD CONSTRAINT [Provider_belongingId_fkey] FOREIGN KEY ([belongingId]) REFERENCES [dbo].[Belonging]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Provider] ADD CONSTRAINT [Provider_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Provider] ADD CONSTRAINT [Provider_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalGroup] ADD CONSTRAINT [ProviderMedicalGroup_medicalGroupId_fkey] FOREIGN KEY ([medicalGroupId]) REFERENCES [dbo].[MedicalGroup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalGroup] ADD CONSTRAINT [ProviderMedicalGroup_providerId_fkey] FOREIGN KEY ([providerId]) REFERENCES [dbo].[Provider]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalGroup] ADD CONSTRAINT [ProviderMedicalGroup_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalGroup] ADD CONSTRAINT [ProviderMedicalGroup_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSpecialty] ADD CONSTRAINT [ProviderMedicalSpecialty_medicalSpecialtyId_fkey] FOREIGN KEY ([medicalSpecialtyId]) REFERENCES [dbo].[MedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSpecialty] ADD CONSTRAINT [ProviderMedicalSpecialty_providerMedicalGroupId_fkey] FOREIGN KEY ([providerMedicalGroupId]) REFERENCES [dbo].[ProviderMedicalGroup]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSpecialty] ADD CONSTRAINT [ProviderMedicalSpecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSpecialty] ADD CONSTRAINT [ProviderMedicalSpecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSubspecialty] ADD CONSTRAINT [ProviderMedicalSubspecialty_medicalSubspecialtyId_fkey] FOREIGN KEY ([medicalSubspecialtyId]) REFERENCES [dbo].[MedicalSubspecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSubspecialty] ADD CONSTRAINT [ProviderMedicalSubspecialty_providerMedicalSpecialtyId_fkey] FOREIGN KEY ([providerMedicalSpecialtyId]) REFERENCES [dbo].[ProviderMedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSubspecialty] ADD CONSTRAINT [ProviderMedicalSubspecialty_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProviderMedicalSubspecialty] ADD CONSTRAINT [ProviderMedicalSubspecialty_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FileUpload] ADD CONSTRAINT [FileUpload_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FileUpload] ADD CONSTRAINT [FileUpload_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
