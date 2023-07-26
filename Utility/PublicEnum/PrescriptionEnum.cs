using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum PrescriptionEnum
    {
        [Display(Name = "نسخه")]
        Prescription = 080,

        [Display(Name = "دارو")]
        Medicine = 0801,

        [Display(Name = "نام دارو")]
        MedicineName = 080101,

        [Display(Name = "نوع دارو")]
        MedicineType = 080102,

        [Display(Name = "دوز دارو")]
        MedicineDoz = 080103,

        [Display(Name = "تعداد دارو")]
        MedicineCount = 080104,

        [Display(Name = "نحوه مصرف دارو")]
        MedicineConsumptionInstruction = 080105,

        [Display(Name = "آزمایش")]
        Experiment = 0802,
    }
}
