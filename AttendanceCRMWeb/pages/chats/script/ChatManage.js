
(function ChatManage() {
    document.write('<div class="page-main-container"></div>');
    var containerMain = $('.page-main-container');
    var lang = $('#HFlang').val();
    var SETTING_KEY = {
        basic_title: 1,
        basic_detail: 2,
        basic_lang: 3,
        basic_color: 4,
        basic_picture: 5,
        basic_position: 6,
        basic_enable: 7,
        basic_key: 8,
        support_groups: 201
    };

    var chatManage = this;
    var utility = new Utility();

    var headElem = $('<div>').addClass('page-head').appendTo(containerMain);
    var headTitleElem = $('<div>').addClass('page-head-title float-right').appendTo(headElem);
    var headBtnHelp = $('<i>').addClass('ravesh-button btnHelp btn-help icon-question float-left').appendTo(headElem);
    var headBtnNew = $('<button>').click(function () { dialogNewTool(); return false; }).addClass('ravesh-button btn-new save float-left').text(utility.r.createNewTool).appendTo(headElem);
    var headLoading = $('<div>').addClass('spinner float-left').hide().appendTo(headElem);
    var containerList = $('<div>').addClass('page-list-container').appendTo(containerMain);
    var containerBuild = $('<div>').addClass('page-build-container').appendTo(containerMain);


    var setTitle = function (title) {
        if (title == '') {
            headTitleElem.html($('<div>').addClass('float-right').text(utility.r.chatTool));
        } else {
            var linkFormList = $('<div>').addClass('ravesh-link float-right').text(utility.r.chatTool);
            var arrow = $('<i>').addClass('icon-angle-left-dir arrow float-right');
            var titleUI = $('<div>').addClass('float-right ravesh-no-break').text(title);
            headTitleElem.empty().append(linkFormList, arrow, titleUI);
            linkFormList.click(function () {
                getChatBoxList();
                setTitle('');
                containerList.show();
                containerBuild.hide();
                headBtnNew.show();
            });
        }
    }
    setTitle('');


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    var getChatBoxList = function () {
        containerList.empty();
        headLoading.show();
        utility.post("getAllChatBox_", {}, function (isSuccess, message, data) {
            headLoading.hide();
            if (!isSuccess) return false;

            var rowsEmpty = $('<div>').addClass('empty-message').append(
                $('<div>').addClass('picture').append(new utility.CreateFAB({ width: 100, color: '#ced6db' }).animate().getUI()),
                $('<div>').addClass('title').text(utility.r.noCreateChat),
                $('<div>').addClass('message-text').text(utility.r.clickAddNewChat)
            ).hide().appendTo(containerList);
            rowsEmpty.toggle(data[0].length == 0);

            $.each(data[0], function (b, box) {
                var fab = new utility.CreateFAB(box).animate();
                var title = $('<div>').addClass('title').text(box.title);
                var detail = $('<div>').addClass('detail').text(box.detail);
                var btnSetting = $('<a>').attr({ href: '#' }).css({ 'color': '#06c' }).addClass('ravesh-button float-right').text(utility.r.settingAndGetTool);
                var btnChats = $('<a>').attr({ href: 'chat.aspx?rnd_=' + $('#HFRnd').val(), target: '_blank' }).css({ 'color': '#06c', 'margin': '10px' }).addClass('ravesh-button float-right').text(utility.r.chats);
                var btnDelete = $('<a>').attr({ href: '#' }).css({ 'color': '#CC0046' }).addClass('ravesh-button float-right').text(utility.r.remove);

                if (!box.enable) title.append($('<span>').css({ color: '#c70f02', 'font-size': '11px', 'padding': '0px 5px' }).text(utility.r.disable));

                var chatCount = data[1][box.id] || 0;
                var report = $('<div>').addClass('chat-report float-left').append($('<div>').addClass('count').text(utility.numberLocalize(chatCount)), $('<div>').addClass('text').text(utility.r.chatsReport));
                var agents = $('<div>').addClass('agents float-left');
                var otherAgents = [];
                $.each($.grep(box.agents, function (s) { return s.enable }), function (a, agent) {
                    if (a < 3) {
                        agents.append($('<img>').addClass('float-left').attr({ src: agent.avatar == '' ? '../themes/resources/images/noimage.jpg' : agent.avatar, title: agent.name }));
                    } else {
                        otherAgents.push(agent.name);
                    }
                });
                if (otherAgents.length > 0) {
                    agents.append($('<div>').addClass('other-agents float-left').text('+' + utility.numberLocalize(otherAgents.length)).attr('title', otherAgents.join(", ")));
                }

                btnSetting.click(function () {
                    buildChatBox(box.id, box.title);
                    return false;
                });

                btnDelete.click(function () {
                    RaveshUI.deleteConfirmModal(utility.r.yes, utility.r.no, utility.r.deleteChatBoxMessage, function () {
                        headLoading.show();
                        utility.post('removeChatBox_', { chatBoxId: box.id }, function (isSuccess, message, data_) {
                            headLoading.hide();
                            if (isSuccess) {
                                box.row.remove();
                                data[0].splice($.inArray(box, data[0]), 1);
                                rowsEmpty.toggle(data[0].length == 0);
                                RaveshUI.successToast(utility.r.success, utility.r.successRemoveMessage);
                            } else {
                                RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                            }
                        });
                    });
                    return false;
                });

                box.row = $('<div>')
                    .addClass('box-row')
                    .appendTo(containerList)
                    .append(
                        fab.getUI().addClass('chat-logo float-right'),
                        report,
                        title, detail,
                        btnSetting, btnChats, btnDelete,
                        agents
                    );
            });

        });
    }
    getChatBoxList();


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    var buildChatBox = function (id, title) {
        containerList.hide();
        containerBuild.empty().show();
        headBtnNew.hide();
        headLoading.show();
        setTitle(title);
        utility.post('getChatBoxProperty_', { id: id }, function (isSuccess, message, data) {
            headLoading.hide();
            if (!isSuccess) return false;
            var menuElem = $('<div>').addClass('menu-section float-right').appendTo(containerBuild);
            var contentElem = $('<div>').addClass('content-section float-left').appendTo(containerBuild);

            var menuItems = {
                basic: { title: utility.r.basicSetting, icon: 'icon-cog' },
                agents: { title: utility.r.agentSetting, icon: 'icon-user' },
                support: { title: utility.r.supportSetting, icon: 'icon-shield-alt' },
                share: { title: utility.r.shareSetting, icon: 'icon-link' }
            }

            $.each(menuItems, function (m, menuData) {
                menuData.content = $('<div>').addClass('wrapper').toggle(menuData == menuItems.basic).appendTo(contentElem);
                menuData.menu = $('<div>').addClass('item' + (menuData == menuItems.basic ? ' active' : '')).append(
                    $('<i>').addClass('float-right ' + menuData.icon),
                    $('<span>').addClass('float-right').text(menuData.title))
                .appendTo(menuElem);
                menuData.menu.toggleClass('disable', menuData.disable == true);

                menuData.onActive = function () { };
                menuData.menu.click(function () {
                    if (menuData.disable) return false;
                    $.each(menuItems, function (m2, menuData2) {
                        menuData2.content.toggle(m == m2);
                        menuData2.menu.toggleClass('active', m == m2);
                        if (m == m2 && !menuData2.selected) { menuData2.onActive(); menuData2.selected = true; }
                    });
                });
            });

            settingBasic(id, data, menuItems.basic.content);
            settingShare(id, data, menuItems.share.content);
            menuItems.agents.onActive = function () {
                settingAgent(id, data, menuItems.agents.content);
            }
            menuItems.support.onActive = function () {
                settingSupport(id, data, menuItems.support.content);
            }
        })
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function settingBasic(chatBoxId, data, container) {
        container.empty().append($('<h1>').text(utility.r.basicSetting));

        builderUtility.createSpace().appendTo(container);
        var txtTitle = builderUtility.createTextBox(utility.r.title, getSettingbyKey(SETTING_KEY.basic_title)).setWidth(200).appendTo(container);
        var txtDetail = builderUtility.createTextBox(utility.r.detail, getSettingbyKey(SETTING_KEY.basic_detail)).setWidth(200).appendTo(container);
        var drdLang = builderUtility.createDropDown(utility.r.lang, [['fa', utility.r.persian], ['en', utility.r.english]], getSettingbyKey(SETTING_KEY.basic_lang)).setWidth(200).appendTo(container);
        var drdPosition = builderUtility.createDropDown(utility.r.position, [['right', utility.r.right], ['left', utility.r.left]], getSettingbyKey(SETTING_KEY.basic_position)).setWidth(200).appendTo(container);


        var txtColor = builderUtility.createColorPicker(utility.r.color, getSettingbyKey(SETTING_KEY.basic_color), function (color) {
            fab.setColor(color);
        }).appendTo(container);
        txtColor.build();


        var rowIcon = new builderUtility.createRow(utility.r.icon).appendTo(container);
        var fab = new utility.CreateFAB({ width: 80, color: getSettingbyKey(SETTING_KEY.basic_color).value, picture: getSettingbyKey(SETTING_KEY.basic_picture).value }).animate();
        fab.getUI().addClass('sample-fab').appendTo(rowIcon.getUI());
        var btnPlaceFab = $('<div>').addClass('btn-place').appendTo(fab.getUI());
        var btnUploadFabPicture = $('<div>').css({ 'color': '#fff' }).text(utility.r.change).appendTo(btnPlaceFab);
        var btnRemoveFabPicture = $('<div>').css({ 'color': '#ffc7b6' }).text(utility.r.noImage).appendTo(btnPlaceFab);
        var uploadFileFab = $('<input>').attr({ 'type': 'file', accept: 'image/*' }).hide().appendTo(btnPlaceFab);
        var fabFile = null;
        uploadFileFab.change(function () {;
            fabFile = uploadFileFab[0].files[0];
            if (fabFile.size > 1024 * 100) {
                alert(utility.r.maxUploadSizeMessage);
                fabFile = null;
                return false;
            }
            var reader = new FileReader();
            reader.onload = function (ev) { fab.setPicture(ev.target.result); }
            reader.readAsDataURL(fabFile);
        });
        btnUploadFabPicture.click(function () {
            uploadFileFab.click();
        });
        btnRemoveFabPicture.click(function () {
            fab.setPicture('').animate();
            getSettingbyKey(SETTING_KEY.basic_picture).value = '';
            fabFile = null;
        });

        builderUtility.createSpace().appendTo(container);
        var chkEnable = builderUtility.createCheckBox(utility.r.active, getSettingbyKey(SETTING_KEY.basic_enable)).appendTo(container);

        builderUtility.createSpace().appendTo(container);
        var btnSave = builderUtility.createButton(utility.r.save, 'save', function () {
            var params = [
                txtTitle.getValue(),
                txtDetail.getValue(),
                drdLang.getValue(),
                drdPosition.getValue(),
                txtColor.getValue(),
                getSettingbyKey(SETTING_KEY.basic_picture),
                chkEnable.getValue()
            ];
            if (txtTitle.getValue().value.trim() == '') { txtTitle.input.focus(); return false };
            if (txtDetail.getValue().value.trim() == '') { txtDetail.input.focus(); return false };
            headLoading.show();
            btnSave.attr('disabled', true);
            utility.post('saveChatBoxBasicProperty_', { chatBoxId: chatBoxId, data: JSON.stringify(params), file: fabFile }, function (isSuccess, message, data_) {
                headLoading.hide();
                btnSave.attr('disabled', false);
                if (isSuccess) {
                    data = data_.concat(data);
                    settingBasic(chatBoxId, data, container);
                    RaveshUI.successToast(utility.r.success, utility.r.successMessage);
                } else {
                    RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                }
            });
        }).css({ 'margin': 0 }).appendTo(container);


        function getSettingbyKey(key, defaultValue) {
            var setting = $.grep(data, function (s) { return s.key == key });
            if (setting.length == 0) return { id: 0, key: key, value: defaultValue ? defaultValue : '' }; else return setting[0];
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function settingAgent(chatBoxId, data, container) {
        container.empty();

        headLoading.show();
        utility.post('getChatBoxAgents_', { chatBoxId: chatBoxId }, function (isSuccess, message, data) {
            headLoading.hide();
            if (!isSuccess) return false;

            builderUtility.createButton(utility.r.addNewAgent, 'save float-left', function () {
                dialogManageAgent(null, function () {
                    settingAgent(chatBoxId, data, container);
                });
            }).css({ 'margin': 0 }).appendTo(container);

            container.append($('<h1>').text(utility.r.agentSetting));
            builderUtility.createSpace().appendTo(container);

            $.each(data, function (a, agent) {
                var item = createAgentItem(agent);
                item.click(function () {
                    dialogManageAgent(agent,
                    function () {
                        settingAgent(chatBoxId, data, container);
                    }, function () {
                        item.remove();
                    });
                })
                container.append(item);
            });

            function createAgentItem(agent) {
                var row = $('<div>')
                    .addClass('row-agent float-right')
                    .toggleClass('disabled', !agent.enable)
                    .append(
                        $('<img>').addClass('avatar float-right').attr({ title: agent.name, src: agent.avatar == '' ? '../themes/resources/images/noimage.jpg' : agent.avatar }),
                        $('<div>').addClass('name').text(agent.name),
                        $('<div>').addClass('title').text(agent.title)
                    )

                return row;
            }
        });

        function dialogManageAgent(agent, saveCallback, removeCallback) {
            var dialogContainer = $('<div>').addClass('dialog-manage-agent').css({ overflow: 'hidden', padding: '5px 15px 0' });
            var dialog = RaveshUI.showDialog({ title: utility.r.addNewAgent, icon: 'icon-user', width: 380 });
            dialog.addFooterButton(utility.r.ok, 'submit float', saveAgent);
            dialog.setContent(dialogContainer);

            var rowSelectUser = new builderUtility.createRow(utility.r.selectUser).appendTo(dialogContainer);
            var drdSelectUser = new RaveshUI.selectUser({
                dir: lang == 'fa' ? 'rtl' : 'ltr',
                defaultTitle: utility.r.pleaseSelect,
                defaultId: '',
                width: '100%',
                allowSearch: true,
                onSelected: function (opt) {
                    chkIsDefaultProperty.getUI().toggle(opt.userId != 0);
                    chkEnable.getUI().toggle(opt.userId != 0);
                    if (opt.userId == 0) {
                        divChangeProperty.hide();
                        chkIsDefaultProperty.setValue('true');
                    }
                    dialog.refreshHeight();
                }
            });
            rowSelectUser.append(drdSelectUser.getUI());


            var chkIsDefaultProperty = new builderUtility.createRadio([['true', utility.r.defaultUserInfo], ['false', utility.r.changeUserInfo]], { value: 'true' }, function (item) {
                divChangeProperty.toggle(item == 'false');
                dialog.refreshHeight();
            }).appendTo(dialogContainer);
            var divChangeProperty = $('<div>').hide().appendTo(dialogContainer);
            builderUtility.createSpace(30).appendTo(divChangeProperty);

            var avatar = '';
            var avatarElem = $('<div>').addClass('agent-avatar').appendTo(divChangeProperty);
            var imgAvatar = $('<img>').attr({ src: '../themes/resources/images/noimage.jpg' }).appendTo(avatarElem);
            var btnPlaceAvatar = $('<div>').addClass('btn-place').appendTo(avatarElem);
            var btnUploadAvatarPicture = $('<div>').css({ 'color': '#fff' }).text(utility.r.change).appendTo(btnPlaceAvatar);
            var btnRemoveAvatarPicture = $('<div>').css({ 'color': '#ffc7b6' }).text(utility.r.noImage).appendTo(btnPlaceAvatar);
            var uploadFileAvatar = $('<input>').attr({ 'type': 'file', accept: 'image/*' }).hide().appendTo(btnPlaceAvatar);
            var avatarFile = null;
            uploadFileAvatar.change(function () {;
                avatarFile = uploadFileAvatar[0].files[0];
                if (avatarFile.size > 1024 * 100) {
                    alert(utility.r.maxUploadSizeMessage);
                    avatarFile = null;
                    return false;
                }
                var reader = new FileReader();
                reader.onload = function (ev) { imgAvatar.attr({ src: ev.target.result }); }
                reader.readAsDataURL(avatarFile);
            });
            btnUploadAvatarPicture.click(function () {
                uploadFileAvatar.click();
            });
            btnRemoveAvatarPicture.click(function () {
                imgAvatar.attr({ src: '../themes/resources/images/noimage.jpg' });
                avatarFile = null;
                avatar = '';
            });

            var txtName = builderUtility.createTextBox(utility.r.name, { value: '' }).setWidth('100%').setMaxLength(200).appendTo(divChangeProperty);
            var txtTitle = builderUtility.createTextBox(utility.r.agentTitle, { value: '' }).setWidth('100%').setMaxLength(200).appendTo(divChangeProperty);
            var chkEnable = builderUtility.createCheckBox(utility.r.active, { value: true }).appendTo(dialogContainer);



            if (agent) {
                dialog.setTitle(utility.r.editAgent);
                dialog.setDetail(agent.name);
                dialog.addFooterButton(utility.r.remove, 'red float-rev', removeAgent);
                drdSelectUser.setDisable(true);
                drdSelectUser.setSelectedByUserId(agent.userId);
                divChangeProperty.toggle(!agent.isDefaultProperty);
                if (!agent.isDefaultProperty) {
                    if (agent.avatar != '') imgAvatar.attr({ 'src': agent.avatar });
                    avatar = agent.avatar;
                    txtName.input.val(agent.name);
                    txtTitle.input.val(agent.title);
                }
                chkEnable.setValue(agent.enable);
                chkIsDefaultProperty.setValue(agent.isDefaultProperty.toString().toLowerCase());
                chkEnable.getUI().show();
            } else {
                chkIsDefaultProperty.getUI().hide();
                chkEnable.getUI().hide();
            }


            function saveAgent() {
                var postData = {
                    id: agent ? agent.id : 0,
                    chatBoxId: chatBoxId,
                    userId: drdSelectUser.getSelectedOption().userId,
                    defaultName: drdSelectUser.getSelectedOption().title,
                    isDefaultProperty: chkIsDefaultProperty.getValue().value == 'true',
                    name: txtName.getValue().value.trim(),
                    title: txtTitle.getValue().value.trim(),
                    avatar: avatar,
                    enable: chkEnable.getValue().value,
                    file: avatarFile
                }
                if (postData.userId == 0) return false;
                if (!postData.isDefaultProperty) {
                    if (postData.name == '') { txtName.input.focus(); return false; }
                    if (postData.title == '') { txtTitle.input.focus(); return false; }
                }
                dialog.showLoading(true);
                utility.post("saveAgent_", postData, function (isSuccess, message, data) {
                    dialog.hideLoading();
                    if (isSuccess) {
                        if (data.id == -1) {
                            RaveshUI.warningToast(utility.r.error, utility.r.alreadyRegisteredUser);
                            return false;
                        }
                        dialog.close();
                        if (saveCallback) saveCallback();
                        RaveshUI.successToast(utility.r.success, utility.r.successMessage);
                    } else {
                        RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                    }
                });
            }

            function removeAgent() {
                RaveshUI.deleteConfirmModal(utility.r.yes, utility.r.no, utility.r.deleteMessage, function () {
                    dialog.showLoading(true);
                    utility.post("removeAgent_", { chatBoxId: chatBoxId, userId: drdSelectUser.getSelectedOption().userId, name: agent.name }, function (isSuccess, message, data) {
                        dialog.hideLoading();
                        if (isSuccess) {
                            dialog.close();
                            if (removeCallback) removeCallback();
                            RaveshUI.successToast(utility.r.success, utility.r.successRemoveMessage);
                        } else {
                            RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                        }
                    });
                });
            }
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function settingShare(chatBoxId, data, container) {
        var key = $.grep(data, function (s) { return s.key == SETTING_KEY.basic_key })[0];
        var url = $('#HFServerurl').val() + '/' + $('#HFdomain').val() + '/chatclient/script/' + key.value + '.js';
        container.empty().append($('<h1>').text(utility.r.shareSetting));
        container.append($('<div>').text(utility.r.shareMessage).css({ 'margin-bottom': '10px', 'color': '#666', 'font-style': 'italic' }));
        container.append(utility.createCode('<span style="color: #007700">&lt;script </span><span style="color: #0000CC">type=</span><span style="background-color: #fff0f0">&quot;text/javascript&quot;</span><span style="color: #007700">&gt;</span><span style="color: #333333">!</span><span style="color: #008800; font-weight: bold">function</span>(){<span style="color: #008800; font-weight: bold">var</span> t<span style="color: #333333">=</span><span style="color: #007020">window</span>,e<span style="color: #333333">=</span><span style="color: #007020">document</span>;<span style="color: #008800; font-weight: bold">function</span> a(){<span style="color: #008800; font-weight: bold">var</span> t<span style="color: #333333">=</span>e.createElement(<span style="background-color: #fff0f0">&quot;script&quot;</span>);t.type<span style="color: #333333">=</span><span style="background-color: #fff0f0">&quot;text/javascript&quot;</span>,t.async<span style="color: #333333">=!</span><span style="color: #0000DD; font-weight: bold">0</span>,t.src<span style="color: #333333">=</span><span style="background-color: #fff0f0">&quot;' + url + '&quot;</span>,e.getElementsByTagName(<span style="background-color: #fff0f0">&quot;head&quot;</span>)[<span style="color: #0000DD; font-weight: bold">0</span>].appendChild(t)}<span style="background-color: #fff0f0">&quot;complete&quot;</span><span style="color: #333333">===</span>e.readyState<span style="color: #333333">?</span>a()<span style="color: #333333">:</span>t.attachEvent<span style="color: #333333">?</span>t.attachEvent(<span style="background-color: #fff0f0">&quot;onload&quot;</span>,a)<span style="color: #333333">:</span>t.addEventListener(<span style="background-color: #fff0f0">&quot;load&quot;</span>,a,<span style="color: #333333">!</span><span style="color: #0000DD; font-weight: bold">1</span>)}();<span style="color: #007700">&lt;/script&gt;</span>'));
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function settingSupport(chatBoxId, data, container) {
        container.empty().append($('<h1>').text(utility.r.supportSetting));
        container.append($('<div>').css({ 'margin-bottom': '10px', 'color': '#666', 'font-style': 'italic' }).append(utility.r.supportSettingHelp));

        headLoading.show();
        utility.post("getSupportGroups_", {}, function (isSuccess, message, groups) {
            headLoading.hide();
            if (isSuccess) {
                createSetting(groups);
            } else {
                RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
            }
        });

        function createSetting(groups) {
            var selectedGroups = getSettingbyKey(SETTING_KEY.support_groups).value.split(",");
            var groupCover = $('<div>').addClass('checkbox-group-cover float-right').css({ width: '100%', 'margin': '10px 0 20px' }).appendTo(container);
            $.each(groups, function (g, group) {
                var id = utility.randomId();
                group[2] = $('<input>').attr({ type: 'checkbox', id: id, value: group[0], checked: selectedGroups.indexOf(group[0]) != -1 }).addClass('float-right');
                $('<div>')
                    .addClass('checkbox-cover float-right')
                    .append(
                        group[2],
                        $('<label>').css({ 'line-height': '1.9' }).addClass('float-right').attr('for', id).append(group[1])
                    )
                    .css({ 'width': '25%', 'min-width': '250px', 'margin-bottom': '5px' })
                    .appendTo(groupCover);
            });

            if (groups.length == 0) {
                container.append($('<div>').css({ 'margin': '30px 0', 'font-style': 'italic', 'font-size': '13px', 'text-align': 'center' }).append(utility.r.emptySupportGroup));
                return false;
            }

            var btnSave = builderUtility.createButton(utility.r.save, 'save', function () {
                var arrIds = [];
                $.each(groups, function (g, group) { if (group[2].is(':checked')) arrIds.push(group[0]) });
                var settingGroups = getSettingbyKey(SETTING_KEY.support_groups);
                settingGroups.value = arrIds.join(",");
                var params = [settingGroups];

                headLoading.show();
                btnSave.attr('disabled', true);
                utility.post('saveChatBoxSupportProperty_', { chatBoxId: chatBoxId, data: JSON.stringify(params) }, function (isSuccess, message, data_) {
                    headLoading.hide();
                    btnSave.attr('disabled', false);
                    if (isSuccess) {
                        data = data_.concat(data);
                        RaveshUI.successToast(utility.r.success, utility.r.successMessage);
                    } else {
                        RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                    }
                });
            }).css({ 'margin': 0 }).appendTo(container);
        }

        function getSettingbyKey(key, defaultValue) {
            var setting = $.grep(data, function (s) { return s.key == key });
            if (setting.length == 0) return { id: 0, key: key, value: defaultValue ? defaultValue : '' }; else return setting[0];
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function dialogNewTool() {
        var container = $('<div>').addClass('dialog-new-tool-info').css({ overflow: 'hidden', padding: '5px 20px' });
        var dialog = RaveshUI.showDialog({ title: utility.r.createNewTool, width: 410 });
        dialog.addFooterButton(utility.r.ok, 'submit float', createNewTool);
        dialog.setContent(container);

        var txtTitle = $('<input>').attr({ 'type': 'text', maxLength: 200, 'placeholder': utility.r.sampleTitle }).css({ 'width': 250 }).addClass('ravesh-input float-right');
        var coverTitle = $('<div>').addClass('ravesh-input-cover side-label').append(
                            $('<span>').addClass('ravesh-label float-right').text(utility.r.title),
                            txtTitle
                          );

        var txtDetail = $('<input>').attr({ 'type': 'text', maxLength: 200, 'placeholder': utility.r.sampleDetail }).css({ 'width': 250 }).addClass('ravesh-input float-right');
        var coverDetail = $('<div>').addClass('ravesh-input-cover side-label').css({ 'margin-bottom': 0 }).append(
                            $('<span>').addClass('ravesh-label float-right').text(utility.r.detail),
                            txtDetail
                          );

        container.append(coverTitle, coverDetail);

        txtTitle.focus();

        function createNewTool() {
            var title = txtTitle.val().trim();
            var detail = txtDetail.val().trim();
            if (title == '') { txtTitle.focus(); return false };
            if (detail == '') { txtDetail.focus(); return false };
            dialog.showLoading(true);
            utility.post('saveNewChatBox_', { title: title, detail: detail, lang: lang }, function (isSuccess, message, data) {
                dialog.hideLoading();
                if (isSuccess) {
                    dialog.close();
                    RaveshUI.successToast(utility.r.success, utility.r.successMessage);
                    getChatBoxList();
                    buildChatBox(data.id, data.title);
                } else {
                    RaveshUI.errorToast(utility.r.error, utility.r.errorMessage);
                }
            });
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    function Utility() {
        var self = this;
        var resources = {
            en: {
                chatTool: 'Conversation tool',
                createNewTool: 'Create new tool',
                save: 'Save',
                cancel: 'Cancel',
                settingAndGetTool: 'Setting and get code',
                chats: 'Conversations',
                remove: 'Remove',
                chatsReport: 'Conversation done',
                title: 'Title',
                detail: 'Detail',
                ok: 'Ok',
                sampleTitle: 'Support',
                sampleDetail: 'We reply immediately',
                success: 'Success',
                error: 'Error',
                successMessage: 'The operation was successful',
                successRemoveMessage: 'Deletion completed successfully',
                errorMessage: 'The operation failed',
                basicSetting: 'Basic Setting',
                agentSetting: 'Agents',
                supportSetting: 'Support',
                shareSetting: 'Get code',
                disable: 'Disable',
                yes: 'Yes',
                no: 'No',
                deleteMessage: 'Are you sure you want to delete?',
                deleteChatBoxMessage: 'Are you sure you want to delete?<br>If deleted, the chat history will also be cleared',
                alreadyRegisteredUser: 'This user is already registered',
                copyCode: 'Copy code',
                shareMessage: 'Place the code on the site to display the chat tool',
                maxUploadSizeMessage: 'It is possible to upload up to 100 KB',
                noCreateChat: 'Conversation tool not created',
                clickAddNewChat: 'Click "Create new tool" to add',
                lang: 'Language',
                persian: 'Persian',
                english: 'English',
                position: 'Position',
                right: 'Right',
                left: 'Left',
                color: 'Color',
                icon: 'Icon',
                change: 'Change',
                noImage: 'No image',
                active: 'Active',
                addNewAgent: 'Add new agent',
                selectUser: 'Select user',
                pleaseSelect: 'Please select',
                defaultUserInfo: 'default user info',
                changeUserInfo: 'Change user info',
                name: 'Name',
                agentTitle: 'Title',
                editAgent: 'Edit agent',
                supportSettingHelp: 'Users in selected groups view the chat tool in their support panel.',
                emptySupportGroup: 'Support group not defined'
            },
            fa: {
                chatTool: 'ابزار گفتگوی آنلاین',
                createNewTool: 'ایجاد ابزار جدید',
                save: 'ذخیره',
                cancel: 'انصراف',
                settingAndGetTool: 'تنظیمات و دریافت ابزار',
                chats: 'گفتگوها',
                remove: 'حذف',
                chatsReport: 'گفتگو انجام شده',
                title: 'عنوان',
                detail: 'توضیحات',
                ok: 'تایید',
                sampleTitle: 'پشتیبانی',
                sampleDetail: 'پاسخگوی شما هستیم',
                success: 'موفق',
                error: 'خطا',
                successMessage: 'ذخیره سازی با موفقیت انجام شد',
                successRemoveMessage: 'حذف با موفقیت انجام شد',
                errorMessage: 'عملیات با خطا مواجه شد',
                basicSetting: 'تنظیمات پایه',
                agentSetting: 'اپراتورها',
                supportSetting: 'پنل پشتیبانی',
                shareSetting: 'دریافت کد',
                disable: 'غیر فعال',
                yes: 'بله',
                no: 'خیر',
                deleteMessage: 'آیا مطمئن به حذف هستید؟',
                deleteChatBoxMessage: 'آیا مطمئن به حذف هستید؟<br>در صورت حذف، تاریخچه گفتگوها نیز پاک خواهد شد',
                alreadyRegisteredUser: 'این کاربر قبلا ثبت شده است',
                copyCode: 'کپی گرفتن از کدها',
                shareMessage: 'برای نمایش ابزار گفتگو، کد زیر را در سایت خود قرار دهید',
                maxUploadSizeMessage: 'امکان بارگذاری حداکثر 100 کیلوبایت وجود دارد',
                noCreateChat: 'ابزار گفتگو ایجاد نشده است',
                clickAddNewChat: 'برای افزودن بر روی "ایجاد ابزار جدید" کلیک کنید',
                lang: 'زبان',
                persian: 'فارسی',
                english: 'انگلیسی',
                position: 'موقعیت',
                right: 'راست',
                left: 'چپ',
                color: 'رنگ',
                icon: 'آیکون',
                change: 'تغییر',
                noImage: 'بدون تصویر',
                active: 'فعال',
                addNewAgent: 'افزودن اپراتور جدید',
                selectUser: 'انتخاب کاربر',
                pleaseSelect: 'انتخاب کنید',
                defaultUserInfo: 'اطلاعات پیشفرض کاربر',
                changeUserInfo: 'تغییر اطلاعات کاربر',
                name: 'نام',
                agentTitle: 'عنوان | سِمت',
                editAgent: 'ویرایش اپراتور',
                supportSettingHelp: 'کاربران پشتیانی که در گروه&zwnj;های انتخاب شده هستند ابزار گفتگو را در پنل پشتیبانی خود مشاهده می&zwnj;کنند.',
                emptySupportGroup: 'گروه پشتیبانی تعریف نشده است'
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
        self.post = function (methodName, data, callback, onProgress) {
            var url = '/' + $('#HFdomain').val() + '/chatclient/' + methodName;
            var formData = new FormData();
            formData.append("token", [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()]);
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
        self.CreateFAB = function (options) {
            var fab = this;

            var defaultOptions = {
                color: '#03A9F4',
                picture: '',
                width: 60
            }
            options = $.extend(defaultOptions, options || {});

            fab.getUI = function () { return container };

            var container = $('<div>').css({ width: options.width + 'px', height: options.width + 'px', 'border-radius': '50%', 'box-sizing': 'border-box', 'overflow': 'hidden' });

            fab.setColor = function (color) {
                container.css({ 'background-color': color });
                return fab;
            }
            fab.setColor(options.color);

            fab.setPicture = function (picture) {
                container.css({ 'background-image': 'unset' });
                container.find('svg').remove();
                if (picture == '') {
                    var svg = $(makeSVG('svg', { 'viewBox': '0 0 100 100' })).appendTo(container);
                    var popup = $(makeSVG('rect', { x: "23", y: "30", width: "53", height: "40", rx: "20", ry: "20", fill: "#fff" })).appendTo(svg);
                    var arrow = $(makeSVG('path', { d: "M43,45V83L62,64Z", fill: "#fff" })).appendTo(svg);
                    var dot1 = $(makeSVG('circle', { cx: "38", cy: "50", r: "4", fill: "#ccc" })).css({ transition: 'all 0.2s', 'transform-origin': 'center' }).appendTo(svg);
                    var dot2 = $(makeSVG('path', { d: "M54,50a4,4,0,0,1-8,0Z", fill: "#ccc" })).appendTo(svg);
                    var dot3 = $(makeSVG('circle', { cx: "62", cy: "50", r: "4", fill: "#ccc" })).css({ transition: 'all 0.2s', 'transform-origin': 'center' }).appendTo(svg);


                    fab.animate = function () {
                        var blind = function () {
                            dot1.css({ 'transform': 'scale(1 ,0.2)' });
                            dot3.css({ 'transform': 'scale(1 ,0.2)' });
                            setTimeout(function () {
                                dot1.css({ 'transform': 'scale(1)' });
                                dot3.css({ 'transform': 'scale(1)' });
                            }, 200);
                        }
                        var anim = function () {
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
                    container.css({ 'background-image': 'url(\'' + picture + '\')', 'background-size': 'cover' });
                }
                return fab;
            }
            fab.setPicture(options.picture);

            fab.stopAnimate = function () { clearInterval(fab.timer); return fab; }


            function makeSVG(tag, attrs) {
                var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                for (var k in attrs) el.setAttribute(k, attrs[k]);
                return el;
            }
        }
        self.randomId = function (prefix) {
            return (prefix ? prefix : 'id') + Math.random().toString(36).substr(2, 10);
        }
        self.selectText = function (domElem) {
            if (document.selection) { // IE
                var range = document.body.createTextRange();
                range.moveToElementText(domElem);
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(domElem);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        }
        self.createCode = function (code, noComment) {
            if (!noComment) {
                var commentSite = $('#HFlang').val() == 'fa' ? 'RAVESH CRM CHAT' : 'PalCRM';
                code = '<span style="color: #888888">&lt;!--START---- ' + commentSite + ' -----&gt;</span>' +
                       '<br>' + code + '<br>' +
                       '<span style="color: #888888">&lt;!--END--- ' + commentSite + ' -----&gt;</span>';
            }

            var content = $('<div>').addClass('chat-code-snippet');
            var btnCopy = $('<div>').addClass('btn-copy').append($('<i>').addClass('icon-duplicate')).attr('title', utility.r.copyCode);
            var codeWrapper = $('<div>').addClass('code-snippet').html(code);
            content.append(codeWrapper, btnCopy);

            codeWrapper.click(function () {
                self.selectText(codeWrapper[0]);
            });

            btnCopy.click(function () {
                self.selectText(codeWrapper[0]);
                document.execCommand("copy");
            });

            return content;
        }
    }


    // /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    var builderUtility = {
        createSpace: function (height) {
            if (!height) height = 20;
            return $('<div>').css({ width: '100%', height: height, 'float': 'right' });
        },
        createRow: function (titleStr) {
            var self = this;
            var container = $('<div>').addClass('ravesh-input-cover');
            var title = $('<span>').addClass('ravesh-label').append($('<span>').addClass('float-right').text(titleStr)).appendTo(container);
            var content = $('<div>').appendTo(container);
            self.append = function (elem) { content.append(elem); return self; };
            self.appendTo = function (parent) { container.appendTo(parent); return self; };
            self.getUI = function () { return container };
            self.setHelper = function (helpStr) {
                title.append($('<i>')
                     .addClass('icon-help float-right')
                     .css({ 'font-size': 14, 'margin': '-1px 3px', 'cursor': 'help' })
                     .tooltiper({ textAlign: 'justify', padding: 10, content: helpStr }));
            }
        },
        createTextBox: function (title, setting) {
            var self = new builderUtility.createRow(title);
            self.input = $('<input>').addClass('ravesh-input').attr('type', 'text').val(setting.value || '');
            self.append(self.input);
            self.setMaxLength = function (maxLength) { self.input.attr('maxLength', maxLength); return self; };
            self.setWidth = function (width) { self.input.css('width', width); return self; };
            self.getValue = function () { setting.value = self.input.val(); return setting }
            return self;
        },
        createLink: function (title, callback) {
            return $('<a>').attr('href', '#').addClass('ravesh-link float-right').text(title).click(function () {
                callback();
                return false;
            });
        },
        createButton: function (title, cssClass, callback) {
            return $('<button>').addClass('ravesh-button ' + cssClass).text(title).click(function () {
                callback();
                return false;
            });
        },
        createDropDown: function (title, items, setting, callback) {
            var self = new builderUtility.createRow(title);
            self.dropdown = $('<select>').addClass('ravesh-input');
            self.append(self.dropdown);
            self.setItems = function (items_) {
                items = items_;
                self.dropdown.empty();
                $.each(items, function (i, item) {
                    var option = $('<option>').val(item[0]).text(item[1]);
                    if (setting.value == item[0]) option.attr('selected', 'selected');
                    self.dropdown.append(option);
                });
            }
            self.setItems(items);
            self.dropdown.change(function () {
                var itemId = $(this).val();
                if (callback) callback($.grep(items, function (s) { return s[0] == itemId })[0]);
            });
            self.setWidth = function (width) { self.dropdown.css('width', width); return self; };
            self.getValue = function () { setting.value = self.dropdown.val(); return setting }
            return self;
        },
        createColorPicker: function (title, setting, callback) {
            var self = new builderUtility.createRow(title);
            self.input = $('<input>').attr({ type: 'text', value: setting.value });
            self.append(self.input);
            self.build = function () {
                self.input.spectrum({
                    localStorageKey: 'chatbox-color',
                    showAlpha: false, showButtons: false, showInput: true, showInitial: true, preferredFormat: "hex6", clickoutFiresChange: true, showPalette: true,
                    palette: [
                        ['#f44336', '#e91e63', '#9c27b0', '#673ab7'],
                        ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'],
                        ['#009688', '#4caf50', '#8bc34a', '#ffc107'],
                        ['#ff9800', '#ff5722', '#000']
                    ],
                    move: function (color) {
                        if (callback) callback(color.toRgbString());
                    },
                    change: function (color) {
                        if (callback) callback(color.toRgbString());
                    }
                });
                return self;
            }
            self.getValue = function () { setting.value = self.input.val(); return setting }
            return self;
        },
        createCheckBox: function (title, setting, callback) {
            var self = this;
            self.getUI = function () { return container };
            self.appendTo = function (parent) { container.appendTo(parent); return self; }
            var id = utility.randomId();
            var container = $('<div>').addClass('checkbox-group-cover float-right').css({ width: '100%', 'margin-top': '10px' });
            var checkbox = $('<input>').attr({ type: 'checkbox', id: id, checked: setting.value.toString().toLowerCase() == 'true', disabled: setting.disabled }).addClass('float-right');
            var checkboxCover = $('<div>').addClass('checkbox-cover float-right').append(checkbox, $('<label>').css({ 'line-height': '1.9' }).addClass('float-right').attr('for', id).append(title).attr('title', title)).appendTo(container);
            checkbox.change(function () {
                if (callback) callback(checkbox.is(':checked'));
            });
            self.setValue = function (enable) { checkbox.attr('checked', enable); return self }
            self.getValue = function () { setting.value = checkbox.is(':checked'); return setting }
            self.setDisable = function (enable) { checkboxCover.toggleClass('disable', enable); checkbox.attr('disabled', enable); return self }
            return self;
        },
        createRadio: function (items, setting, callback) {
            var self = this;
            var name = utility.randomId();
            var container = $('<div>').addClass('checkbox-group-cover float-right');
            self.getUI = function () { return container };
            self.appendTo = function (parent) { container.appendTo(parent); return self; };
            $.each(items, function (i, item) {
                var id = utility.randomId();
                var radio = $('<input>').attr({ type: 'radio', id: id, checked: setting.value == item[0], name: name, value: item[0] }).addClass('float-right');
                $('<div>').addClass('checkbox-cover float-right').append(radio, $('<label>').css({ 'line-height': '1.9' }).addClass('float-right').attr('for', id).text(item[1])).appendTo(container);
                $('<div>').addClass('float-right').css({ 'margin': '10px 20px' }).appendTo(container);
                radio.change(function () {
                    if (callback) callback(item[0]);
                });
            });
            self.setValue = function (value) { container.find('input[value=' + value + ']').attr('checked', true); return self; }
            self.getValue = function () { setting.value = container.find('input[name=' + name + ']:checked').val(); return setting }
            return self;
        }
    }

})();