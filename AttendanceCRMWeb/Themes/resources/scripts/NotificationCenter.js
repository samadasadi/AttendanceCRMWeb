/// <reference path="jquery-1.4.4.min.js" />
function NotificationCenter(lang, timeZoneAddedMinuts) {
    var that = this;
    var isTabActive = true;
    var durationDisplayNoti = 15 * 1000;
    var maxDisplayNotiCount = 3;
    var arrShowedNoti = [];
    var arrBoxNoti = [];
    var badgeCount = 0;
    var badgeIsImportant = false;

    var notiPlace = $('<div>').addClass('n-place').appendTo($('body'));
    var mainContainer = $('<div>').addClass('n-container').appendTo($('body'));

    var utility = new Utility();
    var notiBox = new NotiBox();
    var settingBox = new SettingBox();
    var centerId = utility.randomId('centerId_');


    //Main Methods
    that.addCategory = notiBox.addCategory;
    that.addNoti = notiBox.addNoti;
    that.showLoading = function () { notiBox.showLoading(); settingBox.showLoading(); }
    that.hideLoading = function () { notiBox.hideLoading(); settingBox.hideLoading(); }
    that.showEmptyMessage = notiBox.showEmptyMessage;
    that.hideEmptyMessage = notiBox.hideEmptyMessage;
    that.showNoti = showNoti;
    that.createNoti = function () { return new Noti() };
    that.getNotiById = getNotiById;
    that.getNotiByExtraId = getNotiByExtraId;
    that.addModuleSetting = settingBox.addModuleSetting;
    that.getPlaceUI = function () { return notiPlace };
    that.getCenterId = function () { return centerId };
    that.setBadge = function (count, isImportant) { badgeCount = count; badgeIsImportant = isImportant; onChangeBadgeListener(badgeCount, isImportant); }
    that.addBadge = function (number) { that.setBadge(badgeCount + number, badgeIsImportant); }


    //Listener
    var onCloseNotiListener = function (arrNoti) { }
    var onChangeSettingListener = function (setting) { }
    var onRequestGetNotiListener = function (mode) { }
    var onRequestGetModuleSettingListener = function (callback) { }
    var onClearNotiListener = function (mode) { }
    var onPinNotiListener = function (id, enable) { }
    var onChangeBadgeListener = function () { }
    that.setOnCloseNotiListener = function (listener) { onCloseNotiListener = listener; }
    that.setOnChangeSettingListener = function (listener) { onChangeSettingListener = listener; }
    that.setOnRequestGetNotiListener = function (listener) { onRequestGetNotiListener = listener; }
    that.setOnRequestGetModuleSettingListener = function (listener) { onRequestGetModuleSettingListener = listener; }
    that.setOnClearNotiListener = function (listener) { onClearNotiListener = listener; }
    that.setOnPinNotiListener = function (listener) { onPinNotiListener = listener; }
    that.setOnChangeBadgeListener = function (listener) { onChangeBadgeListener = listener; }



    var notiPlaceCloseAll = $('<div>').hide().addClass('noti-close-all').text(utility.r.closeAll).appendTo(notiPlace);
    notiPlaceCloseAll.click(function () {
        onCloseNotiListener(arrShowedNoti);
        notiPlaceCloseAll.removeClass('active').hide();
        $.each(arrShowedNoti, function (n, noti) {
            clearTimeout(noti.timerClose);
            clearTimeout(noti.timerFadeOut);
            noti.close(false);
        });
        arrShowedNoti = [];
    });

    var isHoverInNotiPlace = false;
    notiPlace.hover(function () {
        isHoverInNotiPlace = true;
    }, function () {
        isHoverInNotiPlace = false;
    });


    function showNoti(noti) {
        arrShowedNoti.push(noti);

        noti.setOnCloseListener(function () {
            arrShowedNoti.splice($.inArray(noti, arrShowedNoti), 1);
            notiPlaceCloseAll.toggleClass('active', arrShowedNoti.length > 1);
            notiPlaceCloseAll.toggle(arrShowedNoti.length > 1);
            clearTimeout(noti.timerClose);
            clearTimeout(noti.timerFadeOut);
        });

        noti.getUI().hover(function () {
            noti.isHover = true;
        }, function () {
            noti.isHover = false;
        });

        notiPlaceCloseAll.after(noti.getUI().addClass('bounceInLeft'));
        notiPlaceCloseAll.toggleClass('active', arrShowedNoti.length > 1);
        notiPlaceCloseAll.toggle(arrShowedNoti.length > 1);

        var _url = window.location.origin + '/Themes/resources/sounds/' + noti.getSoundId() + '.mp3';
        if (noti.getSoundId() != 0) playSound(_url);

        while (arrShowedNoti.length > maxDisplayNotiCount) {
            var oldNoti = $.grep(arrShowedNoti, function (s) { return !s.isHover })[0];
            oldNoti.close(true);
            onCloseNotiListener([oldNoti]);
        }

        if (noti.getAllowBrowserNotification() && !isTabActive) {
            utility.browserNotificationShow(noti.getTitle(), noti.getDetail(), noti.getPicture(), function () {
                window.focus();
            });
        }

    }

    function userStartedActivity() {
        $.each(arrShowedNoti, function (n, noti) {
            if (isHoverInNotiPlace) {
                clearTimeout(noti.timerClose);
                noti.timerClose = false;
                clearTimeout(noti.timerFadeOut);
                noti.getUI().removeClass('fadeOutLow');
            } else if (!noti.timerClose) {
                noti.timerClose = setTimeout(function () { noti.close(true); onCloseNotiListener([noti]); }, durationDisplayNoti);
                noti.timerFadeOut = setTimeout(function () { noti.getUI().addClass('fadeOutLow').removeClass('bounceInLeft') }, durationDisplayNoti - (5 * 1000));
            }
            noti.setViewed(true);
        });
    }


    function getNotiById(id) {
        var showedNoti = $.grep(arrShowedNoti, function (s) { return s.getId() == id });
        if (showedNoti.length != 0) return showedNoti[0];
        var boxNoti = $.grep(arrBoxNoti, function (s) { return s.getId() == id });
        if (boxNoti.length != 0) return boxNoti[0];
        return null;
    }

    function getNotiByExtraId(extraId) {
        var showedNoti = $.grep(arrShowedNoti, function (s) { return s.getExtraId() == extraId });
        if (showedNoti.length != 0) return showedNoti[0];
        var boxNoti = $.grep(arrBoxNoti, function (s) { return s.getExtraId() == extraId });
        if (boxNoti.length != 0) return boxNoti[0];
        return null;
    }


    function playSound(url) {
        try {
            var soundHandler = new Audio();
            soundHandler.loop = false;
            soundHandler.preload = true;
            soundHandler.controls = false;
            soundHandler.autoplay = true;
            soundHandler.src = url;
            soundHandler.play();
        } catch (e) {
        }
    }

    function getMomentDate(date) {
        if (lang == 'fa') {
            moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
        } else {
            moment.locale('en');
        }
        return moment(date, 'MM/DD/YYYY HH:mm').add(timeZoneAddedMinuts, 'm');
    }


    function NotiBox() {
        var self = this;
        self.currentMode = 0;
        var container = $('<div>').addClass('n-c-container').appendTo(mainContainer);
        //var header = $('<div>').addClass('n-c-header').appendTo(container);
        var content = $('<div>').addClass('n-c-content n-c-scrollbar').appendTo(container);
        //var footer = $('<div>').addClass('n-c-footer').appendTo(container);

        var contentPin = $('<div>').appendTo(content);
        var contentUnPin = $('<div>').appendTo(content);

        //header
        $('<a>').attr('href', '#')
            .addClass('btn-setting icon-cog float-left')
            .attr('title', utility.r.setting)
            .click(function () {
                notiBox.hide();
                settingBox.show();
            })
            .appendTo('');
            //.appendTo(header);
        //$('<span>').addClass('title-setting float-right').append(utility.r.notificationCenter).appendTo(header);
        $('<span>').addClass('title-setting float-right').append(utility.r.notificationCenter);


        //footer
        var footerHeight = 87, footerHeightExpand = 32;
        var btnShowAllCat = $('<a>').attr('href', '#').addClass('n-link float-left').text(utility.r.expand);
        var btnClearAllNoti = $('<a>').attr('href', '#').addClass('n-link float-right').append(utility.r.clearAllNoti);
        var footerBtnWrapper = $('<div>').addClass('float-right').addClass('link-wrapper').append(btnShowAllCat, btnClearAllNoti);
        var footerCatWrapper = $('<div>').addClass('float-right').addClass('wrapper');
        //footer.css('height', footerHeight).append(footerBtnWrapper, footerCatWrapper);

        btnShowAllCat.click(function () {
            if (footer.hasClass('expand')) {
                btnShowAllCat.text(utility.r.expand);
                footer.removeClass('expand');
                footer.css('height', footerHeight);
            } else {
                btnShowAllCat.text(utility.r.collapse);
                footer.addClass('expand');
                footer.css('height', footerHeightExpand);
            }
        });

        btnClearAllNoti.click(function () {
            if (self.isLoading) return false;
            self.clear();
            onClearNotiListener(self.currentMode);
        });

        self.showLoading = function () {
            self.isLoading = true;
            self.loadingElem = $('<div>').addClass('n-c-loading spinner');
            content.append(self.loadingElem);
        }

        self.hideLoading = function () {
            self.isLoading = false;
            if (self.loadingElem) self.loadingElem.remove();
        }

        self.showEmptyMessage = function () {
            if (self.emptyMessageElem) self.emptyMessageElem.remove();
            self.emptyMessageElem = $('<div>')
                .addClass('n-c-empty-message')
                .append(
                    $('<i>').addClass('icon-bell'),
                    $('<br>'),
                    $('<span>').text(utility.r.emptyMessage)
                ).fadeIn().appendTo(content);
            btnClearAllNoti.hide();
        }

        self.hideEmptyMessage = function () {
            if (self.emptyMessageElem) self.emptyMessageElem.remove();
        }

        self.addNoti = function (noti, prepent) {
            if (self.currentMode != 0 && noti.getMode() != self.currentMode) return false;
            noti.setOnCloseListener(function () {
                arrBoxNoti.splice($.inArray(noti, arrBoxNoti), 1);
                if (arrBoxNoti.length == 0) self.showEmptyMessage();
            });
            if (noti.getIsPin()) {
                if (!prepent) contentPin.append(noti.getUI()); else contentPin.prepend(noti.getUI());
            } else {
                if (!prepent) contentUnPin.append(noti.getUI()); else contentUnPin.prepend(noti.getUI());
            }
            noti.setOnPinNotiListener(function (id, enable) {
                onPinNotiListener(id, enable);
                if (enable) {
                    contentPin.append(noti.getUI());
                } else {
                    contentUnPin.append(noti.getUI());
                }
            })
            arrBoxNoti.push(noti);
            btnClearAllNoti.show();
        }

        self.addCategory = function (mode, title, icon) {
            $('<a>')
                .addClass('item float-right' + (mode == 0 ? ' active' : ''))
                .attr('href', '#')
                .append(
                    $('<i>').addClass('icon').addClass(icon),
                    $('<span>').text(title)
                )
                .appendTo(footerCatWrapper)
                .click(function () {
                    if (self.isLoading) return false;
                    if ($(this).hasClass('active')) return false;
                    self.hideEmptyMessage();
                    footerCatWrapper.find('.item').removeClass('active');
                    $(this).addClass('active');
                    self.clear();
                    onRequestGetNotiListener(mode);
                    self.currentMode = mode;
                });
            footerHeightExpand = 32 + Math.ceil(footerCatWrapper.find('.item').length / 4) * 54;
        }
        self.show = function () {
            container.show()
        }
        self.hide = function () { container.hide() }
        self.clear = function () {
            contentPin.empty();
            contentUnPin.empty();
            arrBoxNoti = [];
        }
    }


    function SettingBox() {
        var self = this;
        var arrModule = [];
        //var container = $('<div>').addClass('n-c-container').hide().appendTo(mainContainer);
        //var header = $('<div>').addClass('n-c-header').appendTo(container);
        //var content = $('<div>').addClass('n-c-content n-c-scrollbar').appendTo(container);

        ////header
        //$('<a>').attr('href', '#')
        //    .addClass('btn-setting icon-close float-left')
        //    .attr('title', utility.r.close)
        //    .click(function () { notiBox.show(); settingBox.hide(); })
        //    .appendTo(header);
        //$('<span>').addClass('title-setting float-right').append(utility.r.notificationCenterSettings).appendTo(header);

        //self.addModuleSetting = function (module) {
        //    var wrapper = $('<div>').addClass('n-c-module').attr('title', utility.r.settingOf + ' ' + module.ModeTitle).appendTo(content);

        //    var toggleEnable = new utility.createToggle();
        //    toggleEnable.setChecked(module.Active);
        //    toggleEnable.setOnChange(function (enable) {
        //        module.Active = enable;
        //        onChangeSettingListener({ mode: module.Mode, key: 'Active', value: enable });
        //    });

        //    module.showSetting = function (backToNotiBox) {
        //        var moduleSettingBox = new ModuleSettingBox(module);
        //        moduleSettingBox.show();
        //        moduleSettingBox.setOnChangeListener(function (setting) {
        //            if (setting.key == 'Active') toggleEnable.setChecked(setting.value);
        //            onChangeSettingListener(setting);
        //        });
        //        moduleSettingBox.setOnCloseListener(function () {
        //            if (backToNotiBox) notiBox.show(); else self.show();
        //            moduleSettingBox.hide();
        //        });
        //        self.hide();
        //    }

        //    wrapper.append(
        //        $('<i>').addClass('float-right icon-cog setting-icon'),
        //        $('<i>').addClass('float-right ' + module.icon + ' module-icon'),
        //        $('<span>').text(module.ModeTitle).addClass('float-right'),
        //        toggleEnable.getUI().addClass('float-left')
        //    ).click(function () {
        //        module.showSetting();
        //    });

        //    arrModule.push(module)
        //}

        //self.getModuleByMode = function (mode) {
        //    var module = $.grep(arrModule, function (s) { return s.Mode == mode });
        //    if (module.length > 0) return module[0]; else return null;
        //}

        //self.showLoading = function () {
        //    if (self.isLoading) return false;
        //    self.isLoading = true;
        //    self.loadingElem = $('<div>').addClass('n-c-loading spinner');
        //    content.append(self.loadingElem);
        //}

        //self.hideLoading = function () {
        //    self.isLoading = false;
        //    if (self.loadingElem) self.loadingElem.remove();
        //}

        //self.show = function (callback) {
        //    container.show();
        //    if (!self.firstOpen) {
        //        self.firstOpen = true;
        //        onRequestGetModuleSettingListener(callback);
        //    } else {
        //        if (callback) callback();
        //    }
        //}
        //self.hide = function () { container.hide() }
        //self.reset = function () {
        //    self.firstOpen = false;
        //    self.hideLoading();
        //    content.empty();
        //}
    }


    function ModuleSettingBox(module) {
        //var self = this;
        //var container = $('<div>').addClass('n-c-container').hide().appendTo(mainContainer);
        //var header = $('<div>').addClass('n-c-header').appendTo(container);
        //var content = $('<div>').addClass('n-c-content n-c-scrollbar').appendTo(container);

        ////Listener
        //var onChangeListener = function (setting) { }
        //var onCloseListener = function () { }
        //self.setOnChangeListener = function (listener) { onChangeListener = listener; }
        //self.setOnCloseListener = function (listener) { onCloseListener = listener; }

        ////header
        //$('<a>').attr('href', '#')
        //    .addClass('btn-setting icon-close float-left')
        //    .attr('title', utility.r.close)
        //    .click(function () { onCloseListener() })
        //    .appendTo(header);
        //$('<span>').addClass('title-setting float-right').text(utility.r.settingOf + ' ' + module.ModeTitle).attr('title', utility.r.settingOf + ' ' + module.title).appendTo(header);

        //var createToggle = function (title, enable, callback) {
        //    var wrapper = $('<div>').addClass('n-c-module-setting').appendTo(content);
        //    var toggle = new utility.createToggle();
        //    toggle.setChecked(enable);
        //    toggle.setOnChange(callback);
        //    wrapper.append($('<span>').append(title).addClass('float-right'), toggle.getUI().addClass('float-left'));
        //}

        //var createSelector = function (title, items, selectedValue, callback) {
        //    var wrapper = $('<div>').addClass('n-c-module-setting').appendTo(content);
        //    var selectorText = $('<span>').addClass('float-right');
        //    var selector = $('<div>').addClass('n-c-module-setting-selector').append(selectorText, $('<i>').addClass('icon-angle-down float-right')).appendTo(content);
        //    var options = [];
        //    $.each(items, function (i, item) {
        //        if (item[0] == selectedValue) selectorText.text(item[1]);
        //        options.push({
        //            title: item[1], cssIcon: item[2],
        //            callback: function () {
        //                selectorText.text(item[1]);
        //                callback(item);
        //            }
        //        });
        //    })
        //    new RaveshUI.Menu(selector, { align: 'auto', appendTo: mainContainer, options: options });
        //    wrapper.append($('<span>').text(title).addClass('float-right'), selector.addClass('float-left'));
        //}

        //createToggle(utility.r.showNotifications, module.Active, function (enable) {
        //    module.Active = enable;
        //    onChangeListener({ mode: module.Mode, key: 'Active', value: enable });
        //});
        ////------
        //createToggle(utility.r.showInNoficationCenter, module.DisplayInCenter, function (enable) {
        //    module.DisplayInCenter = enable;
        //    onChangeListener({ mode: module.Mode, key: 'DisplayInCenter', value: enable });
        //});
        ////------
        //createSelector(utility.r.notificationSound, [
        //    [0, utility.r.noSound, 'icon-volume-slash'],
        //    [1, utility.r.sound1, 'icon-volume-up'],
        //    [2, utility.r.sound2, 'icon-volume-up'],
        //    [3, utility.r.sound3, 'icon-volume-up'],
        //    [4, utility.r.sound4, 'icon-volume-up'],
        //    [5, utility.r.sound5, 'icon-volume-up'],
        //    [6, utility.r.sound6, 'icon-volume-up']
        //], module.Sound, function (item) {
        //    module.Sound = item[0];
        //    onChangeListener({ mode: module.Mode, key: 'Sound', value: item[0] });
        //    if (item[0] != 0) playSound('../Themes/resources/sounds/' + item[0] + '.mp3');
        //});
        ////------
        //createSelector(utility.r.expireTime, [
        //    [1, utility.r.oneDay],
        //    [3, utility.r.threeDay],
        //    [7, utility.r.oneWeek],
        //    [14, utility.r.twoWeek]
        //], module.StayTime, function (item) {
        //    module.StayTime = item[0];
        //    onChangeListener({ mode: module.Mode, key: 'StayTime', value: item[0] });
        //});
        ////------
        //createToggle(utility.r.highPriorityNotification, module.Announcement, function (enable) {
        //    module.Announcement = enable;
        //    onChangeListener({ mode: module.Mode, key: 'Announcement', value: enable });
        //});
        ////------
        //createToggle(utility.r.showBrowserNotification, module.BrowserNotification, function (enable, toggleUI) {
        //    if (utility.browserNotificationHasPermission()) {
        //        module.BrowserNotification = enable;
        //        onChangeListener({ mode: module.Mode, key: 'BrowserNotification', value: enable });
        //    } else {
        //        if (enable) {
        //            utility.browserNotificationRequestPermission(function (allow) {
        //                if (allow) {
        //                    module.BrowserNotification = enable;
        //                    onChangeListener({ mode: module.Mode, key: 'BrowserNotification', value: enable });
        //                } else {
        //                    toggleUI.setChecked(false);
        //                }
        //            });
        //        } else {
        //            module.BrowserNotification = enable;
        //            onChangeListener({ mode: module.Mode, key: 'BrowserNotification', value: enable });
        //        }

        //    }
        //});
        ////------
        //createToggle(utility.r.sendWithTelegramBot, module.Social, function (enable) {
        //    module.Social = enable;
        //    onChangeListener({ mode: module.Mode, key: 'Social', value: enable });
        //});

        ////Methods
        //self.show = function () { container.show() }
        //self.hide = function () { container.remove() }
    }


    function Noti() {
        var self = this;
        var data = {
            id: 0,
            mode: 0,
            extraId: 0,
            title: '',
            detail: '',
            picture: '',
            soundId: 0,
            viewed: false,
            allowBrowserNotification: false,
            isPin: false,
            allowDelete: false,
            noNeedShow: false,
            closeAfterClick: true
        };

        var container = $('<div>').addClass('noti-container');
        var wrapper = $('<div>').addClass('noti-wrapper').appendTo(container);
        var titleElem = $('<div>').addClass('noti-title');
        var detailElem = $('<div>').addClass('noti-detail');
        var pictureElem = $('<img>').addClass('noti-picture');
        var dateElem = $('<div>').addClass('noti-date');
        var labelElem = $('<div>').addClass('noti-label');
        var extraElem = $('<div>').addClass('noti-extra');
        var closeBtnElem = $('<i>').addClass('icon-close noti-action noti-close').attr('title', utility.r.close);
        wrapper.append(titleElem, detailElem, pictureElem, dateElem, labelElem, extraElem, closeBtnElem);

        closeBtnElem.click(function (ev) {
            data.allowDelete = true;
            self.setViewed(true);
            self.close(true);
            onCloseNotiListener([self]);
            ev.stopPropagation();
        });
        wrapper.click(function () {
            onClickListener();
            self.setViewed(true);
            if (data.closeAfterClick && !self.getIsPin()) {
                self.close(true);
                onCloseNotiListener([self]);
            }
        });


        //Methods
        self.getUI = function () { return container };
        self.setLableColor = function (color) { labelElem.css('background-color', color); return self; }
        self.setId = function (id) { data.id = id; return self; }
        self.getId = function () { return data.id; }
        self.setMode = function (mode) { data.mode = mode; return self; }
        self.getMode = function () { return data.mode; }
        self.setExtraId = function (extraId) { data.extraId = extraId; return self; }
        self.getExtraId = function () { return data.extraId; }
        self.setSoundId = function (soundId) { data.soundId = soundId; return self; }
        self.getSoundId = function () { return data.soundId; }
        self.setViewed = function (viewed) { data.viewed = viewed; return self; }
        self.getViewed = function () { return data.viewed; }
        self.setNoNeedShow = function (enable) { data.noNeedShow = enable; return self; }
        self.getNoNeedShow = function () { return data.noNeedShow; }
        self.setAllowBrowserNotification = function (allow) { data.allowBrowserNotification = allow; return self; }
        self.getAllowBrowserNotification = function () { return data.allowBrowserNotification; }
        self.close = function (callListener) {
            if (self.closed) return false;
            if (callListener) onCloseListener();
            container.removeClass('bounceInLeft').addClass('fadeOut');
            container.slideUp(300, function () {
                container.remove();
            });
            self.closed = true;
        }
        self.getTitle = function () { return data.title };
        self.setTitle = function (title) {
            data.title = title;
            titleElem.text(utility.numberLocalize(title));
            return self;
        }
        self.getDetail = function () { return data.detail };
        self.setDetail = function (detail) {
            data.detail = detail;
            detailElem.html('\u202B' + utility.numberLocalize(detail.replace(/\n/g, '<br>')));
            return self;
        }
        self.setDate = function (date) {
            var mDate = getMomentDate(date);
            dateElem.text(mDate.calendar()).attr('title', mDate.format('LLL'));
            return self;
        }
        self.getPicture = function () { return data.picture };
        self.setPicture = function (picture) {
            data.picture = picture;
            pictureElem.attr('src', picture);
            return self;
        }
        self.setProgress = function (percent) {
            var progressBar = extraElem.find('.noti-progress-bar');
            if (progressBar.length == 0) {
                progressBar = $('<div>').addClass('noti-progress-bar');
                $('<div>').addClass('noti-progress').append(progressBar).appendTo(extraElem);
            }
            progressBar.css('width', percent + '%');
            return self;
        }
        self.addButton = function (title, callback, isLink) {
            title = '\u202B' + utility.numberLocalize(title);
            if (callback) {
                if (isLink) {
                    $('<a>').addClass('noti-button').attr({ 'href': callback, target: '_blank' }).text(title).appendTo(extraElem);
                } else {
                    $('<a>').addClass('noti-button').attr('href', '#').text(title).click(function (ev) { callback(); ev.stopPropagation(); }).appendTo(extraElem);
                }
            } else {
                $('<span>').addClass('noti-button').text(title).appendTo(extraElem);
            }
            return self;
        }
        self.clearExtra = function () { extraElem.empty(); }
        self.clearButtons = function () { extraElem.find('.noti-button').remove(); }
        self.closeAfterClick = function (enable) { data.closeAfterClick = enable; return self; }
        self.getIsPin = function () { return data.isPin };
        self.showPinButton = function (isPin) {
            data.isPin = isPin;
            $('<i>')
                .attr('title', (isPin ? utility.r.unpin : utility.r.pin))
                .addClass('icon-thumbtack noti-action noti-pin' + (isPin ? '' : ' unpin'))
                .click(function (ev) {
                    if ($(this).hasClass('unpin')) {
                        data.isPin = true;
                        $(this).removeClass('unpin').attr('title', utility.r.unpin);
                    } else {
                        data.isPin = false;
                        $(this).addClass('unpin').attr('title', utility.r.pin);
                    }
                    setTimeout(function () { onPinNotiListener(self.getId(), data.isPin); }, 300);
                    ev.stopPropagation();
                })
                .appendTo(wrapper);
            return self;
        }
        self.showSettingButton = function (mode, modeTitle) {
            $('<i>')
                .attr('title', utility.r.setting)
                .addClass('icon-cog noti-action noti-setting')
                .click(function (ev) {
                    notiBox.hide();
                    settingBox.show(function () {
                        settingBox.getModuleByMode(mode).showSetting(true);
                    });
                    ev.stopPropagation();
                })
                .appendTo(wrapper);
            return self;
        }
        self.showInPage = function () {
            if (self.getNoNeedShow()) return false;
            that.showNoti(self);
            return self;
        }
        self.showInNotiCenter = function (prepend) {
            that.addNoti(self, prepend);
            return self;
        }
        self.allowDelete = function () {
            return data.allowDelete;
        }

        //Listener
        var onClickListener = function () { }
        var onCloseListener = function () { }
        var onPinNotiListener = function (id, enable) { }
        self.setOnClickListener = function (listener) { onClickListener = listener; return self; }
        self.setOnCloseListener = function (listener) { onCloseListener = listener; return self; }
        self.setOnPinNotiListener = function (listener) { onPinNotiListener = listener; return self; }
    }


    function Utility() {
        var self = this;
        var resources = {
            en: {
                notificationCenter: 'Notification center',
                notificationCenterSettings: 'Notification center settings',
                setting: 'Setting',
                settingOf: 'Setting of',
                expand: 'Expand',
                collapse: 'Collapse',
                clearAllNoti: 'Clear all',
                close: 'Close',
                closeAll: 'Hide all',
                emptyMessage: 'No notifications yet',
                showNotifications: 'Notifications',
                showInNoficationCenter: 'Display in nofification center',
                notificationSound: 'Sound',
                sound1: 'Sound 1',
                sound2: 'Sound 2',
                sound3: 'Sound 3',
                sound4: 'Sound 4',
                sound5: 'Sound 5',
                sound6: 'Sound 6',
                noSound: 'Mute',
                expireTime: 'Expire time',
                oneDay: 'One day',
                threeDay: 'Three day',
                oneWeek: 'One week',
                twoWeek: 'Two week',
                highPriorityNotification: 'High priority notification',
                showBrowserNotification: 'Show browser notification',
                sendWithTelegramBot: 'Send with telegram bot',
                pin: 'Pin',
                unpin: 'Unpin',
                allowNotification: 'allow notification in your browser'
            },
            fa: {
                notificationCenter: 'مرکز اطلاع&zwnj;رسانی',
                notificationCenterSettings: 'تنظیمات مرکز اطلاع&zwnj;رسانی',
                setting: 'تنظیمات',
                settingOf: 'تنظیمات اعلان',
                expand: 'موارد بیشتر',
                collapse: 'بستن',
                clearAllNoti: 'پاکسازی اعلان&zwnj;ها',
                close: 'بستن',
                closeAll: 'بستن همه',
                emptyMessage: 'اعلانی برای نمایش وجود ندارد',
                showNotifications: 'نمایش اعلان',
                showInNoficationCenter: 'نمایش اعلان در مرکز اطلاع&zwnj;رسانی',
                notificationSound: 'صدای اعلان',
                sound1: 'صدای ۱',
                sound2: 'صدای ۲',
                sound3: 'صدای ۳',
                sound4: 'صدای ۴',
                sound5: 'صدای ۵',
                sound6: 'صدای ۶',
                noSound: 'بدون صدا',
                expireTime: 'زمان نگهداری اعلان',
                oneDay: 'یک روز',
                threeDay: 'سه روز',
                oneWeek: 'یک هفته',
                twoWeek: 'دو هفته',
                highPriorityNotification: 'اعلان با اهمیت بالا',
                showBrowserNotification: 'نمایش اعلان مرورگر',
                sendWithTelegramBot: 'ارسال از طریق ربات تلگرام',
                pin: 'سنجاق کردن',
                unpin: 'خارج کردن از سنجاق',
                allowNotification: 'دسترسی ارسال اعلان مرورگر را فعال کنید'
            }
        }
        self.r = resources[lang];
        self.numberLocalize = function (text) {
            if (lang == "en") return text;
            var str = text.toString();
            var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            //for (var i = 0; i <= 9; i++) str = str.replace(new RegExp(i, "g"), persian[i]);
            return str;
        }
        self.randomId = function (prefix) {
            return (prefix ? prefix : 'id') + Math.random().toString(36).substr(2, 10);
        }
        self.createToggle = function () {
            var toggle = this;
            var onChange = function () { }
            var id = self.randomId();
            var container = $('<label>').addClass('n-c-toggle').attr({ 'for': id });
            var input = $('<input>').attr({ 'id': id, 'type': 'checkbox' });
            container.append(input, $('<div>').addClass('slider'));

            container.click(function (ev) { ev.stopPropagation() });
            input.change(function () {
                container.toggleClass('checked', toggle.getChecked());
                onChange(toggle.getChecked(), toggle);
            });

            toggle.getUI = function () { return container };
            toggle.setDisable = function (enable) { input.attr('disabled', enable); container.toggleClass('disabled', enable); }
            toggle.setChecked = function (checked) { input.attr('checked', checked); container.toggleClass('checked', checked); }
            toggle.getChecked = function () { return input.is(':checked') };
            toggle.setOnChange = function (callback) { onChange = callback };
        }
        self.browserNotificationHasPermission = function () {
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
                return false;
            }

            if (Notification.permission === "granted") {
                return true;
            }
        }
        self.browserNotificationShow = function (title, detail, picture, callback) {
            var notification = new Notification(title, {
                body: detail,
                icon: picture
            });
            if (callback) notification.onclick = callback;
        }
        self.browserNotificationRequestPermission = function (callback) {
            Notification.requestPermission().then(function (permission) {
                callback(permission === 'granted');
                if (permission !== 'granted') alert(self.r.allowNotification);
            });
        }
    }


    var timerShowHide;
    that.show = function () {
        //mainContainer.show();
        //$(document).bind('mousedown', hideMenuHandler);
        //clearTimeout(timerShowHide);
        //timerShowHide = setTimeout(function () { mainContainer.addClass('active'); }, 50);
        //if (!that.firstOpen) {
        //    that.firstOpen = true;
        //    notiBox.clear();
        //    onRequestGetNotiListener(0);
        //}
    }

    that.hide = function () {
        //mainContainer.removeClass('active');
        //$(document).unbind('mousedown', hideMenuHandler);
        //clearTimeout(timerShowHide);
        //timerShowHide = setTimeout(function () { mainContainer.hide(); }, 300);
    }

    that.reset = function () {
        that.firstOpen = false;
        that.hideLoading();
        settingBox.reset();
        settingBox.hide();
        notiBox.clear();
        notiBox.show();
        that.hide();
    }

    function hideMenuHandler(ev) {
        var unlessClass = ['n-container'];
        for (var i = 0; i <= unlessClass.length - 1; i++) {
            if ($(ev.target).parents('.' + unlessClass[i]).length != 0 || $(ev.target).hasClass(unlessClass[i])) return false;
        }
        that.hide();
    }


    $(window).focus(function () { isTabActive = true; });
    $(window).blur(function () { isTabActive = false; });

    var userActivityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    $.each(userActivityEvents, function (e, eventName) { document.addEventListener(eventName, userStartedActivity, true); })

}





