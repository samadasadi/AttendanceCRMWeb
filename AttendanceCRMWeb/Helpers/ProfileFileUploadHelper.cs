using System;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{
    public static class ProfileFileUploadHelper
    {

        public static HtmlString ProfileFileUploadBuilder(this HtmlHelper helper, string inputName, string lable,
            string profileGuid, string uniqId, string savedFileId = "", string formTagId = "form-", int number = 1)
        {
            StringBuilder st = new StringBuilder();
            st.AppendLine(" <div class='form-group '><label class=' breakWorkForFieldSazAndFormSaz'>" + lable + "</label>");
            st.AppendLine(" <div class='input-group'> <div class='custom-file'> ");
            st.AppendLine(" <input type = 'file' class='custom-file-input' id='file" + uniqId + number + "' name='file' title='Attache image' />");
            st.AppendLine(" <label class='custom-file-label' for='exampleInputFile'>انتخاب فایل</label>");
            st.AppendLine(" </div> <div class='input-group-append'>  ");
            st.AppendLine(" <input type = 'button' value='بارگذاری' class='btn btn-info btn-sm'  onclick=\"return UploadformBuilderFile" + uniqId + number + "('" + profileGuid + "')\" /> ");
            st.AppendLine("  </div> ");
            st.AppendLine(" <div class='col-md-4' id='imageArea-" + uniqId + number + "'> ");
            st.AppendLine("  <input name = '" + inputName + "' value='" + savedFileId + "' type='hidden' /> ");
            st.AppendLine(" <div class='downloadBox" + uniqId + number + "'> ");


            if (!string.IsNullOrEmpty(savedFileId) && savedFileId != Guid.Empty.ToString())
            {
                //st.AppendLine("<a href='/File/DownloadFile/" + savedFileId + "'> دریافت فایل </a>  | <a onclick = 'return DeleteformBuilderFile" + uniqId + number + "()' >حذف</a> ");

                st.AppendLine(" <div class='btn-group'> ");
                st.AppendLine(" <a href='/File/DownloadFile/" + savedFileId + "' class='btn btn-primary btn-flat' style='width:85px;'> دریافت فایل </a>");
                st.AppendLine(" <a onclick = 'return DeleteformBuilderFile" + uniqId + number + "()' class='btn btn-danger btn-flat' style='width:85px;'>حذف</a>");
                st.AppendLine("  </div> ");
            }
            st.AppendLine("  </div> </div> ");
            st.AppendLine(" <script type = 'text/javascript' >  ");
            st.AppendLine("function UploadformBuilderFile" + uniqId + number + "( ){");
            st.AppendLine(" ");
            st.AppendLine("if ($('#file" + uniqId + number + "')[0].value == null && $('#file" + uniqId + number + "')[0].value == '') {  return false;} ");
            st.AppendLine(" var formData = new FormData(); ");
            st.AppendLine(" formData.append('File', $('#file" + uniqId + number + "')[0].files[0]);  ");
            st.AppendLine(" $.ajax({ ");
            st.AppendLine(" url: '/File/AddProfileImage',");
            st.AppendLine("type: 'POST', ");
            st.AppendLine(" success: function(result) {");
            st.AppendLine(" if (result != null)");
            st.AppendLine("{ ");
            st.AppendLine(" $('#imageArea-" + uniqId + number + "').find('input')[0].value = result.Id; ");
            //  st.AppendLine("$('#file" + uniqId + number + "').val(''); ");
            st.AppendLine("$('.downloadBox" + uniqId + number + "').html(\"<a href='/File/DownloadFile/\" + result.Id + \"'> دریافت </a> | <a onclick = 'return DeleteformBuilderFile" + uniqId + number + "()' >حذف</a> \" );");
            st.AppendLine(" }    }, ");
            st.AppendLine(" error: function(event) { }, ");
            st.AppendLine("  data: formData, cache: false,  contentType: false, processData: false  });");
            st.AppendLine(" return false; } ");
            st.AppendLine(" function DeleteformBuilderFile" + uniqId + number + "(){ $('.downloadBox" + uniqId + number + "').empty();" +
                          " $('#imageArea-" + uniqId + number + "').find('input')[0].value='';" +
                          " } ");
            st.AppendLine("</script> ");
            st.AppendLine(" </div> </div>");
            st.AppendLine(" ");
            return new HtmlString(st.ToString());
        }
    }
}

