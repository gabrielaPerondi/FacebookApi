using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookDb.Models
{
    public class Interacao
{
    public int Id { get; set; }
    public string? Tipo { get; set; } // curtir ou comentar
        public string? Texto { get; set; }

    // FK  Post
    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null;

    public DateTime DataCriacao { get; set; } = DateTime.Now;
}

}
