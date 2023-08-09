using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
using Utility;
using Utility.EXT;

namespace AttendanceCRMWeb.Helpers
{
    public enum TextBoxType
    {
        Text,
        Number,
        Currency,
        Date,
        NullableDate,
        /// <summary>
        /// just show month and day
        /// </summary>
        ShortDate,
        MultiText,
        DateWithTime,
    }

    public class MyTextBox : IHtmlString
    {
        public HtmlHelper _helper;
        public TextBoxType _textBoxType;
        public string _componentName;
        public string _componentId;
        public bool _required;
        public string _value;
        public object _htmlAttributes;
        public readonly string _dataValRegex;
        public readonly string _dataValRegexPattern;

        public MyTextBox(HtmlHelper helper, string name, string value, TextBoxType type, bool required, object htmlAttributes = null)
        {
            _textBoxType = type;
            _componentName = name;
            _componentId = name;
            _htmlAttributes = htmlAttributes;
            _required = required;
            _helper = helper;
            _value = value;
        }
        public MyTextBox(HtmlHelper helper, string id, string name, string value, TextBoxType type, bool required, string dataValRegex, string dataValRegexPattern, object htmlAttributes = null)
        {
            _textBoxType = type;
            _componentName = name;
            _componentId = id;
            _htmlAttributes = htmlAttributes;
            _required = required;
            _helper = helper;
            _value = value;
            _dataValRegex = dataValRegex;
            _dataValRegexPattern = dataValRegexPattern;
        }
        private MvcHtmlString Run()
        {
            var res = "";
            var input = new TagBuilder("input");
            input.MergeAttribute("id", _componentId);
            input.MergeAttribute("name", _componentName);


            input.MergeAttributes(new RouteValueDictionary(_htmlAttributes));
            switch (_textBoxType)
            {
                case TextBoxType.Currency:
                    input.MergeAttribute("type", "hidden");
                    var currencyInput = new TagBuilder("input");
                    currencyInput.MergeAttribute("class", "form-control");
                    currencyInput.MergeAttribute("id", _componentId + "Str");
                    currencyInput.MergeAttribute("name", _componentName + "Str");
                    currencyInput.MergeAttribute("onkeyup", "javascript:moneyCommaSep(this);");
                    currencyInput.MergeAttribute("autocomplete", "off");
                    currencyInput.MergeAttribute("onkeypress", "return isPlusNumberKey(event,this)");
                    currencyInput.MergeAttributes(new RouteValueDictionary(_htmlAttributes));
                    if (_value.IsNotNullOrEmpty())
                    {
                        input.MergeAttribute("value", _value.ToString());
                        currencyInput.MergeAttribute("value", decimal.Parse(_value).ToString("#,##0"));
                    }
                    currencyInput.MergeAttribute("onblur", "javascript:SetValueToRefName('" + _componentId + "Str'" + ",'" + _componentId + "');");
                    if (_required)
                    {
                        currencyInput.MergeAttribute("data-val", "true");
                        currencyInput.MergeAttribute("data-val-required", "*");
                    }
                    res += currencyInput.ToString(TagRenderMode.Normal) + input.ToString(TagRenderMode.Normal);
                    break;


                


                case TextBoxType.Date:
                    //data-mddatetimepicker="true" data-trigger="click" data-targetselector="#exampleInput3" data-enabletimepicker="true"
                    input.MergeAttribute("type", "hidden");
                    var dateInput = new TagBuilder("input");
                    dateInput.MergeAttribute("class", "form-control mdDate ");
                    dateInput.MergeAttribute("data-mddatetimepicker", "true");
                    dateInput.MergeAttribute("data-trigger", "click");
                    //dateInput.MergeAttribute("data-enabletimepicker", "true");
                    dateInput.MergeAttribute("data-targetselector", "#" + _componentId + "Str");
                    dateInput.MergeAttribute("id", _componentId + "Str");
                    dateInput.MergeAttribute("name", _componentName + "Str");
                    if (_value.IsNotNullOrEmpty())
                    {
                        if (_value != "1/1/0001 12:00:00 AM" && _value != "0001-01-01T00:00:00")
                        {
                            dateInput.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Parse(_value)));
                            input.MergeAttribute("value", DateTime.Parse(_value).ToString());
                        }
                        else
                        {
                            dateInput.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Now));
                            input.MergeAttribute("value", DateTime.Now.ToString());
                        }
                    }
                    else
                    {
                        dateInput.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Now));
                        input.MergeAttribute("value", DateTime.Now.ToString());
                    }
                    if (_required)
                    {
                        dateInput.MergeAttribute("data-val", "true");
                        dateInput.MergeAttribute("data-val-required", "*");
                    }
                    res += dateInput.ToString(TagRenderMode.Normal) + input.ToString(TagRenderMode.Normal);
                    break;


                case TextBoxType.DateWithTime:

                    //data-mddatetimepicker="true" data-trigger="click" data-targetselector="#exampleInput3" data-enabletimepicker="true"
                    input.MergeAttribute("type", "hidden");
                    var dateInputWithTime = new TagBuilder("input");
                    dateInputWithTime.MergeAttribute("class", "form-control mdDate ");
                    dateInputWithTime.MergeAttribute("data-mddatetimepicker", "true");
                    dateInputWithTime.MergeAttribute("data-trigger", "click");
                    dateInputWithTime.MergeAttribute("data-enabletimepicker", "true");
                    dateInputWithTime.MergeAttribute("data-targetselector", "#" + _componentId + "Str");
                    dateInputWithTime.MergeAttribute("id", _componentId + "Str");
                    dateInputWithTime.MergeAttribute("name", _componentName + "Str");
                    if (_value.IsNotNullOrEmpty())
                    {
                        if (_value != "1/1/0001 12:00:00 AM" && _value != "0001-01-01T00:00:00")
                        {
                            dateInputWithTime.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Parse(_value)));
                            input.MergeAttribute("value", DateTime.Parse(_value).ToString());
                        }
                        else
                        {
                            dateInputWithTime.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Now));
                            input.MergeAttribute("value", DateTime.Now.ToString());
                        }
                    }
                    else
                    {
                        dateInputWithTime.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Now));
                        input.MergeAttribute("value", DateTime.Now.ToString());
                    }
                    if (_required)
                    {
                        dateInputWithTime.MergeAttribute("data-val", "true");
                        dateInputWithTime.MergeAttribute("data-val-required", "*");
                    }
                    res += dateInputWithTime.ToString(TagRenderMode.Normal) + input.ToString(TagRenderMode.Normal);
                    break;

                case TextBoxType.NullableDate:
                    //data-mddatetimepicker="true" data-trigger="click" data-targetselector="#exampleInput3" data-enabletimepicker="true"
                    input.MergeAttribute("type", "hidden");
                    dateInput = new TagBuilder("input");
                    dateInput.MergeAttribute("class", "form-control mdDate");
                    dateInput.MergeAttribute("data-mddatetimepicker", "true");
                    dateInput.MergeAttribute("data-trigger", "click");
                  //  dateInput.MergeAttribute("data-enabletimepicker", "true");
                    dateInput.MergeAttribute("data-targetselector", "#" + _componentId + "Str");
                    dateInput.MergeAttribute("id", _componentId + "Str");
                    dateInput.MergeAttribute("name", _componentName + "Str");
                    if (_value.IsNotNullOrEmpty())
                    {
                        if (_value != "1/1/0001 12:00:00 AM" && _value != "0001-01-01T00:00:00")
                        {
                            dateInput.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Parse(_value)));
                            input.MergeAttribute("value", DateTime.Parse(_value).ToString());
                        }
                        else
                        {
                            dateInput.MergeAttribute("value", DateTimeOperation.M2S(DateTime.Now));
                            input.MergeAttribute("value", DateTime.Now.ToString());
                        }
                    }
                    if (_required)
                    {
                        dateInput.MergeAttribute("data-val", "true");
                        dateInput.MergeAttribute("data-val-required", "*");
                    }
                    res += dateInput.ToString(TagRenderMode.Normal) + input.ToString(TagRenderMode.Normal);
                    break;

                case TextBoxType.ShortDate:
                    input.MergeAttribute("type", "text");
                    input.MergeAttribute("readonly", "readonly");
                    input.MergeAttribute("class", "form-control");
                    if (_required)
                    {
                        input.MergeAttribute("data-val", "true");
                        input.MergeAttribute("data-val-required", "*");
                    }
                    if (_value.IsNotNullOrEmpty())
                    {
                        input.MergeAttribute("value", _value);
                    }
                    res += input.ToString(TagRenderMode.Normal);
                    break;
                case TextBoxType.Number:
                    input.MergeAttribute("onkeypress", "return isPlusNumberKey(event,this);");
                    input.MergeAttribute("class", "form-control");
                    if (_value == "0")
                    {
                        input.MergeAttribute("value", "0");
                    }
                    else
                    {
                        input.MergeAttribute("value", _value);
                    }
                    if (_required)
                    {
                        input.MergeAttribute("data-val", "true");
                        input.MergeAttribute("data-val-required", "*");
                    }
                    res += input.ToString(TagRenderMode.Normal);
                    break;
                case TextBoxType.Text:
                    input.MergeAttribute("value", _value);
                    input.MergeAttribute("class", "form-control");
                    if (_dataValRegex.IsNotNullOrEmpty())
                    {
                        input.MergeAttribute("data-val-regex", _dataValRegex);
                    }
                    if (_dataValRegexPattern.IsNotNullOrEmpty())
                    {
                        input.MergeAttribute("data-val-regex-pattern", _dataValRegexPattern);
                    }
                    res += input.ToString(TagRenderMode.Normal);
                    break;
                case TextBoxType.MultiText:




                    //    <div class="multitxtArea">
                    //        <div id = "testArea" ></ div >
                    //    </ div >
                    //</ div >
                    var d1 = new TagBuilder("div");
                    d1.MergeAttribute("class", "multitxt");

                    #region inputDiv
                    var dtxt = new TagBuilder("div");
                    dtxt.MergeAttribute("class", "multitxtinput");

                    var inputTxt = new TagBuilder("input");
                    inputTxt.MergeAttribute("id", _componentId + "Str");
                    inputTxt.MergeAttribute("name", _componentName + "Str");
                    inputTxt.MergeAttribute("type", "text");
                    // input.MergeAttribute("value", _value);
                    inputTxt.MergeAttribute("class", "form-control");
                    if (_dataValRegex.IsNotNullOrEmpty())
                    {
                        inputTxt.MergeAttribute("data-val-regex", _dataValRegex);
                    }
                    if (_dataValRegexPattern.IsNotNullOrEmpty())
                    {
                        inputTxt.MergeAttribute("data-val-regex-pattern", _dataValRegexPattern);
                    }

                    var btnInputHidden = new TagBuilder("input");
                    btnInputHidden.MergeAttribute("id", _componentId);
                    btnInputHidden.MergeAttribute("type", "hidden");
                    btnInputHidden.MergeAttribute("name", _componentName);
                    btnInputHidden.MergeAttribute("value", _value);

                    dtxt.InnerHtml = inputTxt.ToString() + btnInputHidden.ToString();
                    #endregion

                    #region hintDiv
                    var dhint = new TagBuilder("div");
                    dhint.MergeAttribute("id", _componentId + "Hint");
                    dhint.MergeAttribute("class", "multitxtHint");
                    #endregion

                    var dbtn = new TagBuilder("div");
                    dbtn.MergeAttribute("class", "multitxtBtn");
                    dbtn.InnerHtml = "<i class=\"fa fa-plus\" onclick=\"AddToList('" + _componentId + "')\"></i>";

                    var dArea = new TagBuilder("div");
                    dArea.MergeAttribute("class", "multitxtArea");
                    var st = "";
                    if (_value.IsNotNullOrEmpty())
                    {
                        var jsonSerializer = new JavaScriptSerializer();
                        var model = jsonSerializer.Deserialize<List<ListItem>>(_value);
                        var n = model.Select(m => m.Value);
                        foreach (var item in n)
                        {
                            st += "<span class=\"multiTextSpan\">" + item + " <i class=\"fa fa-trash\" onclick=\"return removeTxtVal('" + _componentId + "',this,'" + item + "')\"></i></span>";
                        }
                        input.MergeAttribute("value", _value);
                    }
                    dArea.InnerHtml = "<div id=\"" + _componentId + "Area\" >" + st + "</div>";
                    d1.InnerHtml = dtxt.ToString(TagRenderMode.Normal) + dhint.ToString(TagRenderMode.Normal) + dbtn.ToString(TagRenderMode.Normal) + dArea.ToString(TagRenderMode.Normal);
                    res += d1.ToString(TagRenderMode.Normal);
                    break;
            }
            return new MvcHtmlString(res + JavaScriptCode());
        }

        private string JavaScriptCode()
        {
            var javaMethod = new StringBuilder();
            javaMethod.AppendLine("<script type='text/javascript'>");
            switch (_textBoxType)
            {
                case TextBoxType.Currency:
                    javaMethod.AppendLine("function SetValueToRefName(name,refName)  ");
                    javaMethod.AppendLine(" { ");
                    javaMethod.AppendLine(" $('#'+refName).val(removeComa($('#'+name).val())); ");
                    javaMethod.AppendLine("  ");
                    javaMethod.AppendLine("  ");
                    javaMethod.AppendLine(" } ");
                    break;
                case TextBoxType.Date:
                case TextBoxType.NullableDate:
                    javaMethod.AppendLine("  $(function () {");
                    //javaMethod.AppendLine("  SetDataControl('#" + _componentId + "Str" + "');");
                    //javaMethod.AppendLine("  ");
                    javaMethod.AppendLine("$('" + "#" + _componentId + "Str').change(function(){");
                    javaMethod.AppendLine("");

                    javaMethod.AppendLine(" $.ajax({ ");
                    javaMethod.AppendLine(" url: '/Base/S2M', ");
                    javaMethod.AppendLine("  type: 'GET',");
                    javaMethod.AppendLine("  data:{date:$(this).val()},");
                    javaMethod.AppendLine(" scriptCharset: 'utf-16', ");

                    javaMethod.AppendLine(" success: function(result) { ");

                    javaMethod.AppendLine("  $('" + "#" + _componentId + "').val(result); ");
                    javaMethod.AppendLine(" } ");
                    javaMethod.AppendLine(" }); ");
                    javaMethod.AppendLine("  ");
                    javaMethod.AppendLine(" });");
                    javaMethod.AppendLine(" });");

                    break;
                case TextBoxType.MultiText:
                    javaMethod.AppendLine("function AddToList(txtId) {");
                    javaMethod.AppendLine("var txt = document.getElementById(txtId + \"Str\");");
                    javaMethod.AppendLine(" var txtHdn = document.getElementById(txtId);");
                    javaMethod.AppendLine("  for (var i = 0, atts = txt.attributes, n = atts.length, arr = []; i < n; i++) {");
                    javaMethod.AppendLine(" if (atts[i].nodeName == 'data-val-regex-pattern') {");
                    javaMethod.AppendLine("  var atrRegExp = txt.attributes[i].value;");
                    javaMethod.AppendLine("var patt = new RegExp(atrRegExp); ");
                    javaMethod.AppendLine("var res = patt.test(txt.value); ");
                    javaMethod.AppendLine(" if (res == false) {");
                    javaMethod.AppendLine("    var msg = ''; ");
                    javaMethod.AppendLine("   if (txt.attributes['data-val-regex']) {");
                    javaMethod.AppendLine(" msg = txt.attributes['data-val-regex'].value;");
                    javaMethod.AppendLine(" } else {");
                    javaMethod.AppendLine("msg = '!'; ");
                    javaMethod.AppendLine(" } ");
                    javaMethod.AppendLine(" document.getElementById(txtId + 'Hint').innerHTML = \" <span class='alert alert-danger'>\" + msg + \"</span>\";");
                    javaMethod.AppendLine("  setTimeout(function() { ");
                    javaMethod.AppendLine(" document.getElementById(txtId + 'Hint').innerHTML = ''; ");
                    javaMethod.AppendLine("    }, 5000);");
                    javaMethod.AppendLine(" return;}}} ");


                    //   document.getElementById(txtId + 'Area').innerHTML += " <span class='multiTextSpan'>" + txt.value + " <i class='fa fa-remove' onclick="return removeTxtVal('"+txtId+"', this, '" + txt.value + "')"></i></span>";


                    javaMethod.AppendLine("var span = document.createElement(\"span\");  ");
                    javaMethod.AppendLine("var a1 = document.createAttribute(\"class\");  ");
                    javaMethod.AppendLine(" a1.value = \"multiTextSpan\"; ");
                    javaMethod.AppendLine("  span.setAttributeNode(a1);");
                    javaMethod.AppendLine("  var iTag = document.createElement(\"i\");");
                    javaMethod.AppendLine("  var a2 = document.createAttribute(\"class\");");
                    javaMethod.AppendLine("  a2.value = \"fa fa-trash\";");
                    javaMethod.AppendLine("  iTag.setAttributeNode(a2);");
                    javaMethod.AppendLine("  var a3 = document.createAttribute(\"onclick\");");
                    javaMethod.AppendLine(" a3.value = \"return removeTxtVal('\" + txtId + \"', this, '\" + txt.value + \"')\"; ");
                    javaMethod.AppendLine(" iTag.setAttributeNode(a3); ");
                    javaMethod.AppendLine("span.innerHTML = txt.value +iTag.outerHTML;  ");
                    javaMethod.AppendLine("  document.getElementById(txtId + \"Area\").innerHTML += span.outerHTML;");



                    javaMethod.AppendLine("  if (txtHdn.value != '') { ");
                    javaMethod.AppendLine("   var obj = JSON.parse(document.getElementById(txtId).value); ");
                    javaMethod.AppendLine("  var res = '['; ");
                    javaMethod.AppendLine("  for (var i = 0; i < obj.length; i++) {");
                    javaMethod.AppendLine("   res += '{\"Value\":' + '\"' + obj[i].Value + '\"' + '}, '; ");
                    javaMethod.AppendLine("  }");
                    javaMethod.AppendLine("res += '{\"Value\":' + '\"' + txt.value + '\"' + '} ';  ");
                    javaMethod.AppendLine("  res += ']'; ");
                    javaMethod.AppendLine("  txtHdn.value = res; ");
                    javaMethod.AppendLine("   } else {");
                    javaMethod.AppendLine(" txtHdn.value = '[{\"Value\":' + '\"' + txt.value + '\"' + '}]'; ");
                    javaMethod.AppendLine("   }");
                    javaMethod.AppendLine(" txt.value = ''; ");
                    javaMethod.AppendLine("  }");
                    javaMethod.AppendLine(" function removeTxtVal(txtId,spanI, val) { ");
                    javaMethod.AppendLine(" var firstCheck = false;     var span = spanI.parentElement;        var pSpan = span.parentElement; ");
                    javaMethod.AppendLine(" pSpan.removeChild(span); ");
                    javaMethod.AppendLine("   var obj = JSON.parse(document.getElementById(txtId).value);");
                    javaMethod.AppendLine("   var res = '['; ");
                    javaMethod.AppendLine("  for (var i = 0; i < obj.length; i++) { ");
                    javaMethod.AppendLine("   if (obj[i].Value != val || firstCheck) {");
                    javaMethod.AppendLine("   res += '{\"Value\":' + '\"' + obj[i].Value + '\"' + '},';");
                    javaMethod.AppendLine("  } else { ");
                    javaMethod.AppendLine("firstCheck = true;  ");
                    javaMethod.AppendLine(" } ");
                    javaMethod.AppendLine("  } ");
                    javaMethod.AppendLine(" res += ']'; ");
                    javaMethod.AppendLine(" document.getElementById(txtId).value = res.replace(\"},]\",\"}]\"); ");
                    javaMethod.AppendLine("  } ");
                    break;


                case TextBoxType.ShortDate:
                    javaMethod.AppendLine("  $(function () {");
                    javaMethod.AppendLine(" $('#" + _componentId + "').datepicker({dateFormat: 'mm/dd',autoSize: true});");
                    javaMethod.AppendLine(" });");
                    break;

                case TextBoxType.Number://dont need javascript in this case
                    return "";
                    break;
            }
            //    $("#FinancialYear").datepicker({dateFormat: 'mm/dd',autoSize: true});
            //javaMethod.AppendLine("  $(function () {");
            //javaMethod.AppendLine("var " + valueMember + " = $('#" + valueMember + "');");
            //javaMethod.AppendLine("var " + displayMember + " = $('#" + displayMember + "');");
            //javaMethod.AppendLine("if (" + valueMember + ".length > 0)");
            //javaMethod.AppendLine("{");
            //javaMethod.AppendLine("if (" + valueMember + ".val())");
            //javaMethod.AppendLine("$('#ac" + valueMember + "').val(" + displayMember + ".val());");
            //javaMethod.AppendLine("}");
            //javaMethod.AppendLine("});");
            javaMethod.AppendLine("</script>");
            return javaMethod.ToString();
        }

        public string ToHtmlString()
        {
            return Run().ToString();
        }
    }
}