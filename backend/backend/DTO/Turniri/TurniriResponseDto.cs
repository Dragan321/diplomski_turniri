using backend.Models;

namespace backend.DTO.Turniri
{
    public class TurniriResponseDto
    {
        public int IdTurnira { get; set; }

        public string? Email { get; set; }

        public string NazivTurnira { get; set; } = null!;

        public DateTime DatumOdrzavanja { get; set; }

        public string LokacijaOdrzavanja { get; set; } = null!;

        public string? Status { get; set; }

    }
}
