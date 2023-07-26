using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class TimeRecordVm : PageingParamer
    {
        public TimeRecordVm()
        {
            PersonelLists = new List<NormalJsonClass>();
        }

        public int RecordID { get; set; }


        [DisplayName("پرسنل")]
        [UIHint("HorizentalDropdwonR")]
        public string CardNo { get; set; }
        public List<NormalJsonClass> PersonelLists { get; set; }


        public int? AttStatus { get; set; }
        public string Name { get; set; }
        public string FullNameWithCode { get { return CardNo + " - " + Name ; } }

        public int? DeviceCode { get; set; }
        public string DeviceName { get; set; }
        public string UrlData { get; set; }

        public int? Year { get; set; }

        public int? Month { get; set; }

        public int? Day { get; set; }

        public int? Hour { get; set; }

        public int WorkCode { get; set; }

        public int? Minute { get; set; }





        [Display(Name = "ساعت")]
        [DataType(DataType.Time)]
        public string Time_Value { get; set; }

        [Display(Name = "تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? DatetimeIO { get; set; }
        public string DatetimeIOStr { get { try { return DatetimeIO != null ? DateTimeOperation.M2S(DatetimeIO.Value) : ""; } catch { return ""; } } }
        public string TimeStr { get { try { return DatetimeIO != null ? DatetimeIO.Value.ToString("HH:mm") : ""; } catch { return ""; } } }
        public string DayNameStr { get { try { return DatetimeIO != null ? DateTimeOperation.GetPersianDayName(DatetimeIO.Value) : ""; } catch { return ""; } } }
        public int? VerifyMode { get; set; }
        public int? InOutMode { get; set; }
        public string InOutModeStr { get; set; }
        public int? VerifyMethod { get; set; }
        public bool ChangebyPerson { get; set; }
        public string ChangebyPersonStr { get { return ChangebyPerson ? "تغییر یافته" : ""; } }
        public string VerifyTypeStr { get { return VerifyMethod != null && VerifyMethod > 0 ? (VerifyMethod == 1 ? "اثر انگشت" : "تشخیص چهره") : ""; } }


        public int DeviceGroupId { get; set; }
        public int UserGroupId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
        public Guid DoingUserId { get; set; }

        //public DateTime? FromDate { get; set; }
        public string FromDateStr
        {
            get
            {
                return ((this.FromDate != null) ? DateTimeOperation.M2S(this.FromDate) : "");
            }
        }
        //public DateTime? ToDate { get; set; }
        public string ToDateStr
        {
            get
            {
                return ((this.ToDate != null) ? DateTimeOperation.M2S(this.ToDate) : "");
            }
        }

    }
}
