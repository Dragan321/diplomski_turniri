using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class DiplomskiTurniriContext : DbContext
{
    public DiplomskiTurniriContext()
    {
    }

    public DiplomskiTurniriContext(DbContextOptions<DiplomskiTurniriContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Go> Gos { get; set; }

    public virtual DbSet<Igrac> Igracs { get; set; }

    public virtual DbSet<Korisnik> Korisniks { get; set; }

    public virtual DbSet<Mec> Mecs { get; set; }

    public virtual DbSet<Runde> Rundes { get; set; }

    public virtual DbSet<Tim> Tims { get; set; }

    public virtual DbSet<Turnir> Turnirs { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Go>(entity =>
        {
            entity.HasKey(e => e.IdGola);

            entity.ToTable("GO");

            entity.HasIndex(e => e.IdMeca, "GOLOVI_U_MECU_FK");

            entity.HasIndex(e => e.IdIgraca, "IGRAC_DAO_GO_FK");

            entity.HasIndex(e => e.IdTima, "TIM_DAO_GO_FK");

            entity.Property(e => e.IdGola)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_GOLA");
            entity.Property(e => e.IdIgraca).HasColumnName("ID_IGRACA");
            entity.Property(e => e.IdMeca).HasColumnName("ID_MECA");
            entity.Property(e => e.IdTima).HasColumnName("ID_TIMA");
            entity.Property(e => e.Minut).HasColumnName("MINUT");

            entity.HasOne(d => d.IdIgracaNavigation).WithMany(p => p.Gos)
                .HasForeignKey(d => d.IdIgraca)
                .HasConstraintName("FK_GO_IGRAC_DAO_IGRAC");

            entity.HasOne(d => d.IdMecaNavigation).WithMany(p => p.Gos)
                .HasForeignKey(d => d.IdMeca)
                .HasConstraintName("FK_GO_GOLOVI_U__MEC");

            entity.HasOne(d => d.IdTimaNavigation).WithMany(p => p.Gos)
                .HasForeignKey(d => d.IdTima)
                .HasConstraintName("FK_GO_TIM_DAO_G_TIM");
        });

        modelBuilder.Entity<Igrac>(entity =>
        {
            entity.HasKey(e => e.IdIgraca);

            entity.ToTable("IGRAC");

            entity.HasIndex(e => e.IdTima, "IGRAC_IGRA_ZA_TIM_FK");

            entity.HasIndex(e => e.Email, "KORISNIK_POSJEDUJE_IGRACE_FK");

            entity.Property(e => e.IdIgraca)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_IGRACA");
            entity.Property(e => e.DatumRodjenja)
                .HasColumnType("datetime")
                .HasColumnName("DATUM_RODJENJA");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.IdTima).HasColumnName("ID_TIMA");
            entity.Property(e => e.ImeIgraca)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IME_IGRACA");
            entity.Property(e =>
                e.slika
            ).HasMaxLength(50);
            entity.HasOne(d => d.EmailNavigation).WithMany(p => p.Igracs)
                .HasForeignKey(d => d.Email)
                .HasConstraintName("FK_IGRAC_KORISNIK__KORISNIK");

            entity.HasOne(d => d.IdTimaNavigation).WithMany(p => p.Igracs)
                .HasForeignKey(d => d.IdTima)
                .HasConstraintName("FK_IGRAC_IGRAC_IGR_TIM");
        });

        modelBuilder.Entity<Korisnik>(entity =>
        {
            entity.HasKey(e => e.Email);

            entity.ToTable("KORISNIK");

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.Ime)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IME");
        });

        modelBuilder.Entity<Mec>(entity =>
        {
            entity.HasKey(e => e.IdMeca);

            entity.ToTable("MEC");

            entity.HasIndex(e => e.IdRunde, "MECEVI_U_RUNDI_FK");

            entity.HasIndex(e => e.TimIdTima2, "POBJEDNIK_FK");

            entity.HasIndex(e => e.TimIdTima, "TIM1_FK");

            entity.HasIndex(e => e.IdTima, "TIM2_FK");

            entity.Property(e => e.IdMeca)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_MECA");
            entity.Property(e => e.BrGolovaTim1).HasColumnName("BR_GOLOVA_TIM_1");
            entity.Property(e => e.BrGolovaTim2).HasColumnName("BR_GOLOVA_TIM_2");
            entity.Property(e => e.IdRunde).HasColumnName("ID_RUNDE");
            entity.Property(e => e.IdTima).HasColumnName("ID_TIMA");
            entity.Property(e => e.TimIdTima).HasColumnName("TIM_ID_TIMA");
            entity.Property(e => e.TimIdTima2).HasColumnName("TIM_ID_TIMA2");
            entity.Property(e => e.MecZavrsen).HasDefaultValue(false);
            entity.Property(e => e.IdSledecegMeca).HasColumnName("ID_SLEDECEG_MECA");

            entity.HasOne(d => d.IdRundeNavigation).WithMany(p => p.Mecs)
                .HasForeignKey(d => d.IdRunde)
                .HasConstraintName("FK_MEC_MECEVI_U__RUNDE");

            entity.HasOne(d => d.IdTimaNavigation).WithMany(p => p.MecIdTimaNavigations)
                .HasForeignKey(d => d.IdTima)
                .HasConstraintName("FK_MEC_TIM2_TIM");

            entity.HasOne(d => d.TimIdTimaNavigation).WithMany(p => p.MecTimIdTimaNavigations)
                .HasForeignKey(d => d.TimIdTima)
                .HasConstraintName("FK_MEC_TIM1_TIM");

            entity.HasOne(d => d.TimIdTima2Navigation).WithMany(p => p.MecTimIdTima2Navigations)
                .HasForeignKey(d => d.TimIdTima2)
                .HasConstraintName("FK_MEC_POBJEDNIK_TIM");
        });

        modelBuilder.Entity<Runde>(entity =>
        {
            entity.HasKey(e => e.IdRunde);

            entity.ToTable("RUNDE");

            entity.HasIndex(e => e.IdTurnira, "RUNDE_TURNIRA_FK");

            entity.Property(e => e.IdRunde)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_RUNDE");
            entity.Property(e => e.IdTurnira).HasColumnName("ID_TURNIRA");
            entity.Property(e => e.Runda).HasColumnName("RUNDA");

            entity.HasOne(d => d.IdTurniraNavigation).WithMany(p => p.Rundes)
                .HasForeignKey(d => d.IdTurnira)
                .HasConstraintName("FK_RUNDE_RUNDE_TUR_TURNIR");
        });

        modelBuilder.Entity<Tim>(entity =>
        {
            entity.HasKey(e => e.IdTima);

            entity.ToTable("TIM");

            entity.HasIndex(e => e.Email, "KORISNIK_POSJEDUJE_TIMOVE_FK");

            entity.Property(e => e.IdTima)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_TIMA");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.Logo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("LOGO");
            entity.Property(e => e.NazivTima)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV_TIMA");

            entity.HasOne(d => d.EmailNavigation).WithMany(p => p.Tims)
                .HasForeignKey(d => d.Email)
                .HasConstraintName("FK_TIM_KORISNIK__KORISNIK");

            entity.HasMany(d => d.IdTurniras).WithMany(p => p.IdTimas)
                .UsingEntity<Dictionary<string, object>>(
                    "TimoviUcestvujuUTurnirima",
                    r => r.HasOne<Turnir>().WithMany()
                        .HasForeignKey("IdTurnira")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_TIMOVI_U_TIMOVI_UC_TURNIR"),
                    l => l.HasOne<Tim>().WithMany()
                        .HasForeignKey("IdTima")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_TIMOVI_U_TIMOVI_UC_TIM"),
                    j =>
                    {
                        j.HasKey("IdTima", "IdTurnira").HasName("PK_TIMOVI_UCESTVUJU_U_TURNIRIM");
                        j.ToTable("TIMOVI_UCESTVUJU_U_TURNIRIMA");
                        j.HasIndex(new[] { "IdTurnira" }, "TIMOVI_UCESTVUJU_U_TURNIRIMA2_FK");
                        j.HasIndex(new[] { "IdTima" }, "TIMOVI_UCESTVUJU_U_TURNIRIMA_FK");
                        j.IndexerProperty<int>("IdTima").HasColumnName("ID_TIMA");
                        j.IndexerProperty<int>("IdTurnira").HasColumnName("ID_TURNIRA");
                    });
        });

        modelBuilder.Entity<Turnir>(entity =>
        {
            entity.HasKey(e => e.IdTurnira);

            entity.ToTable("TURNIR");

            entity.HasIndex(e => e.Email, "KORISNIK_POSJEDUJE_TURNIRE_FK");

            entity.Property(e => e.IdTurnira)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_TURNIRA");
            entity.Property(e => e.DatumOdrzavanja)
                .HasColumnType("datetime")
                .HasColumnName("DATUM_ODRZAVANJA");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.LokacijaOdrzavanja)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("LOKACIJA_ODRZAVANJA");
            entity.Property(e => e.NazivTurnira)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV_TURNIRA");
            entity.Property(e => e.Status)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("STATUS");

            entity.HasOne(d => d.EmailNavigation).WithMany(p => p.Turnirs)
                .HasForeignKey(d => d.Email)
                .HasConstraintName("FK_TURNIR_KORISNIK__KORISNIK");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
