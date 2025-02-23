/*
  Warnings:

  - You are about to drop the `DeparturePrescription` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DeparturePrescription] DROP CONSTRAINT [DeparturePrescription_creatorUserName_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DeparturePrescription] DROP CONSTRAINT [DeparturePrescription_departureId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DeparturePrescription] DROP CONSTRAINT [DeparturePrescription_lastUpdateUserName_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DeparturePrescription] DROP CONSTRAINT [DeparturePrescription_prescriptionId_fkey];

-- DropTable
DROP TABLE [dbo].[DeparturePrescription];

-- CreateTable
CREATE TABLE [dbo].[DepartureClinicCare] (
    [id] INT NOT NULL IDENTITY(1,1),
    [departureId] INT NOT NULL,
    [clinicCareId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [DepartureClinicCare_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DepartureClinicCare_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DepartureClinicCare_departureId_key] UNIQUE NONCLUSTERED ([departureId]),
    CONSTRAINT [DepartureClinicCare_clinicCareId_key] UNIQUE NONCLUSTERED ([clinicCareId])
);

-- CreateTable
CREATE TABLE [dbo].[DepartureItemPrescription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [departureItemId] INT NOT NULL,
    [prescriptionId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [DepartureItemPrescription_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DepartureItemPrescription_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DepartureItemPrescription_departureItemId_key] UNIQUE NONCLUSTERED ([departureItemId]),
    CONSTRAINT [DepartureItemPrescription_prescriptionId_key] UNIQUE NONCLUSTERED ([prescriptionId])
);

-- AddForeignKey
ALTER TABLE [dbo].[DepartureClinicCare] ADD CONSTRAINT [DepartureClinicCare_departureId_fkey] FOREIGN KEY ([departureId]) REFERENCES [dbo].[Departure]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureClinicCare] ADD CONSTRAINT [DepartureClinicCare_clinicCareId_fkey] FOREIGN KEY ([clinicCareId]) REFERENCES [dbo].[ClinicCare]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureClinicCare] ADD CONSTRAINT [DepartureClinicCare_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureClinicCare] ADD CONSTRAINT [DepartureClinicCare_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItemPrescription] ADD CONSTRAINT [DepartureItemPrescription_departureItemId_fkey] FOREIGN KEY ([departureItemId]) REFERENCES [dbo].[DepartureItem]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItemPrescription] ADD CONSTRAINT [DepartureItemPrescription_prescriptionId_fkey] FOREIGN KEY ([prescriptionId]) REFERENCES [dbo].[Prescription]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItemPrescription] ADD CONSTRAINT [DepartureItemPrescription_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItemPrescription] ADD CONSTRAINT [DepartureItemPrescription_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
