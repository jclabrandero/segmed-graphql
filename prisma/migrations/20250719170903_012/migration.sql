BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Agreement] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [validFrom] DATETIME2 NOT NULL,
    [validTo] DATETIME2,
    [providerId] INT NOT NULL,
    [fileUploadId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Agreement_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Agreement_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Agreement_fileUploadId_key] UNIQUE NONCLUSTERED ([fileUploadId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Agreement] ADD CONSTRAINT [Agreement_providerId_fkey] FOREIGN KEY ([providerId]) REFERENCES [dbo].[Provider]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Agreement] ADD CONSTRAINT [Agreement_fileUploadId_fkey] FOREIGN KEY ([fileUploadId]) REFERENCES [dbo].[FileUpload]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Agreement] ADD CONSTRAINT [Agreement_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Agreement] ADD CONSTRAINT [Agreement_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
