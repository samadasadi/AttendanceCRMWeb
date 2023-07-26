using System;
using System.Globalization;
using System.Web;

namespace Service.Consts
{
    public class Cookies
    {
        /* get and set language property to current cookie.  */
        public static string Lang
        {
            get
            {
                return (HttpContext.Current.Request.Cookies["Lang"] != null && !string.IsNullOrEmpty(HttpContext.Current.Request.Cookies["Lang"].Value))
                    ? (HttpContext.Current.Request.Cookies["Lang"].Value)
                    : "fa";
            }
        }

        /* set and get current request cookie.  */
        public static int CurrentYear
        {
            get
            {
                return (HttpContext.Current.Request.Cookies["CurrentYear"] != null && !string.IsNullOrEmpty(HttpContext.Current.Request.Cookies["CurrentYear"].Value))
                    ? (int.Parse(HttpContext.Current.Request.Cookies["CurrentYear"].Value))
                    : new PersianCalendar().GetYear(DateTime.Now);
            }
            set { SetCookie("CurrentYear", 2, value.ToString()); }
        }
        public static string SmsSetting
        {
            get
            {
                if (HttpContext.Current.Request.Cookies["smsSetting"] != null)
                {
                    var t = (HttpContext.Current.Request.Cookies["smsSetting"].Value) ?? "";
                    return t == "null" ? "" : t;
                }
                return "";
            }
        }

        /* set or add cookie for current request and response.  */
        private static void SetCookie(string name,int day,string value)
        {
            var c = new HttpCookie("CurrentYear");
            c.Expires = DateTime.Now.AddDays(day); /* set expire date 2 days.  */
            c.Secure = true;
            c.Value = value;
            if (HttpContext.Current.Request.Cookies["CurrentYear"] != null)
            {
                HttpContext.Current.Request.Cookies.Set(c);
                HttpContext.Current.Response.Cookies.Set(c);
            }
            else
            {
                HttpContext.Current.Response.Cookies.Add(c);
                HttpContext.Current.Request.Cookies.Add(c);
            }
     
        }
    }
}