using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Utility.PublicEnum
{
    public enum ReportVisitTimeParametrRadioButton
    {

        [Display(Name = "با جزئیات")]
        WithDetail = 1,
        [Display(Name = "بدون جزئیات")]
        WithotDetail = 2,
        [Display(Name = "فیش پزشک")]
        ResidEmployee = 3,
        [Display(Name = "فیش بیمار")]
        ResidPatient = 4,

    }
}
