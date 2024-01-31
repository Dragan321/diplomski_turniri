using Azure.Storage.Blobs;
using backend.Enums;
using backend.Models;
using backend.Services;
using Bogus.DataSets;
using Flurl.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using NuGet.Packaging;
using System.Net;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenerateDataController : ControllerBase
    {
        private readonly DiplomskiTurniriContext _context;
        private readonly AzureBlobServices _azureBlobServices;

        public GenerateDataController(DiplomskiTurniriContext context, AzureBlobServices azureBlobServices)
        {
            _context = context;
            _azureBlobServices = azureBlobServices;
        }


        // GET: api/<GenerateDataController>
        [HttpPost]
        public async Task<ActionResult<string>> GenData()
        {

            List<string> naziviTurnira = new List<string>
            {
                "Srbija Open",
                "Beograd Masters",
                "Novi Sad Classic",
                "Kragujevac Open",
                "Subotica Challenge",
                "Vojvodina Cup",
                "Pančevo Invitational",
                "Valjevo Championship",
                "Beogradska liga",
                "Srbija Kup",
                "Fudbalski maraton",
                "Novosadski derbi",
                "Vojvođanska liga",
                "Niški Fudbal Fest",
                "Fudbal u srcu"
            };

            Generate();
            foreach(string naziv in naziviTurnira)
                generateTournament(naziv);
            return Created("","");
        }

        private async void Generate()
        {
            List<string> listaImena = new List<string>
        {
            "Miloš Jovanović",
            "Nikola Petrović",
            "Stefan Marković",
            "Aleksandar Nikolić",
            "Filip Simić",
            "Marko Đorđević",
            "Nemanja Stojanović",
            "Ivan Stanković",
            "Đorđe Pavlović",
            "Luka Popović",
            "Mihajlo Đorđević",
            "Nikola Ilić",
            "Uroš Gavrilović",
            "Vladimir Milošević",
            "Nenad Gavrilović",
            "Miloš Arsić",
            "Ana Jovanović",
            "Stefan Novaković",
            "Miloš Arsić",
            "Ilija Stanković",
            "Andrija Janković",
            "Dimitrije Simić",
            "Jovan Jovanović",
            "Aleksa Stojanović",
            "Filip Marković",
            "Vuk Nikolić",
            "Ivan Nikolić",
            "Nikola Nikolić",
            "Mihailo Simić",
            "Stefan Jovanović",
            "Nikola Novaković",
            "Đorđe Novaković",
            "Marko Stojanović",
            "Aleksandar Stanković",
            "Vladimir Marković",
            "Nemanja Stanković",
            "Marko Stanković",
            "Luka Janković",
            "Stefan Nikolić",
            "Nikola Stojanović",
            "Marko Nikolić",
            "Aleksa Nikolić",
            "Đorđe Petrović",
            "Vladimir Stanković",
            "Nikola Đorđević",
            "Stefan Petrović",
            "Aleksandar Đorđević",
            "Jovan Stojanović",
            "Mihailo Đorđević",
            "Filip Stanković",
            "Luka Stanković",
            "Nikola Marković",
            "Lazar Marković",
            "Nenad Stanković",
            "Marko Petrović",
            "Aleksa Stojanović",
            "Filip Nikolić",
            "Vuk Stojanović",
            "Ilija Janković",
            "Đorđe Stojanović",
            "Mihailo Marković",
            "Nikola Arsić",
            "Miloš Novaković",
            "Filip Đorđević",
            "Nikola Stanković",
            "Miloš Petrović",
            "Lazar Nikolić",
            "Marko Đorđević",
            "Ilija Marković",
            "Đorđe Simić",
            "Filip Petrović",
            "Nikola Gavrilović",
            "Miloš Stanković",
            "Nemanja Đorđević",
            "Mihailo Petrović",
            "Nikola Jovanović",
            "Vladimir Đorđević",
            "Miloš Stojanović",
            "Aleksandar Petrović",
            "Marko Simić",
            "Luka Nikolić",
            "Nikola Pavlović",
            "Aleksa Marković",
            "Ivan Đorđević",
            "Nikola Đorđević"
        };
            List<string> logos = new List<string>
        {
            "ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
            "IND", "JAC", "KC", "LV", "LAR", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
            "PHI", "PIT", "SEA", "TEN", "WAS"
        };
            List<string> fakeTimovi = new List<string>
        {
            "Beogradski Kardinali",
            "Novosadski Jastrebovi",
            "Beogradski Vrane",
            "Niški Bivoli",
            "Pančevačke Pantere",
            "Beogradski Medvedi",
            "Subotički Tigrovi",
            "Beogradski Brauni",
            "Beogradski Kauboji",
            "Beogradski Pastuvi",
            "Beogradski Lavovi",
            "Beogradski Kolti",
            "Beogradski Jaguari",
            "Beogradski Šefovi",
            "Beogradski Gonioci",
            "Beogradski Ovnovi",
            "Beogradski Delfini",
            "Beogradski Vikinzi",
            "Beogradski Patrioti",
            "Beogradski Svetci",
            "Beogradski Džinovi",
            "Beogradski Džetovi",
            "Beogradski Orlovi",
            "Beogradski Čeličari",
            "Beogradski Sokolovi",
            "Beogradski Titani",
            "Beogradski Komandanti"
        };
            //dodaj linkove za slike igraca
            var korisnik = new Korisnik();
            korisnik.Email = "dragan.milovanovic220@live.com";
            korisnik.Ime = "Dragan Milovanovic";



            var dateFaker = new Date();
            List<Igrac> testniIgraci = new List<Igrac>();
            foreach (var ime in listaImena)
            {
                testniIgraci.Add(
                    new Igrac()
                    {
                        ImeIgraca = ime,
                        DatumRodjenja = dateFaker.Between(new DateTime(1995, 1, 1), new DateTime(2005, 1, 1)),
                        Email = "dragan.milovanovic220@live.com"

                    });
            }

            foreach (var tim in fakeTimovi)
            {
                korisnik.Tims.Add(
                    new Tim
                    {
                        NazivTima = tim,
                    });

            }
            for (int i = 0; i < 16; i++)
            {
                korisnik.Tims.ElementAt(i).Igracs.AddRange(new List<Igrac>(testniIgraci.GetRange(i * 5, 5)));

            }

            _context.Korisniks.Add(korisnik);
            _context.SaveChanges();

            //dodavanje slika za timove
            var timoviIzBaze = _context.Tims.ToList();
            int j = 0;
            foreach (var tim in timoviIzBaze)
            {
                tim.Logo = $"{tim.IdTima}.png";
                await _azureBlobServices.uploadFromUrlToContainerAsync($"https://a.espncdn.com/i/teamlogos/nfl/500/{logos[j]}.png", tim.Logo, AzureBlobContainers.SlikeTimova);
                j++;
            }
            _context.SaveChanges();

            //save changes
            //TODO: add slike za igraca po id

        }
        private void generateTournament(string nazivTurnira)
        {
            var listaTimova = _context.Tims.Where(tim => tim.Igracs.Count()>1).ToList().OrderBy(x => Random.Shared.Next()).ToList();
            var Igraci = _context.Igracs.ToList();
            var listaTimova1 = listaTimova;
            var runde = new List<Runde>();
            var pobjednici = new List<Tim>();
            Random rnd = new Random();
            
            for (int i = 1;i<5;i++)
            {
                List<Mec> meceviURundi = new List<Mec>();

                for(int j = 0; j < listaTimova.Count; j++)
                {
                    if (j % 2 == 0)
                    {
                        var listaGolova = new List<Go>();
                        var brgolova1 = rnd.Next(1, 5);
                        var brgolova2 = rnd.Next(1, 5);
                        if (brgolova1 == brgolova2)
                        {
                            brgolova2--;
                        }
                        for(int z= 0; z < brgolova1; z++)
                        {
                            listaGolova.Add(new Go
                            {
                                Minut = rnd.Next(1, 20),
                                IdTima = listaTimova[j].IdTima,
                                IdIgraca = listaTimova[j].Igracs.Where(igrac=> igrac.IdTima == listaTimova[j].IdTima).ToList()[rnd.Next(0,4)] .IdIgraca,
                            });
                        }
                        for (int z = 0; z < brgolova2; z++)
                        {
                            listaGolova.Add(new Go
                            {
                                Minut = rnd.Next(1, 20),
                                IdTima = listaTimova[j+1].IdTima,
                                IdIgraca = listaTimova[j+1].Igracs.Where(igrac => igrac.IdTima == listaTimova[j+1].IdTima).ToList()[rnd.Next(0, 4)].IdIgraca,

                            });
                        }
                        var pobjednik = brgolova1 > brgolova2 ? listaTimova[j] : listaTimova[j + 1];
                        pobjednici.Add(pobjednik);

                        meceviURundi.Add(new Mec
                        {
                            BrGolovaTim1 = brgolova1,
                            BrGolovaTim2 = brgolova2,
                            IdTima = pobjednik.IdTima ,
                            TimIdTima = listaTimova[j].IdTima,
                            TimIdTima2 = listaTimova[j+1].IdTima,
                            Gos = listaGolova,
                            MecZavrsen = true
                            
                        });
                    }
                }
                listaTimova = new List<Tim>(pobjednici);
                pobjednici = new List<Tim>();
                runde.Add(new Runde
                {
                    Runda = i,
                    Mecs = meceviURundi,
                }) ;
            }

            var turnir = new Turnir
            {
                DatumOdrzavanja = DateTime.Now,
                Email = "dragan.milovanovic220@live.com",
                LokacijaOdrzavanja = "Lukavica",
                NazivTurnira = nazivTurnira,
                Status = "Zavrsen",
                IdTimas = listaTimova1,
                Rundes = runde

            };

            _context.Turnirs.Add(turnir);
            _context.SaveChanges();

        }
        
    }
}
