using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Igrac
{
    public int IdIgraca { get; set; }
    public int? IdTima { get; set; }
    public string? Email { get; set; }
    public string ImeIgraca { get; set; } = null!;
    public DateTime DatumRodjenja { get; set; }
    public string? slika { get; set; }
    public virtual Korisnik? EmailNavigation { get; set; }
    public virtual ICollection<Go> Gos { get; set; } = new List<Go>();
    public virtual Tim? IdTimaNavigation { get; set; }
}
