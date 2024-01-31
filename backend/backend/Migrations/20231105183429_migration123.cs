using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class migration123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ID_SLEDECEG_MECA",
                table: "MEC",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MecZavrsen",
                table: "MEC",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ID_SLEDECEG_MECA",
                table: "MEC");

            migrationBuilder.DropColumn(
                name: "MecZavrsen",
                table: "MEC");
        }
    }
}
