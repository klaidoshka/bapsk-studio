using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Change_StiVatReturnDeclaration_IsCancelled_Field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsCanceled",
                table: "StiVatReturnDeclarations",
                newName: "IsCancelled");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsCancelled",
                table: "StiVatReturnDeclarations",
                newName: "IsCanceled");
        }
    }
}
