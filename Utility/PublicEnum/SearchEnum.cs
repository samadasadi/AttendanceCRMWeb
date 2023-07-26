using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum SearchEnum
    {
        [Display(Name = "برابر")]
        equal = 101,
        [Display(Name = "به غیر از")]
        notequal = 103,
        [Display(Name = "مثل")]
        Reagent = 104,
        [Display(Name = "بزرگتر مساوی")]
        largerequal = 105,
        [Display(Name = "کوچکتر مساوی")]
        smallerequal = 106,
        [Display(Name = "فیلد های پر")]
        full = 107,
        [Display(Name = "فیلد های خالی")]
        empty = 108,
    }
}
