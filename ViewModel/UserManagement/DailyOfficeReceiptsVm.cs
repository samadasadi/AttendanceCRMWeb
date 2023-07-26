using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.UserManagement
{
    public class DailyOfficeReceiptsVm
    {
        public Guid UserId { get; set; }
        public DateTime DateEn { get; set; }
        public decimal Price { get; set; }
        public decimal importprice { get; set; }
        public decimal remainprice { get; set; }
        public decimal walletchange { get; set; }
        public int TreatmentCount { get; set; }
        public int PaymentCount { get; set; }
    }
}
