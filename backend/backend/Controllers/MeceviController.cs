using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeceviController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;

        public MeceviController(DiplomskiTurniriContext context)
        {
            _context = context;
        }

        // GET: api/Mecevi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mec>>> GetMecs()
        {
            if (_context.Mecs == null)
            {
                return NotFound();
            }
            return await _context.Mecs.ToListAsync();
        }

        // GET: api/Mecevi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mec>> GetMec(int id)
        {
            if (_context.Mecs == null)
            {
                return NotFound();
            }
            var mec = await _context.Mecs.FindAsync(id);

            if (mec == null)
            {
                return NotFound();
            }

            return mec;
        }

        // PUT: api/Mecevi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> ZavrsiMec(int id)
        {
           

            var mecIzBaze = _context.Mecs.Where(mec => mec.IdMeca == id).FirstOrDefault();
            if (mecIzBaze.BrGolovaTim2==mecIzBaze.BrGolovaTim1)
                return BadRequest("Mec ne moze biti nerjesen");

            if (mecIzBaze.BrGolovaTim1 > mecIzBaze.BrGolovaTim2)
                mecIzBaze.IdTima = mecIzBaze.TimIdTima;
            else
                mecIzBaze.IdTima = mecIzBaze.TimIdTima2;
            mecIzBaze.MecZavrsen = true;

            if (mecIzBaze.IdSledecegMeca == null)
            {
                mecIzBaze = _context.Mecs.Where(mec => mec.IdMeca == id).Include(mec => mec.IdRundeNavigation).ThenInclude(runda=> runda.IdTurniraNavigation).FirstOrDefault();
                mecIzBaze.IdRundeNavigation.IdTurniraNavigation.Status = "Zavrsen";

            }
            else
            {
                var sledeciMec = _context.Mecs.Where(mec => mec.IdMeca == mecIzBaze.IdSledecegMeca).First();
                if (sledeciMec.TimIdTima == null)
                { 
                    sledeciMec.TimIdTima = mecIzBaze.IdTima;
                    sledeciMec.BrGolovaTim1 = 0; 
                }
                else
                {
                    sledeciMec.TimIdTima2 = mecIzBaze.IdTima;
                    sledeciMec.BrGolovaTim2 = 0;
                }

            }
            _context.SaveChanges();

            return NoContent();
        }
        // POST: api/Mecevi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mec>> PostMec(Mec mec)
        {
          if (_context.Mecs == null)
          {
              return Problem("Entity set 'DiplomskiTurniriContext.Mecs'  is null.");
          }
            _context.Mecs.Add(mec);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMec", new { id = mec.IdMeca }, mec);
        }

        // DELETE: api/Mecevi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMec(int id)
        {
            if (_context.Mecs == null)
            {
                return NotFound();
            }
            var mec = await _context.Mecs.FindAsync(id);
            if (mec == null)
            {
                return NotFound();
            }

            _context.Mecs.Remove(mec);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MecExists(int id)
        {
            return (_context.Mecs?.Any(e => e.IdMeca == id)).GetValueOrDefault();
        }
    }
}
