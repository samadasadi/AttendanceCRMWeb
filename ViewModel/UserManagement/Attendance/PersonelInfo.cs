using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class PersonelInfo
    {
        public int Id { get; set; }
        public string PersonalCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FatherName { get; set; }
        public string NationalCode { get; set; }
        public DateTime? FromDate { get; set; }
        public string FromDateStr { get; set; }
        public DateTime? ToDate { get; set; }
        public string ToDateStr { get; set; }
        public bool TarkeKar { get; set; }
        public DateTime? TarkeKarDateEn { get; set; }

        /// <summary>
        /// مجموع ساعت کارکرد
        /// </summary>
        public int TotalTimeHourValue { get; set; }
        public string TotalTimeHour
        {
            get { return DateTimeOperation.FormatHour(this.TotalTimeHourValue); }
        }

        /// <summary>
        /// تعداد روز حضور
        /// </summary>
        public int CountHozorDay { get; set; }

        /// <summary>
        /// تعداد روز حضور
        /// </summary>
        public int CountHozorDay_AllWithVacataion { get; set; }

        /// <summary>
        /// تعداد روز غیبت
        /// </summary>
        public int CountPresentDay { get; set; }

        /// <summary>
        /// مجموع تاخیر
        /// </summary>
        public int TotalTakhir { get; set; }
        public string TotalTakhirStr
        {
            get { return DateTimeOperation.FormatHour(this.TotalTakhir); }
        }

        /// <summary>
        /// مجموع تعجیل
        /// </summary>
        public int TotalTajil { get; set; }
        public string TotalTajilStr
        {
            get { return DateTimeOperation.FormatHour(this.TotalTajil); }
        }

        /// <summary>
        /// مجموع اضافه کاری
        /// </summary>
        public int TotalEzafeKari { get; set; }
        public string TotalEzafeKariStr
        {
            get { return DateTimeOperation.FormatHour(this.TotalEzafeKari); }
        }

        /// <summary>
        /// مجموع اضافه کاری در روزهای تعطیل
        /// </summary>
        public int TotalEzafeKari_T { get; set; }
        public string TotalEzafeKari_TStr
        {
            get { return DateTimeOperation.FormatHour(this.TotalEzafeKari_T); }
        }

        /// <summary>
        /// مجموع غیبت
        /// </summary>
        public int TotalGheybat { get; set; }
        public string TotalGheybatStr
        {
            get { return DateTimeOperation.FormatHour(this.TotalGheybat); }
        }





        /// <summary>
        /// تعداد کل روزهای ماموریت
        /// </summary>
        public int Mission_Day { get; set; }
        /// <summary>
        /// تعداد روز ماموریت شهری
        /// </summary>
        public int Mission_City { get; set; }
        /// <summary>
        /// تعداد روز ماموریت بین شهری
        /// </summary>
        public int Mission_BetweenCity { get; set; }
        /// <summary>
        /// ماموریت ساعتی
        /// </summary>
        public int Mission_Hour { get; set; }
        public string Mission_HourStr { get { return DateTimeOperation.FormatHour(this.Mission_Hour); } }


        /// <summary>
        /// تعداد کل روز های مرخصی
        /// </summary>
        public int Vacations_Day { get; set; }
        /// <summary>
        /// استحقاقی
        /// </summary>
        public int Vacations_1 { get; set; }
        /// <summary>
        /// استعلاجی
        /// </summary>
        public int Vacations_2 { get; set; }
        /// <summary>
        /// تشویقی
        /// </summary>
        public int Vacations_3 { get; set; }
        /// <summary>
        /// بدون حقوق
        /// </summary>
        public int Vacations_4 { get; set; }
        /// <summary>
        /// ازدواج
        /// </summary>
        public int Vacations_5 { get; set; }
        /// <summary>
        /// فوت بستگان
        /// </summary>
        public int Vacations_6 { get; set; }
        /// <summary>
        /// مرخصی ساعتی
        /// </summary>
        public int Vacations_Hour { get; set; }
        public string Vacations_HourStr { get { return DateTimeOperation.FormatHour(this.Vacations_Hour); } }
    }
}
