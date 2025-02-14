BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] DROP CONSTRAINT [MedicalLeaveDisabilityType_disabilityTypeId_key];

-- AlterTable
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] ADD CONSTRAINT [MedicalLeaveDisabilityType_disabilityTypeId_df] DEFAULT 1 FOR [disabilityTypeId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
