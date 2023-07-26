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
    /// </summary>
    ///For Table FieldDynamicPatient And Database dentistry111
    public enum FieldDynamicPatient : int
    {
        [Display(Name = "پزشک")]
        Doctor = 1,
        [Display(Name = "نام پدر")]
        FatherName = 2,
        [Display(Name = "تلفن همراه")]
        Mobile = 3,
        [Display(Name = "کدملی")]
        CodeMeli = 4,
        [Display(Name = "تحصیلات")]
        Education = 5,
        [Display(Name = "پست الکترونیکی")]
        Email = 6,
        [Display(Name = "مذهب")]
        Religion = 7,
        [Display(Name = "شغل")]
        Job = 8,
        [Display(Name = "آدرس")]
        Address = 9,
        [Display(Name = "معرف")]
        Sponser = 10,
        [Display(Name = "دستیار معاینه")]
        AssistantID = 11,
        [Display(Name = "نام بیمه")]
        InsuranceName = 12,
        [Display(Name = "نوع تخفیف")]
        DiscountTypeID = 13,
        //[Display(Name = "تاریخ شروع بیمه")]
        //StartInsurance = 14,
        //[Display(Name = "تاریخ اتمام بیمه")]
        //EndInsurance = 15,
        [Display(Name = "داروهای خاص")]
        SpecialDrug = 16,
        [Display(Name = "توضیحات")]
        Explication = 17
    }
}
