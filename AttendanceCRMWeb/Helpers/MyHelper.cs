using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Utility.EXT;
using AttendanceCRMWeb.Helpers.Enum;
using ButtonType = AttendanceCRMWeb.Helpers.Enum.ButtonType;

namespace AttendanceCRMWeb.Helpers
{
    public class MyHelper<TModel>
    {
        protected readonly HtmlHelper<TModel> m_HtmlHelper;

        public MyHelper(HtmlHelper<TModel> htmlHelper)
        {
            m_HtmlHelper = htmlHelper;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="title">تیتری که در هدر پنل قرار میگیرد</param>
        /// <param name="width">عرض پنل به درصد ، در حالت پیشفرض عرض پنل 100 درصد است.</param>
        /// <returns></returns>
        public Panel Panel(String title, Int32 width = 100, object htmlAttributes = null)
        {
            return new Panel(m_HtmlHelper.ViewContext, title, width, htmlAttributes);
        }

        public FormTitle Formtitle(String title, PortletStyle style)
        {
            return new FormTitle(m_HtmlHelper.ViewContext,title,style, new FormTitleOption { FormTitleIconType=FormTitleIconType.cancel});
        }
        public FormTitle Formtitle(String title, PortletStyle style, FormTitleOption option)
        {
            return new FormTitle(m_HtmlHelper.ViewContext, title, style, option);
        }
        public Button Button(string text, ButtonType buttonType, ButtonStyle buttonStyle, ButtonIconType _buttonIconType, object htmlAttributes)
        {
            return new Button(m_HtmlHelper, text, buttonType, buttonStyle, _buttonIconType, htmlAttributes);
        }
        public CancelFormLink CancelFormLink(string href, object htmlAttributes = null)
        {
            return new CancelFormLink(href);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="title">متن هدر</param>
        /// <param name="id">شناسه فرم</param>
        /// <param name="crudForm"></param>
        /// <returns></returns>
        public PageHeader PageHeader(string title, Guid id, bool crudForm = true)
        {
            return new PageHeader(m_HtmlHelper, title, id, crudForm);
        }

        public MyTextBox TreasuryTextBoxFor<TProperty>(Expression<Func<TModel, TProperty>> valueMember, TextBoxType textBoxType, object htmlAttributes = null)
        {

            string dataValRegexPattern = "";
            string dataValRegex = "";
            string name = "",id="";
            MvcHtmlString textBoxFor = InputExtensions.TextBoxFor<TModel, TProperty>(m_HtmlHelper, valueMember, htmlAttributes);
            //{<input data-val="true" data-val-regex="لطفاً نام دامنه را به درستی و بدون www  و http وارد نمایید." data-val-regex-pattern="^(?!www\.)[A-Za-z0-9_-]+\.+[A-Za-z0-9.\/%&amp;=\?_:;-]+$" data-val-required="وارد کردن نام دامنه اجباریست." id="Domain" name="Domain" type="text" value="" />}
            var txt = textBoxFor.ToString();
            if (txt.Contains("data-val-regex"))
            {
                var col = Regex.Matches(txt, "data-val-regex=\"[^\"]*\"");
                dataValRegex = col[0].ToString().Replace("data-val-regex=\"", "").Replace("\"", "");
            }
            if (txt.Contains("name"))
            {
                var col = Regex.Matches(txt, "name=\"[^\"]*\"");
                name = col[0].ToString().Replace("name=\"", "").Replace("\"", "");
            }
            if (txt.Contains("id"))
            {
                var col = Regex.Matches(txt, "id=\"[^\"]*\"");
                id = col[0].ToString().Replace("id=\"", "").Replace("\"", "");
            }
            if (txt.Contains("data-val-regex-pattern"))
            {
                var col = Regex.Matches(txt, "data-val-regex-pattern=\"[^\"]*\"");
                dataValRegexPattern = col[0].ToString().Replace("data-val-regex-pattern=\"", "").Replace("\"", "");
            }
            var metadata = ModelMetadata.FromLambdaExpression(valueMember, m_HtmlHelper.ViewData);

          //  var metadata = ModelMetadata.FromLambdaExpression(valueMember, m_HtmlHelper.ViewData);
            var val = ((metadata.Model) ?? "").ToString();
            if (val.IsNotNullOrEmpty())
            {
                if (metadata.AdditionalValues.ContainsKey("IgnoreInEdit"))
                {
                    if (m_HtmlHelper.ViewData["IsConfirmed"] != null)
                    {
                        var isConfirm = (bool)m_HtmlHelper.ViewData["IsConfirmed"];
                        if (isConfirm)
                        {
                            htmlAttributes = new { @readonly = "readonly" };
                        }
                    }
                }
            }
            return new MyTextBox(m_HtmlHelper,id, name, val, textBoxType, metadata.IsRequired, dataValRegex,dataValRegexPattern, htmlAttributes);
        }

        public MyTextBox TreasuryTextBox(string name, string val, TextBoxType textBoxType, object htmlAttributes = null)
        {
            return new MyTextBox(m_HtmlHelper, name, val, textBoxType, false, htmlAttributes);
        }

        public AdvanceReportSearch AdvanceReportSearch(List<AdvanceSearch> advanceSearcheItem, string ajaxUrl)
        {
            return new AdvanceReportSearch(m_HtmlHelper, advanceSearcheItem, ajaxUrl);
        }

        public PdfLink PdfLink(string actionName, string controllerName, string fileName, object routeValue)
        {
            return new PdfLink(m_HtmlHelper, actionName, controllerName, fileName, routeValue);
        }

    }
}