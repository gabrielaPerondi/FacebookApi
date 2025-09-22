using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookDb.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string? Conteudo { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}