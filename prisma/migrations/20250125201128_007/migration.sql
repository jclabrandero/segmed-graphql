BEGIN TRY

BEGIN TRAN;

-- Verificar si las columnas existen antes de agregarlas
IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE Name = N'approvalDate' 
               AND Object_ID = Object_ID(N'dbo.Arrival'))
BEGIN
    ALTER TABLE [dbo].[Arrival] ADD [approvalDate] DATETIME2;
END

IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE Name = N'approvalState' 
               AND Object_ID = Object_ID(N'dbo.Arrival'))
BEGIN
    ALTER TABLE [dbo].[Arrival] ADD [approvalState] INT NOT NULL CONSTRAINT [Arrival_approvalState_df] DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE Name = N'approvalUserName' 
               AND Object_ID = Object_ID(N'dbo.Arrival'))
BEGIN
    ALTER TABLE [dbo].[Arrival] ADD [approvalUserName] NVARCHAR(1000);
END

IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE Name = N'closed' 
               AND Object_ID = Object_ID(N'dbo.Arrival'))
BEGIN
    ALTER TABLE [dbo].[Arrival] ADD [closed] BIT NOT NULL CONSTRAINT [Arrival_closed_df] DEFAULT 0;
END

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
