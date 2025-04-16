using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_StiVatReturnDeclarationPayments_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarationPayments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Amount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeclarationId = table.Column<string>(type: "varchar(34)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarationPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarationPayments_StiVatReturnDeclarations_Dec~",
                        column: x => x.DeclarationId,
                        principalTable: "StiVatReturnDeclarations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarationPayments_DeclarationId",
                table: "StiVatReturnDeclarationPayments",
                column: "DeclarationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarationPayments");
        }
    }
}
