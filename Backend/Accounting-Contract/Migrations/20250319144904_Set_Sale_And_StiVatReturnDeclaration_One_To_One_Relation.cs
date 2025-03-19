using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Set_Sale_And_StiVatReturnDeclaration_One_To_One_Relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations");

            // Drop the index
            migrationBuilder.DropIndex(
                name: "IX_StiVatReturnDeclarations_SaleId",
                table: "StiVatReturnDeclarations");

            // Recreate the index as unique
            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarations_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId",
                unique: true);

            // Recreate the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations");

            // Drop the unique index
            migrationBuilder.DropIndex(
                name: "IX_StiVatReturnDeclarations_SaleId",
                table: "StiVatReturnDeclarations");

            // Recreate the index
            migrationBuilder.CreateIndex(
                name: "IX_StiVatReturnDeclarations_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId");

            // Recreate the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_StiVatReturnDeclarations_Sales_SaleId",
                table: "StiVatReturnDeclarations",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
