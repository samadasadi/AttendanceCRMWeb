using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    //Create By Mobin
    /// <summary>
    /// این انیوم برای سطوح دسترسی پنل مدیریت می باشد که کدام مرکز چه آیتم هایی را ببیند یا نبیند
    /// </summary>
    public enum MedicalCenterRole
    {
        [Display(Name = "حضور و غیاب")]
        Attendance,

        [Display(Name = "باشگاه مشتریان")]
        CustomerClub,

        [Display(Name = "کیف پول")]
        Wallet,

        [Display(Name = "سرپرست")]
        Supervisor,

        [Display(Name = "اعتبارات")]
        Credits,

        [Display(Name = "انبار")]
        Anbar,

        [Display(Name = "پیامک")]
        Sms,

        [Display(Name = "آوانک")]
        Avanak,

        [Display(Name = "فیش پرینت حرارتی")]
        ThermalPrintPlug,

        [Display(Name = "نسخ")]
        Prescription,

        [Display(Name = "کالرآیدی")]
        CallerID,

        [Display(Name = "حسابداری پیشرفته")]
        FinancialAccounting,
    }
}
