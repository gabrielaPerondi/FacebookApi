using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookApi.Models
{
    public class Curtida
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int PostId { get; set; }
        public DateTime Data { get; set; } = DateTime.Now;
    }
}