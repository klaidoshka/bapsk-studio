using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class StiVatReturnDeclaration_Collect_More_Data : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SaleTaxFreeDeclarations");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "DataTypes");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "DataTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(34)", maxLength: 34, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Correction = table.Column<int>(type: "int", nullable: false),
                    DeclaredById = table.Column<int>(type: "int", nullable: true),
                    InstanceId = table.Column<int>(type: "int", nullable: true),
                    SaleId = table.Column<int>(type: "int", nullable: true),
                    State = table.Column<int>(type: "int", nullable: true),
                    SubmitDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarations_DataEntries_SaleId",
                        column: x => x.SaleId,
                        principalTable: "DataEntries",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarations_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarations_Users_DeclaredById",
                        column: x => x.DeclaredById,
                        principalTable: "Users",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarations_DeclaredById",
                table: "StiVatReturnDeclarations",
                column: "DeclaredById");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarations_InstanceId",
                table: "StiVatReturnDeclarations",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarations_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarations");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "DataTypes");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "DataTypes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "SaleTaxFreeDeclarations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(34)", maxLength: 34, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Correction = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleTaxFreeDeclarations", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
