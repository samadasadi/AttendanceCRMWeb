using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
   public enum CompanyAccountEnum
    {
        [Display(Name = "طرف های حساب")]
        CompanyAccount = 1,
        [Display(Name = "بارگزاری اسناد انبار")]
        Warehouse = 2,
    }
}
