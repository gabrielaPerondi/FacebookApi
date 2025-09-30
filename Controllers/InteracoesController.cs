using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FacebookDb.Context;
using FacebookDb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacebookApi.Controllers
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

        // POST: api/Interacoes
        // Cria uma interação (curtir ou comentar)
        [HttpPost]
        public async Task<IActionResult> CriarInteracao([FromBody] CriarInteracaoDTO dto)
        {
            // Verifica se o post existe
            var post = await _context.Posts.FindAsync(dto.PostId);
            if (post == null)
                return NotFound("Post não encontrado.");

            var interacao = new Interacao
            {
                PostId = dto.PostId,
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
                    interacao.DataCriacao,
                }
            );
        }

        // GET: api/Interacoes/{postId}
        // Retorna todas interações de um post
        [HttpGet("{postId}")]
        public async Task<IActionResult> GetInteracoesDoPost(int postId)
        {
            var interacoes = await _context
                .Interacaos.Where(i => i.PostId == postId)
                .OrderByDescending(i => i.DataCriacao)
                .ToListAsync();

            return Ok(interacoes);
        }

        // DELETE: api/Interacoes/{id}
        // Remove uma interação específica
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInteracao(int id)
        {
            var interacao = await _context.Interacaos.FindAsync(id);
            if (interacao == null)
                return NotFound();

            _context.Interacaos.Remove(interacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
