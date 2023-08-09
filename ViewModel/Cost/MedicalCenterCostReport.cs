using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.Cost
{
    public class MedicalCenterCostReport
    {
        public string CostCodeName { get; set; }
        public string CostCodeDesc { get; set; }
        public string FactorNo { get; set; }
        public string PersonName { get; set; }
        public string Comment { get; set; }
        public decimal Price { get; set; }
        public DateTime? DateEn { get; set; }
        public string DateEnString
        {
            get { return DateEn.HasValue ? (Utility.Utitlies.Utility.IsPersianDate(DateEn.Value.ToString(Utility.Utitlies.Utility.yyyyMMdd)) ? DateEn.Value.ToString(Utility.Utitlies.Utility.yyyyMMdd) : DateTimeOperation.M2S(DateEn.Value)) : string.Empty; }
        }
        public decimal Pricecreditor { get; set; }

    }
}
