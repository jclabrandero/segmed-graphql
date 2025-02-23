BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[MedicalLeaveDisabilityType] DROP CONSTRAINT [MedicalLeaveDisabilityType_disabilityTypeId_df];

-- CreateTable
CREATE TABLE [dbo].[DeparturePrescription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [departureId] INT NOT NULL,
    [prescriptionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [DeparturePrescription_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DeparturePrescription_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DeparturePrescription_prescriptionId_key] UNIQUE NONCLUSTERED ([prescriptionId])
);

-- AddForeignKey
ALTER TABLE [dbo].[DeparturePrescription] ADD CONSTRAINT [DeparturePrescription_departureId_fkey] FOREIGN KEY ([departureId]) REFERENCES [dbo].[Departure]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DeparturePrescription] ADD CONSTRAINT [DeparturePrescription_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[Prescription]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DeparturePrescription] ADD CONSTRAINT [DeparturePrescription_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DeparturePrescription] ADD CONSTRAINT [DeparturePrescription_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
