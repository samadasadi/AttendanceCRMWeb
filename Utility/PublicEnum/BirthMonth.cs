using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum BirthMonth
    {
        [Display(Name = "فروردین")]
        Farvardin = 01,

        [Display(Name = "اردیبهشت")]
        Ordibesht = 2,

        [Display(Name = "خرداد")]
        Khordad = 3,

        [Display(Name = "تیر")]
        Tir = 4,

        [Display(Name = "مهرداد")]
        Mordad = 5,

        [Display(Name = "شهریور")]
        Sharivar = 6,

        [Display(Name = "مهر")]
        Mehr = 7,

        [Display(Name = "آبان")]
        Aban = 8,

        [Display(Name = "آذر")]
        Azar = 9,

        [Display(Name = "دی")]
        Day = 10,

        [Display(Name = "بهمن")]
        Baman = 11,

        [Display(Name = "اسفند")]
        Asfand = 12,

    }
}
