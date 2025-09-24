using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FacebookDb.Migrations
{
    /// <inheritdoc />
    public partial class AddLegendaToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Conteudo",
                table: "Posts",
                newName: "Legenda");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Legenda",
                table: "Posts",
                newName: "Conteudo");
        }
    }
}
