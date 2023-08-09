using System;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{

    /// <summary>
    /// Widget container
    /// </summary>
    /// <remarks>
    /// We make it IDIsposable so we can use it like Html.BeginForm and when the @using(){} block has ended,
    /// the end of the widget's content is output.
    /// </remarks>
    public class Panel : IDisposable
    {
        #region CTor

        // store some references for ease of use
        private readonly ViewContext viewContext;
        private readonly System.IO.TextWriter textWriter;
        private object htmlAttributes;

        /// <summary>
        /// Initialize the box by passing it the view context (so we can
        /// reference the stream writer) Then call the BeginWidget method
        /// to begin the output of the widget
        /// </summary>
        /// <param name="viewContext">Reference to the viewcontext</param>
        /// <param name="title">Title of the widget</param>
        /// <param name="columnWidth">Width of the widget (column layout)</param>
        public Panel(ViewContext viewContext, String title, Int32 columnWidth = 100, object htmlAttributes = null)
        {
            if (viewContext == null)
                throw new ArgumentNullException("viewContext");
            if (String.IsNullOrWhiteSpace(title))
                throw new ArgumentNullException("title");

            this.viewContext = viewContext;
            this.textWriter = this.viewContext.Writer;



            this.htmlAttributes = htmlAttributes;
            this.BeginFallDownPanel(title, columnWidth);

        }

        #endregion

        #region Widget rendering

        /// <summary>
        /// Outputs the opening HTML for the widget
        /// </summary>
        /// <param name="title">Title of the widget</param>
        /// <param name="columnWidth">Widget width (columns layout)</param>
        protected virtual void BeginFallDownPanel(String title, Int32 columnWidth)
        {
            title = HttpUtility.HtmlDecode(title);

            var html = new System.Text.StringBuilder();
            //html.AppendFormat(FallDownScript());
            var aditionalStyle = "";
            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(htmlAttributes))
            {
                if (property.Name.ToLower() == "style")
                {
                    aditionalStyle += property.GetValue(htmlAttributes);
                }
            }
            //<div class="panel panel-success">
            //  <div class="panel-heading">
            //    <h3 class="panel-title">Panel title</h3>
            //  </div>
            //  <div class="panel-body">
            //    Panel content
            //  </div>
            //</div>
            html.AppendFormat("<div class=\"panel panel-info\" style=\"width:{0}%;{1}\" >", columnWidth, aditionalStyle).AppendLine();
            html.AppendFormat("<div class=\"panel-heading\" ><h3 class=\"panel-title\">{0}</h3></div>", title).AppendLine();
            html.AppendFormat("<div class=\"panel-body\"  style='padding: 10px; 5px' >").AppendLine();

            this.textWriter.WriteLine(html.ToString());
        }

        /// <summary>
        /// Outputs the closing HTML for the widget
        /// </summary>
        protected virtual void EndFallDownPanel()
        {
            this.textWriter.WriteLine("</div></div>");

        }

        #endregion

        #region IDisposable

        private Boolean isDisposed;

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(Boolean disposing)
        {
            if (!this.isDisposed)
            {
                this.isDisposed = true;
                this.EndFallDownPanel();
                this.textWriter.Flush();
            }
        }

        #endregion

    }
}