using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{
    public class PdfLink : IHtmlString
    {
        private readonly string _actionName;
        private readonly string _controllerName;
        private readonly string _fileName;
        private readonly object _routeValue;

        public PdfLink(HtmlHelper helper, string actionName, string controllerName,string fileName, object routeValue)
        {
            _actionName = actionName;
            _controllerName = controllerName;
            _fileName = fileName;
            _routeValue = routeValue;
        }

        private MvcHtmlString Run()
        {
            var arr = Guid.NewGuid().ToString().Replace("-", "").Where(c => !char.IsDigit(c));
            var uniqId = string.Join("", arr.Take(arr.Count() > 3 ? 3 : arr.Count()));
            HttpContext.Current.Cache.Insert(uniqId, _routeValue, null, DateTime.Now.AddMinutes(5),
                                             System.Web.Caching.Cache.NoSlidingExpiration);
            var a = new TagBuilder("a");
            a.MergeAttribute("class", "PdfLink fa fa-file-pdf-o MyTooltip Mercury-icon");
            a.MergeAttribute("title", "دریافت گزارش به صورت pdf");
            a.MergeAttribute("href",
                             "/Report/" + _controllerName + "/AsPdf?actionName=" + _actionName + "&fileName=" + _fileName +
                             "&uniqId=" + uniqId);
            a.InnerHtml = " ";
            return new MvcHtmlString(a.ToString(TagRenderMode.Normal));
        }


        #region IHtmlString Members
        public string ToHtmlString()
        {
            return Run().ToString();
        }
        #endregion
    }
}