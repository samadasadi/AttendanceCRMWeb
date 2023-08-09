var blinkOrder = 0;
var userinfo = {};
var usersOnline = {};
var defaultpicture = '../themes/resources/images/noimage.jpg';
var defaultDisplayMessage = 'Enter personal message';
//if (resources.lang == "fa") {
//    defaultDisplayMessage = 'پیام شخصی وارد کنید';
//} else {
//    defaultDisplayMessage = 'Enter personal message';
//}
var newMessages = {}
var chatBoxes = new Array(); 
var isType = "";
var chatplugs = {};
var custOnline = {};
var custinfo = {};
var tempCounter = 0;
var chatlistLoaded = false;
var CtlCheckCustOnline = false;
var timerItemTip;
var ChatStatusStr = ['InVisible', 'Online', 'Busy', 'Away'];
var ChatStared = false;

jQuery.fn.selectText = function () {
    var doc = document, element = this[0], range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};


comet.addListener("online_user", function (c) {
    $.each(c, function (i, item) {
        var user = { user_code: item.Data.split(",")[0], status: item.Data.split(",")[1] };
        if ($('#HFUserCode').val() == user.user_code) {
            $('.user-profile-cover .ChatstatusOption .ico-status').removeAttr('class').addClass('ico-status ico-' + user.status);
            $('.user-profile-cover .chatuserStatus').removeAttr('class').addClass('chatuserStatus chatuserStatus-' + status);
        } else {
            updateChatList_status(null, user);
        }
    });
});

comet.addListener("offline_user", function (c) {
    $.each(c, function (i, item) {
        var user = { user_code: item.Data.split(",")[0], status: item.Data.split(",")[1] };
        if ($('#HFUserCode').val() == user.user_code) {
            $('.user-profile-cover .ChatstatusOption .ico-status').removeAttr('class').addClass('ico-status ico-' + user.status);
            $('.user-profile-cover .chatuserStatus').removeAttr('class').addClass('chatuserStatus chatuserStatus-' + status);
        } else {
            updateChatList_status(null, user);
        }
    });
});

comet.addListener("chat_istype", function (c) {
    $.each(c, function (i, item) {
        $('#chatbox_' + item.Data + ' .chatistyping').show();
        setTimeout("$('#chatbox_" + item.Data + " .chatistyping').hide();", 3500);
    });
});

comet.addListener("change_chatboxStatus", function (c) {
    $.each(c, function (i, item) {
        var chatbox = item.Data;
        if (chatbox.Status == 2) {
            closeChatBox(chatbox.Code);
        } else {
            if ($("#chatbox_" + chatbox.Code).length <= 0) createChatBox(chatbox.Code, chatbox.Mode, chatbox.Title, $('.chatlistItem:[item=' + chatbox.Code + ']').data('status'));
            if (chatbox.Status == 1) MinimizeChatBox(chatbox.Code);
            if (chatbox.Status == 0) openChatBox(chatbox.Code);
        }
    });
});

comet.addListener("change_display_message", function (c) {
    $.each(c, function (i, item) {
        var chatitem = $('.chatlistItem:[item=' + item.Data.user_code + ']');
        var message = item.Data.message;
        chatitem.data('data').displaymessage = message;
        if (message != "") {
            chatitem.find('.chatname').removeClass('no-message');
            chatitem.find('.displaymessage').text(message).attr('title', message).show();
            chatitem.find('.txtdisplaymessage').text(message).attr('title', message);;
            $('.user-profile-cover .txtdisplaymessage').text(message).attr('title', message);
        }
        else {
            chatitem.find('.chatname').addClass('no-message');
            chatitem.find('.displaymessage').text('').attr('title', '').hide();
            chatitem.find('.txtdisplaymessage').attr('title', defaultDisplayMessage).text(defaultDisplayMessage);
            $('.user-profile-cover .txtdisplaymessage').text(defaultDisplayMessage).attr('title', defaultDisplayMessage);
        }
    });
});

comet.addListener("change_display_status", function (c) {
    $.each(c, function (i, item) {
        var status = item.Data.status;
        if ($('#HFUserCode').val() == item.Data.user_code) {
            $('.user-profile-cover .ChatstatusOption .ico-status').removeAttr('class').addClass('ico-status ico-' + status);
            $('.user-profile-cover .chatuserStatus').removeAttr('class').addClass('chatuserStatus chatuserStatus-' + status);
        } else {
            updateChatList_status(null, item.Data);
        }
    });
});

comet.addListener("send_chat", function (c) {
    $.each(c, function (i, data) {
        var item = data.Data;
        setChatMessage(item.from, item.to, item.message, item.date, item.date2);
        seScrollChatbox(item.to);
    });
});
comet.addListener("recive_chat", function (c) {
    $.each(c, function (i, data) {
        var item = data.Data;
        chatboxtitle = item.from;
        if ($("#chatbox_" + chatboxtitle).length == 0) {
            createChatBox(chatboxtitle, 0, userinfo[chatboxtitle].name, $('.chatlistItem:[item=' + item.from + ']').data('status'));
            changeState(chatboxtitle, 0, $("#chatbox_" + chatboxtitle).data("mode"), $("#chatbox_" + chatboxtitle).find('.chatboxtitle').text());
        }
        if ($("#chatbox_" + chatboxtitle).data('status') != 0) { //agar dar halat namayesh kamel nabood
            changeState(chatboxtitle, 0, $("#chatbox_" + chatboxtitle).data("mode"), $("#chatbox_" + chatboxtitle).find('.chatboxtitle').text());
            openChatBox(chatboxtitle);
        }
        newMessages[chatboxtitle] = true;
        setChatMessage(item.from, item.to, item.message, item.date, item.date2);
        seScrollChatbox(chatboxtitle);
    });
    if (!windowFocus) {
        $('#chatbeep').remove();
        playAudio("../themes/resources/sounds/beep.mp3");
      //  $('body').append('<object id="chatbeep" type="application/x-shockwave-flash" data="../themes/resources/sounds/beep.swf" width="0px" height="0px"><param name="movie" value="../themes/resources/sounds/beep.swf" /></object>');
    }
});
/*----------customer chat------------------------------*/
comet.addListener("addcust", function (c) {
    $.each(c, function (i, data) {
        var item = eval("(" + data.Data + ")");
        setCustInfoToChatbox(item.cid, item.name, item.email, item.pretel, item.tel, item.mobile, item.cust_code, item.picture);
        $('#chatbox_' + item.cid).find('.divchat-cont').hide();
        $('#chatbox_' + item.cid).find('.chviewcust').show();
        $('#chatbox_' + item.cid).find('.chatbuttonplaceMain').show();
    });
});
comet.addListener("start_request_cust_chat", function (c) {
    $.each(c, function (i, data) {
        $.each(data.Data.custchat, function (i, item) {
            custOnline[item.cid] = item;
        });

        $.each(data.Data.customerChat, function (i, item) {
            if (item.picture == '') item.picture = defaultpicture;
            custinfo[item.id] = item;
        });
        addCustToQueue_Chat(data.Data.customerChat, false);

        $.each(data.Data.chatplugs, function (i, item) {
            chatplugs[item.id] = item;
        });
        checkCtlTimerCust();
    });
});

comet.addListener("waitAcustqueue", function (c) {
    $.each(c, function (i, data) {
        var item = $('#' + data.Data);
        item.find('.chatico-wait').data('wait', true);
    });
});
comet.addListener("endAcustqueue", function (c) {
    $.each(c, function (i, data) {
        $('#' + data.Data).remove();
    });
    checkCtlTimerCust();
});
comet.addListener("closeAcust", function (c) {
    $.each(c, function (i, data) {
        $('#chatbox_' + data.Data).remove();
        $('#' + data.Data).animate({ 'height': 0 }, 400, function () {
            $(this).remove();
            if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove(); checkCtlTimerCust(); });
        });
    });
});
comet.addListener("respFreecust", function (c) {
    $.each(c, function (i, data) {
        $('#chatbox_' + data.Data).remove();
        $('#' + data.Data).animate({ 'height': 0 }, 400, function () {
            $(this).remove();
            if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove(); checkCtlTimerCust(); });
        });
    });
});
comet.addListener("respAcustqueue", function (c) {
    $.each(c, function (i, data) {
        var item = $('#' + data.Data);
        item.find('.chatico-wait').data('wait', true);
        item.css('width', item.width());
        item.animate({ 'margin-right': '-' + (item.width() + 10) + 'px' }, 500, function () {
            $(this).animate({ 'height': 0 }, 400, function () {
                $(this).remove();
                if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove(); checkCtlTimerCust(); });
            });
        });
    });
});
comet.addListener("getmessage", function (c) {
    $.each(c, function (i, data) {
        $.each(data.Data, function (j, msg) {
            setChatMessage(msg.from, msg.to, msg.message, msg.date, msg.date2);
        });
        seScrollChatbox(chatboxtitle);
    });
});
comet.addListener("recivemsg_cust", function (c) {
    $.each(c, function (i, data) {
        var item = data.Data;
        chatboxtitle = item.from;
        if ($("#chatbox_" + chatboxtitle).data('status') != 0) { //agar dar halat namayesh kamel nabood
            changeState(chatboxtitle, 0, $("#chatbox_" + chatboxtitle).data("mode"), $("#chatbox_" + chatboxtitle).find('.chatboxtitle').text());
            openChatBox(chatboxtitle);
        }
        newMessages[chatboxtitle] = true;
        setChatMessage(item.from, item.to, item.message, item.date, item.date2);
        seScrollChatbox(chatboxtitle);
    });
    if (!windowFocus) {
        $('#chatbeep').remove();
        playAudio("../themes/resources/sounds/beep.mp3");
      //  $('body').append('<object id="chatbeep" type="application/x-shockwave-flash" data="../themes/resources/sounds/beep.swf" width="0px" height="0px"><param name="movie" value="../themes/resources/sounds/beep.swf" /></object>');
    }
});
comet.addListener("endcustchat", function (c) {
    $.each(c, function (i, data) {
        delete custOnline[data.Data];
        updateCust_Status();
    });
    checkCtlTimerCust();
});
comet.addListener("selectoldcust", function (c) {
    $.each(c, function (i, data) {
        var req = data.Data;
        if ($('#chatbox_' + req.data.id).length != 0) {
            $('#chatbox_' + req.data.id).remove();
            restructureQuickBoxes();
            changeState(0, req.data.id, 1, 1);
        }
        $("#chatbox_" + req.cid).attr('id', 'chatbox_' + req.data.id);
        $('#chatbox_' + req.data.id).find('.chchat').hide();
        $('#chatbox_' + req.data.id).find('.chatbuttonplaceMain').show();
        $('#chatbox_' + req.data.id).data('cust', req.data);
        custinfo[req.cid] = req.data;
        setCustInfoToChatbox(req.data.id, req.data.name, req.data.email, req.data.pretel, req.data.tel, req.data.mobile, req.data.cust_code, req.data.picture);
    });
});
comet.addListener("selectcust", function (c) {
    $.each(c, function (i, data) {
        $('#chatbox_' + data.Data.id).find('.chchat').hide();
        $('#chatbox_' + data.Data.id).find('.chatbuttonplaceMain').show();
        setCustInfoToChatbox(data.Data.id, data.Data.name, data.Data.email, data.Data.pretel, data.Data.tel, data.Data.mobile, data.Data.cust_code, data.Data.picture);
    });
});
function checkCtlTimerCust() {
    CtlCheckCustOnline = false;
    $('.chatbox-1').each(function () { //each to chatboxs cust
        if ($(this).data('custstatus') == 'online') CtlCheckCustOnline = true;
    });
    $('.chatcustisonline').each(function () { //each to cust queue
        if ($(this).hasClass('isonline')) CtlCheckCustOnline = true;
    });
}
/*----------end customer chat------------------------------*/

function fnBlink() {

    for (chatbox in newMessages) {
        if (newMessages[chatbox]) {
            $('#chatbox_' + chatbox + ' .chatboxhead').toggleClass('chatboxblink');
            if (!windowFocus) {
                if (document.title == originalTitle) {
                    document.title = $('#chatbox_' + chatbox + ' .chatboxtitle').text() + ' says...';
                } else {
                    document.title = originalTitle
                }
            }
        } 
    } 
}

function updateOnlineUser() {
    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/update_OnlineUser",
        data: JSON.stringify({ u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: { clientId: clientId} }), dataType: "json",
        timeout: 10000,
        success: function (c) {
            if (c.d[0] != "error") {
                updateChatList_status(c.d[1]);
            }
            setTimeout(function () { updateOnlineUser() }, 50000);
        },
        error: function () { setTimeout(function () { updateOnlineUser() }, 5000) }
    });
}

function updateOnlineCustomer() {
    if (!CtlCheckCustOnline) { setTimeout(function () { updateOnlineCustomer() }, 1000); return false; } 
    $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/update_OnlineCust",
        data: JSON.stringify({ u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: { clientId: clientId} }), dataType: "json",
        timeout: 10000,
        success: function (c) {
            if (c.d[0] != "error") {
                custOnline = {};
                $.each(c.d[1], function (i, item) {
                    custOnline[item.cid] = item;
                });
                updateCust_Status();
            }
            setTimeout(function () { updateOnlineCustomer() }, 15000);
        },
        error: function () { setTimeout(function () { updateOnlineCustomer() }, 5000) }
    });
}
function updateCust_Status() {
    $('.chatbox-1').each(function () { //each to chatboxs cust
        if (!custOnline.hasOwnProperty($(this).data().cust.id)) {//cust isNot online
            $(this).data('custstatus', 'offline');
            if ($(this).find('.DivDCmsgCust').length == 0) {
                $(this).find('.divchat-cont').hide();
                $(this).find('.chviewcust').show();
                $(this).find('.chviewcust .TblViewCustInfo').hide();
                var custname = ($(this).data().cust.code == 0) ? $(this).data().cust.name : '<a onclick="customer_Show_Info(' + $(this).data().cust.code + ',\'' + $(this).data().cust.name + '\');return false;">' + $(this).data().cust.name + '</a>';
                $(this).find('.chviewcust .TblViewCustInfo').after('<div class="DivDCmsgCust"><div class="Crm-icon Crm-icon32 Crm-icon-warning-32" style="float: none;display: inline-block;"></div><div><span class="chatcustname">' + custname + '</span><br/>' + resources.chat_disconnect + '</div></div>');
                $(this).find('.chatbuttonplaceMain input').attr('disabled', 'disabled');
                $(this).find('.chatbuttonplaceMain').show();
                $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-0');
            }
        } else {
            $(this).data('custstatus', 'online');
            $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-1');
            if ($(this).find('#BtnStartChat').hasClass('clicked')) {
                $(this).find('.divchat-cont').hide();
                $(this).find('.chchat').show();
                $(this).find('.chatbuttonplaceMain').hide();
            }
        }
    });
    $('.itemchatcust').each(function () {
        $(this).find('.chatcustisonline').removeClass('isonline').removeClass('noonline').addClass((custOnline.hasOwnProperty($(this).attr('id'))) ? 'isonline' : 'noonline');
    });
}

function getChatMessage(cods, mode) {
    var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
    e.o.clientId = clientId;
    e.o.code = cods;
    e.o.mode = mode;
    $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/getChatbox_message",
        data: JSON.stringify(e), dataType: "json",
        success: function (c) {
            var data = c.d;
            if (data[0] == "success") {
                $.each(data[1], function (i, item) {
                    setChatMessage(item.from, item.to, item.message, item.date, item.date2);
                    seScrollChatbox(item.to);
                });
            }
        }
    });
}

function startChatSession() {
    var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
    e.o.clientId = clientId;
    var arrCustList = new Array();
    $.each(user_noty.ChatboxList, function (i, item) { if (item.Mode == 1) arrCustList.push(item.Code); });
    e.o.custlist = arrCustList;
    $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/startsession_",
        data: JSON.stringify(e), dataType: "json",
        success: function (c) {
            var data = c.d;
            if (data.mode == "success") {
                $.each(data.usersInfo, function (i, item) {
                    if (item.picture == '') item.picture = defaultpicture;
                    userinfo[item.user_code] = item;
                });

                $.each(data.usersOnline, function (i, item) {
                    usersOnline[item.User_code] = item.Status;
                });
                updateChatList(data.usersInfo, usersOnline);

                chatlistLoaded = true;
                updateOnlineUser();

                var arrCods = new Array();
                $.each(user_noty.ChatboxList, function (i, item) {
                    arrCods.push(item.Code);
                });
                if (arrCods.length != 0) getChatMessage(arrCods, 0);

                /*******cust*///
                $.each(data.custchat, function (i, item) {
                    custOnline[item.cid] = item;
                });

                $.each(data.customerChat, function (i, item) {
                    if (item.picture == '') item.picture = defaultpicture;
                    custinfo[item.id] = item;
                });
                addCustToQueue_Chat(data.customerChat, true);

                $.each(data.chatplugs, function (i, item) {
                    chatplugs[item.id] = item;
                });

                $.each(user_noty.ChatboxList, function (i, item) {
                    if (item.Mode == 1) {
                        createChatBox(item.Code, item.Mode, item.Title, (custinfo.hasOwnProperty(item.Code) ? 1 : 0));
                        if (item.Status == 1) MinimizeChatBox(item.Code);
                    }
                });
                checkCtlTimerCust();
                updateOnlineCustomer();
                updateCust_Status();
                /*******/
                ChatStared = true;
            }
        }
    });





   //m $.each(data.activeChatBox, function (i, item) {
   //m     if ($("#chatbox_" + item.to_).length <= 0) {
   //m         createChatBox(item.to_, item.mode);
   //m         if (item.status_ == 2) closeChatBox(item.to_);
   //m         if (item.status_ == 1) MinimizeChatBox(item.to_);
   //m         if (item.status_ == 0) openChatBox(item.to_);
   //m     }
   //m });
   //m $.each(data.messages, function (i, item) {
   //m     if (item) { // fix strange ie bug
   //m         setChatMessage(item.from, item.to, item.message, item.date, item.date2);
   //m     }
   //m });
   //m
   //m $.each(data.custchat, function (i, item) {
   //m     custOnline[item.cid] = item;
   //m });
   //m $('.chatbox-1').each(function () { //each to chatboxs cust
   //m     if (!custOnline.hasOwnProperty($(this).data().cust.id)) {//cust isNot online
   //m         $(this).data('custstatus', 'offline');
   //m         if ($(this).find('.DivDCmsgCust').length == 0) {
   //m             $(this).find('.divchat-cont').hide();
   //m             $(this).find('.chviewcust').show();
   //m             $(this).find('.chviewcust .TblViewCustInfo').hide();
   //m             var custname = ($(this).data().cust.code == 0) ? $(this).data().cust.name : '<a onclick="customer_Show_Info(' + $(this).data().cust.code + ',\'' + $(this).data().cust.name + '\');return false;">' + $(this).data().cust.name + '</a>';
   //m             $(this).find('.chviewcust .TblViewCustInfo').after('<div class="DivDCmsgCust"><div class="Crm-icon Crm-icon32 Crm-icon-warning-32" style="float: none;display: inline-block;"></div><div><span class="chatcustname">' + custname + '</span><br/>' + resorces.chat_disconnect + '</div></div>');
   //m             $(this).find('.chatbuttonplaceMain input').attr('disabled', 'disabled');
   //m             $(this).find('.chatbuttonplaceMain').show();
   //m             $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-0');
   //m         }
   //m     } else {
   //m         $(this).data('custstatus', 'online');
   //m         $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-1');
   //m     }
   //m });
   //m
   //m for (i = 0; i < chatBoxes.length; i++) { seScrollChatbox(chatBoxes[i]); }

    
}



$(document).ready(function () { //5800
    if (resources.lang == "fa") {
        defaultDisplayMessage = 'پیام شخصی وارد کنید';
    } else {
        defaultDisplayMessage = 'Enter personal message';
    }

    var optChatStatus = $('<div class="itemStatusProfile" style="overflow: hidden;line-height: 25px;position: absolute;top: 17px;"></div>');
    optChatStatus.append('<div class="txtdisplaymessage" style="display:none;" firstClick="true" title="' + defaultDisplayMessage + '">' + defaultDisplayMessage + '</div>' +
                         '<span class="ChatstatusOption left_right" style="padding: 0px 5px;" title="' + resources.smsStatusTotal[4] + '"><span class="ico-status ico-0" style="display: inline-block;padding: 0;"></span><span class="ui-icon ui-icon-triangle-1-s" style="display: inline-block;margin: 0 3px;padding: 0;vertical-align: middle;"></span></span>');

    $('body').append('<div class="popupChatStatus" style="display:none;">' +
                             '<div><span class="left_right ico-status ico-1" style="padding: 0;margin-bottom: 0;line-height: inherit;"></span><a style="display: inline-block;padding: 0;" item="1">Online</a></div>' +
                             '<div><span class="left_right ico-status ico-3" style="padding: 0;margin-bottom: 0;line-height: inherit;"></span><a style="display: inline-block;padding: 0;" item="3">Away</a></div>' +
                             '<div><span class="left_right ico-status ico-2" style="padding: 0;margin-bottom: 0;line-height: inherit;"></span><a style="display: inline-block;padding: 0;" item="2">Busy</a></div>' +
                             '<div><span class="left_right ico-status ico-0" style="padding: 0;margin-bottom: 0;line-height: inherit;"></span><a style="display: inline-block;padding: 0;" item="0">InVisible</a></div>' +
                         '</div>');

    $('.user-profile-cover').append(optChatStatus);

    startChatSession();

    $.each(user_noty.ChatboxList, function (i, item) {
        if (item.Mode == 0) {
            createChatBox(item.Code, item.Mode, item.Title, 0);
            if (item.Status == 1) MinimizeChatBox(item.Code);
        }
    });

    $([window, document]).blur(function () {
        windowFocus = false;
    }).focus(function () {
        windowFocus = true;
        document.title = originalTitle;
    });

    $('body').mousemove(function () {
        windowFocus = true;
        $('.chatbox').each(function () {
            newMessages[$(this).attr('id').replace('chatbox_', '')] = false;
            $(this).find('.chatboxhead').removeClass('chatboxblink');
        });
        if (document.title != originalTitle) document.title = originalTitle;
    });

    setInterval("SeNoghte()", 500);
    setInterval("fnBlink()", 1000);

    $('.txtdisplaymessage').live('click', function () {
        $(this).attr('contenteditable', '');
        if ($(this).attr('firstClick') != "false") {
            $('.txtdisplaymessage').selectText();
            $(this).attr('firstClick', false);
        }
    });
    $('.txtdisplaymessage').live('blur', function () {
        var message = $('.txtdisplaymessage').text();
        if (message == "") $('.txtdisplaymessage').text(defaultDisplayMessage);
        if (message == defaultDisplayMessage) message = "";
        $('.txtdisplaymessage').attr('firstClick', true).attr('contenteditable', 'false');
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.message = message;
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/change_displayMessage",
            data: JSON.stringify(e), dataType: "json", success: function (c) { }
        });
        $('.txtdisplaymessage').attr('title', message);
    });
    $(".txtdisplaymessage").live('keyup', function (event) {
        if (event.keyCode == 13) {
            $('.txtdisplaymessage').blur();
        }
    });

    $('.ChatstatusOption').live('click', function () {
        if ($('.popupChatStatus').css('display') == 'none') {
            $('.popupChatStatus').css('left', $(this).offset().left + ((resources.direction == "rtl") ? -32 : 2)).css('top', $(this).offset().top + 30);
            $('.popupChatStatus').show();
        } else {
            $('.popupChatStatus').hide();
        }
    });
    $(document).bind('click', function (e) {
        if (!$(e.target).hasClass('ChatstatusOption') && $(e.target).parents('.ChatstatusOption').length == 0) { $('.popupChatStatus').hide(); }
    });
    $('.popupChatStatus div').live('click', function () {
        var status = $(this).find('a').attr('item');
        $('.user-profile-cover .ChatstatusOption .ico-status').removeAttr('class').addClass('ico-status ico-' + status);
        $('.user-profile-cover .chatuserStatus').removeAttr('class').addClass('chatuserStatus  chatuserStatus-' + status);
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
       // if (status == 3) status = 2;
        e.o.status = status;
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/change_displayStatus",
            data: JSON.stringify(e), dataType: "json", success: function (c) { }
        });
    });


    $(".chatbox").live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.chatboxtextarea').focus();
    });

    $('.chatbox .ui-icon-close').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatboxtitle = chatbox.attr('id').replace('chatbox_', '');
        chatbox.css('display', 'none');
        restructureQuickBoxes();
        changeState(chatboxtitle, 2, chatbox.data("mode"), chatbox.find('.chatboxtitle').text());
        checkCtlTimerCust();
    });
    $('.chatbox .ui-icon-minus').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatboxtitle = chatbox.attr('id').replace('chatbox_', '');

        chatbox.find('.chat-container').css('display', 'none');
        chatbox.data("status", 1);
        changeState(chatboxtitle, 1, chatbox.data("mode"), chatbox.find('.chatboxtitle').text());

        $(this).parent().find('.ui-icon-newwin').show();
        $(this).hide();
    });
    $('.chatbox .ui-icon-newwin').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatboxtitle = chatbox.attr('id').replace('chatbox_', '');

        chatbox.find('.chat-container').css('display', 'block');
        seScrollChatbox(chatboxtitle);
        chatbox.data("status", 0);
        changeState(chatboxtitle, 0, chatbox.data("mode"), chatbox.find('.chatboxtitle').text());

        $(this).parent().find('.ui-icon-minus').show();
        $(this).hide();
    });

    $('.chatbox .emoticonSelect').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        if (chatbox.find('.popupemoticon').css('display') == 'none') {
            chatbox.find('.popupemoticon').show();
            chatbox.find('.chatboxtextarea').attr('disabled', 'disabled');
            chatbox.find('.emoticonSelect').addClass('selected');
        }
        else {
            chatbox.find('.popupemoticon').hide();
            chatbox.find('.chatboxtextarea').attr('disabled', '');
            chatbox.find('.emoticonSelect').removeClass('selected');
        }
    });
    $('.chatbox .popupemoticon img').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.chatboxtextarea').val(chatbox.find('.chatboxtextarea').val() + ' ' + $(this).attr('title'));
        chatbox.find('.chatboxtextarea').attr('disabled', '');
        chatbox.find('.popupemoticon').hide();
        chatbox.find('.emoticonSelect').removeClass('selected');
        chatbox.find('.chatboxtextarea').focus();
    });
    $('.chatbox .ui-icon-gear').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.popupsetting').toggle();
    });
    $('.chatbox .chatboxcontent').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.popupsetting').hide();
    });
    $('.chatbox .popupsetting a').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var chatboxtitle = chatbox.attr('id').replace('chatbox_', '');
        chatbox.find('.popupsetting').hide();
        if ($(this).attr('item') == 1) {
            show_fileManager(3, function (item, urlmode) {
                if (item.type != 0) {
                    var message = [];
                    if (item.type == 1) {
                        message = [1, item.url, item.thumbnail];
                    } else {
                        message = [2, item.url, item.filename];
                    }
                    var randomnumber = Math.floor(Math.random() * 100000);
                    setChatMessage($('#HFUserCode').val(), chatboxtitle, message, getDateUtcNow(), '');
                    $("#chatbox_" + chatboxtitle + ' .itemmessage:last').attr('tempid', randomnumber);
                    seScrollChatbox(chatboxtitle);
                    $(item.dialogID).dialog('close');

                    var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
                    e.o.to_ = chatboxtitle;
                    e.o.message_ = message;
                    e.o.mode = chatbox.data('mode');
                    e.o.clientId = clientId;
                    e.o.username = $('#HFUserUserName').val();
                    $.ajax({
                        type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/sendchat_media", dataType: "json",
                        data: JSON.stringify(e),
                        success: function (c) {
                            if (c.d[0] == "error") {
                                $("#chatbox_" + chatboxtitle + ' .itemmessage:[tempid=' + randomnumber + '] .chatmessage-media').css('border-color', 'red');
                            }
                        }, error: function (erro) {
                            $("#chatbox_" + chatboxtitle + ' .itemmessage:[tempid=' + randomnumber + '] .chatmessage-media').css('border-color', 'red');
                        }
                    });

                }
            });
        } else if ($(this).attr('item') == 2) {
            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.user_code = chatboxtitle;
            $.ajax({
                type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/clearHistory_", dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    if (c.d[0]) {
                        $("#chatbox_" + chatboxtitle + ' .chatboxmessage').remove();
                    }
                }
            });
        }
    });

    $('.chatlistItem').live('click', function () {
        if ($(this).hasClass('thisuserchatItem')) return false;
        if ($(this).data('data').ChatTurnOn == false) return false;
        if ($("#dv_mblist .divthisuserchat .thisuserchatItem").data('data').ChatTurnOn == false) return false;
        var chatuser = $(this).data('data');
        changeState(chatuser.user_code, 0, 0, chatuser.name);

        var existsChatBox = ($("#chatbox_" + chatuser.user_code).length != 0);
        if (!existsChatBox ) {
            createChatBox(chatuser.user_code, 0, chatuser.name, $(this).data('status'));
            getChatMessage([chatuser.user_code], $('#chatbox_' + chatuser.user_code).data("mode"));
        }
        openChatBox(chatuser.user_code);
        return false;
    });
});
var NumSeNoghte = "";
function SeNoghte() {
    NumSeNoghte += ".";
    if (NumSeNoghte.length > 3) NumSeNoghte = "";
    $('.chatistyping span').text(NumSeNoghte);
}

var emturl = "../Themes/resources/images/emoticon/";
var emt = {
    ":)": 'smiley',
    ":s": 'confuse',
    "B)": 'cool',
    ":'(": 'cry',
    "8)": 'eek',
    ":(|)": 'kiss',
    ":D": 'lol',
    ":$": 'money',
    ":|": 'neutral',
    ":p": 'razz',
    ":')": 'red',
    "8-)": 'roll',
    ":(": 'sad',
    "|)": 'sleep',
    ";)": 'wink',
    ":-D": 'yell'
};
function emoticons(text) {
    //text = chake_str(text, 16);  
    Object.keys(emt).forEach(function (ico) {
        var icoE = ico.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        text = text.replace(new RegExp(icoE, 'g'), '<img style="width:16px;height:16px;margin-top:3px;" src="' + emturl + 'smiley-' + emt[ico] + '.png" title="' + emt[ico] + '"/>');
    });
    return text;
}
function chake_str(str, number) {
    var result = "";
    var chlin = 1;
    $.each(str, function (i, c) {
        if (chlin > number) {
            result += "<wbr>";
            chlin = 1;
        }
        if (c == " ")
            chlin = 1;
        else
            chlin += 1;
        result += c;
    });
    return result;
}
function littleText(text, maxLength) {
    if (text.length > maxLength) {
        text = text.substring(0, maxLength - 1);
    }
    return text;
}
function restructureQuickBoxes() {
    align = 0;
    var right = 20;
    if (resources.lang == "fa") {
        if ($(".page-sideber-content").hasClass('page-sidebar-closed')) {
            right = 40;
        } else {
            right = 170;
        }
    } else {
        if (!$("#menuQuickBar").hasClass('hide')) {
            right = 270;
        } else {
            right = 50;
        }
    }
    $('.quickbox').each(function () {
        if ($(this).css('display') != 'none') {
            if (align == 0) {
                $(this).css('right', right + 'px');
                right += $(this).width() + 10;
            } else {
                $(this).css('right', right + 'px');
                right += $(this).width() + 10;
            }
            align++;
        }
    });
}

function createChatBox(chatboxtitle, mode, title, status) {
    if ($("#chatbox_" + chatboxtitle).length > 0) {
        if ($("#chatbox_" + chatboxtitle).css('display') == 'none') {
            $("#chatbox_" + chatboxtitle).css('display', 'block');
            $("#chatbox_" + chatboxtitle).find('.chatboxinput').css('display', 'block');
            $("#chatbox_" + chatboxtitle).find('.chatboxcontent').css('display', 'block');

            restructureQuickBoxes();
        }
        $("#chatbox_" + chatboxtitle + " .chatboxtextarea").focus();
        return;
    }

    if (mode == 0) {//user
        $(" <div />").attr("id", "chatbox_" + chatboxtitle)
	.addClass("chatbox chatbox-0 quickbox")
	.html('<div class="chatboxhead">' +
            '<div class="ico-status ico-' + status + '" style="float: left;"></div>' +
            '<div class="chatboxtitle">' + title + '</div>' +
            '<div class="chatboxoptions">' +
                '<span class="ui-icon_chat ui-icon-close" style="float:right;"></span>' +
                '<span class="ui-icon_chat ui-icon-gear" style="float: right;"></span>' +
                '<span class="ui-icon_chat ui-icon-minus" style="float:right;"></span>' +
                '<span class="ui-icon_chat ui-icon-newwin" style="float:right;display:none;"></span>' +
            '</div>' +
            '<div class="linechatstatus linestatus-' + status + '"></div>' +
            '<br clear="all"/>' +
          '</div>' +
          '<div class="chat-container">' +
          '<div class="chatboxtool">' +
            '<div class="BtnSetting"></div>' +
            '<div class="BtnAddUser"></div>' +
          '</div>' +
          '<div class="chatboxcontent"></div>' +
          '<div class="popupsetting"><a item="1">Send file</a><a item="2">clear chat history</a></div>' +//<a item="3" class="last">مشاهده آرشیو گفتگو</a>
          '<div class="chatboxinput">' +
          '<div class="chatistyping" style="display:none;">' + resources.istype + '<span></span></div>' +
          '<div class="emoticonSelect"></div>' +
            '<div class="popupemoticon"><div class="popupemoticon-arrow"></div></div>' +
            '<textarea class="chatboxtextarea" onkeydown="javascript:return checkChatBoxInputKey(event,this);"></textarea>' +
          '</div></div>').appendTo($("body"));
    }
    else
        if (mode == 1) { //chat with customer
            $(" <div />").attr("id", "chatbox_" + chatboxtitle)
	.addClass("chatbox chatbox-1 quickbox")
    .data('custstatus', (status == 0) ? 'offline' : 'online')
	.html('<div class="chatboxhead">' +
            '<div class="ico-status ico-' + status + '" style="float: left;"></div>' +
            '<div class="chatboxtitle">' + title + '</div>' +
            '<div class="chatboxoptions">' +
                '<span class="ui-icon_chat ui-icon-close" style="float:right;"></span>' +
                '<span class="ui-icon_chat ui-icon-minus" style="float:right;"></span>' +
                '<span class="ui-icon_chat ui-icon-newwin" style="float:right;display:none;"></span>' +
            '</div>' +
            '<br clear="all"/>' +
          '</div>' +
          '<div class="chat-container">' +
            '<div class="divchat-cont chwait" style="display:block"></div>' +
            '<div class="divchat-cont chviewcust"></div>' +
            '<div class="divchat-cont chaddcust"></div>' +
            '<div class="divchat-cont chselectcust"></div>' +
            '<div class="divchat-cont chreferchat"></div>' +
            '<div class="divchat-cont chmsgchat"></div>' +
            '<div class="divchat-cont chchat" style="height: 346px;">' +
                '<div class="chatboxcontent"></div>' +
                '<div class="chatboxinput">' +
                    '<div class="emoticonSelect"></div>' +
                    '<div class="backchatview" title="view chat info"></div>' +
                    '<div class="popupemoticon"><div class="popupemoticon-arrow"></div></div>' +
                    '<textarea class="chatboxtextarea" onkeydown="javascript:return checkChatBoxInputKey(event,this);"></textarea>' +
                '</div>' +
            '</div>' +
          '</div>').appendTo($("body"));

            setCustInfoToBox(chatboxtitle, custinfo[chatboxtitle]);
        }

    for (var key in emt) {
        $("#chatbox_" + chatboxtitle + " .popupemoticon").append('<img style="width:16px;height:16px;" src="' + emturl + 'smiley-' + emt[key] + '.png" title="' + key + '"/>');
    }

    $("#chatbox_" + chatboxtitle).css('bottom', '0px');
    $("#chatbox_" + chatboxtitle).data("mode", mode);
    $("#chatbox_" + chatboxtitle).data("status", 0);

    chatBoxeslength = 0;

    for (x in chatBoxes) {
        if ($("#chatbox_" + chatBoxes[x]).css('display') != 'none') {
            chatBoxeslength++;
        }
    }

    restructureQuickBoxes();

    chatBoxes.push(chatboxtitle);

    $("#chatbox_" + chatboxtitle).show();
     
}

function setCustInfoToBox(cust_cid, item) {
    if (!item) {changeState(cust_cid, 2, 1, '');closeChatBox(cust_cid);  return false; } 

    /*wait*/
    $("#chatbox_" + cust_cid + ' .chwait').append('<div class="chatbodyplace"><div class="waitreturncustinfo"><div class="wait" style="display: inline-block;"></div><div>' + resources.please_wait + '</div></div></div><div class="chatbuttonplace"></div>');
    /*view customer*/
    $("#chatbox_" + cust_cid).data("cust", item);
    var tblview = $('<table class="TblViewCustInfo" style="width:100%"></table>');
    if (item.code != 0)
        tblview.append('<tr><td><b>'+resources.name+' </b></td><td><a onclick="customer_Show_Info(' + item.code + ',\'' + item.name + '\');return false;">' + item.name + '</a><td></tr>');
    else
        tblview.append('<tr><td><b>' + resources.name + ' </b></td><td><span class="chatcustname">' + item.name + '</span><td></tr>');
    tblview.append('<tr><td><b> ' + resources.email + '</b></td><td><span class="chatcustemail">' + item.email + '</span><td></tr>');
    if (resources.lang == "fa") {
        tblview.append('<tr><td><b> ' + resources.tel + '</b></td><td><span class="chatcusttel">' + item.pretel + '-' + item.tel + '</span><td></tr>');
    } else {
        tblview.append('<tr><td><b> ' + resources.tel + '</b></td><td><span class="chatcusttel">' + item.tel + '</span><td></tr>');
    }
    if (item.code != 0)
        tblview.append('<tr><td><b> ' + resources.mobile + '</b></td><td><a onclick="click_sms=true; qucikSendSms(\'' + item.code + '\',\'' + item.mobile + '\');return false;">' + item.mobile + '</a><td></tr>');
    else
        tblview.append('<tr><td><b> ' + resources.mobile + '</b></td><td><span class="chatcustmobile">' + item.mobile + '</span><td></tr>');
    tblview.append('<tr><td><b> ' + resources.request + '</b></td><td>' + item.subject + '<td></tr>');
    tblview.append('<tr><td></td><td style="text-align:left"><b>' + item.ip + '</b><td></tr>');
    tblview.append('<tr><td></td><td style="text-align:left"><a target="_blank" href="' + item.url + '" title="' + item.url + '">' + littleText(item.url, 40) + '</a><td></tr>');
    $("#chatbox_" + cust_cid + ' .chviewcust').append('<div class="chatbodyplace"></div>');
    $("#chatbox_" + cust_cid + ' .chviewcust .chatbodyplace').append(tblview);

    var btnPlace = $('<div class="chatbuttonplace"></div>');
    btnPlace.append('<input style="width:165px" type="submit" id="BtnCreateCustomer" ' + ((item.code != 0) ? 'disabled' : '') + ' value="' + resources.newcustomer + '"/>');
    btnPlace.append('<input style="width:165px" type="submit" id="BtnSelectCustomer" ' + ((item.code != 0) ? 'disabled' : '') + ' value="' + resources.selectcustomer + '"/>');
    $("#chatbox_" + cust_cid + ' .chviewcust').show().append(btnPlace);
    $("#chatbox_" + cust_cid + ' .chwait').hide();

    /*add customer*/
    var tbladd = $('<table style="width:100%"></table>');
    tbladd.append('<tr><td><b> ' + resources.name + ' </b></td><td><input type="text" id="txtchatcustname" value="' + item.name + '" class="chatinput"/><td></tr>');
    tbladd.append('<tr><td><b> ' + resources.email + '</b></td><td><input type="text" id="txtchatcustemail" value="' + item.email + '" class="chatinput"/><td></tr>');
    if (resources.lang == "fa") {
        tbladd.append('<tr><td><b> ' + resources.tel + '</b></td><td><input type="text" id="txtchatcusttel" value="' + item.tel + '" class="chatinput" style="width:114px"/><span class="chatinput-elem">-</span><input type="text" id="txtchatcustpretel" value="' + item.pretel + '" class="chatinput" style="width:20px"/><td></tr>');
    } else {
        tbladd.append('<tr><td><b> ' + resources.tel + '</b></td><td><input type="text" id="txtchatcusttel" value="' + item.tel + '" class="chatinput"/><td></tr>');
    }
    tbladd.append('<tr><td><b> ' + resources.mobile + '</b></td><td><input type="text" id="txtchatcustmobile" value="' + item.mobile + '" class="chatinput"/><td></tr>');
    tbladd.append('<tr><td><b> ' + resources.groupcustomer + '</b></td><td><select id="drdchatcustgroup"></select><td></tr>');
    $.each(chatplugs[item.chatid].groupcust, function (i, opt) { tbladd.find('#drdchatcustgroup').append('<option value="' + opt.groupcode + '">' + opt.groupname + '</option>'); });
    $("#chatbox_" + cust_cid + ' .chaddcust').append('<div class="chatbodyplace"></div>');
    $("#chatbox_" + cust_cid + ' .chaddcust .chatbodyplace').append(tbladd);

    var btnPlace2 = $('<div class="chatbuttonplace"></div>');
    btnPlace2.append('<input style="width:165px" type="submit" id="BtnAddCustomer" value="' + resources.reg + '"/>');
    btnPlace2.append('<input style="width:165px" type="submit" class="BtnCancelAddCustomer" value="' + resources.cancel + '"/>');
    $("#chatbox_" + cust_cid + ' .chaddcust').append(btnPlace2);

    /*select customer*/
    $("#chatbox_" + cust_cid + ' .chselectcust').append('<div class="chatbodyplace">' +
                                                            '<div class="right_left" style="line-height: 30px;  padding: 0 7px;"><b>' + resources.name + '</b></div>' +
                                                            '<div class="right_left"><input type="text" id="TxtSrcCustNameChat" class="chatinput" style="width: 180px;" value="' + item.name + '"></div>' +
                                                            '<div class="right_left"><input type="submit" id="btnsearchcustChat" value="' + resources.search + '" style="margin-top: 2px;"></div>' +
                                                            '<div class="DivtblsearchCustChat"></div><div class="DivsearchCustChatInfo"></div>' +
                                                        '</div>');
    var btnPlace3 = $('<div class="chatbuttonplace"></div>');
    btnPlace3.append('<input style="width:165px" type="submit" id="BtnSetCustomer" value="' + resources.reg + '" disabled/>');
    btnPlace3.append('<input style="width:165px" type="submit" class="BtnCancelAddCustomer" value="' + resources.cancel + '"/>');
    $("#chatbox_" + cust_cid + ' .chselectcust').append(btnPlace3);

    /*refer chat*/
    $("#chatbox_" + cust_cid + ' .chreferchat').append('<div class="chatbodyplace">' +
                                                            '<div style="font-weight: bold;margin: 15px 0 5px;">' + resources.user + '</div><select style="width: 250px;" id="drdusersreferchat"></select>' +
                                                       '</div>');
    $.each(userinfo, function (i, opt) {
        if (opt.user_code != $('#HFUserCode').val()) $("#chatbox_" + cust_cid + ' #drdusersreferchat').append('<option cust_code="' + opt.cust_code + '" picture="' + opt.picture + '" value="' + opt.user_code + '">' + opt.name + '</option>');
    });

    var btnPlace4 = $('<div class="chatbuttonplace"></div>');
    btnPlace4.append('<input style="width:165px" type="submit" id="BtnSetReferChat" value="' + resources.transfer + '"/>');
    btnPlace4.append('<input style="width:165px" type="submit" class="BtnCancelAddCustomer" value="' + resources.cancel + '"/>');
    $("#chatbox_" + cust_cid + ' .chreferchat').append(btnPlace4);

    /*msg chat*/
    $("#chatbox_" + cust_cid + ' .chmsgchat').append('<div class="chatbodyplace">' +
                                                       '</div>');
    var btnPlace5 = $('<div class="chatbuttonplace"></div>');
    btnPlace5.append('<input style="width:165px" type="submit" id="BtnDisconnectChatYes" value="' + resources.yes + '"/>');
    btnPlace5.append('<input style="width:165px" type="submit" class="BtnCancelAddCustomer" value="' + resources.cancel + '"/>');
    $("#chatbox_" + cust_cid + ' .chmsgchat').append(btnPlace5);

    /*main buttons*/
    var btnPlaceMain = $('<div class="chatbuttonplaceMain"></div>');
    btnPlaceMain.append('<input style="width:125px;background-color: #FFECEC;" type="submit" id="BtnDisconnectChat" value="' + resources.disconnect + '"/>');
    btnPlaceMain.append('<input style="width:70px;background-color: #EFFCEF;" type="submit" id="BtnStartChat" value="' + resources.talk + '"/>');
    btnPlaceMain.append('<input style="width:125px;background-color: #FCFCED;" type="submit" id="BtnReferCustomer" value="' + resources.refer + '"/>');
    $("#chatbox_" + cust_cid + ' .chat-container').append(btnPlaceMain);

    /*chatbox title*/
    $("#chatbox_" + cust_cid + ' .chatboxtitle').text(item.name);
}



//mfunction chatHeartbeat(data) {
//m  //m  heartbeatparametr.isType = "";
//m    if (windowFocus == false) {
//m    
//m    	var blinkNumber = 0;
//m    	var titleChanged = 0;
//m    	for (x in newMessagesWin) {
//m    		if (newMessagesWin[x] == true) {
//m    			++blinkNumber;
//m    			if (blinkNumber >= blinkOrder) {
//m    			    var name = x;
//m    			    if (custinfo.hasOwnProperty(x)) name = custinfo[x].name;
//m    			    if (userinfo.hasOwnProperty(x)) name = userinfo[x].name;
//m    			    document.title = name + ' says...';
//m    				titleChanged = 1;
//m    				break;	
//m    			}
//m    		}
//m    	}
//m    	
//m    	if (titleChanged == 0) {
//m    		document.title = originalTitle;
//m    		blinkOrder = 0;
//m    	} else {
//m    		++blinkOrder;
//m    	}
//m    
//m    } else {
//m    	for (x in newMessagesWin) {
//m    		newMessagesWin[x] = false;
//m    	}
//m    }
//m    
//m    for (x in newMessages) {
//m    	if (newMessages[x] == true) {
//m    		if (chatboxFocus[x] == false) {
//m    			//FIXME: add toggle all or none policy, otherwise it looks funny
//m    		    $('#chatbox_' + x + ' .chatboxhead').toggleClass('chatboxblink');
//m    		}
//m    	}
//m    }
//m
//m    if (data.mode == "1") {
//m        if (data.hasOwnProperty("chatplugs")) {
//m            $.each(data.chatplugs, function (i, item) {
//m                chatplugs[item.id] = item;
//m            });
//m        }
//m        custOnline = {};
//m        if (data.hasOwnProperty("custchat")) {
//m            $.each(data.custchat, function (i, item) {
//m                custOnline[item.cid] = item;
//m            });
//m        } 
//m        usersOnline = {};
//m        $.each(data.usersOnline, function (i, item) {
//m            usersOnline[item] = item;
//m        });
//m        $('.chatbox-1').each(function () { //each to chatboxs cust
//m            if (!custOnline.hasOwnProperty($(this).attr('id').replace('chatbox_', ''))) {//cust isNot online
//m                $(this).data('custstatus', 'offline');
//m                if ($(this).find('.DivDCmsgCust').length == 0) {
//m                    $(this).find('.divchat-cont').hide();
//m                    $(this).find('.chviewcust').show();
//m                    $(this).find('.chviewcust .TblViewCustInfo').hide();
//m                    var custname = ($(this).data().cust.code == 0) ? $(this).data().cust.name : '<a onclick="customer_Show_Info(' + $(this).data().cust.code + ',\'' + $(this).data().cust.name + '\');return false;">' + $(this).data().cust.name + '</a>';
//m                    $(this).find('.chviewcust .TblViewCustInfo').after('<div class="DivDCmsgCust" style="text-align:center;line-height: 30px;font-size: 10pt;margin-top: 30px;"><div class="Crm-icon Crm-icon32 Crm-icon-warning-32" style="float: none;display: inline-block;"></div><div>' + resources.chat_disconnect + '</div></div>');
//m                    $(this).find('.chatbuttonplaceMain input').attr('disabled', 'disabled');
//m                    $(this).find('.chatbuttonplaceMain').show();
//m                    $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-0');
//m                }
//m            } else {
//m                if ($(this).data('custstatus') == 'offline') {
//m                    $(this).find('.chviewcust .TblViewCustInfo').show();
//m                    $(this).find('.DivDCmsgCust').remove();
//m                    $(this).find('.chatbuttonplaceMain input').attr('disabled', '');
//m                }
//m                $(this).data('custstatus', 'online');
//m                $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-1');
//m            }
//m        });
//m        $('.chatbox-0').each(function () { //each to chatboxs user
//m            if (!usersOnline.hasOwnProperty($(this).attr('id').replace('chatbox_', ''))) {//user isNot online
//m                $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-0');
//m                $(this).find('.linechatstatus').removeAttr('class').addClass('linechatstatus linestatus-0');
//m            }
//m            else {
//m                $(this).find('.ico-status').removeAttr('class').addClass('ico-status ico-1');
//m                $(this).find('.linechatstatus').removeAttr('class').addClass('linechatstatus linestatus-1');
//m            }
//m        });
//m
//m        if (data.hasOwnProperty("customerChat")) {
//m            $.each(data.customerChat, function (i, item) {
//m                if (item.picture == '') item.picture = defaultpicture;
//m                custinfo[item.id] = item;
//m            });
//m            addCustToQueue_Chat(data.customerChat, false);
//m        }
//m        updateChatList(data.usersOnline, null);
//m
//m        //$('#content .fields:last').append('<span class="splog">' + (tempCounter++) + '  ,  ' + JSON.stringify(data.request) + '<br/></span>');
//m        //if ($('#content .fields:last .splog').length > 20) $('#content .fields:last .splog:first').remove();
//m
//m        var newMsg = false;
//m        $('.chatistyping').hide();
//m        if (data.hasOwnProperty("request")) {
//m            $.each(data.request, function (i, item) {//5800
//m                var req = eval("(" + item + ")");
//m                if (req.mode == "recivemsg") {
//m                    chatboxtitle = req.data.from;
//m                    if ($("#chatbox_" + chatboxtitle).length == 0 && req.chatmode == 0) {
//m                        createChatBox(chatboxtitle, req.chatmode);
//m                    }
//m                    if ($("#chatbox_" + chatboxtitle).data('status') != 0 && req.chatmode == 0) { //agar dar halat namayesh kamel nabood
//m                        changeState(0, chatboxtitle, $('#chatbox_' + chatboxtitle).data("mode"), "");
//m                        openChatBox(chatboxtitle);
//m                    }
//m                    newMsg = true;
//m                    newMessages[req.data.from] = true;
//m                    newMessagesWin[req.data.from] = true;
//m                    setChatMessage(req.data.from, req.data.to, req.data.message, req.data.date, req.data.date2);
//m                    seScrollChatbox(req.data.from);
//m                }
//m                if (req.mode == "sendmsg") {
//m                    setChatMessage(req.data.from, req.data.to, req.data.message, req.data.date, req.data.date2);
//m                    seScrollChatbox(req.data.to);
//m                }
//m                if (req.mode == "changestate") {
//m                    if (req.data.status == 2) {
//m                        closeChatBox(req.data.chatbox);
//m                    } else {
//m                        if ($("#chatbox_" + req.data.chatbox).length <= 0) createChatBox(req.data.chatbox, req.data.mode);
//m                        if (req.data.status == 1) MinimizeChatBox(req.data.chatbox);
//m                        if (req.data.status == 0) openChatBox(req.data.chatbox);
//m                    }
//m                }
//m                if (req.mode == "istype") {
//m                    $("#chatbox_" + req.data + ' .chatistyping').show();
//m                }
//m                if (req.mode == "getmessage") {
//m                    $.each(req.data, function (j, msg) {
//m                        setChatMessage(msg.from, msg.to, msg.message, msg.date, msg.date2);
//m                    });
//m                    seScrollChatbox(chatboxtitle);
//m                }
//m                if (req.mode == "respAcustqueue") {
//m                    var item = $('#' + req.data);
//m                    item.find('.chatico-wait').data('wait', true);
//m                    item.css('width', item.width());
//m                    var data = item.data();
//m                    item.animate({ 'margin-right': '-' + (item.width() + 10) + 'px' }, 500, function () {
//m                        $(this).animate({ 'height': 0 }, 400, function () {
//m                            $(this).remove();
//m                            if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove() });
//m                        });
//m                    });
//m                }
//m                if (req.mode == "waitAcustqueue") {
//m                    var item = $('#' + req.data);
//m                    item.find('.chatico-wait').data('wait', true);
//m                }
//m                if (req.mode == "endAcustqueue") {
//m                    var item = $('#' + req.data);
//m                    item.animate({ 'height': 0 }, 400, function () {
//m                        $(this).remove();
//m                        if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove() });
//m                    });
//m                }
//m                if (req.mode == "refer") {
//m                    closeChatBox(req.data.cid);
//m                }
//m                if (req.mode == "addcust") {
//m                    $('#chatbox_' + req.data.id).find('.chchat').hide();
//m                    $('#chatbox_' + req.data.id).find('.chatbuttonplaceMain').show();
//m                    setCustInfoToChatbox(req.data.cid, req.data.name, req.data.email, req.data.pretel, req.data.tel, req.data.mobile, req.data.cust_code, req.data.picture);
//m                }
//m                if (req.mode == "selectcust") {
//m                    $('#chatbox_' + req.data.id).find('.chchat').hide();
//m                    $('#chatbox_' + req.data.id).find('.chatbuttonplaceMain').show();
//m                    setCustInfoToChatbox(req.data.id, req.data.name, req.data.email, req.data.pretel, req.data.tel, req.data.mobile, req.data.cust_code, req.data.picture);
//m                }
//m                if (req.mode == "selectoldcust") {
//m                    if ($('#chatbox_' + req.data.id).length != 0) {
//m                        $('#chatbox_' + req.data.id).remove();
//m                        restructureQuickBoxes();
//m                        changeState(0, req.data.id, 1, 1);
//m                    }
//m                    $("#chatbox_" + req.cid).attr('id', 'chatbox_' + req.data.id);
//m                    $('#chatbox_' + req.data.id).find('.chchat').hide();
//m                    $('#chatbox_' + req.data.id).find('.chatbuttonplaceMain').show();
//m                    $('#chatbox_' + req.data.id).data('cust', req.data);
//m                    custinfo[req.cid] = req.data;
//m                    setCustInfoToChatbox(req.data.id, req.data.name, req.data.email, req.data.pretel, req.data.tel, req.data.mobile, req.data.cust_code, req.data.picture);
//m                }
//m                if (req.mode == "startchat") {
//m                    $('#chatbox_' + req.data.cid).data('cust').rec = req.data.rec;
//m                }
//m                if (req.mode == "endcustchat") {
//m                    //req.data => cid cust dokme close ro zade
//m                }
//m                if (req.mode == "closeAcust" || req.mode == "respFreecust") {
//m                    $('#chatbox_' + req.data).remove();
//m                    $('#' + req.data).animate({ 'height': 0 }, 400, function () {
//m                        $(this).remove();
//m                        if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove() });
//m                    });
//m                }
//m            });
//m        }
//m
//m        if (newMsg && !windowFocus) {
//m            $('#chatbeep').remove();
//m            $('body').append('<object id="chatbeep" type="application/x-shockwave-flash" data="../themes/resources/sounds/beep.swf" width="0px" height="0px"><param name="movie" value="../themes/resources/sounds/beep.swf" /></object>');
//m        }
//m    }
//m
//m}

function closeChatBox(chatboxtitle) {
    $('#chatbox_' + chatboxtitle).css('display', 'none');
    restructureQuickBoxes();
}
function openChatBox(chatboxtitle) {
    $('#chatbox_' + chatboxtitle).css('display', 'block');
    $('#chatbox_' + chatboxtitle + ' .chat-container').css('display', 'block');
    $('#chatbox_' + chatboxtitle + ' .ui-icon-minus').show();
    $('#chatbox_' + chatboxtitle + ' .ui-icon-newwin').hide();
    $('#chatbox_' + chatboxtitle).data("status", 0);
}

function MinimizeChatBox(chatboxtitle) {
    $('#chatbox_' + chatboxtitle + ' .chat-container').css('display', 'none');
    $('#chatbox_' + chatboxtitle).data("status", 1);
    $('#chatbox_' + chatboxtitle + ' .ui-icon-minus').hide();
    $('#chatbox_' + chatboxtitle + ' .ui-icon-newwin').show();
}

function updateChatList_status(onlineusers, user) {

    var subFunk = function (user_code, status) {
        var item = $('#dv_mblist .chatlistItem:[item=' + user_code + ']');
        if (status == 0) {
            $(item).find('.chatuserpic').addClass('offlinechatitem');
            $(item).find('.chatname').find('a').addClass('offlinechatitem');
            $(item).find('.ico-status').removeAttr('class').addClass('chatitemstatus-' + resources.direction + ' ico-status ico-' + status);
            $(item).find('.chatuserStatus').removeAttr('class').addClass('chatuserStatus chatuserStatus-' + status);
        } else {
            $(item).find('.chatuserpic').removeClass('offlinechatitem');
            $(item).find('.chatname').find('a').removeClass('offlinechatitem');
            $(item).find('.ico-status').removeAttr('class').addClass('chatitemstatus-' + resources.direction + ' ico-status ico-' + status);
            $(item).find('.chatuserStatus').removeAttr('class').addClass('chatuserStatus chatuserStatus-' + status);
        }
        if ($('#dv_mblist .ChatListStatus-' + status + ' #' + $(item).attr('id')).length == 0) {
            var changeStateItem = $(item).clone();
            changeStateItem.data("data", $(item).data("data"));
            changeStateItem.data("status", status);
            $(item).remove();
            $('#dv_mblist .ChatListStatus-' + status).append(changeStateItem);
        }
        $('#chatbox_' + user_code + ' .ico-status').removeAttr('class').addClass('ico-status ico-' + status);
        $('#chatbox_' + user_code + ' .linechatstatus').removeAttr('class').addClass('linechatstatus linestatus-' + status);
    };
    if (user == null) {
        $('#dv_mblist .chatlistItem').each(function (i, item) {
            if (i != 0) {
                var status = 0;
                var obj = $.grep(onlineusers, function (s) { return s.User_code == $(item).attr('item') });
                if (obj.length != 0) status = obj[0].Status;
                subFunk($(item).attr('item'), status);
            }
        });
    } else {
        subFunk(user.user_code, user.status);
    }
  //  checkCtlTimerCust();
}

function updateChatList(userinfo, onlineuser) {
    var height = $('#dv_mblist').height();
    $('#dv_mblist').empty();
    $('#dv_mblist').append('<div class="divthisuserchat"></div><div class="ChatListStatus-1"></div><div class="ChatListStatus-3"></div><div class="ChatListStatus-2"></div><div class="ChatListStatus-0"></div>');
    $.each(userinfo, function (i, item) {
        if (item.user_code != $('#HFUserCode').val()) {
            var status = onlineuser[item.user_code];
            if (!status) status = 0;
            if (item.picture == '') item.picture = defaultpicture;

            var userItem = $('<div item="' + item.user_code + '" class="chatlistItem" id="chatlistItem-' + i + '">' +
                                '<div class="divchatpic-' + resources.direction + ' right_left">' +
                                    '<div class="chatuserStatus chatuserStatus-' + status + '"></div>' +
                                    '<img src="' + item.picture + '" class="chatuserpic">' +
                                '</div>' +
                                '<div class="chatname"><a>' + item.name + '</a></div>' +
                                '<div class="displaymessage" title="' + item.displaymessage + '">' + item.displaymessage + '</div>' +
                                '<div class="chatitemstatus-' + resources.direction + ' ico-status ico-' + status + '"></div>' +
                             + '</div>').data('data', item).data('status', status);
            if (item.displaymessage == "") { userItem.find('.displaymessage').hide(); userItem.find('.chatname').addClass('no-message'); }
            if (status == 0) {
                userItem.find('.chatuserpic,a').addClass('offlinechatitem');
            }
            $('#dv_mblist .ChatListStatus-' + status).append(userItem);
            $('#chatbox_' + item.user_code + ' .ico-status').removeAttr('class').addClass('ico-status ico-' + status);
            $('#chatbox_' + item.user_code + ' .linechatstatus').removeAttr('class').addClass('linechatstatus linestatus-' + status);
        } else {
            var status = item.status;
            var thisUser = $('<div item="' + item.user_code + '"  style="display:none" class="chatlistItem thisuserchatItem" id="chatlistItem-' + i + '">' +
                                '<div class="divchatpic-' + resources.direction + ' right_left">' +
                                    '<div class="chatuserStatus chatuserStatus-' + status + '"></div>' +
                                    '<img src="' + item.picture + '" title="' + item.user_code + '" class="chatuserpic" onclick="customer_Show_Info(' + item.cust_code + ',\'' + item.name + '\');return false;">' +
                                '</div>' +
                                '<span>' +
                                '<div style="cursor:default;"><span class="txtdisplayname" title="' + item.name + '">' + item.name + '</span>' +
                                //'<span class="ChatstatusOption" title="' + resources.smsStatusTotal[4] + '"><span class="ico-status ico-' + status + '" style="display: inline-block;margin: 0 1px -1px 1px;"></span>' +
                                '<span class="ui-icon ui-icon-triangle-1-s" style="display: inline-block;height: 12px;margin: 0 -2px;"></span></span>' +
                               // '<div class="txtdisplaymessage"  firstClick="true" title="' + item.displaymessage + '">' + ((item.displaymessage == "") ? defaultDisplayMessage : item.displaymessage) + '</div>' +
                                //'<div class="popupChatStatus" style="display:none">' +
                                //    '<div><span class="ico-status ico-1"></span><a item="1">Online</a></div>' +
                                //    '<div><span class="ico-status ico-3"></span><a item="3">Away</a></div>' +
                                //    '<div><span class="ico-status ico-2"></span><a item="2">Busy</a></div>' +
                                //    '<div><span class="ico-status ico-0"></span><a item="0">InVisible</a></div>' +
                                //'</div>' +
                         '</div>').data('data', item).data('status', status);
            $('.user-profile-cover .txtdisplaymessage').attr('title', item.displaymessage).text(((item.displaymessage == "") ? defaultDisplayMessage : item.displaymessage));
            $('.user-profile-cover .ChatstatusOption .ico-status').removeAttr('class').addClass('ico-status ico-' + status);
            $('.user-profile-cover .chatuserStatus').removeAttr('class').addClass('chatuserStatus  chatuserStatus-' + status);
            $('#dv_mblist .divthisuserchat').append(thisUser);
        }
    });

    var newHeight = $('#dv_mblist').height();
    $('#dv_mblist').css('height', height);//.animate({ height: newHeight + 'px' }, function () { $(this).css('height', 'auto') });
    $("#divChatScroll").perfectScrollbar('update');

    if (userinfo.length <= 7) {
        $("#searchChatUsersContent").hide();
    } else {
        $("#searchChatUsersContent").show();
    }
}


function changeState(code, status, mode, title) {/*aaaa*/
    $("#chatbox_" + code).data('status', status);
    var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
    e.o.code = code; e.o.status = status; e.o.mode = mode; e.o.title = title;e.o.clientId = clientId;
    $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/ChangeState_",
        data: JSON.stringify(e), dataType: "json", success: function (data) { checkCtlTimerCust(); }
    });
}

function changeIsType(user_code) {
    if (isType == "") {
        isType = user_code;
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.user_code = user_code;
        $.ajax({
            type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/istype_",
            data: JSON.stringify(e), dataType: "json", success: function (data) { }
        });
        setTimeout(function () { isType = ""; }, 4000);
    }
}

function checkChatBoxInputKey(event, chatboxtextarea) {
    $(chatboxtextarea).changDirection();
    chatboxtitle = $(chatboxtextarea).parents('.chatbox').attr('id').replace('chatbox_', '');
    changeIsType(chatboxtitle);
    if (event.keyCode == 13 && event.shiftKey == 0) {
        isType = "";
        message = $(chatboxtextarea).val();
        message = message.replace(/^\s+|\s+$/g, "");

        $(chatboxtextarea).val('');
        $(chatboxtextarea).focus();
        $(chatboxtextarea).css('height', '25px');
        if (message != '') {

            var randomnumber = Math.floor(Math.random() * 100000);
            setChatMessage($('#HFUserCode').val(), chatboxtitle, message, getDateUtcNow(), '');
            $("#chatbox_" + chatboxtitle + ' .itemmessage:last').attr('tempid', randomnumber);
            seScrollChatbox(chatboxtitle);

            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.to_ = chatboxtitle;
            e.o.message_ = message;
            e.o.mode = $("#chatbox_" + chatboxtitle).data('mode');
            e.o.clientId = clientId;
            e.o.username = $('#HFUserUserName').val();
            $.ajax({
                type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/sendchat_", dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    if (c.d[0] == "error") {
                        $("#chatbox_" + chatboxtitle + ' .itemmessage:[tempid=' + randomnumber + ']').css('color', 'red');
                    }
                }, error: function (erro) {
                    $("#chatbox_" + chatboxtitle + ' .itemmessage:[tempid=' + randomnumber + ']').css('color', 'red');
                }
            });
        }
        return false;
    }

	var adjustedHeight = chatboxtextarea.clientHeight;
	var maxHeight = 94;

	if (maxHeight > adjustedHeight) {
		adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
		if (maxHeight)
			adjustedHeight = Math.min(maxHeight, adjustedHeight);
		if (adjustedHeight > chatboxtextarea.clientHeight)
			$(chatboxtextarea).css('height',adjustedHeight+8 +'px');
	} else {
		$(chatboxtextarea).css('overflow','auto');
	}
	 
}

function seScrollChatbox(chatbox_title) {
    chatboxtitle = chatbox_title;
    if ($("#chatbox_" + chatboxtitle).length != 0) {
        $("#chatbox_" + chatboxtitle + " .chatboxcontent").scrollTop($("#chatbox_" + chatboxtitle + " .chatboxcontent")[0].scrollHeight);
        window.setTimeout('$("#chatbox_' + chatboxtitle + ' .chatboxcontent").scrollTop($("#chatbox_' + chatboxtitle + ' .chatboxcontent")[0].scrollHeight);', 100);
    } 
}
function setChatMessage(from_, to_, message, date, date2) {
    var uinfo = {};
    var imgAlign = "";
    if (custinfo.hasOwnProperty(from_)) {
        uinfo = custinfo[from_];
        chatboxtitle = from_;
        imgAlign = "left_right";
    }
    else {
        if ($('#HFUserCode').val() == from_) {
            uinfo = userinfo[from_];
            chatboxtitle = to_;
            imgAlign = "right_left";
        } else {
            if (custinfo.hasOwnProperty(to_)) {
                uinfo = userinfo[from_];
                chatboxtitle = to_;
                imgAlign = "right_left";
            }
            else {
                uinfo = userinfo[from_];
                chatboxtitle = from_;
                imgAlign = "left_right";
            }
        }
    }
    var messageType = "text";
    if ($.isArray(message)) {
        if (message[0] == 1) messageType = "picture";
        else if (message[0] == 2) messageType = "file";
    }
    if (messageType == "text") message = emoticons(message);
    else if (messageType == "picture") {
        if (message[2] != "") 
            message = '<a target="_blank" href="' + message[1] + '"><img class="chatmessage-media" src="' + message[2] + '"/></a>';
        else
            message = '<a target="_blank" href="' + message[1] + '"><img class="chatmessage-media" style="width:120px;" src="' + message[1] + '"/></a>';
    }
    else if (messageType == "file") {
        message = '<a target="_blank" href="' + message[1] + '"><span class="chatmessage-media">' + message[2] + '</span></a>';
    }
    var addmessage = function () {
        $("#chatbox_" + chatboxtitle + " .chatboxcontent").append('<div class="chatboxmessage" from="' + from_ + '">' +
                                                                     '<div class="chatboxuserpic ' + resources.direction + '-' + imgAlign + '">' +
                                                                        '<img src="' + uinfo.picture + '" title="' + uinfo.name + '" class="chatuserpic">' +
                                                                     '</div>' +
                                                                     '<div class="chatboxmessagecontent ' + resources.direction + '-' + imgAlign + '"><div class="chatcontentArrow arrow-' + resources.direction + '-' + imgAlign + '"></div>' +
                                                                        '<span class="itemmessage" date="' + date + '">' + message + '</span>' +
                                                                        '<div class="chatdate2 timeAgo" date="' + date + '" title="' + date2 + '" style="color: gray;font-size: 7pt;">' + date2 + '</div>' +
                                                                     '</div>' +
                                                                  '</div>');
    }

    if ($("#chatbox_" + chatboxtitle + " .chatboxmessage:last").attr('from') == from_) {
        var preMessageDate = new Date($("#chatbox_" + chatboxtitle + " .itemmessage:last").attr('date'));
        if (preMessageDate > (new Date(new Date(date) - 1 * 60000))) {
            $("#chatbox_" + chatboxtitle + " .chatboxmessage:last .chatboxmessagecontent .chatdate2").remove();
            $("#chatbox_" + chatboxtitle + " .chatboxmessage:last .chatboxmessagecontent").append('<span class="itemmessage" date="' + date + '">' + message + '</span>');
            $("#chatbox_" + chatboxtitle + " .chatboxmessage:last .chatboxmessagecontent").append('<div class="chatdate2 timeAgo" date="' + date + '" title="' + date2 + '" style="color: gray;font-size: 7pt;">' + date2 + '</div>');
        } else {
            addmessage();
        }
    }
    else {
        addmessage();
    }

    if (messageType == "text") {
        var lastmessage = $("#chatbox_" + chatboxtitle + " .chatboxmessage:last .itemmessage:last");
        lastmessage.linkify({
            handleLinks: function (links) { links.html(links.text()); } //find url and clickable
        });
        if ($("#chatbox_" + chatboxtitle).length != 0) {
            $.each(lastmessage[0].childNodes, function (i, item) {
                if (item.nodeType == 3) {
                    var num = item.nodeValue.match(/\d+/gm);
                    if (num) {
                        var detectNum = false;
                        for (var i = 0; i <= num.length - 1; i++) { // find mobile number
                            if (isValidNumberForSend(num[i])) {
                                detectNum = true;
                                item.nodeValue = item.nodeValue.replace(num[i], '<a onclick="click_sms=true; qucikSendSms(\'0\',\'' + num[i] + '\');return false;">' + num[i] + '</a>');
                            }
                        }
                        if (detectNum) $(item).after(item.nodeValue).remove();
                    }
                    $(item).after(emoticons(item.nodeValue)).remove(); //set Emoticon 
                }
            });
        }
        lastmessage.changDirection(lastmessage.html());
    }
    $('#chatbox_' + chatboxtitle + ' .chatboxmessage:last .timeAgo').updateTimeAgo();
}

function addCustToQueue_Chat(custs, first) {
    var ListIds = { items: 0 };
    var firstItemsPlace = $('<div></div>');
    var custList = $('<div class="chquetitlecon">' +
                         '<div class="chquetitle right_left">' + resources.chat + '</div>' +
                         '<div class="chqueicon left_right"></div>' +
                     '</div>' +
                     '<div class="chquecontainer"></div>');
    $.each(custs, function (i, cust) {
        if (cust.rec == 0) {
            ListIds[cust.id] = cust.id;
            ListIds.items += 1;
            if ($('#' + cust.id).length == 0) {
                var chatitem = $('<div id="' + cust.id + '" class="itemchatcust">' +
                                '<div class="chatcustisonline ' + ((cust.isOnline) ? 'isonline' : 'noonline') + '"></div>' +
                                '<img src="' + defaultpicture + '" class="chatcustpic"/>' +
                                '<div class="chatcusttitle">' + cust.name + '</div>' +
                                '<div class="chatcusticon">' +
                                   '<span class="chatico chatico-skip" title="Start Chat"></span><span class="chSplit"></span>' +
                                   '<span class="chatico chatico-wait" title="wait"></span><span class="chSplit"></span>' +
                                   '<span class="chatico chatico-comment" title="send message"></span><span class="chSplit"></span>' +
                                   '<span class="chatico chatico-close" title="close"></span>' +
                                '</div>' +
                                '<div class="chatbrosicon"><span class="ico-os ico-' + cust.os + '" title="' + cust.os + '"></span><span class="ico-browser ico-' + cust.browser + '" title="' + cust.browser + '"></span></div>' +
                                '<div class="chatcusticoninfo"></div>' +
                             '</div>').data(cust);

                if (!first) {
                    if ($('.chatqueue').length != 0) {
                        $('.chquecontainer').append(chatitem);
                        var chHeight = $('.itemchatcust:last').height();
                        $('.itemchatcust:last').css('height', 0).animate({ height: chHeight + 'px' }, function () { $(this).css('height', 'auto') });
                    }
                    else {
                        custList.filter('.chquecontainer').append(chatitem);
                        noty({
                            layout: 'bottomLeft', theme: 'noty_theme_default chatqueue', type: 'black', text: custList,
                            timeout: false, onClose: false, enableanimate: true
                        });
                    }
                    beepStartChat(cust.id);
                }
                else {
                    firstItemsPlace.append(chatitem);
                }
            }
        }
    });
    if (first && ListIds.items != 0) {
        custList.filter('.chquecontainer').append(firstItemsPlace.children());
        noty({
            layout: 'bottomLeft', theme: 'noty_theme_default chatqueue', type: 'black', text: custList,
            timeout: false, onClose: false, enableanimate: true
        });
    }
    else {
        $('.itemchatcust').each(function () {
            $(this).find('.chatcustisonline').removeClass('isonline').removeClass('noonline').addClass((custOnline.hasOwnProperty($(this).attr('id'))) ? 'isonline' : 'noonline');
            if (!ListIds.hasOwnProperty($(this).attr('id')) && ListIds.items != 0) {
                $(this).animate({ 'height': 0 }, 500, function () {
                    $(this).remove();
                    if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove() });
                });
            }
        });
    }
}

/* #customer*/
/*---------------------------------------*/
function beepStartChat(id) {
    if ($('#' + id + ' .chatico-wait').data('wait') || $('#' + id).length == 0) {
        $('#ring_' + id).remove();
        pauseAudio();
        $('#' + id).css('background-color', '');
        document.title = originalTitle;
        return false;
    }
    if ($('#ring_' + id).length == 0) {
        // $('body').append('<div id="ring_' + id + '"><object type="application/x-shockwave-flash" loop="true" data="../themes/resources/sounds/startchat.swf" width="0px" height="0px"><param name="movie" value="../themes/resources/sounds/startchat.swf" /></object></div>');
        $('body').append('<div id="ring_' + id + '">');
        playAudio("../themes/resources/sounds/startchat.mp3",true);
        $('#ring_' + id).data('shake', 0);
    }
    $('#ring_' + id).data('shake', $('#ring_' + id).data('shake') + 1);
    if ($('#ring_' + id).data('shake') % 2 == 0) {
        $('#' + id).css('background-color', '#FFE5BE');
        document.title = resources.newchatrequest;
    } else {
        $('#' + id).css('background-color', '');
        document.title = originalTitle;
    } 
    if ($('#ring_' + id).data('shake') < 10) {
        window.setTimeout('beepStartChat(\'' + id + '\');', 1358);
    }
    else {
        $('#ring_' + id).remove();
        pauseAudio();
        $('#' + id).css('background-color', '');
        document.title = originalTitle;
    }
}
function selectcustchatsr(code, name, ui) {
    var chatbox = $(ui).parents('.chatbox');
    chatbox.find('.DivtblsearchCustChat').hide();
    chatbox.find('.DivsearchCustChatInfo').attr('code', code).html(resources.code + ' :' + code + '<br/>' + resources.name + ' :<a onclick="customer_Show_Info(' + code + ',\'' + name + '\');return false;">' + name + '</a>').show();
    chatbox.find('#BtnSetCustomer').attr('disabled', '');
}
function setPanelChatCust(thisBtn, panelClass) {
    var chatbox = thisBtn.parents('.chatbox');
    chatbox.find('.divchat-cont').hide();
    chatbox.find('.' + panelClass).show();
    if (chatbox.data().custstatus == 'online') chatbox.find('.chatbuttonplaceMain input').attr('disabled', 'disabled');
}
function setCustInfoToChatbox(cid, name, email, pretel, tel, mobile, cust_code, picture) {
    var chatbox = $('#chatbox_' + cid);
    chatbox.find('.chviewcust').show();
    chatbox.data('cust').name = name; chatbox.data('cust').pretel = pretel; chatbox.data('cust').tel = tel; chatbox.data('cust').mobile = mobile; chatbox.data('cust').email = email;chatbox.data('cust').picture = (picture == "") ? defaultpicture : picture;
    chatbox.find('.chatcustname').html('<a onclick="customer_Show_Info(' + cust_code + ',\'' + name + '\');return false;">' + name + '</a>');
    chatbox.find('.chatcustemail').text(email);
    if (resources.lang == "fa") {
        chatbox.find('.chatcusttel').text(pretel + '-' + tel);
    } else {
        chatbox.find('.chatcusttel').text(tel); 
    }
    chatbox.find('.chatcustmobile').html('<a onclick="click_sms=true; qucikSendSms(\'' + cust_code + '\',\'' + mobile + '\');return false;">' + mobile + '</a>');
    chatbox.find('#BtnSelectCustomer,#BtnCreateCustomer').attr('disabled', 'disabled');
    if (chatbox.data().custstatus == 'online') chatbox.find('.chatbuttonplaceMain input').attr('disabled', '');
    $("#chatbox_" + cid + ' .chatboxtitle').text(name);
}

$(function () {
    $('#BtnCreateCustomer').live('click', function () {
        setPanelChatCust($(this), 'chaddcust');
        return false;
    });
    $('#BtnSelectCustomer').live('click', function () {
        setPanelChatCust($(this), 'chselectcust');
        $(this).parents('.chatbox').find('.DivsearchCustChatInfo').hide();
        $(this).parents('.chatbox').find('#BtnSetCustomer').attr('disabled', 'disabled');
        return false;
    });
    $('#BtnReferCustomer').live('click', function () {
        setPanelChatCust($(this), 'chreferchat');
        return false;
    });
    $('#BtnDisconnectChat').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.chmsgchat .chatbodyplace').html(resources.question);
        setPanelChatCust($(this), 'chmsgchat');
        return false;
    });
    $('#BtnDisconnectChatYes').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var chatboxtitle = chatbox.data().cust.id;
        chatbox.animate({ "margin-bottom": "-" + chatbox.height() + "px" }, 500, function () {
            $(this).remove();
            changeState(chatboxtitle, 2, 1, '');
            restructureQuickBoxes();
        });
    });
    $('#drdgroupreferchat').live('change', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('#drdusersreferchat').empty();
        $.each($(this).find('option:selected').data(), function (i, opt) {
            chatbox.find('#drdusersreferchat').append('<option value="' + opt + '">' + opt + '</option>');
        });
    });
    $('#BtnStartChat').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var thisBtn = $(this);
        cust = chatbox.data('cust');
        //if (cust.rec == 0 || cust.rec == 1) { //first Start Chat 
            chatbox.data('cust').rec = 2;
            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.cust = chatbox.data('cust');
            e.o.user = userinfo[e.u];
            e.o.clientId = clientId;
            chatbox.find('.divchat-cont').hide();
            chatbox.find('.chwait').show();
            $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/startchat_cust",
                data: JSON.stringify(e), dataType: "json", success: function (c) {
                    if (c.d[0] != "error") {
                        thisBtn.addClass('clicked');
                        setPanelChatCust(thisBtn, 'chchat');
                        chatbox.find('.chatbuttonplaceMain').hide();
                        if (c.d[1][0] != "error" && chatbox.find('.chatboxcontent').children().length == 0) {
                            $.each(c.d[1][1], function (i, item) {
                                setChatMessage(item.from, item.to, item.message, item.date, item.date2);
                            });
                        }
                    }
                    else {
                        chatbox.data('cust').rec = cust.rec;
                    }
                    chatbox.find('.chwait').hide();
                }
            });
        //}
        //else {
        //    setPanelChatCust($(this), 'chchat');
        //    chatbox.find('.chatbuttonplaceMain').hide();
        //}
        return false;
    });
    $('.backchatview').live('click', function () {
        setPanelChatCust($(this), 'chviewcust');
        $(this).parents('.chatbox').find('.chatbuttonplaceMain').show();
        $(this).parents('.chatbox').find('.chatbuttonplaceMain input').attr('disabled', '');
        return false;
    });
    $('.BtnCancelAddCustomer').live('click', function () {
        setPanelChatCust($(this), 'chviewcust');
        if ($(this).parents('.chatbox').data().custstatus == 'online') $(this).parents('.chatbox').find('.chatbuttonplaceMain input').attr('disabled', '');
        return false;
    });
    $('#BtnSetCustomer').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var cust_code = chatbox.find('.DivsearchCustChatInfo').attr('code');
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.cid = chatbox.data('cust').id;
        e.o.cust_code = cust_code;
        e.o.clientId = clientId;
        chatbox.find('.divchat-cont').hide();
        chatbox.find('.chwait').show();
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/select_cust",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
                if (c.d[0] == "success" || c.d[0] == "oldcust") {
                    var cust = c.d[2];
                    setCustInfoToChatbox(e.o.cid, cust.name, cust.email, cust.pretel, cust.tel, cust.mobile, cust_code, cust.picture);
                }
                else if (c.d[0] == "error") {
                    chatbox.find('.chselectcust').show();
                    chatbox.find('#BtnSetCustomer').attr('disabled', '');
                }
                if (c.d[0] == "oldcust") {
                    var oldCust = c.d[2];
                    if ($('#chatbox_' + oldCust.id).length != 0) {
                        $('#chatbox_' + oldCust.id).remove();
                        restructureQuickBoxes();
                        changeState(0, oldCust.id, 1, 1);
                    }
                    chatbox.data('cust', oldCust);
                    custinfo[oldCust.id] = oldCust;
                    $("#chatbox_" + e.o.cid).attr('id', 'chatbox_' + oldCust.id);
                    if (c.d[3][0] != "error") {
                        var oldMsg = chatbox.find('.chatboxcontent').children().clone();
                        chatbox.find('.chatboxcontent').empty();
                        $.each(c.d[3][1], function (i, item) {
                            setChatMessage(item.from, item.to, item.message, item.date, item.date2);
                        });
                        chatbox.find('.chatboxcontent').append(oldMsg);
                        seScrollChatbox(oldCust.id);
                    }
                }
                chatbox.find('.chwait').hide();
                if (c.d[0] == "oldcust") c.d[0] = "success";
                noty({
                    layout: 'topRight', theme: 'noty_theme_default chatmsgplace', type: c.d[0], text: c.d[1],
                    timeout: false, onClose: true, enableanimate: true
                });
                setTimeout("$('.chatmsgplace').slideUp();", 3000);
            }
        });
        return false;
    });
    $('#btnsearchcustChat').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var custname = chatbox.find('#TxtSrcCustNameChat').val();
        if (custname.length < 2 || custname == '') { chatbox.find('#TxtSrcCustNameChat').addClass('error'); return false; };
        chatbox.find('#TxtSrcCustNameChat').removeClass('error');
        chatbox.find('.divchat-cont').hide();
        chatbox.find('.chwait').show();
        var e = { items: { domain: $("#HFdomain").val(), user_code: $("#HFUserCode").val(), codeing: $("#HFcodeDU").val(), name: custname, rnd: $('#HFRnd').val()} };
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../WebServices/get_info.asmx/search_customer_byName",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
                chatbox.find('.chwait').hide();
                chatbox.find('.chselectcust').show();
                chatbox.find('.DivtblsearchCustChat').empty().show().append(c.d.replace(/select1/g, 'selectcustchatsr').replace(/''/g, 'this'));
                chatbox.find('.DivtblsearchCustChat table th:first').parent().remove();
                chatbox.find('.DivtblsearchCustChat table a').removeAttr('style');
            }
        });
    });
    $("#TxtSrcCustNameChat").live('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#btnsearchcustChat').click();
        }
    });

    $('#BtnAddCustomer').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        chatbox.find('.divchat-cont').hide();
        chatbox.find('.chwait').show();
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.name = chatbox.find('#txtchatcustname').val();
        e.o.email = chatbox.find('#txtchatcustemail').val();
        e.o.mobile = chatbox.find('#txtchatcustmobile').val();
        e.o.pretel = (resources.lang == "fa") ? chatbox.find('#txtchatcustpretel').val() : '';
        e.o.tel = chatbox.find('#txtchatcusttel').val();
        e.o.group = chatbox.find('#drdchatcustgroup').val();
        e.o.cid = chatbox.data('cust').id;
        e.o.clientId = clientId;
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/addcust_mini",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
                if (c.d[0] != "error") {
                    setCustInfoToChatbox(e.o.cid, e.o.name, e.o.email, e.o.pretel, e.o.tel, e.o.mobile, c.d[2], '');
                }
                else {
                    chatbox.find('.chaddcust').show();
                }
                chatbox.find('.chwait').hide();
                noty({
                    layout: 'topRight', theme: 'noty_theme_default chatmsgplace', type: c.d[0], text: c.d[1],
                    timeout: false, onClose: true, enableanimate: true
                });
                setTimeout("$('.chatmsgplace').slideUp();", 3000);
            }
        });
        return false;
    });
    $('#BtnSetReferChat').live('click', function () {
        var chatbox = $(this).parents('.chatbox');
        var user_code = chatbox.find('#drdusersreferchat').val();
        if ($('.ChatListStatus-1 .chatlistItem:[item="' + user_code + '"]').length == 0) {
            alert(chatbox.find('#drdusersreferchat').find('option:selected').text() + " " + resources.isnotOnline);
            return false;
        }
        chatbox.find('.divchat-cont').hide();
        chatbox.find('.chwait').show();
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.cid = chatbox.data().cust.id;
        e.o.user_code = user_code;
        e.o.userInfo = userinfo[user_code];
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/refer_chat",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
                if (c.d[0] != "error") {
                    chatbox.animate({ "margin-bottom": "-" + chatbox.height() + "px" }, 500, function () {
                        $(this).remove();
                        restructureQuickBoxes();
                    });
                }
                chatbox.find('.chwait').hide();
                noty({
                    layout: 'topRight', theme: 'noty_theme_default chatmsgplace', type: c.d[0], text: c.d[1],
                    timeout: false, onClose: true, enableanimate: true
                });
                setTimeout("$('.chatmsgplace').slideUp();", 3000);
            }
        });
        return false;
    });
    $('.chatico-skip').live('click', function () {
        var item = $(this).parents('.itemchatcust');
        item.find('.chatico-wait').data('wait', true);
        item.css('width', item.width());
        var data = item.data();
        item.animate({ 'margin-right': '-' + (item.width() + 10) + 'px' }, 500, function () {
            createChatBox(data.id, 1, data.name, 1);
            changeState(data.id, 0, 1, data.name);
            $(this).animate({ 'height': 0 }, 400, function () {
                $(this).remove();
                if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove() });
            });
        });
    });

    $('.chatico-close').live('click', function () {
        var item = $(this).parents('.itemchatcust');
        var data = item.data();
        item.animate({ 'height': 0 }, 400, function () {
            changeState(data.id, 2, 1, item.data().name);
            $(this).remove();
            if ($('.chquecontainer .itemchatcust').length == 0) $('.chatqueue').animate({ height: 0 }, 500, function () { $(this).remove(); checkCtlTimerCust(); });
        });
    });
    $('.chatico-wait').live('click', function () {
        $(this).data('wait', true);
        var item = $(this).parents('.itemchatcust');
        var data = item.data();
        item.animate({ 'background-color': '#FFFFA1' }, 400, function () { item.animate({ 'background-color': '#3d3d3d' }, 800); });
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.cid = data.id;
        e.o.rec = data.rec;
        e.o.clientId = clientId;
        $.ajax({ type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/server.aspx/wait_cust",
            data: JSON.stringify(e), dataType: "json", success: function (c) {
                if (c.d[0] == "error") {
                    noty({ layout: 'topRight', theme: 'noty_theme_default chatmsgplaceWait', type: c.d[0], text: c.d[1], timeout: false, onClose: true, enableanimate: true });
                    setTimeout("$('.chatmsgplaceWait').slideUp();", 3000);
                }
            }
        });
        return false;
    });



    $('.chatlistItem').live({
        mouseenter: function (e) {
            var thisItem = $(this);
            var data = thisItem.data('data');
            var showedTip = false;
            clearTimeout(timerItemTip);
            if ($('.chatitem-tooltip').length != 0) {
                showedTip = true;
                if ($('.chatitem-tooltip').attr('item') == data.user_code)
                    return false;
                else
                    $('.chatitem-tooltip').remove();
            }
            var styleMe_ = 'style="direction:ltr"';
            if (resources.lang == "fa") {
                styleMe_ = 'style="direction: rtl;"';
            } 

            var tip = $('<div ' + styleMe_ + ' class="chatitem-tooltip" item="' + data.user_code + '"></div>').css("top", (thisItem.offset().top + 5) + "px")
                .css({ "left": ((resources.direction == 'rtl') ? thisItem.offset().left + thisItem.width() + 5 : thisItem.offset().left - 210) + "px" });
            if (data.ChatTurnOn == false) { tip.addClass("chatitem-tooltipOff"); }
            if ($("#dv_mblist .divthisuserchat .thisuserchatItem").data('data').ChatTurnOn == false) { tip.addClass("chatitem-tooltipOff"); }
            tip.append('<img src="' + ((data.picture != '') ? data.picture : defaultpicture) + '" title="' + data.user_code + '" class="chattippic_' + resources.direction + ' right_left">');
            tip.append('<div class="chattipname"><a onclick="customer_Show_Info(' + data.cust_code + ',\'' + data.name + '\');return false;">' + data.name + '</a></div>');
            tip.append('<div class="chattipcode">' + data.user_code + '</div>');
            tip.append('<div class="chattipstatus"><span class="right_left ico-status ico-' + thisItem.data('status') + '"></span><span>' + ChatStatusStr[thisItem.data('status')] + '</span></div>');
            tip.append('<div class="chattipmessage right_left">' + data.displaymessage + '</div>');
            if (showedTip)
                $('body').append(tip);
            else
                $('body').append(tip.hide().delay(1000).fadeIn());
        },
        mouseleave: function () {
            timerItemTip = setTimeout(function () {
                $(".chatitem-tooltip").hide();
            }, 1000);
        }
    });
    $('.chatitem-tooltip').live({
        mouseenter: function (e) {
            clearTimeout(timerItemTip);
        },
        mouseleave: function () {
            timerItemTip = setTimeout(function () {
                $(".chatitem-tooltip").remove();
            }, 1000);
        }
    });

});

