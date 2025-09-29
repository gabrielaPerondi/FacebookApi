using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FacebookApi.Models;
using FacebookDb.Context;
using Microsoft.AspNetCore.Mvc;

namespace FacebookApi.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class InteracoesController : ControllerBase
    {
        private readonly FacebookContext _context;

        public InteracoesController(FacebookContext context)
        {
            _context = context;
        }

        // CURTIR O POST

        [HttpPost]
        public IActionResult Curtir([FromBody] Curtida curtida)
        {
            _context.Curtida.Add(curtida);
        }

    }
}