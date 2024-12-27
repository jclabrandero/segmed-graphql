/*
  Warnings:

  - The primary key for the `Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expireAt` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `lot` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pharmacyId,medicationId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Inventory] DROP CONSTRAINT [Inventory_medicationId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Inventory] DROP CONSTRAINT [Inventory_id_key];

-- AlterTable
ALTER TABLE [dbo].[Inventory] DROP CONSTRAINT [Inventory_pkey];
ALTER TABLE [dbo].[Inventory] DROP COLUMN [expireAt],
[lot],
[quantity];
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT Inventory_pkey PRIMARY KEY CLUSTERED ([id]);
ALTER TABLE [dbo].[Inventory] ADD [min] INT NOT NULL CONSTRAINT [Inventory_min_df] DEFAULT 0,
[stock] INT NOT NULL CONSTRAINT [Inventory_stock_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[Batch] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(1000) NOT NULL,
    [expireAt] DATETIME2 NOT NULL,
    [medicationId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Batch_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Batch_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Batch_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [Batch_medicationId_code_key] UNIQUE NONCLUSTERED ([medicationId],[code])
);

-- CreateTable
CREATE TABLE [dbo].[Arrival] (
    [id] INT NOT NULL IDENTITY(1,1),
    [remark] NVARCHAR(1000) NOT NULL,
    [arrivalDate] DATETIME2 NOT NULL,
    [pharmacyId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Arrival_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Arrival_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ArrivalItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [price] DECIMAL(32,16) NOT NULL,
    [arrivalId] INT NOT NULL,
    [batchId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [ArrivalItem_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [ArrivalItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Departure] (
    [id] INT NOT NULL IDENTITY(1,1),
    [remark] NVARCHAR(1000) NOT NULL,
    [departureDate] DATETIME2 NOT NULL,
    [pharmacyId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [Departure_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [Departure_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DepartureItem] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [price] DECIMAL(32,16) NOT NULL,
    [departureId] INT NOT NULL,
    [batchId] INT NOT NULL,
    [status] INT NOT NULL CONSTRAINT [DepartureItem_status_df] DEFAULT 1,
    [creatorUserName] NVARCHAR(1000) NOT NULL,
    [creationDate] DATETIME2 NOT NULL,
    [lastUpdateUserName] NVARCHAR(1000),
    [lastUpdateDate] DATETIME2,
    CONSTRAINT [DepartureItem_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_pharmacyId_medicationId_key] UNIQUE NONCLUSTERED ([pharmacyId], [medicationId]);

-- AddForeignKey
ALTER TABLE [dbo].[Batch] ADD CONSTRAINT [Batch_medicationId_fkey] FOREIGN KEY ([medicationId]) REFERENCES [dbo].[Medication]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Batch] ADD CONSTRAINT [Batch_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Batch] ADD CONSTRAINT [Batch_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_medicationId_fkey] FOREIGN KEY ([medicationId]) REFERENCES [dbo].[Medication]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Arrival] ADD CONSTRAINT [Arrival_pharmacyId_fkey] FOREIGN KEY ([pharmacyId]) REFERENCES [dbo].[Pharmacy]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Arrival] ADD CONSTRAINT [Arrival_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Arrival] ADD CONSTRAINT [Arrival_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ArrivalItem] ADD CONSTRAINT [ArrivalItem_arrivalId_fkey] FOREIGN KEY ([arrivalId]) REFERENCES [dbo].[Arrival]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ArrivalItem] ADD CONSTRAINT [ArrivalItem_batchId_fkey] FOREIGN KEY ([batchId]) REFERENCES [dbo].[Batch]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ArrivalItem] ADD CONSTRAINT [ArrivalItem_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ArrivalItem] ADD CONSTRAINT [ArrivalItem_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Departure] ADD CONSTRAINT [Departure_pharmacyId_fkey] FOREIGN KEY ([pharmacyId]) REFERENCES [dbo].[Pharmacy]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Departure] ADD CONSTRAINT [Departure_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Departure] ADD CONSTRAINT [Departure_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItem] ADD CONSTRAINT [DepartureItem_departureId_fkey] FOREIGN KEY ([departureId]) REFERENCES [dbo].[Departure]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItem] ADD CONSTRAINT [DepartureItem_batchId_fkey] FOREIGN KEY ([batchId]) REFERENCES [dbo].[Batch]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItem] ADD CONSTRAINT [DepartureItem_creatorUserName_fkey] FOREIGN KEY ([creatorUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DepartureItem] ADD CONSTRAINT [DepartureItem_lastUpdateUserName_fkey] FOREIGN KEY ([lastUpdateUserName]) REFERENCES [dbo].[User]([userName]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
