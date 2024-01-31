using Microsoft.AspNetCore.Mvc;

namespace backend.DTO.Timovi
{
    public class TimPostDto
    {
        public string NazivTima { get; set; } = null!;
        public required string Email { get; set; }
        [FromForm]
        public IFormFile? Logo { get; set; }
    }
}
