using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_InstanceUserPermission_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InstanceUserPermissions",
                columns: table => new
                {
                    InstanceUserMetaId = table.Column<int>(type: "int", nullable: false),
                    Permission = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstanceUserPermissions", x => new { x.InstanceUserMetaId, x.Permission });
                    table.ForeignKey(
                        name: "FK_InstanceUserPermissions_InstanceUserMetas_InstanceUserMetaId",
                        column: x => x.InstanceUserMetaId,
                        principalTable: "InstanceUserMetas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InstanceUserPermissions");
        }
    }
}
