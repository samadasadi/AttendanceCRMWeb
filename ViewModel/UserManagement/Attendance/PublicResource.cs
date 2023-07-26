using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.UserManagement.Attendance
{
    public class PublicResource
    {
        public static string AppConfig => "HostConfig.dat";
        public static string DefaultAppProductKey => @"6iVm5pcWbzj9HA+CVT7EMHubbVxWN6KV/dKvMNPL4s9ysYnI/ln8cwRSEPfwiGp1";
        /// <summary>
        /// خروج از نرم افزار؟
        /// </summary>
        public static string ExitProgram => "خروج از نرم افزار؟";
        /// <summary>
        /// هشدار!
        /// </summary>
        public static string Warning => "هشدار!";
        /// <summary>
        /// لطفا الگوی پیام را انتخاب نمایید
        /// </summary>
        public static string SelectPattern => "لطفا الگوی پیام را انتخاب نمایید";
        /// <summary>
        /// *لطفاً ابتدا دستگاه را متصل کنید!
        /// </summary>
        public static string ConnectDevice => "*لطفاً ابتدا دستگاه را متصل کنید!";
        /// <summary>
        /// *لطفاً ابتدا شناسه کاربر را وارد کنید!
        /// </summary>
        public static string InputUserId => "*لطفاً ابتدا شناسه کاربر را وارد کنید!";
        /// <summary>
        /// استفاده از منطقه زمانی گروهی
        /// </summary>
        public static string UsingGroupTimeZone => "استفاده از منطقه زمانی گروهی";
        /// <summary>
        /// عدم استفاده از منطقه زمانی گروهی
        /// </summary>
        public static string NotUsingGroupTimeZone => "عدم استفاده از منطقه زمانی گروهی";
        /// <summary>
        /// *عملیات انجام نشد ، کد خطا
        /// </summary>
        public static string OperationfailedErrorCode => "*عملیات انجام نشد ، کد خطا=";
        /// <summary>
        /// هیچ داده ای از بازده ترمینال وجود ندارد!
        /// </summary>
        public static string NoDataFromTerminalReturns => "هیچ داده ای از بازده ترمینال وجود ندارد!";
        /// <summary>
        /// لطفاً ابتدا تاریخ شروع یا تاریخ پایان را وارد کنید!
        /// </summary>
        public static string InputStartDateEndDate => "*لطفاً ابتدا تاریخ شروع یا تاریخ پایان را وارد کنید!";
        /// <summary>
        /// لطفاً ابتدا داده وارد کنید!
        /// </summary>
        public static string InputData => "*لطفاً ابتدا داده وارد کنید!";
        /// <summary>
        /// تعداد خطا است!
        /// </summary>
        public static string CountRrror => "*تعداد خطا است!";
        public static string ExpiresError => "*خطا منقضی می شود ، لطفاً دوباره وارد کنید!";
        /// <summary>
        /// تاریخ با موفقیت ذخیره شد!
        /// </summary>
        public static string SuccessfullyValidDate => "تاریخ با موفقیت ذخیره شد!";
        /// <summary>
        /// *عملیات انجام نشد ، این کاربر وجود ندارد.
        /// </summary>
        public static string OperationfailedUserNotxist => "*عملیات انجام نشد ، این کاربر وجود ندارد.";
        /// <summary>
        /// قطع ارتباط با دستگاه!
        /// </summary>
        public static string DisconnectWithDevice => "قطع ارتباط با دستگاه!";
        /// <summary>
        /// *اتصال به دستگاه: {0} امکان پذیر نیست, کد خطا=
        /// </summary>
        public static string UnableConnectDevice => "*اتصال به دستگاه: {0} امکان پذیر نیست, کد خطا=";
        /// <summary>
        /// *شناسه دستگاه ، پورت ، نرخ انتقال ، کلید عمومی نمی تواند خالی باشد
        /// </summary>
        public static string ConnectInfoCannotBeNull => "*شناسه دستگاه ، پورت ، نرخ انتقال ، کلید عمومی نمی تواند خالی باشد!";
        /// <summary>
        /// *دستگاه غیرقانونی است
        /// </summary>
        public static string DeviceIllegal => "*دستگاه غیرقانونی است!";
        /// <summary>
        /// *کلید عمومی غیرقانونی است
        /// </summary>
        public static string CommKeyIllegal => "*کلید عمومی غیرقانونی است!";
        /// <summary>
        /// * ارتباط با دستگاه {0} قطع شد
        /// </summary>
        public static string DisconnectFromDevice => "* ارتباط با دستگاه {0} قطع شد.";
        /// <summary>
        /// همگام سازی زمان دستگاه با سیستم با موفقیت انجام شد
        /// </summary>
        public static string SuccessfullySyncTime => "همگام سازی زمان دستگاه با سیستم با موفقیت انجام شد";
        /// <summary>
        /// دریافت اطلاعات زمان دستگاه با موفقیت انجام شد
        /// </summary>
        public static string SuccessfullyGetDeviceTime => "دریافت اطلاعات زمان دستگاه با موفقیت انجام شد";
        /// <summary>
        /// زمان دستگاه با موفقیت تنظیم شد
        /// </summary>
        public static string SuccessfullySetDeviceTime => "زمان دستگاه با موفقیت تنظیم شد";
        /// <summary>
        /// کاربر را انتخاب نمایید
        /// </summary>
        public static string SelectUser => "کاربر را انتخاب نمایید";
        /// <summary>
        /// دستگاه را انتخاب نمایید
        /// </summary>
        public static string SelectDevice => "دستگاه را انتخاب نمایید";
        /// <summary>
        /// نوع گزارش را انتخاب نمایید
        /// </summary>
        public static string SelectReportType => "نوع گزارش را انتخاب نمایید";
        /// <summary>
        /// غیبت روزانه
        /// </summary>
        public static string DailyAbsense => "غیبت روزانه";
        /// <summary>
        /// داده ای برای نمایش وجود ندارد
        /// </summary>
        public static string NoDataForShowing => "* داده ای برای نمایش وجود ندارد";
        /// <summary>
        /// "* داده ای برای نمایش وجود ندارد" + " - دستگاه : " + "{0} - {1}"
        /// </summary>
        public static string NoDataForShowingInDevice => "* داده ای برای نمایش وجود ندارد" + " - دستگاه : " + "{0} - {1}";
        /// <summary>
        /// ورود و خروج پرسنل
        /// </summary>
        public static string AttLog => "ورود و خروج پرسنل";
        /// <summary>
        /// اضافه کار
        /// </summary>
        public static string Ezafekar => "اضافه کار";
        /// <summary>
        /// غیبت
        /// </summary>
        public static string Gheybat => "غیبت";
        /// <summary>
        /// کارکرد
        /// </summary>
        public static string Karkard => "کارکرد";
        /// <summary>
        /// تعجیل
        /// </summary>
        public static string Tajil => "تعجیل";
        /// <summary>
        /// تاخیر
        /// </summary>
        public static string Takhir => "تاخیر";
        /// <summary>
        /// کارمندان
        /// </summary>
        public static string Persons => "کارمندان";
        /// <summary>
        /// گروه کارمندان
        /// </summary>
        public static string UserGroups => "گروه کارمندان";
        /// <summary>
        /// شیفت
        /// </summary>
        public static string Shift => "شیفت";
        /// <summary>
        /// دستگاه ها
        /// </summary>
        public static string Devices => "دستگاه ها";
        /// <summary>
        /// حضورغیاب در بازه زمانی
        /// </summary>
        public static string DailyAttendance => "حضورغیاب در بازه زمانی";
        /// <summary>
        /// افرادی که خروج ندارند
        /// </summary>
        public static string PersonsAreNotExit => "افرادی که خروج ندارند";
        /// <summary>
        /// ماموریت
        /// </summary>
        public static string TransactionReq_Mamoriyat => "ماموریت";
        /// <summary>
        /// مرخصی
        /// </summary>
        public static string TransactionReq_Morkhasi => "مرخصی";
        /// <summary>
        /// لطفا گروه دستگاه را انتخاب نمایید
        /// </summary>
        public static string PleaseSelectDeviceGroup => "لطفا گروه دستگاه را انتخاب نمایید";
        /// <summary>
        /// "لطفا تا زمان کامل شدن عملیات قبلی منتظر بمانید"
        /// </summary>
        public static string PleaseWaitToCompletePreviuseTask => "لطفا تا زمان کامل شدن عملیات قبلی منتظر بمانید";
        public static string PleaseWait => "لطفا صبر نمایید";
        public static string UnableConnectToDevice => "*" + "ارتباط با دستگاه برقرار نشد";
        /// <summary>
        /// اطلاعات با موفقیت ذخیره شد
        /// </summary>
        public static string SaveSuccessfully => "اطلاعات با موفقیت ذخیره شد";
        /// <summary>
        /// عملیات با موفقیت انجام شد
        /// </summary>
        public static string OperationSuccessfullyDone => "عملیات با موفقیت انجام شد";
        /// <summary>
        /// عملیات لغو شد
        /// </summary>
        public static string OperationCancelled => "عملیات لغو شد";
        /// <summary>
        /// * شماره سریال دستگاه {0}-{1} دریافت نشد
        /// </summary>
        public static string DeviceSerialNumberNotLoaded => "* شماره سریال دستگاه: {0}-{1} دریافت نشد";
        /// <summary>
        /// * شماره سریال دستگاه : {0}-{1} با شماره سریال ثبت شده برابر نیست. تخلیه انجام نشد
        /// </summary>
        public static string DeviceSerialNumberNotEqualToRegisterSN => "* شماره سریال دستگاه : {0}-{1} با شماره سریال ثبت شده برابر نیست. تخلیه انجام نشد.";
        public static string DeviceSerialNumberNotNotDefined => "* شماره سریال دستگاه : {0}-{1} ثبت نشده است لطفا از بخش مدیریت دستگاخ شماره سریال را تعیین نمایید. تخلیه انجام نشد.";
        public static string DeviceSerialNumberListNotInserted => "* لیست شماره سریال های دستگاه ها تعریف نشده است. امکان تخلیه وجود ندارد";
        /// <summary>
        /// لطفا کارمندان را انتخاب نمایید
        /// </summary>
        public static string SelectUsers => "لطفا کارمندان را انتخاب نمایید";
        public static string All_Eventlog => "بدون محدودیت";
        public static string Deleted_Eventlog => "موارد حذف شده";
        public static string Added_Eventlog => "موارد اضافه شده";
        public static string Updated_Eventlog => "موارد تغییر یافته";
        public static string test47 => "";
        public static string test48 => "";
        public static string test49 => "";
        public static string test50 => "";
        public static string test51 => "";
        public static string test52 => "";
        public static string test53 => "";
        public static string test54 => "";
        public static string test55 => "";
        public static string test56 => "";
        public static string test57 => "";
        public static string test58 => "";
        public static string test59 => "";
    }
    public class QueryString
    {
        /// <summary>
        /// دریافت لیست شیفت های کاری برای یک کاربر
        /// </summary>
        public static string ShiftWorkList => @"select TOP(1) _shift.*  from PubUser_Shift _person left join ShiftWork _shift on _person.ShiftWork_Id = _shift.Id  where _person.PuUser_Id = (select top 1 Id from tbl_Employees where UserId = '{0}')  order by _person.ModifiedDate desc";
    }
}
