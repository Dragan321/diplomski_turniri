using Microsoft.AspNetCore.Mvc;

namespace backend.DTO.Igraci
{
    public class IgracPostDto
    {
        public string ime { get; set; } = null!;
        public required string email { get; set; }
        public int? tim { get; set; }
        public DateTime datumRodjenja { get; set; }

        [FromForm]
        public IFormFile? slika { get; set; }
    }
}

