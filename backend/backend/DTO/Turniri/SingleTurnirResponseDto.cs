using backend.DTO.Igraci;
using backend.DTO.Timovi;
using backend.Models;

namespace backend.DTO.Turniri
{
    public class SingleTurnirResponseDto
    {
        public int IdTurnira { get; set; }

        public string? Email { get; set; }

        public string NazivTurnira { get; set; } = null!;

        public DateTime DatumOdrzavanja { get; set; }

        public string LokacijaOdrzavanja { get; set; } = null!;

        public string? Status { get; set; }


        public virtual ICollection<RundeResponseDto> Rundes { get; set; } = new List<RundeResponseDto>();

        public virtual ICollection<TimoviResponseDto> Timovi { get; set; } = new List<TimoviResponseDto>();

    }

    public class RundeResponseDto 
    {
        public int IdRunde { get; set; }
        public int? IdTurnira { get; set; }
        public int Runda { get; set; }
        public virtual ICollection<MecResponseDTO> Mecs { get; set; } = new List<MecResponseDTO>();

    }
    public class MecResponseDTO
    {
        public int IdMeca { get; set; }

        public int? IdRunde { get; set; }

        public int? IdPobjednika { get; set; }

        public int? IdTima1 { get; set; }

        public int? IdTima2 { get; set; }

        public int? BrGolovaTim1 { get; set; }

        public int? BrGolovaTim2 { get; set; }
        public bool MecZavrsen { get; set; }


        public virtual ICollection<GoloviResponseDTO> Gos { get; set; } = new List<GoloviResponseDTO>();

        
    }

    public class GoloviResponseDTO
    {
        public int IdGola { get; set; }

        public int? IdIgraca { get; set; }

        public int? IdTima { get; set; }

        public int? IdMeca { get; set; }

        public int Minut { get; set; }

        public string ImeIgraca { get; set; } = null!;


    }

}
