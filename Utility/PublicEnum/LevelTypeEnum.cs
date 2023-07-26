using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum LevelTypeEnum
    {
        [Display(Name = "مشتریان")]
        Customers =101,
        [Display(Name = "محصولات")]
        Products = 102,
        [Display(Name = "متد-محصول")]
        IntroductionMethodCustomer = 103,
        [Display(Name = "متد-درخواست")]
        IntroductionMethodRequest =104
    }
}
