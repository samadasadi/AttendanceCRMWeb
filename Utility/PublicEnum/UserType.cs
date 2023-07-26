using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum UserType
    {
        [Display(Name = "پزشک")]
        Doctor = 1,
        [Display(Name = "پرسنل")]
        Personel = 2,
        [Display(Name = "بیمار")]
        Patient = 3,
    }
}


