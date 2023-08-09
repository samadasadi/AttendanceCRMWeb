using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Utility;

namespace AttendanceCRMWeb.Helpers
{
    public class AdvanceReportSearch : IHtmlString
    {
        private readonly List<AdvanceSearch> _advanceSearcheItem;
        private readonly string _ajaxUrl;
        public AdvanceReportSearch(HtmlHelper helper, List<AdvanceSearch> advanceSearcheItem, string ajaxUrl)
        {
            _advanceSearcheItem = advanceSearcheItem;
            _ajaxUrl = ajaxUrl;
        }

        private HtmlString Run()
        {
            var warperDiv = new TagBuilder("Div");
            warperDiv.MergeAttribute("class", "panel panel-info");
            warperDiv.MergeAttribute("id", "searchArea ");
            var titleDiv = new TagBuilder("Div");
            titleDiv.MergeAttribute("class", "saTitle panel-heading");
            titleDiv.MergeAttribute("id", "saTitle");
            titleDiv.InnerHtml = "<h3 class='panel-title'>جستجوی پیشرفته</h3>";
            warperDiv.InnerHtml = titleDiv.ToString(TagRenderMode.Normal);
            var containerDiv = new TagBuilder("Div");
            containerDiv.MergeAttribute("class", "saContainer panel-body form-inline");
            containerDiv.MergeAttribute("id", "saContainer");

            //    <div class="input-group">
            //    <div class="input-group-addon">
            //        <label for="NationalCode">کد ملی</label>
            //    </div>

            //    <input class="form-control" data-val="true" data-val-regex="!" data-val-regex-pattern="\d{10}" data-val-required="*" id="NationalCode" name="NationalCode" type="text" value="">
            //    <span class="field-validation-valid" data-valmsg-for="NationalCode" data-valmsg-replace="true"></span>
            //</div>
            int counter = 1;
            foreach (var item in _advanceSearcheItem)
            {
                var itemDiv = new TagBuilder("Div");
                itemDiv.MergeAttribute("class", "input-group");
                if (item.ClearRight)
                {
                    itemDiv.MergeAttribute("style", "clear: right;");
                }
                #region lbl
                var itemDivLable = new TagBuilder("Div");
                itemDivLable.MergeAttribute("class", "input-group-addon reportLbl");
                if (!string.IsNullOrEmpty(item.MinWidth))
                {
                    itemDivLable.MergeAttribute("style", "min-width:" + item.MinWidth + "px");
                }

                itemDivLable.InnerHtml = "<label>" + item.Title + "</lable>";
                itemDiv.InnerHtml = itemDivLable.ToString(TagRenderMode.Normal);
                #endregion
                #region Field

                var itemDivField = "";
                //itemDivField.MergeAttribute("class", "saItemEdt");

                switch (item.ItemType)
                {
                    case ItemType.DropDownList:
                        var select = new TagBuilder("Select");
                        select.MergeAttribute("id", item.ClientId);
                        select.MergeAttribute("name", item.ClientId);
                        select.MergeAttribute("class", "form-control chzn-select");
                        select.MergeAttribute("style", "width:240px;");
                        var option = new TagBuilder("option");
                        if (item.SelectListShowAll)
                        {
                            option.MergeAttribute("value", "");
                            option.InnerHtml = "نمایش همه";
                            select.InnerHtml += option.ToString(TagRenderMode.Normal);
                        }
                        foreach (var optionItem in item.SelectList)
                        {
                            option = new TagBuilder("option");
                            option.MergeAttribute("value", optionItem.Value);
                            option.InnerHtml = optionItem.Text;
                            select.InnerHtml += option.ToString(TagRenderMode.Normal);
                        }

                        itemDivField += select.ToString(TagRenderMode.Normal);
                        break;
                    case ItemType.EmptyDropDownList:
                        var selectEmpty = new TagBuilder("Select");
                        selectEmpty.MergeAttribute("id", item.ClientId);
                        selectEmpty.MergeAttribute("name", item.ClientId);
                        selectEmpty.MergeAttribute("class", "chzn-select form-control");
                        selectEmpty.MergeAttribute("style", "width:200px;");
                        var optionEmpty = new TagBuilder("option");
                        if (item.SelectListShowAll)
                        {
                            optionEmpty.MergeAttribute("value", "");
                            optionEmpty.InnerHtml = "نمایش همه";
                            selectEmpty.InnerHtml += optionEmpty.ToString(TagRenderMode.Normal);
                        }

                        itemDivField += selectEmpty.ToString(TagRenderMode.Normal);
                        break;

                    case ItemType.String:
                        var txt = new TagBuilder("input");
                        txt.MergeAttribute("Type", "Text");
                        txt.MergeAttribute("id", item.ClientId);
                        txt.MergeAttribute("name", item.ClientId);
                        txt.MergeAttribute("class", "form-control");
                        itemDivField += txt.ToString(TagRenderMode.Normal);
                        break;
                    case ItemType.Price:
                        var txtPrice = new TagBuilder("input");
                        txtPrice.MergeAttribute("Type", "Text");
                        txtPrice.MergeAttribute("id", item.ClientId + "Str");
                        txtPrice.MergeAttribute("name", item.ClientId + "Str");
                        txtPrice.MergeAttribute("class", "form-control");
                        txtPrice.MergeAttribute("onkeypress", "return isBothNumberKey(event,this)");
                        txtPrice.MergeAttribute("onkeyup", "javascript:moneyCommaSep(this);");
                        txtPrice.MergeAttribute("onblur", "javascript:SetValueToRefName('" + item.ClientId + "Str'" + ",'" + item.ClientId + "');");
                        itemDivField += txtPrice.ToString(TagRenderMode.Normal);
                        var hdnPrice = new TagBuilder("input");
                        hdnPrice.MergeAttribute("Type", "hidden");
                        hdnPrice.MergeAttribute("id", item.ClientId);
                        hdnPrice.MergeAttribute("name", item.ClientId);
                        itemDivField += hdnPrice.ToString(TagRenderMode.Normal);
                        break;
                    case ItemType.Date:
                        var txtCal = new TagBuilder("input");
                        txtCal.MergeAttribute("Type", "Text");
                        txtCal.MergeAttribute("Class", "Date form-control");
                        txtCal.MergeAttribute("Value", DateTimeOperation.M2S(item.DefaultDateValue));
                        txtCal.MergeAttribute("id", item.ClientId);
                        txtCal.MergeAttribute("name", item.ClientId);
                        itemDivField += txtCal.ToString(TagRenderMode.Normal);
                        break;
                    case ItemType.CheckBox:
                        var txtCheckBox = new TagBuilder("input");
                        txtCheckBox.MergeAttribute("Type", "CheckBox");
                        txtCheckBox.MergeAttribute("id", item.ClientId);
                        txtCheckBox.MergeAttribute("name", item.ClientId);
                        itemDivField += txtCheckBox.ToString(TagRenderMode.Normal);
                        break;
                    case ItemType.RedioBtn:
                        var txtradio = new TagBuilder("input");
                        txtradio.MergeAttribute("Type", "Radio");
                        txtradio.MergeAttribute("id", item.ClientId);
                        txtradio.MergeAttribute("name", item.ClientId);
                        txtradio.MergeAttribute("value", item.RedioBtnValue);
                        if (item.Selected)
                        {
                            txtradio.MergeAttribute("checked", "checked");
                        }
                        itemDivField += txtradio.ToString(TagRenderMode.Normal);
                        break;
                }
                itemDiv.InnerHtml += itemDivField;
                #endregion
                containerDiv.InnerHtml += itemDiv.ToString(TagRenderMode.Normal);
                counter++;
            }
            warperDiv.InnerHtml += containerDiv.ToString(TagRenderMode.Normal);
            warperDiv.InnerHtml += GenerateScript();
            return new HtmlString("<form id='frmReport'>" + warperDiv.ToString(TagRenderMode.Normal) + "</form>");
        }
        private string GenerateScript()
        {
            var javaMethod = new StringBuilder();
            javaMethod.AppendLine("  <script type='text/javascript'>");

            javaMethod.AppendLine("function SetValueToRefName(name,refName)  ");
            javaMethod.AppendLine(" { ");
            javaMethod.AppendLine(" $('#'+refName).val(removeComa($('#'+name).val())); ");
            javaMethod.AppendLine("  ");
            javaMethod.AppendLine("  ");
            javaMethod.AppendLine(" } ");


            javaMethod.AppendLine("  $(function () {");
            javaMethod.AppendLine(" SetDataControl('.Date'); ");

            javaMethod.AppendLine("$('#saTitle').click(function() {$('.saContainer').slideToggle();});");
            javaMethod.AppendLine(" });");

            //ShowReport

            javaMethod.AppendLine("  function ShowReport() { ");
            javaMethod.AppendLine("  var data = $('#frmReport').serialize(); ");
            javaMethod.AppendLine("  $.ajax({");
            javaMethod.AppendLine("  url: '" + _ajaxUrl + "' ,");
            javaMethod.AppendLine("  type: 'GET',");
            javaMethod.AppendLine(" scriptCharset: 'utf-16',");
            javaMethod.AppendLine(" data: data,");
            javaMethod.AppendLine(" success: function (result) {");
            javaMethod.AppendLine(" $('#toUpdate').html(result);");
            javaMethod.AppendLine(" },");
            javaMethod.AppendLine(" error: function () {");
            javaMethod.AppendLine(" window.AlertDialog('متاسفانه عملیات با موفقیت انجام نشد.');");
            javaMethod.AppendLine(" $('#toUpdate').html('');");
            javaMethod.AppendLine(" }");
            javaMethod.AppendLine(" });");
            javaMethod.AppendLine(" return false;");
            javaMethod.AppendLine(" }");
            javaMethod.AppendLine("</script>");
            return javaMethod.ToString();
        }


        #region IHtmlString Members
        public string ToHtmlString()
        {
            return Run().ToString();
        }
        #endregion
    }
}