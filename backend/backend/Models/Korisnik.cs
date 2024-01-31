using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Korisnik
{
    public string Email { get; set; } = null!;

    public string Ime { get; set; } = null!;

    public virtual ICollection<Igrac> Igracs { get; set; } = new List<Igrac>();

    public virtual ICollection<Tim> Tims { get; set; } = new List<Tim>();

    public virtual ICollection<Turnir> Turnirs { get; set; } = new List<Turnir>();
}
