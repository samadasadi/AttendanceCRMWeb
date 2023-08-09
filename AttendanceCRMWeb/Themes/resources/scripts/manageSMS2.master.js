var notyList = [];
var isUSSMS = false;
var onlyHasUSSMS = false;
function addToNotyList(id_, notyId_) {
    notyList.push({ id: id_, notyId: notyId_ });
}
function removeFromNotyList(id_) {

    var i = getIndexInNotyList(id_);
    if (i != -1) {
        notyList.splice(i, 1);
    }
}
function getIndexInNotyList(id_) {
    for (var i = 0; i < notyList.length; i++) {

        if (notyList[i].id == id_) {
            return i;
        }
    }
    return -1;
}


//--Quick Send By sending text
function quickSend_(senderId_, tel_, text_, customerCode_, successFunc_, title_) {



    var params_ = {};
    params_.items = {};
    params_.items.domain = $("#HFdomain").val();
    params_.items.user_code = $("#HFUserCode").val();
    params_.items.codeing = $("#hfcodeing").val();
    params_.items.senderId = senderId_;
    params_.items.tel = tel_;
    params_.items.text = text_;
    params_.items.customerCode = customerCode_;
    params_.items.title = title_;


    params = JSON.stringify(params_);

    $.ajax({
        type: "POST",
        url: "../WebServices/SMS2mgr.asmx/quickSend_",
        data: params,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (a, b, c) {
            if (successFunc_ != undefined && typeof (successFunc_) == "function") {
                successFunc_(a, b, c);
            }
        }
    });


}

//---------------------------------------------------------------------------------------------------------
//-- adds function to jQuery for acceptingOnly numeric keypress (used in textboxes)
//---------------------------------------------------------------------------------------------------------
$.fn.onlyAcceptNumeric = function (enterOperation) {
    this.keydown(function (evt) {
        // Allow: backspace, delete, tab, escape, and enter
        //document.title = evt.keyCode;
        if (evt.keyCode == 46 || evt.keyCode == 8 || evt.keyCode == 9 || evt.keyCode == 27 || evt.keyCode == 13 ||
        // Allow: dash (-)
            (evt.keyCode == 109 || evt.keyCode == 189) ||
        // Allow: paranteses ()
            ((evt.keyCode == 48 || evt.keyCode == 57) && evt.shiftKey === true) ||
       // Allow: Space
            (evt.keyCode == 32) ||
        // Allow: Ctrl+A
            (evt.keyCode == 65 && evt.ctrlKey === true) ||
        // Allow: F1 - F12
            (evt.keyCode >= 112 && evt.keyCode <= 123) ||
        // Allow: home, end, left, right
            (evt.keyCode >= 35 && evt.keyCode <= 39)) {
            if (evt.keyCode == 13) {
                if (enterOperation != undefined && typeof enterOperation == "function") {
                    enterOperation();
                }
            }

            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57) && (evt.keyCode < 96 || evt.keyCode > 105)) {
                evt.preventDefault();
            }
        }
    });
    return this;
};
//---------------------------------------------------------------------------------------------------------

function deleteCurrentPackStatus_(packId_) {
    var params_ = {};
    params_.items = {};
    params_.items.domain = $("#HFdomain").val();
    params_.items.user_code = $("#HFUserCode").val();
    params_.items.codeing = $("#hfcodeing").val();
    params_.items.packId = packId_;
    params = JSON.stringify(params_);

    $.ajax({
        type: "POST",
        url: "../WebServices/SMS2mgr.asmx/deleteCurrentPackStatus_",
        data: params,
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });
}


$.fn.changDirection = function (text_) {

    var smsbody = (text_ == undefined ? $(this).val() : text_);

    var smsbodylength = smsbody.length;
    var hasUnicodeChar = false;
    for (var i = 0; i < smsbodylength; ++i) {
        if (smsbody.charCodeAt(i) >= 256) {
            hasUnicodeChar = true;
            break;
        }
    }
    if (hasUnicodeChar) {

        $(this).css({
            "direction": "rtl",
            "text-align": "right"
        });
    } else {

        $(this).css({
            "direction": "ltr",
            "text-align": "left"
        });
    }
}

function getCorrectTelNo(tel_) {
    if (isUSSMS) {
        var usPhoneNo = tel_.match(/^([1]?\s*\(\s*[0-9]{3}\s*\)|\(\s*[1]?\s*[0-9]{3}\s*\)|\(\s*[1]?\s*[0-9]{3}\s*\)\s*\-*|[1]?\s*\(\s*\s*[0-9]{3}\s*\)\s*\-*|[1]?\s*[0-9]{3}\s*\-*)\s*([0-9]{3})\s*\-*\s*([0-9]{4})/g);
        if (usPhoneNo == null) {
            return "";
        }
        else {
            var validNumbers = usPhoneNo[0].match(/\d+/gm);
            var retStr = "";
            $.each(validNumbers, function (i) {
                retStr += "" + validNumbers[i];
            })
            return retStr.length == 10 ? retStr : retStr.substring(1, 11);
        }
    } else {
        if (tel_.substring(0, 3) == "021" && tel_.length == 11) {
            return '98' + tel_.substring(1, 11);
        } else {
            return tel_.substring(0, 1) != '0' && tel_.length == 11 ? tel_.substring(1, 11) : tel_;
        }
    }
}
function isValidNumberForSend(phonNumber) {
    if (isUSSMS) {
        var isvalid = phonNumber.match(/^([1]?\s*\(\s*[0-9]{3}\s*\)|\(\s*[1]?\s*[0-9]{3}\s*\)|\(\s*[1]?\s*[0-9]{3}\s*\)\s*\-*|[1]?\s*\(\s*\s*[0-9]{3}\s*\)\s*\-*|[1]?\s*[0-9]{3}\s*\-*)\s*([0-9]{3})\s*\-*\s*([0-9]{4})/g);
        if (isvalid == null) {
            return false;
        } else {
            if (isvalid[0] != phonNumber) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        var num = phonNumber.match(/\d+/);
        if (num == null) {
            return false;
        } else {
            var n = num[0];
            //شماره هایی که پنل اس ام اس دیگری است و پیامک فرستاده می شود
            if (
                        (n.length > 5 && n.length < 15) &&
                        (
                             n.substring(0, 4) == "1000" ||
                             n.substring(0, 4) == "2000" ||
                             n.substring(0, 4) == "3000" ||
                             n.substring(0, 4) == "4000" ||
                             n.substring(0, 4) == "5000"
                         )
                   ) {
                return true;
            } //شماره های موبایل معمولی
            else if (
                            (n.length == 11 && n.substring(0, 2) == "09") ||
                            (n.length == 12 && n.substring(0, 3) == "989") ||
                            (n.length == 13 && n.substring(0, 4) == "+989") ||
                            (n.length == 10 && n.substring(0, 1) == "9" && n.substring(0, 2) != "98") ||
                            (n.length == 11 && n.substring(0, 1) != "0" && n.substring(1, 2) == '9')
                        ) {
                return true;
            }//شماره تلفن های ثابت
            else if (
                            (n.length == 11 && n.substring(0, 3) == "021") ||
                            (n.length == 12 && n.substring(0, 4) == "9821") 
                ) {
                return true;
            }

        }
    }
    return false;
}








