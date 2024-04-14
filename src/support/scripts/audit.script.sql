
CREATE TYPE TColumns AS TABLE
(
	name	VARCHAR(MAX),
	ordinal	INT
);
GO

CREATE TYPE TTrace AS TABLE
(
	insertedId INT
);
GO

CREATE OR ALTER PROCEDURE SPCreateAuditLog
	@tableName		VARCHAR(MAX),
	@trace			TTrace READONLY,
	@inserted		VARCHAR(MAX),
	@deleted		VARCHAR(MAX),
	@columnsUpdated	VARBINARY(MAX)
AS
BEGIN
	DECLARE @byteOffset INT,
			@bitOffset INT,
			@maxByteOffset INT,
			@currentByte VARBINARY(1),
			@columns TColumns,
			@colName VARCHAR(MAX),
			@insertedRowsCount INT;

	BEGIN TRANSACTION;

	SET @insertedRowsCount = (SELECT COUNT(insertedId) FROM @trace);

	IF (@insertedRowsCount > 1)
	BEGIN
		RAISERROR ('No se permite modificar múltiples registros.', 10, 1);
		ROLLBACK TRANSACTION;
	END
	ELSE
	BEGIN
		SET @byteOffset = 1;
		SET @maxByteOffset = LEN(@columnsUpdated);
		INSERT INTO @columns(name, ordinal) SELECT COLUMN_NAME, ORDINAL_POSITION FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @tableName;

		WHILE @byteOffset <= @maxByteOffset
		BEGIN
			SET @currentByte = SUBSTRING(@columnsUpdated, @byteOffset, 1);
			SET @bitOffset = 0;

			WHILE @bitOffset < 8
			BEGIN
				IF GET_BIT(@currentByte, @bitOffset) = 1
				BEGIN
					SELECT @colName = name FROM @columns WHERE ordinal = ((@bitOffset + 1) + 8*(@byteOffset - 1));

					IF (@colName <> 'lastUpdateUserName') AND (@colName <> 'lastUpdateDate')
					BEGIN
						INSERT INTO Audit
							(tableName, fieldName, rowId, oldValue, newValue, host, application, applicationUser, userName, date)        
						VALUES (
							@tableName,
							@colName,
							JSON_VALUE(@inserted, '$[0].id'),
							JSON_VALUE(@deleted, '$[0].'+@colName),
							JSON_VALUE(@inserted, '$[0].'+@colName),
							HOST_NAME(),
							APP_NAME(),
							CURRENT_USER,
							JSON_VALUE(@inserted, '$[0].lastUpdateUserName'),
							JSON_VALUE(@inserted, '$[0].lastUpdateDate')
						);
					END
				END

				SET @bitOffset = @bitOffset + 1;
			END

			SET @byteOffset = @byteOffset + 1;
		END

		COMMIT TRANSACTION;
	END
END
GO
