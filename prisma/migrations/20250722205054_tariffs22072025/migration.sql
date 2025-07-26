BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Tariff] (
    [id] INT NOT NULL IDENTITY(1,1),
    [currencyUMA] INT NOT NULL,
    [exchangeRate] DECIMAL(32,16) NOT NULL,
    [priceBs] DECIMAL(32,16) NOT NULL,
    [agreementId] INT NOT NULL,
    [providerMedicalSpecialtyId] INT NOT NULL,
    [providerMedicalSubspecialtyId] INT,
    [status] INT NOT NULL CONSTRAINT [Tariff_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Tariff_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Tariff] ADD CONSTRAINT [Tariff_agreementId_fkey] FOREIGN KEY ([agreementId]) REFERENCES [dbo].[Agreement]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tariff] ADD CONSTRAINT [Tariff_providerMedicalSpecialtyId_fkey] FOREIGN KEY ([providerMedicalSpecialtyId]) REFERENCES [dbo].[ProviderMedicalSpecialty]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tariff] ADD CONSTRAINT [Tariff_providerMedicalSubspecialtyId_fkey] FOREIGN KEY ([providerMedicalSubspecialtyId]) REFERENCES [dbo].[ProviderMedicalSubspecialty]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tariff] ADD CONSTRAINT [Tariff_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tariff] ADD CONSTRAINT [Tariff_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
