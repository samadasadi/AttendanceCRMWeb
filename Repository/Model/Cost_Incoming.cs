using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    [Table("tbl_Cost_Incoming")]
    public class Cost_Incoming : BaseClass
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AutoID { get; set; }
        [Column("CostCode")]
        public string costInCode { get; set; }
        public decimal Price { get; set; }
        public string Factor_No { get; set; }
        public string Coment { get; set; }
        public string date { get; set; }
        public DateTime DateEn { get; set; }
        public decimal? cost { get; set; }
        public string costPersonID { get; set; }
        public int? costInUserID { get; set; }
        public Guid costUserID { get; set; }
        /*صادر شده به هزینه ها .vp */
        public bool? Exported { get; set; }
        public bool? Selected { get; set; }
        public int? RefvchhdrID { get; set; }


        public bool IsEmployeeAccount { get; set; }
        public Guid? EmployeeAccountId { get; set; }


        public decimal? DiscountPrice { get; set; }
        public decimal? TransportCost { get; set; }
    }
}
