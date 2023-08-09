
function ChatList(lang, timeZoneAddedMinuts) {
    document.write('<div class="chat-main-container"></div>');
    var containerMain = $('.chat-main-container');

    var that = this;
    var MESSAGE_MODE = { upload: -1, text: 0, picture: 1, file: 2, sound: 3, status: 4, form: 5 };
    var MESSAGE_STATUS = { pending: 0, send: 1, viewed: 2, error: 3 };
    var CHAT_STATUS = { free: 0, accept: 1, reject: 2, end: 3, transfer: 4 };


    var utility = new Utility();
    var agentUtility = new AgentUtility();
    var service = new Service();
    var savedMessage = new SavedMessage();


    var pageHeader = $('<div>').addClass('chat-list-page-head').append(
        $('<div>').addClass('title float-right').text(utility.r.chat),
        $('<a>').attr({ 'href': '#' }).addClass('help btnHelp float-left icon-question')
    ).appendTo(containerMain);


    var mainContainerCover = $('<div>').addClass('chat-list-container-cover').css({ 'height': 'calc(100vh - 60px - 55px)' }).appendTo(containerMain);
    var mainContainer = $('<div>').addClass('chat-list-container').appendTo(mainContainerCover);
    var userList = new UserList();


    function toggleEmptyMessage(enable) {
        if (!that.emptyMessageChatBox) {
            that.emptyMessageChatBox = $('<div>')
                .addClass('empty-message-chatbox')
                .append(
                    $('<div>').addClass('cover').append(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#dadde0"/><rect x="23" y="30" width="53" height="40" rx="20" ry="20" fill="#fff"/><path d="M43,52V82L62,67Z" fill="#fff"/><circle cx="38" cy="50" r="4" fill="#ccc"/><path d="M54,50a4,4,0,0,1-8,0Z" fill="#ccc"/><circle cx="62" cy="50" r="4" fill="#ccc"/></svg>',
                        $('<span>').text(utility.r.emptyChatBox)
                    )
                )
                .appendTo(mainContainer);
        }
        that.emptyMessageChatBox.toggle(enable);

    }
    toggleEmptyMessage(true);

    that.showChatBox = function (userId) {
        var user = userList.getUserById(userId);
        if (user != null) {
            user.setSelected();
            user.showChatBox(true);
        }
    }

    that.getSelectedUserId = function () {
        return userList.getSelectedUserId();
    }

    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function UserList() {
        var userList = this;
        var arrUsers = [];
        var arrChatBox = [];
        var container = $('<div>').addClass('chat-user-list-container float-right').appendTo(mainContainer);

        var tabs = $('<div>').addClass('tabs').appendTo(container);
        var tabOpenChat = $('<a>').attr({ 'href': '#' }).addClass('tab float-right active').text(utility.r.openChat).appendTo(tabs);
        var tabSolvedChat = $('<a>').attr({ 'href': '#' }).addClass('tab float-right').text(utility.r.solvedChat).appendTo(tabs);

        var loading = $('<div>').hide().addClass('user-list-spinner spinner').appendTo(container);
        var contentOpenChat = $('<div>').addClass('content-open-chat chat-scrollbar white-scroll').css({ 'height': 'calc(100% - 50px)' }).appendTo(container);
        var contentSolvedChat = $('<div>').addClass('content-solved-chat').css({ 'height': 'calc(100% - 50px)' }).hide().appendTo(container);
        var contentSolvedChatList = $('<div>').addClass('content-solved-chat-list chat-scrollbar white-scroll').css({ 'height': 'calc(100% - 40px)' }).appendTo(contentSolvedChat);
        var contentSolvedChatSearch = $('<div>').addClass('content-solved-chat-list chat-scrollbar white-scroll').css({ 'height': 'calc(100% - 40px)' }).hide().appendTo(contentSolvedChat);
        var emptyOpenChat = $('<div>').addClass('message-empty-chatstart').hide().text(utility.r.emptyChatStart).appendTo(contentOpenChat);

        tabOpenChat.click(function () {
            tabOpenChat.addClass('active'); tabSolvedChat.removeClass('active'); contentOpenChat.show(); contentSolvedChat.hide();
            return false;
        });
        tabSolvedChat.click(function () {
            if (loading.isLoading) return false;
            if (!tabSolvedChat.loaded) { loadChatStart(false); tabSolvedChat.loaded = true; }
            tabOpenChat.removeClass('active'); tabSolvedChat.addClass('active'); contentOpenChat.hide(); contentSolvedChat.show();
            return false;
        });

        contentSolvedChatList.scroll(function (ev) {
            if (contentSolvedChatList[0].scrollTop + contentSolvedChatList[0].clientHeight + 500 >= contentSolvedChatList[0].scrollHeight) {
                loadChatStart(false);
            }
        });
        loadChatStart(true);


        userList.clearSelectUser = function () {
            $.each(arrUsers, function (u, user_) {
                user_.getUI().removeClass('selected');
                if (user_.getBox() != null) user_.getBox().hide();
            });
        }

        userList.getSelectedUserId = function () {
            for (var u = 0; u <= arrUsers.length - 1; u++) {
                if (arrUsers[u].getUI().hasClass('selected')) return arrUsers[u].getId();
            }
            return 0;
        }

        userList.clearIsSearchResult = function () {
            arrUsers = $.grep(arrUsers, function (s) { return !s.getIsSearchResult() });
        }

        userList.getUserById = function (id) {
            var user = $.grep(arrUsers, function (s) { return s.getId() == id && !s.getIsSearchResult() });
            return user.length > 0 ? user[0] : null;
        }

        userList.getChatBoxById = function (id) {
            var chatBox = $.grep(arrChatBox, function (s) { return s.getId() == id });
            return chatBox.length > 0 ? chatBox[0] : null;
        }

        userList.getOpenUserCount = function () {
            return $.grep(arrUsers, function (s) { return s.getChatStatus() == CHAT_STATUS.accept || s.getChatStatus() == CHAT_STATUS.free || s.getChatStatus() == CHAT_STATUS.transfer }).length;
        }

        // Receive new message
        service.addSocketEventListener(service.ACTION_TYPE.RECECIVE_MESSAGE, function (data, tabNum) {
            var chat = data[0]; var userData = data[1];
            var user = userList.getUserById(userData.id);
            if (user == null) {
                user = new User(userData).setAgent(userData.agentId).setIsOnline(true).setTitle(userData.name).setDetail(chat.message).setDate(chat.createDate).setBadge(1);
            } else {
                user.setDetail(chat.message).setDate(chat.createDate).addBadge(1);
                if (userData.status == CHAT_STATUS.free) {
                    user.setChatStatus(CHAT_STATUS.free);
                    var box = userList.getChatBoxById(userData.id);
                    if (box != null) box.setStatus(CHAT_STATUS.free);
                }
            }
            contentOpenChat.prepend(user.getUI());
            emptyOpenChat.hide();
        });

        // Change chat status
        service.addSocketEventListener(service.ACTION_TYPE.CHANGE_CHAT_STATUS, function (data, tabNum) {
            var status = data[0];
            var agentId = data[1];
            var newAgentId = data[2];
            var userId = data[3];
            var createDate = data[4];
            var user = userList.getUserById(userId);
            if (user != null) {

                if (status == CHAT_STATUS.accept) user.setAgent(agentId);
                else if (status == CHAT_STATUS.transfer) user.setAgent(newAgentId);
                else if (status == CHAT_STATUS.free || status == CHAT_STATUS.reject || status == CHAT_STATUS.end) user.setAgent(0);

                if (status == CHAT_STATUS.reject || status == CHAT_STATUS.end) {
                    contentSolvedChatList.prepend(user.getUI());
                } else {
                    contentOpenChat.prepend(user.getUI());
                }

                user.setChatStatus(status);
            }
            var box = userList.getChatBoxById(userId);
            if (box != null) {
                box.setStatus(status);
                if (status != CHAT_STATUS.free) {
                    box.sendMessage({ createDate: createDate, fromId: agentId, isAgent: true, message: status, messageMode: MESSAGE_MODE.status, viewed: true });
                    if (status == CHAT_STATUS.transfer) {
                        box.sendMessage({ createDate: createDate, fromId: newAgentId, isAgent: true, message: CHAT_STATUS.accept, messageMode: MESSAGE_MODE.status, viewed: true });
                    }
                }
            }
            emptyOpenChat.toggle(userList.getOpenUserCount() == 0);
        });


        // Change user info
        service.addSocketEventListener(service.ACTION_TYPE.UPDATE_USER_INFO, function (data, tabNum) {
            data = data[0];
            var user = userList.getUserById(data.userId);
            if (user != null) {
                var userData = user.getUserData();
                if (data.updateMode == 1) {
                    userData.name = data.name;
                    userData.email = data.email;
                    userData.phone = data.phone;
                    userData.about = data.about;
                } else if (data.updateMode == 2) {
                    userData.name = data.name;
                    userData.avatar = data.avatar;
                    userData.custCode = data.custCode;
                    user.setAvatar(data.avatar);
                }
                user.setTitle(data.name);
            }
            var box = userList.getChatBoxById(data.userId);
            if (box != null) box.setUserInfo(data);
        });


        // User online status
        service.addSocketEventListener(service.ACTION_TYPE.USER_ONLINE_STATUS, function (data, tabNum) {
            var userId = data[0];
            var isOnline = data[1];
            var user = userList.getUserById(userId);
            if (user != null) {
                user.setIsOnline(isOnline);
            }
        });


        // Send message
        service.addSocketEventListener(service.ACTION_TYPE.SEND_MESSAGE, function (data, tabNum) {
            var tabId = data[0];
            var chat = data[1];
            var user = userList.getUserById(chat.chatClientStartId);
            if (user != null) {
                user.setDetail(chat.message).setDate(chat.createDate);
            }
            var box = userList.getChatBoxById(chat.chatClientStartId);
            if (box != null && service.getTabId() != tabId) box.sendMessage(chat);
        });

        // Receive message
        service.addSocketEventListener(service.ACTION_TYPE.RECECIVE_MESSAGE, function (data, tabNum) {
            var chat = data[0];
            var info = data[1];
            var user = userList.getUserById(chat.chatClientStartId);
            if (user != null) user.setDetail(chat.message).setDate(chat.createDate);
            var box = userList.getChatBoxById(chat.chatClientStartId);
            if (box != null) box.receiveMessage(chat)
        });

        // view message
        service.addSocketEventListener(service.ACTION_TYPE.VIEW_MESSAGE, function (data, tabNum) {
            var isAgentView = data[0];
            var userId = data[1];
            var user = userList.getUserById(userId);
            if (user != null && isAgentView) user.setBadge(0);
            var box = userList.getChatBoxById(userId);
            if (box != null) box.viewedMessage(isAgentView)
        });

        // is Typing
        service.addSocketEventListener(service.ACTION_TYPE.IS_TYPING, function (data, tabNum) {
            var userId = data;
            var user = userList.getUserById(userId);
            if (user != null) user.setIsTyping();
            var box = userList.getChatBoxById(userId);
            if (box != null) box.setIsTyping();
        });


        function initSearch() {
            var searchInputWrapper = $('<div>').addClass('search-input-cover');
            contentSolvedChat.prepend(searchInputWrapper);
            var searchIcon = $('<i>').addClass('icon-search float-right').appendTo(searchInputWrapper);
            var searchInput = $('<input>').addClass('float-right').attr({ 'type': 'text', placeholder: utility.r.search }).appendTo(searchInputWrapper);
            var searchClose = $('<a>').attr('href', '#').hide().addClass('icon-close float-right').appendTo(searchInputWrapper);

            searchInput.keyup(function () {
                var text = searchInput.val().trim();
                searchClose.toggle(text != '');
                contentSolvedChatList.toggle(text == '');
                contentSolvedChatSearch.toggle(text != '');
                searchChatStart();
            });
            searchClose.click(function () {
                searchInput.val('').focus();
                searchClose.hide();
                contentSolvedChatList.show();
                contentSolvedChatSearch.hide();
                searchChatStart();
                return false;
            });

            var timerSearch;
            function searchChatStart() {
                var text = searchInput.val().trim();
                contentSolvedChatSearch.empty();
                loading.toggle(text != '');
                clearTimeout(timerSearch);
                userList.clearIsSearchResult();
                if (text == '') return false;
                timerSearch = setTimeout(function () {
                    service.post('searchChatStart_', { text: text }, function (isSuccess, message, data) {
                        loading.hide();
                        if (isSuccess) {
                            $.each(data, function (u, userDataDetail) {
                                var userData = userDataDetail.chatClientStart;
                                var chat = userDataDetail.chatClient;
                                var user = new User(userData)
                                    .setIsSearchResult(true)
                                    .setIsOnline(userDataDetail.isOnline)
                                    .setBadge(userDataDetail.unreadCount)
                                    .setAgent(userData.agentId)
                                    .setTitle(userData.name)
                                    .setDetail(chat.message)
                                    .setDate(chat.createDate);
                                contentSolvedChatSearch.append(user.getUI());
                            });
                        }
                    });
                }, 1000);
            }
        }
        initSearch();


        function loadChatStart(getOpenChatStart) {
            if (loading.isLoading) return false;
            var skip = 0
            var take = 0;
            if (!getOpenChatStart) {
                skip = contentSolvedChatList.find('.chat-user').length + 1;
                take = (skip - 1) + 100;
                if (that.totalRow && skip >= that.totalRow) return false;
            }
            loading.show().isLoading = true;
            service.post('getChatStart_', { getOpenChatStart: getOpenChatStart, skip: skip, take: take }, function (isSuccess, totalRow, data) {
                loading.hide().isLoading = false;
                if (isSuccess) {
                    $.each(data, function (u, userDataDetail) {
                        var userData = userDataDetail.chatClientStart;
                        var chat = userDataDetail.chatClient;
                        if (userList.getUserById(userData.id)) return;
                        var user = new User(userData)
                            .setIsOnline(userDataDetail.isOnline)
                            .setBadge(userDataDetail.unreadCount)
                            .setAgent(userData.agentId)
                            .setTitle(userData.name)
                            .setDetail(chat.message)
                            .setDate(chat.createDate);
                        if (getOpenChatStart) {
                            contentOpenChat.append(user.getUI());
                        } else {
                            contentSolvedChatList.append(user.getUI());
                            that.totalRow = parseInt(totalRow);
                        }
                    });
                    if (getOpenChatStart) emptyOpenChat.toggle(data.length == 0);
                }
            });
        }


        function User(userData) {
            var user = this;
            arrUsers.push(user);
            if (userData.avatar == '') userData.avatar = '../themes/resources/images/noimage.jpg';

            var userElem = $('<div>').addClass('chat-user');
            var pictureWrapper = $('<div>').addClass('picture float-right').appendTo(userElem);
            var row1 = $('<div>').addClass('info-row').appendTo(userElem);
            var row2 = $('<div>').addClass('info-row').appendTo(userElem);
            var badgeElem = $('<div>').addClass('badge float-left').appendTo(row1);
            var titleElem = $('<div>').addClass('title float-right').appendTo(row1);
            var detailElem = $('<div>').addClass('detail float-right').appendTo(row2);
            var isTypingElem = $('<div>').addClass('float-right is-typing').appendTo(row2);
            var dateElem = $('<div>').addClass('chat-date float-left').appendTo(row2);
            var pictureElem = $('<img>').attr({ src: userData.avatar }).appendTo(pictureWrapper);
            var statusElem = $('<div>').addClass('status').appendTo(pictureWrapper);
            var agentElem = $('<img>').addClass('agent').hide().appendTo(pictureWrapper);
            var box = null;

            userElem.click(function () {
                user.setSelected();
                user.showChatBox(false);
            });

            user.getUserData = function () { return userData };

            user.showChatBox = function (scrollToBottom) {
                if (!box) {
                    box = userList.getChatBoxById(user.getId());
                    if (!box) {
                        box = new ChatBox(userData);
                        arrChatBox.push(box);
                    }
                }
                mainContainer.addClass('mode-show-chatbox');
                toggleEmptyMessage(false);
                box.show(scrollToBottom);
            }

            user.setSelected = function () {
                if (userElem.hasClass('selected')) return false;
                userList.clearSelectUser();
                userElem.addClass('selected');
            }

            user.getUI = function () { return userElem; };
            user.getBox = function () { return box; };

            user.getId = function () { return userData.id }
            user.setId = function (id) { userData.id = id; return user; }
            user.getIsSearchResult = function () { return userData.isSearchResult }
            user.setIsSearchResult = function (isSearchResult) { userData.isSearchResult = isSearchResult; return user; }
            user.getTitle = function () { return userData.name }
            user.setTitle = function (name) { userData.name = name; titleElem.text(utility.numberLocalize(name)); return user; }
            user.getDetail = function () { return userData.detail }
            user.setDetail = function (detail) {
                userData.detail = detail;
                detailElem.text(utility.numberLocalize(detail));
                return user;
            }
            user.getAvatar = function () { return userData.avatar; }
            user.setAvatar = function (avatar) {
                userData.avatar = avatar;
                pictureElem.attr({ 'src': avatar == '' ? '../themes/resources/images/noimage.jpg' : avatar });
                return user;
            }
            user.setDate = function (date) {
                var mDate = utility.getMomentDate(date);
                var time = utility.getMomentTime(mDate);
                dateElem.text(utility.numberLocalize(time)).attr('title', utility.numberLocalize(mDate.format('LLL')));
                return user;
            }
            user.getBadge = function () { return userData.badge; }
            user.setBadge = function (number) {
                userData.badge = number;
                badgeElem.toggle(number != 0).text(utility.numberLocalize(number));
                return user;
            }
            user.addBadge = function (number) {
                user.setBadge(userData.badge + number);
                return user;
            }
            user.getIsOnline = function () { return userData.isOnline }
            user.setIsOnline = function (isOnline) {
                userData.isOnline = isOnline;
                statusElem.toggle(isOnline);
                return user;
            }
            user.setAgent = function (agentId) {
                userData.agentId = agentId;
                if (agentId != 0) {
                    var agent = agentUtility.getAgentInfo(userData.chatBoxId, agentId);
                    agentElem.show().attr({ src: agent.avatar, title: agent.name });
                } else {
                    agentElem.hide();
                }
                userElem.toggleClass('another-agent', agentId != 0 && agentId != agentUtility.getCurrentAgent(userData.chatBoxId).userId);
                return user;
            }
            user.setChatStatus = function (status) {
                userData.status = status;
                return user;
            }
            user.getChatStatus = function () {
                return userData.status;
            }
            user.setIsTyping = function () {
                clearTimeout(user.timerIsTyping);
                clearTimeout(user.timerTreeDots);

                isTypingElem.text(utility.r.isTyping).show();
                detailElem.hide();

                var i = 0;
                user.timerTreeDots = setInterval(function () {
                    i++;
                    if (i > 3) i = 0;
                    isTypingElem.text(utility.r.isTyping + (".").repeat(i));
                }, 300);

                user.timerIsTyping = setTimeout(function () {
                    isTypingElem.hide();
                    detailElem.show();
                    clearInterval(user.timerTreeDots);
                }, 3500);

                return user;
            }
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function ChatBox(userData) {
        var chatbox = this;
        var arrChatPopups = [];
        var scrollPosition = 0;

        var chatBoxContainer = $('<div>').addClass('chatbox-container').appendTo(mainContainer);
        var profile = new Profile();

        var chatBoxElem = $('<div>').addClass('chatbox-wrapper').appendTo(chatBoxContainer);
        var header = new Header();
        var content = new Content();
        var footer = new Footer();




        //Methods
        chatbox.setStatus = function (status) {
            header.setStatus(status);
            footer.setStatus(status);
            profile.setStatus(status);
        }
        chatbox.setStatus(userData.status);

        chatbox.show = function (scrollToBottom) {
            chatBoxContainer.show();
            if (scrollToBottom) content.scrollToBottom(); else content.setScrollPosition(scrollPosition);
            content.viewAllChat();
            footer.focus();
        }
        chatbox.hide = function () {
            if (chatBoxContainer.css('display') == 'none') return false;
            scrollPosition = content.getLastScrollPosition();
            chatBoxContainer.hide();
        }

        chatbox.getId = function () { return userData.id };

        chatbox.sendMessage = function (chat) {
            new ChatPopup('self')
                .setId(chat.id)
                .setFromId(chat.fromId)
                .setDate(chat.createDate)
                .setStatus(MESSAGE_STATUS.send)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                .setAvatar(agentUtility.getAgentInfo(userData.chatBoxId, chat.fromId))
                .addToBox();
            return chatbox;
        }

        chatbox.receiveMessage = function (chat) {
            new ChatPopup('other')
                .setId(chat.id)
                .setFromId(chat.fromId)
                .setDate(chat.createDate)
                .setStatus(MESSAGE_STATUS.send)
                .setMessage(chat.message, chat.messageMode, chat.extra)
                .addToBox();
            return chatbox;
        }

        chatbox.viewedMessage = content.viewedMessage;
        chatbox.setIsTyping = header.setIsTyping;

        chatbox.setUserInfo = function (data) {
            profile.setUserInfo();
            header.setTitle(userData.name).setAvatar(userData.avatar);
        }

        function Header() {
            var header = this;
            var headerElem = $('<div>').addClass('chat-header').appendTo(chatBoxElem);

            var acceptBtn = $('<button>').addClass('green float-left').text(utility.r.acceptChat).appendTo(headerElem);
            var rejectBtn = $('<button>').addClass('red float-left').text(utility.r.rejectChat).appendTo(headerElem);
            var transferBtn = $('<button>').addClass('gray float-left').text(utility.r.transferChat).appendTo(headerElem);
            var endBtn = $('<button>').addClass('red float-left').text(utility.r.endChat).appendTo(headerElem);
            var closeBtn = $('<button>').addClass('gray float-left').text(utility.r.closeChat).appendTo(headerElem);
            var loadingElem = $('<div>').hide().addClass('spinner float-left').appendTo(headerElem);

            var btnBackElem = $('<i>').addClass('btn-back icon-back-dir float-right').appendTo(headerElem);
            var pictureElem = $('<img>').addClass('picture float-right').attr({ src: userData.avatar }).appendTo(headerElem);
            var titleElem = $('<div>').addClass('title').text(userData.name).appendTo(headerElem);
            var detailElem = $('<div>').addClass('detail').text(agentUtility.getChatBoxInfo(userData.chatBoxId).title).appendTo(headerElem);
            var isTypingElem = $('<div>').addClass('is-typing').appendTo(headerElem);

            btnBackElem.click(function () {
                mainContainer.removeClass('mode-show-chatbox');
            });

            pictureElem.click(function () {
                mainContainer.addClass('mode-show-profile');
            });

            acceptBtn.click(function () {
                changeChatStatus(CHAT_STATUS.accept);
                return false;
            });

            var mnuTransfer = new RaveshUI.Menu(transferBtn, {
                align: 'auto', removeAfterHide: false,
                content: mnuTransferContent(function (agent) {
                    changeChatStatus(CHAT_STATUS.transfer, agent.userId);
                })
            });

            endBtn.click(function () {
                changeChatStatus(CHAT_STATUS.end);
                return false;
            });

            closeBtn.click(function () {
                chatbox.hide();
                userList.clearSelectUser();
                mainContainer.removeClass('mode-show-chatbox');
                toggleEmptyMessage(true);
                return false;
            });

            rejectBtn.click(function () {
                changeChatStatus(CHAT_STATUS.reject);
                return false;
            });

            function changeChatStatus(status, newAgentId) {
                service.post('changeChatStatus_', {
                    status: status, newAgentId: newAgentId || 0, userId: userData.id, chatBoxId: userData.chatBoxId
                });
            }

            function mnuTransferContent(callback) {
                var agents = agentUtility.getChatBoxAgents(userData.chatBoxId);
                var currentAgent = agentUtility.getCurrentAgent(userData.chatBoxId);
                var mnuContent = $('<div>').addClass('chat-scrollbar').css({ 'max-height': '300px', 'overflow-y': 'auto' });
                var hasAgent = false;
                $.each(agents, function (a, agent) {
                    if (agent.userId == currentAgent.userId) return;
                    if (!agent.enable) return;
                    hasAgent = true;
                    $('<div>').addClass('option').append(
                        $('<img>').addClass('float-right').attr({ src: agent.avatar, title: agent.name }).css({ 'width': '30px', 'height': '30px', 'border-radius': '50%', 'margin': lang == 'fa' ? '7.5px 10px 0 0' : '7.5px 0 0 10px' }),
                        $('<span>').text(agent.name)
                    ).click(function () {
                        mnuTransfer.hide();
                        callback(agent);
                    }).appendTo(mnuContent);
                });
                if (!hasAgent) transferBtn.remove();
                return mnuContent;
            }

            header.setStatus = function (status) {
                acceptBtn.hide();
                rejectBtn.hide();
                transferBtn.hide();
                endBtn.hide();
                closeBtn.hide();
                switch (status) {
                    case CHAT_STATUS.free:
                        acceptBtn.show();
                        rejectBtn.show();
                        break;

                    case CHAT_STATUS.accept: case CHAT_STATUS.transfer:
                        if (userData.agentId == agentUtility.getCurrentAgent(userData.chatBoxId).userId) {
                            transferBtn.show();
                            endBtn.show();
                        } else {
                            closeBtn.show();
                        }
                        break;

                    case CHAT_STATUS.reject:
                        closeBtn.show();
                        break;
                    case CHAT_STATUS.end:
                        closeBtn.show();
                        break;
                }
            }

            header.setTitle = function (title) {
                titleElem.text(utility.numberLocalize(title));
                return header;
            }

            header.setAvatar = function (avatar) {
                pictureElem.attr({ src: avatar == '' ? '../themes/resources/images/noimage.jpg' : avatar });
                return header;
            }

            header.setDetail = function (detail) {
                detailElem.text(detail);
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

            header.showLoading = function () { loadingElem.show(); }
            header.hideLoading = function () { loadingElem.hide(); }
        }


        function Content() {
            var content = this;
            var contentElem = $('<div>').addClass('chat-content chat-scrollbar white-scroll').appendTo(chatBoxElem);
            var coverContent = $('<div>').addClass('chat-cover').appendTo(contentElem);

            content.onAddPopupToBox = function (popup) {
                var prevPopup = null;
                if (arrChatPopups.length > 0) {
                    prevPopup = arrChatPopups[arrChatPopups.length - 1];
                }
                setPopupArrowAndLabel(prevPopup, popup)
                coverContent.append(popup.label, popup.getUI());
                arrChatPopups.push(popup);
            }

            content.scrollToBottom = function () {
                contentElem[0].scrollTop = contentElem[0].scrollHeight;
            }

            content.getLastScrollPosition = function () {
                return contentElem[0].scrollTop;
            }

            content.setScrollPosition = function (position) {
                contentElem[0].scrollTop = position;
            }

            content.viewAllChat = function () {
                if (userData.agentId != agentUtility.getCurrentAgent(userData.chatBoxId).userId) return false;
                var exists = false;
                $.each(arrChatPopups, function (p, popup) {
                    if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == 'other') {
                        popup.setStatus(MESSAGE_STATUS.viewed);
                        exists = true;
                    }
                });
                if (exists) service.post('viewChat_', { userId: userData.id, chatBoxId: userData.chatBoxId });
            }

            content.viewedMessage = function (isAgentView) {
                $.each(arrChatPopups, function (p, popup) {
                    if (popup.getStatus() != MESSAGE_STATUS.viewed && popup.from == (isAgentView ? 'other' : 'self')) {
                        popup.setStatus(MESSAGE_STATUS.viewed);
                    }
                });
            }

            contentElem.scroll(function (ev) {
                if (contentElem[0].scrollTop + contentElem[0].offsetHeight + 20 >= contentElem[0].scrollHeight) {
                    content.viewAllChat();
                }
                if ((contentElem[0].scrollHeight - contentElem[0].clientHeight) + contentElem[0].scrollTop <= 500) {
                    //if (contentElem[0].scrollTop <= 500) {
                    loadChat();
                }
            });
            contentElem.click(function () {
                content.viewAllChat();
            });

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
                    if (prevPopup.getFromId() == popup.getFromId() && prevPopup.from == popup.from && diffMinutes < 4 && popup.getMessageMode() != MESSAGE_MODE.status) {
                        prevPopup.toggleArrow(false);
                    }
                }
            }

            function loadChat() {
                if (content.isLoading) return false;
                var skip = arrChatPopups.length + 1;
                var take = (skip - 1) + 100;
                if (content.totalRow && skip >= content.totalRow) return false;
                content.isLoading = true;
                service.post('getChat_', { userId: userData.id, skip: skip, take: take }, function (isSuccess, totalRow, chats) {
                    content.isLoading = false;
                    if (!isSuccess) return false;
                    content.totalRow = parseInt(totalRow);

                    $.each(chats, function (c, chat) {
                        var popup = new ChatPopup(chat.isAgent ? 'self' : 'other')
                            .setId(chat.id)
                            .setFromId(chat.fromId)
                            .setDate(chat.createDate)
                            .setStatus(chat.viewed ? MESSAGE_STATUS.viewed : MESSAGE_STATUS.send)
                            .setMessage(chat.message, chat.messageMode, chat.extra);

                        if (chat.isAgent) popup.setAvatar(agentUtility.getAgentInfo(userData.chatBoxId, chat.fromId))

                        coverContent.prepend(popup.getUI());
                        arrChatPopups.splice(0, 0, popup);
                    });

                    $.each(arrChatPopups, function (p, popup) {
                        prevPopup = p == 0 ? null : arrChatPopups[p - 1];
                        setPopupArrowAndLabel(prevPopup, popup);
                        if (popup.label != '') popup.getUI().before(popup.label);
                    });

                    if (skip == 1) {
                        content.scrollToBottom();
                        content.viewAllChat();
                    }
                });
            }
            loadChat();
        }


        function Footer() {
            footer = this;
            var footerElem = $('<div>').addClass('chat-footer').appendTo(chatBoxElem);

            var savedMessageWrapper = $('<div>');
            var panelSavedMessage = new Panel(savedMessageWrapper, footerElem);

            var emojiWrapper = $('<div>').addClass('chat-emoji chat-scrollbar white-scroll');
            var panelEmoji = new Panel(emojiWrapper, footerElem);

            var panelTextArea = $('<div>').addClass('chat-panel-textarea').appendTo(footerElem);
            var btnPlace = $('<div>').addClass('btn-place').appendTo(panelTextArea);
            var btnSend = $('<a>').attr({ 'href': '#', title: utility.r.send }).hide().addClass('float-left send btn').css({ color: '#2196F3', background: '#fff' }).append('<svg style="width:20px;height:20px;margin:3px;" viewBox="0 0 24 24"><path d="' + (lang == 'fa' ? "M22,3,1,12l21,9V14L7,12l15-2Z" : "M2,21L23,12L2,3V10L17,12L2,14V21Z") + '" style="fill: currentcolor;"></path></svg>').appendTo(btnPlace);
            var btnPlusMenu = $('<a>').attr('href', '#').addClass('icon-plus-circle float-left plus btn').appendTo(btnPlace);
            var btnEmojiMenu = $('<a>').attr('href', '#').addClass('icon-smile float-left emoji btn').appendTo(btnPlace);
            var btnSavedMessageMenu = $('<a>').attr('href', '#').addClass('icon-comment-alt-lines float-left emoji btn').appendTo(btnPlace);
            var textarea = $('<textarea>').attr({ 'rows': 1, placeholder: utility.r.writeAMessage }).addClass('float-right chat-scrollbar').appendTo(panelTextArea);

            btnSend.click(function () {
                var message = textarea.val().trim();
                if (message == '') return false;
                textarea.val('');
                changeTextAreaHeight();
                panelEmoji.hide();

                var currentAgent = agentUtility.getCurrentAgent(userData.chatBoxId);
                new ChatPopup('self').setFromId(currentAgent.userId).setAvatar(currentAgent).setDate().setStatus(0).setMessage(message, MESSAGE_MODE.text).addToBox().send();
                content.scrollToBottom();
                content.viewAllChat();

                btnPlusMenu.show();
                btnSend.hide();
                return false;
            });

            textarea.click(function () {
                content.viewAllChat();
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
                footer.onIsTyping();
            });

            //upload file
            var fileUploader = new utility.uploader(chatBoxElem, textarea, function (selectedFile) {
                var currentAgent = agentUtility.getCurrentAgent(userData.chatBoxId);
                new ChatPopup('self').setFromId(currentAgent.userId).setAvatar(currentAgent).setDate().setStatus(0).setMessage(selectedFile, MESSAGE_MODE.upload).addToBox();
                content.scrollToBottom();
                content.viewAllChat();
                setTimeout(content.scrollToBottom, 500);
            });

            //plus menu
            new RaveshUI.Menu(btnPlusMenu, {
                align: 'auto', verticalAlign: 'top', appendTo: footerElem, marginTop: 8, options: [
                    {
                        title: utility.r.sendFile, cssIcon: 'icon-attachment', callback: function () {
                            fileUploader.select();
                        }
                    },
                    {
                        title: utility.r.requestSendForm, cssIcon: 'icon-list-alt', callback: function () {
                            RequestForm(userData, function (form, formUrl, key) {
                                var currentAgent = agentUtility.getCurrentAgent(userData.chatBoxId);
                                var params = { url: formUrl, color: form.color, formName: form.title };
                                new ChatPopup('self').setFromId(currentAgent.userId).setAvatar(currentAgent).setDate().setStatus(0).setMessage(key, MESSAGE_MODE.form, JSON.stringify(params)).addToBox().send();
                                content.scrollToBottom();
                                content.viewAllChat();
                            });
                        }
                    }
                ]
            });


            //emoji
            var emojiList = utility.getEmojiList();
            $.each(emojiList, function (e, emoji) {
                emojiWrapper.append(
                    $('<span>').text(emoji).click(function () {
                        utility.insertAtCursor(textarea[0], emoji);
                        textarea[0].focus();
                        btnPlusMenu.hide();
                        btnSend.show();
                    })
                );
            });
            panelEmoji.setOnToggle(function (enable, panelId) {
                btnEmojiMenu.toggleClass('active', enable).addClass(panelId);
            });
            btnEmojiMenu.click(function () {
                panelEmoji.toggle();
            })


            //saved message
            panelSavedMessage.setOnToggle(function (enable, panelId) {
                btnSavedMessageMenu.toggleClass('active', enable).addClass(panelId);
            });
            btnSavedMessageMenu.click(function () {
                panelSavedMessage.toggle();
            })
            var saveMessageSelector = savedMessage.getListUI(userData.chatBoxId,
                function (message) {
                    var currentAgent = agentUtility.getCurrentAgent(userData.chatBoxId);
                    new ChatPopup('self').setFromId(currentAgent.userId).setAvatar(currentAgent).setDate().setStatus(0).setMessage(message, MESSAGE_MODE.text).addToBox().send();
                    content.scrollToBottom();
                    content.viewAllChat();
                },
                function (message) {
                    textarea.val(textarea.val() + ' ' + message);
                    changeTextAreaHeight();
                    utility.changDirection(textarea, textarea.val());
                    btnPlusMenu.hide();
                    btnSend.show();
                },
                function () {
                    panelSavedMessage.hide();
                }
            )
            savedMessageWrapper.append(saveMessageSelector);


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

            footer.setStatus = function (status) {
                var isDisable = !((status == CHAT_STATUS.accept || status == CHAT_STATUS.transfer) && userData.agentId == agentUtility.getCurrentAgent(userData.chatBoxId).userId);
                footerElem.toggleClass('disable', isDisable);
                textarea.attr('disabled', isDisable);
            }
            footer.onIsTyping = function () {
                if (footer.isTypingCalled) return false;
                footer.isTypingCalled = true;
                service.post("setIsTyping_", { userId: userData.id });
                setTimeout(function () { footer.isTypingCalled = false; }, 3000);
            }
            footer.focus = function () {
                textarea.focus();
            }
        }


        function Panel(content, appendTo) {
            var panel = this;
            var panelId = utility.randomId('panel-');
            var container = $('<div>').addClass('chat-panel ' + panelId).append(content).appendTo(appendTo);
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
                if ($(ev.target).hasClass(panelId) == false && $(ev.target).parents('.' + panelId).length == 0) {
                    panel.hide();
                }
            })

        }


        function Profile() {
            var profile = this;
            var profileElem = $('<div>').addClass('profile-container chat-scrollbar white-scroll float-left').appendTo(chatBoxContainer);

            var btnBack = $('<i>').addClass('btn-back icon-back-dir float-right').appendTo(profileElem);

            var pictureElem = $('<img>').addClass('picture').appendTo(profileElem);
            var txtName = $('<input>').addClass('name').attr({ type: 'text', maxLength: 200 }).appendTo(profileElem);
            txtName.blur(function () { changeUserInfo() });

            $('<div>').addClass('space').appendTo(profileElem);

            var rowEmail = new Row().setIcon('icon-envelope').addInput(utility.r.setEmail).setMaxLength(100).setOnBlurListener(changeUserInfo).appendTo(profileElem);
            var rowPhone = new Row().setIcon('icon-phone').addInput(utility.r.setPhone).setMaxLength(15).setOnBlurListener(changeUserInfo).appendTo(profileElem);
            var rowAbout = new Row().setIcon('icon-clipboard-list').addTextArea(utility.r.setNote).setMaxLength(200).setOnBlurListener(changeUserInfo).appendTo(profileElem);

            $('<div>').addClass('spliter').appendTo(profileElem);

            var btnPlace = $('<div>').addClass('btn-place').appendTo(profileElem);
            var btnCreateCust = $('<button>').addClass('green').text(utility.r.createCust).appendTo(btnPlace);
            var btnAssignCust = $('<button>').addClass('green').text(utility.r.assignCust).appendTo(btnPlace);
            var btnViewCust = $('<button>').addClass('gray').html(utility.r.viewCust).appendTo(btnPlace);

            $('<div>').addClass('space').appendTo(profileElem);

            var rowChatBox = new Row().setIcon('icon-comment-alt-lines').addDiv().setValue(agentUtility.getChatBoxInfo(userData.chatBoxId).title).appendTo(profileElem);
            var rowOS = new Row().setIcon(userData.isMobile ? 'icon-mobile' : 'icon-laptop').addDiv().setValue(userData.os).appendTo(profileElem);//icon-mobile
            var rowBrowser = new Row().setIcon('icon-globe').addDiv().setValue(userData.browser).appendTo(profileElem);
            var rowIP = new Row().setIcon('icon-user').addDiv().setValue(userData.ip).appendTo(profileElem);
            var rowReferrer = new Row().setIcon('icon-link').addLink().setValue(userData.referrer).appendTo(profileElem);

            btnBack.click(function () {
                mainContainer.removeClass('mode-show-profile');
                return false;
            });

            btnViewCust.click(function () {
                customer_Show_Info(userData.custCode, userData.name);
                return false;
            });

            btnCreateCust.click(function () {
                var callbackStr = "chat_customer_create_quick_" + userData.id;
                window[callbackStr] = function (custData) {
                    service.post("setUserInfo_", { updateMode: 2, userId: userData.id, custCode: custData.code });
                }
                customer_create_quick(utility.r.createCust, callbackStr,
                    "name=" + userData.name.replace(/=/g, ' ').replace(/,/g, ' ') + "," +
                    "tel=" + userData.phone.replace(/=/g, ' ').replace(/,/g, ' ') + "," +
                    "email=" + userData.email.replace(/=/g, ' ').replace(/,/g, ' ')
                );
                return false;
            });

            btnAssignCust.click(function () {
                RaveshUI.selectCustomerDialog(0, function (custData) {
                    service.post("setUserInfo_", { updateMode: 2, userId: userData.id, custCode: custData.id });
                });
                return false;
            });

            profile.setUserInfo = function () {
                pictureElem.attr({ 'src': userData.avatar == '' ? '../themes/resources/images/noimage.jpg' : userData.avatar })
                txtName.val(userData.name);
                rowEmail.setValue(userData.email);
                rowPhone.setValue(userData.phone);
                rowAbout.setValue(userData.about);
                btnAssignCust.toggle(userData.custCode == 0);
                btnCreateCust.toggle(userData.custCode == 0);
                btnViewCust.toggle(userData.custCode != 0);
            }
            profile.setUserInfo();

            profile.setStatus = function (status) {
                var isDisable = !((status == CHAT_STATUS.accept || status == CHAT_STATUS.transfer) && userData.agentId == agentUtility.getCurrentAgent(userData.chatBoxId).userId || userData.agentId == 0);
                txtName.attr('disabled', isDisable);
                btnCreateCust.attr('disabled', isDisable);
                btnAssignCust.attr('disabled', isDisable);
                rowEmail.setDisable(isDisable);
                rowPhone.setDisable(isDisable);
                rowAbout.setDisable(isDisable);
            }

            function changeUserInfo() {
                var userInfo = {
                    updateMode: 1,
                    userId: userData.id,
                    name: txtName.val(),
                    email: rowEmail.getValue(),
                    phone: rowPhone.getValue(),
                    about: rowAbout.getValue(),
                }

                rowEmail.toggleClass('error', false);
                if (userInfo.email != '') {
                    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                        .test(userInfo.email.toLowerCase())) {
                        rowEmail.toggleClass('error', true);
                        return false;
                    }
                }

                rowPhone.toggleClass('error', false);
                if (userInfo.phone != '') {
                    if (!userInfo.phone.match(/^[0-9]+$/)) {
                        rowPhone.toggleClass('error', true);
                        return false;
                    }
                }

                if (
                    userData.name != userInfo.name ||
                    userData.email != userInfo.email ||
                    userData.phone != userInfo.phone ||
                    userData.about != userInfo.about
                    ) {
                    service.post("setUserInfo_", userInfo);
                }
            }

            function Row() {
                var row = this;
                var rowElem = $('<div>').addClass('row-profile');
                var iconElem = $('<i>').addClass('float-right').appendTo(rowElem);
                var infoElem;
                row.addInput = function (placeholder) { infoElem = $('<input>').addClass('info float-right').attr({ type: 'text', placeholder: placeholder }).appendTo(rowElem); return row; }
                row.addTextArea = function (placeholder) { infoElem = $('<textarea>').addClass('info float-right chat-scrollbar').attr({ placeholder: placeholder, row: 1 }).appendTo(rowElem); return row; }
                row.addDiv = function () { infoElem = $('<div>').addClass('info float-right').appendTo(rowElem); row.isDiv = true; return row; }
                row.addLink = function () { infoElem = $('<a>').addClass('info float-right').appendTo(rowElem); row.isLink = true; return row; }
                row.setIcon = function (icon) { iconElem.addClass(icon); return row; }
                row.appendTo = function (parentElem) { rowElem.appendTo(parentElem); return row; }
                row.setValue = function (value) {
                    if (row.isDiv)
                        infoElem.html(value);
                    else if (row.isLink)
                        infoElem.text(value).attr({ href: value, target: '_blank', rel: 'nofollow' });
                    else
                        infoElem.val(value);
                    return row;
                }
                row.getValue = function () { return infoElem.val().trim(); }
                row.setOnBlurListener = function (listener) {
                    infoElem.blur(function () {
                        listener();
                    });
                    return row;
                }
                row.setDisable = function (enable) {
                    infoElem.attr('disabled', enable);
                    return row;
                }
                row.setMaxLength = function (maxLength) {
                    infoElem.attr('maxLength', maxLength);
                    return row;
                }
                row.toggleClass = function (className, enable) {
                    rowElem.toggleClass(className, enable);
                    return row;
                }
            }
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

            var messageElem = $('<div>').addClass('chat-message ' + from);
            var avatarElem = $('<img>').addClass('avatar').appendTo(messageElem);
            var popupElem = $('<div>').addClass('popup').appendTo(messageElem);
            var contentElem = $('<div>').addClass('content').appendTo(popupElem);
            var statusElem = $('<i>').addClass('status').appendTo(popupElem);
            var dateElem = $('<div>').addClass('chat-date').appendTo(popupElem);

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
            popup.getMessageMode = function () { return data.messageMode; }
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
            popup.setAvatar = function (user_) {
                messageElem.addClass('has-avatar');
                avatarElem.attr({ src: user_.avatar, title: user_.name });
                return popup;
            }
            popup.remove = function () { messageElem.remove(); }
            popup.send = function () {
                service.post("sendMessage_", { userId: userData.id, message: data.message, messageMode: data.messageMode, extra: data.extra }, function (isSuccess, message, data) {
                    popup.setId(data.id);
                    popup.setStatus(isSuccess ? MESSAGE_STATUS.send : MESSAGE_STATUS.error);
                    popup.setDate(data.createDate);
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
                try {

                    var file = null;

                    if (data.messageMode == MESSAGE_MODE.status) {
                        messageElem.removeClass('chat-message').addClass('chat-status');
                        avatarElem.remove();
                        statusElem.remove();
                        var agent = agentUtility.getAgentInfo(userData.chatBoxId, data.fromId);
                        contentElem.append($('<b>').text(agent.name), "&nbsp;");
                        if (data.message == CHAT_STATUS.accept) contentElem.append(utility.r.acceptedChat);
                        if (data.message == CHAT_STATUS.reject) contentElem.append(utility.r.rejectedChat);
                        if (data.message == CHAT_STATUS.transfer) contentElem.append(utility.r.transferedChat);
                        if (data.message == CHAT_STATUS.end) contentElem.append(utility.r.endedChat);
                        contentElem.append("&nbsp;&nbsp;");
                    }

                    if (data.messageMode == MESSAGE_MODE.text) {
                        contentElem.html(utility.convertTextMessage(data.message));
                        utility.changDirection(contentElem, contentElem.text());
                    }

                    if (data.messageMode == MESSAGE_MODE.upload) {
                        file = data.message;
                        data.messageMode = MESSAGE_MODE.file;
                        if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file['type']) != -1) data.messageMode = MESSAGE_MODE.picture;
                        else if (file['type'].indexOf('audio') != -1) data.messageMode = MESSAGE_MODE.sound;
                    }

                    if (data.messageMode == MESSAGE_MODE.picture) {
                        var imgLink = $('<a>').appendTo(contentElem);
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
                            contentElem.append(progress.getUI());
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
                        var btnDownload = $('<a>').addClass('message-icon').append(downloadIcon).appendTo(contentElem);
                        var extra = data.extra ? JSON.parse(data.extra) : {};


                        if (file) {
                            var progress = new utility.circleProgress(35, '#EFFDDE');
                            contentElem.append(progress.getUI());
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
                        $('<div>').addClass('message-title').text(extra.name).attr('title', extra.name).appendTo(contentElem);
                        $('<div>').addClass('message-detail').text(utility.bytesToSize(extra.size)).appendTo(contentElem);
                    }

                    if (data.messageMode == MESSAGE_MODE.form) {
                        var extra = JSON.parse(data.extra);
                        var icon = $('<div>').css({ 'background-color': '#' + extra.color }).addClass('message-icon').append($('<i>').css({ 'color': '#fff' }).addClass('fas icon-list-alt')).appendTo(contentElem);
                        $('<div>').attr({ 'title': extra.formName }).addClass('message-title').text(extra.formName).appendTo(contentElem);
                        if (extra.url) {
                            $('<div>').addClass('message-detail').text(utility.r.requestSendForm).appendTo(contentElem);
                        } else {
                            icon.css({ 'cursor': 'pointer' }).click(function () {
                                showFormInfo(data.message, extra.formName);
                            });
                            $('<div>').addClass('message-detail').text(utility.r.submitForm).appendTo(contentElem);
                        }
                    }


                    function upload(progress, callback) {
                        service.post('uploadFile_', { file: file, userId: userData.id }, function (isSuccess, message, url) {
                            progress.setProgress(100);
                            if (isSuccess) {
                                data.message = url[1];
                                popup.send();
                                if (callback) callback(url[0]);
                            } else {
                                popup.setStatus(3);
                            }
                        }, function (percent) {
                            progress.setProgress(percent);
                        });
                    }

                    contentElem.addClass('content-type-' + data.messageMode);
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


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Service() {
        var service = this;
        var arrSocketCallback = [];
        var tabId = utility.randomId('tab_');
        service.ACTION_TYPE = {
            CHANGE_CHAT_STATUS: 1,
            RECECIVE_MESSAGE: 2,
            USER_ONLINE_STATUS: 3,
            SEND_MESSAGE: 4,
            VIEW_MESSAGE: 5,
            IS_TYPING: 6,
            UPDATE_USER_INFO: 7
        };

        service.getTabId = function () { return tabId };

        addSocketEventListener('ChatAgent', function (socketData, tabNum) {
            var action = socketData[0];
            var data = socketData[1];
            $.each(arrSocketCallback, function (c, action_) {
                if (action_[0] == action) action_[1](data, tabNum);
            });
        });

        service.addSocketEventListener = function (action, callback) {
            arrSocketCallback.push([action, callback]);
        }

        service.post = function (methodName, data, callback, onProgress) {
            var url = '/' + $('#HFdomain').val() + '/chatclient/' + methodName;
            var formData = new FormData();
            formData.append("token", [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()]);//test
            formData.append("tabId", tabId);//test
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

            request.open('POST', url);
            request.send(formData);
        }

    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function AgentUtility() {
        var agentUtility = this;
        var agents = {};
        $.each(ChatParameter, function (c, chatBox) {
            $.each(chatBox.agents, function (a, agent) {
                agents[chatBox.id + '_' + agent.userId] = agent;
            });
        });

        agentUtility.getAgentInfo = function (chatBoxId, agentId) {
            var agent = agents[chatBoxId + '_' + agentId];
            if (agent) {
                if (agent.avatar == '') agent.avatar = '../themes/resources/images/noimage.jpg';
                return agent;
            } else {
                return { userId: agentId, name: '', avatar: '../themes/resources/images/noimage.jpg' };
            }
        }

        agentUtility.getChatBoxInfo = function (chatboxId) {
            return $.grep(ChatParameter, function (s) { return s.id == chatboxId })[0];
        }

        agentUtility.getChatBoxAgents = function (chatboxId) {
            return agentUtility.getChatBoxInfo(chatboxId).agents;
        }

        agentUtility.getCurrentAgent = function (chatBoxId) { return agentUtility.getAgentInfo(chatBoxId, $('#HFUser_id').val()) };
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function Utility() {
        var self = this;

        var resources = {
            en: {
                chat: 'Conversations',
                openChat: 'Open',
                solvedChat: 'Solved',
                writeAMessage: 'Write a message …',
                sendFile: 'Send file',
                requestSendForm: 'Request for send form',
                submitForm: 'Submit form',
                dragHere: 'Drag file here',
                today: 'Today',
                yesterday: 'Yesterday',
                isTyping: 'Is typing ',
                acceptChat: 'Accept',
                rejectChat: 'Reject',
                transferChat: 'Transfer',
                endChat: 'End',
                closeChat: 'Close',
                setEmail: 'Set email',
                setPhone: 'Set phone',
                setNote: 'Set note',
                createCust: 'Add customer',
                assignCust: 'Assign customer',
                viewCust: 'View customer',
                acceptedChat: 'accepted',
                rejectedChat: 'rejected',
                transferedChat: 'transfered',
                endedChat: 'ended',
                search: 'Search …',
                searchSavedMessage: 'Search saved message …',
                manage: 'Manage',
                emptyChatBox: 'Choose a conversation',
                yes: 'Yes',
                no: 'No',
                deleteMessage: 'Are you sure you want to delete?',
                manageSavedMessage: 'Manage saved message',
                save: 'Save',
                cancel: 'Cancel',
                emptySavedMessage: 'There is no message.<br>Click the Manage option to add.',
                maxUploadSizeMessage: 'It is possible to upload up to 5 MB',
                send: 'Send',
                pleaseSelect: 'Please select',
                requestFormHelp: 'Forms that can be accessed outside the system are shown in the list above.<br><a class="ravesh-link" href="http://ravesh.me/enchatform" target="_blank">Click on Help</a> to automatically register form fields.',
                emptyChatStart: 'There is no conversation'
            },
            fa: {
                chat: 'گفتگوی آنلاین',
                openChat: 'گفتگوهای باز',
                solvedChat: 'گفتگوها',
                writeAMessage: 'پیغام خود را وارد کنید …',
                sendFile: 'ارسال فایل',
                requestSendForm: 'درخواست ثبت فرم',
                submitForm: 'ثبت فرم',
                dragHere: 'فایل‌ خود را اینجا رها کنید',
                today: 'امروز',
                yesterday: 'دیروز',
                isTyping: 'در حال تایپ ',
                acceptChat: 'قبول کردن',
                rejectChat: 'رد کردن',
                transferChat: 'انتقال گفتگو',
                endChat: 'پایان گفتگو',
                closeChat: 'بستن',
                setEmail: 'افزودن ایمیل',
                setPhone: 'افزودن تلفن',
                setNote: 'افزودن توضیحات',
                createCust: 'ایجاد مشتری',
                assignCust: 'مربوط به مشتری',
                viewCust: 'مشاهده&zwnj;ی اطلاعات مشتری',
                acceptedChat: 'وارد گفتگو شد',
                rejectedChat: 'رد کرد',
                transferedChat: 'انتقال داد',
                endedChat: 'پایان داد',
                search: 'جستجو …',
                searchSavedMessage: 'جستجوی پیغام آماده …',
                manage: 'مدیریت',
                emptyChatBox: 'یک گفتگو برای نمایش انتخاب کنید',
                yes: 'بله',
                no: 'خیر',
                deleteMessage: 'آیا مطمئن به حذف هستید؟',
                manageSavedMessage: 'مدیریت پیغام آماده',
                save: 'ذخیره',
                cancel: 'انصراف',
                emptySavedMessage: 'پیغام آماده وجود ندارد.<br>برای افزودن بر روی گزینه مدیریت کلیک کنید.',
                maxUploadSizeMessage: 'امکان بارگذاری حداکثر 5 مگابایت وجود دارد',
                send: 'ارسال',
                pleaseSelect: 'انتخاب کنبد',
                requestFormHelp: 'فرم‌هایی که قابلیت دسترسی خارج از سیستم دارند در لیست بالا نمایش داده شده&zwnj;اند.<br>برای ثبت خودکار فیلدهای فرم بر روی <a class="ravesh-link" href="http://ravesh.me/chatform" target="_blank">راهنما کلیک کنید</a>.',
                emptyChatStart: 'هیچ گفتگویی وجود ندارد'
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
        self.getMomentTime = function (mDate) {
            if (!mDate) mDate = moment();
            if (moment(new Date()).isSame(mDate, 'day')) {
                return mDate.format('LT');
            } else if (moment(new Date()).subtract(1, 'days').isSame(mDate, 'day')) {
                return self.r.yesterday + ' ' + mDate.format('LT');
            }
            return mDate.format('L');
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
            var helper = $('<div>').addClass('chat-upload-helper').append($('<div>').append($('<div>').append($('<i>').addClass('icon-upload'), $('<div>').text(self.r.dragHere))));
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

            uploadFile.change(function () {
                selectedFile = uploadFile[0].files[0];
                if (!checkSize(selectedFile)) return false;
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
                if (!checkSize(selectedFile)) return false;
                callback(selectedFile);
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
                        if (!checkSize(selectedFile)) return false;
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


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function SavedMessage() {
        var savedMessage = this;
        var localData = {};

        savedMessage.getListUI = function (chatBoxId, selectListener, addListener, hideListener) {
            var arrData = [];
            var container = $('<div>').addClass('saved-message-container');
            var searchContainer = $('<div>').addClass('saved-message-search').appendTo(container);
            var inputSearch = $('<input>').addClass('float-right').attr({ type: 'text', placeholder: utility.r.searchSavedMessage }).appendTo(searchContainer);
            var btnManage = $('<button>').addClass('gray float-left').text(utility.r.manage).appendTo(searchContainer);
            var content = $('<div>').addClass('saved-message-content chat-scrollbar white-scroll').appendTo(container);

            inputSearch.keyup(function () {
                var str = inputSearch.val();
                $.each(arrData, function (i, item) {
                    item.row.toggle(item.value.indexOf(str) != -1);
                });
            })

            btnManage.click(function () {
                savedMessage.manageDialog(chatBoxId, function () { getData(); return true; });
                hideListener();
                return false;
            });

            function getData() {
                content.empty().append($('<div>').addClass('spinner'));
                getList(chatBoxId, function (data) {
                    arrData = data;
                    content.empty();
                    $.each(data, function (i, item) {
                        item.row = $('<div>').addClass('item').appendTo(content);
                        $('<div>').click(function () { selectListener(item.value) }).addClass('text float-right').text(item.value.replace(/\n/g, ' ↵ ')).appendTo(item.row);
                        $('<i>').click(function () { addListener(item.value) }).addClass('icon-plus float-left').appendTo(item.row);
                    });
                    inputSearch.toggle(data.length != 0);
                    if (data.length == 0) {
                        content.append($('<div>').append(utility.r.emptySavedMessage).css({ 'text-align': 'center', 'padding-top': '10px', 'color': '#777', 'font-size': '11px' }));
                    }
                });
            }
            getData();

            return container;
        }

        savedMessage.manageDialog = function (chatBoxId, onClose) {
            var dialog = RaveshUI.showDialog({ title: utility.r.manageSavedMessage, icon: 'icon-comment-alt-lines', width: 450 });
            var savedMessageId = 0;

            var insertContainer = $('<div>').addClass('saved-message-dialog-head');
            var container = $('<div>').addClass('saved-message-dialog');
            dialog.setSubHead(insertContainer);
            dialog.setContent(container);
            dialog.setOnClose(onClose);

            var input = $('<textarea>').attr({ 'rows': 1, placeholder: utility.r.writeAMessage }).addClass('float-right chat-scrollbar').appendTo(insertContainer).focus();
            var btnSave = $('<button>').addClass('ravesh-button save').text(utility.r.save).appendTo(insertContainer);
            var btnCancel = $('<button>').attr('disabled', true).addClass('ravesh-button').text(utility.r.cancel).appendTo(insertContainer);

            btnSave.click(function () {
                dialog.showLoading(true);
                service.post('saveSavedMessage_', { chatBoxId: chatBoxId, id: savedMessageId, text: input.val() }, function (isSuccess, message, data) {
                    dialog.hideLoading();
                    if (isSuccess) {
                        if (savedMessageId == 0) {
                            localData[chatBoxId].push(data);
                        } else {
                            $.grep(localData[chatBoxId], function (s) { return s.id == savedMessageId })[0].value = input.val();
                        }
                        getData();
                        btnCancel.click();
                    }
                });
                return false;
            });

            btnCancel.click(function () {
                input.val('').focus();
                savedMessageId = 0;
                btnCancel.attr('disabled', true);
                return false;
            });

            function getData() {
                container.empty();
                var table = $('<table>').appendTo(container);

                getList(chatBoxId, function (data) {
                    container.toggle(data.length > 0);
                    $.each(data, function (i, item) {

                        var btnEdit = $('<i>').addClass('icon-pencil').click(function () {
                            input.val(item.value);
                            savedMessageId = item.id;
                            btnCancel.attr('disabled', false);
                        });

                        var btnRemove = $('<i>').addClass('icon-trash').click(function () {
                            RaveshUI.deleteConfirmModal(utility.r.yes, utility.r.no, utility.r.deleteMessage, function () {
                                dialog.showLoading(true);
                                service.post('removeSavedMessage_', { chatBoxId: chatBoxId, id: item.id }, function (isSuccess, message, data) {
                                    dialog.hideLoading();
                                    if (isSuccess) {
                                        item.tr.remove();
                                        localData[chatBoxId].splice($.inArray(self, localData[chatBoxId]), 1);
                                        container.toggle(localData[chatBoxId].length > 0);
                                    }
                                });
                                btnCancel.click();
                            });
                        });

                        item.tr = $('<tr>').append(
                            $('<td>').append($('<div>').addClass('text').text(item.value.replace(/\n/g, ' ↵ '))),
                            $('<td>').css({ width: 35, 'text-align': 'center' }).append(btnEdit),
                            $('<td>').css({ width: 35, 'text-align': 'center' }).append(btnRemove)
                        ).appendTo(table);

                    });
                });

            }
            getData();
        }

        function getList(chatBoxId, callback) {
            if (localData[chatBoxId]) {
                callback(localData[chatBoxId]);
                return false;
            }
            service.post('getSavedMessage_', { chatBoxId: chatBoxId }, function (isSuccess, message, data) {
                if (isSuccess) {
                    localData[chatBoxId] = data;
                    callback(data);
                } else {
                    callback([]);
                }
            });
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    function RequestForm(userData, callback) {

        var container = $('<div>').css({ padding: '0 15px 5px' });
        var dialog = RaveshUI.showDialog({ title: utility.r.requestSendForm, icon: 'icon-list-alt', width: 400 });
        dialog.addFooterButton(utility.r.send, 'submit float', sendRequestForm);
        dialog.addFooterButton(utility.r.cancel, 'float');
        dialog.setContent(container);

        var drdForms = RaveshUI.selectForm({
            dir: lang == 'fa' ? 'rtl' : 'ltr',
            defaultTitle: utility.r.pleaseSelect,
            width: '100%',
            defaultId: 0,
            getOnlyIsPublic: true
        });
        container.append(drdForms.getUI());

        container.append($('<div>').css({ 'margin-top': '15px', 'line-height': '1.5', 'font-style': 'italic' }).html(utility.r.requestFormHelp));

        function sendRequestForm() {
            var form = drdForms.getSelectedOption();
            if (form.id == 0) return false;
            var formUrl = $('#HFServerurl').val() + '/' + $('#HFdomain').val() + '/formView/' + form.id;
            var key = utility.randomId('form_');

            var params = [];
            params.push(['form_source', 'chat', 'editable']);
            params.push(['agent', $('#HFUserCode').val(), 'encrypted']);
            params.push(['user', userData.id, 'encrypted']);
            if (userData.name != '') params.push(['name', userData.name, 'encrypted']);
            if (userData.email != '') params.push(['email', userData.email, 'encrypted']);
            if (userData.phone != '') params.push(['phone', userData.phone, 'encrypted']);
            if (userData.custCode != 0) params.push(['customer', userData.custCode, 'encrypted']);
            params.push(['key', key, 'editable']);

            dialog.showLoading(true);
            FormUtility.postExtra('/pages/FormBuilder/services/FormService_.asmx/generateFormUrlParam_', { params: params },
                function (isSuccess, message, data) {
                    dialog.hideLoading();
                    if (isSuccess && callback) {
                        dialog.close();
                        callback(form, formUrl + '?' + data, key);
                    }
                }
            );
        }
    }
}
var chatList = new ChatList($("#HFlang").val(), $("#HFTimeZone").val());