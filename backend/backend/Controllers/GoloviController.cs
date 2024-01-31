using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Golovi;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoloviController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;

        public GoloviController(DiplomskiTurniriContext context)
        {
            _context = context;
        }

        // GET: api/Golovi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Go>>> GetGos()
        {
          if (_context.Gos == null)
          {
              return NotFound();
          }
            return await _context.Gos.ToListAsync();
        }

        // GET: api/Golovi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Go>> GetGo(int id)
        {
          if (_context.Gos == null)
          {
              return NotFound();
          }
            var go = await _context.Gos.FindAsync(id);

            if (go == null)
            {
                return NotFound();
            }

            return go;
        }

        // PUT: api/Golovi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGo(int id, Go go)
        {
            if (id != go.IdGola)
            {
                return BadRequest();
            }

            _context.Entry(go).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Golovi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Go>> PostGo(PostGo go)
        {
          if (_context.Gos == null)
          {
              return Problem("Entity set 'DiplomskiTurniriContext.Gos'  is null.");
            }
            _context.Gos.Add(new Go {
                IdIgraca = go.IdIgraca,
                IdMeca = go.IdMeca,
                IdTima = go.IdTima,
                Minut = go.Minut,
            });
            var mec=_context.Mecs.FirstOrDefault(mec => mec.IdMeca == go.IdMeca);
            if (mec.TimIdTima == go.IdTima)
            {
                mec.BrGolovaTim1++;
            }
            else
                mec.BrGolovaTim2++;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Golovi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGo(int id)
        {
            if (_context.Gos == null)
            {
                return NotFound();
            }
            var go = await _context.Gos.FindAsync(id);
            if (go == null)
            {
                return NotFound();
            }

            _context.Gos.Remove(go);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GoExists(int id)
        {
            return (_context.Gos?.Any(e => e.IdGola == id)).GetValueOrDefault();
        }
    }
}
