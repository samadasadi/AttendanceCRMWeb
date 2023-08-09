var windowFocus = true;
var chatExternalboxFocus = false;
var minchatExternalHeartbeat = 3000;  
var originalTitle; 
var defaultpicture = 'themes/resources/images/noimage.jpg';
var timerchatExternal;
var tempUserName = "";

$(document).ready(function () {
    originalTitle = document.title;

    $('#chatExternalbox').attr('cust_code', 0);

    if ($.cookie("chatExternalbox_data") != null) {
        try {
            var data = eval("(" + decodeURI(atob($.cookie("chatExternalbox_data"))) + ")");
            $('#txtname_chatExternal').val(data.name);
            if (data.hasOwnProperty("pretel")) $('#txtpretel_chatExternal').val(data.pretel);
            $('#txttel_chatExternal').val(data.tel);
            $('#txtmob_chatExternal').val(data.mobile);
            $('#txtemail_chatExternal').val(data.email);
        }
        catch (err) {
            $.removeCookie('chatExternalbox_data');
        }
       
    }

    if ($('#Hfuser_support_info').length != 0) {
        var data = eval("(" + $('#Hfuser_support_info').val() + ")");
        $('#txtname_chatExternal').val(data.name);
        if (data.hasOwnProperty("pretel")) $('#txtpretel_chatExternal').val(data.pretel);
        $('#txttel_chatExternal').val(data.tel);
        $('#txtmob_chatExternal').val(data.mobile);
        $('#txtemail_chatExternal').val(data.email);
        $('#chatExternalbox').attr('cust_code', data.cust_code);
    } else if ($('#HfChatDemoUserInfo').length != 0) {
        var data = eval("(" + $('#HfChatDemoUserInfo').val() + ")");
        $('#txtname_chatExternal').val(data.name);
        if (data.hasOwnProperty("pretel")) $('#txtpretel_chatExternal').val(data.pretel);
        $('#txttel_chatExternal').val(data.tel);
        $('#txtmob_chatExternal').val(data.mobile);
        $('#txtemail_chatExternal').val(data.email);
        $('#chatExternalbox').attr('cust_code', data.cust_code);
    }

    $([window, document]).blur(function () {
        windowFocus = false;
    }).focus(function () {
        windowFocus = true;
        document.title = originalTitle;
    });
    $('.chatExternalboxhead').live('click', function () {
        if ($('#chatExternalbox').hasClass('chatExternalmini')) {
            $('.chatExternalbox-container,.chatExternalminus').show();
            $('#chatExternalbox').removeClass('chatExternalmini');
            $('.chatExternalmaxim').hide();
        } else {
            $('.chatExternalbox-container,.chatExternalminus').hide();
            $('#chatExternalbox').addClass('chatExternalmini');
            $('.chatExternalmaxim').show();
        }
    });
    $('.chatExternalclose').live('click', function () {
        $('#chatExternalbox').hide();
        clearInterval(timerchatExternal);

        var cid = $('#chatExternalbox').data('cid');
        var user_code = "";
        if ($('#chatExternalbox').data('curr_user') != null) user_code = $('#chatExternalbox').data('curr_user');
        var e = { cid: cid, user_code: user_code };
        if (cid != null) {
            $.post(chatExternalserver + "?act=endchat&id=" + chatExternalid + "&domain=" + chatExternaldomain, e, function (c) { });
        }
    });
    $('#startchatExternal').live('click', function () {
        if (!validatechatExternalData()) return false;
        var BrowserAndOs = getBrowserAndOs();
        tempUserName = $('#drdgroup_chatExternal option:selected').text();
        var e = {};
        e.cust_code = $('#chatExternalbox').attr('cust_code');
        e.name = $('#txtname_chatExternal').val();
        e.pretel = (chatExternallang == "fa") ? $('#txtpretel_chatExternal').val() : '';
        e.tel = $('#txttel_chatExternal').val();
        e.mobile = $('#txtmob_chatExternal').val();
        e.email = $('#txtemail_chatExternal').val();
        e.subject = $('#txtsubject_chatExternal').val();
        e.group = $('#drdgroup_chatExternal').val();
        e.url = document.URL;
        e.browser = BrowserAndOs.browser;
        e.os = BrowserAndOs.os;
        $.cookie("chatExternalbox_data", btoa(encodeURI(JSON.stringify(e))), { expires: 300, path: '/' });
        $('.chatExternalbox-first').hide();
        $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div class="wait-horizontaly"></div>' + cap_resourse_wait + '</div>').show();
        $.post(chatExternalserver + "?act=startchat&id=" + chatExternalid + "&domain=" + chatExternaldomain, e, function (c) {
            var data = eval("(" + c + ")");
            if (data.result == "wait" || data.result == "no-responser") {
                $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div class="wait-horizontaly"></div>' + data.msg + '</div>').show();
                $('#chatExternalbox').data('cid', data.cid);
                timerchatExternal = setInterval('chatExternalHeartbeat();', minchatExternalHeartbeat);
            }
            if (data.result == "error") {
                $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div style="color:red;padding: 30px 0;">' + data.msg + '</div></div>');
            }
            if (data.result == "no-online") {
                $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div class="wait-horizontaly"></div><div style="color:gray">' + data.msg + '</div></div>');
            }
        });
    });

    $("#chatExternalbox .chatExternalboxtextarea").live('blur', function () {
        chatExternalboxFocus = false;
    }).live('focus', function () {
        chatExternalboxFocus = true;
        document.title = originalTitle;
        $('#chatExternalbox .chatExternalboxhead').removeClass('chatExternalboxblink');
    });

    $("#chatExternalbox .emoticonSelect").after(function () {
        var popupemot = $('<div class="popupemoticon"><div class="popupemoticon-arrow"></div></div>');
        for (var key in emt) {
            popupemot.append('<img style="width:16px;height:16px;" src="' + emturl + 'smiley-' + emt[key] + '.png" title="' + key + '"/>');
        }
        return popupemot;
    });

    $('.chatExternalbox .emoticonSelect').live('click', function () {
        var chatExternalbox = $('#chatExternalbox');
        if (chatExternalbox.find('.popupemoticon').css('display') == 'none') {
            chatExternalbox.find('.popupemoticon').show();
            chatExternalbox.find('.chatExternalboxtextarea').attr('disabled', 'disabled');
            chatExternalbox.find('.emoticonSelect').addClass('selected');
        }
        else {
            chatExternalbox.find('.popupemoticon').hide();
            chatExternalbox.find('.chatExternalboxtextarea').removeAttr('disabled');
            chatExternalbox.find('.emoticonSelect').removeClass('selected');
        }
    });
    $('.chatExternalbox .popupemoticon img').live('click', function () {
        var chatExternalbox = $('#chatExternalbox');
        chatExternalbox.find('.chatExternalboxtextarea').val(chatExternalbox.find('.chatExternalboxtextarea').val() + ' ' + $(this).attr('title'));
        chatExternalbox.find('.chatExternalboxtextarea').removeAttr('disabled');
        chatExternalbox.find('.popupemoticon').hide();
        chatExternalbox.find('.emoticonSelect').removeClass('selected');
        chatExternalbox.find('.chatExternalboxtextarea').focus();
    });
});

function getBrowserAndOs() {
    var result = { browser: '', os: '' };
    var N = navigator.appName, ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
    result.browser = M[0].toLowerCase();
    var OSName = "unknown";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";
    result.os = OSName;
    return result;
}

var emturl = chatExternalsite + "Themes/resources/images/emoticon/";
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
    text = chake_str(text, 20);
    Object.keys(emt).forEach(function (ico) {
        var icoE = ico.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        text = text.replace(new RegExp(icoE, 'g'), '<img style="width:16px;height:16px;margin-top:3px;" src="' + emturl + 'smiley-' + emt[ico] + '.png" title="' + emt[ico] + '"/>');
    });
    return text;
}
function chake_str(str, number) {
    var result = "";
    var chlin = 1;
    var i;
    for (i = 0; i < str.length; i++) {
        if (chlin > number) {
            result += "<wbr>";
            chlin = 1;
        }
        if (str.charAt(i) == " ")
            chlin = 1;
        else
            chlin += 1;
        result += str.charAt(i);

    }
    
    //$.each(str.split(""), function (i, c) {
    //    if (chlin > number) {
    //        result += "<wbr>";
    //        chlin = 1;
    //    }
    //    if (c == " ")
    //        chlin = 1;
    //    else
    //        chlin += 1;
    //    result += c;
    //});
    return result;
}

function chatExternalHeartbeat() { 
    var cid = $('#chatExternalbox').data('cid');
    var user_code = "";
    if ($('#chatExternalbox').data('curr_user') != null) user_code = $('#chatExternalbox').data('curr_user');
    var e = { cid: cid, user_code: user_code, lang: chatExternallang };
    $.post(chatExternalserver + "?act=refresh&id=" + chatExternalid + "&domain=" + chatExternaldomain, e, function (c) {
        if (c != "") {
            var datas = eval("(" + c + ")");
            $.each(datas, function (i, data) {
                if (data.mode == "start") {
                    $('.chatExternalbox-message').hide();
                    $('.chatExternalbox-chatExternal').show();
                    //if (data.user.picture == "" || data.user.picture.indexOf('noimage') != -1) 
                    data.user.picture = defaultpicture;
                    $('#chatExternalbox').data('cust', data.cust);
                    data.user.name = tempUserName;
                    $('#chatExternalbox').data(data.user.user_code, data.user);
                    $('#chatExternalbox').data('curr_user', data.user.user_code);
                    $('.chatExternaluserpic img').attr('src', chatExternalsite + data.user.picture.replace("../", ""));
                    //$('.chatExternalusername').text(data.user.name);
                    $('.chatExternalusername').text(tempUserName);
                } else if (data.mode == "end") {
                    $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div style="padding: 30px 0;">' + data.msg + '</div></div>').show();
                    $('.chatExternalbox-chatExternal').hide();
                    chatExternalboxFocus = true;
                    clearInterval(timerchatExternal);
                } else if (data.mode == "wait") {
                    $('.chatExternalbox-message').html('<div class="wait-chatExternal"><div class="wait-horizontaly"></div>' + data.msg + '</div>').show();
                    $('.chatExternalbox-chatExternal').hide();
                } else if (data.mode == "newmsg") {
                    $('.chatExternalbox-message').hide();
                    $('.chatExternalbox-chatExternal').show();
                    setchatExternalMessage($('#chatExternalbox').data($('#chatExternalbox').data('curr_user')), $('#chatExternalbox').data('curr_user'), data.msg, 'client date', 'left_right');
                    $("#chatExternalbox .chatExternalboxcontent").scrollTop($("#chatExternalbox .chatExternalboxcontent")[0].scrollHeight);
                    $('#chatExternalbeep').remove();
                    playAudio( chatExternalsite + "themes/resources/sounds/beep.mp3");
                    //  $('body').append('<object id="chatExternalbeep" type="application/x-shockwave-flash" data="' + chatExternalsite + 'themes/resources/sounds/beep.swf" width="0px" height="0px"><param name="movie" value="' + chatExternalsite + 'themes/resources/sounds/beep.swf" /></object>');
                    setTimeout('beepchatExternal();', 1000);
                } else if (data.mode == "refer") {
                    var user = eval("(" + data.user + ")");
                    //if (user.picture == "" || user.picture.indexOf('noimage') != -1) 
                    user.picture = defaultpicture;
                    $('.chatExternaluserpic img').attr('src', chatExternalsite + user.picture.replace("../", ""));
                    //$('.chatExternalusername').text(user.name);
                    $('.chatExternalusername').text(tempUserNamee);
                    user.name = tempUserName;
                    $('#chatExternalbox').data(user.user_code, user);
                    $('#chatExternalbox').data('curr_user', user.user_code);
                } else if (data.mode == "seleccust") {
                    $('#chatExternalbox').data('cid', data.cust.id);
                    $('#chatExternalbox').data('cust', data.cust);
                }
            });
            //$('body').append(c);
            //$('body').append('<br/>');
        }
    });
}

function beepchatExternal() {
    if (chatExternalboxFocus) { 
        document.title = originalTitle;
    }
    else {
        setTimeout('beepchatExternal();', 1000);
        if (!windowFocus) {
            if ($('#chatExternalbox').data('beep')) {
                $('#chatExternalbox').data('beep', false);
                document.title = originalTitle;
            } else {
                $('#chatExternalbox').data('beep', true);
                document.title = $('#chatExternalbox').data($('#chatExternalbox').data('curr_user')).name + ' says...'; ;
            }
        }
        $('#chatExternalbox .chatExternalboxhead').toggleClass('chatExternalboxblink');
    }
}
function setchatExternalMessage(uinfo, from_, message, date, msgAlign) { 
    if ($("#chatExternalbox .chatExternalboxmessage:last").attr('from') == from_)
        $("#chatExternalbox .chatExternalboxmessage:last .chatExternalboxmessagecontent").append('<span class="itemmessage">' + emoticons(message) + '</span>');
    else {
        $("#chatExternalbox .chatExternalboxcontent").append('<div class="chatExternalboxmessage" from="' + from_ + '">' +
                                                                                      '<div class="chatExternalboxuserpic ' + msgAlign + '">' +
                                                                                      '<img src="' + chatExternalsite + uinfo.picture.replace("../", "") + '" title="' + uinfo.name + '" class="chatExternaluserpic">' +
                                                                                      '</div>' +
                                                                                      '<div class="chatExternalboxmessagecontent ' + msgAlign + '"><div class="chatExternalcontentArrow arrow-' + msgAlign + '"></div><span class="itemmessage">' + emoticons(message) + '<span></div></div>');
    }
}

function checkchatExternalBoxInputKey(event, chatExternalboxtextarea) {

    if (event.keyCode == 13 && event.shiftKey == 0) {
        message = $(chatExternalboxtextarea).val();

        $(chatExternalboxtextarea).val('');
        $(chatExternalboxtextarea).focus();
        $(chatExternalboxtextarea).css('height', '25px');
        if (message != '') {
            var e = { message: message, user_code: $('#chatExternalbox').data('curr_user'), cid: $('#chatExternalbox').data('cust').id };
            $.post(chatExternalserver + "?act=sendchat&id=" + chatExternalid + "&domain=" + chatExternaldomain, e, function (c) {
                var data = eval("(" + c + ")");
                if (data.mode != "error") {
                    setchatExternalMessage($('#chatExternalbox').data('cust'), e.cid, data.msg, 'client date', "right_left");
                    $("#chatExternalbox .chatExternalboxcontent").scrollTop($("#chatExternalbox .chatExternalboxcontent")[0].scrollHeight);
                }
            });
        }
        return false;
    }

    var adjustedHeight = chatExternalboxtextarea.clientHeight;
    var maxHeight = 94;

    if (maxHeight > adjustedHeight) {
        adjustedHeight = Math.max(chatExternalboxtextarea.scrollHeight, adjustedHeight);
        if (maxHeight)
            adjustedHeight = Math.min(maxHeight, adjustedHeight);
        if (adjustedHeight > chatExternalboxtextarea.clientHeight)
            $(chatExternalboxtextarea).css('height', adjustedHeight + 8 + 'px');
    } else {
        $(chatExternalboxtextarea).css('overflow', 'auto');
    }

}

function validatechatExternalData() {
    $('#chatExternalbox .chatExternalerror').removeClass('chatExternalerror');
    var result = true;
    var regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regNum = /^\s*(\+|-)?\d+\s*$/;

    var name = $('#txtname_chatExternal').val();
    if (name == '' || regNum.test(name)) {
        result = false;
        $('#txtname_chatExternal').addClass('chatExternalerror');
    }

    //var tel = $('#txttel_chatExternal').val();
    //if (!regNum.test(tel)) {
    //    result = false;
    //    $('#txttel_chatExternal').addClass('chatExternalerror');
    //}
    //if (chatExternallang == "fa") {
    //    var pretel = $('#txtpretel_chatExternal').val();
    //    if (!regNum.test(pretel)) {
    //        result = false;
    //        $('#txtpretel_chatExternal').addClass('chatExternalerror');
    //    } 
    //}

    var mob = $('#txtmob_chatExternal').val();
    if (mob = '' || !regNum.test(mob)) {
        result = false;
        $('#txtmob_chatExternal').addClass('chatExternalerror');
    }
    var email = $('#txtemail_chatExternal').val();
    if (email = '' || !regEmail.test(email)) {
        result = false;
        $('#txtemail_chatExternal').addClass('chatExternalerror');
    }  
    return result;
}