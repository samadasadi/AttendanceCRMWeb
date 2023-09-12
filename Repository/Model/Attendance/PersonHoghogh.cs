namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;
    using Utility.PublicEnum;

    [Table("PersonHoghogh")]
    public partial class PersonHoghogh
    {
        [Key]
        public int Id { get; set; }

        public bool IsActive { get; set; }

        public DateTime ModifiedDate { get; set; }

        public bool IsDeleted { get; set; }

        public Guid PersonID { get; set; }

        public decimal? HoghoghePaye { get; set; }

        public decimal? PadasheBahrevari { get; set; }

        public decimal? EKarZarib { get; set; }

        public bool? EydiSanavatMahane { get; set; }

        public decimal? HagheMaskan { get; set; }

        public int? Bon { get; set; }

        [StringLength(50)]
        public string BimehNumber { get; set; }

        public int? BimehZarib { get; set; }

        public DateTime? SaghfeKasreKar1 { get; set; }

        public DateTime? SaghfeKasreKar2 { get; set; }

        public int? SaghfeKasreKar1Zarib { get; set; }

        public int? SaghfeKasreKar2Zarib { get; set; }

        public int? SaghfeKasreKar3Zarib { get; set; }

        public decimal? Nahar { get; set; }

        public decimal? Sobhane { get; set; }

        public decimal? AyaboZahab { get; set; }

        [StringLength(150)]
        public string BankName { get; set; }

        [StringLength(50)]
        public string HesabNumber { get; set; }

        [StringLength(50)]
        public string AaberNumber { get; set; }

        public int? OladCount { get; set; }

        public decimal? Eydi { get; set; }

        public decimal? Sanavat { get; set; }

        public decimal? HaghMamoriyat { get; set; }

        public decimal Maliyat { get; set; }

        public HoghoghType? HoghoghType { get; set; }

        public decimal? HoghoghePaye_Roozaneh { get; set; }

        public decimal? HaghOlad { get; set; }

    }
}
