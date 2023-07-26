using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    [Table("tbl_Coding")]
    public class Coding
    {
        [Key]
        public string code { get; set; }

        [Column("name")]
        public string name { get; set; }

        [Column("len")]
        public short len { get; set; }

        [Column("level")]
        public short level { get; set; }

        [Column("FaName")]
        public string FaName { get; set; }

        [Column("Factor")]
        public int Factor { get; set; }

        [Column("UserCode")]
        public string UserCode { get; set; }

        [Column("tag")]
        public string tag { get; set; }

        [Column("index")]
        public string index { get; set; }

        [Column("Price")]
        public string Price { get; set; }

        [Column("CodeActive")]
        public bool? CodeActive { get; set; }
        public bool? WorkFlow { get; set; }

        public bool? MultiInsertedForm { get; set; }

        [Column("CodeIsLimited")]
        public bool? CodeIsLimited { get; set; }

        [Column("CodeCanGrow")]
        public bool? CodeCanGrow { get; set; }

        [Column("CodeComments")]
        public string CodeComments { get; set; }

        public bool? Assistance { get; set; }
        public Guid MedicalCenterId { get; set; }

        //هزینه درمان
        public decimal? Fixedprice { get; set; }


        public string ToothColor { get; set; }
        public string POS_Ip { get; set; }
        public string POS_Port { get; set; }
        public int? POS_DeviceId { get; set; }
        public bool POS_IsIPDevice { get; set; }
        public string POS_InvoiceNumber { get; set; }
        public string InternationalServiceCode { get; set; }
        public bool DeductionCommitmentCeiling { get; set; }
        public Guid? AccountingCollection_Id { get; set; }

        public bool IsAccountingClient { get; set; }
    }
}
