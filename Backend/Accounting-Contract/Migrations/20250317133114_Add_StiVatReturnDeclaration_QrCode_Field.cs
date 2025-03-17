using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_StiVatReturnDeclaration_QrCode_Field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StiVatReturnDeclarationQrCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DeclarationId = table.Column<string>(type: "varchar(34)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StiVatReturnDeclarationQrCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StiVatReturnDeclarationQrCodes_StiVatReturnDeclarations_Decl~",
                        column: x => x.DeclarationId,
                        principalTable: "StiVatReturnDeclarations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarationQrCodes_DeclarationId",
                table: "StiVatReturnDeclarationQrCodes",
                column: "DeclarationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StiVatReturnDeclarationQrCodes");
        }
    }
}
