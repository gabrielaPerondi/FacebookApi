using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FacebookDb.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public int IdFacebook { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public DateTime Datacadastro { get; set; } = DateTime.Now;

        public ICollection<Post>? Posts { get; set; }//o usuario pode ter varios post //Facilita quando quiser trazer os posts junto com o usuário.
    }
}