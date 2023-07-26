using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum WorkEnum
    {
        [Display(Name = "شروع")]
        Start = 1,
        [Display(Name = "ارجاعی")]
        Referential = 2,
    }
}
