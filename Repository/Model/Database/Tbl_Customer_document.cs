namespace Repository.Model.Database
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Tbl_Customer_document
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Autoid { get; set; }

        [StringLength(1000)]
        public string DocNo { get; set; }

        [StringLength(500)]
        public string Coment { get; set; }

        [MaxLength(100)]
        public byte[] image { get; set; }

        [StringLength(100)]
        public string FileName { get; set; }

        [StringLength(1000)]
        public string DocComments { get; set; }

        [StringLength(50)]
        public string DocType { get; set; }

        [StringLength(50)]
        public string DocStatus { get; set; }

        public Guid? FileKey { get; set; }

        public bool? FileConverted { get; set; }

        [StringLength(1000)]
        public string Path { get; set; }

        public int? patientId { get; set; }

        [StringLength(50)]
        public string FileType { get; set; }

        public int? toothid { get; set; }

        public int? severity { get; set; }

        [StringLength(50)]
        public string CreateDate { get; set; }

        public Guid CustomerId { get; set; }

        public Guid MedicalCenterId { get; set; }

        public DateTime ModifiedDate { get; set; }

        public Guid Id { get; set; }

        public bool IsDeleted { get; set; }

        public int? TypeId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [StringLength(34)]
        public string FileKeyString { get; set; }
    }
}
