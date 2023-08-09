
comet.addListener("factor", function (c) {
    $.each(c, function (i, item) {
        fnNewRequestStore(item.Data, false);
    });
    //  $('body').append('<object loop="false" type="application/x-shockwave-flash" data="../themes/resources/sounds/store.swf" width="0px" height="0px"><param name="movie" value="../themes/resources/sounds/store.swf" /></object>');
    playAudio("../themes/resources/sounds/store.mp3");

});

comet.addListener("factor_close", function (c) {
    $.each(c, function (i, item) {
        $('.popupfactor_' + item.Data).remove();
    });
});

comet.addListener("factor_refresh", function (c) {
    $('.facapprov').each(function () { $(this).parents('li:first').remove(); });
    var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
    $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../webservices/store_.asmx/get_factorPopup",
        data: JSON.stringify(e), dataType: "json", success: function (c) {
            if (c.d[0] != "error") {
                $.each(c.d[1], function (i, item) {
                    fnNewRequestStore(item, false);
                });
            }
        }
    });
});

function fnNewRequestStore_call() {
    if (!chatlistLoaded) setTimeout("fnNewRequestStore_call();", 1000);
    else {
        $.each(user_noty.Store, function (i, item) {
            fnNewRequestStore(item, true);
        });
    }
}

function fnNewRequestStore(item, first) {
    $('.popupfactor_' + item.FactorId).remove();
    var UserNameMe = $('#HFUserCode').val()
    var OnlineUserV = new Array();
    var indexUsOn = 0;
    $.each(usersOnline, function (uson, status) {
        OnlineUserV[indexUsOn] = uson;
        indexUsOn++;
    });

    var VisitorList = item.UsersResponser.split(','); //user visitor
    if (VisitorList.indexOf(UserNameMe) != -1 && item.FactorStatus == 0) {

        var VisitForMe = false; //Agar user current mojaz be taeed in darkhast bashad
        for (j = 0; j <= VisitorList.length - 1; j++) {
            if (OnlineUserV.indexOf(VisitorList[j]) != -1) {
                if (VisitorList[j] == UserNameMe) VisitForMe = true;
                else
                    VisitForMe = false;
                break;
            }
        }

        var Btnforward = '<span id="forwardFactor" item="" ></span>'; // get next visitor
        for (v = VisitorList.indexOf(UserNameMe) + 1; v <= VisitorList.length - 1; v++) {
            if (OnlineUserV.indexOf(VisitorList[v]) != -1) {
                Btnforward = '<span id="forwardFactor" factorId="' + item.FactorId + '" item=' + UserNameMe + "," + VisitorList[v] + ' class="ui-icon ui-icon-arrowreturnthick-1-w left_right" title="Forward to ' + VisitorList[v] + '"></span>';
                break;
            }
        }

        if (VisitForMe) { //Agar in message visitoresh user current bood

            var urlFacType = (item.FactorType == 2) ? "type=pre&" : "";
            noty({ layout: 'bottomLeft',
                theme: 'noty_theme_default facapprov ' + item.Id + ' popupfactor_' + item.FactorId,
                type: 'information',
                texttitle: item.Owner,
                icons: '<span style="cursor:pointer" FactorId="' + item.FactorId + '" id="closeNoty" title="close" class="ui-icon ui-icon-closethick left_right" ></span>' + Btnforward,
                text: '<a class="regFac" style="cursor:pointer" href="../pages/Store_FactorSales.aspx?' + urlFacType + 'FactorID=' + item.FactorId + '&rnd_=' + urlParams['rnd_'] + '">' + convFacMessage(resources.store.cap_msg_fac_req_ok, item.FactorCode, item.FactorType) + '</a>',
                timeout: false,
                onClose: true
            });
        }
    }
    else
        if (UserNameMe == item.Owner) {
            if (item.FactorStatus == 0) {

                var notyText = '', notyTitle = '';
                //visitor this factor
                for (v = 0; v <= VisitorList.length - 1; v++)
                    if (OnlineUserV.indexOf(VisitorList[v]) != -1) { notyTitle = resources.store.cap_status_wait_approval.replace('#', VisitorList[v]); break; }
            if (notyTitle == '') notyTitle = resources.store.cap_status_wait; //agar visitor in factor online nabood title = wait
            notyText = '<span class="regFac" >' + convFacMessage(resources.store.cap_msg_fac_wait, item.FactorCode, item.FactorType) + '</span>';

            noty({ layout: 'bottomLeft',
                theme: 'noty_theme_default facapprov ' + item.Id + ' popupfactor_' + item.FactorId,
                type: 'notification',
                texttitle: notyTitle,
                icons: '<span style="cursor:pointer" FactorId="' + item.FactorId + '" id="closeNoty" title="close" class="ui-icon ui-icon-closethick left_right" ></span>',
                text: notyText,
                timeout: false,
                onClose: true
            });
        }

        if (item.FactorStatus == 1) {
            var urlFacType = (item.FactorType == 2) ? "type=pre&" : "";
            var hrefA = '../pages/Store_FactorSales.aspx?' + urlFacType + 'FactorID=' + item.FactorId + '&rnd_=' + urlParams['rnd_'];
            noty({ layout: 'bottomLeft',
                theme: 'noty_theme_default facapprov ' + item.Id + ' popupfactor_' + item.FactorId,
                type: 'success',
                texttitle: resources.store.cap_status_yes + " " + resources.store.cap_by2 + " " + item.UsersResponser,
                icons: '<span style="cursor:pointer" FactorId="' + item.FactorId + '" id="closeNoty" title="close" class="ui-icon ui-icon-closethick left_right" ></span>',
                text: '<span class="regFac"><a href="' + hrefA + '" >' + convFacMessage(resources.store.cap_msg_fac_ok, item.FactorCode, item.FactorType) + '</a></span>',
                timeout: false,
                onClose: true
            });
        }

        if (item.FactorStatus == 2) {
            var urlFacType = (item.FactorType == 2) ? "type=pre&" : "";
            var hrefA = '../pages/Store_FactorSales.aspx?' + urlFacType + 'FactorID=' + item.FactorId + '&rnd_=' + urlParams['rnd_'];
            noty({ layout: 'bottomLeft',
                theme: 'noty_theme_default facapprov ' + item.Id + ' popupfactor_' + item.FactorId,
                type: (!item.Msg) ? 'error' : 'warning',
                texttitle: resources.store.cap_status_no + " " + resources.store.cap_by2 + " " + item.UsersResponser,
                icons: '<span style="cursor:pointer" FactorId="' + item.FactorId + '" id="closeNoty" title="close" class="ui-icon ui-icon-closethick left_right" ></span>',
                text: ((!item.Msg) ? '<span class="regFac"><a href="' + hrefA + '" >' + convFacMessage(resource.store.cap_msg_fac_not_ok, item.FactorCode, item.FactorType) + '</a></span>' : '<span class="regFac"><a href="' + hrefA + '" >' + unescape(item.Msg) + '</a></span>'),
                timeout: false,
                onClose: true
            });
        }
    }
}

function convFacMessage(inputMSG, code, type) {
    return (inputMSG).replace('s1', code).replace('s0', ((type == 2) ? resources.store.cap_factor_before : resources.store.cap_factor));
}

$(document).ready(function () {
    fnNewRequestStore_call();
    $('#forwardFactor').live('click', function () {
        var thisBtn = $(this);
        if (thisBtn.attr('item') != "") {
            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.users = thisBtn.attr('item');
            e.o.factorId = thisBtn.attr('factorId');
            $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../webservices/store_.asmx/forward_factorPopup",
                data: JSON.stringify(e), dataType: "json", success: function (c) {
                    thisBtn.parents('.noty_bar').fadeOut('fast', function () { $(this).remove(); });
                }
            });
        }
    });

    $('#closeNoty').live('click', function () {
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.factorId = $(this).attr('FactorId');
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../webservices/store_.asmx/close_factorPopup",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
            }
        });
    });

});