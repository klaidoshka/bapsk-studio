using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_StiVatReturnDeclaration_Export_Tables_And_IsCanceled_Field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCanceled",
                table: "StiVatReturnDeclarations",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarationExports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AssessmentDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CorrectionDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CustomsOfficeCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeclarationId = table.Column<string>(type: "varchar(34)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeclarationCorrectionNo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    VerificationDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    VerificationResult = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarationExports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarationExports_StiVatReturnDeclarations_Decl~",
                        column: x => x.DeclarationId,
                        principalTable: "StiVatReturnDeclarations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarationExportAssessmentConditions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExportId = table.Column<int>(type: "int", nullable: false),
                    IsMet = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TotalAmountVerified = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarationExportAssessmentConditions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarationExportAssessmentConditions_StiVatRetu~",
                        column: x => x.ExportId,
                        principalTable: "StiVatReturnDeclarationExports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarationExportVerifiedGoods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ExportId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    QuantityVerified = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    SequenceNo = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    UnitOfMeasure = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UnitOfMeasureType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarationExportVerifiedGoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarationExportVerifiedGoods_StiVatReturnDecla~",
                        column: x => x.ExportId,
                        principalTable: "StiVatReturnDeclarationExports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarationExportAssessmentConditions_ExportId",
                table: "StiVatReturnDeclarationExportAssessmentConditions",
                column: "ExportId");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarationExports_DeclarationId",
                table: "StiVatReturnDeclarationExports",
                column: "DeclarationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarationExportVerifiedGoods_ExportId",
                table: "StiVatReturnDeclarationExportVerifiedGoods",
                column: "ExportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarationExportAssessmentConditions");

            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarationExportVerifiedGoods");

            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarationExports");

            migrationBuilder.DropColumn(
                name: "IsCanceled",
                table: "StiVatReturnDeclarations");
        }
    }
}
