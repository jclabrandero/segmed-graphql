BEGIN TRY

BEGIN TRAN;

-- Verificar si la columna existe antes de agregarla
IF NOT EXISTS (SELECT * FROM sys.columns 
               WHERE Name = N'invoiceTotalRefPrice' 
               AND Object_ID = Object_ID(N'dbo.Arrival'))
BEGIN
    ALTER TABLE [dbo].[Arrival] ADD [invoiceTotalRefPrice] DECIMAL(32,16) NOT NULL CONSTRAINT [Arrival_invoiceTotalRefPrice_df] DEFAULT 0;
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