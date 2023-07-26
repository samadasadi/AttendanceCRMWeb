using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class ShiftWorkVm : PageingParamer
    {
        public ShiftWorkVm()
        {
            shiftWork_DayVms = new List<ShiftWork_DayVm>();
        }
        public int Id { get; set; }
        [Display(Name = "عنوان")]
        [UIHint("HorizentalTextBox")]
        public string ShiftName { get; set; }
        public string Data { get; set; }
        public List<ShiftWork_DayVm> DataList
        {
            get
            {
                if (!string.IsNullOrEmpty(Data))
                {
                    try
                    {
                        return JsonConvert.DeserializeObject<List<ShiftWork_DayVm>>(this.Data);
                    }
                    catch
                    {
                        return new List<ShiftWork_DayVm>();
                    }
                }
                else return new List<ShiftWork_DayVm>();
            }
        }
        public bool IsActive { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsTemp { get; set; }
        public Guid UserId { get; set; }
        public string UrlData { get; set; }

        public List<ShiftWork_DayVm> shiftWork_DayVms { get; set; }




        [Display(Name = "انتخاب تقویم")]
        [UIHint("HorizentalDropdwonR")]
        public int Calendar_Id { get; set; }
        public List<NormalJsonClass> calendarvmList { get; set; }


        [Display(Name = "انتخاب ساعت کاری")]
        [UIHint("HorizentalDropdwonR")]
        public int jobTimevm { get; set; }
        public List<NormalJsonClass> jobTimevmList { get; set; }


        [Display(Name = "از تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? JobTime_FromDate { get; set; }
        [Display(Name = "تا تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? JobTime_ToDate { get; set; }
    }
}
