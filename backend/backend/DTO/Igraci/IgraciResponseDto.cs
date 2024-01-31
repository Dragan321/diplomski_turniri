using backend.Models;

namespace backend.DTO.Igraci
{
    public class IgraciResponseDto
    {
        public int IdIgraca { get; set; }
        public string ImeIgraca { get; set; } = null!;
        public string? slika { get; set; }
        public int? IdTima { get; set; }
        public string? NazivTima { get; set; } = null!;
        public string? Logo { get; set; }
        public int BrGolova { get; set; }

    }
}
