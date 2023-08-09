/// <reference path="RaveshFramwork.js" />

function ChatClient(options) {
    var chatClient = this;
    var MESSAGE_MODE = { upload: -1, text: 0, picture: 1, file: 2, sound: 3, status: 4, form: 5 };
    var MESSAGE_STATUS = { pending: 0, send: 1, viewed: 2, error: 3 };
    var CHAT_STATUS = { free: 0, accept: 1, reject: 2, end: 3, transfer: 4 };

    options.localKey = options.key + ((parent.raveshCrmChatLocalKey) ? '_' + parent.raveshCrmChatLocalKey : '');


    var onCloseListener = function () { }
    chatClient.setOnCloseListener = function (listener) { onCloseListener = listener; };


    var body = document.body;
    var mainContainer = RV('<div>').addClass('ravesh-chat-container').css({ 'background-image': 'url(' + options.serviceUrl + '/Themes/resources/images/chat-bg.png)', 'background-size': '200px' }).appendTo(body);

    var service = new Service(options);
    var utility = new Utility(options.lang);
    var agentUtility = new AgentUtility(options);
    var header = new Header();
    var content = new Content();
    var footer = new Footer();


    //Socket
    service.addSocketEventListener(service.ACTIONS.changeStatus, function (data, tabNum) {
        var status = data[0];
        var agentId = data[1];
        var newAgentId = data[2];
        if (status == CHAT_STATUS.accept || status == CHAT_STATUS.transfer) {
            var currentAgentId = status == CHAT_STATUS.transfer ? newAgentId : agentId;
            agentUtility.saveCurrentAgentId(currentAgentId);
            var agent = agentUtility.getAgentById(currentAgentId);
            header.setAgents([agent]).setTitle(agent.name).setDetail(agent.detail);
        } else {
            agentUtility.saveCurrentAgentId(0);
            var agents = agentUtility.getThreeAgents();
            header.setAgents(agents).setTitle(options.title).setDetail(options.detail);
        }
    });

    service.addSocketEventListener(service.ACTIONS.receiveMessage, function (data, tabNum) {
        content.receiveMessage(data);
        utility.playSound(options.serviceUrl + '/Themes/resources/sounds/5.mp3');
        utility.blinkPageTitle("\uD83D\uDCAC" + " " + utility.r.youHaveNewMessage);
        var currentAgentId = agentUtility.getCurrentAgentId();
        if (data.isAgent && data.fromId != currentAgentId) {
            var agent = agentUtility.getAgentById(data.fromId);
            agentUtility.saveCurrentAgentId(data.fromId);
            header.setAgents([agent]).setTitle(agent.name).setDetail(agent.detail);
        }
    });

    service.addSocketEventListener(service.ACTIONS.sendMessage, function (data, tabNum) {
        content.sendMessage(data);
    });

    service.addSocketEventListener(service.ACTIONS.viewMessage, function (data, tabNum) {
        content.viewedMessage(data);
    });

    service.addSocketEventListener(service.ACTIONS.isTyping, function (data, tabNum) {
        header.setIsTyping();
    });

    service.setOnStartSocketListener(function () {
        if (service.getUserId() == 0) return false;
        content.loadChat();
    });

    //Methods
    chatClient.startChat = function () {
        service.connect();
    }

    chatClient.setUserInfo = function (user) {
        service.sendUserInfo(user);
    }

    chatClient.getActiveAgent = agentUtility.getActiveAgent;

    chatClient.sendQuickMessage = function (message, agent) {
        content.sendQuickMessage(message, agent);
    }

    chatClient.getLastScrollPosition = content.getLastScrollPosition;
    chatClient.setScrollPosition = content.setScrollPosition;

    chatClient.getUserInfo = service.getUserInfo;



    // Init
    body.setAttribute('dir', options.dir);
    if (agentUtility.getCurrentAgentId() != 0) {
        var agent = agentUtility.getCurrentAgent();
        header.setAgents([agent]).setTitle(agent.name).setDetail(agent.detail);
    } else {
        var agents = agentUtility.getThreeAgents();
        header.setAgents(agents).setTitle(options.title).setDetail(options.detail);
    }


    // HEADER /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Header() {
        var header = this;
        var container = RV('<div>').addClass('ravesh-chat-header').css({ 'background-color': options.primaryColor }).appendTo(mainContainer);
        var btnClose = RV('<a>').addClass('ravesh-chat-header-close float-left').attr({ href: '#' }).html(utility.getSVGIcon(utility.icon.close)).appendTo(container);
        var agentsElem = RV('<div>').addClass('ravesh-chat-header-agents float-right').appendTo(container);
        var titleElem = RV('<div>').addClass('ravesh-chat-header-title').appendTo(container);
        var detailElem = RV('<div>').addClass('ravesh-chat-header-detail').appendTo(container);
        var isTypingElem = RV('<div>').addClass('ravesh-chat-header-istyping').appendTo(container);

        btnClose.click(function () { onCloseListener() });

        header.setTitle = function (title) {
            titleElem.text(title);
            return header;
        }
        header.setDetail = function (detail) {
            detailElem.text(detail);
            return header;
        }
        header.setAgents = function (arrAgents) {
            arrAgents = arrAgents.reverse();
            agentsElem.empty().toggleClass('multi', arrAgents.length > 1);
            RV.each(arrAgents, function (a, agent) {
                RV('<div>').append(
                    RV('<img>').attr({ 'title': agent.name, 'src': agent.avatar }).css({ 'border-color': options.primaryColor }),
                    RV('<span>').css({ 'border-color': options.primaryColor }).toggle(agent.isOnline)
                ).appendTo(agentsElem);
            });
            return header;
        }
        header.setIsTyping = function () {
            clearTimeout(header.timerIsTyping);
            clearTimeout(header.timerTreeDots);

            isTypingElem.text(utility.r.isTyping).show();
            detailElem.hide();

            var i = 0;
            header.timerTreeDots = setInterval(function () {
                i++;
                if (i > 3) i = 0;
                isTypingElem.text(utility.r.isTyping + (".").repeat(i));
            }, 300);

            header.timerIsTyping = setTimeout(function () {
                isTypingElem.hide();
                detailElem.show();
                clearInterval(header.timerTreeDots);
            }, 3500);

            return header;
        }
    }


    // CONTENT /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Content() {
        var content = this;
        var arrChatPopups = [];

        var container = RV('<div>').addClass('ravesh-chat-content ravesh-chat-scrollbar').appendTo(mainContainer);
        var coverContent = RV('<div>').addClass('ravesh-chat-cover-content').appendTo(container);

        content.loadChat = loadChat;

        content.onAddPopupToBox = function (popup) {
            var prevPopup = null;
            if (arrChatPopups.length > 0) {
                prevPopup = arrChatPopups[arrChatPopups.length - 1];
            }
            setPopupArrowAndLabel(prevPopup, popup)
            coverContent.append(popup.label, popup.getUI());
            arrChatPopups.push(popup);
        }

        content.sendQuickMessage = function (message, agent) {
            new ChatPopup('other').setFromId(agent.id).setAvatar(agent).setDate().setStatus(1).setMessage(message, MESSAGE_MODE.text).addToBox();
        }

        content.receiveMessage = function (chat) {
            new ChatPopup('other')
                .setId(chat.id)
                .setFromId(chat.fromId)
                .setAvatar(agentUtility.getAgentById(chat.fromId))
                .setDate(chat.createDate, chat.createDateStr)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                .setStatus(MESSAGE_STATUS.send)
                .addToBox();
        }

        content.sendMessage = function (chat) {
            new ChatPopup('self')
                .setId(chat.id)
                .setFromId(0)
                .setDate(chat.createDate, chat.createDateStr)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                .setStatus(MESSAGE_STATUS.send)
                .addToBox();
        }

        content.scrollToBottom = function () {
            container[0].scrollTop = container[0].scrollHeight;
        }

        content.getLastScrollPosition = function () {
            return container[0].scrollTop;
        }

        content.setScrollPosition = function (position) {
            container[0].scrollTop = position;
        }

        content.viewAllChat = function () {
            var exists = false;
            RV.each(arrChatPopups, function (p, popup) {
                if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == 'other') {
                    popup.setStatus(MESSAGE_STATUS.viewed);
                    exists = true;
                }
            });
            if (exists) service.send(service.ACTIONS.viewMessage, {});
        }

        content.viewedMessage = function (isAgentView) {
            RV.each(arrChatPopups, function (p, popup) {
                if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == (isAgentView ? 'self' : 'other')) {
                    popup.setStatus(MESSAGE_STATUS.viewed);
                }
            });
        }

        container.click(function () {
            content.viewAllChat();
        });

        function setPopupArrowAndLabel(prevPopup, popup) {
            if (popup.label && popup.label != '') popup.label.remove();

            if (!prevPopup || (prevPopup.getDateId() != popup.getDateId())) {
                popup.label = new ChatLabel(popup.getDateStr()).getUI();
            } else {
                popup.label = '';
            }

            if (!prevPopup) {
                popup.toggleArrow(true)
            } else {
                popup.toggleArrow(true)
                var diffMinutes = (popup.getDate() - prevPopup.getDate()) / (1000 * 60);
                if (prevPopup.from == popup.from && prevPopup.getFromId() == popup.getFromId() && diffMinutes < 4) {
                    prevPopup.toggleArrow(false);
                }
            }
        }

        function loadChat() {
            service.send(service.ACTIONS.getChats, {}, function (isSuccess, chats) {
                if (!isSuccess) return false;
                RV.each(chats, function (c, chat) {
                    var popup = new ChatPopup(chat.isAgent ? 'other' : 'self')
                        .setId(chat.id)
                        .setFromId(0)
                        .setDate(chat.createDate, chat.createDateStr)
                        .setStatus(chat.viewed ? MESSAGE_STATUS.viewed : MESSAGE_STATUS.send)
                        .setMessage(chat.message, chat.messageMode, chat.extra);

                    if (chat.isAgent) popup.setAvatar(agentUtility.getAgentById(chat.fromId)).setFromId(chat.fromId)

                    coverContent.prepend(popup.getUI());
                    arrChatPopups.splice(0, 0, popup);
                });

                RV.each(arrChatPopups, function (p, popup) {
                    prevPopup = p == 0 ? null : arrChatPopups[p - 1];
                    setPopupArrowAndLabel(prevPopup, popup);
                    if (popup.label != '') popup.getUI().before(popup.label);
                });

                content.scrollToBottom();
                content.viewAllChat();
            });
        }
    }


    // FOOTER /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Footer() {
        var footer = this;
        var container = RV('<div>').addClass('ravesh-chat-footer').appendTo(mainContainer);

        var emojiWrapper = RV('<div>').addClass('ravesh-chat-emoji ravesh-chat-scrollbar');
        var panelEmoji = new Panel(emojiWrapper, container);

        var panelTextArea = RV('<div>').addClass('ravesh-chat-panel-textarea').appendTo(container);
        var btnAttach = RV('<a>').attr({ 'href': '#' }).addClass('float-left ravesh-button attach').html(utility.getSVGIcon(utility.icon.attach)).appendTo(panelTextArea);
        var btnEmoji = RV('<a>').attr({ 'href': '#' }).addClass('float-left ravesh-button emoji').html(utility.getSVGIcon(utility.icon.emoji)).appendTo(panelTextArea);
        var btnSend = RV('<a>').attr({ 'href': '#' }).addClass('float-left ravesh-button send').html(utility.getSVGIcon(options.dir == 'rtl' ? utility.icon.sendRtl : utility.icon.sendLtr)).css({ color: options.primaryColor }).hide().appendTo(panelTextArea);
        var textarea = RV('<textarea>').attr({ 'rows': 1, placeholder: utility.r.writeAMessage }).addClass('float-right ravesh-chat-scrollbar').appendTo(panelTextArea);

        btnSend.click(function () {
            var message = textarea.val().trim();
            if (message == '') return false;
            textarea.val('');
            changeTextAreaHeight();
            panelEmoji.hide();

            new ChatPopup('self').setDate().setStatus(0).setMessage(message, MESSAGE_MODE.text).addToBox().send();
            content.scrollToBottom();
            content.viewAllChat();

            btnAttach.show();
            btnSend.hide();
            return false;
        });

        textarea.click(function () {
            content.viewAllChat();
        });
        textarea.keyup(function () {
            var text = textarea.val().trim();
            changeTextAreaHeight();
            btnAttach.toggle(text == '');
            btnSend.toggle(text != '');
            utility.changDirection(textarea, text);
        });
        textarea.keydown(function (ev) {
            if (ev.keyCode == 13 && !ev.shiftKey) {
                btnSend.click();
                ev.preventDefault();
                return false;
            } if (ev.keyCode == 27) { //esc
                // btnBack.click();
                return false;
            }
            footer.onIsTyping();
        });

        footer.onIsTyping = function () {
            if (footer.isTypingCalled) return false;
            footer.isTypingCalled = true;
            service.send(service.ACTIONS.isTyping, {});
            setTimeout(function () { footer.isTypingCalled = false; }, 3000);
        }

        //emoji
        var emojiList = utility.getEmojiList();
        RV.each(emojiList, function (e, emoji) {
            emojiWrapper.append(
                RV('<span>').text(emoji).click(function () {
                    utility.insertAtCursor(textarea[0], emoji);
                    textarea[0].focus();
                    btnAttach.hide();
                    btnSend.show();
                })
            );
        });
        panelEmoji.setOnToggle(function (enable, panelId) {
            btnEmoji.toggleClass('active', enable).addClass(panelId);
        });
        btnEmoji.click(function () {
            panelEmoji.toggle();
        })

        //attach
        var fileUploader = new utility.uploader(mainContainer, textarea, function (selectedFile) {
            new ChatPopup('self').setDate().setStatus(0).setMessage(selectedFile, MESSAGE_MODE.upload).addToBox();
            content.scrollToBottom();
            content.viewAllChat();
            setTimeout(content.scrollToBottom, 500);
        });
        btnAttach.click(function (ev) {
            fileUploader.select();
        });


        function changeTextAreaHeight() {
            textarea.css({ 'height': 'unset', 'overflow': 'hidden', 'line-height': 'unset' });
            var adjustedHeight = Math.max(textarea[0].clientHeight, textarea[0].scrollHeight);
            if (adjustedHeight > 94) {
                adjustedHeight = 94;
                textarea.css({ 'overflow': 'auto' });
            }
            if (adjustedHeight <= 40) {
                textarea.css({ 'line-height': '40px' });
            }
            textarea.css({ 'height': (adjustedHeight + 20) + 'px' });
        }
    }


    // PANEL /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Panel(content, appendTo) {
        var panel = this;
        var panelId = utility.randomId('panel-');
        var container = RV('<div>').addClass('ravesh-chat-panel ' + panelId).append(content).appendTo(appendTo);
        var isHide = true;
        var onToggle = function (enable, panelId) { }
        panel.toggle = function () {
            if (isHide) {
                panel.show();
            } else {
                panel.hide();
            }
        }

        panel.show = function () {
            container.css({ height: content[0].clientHeight + 'px' });
            isHide = false;
            onToggle(true, panelId);
        }

        panel.hide = function () {
            container.css({ height: '0px' });
            isHide = true;
            onToggle(false, panelId);
        }

        panel.setOnToggle = function (listener) { onToggle = listener; }

        document.addEventListener('mousedown', function (ev) {
            if (!hasParents(ev.target, panelId)) {
                panel.hide();
            }
        })

        function hasParents(elem, className) {
            var elem_ = elem;
            className = " " + className + " ";
            while (elem_.parentNode) {
                if ((" " + elem_.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) return true;
                elem_ = elem_.parentNode;
            }
            return false;
        }
    }


    // CHAT POPUP /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function ChatPopup(from) {
        var popup = this;
        popup.from = from;
        var messageMode = MESSAGE_MODE.text;
        var data = {
            id: 0,
            status: MESSAGE_STATUS.pending,
            message: '',
            messageMode: '',
            extra: ''
        };

        var messageElem = RV('<div>').addClass('message ' + from);
        var avatarElem = RV('<img>').addClass('avatar').appendTo(messageElem);
        var popupElem = RV('<div>').addClass('popup').appendTo(messageElem);
        var contentElem = RV('<div>').addClass('content').appendTo(popupElem);
        var statusElem = RV('<i>').addClass('status').appendTo(popupElem);
        var dateElem = RV('<div>').addClass('date').appendTo(popupElem);

        //Methods
        popup.addToBox = function () {
            content.onAddPopupToBox(popup);
            return popup;
        }
        popup.toggleArrow = function (enable) {
            messageElem.toggleClass('arrow', enable);
            return popup;
        };
        popup.getUI = function () { return messageElem; }
        popup.getId = function () { return data.id; }
        popup.setId = function (id) { data.id = id; return popup; }
        popup.getFromId = function () { return data.fromId; }
        popup.setFromId = function (fromId) { data.fromId = fromId; return popup; }
        popup.setMessage = function (message, messageMode, extra) {
            data.message = message;
            data.messageMode = messageMode;
            data.extra = extra || '';
            convertMessage();
            return popup;
        };
        popup.getDate = function () { return data.dateValue };
        popup.getDateStr = function () { return data.dateStr };
        popup.getDateId = function () { return data.dateId };
        popup.setDate = function (date, dateStr) {
            if (date) {
                date = new Date(date);
                date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            } else {
                date = new Date();
            }
            dateStr = utility.numberLocalize(utility.getDateStr(date, dateStr));
            var time = utility.numberLocalize(utility.getTime(date));
            dateElem.empty().text(time).attr({ 'title': dateStr + ' ' + time });
            data.dateValue = date.getTime();
            data.dateStr = dateStr;
            data.dateId = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
            return popup;
        };
        popup.getStatus = function () { return data.status }
        popup.setStatus = function (status) {
            data.status = status;
            var statusClass = [['pending', utility.icon.clock], ['send', utility.icon.check], ['viewed', utility.icon.dblCheck], ['not send', utility.icon.ban]];
            RV.each(statusClass, function (c, cl) { statusElem.removeClass('status-' + c) });
            statusElem.addClass('status-' + status).empty().html(utility.getSVGIcon(statusClass[status][1], 16));
            return popup;
        };
        popup.setAvatar = function (agent) {
            messageElem.addClass('has-avatar');
            avatarElem.attr({ src: agent.avatar, title: agent.name });
            return popup;
        }
        popup.remove = function () { messageElem.remove(); }
        popup.send = function () {
            service.send(service.ACTIONS.sendMessage, { message: data.message, messageMode: data.messageMode, extra: data.extra }, function (isSuccess, chat) {
                popup.setStatus(isSuccess ? MESSAGE_STATUS.send : MESSAGE_STATUS.error);
                if (isSuccess) {
                    popup.setId(chat.id);
                    popup.setDate(chat.createDate, chat.createDateStr);
                }
            });
            return popup;
        }
        popup.isInViewport = function () {
            var p = messageElem[0].getBoundingClientRect();
            var c = content[0].getBoundingClientRect();
            var ph = Math.min(p.height, c.height);
            return p.bottom >= c.top + ph &&
                p.top <= c.bottom - ph;
        };
        popup.scrollIntoView = function () {
            messageElem[0].scrollIntoView(true);
        }

        function convertMessage() {
            var file = null;

            if (data.messageMode == MESSAGE_MODE.text) {
                contentElem.html(utility.convertTextMessage(data.message));
                utility.changDirection(contentElem, data.message);
            }

            if (data.messageMode == MESSAGE_MODE.upload) {
                file = data.message;
                data.messageMode = MESSAGE_MODE.file;
                if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file['type']) != -1) data.messageMode = MESSAGE_MODE.picture;
                else if (file['type'].indexOf('audio') != -1) data.messageMode = MESSAGE_MODE.sound;
            }

            if (data.messageMode == MESSAGE_MODE.picture) {
                var imgLink = RV('<a>').appendTo(contentElem);
                var imgPreview = RV('<img>').appendTo(imgLink);
                var extra = data.extra ? JSON.parse(data.extra) : {};

                var setImageProp = function (url) {
                    var width = 275;
                    if (extra.width < width) width = extra.width;
                    if (extra.width < 100) width = 100;
                    imgPreview.css({ 'background-color': '#' + extra.color, width: width + 'px', height: (extra.height * (width / extra.width)) + 'px' });
                    imgLink.attr({ 'href': options.serviceUrl + url.replace('../', '/'), target: '_blank' });
                    imgPreview.attr({
                        'src': options.serviceUrl + url.replace('../', '/'), alt: extra.name,
                        'title': extra.name + '\nDimensions: ' + extra.width + ' x ' + extra.height + '\nSize: ' + utility.bytesToSize(extra.size)
                    });
                }

                if (file) {
                    var progress = new utility.circleProgress(35, '#ffffff');
                    contentElem.append(progress.getUI());
                    extra = { name: file.name, size: file.size };

                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        imgPreview.attr({ 'src': ev.target.result }).show();
                        imgPreview[0].onload = function () {
                            if (imgPreview.isLoaded) return false;
                            extra.width = this.naturalWidth;
                            extra.height = this.naturalHeight;
                            extra.color = utility.getMainColorImage(this);
                            data.extra = JSON.stringify(extra);
                            upload(progress, function (url) {
                                progress.getUI().remove();
                                setImageProp(url);
                            });
                            imgPreview.isLoaded = true;
                        }
                    }
                    reader.readAsDataURL(file);

                } else {
                    setImageProp(data.message);
                }
            }

            if (data.messageMode == MESSAGE_MODE.file || data.messageMode == MESSAGE_MODE.sound) {
                var btnDownload = RV('<a>').addClass('message-icon').html(utility.getSVGIcon(utility.icon.download)).appendTo(contentElem);
                var extra = data.extra ? JSON.parse(data.extra) : {};


                if (file) {
                    var progress = new utility.circleProgress(35, '#EFFDDE');
                    contentElem.append(progress.getUI());
                    extra = { name: file.name, size: file.size };
                    data.extra = JSON.stringify(extra);

                    btnDownload.hide();
                    upload(progress, function (url) {
                        progress.getUI().remove();
                        btnDownload.show().attr({ 'href': options.serviceUrl + url.replace('../', '/'), 'target': '_blank' });
                    });
                } else {
                    btnDownload.attr({ 'href': options.serviceUrl + data.message.replace('../', '/'), 'target': '_blank' });
                }
                RV('<div>').addClass('message-title').text(extra.name).attr({ 'title': extra.name }).appendTo(contentElem);
                RV('<div>').addClass('message-detail').text(utility.bytesToSize(extra.size)).appendTo(contentElem);
            }

            if (data.messageMode == MESSAGE_MODE.form) {
                var extra = JSON.parse(data.extra);
                RV('<div>').css({ 'background-color': '#' + extra.color }).addClass('message-icon').html(utility.getSVGIcon(utility.icon.form)).appendTo(contentElem);
                RV('<div>').attr({ 'title': extra.formName }).addClass('message-title').text(extra.formName).appendTo(contentElem);
                if (extra.url) {
                    RV('<div>').addClass('message-detail').text(utility.r.requestSendForm).appendTo(contentElem);
                    if (data.message != '') RV('<a>').addClass('message-button').attr({ href: extra.url, target: '_blank' }).text(utility.r.submitForm).appendTo(contentElem);
                } else {
                    RV('<div>').addClass('message-detail').text(utility.r.submitForm).appendTo(contentElem);
                }
            }

            function upload(progress, callback) {
                progress.setProgress(25);
                service.post('sendFile', { file: data.message, key: options.key }, function (isSuccess, message, data_) {
                    progress.setProgress(100);
                    if (isSuccess) {
                        data.message = data_[1];
                        popup.send();
                        if (callback) callback(data_[0]);
                    } else {
                        popup.setStatus(3);
                    }
                });
            }

            contentElem.addClass('content-type-' + data.messageMode);
        }

    }


    function ChatLabel(text, title) {
        var label = this;
        var labelElem = RV('<div>').addClass('chat-label');
        var labelText = RV('<div>').addClass('text').text(text).appendTo(labelElem);
        if (title) labelText.attr('title', title);

        label.getUI = function () {
            return labelElem;
        }
    }

}


function Service(options) {
    var service = this;

    var websocket;
    var arrSendCallbacks = [];
    var arrSocketCallback = [];
    var chatCode = getChatCode();
    var userInfo = null;
    var onStartSocketListener = function () { };
    var onGetUserInfo = null;

    service.ACTIONS = {
        error: -1,
        sendMessage: 1,
        setUserId: 2,
        setUserInfo: 3,
        isOnline: 4,
        isOffline: 5,
        changeStatus: 6,
        receiveMessage: 7,
        getChats: 8,
        viewMessage: 9,
        isTyping: 10,
        getUserInfo: 11
    }

    service.connectionTries = 30;
    service.connect = function () {
        if (websocket && websocket.readyState == WebSocket.OPEN) return false;
        var url = options.serviceUrl.toLowerCase().replace('http', 'ws');
        url = url + '/' + options.domain + '/chatclient/socket/' + chatCode + '?token=' + options.key;;
        websocket = new WebSocket(url);
        websocket.onopen = onOpenWebsocket;
        websocket.onclose = onCloseWebsocket;
        websocket.onmessage = onMessageWebsocket;
        websocket.onerror = onErrorWebsocket;
    }

    service.isConnect = function () { return websocket && websocket.readyState == WebSocket.OPEN }

    service.send = function (action, data, callback) {
        if (service.isConnect()) {
            var callbackId = '';
            if (callback) {
                callbackId = 'callback_' + Math.random().toString(36).substr(2, 10);
                arrSendCallbacks[callbackId] = callback;
            }
            websocket.send(JSON.stringify({ userId: service.getUserId(), action: action, data: data, callback: callbackId }));
        } else {
            if (callback) callback(false);
        }
    }

    service.post = function (methodName, data, callback) {
        var url = options.serviceUrl + '/' + options.domain + '/chatclient/' + methodName + '/' + chatCode + '?token=' + options.key;

        var formData = new FormData();
        formData.append("userId", service.getUserId());
        for (var key in data) {
            formData.append(key, data[key]);
        }

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var response = JSON.parse(request.responseText);
                if (callback) callback(response.status == 1, response.message, response.data);
            }
        }

        request.addEventListener('error', function () {
            if (callback) callback(false, '', '');
        });

        request.open('POST', url, true);
        request.setRequestHeader('Accept', "*/*");
        request.send(formData);
    }

    service.addSocketEventListener = function (action, callback) {
        arrSocketCallback.push([action, callback]);
    }

    service.setOnStartSocketListener = function (listener) { onStartSocketListener = listener };

    service.getUserId = function () {
        var userId = localStorage.getItem('ravesh_crm_chat_user_' + options.localKey);
        return userId == null ? '0' : userId;
    }

    service.setUserId = function (userId) {
        localStorage.setItem('ravesh_crm_chat_user_' + options.localKey, userId);
    }

    service.getChatCode = getChatCode;

    service.isSetUserInfo = function () {
        var enable = localStorage.getItem('ravesh_crm_chat_set_user_info_' + options.localKey);
        return enable == null ? false : enable;
    }

    service.setIsSetUserInfo = function (enable) {
        localStorage.setItem('ravesh_crm_chat_set_user_info_' + options.localKey, enable);
    }

    service.sendUserInfo = function (user) {
        if (user && service.isSetUserInfo() == false) {
            userInfo = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                about: user.about || '',
                avatar: user.avatar || '',
                raveshCrmCustomer: user.raveshCrmCustomer || ''
            };
        }
        if (userInfo) {
            service.send(service.ACTIONS.setUserInfo, userInfo, function (isSuccess, data) {
                if (isSuccess) service.setIsSetUserInfo(true);
            });
        }
    }

    service.getUserInfo = function (callback) {
        if (!callback) return false;
        if (service.localUserInfo) callback(service.localUserInfo);
        if (service.isConnect()) {
            service.send(service.ACTIONS.getUserInfo, {}, function (isSuccess, data) {
                if (!isSuccess) return false;
                service.localUserInfo = data;
                callback(data);
                onGetUserInfo = null;
            })
        } else {
            onGetUserInfo = callback;
        }
    }

    service.sendUserIsOnline = function () {
        var referrer = document.referrer;
        if (referrer == '') referrer = window.location.href;
        service.send(service.ACTIONS.isOnline, { referrer: referrer });
    }

    function onMessageWebsocket(ev) {
        var data = JSON.parse(ev.data);

        RV.each(arrSocketCallback, function (c, action_) {
            if (action_[0] == data.action && !arrSendCallbacks[data.callback]) action_[1](data.data, data.index);
        });

        if (data.callback != '' && arrSendCallbacks[data.callback]) {
            arrSendCallbacks[data.callback](data.isSuccess, data.data);
            delete arrSendCallbacks[data.callback];
        }

        if (data.action == service.ACTIONS.setUserId) {
            service.setUserId(data.data[0]);
            if (data.data[1]) service.setIsSetUserInfo(true);
        }
    }

    function onOpenWebsocket(ev) {
        service.connectionTries = 30;
        service.sendUserIsOnline();
        service.sendUserInfo();
        service.getUserInfo(onGetUserInfo);
        if (!service.firstStart) {
            service.firstStart = true;
            onStartSocketListener();
        }
    }

    function onCloseWebsocket(ev) {
        service.connectionTries--;
        if (service.connectionTries > 0) {
            setTimeout(function () { service.connect() }, 5000);
        }
    }

    function onErrorWebsocket(ev) {
        // if (ev.target.readyState === 3) {//CLOSED
        //     
        // }
    }

    function getChatCode() {
        var chatCode = localStorage.getItem('ravesh_crm_chat_code_' + options.localKey);
        if (!chatCode) {
            chatCode = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('ravesh_crm_chat_code_' + options.localKey, chatCode);
        }
        return chatCode;
    }
}


function AgentUtility(options) {
    var agentUtility = this;
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    options.agents = shuffle(options.agents);

    var agents = {};
    RV.each(options.agents, function (a, agent) {
        if (agent.avatar == '') agent.avatar = options.serviceUrl + '/themes/resources/images/noimage.jpg'; else agent.avatar = options.serviceUrl + agent.avatar.replace('../', '/');
        agents[agent.id] = agent;
    });


    agentUtility.getActiveAgent = function () {
        return options.agents[0];
    }
    agentUtility.getThreeAgents = function () {
        if (options.agents.length > 3) {
            return [options.agents[0], options.agents[1], options.agents[2]];
        } else {
            return options.agents;
        }
    }
    agentUtility.getAgentById = function (agentId) {
        var agent = agents[agentId];
        if (agent) {
            return agent;
        } else {
            return { id: agentId, name: options.title, detail: options.detail, avatar: options.serviceUrl + '/themes/resources/images/noimage.jpg' };
        }
    }
    agentUtility.getCurrentAgent = function () {
        return agentUtility.getAgentById(agentUtility.getCurrentAgentId());
    }
    agentUtility.getCurrentAgentId = function () {
        var currentAgentId = localStorage.getItem('ravesh_crm_chat_agent_' + options.localKey);
        if (!currentAgentId) return 0; else return currentAgentId;
    }
    agentUtility.saveCurrentAgentId = function (currentAgentId) {
        localStorage.setItem('ravesh_crm_chat_agent_' + options.localKey, currentAgentId);
    }
}


function Utility(lang) {
    var self = this;
    var resources = {
        en: {
            writeAMessage: 'Write a message …',
            dragHere: 'Drag file here',
            today: 'Today',
            yesterday: 'Yesterday',
            isTyping: 'Is typing ',
            youHaveNewMessage: 'You have a new message',
            maxUploadSizeMessage: 'It is possible to upload up to 5 MB',
            requestSendForm: 'Request for send form',
            submitForm: 'Submit form'
        },
        fa: {
            writeAMessage: 'پیغام خود را وارد کنید …',
            dragHere: 'فایل‌ خود را اینجا رها کنید',
            today: 'امروز',
            yesterday: 'دیروز',
            isTyping: 'در حال تایپ ',
            youHaveNewMessage: 'پیغام جدیدی دارید',
            maxUploadSizeMessage: 'امکان بارگذاری حداکثر 5 مگابایت وجود دارد',
            requestSendForm: 'درخواست ثبت فرم',
            submitForm: 'ثبت فرم'
        }
    }
    self.r = resources[lang];
    self.icon = {
        close: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
        emoji: 'M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
        attach: 'M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z',
        sendRtl: 'M22,3,1,12l21,9V14L7,12l15-2Z',
        sendLtr: 'M2,21L23,12L2,3V10L17,12L2,14V21Z',
        upload: 'M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04M19,18H6A4,4 0 0,1 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15A3,3 0 0,1 19,18M8,13H10.55V16H13.45V13H16L12,9L8,13Z',
        clock: 'M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M15.3 16.2L14 17L11 11.8V7H12.5V11.4L15.3 16.2Z',
        ban: 'M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 4C10.1 4 8.4 4.6 7.1 5.7L18.3 16.9C19.3 15.5 20 13.8 20 12C20 7.6 16.4 4 12 4M16.9 18.3L5.7 7.1C4.6 8.4 4 10.1 4 12C4 16.4 7.6 20 12 20C13.9 20 15.6 19.4 16.9 18.3Z',
        check: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z',
        dblCheck: 'M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z',
        download: 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z',
        form: 'M5,3C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z'
    }
    self.getSVGIcon = function (icon, width) {
        if (!width) width = 24;
        return '<svg style="width:' + width + 'px;height:' + width + 'px" viewBox="0 0 24 24"><path d="' + icon + '" style="fill: currentcolor;"/></svg>';
    }
    self.numberLocalize = function (text) {
        if (lang == "en") return text;
        var str = text.toString();
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        for (var i = 0; i <= 9; i++) str = str.replace(new RegExp(i, "g"), persian[i]);
        return str;
    }
    self.randomId = function (prefix) {
        return (prefix ? prefix : 'id') + Math.random().toString(36).substr(2, 10);
    }
    self.getTime = function (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        return (hour < 10 ? '0' + hour : hour) + ':' + (minutes < 10 ? '0' + minutes : minutes);
    }
    self.getDateStr = function (date, dateStr) {
        var dateNow = new Date();
        if (dateNow.getYear() == date.getYear() && dateNow.getMonth() == date.getMonth() && dateNow.getDay() == date.getDay()) {
            return self.r.today;
        } else if (dateNow.getYear() == date.getYear() && dateNow.getMonth() == date.getMonth() && dateNow.getDay() - 1 == date.getDay()) {
            return self.r.yesterday;
        } else {
            if (!dateStr) return '';
            var months = [];
            if (lang == 'fa') {
                months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
            } else {
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
            var month = parseInt(dateStr.substring(5, 7)) - 1;
            var day = parseInt(dateStr.substring(8, 10));
            return day + ' ' + months[month];
        }
    }
    self.bytesToSize = function (bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    self.convertTextMessage = function (message) {
        message = self.convertAsciiToEmoji(message);
        message = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        message = self.linkfy(message);
        message = message.replace(/\n/g, '<br>');
        var emojiCount = self.getEmojiCount(message);
        if (emojiCount > 0 && emojiCount <= 3) message = '<div style="text-align:center;font-size:' + (emojiCount == 1 ? 70 : 36) + 'px">' + message + '</div>';
        return message;
    }
    self.linkfy = function (inputText) {
        var replacedText = "";

        var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" ref="nofollow" target="_blank">$1</a>');

        var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" ref="nofollow" target="_blank">$2</a>');

        var replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        var replacePattern4 = /((\+98|0)?9\d{9})(\b|$)/gim;
        replacedText = replacedText.replace(replacePattern4, '<a href="tel:$1" >$1</a>');

        return replacedText;
    }
    self.insertAtCursor = function (mInput, mValue) {
        if (document.selection) {
            mInput.focus();
            sel = document.selection.createRange();
            sel.text = mValue;
        } else if (mInput.selectionStart || mInput.selectionStart == '0') {
            var startPos = mInput.selectionStart;
            var endPos = mInput.selectionEnd;
            mInput.value = mInput.value.substring(0, startPos)
                + mValue
                + mInput.value.substring(endPos, mInput.value.length);
        } else {
            mInput.value += mValue;
        }
    }
    self.getEmojiCount = function (inputText) {
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        var matches = inputText.match(regex);
        if (matches && inputText.replace(regex, '').length == 0) return matches.length
        return 0;
    }
    self.convertAsciiToEmoji = function (message) {
        var map = {
            "<3": "\u2764\uFE0F",
            "</3": "\uD83D\uDC94",
            ":D": "\uD83D\uDE00",
            ":)": "\uD83D\uDE03",
            ";)": "\uD83D\uDE09",
            ":(": "\uD83D\uDE12",
            ":p": "\uD83D\uDE1B",
            ";p": "\uD83D\uDE1C",
            ":'(": "\uD83D\uDE22"
        };
        for (var ascii in map) {
            var regex = new RegExp(ascii.replace(/([()[{*+.$^\\|?])/g, '\\$1'), 'gim');
            message = message.replace(regex, map[ascii]);
        }
        return message;
    }
    self.getEmojiList = function () {
        return [
            "\uD83D\uDE04", "\uD83D\uDE03", "\uD83D\uDE00", "\uD83D\uDE0A", "\uD83D\uDE09", "\uD83D\uDE0D", "\uD83D\uDE18", "\uD83D\uDE1A", "\uD83D\uDE17", "\uD83D\uDE19",
            "\uD83D\uDE1C", "\uD83D\uDE1D", "\uD83D\uDE1B", "\uD83D\uDE33", "\uD83D\uDE01", "\uD83D\uDE14", "\uD83D\uDE0C", "\uD83D\uDE12", "\uD83D\uDE1E", "\uD83D\uDE23",
            "\uD83D\uDE22", "\uD83D\uDE02", "\uD83D\uDE2D", "\uD83D\uDE2A", "\uD83D\uDE25", "\uD83D\uDE30", "\uD83D\uDE05", "\uD83D\uDE13", "\uD83D\uDE29", "\uD83D\uDE2B",
            "\uD83D\uDE28", "\uD83D\uDE31", "\uD83D\uDE20", "\uD83D\uDE21", "\uD83D\uDE24", "\uD83D\uDE16", "\uD83D\uDE06", "\uD83D\uDE0B", "\uD83D\uDE37", "\uD83D\uDE0E",
            "\uD83D\uDE34", "\uD83D\uDE35", "\uD83D\uDE32", "\uD83D\uDE1F", "\uD83D\uDE26", "\uD83D\uDE27", "\uD83D\uDE08", "\uD83D\uDC7F", "\uD83D\uDE2E", "\uD83D\uDE2C",
            "\uD83D\uDE10", "\uD83D\uDE15", "\uD83D\uDE2F", "\uD83D\uDE36", "\uD83D\uDE07", "\uD83D\uDE0F", "\uD83D\uDE11", "\uD83D\uDC72", "\uD83D\uDC73", "\uD83D\uDC6E",
            "\uD83D\uDC77", "\uD83D\uDC76", "\uD83D\uDC66", "\uD83D\uDC67", "\uD83D\uDC68", "\uD83D\uDC69", "\uD83D\uDC74", "\uD83D\uDC75", "\uD83D\uDC71", "\uD83D\uDC7C",
            "\uD83D\uDC78", "\uD83D\uDE3A", "\uD83D\uDE38", "\uD83D\uDE3B", "\uD83D\uDE3D", "\uD83D\uDE3C", "\uD83D\uDE40", "\uD83D\uDE3F", "\uD83D\uDE39", "\uD83D\uDE3E",
            "\uD83D\uDE48", "\uD83D\uDE49", "\uD83D\uDE4A", "\uD83D\uDC80", "\uD83D\uDC7D", "\uD83D\uDD25", "\u2728", "\uD83C\uDF1F", "\uD83D\uDCAB", "\uD83D\uDCA5",
            "\uD83D\uDCA2", "\uD83D\uDCA4", "\uD83D\uDC42", "\uD83D\uDC40", "\uD83D\uDC43", "\uD83D\uDC4D", "\uD83D\uDC4E", "\uD83D\uDC4C", "\uD83D\uDC4A", "\u270A",
            "\u270C", "\uD83D\uDC4B", "\u270B", "\uD83D\uDC50", "\uD83D\uDC46", "\uD83D\uDC47", "\uD83D\uDE4C", "\uD83D\uDE4F", "\u261D", "\uD83D\uDC4F",
            "\uD83D\uDCAA", "\uD83D\uDEB6", "\uD83C\uDFC3", "\uD83C\uDF80", "\uD83C\uDF02", "\uD83D\uDC9B", "\uD83D\uDC99", "\uD83D\uDC9C", "\uD83D\uDC9A", "\u2764",
            "\uD83D\uDC94", "\uD83D\uDC97", "\uD83D\uDC93", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC9E", "\uD83D\uDC98", "\uD83D\uDC8C", "\uD83D\uDC8E", "\uD83D\uDC64",
            "\uD83D\uDC65", "\uD83D\uDCAC", "\uD83D\uDC63", "\uD83D\uDCAD"];
    }
    self.changDirection = function (elem, text) {
        function isRtlChar(s) {
            var rtlChars = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC',
                rtlDirCheck = new RegExp('^[^' + rtlChars + ']*?[' + rtlChars + ']');
            return rtlDirCheck.test(s);
        }
        var hasUnicodeChar = false;
        for (var i = 0; i < text.length; ++i) {
            if (isRtlChar(text[i])) {
                hasUnicodeChar = true;
                break;
            }
        }
        if (text == '') {
            elem.css({
                "direction": "unset",
                "text-align": "unset"
            });
        } else {
            elem.css({
                "direction": hasUnicodeChar ? "rtl" : "ltr",
                "text-align": hasUnicodeChar ? "right" : "left"
            });
        }
    }
    self.uploader = function (container, pasteContainer, callback) {
        var uploader = this;
        var enterTarget = null;
        var selectedFile = null;

        var uploadFile = RV('<input>').attr({ 'type': 'file' }).hide();
        var helper = RV('<div>').addClass('ravesh-upload-helper').append(RV('<div>').append(RV('<div>').append(RV('<div>').addClass('icon-upload').html(self.getSVGIcon(self.icon.upload, 120)), RV('<div>').text(self.r.dragHere))));
        container.append(uploadFile, helper);

        var checkSize = function (file) {
            if (file.size > 1024 * 1024 * 5) {
                alert(self.r.maxUploadSizeMessage);
                return false;
            }
            return true;
        }

        uploader.select = function () {
            uploadFile.click();
        }

        uploadFile.click(function () {
            uploadFile.click();
        });

        uploadFile.change(function () {
            selectedFile = uploadFile[0].files[0];
            if (selectedFile) {
                if (!checkSize(selectedFile)) return false;
                callback(selectedFile);
            }
        });

        container.bind('dragover dragenter', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            enterTarget = ev.target;
            container.addClass('active');
        });

        container.bind('drop', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            container.removeClass('active');

            var files = ev.dataTransfer.files;
            selectedFile = files[0];
            if (selectedFile) {
                if (!checkSize(selectedFile)) return false;
                callback(selectedFile);
            }
        });

        container.bind('dragleave dragend', function (ev) {
            if (enterTarget == ev.target) {
                container.removeClass('active');
            }
        });

        pasteContainer.bind('paste', function (ev) {
            var items = (ev.clipboardData || ev.originalEvent.clipboardData).items;
            for (var i = 0 ; i < items.length ; i++) {
                var item = items[i];
                if (item.type.indexOf("image") != -1) {
                    selectedFile = item.getAsFile();
                    if (selectedFile) {
                        if (!checkSize(selectedFile)) return false;
                        callback(selectedFile);
                    }
                    break;
                }
            }

        });
    }
    self.circleProgress = function (width, color) {
        var progress = this;
        var barWidth = width * 0.1;
        var barRadius = (width / 2) - (barWidth / 2);
        var barPosition = width / 2;
        var dashArray = (width - barWidth) * Math.PI;

        progress.getUI = function () { return container };
        progress.setProgress = function (percent) {
            var c = Math.PI * (barRadius * 2);
            if (percent < 5) { percent = 5; }
            if (percent > 100) { percent = 100; }
            var pct = ((100 - percent) / 100) * c;
            bar.css({ strokeDashoffset: pct });
            return progress;
        }

        var container = RV('<div>').addClass('ch-loading');
        var loading = RV('<div>').css({ width: width + 'px', height: width + 'px', animation: 'ravesh-rotation 2s infinite linear' }).appendTo(container);
        var svg = RV('<svg>').attr({ width: width + 'px', height: width + 'px', viewPort: '0 0 ' + width + ' ' + width }).appendTo(loading);
        var bar = RV('<circle>').attr({ r: barRadius, cx: barPosition, cy: barPosition, fill: "transparent", 'stroke-dasharray': dashArray, 'stroke-width': barWidth, stroke: color, 'stroke-dashoffset': "0", style: "transition: stroke-dashoffset 0.3s linear;" }).appendTo(svg);

        progress.setProgress(0);
    }
    self.getMainColorImage = function (img) {
        var blockSize = 5; // only visit every 5 pixels
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var height = canvas.height = 100
        var width = canvas.width = 100

        context.drawImage(img, 0, 0, width, height);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            return 'FFFFFF';
        }

        var length = data.data.length;

        var i = -4;
        var count = 0;
        var rgb = { r: 0, g: 0, b: 0 };
        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        rgb.r = parseInt(rgb.r / count);
        rgb.g = parseInt(rgb.g / count);
        rgb.b = parseInt(rgb.b / count);

        if (rgb.r > 255 || rgb.g > 255 || rgb.b > 255) return 'FFFFFF';
        return ((rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16);
    }
    self.playSound = function (url) {
        var soundHandler = new Audio();
        soundHandler.loop = false;
        soundHandler.preload = true;
        soundHandler.controls = false;
        soundHandler.autoplay = true;
        soundHandler.src = url;
        soundHandler.play();
    }
    self.blinkPageTitle = function (newTitle) {
        var isOldTitle = true;
        if (!self.originPageTitle) self.originPageTitle = parent.document.title;
        var interval = setInterval(function () {
            if (document.hidden) {
                parent.document.title = isOldTitle ? self.originPageTitle : newTitle;
                isOldTitle = !isOldTitle;
            } else {
                clearInterval(interval);
                parent.document.title = self.originPageTitle;
            }
        }, 700);
    }


}

var chatClient = new ChatClient(setting);
var scrollPosition = 0;
chatClient.setOnCloseListener(function () {
    parent.RaveshCrmChat.hide();
});


function onShowChatBox() {
    chatClient.startChat();
    chatClient.setScrollPosition(scrollPosition);
}

function onHideChatBox() {
    scrollPosition = chatClient.getLastScrollPosition();
}

function setUser(user) {
    chatClient.setUserInfo(user);
}

function getUser(callback) {
    chatClient.getUserInfo(callback);
}

function sendQuickMessage(options) {
    if (!options.agent) options.agent = chatClient.getActiveAgent();
    chatClient.sendQuickMessage(options.message, options.agent);
    parent.RaveshCrmChat.sendQuickMessage(options);
}


var readyEvent = new CustomEvent('raveshcrm_chat_ready');
parent.window.dispatchEvent(readyEvent);