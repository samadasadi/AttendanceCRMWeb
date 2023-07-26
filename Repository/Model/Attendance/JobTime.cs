namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("JobTime")]
    public partial class JobTime
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string JobTimeName { get; set; }

        public bool ShiftTaRoozeBad { get; set; }

        public DateTime TimeVorod { get; set; }

        public DateTime? TimeFVorod { get; set; }

        public DateTime TimeKhoroj { get; set; }

        public DateTime? TimeFKhoroj { get; set; }

        public bool ShiftDovvom { get; set; }

        public DateTime? TimeVorod2 { get; set; }

        public DateTime? TimeFVorod2 { get; set; }

        public DateTime? TimeKhoroj2 { get; set; }

        public DateTime? TimeFKhoroj2 { get; set; }

        [StringLength(10)]
        public string TimeShenavar { get; set; }

        public DateTime? TimeShiftLength { get; set; }

        public string Explain { get; set; }

        public bool IsActive { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }

        public bool ShiftShenavar { get; set; }
    }
}
