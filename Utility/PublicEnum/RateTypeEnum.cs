using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum RateTypeEnum
    {
        [Display(Name = "پرداخت")]
        Peyment = 101,
        [Display(Name = "معرف")]
        Sponsor = 102,
    }
}
