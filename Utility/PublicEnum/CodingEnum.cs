using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum CodingEnum
    {
        [Display(Name = "انواع بیماری")]
        sickness = 011,

        [Display(Name = "نوع کارمند")]
        UserType = 01202,

        [Display(Name = "مدرک تحصيلي")]
        Education = 01201,

        [Display(Name = "انواع بیمه")]
        Insurer = 020,

        [Display(Name = "معرف")]
        Sponsor = 023,

        [Display(Name = "پذیرش")]
        Reception = 0120201,

        [Display(Name = "اطلاعات تکمیلی بیمار")]
        InformationSick = 018,

        [Display(Name = "گروه بندی بیماران")]
        GroupPatient = 021,

        [Display(Name = "درمان")]
        Therapy = 01802,

        [Display(Name = "سایر خدمات")]
        ListServices = 013,

        [Display(Name = "پزشک معالج")]
        Doctor = 0120202,

        [Display(Name = "کاربر")]
        User = 0120205,

        [Display(Name = "لابراتوار")]
        Labretory = 019,

        [Display(Name = " رنگ دندان")]
        TeethColor = 01903, // changed this fro 01903 to 0193

        [Display(Name = " هزینه ها")]
        CostList = 015,

        [Display(Name = "لابراتور هزینه ها")]
        CostLabretory = 015010301,

        [Display(Name = "شرح خدمات")]
        DiscriptionServices = 01901,

        [Display(Name = "فرم ساز")]
        FormBuilder = 022,

        [Display(Name = "انبار")]
        Warehouses = 024,

        [Display(Name = "گروه بندی کالا")]
        GroupProduct = 02401,

        [Display(Name = "چک")]
        Check = 016,

        [Display(Name = "قالب پیامک")]
        Template = 4,
        [Display(Name = "واحد سنجش")]
        MeasurementUnit = 017,

        [Display(Name = "پرسنل")]
        Personel = 02601,

        [Display(Name = "شرکت ها")]
        Company = 015010302,

        [Display(Name = "حقوق پزشکان")]
        DoctorsRights = 015010101,

        [Display(Name = "حقوق پرسنل")]
        StaffSalaries = 015010102,

        [Display(Name = "نوع پرداخت")]
        MoneyType = 014,

        [Display(Name = "طرح درمان و درمان")]
        Treatment = 01314,

        [Display(Name = "انواع تخفیف")]
        DiscountCoding = 030,

        [Display(Name = "دستیار")]
        Assistant = 0120203,

        [Display(Name = "چک")]
        CheckCode = 01403,


    }
}
