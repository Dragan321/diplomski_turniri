using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Tim
{
    public int IdTima { get; set; }

    public string? Email { get; set; }

    public string NazivTima { get; set; } = null!;

    public string? Logo { get; set; }

    public virtual Korisnik? EmailNavigation { get; set; }

    public virtual ICollection<Go> Gos { get; set; } = new List<Go>();

    public virtual ICollection<Igrac> Igracs { get; set; } = new List<Igrac>();

    public virtual ICollection<Mec> MecIdTimaNavigations { get; set; } = new List<Mec>();

    public virtual ICollection<Mec> MecTimIdTima2Navigations { get; set; } = new List<Mec>();

    public virtual ICollection<Mec> MecTimIdTimaNavigations { get; set; } = new List<Mec>();

    public virtual ICollection<Turnir> IdTurniras { get; set; } = new List<Turnir>();
}
