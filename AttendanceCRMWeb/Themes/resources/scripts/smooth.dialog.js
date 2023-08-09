var originalTitle;
var TagTypeID = { Log: 1, Events: 2, Workflow: 3, sms: 4,sale:6 }
$(document).ready(function () {
    originalTitle = document.title;

    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });

    $("#dialog2").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });

    $("#dialog3").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $("#dialog4").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $("#dialog_tips").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $("#dialog-reminder").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $("#dialog52").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });


    $("#dialog-open").click(function () {
        $("#dialog").dialog("open");
        return false;
    });


    $("#dialog-reminder-open").click(function () {
        $("#dialog-reminder").dialog("open");
        return false;
    });

    $("#dialog-open1").click(function () {

        $("#dialog").dialog("open");
        return false;
    });



    //    Dialog submit
    $("#dialog_Submit").dialog({
        autoOpen: false,

        modal: true,
        width: 750

    });
    $('#dialog_Submit').parent().appendTo($("form:first"));

    $("#dialog_Submit-open").click(function () {
        $("#dialog_Submit").dialog("open");
        return false;
    });

    $("#dialog_Submit2").dialog({
        autoOpen: false,

        modal: true,
        width: 650

    });
    $('#dialog_Submit2').parent().appendTo($("form:first"));

    $("#dialog_Submit2-open").click(function () {
        $("#dialog_Submit2").dialog("open");
        return false;
    });


    $("#dialog_Submit3").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $('#dialog_Submit3').parent().appendTo($("form:first"));

    $("#dialog_Submit3-open").click(function () {
        $("#dialog_Submit3").dialog("open");
        return false;
    });
    $("#dialog_Submit4").dialog({
        autoOpen: false,
        modal: true,
        width: 650

    });
    $('#dialog_Submit4').parent().appendTo($("form:first"));

    $("#dialog_Submit4-open").click(function () {
        $("#dialog_Submit4").dialog("open");
        return false;
    });
    //---------------------------------------------------  
    //     $("#dialog_Submit2").dialog({
    //       autoOpen: false,
    //        
    //        modal: true,
    //        width: 650
    //        
    //    });
    //    $('#dialog_Submit2').parent().appendTo($("form:first"));

    //End dialog_Submit

    $("#dialog1").dialog({
        autoOpen: false,
        modal: true,
        width: 600

    });
    $("#dialog_according1").dialog({
        autoOpen: false,
        modal: true,
        width: 700



    });

    $("#dialog1-open").click(function () {
        $("#dialog1").dialog("open");
        return false;
    });
    $("#dialog1-open1").click(function () {
        $("#dialog1").dialog("open");
        return false;
    });
    $("#ctl00_ContentHolder_dialog1-open1").click(function () {
        $("#dialog1").dialog("open");
        return false;
    });


    for (i = 0; i < $('.dialog-open-class').length; i++) {


        $("#dialog-open" + i).click(function () {
            $("#dialog").dialog("open");
            return false;
        });


    }
    //------------------------------------------------------------------------
    // for (i=0;i<$('.dialog-open-class-642').length;i++)

    //{


    //    $("#dialog-open"+i).click(function () {
    //        $("#dialog").dialog("open");
    //        return false;
    //    });

    //    
    //}
    //  // Dialog submit For
    for (i = 0; i < $('.dialog-open-class-642').length; i++) {


        $("#dialog-Submit-open" + i).click(function () {
            $("#dialog_Submit").dialog("open");
            $("#dialog_Submit").dialog("option", "height", 650);
            return false;
        });


    }
    for (i = 0; i < $('.dialog-open-class').length; i++) {


        $("#dialog-Submit-open" + i).click(function () {
            $("#dialog_Submit").dialog("open");
            return false;
        });


    }
    // 




    //auto open
    $("#dialog-auto-open").dialog({
        autoOpen: true,
        modal: true,
        width: 650

    });







    $("#dialog-modal").dialog({
        autoOpen: false,
        height: 140,
        modal: true
    });

    $("#dialog-modal-open").click(function () {
        $("#dialog-modal").dialog("open");
        return false;
    });

    $("#dialog-message").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog('close');
            }
        }
    });

    $("#dialog-message-open").click(function () {
        $("#dialog-message").dialog("open");
        return false;
    });

    $("#dialog-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: 140,
        modal: true,
        buttons: {
            'Delete all items': function () {
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        }
    });

    $("#dialog-confirm-open").click(function () {
        $("#dialog-confirm").dialog("open");
        return false;
    });

    $("#dialog-form").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            'Create an account': function () {
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        },
        close: function () {
            allFields.val('').removeClass('ui-state-error');
        }
    });

    $("#dialog-form-open").click(function () {
        $("#dialog-form").dialog("open");
        return false;
    });




}); //End of ready


/*Dynamic Dialogs
-------------------------*/
function openDialog(dialog) {
    window.setTimeout(function () { jQuery(document).unbind('mousedown.dialog-overlay').unbind('mouseup.dialog-overlay'); }, 1000);
}


//load User_Control
//dialogMode if show in Append send False
//contentAppendNameId if dialogMode=false , send id tag for append
//ExtendData add att FormUC
function load_uc(name, ucFolder, dialogTitle, parameters, dialogProperty, dialogMode, contentAppendNameId, ExtendData,callBack) {
    //add div to body for show dialog
    var dialogID;
    if (ExtendData == undefined) {
        ExtendData = '';
    }
   
    dialogID = '#UCdialog_' + name;
    if (dialogMode === false) {
        //Append
        $(contentAppendNameId).empty();
        $(contentAppendNameId).append('<div title="' + dialogTitle + '" id="' + dialogID.replace("#", '') + '"></div>');
    } else {
        //Open dialog
        parameters.dialogID = dialogID;
        if ($(dialogID).length == 0) {
            $('body').append('<div title="' + dialogTitle + '" id="' + dialogID.replace("#", '') + '"></div>');
        }
        else {
            $(dialogID).empty();
            $('#ui-dialog-title-' + dialogID.replace("#", '')).text(dialogTitle);
        };
        $(dialogID).dialog(dialogProperty); //create dialog
        $(dialogID).dialog('open'); //open dialog
      
    };
    $(dialogID).data('data', parameters);
    $(dialogID).append('<div style="text-align:center;height: 30px;">' +
                           '<div class="wait" style="display: inline-block;margin: 10px;"></div>' +
                       '</div>'); //show Spinner Loading

    var e = { n: name, u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: ExtendData, m: ucFolder, r: $('#HFRnd').val(), };
    $.ajax({
        type: "POST", url: "../pages/Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(e), success: function (c) {

            if (dialogMode == false)
                $(contentAppendNameId).find(dialogID).html(c.d[1]);
            else {
                $(dialogID).html(c.d[1]);
                $(dialogID).dialog('option', 'position', 'center');
            }

            if ($.isFunction(callBack)) { callBack(); }
        }
    });
}







function load_uc_check(name) {
    return ($('#UCdialog_' + name).length == 0) ? false : true;
}


function showfactorInfo(idfactor, titleDilog, dialogMode, contentAppendNameId) {
    if ($('.userControlShowFactorInfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('ShowFactorInfo', "", titleDilog,
              {//parametr
                  'idfactor': idfactor
              },
              {//dialog Property
                  width: 800, modal: true, minWidth: 650,
                  open: function () { openDialog($(this)); }
              }, dialogMode, contentAppendNameId);
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        $('#ui-dialog-title-UCdialog_ShowFactorInfo').text(titleDilog);
        showfactorInfo_content(idfactor, false);
    }
}

function customer_Show_Info(cust_code, titleDilog) {
    //if ($('.content_showUserInfo_cloneInfo').length == 0) {//if ghablan uc ro load nakarde bood
    //    load_uc('ShowUserInfo', "", titleDilog,
    //          {//parametr
    //              'cust_code': cust_code, 'user_code': $('#HFUserCode').val(), 'domain': $('#HFdomain').val()
    //          },
    //          {//dialog Property
    //              width: 700, modal: true, minWidth: 500,
    //              open: function () { openDialog($(this)); }
    //          });
    //}
    //else {//agar ghablan load karde bood faghat function asli ra ejra kon
    //    $('#ui-dialog-title-UCdialog_ShowUserInfo').text(titleDilog);
    //    customer_Show_Info_UC($('#HFdomain').val(), cust_code, $('#HFUserCode').val(), false);
    //}



    var url = window.location.href;
    var arr = url.split("/");
    window.location.href = arr[0] + '/Admin/CustomerInfo/Detail/' + cust_code;

}


var customer_search_callback;
var customer_search_callbackId;
function show_customer_search(callback_Str,id) {
    customer_search_callback = callback_Str;

    if (id == undefined)
    { customer_search_callbackId = 0 }
    else {
        customer_search_callbackId = id;
    };
    if ($('#div_customer_search_quick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('searchCustomer', "", "", {},
              {//dialog Property
                  width: 450, modal: true, minWidth: 350,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        search_customer_ivr_uc();
    }
}

//returnMode=1 then retun Html link . returnMode=2 then return array info
var factor_search_callback;
function show_factor_search(callback,returnMode) {
    factor_search_callback = callback;
    if (returnMode == undefined) {
        returnMode = 1;
    };
    if ($('#div_factor_search_quick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('searchFactor', "", "", { 'returnMode': returnMode },
              {//dialog Property
                  width: 800, modal: true, minWidth: 650,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_factor_search_uc();
    }
}

var fileManagerCallBackFunction;
function show_fileManager(type, callBackFuction, option) {
    fileManagerCallBackFunction = callBackFuction;
    if ($('#DivFileManager').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('FileManager', "", "",
              {//parametr
                  'type': type, 'option': option || {}
              },
              {//dialog Property
                  modal: true,
                  minWidth: 660,
                  minHeight: 495,
                  open: function () { openDialog($(this)); },
                  hide: { effect: 'drop', direction: 'up', duration: 400 },
                  closeOnEscape: false
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        showfileManager(type, option);
    }
}

function showCustomerTemplate(CusCode_, pritnList_) {
    //$('#UCdialog_showCustomerTemplate').remove();
    //$('body').append('<div id="UCdialog_showCustomerTemplate" title="" ></div>');
    //$('#UCdialog_showCustomerTemplate').dialog({
    //    width: 700, modal: true, minWidth: 600, height: 530,
    //    open: function () { openDialog($(this)); }
    //});
    //$('#UCdialog_showCustomerTemplate').append('<div class="wait"></div>');
    //var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val() };
    //e.id = CusCode_;
    //var send_ = {};
    //send_.items = e;
    //$.ajax({
    //    type: "POST", url: "../WebServices/customer_service.asmx/get_templateCustomer",
    //    data: JSON.stringify(send_), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        $('#UCdialog_showCustomerTemplate').empty();
    //        if (c.d[0] == "success") {
    //            if (c.d[1].length != 0) {
    //                var drdTemplate = $('<select class="mydds" style="width:200px" cusCoude="' + CusCode_ + '" ></select>');
    //                $.each(c.d[1], function (i, item) {
    //                    drdTemplate.append('<option value="' + item[0] + '">' + item[1] + '</option>');
    //                });
    //                $('#UCdialog_showCustomerTemplate').append('<div class="field" style="background-color: #F7F7F7;border: solid 1px #BBB;box-shadow: 1px 1px 2px #DDD;margin-bottom: 10px;overflow: hidden;padding: 5px;line-height: 27px;">' +
    //                                                      '<b class="right_left" style="margin: 0 10px;"></b>' +
    //                                                      '<div class="select left_right"></div>' +
    //                                                      '<div class="wait waitloadforminfo left_right" style="margin: 5px;display:none;"></div>' +
    //                                                   '</div>' +
    //                                                   '<div class="formInfoContainer"></div>').dialog('option', 'position', 'center');
    //                $('#UCdialog_showCustomerTemplate .select').append(drdTemplate);
    //                $(".mydds").msDropDown().data("dd");

    //                //  $('.formInfoContainer').append('<div class="DivTempFormInfo DivTempFormInfo_Def">' + c.d[1] + '</div>');

    //                drdTemplate.change(function () {
    //                    var templateId = $(this).val();
    //                    if (templateId != "0") {
    //                        if ($('[class*=DivTempFormInfo_' + templateId + ']').length == 0) {


    //                            if (pritnList_ == false) {
    //                                var e1 = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
    //                                e1.o.cusCode = $(this).attr('cusCoude');
    //                                e1.o.templateId = templateId;
    //                                $('.waitloadforminfo').show();
    //                                $.ajax({
    //                                    type: "POST", url: "../WebServices/customer_service.asmx/get_Customer_info_template",
    //                                    data: JSON.stringify(e1), contentType: "application/json; charset=utf-8", dataType: "json",
    //                                    success: function (c) {
    //                                        $('.waitloadforminfo').fadeOut();
    //                                        $('.DivTempFormInfo').hide();
    //                                        $('.formInfoContainer').append('<div class="DivTempFormInfo DivTempFormInfo_' + templateId + '">' + c.d[1] + '</div>');
                                      
    //                                        try {
    //                                            rcrmSetHeight();
    //                                        }
    //                                        catch (err) {
    //                                        }
    //                                    }
    //                                });
    //                            } else { // baraye liste moshtariyan
    //                                var d = {};
    //                                d = split_property_advanced("");
    //                                var s = {};
    //                                s.link2 = 0;
    //                                s.code = 0;
    //                                s.templateId = templateId;
    //                                d.send_to = "print"
    //                                d.send_to_param = s;
    //                                $('#ctl00_ContentHolder_HDintPage').val(1);
    //                                $('.waitloadforminfo').show();
    //                                get_cuslist(true, 0, "Advanced", d, false, "");

    //                            }

    //                        }
    //                        else {
    //                            $('.DivTempFormInfo').hide();
    //                            $('.DivTempFormInfo_' + templateId).show();
    //                        }
    //                    }
    //                    else {
    //                        $('.DivTempFormInfo').hide();
    //                        $('.DivTempFormInfo_Def').show();
    //                    }
    //                });
    //            }
    //            else {
    //                $('#UCdialog_showCustomerTemplate').append('<div class="formInfoContainer"><div class="DivTempFormInfo DivTempFormInfo_Def">' + c.d[1] + '</div></div>');
    //            }
    //            var btnPrint = $('<span class="Crm-icon Crm-icon16-grid Crm-icon-print-16 left_right" title="Print" style="margin: 4px;"></span>');
    //            btnPrint.click(function () {
    //                $('.formInfoContainer').printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "" });
    //            });
    //            $('#UCdialog_showCustomerTemplate b').append(btnPrint);
    //        } else if (c.d[0] == "noaccess") {
    //            $('#UCdialog_showFormInfo').html('<div style="text-align: center; border: 1px solid #eee; background-color: #f7f7f7; padding: 15px; width: 30%; margin: 50px auto; ">' +
    //                                                 '<div class="Crm-icon Crm-icon32 Crm-icon-warning-32" style="float: none; display: inline-block;"></div><br>' +
    //                                                 '<span>' + c.d[1] + '</span>' +
    //                                             '</div>');
    //        } else if (c.d[0] == "error") {
    //            $('#UCdialog_showCustomerTemplate').html(c.d[1]);
    //        }
    //    },
    //    error: function (xhr, status) {
    //        $('#UCdialog_showCustomerTemplate').html("Sorry, there was a problem!");
    //    }
    //});
    return false;
}

function showFormInfo(idForm_value, formname, historyId) {
    RaveshFormUtility.showDialogViewForm(idForm_value, { historyId: historyId || 0 });
    return false;
}




//mode=search or mode=insert
//function registerForm(formid, cust_code, list, mode, dialogMode, contentAppendNameId) {
//    if ($('#DivUCdialog_RegisterForm').length != 0) {
//        $("#UCdialog_RegisterForm").remove();
//        $("#DrdForms_regform").multiselect("destroy");
//        $('#DivUCdialog_RegisterForm').remove();
//    }
//  //  if ($('#DivUCdialog_RegisterForm').length == 0) {//if ghablan uc ro load nakarde bood
//        load_uc('RegisterForm', '', '',
//              {//parametr
//                  'formid': formid, 'cust_code': cust_code, 'list': list, 'mode': mode
//              },
//              {//dialog Property
//                  width: 800, height: 572, modal: true, minWidth: 800, minHeight: 400,
//                  open: function () { openDialog($(this)); }
//              }, dialogMode, contentAppendNameId, cust_code);
//   // }
//   // else {//agar ghablan load karde bood faghat function asli ra ejra kon
//   //     registerForm_make_uc(formid, cust_code, list, mode, false);
//   // }
//}





function showEmailStatus(id_, email_To_id_) {

    //$('#UCdialog_showEmailStatuse').remove();
    
                    
    //$('body').append('<div id="UCdialog_showEmailStatuse" title="' + resources.email + '"><div class="div_print Crm-icon Crm-icon16-grid Crm-icon-print-16 left" style="margin-top: 0px;" printed="viewRecipientsbody"></div>   <div id="viewRecipientsbody" style="margin-top: 20px; overflow: auto;"></div></div>');
    //$('#UCdialog_showEmailStatuse').dialog({
    //    width: 850, modal: true, minWidth: 520,
    //    open: function () { openDialog($(this)); }
    //});
    //$('#UCdialog_showEmailStatuse #viewRecipientsbody').append('<div class="wait"></div>');

    //var e = {};
    //var send_ = {};
    //e.domain = $('#HFdomain').val();
    //e.user_code = $('#HFUserCode').val();
    //e.codeing = $("#hfcodeing").val();
    //e.id = id_;
    //e.email_To_id = email_To_id_;
    //send_.items = e;
    //$.ajax({
    //    type: "POST", url: "../WebServices/Email_service.asmx/get_Email_bodysent_auto",
    //    data: JSON.stringify(send_), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        var ucD_ = $('#UCdialog_showEmailStatuse #viewRecipientsbody');
    //        ucD_.empty();
    //        ucD_.html(c.d[0]);
    //        jQuery.each(c.d[1], function (Index, Value) {
    //            ucD_.after("<span class='tags m1 left attachtag_' style='background-color: #C5C5C5;color: #2E2E2E;'>" + Value + "</span>");
    //        });

    //        $('#UCdialog_showEmailStatuse .div_print').click(function () {
    //            var p_ = "<div id='sadeg'>" + $("#" + $(this).attr("printed")).html() + "</div>";
    //            var p1_ = $(p_).clone();
    //            p1_.css("background-color", "#fff");
    //            p1_.printElement({ leaveOpen: 1, printMode: "popup", pageTitle: "RaveshCrm", printBodyOptions: { styleToAdd: 'padding:10px;margin:10px;background-color:#FFF;background-image: none;', classNameToAdd: '' } });

    //        });
    //    }
    //});


}

function showsmsStatus(sms_id, tel) {

    //$('#UCdialog_showsmsStatus').remove();


    //$('body').append('<div id="UCdialog_showsmsStatus" title="' + resources.packOptionsText[0] + '"></div>');
    //$('#UCdialog_showsmsStatus').dialog({
    //    width: 400, modal: true, minWidth: 300,
    //    open: function () { openDialog($(this)); }
    //});
    //$('#UCdialog_showsmsStatus').append('<div class="wait"></div>');

    //var e = {};
    //var send_ = {};
    //e.domain = $('#HFdomain').val();
    //e.user_code = $('#HFUserCode').val();
    //e.codeing = $("#hfcodeing").val();
    //e.sms_id = sms_id;
    //e.tel = tel;
    //send_.items = e;
    //$.ajax({
    //    type: "POST", url: "../WebServices/SMS2mgr.asmx/Get_sms_body",
    //    data: JSON.stringify(send_), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        var ucD_ = $('#UCdialog_showsmsStatus');
    //        ucD_.empty();
    //        ucD_.html(c.d);
         
    //    }
    //});


}

/*-------------Write Online ------------*/

var timerWriteOnline;
var TextWriteOnline = '';
$(document).ready(function () {
    Write_Online('read');
    $('#div_write_online').click(function () {
        timerWriteOnline = setInterval("Write_Online('write')", 3000);
    });
    $('#div_write_online').blur(function () {
        clearInterval(timerWriteOnline);
        Write_Online('write');
    });
});

function Write_Online(cmd) {
    //var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), body: $('#div_write_online').html(), cmd: cmd };
    //if (e.body == TextWriteOnline && cmd == "write") return false; //ager matn taghir nakarde bood lazel be zakhire nist
    //$.ajax({
    //    type: "POST",
    //    url: "../webservices/todo1.asmx/Write_Online",
    //    data: JSON.stringify(e),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (c) {
    //        if (cmd == "read") {
    //            $('#div_write_online').html(c.d);
    //        }
    //        TextWriteOnline = e.body;
    //    }
    //});
}
//------------------------------------------




/*----------------- quick SMS --------------------*/
function qucikSendSms(customerCode, mobileNumber) {

    Dlg_quicksms(customerCode, mobileNumber);

}
function set_quickSms(customerCode, mobileNumber) {
    if (customerCode != undefined && mobileNumber != undefined) {
        var s = mobileNumber.split(",");
        var ico__ = '<span class="Crm-icon Crm-icon16 mark_image Crm-icon-person-black" style="margin-left: 4px;position: absolute;top: 8px;font-size: 13px;right: 0px;font-weight: 900;cursor: default;"></span>'
        $.each(s, function (intIndex, objValue) {
            if ($(".quicksms_main .quicksms_txtreciver").val() == "") {
                if (intIndex > 0) $(".quicksms_add").click();
                $(".quicksms_main .quicksms_txtreciver").eq(intIndex).val(objValue).attr("cus_code", customerCode).attr("readOnly", "readOnly").before(ico__).before('<span class="ui-icon ui-red ui-icon-close cursor quicksms_delete_one" style="top: 8px;right: 17px;position: absolute;color: #DA1F1D;font-size: 13px;" ></span>');
            } else {
                $(".quicksms_add").click();
                $(".quicksms_main .quicksms_txtreciver").last().val(objValue).attr("cus_code", customerCode).attr("readOnly", "readOnly").before(ico__);
            }

        });
    }
}
function Dlg_quicksms(customerCode, mobileNumber) {
    if ($('#quickSMS_panel').length == 0) {
        var findBox = $('.MenuQuickAccessBox .icon-comment-dots');
        findBox.removeClass('icon-comment-dots').addClass('spinner');
        var cus_code = '';
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), r: $('#HFRnd').val(), cu: cus_code };
        var customerCode_ = customerCode;
        var mobileNumber_ = mobileNumber;
        $.ajax({
            type: "POST",
            url: "../pages/Load_UserControl.aspx/get_UC_quciksms",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                if ($('#quickSMS_panel').length == 0) {
                    findBox.addClass('icon-comment-dots').removeClass('spinner');
                    mnubtnMenuQuickAccess.hide();
                    $("body").append(c.d);
                    if (customerCode_ != undefined)
                        set_quickSms(customerCode_, mobileNumber_);
                    restructureQuickBoxes();
                } else {
                    quickSmsStart(customerCode, mobileNumber);
                }
            }
        });
    } else {

        quickSmsStart(customerCode, mobileNumber);

    }

}








function show_ticket(ticket_id, titledialog) {


}

function show_recive_sms(Id, titledialog) {
    //$('#UCdialog_SMS_Recive').remove();
    //$('body').append('<div id="UCdialog_SMS_Recive" title="' + titledialog + '"></div>');
    //var dialog = $('#UCdialog_SMS_Recive').dialog({
    //    width: 700, modal: true, minWidth: 500,
    //    open: function () { openDialog($(this)); }
    //});
    //dialog.append('<div class="wait"></div>');

    //var e = {}; var send_ = {};
    //e.domain = $("#HFdomain").val();
    //e.user_code = $("#HFUserCode").val();
    //e.codeing = $("#HFcodeDU").val();
    //e.id = Id;
    //send_.items = e;
    //$.ajax({
    //    type: "POST",
    //    url: "../WebServices/SMS2mgr.asmx/Get_sms_text",
    //    data: JSON.stringify(send_),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (c) {
    //        dialog.html(c.d[0] + "<br><br>" + c.d[1]);
    //    }
    //});

}


function runwf_quick(mode, code, newCode, cust_code, titledialog, callbackstr) {
    //$('#UCdialog_RunWf').remove();
    //$('body').append('<div id="UCdialog_RunWf" title="' + titledialog + '"></div>');
    //var dialog = $('#UCdialog_RunWf').dialog({
    //    width: 650, modal: true, minWidth: 490,
    //    open: function () { openDialog($(this)); }
    //});
    //dialog.append('<div class="wait"></div>');

    //var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: { mode: mode, code: code } };
    //$.ajax({
    //    type: "POST", contentType: "application/json; charset=utf-8", url: "../webservices/workflow_.asmx/getWorkflow_forRun",
    //    data: JSON.stringify(e), dataType: "json", success: function (c) {
    //        dialog.html('<div class="box"><div class="form"><div class="fields"><div class="field"><div class="buttons right_left"></div><div class="wfmsgplc right_left" style="margin:8px;"></div></div><div class="field-extra-runwfquick"></div></div></div></div>');
    //        if (c.d[0] == "error") {
    //            dialog.html(c.d[1]);
    //            return false;
    //        }
    //        var res = c.d[2];
    //        var drdwf = $('<select class="mydds" style="width:150px;float:' + ((res.dir == "rtl") ? 'right' : 'left') + ';"></select>');
    //        drdwf.html('<option value="0">' + res.pleaseSelect + '</option>');
    //        $.each(c.d[1], function (i, item) {
    //            drdwf.append('<option value="' + item.id + '">' + item.subject + '</option>');
    //        });
    //        dialog.find('.field:first').prepend(drdwf);
    //        drdwf.msDropDown().data("dd");

    //        var btnStartWf = $('<input type="submit" class="green_btn" value="' + res.startWf + '">');
    //        dialog.find('.buttons').append(btnStartWf);
    //        btnStartWf.button();


    //        if (callbackstr) {
    //            window[callbackstr](newCode);
    //        }

    //        btnStartWf.click(function () {
    //            dialog.find('.wfmsgplc').empty();
    //            var idwf = drdwf.val();
    //            if (idwf == 0) return false;
    //            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: { idwf: idwf, mode: mode, code: newCode, cust_code: cust_code } };
    //            $(this).parent().after('<div class="wait right_left" style="margin: 5px;"></div>');

    //            $(this).attr('disabled', 'disabled');
    //            $.ajax({
    //                type: "POST", contentType: "application/json; charset=utf-8", url: "../webservices/workflow_.asmx/run_Workflow",
    //                data: JSON.stringify(e), dataType: "json", success: function (c) {
    //                    btnStartWf.attr('disabled', '');
    //                    drdwf.find('option:first').attr('selected', 'selected');
    //                    drdwf.msDropDown().data("dd");
    //                    dialog.find('.wait').remove();
    //                    dialog.find('.wfmsgplc').html('<span style="color:' + ((c.d[0] == "error") ? 'red' : 'green') + '">' + c.d[1] + '</span>');
    //                }
    //            });
    //            return false;
    //        });

    //    }
    //});
    //return false;
}







//******************** remove reminder list
var rem_;
function remindertagtrue(id) {
    //var e = {};
    //rem_ = id;
    //e.reminder_id = id;
    //e.domain = $("#HFdomain").val();
    //e.user_code = $('#HFUserCode').val();
    //e.codeing = $("#hfcodeing").val();
    //var send_ = {};
    //send_.items = e;
    //$('#rem_' + id).mask("Loading...");

    //jQuery.ajax({
    //    url: "../WebServices/schedule_linked.asmx/delete_reminder_list",
    //    data: JSON.stringify(send_),
    //    type: "POST",
    //    dataType: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (c) {
    //        var countreminder = $(".badge-reminder span").text(); countreminder = countreminder - 1; $(".badge-reminder span").text(countreminder);
    //        if (countreminder == 0) {
    //            $(".badge-reminder").hide();
    //        }
    //        $('#rem_' + rem_).hide("slow");
    //        $('#rem_' + rem_).find(".reminderClose").unbind();

    //    }
    //});
}




function customer_create_quick(titleDilog, callbackStr, InputParams) {
    if ($('.BoxCreateCustQuick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('customer_create_quick', "", titleDilog,
              {//parametr
                  callbackStr: callbackStr, InputParams: InputParams
              },
              {//dialog Property
                  width: 650, modal: true, minWidth: 630,
                  open: function () { openDialog($(this)); },
                  close: function (event, ui) { $('.positionHelper').hide(); },
                  drag: function (event, ui) {
                      if ($('#SelectgruopCustQuick').length == 0) return false;
                      $('.positionHelper').css("left", $('#SelectgruopCustQuick').offset().left + 'px');
                      $('.positionHelper').css("top", $('#SelectgruopCustQuick').offset().top + 'px');
                  },
                  dragStop: function (event, ui) {
                      if ($('#SelectgruopCustQuick').length == 0) return false;
                      $('.positionHelper').css("left", $('#SelectgruopCustQuick').offset().left + 'px');
                      $('.positionHelper').css("top", $('#SelectgruopCustQuick').offset().top + 'px');
                  }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        $('#ui-dialog-title-UCdialog_customer_create_quick').text(titleDilog);
        customer_create_quick_uc(callbackStr, InputParams);
    }
}

function Workflow_Show_Info(idwfs, idtaskstart, titleDilog) {
    if ($('.BoxShowWorkflowInfo').length == 0) {//if ghablan uc ro load nakarde bood 
        load_uc('showWorkflowInfo', "", titleDilog,
              {//parametr
                  idwfs: idwfs, idtaskstart: idtaskstart
              },
              {//dialog Property
                  width: 700, modal: true, minWidth: 500,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        $('#ui-dialog-title-UCdialog_showWorkflowInfo').text(titleDilog);
        Workflow_Show_Info_uc(idwfs, idtaskstart);
    }
}

function show_user_search(callback_Str) {
    if ($('#div_user_search_quick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('searchUser', "", "", {
            callback_Str: callback_Str
        },
              {//dialog Property
                  width: 450, modal: true, minWidth: 350,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        search_user_quick_uc(callback_Str);
    }
}

//*************

function manage_tags(TagType) {
    if ($('#tagsManage').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('Tags', "", "",
              {//parametr
                  'TagType': TagType
              },
              {//dialog Property
                  bgiframe: true,
                  modal: true,
                  width: 550,
                  height: 380,
                  minHeight: 380,
                  maxHeight: 380,
                  minWidth: 550,
                  open: function () { openDialog($(this)); },
                  //close: function (event, ui) {
                  //    $('#UCdialog_Tags').remove();
                  //}
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        if ($('#UCdialog_Tags').data('data').TagType == TagType) {
            show_dialog_tags();
        } else {
            $('#UCdialog_Tags').remove();
            manage_tags(TagType);
        }
    }
}
function show_dialog_tags() {
    $('#UCdialog_Tags').dialog('open');
    bindTags();
    $('#txt_add_tag').val('');
    $('.sampleViewTag').parents('.tags').hide();
}

//*****************Log
function LogUC(customerCode) {
    if ($('#DivContentLog').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('Log_UC', "", "",
              {//parametr
                  'customerCode': customerCode
              },
              {//dialog Property
                  bgiframe: true,
                  modal: true,
                  width: 900,
                  height: 600,
                  minHeight: 380,
                  maxHeight: 600,
                  minWidth: 900,
                  open: function () { openDialog($(this)); },
                  close: function (event, ui) {
                      $('#UCdialog_Log_UC').remove();
                  }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        if ($('#UCdialog_Log_UC').length != 0) {
            if ($('#UCdialog_Log_UC').data('data').customerCode == customerCode) {
                show_dialog_Log();
            } else {
                $('#UCdialog_Log_UC').remove();
                LogUC(customerCode);
            }
        }
        else {
            $('#DivContentLog').remove();
            LogUC(customerCode);
        }
    }
}

function show_dialog_Log() {
    $('#UCdialog_Log_UC').dialog('open');
}

function logLoad(customerCode, selectedFild) {
    var e = { n: 'Log_UC', u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
    $(selectedFild).html("<center class='loading' style='padding-top: 11px;margin: 0 auto;'></center>");
    $.ajax({
        type: "POST", url: "../pages/Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(e), success: function (c) {
            var logDiv = $(c.d[1]);
            logDiv.find('#DivContentLog').attr('customerCode', customerCode)
            $(selectedFild).attr('customerCode', customerCode).html(logDiv);

        }
    });
}


//*******************************
function sendCartableQuick(mode, otherData, callback) {
    if ($('#DivUCdialog_SendCartable').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('sendCartable', "", "",
              {//parametr
                  'callback': callback, 'mode': mode, 'otherData': otherData
              },
              {//dialog Property
                  width: 800, modal: true, minWidth: 730,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        sendCartableQuick_uc(mode, otherData, callback);
    }
}

//*****************
//add water mark ************************************
//water mark *************************************************
var map = new Array();
$.Watermark = {
    ShowAll: function () {
        for (var i = 0; i < map.length; i++) {
            if (map[i].obj.is('div')) {
                if (map[i].obj.html() == "") {
                    map[i].obj.html(map[i].text);
                    map[i].obj.css("color", map[i].WatermarkColor);
                } else {
                    map[i].obj.css("color", map[i].DefaultColor);
                }

            } else {
                if (map[i].obj.val() == "") {
                    map[i].obj.val(map[i].text);
                    map[i].obj.css("color", map[i].WatermarkColor);
                } else {
                    map[i].obj.css("color", map[i].DefaultColor);
                }

            }


        }
    },
    HideAll: function () {
        for (var i = 0; i < map.length; i++) {
            if (map[i].obj.is('div')) {
                if (map[i].obj.html() == map[i].text)
                    map[i].obj.html("");
            } else {
                if (map[i].obj.val() == map[i].text)
                    map[i].obj.val("");
            }

        }
    }
}
$.fn.Watermark = function (text, color) {
    if (!color)
        color = "#aaa";
    return this.each(
function () {
    var input = $(this);
    var defaultColor = input.css("color");
    map[map.length] = { text: text, obj: input, DefaultColor: defaultColor, WatermarkColor: color };
    function clearMessage() {
        if (input.is('div')) {
            if (input.html() == text)
                input.html("");
        } else {
            if (input.val() == text)
                input.val("");
        }

        input.css("color", defaultColor);
    }

    function insertMessage() {
        if (input.is('div')) {
            if (input.html().length == 0 || input.html() == text) {
                input.html(text);
                input.css("color", color);
            } else
                input.css("color", defaultColor);
        } else {
            if (input.val().length == 0 || input.val() == text) {
                input.val(text);
                input.css("color", color);
            } else
                input.css("color", defaultColor);
        }

    }

    input.focusin(clearMessage);
    input.blur(insertMessage);
    input.change(insertMessage);

    insertMessage();
}
);
};


//****************************** new feature
function NewFeature() {
    //var fi_ = $(".menuQuickBar .divNewFeature ul");
    //fi_.mask("...");
    //$.ajax({
    //    type: "POST", url: "../WebServices/get_info.asmx/NewFeaturesRss_",data:'', contentType: "application/json; charset=utf-8", dataType: "json", success: function (c) {
        
    //        if (c.d.length != 0) {
    //            $(".navbar .badge-Feature").css("display", "inline-table");
    //            $(".navbar .badge-Feature .badge").html(c.d.length);

    //        }
           
    //        $.each(c.d, function (key, value) {
    //            var cop_=fi_.find(".cloneNewFeatureLi").clone().removeClass("cloneNewFeatureLi").show();
    //            cop_.find(".NewFeaturetitle").html(value.title);
    //            cop_.find(".NewFeatureSummary").html(value.Summary);
    //            cop_.find(".newFeatureDateTime").html(value.DateTime);
    //            cop_.find("a").attr("href", value.link);
    //            fi_.append(cop_);
    //        });
    //        fi_.unmask("...");
      
    //    }
    //});

}

//************************ show user Support Info
function show_userSupport_info(supportUserCode, titledialog) {
    //$('#UCdialog_Support_show_Info').remove();
    //$('body').append('<div id="UCdialog_Support_show_Info" title="' + titledialog + '"></div>');
    //var dialog = $('#UCdialog_Support_show_Info').dialog({
    //    width: 700, modal: true, minWidth: 500,
    //    open: function () { openDialog($(this)); }
    //});
    //dialog.append('<div class="wait"></div>');

    //var e = {}; var send_ = {};
    //e.domain = $("#HFdomain").val();
    //e.user_code = $("#HFUserCode").val();
    //e.codeing = $("#HFcodeDU").val();
    //e.id = supportUserCode;
    //send_.items = e;
    //$.ajax({
    //    type: "POST",
    //    url: "../WebServices/get_info.asmx/support_UserInfo",
    //    data: JSON.stringify(send_),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (c) {
    //        dialog.html(c.d);
    //    }
    //});

}
//**********************Show Call Info

function showcallinfo(tranno) {
    if ($('#div_uc_callinfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('showcallinfo', "", "",
              {//parametr
                  'tranno': tranno
              },
              {//dialog Property
                  modal: true,
                  minWidth: 450,
                  minHeight: 400,
                  open: function () { openDialog($(this)); },
                  hide: { effect: 'drop', direction: 'up', duration: 400 }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        showcallinfo_uc(tranno);
    }
}

//*************version
function LoadVersion(VersionName) {
    load_uc('LoadVersion', "", "",
          {//parametr
              'VersionName': VersionName
          },
          {//dialog Property
              bgiframe: true,
              modal: true,
              width: 650,
              height: 700,
              minHeight: 700,
              maxHeight: 700,
              minWidth: 650,
              open: function () { openDialog($(this)); },
          });
}


//************* Send again Email 
function sendAgainEmail(EmailId) {
    //var e = {}; var send_ = {};
    //e.domain = $("#HFdomain").val();
    //e.user_code = $("#HFUserCode").val();
    //e.codeing = $("#HFcodeDU").val();
    //e.id = EmailId;
    //send_.items = e;
    //$.ajax({
    //    type: "POST",
    //    url: "../WebServices/Email_service.asmx/sendAgainEmail_UnSended",
    //    data: JSON.stringify(send_),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (c) {
    //        var p = '1';
    //    }
    //});

}


/*********fax view************/
function show_faxinfo(faxid) {
    if ($('#DivUCdialog_ViewFax').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('viewFax', "", "", {
            faxid: faxid
        },
              {//dialog Property
                  width: 650, modal: true, minWidth: 500,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_faxinfo_uc(faxid);
    }
}
/********* Voice view************/
function show_voiceinfo(voiceId) {
    if ($('#DivUCdialog_ViewVoice').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('viewVoice', "", "", {
            voiceId: voiceId
        },
              {//dialog Property
                  width: 650, modal: true, minWidth: 500,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_Voiceinfo_uc(voiceId);
    }
}


/*********Email Receiver view************/
function show_email_info(emailReceiverid,title) {
    if ($('#DivUCdialog_showEmailReceiverInfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('showEmailReceiverInfo', "", title, {
            emailReceiverid: emailReceiverid
        },
              {//dialog Property
                  width: 750, modal: true, minWidth: 500,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_emailReceiver_uc(emailReceiverid);
    }
}





/********animateCSS*********/
(function () {
    'use strict';
    var $;

    $ = jQuery;

    $.fn.extend({
        animateCSS: function (effect, options) {
            var addClass, animate, callback, complete, init, removeClass, settings, transitionEnd, perfixCSS, unhide, duration, removeduration, IterationCount, removeIterationCount;
            settings = {
                effect: effect,
                delay: 0,
                speed: 1000,
                viewport: false,
                infinite: false,
                count: 1,
                callback: options
            };
            perfixCSS = ['', 'O', 'Moz', 'webkit', 'ms'];
            settings = $.extend(settings, options);
            if (settings.speed.toString().indexOf('ms') == -1 && settings.speed.toString().indexOf('s') == -1) settings.speed += 'ms';
            init = function (element) {
                if (element.data('animCss')) {
                    element.removeClass(element.data('animCss').effect + ' animated-infinite');
                }
                element.data('animCss', settings);
                if (settings.viewport) {
                    if (isElementInViewport(element)) return animate(element);
                    $(window).scroll(function () {
                        if (isElementInViewport(element)) return animate(element);
                    });
                } else {
                    return animate(element);
                }
            };
            animate = function (element) {
                if (settings.infinite === true) {
                    settings.effect += ' animated-infinite';
                } else {
                    if (settings.count > 1) IterationCount(element);
                }
                duration(element);
                return setTimeout(function () {
                    unhide(element);
                    addClass(element);
                    return complete(element);
                }, settings.delay);
            };
            addClass = function (element) {
                return element.addClass(settings.effect);
            };
            unhide = function (element) {
                if (element.css('visibility') === 'hidden') {
                    element.css('visibility', 'visible');
                }
                if (element.is(':hidden')) {
                    return element.show();
                }
            };
            duration = function (element) {
                $.each(perfixCSS, function (i, item) {
                    element[0].style[item + 'AnimationDuration'] = settings.speed;
                });
            };
            removeduration = function (element) {
                $.each(perfixCSS, function (i, item) {
                    element[0].style[item + 'AnimationDuration'] = '';
                });
            };
            IterationCount = function (element) {
                $.each(perfixCSS, function (i, item) {
                    element[0].style[item + 'AnimationIterationCount'] = settings.count;
                });
            };
            removeIterationCount = function (element) {
                $.each(perfixCSS, function (i, item) {
                    element[0].style[item + 'AnimationIterationCount'] = '';
                });
            };
            removeClass = function (element) {
                return element.removeClass(settings.effect);
            };
            callback = function (element) {
                if (settings.infinite === false) {
                    removeClass(element);
                    removeduration(element);
                    removeIterationCount(element);
                }
                if (typeof settings.callback === 'function') {
                    return settings.callback.call(element);
                }
            };
            complete = function (element) {
                transitionEnd = '';
                $.each(perfixCSS, function (i, item) {
                    transitionEnd += item + 'AnimationEnd ';
                });
                return element.one(transitionEnd, function () {
                    return callback(element);
                });
            };
            return this.each(function () {
                return init($(this));
            });

            function isElementInViewport(element) {
                // Get the scroll position of the page.
                var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
                var viewportTop = $(scrollElem).scrollTop();
                var viewportBottom = viewportTop + $(window).height();

                // Get the position of the element on the page.
                var elemTop = Math.round(element.offset().top);
                var elemHeight = element.height();
                var elemBottom = elemTop + elemHeight;

                var result = (!element.hasClass('viewport-animated')) && (elemTop + elemHeight / 2 < viewportBottom) && (elemBottom - elemHeight / 2 > viewportTop);
                if (result) { element.addClass('viewport-animated') }

                return result;
            }

        }
    });

}).call(this);


/*************/

function setCustomerPicture(options) {
    if ($('.imagearea-container').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('ImgAreaSelect', "", "",
              {//parametr
                  options: options
              },
              {//dialog Property
                  modal: true, width: 600, height: 490, resizable: false,
                  open: function () { openDialog($(this)); },
                  close: function () { $(".imagearea-source-wrapper img").imgAreaSelect({ hide: true }); },
                  drag: function (event, ui) { $(".imagearea-source-wrapper img").imgAreaSelect({ hide: true }); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        setCustomerPicture_uc(options);
    }
}


/***************/
function AccessLoad(Mode, selectedFild, UserCode, initFunction, callbackFunction) {
    var e = { n: 'assignAccess', u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
    $(selectedFild).html("<center class='loading' style='padding-top: 11px;margin: 0 auto;'></center>");
    $.ajax({
        type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(e), success: function (c) {
            var AccessDiv = $(c.d[1]);
            AccessDiv.find('.AccessDiv').attr('Mode', Mode).attr('UserCode', UserCode).data({ 'initFunction': initFunction, 'callbackFunction': callbackFunction });
            $(selectedFild).html(AccessDiv);
        }
    });
}

/******************/

function ivr_chart_manage(callback) {
    if ($('#UCdialog_addChart').length == 0) {//if ghablan uc ro load nakarde bood 
        load_uc('addChart', "", "",
              {//parametr
                  callback: callback
              },
              {//dialog Property
                  autoOpen: false, modal: true, width: 520, height: 410, resizable: false,
                  hide: { effect: 'drop', direction: 'up', duration: 400 },
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        ivr_chart_manage_uc(callback);
    }
}


/************************/
function parametr_manage(mode, code, callback) {
    if ($('#UCdialog_ParametrManager').length == 0) {//if ghablan uc ro load nakarde bood 
        load_uc('ParametrManager', "", "",
              {//parametr
                  mode: mode, code: code, callback: callback
              },
              {//dialog Property
                  autoOpen: false, modal: true, width: 590, height: 460, resizable: false,
                  hide: { effect: 'drop', direction: 'up', duration: 400 },
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        parametr_manage_uc(mode, code, callback);
    }
}

/************************/
function setting_manage(link2,showAll, callback) {
    if ($('#UCdialog_settingManager').length == 0) {//if ghablan uc ro load nakarde bood 
        load_uc('settingManager', "", "",
              {//parametr
                  link2: link2, showAll: showAll, callback: callback
              },
              {//dialog Property
                  autoOpen: false, modal: true, width: 570, height: 460, resizable: false,
                  hide: { effect: 'drop', direction: 'up', duration: 400 },
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        setting_manage_uc(link2, showAll, callback);
    }
}

/***********************/

function showSaleInfo(SaleId) {
    if ($('.userControlShowSaleInfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('ShowSaleInfo', "", "",
              {//parametr
                  'SaleId': SaleId
              },
              {//dialog Property
                  width: 800, modal: true, minWidth: 450, resizable: false,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        showSaleInfo_content(SaleId, false);
    }
}




function showDocInfo(DocId) {
    if ($('.userControlShowDocInfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('ShowDocInfo', "", "",
              {//parametr
                  'DocId': DocId
              },
              {//dialog Property
                  width: 800, modal: true, minWidth: 650,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        showDocInfo_content(DocId, false);
    }
}

/************************/
function Event_Add_WU(customerCode_, formCode_, formId_, title, hideExtraSetting, saleId_, afterLoad_) {

    if (hideExtraSetting == undefined) hideExtraSetting = true;
    if (hideExtraSetting) { hideExtraSetting='hideEventExtendSetting'; }

    var dialog = RaveshUI.showDialog({
        id: 'EventDialog',
        title: title,
        width: 590,
        minWidth: 590,
        onClose: function () {
            $("#dialog_add_user_event").dialog('destroy').remove();
        }
    });
    dialog.setTitle(title);
    dialog.showLoading();
    var container = $('<div>').addClass('form event-dialog').css({ overflow: 'hidden', padding: '0 15px', minHeight: 400 });
     dialog.setContent(container);

        load_uc('WU_event_add', "", title,
              {//parametr
                  customerCode: customerCode_, formCode: formCode_, formId: formId_, saleId: saleId_, afterLoad: afterLoad_
              },
              {//dialog Property
                  width: 600, modal: true, minWidth: 600, height: 510, resizable: false,
                  open: function () { openDialog($(this)); }
              }, false, '.event-dialog', hideExtraSetting, function () {
                  dialog.hideLoading();
              });

}
/*******************************/

var sale_search_callback;
function show_sale_search(callback) {
    sale_search_callback = callback;
    if ($('#div_sale_search_quick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('searchSale', "", "", {},
              {//dialog Property
                  width: 800, modal: true, minWidth: 650,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_sale_search_uc();
    }
}

/**********************************/

function shareInSocialNetworks(customerid, fileurl, factorId) {
    if ($('.userControlShare').length == 0)  //agar ghablan uc ro load nakarde bod
        load_uc('ShareInSocialNetworks', "", "", { 'customerid': customerid, 'fileurl': fileurl, 'factorId': factorId }, { width: 450, modal: true, minWidth: 450, resizable: false, open: function () { openDialog($(this)); } });
    else shareInSocialNetworks_content(customerid, fileurl, false, factorId);
};
/**********************************/

function exportFileSetting(Selector, fileformat) {
    if ($(Selector).find('#UCdialog_ExportFileSetting').length == 0) {
        load_uc('ExportFileSetting', "", "", { 'fileformat': fileformat, 'Selector': Selector }, {}, false, Selector);
    }
    else
        exportfilesetting_content(fileformat, Selector);
};

/**********************************/
var doc_search_callback;
function show_doc_search(callback) {
    doc_search_callback = callback;
    if ($('#div_doc_search_quick').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('searchDoc', "", "", {},
              {//dialog Property
                  width: 800, modal: true, minWidth: 650,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        show_doc_search_uc();
    }
}


/**********************************/

function showProductInfo(ProductCode) {
    if ($('.userControlShowProductInfo').length == 0) {//if ghablan uc ro load nakarde bood
        load_uc('ShowProductInfo', "", "",
              {//parametr
                  'ProductCode': ProductCode
              },
              {//dialog Property
                  width: 800, modal: true, minWidth: 450, resizable: false,
                  open: function () { openDialog($(this)); }
              });
    }
    else {//agar ghablan load karde bood faghat function asli ra ejra kon
        showProductInfo_content(ProductCode, false);
    }
}

/******************************/

function rcrmShowTemplate(tempId, titledialog) {

    //var dialog = RaveshUI.showDialog({
    //    title: titledialog,
    //    allowMaximum: true,
    //    width: '75%',
    //    closeMethods: ['']
    //});
    //dialog.showLoading();

    //var e = {};
    //e.domain_ = $('#HFdomain').val();
    //e.id_ = tempId;
    //e.idfactor = 0;

    //$.ajax({
    //    url: "../WebServices/template_service.asmx/GetByID_FacTemplate",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    data: JSON.stringify(e),
    //    success: function (c) {
    //        var iTemplate = c.d[0];
    //        var htm = iTemplate.text;
    //        try {
    //            if ($('#rcrmHFAllSetting').length > 0) {
    //                var setting = eval('(' + $('#rcrmHFAllSetting').val() + ')');
    //                function rcrmNund_prviw(inputStr) { if (inputStr != null) return inputStr;  else return '' }
    //                var strF = htm;
    //                strF = strF.replace(/#F_currenttime#/gi, rcrmNund_prviw(setting.currenttime));
    //                strF = strF.replace(/#F_currentdate#/gi, rcrmNund_prviw(setting.currentdate));
    //                strF = strF.replace(/#F_date#/gi, rcrmNund_prviw(setting.currentdate));
    //                strF = strF.replace(/#F_unitprice#/gi, rcrmNund_prviw(setting.UnitPrice));
    //                strF = strF.replace(/#S_name#/gi, rcrmNund_prviw(setting.CompanyCommander));
    //                strF = strF.replace(/#S_companyname#/gi, rcrmNund_prviw(setting.CompanyName));
    //                strF = strF.replace(/#S_regnumber#/gi, rcrmNund_prviw(setting.RegNumber));
    //                strF = strF.replace(/#S_state#/gi, rcrmNund_prviw(setting.Province));
    //                strF = strF.replace(/#S_city#/gi, rcrmNund_prviw(setting.City));
    //                strF = strF.replace(/#S_address#/gi, rcrmNund_prviw(setting.CompanyAddress));
    //                strF = strF.replace(/#S_economicNumber#/gi, rcrmNund_prviw(setting.EconomicNumber));
    //                strF = strF.replace(/#S_zipcode#/gi, rcrmNund_prviw(setting.ZipCode));
    //                strF = strF.replace(/#S_phoneOrfax#/gi, rcrmNund_prviw(setting.CompanyTel));
    //                strF = strF.replace(/#S_fax#/gi, rcrmNund_prviw(setting.CompanyFax));
    //                strF = strF.replace(/#\w*#/gi, '').replace(/[$]\w*[$]/gi, '');
    //                htm = strF;
    //            }
    //        } catch (e) { }
    //        var Container = $('<iframe>').css({ 'overflow': 'hidden', 'padding': '15px', 'minHeight': '400px', 'width': '96%', 'visibility': 'hidden' }).attr('dir', 'rtl');
    //        dialog.setContent(Container);
    //        var head = Container.contents().find('head');
    //        var body = Container.contents().find('body');
    //        body.html(htm);
    //        var newTemp = body.find('#rcrm_document_main');
    //        if (newTemp.length > 0) {
    //            if (newTemp.attr('temptype') == undefined || newTemp.attr('temptype') == 'factor' || newTemp.attr('temptype') == 'sms_show' || newTemp.attr('temptype') == 'fax' || newTemp.attr('temptype') == 'Customer') {
    //                head.append('<link href="/Themes/resources/css/reportcrm.css" type="text/css" rel="stylesheet" /> <link href="/Themes/resources/css/icon.css" type="text/css" rel="stylesheet" />'); //' + resources.host_name + '
    //                var script1 = document.createElement("script");
    //                script1.src = '/Themes/resources/scripts/jquery-1.4.4.min.js'; //resources.host_name + 
    //                head[0].appendChild(script1);
    //                setTimeout(function () {
    //                    var script2 = document.createElement("script");
    //                    script2.src = '/Themes/resources/scripts/TemplateDesignPreview.js'; //resources.host_name + 
    //                    head[0].appendChild(script2);
    //                }, 200);
    //            }
    //        }
    //        setTimeout(function () {
    //            Container.height(body.parent().height() + 100);
    //            Container.css('visibility', '');
    //            dialog.hideLoading();
    //            body.addClass('rcrmPreviewContainer');
    //        }, 800, dialog);
    //    }
    //});
    //return false;
}

/******************************/

var addSaleDialogElem = null;
function AddSaleDialog(ProcessId, StageId, CustCode, CustName) {
    addSaleDialogElem = RaveshUI.showDialog({
        id: 'AddSaleDialogRavesh',
        title: '',
        width: 'auto',
        minWidth: 700,
        removeAfterClose: false,
        closeMethods: ['escape'],
        onClose: function () { $('body').removeClass('ravesh-dialog-opened') }
    });
    if ($('#UCdialog_AddSale').length == 0) {
        var container = $('<div>').addClass('form').css({ overflow: 'hidden', padding: '0' });
        var content = $('<div>').addClass('fields').appendTo(container);
        content.attr('id', 'UCdialog_AddSale').addClass('AddSaleContainer').data('data', { 'ProcessId': ProcessId, 'StageId': StageId, 'CustCode': CustCode, 'CustName': CustName })
        addSaleDialogElem.setContent(container);
        addSaleDialogElem.showLoading();
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), r: $('#HFRnd').val(), p: '', n: 'AddSale', m: '' };
        $.ajax({
            type: "POST",
            url: "../pages/Load_UserControl.aspx/Load_Control",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                addSaleDialogElem.hideLoading();
                content.html(c.d[1]);
                $('body').removeClass('ravesh-dialog-opened').addClass('ravesh-dialog-opened');
            }
        });
    }
    else { $('body').removeClass('ravesh-dialog-opened').addClass('ravesh-dialog-opened'); AddSale_content(ProcessId, StageId, CustCode, CustName, false); }
}

/******************************/

var saleSettingDialogElem = null;
function LoadSaleSettingControl(Controlnme, minWidth, title) {
    if (!(window.location.href.toLowerCase().includes('salereport.aspx') || window.location.href.toLowerCase().includes('sale.aspx'))) { localStorage["SaleSettingControlInfo" + $('#HFdomain').val()] = JSON.stringify({ Controlnme: Controlnme, minWidth: minWidth, title: title }); window.location = "Sale.aspx?rnd_=" + $("#HFRnd").val(); }
    else {
        if (minWidth == undefined) minWidth = 800;
        if (title == undefined) title = '';
        saleSettingDialogElem = RaveshUI.showDialog({
            id: 'saleSettingDialogRavesh',
            title: title,
            width: minWidth,
            minWidth: minWidth,
            closeMethods: ['escape'],
            removeAfterClose: true
        });
        var container = $('<div>').addClass('form').css({ overflow: 'hidden', padding: '0' });
        var content = $('<div>').addClass('fields').appendTo(container);
        content.attr('id', 'UCdialog_saleSetting').addClass('saleSettingContainer').css('min-height', '450px');
        saleSettingDialogElem.setContent(container);
        saleSettingDialogElem.showLoading();
        var e = { n: Controlnme, u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '~/controls/Sale/', r: $('#HFRnd').val() };
        $.ajax({
            type: "POST",
            url: "Load_UserControl.aspx/Load_Control",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(e),
            success: function (c) {
                saleSettingDialogElem.hideLoading();
                content.html(c.d[1]);
            }
        });
    }
};

function checkAutoSaleSettings() { if ($('#HFUserCode').val() != 'master') $(".mnu-AutoSaleSettings").hide() };
