using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
  public enum EnumDate
    {
        [Display(Name = "روزانه")]
        Daily = 101,
        [Display(Name = "هفتگی")]
        Weekly = 103,
        [Display(Name = "ماهانه")]
        monthly = 104
    }
}
