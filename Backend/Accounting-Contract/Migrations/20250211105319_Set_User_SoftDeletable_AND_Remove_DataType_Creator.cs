using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Set_User_SoftDeletable_AND_Remove_DataType_Creator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DataTypes_Users_CreatedById",
                table: "DataTypes");

            migrationBuilder.DropIndex(
                name: "IX_DataTypes_CreatedById",
                table: "DataTypes");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "DataTypes");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "DataTypes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DataTypes_CreatedById",
                table: "DataTypes",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_DataTypes_Users_CreatedById",
                table: "DataTypes",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
