using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FacebookDb.Models;
using Microsoft.EntityFrameworkCore;

namespace FacebookDb.Context
{
    public class FacebookContext : DbContext
    {
        public FacebookContext(DbContextOptions<FacebookContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios{ get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)//cria tabelas para as entidades Usuario e Post.
        {
            modelBuilder.Entity<Usuario>()
                        .HasIndex(u => u.Email)
                        .IsUnique();//não é possível ter dois usuários com o mesmo email no banco.
            base.OnModelCreating(modelBuilder);//chama a versão base do método no DbContext
        }
        
    }
}