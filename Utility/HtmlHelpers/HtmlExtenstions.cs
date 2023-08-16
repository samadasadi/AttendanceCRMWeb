using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Utility.Utitlies;

namespace Utility.HtmlHelpers
{

    public static class HtmlExtenstions
    {
        #region Attribute        

        #endregion

        #region Ctor
        static HtmlExtenstions()
        {

        }
        #endregion

        #region HTML Extenstions           

        public static IDisposable CreateDivForBootstrap(this HtmlHelper htmlHelper, bool isDivContainer = false, bool isDivRow = true, string divColNumber = "12", Col col = Col.md)
        {
            return new DivForBootstrap(htmlHelper.ViewContext.Writer, isDivContainer, isDivRow, divColNumber, col);
        }

        public static MvcHtmlString TitleAndSiteMap(string title, params string[] olList)
        {
            //OLD CODE
            //            string strOlList = string.Empty;
            //            foreach (string item in olList)
            //                strOlList += $@"<li><a href='#'>{item}</a></li>";
            //            return new MvcHtmlString($@"<section class='content-header'>
            //    <h5>
            //        {title}
            //    </h5>
            //    <ol class='breadcrumb'>
            //        <li><a href='#'><i class='fa fa-dashboard'></i> خانه</a></li>    
            //        {strOlList}
            //    </ol>
            //</section>");




            string strOlList = string.Empty;
            foreach (string item in olList)
                strOlList += $@"<li class='breadcrumb-item active'>{item}</li>";
            return new MvcHtmlString($@"<div class='content-header'>
                                            <div class='container-fluid'>
                                                <div class='row mb-2'>
                                                    <div class='col-sm-6'>
                                                        <h6 class='m-0 text-dark'>{title}</h6>
                                                    </div>
                                                    <div class='col-sm-6'>
                                                        <ol class='breadcrumb float-sm-left'>
                                                            <li class='breadcrumb-item'><a href='#'><i class='nav-icon fa fa-home'></i>خانه</a></li>  
                                                            {strOlList}
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>");
        }

        public static MvcHtmlString Tabs(List<SettingTaps> olList)
        {
            string strTitleList = string.Empty;
            string strDivTabList = string.Empty;
            foreach (SettingTaps item in olList)
            {
                if (item.Show)
                {
                    string strActive = item.Active ? "active" : string.Empty;
                    string strActivecontent = item.Active ? " show active" : string.Empty;
                    strTitleList += $@"<li class='nav-item'><a href='#{item.Id}' class='nav-link {strActive}' data-toggle='pill'>{getIcon(item.Icon)}{item.Title}</a></li>";
                    strDivTabList += $@"<div class='tab-pane fade {strActivecontent}' role='tabpanel' id='{item.Id}'>{item.Html}</div>";
                }
            }
            return new MvcHtmlString($@"<div class='card card-secondary card-tabs'>
        <div class='card-header p-0 pt-1'>
        <ul class='nav nav-tabs' role='tablist'>
            {strTitleList}      
        </ul>
        </div>
        <div class='card-body'>
        <div class='tab-content'>
            {strDivTabList}
        </div>        
        </div>        
    </div>");
        }

        public static MvcForm BsAntiForgeryToken(this HtmlHelper html)
        {
            html.ViewContext.Writer.Write(html.AntiForgeryToken().ToHtmlString());
            return null;
        }

        public static MvcHtmlString BsCheckBoxFor<TModel>(this HtmlHelper<TModel> html, Expression<Func<TModel, bool>> expression, bool disabled = false, byte colLbl = 2, byte colDiv = 10)
        {
            System.Web.Mvc.ModelMetadata oModelMetadata =
              System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, html.ViewData);

            object checkBoxAttributes = new
            {
                //@class = "form-control",
                //style = "width:20px"
            };

            if (disabled)
                checkBoxAttributes = new
                {
                    //@class = "form-control",
                    //style = "width:20px",
                    disabled = "disabled"
                };

            return new MvcHtmlString($@"<div class='form-group'>
                        {
                    html.LabelFor(expression, oModelMetadata.DisplayName, new { @class = "col-lg-" + colLbl + " control-label" })
                        .ToHtmlString()
                }
                        <div class='col-lg-{colDiv}'>
                           {html.CheckBoxFor(expression, checkBoxAttributes).ToHtmlString()}
                        </div>
                    </div>");
        }

        public static MvcHtmlString BsImage<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, string title = "پیش نمایش", string width = "100", string height = "75", IDictionary<string, object> htmlAttributes = null, bool readOnly = false)
        {

            System.Web.Mvc.ModelMetadata oModelMetadata =
               System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, html.ViewData);
            if (htmlAttributes == null)
            {
                htmlAttributes =
                    new System.Collections.Generic.Dictionary<string, object>();
            }
            if (oModelMetadata == null)
            {
                if (readOnly)
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            else
            {
                if (htmlAttributes.ContainsKey("placeholder") == false)
                {
                    string strHtmlFieldName =
                        System.Web.Mvc.ExpressionHelper.GetExpressionText(expression);

                    string strLabelText = oModelMetadata.DisplayName ?? oModelMetadata.PropertyName ?? strHtmlFieldName.Split('.').ToString();

                    if (string.IsNullOrEmpty(strLabelText) == false)
                    {
                        htmlAttributes.Add("placeholder", strLabelText);
                    }
                }

                if ((readOnly) || (oModelMetadata.IsReadOnly))
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            htmlAttributes.Add("class", "form-control");

            MemberExpression oMemberExpression =
                expression.Body as MemberExpression;

            if (oMemberExpression != null)
            {
                System.ComponentModel.DataAnnotations.StringLengthAttribute oStringLengthAttribute =
                    oMemberExpression.Member.GetCustomAttributes
                    (typeof(System.ComponentModel.DataAnnotations.StringLengthAttribute), false)
                    .FirstOrDefault() as System.ComponentModel.DataAnnotations.StringLengthAttribute;

                if (oStringLengthAttribute != null)
                {
                    if (htmlAttributes.ContainsKey("maxlength") == false)
                    {
                        htmlAttributes.Add("maxlength", oStringLengthAttribute.MaximumLength);
                    }
                }
            }
            string src = string.Empty;
            if (oModelMetadata.Model != null)
            {
                src = oModelMetadata.Model.ToString();
            }
            else
            {
                src = @"\Content\Image\No photos.png";
            }
            return new MvcHtmlString($@"<div class='form-group'>
{
                html.LabelFor(expression, oModelMetadata.DisplayName, new { @class = "col-lg-2 control-label" })
                }
<div class='col-lg-10'>
  <a href='{src}' title='{title}' target='_blank'>
<img src='{src}' alt='{oModelMetadata.DisplayName}' width='{width}' height=""{height}"" />
</a>
</div></div>");

        }

        public static MvcHtmlString BsPasswordFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, IDictionary<string, object> htmlAttributes = null, bool readOnly = false)
        {

            System.Web.Mvc.ModelMetadata oModelMetadata =
               System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, html.ViewData);
            if (htmlAttributes == null)
            {
                htmlAttributes =
                    new System.Collections.Generic.Dictionary<string, object>();
            }
            if (oModelMetadata == null)
            {
                if (readOnly)
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            else
            {
                if (htmlAttributes.ContainsKey("placeholder") == false)
                {
                    string strHtmlFieldName =
                        System.Web.Mvc.ExpressionHelper.GetExpressionText(expression);

                    string strLabelText = oModelMetadata.DisplayName ?? oModelMetadata.PropertyName ?? strHtmlFieldName.Split('.').ToString();

                    if (string.IsNullOrEmpty(strLabelText) == false)
                    {
                        htmlAttributes.Add("placeholder", strLabelText);
                    }
                }

                if ((readOnly) || (oModelMetadata.IsReadOnly))
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            htmlAttributes.Add("class", "form-control");

            MemberExpression oMemberExpression =
                expression.Body as MemberExpression;

            if (oMemberExpression != null)
            {
                System.ComponentModel.DataAnnotations.StringLengthAttribute oStringLengthAttribute =
                    oMemberExpression.Member.GetCustomAttributes
                    (typeof(System.ComponentModel.DataAnnotations.StringLengthAttribute), false)
                    .FirstOrDefault() as System.ComponentModel.DataAnnotations.StringLengthAttribute;

                if (oStringLengthAttribute != null)
                {
                    if (htmlAttributes.ContainsKey("maxlength") == false)
                    {
                        htmlAttributes.Add("maxlength", oStringLengthAttribute.MaximumLength);
                    }
                }
            }
            return new MvcHtmlString($@"<div class='form-group'>
{
                html.LabelFor(expression, oModelMetadata.DisplayName, new { @class = "col-lg-2 control-label" })
                }
<div class='col-lg-10'>
{
                html.PasswordFor(expression, htmlAttributes)
                }
</div></div>");

        }

        public static MvcHtmlString BsButton(this HtmlHelper html, string title, Icons? icon = null, typeButton typeButton = typeButton.button, string id = "Save", sizeButton size = sizeButton.em, ColorButton colorButton = ColorButton.Default, byte colDivOffset = 2, byte colDivMain = 10)
        {
            string strColDivOffset = colDivOffset != 0 ? $@"col-lg-offset-{colDivOffset}" : string.Empty;
            string strColDivMain = colDivMain != 0 ? $@"col-lg-{colDivMain}" : string.Empty;
            string strSizeButton = (size == sizeButton.em) ? string.Empty : ("btn-" + size.ToString());
            return new MvcHtmlString($@"<div class='form-group'>
                        <div class='{strColDivOffset} {strColDivMain}'>
                            <button class='btn btn-{colorButton.ToString().ToLower()} {strSizeButton}' id='btn{id}' type='{typeButton.ToString()}'>{getIcon(icon)}{title}</button>
                        </div>
                    </div>");
        }

        public static MvcHtmlString BsBox(string title, string value, ColorBox colorBox, Icons? icon = null, string titleFooter = "")
        {
            string strIcon = icon != null ? $@"fa fa-{icon.ToString()}" : string.Empty;
            string strFooter = !string.IsNullOrEmpty(titleFooter) ? $@"<a href='#' class='small-box-footer'>{titleFooter}<i class='fa fa-arrow-circle-left'></i></a>" : string.Empty;
            return new MvcHtmlString($@"<div class='small-box bg-{colorBox.ToString()}'>
                <div class='inner'>
                    <h3>{value}</h3>
                    <p>{title}</p>
                </div>
                <div class='icon'>
                    <i class='{strIcon}'></i>
                </div>       
            </div>");
            //{strFooter}
        }

        public static MvcHtmlString DtxTextBoxFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, IDictionary<string, object> htmlAttributes = null, bool readOnly = false)
        {
            if (htmlAttributes == null)
            {
                htmlAttributes =
                    new System.Collections.Generic.Dictionary<string, object>();
            }

            System.Web.Mvc.ModelMetadata oModelMetadata =
                System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, html.ViewData);

            if (oModelMetadata == null)
            {
                if (readOnly)
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            else
            {
                if (htmlAttributes.ContainsKey("placeholder") == false)
                {
                    string strHtmlFieldName =
                        System.Web.Mvc.ExpressionHelper.GetExpressionText(expression);

                    string strLabelText =
                        oModelMetadata.DisplayName ??
                        oModelMetadata.PropertyName ??
                        strHtmlFieldName.Split('.').Last();

                    if (string.IsNullOrEmpty(strLabelText) == false)
                    {
                        htmlAttributes.Add("placeholder", strLabelText);
                    }
                }

                if ((readOnly) || (oModelMetadata.IsReadOnly))
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }

            htmlAttributes.Add("class", "form-control");

            System.Linq.Expressions.MemberExpression oMemberExpression =
                expression.Body as System.Linq.Expressions.MemberExpression;

            if (oMemberExpression != null)
            {
                System.ComponentModel.DataAnnotations.StringLengthAttribute oStringLengthAttribute =
                    oMemberExpression.Member.GetCustomAttributes
                    (typeof(System.ComponentModel.DataAnnotations.StringLengthAttribute), false)
                    .FirstOrDefault() as System.ComponentModel.DataAnnotations.StringLengthAttribute;

                if (oStringLengthAttribute != null)
                {
                    if (htmlAttributes.ContainsKey("maxlength") == false)
                    {
                        htmlAttributes.Add("maxlength", oStringLengthAttribute.MaximumLength);
                    }
                }
            }

            return (html.TextBoxFor(expression, htmlAttributes));
        }

        public static MvcHtmlString BsTextBoxFor<TModel, TValue>(this HtmlHelper<TModel> html, Expression<Func<TModel, TValue>> expression, IDictionary<string, object> htmlAttributes = null, bool readOnly = false)
        {

            System.Web.Mvc.ModelMetadata oModelMetadata =
               System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, html.ViewData);
            if (htmlAttributes == null)
            {
                htmlAttributes =
                    new System.Collections.Generic.Dictionary<string, object>();
            }
            if (oModelMetadata == null)
            {
                if (readOnly)
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            else
            {
                if (htmlAttributes.ContainsKey("placeholder") == false)
                {
                    string strHtmlFieldName =
                        System.Web.Mvc.ExpressionHelper.GetExpressionText(expression);

                    string strLabelText = oModelMetadata.DisplayName ?? oModelMetadata.PropertyName ?? strHtmlFieldName.Split('.').ToString();

                    if (string.IsNullOrEmpty(strLabelText) == false)
                    {
                        htmlAttributes.Add("placeholder", strLabelText);
                    }
                }

                if ((readOnly) || (oModelMetadata.IsReadOnly))
                {
                    if (htmlAttributes.ContainsKey("readonly") == false)
                    {
                        htmlAttributes.Add("readonly", "read-only");
                    }
                }
            }
            htmlAttributes.Add("class", "form-control");

            MemberExpression oMemberExpression =
                expression.Body as MemberExpression;

            if (oMemberExpression != null)
            {
                System.ComponentModel.DataAnnotations.StringLengthAttribute oStringLengthAttribute =
                    oMemberExpression.Member.GetCustomAttributes
                    (typeof(System.ComponentModel.DataAnnotations.StringLengthAttribute), false)
                    .FirstOrDefault() as System.ComponentModel.DataAnnotations.StringLengthAttribute;

                if (oStringLengthAttribute != null)
                {
                    if (htmlAttributes.ContainsKey("maxlength") == false)
                    {
                        htmlAttributes.Add("maxlength", oStringLengthAttribute.MaximumLength);
                    }
                }
            }
            return new MvcHtmlString($@"<div class='form-group'>
{
                html.LabelFor(expression, oModelMetadata.DisplayName, new { @class = "col-lg-2 control-label" })
                }
<div class='col-lg-10'>
{
                html.TextBoxFor(expression, htmlAttributes)

                }
{ html.ValidationMessageFor(expression, "", new { @class = "text-danger" })}
</div></div>");

        }

        public static IDisposable BsPanel(this HtmlHelper htmlHelper, string title = null, bool withNoPadding = false, string marginTop = "0", ColorPanel colorPanel = ColorPanel.Default)
        {
            return new PanelContainer(htmlHelper.ViewContext.Writer, title ?? htmlHelper.ViewBag.title, colorPanel, null,
                withNoPadding, marginTop);
        }

        public static IDisposable BsPanelWithCloseAndMinimize(this HtmlHelper htmlHelper, string title = null, bool withNoPadding = false, string marginTop = "0", ColorPanel colorPanel = ColorPanel.Default, bool isClose = false, bool isMinus = true, bool isOpenBody = true)
        {
            return new PanelContainer(htmlHelper.ViewContext.Writer, title ?? htmlHelper.ViewBag.title, colorPanel, null,
                withNoPadding, marginTop, isClose, isMinus, isOpenBody);
        }

        public static IDisposable BsPanelWithMinimize(this HtmlHelper htmlHelper, string title = null, bool withNoPadding = false, string marginTop = "0", ColorPanel colorPanel = ColorPanel.Default, bool isClose = true, bool isMinus = true, bool isOpenBody = true)
        {
            return new PanelContainer(htmlHelper.ViewContext.Writer, title ?? htmlHelper.ViewBag.title, colorPanel, null,
                withNoPadding, marginTop, false, isMinus, isOpenBody);
        }

        public static MvcHtmlString SelectAndText(this HtmlHelper helper, string idCbo, string placeHolderTextSearch, string idTxt, string btnTitle, string btnUrl, bool btnShowHide, bool btnOnClickHref, bool isDeleteAll = false, bool isShowTextBoxSearch = true, params string[] lstPageing)
        {
            string strOption = lstPageing != null ? fillOptionForCombo(lstPageing) : fillOptionForCombo("10", "15", "20", "50", "100");
            ///Admin/UserManagement/Create

            string _url = btnOnClickHref == false ? $@"href = '{btnUrl}'" : $@"onclick='{btnUrl}'";
            string _buttonAdd = btnShowHide == true ? $@" <a {_url} title='{btnTitle}' type='button' class='btn btn-success'><i class='fa fa-plus'></i>&nbsp;&nbsp;{btnTitle}</a>" : string.Empty;
            string _buttonDeleteAll = isDeleteAll == true ? $@"<a title = 'حذف' onclick='deleteRows_{idTxt}();' class='btn btn-danger'><i class='fa fa-trash'></i>&nbsp;&nbsp;حذف</a>" : string.Empty;

            string _textBoxSearch = isShowTextBoxSearch ? $@"<input class='form-control' type='search' placeholder='{placeHolderTextSearch}' title='{placeHolderTextSearch}' id='{idTxt}'/>" : string.Empty;
            string _comboBoxSelectCount = !string.IsNullOrEmpty(idCbo) ? $@"<select class='form-control' id='{idCbo}' name='{idCbo}'>{strOption}</select>" : string.Empty;
            string _btnSearch = (!string.IsNullOrEmpty(_textBoxSearch) && !string.IsNullOrEmpty(_comboBoxSelectCount)) ? $@"<button type='button' onclick='search_{idTxt}();' title = 'جستجو' class='btn btn-info'><i class='fa fa-search'></i>&nbsp;&nbsp;جستجو </button>" : string.Empty;
            return new MvcHtmlString($@"<div class='row' style='margin-bottom: 5px;'>
                      <div class='col-md-2'>
                        {_buttonAdd}
                        {_buttonDeleteAll}
                        </div>                       
                                            <div class='col-md-6'>
                                                {_textBoxSearch}
                                            </div> 
                                            <div class='col-md-2'> 
                                                {_comboBoxSelectCount}
                                            </div>
                                            <div class='col-md-2'> 
                                                {_btnSearch}
                                            </div>
                                         </div>"
                                         );
        }

        #endregion

        #region Public Method

        #endregion

        #region Private Method
        private static string getIcon(Nullable<Icons> icon)
        {
            return icon.HasValue ? $@"<i class='fa fa-{icon.ToString()}'></i>&nbsp;" : string.Empty;
        }

        private static string fillOptionForCombo(params string[] lstPageing)
        {
            string strOption = string.Empty;
            foreach (string item in lstPageing)
                strOption += $@"<option value='{item}'>{item}</option>  ";
            return strOption;
        }

        #endregion




        public static MvcHtmlString BsUploadFor<TModel, TValue>(this HtmlHelper<TModel> helper, Expression<Func<TModel, TValue>> expression, object htmlAttributes = null, string path = "", byte colLabel = 3, byte colDiv = 9, bool isAllUpload = false)
        {
            string strPath = File.Exists(HttpContext.Current.Server.MapPath(path)) && Utitlies.Utility.getExtension(path) == ExtensionTypeEnum.Img ? path : "No-Image.gif";
            //string strFunctionName = isAllUpload ? "ShowImageBeforeAllUpload(this,'" + helper.ViewData.TemplateInfo.GetFullHtmlFieldName(ExpressionHelper.GetExpressionText(expression)) + "','" + strPath + "')" : "ShowImageBeforeUpload(this,'" + helper.ViewData.TemplateInfo.GetFullHtmlFieldName(ExpressionHelper.GetExpressionText(expression)) + "','" + strPath + "')";
            System.Web.Mvc.ModelMetadata oModelMetadata =
               System.Web.Mvc.ModelMetadata.FromLambdaExpression(expression, helper.ViewData);
            var data = ModelMetadata.FromLambdaExpression(expression, helper.ViewData);
            TagBuilder input = new TagBuilder("input");
            input.Attributes.Add("type", "file");
            input.Attributes.Add("id", helper.ViewData.TemplateInfo.GetFullHtmlFieldId(ExpressionHelper.GetExpressionText(expression)));
            input.Attributes.Add("name", helper.ViewData.TemplateInfo.GetFullHtmlFieldName(ExpressionHelper.GetExpressionText(expression)));
            //input.Attributes.Add("onchange", strFunctionName);

            if (htmlAttributes != null)
            {
                var attributes = HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
                input.MergeAttributes(attributes);
            }
            oModelMetadata.DisplayName = "انتخاب";
            return new MvcHtmlString($@"<div class='form-group'>
{
                helper.LabelFor(expression, oModelMetadata.DisplayName, new { @class = $@"col-lg-{colLabel} text-left" })
                }
<div class='col-lg-{colDiv}'>
{
                input.ToString() +
               //$@"<img src='{strPath}' width='200' class='img-thumbnail' id='img" + helper.ViewData.TemplateInfo.GetFullHtmlFieldName(ExpressionHelper.GetExpressionText(expression)) + "' /> "
               $@""
                }
</div></div>");
        }




    }

    #region Public Enums
    public enum Icons
    {
        apple,
        save,
        user,
        minus,
        times,
        plus
    }

    public enum Col
    {
        md,
        lg,
        sm
    }

    #endregion

    #region Tabs
    public class SettingTaps
    {
        public object Html { get; set; }
        public string Title { get; set; }
        public bool Active { get; set; }
        public string Id { get; set; }
        public Nullable<Icons> Icon { get; set; }
        public bool Show { get; set; }
    }
    #endregion 

    #region Panel
    class PanelContainer : IDisposable
    {
        private readonly TextWriter _writer;
        private readonly MvcForm _form;

        private bool IsPanelWithotCloseAndMinimize = true;

        public PanelContainer(TextWriter writer, string title, ColorPanel colorPanel = ColorPanel.Default, Func<MvcForm> formFunc = null,
            bool withNoPadding = false, string marginTop = "0")
        {
            //OLD CODE
            //_writer = writer;
            //_writer.Write($@"<div class='row' style='margin-top: {marginTop}px;'>
            //<div class='col-lg-12'>
            //<section class='panel panel-{colorPanel.ToString().ToLower()}'>
            //<div class='panel-body {(withNoPadding ? "noPadding" : "")} '>");

            //if (formFunc != null)
            //    _form = formFunc();



            //NEW CODE
            _writer = writer;
            _writer.Write($@"<div class='card' style='margin-top: {marginTop}px;'>
            <div class='card-body {(withNoPadding ? "noPadding" : "")} '>");

            if (formFunc != null)
                _form = formFunc();




            //_writer = writer;
            //_writer.Write($@"<div class='row' style='margin-top: {marginTop}px;'>
            //<div class='col-lg-12'>
            //<section class='panel panel-{colorPanel.ToString().ToLower()}'>
            //<header class='panel-heading'>{title}</header>
            //<div class='panel-body {(withNoPadding ? "noPadding" : "")} '>");

            //if (formFunc != null)
            //    _form = formFunc();
        }

        public PanelContainer(TextWriter writer, string title, ColorPanel colorPanel = ColorPanel.Default, Func<MvcForm> formFunc = null,
            bool withNoPadding = false, string marginTop = "0", bool isClose = true, bool isMinus = true, bool isOpenBody = true)
        {


            ////OLD CODE
            //string strIsShowBodyPanel = !isOpenBody ? "style='display:none;'" : string.Empty;
            //string strstrIsShowBodyPanelMain = !isOpenBody ? "collapsed-box" : string.Empty;
            //IsPanelWithotCloseAndMinimize = false;
            //_writer = writer;
            //_writer.Write(
            //    $@"<div class='box box-{colorPanel.ToString().ToLower()} {strstrIsShowBodyPanelMain}' style='margin-top: {marginTop}px;'>
            //            <div class='box-header with-border' data-widget='collapse'>
            //                <h6 class='box-title'>{title}</h1>
            //                <div class='box-tools pull-right'>
            //                    {getButtonWithCloseAndMinimize("", !isOpenBody ? Icons.plus : Icons.minus, isMinus)}
            //                    {getButtonWithCloseAndMinimize("remove", Icons.remove, isClose)}
            //                </div>
            //            </div>
            //            <div class='box-body' {strIsShowBodyPanel}>");


            string strIsShowBodyPanel = !isOpenBody ? "style='display:none;'" : string.Empty;
            string strstrIsShowBodyPanelMain = !isOpenBody ? "collapsed-card" : string.Empty;
            IsPanelWithotCloseAndMinimize = false;
            _writer = writer;
            _writer.Write(
                $@"<div class='card card-{colorPanel.ToString().ToLower()} card-outline {strstrIsShowBodyPanelMain}' style='margin-top: {marginTop}px;'>
                        <div class='card-header' data-card-widget='collapse'>
                            <h6 class='card-title' style='font-size: 14px;'>{title}</h1>
                            <div class='card-tools'>
                                {getButtonWithCloseAndMinimize("collapse", !isOpenBody ? Icons.plus : Icons.minus, isMinus)}
                                {getButtonWithCloseAndMinimize("remove", Icons.times, isClose)}
                            </div>
                        </div>
                        <div class='card-body' {strIsShowBodyPanel}>");

            if (formFunc != null)
                _form = formFunc();
        }

        public void Dispose()
        {
            _form?.Dispose();
            if (IsPanelWithotCloseAndMinimize)
                _writer.Write("</div></section></div></div>");
            else
                _writer.Write("</div></div>");
        }

        private static string getButtonWithCloseAndMinimize(string dataWidget, Icons icon, bool isShow)
        {
            return isShow ? $@"<button type='button' class='btn btn-tool' data-card-widget='{dataWidget}'><i class='fa fa-{icon.ToString()}'></i></button>" : string.Empty;
        }

    }

    public enum ColorPanel
    {
        Default,
        Info,
        Success,
        Warning,
        Danger,
        Primary,
        purple
    }
    #endregion

    #region Button
    public enum ColorButton
    {
        Danger,
        Info,
        Success,
        Warning,
        Link,
        Default,
        Primary
    }

    public enum sizeButton
    {
        [Display(Name = "Small")]
        sm,
        [Display(Name = "Large")]
        lg,
        [Display(Name = "Empty")]
        em
    }

    public enum typeButton
    {
        button,
        reset,
        submit
    }
    #endregion

    #region Box
    public enum ColorBox
    {
        green,
        yellow,
        aqua,
        red
    }
    #endregion

    #region Public Classes
    class DivForBootstrap : IDisposable
    {
        private readonly TextWriter _writer;
        string strDivContainer = string.Empty;
        string strDivRow = string.Empty;

        public DivForBootstrap(TextWriter writer, bool isDivContainer = false, bool isDivRow = true, string divColNumber = "12", Col col = Col.md)
        {
            _writer = writer;

            strDivContainer = isDivContainer ? "<div class='container'>" : string.Empty;
            strDivRow = isDivRow ? "<div class='col-md-12'>" : string.Empty;

            _writer.Write($@"{strDivContainer}
                           {strDivRow}
        <div class='col-{col.ToString()}-{divColNumber}'>

        ");
        }
        public void Dispose()
        {
            string strEndDivRow = !string.IsNullOrEmpty(strDivRow) ? "</div>" : string.Empty;
            string strEndDivContainer = !string.IsNullOrEmpty(strDivContainer) ? "</div>" : string.Empty;
            _writer.Write($@"</div>{strEndDivRow}{strEndDivContainer}");
            strDivRow = null;
            strDivContainer = null;
        }
    }
    #endregion

}
