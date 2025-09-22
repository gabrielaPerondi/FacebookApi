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
        
        public DbSet<Usuario> Facebook{ get; set; }
        
    }
}