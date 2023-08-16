using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum CostSortType
    {
        DateEn = 1,
        ModifiedDate = 2
    }
    public enum CostEnum
    {
        [Display(Name = "ثبت هزینه ها")]
        Cost = 11,
        [Display(Name = "طرف های حساب")]
        CompanyAccount = 12,
        //[Display(Name = "بارگزاری اسناد انبار")]
        //Warehouse = 13,
    }

    public enum CostType
    {
        [Display(Name = "ثبت هزینه ها")]
        Cost = 1,
        [Display(Name = "طرف های حساب")]
        CompanyAccount = 2,
        //[Display(Name = "اسناد انبار")]
        //Warehouse = 3,
    }

    public enum CompanyAccountType
    {
        [Display(Name = "طرف های حساب")]
        CompanyAccount = 1,
        [Display(Name = "اسناد انبار")]
        Warehouse = 2,
    }
}
