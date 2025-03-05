using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class DataType_Add_IsDefault_Mark_And_Type_Reference_From_Field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "DataTypes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ReferenceId",
                table: "DataTypeFields",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DataTypeFields_ReferenceId",
                table: "DataTypeFields",
                column: "ReferenceId");

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

            migrationBuilder.DropIndex(
                name: "IX_DataTypeFields_ReferenceId",
                table: "DataTypeFields");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "DataTypes");

            migrationBuilder.DropColumn(
                name: "ReferenceId",
                table: "DataTypeFields");
        }
    }
}
