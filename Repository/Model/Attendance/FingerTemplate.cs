namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("FingerTemplate")]
    public class FingerTemplate
    {
        public int Id { get; set; }

        public int PubUser_Id { get; set; }

        public int FINGERID { get; set; }

        [Required]
        public string FingerVal { get; set; }

        public int? Flag { get; set; }


        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
    }
}
