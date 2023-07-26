using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModel.Report;

namespace ViewModel.UserManagement.Attendance
{
    public class AttendanceVM : DataModelResult
    {
        public ReportParameter reportParameter { get; set; }
        public List<AttendanceList> listAttenDanceVm { get; set; }
        public PersonelInfo personInfoVm { get; set; }
        public InformationGlobalReport informationGlobalReport { get; set; }

        public PersonHoghoghVm personHoghogh { get; set; }
        public PersonAccounting personAccounting { get; set; }
    }

    public class AttendanceList
    {
        public int Id { get; set; }
        public int PersonID { get; set; }
        public int UserId { get; set; }
        public string User_Name { get; set; }
        public DateTime DateEn { get; set; }
        public string DateEnFa { get { return ((this.DateEn != null) ? DateTimeOperation.M2S(this.DateEn) : ""); } }
        public string DayStr { get { try { return DateTimeOperation.GetPersianDayName(this.DateEn); } catch { return string.Empty; } } }
        public DateTime? EnterDate { get; set; }
        public string EnterDateFa { get { return ((this.EnterDate != null) ? DateTimeOperation.M2S(this.EnterDate.Value) : ""); } }
        public DateTime? EnterDate2 { get; set; }
        public DateTime? EnterDate3 { get; set; }
        public string EnterTime { get { return EnterDate != null ? EnterDate.Value.ToString("HH:mm") : string.Empty; } }
        public string EnterTime2 { get { return EnterDate2 != null ? EnterDate2.Value.ToString("HH:mm") : string.Empty; } }
        public string EnterTime3 { get { return EnterDate3 != null ? EnterDate3.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate { get; set; }
        public string leaveDateFa { get { return ((this.LeaveDate != null) ? DateTimeOperation.M2S(this.LeaveDate.Value) : ""); } }
        public DateTime? LeaveDate2 { get; set; }
        public DateTime? LeaveDate3 { get; set; }
        public string LeaveTime { get { return LeaveDate != null ? LeaveDate.Value.ToString("HH:mm") : string.Empty; } }
        public string LeaveTime2 { get { return LeaveDate2 != null ? LeaveDate2.Value.ToString("HH:mm") : string.Empty; } }
        public string LeaveTime3 { get { return LeaveDate3 != null ? LeaveDate3.Value.ToString("HH:mm") : string.Empty; } }
        public int TotalTime { get; set; }
        public string TotalTimeStr { get { return DateTimeOperation.FormatHour(this.TotalTime); } }
        public string Descriptions { get; set; }
        public bool IsPresent { get; set; }
        public bool IsHoliday { get; set; }
        public bool AutoRegLeave { get; set; }
        public int? VerifyType { get; set; }
        public string VerifyTypeStr { get { return VerifyType != null ? (VerifyType == 1 ? "اثر انگشت" : "تشخیص چهره") : ""; } }




        public bool EnterChangebyPerson { get; set; }
        public bool EnterChangebyPerson2 { get; set; }
        public bool EnterChangebyPerson3 { get; set; }
        public bool LeaveChangebyPerson { get; set; }
        public bool LeaveChangebyPerson2 { get; set; }
        public bool LeaveChangebyPerson3 { get; set; }


        /// <summary>
        /// تعداد دقیقه کاری روز جاری
        /// </summary>
        public int? TotalMinuteCurrentDay { get; set; }

        /// <summary>
        /// عنوان ساعت کاری
        /// </summary>
        public string JobTimeName { get; set; }

        /// <summary>
        /// تاخیر
        /// </summary>
        public int Takhir { get; set; }
        public string TakhirStr { get { return DateTimeOperation.FormatHour(this.Takhir); } }

        /// <summary>
        /// تعجیل
        /// </summary>
        public int Tajil { get; set; }
        public string TajilStr { get { return DateTimeOperation.FormatHour(this.Tajil); } }

        /// <summary>
        /// اضافه کاری
        /// </summary>
        public int EzafeKari { get; set; }
        public string EzafeKariStr { get { return DateTimeOperation.FormatHour(this.EzafeKari); } }

        /// <summary>
        /// غیبت
        /// </summary>
        public int Gheybat { get; set; }
        public string GheybatStr { get { return DateTimeOperation.FormatHour(this.Gheybat); } }


        /// <summary>
        /// ماموریت روزانه
        /// </summary>
        public bool MissionDay { get; set; }
        public string MissionDayStr { get { return MissionDay == true ? "دارد" : "-"; } }
        /// <summary>
        /// ماموریت ساعتی
        /// </summary>
        public int MissionHour { get; set; }
        public string MissionHourStr { get { return DateTimeOperation.FormatHour(this.MissionHour); } }


        /// <summary>
        /// مرخصی روزانه
        /// </summary>
        public bool VacationsDay { get; set; }
        public string VacationsDayStr { get { return VacationsDay == true ? "دارد" : "-"; } }
        /// <summary>
        /// مرخصی ساعتی
        /// </summary>
        public int VacationsHour { get; set; }
        public string VacationsHourStr { get { return DateTimeOperation.FormatHour(this.VacationsHour); } }
    }


    public class DailyAttendance
    {
        public DateTime DateEn { get; set; }
        public string DateEnFa { get { return ((this.DateEn != null) ? DateTimeOperation.M2S(this.DateEn) : ""); } }
        public string DayStr { get { try { return DateTimeOperation.GetPersianDayName(this.DateEn); } catch { return string.Empty; } } }

        public List<UserInfoList> UserInfo { get; set; }

    }
    public class UserInfoList
    {
        public int UserId { get; set; }
        public string PersonName { get; set; }
        public string FatherName { get; set; }
        public string NationalCode { get; set; }
        public string GroupName { get; set; }
        public bool IsPresent { get; set; }
        public string IsPresentStr { get { return IsPresent ? "حاضر" : ""; } }
        public bool IsMorakhasi { get; set; }
        public string IsMorakhasiStr { get { return IsMorakhasi ? "مرخصی" : ""; } }
        public bool IsMamoriyat { get; set; }
        public string IsMamoriyatStr { get { return IsMamoriyat ? "ماموریت" : ""; } }
        public bool IsGheybat { get; set; }
        public string IsGheybatStr { get { return IsGheybat ? "غیبت" : ""; } }






        public DateTime? EnterDate { get; set; }
        public string EnterDateFa { get { return ((this.EnterDate != null) ? DateTimeOperation.M2S(this.EnterDate.Value) : ""); } }
        public string EnterTime { get { return EnterDate != null ? EnterDate.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate { get; set; }
        public string leaveDateFa { get { return ((this.LeaveDate != null) ? DateTimeOperation.M2S(this.LeaveDate.Value) : ""); } }
        public string LeaveTime { get { return LeaveDate != null ? LeaveDate.Value.ToString("HH:mm") : string.Empty; } }
        public bool IsHoliday { get; set; }
        /// <summary>
        /// عنوان ساعت کاری
        /// </summary>
        public string JobTimeName { get; set; }
    }
}
