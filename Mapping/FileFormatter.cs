using System;
using System.Globalization;
using System.Web;
using AutoMapper;

namespace Mapping
{
    //vahid panahid commented thid block
    /*public class FileFormatter : ValueResolver<HttpPostedFileBase, Guid>
    {
        private object p;

        protected override Guid ResolveCore(HttpPostedFileBase source)
        {
            throw new NotImplementedException();
        }
    }*/

    //public class ToPersianDate : ValueResolver<DateTime, string>
    //{
    //    protected override string ResolveCore(DateTime source)
    //    {
    //        var jc = new PersianCalendar();
    //        if (source.ToString(CultureInfo.InvariantCulture) == "12:00:00 AM")
    //        {
    //            return "1300/01/01";
    //        }
    //        try
    //        {
    //            var farsiYear = Convert.ToString(jc.GetYear(source));
    //            var farsiMonth = Convert.ToString(jc.GetMonth(source));
    //            var farsiDay = Convert.ToString(jc.GetDayOfMonth(source));
    //            farsiDay = farsiDay.PadLeft(2, '0');
    //            farsiMonth = farsiMonth.PadLeft(2, '0');
    //            var returnValue = farsiYear + "/" + farsiMonth + "/" + farsiDay;
    //            return returnValue;
    //        }
    //        catch
    //        {
    //            return "1300/01/01";
    //        }
    //    }
    //}

}