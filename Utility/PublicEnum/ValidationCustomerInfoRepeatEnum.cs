using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    /// <summary>
    /// این شمارنده برای این است که هنگام ثبت پرونده ببینیم کدام فیلد تکراری است
    /// ثبت بیمار
    /// </summary>
    public enum ValidationCustomerInfoRepeatEnum
    {
        codeMeli = 1,
        Mobile = 2,
        CardNo = 3,
        NoRepeat = 0
    }
}
