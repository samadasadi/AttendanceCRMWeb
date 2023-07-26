using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum CustomerDocumentEnum
    {
        [Display(Name = "رادیوگرافی")]
        Radiography = 11,
        [Display(Name = "فتوگرافی")]
        Photography = 12,
        [Display(Name = "یادداشت قلم نوری")]
        Lightpen = 13,
        [Display(Name = "ضمائم")]
        Enclosures =14,
    }
}
