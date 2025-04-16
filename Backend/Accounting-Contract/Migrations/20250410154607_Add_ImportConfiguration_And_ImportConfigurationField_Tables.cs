using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Contract.Migrations
{
    /// <inheritdoc />
    public partial class Add_ImportConfiguration_And_ImportConfigurationField_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImportConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DataTypeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportConfigurations_DataTypes_DataTypeId",
                        column: x => x.DataTypeId,
                        principalTable: "DataTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ImportConfigurationFields",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ConfigurationId = table.Column<int>(type: "int", nullable: false),
                    DataTypeFieldId = table.Column<int>(type: "int", nullable: false),
                    DefaultValue = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportConfigurationFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportConfigurationFields_DataTypeFields_DataTypeFieldId",
                        column: x => x.DataTypeFieldId,
                        principalTable: "DataTypeFields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImportConfigurationFields_ImportConfigurations_Configuration~",
                        column: x => x.ConfigurationId,
                        principalTable: "ImportConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ImportConfigurationFields_ConfigurationId",
                table: "ImportConfigurationFields",
                column: "ConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportConfigurationFields_DataTypeFieldId",
                table: "ImportConfigurationFields",
                column: "DataTypeFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportConfigurations_DataTypeId",
                table: "ImportConfigurations",
                column: "DataTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImportConfigurationFields");

            migrationBuilder.DropTable(
                name: "ImportConfigurations");
        }
    }
}
