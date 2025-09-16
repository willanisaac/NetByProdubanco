Create Database netby_produbanco
go

use netby_produbanco
go


CREATE TABLE [dbo].[Products](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(2000) NULL,
    [Category] NVARCHAR(200) NULL,
    [ImageUrl] NVARCHAR(1000) NULL,
    [Price] DECIMAL(18,2) NOT NULL,
    [Stock] INT NOT NULL
);

CREATE TABLE [dbo].[Transactions](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Date] DATETIME2 NOT NULL,
    [Type] NVARCHAR(20) NOT NULL,
    [ProductId] UNIQUEIDENTIFIER NOT NULL,
    [Quantity] INT NOT NULL,
    [UnitPrice] DECIMAL(18,2) NOT NULL,
    [TotalPrice] DECIMAL(18,2) NOT NULL,
    [Detail] NVARCHAR(2000) NULL
);