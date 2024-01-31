using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KORISNIK",
                columns: table => new
                {
                    EMAIL = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    IME = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KORISNIK", x => x.EMAIL);
                });

            migrationBuilder.CreateTable(
                name: "TIM",
                columns: table => new
                {
                    ID_TIMA = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EMAIL = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    NAZIV_TIMA = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    LOGO = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TIM", x => x.ID_TIMA);
                    table.ForeignKey(
                        name: "FK_TIM_KORISNIK__KORISNIK",
                        column: x => x.EMAIL,
                        principalTable: "KORISNIK",
                        principalColumn: "EMAIL");
                });

            migrationBuilder.CreateTable(
                name: "TURNIR",
                columns: table => new
                {
                    ID_TURNIRA = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EMAIL = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    NAZIV_TURNIRA = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    DATUM_ODRZAVANJA = table.Column<DateTime>(type: "datetime", nullable: false),
                    LOKACIJA_ODRZAVANJA = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    STATUS = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TURNIR", x => x.ID_TURNIRA);
                    table.ForeignKey(
                        name: "FK_TURNIR_KORISNIK__KORISNIK",
                        column: x => x.EMAIL,
                        principalTable: "KORISNIK",
                        principalColumn: "EMAIL");
                });

            migrationBuilder.CreateTable(
                name: "IGRAC",
                columns: table => new
                {
                    ID_IGRACA = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_TIMA = table.Column<int>(type: "int", nullable: true),
                    EMAIL = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    IME_IGRACA = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    DATUM_RODJENJA = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IGRAC", x => x.ID_IGRACA);
                    table.ForeignKey(
                        name: "FK_IGRAC_IGRAC_IGR_TIM",
                        column: x => x.ID_TIMA,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                    table.ForeignKey(
                        name: "FK_IGRAC_KORISNIK__KORISNIK",
                        column: x => x.EMAIL,
                        principalTable: "KORISNIK",
                        principalColumn: "EMAIL");
                });

            migrationBuilder.CreateTable(
                name: "RUNDE",
                columns: table => new
                {
                    ID_RUNDE = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_TURNIRA = table.Column<int>(type: "int", nullable: true),
                    RUNDA = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RUNDE", x => x.ID_RUNDE);
                    table.ForeignKey(
                        name: "FK_RUNDE_RUNDE_TUR_TURNIR",
                        column: x => x.ID_TURNIRA,
                        principalTable: "TURNIR",
                        principalColumn: "ID_TURNIRA");
                });

            migrationBuilder.CreateTable(
                name: "TIMOVI_UCESTVUJU_U_TURNIRIMA",
                columns: table => new
                {
                    ID_TIMA = table.Column<int>(type: "int", nullable: false),
                    ID_TURNIRA = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TIMOVI_UCESTVUJU_U_TURNIRIM", x => new { x.ID_TIMA, x.ID_TURNIRA });
                    table.ForeignKey(
                        name: "FK_TIMOVI_U_TIMOVI_UC_TIM",
                        column: x => x.ID_TIMA,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                    table.ForeignKey(
                        name: "FK_TIMOVI_U_TIMOVI_UC_TURNIR",
                        column: x => x.ID_TURNIRA,
                        principalTable: "TURNIR",
                        principalColumn: "ID_TURNIRA");
                });

            migrationBuilder.CreateTable(
                name: "MEC",
                columns: table => new
                {
                    ID_MECA = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_RUNDE = table.Column<int>(type: "int", nullable: true),
                    ID_TIMA = table.Column<int>(type: "int", nullable: true),
                    TIM_ID_TIMA = table.Column<int>(type: "int", nullable: true),
                    TIM_ID_TIMA2 = table.Column<int>(type: "int", nullable: true),
                    BR_GOLOVA_TIM_1 = table.Column<int>(type: "int", nullable: false),
                    BR_GOLOVA_TIM_2 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MEC", x => x.ID_MECA);
                    table.ForeignKey(
                        name: "FK_MEC_MECEVI_U__RUNDE",
                        column: x => x.ID_RUNDE,
                        principalTable: "RUNDE",
                        principalColumn: "ID_RUNDE");
                    table.ForeignKey(
                        name: "FK_MEC_POBJEDNIK_TIM",
                        column: x => x.TIM_ID_TIMA2,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                    table.ForeignKey(
                        name: "FK_MEC_TIM1_TIM",
                        column: x => x.TIM_ID_TIMA,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                    table.ForeignKey(
                        name: "FK_MEC_TIM2_TIM",
                        column: x => x.ID_TIMA,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                });

            migrationBuilder.CreateTable(
                name: "GO",
                columns: table => new
                {
                    ID_GOLA = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_IGRACA = table.Column<int>(type: "int", nullable: true),
                    ID_TIMA = table.Column<int>(type: "int", nullable: true),
                    ID_MECA = table.Column<int>(type: "int", nullable: true),
                    MINUT = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GO", x => x.ID_GOLA);
                    table.ForeignKey(
                        name: "FK_GO_GOLOVI_U__MEC",
                        column: x => x.ID_MECA,
                        principalTable: "MEC",
                        principalColumn: "ID_MECA");
                    table.ForeignKey(
                        name: "FK_GO_IGRAC_DAO_IGRAC",
                        column: x => x.ID_IGRACA,
                        principalTable: "IGRAC",
                        principalColumn: "ID_IGRACA");
                    table.ForeignKey(
                        name: "FK_GO_TIM_DAO_G_TIM",
                        column: x => x.ID_TIMA,
                        principalTable: "TIM",
                        principalColumn: "ID_TIMA");
                });

            migrationBuilder.CreateIndex(
                name: "GOLOVI_U_MECU_FK",
                table: "GO",
                column: "ID_MECA");

            migrationBuilder.CreateIndex(
                name: "IGRAC_DAO_GO_FK",
                table: "GO",
                column: "ID_IGRACA");

            migrationBuilder.CreateIndex(
                name: "TIM_DAO_GO_FK",
                table: "GO",
                column: "ID_TIMA");

            migrationBuilder.CreateIndex(
                name: "IGRAC_IGRA_ZA_TIM_FK",
                table: "IGRAC",
                column: "ID_TIMA");

            migrationBuilder.CreateIndex(
                name: "KORISNIK_POSJEDUJE_IGRACE_FK",
                table: "IGRAC",
                column: "EMAIL");

            migrationBuilder.CreateIndex(
                name: "MECEVI_U_RUNDI_FK",
                table: "MEC",
                column: "ID_RUNDE");

            migrationBuilder.CreateIndex(
                name: "POBJEDNIK_FK",
                table: "MEC",
                column: "TIM_ID_TIMA2");

            migrationBuilder.CreateIndex(
                name: "TIM1_FK",
                table: "MEC",
                column: "TIM_ID_TIMA");

            migrationBuilder.CreateIndex(
                name: "TIM2_FK",
                table: "MEC",
                column: "ID_TIMA");

            migrationBuilder.CreateIndex(
                name: "RUNDE_TURNIRA_FK",
                table: "RUNDE",
                column: "ID_TURNIRA");

            migrationBuilder.CreateIndex(
                name: "KORISNIK_POSJEDUJE_TIMOVE_FK",
                table: "TIM",
                column: "EMAIL");

            migrationBuilder.CreateIndex(
                name: "TIMOVI_UCESTVUJU_U_TURNIRIMA_FK",
                table: "TIMOVI_UCESTVUJU_U_TURNIRIMA",
                column: "ID_TIMA");

            migrationBuilder.CreateIndex(
                name: "TIMOVI_UCESTVUJU_U_TURNIRIMA2_FK",
                table: "TIMOVI_UCESTVUJU_U_TURNIRIMA",
                column: "ID_TURNIRA");

            migrationBuilder.CreateIndex(
                name: "KORISNIK_POSJEDUJE_TURNIRE_FK",
                table: "TURNIR",
                column: "EMAIL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GO");

            migrationBuilder.DropTable(
                name: "TIMOVI_UCESTVUJU_U_TURNIRIMA");

            migrationBuilder.DropTable(
                name: "MEC");

            migrationBuilder.DropTable(
                name: "IGRAC");

            migrationBuilder.DropTable(
                name: "RUNDE");

            migrationBuilder.DropTable(
                name: "TIM");

            migrationBuilder.DropTable(
                name: "TURNIR");

            migrationBuilder.DropTable(
                name: "KORISNIK");
        }
    }
}
