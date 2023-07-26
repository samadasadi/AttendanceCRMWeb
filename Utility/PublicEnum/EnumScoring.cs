using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum EnumScoring
    {
        [Display(Name = "پرداخت")]
        Buy = 101,
        [Display(Name = "معرفی")]
        Reagent = 102,
        [Display(Name = "اهدا جایزه")]
        Award = 103,
    }
}
