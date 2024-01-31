namespace backend.DTO.Timovi
{
    public class TimoviResponseDto
    {
        public int IdTima { get; set; }

        public string NazivTima { get; set; } = null!;
        
        public string? Logo { get; set; }
        public int BrGolova { get; set; }
        public int BrPobjeda { get; set; }


    }
}
