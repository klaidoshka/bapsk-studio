using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Change_InstanceUserMeta_Entity_Name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InstanceUserPermissions_InstanceUserMetas_InstanceUserMetaId",
                table: "InstanceUserPermissions");

            migrationBuilder.DropTable(
                name: "InstanceUserMetas");

            migrationBuilder.RenameColumn(
                name: "InstanceUserMetaId",
                table: "InstanceUserPermissions",
                newName: "InstanceUserId");

            migrationBuilder.CreateTable(
                name: "InstanceUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InstanceId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstanceUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InstanceUsers_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InstanceUsers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_InstanceUsers_InstanceId",
                table: "InstanceUsers",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_InstanceUsers_UserId",
                table: "InstanceUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_InstanceUserPermissions_InstanceUsers_InstanceUserId",
                table: "InstanceUserPermissions",
                column: "InstanceUserId",
                principalTable: "InstanceUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InstanceUserPermissions_InstanceUsers_InstanceUserId",
                table: "InstanceUserPermissions");

            migrationBuilder.DropTable(
                name: "InstanceUsers");

            migrationBuilder.RenameColumn(
                name: "InstanceUserId",
                table: "InstanceUserPermissions",
                newName: "InstanceUserMetaId");

            migrationBuilder.CreateTable(
                name: "InstanceUserMetas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    InstanceId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstanceUserMetas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InstanceUserMetas_Instances_InstanceId",
                        column: x => x.InstanceId,
                        principalTable: "Instances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InstanceUserMetas_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_InstanceUserMetas_InstanceId",
                table: "InstanceUserMetas",
                column: "InstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_InstanceUserMetas_UserId",
                table: "InstanceUserMetas",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_InstanceUserPermissions_InstanceUserMetas_InstanceUserMetaId",
                table: "InstanceUserPermissions",
                column: "InstanceUserMetaId",
                principalTable: "InstanceUserMetas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
