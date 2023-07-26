namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Calendar")]
    public partial class Calendar
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [StringLength(150)]
        public string CalendarName { get; set; }

        public string Holidays { get; set; }

        public bool? HasRamazan { get; set; }

        public DateTime? RamazanStartDate { get; set; }

        public DateTime? RamazanEndDate { get; set; }

        public int YearsNumber { get; set; }
        public bool IsActive { get; set; }


        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }

    }
}
