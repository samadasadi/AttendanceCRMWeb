using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.PublicEnum;

namespace Repository.Model
{
    public class Tbl_Cost : BaseClass
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Autoid { get; set; }
        public string CostCode { get; set; }
        public decimal Price { get; set; }
        public string Factor_No { get; set; }
        public string Coment { get; set; }
        public string date { get; set; }
        public DateTime? DateEn { get; set; }
        //public decimal? cost { get; set; }
        public string costPersonID { get; set; }
        //public string costUserID { get; set; }
        public Guid UserID { get; set; }
        public int? RefvchhdrID { get; set; }
        public Guid? costRefIncomeID { get; set; }
        public CostType? Type { get; set; }

        public bool IsEmployeeAccount { get; set; }
        public Guid? EmployeeAccountId { get; set; }


        public decimal? DiscountPrice { get; set; }
        public decimal? TransportCost { get; set; }
        public decimal? CommissionAmount { get; set; }


        public Guid? AccountingCollection_Id { get; set; }
        public bool IsCheckPayment { get; set; }

    }
}
