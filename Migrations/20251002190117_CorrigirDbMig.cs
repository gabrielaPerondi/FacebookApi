using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FacebookDb.Migrations
{
    /// <inheritdoc />
    public partial class CorrigirDbMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Interacaos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Tipo",
                table: "Interacaos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioId",
                table: "Interacaos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Tipo",
                table: "Interacaos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }
    }
}
