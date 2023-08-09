/// <reference path="jquery-1.4.4.min.js" />

function ChatCenter(lang, timeZoneAddedMinuts) {
    var that = this;
    var isTabActive = true;
    var hasOpenChatCenter = true;
    var SHOW_MODE = { chatbox: 'chat-mode', userListMini: 'user-list-mini-mode', userList: 'user-list-mode', hide: 'user-list-hide' };
    var MESSAGE_MODE = { upload: -1, text: 0, picture: 1, file: 2, sound: 3, customer: 4, form: 5, ticket: 6 };
    var MESSAGE_STATUS = { pending: 0, send: 1, viewed: 2, error: 3 };
    var USER_STATUS = { ONLINE: 1, AWAY: 3, BUSY: 2, INVISIBLE: 0 };
    var alwaysShowChatCenter = (localStorage && localStorage.getItem('alwaysShowChatCenter') != null) ? localStorage.getItem('alwaysShowChatCenter').toLocaleLowerCase() == 'true' : true;
    var currentUserStatus = USER_STATUS.INVISIBLE;

    var mainContainer = $('<div>').addClass('ch-container').appendTo($('body'));
    var userChatBoxContainer = $('<div>').addClass('ch-b-container').appendTo(mainContainer);
    var userListContainer = $('<div>').addClass('ch-u-container').appendTo(mainContainer);
    var utility = new Utility();
    var userListManager = new UserListManager();
    var tabId = utility.randomId('tab_');


    //Event
    var onOpenChatBox = function (isOpen, mode, allMode) { }
    that.setOnOpenChatBox = function (listener) { onOpenChatBox = listener }
    var onChangeCurrentUserStatus = function (status) { }
    that.setOnChangeCurrentUserStatus = function (listener) { onChangeCurrentUserStatus = listener }
    var onRequestUploadFile = function (file, userId, uploadCallback, progressCallback) { }
    that.setOnRequestUploadFile = function (listener) { onRequestUploadFile = listener }
    var onRequestSendMessage = function (userId, message, messageMode, extra, callback) { }
    that.setOnRequestSendMessage = function (listener) { onRequestSendMessage = listener }
    var onRequestLoadChat = function (userId, skip, take, callback) { }
    that.setOnRequestLoadChat = function (listener) { onRequestLoadChat = listener }
    var onViewChat = function (userId, chatIds) { }
    that.setOnViewChat = function (listener) { onViewChat = listener }
    var onChangeBadge = function (count) { }
    that.setOnChangeBadge = function (listener) { onChangeBadge = listener }
    var onIsTyping = function (userId) { }
    that.setOnIsTyping = function (listener) { onIsTyping = listener }
    var onShowUserInfo = function (user) { }
    that.setOnShowUserInfo = function (listener) { onShowUserInfo = listener }
    var onClearHistory = function (userId) { }
    that.setOnClearHistory = function (listener) { onClearHistory = listener }

    //Method
    that.addUser = userListManager.addUser;
    that.toggleChatCenter = function (enable) {
        if (enable === undefined) { that.toggleChatCenter(!hasOpenChatCenter); return false; }
        if (enable) {
            setShowChatMode(SHOW_MODE.userList);
        } else {
            setShowChatMode(alwaysShowChatCenter ? SHOW_MODE.userListMini : SHOW_MODE.hide);
        }
        userListManager.hideBoxes();
    }
    that.receiveChat = userListManager.receiveChat;
    that.sendChat = userListManager.sendChat;
    that.setViewChat = userListManager.setViewChat;
    that.setBadgeCount = userListManager.setBadgeCount;
    that.checkAllBadge = userListManager.checkAllBadge;
    that.setUserStatus = userListManager.setUserStatus;
    that.setUserIsOnline = userListManager.setUserIsOnline;
    that.setIsTyping = userListManager.setIsTyping;
    that.clearHistory = userListManager.clearHistory;
    that.getTabId = function () { return tabId };
    that.isWatchingChat = userListManager.isWatching;
    that.showChatBox = userListManager.showChatBox;
    that.isAlwaysShowChat = function () { return alwaysShowChatCenter };
    that.setCurrentUserStatus = function (status) { currentUserStatus = status; };
    that.getCurrentUserStatus = function () { return currentUserStatus; };
    that.hideChatCenter = function () { setShowChatMode(SHOW_MODE.hide); }


    function UserListManager() {
        var self = this;
        var arrUsers = [];

        var searchContainer = $('<div>').addClass('ch-u-search-container').css({ visibility: 'hidden' }).appendTo(userListContainer);
        var searchEmptyMessage = $('<div>').addClass('ch-u-search-not-found').hide().text(utility.r.userNotFound).appendTo(userListContainer);
        var userContainer = $('<div>').addClass('ch-u-user-container').appendTo(userListContainer);
        var userStatusContainer = [];
        $.each(USER_STATUS, function (s, status) {
            userStatusContainer[status] = $('<div>').addClass('ch-u-user-container-' + status).appendTo(userContainer);
        });
        userContainer.perfectScrollbar({
            wheelSpeed: 50,
            wheelPropagation: false,
            minScrollbarLength: 20
        });
        setTimeout(function () { searchContainer.css({ visibility: 'visible' }) }, 500);

        //search user
        var searchInputWrapper = $('<div>').addClass('ch-u-user-search float-right').appendTo(searchContainer);
        var searchIcon = $('<i>').addClass('icon-search float-right').appendTo(searchInputWrapper);
        var searchInput = $('<input>').addClass('float-right').attr({ 'type': 'text', placeholder: utility.r.searchUser }).appendTo(searchInputWrapper);
        var searchClose = $('<a>').attr('href', '#').hide().addClass('icon-close float-right').appendTo(searchInputWrapper);
        searchInput.keyup(function () {
            var key = searchInput.val().trim().toLowerCase();
            var found = false;
            $.each(arrUsers, function (u, user) {
                var enable = user.getTitle().toLowerCase().indexOf(key) != -1 || user.getDetail().toLowerCase().indexOf(key) != -1;
                if (enable) found = true;
                user.toggle(enable);
            });
            searchClose.toggle(key != '');
            searchEmptyMessage.toggle(!found);
        });
        searchClose.click(function () {
            searchInput.val(''); searchInput.keyup();
            return false;
        });
        searchIcon.click(function () { searchInput.focus() });


        //menu user online/offline
        var userListMenuWrapper = $('<a>').attr('href', '#').addClass('ch-u-user-menu float-left').append($('<i>').addClass('icon-ellipsis-vertical')).appendTo(searchContainer);
        var getUserListMenuOption = function () {
            var opt = [
                {
                    title: utility.r.alwaysShowChat, cssIcon: alwaysShowChatCenter ? 'icon-check' : 'empty', callback: function () {
                        alwaysShowChatCenter = !alwaysShowChatCenter;
                        if (localStorage) localStorage.setItem('alwaysShowChatCenter', alwaysShowChatCenter);
                        mnuUserListMenu.setOptions(getUserListMenuOption());
                        onOpenChatBox(hasOpenChatCenter, null, null);
                    }
                },
                { isLine: true }
            ];
            $.each(USER_STATUS, function (s, status) {
                var icon = [['icon-ban', '#646464'], ['icon-check-circle', '#4CAF50'], ['icon-minus-circle', '#F44336'], ['icon-clock', '#ffa500']];
                opt.push({
                    title: s, cssIcon: icon[status][0], iconColor: icon[status][1], callback: function () {
                        onChangeCurrentUserStatus(status);
                    }
                });
            });
            return opt;
        }
        var mnuUserListMenu = new RaveshUI.Menu(userListMenuWrapper, { align: 'auto', appendTo: mainContainer, options: getUserListMenuOption() });


        self.hideBoxes = function () {
            $.each(arrUsers, function (u, user) {
                if (user.getBox()) user.getBox().hide();
            });
        }

        self.getUserById = function (userId) {
            return $.grep(arrUsers, function (s) { return s.getId() == userId });
        };

        self.receiveChat = function (chat) {
            var user = self.getUserById(chat.fromId);
            if (user.length != 0) user = user[0]; else return false;
            if (user.getBox() != null) user.getBox().receiveChat(chat);
            user.addBadge(1);
        }

        self.sendChat = function (chat) {

            var user = self.getUserById(chat.toId);
            if (user.length != 0) user = user[0]; else return false;
            if (user.getBox() != null) user.getBox().sendChat(chat);
        }

        self.setViewChat = function (userId, chatIds) {
            var user = self.getUserById(userId);
            if (user.length != 0) user = user[0]; else return false;
            if (user.getBox() != null) user.getBox().setViewChat(chatIds);
        }

        self.setBadgeCount = function (userId, count) {
            var user = self.getUserById(userId);
            if (user.length != 0) user = user[0]; else return false;
            user.setBadge(count);
            self.checkAllBadge();
        }

        self.checkAllBadge = function () {
            var allBadge = 0;
            $.each(arrUsers, function (u, user) {
                allBadge += user.getBadge();
            });
            onChangeBadge(allBadge);
        }

        self.setUserStatus = function (userId, status) {
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            user.setStatus(status);
            user.setStatusStyle(true);
            if (user.getBox() != null) user.getBox().setStatus();
        }

        self.setUserIsOnline = function (userId, isOnline) {
            
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            user.setIsOnline(isOnline);
            user.setStatusStyle(true);
            if (user.getBox() != null) user.getBox().setStatus();
        }

        self.setIsTyping = function (userId) {
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            user.setIsTyping();
            if (user.getBox() != null) user.getBox().setIsTyping();
        }

        self.clearHistory = function (userId) {
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            if (user.getBox() != null) user.getBox().clearHistory();
        }

        self.isWatching = function (userId) {
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            if (user.getBox() != null) return user.getBox().isWatching();
            return false;
        }

        self.showChatBox = function (userId) {
            var user = self.getUserById(userId);
            if (user.length == 0) return; else user = user[0];
            self.hideBoxes();
            user.showChatBox(true);
        }

        self.addUser = function () {
            
            var user = this;
            arrUsers.push(user);
            var data = { id: '', custCode: 0, userId:'', title: '', detail: '', picture: '', isOnline: false, status: '', badge: 0 };

            var userElem = $('<div>').addClass('ch-u-user');
            var pictureWrapper = $('<div>').addClass('picture float-right').appendTo(userElem);
            var titleElem = $('<div>').addClass('title float-right').appendTo(userElem);
            var detailElem = $('<div>').addClass('detail float-right').appendTo(userElem);
            var isTypingElem = $('<div>').addClass('float-right is-typing').appendTo(userElem);
            var pictureElem = $('<img>').appendTo(pictureWrapper);
            var badgeElem = $('<div>').addClass('badge').appendTo(pictureWrapper);
            var statusElem = $('<div>').addClass('status').appendTo(pictureWrapper);
            var box = null;

            userElem.click(function () {
                user.showChatBox(false);
            });

            user.showChatBox = function (scrollToBottom) {
                if (!box) box = new ChatBox(user);
                box.show(!hasOpenChatCenter, scrollToBottom);
                setShowChatMode(SHOW_MODE.chatbox);
            }

            user.getBox = function () { return box; };

            user.toggle = function (enable) {
                userElem.toggle(enable);
                return user;
            }
            user.getId = function () { return data.id }
            user.setId = function (id) {
                data.id = id;
                return user;
            }
            user.getCustCode = function () { return data.custCode }
            user.setCustCode = function (custCode) {
                data.custCode = custCode;
                return user;
            }
            user.getCustUserId = function () { return data.userId }
            user.setCustUserId = function (user_Id) {
                data.userId = user_Id;
                return user;
            }
            user.getTitle = function () { return data.title }
            user.setTitle = function (title) {
                data.title = title;
                titleElem.text(title);
                return user;
            }
            user.getDetail = function () { return data.detail }
            user.setDetail = function (detail) {
                data.detail = detail;
                detailElem.text(detail);
                return user;
            }
            user.setPicture = function (picture) {
                data.picture = picture;
                pictureElem.attr('src', picture);
                return user;
            }
            user.getBadge = function () { return data.badge; }
            user.setBadge = function (number) {
                data.badge = number;
                badgeElem.toggle(number != 0).text(utility.numberLocalize(number));
                return user;
            }
            user.addBadge = function (number) {
                user.setBadge(data.badge + number);
                self.checkAllBadge();
            }
            user.getStatus = function () {
                if (!data.isOnline) return USER_STATUS.INVISIBLE;
                return data.status
            }
            user.setStatus = function (status) {
                data.status = status;
                return user;
            }
            user.getIsOnline = function () { return data.isOnline }
            user.setIsOnline = function (isOnline) {
                data.isOnline = isOnline;
                return user;
            }
            user.setStatusStyle = function (delay) {
                var status = user.getStatus();

                $.each(USER_STATUS, function (s, status) { statusElem.removeClass('status-' + status); });
                statusElem.addClass('status-' + status).toggle(status != USER_STATUS.INVISIBLE);

                clearTimeout(user.timerStatusStyle);
                if (delay) {
                    user.timerStatusStyle = setTimeout(function () {
                        if (userElem.parentStatusDiv != userStatusContainer[status]) {
                            userElem.parentStatusDiv = userStatusContainer[status];
                            userElem.parentStatusDiv.append(userElem);
                        }
                    }, 5000);
                } else {
                    userElem.parentStatusDiv = userStatusContainer[status];
                    userElem.parentStatusDiv.append(userElem);
                }

                return user;
            }
            user.setIsTyping = function () {
                if (user.isShowTyping) return false;
                user.isShowTyping = true;

                isTypingElem.text(utility.r.isTyping).show();
                detailElem.hide();

                var i = 0;
                var timerTreeDots = setInterval(function () {
                    i++;
                    if (i > 3) i = 0;
                    isTypingElem.text(utility.r.isTyping + (".").repeat(i));
                }, 300);

                setTimeout(function () {
                    user.isShowTyping = false;
                    isTypingElem.hide();
                    detailElem.show();
                    clearInterval(timerTreeDots);
                }, 3500);
            }
        };
    }


    function ChatBox(user) {
        var self = this;
        var closeChatBoxAfterBack = true;
        var arrChatPopups = [];
        var arrViewChatPopupId = [];
        var scrollPosition = 0;

        var wrapper = $('<div>').addClass('ch-box-wrapper').appendTo(userChatBoxContainer);
        var header = $('<div>').addClass('header').appendTo(wrapper);
        var content = $('<div>').addClass('chat-content ch-scrollbar').appendTo(wrapper);
        var coverContent = $('<div>').addClass('cover').appendTo(content);
        var footer = $('<div>').addClass('footer').appendTo(wrapper);




        //header
        var btnBack = $('<a>').attr('href', '#').addClass('icon-angle-left-dir float-left back').appendTo(header);
        var btnChatMenu = $('<a>').attr('href', '#').addClass('icon-ellipsis-vertical float-right menu').appendTo(header);
        var statusElem = $('<div>').addClass('float-right status').appendTo(header);
        var titleElem = $('<a>').attr('href', '#').addClass('float-right title').text(user.getTitle()).appendTo(header);
        var detailElem = $('<div>').addClass('float-right detail').text(user.getDetail()).appendTo(header);
        var isTypingElem = $('<div>').addClass('float-right is-typing').appendTo(header);
        var haveNewMessageElem = $('<a>').attr('href', '#').addClass('have-new-message').text(utility.r.youHaveNewMessage).appendTo(header);
        var loadingElem = $('<div>').hide().addClass('spinner').appendTo(header);

        titleElem.click(function () {
            onShowUserInfo(user);
        });

        new RaveshUI.Menu(btnChatMenu, {
            align: 'auto', appendTo: mainContainer, options: [
                /* {
                     title: utility.r.search, callback: function () {
 
                     }
                 },
                 { isLine: true },*/
                {
                    title: utility.r.userInfo, callback: function () {
                        onShowUserInfo(user);
                    }
                }, {
                    title: utility.r.clearHistory, callback: function () {
                        RaveshUI.deleteConfirmModal(utility.r.yes, utility.r.no, utility.r.clearHistoryMessage, function () {
                            self.clearHistory();
                            onClearHistory(user.getId());
                        });
                    }
                }
            ]
        });

        btnBack.click(function () {
            if (closeChatBoxAfterBack) {
                that.toggleChatCenter(false);
            } else {
                userListManager.hideBoxes();
                setShowChatMode(SHOW_MODE.userList);
            }
            return false;
        });

        haveNewMessageElem.click(function () {
            self.scrollToBottom();
            self.toggleHaveNewMessage(false);
            self.viewAllChat();
            return false;
        });


        //footer
        var btnSend = $('<a>').attr('href', '#').hide().addClass('float-left th-color send').append('<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path d="' + (lang == 'fa' ? "M22,3,1,12l21,9V14L7,12l15-2Z" : "M2,21L23,12L2,3V10L17,12L2,14V21Z") + '" style="fill: currentcolor;"></path></svg>').appendTo(footer);
        var btnPlusMenu = $('<a>').attr('href', '#').addClass('icon-plus-circle float-left plus').appendTo(footer);
        var btnEmojiMenu = $('<a>').attr('href', '#').addClass('icon-smile float-left emoji').appendTo(footer);
        var textarea = $('<textarea>').attr({ 'rows': 1, placeholder: utility.r.writeAMessage }).addClass('float-right ch-scrollbar').appendTo(footer);

        btnSend.click(function () {
            var message = textarea.val().trim();
            if (message == '') return false;
            textarea.val('');
            changeTextAreaHeight();
            mnuEmoji.hide();
            new ChatPopup('self').setDate().setStatus(0).setMessage(message, MESSAGE_MODE.text).addToBox().send();
            self.scrollToBottom();
            self.viewAllChat();
            btnPlusMenu.show();
            btnSend.hide();
            return false;
        });

        textarea.click(function () {
            self.viewAllChatInViewport();
        });
        textarea.keyup(function () {
            var text = textarea.val().trim();
            changeTextAreaHeight();
            utility.changDirection(textarea, text);
            btnPlusMenu.toggle(text == '');
            btnSend.toggle(text != '');
        });
        textarea.keydown(function (ev) {
            if (ev.keyCode == 13 && !ev.shiftKey) {
                btnSend.click();
                return false;
            } if (ev.keyCode == 27) { //esc
                btnBack.click();
                return false;
            }
            self.onIsTyping();
        });

        //upload file
        var fileUploader = new utility.uploader(content, textarea, function (selectedFile) {
            new ChatPopup('self').setDate().setStatus(0).setMessage(selectedFile, MESSAGE_MODE.upload).addToBox();
            self.scrollToBottom();
            self.viewAllChat();
            setTimeout(self.scrollToBottom, 500);
        });

        //plus menu
        new RaveshUI.Menu(btnPlusMenu, {
            align: 'auto', verticalAlign: 'top', appendTo: mainContainer, marginTop: 8, options: [
                {
                    title: utility.r.sendFile, cssIcon: 'icon-attachment', callback: function () {
                        fileUploader.select();
                    }
                },
                {
                    title: utility.r.sendCustomerLink, cssIcon: 'icon-user-circle', callback: function () {
                        RaveshUI.selectCustomerDialog(0, function (cust) {
                            
                            new ChatPopup('self')
                                .setDate()
                                .setStatus(0)
                                //.setMessage(cust.title, MESSAGE_MODE.customer, JSON.stringify({ id: cust.id, title: cust.title, picture: cust.picture, detail: cust.detail }))
                                .setMessage(cust.title, MESSAGE_MODE.customer, JSON.stringify({ id: cust.CustomerId, title: cust.title, picture: cust.picture, detail: cust.detail }))
                                .addToBox()
                                .send();
                            self.scrollToBottom();
                        });
                    }
                },
                //{
                //    title: utility.r.sendFormLink, cssIcon: 'icon-list-alt', callback: function () {
                //        RaveshFormUtility.showDialogSelectFormValue(function (formValue) {
                //            new ChatPopup('self')
                //                .setDate()
                //                .setStatus(0)
                //                .setMessage(formValue.formName, MESSAGE_MODE.form, JSON.stringify({ formName: formValue.formName, formValueId: formValue.formValueId, color: formValue.color }))
                //                .addToBox()
                //                .send();
                //            self.scrollToBottom();
                //        });
                //    }
                //},
                //{
                //    title: utility.r.sendTicketLink, cssIcon: 'icon-shield-alt', callback: function () {
                //        RaveshUI.selectTicketDialog(function (ticket) {
                //            new ChatPopup('self')
                //                .setDate()
                //                .setStatus(0)
                //                .setMessage(ticket.subject, MESSAGE_MODE.ticket, JSON.stringify({ id: ticket.id, title: ticket.subject, picture: ticket.customerPicture, detail: ticket.customerName }))
                //                .addToBox()
                //                .send();
                //            self.scrollToBottom();
                //        });
                //    }
                //}
            ]
        });


        //emoji menu
        var mnuEmoji = new RaveshUI.Menu(btnEmojiMenu, {
            align: 'auto', verticalAlign: 'top', appendTo: mainContainer, marginTop: 8,
            content: utility.getEmojiSelector(textarea), removeAfterHide: false
        });


        //Scroll
        content.scroll(function (ev) {
            var isWatching = self.isWatching();
            if (isWatching) self.toggleHaveNewMessage(false);
            self.viewAllChatInViewport();
            if ((content[0].scrollHeight - content[0].clientHeight) + content[0].scrollTop <= 500) {
                loadChat();
            }
        });
        content.click(function () {
            self.viewAllChatInViewport();
        });

        // setInterval(function () {
        //     console.log(self.isWatching());
        // },1000)

        //Methods
        self.setStatus = function () {
            $.each(USER_STATUS, function (s, status) { statusElem.removeClass('status-' + status); });
            statusElem.addClass('status-' + user.getStatus());
        }
        self.setStatus();

        self.show = function (closeChatBoxAfterBack_, scrollToBottom) {
            closeChatBoxAfterBack = closeChatBoxAfterBack_;
            wrapper.show();
            textarea.focus();
            if (scrollToBottom) { self.scrollToBottom(); self.toggleHaveNewMessage(false); } else self.scrollToLastPosition();
            self.viewAllChatInViewport();
        }
        self.hide = function () {
            if (wrapper.css('display') == 'none') return false;
            scrollPosition = content[0].scrollTop;
            wrapper.hide();
            self.viewAllChatInViewport();
        }
        self.isWatching = function () {
            if (wrapper.css('display') != 'none' && content[0].scrollTop * -1 < 50) return true;
            return false;
        }
        self.scrollToBottom = function () {
            content[0].scrollTop = content[0].scrollHeight;
        }
        self.scrollToLastPosition = function () {
            content[0].scrollTop = scrollPosition;
        }
        self.receiveChat = function (chat) {
            var isWatching = self.isWatching();
            new ChatPopup('other')
                .setId(chat.id)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                //.setDate(chat.createDate)
                .setDate(chat.createDateStr_En)
                .addToBox();
            if (isWatching) self.scrollToBottom();
            if (isWatching && isTabActive) self.viewAllChat();
            self.toggleHaveNewMessage(!isWatching);
        }
        self.sendChat = function (chat) {
            new ChatPopup('self').setId(chat.id)
                .setStatus(chat.viewed ? MESSAGE_STATUS.viewed : MESSAGE_STATUS.send)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                //.setDate(chat.createDate)
                .setDate(chat.createDateStr_En)
                .addToBox();
        }
        self.toggleHaveNewMessage = function (enable) {
            haveNewMessageElem.toggleClass('active', enable);
        }
        self.viewAllChatInViewport = function () {
            $.each(arrChatPopups, function (p, popup) {
                var isInViewport = popup.isInViewport();
                if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == 'other' && isInViewport) {
                    popup.setStatus(MESSAGE_STATUS.viewed);
                    arrViewChatPopupId.push(popup.getId());
                }
            });
            
            if (arrViewChatPopupId.length > 0) {
                clearTimeout(self.timerViewChat);
                self.timerViewChat = setTimeout(function () {
                    onViewChat(user.getId(), arrViewChatPopupId.join(','));
                    arrViewChatPopupId = [];
                }, 500);
            }
        }
        self.viewAllChat = function () {
            var exists = false;
            $.each(arrChatPopups, function (p, popup) {
                if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == 'other') {
                    popup.setStatus(MESSAGE_STATUS.viewed);
                    exists = true;
                }
            });
            if (exists) { onViewChat(user.getId(), 'all'); }
        }
        self.setViewChat = function (chatIds) {
            var arrChatIds = chatIds.split(",")
            $.each(arrChatPopups, function (p, popup) {
                if (popup.from == 'self' && (chatIds == 'all' || (chatIds != 'all' && arrChatIds.indexOf(popup.getId().toString()) != -1))) {
                    popup.setStatus(MESSAGE_STATUS.viewed);
                }
            });
        }
        self.clearHistory = function () {
            arrChatPopups = [];
            coverContent.empty();
            coverContent.append(new ChatLabel(utility.r.clearHistory).getUI());
        }
        self.setIsTyping = function () {
            if (self.isShowTyping) return false;
            self.isShowTyping = true;

            isTypingElem.text(utility.r.isTyping).show();
            detailElem.hide();

            var i = 0;
            var timerTreeDots = setInterval(function () {
                i++;
                if (i > 3) i = 0;
                isTypingElem.text(utility.r.isTyping + (".").repeat(i));
            }, 300);

            setTimeout(function () {
                self.isShowTyping = false;
                isTypingElem.hide();
                detailElem.show();
                clearInterval(timerTreeDots);
            }, 3500);
        }

        self.onIsTyping = function () {
            if (self.isTypingCalled) return false;
            self.isTypingCalled = true;
            onIsTyping(user.getId());
            setTimeout(function () { self.isTypingCalled = false; }, 3500);
        }

        //event
        var onAddPopupToBox = function (popup) {
            var prevPopup = null;
            if (arrChatPopups.length > 0) {
                prevPopup = arrChatPopups[arrChatPopups.length - 1];
            }
            setPopupArrowAndLabel(prevPopup, popup)
            coverContent.append(popup.label, popup.getUI());
            arrChatPopups.push(popup);
        }

        function setPopupArrowAndLabel(prevPopup, popup) {
            if (popup.label && popup.label != '') popup.label.remove();

            if (!prevPopup || (prevPopup.getDateId() != popup.getDateId())) {
                popup.label = new ChatLabel(popup.getDateStr(), popup.getDateStrTitle()).getUI();
            } else {
                popup.label = '';
            }

            if (!prevPopup) {
                popup.toggleArrow(true)
            } else {
                popup.toggleArrow(true)
                var diffMinutes = (popup.getDate() - prevPopup.getDate()) / (1000 * 60);
                if (prevPopup.from == popup.from && diffMinutes < 4) {
                    prevPopup.toggleArrow(false);
                }
            }
        }

        function loadChat() {
            if (self.isLoading) return false;
            var skip = arrChatPopups.length + 1;
            var take = (skip - 1) + 100;
            if (self.totalRow && skip >= self.totalRow) return false;
            self.isLoading = true;
            loadingElem.show();
            onRequestLoadChat(user.getId(), skip, take, function (totalRow, chats) {
                self.isLoading = false;
                loadingElem.hide();
                self.totalRow = parseInt(totalRow);
                var firstUnreadChatPopup = null;

                $.each(chats, function (c, chat) {
                    var popup = new ChatPopup(chat.fromId == user.getId() ? 'other' : 'self')
                        .setId(chat.id)
                        //.setDate(chat.createDate)
                        .setDate(chat.createDateStr_En)
                        .setStatus(chat.viewed ? MESSAGE_STATUS.viewed : MESSAGE_STATUS.send)
                        .setMessage(chat.message, chat.messageMode, chat.extra);

                    if (!chat.viewed && popup.from == 'other') firstUnreadChatPopup = popup;

                    coverContent.prepend(popup.getUI());
                    arrChatPopups.splice(0, 0, popup);
                });

                $.each(arrChatPopups, function (p, popup) {
                    prevPopup = p == 0 ? null : arrChatPopups[p - 1];
                    setPopupArrowAndLabel(prevPopup, popup);
                    if (popup.label != '') popup.getUI().before(popup.label);
                });

                if (skip == 1) {
                    if (firstUnreadChatPopup) {
                        firstUnreadChatPopup.scrollIntoView();
                        self.viewAllChatInViewport();
                    } else {
                        self.scrollToBottom();
                    }
                }
            });
        }
        loadingElem.show();
        setTimeout(function () { loadChat(); }, 500);


        function changeTextAreaHeight() {
            textarea.css({ 'height': 'unset', 'overflow': 'hidden', 'line-height': 'unset' });
            var adjustedHeight = Math.max(textarea[0].clientHeight, textarea[0].scrollHeight);
            if (adjustedHeight > 94) {
                adjustedHeight = 94;
                textarea.css({ 'overflow': 'auto' });
            }
            if (adjustedHeight <= 35) {
                textarea.css({ 'line-height': '35px' });
            }
            textarea.css({ 'height': adjustedHeight });
        }


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

            var popupElem = $('<div>').addClass('chat-popup ' + from);
            var messageElem = $('<div>').addClass('chat-message').appendTo(popupElem);
            var statusElem = $('<i>').addClass('status').appendTo(popupElem);
            var dateElem = $('<div>').addClass('date').appendTo(popupElem);


            //Methods
            popup.addToBox = function () {
                onAddPopupToBox(popup);
                return popup;
            }
            popup.toggleArrow = function (enable) {
                popupElem.toggleClass('arrow', enable);
                return popup;
            };
            popup.getUI = function () { return popupElem; }
            popup.getId = function () { return data.id; }
            popup.setId = function (id) { data.id = id; return popup; }
            popup.setMessage = function (message, messageMode, extra) {
                data.message = message;
                data.messageMode = messageMode;
                data.extra = extra || '';
                convertMessage();
                return popup;
            };
            popup.getDate = function () { return data.dateValue };
            popup.getDateStr = function () { return data.dateStr };
            popup.getDateStrTitle = function () { return data.dateStrTitle };
            popup.getDateId = function () { return data.dateId };
            popup.setDate = function (date) {
                mDate = utility.getMomentDate(date);
                dateElem.text(utility.numberLocalize(mDate.format('LT'))).attr('title', utility.numberLocalize(mDate.format('LLL')));
                data.dateValue = mDate.valueOf();
                data.dateStr = utility.numberLocalize(utility.getMomentDay(mDate))
                data.dateStrTitle = utility.numberLocalize(mDate.format('LL'));
                data.dateId = mDate.format("YYYYMMDD");
                return popup;
            };
            popup.getStatus = function () { return data.status }
            popup.setStatus = function (status) {
                data.status = status;
                var statusClass = ['icon-clock', 'icon-check', 'icon-check-double', 'icon-ban'];
                $.each(statusClass, function (c, cl) { statusElem.removeClass(cl).removeClass('status-' + c) });
                statusElem.addClass(statusClass[status]).addClass('status-' + status);
                return popup;
            };
            popup.remove = function () { popupElem.remove(); }
            popup.send = function () {
                onRequestSendMessage(user.getId(), data.message, data.messageMode, data.extra, function (isSuccess, chat) {
                    popup.setId(chat.id);
                    popup.setStatus(isSuccess ? MESSAGE_STATUS.send : MESSAGE_STATUS.error);
                    //popup.setDate(chat.createDate);
                    popup.setDate(chat.createDateStr_En);
                });
                return popup;
            }
            popup.isInViewport = function () {
                var p = popupElem[0].getBoundingClientRect();
                var c = content[0].getBoundingClientRect();
                var ph = Math.min(p.height, c.height);
                return p.bottom >= c.top + ph &&
                    p.top <= c.bottom - ph;
            };
            popup.scrollIntoView = function () {
                popupElem[0].scrollIntoView(true);
            }

            function convertMessage() {
                try {

                    var file = null;

                    if (data.messageMode == MESSAGE_MODE.text) {
                        messageElem.html(utility.convertTextMessage(data.message));
                        utility.changDirection(messageElem, messageElem.text());
                    }

                    if (data.messageMode == MESSAGE_MODE.upload) {
                        file = data.message;
                        data.messageMode = MESSAGE_MODE.file;
                        if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file['type']) != -1) data.messageMode = MESSAGE_MODE.picture;
                        else if (file['type'].indexOf('audio') != -1) data.messageMode = MESSAGE_MODE.sound;
                    }

                    if (data.messageMode == MESSAGE_MODE.picture) {
                        var imgLink = $('<a>').appendTo(messageElem);
                        var imgPreview = $('<img>').appendTo(imgLink);
                        var extra = data.extra ? JSON.parse(data.extra) : {};

                        var setImageProp = function (url) {
                            var width = 176;
                            if (extra.width < width) width = extra.width;
                            if (extra.width < 100) width = 100;
                            imgPreview.css({ 'background-color': '#' + extra.color, width: width, height: extra.height * (width / extra.width) });
                            imgLink.attr({ 'href': url, target: '_blank' });
                            imgPreview.attr({
                                'src': url, alt: extra.name,
                                'title': extra.name + '\nDimensions: ' + extra.width + ' x ' + extra.height + '\nSize: ' + utility.bytesToSize(extra.size)
                            });
                        }

                        if (file) {
                            var progress = new utility.circleProgress(35, '#ffffff');
                            messageElem.append(progress.getUI());
                            extra = { name: file.name, size: file.size };

                            var reader = new FileReader();
                            reader.onload = function (ev) {
                                imgPreview.attr('src', ev.target.result).show();
                                imgPreview[0].onload = function () {
                                    if (imgPreview.isLoaded) return false;
                                    extra.width = this.naturalWidth;
                                    extra.height = this.naturalHeight;
                                    extra.color = utility.getMainColorImage(this);
                                    data.extra = JSON.stringify(extra);
                                    upload(progress, function (url) {
                                        progress.getUI().delay(1000).fadeOut('slow', function () { $(this).remove(); });
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
                        var downloadIcon = $('<i>').hide().addClass('fas icon-download');
                        var btnDownload = $('<a>').addClass('message-icon').append(downloadIcon).appendTo(messageElem);
                        var extra = data.extra ? JSON.parse(data.extra) : {};


                        if (file) {
                            var progress = new utility.circleProgress(35, '#EFFDDE');
                            messageElem.append(progress.getUI());
                            extra = { name: file.name, size: file.size };
                            data.extra = JSON.stringify(extra);

                            upload(progress, function (url) {
                                progress.getUI().remove();
                                btnDownload.show().attr({ 'href': url, 'target': '_blank' });
                                downloadIcon.fadeIn();
                            });
                            btnDownload.hide();
                        } else {
                            btnDownload.attr({ 'href': data.message, 'target': '_blank' });
                            downloadIcon.fadeIn();
                        }
                        $('<div>').addClass('message-title').text(extra.name).attr('title', extra.name).appendTo(messageElem);
                        $('<div>').addClass('message-detail').text(utility.bytesToSize(extra.size)).appendTo(messageElem);
                    }

                    if (data.messageMode == MESSAGE_MODE.customer) {
                        var extra = JSON.parse(data.extra);
                        var icon = $('<a>').attr({ href: '#' }).addClass('message-icon').appendTo(messageElem);
                        if (extra.picture == '') {
                            icon.append($('<i>').addClass('fas icon-user'));
                        } else {
                            icon.append($('<img>').attr({ src: extra.picture })).addClass('picture');
                        }
                        icon.click(function () { customer_Show_Info(extra.id, extra.title); return false; });
                        $('<a>').attr({ href: '#', 'title': extra.title })
                            .click(function () { icon.click(); return false; })
                            .addClass('message-title').text(extra.title).appendTo(messageElem);
                        $('<div>').addClass('message-detail').text(extra.detail == '' ? utility.r.id + ': ' + extra.id : extra.detail).appendTo(messageElem);
                    }

                    if (data.messageMode == MESSAGE_MODE.ticket) {
                        var extra = JSON.parse(data.extra);
                        var icon = $('<a>').attr({ href: '#' }).addClass('message-icon').appendTo(messageElem);
                        if (extra.picture == '') {
                            icon.append($('<i>').addClass('fas icon-shield-alt'));
                        } else {
                            icon.append($('<img>').attr({ src: extra.picture })).addClass('picture');
                        }
                        icon.click(function () { show_ticket(extra.id, extra.title); return false; });
                        $('<a>').attr({ href: '#', 'title': extra.title })
                            .click(function () { icon.click(); return false; })
                            .addClass('message-title').text(extra.title).appendTo(messageElem);
                        $('<div>').addClass('message-detail').html(utility.r.ticketId + ' ' + utility.numberLocalize(extra.id) + '<br>' + extra.detail).appendTo(messageElem);
                    }

                    if (data.messageMode == MESSAGE_MODE.form) {
                        var extra = JSON.parse(data.extra);
                        var icon = $('<a>').attr({ href: '#' }).css({ 'background-color': '#' + extra.color }).addClass('message-icon').append($('<i>').css({ 'color': '#fff' }).addClass('fas icon-list-alt')).appendTo(messageElem);
                        icon.click(function () { showFormInfo(extra.formValueId, extra.formName); return false; return false; });
                        $('<a>').attr({ href: '#', 'title': extra.formName })
                            .click(function () { icon.click(); return false; })
                            .addClass('message-title').text(extra.formName).appendTo(messageElem);
                        $('<div>').addClass('message-detail').text(utility.r.id + ': ' + extra.formValueId).appendTo(messageElem);
                    }

                    function upload(progress, callback) {
                        onRequestUploadFile(file, user.getId(), function (url) {
                            
                            progress.setProgress(100);
                            data.message = url[1];
                            popup.send();
                            if (callback) callback(url[0]);
                        }, function (percent) {
                            progress.setProgress(percent);
                        });
                    }

                    messageElem.addClass('message-type-' + data.messageMode);

                } catch (e) {
                    console.log(e);
                }
            }
        }

        function ChatLabel(text, title) {
            var label = this;
            var labelElem = $('<div>').addClass('chat-label');
            var labelText = $('<div>').addClass('text').text(text).appendTo(labelElem);
            if (title) labelText.attr('title', title);

            label.getUI = function () {
                return labelElem;
            }
        }

    }


    function Utility() {
        var self = this;
        var resources = {
            en: {
                searchUser: 'Search …',
                userNotFound: 'No result found!',
                alwaysShowChat: 'Always show users',
                writeAMessage: 'Write a message …',
                search: 'Search',
                userInfo: 'User information',
                clearHistory: 'Clear history',
                sendFile: 'Send file',
                sendCustomerLink: 'Customer link',
                sendFormLink: 'Form link',
                sendTicketLink: 'Ticket link',
                dragHere: 'Drag file here',
                youHaveNewMessage: 'You have new message',
                today: 'Today',
                yesterday: 'Yesterday',
                isTyping: 'Is typing ',
                clearHistoryMessage: 'Are you sure want to delete all message history?',
                yes: 'Yes',
                no: 'No',
                id: 'id',
                ticketId: 'Ticket id'
            },
            fa: {
                searchUser: 'جستجو …',
                userNotFound: 'کاربری یافت نشد!',
                alwaysShowChat: 'نمایش ثابت کاربران',
                writeAMessage: 'پیغام خود را وارد کنید …',
                search: 'جستجو',
                userInfo: 'اطلاعات کاربر',
                clearHistory: 'پاکسازی تاریخچه',
                sendFile: 'ارسال فایل',
                sendCustomerLink: 'لینک مشتری',
                sendFormLink: 'لینک مشاهده&zwnj;ی فرم',
                sendTicketLink: 'لینک مشاهده&zwnj;ی تیکت',
                dragHere: 'فایل‌ خود را اینجا رها کنید',
                youHaveNewMessage: 'پیغام جدیدی دارید',
                today: 'امروز',
                yesterday: 'دیروز',
                isTyping: 'در حال تایپ ',
                clearHistoryMessage: 'آیا مطمئن هستید که می&zwnj;خواهید تمام تاریخچه پیام&zwnj;ها را حذف کنید؟',
                yes: 'بله',
                no: 'خیر',
                id: 'شناسه',
                ticketId: 'تیکت شماره&zwnj;ی'
            }
        }
        self.r = resources[lang];
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
            if (emojiCount > 0 && emojiCount <= 3) message = '<div style="text-align:center;font-size:' + (emojiCount == 1 ? 52 : 36) + 'px">' + message + '</div>';
            return message;
        }
        self.getMomentDate = function (date) {
            if (lang == 'fa') {
                moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });
            } else {
                moment.locale('en');
            }
            if (date) {
                return moment(date, 'MM/DD/YYYY HH:mm:ss').add(timeZoneAddedMinuts, 'm');
            } else {
                return moment();
            }
        }
        self.getMomentDay = function (mDate) {
            if (!mDate) mDate = moment();
            if (moment(new Date()).isSame(mDate, 'day')) {
                return self.r.today;
            } else if (moment(new Date()).subtract(1, 'days').isSame(mDate, 'day')) {
                return self.r.yesterday;
            }
            return mDate.format('LL');
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
            replacedText = replacedText.replace(replacePattern4, '<a href="#" onclick="click_sms=true; qucikSendSms(\'0\',\'$1\');return false;">$1</a>');

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
        self.getEmojiSelector = function (textarea) {
            var data = [
                { "icon": "icon-smile", "items": ["\uD83D\uDE04", "\uD83D\uDE03", "\uD83D\uDE00", "\uD83D\uDE0A", "\uD83D\uDE09", "\uD83D\uDE0D", "\uD83D\uDE18", "\uD83D\uDE1A", "\uD83D\uDE17", "\uD83D\uDE19", "\uD83D\uDE1C", "\uD83D\uDE1D", "\uD83D\uDE1B", "\uD83D\uDE33", "\uD83D\uDE01", "\uD83D\uDE14", "\uD83D\uDE0C", "\uD83D\uDE12", "\uD83D\uDE1E", "\uD83D\uDE23", "\uD83D\uDE22", "\uD83D\uDE02", "\uD83D\uDE2D", "\uD83D\uDE2A", "\uD83D\uDE25", "\uD83D\uDE30", "\uD83D\uDE05", "\uD83D\uDE13", "\uD83D\uDE29", "\uD83D\uDE2B", "\uD83D\uDE28", "\uD83D\uDE31", "\uD83D\uDE20", "\uD83D\uDE21", "\uD83D\uDE24", "\uD83D\uDE16", "\uD83D\uDE06", "\uD83D\uDE0B", "\uD83D\uDE37", "\uD83D\uDE0E", "\uD83D\uDE34", "\uD83D\uDE35", "\uD83D\uDE32", "\uD83D\uDE1F", "\uD83D\uDE26", "\uD83D\uDE27", "\uD83D\uDE08", "\uD83D\uDC7F", "\uD83D\uDE2E", "\uD83D\uDE2C", "\uD83D\uDE10", "\uD83D\uDE15", "\uD83D\uDE2F", "\uD83D\uDE36", "\uD83D\uDE07", "\uD83D\uDE0F", "\uD83D\uDE11", "\uD83D\uDC72", "\uD83D\uDC73", "\uD83D\uDC6E", "\uD83D\uDC77", "\uD83D\uDC82", "\uD83D\uDC76", "\uD83D\uDC66", "\uD83D\uDC67", "\uD83D\uDC68", "\uD83D\uDC69", "\uD83D\uDC74", "\uD83D\uDC75", "\uD83D\uDC71", "\uD83D\uDC7C", "\uD83D\uDC78", "\uD83D\uDE3A", "\uD83D\uDE38", "\uD83D\uDE3B", "\uD83D\uDE3D", "\uD83D\uDE3C", "\uD83D\uDE40", "\uD83D\uDE3F", "\uD83D\uDE39", "\uD83D\uDE3E", "\uD83D\uDC79", "\uD83D\uDC7A", "\uD83D\uDE48", "\uD83D\uDE49", "\uD83D\uDE4A", "\uD83D\uDC80", "\uD83D\uDC7D", "\uD83D\uDCA9", "\uD83D\uDD25", "\u2728", "\uD83C\uDF1F", "\uD83D\uDCAB", "\uD83D\uDCA5", "\uD83D\uDCA2", "\uD83D\uDCA6", "\uD83D\uDCA7", "\uD83D\uDCA4", "\uD83D\uDCA8", "\uD83D\uDC42", "\uD83D\uDC40", "\uD83D\uDC43", "\uD83D\uDC45", "\uD83D\uDC44", "\uD83D\uDC4D", "\uD83D\uDC4E", "\uD83D\uDC4C", "\uD83D\uDC4A", "\u270A", "\u270C", "\uD83D\uDC4B", "\u270B", "\uD83D\uDC50", "\uD83D\uDC46", "\uD83D\uDC47", "\uD83D\uDC49", "\uD83D\uDC48", "\uD83D\uDE4C", "\uD83D\uDE4F", "\u261D", "\uD83D\uDC4F", "\uD83D\uDCAA", "\uD83D\uDEB6", "\uD83C\uDFC3", "\uD83D\uDC83", "\uD83D\uDC6B", "\uD83D\uDC6A", "\uD83D\uDC6C", "\uD83D\uDC6D", "\uD83D\uDC8F", "\uD83D\uDC91", "\uD83D\uDC6F", "\uD83D\uDE46", "\uD83D\uDE45", "\uD83D\uDC81", "\uD83D\uDE4B", "\uD83D\uDC86", "\uD83D\uDC87", "\uD83D\uDC85", "\uD83D\uDC70", "\uD83D\uDE4E", "\uD83D\uDE4D", "\uD83D\uDE47", "\uD83C\uDFA9", "\uD83D\uDC51", "\uD83D\uDC52", "\uD83D\uDC5F", "\uD83D\uDC5E", "\uD83D\uDC61", "\uD83D\uDC60", "\uD83D\uDC62", "\uD83D\uDC55", "\uD83D\uDC54", "\uD83D\uDC5A", "\uD83D\uDC57", "\uD83C\uDFBD", "\uD83D\uDC56", "\uD83D\uDC58", "\uD83D\uDC59", "\uD83D\uDCBC", "\uD83D\uDC5C", "\uD83D\uDC5D", "\uD83D\uDC5B", "\uD83D\uDC53", "\uD83C\uDF80", "\uD83C\uDF02", "\uD83D\uDC84", "\uD83D\uDC9B", "\uD83D\uDC99", "\uD83D\uDC9C", "\uD83D\uDC9A", "\u2764", "\uD83D\uDC94", "\uD83D\uDC97", "\uD83D\uDC93", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC9E", "\uD83D\uDC98", "\uD83D\uDC8C", "\uD83D\uDC8B", "\uD83D\uDC8D", "\uD83D\uDC8E", "\uD83D\uDC64", "\uD83D\uDC65", "\uD83D\uDCAC", "\uD83D\uDC63", "\uD83D\uDCAD"] },
                { "icon": "icon-crow", "items": ["\uD83D\uDC36", "\uD83D\uDC3A", "\uD83D\uDC31", "\uD83D\uDC2D", "\uD83D\uDC39", "\uD83D\uDC30", "\uD83D\uDC38", "\uD83D\uDC2F", "\uD83D\uDC28", "\uD83D\uDC3B", "\uD83D\uDC37", "\uD83D\uDC3D", "\uD83D\uDC2E", "\uD83D\uDC17", "\uD83D\uDC35", "\uD83D\uDC12", "\uD83D\uDC34", "\uD83D\uDC11", "\uD83D\uDC18", "\uD83D\uDC3C", "\uD83D\uDC27", "\uD83D\uDC26", "\uD83D\uDC24", "\uD83D\uDC25", "\uD83D\uDC23", "\uD83D\uDC14", "\uD83D\uDC0D", "\uD83D\uDC22", "\uD83D\uDC1B", "\uD83D\uDC1D", "\uD83D\uDC1C", "\uD83D\uDC1E", "\uD83D\uDC0C", "\uD83D\uDC19", "\uD83D\uDC1A", "\uD83D\uDC20", "\uD83D\uDC1F", "\uD83D\uDC2C", "\uD83D\uDC33", "\uD83D\uDC0B", "\uD83D\uDC04", "\uD83D\uDC0F", "\uD83D\uDC00", "\uD83D\uDC03", "\uD83D\uDC05", "\uD83D\uDC07", "\uD83D\uDC09", "\uD83D\uDC0E", "\uD83D\uDC10", "\uD83D\uDC13", "\uD83D\uDC15", "\uD83D\uDC16", "\uD83D\uDC01", "\uD83D\uDC02", "\uD83D\uDC32", "\uD83D\uDC21", "\uD83D\uDC0A", "\uD83D\uDC2B", "\uD83D\uDC2A", "\uD83D\uDC06", "\uD83D\uDC08", "\uD83D\uDC29", "\uD83D\uDC3E", "\uD83D\uDC90", "\uD83C\uDF38", "\uD83C\uDF37", "\uD83C\uDF40", "\uD83C\uDF39", "\uD83C\uDF3B", "\uD83C\uDF3A", "\uD83C\uDF41", "\uD83C\uDF43", "\uD83C\uDF42", "\uD83C\uDF3F", "\uD83C\uDF3E", "\uD83C\uDF44", "\uD83C\uDF35", "\uD83C\uDF34", "\uD83C\uDF32", "\uD83C\uDF33", "\uD83C\uDF30", "\uD83C\uDF31", "\uD83C\uDF3C", "\uD83C\uDF10", "\uD83C\uDF1E", "\uD83C\uDF1D", "\uD83C\uDF1A", "\uD83C\uDF11", "\uD83C\uDF12", "\uD83C\uDF13", "\uD83C\uDF14", "\uD83C\uDF15", "\uD83C\uDF16", "\uD83C\uDF17", "\uD83C\uDF18", "\uD83C\uDF1C", "\uD83C\uDF1B", "\uD83C\uDF19", "\uD83C\uDF0D", "\uD83C\uDF0E", "\uD83C\uDF0F", "\uD83C\uDF0B", "\uD83C\uDF0C", "\uD83C\uDF20", "\u2B50", "\u2600", "\u26C5", "\u2601", "\u26A1", "\u2614", "\u2744", "\u26C4", "\uD83C\uDF00", "\uD83C\uDF01", "\uD83C\uDF08", "\uD83C\uDF0A"] },
                { "icon": "icon-bell", "items": ["\uD83C\uDF8D", "\uD83D\uDC9D", "\uD83C\uDF8E", "\uD83C\uDF92", "\uD83C\uDF93", "\uD83C\uDF8F", "\uD83C\uDF86", "\uD83C\uDF87", "\uD83C\uDF90", "\uD83C\uDF91", "\uD83C\uDF83", "\uD83D\uDC7B", "\uD83C\uDF85", "\uD83C\uDF84", "\uD83C\uDF81", "\uD83C\uDF8B", "\uD83C\uDF89", "\uD83C\uDF8A", "\uD83C\uDF88", "\uD83C\uDF8C", "\uD83D\uDD2E", "\uD83C\uDFA5", "\uD83D\uDCF7", "\uD83D\uDCF9", "\uD83D\uDCFC", "\uD83D\uDCBF", "\uD83D\uDCC0", "\uD83D\uDCBD", "\uD83D\uDCBE", "\uD83D\uDCBB", "\uD83D\uDCF1", "\u260E", "\uD83D\uDCDE", "\uD83D\uDCDF", "\uD83D\uDCE0", "\uD83D\uDCE1", "\uD83D\uDCFA", "\uD83D\uDCFB", "\uD83D\uDD0A", "\uD83D\uDD09", "\uD83D\uDD08", "\uD83D\uDD07", "\uD83D\uDD14", "\uD83D\uDD15", "\uD83D\uDCE3", "\uD83D\uDCE2", "\u23F3", "\u231B", "\u23F0", "\u231A", "\uD83D\uDD13", "\uD83D\uDD12", "\uD83D\uDD0F", "\uD83D\uDD10", "\uD83D\uDD11", "\uD83D\uDD0E", "\uD83D\uDCA1", "\uD83D\uDD26", "\uD83D\uDD06", "\uD83D\uDD05", "\uD83D\uDD0C", "\uD83D\uDD0B", "\uD83D\uDD0D", "\uD83D\uDEC0", "\uD83D\uDEC1", "\uD83D\uDEBF", "\uD83D\uDEBD", "\uD83D\uDD27", "\uD83D\uDD29", "\uD83D\uDD28", "\uD83D\uDEAA", "\uD83D\uDEAC", "\uD83D\uDCA3", "\uD83D\uDD2B", "\uD83D\uDD2A", "\uD83D\uDC8A", "\uD83D\uDC89", "\uD83D\uDCB0", "\uD83D\uDCB4", "\uD83D\uDCB5", "\uD83D\uDCB7", "\uD83D\uDCB6", "\uD83D\uDCB3", "\uD83D\uDCB8", "\uD83D\uDCF2", "\uD83D\uDCE7", "\uD83D\uDCE5", "\uD83D\uDCE4", "\u2709", "\uD83D\uDCE9", "\uD83D\uDCE8", "\uD83D\uDCEF", "\uD83D\uDCEB", "\uD83D\uDCEA", "\uD83D\uDCEC", "\uD83D\uDCED", "\uD83D\uDCEE", "\uD83D\uDCE6", "\uD83D\uDCDD", "\uD83D\uDCC4", "\uD83D\uDCC3", "\uD83D\uDCD1", "\uD83D\uDCCA", "\uD83D\uDCC8", "\uD83D\uDCC9", "\uD83D\uDCDC", "\uD83D\uDCCB", "\uD83D\uDCC5", "\uD83D\uDCC6", "\uD83D\uDCC7", "\uD83D\uDCC1", "\uD83D\uDCC2", "\u2702", "\uD83D\uDCCC", "\uD83D\uDCCE", "\u2712", "\u270F", "\uD83D\uDCCF", "\uD83D\uDCD0", "\uD83D\uDCD5", "\uD83D\uDCD7", "\uD83D\uDCD8", "\uD83D\uDCD9", "\uD83D\uDCD3", "\uD83D\uDCD4", "\uD83D\uDCD2", "\uD83D\uDCDA", "\uD83D\uDCD6", "\uD83D\uDD16", "\uD83D\uDCDB", "\uD83D\uDD2C", "\uD83D\uDD2D", "\uD83D\uDCF0", "\uD83C\uDFA8", "\uD83C\uDFAC", "\uD83C\uDFA4", "\uD83C\uDFA7", "\uD83C\uDFBC", "\uD83C\uDFB5", "\uD83C\uDFB6", "\uD83C\uDFB9", "\uD83C\uDFBB", "\uD83C\uDFBA", "\uD83C\uDFB7", "\uD83C\uDFB8", "\uD83D\uDC7E", "\uD83C\uDFAE", "\uD83C\uDCCF", "\uD83C\uDFB4", "\uD83C\uDC04", "\uD83C\uDFB2", "\uD83C\uDFAF", "\uD83C\uDFC8", "\uD83C\uDFC0", "\u26BD", "\u26BE", "\uD83C\uDFBE", "\uD83C\uDFB1", "\uD83C\uDFC9", "\uD83C\uDFB3", "\u26F3", "\uD83D\uDEB5", "\uD83D\uDEB4", "\uD83C\uDFC1", "\uD83C\uDFC7", "\uD83C\uDFC6", "\uD83C\uDFBF", "\uD83C\uDFC2", "\uD83C\uDFCA", "\uD83C\uDFC4", "\uD83C\uDFA3", "\u2615", "\uD83C\uDF75", "\uD83C\uDF76", "\uD83C\uDF7C", "\uD83C\uDF7A", "\uD83C\uDF7B", "\uD83C\uDF78", "\uD83C\uDF79", "\uD83C\uDF77", "\uD83C\uDF74", "\uD83C\uDF55", "\uD83C\uDF54", "\uD83C\uDF5F", "\uD83C\uDF57", "\uD83C\uDF56", "\uD83C\uDF5D", "\uD83C\uDF5B", "\uD83C\uDF64", "\uD83C\uDF71", "\uD83C\uDF63", "\uD83C\uDF65", "\uD83C\uDF59", "\uD83C\uDF58", "\uD83C\uDF5A", "\uD83C\uDF5C", "\uD83C\uDF72", "\uD83C\uDF62", "\uD83C\uDF61", "\uD83C\uDF73", "\uD83C\uDF5E", "\uD83C\uDF69", "\uD83C\uDF6E", "\uD83C\uDF66", "\uD83C\uDF68", "\uD83C\uDF67", "\uD83C\uDF82", "\uD83C\uDF70", "\uD83C\uDF6A", "\uD83C\uDF6B", "\uD83C\uDF6C", "\uD83C\uDF6D", "\uD83C\uDF6F", "\uD83C\uDF4E", "\uD83C\uDF4F", "\uD83C\uDF4A", "\uD83C\uDF4B", "\uD83C\uDF52", "\uD83C\uDF47", "\uD83C\uDF49", "\uD83C\uDF53", "\uD83C\uDF51", "\uD83C\uDF48", "\uD83C\uDF4C", "\uD83C\uDF50", "\uD83C\uDF4D", "\uD83C\uDF60", "\uD83C\uDF46", "\uD83C\uDF45", "\uD83C\uDF3D"] },
                { "icon": "icon-car-side", "items": ["\uD83C\uDFE0", "\uD83C\uDFE1", "\uD83C\uDFEB", "\uD83C\uDFE2", "\uD83C\uDFE3", "\uD83C\uDFE5", "\uD83C\uDFE6", "\uD83C\uDFEA", "\uD83C\uDFE9", "\uD83C\uDFE8", "\uD83D\uDC92", "\u26EA", "\uD83C\uDFEC", "\uD83C\uDFE4", "\uD83C\uDF07", "\uD83C\uDF06", "\uD83C\uDFEF", "\uD83C\uDFF0", "\u26FA", "\uD83C\uDFED", "\uD83D\uDDFC", "\uD83D\uDDFE", "\uD83D\uDDFB", "\uD83C\uDF04", "\uD83C\uDF05", "\uD83C\uDF03", "\uD83D\uDDFD", "\uD83C\uDF09", "\uD83C\uDFA0", "\uD83C\uDFA1", "\u26F2", "\uD83C\uDFA2", "\uD83D\uDEA2", "\u26F5", "\uD83D\uDEA4", "\uD83D\uDEA3", "\u2693", "\uD83D\uDE80", "\u2708", "\uD83D\uDCBA", "\uD83D\uDE81", "\uD83D\uDE82", "\uD83D\uDE8A", "\uD83D\uDE89", "\uD83D\uDE9E", "\uD83D\uDE86", "\uD83D\uDE84", "\uD83D\uDE85", "\uD83D\uDE88", "\uD83D\uDE87", "\uD83D\uDE9D", "\uD83D\uDE83", "\uD83D\uDE8B", "\uD83D\uDE8E", "\uD83D\uDE8C", "\uD83D\uDE8D", "\uD83D\uDE99", "\uD83D\uDE98", "\uD83D\uDE97", "\uD83D\uDE95", "\uD83D\uDE96", "\uD83D\uDE9B", "\uD83D\uDE9A", "\uD83D\uDEA8", "\uD83D\uDE93", "\uD83D\uDE94", "\uD83D\uDE92", "\uD83D\uDE91", "\uD83D\uDE90", "\uD83D\uDEB2", "\uD83D\uDEA1", "\uD83D\uDE9F", "\uD83D\uDEA0", "\uD83D\uDE9C", "\uD83D\uDC88", "\uD83D\uDE8F", "\uD83C\uDFAB", "\uD83D\uDEA6", "\uD83D\uDEA5", "\u26A0", "\uD83D\uDEA7", "\uD83D\uDD30", "\u26FD", "\uD83C\uDFEE", "\uD83C\uDFB0", "\u2668", "\uD83D\uDDFF", "\uD83C\uDFAA", "\uD83C\uDFAD", "\uD83D\uDCCD", "\uD83D\uDEA9", "\uD83C\uDDEF\uD83C\uDDF5", "\uD83C\uDDF0\uD83C\uDDF7", "\uD83C\uDDE9\uD83C\uDDEA", "\uD83C\uDDE8\uD83C\uDDF3", "\uD83C\uDDFA\uD83C\uDDF8", "\uD83C\uDDEB\uD83C\uDDF7", "\uD83C\uDDEA\uD83C\uDDF8", "\uD83C\uDDEE\uD83C\uDDF9", "\uD83C\uDDF7\uD83C\uDDFA", "\uD83C\uDDEC\uD83C\uDDE7"] },
                { "icon": "icon-clock", "items": ["1\uFE0F\u20E3", "2\uFE0F\u20E3", "3\uFE0F\u20E3", "4\uFE0F\u20E3", "5\uFE0F\u20E3", "6\uFE0F\u20E3", "7\uFE0F\u20E3", "8\uFE0F\u20E3", "9\uFE0F\u20E3", "0\uFE0F\u20E3", "\uD83D\uDD1F", "\uD83D\uDD22", "\uD83D\uDD23", "\u2B06", "\u2B07", "\u2B05", "\u27A1", "\uD83D\uDD20", "\uD83D\uDD21", "\uD83D\uDD24", "\u2197", "\u2196", "\u2198", "\u2199", "\u2194", "\u2195", "\uD83D\uDD04", "\u25C0", "\u25B6", "\uD83D\uDD3C", "\uD83D\uDD3D", "\u21A9", "\u21AA", "\u2139", "\u23EA", "\u23E9", "\u23EB", "\u23EC", "\u2935", "\u2934", "\uD83C\uDD97", "\uD83D\uDD00", "\uD83D\uDD01", "\uD83D\uDD02", "\uD83C\uDD95", "\uD83C\uDD99", "\uD83C\uDD92", "\uD83C\uDD93", "\uD83C\uDD96", "\uD83D\uDCF6", "\uD83C\uDFA6", "\uD83C\uDE01", "\uD83C\uDE2F", "\uD83C\uDE33", "\uD83C\uDE35", "\uD83C\uDE34", "\uD83C\uDE32", "\uD83C\uDE50", "\uD83C\uDE39", "\uD83C\uDE3A", "\uD83C\uDE36", "\uD83C\uDE1A", "\uD83D\uDEBB", "\uD83D\uDEB9", "\uD83D\uDEBA", "\uD83D\uDEBC", "\uD83D\uDEBE", "\uD83D\uDEB0", "\uD83D\uDEAE", "\uD83C\uDD7F", "\u267F", "\uD83D\uDEAD", "\uD83C\uDE37", "\uD83C\uDE38", "\uD83C\uDE02", "\u24C2", "\uD83D\uDEC2", "\uD83D\uDEC4", "\uD83D\uDEC5", "\uD83D\uDEC3", "\uD83C\uDE51", "\u3299", "\u3297", "\uD83C\uDD91", "\uD83C\uDD98", "\uD83C\uDD94", "\uD83D\uDEAB", "\uD83D\uDD1E", "\uD83D\uDCF5", "\uD83D\uDEAF", "\uD83D\uDEB1", "\uD83D\uDEB3", "\uD83D\uDEB7", "\uD83D\uDEB8", "\u26D4", "\u2733", "\u2747", "\u274E", "\u2705", "\u2734", "\uD83D\uDC9F", "\uD83C\uDD9A", "\uD83D\uDCF3", "\uD83D\uDCF4", "\uD83C\uDD70", "\uD83C\uDD71", "\uD83C\uDD8E", "\uD83C\uDD7E", "\uD83D\uDCA0", "\u27BF", "\u267B", "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D", "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653", "\u26CE", "\uD83D\uDD2F", "\uD83C\uDFE7", "\uD83D\uDCB9", "\uD83D\uDCB2", "\uD83D\uDCB1", "©", "®", "\u2122", "\u274C", "\u203C", "\u2049", "\u2757", "\u2753", "\u2755", "\u2754", "\u2B55", "\uD83D\uDD1D", "\uD83D\uDD1A", "\uD83D\uDD19", "\uD83D\uDD1B", "\uD83D\uDD1C", "\uD83D\uDD03", "\uD83D\uDD5B", "\uD83D\uDD67", "\uD83D\uDD50", "\uD83D\uDD5C", "\uD83D\uDD51", "\uD83D\uDD5D", "\uD83D\uDD52", "\uD83D\uDD5E", "\uD83D\uDD53", "\uD83D\uDD5F", "\uD83D\uDD54", "\uD83D\uDD60", "\uD83D\uDD55", "\uD83D\uDD56", "\uD83D\uDD57", "\uD83D\uDD58", "\uD83D\uDD59", "\uD83D\uDD5A", "\uD83D\uDD61", "\uD83D\uDD62", "\uD83D\uDD63", "\uD83D\uDD64", "\uD83D\uDD65", "\uD83D\uDD66", "\u2716", "\u2795", "\u2796", "\u2797", "\u2660", "\u2665", "\u2663", "\u2666", "\uD83D\uDCAE", "\uD83D\uDCAF", "\u2714", "\u2611", "\uD83D\uDD18", "\uD83D\uDD17", "\u27B0", "\u3030", "\u303D", "\uD83D\uDD31", "\u25FC", "\u25FB", "\u25FE", "\u25FD", "\u25AA", "\u25AB", "\uD83D\uDD3A", "\uD83D\uDD32", "\uD83D\uDD33", "\u26AB", "\u26AA", "\uD83D\uDD34", "\uD83D\uDD35", "\uD83D\uDD3B", "\u2B1C", "\u2B1B", "\uD83D\uDD36", "\uD83D\uDD37", "\uD83D\uDD38", "\uD83D\uDD39"] }
            ];
            var container = $('<div>').addClass('ch-emoji-picker');
            var tabs = $('<div>').addClass('tabs').appendTo(container);
            $.each(data, function (g, group) {
                group.tab = $('<a>').attr('href', '#')
                    .addClass(group.icon + (g == 0 ? ' active' : ''))
                    .click(function () {
                        $.each(data, function (g, group_) { group_.tab.removeClass('active'); group_.content.hide(); });
                        group.tab.addClass('active');
                        group.content.show();
                        return false;
                    }).appendTo(tabs);
                group.content = $('<div>').addClass('emoji-content ch-scrollbar').toggle(g == 0).appendTo(container);
                $.each(group.items, function (e, emoji) {
                    group.content.append(
                        $('<a>').attr('href', '#')
                            .text(emoji)
                            .click(function () {
                                self.insertAtCursor(textarea[0], emoji);
                                textarea.focus();
                                return false;
                            })
                    );
                })
            });
            tabs.appendTo(container);
            return container;
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
            if (text.trim() == '') {
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

            var uploadFile = $('<input>').attr({ 'type': 'file' }).hide();
            var helper = $('<div>').addClass('ch-upload-helper').append($('<div>').append($('<div>').append($('<i>').addClass('icon-upload'), $('<div>').text(self.r.dragHere))));
            container.append(uploadFile, helper);

            uploader.select = function () {
                uploadFile.click();
            }

            uploadFile.change(function () {
                selectedFile = uploadFile[0].files[0];
                callback(selectedFile);
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

                var files = ev.originalEvent.dataTransfer.files;
                selectedFile = files[0];
                callback(selectedFile);
            });

            container.bind('dragleave dragend', function (ev) {
                if (enterTarget == ev.target) {
                    container.removeClass('active');
                }
            });

            pasteContainer.bind('paste', function (ev) {
                var items = (ev.clipboardData || ev.originalEvent.clipboardData).items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.type.indexOf("image") != -1) {
                        selectedFile = item.getAsFile();
                        callback(selectedFile);
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

            var container = $('<div>').addClass('ch-loading');
            var loading = $('<div>').css({ width: width, height: width, animation: 'ch-rotation 2s infinite linear' }).appendTo(container);
            var svg = $('<svg width="' + width + '" height="' + width + '" viewPort="0 0 ' + width + ' ' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">').appendTo(loading);
            var bar = makeSVG('circle', { r: barRadius, cx: barPosition, cy: barPosition, fill: "transparent", 'stroke-dasharray': dashArray, 'stroke-width': barWidth, stroke: color, 'stroke-dashoffset': "0", style: "transition: stroke-dashoffset 0.3s linear;" });
            bar = $(bar).appendTo(svg);

            progress.setProgress(0);

            function makeSVG(tag, attrs) {
                var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                for (var k in attrs) el.setAttribute(k, attrs[k]);
                return el;
            }
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
    }


    function setShowChatMode(mode) {
        $.each(SHOW_MODE, function (c, cl) { mainContainer.removeClass(cl) });
        hasOpenChatCenter = mode != SHOW_MODE.hide && mode != SHOW_MODE.userListMini;
        mainContainer.addClass(mode);
        onOpenChatBox(hasOpenChatCenter, mode, SHOW_MODE);
    }

    $(window).focus(function () { isTabActive = true; });
    $(window).blur(function () { isTabActive = false; });

    // setInterval(function () { console.log(isTabActive) }, 1000);
}

/*--------------------------------------------------------------------------------*/


var chatCenter = new ChatCenter($("#HFlang").val(), $("#HFTimeZone").val());

$.each(chatUsers, function (u, user) {
    if (user.id == $('#HFUser_id').val()) {
        chatCenter.setCurrentUserStatus(user.status);
        changeCurrentUserStatus(user.status);
    } else {
        new chatCenter.addUser()
            .setId(user.id)
            .setCustCode(user.custCode)
            .setCustUserId(user.UserId)
            .setTitle(user.name)
            .setDetail(user.code)
            .setBadge(user.unreadMessageCount)
            .setPicture(user.picture == '' || user.picture == null || user.picture == undefined ? 'https://parsfile.com/Themes/resources/images/noimage.jpg' : user.picture)
            .setStatus(user.status)
            .setIsOnline(user.isOnline)
            .setStatusStyle();
    }
});

chatCenter.setOnRequestLoadChat(function (userId, skip, take, callback) {
    //postChat('getChat_', { userId: userId, skip: skip, take: take },
    postChat('getChat_', { fromId: $('#HFUser_id').val(), toId: userId, skip: skip, take: take },
        function (result) {
            //function (isSuccess, message, data) {
            //if (isSuccess) callback(message, data);

            //if (isSuccess)
            if (!result.error)
                callback('', result);
        }
    );
});

chatCenter.setOnRequestSendMessage(function (userId, message, messageMode, extra, callback) {

    //postChat('sendMessage_', { userId: userId, message: message, messageMode: messageMode, extra: extra, tabId: chatCenter.getTabId() },
    postChat('sendMessage_', {
        toId: userId,
        message: message,
        messageMode: messageMode,
        extra: extra,
        tabId: chatCenter.getTabId(),
        fromId: $('#HFUser_id').val()
    },
        //function (isSuccess, message, data) {
        //    callback(isSuccess, data);
        //}
        function (result) {
            callback(true, result);
        }
    );
});

chatCenter.setOnRequestUploadFile(function (file, userId, uploadCallback, progressCallback) {
    
    postChat('sendFile_', { toId: userId, fromId: $('#HFUser_id').val(), file: file },
        function (data) {
            if (data) uploadCallback(data);
        },
        function (percent) {
            progressCallback(percent);
        }
    );
});

chatCenter.setOnViewChat(function (userId, chatIds) {
    //postChat('viewChat_', { userId: userId, chatIds: chatIds });
    
    postChat('viewChat_', { fromId: userId, toId: $('#HFUser_id').val(), chatIds: chatIds });
});

chatCenter.setOnChangeCurrentUserStatus(function (status) {
    postChat('setUserStatus_', { status: status, toId: $('#HFUser_id').val() });
    changeCurrentUserStatus(status);
});

chatCenter.setOnIsTyping(function (userId) {
    //postChat('setIsTyping_', { userId: userId });
    postChat('setIsTyping_', { fromId: userId, toId: $('#HFUser_id').val() });
});

chatCenter.setOnShowUserInfo(function (user) {
    //نمایش اطلاعات کاربر
    //customer_Show_Info(user.getCustCode(), user.getTitle()); return false;
    
    var _url = '/Admin/Register/DetailView/' + user.getCustUserId();
    window.open(_url, '_blank'); return false;
});

chatCenter.setOnClearHistory(function (userId) {
    //postChat('clearHistory_', { userId: userId, tabId: chatCenter.getTabId() });
    postChat('clearHistory_', { fromId: $('#HFUser_id').val(), toId: userId, tabId: chatCenter.getTabId() });
});

chatCenter.setOnOpenChatBox(function (isOpen, mode, allmode) {
    $('.chat-button').toggleClass('active', isOpen);
    if (mode != null) {
        $.each(allmode, function (c, cl) { notiCenter.getPlaceUI().removeClass(cl) });
        notiCenter.getPlaceUI().addClass(mode);
    }
    //if (chatCenter.isAlwaysShowChat()) {
    //    sideMenu(1, null, true);
    //} else {
    //    sideMenu(0, null, true);
    //}
});

chatCenter.setOnChangeBadge(function (count) {
    $('.chat-button').toggleClass('show-badge', count > 0);
});
chatCenter.checkAllBadge();

$('.chat-button').click(function () {
    chatCenter.toggleChatCenter();
    return false;
});

chatCenter.toggleChatCenter(false);


addSocketEventListener('Chat', function (socketData, tabNum) {


    var ACTION_TYPE = { RECECIVE_MESSAGE: 0, VIEW_MESSAGE: 1, UNREAD_COUNT: 2, USER_STATUS: 3, IS_TYPING: 4, SEND_MESSAGE: 5, CLEAR_HISTORY: 6 };
    var action = socketData[0];
    var data = socketData[1];
    switch (action) {
        case ACTION_TYPE.RECECIVE_MESSAGE:
            chatCenter.receiveChat(data);
            break;
        case ACTION_TYPE.VIEW_MESSAGE:
            chatCenter.setViewChat(data[0], data[1]);
            break;
        case ACTION_TYPE.UNREAD_COUNT:
            chatCenter.setBadgeCount(data[0], data[1]);
            break;
        case ACTION_TYPE.USER_STATUS:
            if (data[0] == $('#HFUser_id').val()) {
                chatCenter.setCurrentUserStatus(data[1]);
                changeCurrentUserStatus(data[1]);
            } else {
                chatCenter.setUserStatus(data[0], data[1]);
            }
            break;
        case ACTION_TYPE.IS_TYPING:
            chatCenter.setIsTyping(data);
            break;
        case ACTION_TYPE.SEND_MESSAGE:
            if (data[0] != chatCenter.getTabId()) chatCenter.sendChat(data[1]);
        case ACTION_TYPE.CLEAR_HISTORY:
            if (data[0] != chatCenter.getTabId()) chatCenter.clearHistory(data[1]);
            break;
    }
});

addSocketEventListener('UserStatus', function (socketData, tabNum) {
    
    var userId = socketData[0];
    var isOnline = socketData[1];
    chatCenter.setUserIsOnline(userId, isOnline);
});

function changeCurrentUserStatus(status) {
    for (var i = 0; i <= 3; i++) {
        $('#menuPanel-user .status').removeClass('status-' + i);
    }
    $('#menuPanel-user .status').addClass('status-' + status);
}

function postChat(methodName, data, callback, onProgress) {
    
    //var url = '/' + $('#HFdomain').val() + '/chat/' + methodName;
    var url = '/chat/' + methodName;
    var formData = new FormData();
    formData.append("token", [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()]);//test
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

    request.upload.onprogress = function (ev) {
        if (ev.lengthComputable) {
            var percent = parseInt((ev.loaded / ev.total) * 100);
            if (onProgress) onProgress(percent);
        }
    }

    request.addEventListener('error', function () {
        if (callback) callback(false, '', '');
    });



    //way 1 coment by samad
    //برای ارسال فایل درست کار میکند و باید اصلاح شود
    //request.open('POST', url);
    //request.send(formData);

    //way 2
    AjaxChat('POST', url, formData, true, callback);
    //AjaxChat('POST', url, formData, true, callback);

}

function AjaxChat(type, url, data, async, successCallBack, isWait = true) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        async: async,
        processData: false,
        contentType: false,
        beforeSend: function () {


        },
        success: function (res) {

            if (successCallBack)
                successCallBack(res);
        },
        complete: function () {


        },
        error: function (res) {

            //AlertDialog(res, 'خطا', 'error');
        }
    });
}