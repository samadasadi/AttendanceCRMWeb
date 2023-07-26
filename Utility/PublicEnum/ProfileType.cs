using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum ProfileType
    {
        [Display(Name = "رشته متنی یک خطی")]
        TextBox = 101,
        [Display(Name = "لیست آبشاری")]
        DropDownList = 103,
        [Display(Name = "چک باکس")]
        CheckBox = 104,
        [Display(Name = "رشته متنی چند خطی")]
        TextArea = 102,
        [Display(Name = "آپلود فایل")]
        FileUpload = 105,
        //[Display(Name = "ردیو باتن لیست")]
        //RadioButtonList = 106,
        [Display(Name = "چک باکس لیست")]
        CheckBoxList = 107,
        //[Display(Name = "لیست از جداول ")]
        //EntityDropDownList = 108,
        //[Display(Name = "دوربین ")]
        //Iframe = 109,
        [Display(Name = "مقدار عددی")]
        NumericValue = 110,
        //[Display(Name = "تاریخ")]
        //Date = 111
    }
}
