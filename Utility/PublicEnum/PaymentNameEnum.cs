using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum PaymentNameEnum
    {
        [Display(Name = "ایران کیش")]
        IranKish,
    }


    public enum PaymentLevelType
    {
        SinglePayment = 1,
        MultiPayments = 2,
    }
}
