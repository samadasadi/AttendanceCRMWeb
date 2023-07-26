using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum PregnancyCalculatorSelectorDateEnum
    {
        [Display(Name = "تاریخ پریودی")]
        PeriodHistory,
        [Display(Name = "تاریخ لقاح")]
        DateFertilization,
        [Display(Name = "تاریخ زایمان در آزمایش سنوگرافی")]
        DateDelivery
    }
}
