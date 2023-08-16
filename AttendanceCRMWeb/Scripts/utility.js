

let lastValue;
let dialog = null;


$(document).ready(function () {
    $(".card-header").click(ToggleSearchBlockAndSavePreferences);
});

$(function () {

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        if (jqxhr.responseJSON != null && jqxhr.responseJSON.Message != null) {
            AlertDialog(jqxhr.responseJSON.Message, 'خطا', 'error');
        }
        //else if (jqxhr.statusText != null) {
        //    AlertDialog(jqxhr.statusText, ' ! ');
        //} else {
        //    AlertDialog("متاسفانه خطایی روی داده است"," ! ");
        //}
    });

    $.when(LoadMenu()).done(function () {
        readFromCookie();
    });

    if ($("#msg").val() != null && $("#msg").val() != undefined && $("#msg").val() != "") {
        window.AlertDialog($("#msg").val(), "");
        $("#msg").val("");
    }
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = (this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });
    setTooltip();
});

function initCtxMenu(id, lstItems = []) {
    try {
        var contextMenuTwo = window.CtxMenu(id);
        if (isEmpty(contextMenuTwo._elementClicked)) {
            for (var i = 0; i < lstItems.length; i++) {
                contextMenuTwo.addItem(lstItems[i].text, lstItems[i].callback);
                if (lstItems.length - 1 == i) break;
                //contextMenuTwo.addSeparator();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

//این تابع برای این است که وقتی می خواهیم یه کامپوننت تاریخو تو حالت ویرایش نال کنیم از این تابع استفاده میکنیم که نوع داده ای کامپوننت تاریخ در سرور از نوع دیت تاین ناله
function eventChangeDateNull(e, idDateStr) {
    if (isEmpty($(e).val())) {
        $(e).val("");
        $("#" + idDateStr).val("");
    }
}

function isDateCorrect(value) {
    if (isEmpty(value)) return true;
    var d = new Date(value);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
            // date is not valid
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function addAntiForgeryToken(data) {
    //if the object is undefined, create a new one.
    if (!data) {
        data = {};
    }
    //add token
    var tokenInput = $('input[name=__RequestVerificationToken]');
    if (tokenInput.length) {
        data.__RequestVerificationToken = tokenInput.val();
    }
    return data;
};

function isEmpty(str) {
    return str === "" || str === null || str === undefined ? true : false;
}

function debuggerWeb() {
    debugger;
}

function isYearDateShamsiInKabise(year) {
    var arr = [1, 5, 9, 13, 17, 22, 26, 30];
    var b = year % 33;
    return arr.includes(b);
}

function showWait() {

    //$("#divWait").show();
    //new window.UserInterface.Notification().showWaiting();
    //dialog_Loading = RaveshUI.showDialog({ zIndex: '1063', title: 'لطفا منتظر بمانید', detail: 'در حال اجرای عملیات', icon: 'fa fa-spinner', width: 450, allowMaximum: false });
    //dialog_Loading.setContent('<div style="height:100px;"></div>');
    //dialog_Loading.showLoading(true);

}

function hideWait() {

    //$("#divWait").hide();

    //new window.UserInterface.Notification().hide();
    //dialog_Loading.close();
}

function AjaxCallAction(type, url, data, async, successCallBack, isWait = true, errorCallback = null, contentType = 'json') {
    $.ajax({
        type: type,
        url: url,
        data: data,
        async: async,
        dataType: contentType,
        beforeSend: function () {
            if (isWait)
                showWait();
        },
        success: function (res) {

            if (res.statusCode == "301") {
                AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا', 'error');

                if (errorCallback != null)
                    errorCallback(res);

                return;
            }
            successCallBack(res);
        },
        complete: function () {

            if (isWait)
                hideWait();
        },
        error: function (res) {

            if (isWait)
                hideWait();
            //AlertDialog(res, 'خطا', 'error');
        }
    });
}

function AlertDialog(text, title = "", type = "info", layout = "bottomLeft", timeout = 4000) {
    //../themes/resources/scripts/raveshui.js


    //toastr.options = {
    //    //"closeButton": true,
    //    //"debug": false,
    //    "positionClass": "toast-bottom-left",
    //    //"showDuration": "1000",
    //    //"hideDuration": "1000",
    //    //"timeOut": "600300",
    //    //"extendedTimeOut": "600300",
    //    //"showEasing": "swing",
    //    //"hideEasing": "linear",
    //    //"showMethod": "fadeIn",
    //    //"hideMethod": "fadeOut",
    //};

    if (type === "success") {
        //toastr.success(text)
        RaveshUI.successToast('', text);
    } else if (type === "error") {
        //toastr.error(text)
        RaveshUI.errorToast('', text);
    } else if (type === "warning") {
        //toastr.warning(text)
        RaveshUI.warningToast('', text);
    }
    else {
        //toastr.info(text)
        RaveshUI.infoToast('', text);
    }

}

function formatDate_yyyyMMdd(date, addYear = 0, addMonth = null, addDay = 0, isZeroFirst = true, isJoinCharSlash = false) {

    //------Old Code - Mobin--------------
    //addMonth = isEmpty(addMonth) ? 1 : addMonth;
    //var d = new Date(date),
    //    month = '' + (d.getMonth() + addMonth),
    //    day = '' + (d.getDate() + addDay),
    //    year = (d.getFullYear() + addYear);
    //if (isZeroFirst) {
    //    month = month.length < 2 ? '0' + month : month;
    //    day = day.length < 2 ? '0' + day : day;
    //}
    //return [year, month, day].join(isJoinCharSlash ? '/' : '-');





    //----------New Code - Samad --------------------
    var _addday = new Date(date);
    _addday.setDate(_addday.getDate() + addDay);

    var _year = _addday.getFullYear();
    var _month = _addday.getMonth() + 1;
    var _day = _addday.getDate();

    var _month2 = "00";
    var _day2 = "00";
    if (isZeroFirst) {
        _month2 = (_month < 10 ? '0' + _month : _month).toString();
        _day2 = (_day < 10 ? '0' + _day : _day).toString();
    }
    return [_year, _month2, _day2].join(isJoinCharSlash ? '/' : '-');
}

function formatTime_HHmmss(time, isShowSecond = false, isZeroFirst = true) {

    var h, m, s;

    var timeArr = time.split(':');
    h = timeArr[0];
    m = timeArr[1];
    s = isEmpty(timeArr[2]) ? '0' : timeArr[2];
    if (isZeroFirst) {
        h = h.length < 2 ? '0' + h : h;
        m = m.length < 2 ? '0' + m : m;
        s = s.length < 2 ? '0' + s : s;
    }

    return !isShowSecond ? [h, m].join(':') : [h, m, s].join(':');
}

function closeWindow(window) {
    window.close();
}

function writeWindow(window, result) {
    window.document.write(result);
}

function toCharInSearchDatabase(text) {
    return text.replace("ك", "ک").replace("ي", "ی").replace("?", "ی").replace("ى", "ی").replace("ة", "ه")
}

function setSearchCombo() {
    var config = {
        '.chzn-select': {},
        '.chzn-select-limit': { max_selected_options: 20 },
        '.Multiselect': { max_selected_options: 20 },
        '.chzn-select-deselect': { allow_single_deselect: true },
        '.chzn-select-no-single': { disable_search_threshold: 10 },
        '.chzn-select-no-results': { no_results_text: 'Oops, nothing found!' },
        '.chzn-select-width': { width: "95%" }
    };
    for (var selector in config) {
        try {
            $(selector).chosen(config[selector]);
        } catch (e) {
        }
    }
}

function getNotificationBar(url, idspn, idli) {

    $.post(url,
        function (res) {


            if (res.length > 0) {
                if ($("#" + idli + "").attr("style") == "display:none;")
                    $("#" + idli + "").removeAttr("style")
                $("#" + idspn + "").text(res.length);
                return;
            }
            $("#" + idli + "").attr("style", "display:none;");
        });
}

function changeColInputAndLabel(id, numberColLabel, numberColInput) {
    $("label[for='" + id + "']").removeClass("col-md-3").addClass("col-md-" + numberColLabel + "");
    $("#" + id + "").parent().removeClass("col-sm-9").addClass("col-sm-" + numberColInput + "");
}

function changeColInputAndLabelWithClass(id, ColLabelOld, ColLabelNew, ColInputOld, ColInputNew) {
    $("label[for='" + id + "']").removeClass(ColLabelOld).addClass(ColLabelNew);
    $("#" + id + "").parent().removeClass(ColInputOld).addClass(ColInputNew);
}

function AlertConfirmDialog(text, title, callbackFunction) {
    var cbox = $('<p class="text-center"></p>').html(text);
    cbox.dialog({
        autoOpen: true,
        modal: true,
        title: title,
        show: "blind",
        hide: "explode", buttons: {
            "بله": function () {
                $(this).dialog("close");
                $(this).empty();
                callbackFunction();
            },
            "خیر": function () {
                $(this).dialog("close");
                $(this).empty();
            }
        }
    });
}

function ChangePassword() {
    var htm = $("#innerPass").html();
    $("#innerPass").html("");
    var cbox = $('<p class="text-center"></p>').html(htm);
    cbox.dialog({
        autoOpen: true,
        modal: true,
        width: 450,
        title: 'تغییر کلمه عبور',
        show: "blind",
        hide: "explode", buttons: {
            "ثبت": function () {
                var oldPassword = $("#oldPass").val();
                var newPassword = $("#newPass").val();
                var reapetPass = $("#reapetPass").val();
                if (newPassword == reapetPass) {
                    $.ajax({
                        url: '/Admin/Register/ChangePassword',
                        type: 'GET',
                        scriptCharset: "utf-16",
                        data: { oldPassword: oldPassword, newPassword: newPassword },
                        success: function (result) {
                            if (result.Result == -1) {
                                window.AlertDialog("کلمه عبور فعلی نادرست است.", "خطا", 'error');
                            } else {
                                $(cbox).dialog("close");
                                $(cbox).empty();
                                $("#innerPass").html(htm);
                            }
                        },
                        error: function () {
                            window.AlertDialog("متاسفانه عملیات با موفقیت انجام نشد.", "خطا");
                        }
                    });
                } else {
                    window.AlertDialog("تکرار کلمه عبور با کلمه عبور جدید برابر نیست.", 'خطا', 'error');
                }
            },
            "لغو": function () {
                $(cbox).dialog("close");
                $(cbox).empty();
                $("#innerPass").html(htm);
            }
        }
        , close: function (ev, ui) {
            $("#innerPass").html(htm);
        }
    });
}

function loadFormDialog(url, title, calbackFunc, width, height) {
    var $dialog;
    $dialog = $('<div id="frmDialog"></div>');
    $dialog.empty();
    $dialog
        .load(url)
        .dialog({
            autoOpen: false
            , title: title
            , width: width
            , modal: true
            //, draggable: false
            //, resizable: false
            , position: { my: "center top", at: "center top", of: window }
            , minHeight: height
            , show: 'blind'
            , hide: 'explode'
            //, open: function () {
            //    var win = $(window);
            //    //$(this).parent().css({
            //    //    left: (win.width() - $(this).parent().outerWidth()) / 2,
            //    //    top: (win.height() - $(this).parent().outerHeight()) / 2
            //    //});

            //},
        });
    $dialog.dialog("option", "buttons", {
        "ثبت": function () {
            var dlg = $(this);
            calbackFunc(dlg);
        },
        "خروج": function () {
            $(this).dialog("close");
            $(this).empty();
        }
    });
    $dialog.dialog({
        closeOnEscape: true,
    });
    $dialog.dialog('open');
}

function moneyCommaSepWithReturn(ctrl) {

    if (ctrl != "" && ctrl != null) {
        return AmountMaskE2(ctrl);
    }
}

function moneyCommaSep(ctrl) {

    if (ctrl.value != "") {
        ctrl.value = AmountMaskE2(ctrl.value);
    }
}

function isPlusNumberKey(evt, obj) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function isNumberKey(evt, obj) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 45 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    else if (charCode == 45) {
        if ($(obj).val().toString().length == 1) {
            if ($(obj).val().toString() == "0") {
                $(obj).val('-');
                return false;

            } else {
                return false;
            }
        } else if ($(obj).val().toString().length == 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function isMinusNumberKey(evt, obj) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 45) {
        if ($(obj).val().toString().length == 0) {
            return true;
        } else {
            $(obj).val("");
            return false;
        }
    } else {
        if ($(obj).val().toString().length == 0) {
            $(obj).val("");
            return false;
        }
    }
    try {
        if ($(obj).val() == "-") {
            return true;
        }
        if (parseInt(removeComa($(obj).val())) < 0) {
            if (charCode != 46 && charCode > 31
                && (charCode < 48 || charCode > 57))
                return false;
            return true;
        } else {
            return false;
        }
    } catch (e) {

        return false;
    }

}

function isBothNumberKey(evt, obj) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode != 45 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    else if (charCode == 45) {
        if ($(obj).val().toString().length == 1) {
            if ($(obj).val().toString() == "0") {
                $(obj).val('-');
                return false;

            } else {
                return false;
            }
        } else if ($(obj).val().toString().length == 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
    return true;
}

function AmountMaskE2(amount) {

    var i, j, mystring, flag;
    if (amount == '')
        return "";
    i = amount.length;
    mystring = "";
    for (j = 0; j < i; j++) {
        if (amount.substring(j, j + 1) == ",") {
            flag = true;
        }
    }
    if (flag == true) {
        amount = DAmountMaskE(amount);
    }




    var _isPositive = amount >= 0 ? true : false;
    var _tempAmount = Math.abs(amount).toString();
    i = _tempAmount.length;
    if (i > 3) {
        for (j = i; j > 0; j = j - 3) {

            if (j > 3) {
                mystring = "," + _tempAmount.substring(j - 3, j) + mystring;

            } else {
                mystring = _tempAmount.substring(0, j) + mystring;
            }
        }
        return _isPositive == false ? '-' + mystring : mystring;
    } else {
        return amount;
    }
}

function DAmountMaskE(amount) {
    var i, j, mystring, str;
    i = amount.length;
    mystring = "";
    for (j = i; j >= 0; j -= 1) {
        str = amount.substring(j, j - 1);
        if (str != ",") {
            mystring = str + mystring;
        }
    }
    return mystring;
}

function removeComa(str) {
    if (str == "" || str == null) {
        return 0;
    }
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    return parseInt(str);
}

function RemoveAllCharForPrice(id) {

    try {

        $('#' + id).val(!isEmpty($('#' + id).val()) ? removeComaForString($('#' + id).val()) : $('#' + id).val());

    } catch (e) {

    }

}

function removeComaForString(str) {

    if (str == "" || str == null) {
        return 0;
    }
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    str = str.replace(",", "");
    return str;
}

function SetDataControl(selector) {
    $(selector).datepicker({
        dateFormat: 'yy/mm/dd', autoSize: true, changeMonth: true, changeYear: true, shortYearCutoff: 50,
        //minDate: window.StratDateCal,
        //maxDate: window.EndDateCal,
        yearRange: '1360:1400'
    });
}

$(document).ajaxComplete(function () {
    setTooltip();

});

function setTooltip() {

    //$('.MyTooltip').tipsy();
    //$('.MyTooltip').hover(function () {
    //    // Hover over code
    //    var title = $(this).attr('title');
    //    if ($(".MyTooltip").length == 0) {
    //        // <div class="popover fade bottom in" role="tooltip" id="popover521619" style="top: 58px; left: 961.609375px; display: block;"><div class="arrow"></div><h3 class="popover-title" style="display: none;"></h3><div class="popover-content">هشدارها</div></div>
    //      $('<p class="tooltip popover " ></p>')
    //            .text(title)
    //            .appendTo('body')
    //            .fadeIn('slow');
    //    }
    //}, function () {
    //    // Hover out code
    //    $('.MyTooltip').remove();
    //}).mousemove(function (e) {
    //    var mousex = e.pageX - 200; //Get X coordinates
    //    var mousey = e.pageY + 10; //Get Y coordinates
    //    $('.MyTooltip')
    //        .css({ top: mousey, left: mousex });
    //});
}

function LoadMenu() {
    //$('#side-menu').metisMenu();
}

function readFromCookie() {
    //
    var obj = readCookie("menuState");
    if (obj == undefined || obj == "undefined") {
        return;
    }
    var li = $('ul#side-menu').find('a[href="' + obj + '"]').parent();
    if (li != null && li != undefined) {
        FindParent(li);
        $(li[0]).addClass("active");
    }
}

function FindParent(current) {
    var o = current.parent()[0];
    var li = $(o).closest("li");
    if (li != null && li != undefined) {
        $(li).addClass("open");
        $(o).css("display", "block");
    }
}

$('ul#side-menu  li  a').click(function (e) {

    if ($(this).attr('href') != '#' && $(this).attr('href') != "javascript:") {
        createCookie("menuState", $(this).attr("href"), 1);
        // $('ul#side-menu  li  a').removeClass("active");
    }
});

$("ul#side-menu li a").hover(function () {
    $(this).find("span").animate({ paddingRight: "20px" }, 200);
}, function () {
    $(this).find("span").animate({ paddingRight: "0px" }, 200);
});

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function AjaxDialog(title, width, height, url) {
    var $loading = $('<img src="/Content/Image/LoadingIcon/ajax-loader_blue.gif" alt="loading" class="ui-loading-icon">');
    var $dialog = $('<div></div>');
    $dialog.empty();
    $dialog
        .append($loading)
        .load(url)
        .dialog({
            autoOpen: false
            , title: title
            , width: width
            , modal: true
            , draggable: true
            , resizable: false
            // , position: 'center top'
            , minHeight: height
            , show: 'blind'
            , hide: 'explode'
        });
    $dialog.dialog("option", "buttons", {
        "خروج": function () {
            $(this).dialog("close");
            $(this).empty();
        }
    });
    $dialog.dialog({
        closeOnEscape: true,
        open: function (event, ui) {

        }
    });
    $dialog.dialog('open');
}

function FillSelectByAjax(url, selectId, data, hasChoosen) {
    EmptySelect(selectId);
    if (url == undefined || url == "") {
        return;
    }
    $.ajax({
        url: url,
        type: 'GET',
        scriptCharset: "utf-16",
        contentType: "application/x-www-form-urlencoded; charset=UTF-16",
        data: data,
        success: function (state) {
            var optLable = document.createElement("option");
            document.getElementById(selectId).options.add(optLable);
            optLable.text = ("--");
            optLable.value = "";
            for (var i = 0; i < state.length; i++) {
                var opt = document.createElement("option");
                document.getElementById(selectId).options.add(opt);
                opt.text = (state[i].Text);
                opt.value = (state[i].Value);
                opt.selected = state[i].Selected;
            }
            if (hasChoosen) {
                RemoveDisableAttrTag(selectId);
                $('#' + selectId).trigger("chosen:updated");
            }
        }, error: function () {
            AlertDialog("متاسفانه عملیات انجام نشد", 'خطا', 'error');
        }
    });
}

function FillSelectByAjax(url, selectId, data, hasChoosen, showLable) {
    //Create Conditional By Mobin

    if (document.querySelectorAll("select[id=" + selectId + "]").length > 0)
        EmptySelect(selectId);

    if (url == undefined || url == "") {
        return;
    }
    $.ajax({
        url: url,
        type: 'GET',
        scriptCharset: "utf-16",
        contentType: "application/x-www-form-urlencoded; charset=UTF-16",
        data: data,
        success: function (state) {

            if (showLable) {
                var optLable = document.createElement("option");
                document.getElementById(selectId).options.add(optLable);
                optLable.text = ("--");
                optLable.value = "";
            }
            for (var i = 0; i < state.length; i++) {
                var opt = document.createElement("option");
                document.getElementById(selectId).options.add(opt);
                opt.text = (state[i].Text);
                opt.value = (state[i].Value);
                opt.selected = state[i].Selected;
            }
            if (hasChoosen) {
                RemoveDisableAttrTag(selectId);
                $('#' + selectId).trigger("chosen:updated");
            }
        }, error: function () {
            AlertDialog("متاسفانه عملیات انجام نشد", 'خطا', 'error');
        }
    });
}

function FillMultiSelectByAjax(url, selectId, data, hasChoosen, showLable) {
    //Create Conditional By Mobin

    if (document.querySelectorAll("select[id=" + selectId + "]").length > 0)
        EmptySelect(selectId);

    if (url == undefined || url == "") {
        return;
    }


    AjaxCallAction('GET', url, data, true, function (state) {

        try {
            if (showLable) {
                var optLable = document.createElement("option");
                document.getElementById(selectId).options.add(optLable);
                optLable.text = ("--");
                optLable.value = "";
            }
            for (var i = 0; i < state.length; i++) {
                var opt = document.createElement("option");
                document.getElementById(selectId).options.add(opt);
                opt.text = (state[i].Text);
                opt.value = (state[i].Value);
                opt.selected = state[i].Selected;
            }
            if (hasChoosen) {
                RemoveDisableAttrTag(selectId);
                $('#' + selectId).trigger("chosen:updated");
            }
        } catch (exception) {
            AlertDialog(exception);
        }
    }, false);



    //$.ajax({
    //    url: url,
    //    type: 'GET',
    //    scriptCharset: "utf-16",
    //    contentType: "application/x-www-form-urlencoded; charset=UTF-16",
    //    data: data,
    //    success: function (state) {
    //        if (showLable) {
    //            var optLable = document.createElement("option");
    //            document.getElementById(selectId).options.add(optLable);
    //            optLable.text = ("--");
    //            optLable.value = "";
    //        }
    //        for (var i = 0; i < state.length; i++) {
    //            var opt = document.createElement("option");
    //            document.getElementById(selectId).options.add(opt);
    //            opt.text = (state[i].Text);
    //            opt.value = (state[i].Value);
    //            opt.selected = state[i].Selected;
    //        }
    //        if (hasChoosen) {
    //            RemoveDisableAttrTag(selectId);
    //            $('#' + selectId).trigger("chosen:updated");
    //        }
    //    }, error: function () {
    //        AlertDialog("متاسفانه عملیات انجام نشد", 'خطا', 'error');
    //    }
    //});
}

function FillSelectByAjaxWithSearchInDatabase(selectId, value, e, obj, hasChoosen = true, showLable = true, data = { text: value }, url = "/Admin/CustomerInfo/getListPatientGlobal") {


    lastValue = e.which === 8 && isEmpty(e.target.value) ? "" : lastValue;

    lastValue = e.target.value != "" ? e.target.value : lastValue;

    if (e.which != 40 && e.which != 38 && (Number.isInteger(Number(lastValue)) ? true : lastValue.length >= 3)) {
        EmptySelect(selectId);
        $(".select2-selection.select2-selection--single[aria-labelledby='select2-" + selectId + "-container']").closest(".select2-container").siblings('select:enabled').select2('close');
        if (document.querySelectorAll("select[name=" + selectId + "]").length > 0)
            EmptySelect(selectId);

        if (url == undefined || url == "") return;
        $.ajax({
            url: url,
            type: 'GET',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: data,
            success: function (state) {

                if (showLable) {
                    var optLable = document.createElement("option");
                    document.getElementById(selectId).options.add(optLable);
                    optLable.text = ("جستجو کنید");
                    optLable.value = "";
                }
                for (var i = 0; i < state.length; i++) {
                    var opt = document.createElement("option");
                    document.getElementById(selectId).options.add(opt);
                    opt.text = (state[i].Text);
                    opt.value = (state[i].Value);
                    opt.selected = state[i].Selected;
                }
                if (hasChoosen) {
                    RemoveDisableAttrTag(selectId);
                    $('#' + selectId).trigger("chosen:updated");
                }

                $(".select2-selection.select2-selection--single[aria-labelledby='select2-" + selectId + "-container']").closest(".select2-container").siblings('select:enabled').select2('open');

                document.querySelector('.select2-search__field[aria-controls="select2-' + selectId + '-results"]').focus();

                $(obj).val(lastValue);
            }, error: function () {
                AlertDialog("متاسفانه عملیات انجام نشد", 'خطا', 'error');
            }
        });
    }
}

function EmptySelect(id) {

    var elSel = document.getElementById(id);
    var lengh = elSel.length;
    if (elSel.length > 0) {
        for (var i = 0; i < lengh; i++)
            elSel.remove(elSel[i]);
    }
    var ids = "#" + id;
    $(ids).value = "";
    $(ids).val("");
}

function EmptyChoosenSelect(id) {
    EmptySelect(id);
    UpdateChoosenSelect(id);
}

function DisableChoosenSelect(selectId) {
    $('#' + selectId).val("");
    $('#' + selectId).attr('disabled', true).trigger("chosen:updated");
}

function UpdateChoosenSelect(selectId) {
    $('#' + selectId).trigger("chosen:updated");
}

function DisableTag(tagId) {
    $("#" + tagId).val("");
    $("#" + tagId).attr('disabled', true);
}

function EmptyTag(tagId) {
    $("#" + tagId).val("");
}

function RemoveDisableAttrTag(tagId) {
    $("#" + tagId).removeAttr("disabled");
}

function compareDate(a, b) {
    var msDateA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var msDateB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    if (parseFloat(msDateA) < parseFloat(msDateB))
        return -1;  // lt
    else if (parseFloat(msDateA) == parseFloat(msDateB))
        return 0;  // eq
    else if (parseFloat(msDateA) > parseFloat(msDateB))
        return 1;  // gt
    else
        return null;  // error
}

function GlobalConfirm(obj, url) {
    var data = { id: $(obj).attr('data-id') };

    var dlg = $('#ConfirmDialog');

    //var innerHtml = $("#ConfirmDialog").find("div").html();

    //$(dlg).html(innerHtml);



    //var dlg = $('<p class="text-center"></p>').html('آیا مایل به تأیید نهایی این مورد هستید؟' + "<br/>"
    //    + "<div class='form-group'>" +
    //    + "<label class='control-label col-md-3'>نام</label>" +
    //    + "<div class='col-sm-9'>"
    //    + "<input class='form-control ' id='ConfirmDate' name='ConfirmDate' type='text' > "
    //    + "</div>"
    //    + "</div>");


    SetDataControl($("#ConfirmDateStr"));
    dlg.dialog({
        autoOpen: false,
        modal: true,
        title: 'تأیید نهایی',
        show: 'blind',
        hide: 'explode',
        buttons: {
            'بله': function () {
                $.ajax({
                    url: url,
                    type: 'POST',
                    scriptCharset: "utf-16",
                    data: { id: $(obj).attr('data-id'), confirmDate: $("#ConfirmDate").val() },
                    success: function (state) {
                        if (state.statusCode != null && state.statusCode == "301") {
                            AlertDialog('شما مجاز به انجام این عملیات نیستید.', 'خطا', 'error');
                        } else {
                            if (state != true) {
                                AlertDialog('متاسفانه عملیات با موفقیت انجام نشد.', 'خطا', 'error');
                            } else {
                                var parent = $(obj).parent();
                                $(obj).remove();
                                $(parent).addClass("text-success");
                                $(parent).html("تأیید شده");
                            }
                        }
                        dlg.dialog('close');
                        dlg.dialog('destroy');
                    },
                    error: function () {

                    }
                });
            },
            'خیر': function () {
                dlg.dialog('close');
                dlg.dialog('destroy');
                return false;
            }
        }
    });
    dlg.dialog('open');
    return false;
}

function AddToTable(tblId, arrayList, hiddenCell = null) {

    var table = document.getElementById(tblId);
    var rowId;

    for (var i = 0; i < arrayList.length; i++) {
        rowId = parseInt(table.rows.length);
        var row = table.insertRow(rowId);
        var indexRow = arrayList[i].length;
        for (var j = 0; j < indexRow; j++) {
            var cell1;
            if (hiddenCell == j)
                table.rows[i + 1].cells[hiddenCell - 1].innerHTML += arrayList[i][j];
            else {
                cell1 = row.insertCell(j);
                cell1.innerHTML = arrayList[i][j];
            }
        }
    }
}

function CreateEventChangeNullWithId(name) {
    $("#" + name + "").change();
}

function InitModal(
    title, url,
    data, actionName,
    visibleButtonAction = false,
    async = true, IsLoading = true,
    errorCallback = null,
    contentType = 'json',
    isMaximum = false,
    width = '70%') {

    AjaxCallAction("GET", url, data, async, function (res) {

        if (!res.error) {
            dialog = RaveshUI.showDialog({ zIndex: '1038', width: width, title: title, detail: '', icon: 'icon-comment-alt-lines', allowMaximum: true });
            dialog.setContent(res);
            dialog.setMaximum(isMaximum);
            if (!visibleButtonAction) {
                dialog.addFooterButton('ذخیره', 'btn bg-gradient-success btn-flat col-md-2 float-left', function () { actionName(); });
            }
            dialog.addFooterButton('بستن', 'btn bg-danger btn-flat col-md-2 float-left', null);
        }
        else {
            AlertDialog(res.message, '', 'error');
        }

    }, IsLoading, errorCallback, contentType);

}

function CloseModal() {
    $('#modalMain').modal('hide');

    dialog.close();
}

function downloadFile(filename) {


    var element = document.createElement('a');
    element.setAttribute('href', filename);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function ToggleSearchBlockAndSavePreferences() {

    var icon = $(this).find(".btn.btn-tool i");
    if ($(this).parents(".card").hasClass("collapsed-card")) {
        //icon.removeClass("fas fa-minus");
        //icon.addClass("fas fa-plus");
        saveUserPreferences('/Admin/Preferences/SavePreference', $(this).attr("data-hideAttribute"), false);
    } else {
        //icon.removeClass("fas fa-plus");
        //icon.addClass("fas fa-minus");
        saveUserPreferences('/Admin/Preferences/SavePreference', $(this).attr("data-hideAttribute"), true);
    }
}

function saveUserPreferences(url, name, _value) {
    if (name === null || name === '' || name === undefined)
        return;
    if (_value === null || _value === '' || _value === undefined)
        return;

    var postData = {
        name: name,
        value: _value
    };
    //addAntiForgeryToken(postData);
    $.ajax({
        cache: false,
        url: url,
        type: "POST",
        data: postData,
        dataType: "json",
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Failed to save preferences.');
        },
        complete: function (jqXHR, textStatus) {
            //$("#ajaxBusy span").removeClass("no-ajax-loader");
        }
    });
};

function WrapAndSaveBlockData(name, value) {
    saveUserPreferences('/Admin/Preferences/SavePreference', name, value);
}

function SaveBlockData(name, value) {
    saveUserPreferences('/Admin/Preferences/SavePreferenceVal', name, value);
}

function SaveGeneralPreference(name, value) {
    saveUserPreferences('/Admin/Preferences/SaveGeneralPreference', name, value);
}

function saveUserPreferencesObject(url, date, successCallBack = null) {
    if (date === null || date === '' || date === undefined)
        return;

    //addAntiForgeryToken(postData);
    $.ajax({
        cache: false,
        url: url,
        type: "POST",
        data: date,
        dataType: "json",
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Failed to save preferences.');
        },
        complete: function (jqXHR, textStatus) {
            //$("#ajaxBusy span").removeClass("no-ajax-loader");

            if (successCallBack != null) {
                successCallBack();
            }

        }
    });
};

function SavePreferenceObject(_name, _value, _userId, successCallBack = null) {


    //  اگر مقدار یوزر ایدی پر باشد برای همان کاربر اعمال میشود در غیر اینصورت برای تمامی کاربران اعمال میشود
    saveUserPreferencesObject('/Admin/Preferences/SavePreferenceObject', { uesrId: _userId, value: _value, name: _name }, successCallBack);
}

function ConfirmDelete(type, url, data, successCallBack, question = 'آیا مطمئن هستید که می‌خواهید حذف کنید؟') {
    //Swal.fire({
    //    title: 'آیا مطمئن هستید؟',
    //    text: "بعد از حذف امکان بازگرداندن وجود ندارد!",
    //    icon: 'warning',
    //    showCancelButton: true,
    //    cancelButtonText: 'لغو',
    //    confirmButtonColor: '#3085d6',
    //    cancelButtonColor: '#d33',
    //    confirmButtonText: 'بله, حذف شود!'
    //}).then((result) => {
    //    if (result.isConfirmed) {
    //        AjaxCallAction(type, url, data, true, function (res) {
    //            successCallBack(res);
    //            if (!res.error) {
    //                //Swal.fire(
    //                //    'حذف شد!',
    //                //    'حذف با موفقیت انجام شد.',
    //                //    'success'
    //                //)
    //                AlertDialog('حذف با موفقیت انجام شد', 'حذف شد!')
    //            }
    //            else {
    //                //Swal.fire(
    //                //    'شکست!',
    //                //    res.message,
    //                //    'error'
    //                //);
    //                AlertDialog(res.message, 'شکست!', 'error')
    //            }
    //        }, false)
    //    }
    //})


    RaveshUI.deleteConfirmModal('بله, حذف شود!', 'خیر', question, function () {

        AjaxCallAction(type, url, data, true, function (res) {
            if (!res.error) {
                successCallBack(res);
                AlertDialog('حذف با موفقیت انجام شد', 'حذف شد!')
            }
            else {
                AlertDialog(res.message, 'شکست!', 'error')
            }
        }, false);

    });


}

function ConfirmAction_2(type, url, data, successCallBack, message = "آیا مطمئن هستید؟") {
    RaveshUI.deleteConfirmModal('بله, انجام شود!', 'خیر', message, function () {
        AjaxCallAction(type, url, data, true, function (res) {
            if (!res.error) {
                successCallBack(res);
            }
            else {
                AlertDialog(res.message, 'شکست!', 'error')
            }
        }, false);
    });
}

function ConfirmAction(_text, successCallBack, unsuccessCallback) {
    Swal.fire({
        title: 'آیا مطمئن هستید؟',
        text: _text,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'لغو',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'بله, انجام شود!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (successCallBack != null && successCallBack != undefined)
                successCallBack();
        }
        else {

            if (unsuccessCallback != null && unsuccessCallback != undefined)
                unsuccessCallback();
        }
    })

}

var CurrentFocus_Search;

//  TextControl :   --------------------------------------------------------    کنترلی که جستجو روی آن انجام میشود
//  type :          GET or POST
//  url :           "/Admin/CustomerInfo/searchSalamatServices" --------    آدرس جستجوی مقدار
//  data :          { nationalNumberStr: _text }
//  iswait :        true or false   ----------------------------------------    نمایش یا عدم نمایش لودینگ
//  selectedId :    "CustomerId"    ----------------------------------------    قرار دادن مقدار انتخاب شده در این فیلد
//  isHref :        true or false   ----------------------------------------    بعد از انتخاب یک مورد، در صفحه جدید باز شود یا خیر
//  href_url :      "/Admin/CustomerInfo/Detail/"   --------------------    اگر isHref=true باشد بعد از انتخاب یک مورد از لیست این آدرس در یک صفحه دیگر باز میشود
function SearchServices(TextControl, type, url, data, iswait, selectedId, isHref, href_url, action_method = null, ajax_actionMethod = null) {

    AjaxCallAction(type, url, data, true, function (result) {
        var _patientList = [];
        if (result.length > 0) {
            $.each(result, function (i, item) {
                var _pName = item.Text;
                var _pId = item.Value;
                _patientList.push({ _pName, _pId });
            });
        }
        else {
            var _pName = "موردی یافت نشد";
            var _pId = "00000000-0000-0000-0000-000000000000";
            _patientList.push({ _pName, _pId });
        }
        if (ajax_actionMethod != null) {
            ajax_actionMethod();
        }
        AutoCompleteSearchServices(document.getElementById(TextControl.id), _patientList, selectedId, isHref, href_url, action_method);
    }, iswait);
}

function AutoCompleteSearchServices(inp, resultList, selectedId, isHref, href_url, action_method = null) {

    var a, b, i;
    closeAllLists();
    CurrentFocus_Search = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    a.setAttribute("tabindex", "-1");

    inp.parentNode.appendChild(a);

    for (i = 0; i < resultList.length; i++) {

        b = document.createElement("DIV");
        b.innerHTML += resultList[i]._pName;
        b.innerHTML += "<input type='hidden' value='" + resultList[i]._pName + "' id='" + resultList[i]._pId + "'>";
        b.addEventListener("click", function (e) {

            inp.value = this.getElementsByTagName("input")[0].value;

            if (isHref) {
                document.location.href = href_url + this.getElementsByTagName("input")[0].id + "";
            }
            else {
                if (this.getElementsByTagName("input")[0].id != '00000000-0000-0000-0000-000000000000') {
                    $("#" + selectedId).val(this.getElementsByTagName("input")[0].id);
                }
            }

            closeAllLists();

            if (action_method != null) {
                action_method();
            }
        });
        a.appendChild(b);
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function SearchPatientUtility(TextControl, selectedId, key = null) {

    if ($("#SearchEnterKeyOnly").val() == "true") {
        if (key.which != 13) {
            return;
        }
    }


    if ($(TextControl).val() === null || $(TextControl).val() === "" || $(TextControl).val() === undefined) {
        $("#" + selectedId).val("");
        return;
    }

    var _text = $(TextControl).val();
    if (!isEmpty(_text) && _text.length >= 1) {
        SearchServices(TextControl, "POST",
            "/Admin/CustomerInfo/SearchPatients",
            { text: _text, conditionoperator: $("#inputValForConditional").val() },
            false,
            selectedId,
            false,
            "",
            function () {

            }
        );
    }
}

function ComposeSms_ShowModal(id) {

    InitModal('نوشتن پیام جدید', '/Admin/SMS/ComposeToAContact', { Id: id }, function () { Send_Sms() }, true);
}

function Send_Sms(sendertype) {


    var _phoneNumber = $("#PhoneNumber").val();
    var _text = $("#Text").val();
    if (_phoneNumber != null && _phoneNumber != "" && _phoneNumber != undefined) {
        if (_text != null && _text != "" && _text != undefined) {


            $("#SenderType").val(sendertype);
            $.post("/Admin/SMS/ComposeSms", $("#SMSComposeToAContactFrm").serialize()).done(
                function (result) {

                    if (result == true) {
                        $("#PhoneNumbers").val('');
                        $("#Text").val('');
                        $("#modalMain").modal('hide');
                        AlertDialog("پیام با موفقیت ارسال شد", "موفق");
                    }
                    else {
                        AlertDialog("ارسال انجام نشد", "خطا", "error");
                    }
                });

        } else {
            alert("متن را وارد نمایید");
            return false;
        }
    } else {
        alert("شماره موبایل را وارد نمایید");
        return false;
    }
}

function SearchAccClientsUtility(TextControl, selectedId) {

    if ($(TextControl).val() === null || $(TextControl).val() === "" || $(TextControl).val() === undefined) {
        $("#" + selectedId).val("");
        return;
    }
    var _text = $(TextControl).val();
    if (!isEmpty(_text) && _text.length >= 1) {
        SearchServices(TextControl, "POST",
            "/Admin/Accounting/SearchAccClients",
            { text: _text, conditionoperator: $("#inputValForConditional").val() },
            false,
            selectedId,
            false,
            "",
            function () {

            }
        );
    }
}

