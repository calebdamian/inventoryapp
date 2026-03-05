CREATE DATABASE IF NOT EXISTS inventorydb;

USE inventorydb;

CREATE TABLE Products (
    Id CHAR(36) NOT NULL,
    Name VARCHAR(150) NOT NULL,
    Description TEXT NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Image VARCHAR(500) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL,
    
    CONSTRAINT PK_Products PRIMARY KEY (Id),
    CONSTRAINT CHK_Products_Stock CHECK (Stock >= 0),
    CONSTRAINT CHK_Products_Price CHECK (Price >= 0)
) ENGINE=InnoDB;

CREATE TABLE Transactions (
    Id CHAR(36) NOT NULL,
    Date DATETIME(6) NOT NULL,
    Type INT NOT NULL,
    ProductId CHAR(36) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    Detail TEXT NOT NULL,

    CONSTRAINT PK_Transactions PRIMARY KEY (Id),

    CONSTRAINT FK_Transactions_Product
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT CHK_Transactions_Type CHECK (Type IN (1, 2)),
    CONSTRAINT CHK_Transactions_Quantity CHECK (Quantity > 0),
    CONSTRAINT CHK_Transactions_UnitPrice CHECK (UnitPrice >= 0),
    CONSTRAINT CHK_Transactions_TotalPrice CHECK (TotalPrice >= 0)

) ENGINE=InnoDB;


