using backend.DTO.Igraci;
using backend.Models;

namespace backend.DTO.Timovi
{
    public class SingleTimResponseDto
    {
        public int IdTima { get; set; }
        public string? Email { get; set; }
        public string NazivTima { get; set; } = null!;
        public string? Logo { get; set; }
        public virtual ICollection<OIgracu> Igracs { get; set; } = new List<OIgracu>();
        public int? BrGolova { get; set; }
        public int? BrMeceva { get; set; }
        public int? BrPobjeda { get; set; }
        public List<brGolovaTimaPoMecu> brGolovaUZadnjihNMeceva { get; set; }
        public int brojOsvojenihTurnira {  get; set; }


    }

    public class brGolovaTimaPoMecu 
    {
        public int? IdMeca { get; set; }
        public int? IdTima { get; set; }
        public int? BrGolova { get; set; }
    }


    public class OIgracu
    {
        public int IdIgraca { get; set; }
        public string ImeIgraca { get; set; } = null!;
        public string? slika { get; set; }
    }
}


