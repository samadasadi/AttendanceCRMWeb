
var RaveshCrmChat = {};
var quickMessage;

var body = RV('body');
var iframe = RV('<iframe>').appendTo(body);
var iframeDocument = iframe[0].contentWindow || (iframe[0].contentDocument.document || iframe[0].contentDocument);
var fullSizeMinimum = 600;

var revPosition = setting.position == 'right' ? 'left' : 'right';
var CSS = {
    fab: '',
    box: '',
    box_full: '',
    quick_message: '',
    quick_message_avatar: '',
    quick_message_title: '',
    quick_message_close: '',
    quick_message_message: '',
    anim_bounceIn: '',
    anim_fadeOut: '',
    anim_fadeInUp: '',
    anim_fadeIn: ''
}
RV.each(CSS, function (c, css) { CSS[c] = 'ravesh-crm-' + Math.random().toString(36).substr(2, 10); });
RV('<style>').attr({ type: 'text/css' }).text(

    '.' + CSS.fab + '{position:fixed;margin:15px 15px;bottom:0;z-index:999999999;cursor:pointer;transition:all .3s;box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 0 4px 8px rgba(0, 0, 0, 0.28)}' +
    '.' + CSS.fab + ':hover{transform:scale(1.1)}' +

    '.' + CSS.box + '{' + setting.position + ':0;width:360px;height:570px;border:none;border-radius:8px;z-index:9999999999;box-shadow:rgba(0,0,0,0.25) 0 0 15px;position:fixed;margin:25px;bottom:0;}' +
    '.' + CSS.box_full + '{display:block;margin:0;left:0;right:0;width:100%;height:100%;top:0;bottom:0;border-radius:0}' +

    '.' + CSS.quick_message + '{direction:' + setting.dir + ';color:' + setting.primaryColor + ';' + setting.position + ':15px;z-index:999999999;font-size:11px;line-height:1.7;font-family:iransans,iransansweb,tahoma;cursor:pointer;border-radius:5px;background:#fff;overflow:hidden;border-top:1px solid #e2e2e2;transition:all .3s ease;position:fixed;width:240px;bottom:90px;padding:10px;box-sizing:border-box;box-shadow:rgba(6,19,43,0.2) 0 3px 6px,rgba(6,19,43,0.03) 0 5px 10px,rgba(6,19,43,0.03) 0 8px 19px,rgba(6,19,43,0.04) -6px 10px 14px,rgba(6,19,43,0.03) 0 46px 15px,rgba(6,19,43,0.02) 0 72px 30px,rgba(6,19,43,0.02) 0 32px 20px,rgba(6,19,43,0.01) 0 16px 10px;}' +
    '.' + CSS.quick_message + ':hover{box-shadow: rgba(6, 19, 43, 0.2) 0px 3px 6px, rgba(6, 19, 43, 0.03) 0px 5px 10px, rgba(6, 19, 43, 0.03) 0px 8px 19px, rgba(6, 19, 43, 0.04) -6px 10px 14px, rgba(6, 19, 43, 0.03) 0px 46px 15px, rgba(6, 19, 43, 0.02) 0px 72px 30px, rgba(6, 19, 43, 0.02) 0px 32px 20px, rgba(6, 19, 43, 0.01) 0px 16px 10px, rgba(6, 19, 43, 0.3) 0px 5px 10px;}' +
    '.' + CSS.quick_message_avatar + '{float:' + setting.position + ';width: 30px;height: 30px;border-radius: 50%;}' +
    '.' + CSS.quick_message_title + '{float:' + setting.position + ';color:#000;width:140px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;margin:0 10px;line-height:30px;font-weight:700}' +
    '.' + CSS.quick_message_close + '{float:' + revPosition + ';margin: 3px;width:24px;height:24px;text-align:center;padding:4px;box-sizing:border-box;border-radius:50%;color:#bbb;transition:all .3s}' +
    '.' + CSS.quick_message_close + ':hover{color:#666;background-color:#eee;}' +
    '.' + CSS.quick_message_message + '{float:' + setting.position + ';clear: both;margin-top: 10px;width: 100%;color: #444;}' +

    '@keyframes ' + CSS.anim_bounceIn + '{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scaleX(1)}}' +
    '.' + CSS.anim_bounceIn + '{animation:' + CSS.anim_bounceIn + ' 1.5s}' +

    '@keyframes ' + CSS.anim_fadeOut + '{0%{opacity:1}50%{opacity:0;transform:scale3d(.3,.3,.3)}to{opacity:0}}' +
    '.' + CSS.anim_fadeOut + '{animation:' + CSS.anim_fadeOut + ' 0.5s}' +

    '@keyframes ' + CSS.anim_fadeInUp + '{0%{opacity:0;-webkit-transform:translate3d(0,50%,0);transform:translate3d(0,50%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}' +
    '.' + CSS.anim_fadeInUp + '{animation:' + CSS.anim_fadeInUp + ' 0.3s;}' +

    '@-webkit-keyframes ' + CSS.anim_fadeIn + '{from{ opacity: 0; }to{ opacity: 1; }}' +
    '.' + CSS.anim_fadeIn + '{animation:' + CSS.anim_fadeIn + ' 0.5s;}'
).appendTo(body);


var html =
'<!DOCTYPE html>' +
'<html>' +
'<head>' +
    '<meta charset="utf-8" />' +
    '<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">' +
    '<link href="' + setting.serviceUrl + '/' + setting.domain + '/chatclient/cssIframe/' + setting.key + '.css" rel="stylesheet" />' +
'</head>' +
'<body>' +
     '<script>' + 'var setting = ' + JSON.stringify(setting) + ';' + '<\/script>' +
     '<script src="' + setting.serviceUrl + '/' + setting.domain + '/chatclient/scriptIframe/' + setting.key + '.js" type="text/javascript"><\/script>' +
'</body>' +
'</html>';


iframe.addClass(CSS.box).hide().attr({ "allowFullScreen": "true", "allowtransparency": "true", "scrolling": "no" });
iframeDocument.document.open();
iframeDocument.document.write(html);
iframeDocument.document.close();

var isShowingChatBox = localStorage.getItem('ravesh_crm_chat_open_' + setting.key);
isShowingChatBox = isShowingChatBox && isShowingChatBox.toLowerCase() == 'true';
if (window.innerWidth < fullSizeMinimum) isShowingChatBox = false;

var fab = new CreateFAB({ position: setting.position, color: setting.primaryColor, picture: setting.picture == '' ? '' : setting.serviceUrl + setting.picture });
fab.getUI().addClass(CSS.fab).hide()
    .click(function () {
        RaveshCrmChat.show();
    })
    .appendTo(body);



RaveshCrmChat.isShow = function () {
    return isShowingChatBox;
}

RaveshCrmChat.toggle = function () {
    if (isShowingChatBox) RaveshCrmChat.hide(); else RaveshCrmChat.show();
}

RaveshCrmChat.show = function () {
    RaveshCrmChat.sendQuickMessage();
    checkFullSize();
    setTimeout(function () { iframe.show().addClass(CSS.anim_fadeInUp); iframeDocument.onShowChatBox(); }, 200);
    fab.stopAnimate().getUI().removeClass(CSS.anim_bounceIn).addClass(CSS.anim_fadeOut);
    setTimeout(function () { fab.getUI().hide().removeClass(CSS.anim_fadeOut) }, 400);
    isShowingChatBox = true;
    localStorage.setItem('ravesh_crm_chat_open_' + setting.key, isShowingChatBox);
}

RaveshCrmChat.hide = function () {
    iframeDocument.onHideChatBox();
    iframe.hide().removeClass(CSS.anim_fadeInUp);
    fab.getUI().show().addClass(CSS.anim_bounceIn);
    setTimeout(function () { fab.animate(); }, 1000);
    isShowingChatBox = false;
    localStorage.setItem('ravesh_crm_chat_open_' + setting.key, isShowingChatBox);
}

RaveshCrmChat.setUser = function (user) {
    iframeDocument.setUser(user);
}

RaveshCrmChat.getUser = function (callback) {
    iframeDocument.getUser(callback);
}

RaveshCrmChat.sendQuickMessage = function (options) {
    if (!options) options = {};
    options.message = options.message || '';
    if (quickMessage) { quickMessage.remove(); quickMessage = null; }
    if (options.message == '') return false;
    if (isShowingChatBox) return false;
    if (options.agent) {
        var sendMessage = function () {
            quickMessage = RV('<div>').addClass(CSS.quick_message + ' ' + CSS.anim_fadeIn).appendTo(body);
            quickMessage.click(function () { RaveshCrmChat.show(); });
            RV('<div>').addClass(CSS.quick_message_close).appendTo(quickMessage)
                .html('<svg style="width: 16px;height: 16px;" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style="fill: currentcolor;"></path></svg>')
                .click(function (ev) { RaveshCrmChat.sendQuickMessage(); ev.stopPropagation() });
            RV('<img>').addClass(CSS.quick_message_avatar).appendTo(quickMessage).attr({ src: options.agent.avatar, title: options.agent.name, alt: options.agent.name });
            RV('<div>').addClass(CSS.quick_message_title).appendTo(quickMessage).text(options.agent.name);
            RV('<div>').addClass(CSS.quick_message_message).appendTo(quickMessage).html(options.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>'));
        }

        if (!options.delay && options.delay != 0) {
            sendMessage();
        } else {
            setTimeout(sendMessage, options.delay);
        }
    } else {
        iframeDocument.sendQuickMessage(options);
    }
}

window.addEventListener('raveshcrm_chat_ready', function () {
    if (isShowingChatBox) {
        RaveshCrmChat.show();
    } else {
        setTimeout(function () {
            fab.getUI().show().addClass(CSS.anim_bounceIn);
            setTimeout(function () { fab.animate(); }, 1000);
        }, 500);
    }
});

function checkFullSize() {
    iframe.toggleClass(CSS.box_full, window.innerWidth < fullSizeMinimum);
}


function CreateFAB(options) {
    var fab = this;

    var defaultOptions = {
        color: '#03A9F4',
        width: 60,
        position: 'right', //right | left
        picture: ''
    }
    options = RV.extend(defaultOptions, options || {});

    fab.getUI = function () { return container };

    var container = RV('<div>').css({ width: options.width + 'px', height: options.width + 'px', background: options.color, 'border-radius': '50%', 'box-sizing': 'border-box', 'overflow': 'hidden' });

    if (options.picture == '') {
        var svg = RV('<svg>').css({ transition: 'all 0.2s', 'transform-origin': '43.5% 83%' }).attr({ 'viewBox': '0 0 100 100' }).appendTo(container);
        var popup = RV('<rect>').attr({ x: "23", y: "30", width: "53", height: "40", rx: "20", ry: "20", fill: "#fff" }).appendTo(svg);
        var arrow = RV('<path>').attr({ d: "M43,45V83L62,64Z", fill: "#fff" }).appendTo(svg);
        var dot1 = RV('<circle>').css({ transition: 'all 0.2s', 'transform-origin': 'center' }).attr({ cx: "38", cy: "50", r: "4", fill: "#ccc" }).appendTo(svg);
        var dot2 = RV('<path>').attr({ d: "M54,50a4,4,0,0,1-8,0Z", fill: "#ccc" }).appendTo(svg);
        var dot3 = RV('<circle>').css({ transition: 'all 0.2s', 'transform-origin': 'center' }).attr({ cx: "62", cy: "50", r: "4", fill: "#ccc" }).appendTo(svg);


        fab.animate = function () {
            var blind = function () {
                dot1.css({ 'transform': 'scale(1 ,0.2)' });
                dot3.css({ 'transform': 'scale(1 ,0.2)' });
                setTimeout(function () {
                    dot1.css({ 'transform': 'scale(1)' });
                    dot3.css({ 'transform': 'scale(1)' });
                }, 200);
            }
            var shake = function () {
                svg.css({ 'transform': 'rotate(-10deg)' });
                setTimeout(function () { svg.css({ 'transform': 'rotate(10deg)' }); }, 200);
                setTimeout(function () { svg.css({ 'transform': 'rotate(-5deg)' }); }, 400);
                setTimeout(function () { svg.css({ 'transform': 'rotate(0deg)' }); }, 600);
            }
            var anim = function () {
                shake();
                setTimeout(blind, 1000);
                setTimeout(blind, 1400);
            }
            anim();
            clearInterval(fab.timer);
            fab.timer = setInterval(anim, 10000);
            return fab;
        }

    } else {
        fab.animate = function () { return fab; }
        container.css({ 'background-image': 'url(\'' + options.picture + '\')', 'background-size': 'cover' });
    }

    fab.stopAnimate = function () { clearInterval(fab.timer); return fab; }

    if (options.position == 'right') container.css({ right: 0 });
    if (options.position == 'left') container.css({ left: 0 });
}

window.addEventListener('resize', checkFullSize);
window.RaveshCrmChat = RaveshCrmChat;


