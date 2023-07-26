using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum EnumCustomer
    {
        [Display(Name = "حقوقی")]
        Legal = 1,
        [Display(Name = "حقیقی")]
        Actual= 2,
    }
}
