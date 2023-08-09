(function () {
    var Ravesh = {};

    Ravesh.isMobile = (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent));
    Ravesh.isIos = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    function numberLocalizer(number, lang) {
        if (!number) return '';
        str = number.toString();
        if (lang == "en") return str;
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        for (var i = 0; i <= 9; i++) str = str.replace(new RegExp(i, "g"), persian[i]);
        return str;
    }

    Ravesh.TimePicker = function (options) {
        var self = this;

        var defaultOptions = {
            lang: 'en',
            width: 'auto',
            showCancel: true,
            clockMode:'analog',
            selectedTime: '', // if empty set current time. format e.g = 12:00
            onSelected: function () { },
            onComplete: function () { }
        }
        options = $.extend(true, defaultOptions, options || {});

        //methods
        self.getUI = function () { return container };


        var resource = { en: { am: 'AM', pm: 'PM', cancel: 'Cancel' }, fa: { am: 'ق‌ظ', pm: 'ب‌ظ', cancel: 'انصراف' } }
        var time = convertStrToTime(options.selectedTime);
        var mouseIsDown = false;
        var isMinMode = false;
        var checkTime = { hour: time.hour, min: time.min };


        var body = $('body');
        var container = $('<div>').addClass('ravesh-time-picker dir-' + (options.lang == 'fa' ? 'rtl' : 'ltr'));
        container.css({ 'width': options.width });

        //Only Digital
        
            var timeDigital = $('<div>').addClass('clock-containerDigital').appendTo(container);
            var timeHourDigital = $('<input>').attr({ 'type': 'text', maxlength: 2 }).addClass('timeHourDigital');
            var timeColonDigital = $('<span>').addClass('colon').text(':');
            var timeMinDigital = $('<input>').attr({ 'type': 'text', maxlength: 2 }).addClass('timeMinDigital');
            timeDigital.append(timeHourDigital, timeColonDigital, timeMinDigital);

            timeHourDigital.click(function () { $(this).select(); });
            timeMinDigital.click(function () { $(this).select(); });

            timeMinDigital.bind('paste', function (e) {
             e.preventDefault();
            });
            timeHourDigital.bind('paste', function (e) {
                e.preventDefault();
            });
  
            timeHourDigital.change(function () {
                DigitalCheck(true)
            });
            timeHourDigital.focusin(function () {
                setDigitalInput(true);
            });
            timeMinDigital.focusin(function () {
                setDigitalInput(true);
            });
            timeHourDigital.keyup(function () {
                DigitalCheck(true);
            });
            timeHourDigital.blur(function () {
                setDigitalInput(true);
            });
            timeMinDigital.blur(function () {
                setDigitalInput(false);
            });

            function setDigitalInput(ctl) {
                var h = DigitalReplace(timeHourDigital.val());
                var m = timeMinDigital.val()
                if (m == '' || h == '') {
                    options.onSelected('');
                } else {
                    if (ctl) {
                        setHandleHour(parseInt(time.isAm ? h : h - 12));
                    } else {
                        setHandleMin(parseInt(DigitalReplace(m)));
                    }
                  
                }
            }
            timeMinDigital.change(function () {
                DigitalCheck(false)
            });

            timeMinDigital.keyup(function () {
                DigitalCheck(false);
            });

            function DigitalReplace(val) {
                var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
                var arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
                for (var i = 0; i < 10; i++) {
                    val = val.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
                }
                return val;
            }
            function DigitalCheck(ctl) {
                var val;
                if (ctl) {
                    val =timeHourDigital.val();
                } else {
                    val = timeMinDigital.val();
                }

                val= DigitalReplace(val);
                if (ctl) {

                    if (!(/^(2[0-3]|[01]?[0-9])$/.test(val))) {
                        val = val.slice(0, -1);
                    }
                    if (val>=12){
                        setAmMode(false);
                    } else {
                        setAmMode(true);
                    }
                    timeHourDigital.val(val);

                    if (val != '') {
                        setHandleHour(parseInt(time.isAm ? val : val - 12));
                    } else {
                        options.onSelected('');
                    }

                  
                } else {

                    if (!(/^([0-5]?[0-9])$/.test(val))) {
                        val = val.slice(0, -1);
                    }
                    timeMinDigital.val(val);
                    if (val !='') {
                        setHandleMin(parseInt(DigitalReplace(val)));
                    } else {
                        options.onSelected('');
                    }

                }

            }

         

       

            //preview time
            var timePreview = $('<div>').addClass('preview').appendTo(container);
            var timeHour = $('<span>').addClass('hour');
            var timeMin = $('<span>').addClass('min');
            var timeColon = $('<span>').addClass('colon').text(':');
            timePreview.append(timeHour, timeColon, timeMin);
            timeHour.click(function () { setMinMode(false); });
            timeMin.click(function () { setMinMode(true); });

           

            //analog clock
            var clockContainer = $('<div>').addClass('clock-container').appendTo(container);
            var clock = $('<div>').addClass('clock').appendTo(clockContainer);


            //hour clock
            var hourNumbers = $('<div>').addClass('hour').appendTo(clock);
            for (var i = 0; i < 12; i++) {
                var hour = $('<div>').addClass('num').text(numberPad(i == 0 ? 12 : i));
                hour.css('transform', 'rotate(' + (i * 30) + 'deg) translateY(-80px) rotate(-' + (i * 30) + 'deg)');
                hourNumbers.append(hour);
            }
            var hourHandleBar = $('<div>').addClass('handle-bar');
            var hourHandle = $('<div>').addClass('handle');
            hourNumbers.append(hourHandleBar, hourHandle);


            //min clock
            var minNumbers = $('<div>').addClass('min').appendTo(clock);
            var s = 0;
            for (var i = 0; i < 12; i++) {
                var min = $('<div>').addClass('num').text(numberPad(s));
                min.css('transform', 'rotate(' + (i * 30) + 'deg) translateY(-78px) rotate(-' + (i * 30) + 'deg)');
                minNumbers.append(min);
                s = s + 5
            }
            var minHandleBar = $('<div>').addClass('handle-bar');
            var minHandle = $('<div>').addClass('handle');
            minNumbers.append(minHandleBar, minHandle);

       




        //cancel
        if (options.showCancel) {
            var btnCancel = $('<span>').text(resource[options.lang].cancel);
            container.append($('<div>').addClass('cancel').append(btnCancel));
            btnCancel.click(function () {
                options.onSelected('');
                options.onComplete();
            });
        }




        //am pm button
        var amBtn = $('<div>').addClass('am-btn').text(resource[options.lang].am);
        var pmBtn = $('<div>').addClass('pm-btn').text(resource[options.lang].pm);

        clockContainer.append(amBtn, pmBtn);


        if (options.clockMode == 'digital') {
            timePreview.hide();
            clock.hide();
            clockContainer.addClass('digital');
            amBtn.addClass('digital');
            pmBtn.addClass('digital');
        } else {
            timeDigital.hide();
        }
        
        
        amBtn.click(function () { setAmMode(true); setDigitalTime(); });
        pmBtn.click(function () { setAmMode(false); setDigitalTime(); });

        var initTimePicker = true;
        setAmMode(time.isAm);
        setMinMode(false, true);
        setDigitalTime();
        
        initTimePicker = false;

        body.bind(Ravesh.isMobile ? 'touchend' : 'mouseup', function (ev) {
            if (mouseIsDown) {
                if (!isMinMode)
                    setMinMode(true);
                else
                    options.onComplete();
            }
            mouseIsDown = false;
        });

        body.bind('mousemove touchmove', function (ev) {
            handleMove(ev);
        });

        clock.bind('mousedown touchstart', function (ev) {
            mouseIsDown = true;
            handleMove(ev);
        });

        function setDigitalTime() {
            timeHourDigital.val(numberPad(time.isAm ? time.hour : time.hour + 12));
            timeMinDigital.val(numberPad(time.min));
        }

        function setMinMode(ctl, noAnim) {
            isMinMode = ctl;
            timeHour.toggleClass('active', !ctl);
            timeMin.toggleClass('active', ctl);
            if (noAnim) {
                hourNumbers.toggle(!ctl);
                minNumbers.toggle(ctl);
            } else {
                if (ctl) hourNumbers.stop(true).fadeOut(); else hourNumbers.stop(true).fadeIn();
                if (!ctl) minNumbers.stop(true).fadeOut(); else minNumbers.stop(true).fadeIn();
            }
        }
        function setAmMode(ctl) {
            time.isAm = ctl;
            amBtn.toggleClass('active', ctl);
            pmBtn.toggleClass('active', !ctl);
            setHandleHour(time.hour);
            setHandleMin(time.min);
            setMinMode(false);
        }
        function setHandleHour(hrs) {
            time.hour = hrs == 12 ? 0 : hrs;
            setHandle(hourHandleBar, hourHandle, time.hour, time.hour == 0 ? 12 : time.hour);
            timeHour.text(numberPad(time.isAm ? time.hour : time.hour + 12));
            if (!initTimePicker) options.onSelected(convertTimeToStr());
            if (checkTime.hour != time.hour) {
                checkTime.hour = time.hour;
                window.navigator.vibrate(50);
            }
        }
        function setHandleMin(hrs) {
            time.min = hrs == 60 ? 0 : hrs;
            setHandle(minHandleBar, minHandle, time.min / 5, time.min == 60 ? 0 : time.min);
            timeMin.text(numberPad(time.min));
            if (!initTimePicker) options.onSelected(convertTimeToStr());
            if (checkTime.min != time.min) {
                checkTime.min = time.min;
                window.navigator.vibrate(20);
            }
        }
        function setHandle(handlerBar, handler, number, handlerNumber) {
            var deg = number * 30;
            handler.text(numberPad(handlerNumber)).css({
                'transform': 'rotate(' + (deg).toFixed(20) + 'deg) translateY(-78px) rotate(-' + (deg).toFixed(20) + 'deg)'
            });
            handlerBar.css({
                'transform': 'rotate(' + (deg).toFixed(20) + 'deg)'
            });
        }
        function handleMove(ev) {
            if (!mouseIsDown) return;

            var x = Math.floor(ev.pageX),
                y = Math.floor(ev.pageY);
            if (ev.originalEvent && ev.originalEvent.targetTouches) {
                var touch = ev.originalEvent.targetTouches.item(0);
                x = touch.pageX;
                y = touch.pageY;
            } else {
                ev.preventDefault();
            }

            var pos = clockContainer.offset();
            var cent = { left: clockContainer.outerWidth() / 2 + pos.left, top: clockContainer.outerHeight() / 2 + pos.top };
            var hrs = Math.atan2(y - cent.top, x - cent.left) / Math.PI * 6 + 3;
            hrs += 12;
            hrs %= 12;
            if (isMinMode) {
                setHandleMin(Math.round(hrs * 5));
            } else {
                setHandleHour(Math.round(hrs));
            }
        }

        function convertTimeToStr() {
            return padNumber(time.isAm ? time.hour : time.hour + 12) + ':' + padNumber(time.min);
        }
        function convertStrToTime(str) {
            var h = 0, m = 0;
            if (str == '') {
                var d = new Date();
                h = d.getHours();
                m = d.getMinutes();
            } else {
                h = parseInt(str.split(":")[0]);
                m = parseInt(str.split(":")[1]);
            }
            return {
                hour: h > 12 ? h - 12 : h,
                min: m,
                isAm: h < 12
            }
        }
        function numberPad(number) {
            return numberLocalizer(padNumber(number), options.lang);
        }
        function padNumber(number) {
            return parseInt(number) < 10 && parseInt(number) >= 0 ? '0' + number.toString() : number.toString();
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.DropDown = function (options) {
        var self = this;

        //Options
        var defaultOptions = {
            width: 180,
            maxHeight: 300,
            maxWidth: 300,
            dir: 'ltr',
            allowSearch: true,
            arrow: true,
            selectText: true,
            createContent: createContent,
            ajaxUrl: '',
            getAjaxParam: function (key) { return { key: key } },
            options: [],// array of {id:'', title:''}
            emptyId: '',
            emptyOption: null,
            defaultId: '',
            defaultTitle: '',
            createOptionUI: createOptionUI,
            createOptionUIBefore: createOptionUIBefore,
            onSelected: function (opt) { },
            onClick: function () { }
        }
        options = $.extend(true, defaultOptions, options || {});


        //Methods
        self.getUI = function () { return container };
        self.getInput = function () { return input };
        self.getSelectedOption = function () { return selectedOption };
        self.setDisable = setDisable;
        self.setSelectedById = setSelectedById;
        self.setSelected = setSelected;
        self.setWidth = setWidth;
        self.setOptions = setOptions;
        self.showLoading = showLoading;
        self.hideLoading = hideLoading;
        self.setMenuPosition = setMenuPosition;
        self.addClass = addClass;
        self.removeClass = removeClass;

       // if (Ravesh.isMobile) options.allowSearch = false;

        var id = 'ravesh_' + Math.random().toString(36).substr(2, 10);
        var container = $('<div>').addClass('ravesh-dropdown dir-' + options.dir + ' ' + id).css({ 'width': options.width });
        var input = $('<input>').attr({ 'type': 'text', readonly: !options.allowSearch }).appendTo(container);
        var menu, arrOptionUI = [];
        var selectedOption = getOptionById(options.defaultId);
        if (options.defaultTitle != '') selectedOption = { title: options.defaultTitle, id: options.defaultId };
        var selectedOptionIndex = -1;
        var inSideClick = false;
        var focused = false;
        var lastSelectedId = -1;
        input.val(selectedOption.title);

        if (options.arrow) {
            var arrow = $('<span>').addClass('arrow').appendTo(container);
            arrow.click(function () {
                if (input.attr('disabled')) return false;
                if (menu == null)
                    self.showMenu();
                else
                    self.hideMenu();
            });
        } else {
            container.addClass('no-arrow');
        }

        input.focus(function (ev) {
            if (options.allowSearch && options.selectText) input.select();
            self.showMenu();
            focused = true;
            options.onClick();
        });
        input.click(function () {
            if (focused) { focused = false; return false }
            if (!options.allowSearch && container.hasClass('active'))
                self.hideMenu();
            else {
                self.showMenu();
                options.onClick();
            }
        });
        input.blur(function () {
            if (!inSideClick) self.hideMenu();
        });
        input.keyup(function (ev) {
            if (ev.keyCode == 40) {
                if (arrOptionUI.length - 1 > selectedOptionIndex) selectOption(++selectedOptionIndex);
            } else if (ev.keyCode == 38) {
                if (selectedOptionIndex > 0) selectOption(--selectedOptionIndex);
            } else if (ev.keyCode == 13) {
                if (selectedOptionIndex != -1) {
                    selectOption(selectedOptionIndex);
                    self.hideMenu();
                    input.blur();
                }
            } else if (ev.keyCode != 9) { //!=  tab
                //search
                var key = input.val().trim().toLowerCase();
                selectedOptionIndex = -1
                selectedOption = {};
                if (options.ajaxUrl != '') {
                    getAjaxData(key);
                    createMenu(options.options);
                } else {
                    if (options.options.length > 0) {
                        createMenu($.grep(options.options, function (s) { return s.title.toString().toLowerCase().indexOf(key) != -1 || s.id.toString().indexOf(key) != -1 }));
                    } else {
                        selectedOption = { id: key, title: key };
                    }
                }
            }
        });

        self.showMenu = function () {
            if (menu != null) return false;
            menu = $('<div>').addClass('ravesh-dropdown-menu open lang-' + options.lang + ' ' + id).attr('dir', options.dir).appendTo($('body'));
            menu.css({ 'min-width': container.width(), 'max-width': options.maxWidth, 'max-height': options.maxHeight });
            getAjaxData(null);
            createMenu(options.options);
            container.addClass('active');
            $(document).bind('mousedown', hideMenuHandler);
           
            if (!Ravesh.isMobile) {
                 window.addEventListener('scroll', hideMenuHandler, true);
                window.addEventListener('resize', hideMenuHandler);
            } else {
                window.addEventListener('scroll', setMenuPosition);
                window.addEventListener('resize', setMenuPosition);
            }
         
            menu.bind('mousewheel', mousewheel);
            menu.bind('DOMMouseScroll', mousewheel);
            lastSelectedId = selectedOption.id;
        }

        self.hideMenu = function (anim) {
            inSideClick = true;
            //focused = false;
            input.blur();
            if (menu == null) return false;
            selectedOptionIndex = -1;
            inSideClick = false;
            container.removeClass('active');
            if (selectedOption.title == null) {
                var emptyOpt = $.grep(options.options, function (s) { return s.id == options.emptyId });
                if (emptyOpt.length != 0) selectedOption = emptyOpt[0];
                if (options.emptyOption) selectedOption = options.emptyOption;
                if (options.ajaxUrl != '') options.options = [];
            }
            input.val(selectedOption.title);
            clearTimeout(self.ajaxTimeout);
            $(document).unbind('mousedown', hideMenuHandler);
            window.removeEventListener('scroll', hideMenuHandler);
            window.removeEventListener('resize', hideMenuHandler);
            menu.unbind('mousewheel', mousewheel);
            menu.unbind('DOMMouseScroll', mousewheel);
            if (lastSelectedId != selectedOption.id) {
                options.onSelected(selectedOption);
            }
            if (anim) {
                menu.fadeOut(200, function () {
                    menu.remove();
                    menu = null;
                });
            } else {
                menu.remove();
                menu = null;
            }
        }

        function hideMenuHandler(ev) {
            if ($(ev.target).hasClass(id) == false &&
                $(ev.target).parents('.' + id).length == 0) {
                self.hideMenu();
            } else {
                inSideClick = true;
            }
        }
        function setMenuPosition() {
            if (!Ravesh.isIos) {
                var containerPos = container[0].getBoundingClientRect();
                var left = containerPos.left;
                if (options.dir == 'rtl') left = containerPos.left - menu.width() + container.width();

                if (containerPos.top + container.outerHeight() + menu.outerHeight() > $(window).height() &&
                    containerPos.top - menu.outerHeight() > 0) {
                    menu.css({
                        'position': 'fixed',
                        'left': left,
                        'top': containerPos.top - menu.outerHeight() - 3
                    });
                } else {
                    menu.css({
                        'position': 'fixed',
                        'left': left,
                        'top': containerPos.top + container.outerHeight() + 3
                    });
                }
            } else {
                var left = container.offset().left;
                if (options.dir == 'rtl') left = container.offset().left - menu.width() + container.width() - 2;

                if (container.offset().top + container.outerHeight() + menu.outerHeight() > $(window).height() &&
                    container.offset().top - menu.outerHeight() > 0) {
                    menu.css({
                        'left': left,
                        'top': container.offset().top - menu.outerHeight() - 3
                    });
                } else {
                    menu.css({
                        'left': left,
                        'top': container.offset().top + container.outerHeight() + 3
                    });
                }
            }
        }


        // ajax dropDown
        function getAjaxData(key) {
            if (key != null) options.options = [];
            if (options.ajaxUrl == '') return false;
            if (options.options.length != 0) return false;

            options.options = [{ id: 'ajaxLoading', title: '' }];

            clearTimeout(self.ajaxTimeout);
            self.ajaxTimeout = setTimeout(function () {
                FormUtility.postExtra(options.ajaxUrl, options.getAjaxParam(key || ''),
                    function (isSuccess, message, data) {
                        options.options = options.emptyOption ? [options.emptyOption] : [];
                        if (isSuccess) {
                            options.options = options.options.concat(data);
                            createMenu(options.options);
                        }
                        createMenu(options.options);
                    }
                );
            }, key == null ? 10 : 500);
        }



        var loadingCover;
        function showLoading() {
            if (loadingCover == null) {
                loadingCover = $('<div>').addClass('loading').append($('<div>').addClass('spinner2 small'));
                container.append(loadingCover);
                input.attr('disabled', true);
                arrow.hide();
            }
        }
        function hideLoading() {
            if (loadingCover != null) {
                loadingCover.remove();
                loadingCover = null;
                if (!container.hasClass('disabled')) input.attr('disabled', false);
                arrow.show();
            }
        }

        function setWidth(width) {
            options.width = width;
            container.css('width', width);
        }

        function addClass(classNmae) {
            container.addClass(classNmae);
        }
        function removeClass(classNmae) {
            container.removeClass(classNmae);
        }


        function setDisable(ctl) {
            input.attr('disabled', ctl);
            container.toggleClass('disabled', ctl);
        }

        function createMenu(opts) {
            if (menu == null) return false;
            var content = options.createContent();
            menu.toggle(opts.length != 0 || content != '');
            menu.html(content);
            arrOptionUI = [];
            $.each(opts, function (i, item) {
                var optUI = options.createOptionUI(item);
                var opt = $('<div>').addClass('option' + (item.id == selectedOption.id ? ' selected' : '')).html(optUI);
                opt.click(function () {
                    selectOption(i);
                    self.hideMenu();
                });
                if (item.id == 'ajaxLoading') {
                    opt = $('<div>').addClass('ajaxLoading').append($('<div>').addClass('spinner2 small')).css({ padding: 15 });
                }
                menu.append(options.createOptionUIBefore(item))
                menu.append(opt);
                if (optUI.outerWidth() >= menu.outerWidth()) optUI.attr('title', item.title);
                optUI.css('display', 'block');
                arrOptionUI.push({ ui: opt, data: item });
                if (item.id == selectedOption.id) {
                    selectedOptionIndex = i;
                    setScrollPosition(opt);
                }
            });
            setMenuPosition();
        }

        function createOptionUI(data) {
            return $('<div>').addClass('single-line').text(data.title);
        }

        function createOptionUIBefore(data) {
            return '';
        }

        function createContent() {
            return '';
        }

        function selectOption(index) {
            menu.find('.selected').removeClass('selected');
            arrOptionUI[index].ui.addClass('selected');
            setScrollPosition(arrOptionUI[index].ui);
            var item = arrOptionUI[index].data;
            selectedOptionIndex = index;
            selectedOption = item;
            input.val(item.title);
        }

        function getOptionById(id) {
            var defaultOpt = $.grep(options.options, function (s) { return s.id == id });
            return defaultOpt.length > 0 ? defaultOpt[0] : {};
        }

        function setSelectedById(id) {
            selectedOption = getOptionById(id);
            input.val(selectedOption.title);
        }
        function setSelected(option, callOnselected) {
            selectedOption = option;
            input.val(selectedOption.title);
            if (callOnselected) options.onSelected(selectedOption);
        }
        function setOptions(opts, onlyData) {
            options.options = opts;
            if (onlyData) return false;
            var emptyOpt = $.grep(options.options, function (s) { return s.id == options.emptyId });
            if (emptyOpt.length != 0) selectedOption = emptyOpt[0];
            input.val(selectedOption.title);
        }

        function setScrollPosition(element) {
            var elemTop = element[0].offsetTop;
            var elemHeight = element.outerHeight();

            if (elemTop - menu[0].scrollTop < 0) {
                menu[0].scrollTop = elemTop;
            }
            if ((elemTop + elemHeight) - menu[0].scrollTop > menu.height()) {
                menu[0].scrollTop = (elemTop + elemHeight) - menu.height();
            }
        }

        function mousewheel(ev) {
            var delta = (ev.type === "mousewheel") ? ev.wheelDelta : ev.detail * -40;
            if (delta < 0 && (this.scrollHeight - this.offsetHeight - this.scrollTop) <= 0) {
                this.scrollTop = this.scrollHeight;
                ev.preventDefault();
            } else if (delta > 0 && delta > this.scrollTop) {
                this.scrollTop = 0;
                ev.preventDefault();
            }
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.Menu = function (elem, option) {
        var self = this;
        var id = 'ravesh_' + Math.random().toString(36).substr(2, 10);
        var menu;

        //default option
        var defaultOption = {
            appendTo: $('body'),
            content: '',
            options: [],// array of {title:'',cssIcon:'',iconColor:'',callback:fn()} or {inLink:true} or {title:'', isLink: true, href:''}
            align: 'left',//left | right | auto,
            verticalAlign: 'bottom', //bottom | top
            removeAfterHide: true,
            cssClass: '',
            hideUnlessCssClass: [],
            marginTop: 4,
            onOpen: function () { }
        }
        option = $.extend(true, defaultOption, option || {});

        self.setOnOpen = function (callback) { option.onOpen = callback }
        self.getMenu = function () { return menu }

        elem.addClass('elem' + id);
        elem.click(function (ev) {
            if (elem.hasClass('disable')) return false;
            if (!elem.hasClass('active'))
                self.show();
            else
                self.hide();
            ev.stopPropagation();
            return false;
        });


        self.show = function () {
            if (option.removeAfterHide || !menu) {
                menu = $('<div>').addClass('ravesh-menu open ' + id + ' ' + option.cssClass).append(option.content);
                $.each(option.options, function (o, opt) {
                    if (opt.isLine) {
                        menu.append($('<div>').addClass('line'));
                    } else if (opt.isLink) {
                        var mnu = $('<a>').addClass('option' + (opt.className ? +' ' + opt.className : '')).append($('<span>').append(opt.title), opt.cssIcon ? $('<i>').css('color', opt.iconColor).addClass('float-right ' + opt.cssIcon) : '');
                        mnu.attr({ 'href': opt.href, 'target': (opt.target == null ? '_self' : opt.target) });
                        mnu.click(function () { self.hide() });
                        menu.append(mnu);
                    } else {
                        var mnu = $('<div>').addClass('option').append($('<span>').append(opt.title), opt.cssIcon ? $('<i>').css('color', opt.iconColor).addClass('float-right ' + opt.cssIcon) : '');
                        mnu.click(function (ev) {
                            opt.callback(ev);
                            self.hide();
                        });
                        menu.append(mnu);
                    }
                });
                option.appendTo.append(menu);
            } else {
                menu.show();
            }

            elem.addClass('active');
            self.refreshPosition();
            option.onOpen();

            $(document).bind('mousedown', hideMenuHandler);
            //  window.addEventListener('resize', hideMenuHandler);
        }


        self.hide = function () {
            if (menu) { if (option.removeAfterHide) menu.remove(); else menu.hide(); }
            elem.removeClass('active');
            $(document).unbind('mousedown', hideMenuHandler);
            //  window.removeEventListener('resize', hideMenuHandler);
        }


        self.refreshPosition = function () {
            if (!menu) return false;
            var elemOffset = elem.offset();

            var left = elemOffset.left;
            if (option.align == 'right') left = elemOffset.left - menu.width() + elem.outerWidth() - 2;
            if (option.align == 'auto') {
                if (left > ($(window).width() / 2)) {
                    left = elemOffset.left - menu.width() + elem.outerWidth() - 2;
                }
            }

            var top = elemOffset.top + elem.outerHeight() + option.marginTop - option.appendTo.offset().top;
            if (option.verticalAlign == 'top') top = elemOffset.top - option.marginTop - menu.height() - option.appendTo.offset().top;
            menu.css({
                'left': left - option.appendTo.offset().left,
                'top': top
            });
        }


        self.setOptions = function (options) {
            option.options = options;
        }

        function hideMenuHandler(ev) {
            if ($(ev.target).parents('.elem' + id).length != 0 || $(ev.target).hasClass('elem' + id)) return false;
            for (var i = 0; i <= option.hideUnlessCssClass.length - 1; i++) {
                if ($(ev.target).parents('.' + option.hideUnlessCssClass[i]).length != 0 || $(ev.target).hasClass(option.hideUnlessCssClass[i])) return;
            }
            if ($(ev.target).parents('.' + id).length == 0) {
                self.hide();
            }
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.DrillDown = function (options) {
        var self = this;

        //Options
        var defaultOptions = {
            options: {},
            dir: 'ltr',
            width: 180,
            getChildOptions: getChildOptions,
            createOptionUI: createOptionUI,
            onSelected: function (opt) { },
            onlySelectChilds: false
        }
        options = $.extend(true, defaultOptions, options || {});

        var container = $('<div>').addClass('ravesh-drill-down');
        var arrBreadcrumb = new Array();

        var dropdown = new Ravesh.DropDown({
            dir: options.dir,
            width: options.width,
            onSelected: options.onSelected,
            allowSearch: false,
            createContent: function () {
                container.empty();
                arrBreadcrumb = new Array();
                createOptions();
                return container;
            }
        });


        //Methods
        self.getUI = dropdown.getUI;
        self.setSelected = dropdown.setSelected;
        self.getSelectedOption = dropdown.getSelectedOption;
        self.setDisable = dropdown.setDisable;
        self.setWidth = dropdown.setWidth;
        self.addClass = dropdown.addClass;
        self.removeClass = dropdown.removeClass;


        function createOptions(opt) {
            if (opt == null) opt = options.options;
            container.find('.ravesh-drill-down-panel').hide();
            arrBreadcrumb.push(opt);
            if (container.find('.panel-num-' + opt.id).show().length != 0) return false;


            var panel = $('<div>').addClass('ravesh-drill-down-panel panel-num-' + opt.id).appendTo(container);
            var head = $('<div>').addClass('ravesh-drill-down-panel-head').appendTo(panel);
            var content = $('<div>').addClass('ravesh-drill-down-panel-content').appendTo(panel);
            var title = $('<div>').addClass('ravesh-drill-down-panel-title').text(opt.title);

            $.each(arrBreadcrumb, function (b, bread) {
                if (opt == bread) return false;
                var breadItem = $('<a>').attr({ 'href': '#' }).addClass('ravesh-link ravesh-drill-down-breadcrumb').text(bread.title);
                breadItem.click(function () {
                    var newArr = new Array();
                    for (var b2 in arrBreadcrumb) {
                        if (bread == arrBreadcrumb[b2]) break; else newArr.push(arrBreadcrumb[b2]);
                    }
                    arrBreadcrumb = newArr;
                    createOptions(bread);
                    return false;
                });
                head.append(breadItem);
                head.addClass('has-breadcrumb');
            });
            head.append(title);


            var loading = $('<div>').css({ 'text-align': 'center', padding: 10 }).append($('<div>').addClass('spinner2 small')).appendTo(container);
            options.getChildOptions(opt, function (opts) {
                loading.remove();
                $.each(opts, function (o, opt) {
                    content.append(options.createOptionUI(opt))
                });
            });
        }

        function getChildOptions(opt, callback) {
            callback(opt.childs);
        }
        function createOptionUI(data) {
            var optUI = $('<div>').addClass('drill-down-option' + (data.hasChild ? ' hasChild' : ''));
            var item = $('<a>').attr({ 'href': '#' }).addClass('drill-down-option-title').text(data.title).appendTo(optUI);
            if (options.onlySelectChilds) {
                optUI.addClass('only-select-child');
                item.click(function () {
                    if (data.hasChild) {
                        createOptions(data);
                    } else {
                        dropdown.setSelected(data);
                        dropdown.hideMenu();
                    }
                    return false;
                });
                if (data.hasChild) $('<span>').addClass('drill-down-option-child').append($('<span>')).click(function () { item.click() }).appendTo(optUI);
            } else {
                item.click(function () {
                    dropdown.setSelected(data);
                    dropdown.hideMenu();
                    return false;
                });
                if (data.hasChild) {
                    var btnChild = $('<a>').attr({ 'href': '#' }).addClass('drill-down-option-child').append($('<span>')).appendTo(optUI);
                    btnChild.click(function () {
                        createOptions(data);
                        return false;
                    })
                }
            }
            return optUI;
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.Editor = function (options) {
        var self = this;

        var resource = {
            en: {
                'bold': 'Bold', 'italic': 'Italic', 'underline': 'Underline', 'strikethrough': 'Strikethrough',
                'fontsize': 'Font size',
                'justifyright': 'Justify right', 'justifycenter': 'Justify center', 'justifyleft': 'Justify left',
                'color': 'Color', 'forecolor': 'Fore color', 'backgroundColor': 'Background color', 'emoticon': 'Emoticon',
                'redo': 'Redo', 'undo': 'Undo',

                'link': 'Insert link', 'image': 'Insert image', 'table': 'Insert table',
                'full': 'Full Screen', 'html': 'HTML',

                'linkUrl': 'URL', 'linkText': 'Text', 'add': 'Add', 'imageUrl': 'Image url'
            },
            fa: {
                'bold': 'ضخیم', 'italic': 'خط کج', 'underline': 'خط زیر', 'strikethrough': 'خط رو',
                'fontsize': 'اندازه قلم',
                'justifyright': 'راست چین', 'justifycenter': 'وسط چین', 'justifyleft': 'چپ چین',
                'color': 'رنگ', 'forecolor': 'رنگ متن', 'backgroundColor': 'رنگ زمینه', 'emoticon': 'شکلک',
                'redo': 'برگشت به حالت بعد', 'undo': 'برگشت به حالت قبل',

                'link': 'افزودن لینک', 'image': 'افزودن تصویر', 'table': 'افزودن جدول',
                'full': 'بزرگنمایی', 'restoreFull': 'بازگشت به حالت قبل', 'html': 'HTML',

                'linkUrl': 'آدرس اینترنتی', 'linkText': 'متن لینک', 'add': 'افزودن', 'imageUrl': 'آدرس اینترنتی تصویر'
            }
        }
        var defaultOptions = {
            lang: 'en',
            minHeight: 200,
            width: 'auto',
            onChange: function () { },
            onHtmlEditor: function (showed) { },
            autoSetDirection:true,
            items: [
                'bold', 'italic', 'underline', 'strikethrough', 'split',
                'fontsize', 'split',
                'justifyright', 'justifycenter', 'justifyleft', 'split',
                'color', 'emoticon', 'split',
                'redo', 'undo'
            ],
            advanceItem: true,
            advanceItems: [
                'split', 'link', 'image', 'table',
                'split', 'full', 'html'
            ],
            emoticon: [
                '😀', '😂', '😅', '😃', '😇',
                '😆', '😉', '😊', '😋', '😎',
                '😍', '😘', '🙄', '🤔', '😐',
                '😵', '🤑', '😲', '😩', '🙁',
                '😭', '🙂', '😬', '😱', '😨'
            ],
            colors: [
                '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
                '#8bc34a', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
                '#795548', '#607d8b', '#cccccc', '#888888', '#000000'
            ]
        }
        options = $.extend(true, defaultOptions, options || {});


        var container = $('<div>').addClass('ravesh-editor').attr('dir', options.lang == 'fa' ? 'rtl' : 'ltr').css({ width: options.width });
        var toolbar = $('<div>').addClass('ravesh-editor-toolbar');
        var toolbarWrapper = $('<div>').css('overflow', 'hidden').appendTo(toolbar);
        var subToolbar = $('<div>').addClass('ravesh-editor-subtoolbar').appendTo(toolbar).hide();
        var content = $('<div>').addClass('ravesh-editor-content').css({ 'min-height': options.minHeight, 'text-align': options.lang == 'fa' ? 'right' : 'left' }).attr('contenteditable', true);
        var contentHTML = $('<textarea>').addClass('ravesh-editor-content-html').css({ 'min-height': options.minHeight }).attr({ wrap: 'off' });
        container.append(toolbar, content, contentHTML);
        var toolbarItem = {};



        //Methods
        self.getUI = function () { return container; }
        self.val = function (value) {
            if (value != null) {
                content.html(value);
            } else {
                var html = "";
                if (container.hasClass('html-editor')) html = contentHTML.val(); else html = content.html();
                var matcherScript = new RegExp("<[^>]*script?.>", "gi");
                if (html.match(matcherScript) != null) html = html.replace(matcherScript, '');
                if (html.indexOf('ravesh-editor-html') == -1 && html != '' && options.autoSetDirection) html = '<div class="ravesh-editor-html" style="direction:' + (options.lang == 'fa' ? 'rtl' : 'ltr') + '">\n' + html + '\n</div>\n';
                return html;
            }
        }
        self.insertHtml = insertHtml;
        self.setDisable = function (enable) {
            content.attr('contenteditable', !enable);
            container.toggleClass('disabled', enable);
        }
        self.setSubToolbar = function (html) { subToolbar.html(html).show() };
        self.setOnHtmlEditor = function (callback) { options.onHtmlEditor = callback }
        self.setHeight = function (height) { content.css('min-height', height); contentHTML.css('min-height', height); }
        self.autoSetDirection = function (autoSetDirection) { options.autoSetDirection = autoSetDirection }


        var createToolbar = function () {
            var createItem = function (item, callback) {
                if (item == 'split') {
                    return $('<div>').addClass(item);
                } else {
                    var toolItem = $('<a>').attr({ 'href': '#', 'tabindex': '-1', 'title': resource[options.lang][item] }).addClass('item ' + item).append($('<div>'));
                    if (item == "undo" || item == "redo") toolItem.addClass('disable');
                    toolbarItem[item] = toolItem;
                    toolItem.click(callback);
                    return toolItem;
                }
            }
            var items = options.items;
            if (options.advanceItem) items = options.items.concat(options.advanceItems)
            $.each(items, function (i, item) {
                toolbarWrapper.append(createItem(item, function () {
                    if (container.hasClass('disabled') || toolbarItem[item].hasClass('disable')) return false;
                    if (container.hasClass('html-editor') && item != 'html') return false;
                    content.focus();

                    if (item == "undo" || item == "redo") {
                        document.execCommand(item, false);
                        toolbarItem.redo.toggleClass('disable', !document.queryCommandEnabled("redo"));
                        toolbarItem.undo.toggleClass('disable', !document.queryCommandEnabled("undo"));
                        options.onChange();

                    } else if (item == 'emoticon') {
                        var mnuContent = $('<div>').addClass('menu-emoticon');
                        var menu = new createMenu('emoticon', mnuContent);
                        $.each(options.emoticon, function (em, emot) {
                            var emItem = $('<span>').text(emot).appendTo(mnuContent);
                            emItem.click(function () {
                                insertHtml(emot);
                            });
                        })

                    } else if (item == 'color') {
                        var mnuContent = $('<div>').addClass('menu-color');
                        var menu = new createMenu('color', mnuContent);
                        var colorMode = 'forecolor';

                        var btnForeColor = $('<div>').addClass('color-button active').text(resource[options.lang].forecolor).click(function () {
                            colorMode = 'forecolor';
                            btnBackColor.removeClass('active');
                            btnForeColor.addClass('active');
                        }).appendTo(mnuContent);

                        var btnBackColor = $('<div>').addClass('color-button').text(resource[options.lang].backgroundColor).click(function () {
                            colorMode = 'backcolor';
                            btnBackColor.addClass('active');
                            btnForeColor.removeClass('active');
                        }).appendTo(mnuContent);

                        $.each(options.colors, function (c, color) {
                            var cItem = $('<span>').css({ 'background': color }).appendTo(mnuContent);
                            cItem.click(function () {
                                menu.close();
                                restoreSelection();
                                document.execCommand(colorMode, false, color);
                                options.onChange();
                            });
                        });

                    } else if (item == 'fontsize') {
                        var mnuContent = $('<div>').addClass('menu-fontsize');
                        var menu = new createMenu('fontsize', mnuContent);
                        var sizes = [8, 10, 12, 14, 18, 24];
                        $.each(sizes, function (s, size) {
                            var fItem = $('<div>').text(s + 1).css({ 'font-size': size, 'line-height': size + 10 + 'pt' }).appendTo(mnuContent);
                            fItem.click(function () {
                                menu.close();
                                restoreSelection();
                                document.execCommand("styleWithCSS", false);
                                document.execCommand('fontsize', false, s + 1);
                                options.onChange();
                            });
                        });

                    } else if (item == 'link') {
                        var mnuContent = $('<div>').css('width', 250);
                        var menu = new createMenu(item, mnuContent);
                        var selectedText = window.getSelection().toString();
                        var inputUrl = $('<input>').addClass('ravesh-input').attr({ type: 'text', placeholder: resource[options.lang].linkUrl }).css({ 'margin-bottom': 5, width: '100%', direction: 'ltr' });
                        var inputText = $('<input>').addClass('ravesh-input').attr({ type: 'text', placeholder: resource[options.lang].linkText }).css({ 'margin-bottom': 5, width: '100%', direction: 'ltr' });
                        var btnAdd = $('<button>').addClass('ravesh-button save').text(resource[options.lang].add).css('margin', 0);

                        if (selectedText == '')
                            mnuContent.append(inputUrl, '<br>', inputText, '<br>', btnAdd);
                        else
                            mnuContent.append(inputUrl, '<br>', btnAdd);

                        btnAdd.click(function () {
                            var href = inputUrl.val().trim(), text = inputText.val().trim();
                            if (href == '') { inputUrl.focus(); return false }
                            if (text == '' && selectedText == '') { inputText.focus(); return false }
                            menu.close();
                            if (selectedText == '') {
                                insertHtml('<a href="' + href + '" target="_blank">' + text + '</a>');
                            } else {
                                restoreSelection();
                                document.execCommand('createlink', false, href);
                                options.onChange();
                            }
                        });

                    } else if (item == 'image') {
                        show_fileManager(1, function (file_, urlmode, width) {
                            insertHtml('<img src="' + file_.url + '" style="width:' + (width ? width + "px" : "100%") + ';max-width:100%"/>');
                        }, { 'changeWidth': true });


                        //var mnuContent = $('<div>').css('width', 250);
                        //var menu = new createMenu(item, mnuContent);
                        //var inputUrl = $('<input>').addClass('ravesh-input').attr({ type: 'text', placeholder: resource[options.lang].imageUrl }).css({ 'margin-bottom': 5, width: '100%', direction: 'ltr' });
                        //var btnAdd = $('<button>').addClass('ravesh-button save').text(resource[options.lang].add).css('margin', 0);

                        //mnuContent.append(inputUrl, '<br>', btnAdd);

                        //btnAdd.click(function () {
                        //    var src = inputUrl.val().trim();
                        //    if (src == '') { inputUrl.focus(); return false }
                        //    menu.close();
                        //   
                        //});

                    } else if (item == 'table') {
                        var mnuContent = $('<div>').addClass('menu-table');
                        var menu = new createMenu(item, mnuContent);

                        var arrSquare = new Array();
                        var tableSizeHint = $('<div>').addClass('size-hint').text('0 X 0').appendTo(mnuContent);
                        var squareWrapper = $('<div>').addClass('square-wrapper').appendTo(mnuContent);
                        for (var i = 1; i <= 10; i++) {
                            for (var j = 1; j <= 10; j++) {
                                (function () {
                                    var row = i, col = j, square = $('<div>').addClass('square').appendTo(squareWrapper);
                                    arrSquare.push({ row: row, col: col, square: square });
                                    square.mouseenter(function (ev) {
                                        var elems = $.grep(arrSquare, function (s) { return s.row <= row && s.col <= col });
                                        $.each(elems, function (e, elem) { elem.square.addClass('hover') });
                                        tableSizeHint.text(row + ' X ' + col);
                                    }).mouseleave(function (ev) {
                                        squareWrapper.find('.hover').removeClass('hover');
                                    }).mousedown(function (ev) {
                                        menu.close();
                                        insertHtml(createTable(row, col));
                                    });
                                })();
                            }
                        }

                        function createTable(row, col) {
                            var table = '<table style="width:100%">\n';
                            for (var i = 1; i <= row; i++) {
                                table += '<tr>\n'
                                for (var j = 1; j <= col; j++) {
                                    table += '<td style="border:solid 1px #ccc;">&nbsp;</td>\n';
                                }
                                table += '</tr>\n'
                            }
                            table += "</table>";
                            return table;
                        }

                    } else if (item == 'html') {
                        if (container.hasClass('html-editor')) {
                            if (content.html() != contentHTML.val()) { self.val(contentHTML.val() || ""); options.onChange(); }
                            $.each(toolbarItem, function (i, item) { item.removeClass('disable') });
                            container.find('.custom-icon').removeClass('disable');
                            content.focus();
                            options.onHtmlEditor(false);
                            container.removeClass('html-editor');
                        } else {
                            contentHTML.val(self.val());
                            $.each(toolbarItem, function (i, item) { if (i != 'html') item.addClass('disable') });
                            container.find('.custom-icon').addClass('disable');
                            contentHTML.focus();
                            options.onHtmlEditor(true);
                            container.addClass('html-editor');
                        }

                    } else if (item == 'full') {
                        if (container.hasClass('full-screen')) {
                            container.removeClass('full-screen');
                            toolbarItem[item].attr('title', resource[options.lang].full);
                            $("body").removeClass("overflowHidden");
                        } else {
                            container.addClass('full-screen');
                            contentHTML.css('top', toolbar.outerHeight());
                            content.css('top', toolbar.outerHeight());
                            toolbarItem[item].attr('title', resource[options.lang].restoreFull);
                            $("body").addClass("overflowHidden");
                        }

                    } else {
                        document.execCommand(item, false);
                    }

                    return false;
                }));
            });
        }
        createToolbar();

        var arrMenus = {};
        var createMenu = function (toolItem, content) {
            var that = this;

            if (!arrMenus[toolItem]) {
                arrMenus[toolItem] = new Ravesh.Menu(toolbarItem[toolItem], {
                    cssClass: 'ravesh-editor-menu',
                    content: content.css('padding', 5),
                    marginTop: 0,
                    align: 'auto',
                    removeAfterHide: false
                });
                arrMenus[toolItem].show();
            } else {
                arrMenus[toolItem].getMenu().html(content).css('padding', 5);
            }

            that.close = arrMenus[toolItem].hide;
        }

        function insertHtml(html) {
            restoreSelection();
            document.execCommand('inserthtml', false, html);
            toolbarItem.undo.removeClass('disable');
            options.onChange();
        }

        //restore selection
        function restoreSelection() {
            content.focus();
            if (self.rng) {
                if (window.getSelection) {
                    self.sel.removeAllRanges();
                    self.sel.addRange(self.rng);
                } else {
                    self.rng.select();
                }
            }
        }

        content.focus(function () {
            clearTimeout(self.timerUnactive);
            container.addClass('active');
        });
        content.blur(function () {
            self.timerUnactive = setTimeout(function () {
                container.removeClass('active');
            }, 200);

            //save selection
            self.sel = (window.getSelection) ? window.getSelection() : document.selection;
            self.rng = (self.sel.rangeCount > 0) ? self.sel.getRangeAt(0) : (self.sel.createRange ? self.sel.createRange() : null);
        });
        content.keyup(function () {
            toolbarItem.undo.removeClass('disable');
            options.onChange();
        });
        content.bind('paste', function (ev) {
            insertHtml(ev.originalEvent.clipboardData.getData('text/plain'));
            options.onChange();
            return false;
        });

    }


    /*-----------------------------------------------------*/
    Ravesh.Multiselect = function (options) {
        var self = this;
        var defaultOptions = {
            lang: 'en',
            width: 200,
            maxHeight: 250,
            createOption: function (data) {
                return $('<div>').css({ 'padding': '0 10px' }).text(data.Title);
            },
            cssClass: '',
            items: []
        }
        options = $.extend(true, defaultOptions, options || {});

        var container = $('<div>').css({ 'width': options.width }).addClass('ravesh-input ravesh-multi-selector ' + options.cssClass);
        var menuContainer = $('<div>').css({ 'width': options.width, 'position': 'relative', 'max-height': options.maxHeight }).addClass('ravesh-dropdown-menu');
        var loading = $('<div>').addClass('spinner small').css({ 'margin': '7px 0 0' }).hide().appendTo(container);

        self.getUI = function () {
            return container;
        }
        self.showLoading = function () { loading.show() };
        self.hideLoading = function () { loading.hide() };
        self.getSelectedOptions = function () {
            var result = [];
            container.find('.item').each(function (i, item) { result.push($(item).attr('item')) });
            return result;
        }
        self.setSelectedOptions = function (data) {
            $.each(data, function (i, id) {
                var item = $.grep(options.items, function (s) { return s.Id == id });
                if (item.length > 0) container.append(createElem(item[0]));
            });
        }

        var mnu = new RaveshUI.Menu(container, {
            content: menuContainer,
            marginTop: 0,
            align: options.lang == 'fa' ? 'right' : 'left',
            removeAfterHide: false
        });

        var createElem = function (item) {
            var btnRemove = $('<i>').addClass('icon-close float-right');
            var elem = $('<div>').addClass('item').attr('item', item.Id).append($('<span>').text(item.Title), btnRemove);
            btnRemove.click(function (ev) {
                elem.remove();
                mnu.refreshPosition();
                ev.stopPropagation();
            });
            return elem;
        }

        self.setItems = function (items) {
            options.items = items;
            $.each(items, function (u, item) {
                var opt = $('<div>').addClass('option').appendTo(menuContainer);
                opt.append(options.createOption(item));
                opt.click(function () {
                    if (container.find('[item=' + item.Id + ']').length > 0) return false;
                    container.append(createElem(item));
                    mnu.refreshPosition();
                });
            });
            mnu.refreshPosition();
        }
    }
    /*-----------------------------------------------------*/

    Ravesh.MiniDialog = function () {
        var self = this;

        //default methods
        self.close = close;
        self.showLoading = showLoading;
        self.hideLoading = hideLoading;
        self.setContent = setContent;
        self.setTitle = setTitle;
        self.getUI = function () { return dialog };

        var closeBtn = $('<div>').addClass('ravesh-close-btn');
        var title = $('<div>').addClass('ravesh-title');
        var header = $('<div>').addClass('ravesh-header');
        header.append(closeBtn, title);

        var spinnerCover = $('<div>').addClass('spinner-cover').append($('<div>').addClass('spinner2')).hide();
        var contentScroll = $('<div>').addClass('ravesh-content-scroll');
        var content = $('<div>').addClass('ravesh-content').css('overflow', 'hidden').appendTo(contentScroll);

        var dialog = $('<div>').addClass('ravesh-mini-dialog rvc-comingIn');
        dialog.append(spinnerCover, header, contentScroll);

        var overlay = $('<div>').addClass('ravesh-mini-dialog-overlay');
        overlay.append(dialog);
        $('body').append(overlay);

        window.addEventListener('resize', function (e) {
            resizeDialog();
        });
        setInterval(resizeDialog, 1000);

        function resizeDialog() {
            if (content[0].clientHeight + 100 >= window.innerHeight) {
                contentScroll[0].style.height = (window.innerHeight - 100) + 'px';
            } else {
                contentScroll[0].style.height = (content[0].clientHeight) + 'px';
            }
        }
        function close() {
            overlay.fadeOut(function () { overlay.remove(); });
            dialog.fadeOut(function () {
                dialog.remove();
            });
        }
        function setContent(html) {
            content.html(html);
        }
        function setTitle(str) {
            title.text(str);
        }
        function showLoading() {
            spinnerCover.stop(true, true).fadeIn();
        }
        function hideLoading() {
            spinnerCover.stop(true, true).fadeOut();
        }

        overlay.click(function (ev) {
            if ($(ev.target).hasClass('ravesh-mini-dialog-overlay')) close();
        });
        closeBtn.click(function () {
            close();
        });

    }

    /*-----------------------------------------------------*/

    Ravesh.selectTime = function (options) {

        options = $.extend(true, {
            dir: options.lang == 'fa' ? 'rtl' : 'ltr',
            maxHeight: 'none',
            width: options.width,
            defaultId: options.defaultValue,
            defaultTitle: numberLocalizer(options.defaultValue, options.lang),
            allowSearch: false,
            createContent: function () {
                var timePicker = new Ravesh.TimePicker({
                    lang: options.lang,
                    width: '100%',
                    clockMode: options.clockMode,
                    selectedTime: dropdown.getSelectedOption().id,
                    onSelected: function (time) {
                        dropdown.setSelected(time);
                    },
                    onComplete: function () {
                        dropdown.hideMenu(true);
                    }
                });
                return timePicker.getUI();
            },
            onSelected: function (opt) {
                if (!opt) options.onSelected(opt.id);
            }
        }, options || {});

        var dropdown = new Ravesh.DropDown(options);

        var drdSetSelected = dropdown.setSelected;
        dropdown.setSelected = function (time) {
            drdSetSelected({ id: time, title: numberLocalizer(time, options.lang) })
        }

        dropdown.setClockMode = function (clockMode) {
            options.clockMode = clockMode;
        }

        dropdown.getTimeNow = function () {
            var padNumber = function (number) { return parseInt(number) < 10 && parseInt(number) >= 0 ? '0' + number.toString() : number.toString(); }
            var d = new Date();
            h = d.getHours();
            m = d.getMinutes();
            return padNumber(h) + ':' + padNumber(m);
        }

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectYearMonth = function (options) {
        var self = this;
        options = $.extend(true, {
            lang: 'en',
            width: '100%',
            onSelected: function (date) { }
        }, options || {});

        var regional = options.lang == 'en' ? '' : options.lang;
        var datePart = getDatePart(getCurrentDate());

        self.getUI = function () { return container; }
        self.setWidth = function (width) { container.css('width', width); return self; }
        self.setDisable = function (enable) { drdYear.attr('disabled', enable); drdMonth.attr('disabled', enable); return self; }
        self.setCurrentDate = function () { setSelected(); return self; }
        self.setSelected = function (date) { setSelected(date); return self; }
        self.getSelectedOption = function () { return { id: convertDatePart({ year: drdYear.val(), month: drdMonth.val(), day: 1 }), title: '' } }
        self.checkValid = function () { return true; }

        var container = $('<div>').css({ 'max-width': '100%' });
        var drdYear = $('<select>').addClass('ravesh-dropdown float-right');
        var drdMonth = $('<select>').addClass('ravesh-dropdown float-right');
        container.append(drdYear.css({ width: 'calc(50% - 10px)' }), $('<div>').addClass('float-right').css({ width: 20, height: 30 }), drdMonth.css({ width: 'calc(50% - 10px)' }));

        for (i = datePart.year - 100; i <= datePart.year + 50; i++) {
            drdYear.append($('<option>').val(i).text(numberLocalizer(i, options.lang)).attr('selected', i == datePart.year));
        }

        var months = $.datepicker.regional[regional].monthNames;
        $.each(months, function (m, month) {
            drdMonth.append($('<option>').val(m + 1).text(month).attr('selected', m + 1 == datePart.month));
        });


        function setSelected(date) {
            if (date == '' || date == null) date = getCurrentDate();
            var datePart_ = getDatePart(date);
            drdYear.val(datePart_.year).attr('selected', 'selected');
            drdMonth.val(datePart_.month).attr('selected', 'selected');
        }

        function getDatePart(date) {
            var arrDate = date.split("/");
            if (options.lang == 'fa') {
                return { year: parseInt(arrDate[0]), month: parseInt(arrDate[1]), day: parseInt(arrDate[2]) }
            } else {
                return { year: parseInt(arrDate[2]), month: parseInt(arrDate[0]), day: parseInt(arrDate[1]) }
            }
        }

        function convertDatePart(datePart) {
            if (options.lang == 'fa') {
                return padNumber(datePart.year) + "/" + padNumber(datePart.month) + "/" + padNumber(datePart.day)
            } else {
                return padNumber(datePart.month) + "/" + padNumber(datePart.day) + "/" + padNumber(datePart.year)
            }
        }

        function getCurrentDate() {
            if (options.lang == 'fa') {
                var today = new JalaliDate();
                return today.getFullDate();
            } else {
                var today = new Date();
                return padNumber(today.getMonth() + 1) + "/" + padNumber(today.getDate()) + "/" + today.getFullYear();
            }
        }

        function padNumber(num) {
            var number = parseInt(num);
            return number < 10 ? '0' + number : number.toString();
        }
    }

    Ravesh.selectDate = function (options) {

        options = $.extend(true, {
            maxHeight: 'none',
            defaultId: options.defaultValue,
            defaultTitle: options.defaultValue,
            createContent: function () {
                var regional = options.lang == 'en' ? '' : options.lang;

                var dpicker = $('<div>').addClass('ravesh-date-picker');
                var dpickerOption = {
                    regional: regional,
                    onSelect: function (dateText) {
                        dropdown.setSelected(dateText);
                        dropdown.hideMenu();
                    },
                    onChangeMonthYear: function () {
                        setTimeout(function () {
                            dropdown.setMenuPosition();
                            dayPickerContainer.find('.ui-datepicker-title').click(function () {
                                dayPickerContainer.hide();
                                if (dpicker.find('.ravesh-date-picker-month').length == 0) showMonthSelector();
                                dropdown.setMenuPosition();
                                return false;
                            });
                        });
                    }
                }
                if (options.lang == 'en') {
                    dpickerOption.dateFormat = 'mm/dd/yy'
                }

                dpicker.datepicker(dpickerOption);
                if (dropdown.getSelectedOption().id != '') dpicker.datepicker("setDate", dropdown.getSelectedOption().id);

                var dayPickerContainer = dpicker.find('.ui-datepicker');
                dayPickerContainer.find('.ui-datepicker-title').click(function () {
                    dayPickerContainer.hide();
                    if (dpicker.find('.ravesh-date-picker-month').length == 0) showMonthSelector();
                    dropdown.setMenuPosition();
                    return false;
                });


                var datePartDrd = getDatePart(dropdown.getSelectedOption().id || '');
                var datePartCurrent = getDatePart(dropdown.getCurrentDate());
                var datePartFinal = datePartDrd.year == 0 ? { year: datePartCurrent.year, month: datePartCurrent.month, day: datePartCurrent.day } : { year: datePartDrd.year, month: datePartDrd.month, day: datePartDrd.day };


                /*-------------------------------------------*/
                function showMonthSelector() {
                    var monthSelector = {
                        container: $('<div>').addClass('ravesh-date-picker-month'),
                        head: $('<div>').addClass('ui-datepicker-header float-right'),
                        back: $('<span>').addClass('ui-datepicker-prev ui-corner-all').append($('<span>').addClass('ui-icon ui-icon-circle-triangle-e')),
                        title: $('<div>').addClass('ui-datepicker-title'),
                        next: $('<span>').addClass('ui-datepicker-next ui-corner-all').append($('<span>').addClass('ui-icon ui-icon-circle-triangle-w')),
                        content: $('<div>').addClass('float-right')
                    }
                    monthSelector.head.append(monthSelector.next, monthSelector.back, monthSelector.title);
                    monthSelector.container.append(monthSelector.head, monthSelector.content).appendTo(dpicker);

                    monthSelector.title.text(numberLocalizer(datePartFinal.year, options.lang));
                    monthSelector.title.click(function () {
                        monthSelector.container.remove();
                        showYearSelector();
                        dropdown.setMenuPosition();
                    });

                    monthSelector.back.click(function () {
                        datePartFinal.year--;
                        monthSelector.title.text(numberLocalizer(datePartFinal.year, options.lang));
                        showMonth();
                    });

                    monthSelector.next.click(function () {
                        datePartFinal.year++;
                        monthSelector.title.text(numberLocalizer(datePartFinal.year, options.lang));
                        showMonth();
                    });

                    function showMonth() {
                        monthSelector.content.empty();
                        datePartDrd = getDatePart(dropdown.getSelectedOption().id || '');
                        var months = $.datepicker.regional[regional].monthNames;
                        $.each(months, function (m, month) {
                            var monthElem = $('<div>').addClass('month float-right').append($('<span>').text(month)).appendTo(monthSelector.content);
                            if (datePartDrd.month == m + 1 && datePartDrd.year == datePartFinal.year) monthElem.addClass('active');
                            if (datePartCurrent.month == m + 1 && datePartCurrent.year == datePartFinal.year) monthElem.addClass('current');
                            monthElem.click(function () {
                                datePartFinal.month = m + 1;
                                if (datePartFinal.day > 29) datePartFinal.day = 29;
                                dpicker.datepicker("setDate", convertDatePart(datePartFinal));
                                dropdown.setSelected(convertDatePart(datePartFinal));
                                monthSelector.container.remove();
                                dayPickerContainer.show();
                            });
                        });
                    }
                    showMonth();
                }

                /*-------------------------------------------*/
                function showYearSelector() {
                    var yearSelector = {
                        container: $('<div>').addClass('ravesh-date-picker-year'),
                        head: $('<div>').addClass('ui-datepicker-header float-right'),
                        back: $('<span>').addClass('ui-datepicker-prev ui-corner-all').append($('<span>').addClass('ui-icon ui-icon-circle-triangle-e')),
                        title: $('<div>').addClass('ui-datepicker-title disable'),
                        next: $('<span>').addClass('ui-datepicker-next ui-corner-all').append($('<span>').addClass('ui-icon ui-icon-circle-triangle-w')),
                        content: $('<div>')
                    }
                    yearSelector.head.append(yearSelector.next, yearSelector.back, yearSelector.title);
                    yearSelector.container.append(yearSelector.head, yearSelector.content).appendTo(dpicker);

                    yearSelector.back.click(function () {
                        yearMinNumber = yearMinNumber - 12;
                        showYear();
                    });

                    yearSelector.next.click(function () {
                        yearMinNumber = yearMinNumber + 12;
                        showYear();
                    });

                    var yearMinNumber = datePartFinal.year - 6;
                    function showYear() {
                        yearSelector.content.empty();
                        yearSelector.title.text(numberLocalizer((yearMinNumber + 11) + " - " + yearMinNumber, options.lang));
                        for (var i = yearMinNumber; i < yearMinNumber + 12; i++) {
                            (function (year) {
                                var yearElem = $('<div>').addClass('year float-right').append($('<span>').text(numberLocalizer(year, options.lang))).appendTo(yearSelector.content);
                                yearElem.click(function () {
                                    datePartFinal.year = year;
                                    dpicker.datepicker("setDate", convertDatePart(datePartFinal));
                                    dropdown.setSelected(convertDatePart(datePartFinal));
                                    yearSelector.container.remove();
                                    showMonthSelector();
                                });
                            })(i);
                        }
                    }
                    showYear();
                }

                return dpicker;
            },
            onSelected: function (opt) {
                if (!opt) options.onSelected(opt.id);
            }
        }, options || {});

        var dropdown = new Ravesh.DropDown(options);


        dropdown.checkValid = function () {
            return checkValidDate(dropdown.getSelectedOption().id || '');
        }

        dropdown.setCurrentDate = function () {
            dropdown.setSelected(dropdown.getCurrentDate());
        }

        dropdown.getCurrentDate = function () {
            if (options.lang == 'fa') {
                var today = new JalaliDate();
                return today.getFullDate();
            } else {
                var today = new Date();
                return padNumber(today.getMonth() + 1) + "/" + padNumber(today.getDate()) + "/" + today.getFullYear();
            }
        }

        dropdown.getGregorianDate = function () {
            var selectedDate = dropdown.getSelectedOption().id
            if (selectedDate == null || selectedDate == '') return '';
            if (options.lang == 'fa') {
                var jalaliDate = new JalaliDate(selectedDate);
                return jalaliDate.getGregorianDate();
            } else {
                return selectedDate;
            }
        }

        dropdown.setLang = function (lang) {
            options.lang = lang;
        }

        var drdSetSelected = dropdown.setSelected;
        dropdown.setSelected = function (date) {
            drdSetSelected({ id: date, title: date })
        }

        function checkValidDate(date) {
            if (options.lang == 'fa') {
                return (/^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/)
                       .test(date);
            } else {
                return (/^\d{2}[./-]\d{2}[./-]\d{4}$/)
                       .test(date);
            }
        }

        function getDatePart(date) {
            if (date == '' || !checkValidDate(date)) return { year: 0, month: 0, day: 0 }
            var arrDate = date.split("/");
            if (options.lang == 'fa') {
                return { year: parseInt(arrDate[0]), month: parseInt(arrDate[1]), day: parseInt(arrDate[2]) }
            } else {
                return { year: parseInt(arrDate[2]), month: parseInt(arrDate[0]), day: parseInt(arrDate[1]) }
            }
        }

        function convertDatePart(datePart) {
            if (options.lang == 'fa') {
                return padNumber(datePart.year) + "/" + padNumber(datePart.month) + "/" + padNumber(datePart.day)
            } else {
                return padNumber(datePart.month) + "/" + padNumber(datePart.day) + "/" + padNumber(datePart.year)
            }
        }

        function padNumber(num) {
            var number = parseInt(num);
            return number < 10 ? '0' + number : number.toString();
        }

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.getUserList = function (callback, group, mode) {
        if (!mode) mode = 'email';
        if (!group) group = '';
        var win = window;
        if (win.rvcUsersLoader == null) {
            win.rvcUsersLoaderCallbacks = new Array();
            win.rvcUsersIsLoading = {};
            win.rvcUsers = {};
            win.rvcUsersLoader = function (callback, group_, mode_) {
                if (win.rvcUsers['_' + group_ + mode_]) {
                    callback(win.rvcUsers['_' + group_ + mode_]);
                } else {
                    if (!win.rvcUsersIsLoading['_' + group_ + mode_]) {
                        win.rvcUsersIsLoading['_' + group_ + mode_] = true;
                        win.rvcUsersLoaderCallbacks.push([callback, group_, mode_]);
                        FormUtility.postExtra('/pages/FormBuilderService.aspx/getUsers_', { group: group_, mode: mode_ },
                            function (isSuccess, message, data) {
                                if (isSuccess) {
                                    win.rvcUsers['_' + group_ + mode_] = data;
                                    $.each(win.rvcUsersLoaderCallbacks, function (c, callback) {
                                        if (callback[1] == group_ && callback[2] == mode_) callback[0](win.rvcUsers['_' + group_ + mode_]);
                                    });
                                }
                            }
                        );
                    } else {
                        win.rvcUsersLoaderCallbacks.push([callback, group_, mode_]);
                    }
                }
            }
        }
        win.rvcUsersLoader(callback, group, mode);
    }


    Ravesh.selectUser = function (options) {

        var defaultOptions = {
            options: [],
            defaultTitle: '',
            defaultId: '',
            group: '',
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('picture-and-detail').css({ 'min-width': 200, 'line-height': 1 });

                if (data.picture == '') {
                    opt.append($('<div>').addClass('picture float-right').append($('<i>').addClass('icon-user')));
                } else {
                    opt.append($('<img>').addClass('picture float-right').attr('src', data.picture));
                }

                opt.append($('<div>').addClass('title').text(data.title));

                if (data.detail != null && data.detail != '') {
                    opt.append($('<div>').addClass('detail').text(data.detail));
                } else {
                    opt.append($('<div>').addClass('detail').text(data.id == '' ? 'Username' : data.id));
                }

                return opt;
            }
        }
        options = $.extend(true, defaultOptions, options || {});


        var dropdown = new Ravesh.DropDown(options);

        dropdown.setSelectedById = function (id) {
            if (id == '') { dropdown.setSelected({ id: '', title: options.defaultTitle }); return false };

            Ravesh.getUserList(function (users) {
                var user = $.grep(users, function (s) { return s.id == id });
                dropdown.setSelected({ id: id, title: (user.length > 0) ? user[0].title : '', userId: (user.length > 0) ? user[0].userId : 0 });
            }, options.group);
        }
        dropdown.setSelectedByUserId = function (userId) {
            if (userId == '' || userId == 0) { dropdown.setSelected({ id: '', title: options.defaultTitle }); return false };

            Ravesh.getUserList(function (users) {
                var user = $.grep(users, function (s) { return s.userId == userId });
                dropdown.setSelected({ id: (user.length > 0) ? user[0].id : '', title: (user.length > 0) ? user[0].title : '', userId: (user.length > 0) ? user[0].userId : userId });
            }, options.group);
        }

        dropdown.showLoading();
        Ravesh.getUserList(function (users) {
            dropdown.hideLoading();
            var opts = [{ id: '', userId: 0, title: options.defaultTitle, picture: '', detail: '' }].concat(users);
            dropdown.setOptions(opts);
            if (options.defaultId != '') dropdown.setSelectedById(options.defaultId);
        }, options.group)

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectMultiUser = function (options) {
        var self = this;
        var defaultOptions = {
            lang: 'en',
            width: 200,
            height: 250,
            createOption: function (data) {
                return $('<div>').text(data.title);
            },
            items: []
        }
        options = $.extend(true, defaultOptions, options || {});

        var container = $('<div>').css({ 'width': options.width }).addClass('ravesh-input ravesh-multi-selector');
        var menuContainer = $('<div>').css({ 'width': options.width, 'position': 'relative', 'max-height': options.height }).addClass('ravesh-dropdown-menu');
        var loading = $('<div>').addClass('spinner small').css({ 'margin': '7px 0 0' }).hide().appendTo(container);

        self.getUI = function () {
            return container;
        }
        self.showLoading = function () { loading.show() };
        self.hideLoading = function () { loading.hide() };
        self.getSelectedOptions = function () {
            var result = [];
            container.find('.item').each(function (i, item) { result.push($(item).attr('item')) });
            return result;
        }
        self.setSelectedOptions = function (data) {
            $.each(data, function (i, id) {
                var item = $.grep(options.items, function (s) { return s.id == id });
                if (item.length > 0) container.append(createElem(item[0]));
            });
        }

        var mnu = new RaveshUI.Menu(container, {
            content: menuContainer,
            marginTop: 0,
            align: options.lang == 'fa' ? 'right' : 'left',
            removeAfterHide: false
        });

        var createElem = function (item) {
            var btnRemove = $('<i>').addClass('icon-close float-right');
            var elem = $('<div>').addClass('item').attr('item', item.id).append($('<span>').text(item.title), btnRemove);
            btnRemove.click(function (ev) {
                elem.remove();
                mnu.refreshPosition();
                ev.stopPropagation();
            });
            return elem;
        }

        self.setItems = function (items) {
            options.items = items;
            $.each(items, function (u, item) {
                var opt = $('<div>').addClass('option').appendTo(menuContainer);
                opt.append(options.createOption(item));
                opt.click(function () {
                    if (container.find('[item=' + item.id + ']').length > 0) return false;
                    container.append(createElem(item));
                    mnu.refreshPosition();
                });
            });
            mnu.refreshPosition();
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.AjaxDrillDown = function (options) {
        var url = options.url;

        var win = window;
        if (win.rvcAjaxDrillDownLoader == null) {
            win.rvcAjaxDrillDownLoaderCallbacks = new Array();
            win.rvcAjaxDrillDown = {};
            win.rvcAjaxDrillDownIsLoading = {};
            win.rvcAjaxDrillDownLoader = function (url, callback) {
                if (win.rvcAjaxDrillDown[url]) {
                    callback(win.rvcAjaxDrillDown[url]);
                } else {
                    if (!win.rvcAjaxDrillDownIsLoading[url]) {
                        win.rvcAjaxDrillDownIsLoading[url] = true;
                        win.rvcAjaxDrillDownLoaderCallbacks.push([url, callback]);
                        FormUtility.postExtra(url, '',
                            function (isSuccess, message, data) {
                                if (isSuccess) {
                                    win.rvcAjaxDrillDown[url] = data;
                                    $.each(win.rvcAjaxDrillDownLoaderCallbacks, function (c, callback_) {
                                        if (callback_[0] == url) callback_[1](win.rvcAjaxDrillDown[url]);
                                    });
                                }
                            }
                        );
                    } else {
                        win.rvcAjaxDrillDownLoaderCallbacks.push([url, callback]);
                    }
                }
            }
        }


        var defaultOptions = {
            defaultTitle: '',
            defaultTitleGroup: '',
            getChildOptions: function (opt, callback) {
                if (opt.id != 0) { callback(opt.childs); return; }
                win.rvcAjaxDrillDownLoader(url, function (data) {
                    callback([{ id: '', title: options.defaultTitle }].concat(data.childs));
                })
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.options = { id: 0, title: options.defaultTitleGroup, childs: [] };
        var drilldown = new Ravesh.DrillDown(options);


        drilldown.setSelectedById = function (id) {
            if (id == '') { drilldown.setSelected({ id: '', title: options.defaultTitle }); return false }

            win.rvcAjaxDrillDownLoader(url, function (data) {
                var title = '';
                var findTitle = function (childs) {
                    for (var item in childs) {
                        if (title != '') return;
                        if (childs[item].id == id) { title = childs[item].title; return }
                        if (childs[item].childs) findTitle(childs[item].childs);
                    }
                }
                findTitle(data.childs);
                drilldown.setSelected({ id: id, title: title });
            });
        }

        return drilldown;
    }

    Ravesh.selectCustomerGroup = function (options) {
        options.url = '/pages/FormBuilderService.aspx/getCustomerGroup_';
        return Ravesh.AjaxDrillDown(options);
    }

    Ravesh.selectUserGroupSupport = function (options) {
        options.url = '/pages/FormBuilderService.aspx/getUserSupportGroup_';
        return Ravesh.AjaxDrillDown(options);
    }

    Ravesh.selectUserGroupSupportAllow = function (options) {
        options.url = '/pages/FormBuilderService.aspx/getAllowUserSupportGroup_';
        return Ravesh.AjaxDrillDown(options);
    }

    /*-----------------------------------------------------*/

    Ravesh.selectCustomer = function (options) {

        var defaultOptions = {
            defaultTitle: '',
            detail: '',
            advanceSearch: '',//if empty not show btn
            //ajaxUrl: '../pages/FormBuilderService.aspx/searchCustomer_',
            ajaxUrl: '/CustomerInfo/searchCustomer',
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('picture-and-detail').css({ 'min-width': 200 });
                if (data.picture == '') {
                    opt.append($('<div>').addClass('picture float-right').append($('<i>').addClass('icon-user')));
                } else {
                    opt.append($('<img>').addClass('picture float-right').attr('src', data.picture));
                }
                opt.append($('<div>').addClass('title').text(data.title));
                opt.append($('<div>').addClass('detail').text(data.detail));
                return opt;
            },
            createContent: function () {
                if (options.advanceSearch == '') return '';
                var link = $('<div>').text(options.advanceSearch).addClass('ravesh-link').css({ padding: '10px 2px', 'text-align': 'center' });
                link.click(function () {
                    dropdown.hideMenu();
                });
                return link;
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.emptyOption = { id: '', title: options.defaultTitle, detail: options.detail, picture: '' };

        var dropdown = new RaveshUI.DropDown(options);

        dropdown.setSelectedById = function (id) {
            if (id == '') { dropdown.setSelected({ id: '', title: options.defaultTitle }); return false }
            dropdown.showLoading();
            FormUtility.postExtra('/pages/FormBuilder/services/FormService_.asmx/getCustomerById_', { id: id },
                function (isSuccess, message, data) {
                    dropdown.hideLoading();
                    if (isSuccess) {
                        if (data.title == '') {
                            dropdown.setSelected({ id: '', title: options.defaultTitle });
                        } else {
                            dropdown.setSelected(data);
                        }
                    }
                }
            );
        }

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectProductGroup = function (options) {

        var win = window;
        if (win.rvcProductGroupLoader == null) {
            win.rvcProductGroupLoaderCallbacks = new Array();
            win.rvcProductGroupLoader = function (callback) {
                if (win.rvcProductGroup) {
                    callback(win.rvcProductGroup);
                } else {
                    if (!win.rvcProductGroupIsLoading) {
                        win.rvcProductGroupIsLoading = true;
                        win.rvcProductGroupLoaderCallbacks.push(callback);
                        FormUtility.postExtra('/pages/FormBuilderService.aspx/getProductGroup_', '',
                            function (isSuccess, message, data) {
                                if (isSuccess) {
                                    win.rvcProductGroup = data;
                                    $.each(win.rvcProductGroupLoaderCallbacks, function (c, callback) {
                                        callback(win.rvcProductGroup);
                                    });
                                }
                            }
                        );
                    } else {
                        win.rvcProductGroupLoaderCallbacks.push(callback);
                    }
                }
            }
        }


        var defaultOptions = {
            defaultTitle: '',
            defaultTitleGroup: '',
            getChildOptions: function (opt, callback) {
                if (opt.id != 0) { callback(opt.childs); return; }
                win.rvcProductGroupLoader(function (data) {
                    callback([{ id: '', title: options.defaultTitle }].concat(data.childs));
                })
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.options = { id: 0, title: options.defaultTitleGroup, childs: [] };
        var drilldown = new Ravesh.DrillDown(options);


        drilldown.setSelectedById = function (id) {
            if (id == '') { drilldown.setSelected({ id: '', title: options.defaultTitle }); return false }

            win.rvcProductGroupLoader(function (data) {
                var title = '';
                var findTitle = function (childs) {
                    for (var item in childs) {
                        if (title != '') return;
                        if (childs[item].id == id) { title = childs[item].title; return }
                        if (childs[item].childs) findTitle(childs[item].childs);
                    }
                }
                findTitle(data.childs);
                drilldown.setSelected({ id: id, title: title });
            });
        }

        return drilldown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectProduct = function (options) {

        var defaultOptions = {
            defaultTitle: '',
            detail: '',
            price: '',
            advanceSearch: '',//if empty not show btn
            ajaxUrl: '../pages/FormBuilderService.aspx/searchProduct_',
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('option-product');
                if (data.picture == '') {
                    opt.append($('<div>').addClass('picture float-right').append($('<i>').addClass('icon-product')));
                } else {
                    opt.append($('<img>').addClass('picture float-right').attr('src', data.picture));
                }
                opt.append($('<div>').addClass('title').text(data.title + (data.id ? '(' + data.id + ')' : '')).attr('title', data.title));
                opt.append($('<div>').addClass('detail').text(data.group));
                opt.append($('<div>').addClass('price').text(data.id == '' ? data.price : FormUtility.spiltWithComma(data.price)));
                return opt;
            },
            createContent: function () {
                if (options.advanceSearch == '') return '';
                var link = $('<div>').text(options.advanceSearch).addClass('ravesh-link').css({ padding: '10px 2px', 'text-align': 'center' });
                link.click(function () {
                    dropdown.hideMenu();
                });
                return link;
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.emptyOption = { id: '', title: options.defaultTitle, group: options.detail, picture: '', price: options.price };

        var dropdown = new RaveshUI.DropDown(options);

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectSales = function (options) {

        var defaultOptions = {
            defaultTitle: '',
            detail: '',
            price: '',
            createDate: '',
            advanceSearch: '',//if empty not show btn
            ajaxUrl: '../pages/FormBuilderService.aspx/searchSales_',
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('option-sales');
                opt.append($('<div>').addClass('title').text(data.title + (data.percent != '' && data.percent != 0 ? '(' + data.percent + '%)' : '')).attr('title', data.title));
                opt.append($('<div>').addClass('detail').text(data.createDate));
                opt.append($('<div>').addClass('price').text(data.id == '' ? data.price : FormUtility.spiltWithComma(data.price)));
                return opt;
            },
            createContent: function () {
                if (options.advanceSearch == '') return '';
                var link = $('<div>').text(options.advanceSearch).addClass('ravesh-link').css({ padding: '10px 2px', 'text-align': 'center' });
                link.click(function () {
                    dropdown.hideMenu();
                });
                return link;
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.emptyOption = { id: '', title: options.defaultTitle, percent: '', createDate: options.createDate, price: options.price };

        var dropdown = new RaveshUI.DropDown(options);

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectFactor = function (options) {

        var defaultOptions = {
            defaultTitle: '',
            detail: '',
            price: '',
            advanceSearch: '',//if empty not show btn
            ajaxUrl: '../pages/FormBuilderService.aspx/searchFactor_',
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('option-sales');
                opt.append($('<div>').addClass('title').text(data.title).attr('title', data.title));
                opt.append($('<div>').addClass('detail').text(data.customer));
                opt.append($('<div>').addClass('price').text(data.id == '' ? data.price : FormUtility.spiltWithComma(data.price)));
                return opt;
            },
            createContent: function () {
                if (options.advanceSearch == '') return '';
                var link = $('<div>').text(options.advanceSearch).addClass('ravesh-link').css({ padding: '10px 2px', 'text-align': 'center' });
                link.click(function () {
                    dropdown.hideMenu();
                });
                return link;
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.emptyOption = { id: '', title: options.defaultTitle, price: options.price, customer: options.detail };

        var dropdown = new RaveshUI.DropDown(options);

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.getFormList = function (custCode, callback) {
        var win = window;
        if (win.rvcFormsLoader == null) {
            win.rvcFormsLoaderCallbacks = new Array();
            win.rvcForms = {};
            win.rvcFormsIsLoading = {}
            win.rvcFormsLoader = function (custCode, callback) {
                if (win.rvcForms['_' + custCode]) {
                    callback(win.rvcForms['_' + custCode]);
                } else {
                    if (!win.rvcFormsIsLoading['_' + custCode]) {
                        win.rvcFormsIsLoading['_' + custCode] = true;
                        win.rvcFormsLoaderCallbacks.push([custCode, callback]);
                        FormUtility.postExtra('/pages/FormBuilder/services/FormService_.asmx/getFormList_', { custCode: custCode },
                            function (isSuccess, message, data) {
                                if (isSuccess) {
                                    win.rvcForms['_' + custCode] = data[0];
                                    $.each(win.rvcFormsLoaderCallbacks, function (c, callback) {
                                        if (callback[0] == custCode) callback[1](win.rvcForms['_' + custCode]);
                                    });
                                }
                            }
                        );
                    } else {
                        win.rvcFormsLoaderCallbacks.push([custCode, callback]);
                    }
                }
            }
        }
        win.rvcFormsLoader(custCode, callback);
    }
    Ravesh.clearFormList = function () {
        window.rvcFormsLoader = null;
    }

    Ravesh.selectForm = function (options) {

        


        var defaultOptions = {
            options: [],
            defaultTitle: '',
            defaultId: '',
            custCode: 0,
            getOnlyIsPublic: false,
            createOptionUI: function (data) {
                var opt = $('<div>').addClass('picture-and-detail').css({ 'min-width': 250 });
                opt.append($('<div>').addClass('picture float-right').css({ 'background': '#' + data.color, 'color': '#fff' }).append($('<i>').addClass('icon-list-alt')));
                if (options.custCode != 0) {
                    opt.append($('<div>').addClass('title').css({ 'margin-top': data.formValueCount == 0 ? 18 : 12 }).append(
                        $('<span>').text(data.title),
                        (data.formValueCount == 0 ? '' : $('<div>').addClass('detail').css({ color: '#DD4B39' }).text(data.formValueCount)))
                    );
                } else {
                    opt.append($('<div>').addClass('title').css({ 'margin-top': 18 }).text(data.title));
                }
                return opt;
            }
        }
        options = $.extend(true, defaultOptions, options || {});


        var dropdown = new Ravesh.DropDown(options);

        dropdown.setSelectedById = function (id) {
            if (id == '') { dropdown.setSelected({ id: id, title: options.defaultTitle, color: 'bbb' }); return false };

            Ravesh.getFormList(options.custCode, function (forms) {
                var form = $.grep(forms, function (s) { return s.id == id });
                if (form.length > 0) dropdown.setSelected(form[0]);
            });
        }

        dropdown.showLoading();
        Ravesh.getFormList(options.custCode, function (forms) {
            dropdown.hideLoading();
            var forms_ = forms;
            if (options.getOnlyIsPublic) forms_ = $.grep(forms_, function (s) { return s.isPublic });
            var opts = [{ id: '', title: options.defaultTitle, color: 'bbb' }].concat(forms_);
            dropdown.setOptions(opts);
            if (options.defaultId != '') dropdown.setSelectedById(options.defaultId);
        })

        dropdown.setSelectedDefault = function () {
            Ravesh.getFormList(options.custCode, function (forms) {
                dropdown.hideLoading();
                $.each(forms, function (f, form) {
                    if (form.isDefault) {
                        dropdown.setSelected(form, true);
                    }
                });
            })
        }

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectFormField = function (options) {

        var defaultOptions = {
            defaultTitle: 'please select',
            formNum: 'number',
            formId: '',
            fieldId: '',
            ajaxUrl: '/pages/FormBuilder/services/FormService_.asmx/searchFormValueParam_',
            getAjaxParam: function (key) {
                return { key: key, formId: options.formId, fieldId: options.fieldId }
            },
            createOptionUI: function (data) {
                var formValueId = options.formNum + ' ' + data.id.split('_')[0];
                var opt = $('<div>').addClass('title-and-detail');
                if (data.id == '') {
                    opt.append($('<div>').addClass('title').text(data.title).css('margin-top', 16));
                } else {
                    opt.append($('<div>').addClass('title').text(data.title));
                    opt.append($('<div>').addClass('detail').text(data.custName != '' ? data.custName + ' - ' + formValueId : formValueId));
                }
                return opt;
            }
        }
        options = $.extend(true, defaultOptions, options || {});
        options.emptyOption = { id: '', title: options.defaultTitle };

        var dropdown = new Ravesh.DropDown(options);

        return dropdown;
    }

    /*-----------------------------------------------------*/

    Ravesh.selectCustomerDialog = function (customerGroup, callback) {
        var lang = $('#HFlang').val();
        var res_ = {
            fa: { selectCustomer: 'انتخاب مشتری', search: 'جستجو', view: 'مشاهده', select: 'انتخاب' },
            en: { selectCustomer: 'Select customer', search: 'Search', view: 'View', select: 'Select' }
        }
        var res = res_[lang];
        var dialog = RaveshUI.showDialog({ title: res.selectCustomer, icon: 'icon-user-circle', width: 450 });

        var searchContainer = $('<div>').addClass('customer-quick-search-dialog-head');
        var searchIcon = $('<i>').addClass('icon-search float-right');
        var searchInput = $('<input>').attr('input', 'text').attr('placeholder', res.search);
        searchContainer.append(searchIcon, searchInput);

        dialog.setSubHead(searchContainer);
        searchContainer.click(function () { searchInput.focus() });

        var container = $('<div>').addClass('customer-quick-search-dialog');
        var table = $('<table>').appendTo(container);
        var loading = $('<div>').addClass('search-loading').append($('<div>').addClass('spinner')).appendTo(container);
        dialog.setContent(container);


        var timer;
        searchInput.keyup(function (ev) {
            clearTimeout(timer);
            timer = setTimeout(getData, 500);
        });
        getData();


        function getData() {
            loading.show();
            //FormUtility.postExtra('../pages/FormBuilderService.aspx/searchCustomer_', { key: searchInput.val().trim(), group: customerGroup ? customerGroup : 0, rnd: $('#HFRnd').val() },
            //FormUtility.postExtra('/CustomerInfo/searchCustomer', { userCode: searchInput.val().trim() },
            //    function (isSuccess, message, data) {
            //        loading.hide();
            //        if (!isSuccess) return false;
            //        table.empty();
            //        $.each(data, function (c, cust) {
            //            var btnView = $('<a>').addClass('ravesh-button').attr({ href: '#' }).text(res.view).click(function () {
            //                customer_Show_Info(cust.id, cust.title); return false;
            //            });
            //            var btnSelect = $('<a>').addClass('ravesh-button save').attr({ href: '#' }).text(res.select).click(function () {
            //                if (callback) callback(cust);
            //                dialog.close();
            //                return false;
            //            });
            //            var avatar = Ravesh.makeAvatar({ picture: cust.picture, title: cust.title, id: cust.id, size: 50 }).css('cursor', 'pointer').click(function () { btnView.click(); return false; });
            //            table.append(
            //                $('<tr>').append(
            //                    $('<td>').css({ width: 80, 'text-align': 'center', padding: '10px 0' }).append(avatar),
            //                    $('<td>').append($('<div>').addClass('title').text(cust.title), $('<div>').addClass('detail').text(cust.detail)),
            //                    $('<td>').css({ width: 70 }).append(btnView),
            //                    $('<td>').css({ width: 70 }).append(btnSelect)
            //                )
            //            )
            //        });
            //    }
            //);


            AjaxCallAction('GET','/CustomerInfo/searchCustomer', { userCode: searchInput.val().trim() }, true,
                function (data) {

                    loading.hide();
                    if (data) {
                        table.empty();

                        $.each(data, function (c, cust) {
                            //var btnView = $('<a>').addClass('ravesh-button').attr({ href: '#' }).text(res.view).click(function () {
                            //    customer_Show_Info(cust.id, cust.title); return false;
                            //});
                            var btnSelect = $('<a>').addClass('ravesh-button save').attr({ href: '#' }).text(res.select).click(function () {
                                if (callback) callback(cust);
                                dialog.close();
                                return false;
                            });
                            var avatar = Ravesh.makeAvatar({ picture: cust.picture, title: cust.title, id: cust.id, size: 50 }).css('cursor', 'pointer').click(function () { btnView.click(); return false; });
                            table.append(
                                $('<tr>').append(
                                    $('<td>').css({ width: 80, 'text-align': 'center', padding: '10px 0' }).append(avatar),
                                    $('<td>').append($('<div>').addClass('title').text(cust.title), $('<div>').addClass('detail').text(cust.detail)),
                                    //$('<td>').css({ width: 70 }).append(btnView),
                                    $('<td>').css({ width: 70 }).append(btnSelect)
                                )
                            )
                        });
                    }
                },
                false
            );


        }
    }

    Ravesh.selectTicketDialog = function (callback) {
        var lang = $('#HFlang').val();
        var res_ = {
            fa: { selectTicket: 'انتخاب تیکت', search: 'جستجو', view: 'مشاهده', select: 'انتخاب', id: 'تیکت شماره&zwnj;ی' },
            en: { selectTicket: 'Select ticket', search: 'Search', view: 'View', select: 'Select', id: 'id:' }
        }
        var res = res_[lang];
        var dialog = RaveshUI.showDialog({ title: res.selectTicket, icon: 'icon-shield-alt', width: 500 });

        var searchContainer = $('<div>').addClass('customer-quick-search-dialog-head');
        var searchIcon = $('<i>').addClass('icon-search float-right');
        var searchInput = $('<input>').attr('input', 'text').attr('placeholder', res.search);
        searchContainer.append(searchIcon, searchInput);

        dialog.setSubHead(searchContainer);
        searchContainer.click(function () { searchInput.focus() });

        var container = $('<div>').addClass('customer-quick-search-dialog');
        var table = $('<table>').appendTo(container);
        var loading = $('<div>').addClass('search-loading').append($('<div>').addClass('spinner')).appendTo(container);
        dialog.setContent(container);


        var timer;
        searchInput.keyup(function (ev) {
            clearTimeout(timer);
            timer = setTimeout(getData, 500);
        });
        getData();


        function getData() {
            loading.show();
            FormUtility.postExtra('../WebServices/get_info.asmx/searchTicket_', { key: searchInput.val().trim() },
                function (isSuccess, message, data) {
                    loading.hide();
                    if (!isSuccess) return false;
                    table.empty();
                    $.each(data, function (c, item) {
                        var btnView = $('<a>').addClass('ravesh-button').attr({ href: '#' }).text(res.view).click(function () {
                            show_ticket(item.id, item.subject); return false;
                        });
                        var btnSelect = $('<a>').addClass('ravesh-button save').attr({ href: '#' }).text(res.select).click(function () {
                            if (callback) callback(item);
                            dialog.close();
                            return false;
                        });
                        var avatar = Ravesh.makeAvatar({ picture: item.customerPicture, title: item.customerName, id: item.customerCode, size: 50 }).css('cursor', 'pointer').click(function () { customer_Show_Info(item.customerCode, item.customerName); return false; });
                        var title = $('<div>').addClass('title').text(item.subject).css('cursor', 'pointer').click(function () { customer_Show_Info(item.customerCode, item.customerName); return false; });
                        table.append(
                            $('<tr>').append(
                                $('<td>').css({ width: 80, 'text-align': 'center', padding: '10px 0' }).append(avatar),
                                $('<td>').append(title, $('<div>').addClass('detail').text(item.customerName)),
                                $('<td>').append($('<div>').css({ 'line-height': 2, color: '#888' }).html(res.id + ' ' + numberLocalizer(item.id, lang)), $('<div>').css({ color: '#888' }).text(numberLocalizer(item.createDateTime))),
                                $('<td>').css({ width: 70 }).append(btnView),
                                $('<td>').css({ width: 70 }).append(btnSelect)
                            )
                        )
                    });
                }
            );
        }
    }

    /*-----------------------------------------------------*/

    Ravesh.makeAvatar = function (options) {
        var defaultOptions = {
            id: 0,
            picture: '',
            size: 40,
            title: '',
            colors: ["#cc90e2", "#80d066", "#ecd074", "#6fb1e4", "#e57979", "#f98bae", "#73cdd0", "#fba76f"],
            radius: true
        }
        options = $.extend(true, defaultOptions, options || {});
        options.title = numberLocalizer(options.title, $('#HFlang').val());

        var nameSplit = options.title.toString().toUpperCase().split(' ');
        var nameChar = '';
        if (nameSplit.length == 1) {
            nameChar = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
        } else {
            nameChar = nameSplit[0].charAt(0) + '&zwnj;' + nameSplit[1].charAt(0);
        }

        var color = options.id == 0 ? options.colors[nameChar.charCodeAt(0) % options.colors.length] : options.colors[options.id % options.colors.length];

        if (options.picture != '' && options.picture.indexOf('noimage.jpg') == -1) {
            return $('<img>').attr({ src: options.picture, title: options.title }).css({ width: options.size, height: options.size, 'background-color': color, 'border-radius': options.radius ? '50%' : '0' });
        } else {
            return $('<span>').attr({ title: options.title }).append(nameChar).css({
                'width': options.size, 'height': options.size, 'background-color': color, 'line-height': options.size + 'px',
                'font-size': (options.size / 3) + 'px', 'overflow': 'hidden',
                'display': 'inline-block', 'color': '#fff', 'text-align': 'center', 'text-transform': 'uppercase', 'user-select': 'none',
                'border-radius': options.radius ? '50%' : '0'
            });
        }
    }

    if (window.RaveshUI == null) {
        window.RaveshUI = Ravesh;
    } else {
        for (var prop in Ravesh)
            window.RaveshUI[prop] = Ravesh[prop];
    }

})();
