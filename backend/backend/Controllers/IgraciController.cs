using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Igraci;
using backend.Enums;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IgraciController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;
        private readonly AzureBlobServices _azureBlobServices;
        public IgraciController(DiplomskiTurniriContext context, AzureBlobServices azureBlobServices)
        {
            _context = context;
            _azureBlobServices = azureBlobServices;
        }

        // GET: api/Igraci
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IgraciResponseDto>>> GetIgrace(string? searchTerm, int pageSize, int cursor, [FromQuery]List<int>? timids)
        {
          if (_context.Igracs == null)
          {
              return NotFound();
          }
            IQueryable<Igrac> igraciQuery = _context.Igracs;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                igraciQuery = igraciQuery.Where(igrac => igrac.ImeIgraca.Contains(searchTerm) || igrac.IdTimaNavigation.NazivTima.Contains(searchTerm));
            }
            if(!timids.IsNullOrEmpty())
            {
                igraciQuery = igraciQuery.Where(igrac => timids.Contains((int)igrac.IdTima));
            }
            return await igraciQuery
                .Select(igrac => new IgraciResponseDto()
                {
                    IdIgraca = igrac.IdIgraca,
                    ImeIgraca = igrac.ImeIgraca,
                    slika = igrac.slika,
                    IdTima = igrac.IdTima,
                    NazivTima = igrac.IdTimaNavigation.NazivTima,
                    Logo = igrac.IdTimaNavigation.Logo,
                    BrGolova = igrac.Gos.Count()
                }
            )
            .OrderByDescending(igrac => igrac.BrGolova)
            .Where(igrac => igrac.IdIgraca >= cursor)
            .Take(pageSize)
            .ToListAsync();
        }

        // GET: api/Igraci/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SingleIgracResponseDto>> GetIgrac(int id)
        {
            if (_context.Igracs == null)
            {
                return NotFound();
            }
            var igrac = _context.Igracs.Select(igrac=>
                    new SingleIgracResponseDto
                    {
                        IdIgraca = igrac.IdIgraca,
                        BrGolova = igrac.Gos.Count(),
                        BrMeceva = igrac.IdTimaNavigation.MecTimIdTimaNavigations.Count() + igrac.IdTimaNavigation.MecTimIdTima2Navigations.Count(),
                        BrPobjeda = igrac.IdTimaNavigation.MecIdTimaNavigations.Count(),
                        IdTima = igrac.IdTima,
                        ImeIgraca = igrac.ImeIgraca,
                        Logo = igrac.IdTimaNavigation.Logo,
                        NazivTima = igrac.IdTimaNavigation.NazivTima,
                        slika = igrac.slika,
                        brGolovaUZadnjihNMeceva = _context.Gos.GroupBy(go => new { idMeca = go.IdMeca, idIgraca= go.IdIgraca}).Select(golovi=>
                            new brGolovaPoMecu
                            {
                                IdMeca = golovi.Key.idMeca,
                                BrGolova = golovi.Count(),
                                IdIgraca = golovi.Key.idIgraca
                               
                            }
                        ).Where(go => go.IdIgraca == igrac.IdIgraca).OrderByDescending(go => go.IdMeca).ToList(),
                        //TODO: treba selektovati iz meceva
                        DatumRodjenja = igrac.DatumRodjenja

                    }

                ).Where(igrac=> igrac.IdIgraca == id).AsSplitQuery().FirstOrDefault();

            if (igrac == null)
            {
                return NotFound();
            }

            return igrac;
        }

        // PUT: api/Igraci/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIgrac(int id, Igrac igrac)
        {
            if (id != igrac.IdIgraca)
            {
                return BadRequest();
            }

            _context.Entry(igrac).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IgracExists(id))
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

        // POST: api/Igraci
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Igrac>> PostIgrac([FromForm]IgracPostDto igrac)
        {
          if (_context.Igracs == null)
          {
              return Problem("Entity set 'DiplomskiTurniriContext.Igracs'  is null.");
          }

            Igrac noviIgrac = new Igrac
            {
                Email = igrac.email,
                ImeIgraca = igrac.ime,
                DatumRodjenja = igrac.datumRodjenja,
                IdTima = igrac.tim
            };

            //TODO: dodaj provjeru da li postoji tim 
            //private bool TimExists(int id)
            //{
            //    return (_context.Tims?.Any(e => e.IdTima == id)).GetValueOrDefault();
            //}
            _context.Igracs.Add(noviIgrac);
            _context.SaveChanges();
            if (igrac.slika != null)
            {
                var fileName = $"{noviIgrac.IdIgraca}{Path.GetExtension(igrac.slika.FileName)}";
                _azureBlobServices.uploadFileToContainerAsync(igrac.slika, fileName, AzureBlobContainers.SlikeIgraca); ;
                noviIgrac.slika = fileName;
                _context.SaveChanges();
            }
            return Ok();
        }

        // DELETE: api/Igraci/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIgrac(int id)
        {
            if (_context.Igracs == null)
            {
                return NotFound();
            }
            var igrac = await _context.Igracs.FindAsync(id);
            if (igrac == null)
            {
                return NotFound();
            }

            _context.Igracs.Remove(igrac);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IgracExists(int id)
        {
            return (_context.Igracs?.Any(e => e.IdIgraca == id)).GetValueOrDefault();
        }
    }
}
