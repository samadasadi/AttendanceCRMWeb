using System;
using System.Web;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{
    public class CancelFormLink : IHtmlString
    {
        private string _url;

        public CancelFormLink(string url)
        {
            _url = url;
        }

        private MvcHtmlString Run()
        {
            var a = new TagBuilder("a");
            a.MergeAttribute("class", "btn btn-blue btn-icon");
            a.MergeAttribute("href", _url);
            a.InnerHtml = "بازگشت <i class=\"fa fa-remove\"></i>";
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