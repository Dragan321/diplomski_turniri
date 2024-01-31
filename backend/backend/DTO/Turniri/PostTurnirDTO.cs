namespace backend.DTO.Turniri
{
    public class PostTurnirDTO
    {

        public string? Email { get; set; }

        public string NazivTurnira { get; set; } = null!;

        public DateTime DatumOdrzavanja { get; set; }

        public string LokacijaOdrzavanja { get; set; } = null!;
    }
}
