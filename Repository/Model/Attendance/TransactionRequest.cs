namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TransactionRequest")]
    public partial class TransactionRequest
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }

        public Guid PersonID { get; set; }

        public Guid Transaction_Id { get; set; }

        public DateTime FromDateRequest { get; set; }

        public DateTime ToDateRequest { get; set; }

        [Required]
        public string Comment { get; set; }

        public int ReqType { get; set; }

        public int ReqStatus { get; set; }

        public DateTime? ReqAnsDate { get; set; }

        public Guid? AccepterID { get; set; }

    }
}
