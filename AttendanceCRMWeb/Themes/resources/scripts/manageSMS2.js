//---------------------------------------------------------------------------------------------------------
//-- global variables
//---------------------------------------------------------------------------------------------------------
var mainBlackList = []; //array of object{tel:"",name:"",customerCode:""}
var mainList = []; //array of object{tel:"",name:"",customerCode:""}
var tmpList = []; //array of object{tel:"",name:"",customerCode:""}
var mainGroupList = [];
var tmpGroupList = [];

function Group() {
    this.name = "";
    this.id = "";
}

function recepient() {
    this.tel = "";
    this.name = "";
    this.customerCode = ""
}

var resources = {};
var customizeItems = {};
var requestedid;
var pageSize;

var global = {};
var dialogMessage;

var debug = false; // if sets true then error messages will show
var init = true;

var CurrentPage = 1;
var AllRowsCount = 0;

var currentExcelFile = "";
var currentExcelFileSheet = "";
var currentExcelFileContent = null;


var excelFieldChanged = false;
var excelFieldTel_lastValue = "";
var excelFieldName_lastValue = "";
var excelFieldCustomerCode_lastValue = "";

var mainContainer;

//---------------------------------------------------------------------------------------------------------
function fillInfoDiagramPlace(curChart, tmpSAP, me) {
    var texts = resources.smsStatus;
    var datas = [me.attr("total"), me.attr("sent"), me.attr("total") - me.attr("sent"), me.attr("delivered"), me.attr("notDelivered"), me.attr("comunicationError"), me.attr("otherError")];
    var datasId = [[-1, -1], [1, -1], [0, -1], [1, 1], [1, 2], [1, 3], [-1, 4]];
    var datasPercent = [0, 0, 0, 0, 0];
    var curitem = null;
    for (var j = 0; j < datas.length; j++) {
        datasPercent[j] = datas[j] * 275 / datas[0];
        curitem = curChart.find(".statusDiagram.item" + j);
        //(j==0?20:(j==1 || j==2)?10:5)+
        //(j == 0 ? 20 : (j == 1 || j == 2) ? 10 : 5) +

        curitem
                            .css("width", datasPercent[j] + "px")
                            .attr("title", texts[j] + "  " + datas[j])
                            .html((datas[j] == 0 ? "" : texts[j] + "  " + datas[j]));
        if (curitem.attr("clickBinded") == undefined) {
            curitem.attr("clickBinded", true).click(Function("Async.getStatusDetails_(" + me.attr("packid") + "," + datasId[j][0] + "," + datasId[j][1] + ");"));
        }




        //e = curChart.find(".chartHelpText")[j];
        //$(e).html(texts[j] + "  " + datas[j]);

    }

    tmpSAP.find(".reportAccountEn").html(me.attr("en_account"));
    tmpSAP.find(".reportSentPageEn").html(me.attr("en_sent_page"));
    tmpSAP.find(".reportSentSMSEn").html(me.attr("en_sent_sms"));
    tmpSAP.css("font-size", "12px");
    tmpSAP.find(".reportAccountFa").html(me.attr("fa_account"));
    tmpSAP.find(".reportSentPageFa").html(me.attr("fa_sent_page"));
    tmpSAP.find(".reportSentSMSFa").html(me.attr("fa_sent_sms"));

    curChart.find(".accountPlace").append(tmpSAP);
    curChart.find(".SMSBodyInstance").html(me.attr("body").replace(/\n/g, "<br/>")).changDirection(me.attr("body"));
}

function addAttrToInf(inf, datas) {
    inf.attr("total", datas.Total);
    inf.attr("sent", datas.Sent);
    inf.attr("delivered", datas.StatusDelivered);
    inf.attr("notDelivered", datas.StatusNotDelivered);
    inf.attr("comunicationError", datas.StatusComunicationError);
    inf.attr("otherError", datas.StatusOtherError);

    inf.attr("subject", datas.Subject);

    inf.attr("packId", datas.Id);

    inf.attr("en_account", datas.EnAccount);
    inf.attr("en_sent_page", datas.EnPagesSent);
    inf.attr("en_sent_sms", datas.EnSMSSent);

    inf.attr("fa_account", datas.FaAccount);
    inf.attr("fa_sent_page", datas.FaPagesSent);
    inf.attr("fa_sent_sms", datas.FaSMSSent);

    inf.attr("body", datas.SMSBody);


    inf.attr("title", resources.packOptionsText[3]);
}
//---------------------------------------------------------------------------------------------------------
//-- global functions that used in recipients manuplating
//---------------------------------------------------------------------------------------------------------
function clearList(list_) {

    list_.length = 0;
    check_chkSyncTelAndUserCodes();
}
function check_chkSyncTelAndUserCodes() {
    var hasVariable = false;
    for (var i = 0; i <= resources.variablesArr.length - 1; i++) {
        var match = $("#txt_sms_body").val().match(resources.variablesArr[i]);
        if (match) {
            hasVariable = true;
            break;
        }
    }


    var c = $("#syncTelAndUserCodes");

    if (hasVariable) {
        for (var i = 0; i < mainList.length; i++) {
            if (mainList[i].customerCode == "0") {
                c.show();
                $(c.find("#chkSyncTelAndUserCodes_0").find("input")[0])
                .attr("checked", false);
                c.find("#chkSyncTelAndUserCodes_1").hide();
                return;
            }
        }
    }

    c.hide();

}

function appendTelTag(obj_, customerCode_, name_, tel_, list_, deleteOperation_) {
    if (isDuplicate(tel_, list_) || !isValidNumberForSend(tel_)) {
        return false;
    }
    tel_ = getCorrectTelNo(tel_);
    var t = $("#telTag")
                        .clone()
                        .removeAttr("id")
                        .attr("title", (name_ == "" ? "" : name_ + "\n" + tel_))
                        .attr("tel", tel_)
                        .addClass((customerCode_ != "0" && customerCode_ != "")?"":"hasNotCustomerCode")
                        .click(function () {
                            if (customerCode_ != "0" && customerCode_ != "") {
                                customer_Show_Info(customerCode_, name_);
                            }
                        });

    if (deleteOperation_ == undefined) {
        t.find(".delete")
                .click(function () {
                    $(this).parent().remove();
                    removeFromList(list_, tel_);
                    getForm(true);
                });

    } else {
        t.find(".delete")
                .click(function () {
                    $(this).parent().remove();
                    removeFromList(list_, tel_);
                    deleteOperation_(customerCode_);
                    getForm(true);

                });

    }
    t.find(".content")
                .attr("userName", name_)
                .attr("userTel", tel_)
                .html(name_ == "" ? tel_ : name_);


    obj_.append(t);

    var i = new recepient();
    i.name = name_;
    i.tel = tel_;
    i.customerCode = (customerCode_ == "" ? "0" : customerCode_);
    list_.push(i);
    if (list_ == mainList && list_.length == 1) {
        getForm(true);
    }
    check_chkSyncTelAndUserCodes();

    return true;
}
function appendTmpListToMain() {

    for (var i = 0; i < tmpList.length; i++) {
        appendTelTag(mainContainer, tmpList[i].customerCode, tmpList[i].name, tmpList[i].tel, mainList);
    }

}
function removeFromList(list_, tel_) {

    var i = getIndexInList(list_, tel_);
    if (i != -1) {
        list_.splice(i, 1);
        check_chkSyncTelAndUserCodes();
    }
}
function getIndexInList(list_, tel_) {
    for (var i = 0; i < list_.length; i++) {

        if (list_[i].tel == tel_) {

            return i;
        }
    }
    return -1;
}
function isDuplicate(tel_, list_) {
    if (list_ == undefined) {
        if (getIndexInList(tmpList, getCorrectTelNo(tel_)) != -1) {
            return true;
        }
        if (getIndexInList(mainList, getCorrectTelNo(tel_)) != -1) {
            return true;
        }
    } else {
        if (getIndexInList(list_, getCorrectTelNo(tel_)) != -1) {
            return true;
        }
    }

    return false;
}
function isEmpty(tel_) {
    if (tel_.replace(" ", "") == "") {
        return true;
    }
    else {
        return false;
    }
}

//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//-- initialize 
//---------------------------------------------------------------------------------------------------------
function initSMSCustomization() {
    var obj = $("#SMSCustomization");
    $("#btnSMSCustomization").click(function () {
        var pos = $(this).offset();
        obj.css({
            left: pos.left - obj.width() + 202,
            top: pos.top
        }).attr("initializing", true).slideToggle(function () {
            $(this).attr("initializing", false);
        });
    });

    obj.html("");
    for (var i = 0; i < customizeItems.categories.length; i++) {
        obj.append($("<div></div>")
            .html(customizeItems.categories[i].name)
            .addClass("SMSCustomizationCategory")
            );
        for (var j = 0; j < customizeItems.categories[i].values.length; j++) {
            var d = $("<div></div>").html(
                    $("#SMSCustomizationRow")
                        .clone()
                        .removeAttr("id")
                        .attr("value", customizeItems.categories[i].values[j].value)
                        .click(
                            function () {
                                $("#txt_sms_body").insertAtCaret("#" + $(this).attr("value") + "#");
                                showBodyTips();
                                $("#SMSCustomization").slideUp();
                            }
                        )
                );
            d.find(".SMSCustomizationText")
                    .html(customizeItems.categories[i].values[j].text);

            obj.append(d);
        }
    }
}
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//-- Paging functions
//---------------------------------------------------------------------------------------------------------
function PagingSelectedIndexChange(page_id, jq) {

    if (AllRowsCount == 0) {
        $("#SearchresultSMSPack").text("");
    }
    else {
        $("#SearchresultSMSPack").text(resources.result_search + " " + resources.from + " " + ((page_id * pageSize) + 1) + "  " + resources.until + "  " + (((page_id * pageSize) + pageSize) >= AllRowsCount ? AllRowsCount : ((page_id * pageSize) + pageSize)) + " " + " (" + AllRowsCount + ")");
    }
    Async.getSMSPacksList_(page_id + 1);
    return false;
}

function InitPaging() {

    var opt = { callback: PagingSelectedIndexChange };
    opt.items_per_page = pageSize;
    opt.num_display_entries = 10;
    opt.num_edge_entries = 0;
    opt.next_text = ">";
    opt.prev_text = "<";
    if (AllRowsCount == 0) {
        $("#SearchresultSMSPack").text("");
    }
    else {
        $("#SearchresultSMSPack").text(resources.result_search + " " + resources.from + " " + 1 + "  " + resources.until + "  " + (pageSize >= AllRowsCount ? AllRowsCount : pageSize) + " (" + AllRowsCount + ")");
    }
    //$("#PaginationSMSPack").pagination(1000, opt);
    $("#PaginationSMSPack").pagination(AllRowsCount, opt);
}
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//-- show pack data for (insert / edit / instance)
//---------------------------------------------------------------------------------------------------------
function showPack(id, isCopy) {
    $("#SMSPacksListContainer").fadeOut("fast", function () {
        if (id == 0) {
            clearList(mainList);
            clearList(tmpList);
            clearList(tmpGroupList);
            clearList(mainGroupList);
            $("#send_time_0").attr("checked", true);
            $("#send_time_1").removeAttr("checked");
            var form = {
                smstext: $("#txt_sms_body"),
                smstitle: $("#sms_title"),
                smssender: $("#selectSender"),
                smstype: $("#sms_recieve_type_0").is(":checked") ? 0 : 1,
                smsmaxsend: $("#txt_max_send")
            };
            form.smstext.val("");
            form.smstitle.val("");
            form.smsmaxsend.val("0");
            $("#selectTemplate").val("");
            mainContainer.html("");
            $("#tmpGroupPlace").html("");

        }
        getForm(true);
        $("#SMSPack").fadeIn("fast", function () {

        });

    });



}
//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//-- Calculates "Charachters count" & "SMS Pages Count" & "SMS language" and shows them
//---------------------------------------------------------------------------------------------------------

function showBodyTips() {
    var txtsmsbody = $("#txt_sms_body");
    var smsbody = txtsmsbody.val();
    var smsbodylength = smsbody.length;

    var hasVariable = false;
    var hasUnicodeChar = false;

    for (var i = 0; i <= resources.variablesArr.length - 1; i++) {
        var match = smsbody.match(resources.variablesArr[i]);
        if (match) {
            hasVariable = true;
            break;
        }
    }

    for (var i = 0; i < smsbodylength; ++i) {
        if (smsbody.charCodeAt(i) >= 256) {
            hasUnicodeChar = true;
            break;
        }
    }


    if (hasUnicodeChar) {
        if (smsbodylength <= 70) {
            max_count = 70;
        } else {
            max_count = 67;
        }
        c = Math.ceil(smsbodylength / max_count);

        $("#sms_type").val(resources.textLanguages[0]);
        txtsmsbody.css("direction", "rtl");
    } else {
        if (smsbodylength <= 160) {
            max_count = 160;
        } else {
            max_count = 153;
        }
        c = Math.ceil(smsbodylength / max_count);

        $("#sms_type").val(resources.textLanguages[1]);
        txtsmsbody.css("direction", "ltr");
    }
    $("#sms_type").css("color", "black");



    if (((c * max_count) - 5) < smsbodylength) {
        $("#sms_num_char").css("color", "red");
        $("#sms_num_page").css("color", "blue");
    } else {
        $("#sms_num_char").css("color", "black");
        $("#sms_num_page").css("color", "black");
    }
    if (smsbodylength == 0) {
        $("#sms_num_char").val("");
        $("#sms_num_page").val("");
        $("#sms_type").val("");
    } else {
        $("#sms_num_char").val(smsbodylength.toString() + " / " + (c * max_count).toString());
        $("#sms_num_page").val(c);
    }

    if (hasVariable == true) {
        if (hasUnicodeChar) {
            $("#sms_type").val(resources.textLanguages[0]);
            $("#sms_type").css("color", "black");
        } else {
            $("#sms_type").val(resources.textLanguages[2]);
            $("#sms_type").css("color", "blue");
        }
        $("#sms_num_char").val(resources.textLanguages[2]);
        $("#sms_num_page").val(resources.textLanguages[2]);

        $("#sms_num_char").css("color", "blue");
        $("#sms_num_page").css("color", "blue");

    }
    check_chkSyncTelAndUserCodes();

}
//---------------------------------------------------------------------------------------------------------


function getForm(validate) {


    var formElements = {
        hasError: false,
        errorCSSClassName: "error",
        isscheduled: $("#send_time_1").is(":checked"),
        scheduledata: $("#HFSchData_SMS"),
        smstext: $("#txt_sms_body"),
        smstitle: $("#sms_title"),
        smssender: $("#selectSender"),
        smstype: $("#sms_recieve_type_0").is(":checked") ? 0 : 1,
        smsmaxsend: $("#txt_max_send")


    };

    $.each([formElements.smstext, formElements.smstitle, formElements.smssender, formElements.smsmaxsend], function (i, obj) {
        if (obj.attr("isValidationFunctionBinded") == undefined) {
            obj.blur(function () {
                getForm(true);
            });
            obj.keyup(function () {
                getForm(true);
            });
            obj.attr("isValidationFunctionBinded", true);
        }
    });

    if ((mainList.length == 0 && mainGroupList == 0) && validate) {
        mainContainer.addClass(formElements.errorCSSClassName);
        formElements.hasError = true;
    } else {
        mainContainer.removeClass(formElements.errorCSSClassName)
    }

    if (formElements.smstext.val() == "" && validate) {
        formElements.smstext.addClass(formElements.errorCSSClassName);
        formElements.hasError = true;
    } else {
        formElements.smstext.removeClass(formElements.errorCSSClassName)
    }

    if (formElements.smstitle.val() == "" && validate) {
        formElements.smstitle.addClass(formElements.errorCSSClassName);
        formElements.hasError = true;
    } else {
        formElements.smstitle.removeClass(formElements.errorCSSClassName)
    }

    if (formElements.smssender.val() == "" && validate) {
        formElements.smssender.addClass(formElements.errorCSSClassName);
        formElements.hasError = true;
    } else {
        formElements.smssender.removeClass(formElements.errorCSSClassName)
    }

    if (formElements.smsmaxsend.val() == "" && validate) {
        formElements.smsmaxsend.addClass(formElements.errorCSSClassName);
        formElements.hasError = true;
    } else {
        formElements.smsmaxsend.removeClass(formElements.errorCSSClassName)
    }

    return formElements;
}
function changeFormState(state) {
    // state :
    // true  : enables  form
    // false : disables form

    if (state == true) {
        $("#selectTemplate").removeAttr("disabled");
        $("#txt_sms_body").removeAttr("disabled");
        $("#btnSMSCustomization").show();
        $("#SMSCheckAccount").show();
        $("#btn_send_sms").show();
        $("#btn_save_sms").show();
        $("#RecipientListAdd,#RecipientListSearch,#RecipientListText,#RecipientListExcel,#RecipientListGroup").show();
        $("#sms_recieve_type_0,#sms_recieve_type_1").removeAttr("disabled");
        $("#send_time_0,#send_time_1").removeAttr("disabled");
        $("#syncTelAndUserCodes").find("input").removeAttr("disabled");
        $("#sms_title").removeAttr("disabled");
        $("#selectSender").removeAttr("disabled");
        $("#DivSchData").removeAttr("disabled");
        $("#txt_max_send").removeAttr("disabled");

        $("#DivSchData").html("");
        //$('#<%=HFSchData.ClientID %>').val("");
        ScheduleInfo.data = [];

    } else {

        $("#selectTemplate").attr("disabled", true);
        $("#txt_sms_body").attr("disabled", true);
        $("#btnSMSCustomization").hide();
        $("#SMSCheckAccount").hide();
        $("#btn_send_sms").hide();
        $("#btn_save_sms").hide();
        $("#smsNumbers").find(".delete").remove();
        $("#RecipientListAdd,#RecipientListSearch,#RecipientListText,#RecipientListExcel,#RecipientListGroup").hide();
        $("#sms_recieve_type_0,#sms_recieve_type_1").attr("disabled", true);
        $("#send_time_0,#send_time_1").attr("disabled", true);
        $("#syncTelAndUserCodes").find("input").attr("disabled", true);
        $("#sms_title").attr("disabled", true);
        $("#selectSender").attr("disabled", true);
        $("#DivSchData").attr("disabled", true);
        $("#txt_max_send").attr("disabled", true);
    }

}
//---------------------------------------------------------------------------------------------------------
//-- get data by ajax from server (Async Functions)
//---------------------------------------------------------------------------------------------------------
function checkMask(xhr) {
    if (xhr.containerObj == null)
        return;
    if (xhr.containerMask == true) {

        xhr.containerObj.mask("...");

    } else {
        xhr.containerObj.unmask();
    }
}
function AsyncFunctions() {
    this.GetData = function (p) {

        //opname_, params_, successFunc_, container_
        //RequestStarted();
        params = JSON.stringify(p.params_);

        var ret = $.ajax({
            type: "POST",
            //url: "../WebServices/SMS2mgr.asmx/" + Async.getFunctionName(cee),
            url: "../WebServices/SMS2mgr.asmx/" + p.opname_,
            data: params,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (a, b, c) {
                c.containerMask = false;
                checkMask(c);

                if (p.successFunc_ != undefined && typeof (p.successFunc_) == "function") {
                    p.successFunc_(a, b, c);
                }
            },
            error: function (xhr, err, ex) {

                if (debug == true) {
                    dialogMessage.msgbox({ title: err, text: xhr.responseText, width: 400, height: 230 });
                }
            }
        });
        ret.containerObj = (p.container_ == undefined ? null : p.container_);
        ret.containerMask = true;

        checkMask(ret);
    };
    //--calculates account before send or save
    this.calculate_ = function (for_) {
        var obj = getForm(true);
        if (obj.hasError) {
            dialogMessage.msgbox({ text: resources.calculateErrMessage, width: 400, height: 300, title: "error" });
            return;
        }

        var params = { items: global };

        params.items.isscheduled = obj.isscheduled;
        params.items.smstext = obj.smstext.val();
        params.items.smstitle = obj.smstitle.val();
        params.items.smssender = obj.smssender.val();
        params.items.smstype = obj.smstype;
        params.items.smsmaxsend = obj.smsmaxsend.val();
        params.items.recepients = mainList;
        params.items.smssync0 = $($("#chkSyncTelAndUserCodes_0").find("input")[0]).attr("checked");
        params.items.smssync1 = (params.items.smssync0 == false ? false : $($("#chkSyncTelAndUserCodes_1").find("input")[0]).attr("checked"));
        params.items.groups = mainGroupList;
        var container = $("#SMSCheckAccountTemplate");
        container.find(".sendFinal").hide();
        container.find(".saveFinal").hide();
        container.find(".sendTillAccount").hide();
        container.find(".packTotalConsumingInfo").hide();
        container.find(".enPricePerEach").html("");
        container.find(".faPricePerEach").html("");

        container.find(".accountAfterSend").html("");
        container.find(".accountBeforeSend").html("");
        container.find(".enPrice").html("");
        container.find(".faPrice").html("");

        container.find(".enSMSCount").html("");
        container.find(".faSMSCount").html("");

        container.find(".enPagesCount").html("");
        container.find(".faPagesCount").html("");

        container.find(".SMSProtoType").html("");

        container.msgbox({
            //title: $(this).attr("title"),
            width: 400,
            height: 440

        });

        Async.GetData({opname_:"calculate_", params_:params, successFunc_:function (retObj, str, xhr) {
            var container = $("#SMSCheckAccountTemplate");
            if (retObj.d == false) {
                container.dialog("close");
                return;
            }
            //alert(xhr.responseText);

            var info = retObj.d[0];
            var SMSProtoType = retObj.d[1].replace(/\n/g, "<br/>");
            var SMSPricePerEach = retObj.d[2];
            var sendVia = retObj.d[3];
            var calcAccountInFarsicom = (sendVia.toLowerCase() == "magfa" ? true : false);

            switch (for_) {
                case "account":

                    container.find(".sendFinal").hide();
                    container.find(".saveFinal").hide();
                    container.find(".sendTillAccount").hide();
                    container.find(".packTotalConsumingInfo").show();
                    break;
                case "save":
                    container.find(".sendFinal").hide();
                    container.find(".saveFinal").show();
                    container.find(".sendTillAccount").hide();
                    container.find(".packTotalConsumingInfo").hide();
                    break;
                case "send":
                    if (calcAccountInFarsicom) {
                        if (info.TotalAccountBeforeSend <= 0 || info.TotalAccountBeforeSend == info.TotalAccountAfterSend) {
                            container.find(".sendFinal").hide();
                            container.find(".saveFinal").hide();
                            container.find(".sendTillAccount").hide();
                        } else {
                            if (info.TotalAccountAfterSend < 0) {
                                container.find(".sendFinal").hide();
                                container.find(".saveFinal").hide();
                                container.find(".sendTillAccount").show();
                            }


                            if (info.TotalAccountAfterSend >= 0) {
                                container.find(".sendFinal").show();
                                container.find(".saveFinal").hide();
                                container.find(".sendTillAccount").hide();
                            }
                        }
                    } else {
                        if (info.TotalAccountBeforeSend > 0) {
                            container.find(".sendFinal").show();
                            container.find(".saveFinal").hide();
                            container.find(".sendTillAccount").hide();
                        } else {
                            container.find(".sendFinal").hide();
                            container.find(".saveFinal").hide();
                            container.find(".sendTillAccount").hide();
                        }
                    }
                    container.find(".packTotalConsumingInfo").show();
                    break;
                default:
                    return;
            }



            //if (calcAccountInFarsicom) {
            container.find(".enPrice").html(info.TotalENPrice);
            container.find(".faPrice").html(info.TotalFAPrice);

            container.find(".enPricePerEach").html(SMSPricePerEach.EN);
            container.find(".faPricePerEach").html(SMSPricePerEach.FA);

            container.find(".accountAfterSend").html(info.TotalAccountAfterSend);
            container.find(".accountBeforeSend").html(info.TotalAccountBeforeSend);

            /*} else {
            container.find(".enPrice").html("---");
            container.find(".faPrice").html("---");

            container.find(".enPricePerEach").html("---");
            container.find(".faPricePerEach").html("---");

            container.find(".accountAfterSend").html("---");
            //container.find(".accountBeforeSend").html("---");
            container.find(".accountBeforeSend").html(info.TotalAccountBeforeSend);
            }*/
            container.find(".enSMSCount").html(info.TotalENSMSCount);
            container.find(".faSMSCount").html(info.TotalFASMSCount);

            container.find(".enPagesCount").html(info.TotalENPagesCount);
            container.find(".faPagesCount").html(info.TotalFAPagesCount);

            container.find(".SMSProtoType").html(SMSProtoType).changDirection(SMSProtoType);



        }, container_:container} );
    }

    this.deleteCurrentPackStatus_ = function (packId_) {
        var params = { items: global };

        params.items.packId = packId_;
        Async.GetData({opname_:"deleteCurrentPackStatus_", params_:params, successFunc_:function (retObj, str, xhr) {
            if (retObj.d == true) {
            } else {
            }
        }} );
    }

 
    this.getStatusDetails_ = function (id_, status_, endstatus_, c_) {
        var params = { items: global };
        params.items.id = id_;
        params.items.status = status_;
        params.items.endstatus = endstatus_;
        Async.GetData({
            opname_: "getStatusDetails_", params_: params, successFunc_: function (retObj, str, xhr) {
                var tmpISUSSMS = isUSSMS;
            var xx = $("#tmpMsgBox").clone().removeAttr("id");
            xx.msgbox({ width: 300, height: 300 });
            var l = new Array();
            for (var i = 0; i < retObj.d.length; i++) {
                if (!isValidNumberForSend(retObj.d[i].Tel)) {
                    isUSSMS = !isUSSMS;
                }
                appendTelTag(xx, retObj.d[i].customer_code, "", retObj.d[i].Tel, l);
            }
            isUSSMS = tmpISUSSMS;
            //alert(xhr.responseText);
        }, container_:c_} );
    }


    //--save package
    this.save_ = function () {
        var obj = getForm(true);
        if (obj.hasError)
            return;

        var params = { items: global };

        setSchToHF("#" + obj.scheduledata.attr("id"));
        params.items.isscheduled = obj.isscheduled;
        params.items.smstext = obj.smstext.val();
        params.items.smstitle = obj.smstitle.val();
        params.items.smssender = obj.smssender.val();
        params.items.smstype = obj.smstype;
        params.items.smsmaxsend = obj.smsmaxsend.val();
        params.items.recepients = mainList;
        params.items.scheduledata = obj.scheduledata.val();

        params.items.smssync0 = $($("#chkSyncTelAndUserCodes_0").find("input")[0]).attr("checked");
        params.items.smssync1 = (params.items.smssync0 == false ? false : $($("#chkSyncTelAndUserCodes_1").find("input")[0]).attr("checked"));

        Async.GetData({opname_:"save_", params_:params, successFunc_: function (retObj, str, xhr) {
            if (retObj.d != -1) {
                Async.getSMSPacksList_(1);
                //PagingSelectedIndexChange(0);
                $("#SMSCheckAccountTemplate").dialog("close");
                $("#returnBtn").click();

            }
        }, container_:$("#SMSCheckAccountTemplate")} );
    }
    this.getExcel_ = function () {
        var params = { items: global };
        params.items.id = -1;
        params.items.searchStr = $("#txtSearchSMSPack").val();
        params.items.searchCondition =
        ($("#searchCondition1").is(":checked") ? 1 : 0) +
        ($("#searchCondition2").is(":checked") ? 2 : 0) +
        ($("#searchCondition4").is(":checked") ? 4 : 0) +
        ($("#searchCondition8").is(":checked") ? 8 : 0) +
        ($("#searchCondition16").is(":checked") ? 16 : 0) +
        ($("#searchCondition32").is(":checked") ? 32 : 0) +
        ($("#searchCondition64").is(":checked") ? 64 : 0);
        params.items.dateFrom = $("#searchSMSDateFrom").val();
        params.items.dateTo = $("#searchSMSDateTo").val();

        Async.GetData({opname_:"getExcel_", params_:params, successFunc_:function (retObj, str, xhr) {
            location.href = retObj.d;
        }, container_:$("#right")} );
    }


    //--send package
    this.send_ = function (sendTillAccount_) {

        var obj = getForm(true);
        if (obj.hasError)
            return;

        var params = { items: global };

        setSchToHF("#" + obj.scheduledata.attr("id"));

        params.items.isscheduled = obj.isscheduled;
        params.items.smstext = obj.smstext.val();
        params.items.smstitle = obj.smstitle.val();
        params.items.smssender = obj.smssender.val();
        params.items.smstype = obj.smstype;
        params.items.smsmaxsend = obj.smsmaxsend.val();
        params.items.recepients = mainList;
        params.items.smssendtillaccount = sendTillAccount_;
        params.items.scheduledata = obj.scheduledata.val();

        params.items.smssync0 = $($("#chkSyncTelAndUserCodes_0").find("input")[0]).attr("checked");
        params.items.smssync1 = (params.items.smssync0 == false ? false : $($("#chkSyncTelAndUserCodes_1").find("input")[0]).attr("checked")); ;

        Async.GetData({opname_:"send_", params_:params, successFunc_:function (retObj, str, xhr) {

            if (retObj.d != -1) {
                Async.getSMSPacksList_(1);
                //PagingSelectedIndexChange(0);
                $("#SMSPacksList").html("");
                $("#SMSCheckAccountTemplate").dialog("close");
                $("#returnBtn").click();

                



            }

           

        }, container_: $("#SMSCheckAccountTemplate")} );
    }


    //--delete pack
    this.delete_ = function (id_, container_, callback_) {
        var params = { items: global };
        params.items.id = id_;
        Async.GetData({opname_:"delete_", params_:params, successFunc_:callback_, container_:container_} );
    };

    /* 

    //--Quick Send By sending template Id
    this.quickSendTemplate_ = function quickSendTemplate_(senderId_, tel_, templateId_, customerCode_, callback_, title_, container_) {



    var params = { items: global };


    params.items.senderId = senderId_;
    params.items.tel = tel_;
    params.items.templateId = templateId_;
    params.items.customerCode = customerCode_;
    params.items.title = title_;

    Async.GetData(arguments.callee, params, callback_, container_);
    }
    */
    //--fill comboboxes by ajax

    
    this.FillSelect = function (opname, select, params) {
        Async.GetData({
            opname_: opname, params_: params, successFunc_: $.proxy(function (retObj, str, xhr) {
            var s = $(this);
            s.html("");
            $.each(retObj.d, function (index, obj) {
                s.append("<option value=\"" + obj.Value + "\">" + obj.Text + "</option>");
            });

        }, select)});

    };
    //-- load list of sms packs for current user
    this.getSMSPacksList_ = function (page) {
        CurrentPage = page != undefined ? page : CurrentPage;
        var params = { items: global };
        params.items.id = -1;
        params.items.searchStr = $("#txtSearchSMSPack").val();
        params.items.searchCondition =
        ($("#searchCondition1").is(":checked") ? 1 : 0) +
        ($("#searchCondition2").is(":checked") ? 2 : 0) +
        ($("#searchCondition4").is(":checked") ? 4 : 0) +
        ($("#searchCondition8").is(":checked") ? 8 : 0) +
        ($("#searchCondition16").is(":checked") ? 16 : 0) +
        ($("#searchCondition32").is(":checked") ? 32 : 0) +
        ($("#searchCondition64").is(":checked") ? 64 : 0);
        params.items.Page = CurrentPage;
        params.items.dateFrom = $("#searchSMSDateFrom").val();
        params.items.dateTo = $("#searchSMSDateTo").val();

        params.items.PageSize = pageSize;
        Async.GetData({opname_: "getSMSPacksList_", params_: params, successFunc_: function (retObj, str, xhr) {





            if (retObj.d.length > 0) {

                AllRowsCount = retObj.d[0].AllRowsCount;
                if (init || page == 1) {
                    InitPaging();
                    init = false;
                }
            } else {
                AllRowsCount = 0;
                InitPaging();
            }

            $("#SMSPacksList").html("");



            for (var i = 0; i < retObj.d.length; i++) {


                curPack = $("#SMSPackElement")
                        .clone()
                        .removeAttr("id")
                        .attr("SMSPackId", retObj.d[i].Id);
                curPack.css("display", "inline-block");
                curPack.find(".SMSPackElementSubject").html(retObj.d[i].Subject);
                curPack.find(".SMSPackElementSubject").attr("title", retObj.d[i].Subject);
                //curPack.find(".Mode").html(retObj.d[i].Mode);
                curPack.find(".owner").html(global.user_code == "master" ? resources.owner + " : " + retObj.d[i].Owner : "");


                //curPack.find(".SMSPackStatusIcon")
                 //   .css("background-color", retObj.d[i].ModeColor)
                //   .attr("title", retObj.d[i].Mode);

                curPack.find(".SMSPackElementStatus")
                    .attr("title", retObj.d[i].SMSBody)
                    .html(retObj.d[i].SMSBody);
                                    
                var rcpt = eval("[" + retObj.d[i].Recipient.replace(/@@@@/g, ",") + "]");
                if (rcpt.length > 1) {
                    appendTelTag(curPack.find(".rcpt"), rcpt[0], rcpt[1], rcpt[2],[]);
                } else {
                    if (rcpt.length != 0) {
                        appendTelTag(curPack.find(".rcpt"), 0, "", rcpt[0], []);
                    }
                   
                }

                curPack.find(".rcpt .ui-icon-close").remove();
                curPack.find(".rcpt .telTag")
                    .addClass("SMSPackStatusIcon")
                    .css("background-color", retObj.d[i].ModeColor)
                    .attr("title", retObj.d[i].Mode)
                    .removeClass("telTag")
                if (retObj.d[i].Total > 1)
                {
                    curPack.find(".rcpt").append($("<span></span>").attr("myparentPackId", retObj.d[i].Id).html(" ... ").click(function () {
                        $("[SMSPackId="+$(this).attr("myparentPackId")+"]").find(".SMSPackIcon.info").click();

                    }));

                }
                

                curPack.find(".SMSPackElementCreateDate").html(retObj.d[i].CreateDate + " " + retObj.d[i].CreateTime);
                curPack.find(".SMSPackElementSender").html(retObj.d[i].SenderName).attr("title", retObj.d[i].SenderNumber).css({
                    "background-color": retObj.d[i].ModeColor,
                    "min-width": curPack.find(".rcpt .telTag").width()  

                });
                var inf = curPack.find(".SMSPackIcon.info");
                addAttrToInf(inf, retObj.d[i]);
                inf.click(function () {
                    var me = $(this);
                    var curChart = $("#statusDiagram").clone().removeAttr("id");
                    var tmpSAP = $("#smallAccountPlace").clone().removeAttr("id");
                    fillInfoDiagramPlace(curChart, tmpSAP, me);

                    curChart.find(".Crm-icon-refresh2-black").click(function () {
                        Async.refrehStatus_(me.attr("packId"), curChart.find(".statusDiagramContainer"), function (retObj, str, xhr) {

                            addAttrToInf(me, retObj.d);
                            fillInfoDiagramPlace(curChart, tmpSAP, me);

                        });
                    });


                    curChart.msgbox({ width: 475, height: "auto", title: me.attr("subject") });
                });

                var edt = curPack.find(".SMSPackIcon.edit");
                edt.attr("packid", retObj.d[i].Id);
                if (retObj.d[i].Editable == true && global.user_code == retObj.d[i].Owner) {
                    edt.find(".icon_infomenu")
                        .removeClass("ui-icon-document")
                        .addClass("ui-icon-pencil");
                    edt.click(function () {
                        Async.SMSPackEdit_($(this).attr("packid"), true, false, true)
                    })
                    .attr("title", resources.packOptionsText[1]);
                } else {
                    edt.find(".icon_infomenu")
                        .removeClass("ui-icon-pencil")
                        .addClass("ui-icon-document");

                    edt.click(function () {
                        Async.SMSPackEdit_($(this).attr("packid"), true, false, false)
                    })
                    .attr("title", resources.packOptionsText[0]);
                }


                var cpy = curPack.find(".SMSPackIcon.copy");
                cpy.attr("packid", retObj.d[i].Id);
                cpy.attr("title", resources.packOptionsText[2]);
                cpy.click(function () { Async.SMSPackEdit_($(this).attr("packid"), true, true, true) });

                var del = curPack.find(".SMSPackIcon.delete");
                del.attr("packid", retObj.d[i].Id);
                del.attr("title", resources.packOptionsText[4]);
                if (retObj.d[i].Editable == true) {
                    del.click(function () {
                        if (!confirm(resources.packOptionsText[5])) { return false; }
                        else {
                            Async.delete_($(this).attr("packid"), $(this).parent(), function () {
                                Async.getSMSPacksList_();
                            });
                        }
                    });

                } else {
                    del.remove();
                    
                    curPack.find(".SMSPackElementSubject").attr("colspan", "2");
                }
                curPack.fadeIn("fast");
                $("#SMSPacksList").append(curPack);





            }



            if (retObj.d[0]) {
                var SAP = $("#smallAccountPlace");
                SAP.find(".reportAccountEn").html(retObj.d[0].EnAccountTotal);
                SAP.find(".reportSentPageEn").html(retObj.d[0].EnPagesSentTotal);
                SAP.find(".reportSentSMSEn").html(retObj.d[0].EnSMSSentTotal);

                SAP.find(".reportAccountFa").html(retObj.d[0].FaAccountTotal);
                SAP.find(".reportSentPageFa").html(retObj.d[0].FaPagesSentTotal);
                SAP.find(".reportSentSMSFa").html(retObj.d[0].FaSMSSentTotal);
            }


            var colors = new Array();
            var data = new Array();
            if (retObj.d[0].StatusDelivered_all > 0) {
                data.push([resources.smsStatus[3], (retObj.d[0].StatusDelivered_all / retObj.d[0].Total_all) * 100]);
                colors.push("green");
            }
            if (retObj.d[0].StatusNotDelivered_all > 0) {
                data.push([resources.smsStatus[4], (retObj.d[0].StatusNotDelivered_all / retObj.d[0].Total_all) * 100]);
                colors.push("blue");
            }
            if (retObj.d[0].StatusComunicationError_all > 0) {
                data.push([resources.smsStatus[5], (retObj.d[0].StatusComunicationError_all / retObj.d[0].Total_all) * 100]);
                colors.push("darkred");
            }
            if (retObj.d[0].StatusOtherError_all > 0) {
                data.push([resources.smsStatus[6], (retObj.d[0].StatusOtherError_all / retObj.d[0].Total_all) * 100]);
                colors.push("orange");
            }
            if ((retObj.d[0].Total_all - retObj.d[0].Sent_all) > 0) {
                data.push({
                    name: resources.smsStatus[2],
                    y: ((retObj.d[0].Total_all - retObj.d[0].Sent_all) / retObj.d[0].Total_all) * 100,
                    sliced: true,
                    selected: true
                });
                colors.push("red");
            }

            chart = new Highcharts.Chart({
                credits: { enabled: false },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            inside: true,
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return this.point.name + " - %" + Math.round(this.percentage * 100) / 100;
                            }
                        },
                        center: ["50%", "50%"],
                        showInLegend: true
                    }
                },
                exporting: {
                    enabled: false
                },
                chart: {
                    renderTo: 'mainChartContainer',
                    width: 600,
                    height: 400,
                    defaultSeriesType: 'pie'
                },
                title: { margin: 0, style: { "font-size": "0px" }, text: '' },
                legend: {
                    backgroundColor: '#FFFFFF',
                    reversed: true,
                    style: { "font-family": "tahoma" }
                },
                tooltip: {
                    enabled: true,
                    //                    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                    //                    percentageDecimals: 1
                    formatter: function () {
                        return this.point.name + " - %" + Math.round(this.percentage * 100) / 100;
                    }
                },
                plotOptions: {
                    series: { stacking: 'normal' }
                },
                colors: colors,
                series: [{
                    type: 'pie',
                    name: '',
                    data: data
                }]
            });


        } ,container_:$("#right")} );
    };


    //--get list of senders from server to fill in combo box
    this.refrehStatus_ = function (id_, container_, callback_) {
        var params = { items: global };
        params.items.id = id_;
        Async.GetData({opname_: "refreshStatus_", params_: params, successFunc_:callback_ ,container_:container_} );
    };

    //--get list of senders from server to fill in combo box
    this.getListOfSenders_ = function getListOfSenders_() {
        var params = { items: global };
        Async.GetData({
            opname_: "getListOfSenders_",
            params_: params,
            successFunc_: $.proxy(function (retObj, str, xhr) {
                var s = $(this);
                s.html("");
                onlyHasUSSMS = true;
                $.each(retObj.d, function (index, obj) {
                    if (obj.sendvia != "eztexting" && obj.sendvia != "RingCentral") {
                        onlyHasUSSMS = false;
                    }
                    s.append("<option sendvia=\"" + obj.sendvia + "\" value=\"" + obj.value + "\"" + (obj.selected?" selected":"") + ">" + obj.text + "</option>");
                });
                $("#selectSender").change();
                if (onlyHasUSSMS) {
                    isUSSMS = true;
                    $("#sms_recieve_type").parent().parent().css({ "display": "none" });
                    resources.textLanguages[0] = "UniCode";
                    $(".persian_").html("UniCode");
                }

            }, $("#selectSender"))
        });
    };
    //--get list of templates from server to fill in combo box
    this.getListOfTemplates_ = function getListOfTemplates_() {

        var params = { items: global };
        Async.FillSelect("getListOfTemplates_", $("#selectTemplate"), params);
        $("#selectTemplate").change(function () {
            Async.getTemplate_($(this).val());
        });
    };
    //--get selected Template from server and shows in SMS text place
    this.getTemplate_ = function (id_) {
        var params = { items: global };
        params.items.id = id_;
        Async.GetData({opname_: "getTemplate_", params_: params, successFunc_: function (retObj, str, xhr) {
            var title = retObj.d[0];
            var body = retObj.d[1];
            $("#sms_title").val(title);
            $("#txt_sms_body").val(body);
            showBodyTips();
            getForm(true);
        } ,container_: $("#sms_title_0")});
    };
    //--initialize pack for for new insertion
    this.SMSPackCreateNew_ = function (callbackFunc) {
        var params = { items: global };
        changeFormState(true);

        Async.GetData({opname_: "SMSPackCreateNew_", params_: params, successFunc_:callbackFunc ,container_:$("#right")}  );
    };
    //--initialize pack form for editing or viewing Pack by id
    this.SMSPackEdit_ = function (id_, appendRecipents, isCopy_, editable_) {

        var params = { items: global };
        params.items.id = id_;
        getForm(true);
        Async.GetData({opname_: "SMSPackEdit_", params_: params, successFunc_: function (retObj, str, xhr) {





            $("#smsNumbers").html("");
            clearList(mainGroupList);
            if (appendRecipents == undefined || appendRecipents == true) {
                $.each(retObj.d.Groups, function (i, item) {

                    appendGroupTag($("#smsNumbers"), mainGroupList, item.Value, item.Name)
                });
                $.each(retObj.d.Recipients, function (i) {
                    items = retObj.d.Recipients[i].split(",");
                    appendTelTag(mainContainer, items[0], items[1], items[2], mainList)
                });
            }
            $("#sms_title").val(retObj.d.Subject);
            $("#txt_sms_body").val(retObj.d.SMSBody);
            $("#txt_max_send").val(retObj.d.MaxSend);
            $("#selectTemplate").val("");
            if (retObj.d.SenderId == "-1") {
                if ($("#selectSender").options.length > 0) {
                    $("#selectSender").val($("#selectSender").options[0].value);
                }
            } else {
                $("#selectSender").val(retObj.d.SenderId);
            }

            if (retObj.d.SMSType == 1) {
                $("#sms_recieve_type_0").attr("checked", false);
                $("#sms_recieve_type_1").attr("checked", true);
            } else {
                $("#sms_recieve_type_0").attr("checked", true);
                $("#sms_recieve_type_1").attr("checked", false);
            }


            if (retObj.d.IsSchedule == true) {
                $("#send_time_0").attr("checked", false);
                $("#send_time_1").attr("checked", true);
                try {
                    Dlg_Schedule(global.domain, global.user_code, global.codeing, TSchedule.sms, id_, '<%= GetGlobalResourceObject("resource", "cap_schedule") %>', 1, "#DivSchData", false, true);
                } catch (e) { }
            } else {
                $("#send_time_0").attr("checked", true);
                $("#send_time_1").attr("checked", false);
            }




            showBodyTips();
            if (retObj.d.Sync0 == true) {
                $("#chkSyncTelAndUserCodes_0").show();
            }
            if (retObj.d.Sync1 == true) {
                $("#chkSyncTelAndUserCodes_1").show();
            }
            $($("#chkSyncTelAndUserCodes_0").find("input")[0]).attr("checked", retObj.d.Sync0);
            $($("#chkSyncTelAndUserCodes_1").find("input")[0]).attr("checked", retObj.d.Sync1);

            showPack(id_, false);
            if (editable_ == undefined || editable_ == false) {
                changeFormState(false);
            } else {
                changeFormState(true);
            }
            if (isCopy_ != undefined && isCopy_ == true) {
                Async.SMSPackCreateNew_();
            }

        } ,container_:$("#right")} );

    };
    //--initialize pack form for Copy
    this.SMSPackCopy_ = function SMSPackCopy_(id_) {
    };
    //delete current Exel file that uploaded
    this.deleteExcel_ = function () {
        if (currentExcelFile == "")
            return;
        var params = { items: global };
        params.items.path = currentExcelFile;
        Async.GetData({opname_: "deleteExcel_", params_: params, successFunc_:  function (retObj, str, xhr) {



            //alert(xhr.responseText);

        }});
    }
    //get Excel file columns
    this.getExcelFields_ = function () {
        if (currentExcelFile == "")
            return;
        var params = { items: global };
        params.items.path = currentExcelFile;
        params.items.sheet = currentExcelFileSheet;
        Async.GetData({opname_: "getExcelFields_", params_: params, successFunc_: function (retObj, str, xhr) {

            var s = $("#excelFieldTel,#excelFieldName,#excelFieldCustomerCode");
            s.html("");
            s.append("<option value=\"\"></option>");
            $.each(retObj.d, function (index, obj) {
                s.append("<option value=\"" + obj + "\">" + obj + "</option>");
            });


        } ,container_:$("#RecipientListExcelTemplate")} );
    }
    //retrive excel content
    this.getExcelData_ = function (tel_, name_, customerCode_) {
        currentExcelFileContent = null;

        if (currentExcelFile == "")
            return;
        if (tel_ == "")
            return;



        var params = { items: global };
        params.items.path = currentExcelFile;
        params.items.sheet = currentExcelFileSheet;
        params.items.tel = tel_;
        params.items.name = name_;
        params.items.customerCode = customerCode_;
        Async.GetData({opname_: "getExcelData_", params_: params, successFunc_:  function (retObj, str, xhr) {

            excelFieldChanged = false;
            currentExcelFileContent = (retObj.d == null ? "" : retObj.d);
            $("#RecipientListExcelTemplate").find(".sync").click();

        },container_:$("#RecipientListExcelTemplate")} );
    }

    //add black list
    this.addBlackList_ = function (tel_, name_) {

        var params = { items: global };
        params.items.tel = tel_;
        params.items.name = name_;
        Async.GetData({opname_: "addBlackList_", params_: params, successFunc_: function (retObj, str, xhr) {
            var container = $("#blackListTemplate");
            appendTelTag(container.find(".blackListPlace"), retObj.d[0], retObj.d[1], retObj.d[2], mainBlackList, function (id) {
                Async.removeBlackList_(id);
            });
            container.find(".userTel").val("");
            container.find(".userName").val("");
            container.find(".userTel").focus();


        } ,container_:$("#blackListTemplate")} );
    }

    //remove blacklist
    this.removeBlackList_ = function (id_) {

        var params = { items: global };
        params.items.id = id_;

        Async.GetData({opname_: "removeBlackList_", params_: params, successFunc_:  function (retObj, str, xhr) {


        }});
    }

    //get blacklist
    this.getBlackList_ = function () {

        var params = { items: global };

        Async.GetData({opname_: "getBlackList_", params_: params, successFunc_:  function (retObj, str, xhr) {
            var container = $("#blackListTemplate").find(".blackListPlace");

            container.html("");
            items = retObj.d;
            for (var i = 0; i < items.length; i++) {

                appendTelTag(container, items[i][0], items[i][1], items[i][2], mainBlackList, function (id) {
                    Async.removeBlackList_(id);
                });
            }


        }});
    }

    //get blacklist
    this.getGroupContent_ = function (groupid_,name_) {

        var params = { items: global };
        params.items.groupid = groupid_
        $("#groupContent").find(".groupContentPlace").html("");
        $("#groupContent").msgbox({ width: 400, height: 300,title:name_ });
        Async.GetData({opname_: "getGroupContent_", params_: params, successFunc_:  function (retObj, str, xhr) {
            var container = $("#groupContent").find(".groupContentPlace");
            var tmpArr = new Array();
            container.html("");
            items = retObj.d;
            for (var i = 0; i < items.length; i++) {
                appendTelTag(container, items[i].split(',')[0], items[i].split(',')[1], items[i].split(',')[2], tmpArr);
            }


        },container_:$("#groupContent")} );
    }

    this.getFunctionName = function getFunctionName(strfunc) {

        return ("undefined" !== typeof strfunc.name ? strfunc.name : /^function\s*([a-z0-9_\-\$]+)/im.exec(strfunc)[1])


    }
}
var Async = new AsyncFunctions();

//---------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------------------
//-- Initialize After document Ready 
//---------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    dialogMessage = $("#DialogMessage");
    mainContainer = $("#smsNumbers");
    $("#selectSender").change(function () {
        if ($(this).find("[value=" + $(this).val() + "][sendvia=eztexting]").length > 0 || $(this).find("[value=" + $(this).val() + "][sendvia=RingCentral]").length > 0) {
            isUSSMS = true;
            
        } else {
            isUSSMS = false;
        }
        $.each(mainList, function (i, recipient) {
            if (!isValidNumberForSend(recipient.tel)) {
                mainContainer.find("[tel=" + recipient.tel + "]").fadeOut(function () {
                    $(this).remove();
                });
                removeFromList(mainList, recipient.tel);
            }
        })
    }).change();
    $.fn.msgbox = function (params_) {

        $(this).dialog("destroy");
        var box = $(this);

        //box.dialog("destroy");
        var defaults = {
            text: "",
            title: "",
            bgiframe: true,
            modal: true,
            resizable: false,
            autoOpen: false,
            width: "auto",
            height: "auto",
            
            minWidth: 400,
            minHeight: 300,

            open: function (event, ui) {
                $(this).hide();
                $(this).fadeIn(400);
                //$(this).show();
                //window.document.title += "1";
            },
            beforeClose: function (event, ui) {
                //window.document.title += "0";
            },
            close: function (event, ui) {
                $(this).dialog("destroy");

                //$(this).hide();
            },
            dialogClass: "alert",
            hide: "drop",
            show: 0
        };

        var params = {};
        $.extend(params, defaults, params_);


        if (params.text != "")
            box.html(params.text).changDirection(params.text);


        box.dialog(params);


        box.dialog("open");
        return box;

    }

    //---------------------------------------------------------------------------------------------------------
    //-- adds function to jQuery for inserting text to caret position in textbox
    //---------------------------------------------------------------------------------------------------------
    $.fn.insertAtCaret = function (text) {
        return this.each(function () {
            if (document.selection && this.tagName == "TEXTAREA") {
                //IE textarea support
                this.focus();
                sel = document.selection.createRange();
                sel.text = text;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == "0") {
                //MOZILLA/NETSCAPE support
                startPos = this.selectionStart;
                endPos = this.selectionEnd;
                scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + text.length;
                this.selectionEnd = startPos + text.length;
                this.scrollTop = scrollTop;
            } else {
                // IE input[type=text] and other browsers
                this.value += text;
                this.focus();
                this.value = this.value;    // forces cursor to end
            }
        });
    };
    //---------------------------------------------------------------------------------------------------------



    function initGlobalParams() {
        global.domain = $("#HFdomain").val();
        global.user_code = $("#HFUserCode").val();
        global.codeing = $("#hfcodeing").val();
        global.CurrentRequest = "";
    }

    //---------------------------------------------------------------------------------------------------------
    //--BlackList List Add (adding person) 
    //---------------------------------------------------------------------------------------------------------
    var BlackListAddcontainer = $("#blackListTemplate");
    var BlackListAdduserTel = BlackListAddcontainer.find(".userTel");
    var BlackListAdduserName = BlackListAddcontainer.find(".userName");
    var BlackListAddadd = BlackListAddcontainer.find(".add");
    var BlackListAddtmpListPlace = BlackListAddcontainer.find(".tmpListPlace");

    function initBlackListAdd() {
        Async.getBlackList_();
        $("#blackList").click(function () {
            //alert(10);
            BlackListAddcontainer.msgbox({ width: 400, height: 300 });

        });

        BlackListAddadd.click(function () {

            var dupl = isDuplicate(BlackListAdduserTel.val(), mainBlackList);
            var isValid = isValidNumberForSend(BlackListAdduserTel.val());
            if (isValid && !dupl) {

                Async.addBlackList_(BlackListAdduserTel.val(), BlackListAdduserName.val());

            } else {

            }
        });


        BlackListAdduserTel.change(function () {
            BlackListAdduserTel.keyup();
        });
        BlackListAdduserTel.keyup(function () {
            var dupl = isDuplicate(BlackListAdduserTel.val(), mainBlackList);
            var isValid = isValidNumberForSend(BlackListAdduserTel.val());
            if (isValid && !dupl) {
                BlackListAdduserTel
            .removeClass("TxtNoneValidNumber")
            .addClass("TxtValidNumber")
            .attr("title", "");
                BlackListAdduserTel.parent().find(".errMessage").html("");
            } else {
                BlackListAdduserTel
            .removeClass("TxtValidNumber")
            .addClass("TxtNoneValidNumber")
            .attr("title", (dupl ? resources.recipientTelStatus[2] : (BlackListAdduserTel.val() == "" ? resources.recipientTelStatus[0] : resources.recipientTelStatus[1])));
                BlackListAdduserTel.parent().find(".errMessage").html((dupl ? resources.recipientTelStatus[2] : (BlackListAdduserTel.val() == "" ? resources.recipientTelStatus[0] : resources.recipientTelStatus[1])))

            }
        })
            .onlyAcceptNumeric(function () {
                $("#blackListTemplate").find(".add").click();
            })
            .focus()
            .removeClass("TxtNoneValidNumber")
            .removeClass("TxtValidNumber")
            .val("");
    }
    //---------------------------------------------------------------------------------------------------------


    //---------------------------------------------------------------------------------------------------------
    //--Recipient List Add (adding person) 
    //---------------------------------------------------------------------------------------------------------
    var RecipientListAddcontainer = $("#RecipientListAddTemplate");
    var RecipientListAdduserTel = RecipientListAddcontainer.find(".userTel");
    var RecipientListAdduserName = RecipientListAddcontainer.find(".userName");
    var RecipientListAddadd = RecipientListAddcontainer.find(".add");
    var RecipientListAddaccept = RecipientListAddcontainer.find(".accept");
    var RecipientListAddcancel = RecipientListAddcontainer.find(".cancel");
    var RecipientListAddtmpListPlace = RecipientListAddcontainer.find(".tmpListPlace");

    function initRecipientListAdd() {


        RecipientListAddadd.click(function () {

            var dupl = isDuplicate(RecipientListAdduserTel.val());
            var isValid = isValidNumberForSend(RecipientListAdduserTel.val());
            if (isValid && !dupl) {


                appendTelTag(RecipientListAddtmpListPlace, "", RecipientListAdduserName.val(), RecipientListAdduserTel.val(), tmpList);
                RecipientListAdduserTel.val("");
                RecipientListAdduserName.val("");
                RecipientListAdduserTel.focus();
            } else {

            }
        });
        RecipientListAddaccept.click(function () {
            RecipientListAddadd.click();

            appendTmpListToMain();

            RecipientListAddcancel.click();
        });
        RecipientListAddcancel.click(function () {
            clearList(tmpList);
            RecipientListAdduserTel.val("");
            RecipientListAdduserName.val("");
            RecipientListAddtmpListPlace.html("");
            RecipientListAddcontainer.dialog("close");
        });
        RecipientListAdduserTel.change(function () {
            RecipientListAdduserTel.keyup();
        });
        RecipientListAdduserTel.keyup(function () {
            var dupl = isDuplicate(RecipientListAdduserTel.val());
            var isValid = isValidNumberForSend(RecipientListAdduserTel.val());
            if (isValid && !dupl) {
                RecipientListAdduserTel
            .removeClass("TxtNoneValidNumber")
            .addClass("TxtValidNumber")
            .attr("title", "");
                $("#errMessagePlace").html("");
            } else {
                RecipientListAdduserTel
            .removeClass("TxtValidNumber")
            .addClass("TxtNoneValidNumber")
            .attr("title", (dupl ? resources.recipientTelStatus[2] : (RecipientListAdduserTel.val() == "" ? resources.recipientTelStatus[0] : resources.recipientTelStatus[1])));
                $("#errMessagePlace").html((dupl ? resources.recipientTelStatus[2] : (RecipientListAdduserTel.val() == "" ? resources.recipientTelStatus[0] : resources.recipientTelStatus[1])))

            }
        })
            .onlyAcceptNumeric(function () {
                $("#RecipientListAddTemplate").find(".add").click();
            })
            .focus()
            .removeClass("TxtNoneValidNumber")
            .removeClass("TxtValidNumber")
            .val("");
    }
    //---------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------
    //--Recipient Text Add (extracting phone numbers from text and add them) 
    //---------------------------------------------------------------------------------------------------------
    var RecipientListTextcontainer = $("#RecipientListTextTemplate");
    var RecipientListTextlistText = RecipientListTextcontainer.find(".listText");
    var RecipientListTextsync = RecipientListTextcontainer.find(".sync");
    var RecipientListTextaccept = RecipientListTextcontainer.find(".accept");
    var RecipientListTextcancel = RecipientListTextcontainer.find(".cancel");
    var RecipientListTexttmpListPlace = RecipientListTextcontainer.find(".tmpListPlace");

    function initRecipientListText() {
        RecipientListTextlistText.val(RecipientListTextlistText.attr("initText"));
        RecipientListTextlistText.focus(function () {
            if (RecipientListTextlistText.val() == RecipientListTextlistText.attr("initText")) {
                RecipientListTextlistText.val("");
            }
        });
        RecipientListTextlistText.blur(function () {
            if (RecipientListTextlistText.val() == "") {
                RecipientListTextlistText.val(RecipientListTextlistText.attr("initText"));
            }
        });
        RecipientListTextlistText.change(function () {
            RecipientListTextsync.click();
        });
        RecipientListTextlistText.keyup(function () {
            RecipientListTextsync.click();
        });
        RecipientListTextsync.click(function () {
            RecipientListTexttmpListPlace.html("");
            clearList(tmpList);
            var str = RecipientListTextlistText.val();
            if (str != "" && str != RecipientListTextlistText.attr("initText")) {
                var num
                if (isUSSMS) {
                    num = str.match(/^(\(\s*[0-9]{3}\s*\)|\(\s*[0-9]{3}\s*\)\s*\-*|[0-9]{3}\s*\-*)\s*([0-9]{3})\s*\-*\s*([0-9]{4})/g);
                } else {
                    num = str.match(/\d+/gm);
                }
                
                for (var i = 0; i < num.length; i++) {
                    if (!isDuplicate(num[i]) && isValidNumberForSend(num[i])) {
                        appendTelTag(RecipientListTexttmpListPlace, "", "", num[i], tmpList);
                    }
                }
            }
        });
        RecipientListTextaccept.click(function () {
            appendTmpListToMain();

            RecipientListTextcancel.click();
        });
        RecipientListTextcancel.click(function () {
            clearList(tmpList);
            RecipientListTextlistText.val("");
            RecipientListTexttmpListPlace.html("");
            RecipientListTextcontainer.dialog("close");
        });
    }

    //---------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------
    //--Recipient Add from Excel (extracting phone numbers from excel file) 
    //---------------------------------------------------------------------------------------------------------
    var RecipientListExcelcontainer = $("#RecipientListExcelTemplate");
    var RecipientListExcelsync = RecipientListExcelcontainer.find(".sync");
    var RecipientListExcelaccept = RecipientListExcelcontainer.find(".accept");
    var RecipientListExcelcancel = RecipientListExcelcontainer.find(".cancel");
    var RecipientListExceltmpListPlace = RecipientListExcelcontainer.find(".tmpListPlace");

    function initRecipientListExcel() {

        $("#excelFieldTel").change(function () {
            if ($(this).val() != excelFieldTel_lastValue) {
                clearList(tmpList);
                RecipientListExceltmpListPlace.html("");
                excelFieldTel_lastValue = $(this).val();
                excelFieldChanged = true;
            }

        });
        $("#excelFieldName").change(function () {
            if ($(this).val() != excelFieldName_lastValue) {
                clearList(tmpList);
                RecipientListExceltmpListPlace.html("");

                excelFieldName_lastValue = $(this).val();
                excelFieldChanged = true;
            }

        });
        $("#excelFieldCustomerCode").change(function () {
            if ($(this).val() != excelFieldCustomerCode_lastValue) {
                clearList(tmpList);
                RecipientListExceltmpListPlace.html("");
                excelFieldCustomerCode_lastValue = $(this).val();
                excelFieldChanged = true;
            }

        });

        RecipientListExcelsync.click(function () {
            if (currentExcelFileContent == null || excelFieldChanged == true) {

                Async.getExcelData_($("#excelFieldTel").val(), $("#excelFieldName").val(), $("#excelFieldCustomerCode").val())
            } else {

                $.each(currentExcelFileContent, function (i, obj) {

                    if (!isDuplicate(obj.tel) && isValidNumberForSend(obj.tel)) {
                        appendTelTag(RecipientListExceltmpListPlace, obj.customerCode, obj.name, obj.tel, tmpList);
                    }
                });
            }

        });
        RecipientListExcelaccept.click(function () {
            if (tmpList.length == []) {
                RecipientListExcelsync.click();

            }
            appendTmpListToMain();

            RecipientListExcelcancel.click();
        });
        RecipientListExcelcancel.click(function () {
            clearList(tmpList);
            $("#uploadExcel").val("");
            RecipientListExceltmpListPlace.html("");
            RecipientListExcelcontainer.dialog("close");
            Async.deleteExcel_();
        });

        $("#upload_excel_file").click(function () {


            
            var rege = "^.*.(xls|xlsx)$";
            var str_ = $("#uploadExcel").val();
            if (str_.match(rege)) {
                $(".uploadError").html("");
                $("#excelUploadProgressContainer").show();
                $("#excelUploadProgress").css({ width: 0 });

                $("#frm_upload_Attach")
                    .attr("action", "upload_fileMail.ashx?domain=" + global.domain + "&user_code=" + global.user_code + "&codeing=" + global.codeing + "&mode_director=sms")
                    .attr("method", "post")
                    .attr("enctype", "multipart/form-data")
                    .submit();
            } else {

                $(".uploadError").html(resources.excelUploadError);

            }

        });
        $("#frm_upload_Attach").ajaxForm({

            beforeSend: function () {

            },
            uploadProgress: function (event, position, total, percentComplete) {
                $("#excelUploadProgress").stop().animate({ width: percentComplete + "%" }, 500);
            },
            complete: function (c) {
                $("#uploadExcel").val("");
                currentExcelFile = "";
                var result = c.responseText.split(",")
                if (result != "" && result != null) {
                    if (result[0] == "0") {
                        $(".uploadError").html(result[1]);
                        $("#excelUploadProgress").css("width", "0%");

                        currentExcelFileSheet = ""
                    } else {
                        currentExcelFile = "";
                        for (i = 1; i <= result.length - 1; i++) {
                            if (currentExcelFile != "") currentExcelFile += ","
                            currentExcelFile += result[i];
                        }
                        $("#excelUploadProgress").css("width", "0%");
                        currentExcelFileSheet = $("#txtSheet").val();
                        Async.getExcelFields_(); // فراخوانی وب سرویس

                        $(".uploadError").html("");
                        $("#excelUploadProgressContainer").fadeOut();
                        $(".uploadExcel_1").fadeOut(function () {
                            $(".uploadExcel_2").fadeIn();
                        });
                    }
                }



            }
        });

    }




    //---------------------------------------------------------------------------------------------------------


    var RecipientListGroupContainer = $("#RecipientListGroupTemplate");
    var RecipientListGroupaccept = RecipientListGroupContainer.find(".accept");
    var RecipientListGroupcancel = RecipientListGroupContainer.find(".cancel");
    function initRecipientListGroup() {
        RecipientListGroupaccept.click(function () {
            if (tmpGroupList.length == []) {
                RecipientListGroupcancel.click();

            } else {
                for (var i = 0; i < tmpGroupList.length; i++) {
                    appendGroupTag($("#smsNumbers"), mainGroupList, tmpGroupList[i].id, tmpGroupList[i].name);
                }

                RecipientListGroupcancel.click();
            }
        });
        RecipientListGroupcancel.click(function () {
            clearList(tmpGroupList);
            $("#tmpGroupPlace").html("");
            RecipientListGroupContainer.dialog("close");

        });
    }
    //---------------------------------------------------------------------------------------------------------
    //--Recipient Add from Searching 
    //---------------------------------------------------------------------------------------------------------
    var RecipientListSearchcontainer = $("#RecipientListSearchTemplate");


    function initRecipientListSearch() {

    }


    //---------------------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------------------
    //--Check account
    //---------------------------------------------------------------------------------------------------------
    var SMSCheckAccountcontainer = $("#SMSCheckAccountTemplate");


    function initSMSCheckAccount() {

    }


    //---------------------------------------------------------------------------------------------------------


    //---------------------------------------------------------------------------------------------------------
    //--initialize adding recepient keys
    //---------------------------------------------------------------------------------------------------------
    function initAddRecepient() {
        $("#RecipientListAdd").click(function () {

            RecipientListAddcontainer.msgbox({
                title: $(this).attr("title"),
                width: 400,
                height: 340

            });
            RecipientListAdduserTel.focus();
            RecipientListAdduserTel.keyup();

        });

        $("#RecipientListSearch").click(function () {
            $("#dialog_cus_search").dialog("open");
        });

        $("#RecipientListText").click(function () {

            if (RecipientListTextlistText.val() == "") {
                RecipientListTextlistText.val(RecipientListTextlistText.attr("initText"));
            }
            RecipientListTextcontainer.msgbox({
                title: $(this).attr("title"),
                width: 400,
                height: 400

            });
            //RecipientListTextlistText.focus();



        });

        $("#RecipientListExcel").click(function () {
            $(".uploadExcel_1").show();
            RecipientListExcelcontainer.msgbox({
                title: $(this).attr("title"),
                width: 400,
                height: 300,
                close: function () {
                    $("#uploadExcel").val("");
                    Async.deleteExcel_();

                    currentExcelFileSheet = "";
                    currentExcelFileContent = null;
                    RecipientListExceltmpListPlace.html("");

                    excelFieldChanged = false;
                    excelFieldTel_lastValue = "";
                    excelFieldName_lastValue = "";
                    excelFieldCustomerCode_lastValue = "";

                    $(".uploadExcel_1").hide();
                    $(".uploadExcel_2").hide();
                }

            });

        });


        $("#RecipientListGroup").click(function () {

            RecipientListGroupContainer.msgbox({
                title: $(this).attr("title"),
                width: 400,
                height: 300,
                close: function () {

                }

            });

        });

        $("#SMSCheckAccount").click(function () {
            Async.calculate_("account");
        });
    }
    //---------------------------------------------------------------------------------------------------------

    $(window).error(function (e, url, line) {
        if (debug == true)
            dialogMessage.msgbox(
            {
                title: "Error ",
                width: 400,
                height: 230,
                message: "Message : <b>" + e + "</b><br/>Line : <b>" + line + "</b><br/><br/>URL : <a target=\"_blank\" href=\"view-source:" + url + "\">" + url + "</a>"
            }
             );

    });



    $("#SMSPack").hide();


    //


    $("#newPack").click(function () {
        Async.SMSPackCreateNew_(
                    function (retObj, str, xhr) {
                        if (retObj.d == true) {

                            showPack(0, false);

                        }
                    })
    });
    $("#downloadExcel").click(function () {
        Async.getExcel_();
    });
    $("#txt_sms_body").bind("input propertychange", function () {
        showBodyTips();
    });

    initGlobalParams();

    initAddRecepient();
    initRecipientListAdd(); //recepient List add (adding person)
    initRecipientListText(); //Recipient Text Add (extracting phone numbers from text and add them) 
    initRecipientListExcel(); //Recipient List Excel (extract name,tel,customerCode from excel file )
    initRecipientListSearch(); //Recipient List Search
    initRecipientListGroup();
    initSMSCheckAccount(); //SMS Check Account
    initBlackListAdd();

    try {
        Async.getListOfSenders_();
        Async.getListOfTemplates_();
    } catch (e) {
    }


    $("#send_time").change(function () {
        var scheduled = $("#send_time_1").is(":checked") ? true : false;
        if (scheduled) {
            Dlg_Schedule(global.domain, global.user_code, global.codeing, TSchedule.sms, "", "schedule", 1, "#DivSchData", true);

        } else {
            $("#DivSchData").html("");
            $("#HFSchData_SMS").val("");
            $("#btn_add_new_schedule").hide();
        }
    });
    $("#btn_save_sms").click(function () {
        Async.calculate_("save");

    });

    $("#SMSCheckAccountTemplate")
            .find(".saveFinal")
            .click(function () {
                Async.save_();
            });

    $("#btn_send_sms").click(function () {
        Async.calculate_("send");
    });

    $("#SMSCheckAccountTemplate")
            .find(".sendFinal")
            .click(function () {
                Async.send_(false);
            });

    $("#SMSCheckAccountTemplate")
            .find(".sendTillAccount")
            .click(function () {
                Async.send_(true);
            });

    $("#returnBtn").click(function () {

        $("#SMSPack").fadeOut("fast", function () {
            clearList(mainList);
            clearList(tmpList);
            mainContainer.html("");
            $("#SMSPacksListContainer").fadeIn("fast");
        });

    });

    $($("#chkSyncTelAndUserCodes_0").find("input")[0]).change(function () {
        var c = $("#chkSyncTelAndUserCodes_1");
        if ($(this).attr("checked") == true) {
            c.show();
        } else {
            c.hide();
        }
        $(c.find("input")[0])
                .attr("checked", false);
    }).click(function () {
        $(this).change();
    });


    //    $("#searchPack").mouseenter(function () {
    //        if ($(this).attr("mouseOn") == "true")
    //            return;
    //        $(this).attr("mouseOn", true);
    //        $(this).animate({ height: 90 }, 1000);
    //        $("#accountPlace").show().animate({ height: 55 }, 1000);

    //    })
    //    .mouseleave(function () {
    //        if ($(this).attr("mouseOn") == "false")
    //            return;

    //        $(this).attr("mouseOn", false);
    //        $(this).animate({ height: 30 }, 1000)
    //        $("#accountPlace").animate({ height: 0 }, 1000, function () { $(this).hide(); });
    //    });
    $("#txtSearchSMSPack").keydown(function (evt) {
        if (evt.keyCode == 13) {
            $(this).blur();
            $("#searchPack .txtSearchSMSPack_serach").click();
        }
    });
    $("#searchPack .txtSearchSMSPack_serach").click(function () {

        Async.getSMSPacksList_(1);

    });
    $("#showSmallAccountPlace").click(function () {

        $("#smallAccountPlaceContainer").attr("initializing", true).css({ "position": "absolute", "left": ($("#showSmallAccountPlace").offset().left - (resources.calander == 'en' ? 100 : 5)) + "px", "top": ($("#showSmallAccountPlace").offset().top + 30) + "px", "z-index": 10000 }).slideToggle(function () {
            $(this).attr("initializing", false);
        });
    });
    $("#showAdvanedSMSSearch").click(function () {

        $("#advancedSMSSearch").attr("initializing", true).css({ "position": "absolute", "left": ($("#showAdvanedSMSSearch").offset().left - (resources.calander == 'en' ? 25 : 480)) + "px", "top": ($("#showAdvanedSMSSearch").offset().top + 30) + "px", "z-index": 10000 }).slideToggle(function () {
            $(this).attr("initializing", false);
        });
    });
    $(document).click(function () {
        $.each([$("#advancedSMSSearch"), $("#smallAccountPlaceContainer"), $("#SMSCustomization")], function (i, item) {

            if (item.attr("mouseonme") == "false" && item.attr("initializing") == "false") {
                if ((i == 0 && $("#ui-datepicker-div").attr("mouseonme") == "false") || i != 0) {
                    item.slideUp();
                }
            }
        });
    });
    $.each([$("#advancedSMSSearch"), $("#smallAccountPlaceContainer"), $("#SMSCustomization"), $("#ui-datepicker-div")], function (i, item) {
        item.flagMouseOnMe();
    });
});
$.fn.flagMouseOnMe = function () {
    $(this).mouseenter(function () {
        $(this).attr("mouseonme", true);
    }).mouseleave(function () {
        $(this).attr("mouseonme", false);
    }).attr("mouseonme", false);
}
//---------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------
//-- Native Noty function 
function aNoty(params) {
    var items = {};
    var defaults = {
        horizontalPos: "left", // "left" or "right" or "center"
        verticalPos: "bottom", // "top" or "middle" or "bottom"
        width: 200,
        height: 120,
        text: "",
        CSS: "aNoty",
        id: ""
    };

    $.extend(items, defaults, params);

    //alert(items.width);
    var offsetLeft = 0;
    var offsetTop = 0;
    var padding = 20;
    switch (items.horizontalPos) {
        case "left":
            offsetLeft = padding;
            break;
        case "right":
            offsetLeft = screen.availWidth - (items.width + padding);
            break;
        case "center":
            offsetLeft = (screen.availWidth / 2) - (items.width / 2);
            break;
        default:

    }

    switch (items.verticalPos) {
        case "top":
            offsetTop = padding;
            break;
        case "bottom":
            offsetTop = screen.availHeight - (items.height + padding) - 80;
            break;
        case "middle":
            offsetTop = (screen.availHeight / 2) - (items.height / 2);
            break;
        default:

    }
    var c = $("#anoty" + items.id);
    if (c.length > 0) {
        c.html(items.text);
        return;
    }


    $("<div></div>").attr("id", "anoty" + items.id).addClass(items.CSS).css({
        "z-index": 32767,
        width: items.width,
        height: 0,
        position: "fixed",
        left: offsetLeft,
        //top: offsetTop,
        bottom: 40,
        overflow: "hidden"

    }).html(items.text).appendTo("body").animate({ height: items.height }, 700).click(function () {
        Async.deleteCurrentPackStatus_(items.id);
        $(this).animate({ height: 0 }, 700, function () {
            $(this).hide().remove();
        })
    });

}
//---------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------
//-- JSON Stringify for old browsers
//---------------------------------------------------------------------------------------------------------
var JSON = JSON || {};
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    };
};

//---------------------------------------------------------------------------------------------------------
function select_group_(id, name) {

    appendGroupTag($("#tmpGroupPlace"), tmpGroupList, id, name);
}

function appendGroupTag(container_, list_, id_, name_) {
    if (id_ == "") {
        id_ = "0";
    }
    for (var i = 0; i < list_.length; i++) {
        if (list_[i].id == id_) {
            return 0;
        }
    }

    var x = new Group();
    x.name = name_;
    x.id = id_;

    list_.push(x);
    var t = $("#telTag")

                        .clone()
                        .removeAttr("id")
                        .removeClass("telTag")
                        .addClass("groupTag")
                        .attr("title", id_)
                        .attr("groupname",name_)
                        .click(function () {
                            Async.getGroupContent_($(this).attr("title"), $(this).attr("groupname"))
                        });
    t.find(".delete")
                        .attr("gid", id_)
                        .click(function () {
                            $(this).parent().remove();
                            for (var i = 0; i < list_.length; i++) {

                                if (list_[i].id == $(this).attr("gid")) {
                                    list_.splice(i, 1);
                                    return i;
                                }
                            }
                        });
    t.find(".content")
                        .html(name_);
    container_.append(t);
}