using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum.Prescription
{
    public enum PubliEnum
    {
        mosallah_general = 1,
        mosallah_general_janbaz = 2,
        mosallah_general_sarbaz = 3,
        mosallah_special = 4,
        mosallah_special_janbaz = 5,
        mosallah_special_sarbaz = 6,
        general = 7,
        special = 8,
    }
    public enum CenterTypeEnum
    {
        public_c = 1,
        non_government = 2,
        charity =3,
        private_c =4,
        military_barkhordar =5,
        military_kam_barkhordar = 6,
    }

    public enum TN_PrescEnum
    {
        SentToServer = 1,
        NotSentToServer = 2,
    }





    public enum RelationTypeEnum
    {
        [Display(Name = "سرپرست")]
        R = 1,
        [Display(Name = "فرزند")]
        C = 2,
        [Display(Name = "همسر")]
        S = 3,
        [Display(Name = "خواهر")]
        T = 5,
        [Display(Name = "برادر")]
        B = 5,
        [Display(Name = "پدر")]
        F = 5,
        [Display(Name = "مادر")]
        M = 5,
        [Display(Name = "متفرقه")]
        O = 5,
    }

    public enum IssuerTypeEnum
    {
        [Display(Name = "بیمه سلامت")]
        I = 1,
        [Display(Name = "بیمه تامین اجتماعی")]
        T = 2,
        [Display(Name = "بیتسا(آزاد)")]
        B = 3,
        [Display(Name = "نامشخص")]
        M = 5,
    }


    public enum InsuranceTemplateType
    {
        SalamatTemplate = 1,
        TaminTemplate = 2,
        TaminDrugTemplate = 3
    }

}
