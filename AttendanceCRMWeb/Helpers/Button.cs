using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AttendanceCRMWeb.Helpers.Enum;

namespace AttendanceCRMWeb.Helpers
{
    public enum Enum_Style
    {
        blind,
        bounce,
        clip,
        drop,
        explode,
        fold,
        highlight,
        puff,
        pulsate,
        scale,
        shake,
        size,
        slide,
    }
    public enum Enum_IconType
    {
        save,
        cancel
    }
    public class Button : IHtmlString
    {
        private HtmlHelper _helper;
        private string name;
        private string text;

        private object htmlAttributes;
        private ButtonType buttonType;
        private ButtonStyle buttonStyle;
        private ButtonIconType buttonIconType;


        public Button(HtmlHelper helper, string _text, ButtonType _buttonType, ButtonStyle _buttonStyle, ButtonIconType _buttonIconType, object _htmlAttributes)
        {
            _helper = helper;
            text = _text;
            htmlAttributes = _htmlAttributes;
            buttonType = _buttonType;
            buttonStyle = _buttonStyle;
            buttonIconType = _buttonIconType;
        }

        private MvcHtmlString Run()
        {
            var input = new TagBuilder("button");
            switch (buttonType)
            {
                case ButtonType.Button:
                    input.MergeAttribute("type", "Button");
                    break;
                case ButtonType.Submit:
                    input.MergeAttribute("type", "submit");
                    break;
            }
            switch (buttonStyle)
            {
                case ButtonStyle.Primary:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-primary btn-flat"));
                    break;
                case ButtonStyle.Danger:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-danger btn-flat"));
                    break;
                case ButtonStyle.Info:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-info btn-flat"));
                    break;
                case ButtonStyle.Success:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-success btn-flat"));
                    break;
                case ButtonStyle.Warning:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-warning btn-flat"));
                    break;
                case ButtonStyle.Black:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-secondary btn-flat"));
                    break;
                case ButtonStyle.Gold:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-secondary btn-flat"));
                    break;
                case ButtonStyle.Orange:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-secondary btn-flat"));
                    break;
                case ButtonStyle.White:
                    input.MergeAttribute("class",
                        string.Format("btn btn-block bg-gradient-secondary btn-flat"));
                    break;
            }
            input.MergeAttributes(new RouteValueDictionary(htmlAttributes));
            switch (buttonIconType)
            {
                case ButtonIconType.Save:
                    input.InnerHtml = text + " <i class=\"fa fa-save\"></i>";
                    break;
                case ButtonIconType.Print:
                    input.InnerHtml = text + " <i class=\"fa fa-print\"></i>";
                    break;
                case ButtonIconType.Bars:
                    input.InnerHtml = text + " <i class=\"fa fa-bars\"></i>";
                    break;
                case ButtonIconType.Plus:
                    input.InnerHtml = text + " <i class=\"fa fa-plus\"></i>";
                    break;
                  case ButtonIconType.Search:
                    input.InnerHtml = text + " <i class=\"fa fa-search\"></i>";
                    break;
                case ButtonIconType.Cancel:
                    input.InnerHtml = text + " <i class=\"fa fa-close\"></i>";
                    break;
            }
            var result = new StringBuilder();
            result.AppendLine(input.ToString(TagRenderMode.Normal));
            return new MvcHtmlString(result.ToString());
        }

        #region IHtmlString Members
        public string ToHtmlString()
        {
            return Run().ToString();
        }
        #endregion
    }
}