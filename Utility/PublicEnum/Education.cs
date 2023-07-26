using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Utility.PublicEnum
{
    public enum Education
    {

        [Display(Name = "سيکل")]
        Daily = 101,
        [Display(Name = "ديپلم")]
        Weekly = 103,
        [Display(Name = "فوق ديپلم")]
        monthly = 104,
        [Display(Name = "ليسانس")]
        D = 105,

    }
}
