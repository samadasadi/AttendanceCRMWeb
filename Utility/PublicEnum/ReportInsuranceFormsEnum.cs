using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum ReportInsuranceFormsEnum
    {
        [Display(Name = "بیمه کوثر")]
        KosarInsurance = 12,

        [Display(Name = "بیمه پارسیان")]
        ParsianInsurance = 13,

        [Display(Name = "بیمه تعاون")]
        CooperativeInsurance = 14,

        [Display(Name = "بیمه سامان")]
        SamanInsurance = 15,

        [Display(Name = "بیمه سرمد")]
        SarmadInsurance = 16,

        [Display(Name = "بیمه آسیا")]
        AsiaInsurance = 17,

        [Display(Name = "بیمه نوین")]
        NewInsurance = 18,

        [Display(Name = "بیمه دانا")]
        DanaInsurance = 19,

        [Display(Name = "بیمه دی")]
        DeyInsurance = 20,

        [Display(Name = "بیمه رازی")]
        RaziInsurance = 21,

        [Display(Name = "بیمه سینا")]
        SinaInsurance = 22,

        [Display(Name = "بیمه تجارت نو")]
        TejaratInsurance = 23,

        [Display(Name = "بیمه های دیگر")]
        OtherInsurance = 24,

        [Display(Name = "بیمه SOS")]
        SOSInsurance = 25,

    }
}
