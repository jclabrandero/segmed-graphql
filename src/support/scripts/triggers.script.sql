
------------------------------------------------------------------------------------------
-- AUTH
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRGroupUpdated ON [Group] AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Group', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRGroupPermissionUpdated ON GroupPermission AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'GroupPermission', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRUserGroupUpdated ON UserGroup AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'UserGroup', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

------------------------------------------------------------------------------------------
-- CATALOG
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRPersonDocumentTypeUpdated ON PersonDocumentType AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'PersonDocumentType', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TREmployeePositionUpdated ON EmployeePosition AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'EmployeePosition', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TREmployeeTypeUpdated ON EmployeeType AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'EmployeeType', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRInsuredTypeUpdated ON InsuredType AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'InsuredType', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRMedicalSubspecialtyUpdated ON MedicalSubspecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalSubspecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRMedicalSpecialtyUpdated ON MedicalSpecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalSpecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRMedicalSpecialtySubspecialtyUpdated ON MedicalSpecialtySubspecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalSpecialtySubspecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRMedicalGroupUpdated ON MedicalGroup AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalGroup', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRMedicalGroupSpecialtyUpdated ON MedicalGroupSpecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalGroupSpecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRDrugClassUpdated ON DrugClass AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'DrugClass', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRDrugUnitUpdated ON DrugUnit AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'DrugUnit', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRClinicalCareStateUpdated ON ClinicalCareState AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ClinicalCareState', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

------------------------------------------------------------------------------------------
-- REFERENCE
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRBelongingUpdated ON Belonging AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Belonging', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRMedicalOfficeUpdated ON MedicalOffice AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'MedicalOffice', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRProviderUpdated ON Provider AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Provider', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRProviderMedicalGroupUpdated ON ProviderMedicalGroup AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ProviderMedicalGroup', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRProviderMedicalSpecialtyUpdated ON ProviderMedicalSpecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ProviderMedicalSpecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRProviderMedicalSubspecialtyUpdated ON ProviderMedicalSubspecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ProviderMedicalSubspecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

------------------------------------------------------------------------------------------
-- FOLK
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRPersonUpdated ON Person AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Person', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRClerk ON Clerk AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Clerk', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRClerkUser ON ClerkUser AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ClerkUser', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRClerkMedicalOffice ON ClerkMedicalOffice AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ClerkMedicalOffice', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRInsuredUpdated ON Insured AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Insured', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

------------------------------------------------------------------------------------------
-- DRUGSTORE
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRMedicationUpdated ON Medication AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Medication', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRPharmacyUpdated ON Pharmacy AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Pharmacy', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRInventoryUpdated ON Inventory AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Inventory', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

------------------------------------------------------------------------------------------
-- HEALTH
------------------------------------------------------------------------------------------

CREATE OR ALTER TRIGGER TRClinicCareUpdated ON ClinicCare AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ClinicCare', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRClinicCarePrimaryUpdated ON ClinicCarePrimary AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'ClinicCarePrimary', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRInterclinicalUpdated ON Interclinical AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Interclinical', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRInterclinicalMedicalSpecialtyUpdated ON InterclinicalMedicalSpecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'InterclinicalMedicalSpecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
CREATE OR ALTER TRIGGER TRInterclinicalMedicalSubspecialtyUpdated ON InterclinicalMedicalSubspecialty AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'InterclinicalMedicalSubspecialty', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRPrescriptionUpdated ON Prescription AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'Prescription', @trace, @inserted, @deleted, @columnsUpdated;
END
GO

CREATE OR ALTER TRIGGER TRPrescriptionExternUpdated ON PrescriptionExtern AFTER UPDATE AS
BEGIN
	DECLARE @trace TTrace, @inserted VARCHAR(MAX), @deleted VARCHAR(MAX), @columnsUpdated VARBINARY(MAX);

	INSERT INTO @trace(insertedId) SELECT id FROM INSERTED;
	SET @inserted = (SELECT * FROM INSERTED FOR JSON AUTO);
	SET @deleted = (SELECT * FROM DELETED FOR JSON AUTO);
	SET @columnsUpdated = columns_updated();

	EXECUTE dbo.SPCreateAuditLog 'PrescriptionExtern', @trace, @inserted, @deleted, @columnsUpdated;
END
GO
