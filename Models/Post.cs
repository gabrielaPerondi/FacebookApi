using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookDb.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string? Legenda { get; set; }//texto
        public string? FotoUrl { get; set; }//caminho imagem
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

    }
}