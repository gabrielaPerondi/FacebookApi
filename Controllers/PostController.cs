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
            var post = await _context.Posts.Include(pessoapost => pessoapost.Usuario).ToListAsync(); //traz o usuario da conta junto
            return Ok(post);
        }

        //GETID******************
        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        // POST****************
         [HttpPost("upload")]
        public async Task<IActionResult> CreateAsync([FromForm] Criarpost criarpost, IFormFile file)
        {
            try
            {
                var post = new Post
                {
                    Legenda = criarpost.Legenda,
                    UsuarioId = criarpost.UsuarioId,
                };

                // salvar imagem
                if (file != null && file.Length > 0)
                {
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

                    if (!Directory.Exists(uploadsPath))
                        Directory.CreateDirectory(uploadsPath);

                    // Garante que tenha extensão válida
                    string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".jfif" };
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (string.IsNullOrEmpty(extension)) extension = ".jpg";

                    var fileNome = Guid.NewGuid().ToString() + extension;
                    var filePath = Path.Combine(uploadsPath, fileNome);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    post.FotoUrl = "/images/" + fileNome;
                }

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(ObterPorId), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT*********************
        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarPost(
            int id,
            [FromForm] Criarpost atualizarPost,
            IFormFile? file
        )
        {
            var postDb = await _context.Posts.FindAsync(id);
            if (postDb == null)
                return NotFound();

            postDb.Legenda = atualizarPost.Legenda;
            postDb.UsuarioId = atualizarPost.UsuarioId;

            if (file != null && file.Length > 0)
            {
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                postDb.FotoUrl = "/images/" + fileName;
            }

            await _context.SaveChangesAsync();
            return Ok(postDb); // Retorna o post atualizado
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarPost(int id)
        {
            var Post = await _context.Posts.FindAsync(id);
            if (Post == null)
            {
                return NotFound(new { message = $"Post com ID {id} não encontrado." });
            }
            _context.Posts.Remove(Post);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Post deletado com sucesso", postId = id });
        }
    }
}
