using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{
    public static class HelperExtension
    {
        public static MyHelper<TModel> MyHelper<TModel>(this HtmlHelper<TModel> htmlHelper)
        {
            return new MyHelper<TModel>(htmlHelper);
        }
    }
}