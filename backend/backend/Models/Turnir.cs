using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Turnir
{
    public int IdTurnira { get; set; }

    public string? Email { get; set; }

    public string NazivTurnira { get; set; } = null!;

    public DateTime DatumOdrzavanja { get; set; }

    public string LokacijaOdrzavanja { get; set; } = null!;

    public string? Status { get; set; }

    public virtual Korisnik? EmailNavigation { get; set; }

    public virtual ICollection<Runde> Rundes { get; set; } = new List<Runde>();

    public virtual ICollection<Tim> IdTimas { get; set; } = new List<Tim>();
}
