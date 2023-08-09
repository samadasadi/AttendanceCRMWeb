using System;
using System.ComponentModel;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AttendanceCRMWeb.Helpers.Enum;

namespace AttendanceCRMWeb.Helpers
{
    public class FormTitleOption
    {
        public FormTitleOption()
        {
            ShowWidget = true;
        }
        public bool ShowWidget { get; set; }
        public FormTitleIconType FormTitleIconType { get; set; }
    }
    public enum FormTitleIconType
    {
        save,
        cancel
    }
    public sealed class FormTitle : IDisposable
    {
        private readonly PortletStyle _portletStyle;
        private readonly ViewContext _viewContext;
        private readonly FormTitleOption _option;
        private readonly System.IO.TextWriter textWriter;

        #region
        public FormTitle(ViewContext viewContext, string title, PortletStyle portletStyle, FormTitleOption option)
        {
            if (viewContext == null)
                throw new ArgumentNullException("viewContext");
            if (String.IsNullOrWhiteSpace(title))
                throw new ArgumentNullException("title");
            _viewContext = viewContext;
            textWriter = _viewContext.Writer;
            _portletStyle = portletStyle;
            BeginFallDownPanel(title);
            _option = option;
        }

        #endregion

        #region Widget rendering

        /// <summary>
        /// Outputs the opening HTML for the widget
        /// </summary>
        /// <param name="title">Title of the widget</param>
        private void BeginFallDownPanel(String title)
        {
            var html = new System.Text.StringBuilder();


            switch (_portletStyle)
            {
                case PortletStyle.blue:

                    html.Append("<div class=\"portlet box blue\">");
                    break;
                case PortletStyle.green:
                    html.Append("<div class=\"portlet box green\">");
                    break;
                case PortletStyle.purple:
                    html.Append("<div class=\"portlet box purple\">");
                    break;
                case PortletStyle.yellow:
                    html.Append("<div class=\"portlet box yellow\">");
                    break;
                case PortletStyle.light:
                    html.Append("<div class=\"portlet light bordered\">");
                    break;
                case PortletStyle.grey:
                    html.Append("<div class=\"portlet box grey\">");
                    break;
            }

            if (_portletStyle == PortletStyle.light)
            {
                html.AppendFormat("<div class=\"portlet-title\">").AppendLine();
                html.AppendFormat("<div class=\"caption font-green-haze\"><i class=\"icon-settings font-green-haze\"></i><span class=\"caption-subject bold uppercase\">{0}</div>", title).AppendLine();
                //if (_option.ShowWidget)
                //{
                html.AppendFormat("<div class=\"tools\"><a href = \"\" class=\"collapse\" data-original-title=\"\" title=\"\"> </a>").AppendLine();
                //}
                //html.AppendFormat("<a href = \"#portlet-config\" data-toggle=\"modal\" class=\"config\" data-original-title=\"\" title=\"\"> </a>").AppendLine();
                html.AppendFormat("<a href = \"\" data-toggle=\"modal\" class=\"fullscreen\" data-original-title=\"\" title=\"\"> </a>").AppendLine();

                html.AppendFormat("</div></div>").AppendLine();
                html.AppendFormat("<div class=\"portlet-body \">").AppendLine();
                textWriter.WriteLine(html.ToString());
            }
            //box green
            //<div class="portlet box green">
            else
            {
                html.AppendFormat("<div class=\"portlet-title\">").AppendLine();
                html.AppendFormat("<div class=\"caption\">{0}</div>", title).AppendLine();
                html.AppendFormat("<div class=\"tools\"><a href = \"\" class=\"collapse\" data-original-title=\"\" title=\"\"> </a>").AppendLine();
                //html.AppendFormat("<a href = \"#portlet-config\" data-toggle=\"modal\" class=\"config\" data-original-title=\"\" title=\"\"> </a>").AppendLine();
                html.AppendFormat("<a href = \"\" data-toggle=\"modal\" class=\"fullscreen\" data-original-title=\"\" title=\"\"> </a>").AppendLine();

                html.AppendFormat("</div></div>").AppendLine();
                html.AppendFormat("<div class=\"portlet-body \">").AppendLine();
                textWriter.WriteLine(html.ToString());
            }
        }

        /// <summary>
        /// Outputs the closing HTML for the widget
        /// </summary>
        private void EndFallDownPanel()
        {
            this.textWriter.WriteLine("</div></div>");
            //var html = new System.Text.StringBuilder();
            //html.AppendFormat("<div class=\"portlet-body form\">").AppendLine();
            //textWriter.WriteLine(html.ToString());
            //this.textWriter.WriteLine("</div>");

        }

        #endregion

        #region IDisposable

        private Boolean isDisposed;

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Dispose(Boolean disposing)
        {
            if (!isDisposed)
            {
                isDisposed = true;
                EndFallDownPanel();
                textWriter.Flush();
            }
        }

        #endregion




















        //
        //private readonly ViewContext viewContext;
        //private readonly System.IO.TextWriter textWriter;

        //public FormTitle(ViewContext viewContext, String title, PortletStyle _portletStyle)
        //{
        //    portletStyle = _portletStyle;

        //}

        //protected virtual void BeginFallDownPanel(String title, Int32 columnWidth)
        //{

        //var html = new System.Text.StringBuilder();
        //    var div = new TagBuilder("div");
        //    var aditionalStyle = "";
        //    switch (portletStyle)
        //    {
        //        case PortletStyle.blue:
        //            div.MergeAttribute("class",
        //                string.Format("portlet box blue "));
        //            break;
        //        case PortletStyle.green:
        //            div.MergeAttribute("class",
        //                string.Format("portlet box green"));
        //            break;
        //        case PortletStyle.purple:
        //            div.MergeAttribute("class",
        //                string.Format("portlet box purple"));
        //            break;
        //        case PortletStyle.yellow:
        //            div.MergeAttribute("class",
        //                string.Format("portlet box yellow"));
        //            break;

        //    }
        //    html.AppendFormat("<div class=\"portlet-title\">").AppendLine();
        //    html.AppendFormat("<div class=\"caption\">{0}</div></div>", title).AppendLine();
        //    this.textWriter.WriteLine(html.ToString());

        //    //	<div class="portlet-title">
        //    //		<div class="caption">
        //    //			<i class="fa fa-gift"></i> Validation States
        //    //                       </div>
        //    //		<div class="tools">
        //    //			<a href = "" class="collapse" data-original-title="" title="">
        //    //			</a>
        //    //			<a href = "#portlet-config" data-toggle="modal" class="config" data-original-title="" title="">
        //    //			</a>
        //    //			<a href = "" class="reload" data-original-title="" title="">
        //    //			</a>
        //    //			<a href = "" class="remove" data-original-title="" title="">
        //    //			</a>
        //    //		</div>
        //    //	</div>
        //    //	<div class="portlet-body form">
        //    //		<form role = "form" >
        //    //                           < div class="form-body">
        //    //				<div class="form-group has-success">
        //    //					<label class="control-label col-form-label">Input with success</label>
        //    //					<input type = "text" class="form-control" id="inputSuccess">
        //    //				</div>
        //    //				<div class="form-group has-warning">
        //    //					<label class="control-label col-form-label">Input with warning</label>
        //    //					<input type = "text" class="form-control" id="inputWarning">
        //    //				</div>
        //    //				<div class="form-group has-error">
        //    //					<label class="control-label col-form-label">Input with error</label>
        //    //					<input type = "text" class="form-control" id="inputError">
        //    //				</div>
        //    //			</div>
        //    //			<div class="form-actions">
        //    //				<button type = "button" class="btn default">Cancel</button>
        //    //				<button type = "submit" class="btn red">Submit</button>
        //    //			</div>
        //    //		</form>
        //    //	</div>
        //    //</div>








        //    //<div class="panel panel-success">
        //    //  <div class="panel-heading">
        //    //    <h3 class="panel-title">Panel title</h3>
        //    //  </div>
        //    //  <div class="panel-body">
        //    //    Panel content
        //    //  </div>
        //    //</div>
        //    //html.AppendFormat("<div class=\"panel panel-info\" style=\"width:{0}%;{1}\" >", columnWidth, aditionalStyle).AppendLine();
        //    //html.AppendFormat("<div class=\"panel-heading\" ><h3 class=\"panel-title\">{0}</h3></div>", title).AppendLine();
        //    //html.AppendFormat("<div class=\"panel-body\"  style='padding: 10px; 5px' >").AppendLine();

        //    //this.textWriter.WriteLine(html.ToString());
        //}
    }
}