using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_Customer_Sale_Salesman_SoldGoods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SaleTaxFreeDeclarations");

            migrationBuilder.AddColumn<int>(
                name: "DisplayFieldId",
                table: "DataTypes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReferenceId",
                table: "DataTypeFields",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Birthdate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FirstName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IdentityDocument = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IdentityDocumentIssuedBy = table.Column<int>(type: "int", nullable: false),
                    IdentityDocumentType = table.Column<int>(type: "int", nullable: false),
                    InstanceId = table.Column<int>(type: "int", nullable: true),
                    LastName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Customers_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Salesmen",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InstanceId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VatPayerCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VatPayerCodeIssuedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Salesmen", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Salesmen_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CashRegisterNo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CashRegisterReceiptNo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    InstanceId = table.Column<int>(type: "int", nullable: true),
                    InvoiceNo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SalesmanId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sales_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Sales_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Sales_Salesmen_SalesmanId",
                        column: x => x.SalesmanId,
                        principalTable: "Salesmen",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SoldGoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    SaleId = table.Column<int>(type: "int", nullable: false),
                    SequenceNo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TaxableAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UnitOfMeasureType = table.Column<int>(type: "int", nullable: false),
                    VatAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    VatRate = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoldGoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SoldGoods_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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
                        name: "FK_StiVatReturnDeclarations_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                        column: x => x.SaleId,
                        principalTable: "Sales",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarations_Users_DeclaredById",
                        column: x => x.DeclaredById,
                        principalTable: "Users",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DataTypeFields_ReferenceId",
                table: "DataTypeFields",
                column: "ReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_InstanceId",
                table: "Customers",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CustomerId",
                table: "Sales",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_InstanceId",
                table: "Sales",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Sales_SalesmanId",
                table: "Sales",
                column: "SalesmanId");

            migrationBuilder.CreateIndex(
                name: "IX_Salesmen_InstanceId",
                table: "Salesmen",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_SoldGoods_SaleId",
                table: "SoldGoods",
                column: "SaleId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_DataTypeFields_DataTypes_ReferenceId",
                table: "DataTypeFields",
                column: "ReferenceId",
                principalTable: "DataTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DataTypeFields_DataTypes_ReferenceId",
                table: "DataTypeFields");

            migrationBuilder.DropTable(
                name: "SoldGoods");

            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarations");

            migrationBuilder.DropTable(
                name: "Sales");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Salesmen");

            migrationBuilder.DropIndex(
                name: "IX_DataTypeFields_ReferenceId",
                table: "DataTypeFields");

            migrationBuilder.DropColumn(
                name: "DisplayFieldId",
                table: "DataTypes");

            migrationBuilder.DropColumn(
                name: "ReferenceId",
                table: "DataTypeFields");

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
