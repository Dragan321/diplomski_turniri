using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Go
{
    public int IdGola { get; set; }

    public int? IdIgraca { get; set; }

    public int? IdTima { get; set; }

    public int? IdMeca { get; set; }

    public int Minut { get; set; }

    public virtual Igrac? IdIgracaNavigation { get; set; }

    public virtual Mec? IdMecaNavigation { get; set; }

    public virtual Tim? IdTimaNavigation { get; set; }
}
