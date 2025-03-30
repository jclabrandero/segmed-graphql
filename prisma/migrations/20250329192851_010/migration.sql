BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[DepartureItemPrescription] DROP CONSTRAINT [DepartureItemPrescription_prescriptionId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
