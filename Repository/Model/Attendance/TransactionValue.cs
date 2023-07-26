namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TransactionValue")]
    public partial class TransactionValue
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }

        public int TransType { get; set; }

        [Required]
        public string TransValue { get; set; }

    }
}
