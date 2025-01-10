BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Arrival] ADD [invoiceAuthorizationCode] NVARCHAR(1000),
[invoiceControlCode] NVARCHAR(1000),
[invoiceNumber] INT,
[providerId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[Arrival] ADD CONSTRAINT [Arrival_providerId_fkey] FOREIGN KEY ([providerId]) REFERENCES [dbo].[Provider]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
