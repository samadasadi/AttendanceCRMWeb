using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum AssessmentEnum
    {
        [Display(Name = "ندارد")]
        PartCode = 1,
        [Display(Name = "تاریخ انقضای شمسی")]
        ExpireDateShamsi = 2,
        [Display(Name = "تاریخ انقضای میلادی")]
        ExpireDate = 3,
        [Display(Name = "شماره محموله")]
        LotNumber = 4,
        [Display(Name = "شماره سریال")]
        SN = 5,
    }
}
