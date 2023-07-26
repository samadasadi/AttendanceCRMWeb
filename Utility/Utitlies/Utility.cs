using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace Utility.Utitlies
{
    //Create Class By Mobin
    public static class Utility
    {
        #region ServiceImage
        public enum ImageComperssion
        {
            Maximum = 50,
            Good = 60,
            Normal = 70,
            Fast = 80,
            Minimum = 90,
        }

        public static Byte[] ConvertTifToJpg(byte[] tifByte)
        {
            Byte[] jpegBytes;
            using (MemoryStream inStream = new MemoryStream(tifByte))
            using (MemoryStream outStream = new MemoryStream())
            {
                System.Drawing.Bitmap.FromStream(inStream).Save(outStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                jpegBytes = outStream.ToArray();
            }
            return jpegBytes;
        }

        public static void ResizeImage(this Stream inputStream, int width, int height, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            System.Drawing.Image img = new Bitmap(inputStream);
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void ResizeImage(this System.Drawing.Image img, int width, int height, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void ResizeImageByWidth(this Stream inputStream, int width, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            System.Drawing.Image img = new Bitmap(inputStream);
            int height = img.Height * width / img.Width;
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void ResizeImageByWidth(this System.Drawing.Image img, int width, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            int height = img.Height * width / img.Width;
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void ResizeImageByHeight(this Stream inputStream, int height, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            System.Drawing.Image img = new Bitmap(inputStream);
            int width = img.Width * height / img.Height;
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void ResizeImageByHeight(this System.Drawing.Image img, int height, string savePath, ImageComperssion ic = ImageComperssion.Normal)
        {
            int width = img.Width * height / img.Height;
            System.Drawing.Image result = new Bitmap(width, height, PixelFormat.Format24bppRgb);
            using (Graphics g = Graphics.FromImage(result))
            {
                g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.DrawImage(img, 0, 0, width, height);
            }
            result.CompressImage(savePath, ic);
        }

        public static void CompressImage(this System.Drawing.Image img, string path, ImageComperssion ic)
        {
            System.Drawing.Imaging.EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, Convert.ToInt32(ic));
            ImageFormat format = img.RawFormat;
            ImageCodecInfo codec = ImageCodecInfo.GetImageDecoders().FirstOrDefault(c => c.FormatID == format.Guid);
            string mimeType = codec == null ? "image/jpeg" : codec.MimeType;
            ImageCodecInfo jpegCodec = null;
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
            for (int i = 0; i < codecs.Length; i++)
            {
                if (codecs[i].MimeType == mimeType)
                {
                    jpegCodec = codecs[i];
                    break;
                }
            }
            EncoderParameters encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = qualityParam;
            img.Save(path, jpegCodec, encoderParams);
        }
        #endregion

        /// <summary>
        /// For strings that contain text and HTML tags
        /// </summary>
        /// <param name="str"></param>
        /// <param name="maxLength"></param>
        /// <returns></returns>
        public static string TruncateLongStringForStringAndHtml(string str, int maxLength)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;
            String result = Regex.Replace(str, @"<[^>]+>|&nbsp;|&zwnj;|&lrm;|&rlm;", string.Empty).Trim();
            if (string.IsNullOrEmpty(result))
                return result;
            return result.Substring(0, Math.Min(result.Length, maxLength));
        }

        /// <summary>
        /// For strings that only contain text
        /// </summary>
        /// <param name="str"></param>
        /// <param name="maxLength"></param>
        /// <returns></returns>
        public static string TruncateLongStringForString(string str, int maxLength)
        {
            if (string.IsNullOrEmpty(str))
                return str;
            return str.Substring(0, Math.Min(str.Length, maxLength));
        }

        /// <summary>
        /// اگر کاربر اعتبار سنجی سمت سرویس گیرنده را غیر فعال کند کل پیغام های اعتبار سنچی در سمت سرویس دهنده مدیریت می شود
        /// </summary>
        /// <param name="modelState"></param>
        /// <returns></returns>
        public static string GetErrors(this System.Web.Mvc.ModelStateDictionary modelState)
        {
            return string.Join("<br />", (from item in modelState
                                          where (item.Value.Errors.Any()) && (!string.IsNullOrEmpty(item.Value.Errors[0].ErrorMessage))
                                          select item.Value.Errors[0].ErrorMessage).ToList());
        }

        public static void ClearModelState(System.Web.Mvc.ModelStateDictionary modelState)
        {
            foreach (var modelValue in modelState.Values)
                modelValue.Errors.Clear();
        }

        public static string ToLowerFirst(this string str)
        {
            return str.Substring(0, 1).ToLower() + str.Substring(1);
        }

        public static DateTime ToPersianDate(this DateTime dt)
        {
            try
            {
                PersianCalendar pc = new PersianCalendar();
                int year = pc.GetYear(dt);
                int month = pc.GetMonth(dt);
                int day = pc.GetDayOfMonth(dt);
                int hour = pc.GetHour(dt);
                int min = pc.GetMinute(dt);

                return new DateTime(year, month, day, hour, min, 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public static DateTime AddDays(string persianDate, int dayCount)
        {
            try
            {
                string[] _date = persianDate.Split('/');
                PersianCalendar pc = new PersianCalendar();
                DateTime dt = new DateTime(Convert.ToInt32(_date[0]), Convert.ToInt32(_date[1]), Convert.ToInt32(_date[2]), pc);
                return dt.AddDays(dayCount);
            }
            catch (Exception ex)
            {
                return DateTime.Now;
            }
        }

        public static string ToPersianDate(this string strDate)
        {
            string[] d = strDate.Split('/');
            DateTime dt = new DateTime(int.Parse(d[0]), int.Parse(d[1]), int.Parse(d[2]));
            if (!dt.ToString(FormmatDate).IsPersianDate())
            {
                DateTime dtResult = dt.ToPersianDate();
                return dtResult.ToString(FormmatDate);
            }
            return dt.ToString(FormmatDate);
        }

        public static DateTime ToMiladiDate(this DateTime dt)
        {
            try
            {
                PersianCalendar pc = new PersianCalendar();
                return pc.ToDateTime(dt.Year, dt.Month, dt.Day, dt.Hour, dt.Minute, 0, 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DateTime ToMiladiDate(this string convDate)
        {
            var y = convDate.Contains("/") ? convDate.Split('/')[0] : convDate.Split('-')[0];
            var m = convDate.Contains("/") ? convDate.Split('/')[1] : convDate.Split('-')[1];
            var d = convDate.Contains("/") ? convDate.Split('/')[2].Split(' ')[0] : convDate.Split('-')[2].Split(' ')[0];
            PersianCalendar pc = new PersianCalendar();
            return pc.ToDateTime(Convert.ToInt32(y), Convert.ToInt32(m), Convert.ToInt32(d), 0, 0, 0, 0);
        }


        public static string ToPrice(this object dec)
        {
            if (dec == null) return string.Empty;
            if (!string.IsNullOrEmpty(dec.ToString()))
            {
                string Src = dec.ToString();
                Src = Src.Replace(".0000", "");
                if (!Src.Contains("."))
                {
                    Src = Src + ".00";
                }
                string[] price = Src.Split('.');
                if (price[1].Length >= 2)
                {
                    price[1] = price[1].Substring(0, 2);
                    price[1] = price[1].Replace("00", "");
                }

                string Temp = null;
                int i = 0;
                if ((price[0].Length % 3) >= 1)
                {
                    Temp = price[0].Substring(0, (price[0].Length % 3));
                    for (i = 0; i <= (price[0].Length / 3) - 1; i++)
                    {
                        Temp += "," + price[0].Substring((price[0].Length % 3) + (i * 3), 3);
                    }
                }
                else
                {
                    for (i = 0; i <= (price[0].Length / 3) - 1; i++)
                    {
                        Temp += price[0].Substring((price[0].Length % 3) + (i * 3), 3) + ",";
                    }
                    Temp = Temp.Substring(0, Temp.Length - 1);
                    // Temp = price(0)
                    //If price(1).Length > 0 Then
                    //    Return price(0) + "." + price(1)
                    //End If
                }
                if (price[1].Length > 0)
                {
                    return Temp + "." + price[1];
                }
                else
                {
                    return Temp;
                }
            }
            return dec.ToString();
        }
        public static string Encrypt(this string str)
        {
            byte[] encData_byte = new byte[str.Length];
            encData_byte = System.Text.Encoding.UTF8.GetBytes(str);
            return Convert.ToBase64String(encData_byte);
        }

        public static string Decrypt(this string str)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(str);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            return new string(decoded_char);
        }

        public static string UrlEncode(this string str)
        {
            return HttpUtility.UrlEncode(str);
        }

        public static string UrlDecode(this string str)
        {
            return HttpUtility.UrlDecode(str);
        }

        public static bool IsUrl(this string str)
        {
            return Regex.IsMatch(str, @"http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?");
            //return Regex.IsMatch(str, @"http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&amp;=]*)?");
        }

        public static bool IsMobile(this string str)
        {
            return Regex.IsMatch(str, @"^(((\+|00)98)|0)?9[123]\d{8}$");
        }

        public static bool IsTimeSpan12(this string str)
        {
            return Regex.IsMatch(str, @"^(1[012]|[1-9]):([0-5]?[0-9]) (AM|am|PM|pm)$");
        }

        public static bool IsTimeSpan12P(this string str)
        {
            return Regex.IsMatch(str, @"^(1[012]|[1-9]):([0-5]?[0-9]) (ق ظ|ق.ظ|ب ظ|ب.ظ)$");
        }

        public static bool IsTimeSpan24hhm(this string str)
        {
            return Regex.IsMatch(str, @"^([01][0-9]|2[0-3]):([0-5]?[0-9])$");
        }

        public static bool IsTimeSpan24hm(this string str)
        {
            return Regex.IsMatch(str, @"^(2[0-3]|[01]?\d):([0-5]?[0-9])$");
        }

        //public static bool IsPersianDateTime(this string str)
        //{
        //    return Regex.IsMatch(str, @"^(13\d{2}|[1-9]\d)/(1[012]|0?[1-9])/([12]\d|3[01]|0?[1-9]) ([01][0-9]|2[0-3]):([0-5]?[0-9])$");
        //}

        public static bool IsTime(this string str)
        {
            return Regex.IsMatch(str, @"^([01][0-9]|2[0-3]):([0-5]?[0-9])$");
        }

        public static bool IsPersianDate(this string str)
        {
            if (Regex.IsMatch(str, @"^(13\d{2}|[1-9]\d)/(1[012]|0?[1-9])/([12]\d|3[01]|0?[1-9])$") || Regex.IsMatch(str, @"^(14\d{2}|[1-9]\d)/(1[012]|0?[1-9])/([12]\d|3[01]|0?[1-9])$"))
                return true;
            return false;
            //return Regex.IsMatch(str, @"^(13\d{2}|[1-9]\d)/(1[012]|0?[1-9])/([12]\d|3[01]|0?[1-9])$");
        }

        public static string ToStringShamsiDate(this DateTime dt)
        {
            PersianCalendar PC = new PersianCalendar();
            int intYear = PC.GetYear(dt);
            int intMonth = PC.GetMonth(dt);
            int intDayOfMonth = PC.GetDayOfMonth(dt);
            DayOfWeek enDayOfWeek = PC.GetDayOfWeek(dt);
            string strMonthName = "";
            string strDayName = "";
            switch (intMonth)
            {
                case 1:
                    strMonthName = "فروردین";
                    break;
                case 2:
                    strMonthName = "اردیبهشت";
                    break;
                case 3:
                    strMonthName = "خرداد";
                    break;
                case 4:
                    strMonthName = "تیر";
                    break;
                case 5:
                    strMonthName = "مرداد";
                    break;
                case 6:
                    strMonthName = "شهریور";
                    break;
                case 7:
                    strMonthName = "مهر";
                    break;
                case 8:
                    strMonthName = "آبان";
                    break;
                case 9:
                    strMonthName = "آذر";
                    break;
                case 10:
                    strMonthName = "دی";
                    break;
                case 11:
                    strMonthName = "بهمن";
                    break;
                case 12:
                    strMonthName = "اسفند";
                    break;
                default:
                    strMonthName = "";
                    break;
            }

            //switch (enDayOfWeek)
            //{
            //    case DayOfWeek.Friday:
            //        strDayName = "جمعه";
            //        break;
            //    case DayOfWeek.Monday:
            //        strDayName = "دوشنبه";
            //        break;
            //    case DayOfWeek.Saturday:
            //        strDayName = "شنبه";
            //        break;
            //    case DayOfWeek.Sunday:
            //        strDayName = "یکشنبه";
            //        break;
            //    case DayOfWeek.Thursday:
            //        strDayName = "پنجشنبه";
            //        break;
            //    case DayOfWeek.Tuesday:
            //        strDayName = "سه شنبه";
            //        break;
            //    case DayOfWeek.Wednesday:
            //        strDayName = "چهارشنبه";
            //        break;
            //    default:
            //        strDayName = "";
            //        break;
            //}

            return (string.Format("{0} {1} {2} {3}", strDayName, intDayOfMonth, strMonthName, intYear));
        }

        public static string ToText(this int digit)
        {
            string txt = digit.ToString();
            int length = txt.Length;

            string[] a1 = new string[10] { "-", "یک", "دو", "سه", "چهار", "پنح", "شش", "هفت", "هشت", "نه" };
            string[] a2 = new string[10] { "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده" };
            string[] a3 = new string[10] { "-", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود" };
            string[] a4 = new string[10] { "-", "یک صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفصد", "هشصد", "نهصد" };

            string result = "";
            bool isDahegan = false;

            for (int i = 0; i < length; i++)
            {
                string character = txt[i].ToString();
                switch (length - i)
                {
                    case 7://میلیون
                        if (character != "0")
                        {
                            result += a1[Convert.ToInt32(character)] + " میلیون و ";
                        }
                        else
                        {
                            result = result.TrimEnd('و', ' ');
                        }
                        break;
                    case 6://صدهزار
                        if (character != "0")
                        {
                            result += a4[Convert.ToInt32(character)] + " و ";
                        }
                        else
                        {
                            result = result.TrimEnd('و', ' ');
                        }
                        break;
                    case 5://ده هزار
                        if (character == "1")
                        {
                            isDahegan = true;
                        }
                        else if (character != "0")
                        {
                            result += a3[Convert.ToInt32(character)] + " و ";
                        }
                        break;
                    case 4://هزار
                        if (isDahegan == true)
                        {
                            result += a2[Convert.ToInt32(character)] + " هزار و ";
                            isDahegan = false;
                        }
                        else
                        {
                            if (character != "0")
                            {
                                result += a1[Convert.ToInt32(character)] + " هزار و ";
                            }
                            else
                            {
                                result = result.TrimEnd('و', ' ');
                            }
                        }
                        break;
                    case 3://صد
                        if (character != "0")
                        {
                            result += a4[Convert.ToInt32(character)] + " و ";
                        }
                        break;
                    case 2://ده
                        if (character == "1")
                        {
                            isDahegan = true;
                        }
                        else if (character != "0")
                        {
                            result += a3[Convert.ToInt32(character)] + " و ";
                        }
                        break;
                    case 1://یک
                        if (isDahegan == true)
                        {
                            result += a2[Convert.ToInt32(character)];
                            isDahegan = false;
                        }
                        else
                        {
                            if (character != "0") result += a1[Convert.ToInt32(character)];
                            else result = result.TrimEnd('و', ' ');
                        }
                        break;
                }
            }
            return result;
        }

        /// <summary>
        /// This Function For Convert Array Int To String
        /// </summary>
        /// <param name="arr"></param>
        /// <param name="addstrToFirst">This Prammeter For Add String To First</param>
        /// <returns></returns>
        public static string[] ToStringArray(int[] arr, string addstrToFirst = "")
        {
            List<string> strSicknessesArray = new List<string>();
            if (arr != null)
                for (int count = 0; count < arr.Length; count++)
                    strSicknessesArray.Add(addstrToFirst + arr[count].ToString());
            return strSicknessesArray.ToArray();
        }

        /// <summary>
        /// Convert Image To Array Byte
        /// </summary>
        /// <param name="imageIn"></param>
        /// <returns></returns>
        public static byte[] ImageToByteArray(Image imageIn)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, imageIn.RawFormat);
                return ms.ToArray();
            }
        }

        /// <summary>
        /// Convert Byte Array To Image
        /// </summary>
        /// <param name="byteArrayIn"></param>
        /// <returns></returns>
        public static Image byteArrayToImage(byte[] byteArrayIn)
        {
            using (MemoryStream ms = new MemoryStream(byteArrayIn))
            {
                Image returnImage = Image.FromStream(ms);
                return returnImage;
            }
        }

        ///////////////////////////
        static public bool ValidateParsianDate(string date)
        {
            bool status = true;

            try
            {
                PersianCalendar persianCalendar = new PersianCalendar();
                CultureInfo persianCulture = new CultureInfo("fa-IR");
                DateTime persianDateTime = DateTime.ParseExact(date, FormmatDate, persianCulture);
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                status = false;
            }

            return status;
        }

        public static string FormmatDate = "dd/MM/yyyy";

        /// <summary>
        /// این فرمت بیشتر برای نمایش استفاده می شود
        /// </summary>
        public static string yyyyMMdd
        {
            get
            {
                return "yyyy/MM/dd";
            }
        }

        public static string ConvertWeekMiladiToPersian(string value)
        {
            string result = string.Empty;
            switch (value)
            {
                case "Sunday":
                    result = "شنبه";
                    break;
                case "Monday":
                    result = "یک شنبه";
                    break;
                case "Tuesday":
                    result = "دوشنبه";
                    break;
                case "Wednesday":
                    result = "سه شنبه";
                    break;
                case "Thursday":
                    result = "چهارشنبه";
                    break;
                case "Friday":
                    result = "پنج شنبه";
                    break;
                case "Saturday":
                    result = "جمعه";
                    break;


                    //case "Sunday":
                    //    result = "یک شنبه";
                    //    break;
                    //case "Monday":
                    //    result = "دوشنبه";
                    //    break;
                    //case "Tuesday":
                    //    result = "سه شنبه";
                    //    break;
                    //case "Wednesday":
                    //    result = "چهارشنبه";
                    //    break;
                    //case "Thursday":
                    //    result = "پنج شنبه";
                    //    break;
                    //case "Friday":
                    //    result = "جمعه";
                    //    break;
                    //case "Saturday":
                    //    result = "شنبه";
                    //    break;
            }

            return result;
        }

        public static DateTime checkDataTimeForCalture(DateTime item, bool isCheckConditionalTwo = false)
        {
            bool IsPershin = ValidateParsianDate(item.ToString(FormmatDate)) && (isCheckConditionalTwo ? item.ToString(yyyyMMdd).IsPersianDate() : true);
            return IsPershin ? ToMiladiDate(item) : item;
        }

        /// <summary>
        /// این متد برای آخر روز ماه می باشد
        /// </summary>
        /// <returns></returns>
        public static Nullable<DateTime> ToPersianWithString(string str)
        {
            if (string.IsNullOrEmpty(str)) return null;

            var strs = str.Contains("/") ? str.Split('/') : str.Split('-');

            strs[2] = strs[2].Substring(0, 2);

            if (!(strs[0] + "/" + strs[1] + "/" + strs[2]).IsPersianDate()) return null;

            int year = int.Parse(strs[0]);
            int month = int.Parse(strs[1]);

            string strMonth = strs[1] + "/" + strs[2];
            
            string MonthRes = string.Empty;


            #region code new
            return DateTimeOperation.S2M(strs[0] + "/" + strs[1] + "/" + strs[2]);
            #endregion

            #region comment code old
            //if (strs[0] == "1398" || strs[0] == "1400" || strs[0] == "1401")
            //{
            //    switch (strMonth)
            //    {
            //        case "02/31":
            //            MonthRes = "05/21";
            //            break;
            //        case "02/30":
            //            MonthRes = "05/20";
            //            break;
            //        case "02/29":
            //            MonthRes = "05/19";
            //            break;
            //        case "06/31":
            //            MonthRes = "09/22";
            //            break;
            //        case "04/31":
            //            MonthRes = "07/22";
            //            break;
            //        case "05/10":
            //            MonthRes = "08/01";
            //            break;
            //        default:
            //            return null;
            //    }
            //}
            //else
            //{
            //    switch (strMonth)
            //    {
            //        case "02/31":
            //            MonthRes = "05/20";
            //            break;
            //        case "02/30":
            //            MonthRes = "05/19";
            //            break;
            //        case "02/29":
            //            MonthRes = "05/18";
            //            break;
            //        case "06/31":
            //            MonthRes = "09/21";
            //            break;
            //        case "04/31":
            //            MonthRes = "07/21";
            //            break;
            //        case "05/10":
            //            MonthRes = "07/31";
            //            break;
            //        default:
            //            return null;
            //    }
            //} 


            //year += 621;
            

            //return DateTime.Parse(year + "/" + MonthRes);

            #endregion
        }

        /// <summary>
        /// وضعیت وقت ملاقات 
        /// </summary>
        /// <param name="status"></param>
        /// <returns></returns>
        public static string GetTitleSTatus(string status)
        {
            switch (status)
            {
                case "cancel shude": return "کنسل شده";
                case "visit": return "ویزیت";
                case "dar hale entezar": return "در حال انتظار";
                case "darhale peygiri": return "در حال پیگیری";
                case "takhir": return "تاخیر";
                case "taeed e vaght": return "تایید وقت";
                case "organsi": return "اورژانسی";
                case "No Status":return "بدون وضعیت";
                default: return status;
            }
        }

        /// <summary>
        /// روز جاری را به پارامتر ورودی که به بهش میدی می گی شنبه را می خوام
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="startOfWeek"></param>
        /// <returns></returns>
        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek)
        {
            int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
            return dt.AddDays(-1 * diff);
        }

        /// <summary>
        /// برای جستجوی در دیتابیس است که بعضی از کاراکترها را چک نمی کند
        /// </summary>
        /// <returns></returns>
        public static string toCharInSearchDatabase(string text)
        {
            return text.Replace("ك", "ک").Replace("ي", "ي").Replace("?", "ي").Replace("ى", "ي").Replace("ة", "ه");
        }

        public static DateTime returnDateTimePersian(DateTime dt)
        {
            DateTime dtRes = dt.ToString(yyyyMMdd) == "0001/01/01" ? DateTime.Now : dt;
            return dtRes.ToString(yyyyMMdd).IsPersianDate() ? dtRes : DateTime.Parse(DateTimeOperation.M2S(dtRes));
        }


        public class JsonClass
        {
            public string Value { get; set; }
        }

        public static List<JsonClass> ConvertJsonStringToClass(string str)
        {
            if (!string.IsNullOrEmpty(str))
            {
                var result = JsonConvert.DeserializeObject<List<JsonClass>>(str);
                return result;
            }
            else return new List<JsonClass>();

            //if (!string.IsNullOrEmpty(str) && str.Contains("Value"))
            //{
            //    // Parse your Result to an Array
            //    var jArray = JArray.Parse(str);
            //    // Index the Array and select your CompanyID
            //    var obj1 = jArray[0]["Value"].Value<string>();
            //    return obj1;
            //}
            //return string.Empty;
        }

        public static string convertJsonToString(string str)
        {
            return string.Join(" , ", ConvertJsonStringToClass(str).Select(m => m.Value));
        }

        public static List<NormalJsonClass> GetPrinterList()
        {
            var _lst = System.Drawing.Printing.PrinterSettings.InstalledPrinters;
            List<NormalJsonClass> res = new List<NormalJsonClass>();
            foreach (string printer in _lst)
            {
                NormalJsonClass item = new NormalJsonClass();
                item.Value = printer;
                item.Text = printer;
                res.Add(item);
            }
            return res;
        }

        public static bool CheckForInternetConnection()
        {
            try
            {
                // way 1
                using (var client = new WebClient())
                //using (var stream = client.OpenRead("http://www.google.com"))
                using (var stream = client.OpenRead("http://37.156.28.11"))
                {
                    return true;
                }



                // way 2
                //Ping myPing = new Ping();
                //String host = "google.com";
                //byte[] buffer = new byte[32];
                //int timeout = 1000;
                //PingOptions pingOptions = new PingOptions();
                //PingReply reply = myPing.Send(host, timeout, buffer, pingOptions);
                //if (reply.Status == IPStatus.Success)
                //{
                //    return true;
                //}
                //return false;
            }
            catch
            {
                return false;
            }
        }

        public static void LogService(string content)
        {
            try
            {

                string path = AppDomain.CurrentDomain.BaseDirectory.Substring(0, AppDomain.CurrentDomain.BaseDirectory.Substring(0, AppDomain.CurrentDomain.BaseDirectory.LastIndexOf('\\')).LastIndexOf('\\')) + "\\ServiceLog";

                //string path = Server.MapPath(AppSettings.LogServicePath) + "ConLogs";

                if (!Directory.Exists(path))
                {
                    DirectoryInfo di = Directory.CreateDirectory(path);
                }

                string filePath = path + "\\log" + DateTime.Now.ToString("ddMMyyyy") + ".txt";

                using (FileStream fs = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        sw.BaseStream.Seek(0, SeekOrigin.End);
                        sw.WriteLine("- " + content);
                        sw.Flush();
                        sw.Close();
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }




        public static string GetIp()
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            if (ip != null && ip.Equals(IPAddress.IPv6Loopback.ToString(), StringComparison.InvariantCultureIgnoreCase))
                ip = IPAddress.Loopback.ToString();
            return ip;
        }
        public static String GetMobileVersion(string userAgent, string device)
        {
            var temp = userAgent.Substring(userAgent.IndexOf(device) + device.Length).TrimStart();
            var version = string.Empty;

            foreach (var character in temp)
            {
                var validCharacter = false;
                int test = 0;

                if (Int32.TryParse(character.ToString(), out test))
                {
                    version += character;
                    validCharacter = true;
                }

                if (character == '.' || character == '_')
                {
                    version += '.';
                    validCharacter = true;
                }

                if (validCharacter == false)
                    break;
            }

            return version;
        }
        public static String GetUserPlatform(HttpRequest request)
        {
            var ua = request.UserAgent;

            if (ua.Contains("Android"))
                return string.Format("Android {0}", GetMobileVersion(ua, "Android"));

            if (ua.Contains("iPad"))
                return string.Format("iPad OS {0}", GetMobileVersion(ua, "OS"));

            if (ua.Contains("iPhone"))
                return string.Format("iPhone OS {0}", GetMobileVersion(ua, "OS"));

            if (ua.Contains("Linux") && ua.Contains("KFAPWI"))
                return "Kindle Fire";

            if (ua.Contains("RIM Tablet") || (ua.Contains("BB") && ua.Contains("Mobile")))
                return "Black Berry";

            if (ua.Contains("Windows Phone"))
                return string.Format("Windows Phone {0}", GetMobileVersion(ua, "Windows Phone"));

            if (ua.Contains("Mac OS"))
                return "Mac OS";

            if (ua.Contains("Windows NT 5.1") || ua.Contains("Windows NT 5.2"))
                return "Windows XP";

            if (ua.Contains("Windows NT 6.0"))
                return "Windows Vista";

            if (ua.Contains("Windows NT 6.1"))
                return "Windows 7";

            if (ua.Contains("Windows NT 6.2"))
                return "Windows 8";

            if (ua.Contains("Windows NT 6.3"))
                return "Windows 8.1";

            if (ua.Contains("Windows NT 10"))
                return "Windows 10";

            //fallback to basic platform:
            return request.Browser.Platform + (ua.Contains("Mobile") ? " Mobile " : "");
        }



        public static ExtensionTypeEnum getExtension(string filename)
        {
            try
            {
                if (string.IsNullOrEmpty(filename)) return ExtensionTypeEnum.NoImg;
                switch (Path.GetExtension(filename).ToLower())
                {
                    case ".jpg":
                    case ".jpeg":
                    case ".bmp":
                    case ".png":
                    case ".gif":
                        return ExtensionTypeEnum.Img;
                    default:
                        return ExtensionTypeEnum.NoImg;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
    public enum ExtensionTypeEnum
    {
        [Display(Name = "Image")]
        Img,
        [Display(Name = "NoImg")]
        NoImg
    }
}
