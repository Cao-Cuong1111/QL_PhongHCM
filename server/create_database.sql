/* 
Chạy script này trong SQL Server Management Studio (SSMS)
để tạo database QL_PhongHCM
*/

-- Tạo database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'QL_PhongHCM')
BEGIN
    CREATE DATABASE [QL_PhongHCM];
    PRINT 'Database QL_PhongHCM created successfully!';
END
ELSE
BEGIN
    PRINT 'Database QL_PhongHCM already exists.';
END
GO

-- Cấp quyền cho user ql_admin
USE [QL_PhongHCM];
GO

-- Tạo user mapping nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'ql_admin')
BEGIN
    CREATE USER [ql_admin] FOR LOGIN [ql_admin];
    ALTER ROLE [db_owner] ADD MEMBER [ql_admin];
    PRINT 'User ql_admin added to database with db_owner role!';
END
ELSE
BEGIN
    PRINT 'User ql_admin already exists in this database.';
END
GO
