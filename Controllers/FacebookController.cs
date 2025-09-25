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
    [ApiController]
    [Route("api/[controller]")]
    public class FacebookController : ControllerBase
    {
        private readonly FacebookContext _context;

        public FacebookController(FacebookContext context)
        {
            _context = context;
        }

        [HttpGet("RetornaUsuario")]
        public async Task<IActionResult> GetUsuario()
        {
            var usuario = await _context.Usuarios.ToListAsync(); //permitindo que o servidor atenda outras requisições ao mesmo tempo.
            return Ok(usuario);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Getid(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id); //permitindo que o servidor atenda outras requisições ao mesmo tempo.
            if (usuario == null)
            {
                return NotFound();
            }
            return Ok(usuario);
        }

        [HttpPost("CriaUsuario")]
        public async Task<IActionResult> CriarUsuarioFace(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => 
                u.Email.ToLower() == login.Email.ToLower() && 
                u.Senha == login.Senha); // senha normalmente não se altera

             if (usuario == null)
                return Unauthorized("Email ou senha incorretos");

            return Ok(usuario);
        }


        [HttpPut]
        public async Task<IActionResult> Atualizar(int id, Usuario usuario)
        {
            _context.Entry(usuario).State = EntityState.Modified; //todos os campos sejam atualizados no banco.”
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
