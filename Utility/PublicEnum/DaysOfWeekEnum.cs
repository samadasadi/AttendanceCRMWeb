using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum DaysOfWeekEnum
    {
        [Display(Name = "شنبه")]
        Saturday = 1,
        [Display(Name = "یک شنبه")]
        Sunday = 2,
        [Display(Name = "دوشنبه")]
        Monday = 3,
        [Display(Name = "سه شنبه")]
        Tuesday = 4,
        [Display(Name = "چهارشنبه")]
        Wednesday = 5,
        [Display(Name = "پنج شنبه")]
        Thursday = 6,
        [Display(Name = "جمعه")]
        Friday = 7
    }
    //public enum DaysOfWeekAppointmentEnum
    //{
    //    [Display(Name = "شنبه")]
    //    Saturday = 6,
    //    [Display(Name = "یک شنبه")]
    //    Sunday = 0,
    //    [Display(Name = "دوشنبه")]
    //    Monday = 1,
    //    [Display(Name = "سه شنبه")]
    //    Tuesday = 2,
    //    [Display(Name = "چهارشنبه")]
    //    Wednesday = 3,
    //    [Display(Name = "پنج شنبه")]
    //    Thursday = 4,
    //    [Display(Name = "جمعه")]
    //    Friday = 5
    //}
}
