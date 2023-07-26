using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum TherapyEnum
    {
        //[Display(Name = "وضعیت موجود")]
        //presentSituation = 018021,
        //[Display(Name = "طرح درمان")]
        //TreatmentPlan = 018022,
        //[Display(Name = "درمان")]
        //Treatment = 018023,
        //[Display(Name = "لابراتور")]
        //Labratory = 018024



            
        [Display(Name = "درمان")]
        Treatment = 01315,

        [Display(Name = "وضعیت موجود")]
        presentSituation = 01313,

        [Display(Name = "طرح درمان")]
        TreatmentPlan = 01314,

        [Display(Name = "لابراتور")]
        Labratory = 01316,

        [Display(Name = "چارت تخصصی پریودنتال")]
        PerioDentalChart = 01317,



    }
}
