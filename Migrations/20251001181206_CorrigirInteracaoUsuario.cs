using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FacebookDb.Migrations
{
    /// <inheritdoc />
    public partial class CorrigirInteracaoUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Interacaos_Usuarios_UsuarioId",
                table: "Interacaos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }
    }
}
