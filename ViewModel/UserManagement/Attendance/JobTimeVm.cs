using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.UserManagement.Attendance
{
    public class JobTimeVm : PageingParamer
    {
        public int Id { get; set; }
        [Display(Name = "عنوان")]
        [UIHint("HorizentalTextBox")]
        public string JobTimeName { get; set; }
        [Display(Name = "شیفت تا روز بعد")]
        [UIHint("HorizentalCheckBox")]
        public bool ShiftTaRoozeBad { get; set; }




        [Display(Name = "زمان ورود")]
        [DataType(DataType.Time)]
        public string TimeVorod_Value { get; set; }
        public DateTime TimeVorod { get; set; }
        public string TimeVorodStr { get { return TimeVorod.ToString("HH:mm"); } }



        [Display(Name = "فرجه ورود")]
        [DataType(DataType.Time)]
        public string TimeFVorod_Value { get; set; }
        public DateTime? TimeFVorod { get; set; }
        public string TimeFVorodStr { get { return TimeFVorod != null ? TimeFVorod.Value.ToString("HH:mm") : ""; } }



        [Display(Name = "زمان خروج")]
        [DataType(DataType.Time)]
        public string TimeKhoroj_Value { get; set; }
        public DateTime TimeKhoroj { get; set; }
        public string TimeKhorojStr { get { return TimeKhoroj.ToString("HH:mm"); } }



        [Display(Name = "فرجه خروج")]
        [DataType(DataType.Time)]
        public string TimeFKhoroj_Value { get; set; }
        public DateTime? TimeFKhoroj { get; set; }
        public string TimeFKhorojStr { get { return TimeFKhoroj != null ? TimeFKhoroj.Value.ToString("HH:mm") : ""; } }




        public bool ShiftDovvom { get; set; }

        public DateTime? TimeVorod2 { get; set; }

        public DateTime? TimeFVorod2 { get; set; }

        public DateTime? TimeKhoroj2 { get; set; }

        public DateTime? TimeFKhoroj2 { get; set; }





        //public string TimeShenavar { get; set; }
        //public DateTime? TimeShiftLength { get; set; }



        [Display(Name = "طول شیفت")]
        [DataType(DataType.Time)]
        public string TimeShenavar { get; set; }
        public DateTime? TimeShiftLength { get; set; }
        public string TimeShenavarStr { get { return TimeShiftLength != null ? TimeShiftLength.Value.ToString("HH:mm") : ""; } }





        [Display(Name = "توضیحات")]
        [UIHint("HorizentalTextBox")]
        public string Explain { get; set; }

        public DateTime ModifiedDate { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsActive { get; set; }
        [Display(Name = "شیفت شناور")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool ShiftShenavar { get; set; }

        public string UrlData { get; set; }




    }
}
