namespace backend.Models;

public partial class Runde
{
    public int IdRunde { get; set; }

    public int? IdTurnira { get; set; }

    public int Runda { get; set; }

    public virtual Turnir? IdTurniraNavigation { get; set; }

    public virtual ICollection<Mec> Mecs { get; set; } = new List<Mec>();
}
