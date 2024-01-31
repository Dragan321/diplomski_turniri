namespace backend.DTO.Igraci
{
    public class SingleIgracResponseDto
    {
        public int IdIgraca { get; set; }
        public string ImeIgraca { get; set; } = null!;
        public string? slika { get; set; }
        public int? IdTima { get; set; }
        public string? NazivTima { get; set; } = null!;
        public string? Logo { get; set; }
        public int? BrGolova { get; set; }
        public int? BrMeceva { get; set; }
        public int? BrPobjeda { get; set; }
        public List<brGolovaPoMecu> brGolovaUZadnjihNMeceva { get; set; }
        public DateTime DatumRodjenja { get; set; }



    }

    public class brGolovaPoMecu
    {
        public int? IdMeca { get; set; }
        public int? IdIgraca { get; set; }
        public int? BrGolova { get; set; }

    }
}
