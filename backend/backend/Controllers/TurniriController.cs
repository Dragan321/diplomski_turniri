using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Timovi;
using backend.DTO.Turniri;
using backend.DTO.Igraci;
using System.Drawing.Printing;
using YamlDotNet.Core;
using Microsoft.AspNetCore.Authorization;
using NuGet.Packaging;
using System.Runtime.InteropServices;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurniriController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;

        public TurniriController(DiplomskiTurniriContext context)
        {
            _context = context;
        }

        // GET: api/Turniri
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TurniriResponseDto>>> GetTurnirs(string? searchTerm, int pageSize, int cursor)
        {
            if (_context.Turnirs == null)
            {
                return NotFound();
            }
            IQueryable<Turnir> turniriQuery = _context.Turnirs;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                turniriQuery = turniriQuery.Where(turnir => turnir.NazivTurnira.Contains(searchTerm) || turnir.LokacijaOdrzavanja.Contains(searchTerm));
            }
            
            return await turniriQuery
                .Select(turnir => new TurniriResponseDto()
                {
                    DatumOdrzavanja = turnir.DatumOdrzavanja,
                    Email = turnir.Email,
                    IdTurnira = turnir.IdTurnira,
                    LokacijaOdrzavanja = turnir.LokacijaOdrzavanja,
                    NazivTurnira = turnir.NazivTurnira,
                    Status = turnir.Status
                }
            )
            .OrderByDescending(turnir => turnir.DatumOdrzavanja)
            .Where(turnir => turnir.IdTurnira >= cursor)
            .Take(pageSize)
            .ToListAsync();
            
           
        }

        // GET: api/Turniri/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SingleTurnirResponseDto>> GetTurnir(int id)
        {
          if (_context.Turnirs == null)
          {
              return NotFound();
          }

            var singleTurnir = _context.Turnirs.Select(turnir =>
                 new SingleTurnirResponseDto
                 {
                     Email = turnir.Email,
                     DatumOdrzavanja = turnir.DatumOdrzavanja,
                     Timovi = turnir.IdTimas.Select(
                         tim=> new TimoviResponseDto
                         {
                             IdTima = tim.IdTima,
                             Logo = tim.Logo,
                             NazivTima = tim.NazivTima
                         }).ToList(),
                     IdTurnira = turnir.IdTurnira,
                     NazivTurnira = turnir.NazivTurnira,
                     Status = turnir.Status,
                     Rundes = turnir.Rundes.Select(runda =>
                                                         new RundeResponseDto
                                                         {
                                                             IdRunde = runda.IdRunde,
                                                             IdTurnira = runda.IdTurnira,
                                                             Runda = runda.Runda,
                                                             Mecs = runda.Mecs.Select(mec => new MecResponseDTO
                                                             {
                                                                 IdMeca = mec.IdMeca,
                                                                 BrGolovaTim1 = mec.BrGolovaTim1,
                                                                 BrGolovaTim2 = mec.BrGolovaTim2,
                                                                 IdPobjednika = mec.IdTima,//pobjednik
                                                                 IdTima1 = mec.TimIdTima,
                                                                 IdTima2 = mec.TimIdTima2,
                                                                 MecZavrsen = mec.MecZavrsen,
                                                                 Gos = mec.Gos.Select(go =>
                                                                        new GoloviResponseDTO
                                                                                                     {
                                                                                                         IdGola = go.IdGola,
                                                                                                         IdTima = go.IdTima,
                                                                                                         IdIgraca = go.IdIgraca,
                                                                                                         IdMeca = go.IdMeca,
                                                                                                         ImeIgraca = go.IdIgracaNavigation.ImeIgraca,
                                                                                                         Minut = go.Minut
                                                                                                         ,

                                                                                                     }
                                                                                         ).OrderBy(go=> go.Minut).ToList()
                                                             }
                                                                        ).ToList()
                                                         }).OrderBy(runda=>runda.Runda).ToList(),
                 }).Where(turnir=> turnir.IdTurnira == id).AsSplitQuery().FirstOrDefault();
            //jeli ide ovako za split query i potencijalno drugo rjesenje
            //https://www.reddit.com/r/dotnet/comments/ynojs4/question_about_eager_loading_of_nested_entities/


            if (singleTurnir == null)
            {
                return NotFound();
            }

            return singleTurnir;
        }

        // PUT: api/Turniri/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTurnir(int id, List<int> listaTimova, string? status)
        {
            //TODO:dodaj resource based auth 
            var turnirIzBaze = _context.Turnirs.FirstOrDefault(turnir => turnir.IdTurnira == id);

            if(turnirIzBaze == null) 
              return NotFound(); 

            turnirIzBaze.IdTimas.AddRange(_context.Tims.Where(tim => listaTimova.Contains(tim.IdTima)).ToList());
            turnirIzBaze.Status = status;

            List<Mec> mecevi = new List<Mec>();
            for (int i = 0;i<listaTimova.Count;i+=2)
            {
                mecevi.Add(new Mec
                {
                    BrGolovaTim1 = 0,
                    BrGolovaTim2 = 0,
                    TimIdTima = listaTimova[i],
                    TimIdTima2 = listaTimova[i+1],
                    

                });
            }
            

            turnirIzBaze.Rundes.Add(new Runde
            {
                Runda = 1,
                Mecs = mecevi

            });

            var brojrundi =(int)(Math.Log(listaTimova.Count)/Math.Log(2));
            var meceviIzBaze = new List<Mec>();
            for (int i = 1; i <brojrundi ; i++)
            {

                var buduciMecevi = new List<Mec>();
                for(int j = 0; j <(int) Math.Pow(2,i-1); j++)
                {
                    if (meceviIzBaze.Count > 0)
                        buduciMecevi.Add(new Mec
                        {
                            IdSledecegMeca = meceviIzBaze[j / 2].IdMeca,
                            BrGolovaTim1=0,
                            BrGolovaTim2=0,

                        });

                    else buduciMecevi.Add(new Mec { BrGolovaTim1=0, BrGolovaTim2=0});
                }


                turnirIzBaze.Rundes.Add(new Runde
                {
                    Runda = brojrundi-i+ 1,
                    Mecs = buduciMecevi

                });
                _context.SaveChanges();
                meceviIzBaze = buduciMecevi;
            }
            for(int i = 0;i < mecevi.Count;i++)
            {
                mecevi[i].IdSledecegMeca= meceviIzBaze[i/2].IdMeca;
            }
            _context.SaveChanges();


            return NoContent();
        }

        // POST: api/Turniri
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Turnir>> PostTurnir(PostTurnirDTO turnir)
        {
          if (_context.Turnirs == null)
          {
              return Problem("Entity set 'DiplomskiTurniriContext.Turnirs'  is null.");
          }
            _context.Turnirs.Add(new Turnir
            {
                Email = turnir.Email,
                DatumOdrzavanja = turnir.DatumOdrzavanja,
                LokacijaOdrzavanja = turnir.LokacijaOdrzavanja,
                NazivTurnira = turnir.NazivTurnira,
                Status = "Prijave u toku"
            });
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/Turniri/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTurnir(int id)
        {
            if (_context.Turnirs == null)
            {
                return NotFound();
            }
            var turnir = await _context.Turnirs.FindAsync(id);
            if (turnir == null)
            {
                return NotFound();
            }

            _context.Turnirs.Remove(turnir);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TurnirExists(int id)
        {
            return (_context.Turnirs?.Any(e => e.IdTurnira == id)).GetValueOrDefault();
        }
    }
}
