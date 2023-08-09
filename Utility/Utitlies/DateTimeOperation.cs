//using Persia;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using Utility.EXT;

namespace Utility
{

    public static class SoftwaretDate
    {
        public static DateTime GetDateNow()
        {
            Thread.CurrentThread.CurrentCulture = GetCultureInfo();
            return DateTime.Now;
        }

        public static CultureInfo GetCultureInfo()
        {
            return new CultureInfo("en");
        }
    }

    public static class DateTimeOperationExt
    {

        public static string GetStringOfMonth(this int month)
        {
            switch (month)
            {
                case 1:
                    return "فروردین";
                case 2:
                    return "اردیبهشت";
                case 3:
                    return "خرداد";
                case 4:
                    return "تیر";
                case 5:
                    return "مرداد";
                case 6:
                    return "شهریور";
                case 7:
                    return "مهر";
                case 8:
                    return "آبان";
                case 9:
                    return "آذر";
                case 10:
                    return "دی";
                case 11:
                    return "بهمن";
                case 12:
                    return "اسفند";
                default:
                    return "";
            }
            return "";
        }

        public static DateTime GetBeginningOfYear(this int faYear)
        {
            var persianCal = new PersianCalendar();
            return persianCal.ToDateTime(faYear, 1, 1, 0, 0, 0, 0);
        }

        public static DateTime GetEndOfYear(this int faYear)
        {
            var persianCal = new PersianCalendar();
            var astDay = 29;
            if (persianCal.IsLeapYear(faYear))
            {
                astDay = 30;
            }
            return persianCal.ToDateTime(faYear, 12, astDay, 23, 0, 0, 0);
        }
        public static DateTime GetEndOfYear1(this int faYear)
        {
            var persianCal = new PersianCalendar();
            var astDay = 31;
            if (persianCal.IsLeapYear(faYear))
            {
                astDay = 30;
            }
            return persianCal.ToDateTime(faYear, 1, astDay, 23, 0, 0, 0);
        }
        public static int GetFaYear(this DateTime dt)
        {
            var persianCal = new PersianCalendar();

            return persianCal.GetYear(dt);
        }

        public static int GetFaMonth(this DateTime dt)
        {
            var persianCal = new PersianCalendar();

            return persianCal.GetMonth(dt);
        }
    }

    public static class DateTimeOperation
    {
        public static string FormatHour(int totalminute)
        {
            try
            {
                if (totalminute <= 0) return "--:--";
                var _hourrr = (int)(totalminute / 60);
                var _minn = (totalminute - ((_hourrr) * 60));
                return (_hourrr < 10 ? "0" + _hourrr : "" + _hourrr) + ":" + (_minn < 10 ? "0" + _minn : "" + _minn);
            }
            catch
            {
                return "--:--";
            }
        }
        public static string GetStringOfMonthPersian(this int month)
        {
            try
            {
                switch (month)
                {
                    case 1:
                        return "فروردین";
                    case 2:
                        return "اردیبهشت";
                    case 3:
                        return "خرداد";
                    case 4:
                        return "تیر";
                    case 5:
                        return "مرداد";
                    case 6:
                        return "شهریور";
                    case 7:
                        return "مهر";
                    case 8:
                        return "آبان";
                    case 9:
                        return "آذر";
                    case 10:
                        return "دی";
                    case 11:
                        return "بهمن";
                    case 12:
                        return "اسفند";
                    default:
                        return string.Empty;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /// <summary>
        /// تبدیل تاریخ شمسی به میلادی مثال: از:1399/12/17   به:2021/03/18
        /// </summary>
        /// <param name="convDate"></param>
        /// <returns></returns>
        public static DateTime S2M(string convDate)
        {
            DateTime returnValue;
            var jc = new PersianCalendar();
            if (convDate.Length == 8 & convDate.Contains("/") && !convDate.StartsWith("13"))
                convDate = "13" + convDate;
            if (convDate.Length < 8)
            {
                returnValue = DateTime.Parse("1900/01/01 12:00:00 AM");
                return returnValue;
            }
            var hour = 0;
            var min = 0;
            var sec = 0;
            if (convDate.Contains(":"))
            {
                var hourMinStr = convDate.Split(':');
                min = int.Parse(hourMinStr[1]);
                sec = int.Parse(hourMinStr[2]);
                hour = int.Parse(hourMinStr[0].Split(' ')[2]);
            }

            var y = convDate.Contains("/") ? convDate.Split('/')[0] : convDate.Split('-')[0];
            var m = convDate.Contains("/") ? convDate.Split('/')[1] : convDate.Split('-')[1];
            var d = convDate.Contains("/") ? convDate.Split('/')[2].Split(' ')[0] : convDate.Split('-')[2].Split(' ')[0];

            try
            {
                if (Convert.ToInt32(m) > 6)
                {
                    if (Convert.ToInt32(d) > 30)
                        d = "30";
                }
                if (Convert.ToInt32(m) == 12 && Convert.ToInt32(d) >= 30)
                    d = "29";
            }
            catch { }
            
            returnValue = jc.ToDateTime(int.Parse(y),  int.Parse(m),  int.Parse(d), hour, min, sec, 0);

            return returnValue;

            //Create Region By Mobin
            #region Create Region By Mobin
            //DateTime returnValue;
            //var jc = new PersianCalendar();

            //if (convDate.Length == 8 & convDate.Contains("/") && !convDate.StartsWith("13"))
            //    convDate = "13" + convDate;
            //if (convDate.Length < 8)
            //{
            //    returnValue = DateTime.Parse("1900/01/01 12:00:00 AM");
            //    return returnValue;
            //}

            //try
            //{
            //    returnValue = jc.ToDateTime(int.Parse(convDate.Substring(0, 4)),
            //                                int.Parse(convDate.Substring(5, 2)),
            //                                int.Parse(convDate.Substring(8, 2)), 1, 1, 1, 1);
            //}
            //catch
            //{
            //    var dt1 = jc.ToDateTime(int.Parse(convDate.Split('/')[0]), int.Parse(convDate.Split('/')[1])
            //        , int.Parse(convDate.Split('/')[2]), 0, 0, 0, 0);

            //    returnValue = dt1;
            //}
            //return returnValue;

            //  
            #endregion
        }

        public static DateTime S2MWithTime(string convDate)
        {
            DateTime returnValue;
            var jc = new PersianCalendar();
            if (convDate.Length == 8 & convDate.Contains("/") && !convDate.StartsWith("13"))
                convDate = "13" + convDate;
            if (convDate.Length < 8)
            {
                returnValue = DateTime.Parse("1900/01/01 12:00:00 AM");
                return returnValue;
            }
            var hour = 0;
            var min = 0;
            var sec = 0;
            if (convDate.Contains(":"))
            {
                var hourMinStr = convDate.Split(':');
                min = int.Parse(hourMinStr[1]);
                sec = int.Parse(hourMinStr[2]);
                hour = int.Parse(hourMinStr[0].Split(' ')[2]);
            }
            var y = convDate.Split('/')[0];
            var m = convDate.Split('/')[1];
            var d = convDate.Split('/')[2].Split(' ')[0];
            returnValue = jc.ToDateTime(int.Parse(y), int.Parse(m), int.Parse(d), hour, min, sec, 0);
            return returnValue;
            //DateTime returnValue;
            //var jc = new PersianCalendar();

            //if (convDate.Length == 8 & convDate.Contains("/") && !convDate.StartsWith("13"))
            //    convDate = "13" + convDate;
            //if (convDate.Length < 8)
            //{
            //    returnValue = DateTime.Parse("1900/01/01 12:00:00 AM");
            //    return returnValue;
            //}

            //try
            //{
            //    returnValue = jc.ToDateTime(int.Parse(convDate.Substring(0, 4)),
            //                                int.Parse(convDate.Substring(5, 2)),
            //                                int.Parse(convDate.Substring(8, 2)), 1, 1, 1, 1);
            //}
            //catch
            //{
            //    var dt1 = jc.ToDateTime(int.Parse(convDate.Split('/')[0]), int.Parse(convDate.Split('/')[1])
            //        , int.Parse(convDate.Split('/')[2]), 0, 0, 0, 0);

            //    returnValue = dt1;
            //}
            //return returnValue;

            // 

        }


        public static DateTime GenerateDataTime(string yearNumber, string monthNumber, string dateNumber)
        {
            var cal = new PersianCalendar();
            var dt1 = cal.ToDateTime(int.Parse(yearNumber), int.Parse(monthNumber), int.Parse(dateNumber), 0, 0, 0,
                                          0);

            return dt1;
        }

        public static DateTime GetBeginningTimeOfDate(this DateTime dt)
        {
            var startDate = new DateTime(dt.Year, dt.Month, dt.Day, 0, 00, 0);
            return startDate;
        }
        public static DateTime GetEndingTimeOfDate(this DateTime dt)
        {
            var startDate = new DateTime(dt.Year, dt.Month, dt.Day, 23, 59, 59);
            return startDate;
        }

        /// <summary>
        /// تبدیل تاریخ میلادی به شمسی
        /// </summary>
        /// <param name="convDate"></param>
        /// <returns></returns>
        public static String M2S(DateTime convDate)
        {
            var jc = new PersianCalendar();
            if (convDate.ToString(CultureInfo.InvariantCulture) == "12:00:00 AM")
            {
                return "1300/01/01";
            }
            try
            {
                var farsiYear = Convert.ToString(jc.GetYear(convDate));
                var farsiMonth = Convert.ToString(jc.GetMonth(convDate));
                var farsiDay = Convert.ToString(jc.GetDayOfMonth(convDate));
                farsiDay = farsiDay.PadLeft(2, '0');
                farsiMonth = farsiMonth.PadLeft(2, '0');
                var returnValue = farsiYear + "/" + farsiMonth + "/" + farsiDay;
                return returnValue;
            }
            catch
            {
                return "1300/01/01";
            }
        }
        public static String M2SWithTime(DateTime convDate)
        {
            return M2S(convDate) + " - " + convDate.ToString("HH:mm:ss");
            // return string.Format("{0} {1:D2}:{2:D2}", M2S(convDate), convDate.ToString("HH:mm"));
        }
        public static string JumpToLastDay(string sDate)
        {
            if (sDate == null) return "Error";
            if (sDate.Trim() == "") return "Error";
            var jc = new PersianCalendar();
            var str = sDate.Split('/');
            var temMonth = int.Parse(str[1]);
            var temDay = int.Parse(str[2]);
            var temYear = int.Parse(str[0]);
            var isLeapYear = jc.IsLeapYear(temYear);
            if (temMonth >= 1 & temMonth <= 6)
                temDay = 31;
            if (temMonth >= 7 & temMonth <= 11)
                temDay = 30;
            if (temMonth == 12 & isLeapYear)
            {
                temDay = 30;
            }
            else if (temMonth == 12 & isLeapYear == false)
            {
                temDay = 29;
            }
            return temYear + "/" + temMonth.ToString("00") + "/" + temDay.ToString("00");
        }

        public static string S2Alpha(string date)
        {
            var str = date.Split('/');
            var temMonth = int.Parse(str[1]);
            var temDay = int.Parse(str[2]);
            var temYear = long.Parse(str[0]);
            var res = GetStringOfDay(temDay) + " ";
            res += GetStringOfMonth(temMonth) + " ماه ";
            res += temYear.ConvertNumber();
            return res;
        }

        public static string GetStringOfDay(int day)
        {
            switch (day)
            {
                case 1:
                    return "یکم";
                case 2:
                    return "دوم";
                case 3:
                    return "سوم";
                case 4:
                    return "چهارم";
                case 5:
                    return "پنجم";
                case 6:
                    return "ششم";
                case 7:
                    return "هفتم";
                case 8:
                    return "هشتم";
                case 9:
                    return "نهم";
                case 10:
                    return "دهم";
                case 11:
                    return "یازدهم";
                case 12:
                    return "دوازدهم";
                case 13:
                    return "سیزدهم";
                case 14:
                    return "چهاردهم";
                case 15:
                    return "پانزدهم";
                case 16:
                    return "شانزدهم";
                case 17:
                    return "هفدهم";
                case 18:
                    return "هجدهم";
                case 19:
                    return "نوزدهم";
                case 20:
                    return "بیستم";
                case 21:
                    return "بیست و یکم";
                case 22:
                    return "بیست و دوم";
                case 23:
                    return "بیست و سوم";
                case 24:
                    return "بیست و چهارم";
                case 25:
                    return "بیست و پنجم";
                case 26:
                    return "بیست و ششم";
                case 27:
                    return "بیست و هفتم";
                case 28:
                    return "بیست و هشتم";
                case 29:
                    return "بیست و نهم";
                case 30:
                    return "سی ام ";
                case 31:
                    return "سی و یکم";
                default:
                    return "";
            }
            return "";
        }

        public static string GetStringOfMonth(int month)
        {
            switch (month)
            {
                case 1:
                    return "فروردین";
                case 2:
                    return "اردیبهشت";
                case 3:
                    return "خرداد";
                case 4:
                    return "تیر";
                case 5:
                    return "مرداد";
                case 6:
                    return "شهریور";
                case 7:
                    return "مهر";
                case 8:
                    return "آبان";
                case 9:
                    return "آذر";
                case 10:
                    return "دی";
                case 11:
                    return "بهمن";
                case 12:
                    return "اسفند";
                default:
                    return "";
            }
            return "";
        }


        public static DateTime GetCurrentYearFirstDay()
        {
            var year = DateTime.Now.Year;
            if ((DateTime.Now.Month == 1 || DateTime.Now.Month == 2) || (DateTime.Now.Month == 3 && DateTime.Now.Day < 21))
            {
                year = year - 1;
            }
            var d = new DateTime(year, 3, 21);
            return d;
        }


        public static DateTime GetFirstDayOfYear(int year)
        {
            var jc = new PersianCalendar();
            return jc.ToDateTime(year, 1, 1, 0, 0, 0, 0);
        }

        public static DateTime GetEndDayOfYear(int year)
        {
            var jc = new PersianCalendar();
            var dt = jc.ToDateTime(year, 12, jc.IsLeapYear(year) ? 30 : 29, 1, 1, 1, 1);
            return dt;
        }

        public static String M2SYear(DateTime convDate)
        {
            var jc = new PersianCalendar();
            var farsiYear = Convert.ToString(jc.GetYear(convDate));
            return farsiYear;
        }

        public static String M2SMounth(DateTime convDate)
        {
            var jc = new PersianCalendar();
            var farsiMonth = Convert.ToString(jc.GetMonth(convDate));
            return farsiMonth;
        }

        public static String M2SDay(DateTime convDate)
        {
            var jc = new PersianCalendar();
            var farsiDay = Convert.ToString(jc.GetDayOfMonth(convDate));
            return farsiDay;
        }
        //public static string PersianDateString(DateTime d)
        //{
        //    Persia.SunDate faIR = new SunDate();
        //    faIR = Persia.Calendar.ConvertToPersian(d);
        //    var s = faIR.Weekday;
        //    return s;
        //}


        public static string GetPersianDayName(DateTime value)
        {
            string _resut = "";
            switch (value.DayOfWeek)
            {
                case DayOfWeek.Saturday: _resut = "شنبه"; break;
                case DayOfWeek.Sunday: _resut = "یکشنبه"; break;
                case DayOfWeek.Monday: _resut = "دوشنبه"; break;
                case DayOfWeek.Tuesday: _resut = "سه شنبه"; break;
                case DayOfWeek.Wednesday: _resut = "چهار شنبه"; break;
                case DayOfWeek.Thursday: _resut = "پنج شنبه"; break;
                case DayOfWeek.Friday: _resut = "جمعه"; break;
                default: _resut = ""; break;
            }
            return _resut;
        }
        public static int GetDayNumber(DateTime value)
        {
            int _resut = -1;
            switch (value.DayOfWeek)
            {
                case DayOfWeek.Saturday: _resut = 0; break;
                case DayOfWeek.Sunday: _resut = 1; break;
                case DayOfWeek.Monday: _resut = 2; break;
                case DayOfWeek.Tuesday: _resut = 3; break;
                case DayOfWeek.Wednesday: _resut = 4; break;
                case DayOfWeek.Thursday: _resut = 5; break;
                case DayOfWeek.Friday: _resut = 6; break;
                default: _resut = -1; break;
            }
            return _resut;
        }
        public static int GetDayNumberMiladi(DateTime value)
        {
            int _resut = -1;
            switch (value.DayOfWeek)
            {
                case DayOfWeek.Sunday: _resut = 0; break;
                case DayOfWeek.Monday: _resut = 1; break;
                case DayOfWeek.Tuesday: _resut = 2; break;
                case DayOfWeek.Wednesday: _resut = 3; break;
                case DayOfWeek.Thursday: _resut = 4; break;
                case DayOfWeek.Friday: _resut = 5; break;
                case DayOfWeek.Saturday: _resut = 6; break;
                default: _resut = -1; break;
            }
            return _resut;
        }

        public static bool isYearDateShamsiInKabise(int year)
        {
            List<int> arr = new List<int> { 1, 5, 9, 13, 17, 22, 26, 30 };
            int b = year % 33;
            return arr.Contains(b);
        }




        public static DateTime GetFirstDayOfMonth(int year, int month)
        {
            var jc = new PersianCalendar();
            return jc.ToDateTime(year, month, 1, 0, 0, 0, 0);
        }

        public static DateTime GetEndDayOfMonth(int year, int month)
        {
            var jc = new PersianCalendar();
            var dt = jc.ToDateTime(year, month,
                (month == 12 ? (jc.IsLeapYear(year) ? 30 : 29) : (month <= 6 ? 31 : 30)), 1, 1, 1, 1);
            return dt;
        }


        public static DateTime GetBeginningDateOfMonth(DateTime value)
        {
            var startDate = new DateTime(value.Year, value.Month, 1);
            //var endDate = startDate.AddMonths(1).AddDays(-1);
            return startDate;
        }
        public static DateTime GetEndingDateOfMonth(DateTime value)
        {
            var startDate = new DateTime(value.Year, value.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            return endDate;
        }


        public static bool IsBetween(this DateTime time, DateTime startTime, DateTime endTime)
        {
            if (time.TimeOfDay == startTime.TimeOfDay) return true;
            if (time.TimeOfDay == endTime.TimeOfDay) return true;

            if (startTime.TimeOfDay <= endTime.TimeOfDay)
                return (time.TimeOfDay >= startTime.TimeOfDay && time.TimeOfDay <= endTime.TimeOfDay);
            else
                return !(time.TimeOfDay >= endTime.TimeOfDay && time.TimeOfDay <= startTime.TimeOfDay);
        }

    }
}