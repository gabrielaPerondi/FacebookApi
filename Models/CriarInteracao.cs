using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookDb.Models
{
    public class CriarInteracaoDTO
    {
        public int PostId { get; set; }
        public int UsuarioId { get; set; }
        public string? Tipo { get; set; }
        public string? Texto { get; set; }
    }
}
