using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FacebookDb.Context;
using FacebookDb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacebookDb.Controllers
{
    public class FacebookController : ControllerBase
    {
        private readonly FacebookContext _context;

        public FacebookController(FacebookContext context)
        {
            _context = context;
        }

        // POST /api/usuarios → cadastrar usuário.=============
        // GET /api/usuarios → listar usuários.===============
        // POST /api/posts → criar um post.
        // GET /api/posts → listar posts com autor e curtidas. --NÃO TERÁ  --
        // POST /api/posts/{id}/curtir → curtir um post.

        [HttpGet("RetornaUsuario")]
        public async Task<IActionResult> GetUsuario()
        {
            var usuario = await _context.Facebook.ToListAsync();//permitindo que o servidor atenda outras requisições ao mesmo tempo.
            return Ok(usuario);
        }

        [HttpPost("CriaUsuario")]
        public async Task<IActionResult> CriarUsuarioFace(Usuario usuario)
        {
            _context.Facebook.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }
        [HttpGet]


        
    }
}