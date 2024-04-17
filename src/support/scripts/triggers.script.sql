
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
