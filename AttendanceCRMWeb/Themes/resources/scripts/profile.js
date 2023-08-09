(function ($) {
    document.write('<div id="profileContainer"></div>');
    var mainContainer = $('#profileContainer');
    var lang = $('#HFlang').val();
    var dir = lang == 'fa' ? 'rtl' : 'ltr';


    var head = {
        container: $('<div>').addClass('page-head'),
        title: $('<div>').addClass('page-head-title float-right').text(frmRes.r.profile),
        date: $('<div>').addClass('page-head-date float-left th-color').text(FormUtility.getCurrentDateStr())
    }
    head.container.append(head.title, head.date).appendTo(mainContainer);

    var pageContainer = $('<div>').addClass('page-container').appendTo(mainContainer)
    var colContainer = $('<div>').addClass('col-container').appendTo(pageContainer);
    var colRight = $('<div>').addClass('col-right float-right');
    var colLeft = $('<div>').addClass('col-left float-left');
    colContainer.append(colRight, colLeft);


    //User Picture And Info------------------------------------------------------------------------------
    var userInfo = dataJSON.userInfo;
    var defaultPicture = '../Themes/resources/images/noimage200.png';
    var userProfileCover = $('<div>').addClass('user-profile-cover').appendTo(colRight);
    var userPicture = $('<img>').attr('src', userInfo.picture == '' ? defaultPicture : userInfo.picture).appendTo(userProfileCover);
    var userPictureEdit =$('<div>').addClass('edit-profile').append(frmRes.r.edit, $('<i>').addClass('icon-pencil float-right')).appendTo(userProfileCover);
    $('<div>').addClass('user-profile-name').append(userInfo.name).appendTo(colRight);
    $('<a>').attr({ href: '../pages/create_Email.aspx?customer_=' + userInfo.custCode + '&rnd_=' + $('#HFRnd').val() }).addClass('user-profile-email').append(userInfo.email).appendTo(colRight);

    if (userInfo.amount != 0) {
        $('<div>').addClass('user-profile-amount').append(resources.credit + ":" + userInfo.amount).appendTo(colRight);
    }

    var groups = $('<div>').addClass('user-profile-group').appendTo(colRight);
  
    $.each(userInfo.group, function (g, group) {
        groups.append($('<div>').append(group));
    });
    $('<a>').attr({ href: '../pages/cus.aspx?code=' + userInfo.custCode + '&rnd_=' + $('#HFRnd').val() }).addClass('user-profile-edit').text(frmRes.r.edit).appendTo(colRight).hide();
    userPictureEdit.click(function () {
        setCustomerPicture({
            picture: userInfo.picture,
            width: 250, allowSave: true, allowDelete: true,
            cust_code: userInfo.custCode,
            callback: function (imgurl) {
                userPicture.attr('src', imgurl);
                userInfo.picture = imgurl;
                $('.HeadrImage').attr('src', imgurl);
            },
            onDelete: function (msg) {
                userInfo.picture = '';
                userPicture.attr('src', defaultPicture);
                $('.HeadrImage').attr('src', defaultPicture);
            }
        });
    })


    //Tabs------------------------------------------------------------------------------
    var tabsContainer = $('<div>').addClass('page-main-tab');
    var tabsContentContainer = $('<div>').addClass('page-main-content');
    colLeft.append(tabsContainer, tabsContentContainer);

    var tabs = {
        overview: { title: frmRes.r.overview },
        account: { title: frmRes.r.account },
        settings: { title: frmRes.r.settings },
        application: { title: frmRes.r.application }
    }
    //if (lang != 'fa') delete tabs.application;

    $.each(tabs, function (t, tab) {
        tab.ui = $('<div>').text(tab.title).addClass('float-right tab-item').append($('<div>'));
        tab.container = $('<div>').hide();
        tab.ui.click(function () {
            selectTab(tab);
        });
        tabsContainer.append(tab.ui);
        tabsContentContainer.append(tab.container)
    });

    var selectTab = function (tab) {
        $.each(tabs, function (t, tab_) {
            var isActive = tab_.ui.hasClass('active');
            tab_.ui.removeClass('active');
            tab_.container.hide();
            if (tab_ == tab) {
                tab_.ui.addClass('active');
                tab_.container.show();
            }
        });
    }
    selectTab(tabs[dataJSON.tab]);


    //Overview-tab--------------------------------------
    //User Log
    var logContainer = $('<div>').addClass('page-main-card').appendTo(tabs.overview.container);
    $('<div>').addClass('page-main-subtitle').text(frmRes.r.lastActivities).appendTo(logContainer);
    var userLog = {
        container: $('<div>').addClass('user-log-container').appendTo(logContainer),
        moreBtn: $('<div>').addClass('user-log-more').text(frmRes.r.showMoreActivities).hide().appendTo(logContainer),
        loading: $('<div>').css('text-align', 'center').append($('<div>').addClass('spinner')).appendTo(logContainer),
        pageSize: 5,
        pageNum: 1,
        isLoading: false
    }
    userLog.moreBtn.click(function () {
        if (userLog.isLoading) return false;
        userLog.pageNum++;
        getUserLog();
    })
    getUserLog();


    //User Comment
    var commentContainer = $('<div>').addClass('page-main-card').appendTo(tabs.overview.container);
    $('<div>').addClass('page-main-subtitle').text(frmRes.r.lastComments).appendTo(commentContainer);
    var userComments = {
        container: $('<div>').addClass('user-comment-container').appendTo(commentContainer),
        moreBtn: $('<div>').addClass('user-comment-more').text(frmRes.r.showMoreComments).hide().appendTo(commentContainer),
        loading: $('<div>').css('text-align', 'center').append($('<div>').addClass('spinner')).appendTo(commentContainer),
        PageSize: 5,
        PageNum: 1,
        isLoading: false
    }
    userComments.moreBtn.click(function () {
        if (userComments.isLoading) return false;
        userComments.PageNum++;
        getComments();
    })
    setTimeout(getComments, 100);

    //User mention
    var mentionContainer = $('<div>').addClass('page-main-card').appendTo(tabs.overview.container);
    $('<div>').addClass('page-main-subtitle').text(resources.mentionMe).appendTo(mentionContainer);
    var userMentions = {
        container: $('<div>').addClass('user-comment-container').appendTo(mentionContainer),
        moreBtn: $('<div>').addClass('user-comment-more').text(frmRes.r.showMoreComments).hide().appendTo(mentionContainer),
        loading: $('<div>').css('text-align', 'center').append($('<div>').addClass('spinner')).appendTo(mentionContainer),
        PageSize: 5,
        PageNum: 1,
        isLoading: false
    }
    userMentions.moreBtn.click(function () {
        if (userMentions.isLoading) return false;
        userMentions.PageNum++;
        getmentions();
    })
    setTimeout(getmentions, 200);


    //Builder----------------------------------------------------------------------------
    var builderUtility = {
        createRow: function (titleStr) {
            var self = this;
            var container = $('<div>').addClass('ravesh-input-cover');
            var title = $('<span>').addClass('ravesh-label').append(titleStr).appendTo(container);
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
            self.input = $('<input>').css('width', 200).addClass('ravesh-input').attr('type', setting.type || 'text').val(setting.value || '');
            self.append(self.input);
            self.setMaxLength = function (maxLength) { self.input.attr('maxLength', maxLength); return self; };
            self.setWidth = function (width) { self.input.css('width', width); return self; };
            self.getValue = function () { setting.value = self.input.val(); return setting };
            self.setId = function (id) { if (!id) { id = FormUtility.randomId() } self.id = id; self.input.attr('id', id); return self; }
            return self;
        },
        createButton: function (title, cssClass, callback) {
            var self = this;
            var spinner = $('<div>').addClass('spinner white small').hide();
            var titleSpan = $('<span>').text(title);
            var isLoading = false;
            self.button = $('<a>').css({ 'margin': 0, 'display': 'inline-block', 'min-width': 40 }).addClass('ravesh-button ' + cssClass).append(titleSpan, spinner).click(function () {
                if (isLoading) return false;
                callback();
                return false;
            });
            self.showLoading = function () {
                isLoading = true;
                spinner.show();
                titleSpan.hide();
            }
            self.hideLoading = function () {
                setTimeout(function () {
                    isLoading = false;
                    spinner.hide();
                    titleSpan.show();
                }, 200);
            }
            return self;
        },
        createDropDown: function (title, items, setting, callback) {
            var self = new builderUtility.createRow(title);
            self.dropdown = $('<select>').css('width', 200).addClass('ravesh-input');
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
            self.getValue = function () { setting.value = self.dropdown.val(); return setting }
            return self;
        },
        createSwitch: function (title) {
            var self = new builderUtility.createRow(title);
            self.input = $('<input>').attr('type', 'checkbox');
            self.append(self.input);
            self.switch = new Switchery(self.input[0], { size: 'large', color: '#03a9f4', secondaryColor: '#eee', trueLabel: '', falseLabel: '' })
            self.setValue = function (value) {
                self.input.val(value || false);
                self.switch.setPosition(value || false);
            }
            return self;
        }
    }


    //Account-tab----------------------------------------------------------------------------
    //Password
    var passwordContainer = $('<div>').addClass('page-main-card').appendTo(tabs.account.container);
    $('<div>').addClass('page-main-subtitle').css('margin', '0 0 15px').text(frmRes.r.password).appendTo(passwordContainer);
    var txtOldPassword = builderUtility.createTextBox(frmRes.r.oldPassword, { type: 'password' }).appendTo(passwordContainer);
    var txtNewPassword = builderUtility.createTextBox(frmRes.r.newPassword, { type: 'password' }).setId('txtPass').appendTo(passwordContainer);
    var txtNewPasswordConfirm = builderUtility.createTextBox(frmRes.r.newPasswordConfirm, { type: 'password' }).setId('txtPassConfirm').appendTo(passwordContainer);
    txtNewPassword.input.pstrength({ minchar: translate_person.MinimumLengthPassword, minMoreAllow: translate_person.MinimumMoreScoresPassword });

    var btnChangePassword = new builderUtility.createButton(frmRes.r.updatePassword, 'save', function () {
        if ($("#" + txtNewPassword.id + "_bar").attr("v") != 't') return false;
        if (txtNewPassword.getValue().value != txtNewPasswordConfirm.getValue().value) return false;
        if (txtOldPassword.getValue().value.trim() == '' || txtNewPassword.getValue().value.trim() == '') return false;

        btnChangePassword.showLoading();
        FormUtility.postExtra('profile.aspx/changePassword_', { oldPassword: txtOldPassword.getValue().value, newPassword: txtNewPassword.getValue().value },
            function (isSuccess, message, data) {
                btnChangePassword.hideLoading();
                if (isSuccess) {
                    RaveshUI.successToast(frmRes.main.success, message);
                    txtNewPassword.input.val('');
                    txtNewPasswordConfirm.input.val('');
                    txtOldPassword.input.val('');
                } else {
                    RaveshUI.errorToast(frmRes.main.error, message);
                }
            }
        );
    });
    btnChangePassword.button.css('margin', '0 0 15px').appendTo(passwordContainer);


    //Setting-tab----------------------------------------------------------------------------
    //Language And Time
    var timeAndLang = dataJSON.timeAndLang;
    var langContainer = $('<div>').addClass('page-main-card').appendTo(tabs.settings.container);
    $('<div>').addClass('page-main-subtitle').css('margin-bottom', '15px').text(frmRes.r.timeAndLangSetting).appendTo(langContainer);
    var arrLang = [["en", frmRes.main.english], ["fa", frmRes.main.persian]];
    var drdLang = builderUtility.createDropDown(frmRes.main.language, arrLang, { value: timeAndLang.lang }).appendTo(langContainer);

    var arrTimeZones = [["-12.0.1", "(GMT -12:00) Eniwetok"], ["-12.0.2", "(GMT -12:00) Kwajalein"], ["-11.0.2", "(GMT -11:00) Midway Island"], ["-11.0.4", "(GMT -11:00) Samoa"], ["-10.0.5", "(GMT -10:00) Hawaii"], ["-9.0.6", "(GMT -09:00) Alaska"], ["-8.0.7", "(GMT -08:00) Pacific Time"], ["-7.0.8", "(GMT -07:00) Mountain Time"], ["-6.0.9", "(GMT -06:00) Central Time"], ["-6.0.10", "(GMT -06:00) Mexico City"], ["-5.0.11", "(GMT -05:00) Eastern Time"], ["-5.0.12", "(GMT -05:00) Bogota"], ["-5.0.13", "(GMT -05:00) Lima"], ["-4.0.14", "(GMT -04:00) Atlantic Time"], ["-4.0.15", "(GMT -04:00) Caracas"], ["-4.0.16", "(GMT -04:00) La Paz"], ["-3.5.17", "(GMT -03:30) Newfoundland"], ["-3.0.18", "(GMT -03:00) Brazil"], ["-3.0.19", "(GMT -03:00) Buenos Aires"], ["-3.0.20", "(GMT -03:00) Georgetown"], ["-2.0.21", "(GMT -02:00) Mid-Atlantic"], ["-1.0.22", "(GMT -01:00) Azores"], ["-1.0.23", "(GMT -01:00) Cape Verde Islands"], ["0.0.24", "(GMT) Western Europe Time"], ["0.0.25", "(GMT) London"], ["0.0.26", "(GMT) Lisbon"], ["0.0.27", "(GMT) Casablanca"], ["1.0.28", "(GMT +01:00) Brussels"], ["1.0.29", "(GMT +01:00) Copenhagen"], ["1.0.30", "(GMT +01:00) Madrid"], ["1.0.31", "(GMT +01:00) Paris"], ["2.0.32", "(GMT +02:00) Kaliningrad"], ["2.0.33", "(GMT +02:00) South Africa"], ["3.0.34", "(GMT +03:00) Baghdad"], ["3.0.35", "(GMT +03:00) Riyadh"], ["3.0.36", "(GMT +03:00) Moscow"], ["3.0.37", "(GMT +03:00) St. Petersburg"], ["3.5.38", "(GMT +03:30) Tehran"], ["4.0.39", "(GMT +04:00) Abu Dhabi"], ["4.0.40", "(GMT +04:00) Muscat"], ["4.0.41", "(GMT +04:00) Baku"], ["4.0.42", "(GMT +04:00) Tbilisi"], ["4.5.43", "(GMT +04:30) Kabul"], ["5.0.44", "(GMT +05:00) Ekaterinburg"], ["5.0.45", "(GMT +05:00) Islamabad"], ["5.0.46", "(GMT +05:00) Karachi"], ["5.0.47", "(GMT +05:00) Tashkent"], ["5.5.48", "(GMT +05:30) Bombay"], ["5.5.49", "(GMT +05:30) Calcutta"], ["5.5.50", "(GMT +05:30) Madras"], ["5.5.51", "(GMT +05:30) New Delhi"], ["5.75.52", "(GMT +05:45) Kathmandu"], ["6.0.53", "(GMT +06:00) Almaty"], ["6.0.54", "(GMT +06:00) Dhaka"], ["6.0.55", "(GMT +06:00) Colombo"], ["7.0.56", "(GMT +07:00) Bangkok"], ["7.0.57", "(GMT +07:00) Hanoi"], ["7.0.58", "(GMT +07:00) Jakarta"], ["8.0.59", "(GMT +08:00) Beijing"], ["8.0.60", "(GMT +08:00) Perth"], ["8.0.61", "(GMT +08:00) Singapore"], ["8.0.62", "(GMT +08:00) Hong Kong"], ["9.0.63", "(GMT +09:00) Tokyo"], ["9.0.64", "(GMT +09:00) Seoul"], ["9.0.65", "(GMT +09:00) Osaka"], ["9.0.66", "(GMT +09:00) Sapporo"], ["9.5.67", "(GMT +09:30) Adelaide"], ["9.5.68", "(GMT +09:30) Darwin"], ["10.0.69", "(GMT +10:00) Eastern Australia"], ["10.0.70", "(GMT +10:00) Guam"], ["10.0.71", "(GMT +10:00) Vladivostok"], ["11.0.72", "(GMT +11:00) Magadan"], ["11.0.73", "(GMT +11:00) Solomon Islands"], ["11.0.74", "(GMT +11:00) New Caledonia"], ["12.0.75", "(GMT +12:00) Auckland"], ["12.0.76", "(GMT +12:00) Wellington"], ["12.0.77", "(GMT +12:00) Fiji"], ["12.0.78", "(GMT +12:00) Kamchatka"]];
    var drdTimeZone = builderUtility.createDropDown(frmRes.r.timeZone, arrTimeZones, { value: timeAndLang.timezone }).appendTo(langContainer);
    drdTimeZone.getUI().css({ 'direction': 'ltr' });

    var dst = builderUtility.createSwitch(frmRes.r.daylightSaveTime).appendTo(langContainer);
    dst.setValue(timeAndLang.dst != '0');

    var btnLangTime = new builderUtility.createButton(frmRes.r.save, 'save', function () {
        var e = {
            lang: drdLang.getValue().value,
            timezone: drdTimeZone.getValue().value,
            dst: dst.input.attr('checked')
        }
        btnLangTime.showLoading();
        FormUtility.postExtra('profile.aspx/setTimeAndLang_', e,
            function (isSuccess, message, data) {
                btnLangTime.hideLoading();
                if (isSuccess) {
                    RaveshUI.successToast(frmRes.main.success, frmRes.r.successSaveChange);
                    setTimeout(function () { location.reload(true); }, 1000);
                } else {
                    RaveshUI.errorToast(frmRes.main.error, frmRes.main.errorMessage);
                }
            }
        );
    });
    btnLangTime.button.css('margin', '5px 0 10px').appendTo(langContainer);


    //social
    var socialContainer = $('<div>').addClass('page-main-card').appendTo(tabs.settings.container);
    $('<div>').addClass('page-main-subtitle').css({ 'margin-bottom': '15px', float: 'right', width: '100%' }).text(frmRes.r.connectSocialNetwork).appendTo(socialContainer);
    var socialBtnCover = $('<div>').css({ 'margin-bottom': '15px' }).appendTo(socialContainer);
    $.each(dataJSON.userInfo.SocialBot, function (s, social) {
        var socialName = frmRes.r['social' + social.name];
        var btnDisconnec = new builderUtility.createButton(frmRes.r.disconnectSocial + ' ' + socialName, 'red', function (me) {
            me.showLoading();
            FormUtility.postExtra('../pages/profile.aspx/disconnectSocial', { social: social.name, lang: $('#HFlang').val() },
                 function (isSuccess, message, data) {
                     me.hideLoading();
                     if (isSuccess) {
                         RaveshUI.successToast(frmRes.main.success, frmRes.r.successSaveChange);
                         btnDisconnec.button.hide();
                         btnConnect.button.show();
                         social.token = data;
                     } else {
                         RaveshUI.errorToast(frmRes.main.error, frmRes.main.errorMessage);
                     }
                 }
             );
        });
        btnDisconnec.button.appendTo(socialBtnCover);
        var btnConnect = new builderUtility.createButton(frmRes.r.connectSocial + ' ' + socialName, 'submit', function (me) {
            if (!formBuilder.plan.telegram) { RaveshFormUtility.showDialogPlan(); return false }
            var container = $('<div>').css({ overflow: 'hidden', padding: '5px 15px 15px', 'font-size': '12px' });
            $('<div>').text(frmRes.r['help' + social.name].replace('FormAfzarBot', 'FarsicomCrmBot')).appendTo(container);
            $('<a>').addClass('ravesh-button submit').css({ 'display': 'inline-block', 'margin': '10px 0 20px' }).attr({ 'href': social.url, target: '_blank' }).text(frmRes.r.connectToBot).appendTo(container);
            $('<div>').text(frmRes.r.socialHelp).appendTo(container);
            $('<div>').text(social.token).appendTo(container)
                .css({ 'word-break': 'break-word', 'margin-top': '10px', 'width': '100%', 'direction': 'ltr', 'text-align': 'left', 'border': '2px dashed rgb(96, 125, 139)', 'box-sizing': 'border-box', 'padding': '10px', 'line-height': '1.7', 'cursor': 'text' });
            var dialog = RaveshUI.showDialog({ title: frmRes.r.connectSocial + ' ' + socialName, width: 600, minWidth: 600 });
            dialog.setContent(container);
        });
        btnConnect.button.appendTo(socialBtnCover);
        btnConnect.button.toggle(social.token != '').css({ 'margin': '0 5px', 'background': social.color });
        btnDisconnec.button.toggle(social.token == '').css({ 'margin': '0 5px' });
        addSocketEventListener("SocialNetwork", function (data) {
            if (data.action == "connect" && data.social == social.name.toLowerCase()) {
                btnConnect.button.hide();
                btnDisconnec.button.show();
            }
        });
    });

    //Defaults
    var userDefaults = dataJSON.userDefaults;
    var defContainer = $('<div>').addClass('page-main-card col-2').appendTo(tabs.settings.container);
    $('<div>').addClass('page-main-subtitle').css('margin-bottom', '15px').text(frmRes.r.defaults).appendTo(defContainer);

    var drdListCount = builderUtility.createDropDown(resProfile.cap_number_list_records, [[5, 5], [10, 10], [15, 15], [20, 20], [25, 25], [30, 30], [40, 40], [50, 50], [75, 75], [100, 100]], { value: userDefaults.listCount }).appendTo(defContainer);

    var rowCustomerGroup = new builderUtility.createRow(resProfile.cap_group_customer).appendTo(defContainer);
    var drdCustomerGroup = RaveshUI.selectCustomerGroup({
        dir: dir, width: 200, defaultTitle: frmRes.r.pleaseSelect, defaultTitleGroup: frmRes.r.pleaseSelect,
    });
    rowCustomerGroup.append(drdCustomerGroup.getUI());


    var rowPages = new builderUtility.createRow(resProfile.cap_default_form_default_page).appendTo(defContainer);
    var drdPages = RaveshUI.AjaxDrillDown({
        url: '/pages/profile.aspx/getCrmPages_',
        dir: dir, width: 200, defaultTitle: frmRes.r.pleaseSelect, defaultTitleGroup: frmRes.r.pleaseSelect,
        onlySelectChilds: true
    });
    rowPages.append(drdPages.getUI());


    var rowUserGroup = new builderUtility.createRow(resProfile.cap_group_user).appendTo(defContainer);
    var drdUserGroup = RaveshUI.AjaxDrillDown({
        url: '/pages/profile.aspx/getUserGroup_',
        dir: dir, width: 200, defaultTitle: frmRes.r.pleaseSelect, defaultTitleGroup: frmRes.r.pleaseSelect
    });
    rowUserGroup.append(drdUserGroup.getUI());


    var rowProductGroup = new builderUtility.createRow(resProfile.cap_group_product).appendTo(defContainer);
    var drdProductGroup = RaveshUI.AjaxDrillDown({
        url: '/pages/profile.aspx/getProductGroup_',
        dir: dir, width: 200, defaultTitle: frmRes.r.pleaseSelect, defaultTitleGroup: frmRes.r.pleaseSelect
    });
    rowProductGroup.append(drdProductGroup.getUI());


    var drdEmailTemplate = builderUtility.createDropDown(resProfile.cap_template_email, dataJSON.emailTemplate, { value: userDefaults.emailTemplate }).appendTo(defContainer);


    var rowCity = new builderUtility.createRow(resProfile.cap_location).appendTo(defContainer);
    var drdCity = new RaveshUI.DropDown({
        ajaxUrl: '/pages/profile.aspx/getCity_',
        defaultTitle: frmRes.r.pleaseSelect, dir: dir, width: 200,
        emptyOption: { id: '', title: frmRes.r.pleaseSelect },
        createOptionUI: function (data) {
            return $('<div>').addClass('option-city').css({ 'min-width': 200 }).append(
                (data.number != '' ? $('<div>').addClass('number float-left').text(data.number) : ''),
                $('<div>').addClass('title').text(data.title),
                $('<div>').addClass('parent-name').text(data.parentName)
            );
        }
    });
    rowCity.append(drdCity.getUI());


    var drdExtraCustomerSearchField = builderUtility.createDropDown(resProfile.cap_extra_field_searchShow, dataJSON.extraCustomerSearchField, { value: userDefaults.extraCustomerSearchField }).appendTo(defContainer);


    var drdKols = builderUtility.createDropDown(resProfile.cap_kol, dataJSON.kols, { value: userDefaults.kol }, function (idKol) {
        getMoin();
    }).appendTo(defContainer);


    var drdMoin = builderUtility.createDropDown(resProfile.cap_moin, [], { value: userDefaults.moin }).appendTo(defContainer);
    getMoin();


    drdCity.setSelected({ id: userDefaults.city, title: userDefaults.cityName });
    setTimeout(function () { drdCustomerGroup.setSelectedById(userDefaults.customerGroup); }, 100);
    setTimeout(function () { drdPages.setSelectedById(userDefaults.page); }, 200);
    setTimeout(function () { drdUserGroup.setSelectedById(userDefaults.userGroup); }, 300);
    setTimeout(function () { drdProductGroup.setSelectedById(userDefaults.productGroup); }, 400);


    var btnDefaults = new builderUtility.createButton(frmRes.r.save, 'save', function () {
        var data = {
            listCount: drdListCount.getValue().value,
            customerGroup: drdCustomerGroup.getSelectedOption().id || '',
            page: drdPages.getSelectedOption().id || '',
            userGroup: drdUserGroup.getSelectedOption().id || '',
            productGroup: drdProductGroup.getSelectedOption().id || '',
            emailTemplate: drdEmailTemplate.getValue().value,
            city: drdCity.getSelectedOption().id || '',
            extraCustomerSearchField: drdExtraCustomerSearchField.getValue().value,
            kol: drdKols.getValue().value,
            moin: drdMoin.getValue().value
        }
        btnDefaults.showLoading();
        FormUtility.postExtra('profile.aspx/saveUserDefault_', data,
            function (isSuccess, message, data) {
                btnDefaults.hideLoading();
                if (isSuccess) {
                    RaveshUI.successToast(frmRes.main.success, frmRes.r.successSaveChange);
                } else {
                    RaveshUI.errorToast(frmRes.main.error, frmRes.main.errorMessage);
                }
            }
        );
    });
    btnDefaults.button.css('margin', '5px 0 10px').appendTo(defContainer);


    //Application----------------------------------------------------------------------------
    var appContainer = $('<div>').addClass('page-main-card col-2').appendTo(tabs.application.container);
    var enText = 'For ease of login, use the QR Code to scan the account.'
    $('<div>').addClass('ravesh-input-cover').css({ 'text-align': 'center' }).append(
        $('<div>').css({ 'max-width': '300px', 'display': 'inline-block' }).append(
            $('<img>').attr({ src: '/Themes/resources/images/app/scanQrCode.png' }).css({ 'max-width': '100%', 'margin-bottom': 10 }),
            $('<p>').css({ 'text-align': 'justify', 'line-height': 2, 'font-size': 12 })
            .text((lang === "fa" ? 'اپلیکیشن مدیریت ارتباط با مشتری رَوش را از طریق لینک‌های زیر دانلود و برای سهولت در ورود به حساب کاربری، از طریق اپلیکیشن این رمزینه پاسخ سریع(QR Code) را اسکن نمایید.' : enText)).appendTo(appContainer)
        )
    ).appendTo(appContainer);
    $('<div>').addClass('ravesh-input-cover').css({ 'text-align': 'center' }).append(
        $('<div>').css({ 'display': 'inline-block', 'margin': '70px 0', 'border': 'solid 1px #ddd' }).append(
            QRCode.generateHTML(dataJSON.loginQrCode, { ecclevel: "M" })
        )
    ).appendTo(appContainer);

     if (lang == 'fa') {

    //Android
    var androidContainer = $('<div>').addClass('page-main-card').appendTo(tabs.application.container);
    $('<div>').addClass('page-main-subtitle').css('margin-bottom', '15px').text('نسخه Android').appendTo(androidContainer);
    $('<img>').css({ 'width': 128 }).attr({ src: '/Themes/resources/images/app/android/logo.png' }).addClass('float-right').appendTo(androidContainer);
    $('<div>').addClass('float-right').append(
        $('<div>').css({ 'font-weight': 'bold', 'font-size': '20px', 'margin': '40px 15px 10px' }).text('مدیریت ارتباط با مشتری رَوش'),
        $('<div>').css({ 'color': 'gray', 'margin': '0 15px' }).append('فن آوری اطلاعات فارسی&zwnj;کام')
    ).appendTo(androidContainer);

    var androidImgCount = 8;
    var androidImgContainer = $('<div>').addClass('ravesh-scrollbar').css({ 'width': '100%', 'float': 'right', 'overflow-x': 'scroll', 'margin': '15px 0' }).appendTo(androidContainer);
    var androidImgScroll = $('<div>').appendTo(androidImgContainer).css({ 'width': 215 * androidImgCount });
    for (var i = 1; i <= androidImgCount; i++) {
        $('<img>').css({ 'width': 200, 'margin': '0 0 15px 15px' }).attr({ src: '/Themes/resources/images/app/android/' + i + '.png' }).appendTo(androidImgScroll);
    }

    $('<a>').addClass('float-right').css({ 'margin': '15px 0' }).attr({ 'href': 'https://play.google.com/store/apps/details?id=com.ravesh.crm', 'target': '_blank' })
        .append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/googleplay.png' })).appendTo(androidContainer);

    $('<a>').addClass('float-right').css({ 'margin': '15px 15px 15px 0' }).attr({ 'href': 'https://myket.ir/app/com.ravesh.crm/download', 'target': '_blank' })
        .append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/myket.png' })).appendTo(androidContainer);

    $('<a>').addClass('float-right').css({ 'margin': '15px 15px 15px 0' }).attr({ 'href': 'https://cafebazaar.ir/app/com.ravesh.crm', 'target': '_blank' })
        .append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/bazar.png' })).appendTo(androidContainer);

    $('<a>').addClass('float-left').css({ 'margin': '30px' }).text('نسخه‌های قبلی').attr({ 'href': 'http://raveshcrm.ir/Application', 'target': '_blank' }).appendTo(androidContainer);


    //IOS
    var iosContainer = $('<div>').addClass('page-main-card').appendTo(tabs.application.container);
    $('<div>').addClass('page-main-subtitle').css('margin-bottom', '15px').text('نسخه IOS').appendTo(iosContainer);
    $('<img>').css({ 'width': 128 }).attr({ src: '/Themes/resources/images/app/ios/logo.png' }).addClass('float-right').appendTo(iosContainer);
    $('<div>').addClass('float-right').append(
        $('<div>').css({ 'font-weight': 'bold', 'font-size': '20px', 'margin': '40px 15px 10px' }).text('مدیریت ارتباط با مشتری رَوش'),
        $('<div>').css({ 'color': 'gray', 'margin': '0 15px' }).append('فن آوری اطلاعات فارسی&zwnj;کام')
    ).appendTo(iosContainer);

    var iosImgCount = 8;
    var iosImgContainer = $('<div>').addClass('ravesh-scrollbar').css({ 'width': '100%', 'float': 'right', 'overflow-x': 'scroll', 'margin': '15px 0' }).appendTo(iosContainer);
    var iosImgScroll = $('<div>').appendTo(iosImgContainer).css({ 'width': 215 * iosImgCount });
    for (var i = 1; i <= iosImgCount; i++) {
        $('<img>').css({ 'width': 200, 'margin': '0 0 15px 15px' }).attr({ src: '/Themes/resources/images/app/ios/' + i + '.png' }).appendTo(iosImgScroll);
    }



         $('<a>').addClass('float-right').css({ 'margin': '15px 0' }).attr({ 'href': 'https://anardoni.com/ios/app/7wDAPHycF', 'target': '_blank' })
.append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/Anardoni.png' })).appendTo(iosContainer);

         $('<span>').addClass('float-right').css({ 'margin': '15px 15px 15px 0', 'opacity': '0.2' }).attr({ 'href': '#', 'target': '_blank' })
        .append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/appstore.png' })).appendTo(iosContainer);

         $('<a>').addClass('float-right').css({ 'margin': '15px 15px 15px 0' }).attr({ 'href': 'https://sibapp.com/applications/raveshcrm-1', 'target': '_blank' })
        .append($('<img>').css({ 'border-radius': '7px', width: 160 }).attr({ src: '/Themes/resources/images/app/sibapp.png' })).appendTo(iosContainer);

   

     }


    function getMoin() {
        var kolId = drdKols.getValue().value;
        if (kolId != '') {
            var e = { domain_: $('#HFdomain').val(), idkol_: kolId };
            $.ajax({
                url: "/WebServices/Store_.asmx/store_getMoin", type: "POST",
                contentType: "application/json; charset=utf-8", dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    var moins = [['', frmRes.r.pleaseSelect]];
                    $.each(c.d, function (m, moin) {
                        moins.push([moin.id, moin.name]);
                    })
                    drdMoin.setItems(moins);
                }
            });
        } else {
            drdMoin.setItems([['', frmRes.r.pleaseSelect]]);
        }
    }

    function getComments() {
        var createRow = function (item) {

            var edited = item.Text.includes('[crmedited]') ? '<span class="cCompStatusEdit" title=""> ' + frmRes.r.edited + '</span>' : '';
            var deleted = item.Text.includes('[crmdeleted]') ? '<span class="cCompStatusDelete" title=""> ' + frmRes.r.deleted + '</span>' : '';
            item.Text = item.Text.replace(/\[crmedited\]/g, '');
            item.Text = item.Text.replace(/\[crmdeleted\]/g, '');

            switch (item.CommentType) {
                case 1:
                    item.CommentTypeStr = ' <a href="#" onclick="showSaleInfo(' + item.Code + ');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 2:
                    item.CommentTypeStr = ' <a href="#" onclick="customer_Show_Info(' + item.Code + ',\'\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 4:
                    item.CommentTypeStr = ' <a href="#" onclick="showFormInfo(' + item.Code + ',\'\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 5:
                    item.CommentTypeStr = ' <a href="#" onclick="show_ticket(' + item.Code + ',\'' + item.Code + '\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
            };

            return $('<div class="user-comment" >' +
                        '<img class="float-right" src="' + (item.attachment_picture == null || item.attachment_picture == "" ? "../themes/resources/images/noimage.jpg" : item.attachment_picture) + '"/>' +
                        '<div class="message-container">' +
                            '<div class="time-comment float-left" title="' + item.dateString.day_name + ' ' + item.dateString.day + ' ' + item.dateString.month_name + ' ' + item.time + '">' + item.TimeAgo + '</div>' +
                            '<div class="message-comment">' + item.Text + edited + deleted + '</div>' +
                            '<div class="username-comment">' + item.UserName + ' ' + item.CommentTypeStr+'</div>' +
                        '</div>' +
                     '</div>');
        }
        var e = {
            d: $('#HFdomain').val(), c: $('#HFcodeDU').val(), u: $('#HFUserCode').val(),
            PageSize: userComments.PageSize,
            PageNum: userComments.PageNum,
            CommentType: 0, Code: null, Text: null,
            viewAttachment: false,
            showCurrenUser: true
        }
        userComments.loading.show();
        userComments.isLoading = true;
        $.ajax({
            url: "/WebServices/CommentServices.asmx/getComments_", type: "POST",
            contentType: "application/json; charset=utf-8", dataType: "json",
            data: JSON.stringify({ searchobj: e }),
            success: function (c) {
                userComments.loading.hide();
                userComments.isLoading = false;
                if (c.d[0] == 1) {
                    var totlalRow = 0;
                    var firstRow;
                    $.each(c.d[1], function (i, item) {
                        totlalRow = item.TotalRow;
                        var row = createRow(item);
                        userComments.container.append(row);
                        if (i == 0) firstRow = row;
                    });
                    if (firstRow && userComments.PageNum != 1) {
                        setTimeout(function () { $('html,body').animate({ scrollTop: userComments.moreBtn.offset().top - 300 }, 500, 'linear'); }, 200);
                    }
                    userComments.moreBtn.show();
                } else {
                    if (userComments.PageNum == 1) {
                        userComments.container.append($('<div>').addClass('user-comment-empty').append($('<div>'), $('<span>').text(frmRes.r.userCommentEmpty)))
                    }
                    userComments.moreBtn.hide();
                }
            }
        });
    }


    function getmentions() {
        var createRow = function (item) {

            var edited = item.Text.includes('[crmedited]') ? '<span class="cCompStatusEdit" title=""> ' + frmRes.r.edited + '</span>' : '';
            var deleted = item.Text.includes('[crmdeleted]') ? '<span class="cCompStatusDelete" title=""> ' + frmRes.r.deleted + '</span>' : '';
            item.Text = item.Text.replace(/\[crmedited\]/g, '');
            item.Text = item.Text.replace(/\[crmdeleted\]/g, '');

            switch (item.CommentType) {
                case 1:
                    item.CommentTypeStr = ' <a href="#" onclick="showSaleInfo(' + item.Code + ');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 2:
                    item.CommentTypeStr = ' <a href="#" onclick="customer_Show_Info(' + item.Code + ',\'\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 4:
                    item.CommentTypeStr = ' <a href="#" onclick="showFormInfo(' + item.Code + ',\'\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
                case 5:
                    item.CommentTypeStr = ' <a href="#" onclick="show_ticket(' + item.Code + ',\'' + item.Code + '\');return false;" >' + item.CommentTypeStr + ' ' + item.Code + '</a>';
                    break;
            };

            return $('<div class="user-comment" >' +
                        '<img class="float-right" src="' + (item.attachment_picture == null || item.attachment_picture == "" ? "../themes/resources/images/noimage.jpg" : item.attachment_picture) + '"/>' +
                        '<div class="message-container">' +
                            '<div class="time-comment float-left" title="' + item.dateString.day_name + ' ' + item.dateString.day + ' ' + item.dateString.month_name + ' ' + item.time + '">' + item.TimeAgo + '</div>' +
                            '<div class="message-comment">' + item.Text + edited + deleted + '</div>' +
                            '<div class="username-comment">' + item.UserName + ' ' + item.CommentTypeStr+'</div>' +
                        '</div>' +
                     '</div>');
        }
        var e = {
            d: $('#HFdomain').val(), c: $('#HFcodeDU').val(), u: $('#HFUserCode').val(),
            PageSize: userMentions.PageSize,
            PageNum: userMentions.PageNum
        }
        userMentions.loading.show();
        userMentions.isLoading = true;
        $.ajax({
            url: "/WebServices/CommentServices.asmx/getComments_Mention", type: "POST",
            contentType: "application/json; charset=utf-8", dataType: "json",
            data: JSON.stringify({ searchobj: e }),
            success: function (c) {
                userMentions.loading.hide();
                userMentions.isLoading = false;
                if (c.d[0] == 1) {
                    var totlalRow = 0;
                    var firstRow;
                    $.each(c.d[1], function (i, item) {
                        totlalRow = item.TotalRow;
                        var row = createRow(item);
                        userMentions.container.append(row);
                        if (i == 0) firstRow = row;
                    });
                    if (firstRow && userMentions.PageNum != 1) {
                        setTimeout(function () { $('html,body').animate({ scrollTop: userMentions.moreBtn.offset().top - 300 }, 500, 'linear'); }, 200);
                    }
                    userMentions.moreBtn.show();
                } else {
                    if (userMentions.PageNum == 1) {
                        userMentions.container.append($('<div>').addClass('user-comment-empty').append($('<div>'), $('<span>').text(frmRes.r.userCommentEmpty)))
                    }
                    userMentions.moreBtn.hide();
                }
            }
        });
    }


    function getUserLog() {
        var createRow = function (item) {
            var icon = getIconUser_log(item.mode);

            var desc = item.description;
            var matcherScriptLog = new RegExp("<[^>]*script?.>", "gi");
            if (desc.match(matcherScriptLog) != null) desc = desc.replace(matcherScriptLog, '');

            var date_ = item.date + ' ' + item.time;
            if ($('#HFlang').val() == 'fa') {
                moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
                date_ = moment(date_, 'jYYYY/jM/jD HH:mm').calendar();
            }

            return $('<div class="user-log" >' +
                        '<span class="logicon float-right" mode="' + item.mode + '" style="background-color:' + icon.color + '"><i class="' + icon.icon + '"></i></span>' +
                        '<span class="logdate float-left" title="' + item.date + ' ' + item.time + '">' + date_ + '</span>' +
                        '<div  class="logtitle">' + desc + '</div>' +
                        '<span class="logusername">' + item.user_name + '</span>' +
                     '</div>');
        }

        userLog.isLoading = true;
        userLog.loading.show();
        FormUtility.postExtra('profile.aspx/getUserLog_', { pageNum: userLog.pageNum, pageSize: userLog.pageSize },
         function (isSuccess, message, data) {
             userLog.isLoading = false;
             userLog.loading.hide();
             if (isSuccess) {
                 var firstRow;
                 $.each(data, function (i, item) {
                     var row = createRow(item);
                     userLog.container.append(row);
                     if (i == 0) firstRow = row;
                 });
                 userLog.moreBtn.toggle(message != '0' && parseInt(message) > data.length);
                 if (message == '0' && userLog.pageNum == 1) {
                     userLog.container.append($('<div>').addClass('user-log-empty').append($('<div>'), $('<span>').text(frmRes.r.userActivitiesEmpty)))
                 }
                 if (firstRow && userLog.pageNum != 1) {
                     setTimeout(function () { $('html,body').animate({ scrollTop: firstRow.offset().top - 300 }, 500, 'linear'); }, 200);
                 }
             }
         });
    }

})($);