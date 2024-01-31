using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Mec
{
    public int IdMeca { get; set; }

    public int? IdRunde { get; set; }

    public int? IdTima { get; set; }

    public int? TimIdTima { get; set; }

    public int? TimIdTima2 { get; set; }
    
    public int? IdSledecegMeca { get; set; }

    public bool MecZavrsen {  get; set; }  

    public int? BrGolovaTim1 { get; set; }

    public int? BrGolovaTim2 { get; set; }

    public virtual ICollection<Go> Gos { get; set; } = new List<Go>();

    public virtual Runde? IdRundeNavigation { get; set; }

    public virtual Tim? IdTimaNavigation { get; set; }

    public virtual Tim? TimIdTima2Navigation { get; set; }

    public virtual Tim? TimIdTimaNavigation { get; set; }
}
