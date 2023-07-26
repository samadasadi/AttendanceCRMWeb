using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
   public enum CompanyType
    {
        [Display(Name = "A")]
        شرکت1 = 200,
        [Display(Name = "B")]
        شرکت2 = 201,
        [Display(Name = "C")]
        شرکت3 = 202
    }
}
