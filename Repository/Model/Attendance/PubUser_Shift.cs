namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class PubUser_Shift
    {
        [Key]
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Guid DoingUserId { get; set; }
        public bool IsDeleted { get; set; }

        public Guid PuUser_Id { get; set; }

        public int ShiftWork_Id { get; set; }

        public DateTime EntesabDate { get; set; }

    }
}
