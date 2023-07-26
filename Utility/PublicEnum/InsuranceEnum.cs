using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum InsuranceEnum
    {
        [Display(Name = "مرکز")]
        Center = 020200,
        [Display(Name = "انواع بیمه")]
        InsuranceType = 020,
    }
}
