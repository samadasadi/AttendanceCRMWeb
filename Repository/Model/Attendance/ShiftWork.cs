namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ShiftWork")]
    public partial class ShiftWork
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string ShiftName { get; set; }
        public bool IsActive { get; set; }
        public int Calendar_Id { get; set; }
        public Guid UserId { get; set; }
        [Required]
        public string Data { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsTemp { get; set; }

    }
}
