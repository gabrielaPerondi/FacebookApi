using System;
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
    public class InteracoesController : ControllerBase
    {
        private readonly FacebookContext _context;

        public InteracoesController(FacebookContext context)
        {
            _context = context;
        }

        // POST (curtir ou comentar)
        [HttpPost]
        public async Task<IActionResult> CriarInteracao([FromBody] CriarInteracaoDTO dto)
        {
            // Verifica se o post existe
            var post = await _context.Posts.FindAsync(dto.PostId);
            if (post == null)
                return NotFound("Post não encontrado.");

            // Verifica se o usuário existe
            var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
            if (usuario == null)
                return BadRequest("Usuário inválido.");

            // Evita curtida duplicada
            if (dto.Tipo == "curtida")
            {
                var jaCurtiu = await _context.Interacaos.AnyAsync(i =>
                    i.PostId == dto.PostId && i.UsuarioId == dto.UsuarioId && i.Tipo == "curtida"
                );

                if (jaCurtiu)
                    return BadRequest("Usuário já curtiu este post.");
            }

            var interacao = new Interacao
            {
                PostId = dto.PostId,
                UsuarioId = dto.UsuarioId,
                Tipo = dto.Tipo,
                Texto = dto.Texto,
                DataCriacao = DateTime.Now,
            };

            _context.Interacaos.Add(interacao);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    interacao.Id,
                    interacao.Tipo,
                    interacao.Texto,
                    interacao.PostId,
                    interacao.UsuarioId,
                    interacao.DataCriacao,
                }
            );
        }

        // GET interações de um post
        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetInteracoesDoPost(int postId)
        {
            var interacoes = await _context
                .Interacaos.Where(i => i.PostId == postId)
                .Include(i => i.Usuario)
                .OrderByDescending(i => i.DataCriacao)
                .ToListAsync();

            return Ok(interacoes);
        }

        // GET todas as interações
        [HttpGet]
        public IActionResult GetList()
        {
            return Ok(_context.Interacaos.Include(i => i.Usuario));
        }

        // Verificar se usuário já curtiu
        [HttpGet("verificarCurtida/{postId}/{usuarioId}")]
        public async Task<IActionResult> VerificarCurtida(int postId, int usuarioId)
        {
            var existe = await _context.Interacaos.AnyAsync(i =>
                i.PostId == postId && i.UsuarioId == usuarioId && i.Tipo == "curtida"
            );

            return Ok(existe);
        }

        // DELETE interação********* ESTA DANDO ERRO
        [HttpDelete("{id}/{usuarioId}")]
        public async Task<IActionResult> DeleteInteracao(int id, int usuarioId)
        {
            var interacao = await _context.Interacaos.FindAsync(id);
            if (interacao == null)
                return NotFound();

            // Busca o post 
            var post = await _context.Posts.FindAsync(interacao.PostId);
            if (post == null)
                return NotFound("Post não encontrado.");

            // Permite deletar se for dono da interação ou dono do post
            if (interacao.UsuarioId != usuarioId && post.UsuarioId != usuarioId)
                return Forbid("Você não pode excluir esta interação.");

            _context.Interacaos.Remove(interacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE curtida
        [HttpDelete("descurtir/{postId}/{usuarioId}")]
        public async Task<IActionResult> Descurtir(int postId, int usuarioId)
        {
            var curtida = await _context.Interacaos.FirstOrDefaultAsync(i =>
                i.PostId == postId && i.UsuarioId == usuarioId && i.Tipo == "curtida"
            );

            if (curtida == null)
                return NotFound("Curtida não encontrada.");

            _context.Interacaos.Remove(curtida);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
