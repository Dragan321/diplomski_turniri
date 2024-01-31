using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Timovi;
using backend.Services;
using backend.Enums;
using Microsoft.VisualBasic.FileIO;
using Microsoft.AspNetCore.Authorization;
using backend.DTO.Igraci;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimoviController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;
        private readonly AzureBlobServices _azureBlobServices;


        public TimoviController(DiplomskiTurniriContext context, AzureBlobServices azureBlobServices)
        {
            _context = context;
            _azureBlobServices = azureBlobServices;
        }

        // GET: api/Timovi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimoviResponseDto>>> GetTimove(string? searchTerm, int pageSize, int cursor)
        {
            if (_context.Tims == null)
            {
                return NotFound();
            }

            IQueryable<Tim> timoviQuery = _context.Tims;
            
            if(!string.IsNullOrWhiteSpace(searchTerm))
            {
                timoviQuery = timoviQuery.Where(tim=> tim.NazivTima.Contains(searchTerm));
            }
            return await timoviQuery
                .Select(tim=> new TimoviResponseDto()
            {
                IdTima= tim.IdTima,
                Logo = tim.Logo,
                NazivTima = tim.NazivTima,
                BrGolova = tim.Gos.Count(),
                BrPobjeda = tim.MecIdTimaNavigations.Count()
            }
            )
            .OrderByDescending(tim=> tim.BrPobjeda)
            .Where(tim=> tim.IdTima>=cursor)
            .Take(pageSize)
            .ToListAsync();
        }

        // GET: api/Timovi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SingleTimResponseDto>> GetTim(int id)
        {
            if (_context.Tims == null)
            {
                return NotFound();
            }
            var tim = _context.Tims.Select(tim=> 
                new SingleTimResponseDto
                {
                    Email = tim.Email,
                    IdTima = tim.IdTima,
                    Logo = tim.Logo,
                    NazivTima = tim.NazivTima,
                    Igracs = tim.Igracs.Select(igrac=> 
                    new OIgracu { 
                        IdIgraca= igrac.IdIgraca,
                        ImeIgraca = igrac.ImeIgraca,
                        slika = igrac.slika
               
                    }).ToList(),
                    BrGolova = tim.Gos.Count(),
                    BrMeceva = tim.MecTimIdTimaNavigations.Count() + tim.MecTimIdTima2Navigations.Count(),
                    BrPobjeda = tim.MecIdTimaNavigations.Count(),
                    brGolovaUZadnjihNMeceva = tim.Gos.GroupBy(tim => new { idMeca = tim.IdMeca, idTima = tim.IdTima }).Select(golovi =>
                    new brGolovaTimaPoMecu //TODO:dodaj take x i ovde  i na igraci i potencijalno doda br golova i jos nesta o igracu
                    {
                        IdMeca = golovi.Key.idMeca,
                        BrGolova = golovi.Count(),
                        IdTima = golovi.Key.idTima

                    }
                        ).Where(tim => tim.IdTima == tim.IdTima).OrderByDescending(go => go.IdMeca).ToList(),
                    brojOsvojenihTurnira = _context.Turnirs.Select(turnir=> turnir.Rundes.OrderBy(turnir=> turnir.Runda).Last().Mecs.First().IdTima).Where(turnir=> turnir.Value==tim.IdTima).Count()
                }
            ).Where(tim=> tim.IdTima == id).AsSplitQuery().FirstOrDefault();

            if (tim == null)
            {
                return NotFound();
            }

            return tim;
        }

        // PUT: api/Timovi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTim(int id, Tim tim)
        {
            if (id != tim.IdTima)
            {
                return BadRequest();
            }

            _context.Entry(tim).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimExists(id))
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

        // POST: api/Timovi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> PostTim([FromForm]TimPostDto tim)
        {
            if (_context.Tims == null)
            {
                return Problem("Entity set 'DiplomskiTurniriContext.Tims'  is null.");
            }
            var noviTim = new Tim
            {
                //todo: dodaj kreiranje korisnika i dodaj authorize
                //i provejeru tipa fajla https://learn.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads?view=aspnetcore-7.0#file-signature-validation
                //ili https://github.com/AJMitev/FileTypeChecker
                Email = tim.Email,
                NazivTima = tim.NazivTima
            };
            
            _context.Tims.Add(noviTim);
            _context.SaveChanges();
            if(tim.Logo != null) {
                var fileName = $"{noviTim.IdTima}{Path.GetExtension(tim.Logo?.FileName)}";
                _azureBlobServices.uploadFileToContainerAsync(tim.Logo, fileName, AzureBlobContainers.SlikeTimova); ;
                noviTim.Logo = fileName;
                _context.SaveChanges();
            }

            return Ok();
        }

        // DELETE: api/Timovi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTim(int id)
        {
            if (_context.Tims == null)
            {
                return NotFound();
            }
            var tim = await _context.Tims.FindAsync(id);
            if (tim == null)
            {
                return NotFound();
            }

            _context.Tims.Remove(tim);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TimExists(int id)
        {
            return (_context.Tims?.Any(e => e.IdTima == id)).GetValueOrDefault();
        }
    }
}
