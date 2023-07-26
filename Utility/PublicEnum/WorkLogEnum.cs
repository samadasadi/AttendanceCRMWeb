using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum WorkLogEnum
    {
        [Display(Name = "کارکرد پزشک")]
         DrFunction= 1,
        [Display(Name = "کارکرد بیمه پزشک")]
        DrInsuranceFunction = 2,
        [Display(Name = "دریافتی از بیمار")]
        ReceivedFromPatient = 3,
        [Display(Name = "کارکرد پزشک به تفکیک نوع تعرفه")]
        FunctionByTypeOfTariff = 4,
        
    }
}
