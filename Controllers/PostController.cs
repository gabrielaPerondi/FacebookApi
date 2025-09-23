using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using FacebookDb.Context;
using FacebookDb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacebookDb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly FacebookContext _context;

        public PostController(FacebookContext context)
        {
            _context = context;
        }

        // GET***********
        [HttpGet]
        public async Task<IActionResult> GetPost()
        {
            var post = await _context.Posts.Include(pessoa => pessoa.Usuario).ToListAsync(); //traz o usuario da conta junto
            return Ok(post);
        }

        // POST****************
        [HttpPost("upload")]
        public async Task<IActionResult> Post(
            [FromForm] string fotoUrl, // URL da imagem
            [FromForm] string legenda, // legenda do post
            [FromForm] int usuarioId)
        {
            var post = new Post
            {
                Legenda = legenda,
                FotoUrl = fotoUrl, // agora é só o link
                UsuarioId = usuarioId,
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        // PUT*********************
        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarPost(int id, Post post)
        {
            if (id != post.Id)
                return BadRequest();

            var postDb = await _context.Posts.FindAsync(id);
            if (postDb == null)
                return NotFound();

            postDb.Legenda = post.Legenda;
            postDb.FotoUrl = post.FotoUrl;
            postDb.UsuarioId = post.UsuarioId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPost(int id)
        {
            var Post = await _context.Posts.FindAsync(id);
            if (Post == null)
            {
                return NotFound();
            }
            _context.Posts.Remove(Post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
