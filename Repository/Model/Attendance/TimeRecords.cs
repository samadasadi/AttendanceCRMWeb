namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TimeRecords
    {
        [Key]
        public int RecordID { get; set; }

        [StringLength(16)]
        public string CardNo { get; set; }

        public int? DeviceCode { get; set; }

        public int? Year { get; set; }

        public int? Month { get; set; }

        public int? Day { get; set; }

        public int? Hour { get; set; }

        public int? Minute { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? DatetimeIO { get; set; }
        public DateTime? DatetimeIOMain { get; set; }

        public int? AttStatus { get; set; }

        public DateTime ModifiedDate { get; set; }

        public bool IsDeleted { get; set; }

        public int? VerifyMethod { get; set; }

        public bool ChangebyPerson { get; set; }

        public int WorkCode { get; set; }
        public Guid DoingUserId { get; set; }
    }
}
