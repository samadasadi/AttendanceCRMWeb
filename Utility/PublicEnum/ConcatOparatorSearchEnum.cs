using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum ConcatOparatorSearchEnum
    {
        [Display(Name = "اجتماع")]
        or = 101,
        [Display(Name = "اشتراک")]
        and = 102,
    }

    public enum ConditionalSearchEnum
    {
        [Display(Name = "مثل")]
        Mesl = 101,
        [Display(Name = "شامل")]
        Include = 102,

        [Display(Name = "نام شمارنده")]
        //این فیلد شمارنده برای نام ویو دیتا یا سیشن می باشد
        ConditionalOparator = 103,

        [Display(Name = "به غیر از")]
        OtherThan = 104
    }
}
