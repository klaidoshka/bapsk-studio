using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_Customer_PersonalCode_Field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DataEntries_Users_ModifiedById",
                table: "DataEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations");

            migrationBuilder.RenameColumn(
                name: "IdentityDocument",
                table: "Customers",
                newName: "IdentityDocumentNumber");

            migrationBuilder.AlterColumn<int>(
                name: "SaleId",
                table: "StiVatReturnDeclarations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ModifiedById",
                table: "DataEntries",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedAt",
                table: "DataEntries",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentityDocumentValue",
                table: "Customers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_DataEntries_Users_ModifiedById",
                table: "DataEntries",
                column: "ModifiedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DataEntries_Users_ModifiedById",
                table: "DataEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations");

            migrationBuilder.DropColumn(
                name: "IdentityDocumentValue",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "IdentityDocumentNumber",
                table: "Customers",
                newName: "IdentityDocument");

            migrationBuilder.AlterColumn<int>(
                name: "SaleId",
                table: "StiVatReturnDeclarations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ModifiedById",
                table: "DataEntries",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ModifiedAt",
                table: "DataEntries",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddForeignKey(
                name: "FK_DataEntries_Users_ModifiedById",
                table: "DataEntries",
                column: "ModifiedById",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id");
        }
    }
}
