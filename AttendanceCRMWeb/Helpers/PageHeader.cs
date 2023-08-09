using System;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace AttendanceCRMWeb.Helpers
{
    public class PageHeader : IHtmlString
    {
        private HtmlHelper _helper;
        private string Title;
        public bool CrudForm { get; set; }
        public Guid Id { get; set; }

        public PageHeader(HtmlHelper helper, string _title, Guid id, bool crudForm)
        {
            _helper = helper;
            Title = _title;
            CrudForm = crudForm;
            Id = id;
        }
        private MvcHtmlString Run()
        {
            var div = new TagBuilder("div");
            div.MergeAttribute("class", "page-header");
            var h = new TagBuilder("h2");
            if (CrudForm)
            {
                h.InnerHtml = string.Format("{0} {1}", Id == Guid.Empty ? "ثبت" : "ویرایش", Title);
            }
            else
            {
                h.InnerHtml = string.Format("{0} ", Title);
            }
            div.InnerHtml = h.ToString(TagRenderMode.Normal);
            //            <div class="page-header">
            //    <h1>
            //        ثبت شعبه های بانکی
            //    </h1>
            //</div>
            return new MvcHtmlString(div.ToString(TagRenderMode.Normal));
        }


        #region IHtmlString Members
        public string ToHtmlString()
        {
            return Run().ToString();
        }
        #endregion
    }
}