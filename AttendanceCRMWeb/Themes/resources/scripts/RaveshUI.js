/// <reference path="../vendors/jquery-1.4.4.min.js" />
(function ($) {
    var Ravesh = {};

    var arrDialog = new Array();

    Ravesh.Dialog = function (option) {
        var self = this;
        var isMaximum = false;


        //default option
        var defaultOption = {
            id: '',
            title: '',
            detail: '',
            icon: '',
            width: '70%',
            minWidth: '',
            showHead: true,
            allowMaximum: false,
            onClose: null,
            onMaximum: null,
            closeMethods: ['overlay', 'escape'],
            disableBodyScroll: false,
            cssClass: '',
            zIndex: '',
            removeAfterClose: true
        }
        option = $.extend(true, defaultOption, option);

        if (!option.removeAfterClose) {
            var oldDialog = $.grep(arrDialog, function (s) { return s.id == option.id });
            if (oldDialog.length > 0) {
                oldDialog = oldDialog[0];
                oldDialog.isOld = true;
                oldDialog.overlay.fadeIn();
                oldDialog.dialog.fadeIn();
                return oldDialog;
            }
        }

        arrDialog.push(self);


        //default methods
        self.id = option.id;
        self.close = close;
        self.showLoading = showLoading;
        self.hideLoading = hideLoading;
        self.addFooterButton = addFooterButton;
        self.setSubHead = setSubHead;
        self.setContent = setContent;
        self.setFooter = setFooter;
        self.refreshHeight = resizeEvent;
        self.setOnClose = setOnClose;
        self.setTitle = setTitle;
        self.setDetail = setDetail;
        self.setWidth = function (width) { self.dialog.css({ 'width': width }) };
        self.setMaximum = setMaximum;
        self.setCloseMethods = function (closeMethods) { option.closeMethods = closeMethods };

        //define event
        document.addEventListener("keydown", keyDownEvent);


        //define element
        var head = $('<div>').addClass('head');
        var headTitle = $('<div>').addClass('title');
        var headDetail = $('<div>').addClass('detail');
        var headTitleCover = $('<div>').addClass('title-cover').append(headTitle, headDetail);
        var headIcon = $('<div>').addClass('icon float-right');
        var headClose = $('<div>').addClass('action-icon icon-close float-left');
        var headExpand = $('<div>').addClass('action-icon icon-expand float-left');
        var headCollapse = $('<div>').addClass('action-icon icon-collapse float-left');
        head.append(headIcon, headClose, headExpand, headCollapse, headTitleCover);

        var subHead = $('<div>').addClass('sub-head');

        var spinnerCover = $('<div>').addClass('spinner-cover').append($('<div>').addClass('spinner')).hide();
        var contentCover = $('<div>').addClass('content-cover');
        var content = $('<div>').addClass('content');
        var contentScroll = $('<div>').addClass('content-scroll ravesh-scrollbar');
        contentScroll.append(content);
        contentCover.append(contentScroll);
        var footer = $('<div>').addClass('footer');

        self.dialog = $('<div>').addClass('ravesh-dialog transitionIn ' + option.cssClass);
        self.dialog.append(head, spinnerCover, subHead, contentCover, footer);

        if (option.zIndex == '') option.zIndex = (parseInt($('.ui-widget-overlay:last').css('z-index')) || 0) + 1;
        self.overlay = $('<div>').addClass('ravesh-dialog-overlay fadeIn');
        self.overlay.append(self.dialog);
        self.overlay.css('z-index', option.zIndex < 1000 ? 1000 : option.zIndex);
        $('body').append(self.overlay);

        if (option.disableBodyScroll) {
            //$('body').addClass('ravesh-dialog-opened');
            //freezeScroll();
        }

        //init
        if (!option.showHead) head.hide();
        headTitle.text(option.title);
        if (option.detail != '') {
            head.addClass('has-detail');
            headDetail.text(option.detail);
        }
        if (option.icon == '') {
            self.dialog.addClass('no-icon');
        } else {
            headIcon.addClass(option.icon);
        }
        if (option.allowMaximum) {
            self.dialog.addClass('allow-maximum');
            if (RaveshUI.isMobile) { setMaximum(true); isMaximum = true; }
        }

        self.dialog.css({ 'width': option.width, 'min-width': option.minWidth });
        if (RaveshUI.isMobile) {
            self.dialog.css({ 'width': '100%', 'min-width': '100%' });
        }

        //methods
        function close() {
            if (typeof option.onClose === "function") {
                var allowClose = option.onClose();
                if (allowClose != null && !allowClose) return false;
            }
            if (option.removeAfterClose) {
                clearInterval(intervalResize);
                document.removeEventListener("keydown", keyDownEvent);
                arrDialog.splice($.inArray(self, arrDialog), 1);
                self.overlay.fadeOut(function () {
                    self.overlay.remove();
                });
                self.dialog.fadeOut(function () {
                    self.dialog.remove();
                    if (arrDialog.length == 0) {
                        //$('body').removeClass('ravesh-dialog-opened');
                        //unfreezeScroll();
                    }
                });
            } else {
                self.overlay.fadeOut(function () { self.overlay.hide(); });
                self.dialog.fadeOut(function () { self.dialog.hide(); });
            }

        }
        function setOnClose(callback) {
            option.onClose = callback;
        }
        function setSubHead(html) {
            subHead.html(html);
            resizeEvent();
        }
        function setContent(html) {
            content.html(html);
            resizeEvent();
        }
        function setFooter(html) {
            self.dialog.addClass('has-footer');
            footer.append(html);
        }
        function setTitle(str) {
            headTitle.text(str);
        }
        function setDetail(str) {
            head.toggleClass('has-detail', str != null && str != '');
            headDetail.text(str || '');
        }
        function addFooterButton(title, cssClass, callback) {
            self.dialog.addClass('has-footer');
            var btn = $("<input>")
                .attr('type', 'submit')
                .addClass('ravesh-button ' + cssClass)
                .val(title);

            if (callback)
                btn.click(callback);
            //btn.click(function () { callback });
            //btn.on("click", callback);
            //btn.attr("onclick", actionName);
            else
                btn.click(self.close)

            footer.append(btn);

            return btn;
        }
        function showLoading(isTransparent) {
            if (isTransparent) spinnerCover.addClass('is-transparent'); else spinnerCover.removeClass('is-transparent');
            spinnerCover.stop(true, true).fadeIn();
        }
        function hideLoading() {
            spinnerCover.stop(true, true).fadeOut();
        }
        function freezeScroll() {
            if ($("html").css("position") != "fixed") {
                var top = $("html").scrollTop() ? $("html").scrollTop() : $("body").scrollTop();
                if (window.innerWidth > $("html").width()) {
                    $("html").css("overflow-y", "scroll");
                }
                $("html").css({ "width": "100%", "height": "100%", "position": "fixed", "top": -top });
            }
        }
        function unfreezeScroll() {
            if ($("html").css("position") == "fixed") {
                $("html").css("position", "static");
                $("html, body").scrollTop(-parseInt($("html").css("top")));
                $("html").css({ "position": "", "width": "", "height": "", "top": "", "overflow-y": "" });
            }
        }


        function setMaximum(enable) {
            if (typeof option.onMaximum === "function") {
                var contentHeight = (enable ? window.innerHeight - ((option.showHead ? head.outerHeight() : 0) +
                    subHead.outerHeight() +
                    (self.dialog.hasClass('has-footer') ? footer.outerHeight() : 0)) : 0);
                option.onMaximum(enable, contentHeight);
            }
            isMaximum = enable;
            self.dialog.addClassed('is-maximum', enable);
            resizeEvent();
        }

        headClose.click(close);
        headExpand.click(function () {
            setMaximum(true);
        });
        headCollapse.click(function () {
            setMaximum(false);
        });
        self.overlay.click(function (ev) {
            if (option.closeMethods.indexOf('overlay') !== -1 && $(ev.target).hasClass('ravesh-dialog-overlay')) close();
        });

        var getDialogHeight = function () {
            return (option.showHead ? head.outerHeight() : 0)
                + subHead.outerHeight()
                + Math.max(content[0].scrollHeight, $(content).outerHeight())
                + (self.dialog.hasClass('has-footer') ? footer.outerHeight() : 0);
        }

        var isOverflow = function (margin) {
            var viewportHeight = window.innerHeight;
            var dialogHeight = getDialogHeight();

            return dialogHeight + margin + 20 >= viewportHeight;
        }

        var timeOutResize;
        function resizeEvent() {
            clearTimeout(timeOutResize);
            timeOutResize = setTimeout(function () {
                var margin = 25 + 25;
                if (isOverflow(margin)) {
                    self.dialog.css({ 'height': window.innerHeight - margin });
                    contentScroll.css({
                        'height': window.innerHeight
                            - (isMaximum ? 0 : margin)
                            - head.outerHeight()
                            - subHead.outerHeight()
                            - (self.dialog.hasClass('has-footer') ? footer.outerHeight() : 0),
                        'overflow-y': 'auto',
                        'width': '100%'
                    });
                } else {
                    self.dialog.css({ 'height': getDialogHeight() });
                    contentScroll.css({ 'height': 'auto' });
                }
            }, 100)
        }

        var intervalResize = setInterval(function () {
            resizeEvent();
        }, 500);

        function keyDownEvent(ev) {
            if (option.closeMethods.indexOf('escape') !== -1 && ev.which == 27) {
                if (arrDialog[arrDialog.length - 1] == self) {
                    if (isMaximum)
                        headCollapse.click();
                    else
                        close();
                }
            }
        }

    }

    /*-----------------------------------------------------*/

    var toastContainer = $('<div>').addClass('ravesh-toast-container');
    Ravesh.Toast = function () {
        var self = this;
        if ($('body').find('.ravesh-toast-container').length == 0) $('body').append(toastContainer);

        var toast = $('<div>').addClass('ravesh-toast bounceInLeft');
        var toastContent = $('<div>').addClass('toast-content');
        var toastTitle = $('<div>').addClass('toast-title');
        var toastMessage = $('<div>').addClass('toast-message');
        var toastIcon = $('<i>').addClass('toast-icon');
        var toastProgress = $('<div>').addClass('toast-progress');
        toastContent.append(toastIcon, toastMessage, toastTitle, toastMessage, toastProgress);
        toast.append(toastContent);


        self.setTitle = function (title) {
            toastTitle.html(title);
            return self;
        }
        self.setMessage = function (message) {
            toastMessage.html(message);
            return self;
        }
        self.setIcon = function (iconClass) {
            toastIcon.addClass(iconClass);
            return self;
        }
        self.setClass = function (cssClass) {
            toast.addClass(cssClass);
            return self;
        }
        self.setProgress = function (duration) {
            startProgress(duration);
        }
        self.setTimeOutHide = function (duration) {
            return setTimeout(function () {
                self.close();
            }, duration);
        }
        self.close = function () {
            toast.removeClass('bounceInLeft').addClass('fadeOut');
            toast.delay(250).slideUp(500, function () {
                toast.remove();
            })
        }

        toast.click(function () {
            self.close();
        });

        var startProgress = function (duration) {
            var hideTime = new Date().getTime() + duration;
            var intervalId = setInterval(function () {
                var percent = ((hideTime - (new Date().getTime())) / duration) * 100;
                toastProgress.width(percent + '%');
                if (percent < 0) {
                    clearInterval(intervalId);
                    toastProgress.hide();
                    self.close();
                }
            }, 10);
            var timeOutId;
            toast.hover(function () {
                clearInterval(intervalId);
                clearTimeout(timeOutId);
                toastProgress.hide();
            }, function () {
                timeOutId = self.setTimeOutHide(1000);
            });
        }


        toastContainer.append(toast);
    }

    /*-----------------------------------------------------*/

    $.fn.extend({
        showed: function (enable) {
            if (enable) $(this).show(); else $(this).hide();
            return $(this);
        },
        addClassed: function (className, enable) {
            if (enable) $(this).addClass(className); else $(this).removeClass(className);
            return $(this);
        },
        tooltiper: function (option) {
            if (typeof option === "string") option = { content: option };
            var self = $(this);
            var defaultOption = {
                content: '',
                textAlign: 'center',
                padding: 5,
                width: 'auto'
            }
            option = $.extend(defaultOption, option);
            var tip;
            if (option.content == '') return self;

            self.mouseenter(function (ev) {
                tip = $('<div>').addClass('ravesh-tips').css({ 'text-align': option.textAlign, 'padding': option.padding, 'min-width': option.width }).html(option.content.replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>'));
                $('body').append(tip);
                tip.css({
                    "z-index": 1000,
                    "position": "absolute",
                    "top": self.offset().top - tip.outerHeight() - 10,
                    "left": self.offset().left - ((tip.outerWidth()) / 2) + (self.outerWidth() / 2),
                }).hide().delay(100).fadeIn();
            }).mouseleave(function (ev) {
                if (tip) tip.remove();
            }).mousedown(function (ev) {
                if (tip) tip.remove();
            });

            return self;
        },
        onlyNumber: function () {
            $(this).keypress(function (ev) {
                var evt = ev || window.event;
                var key = evt.keyCode || evt.which;
                if (key > 31 && (key < 48 || key > 57)) return false;
                return true;
            });
            return $(this);
        },
        onlyDecimal: function (maxLength) {
            if (!maxLength) $(this).attr('maxLength', 16);
            $(this).keypress(function (ev) {
                $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });
            return $(this);
        },
        disableParentWheel: function () {
            function mousewheel(ev) {
                var delta = (ev.type === "mousewheel") ? ev.wheelDelta : ev.detail * -40;
                if (delta < 0 && (this.scrollHeight - this.offsetHeight - this.scrollTop) <= 0) {
                    this.scrollTop = this.scrollHeight;
                    ev.preventDefault();
                } else if (delta > 0 && delta > this.scrollTop) {
                    // this.scrollTop = 0;
                    // ev.preventDefault();
                }
            }
            $(this).bind('mousewheel', mousewheel);
            $(this).bind('DOMMouseScroll', mousewheel);
            return $(this);
        },
        changeDirection: function (text) {
            var str = (text == undefined ? $(this).val() : text);

            var hasUnicodeChar = false;
            for (var i = 0; i < str.length; ++i) {
                if (str.charCodeAt(i) >= 256) { hasUnicodeChar = true; break; }
            }

            if (hasUnicodeChar) {
                $(this).css({ 'direction': 'rtl', 'text-align': 'right' });
            } else {
                $(this).css({ 'direction': 'ltr', 'text-align': 'left' });
            }
        },
        currency: function () {
            $(this).keyup(function (ev) {
                var InputMoney = $(this).val();
                if (InputMoney != undefined && InputMoney != null) {
                    var digit = '';
                    InputMoney = InputMoney.toString().replace(/,/gi, '');
                    if (InputMoney.toString().indexOf(".") > -1) {
                        digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
                        InputMoney = InputMoney.toString().substr(0, InputMoney.toString().indexOf("."));
                    }
                    var result = InputMoney.toString().substr(0, InputMoney.length % 3);
                    InputMoney = InputMoney.toString().substr(InputMoney.length % 3, InputMoney.length);
                    for (i = 0; i < InputMoney.length; i = i + 3) result += ',' + InputMoney.toString().substr(i, 3);
                    if (result.charAt(0) == ",") result = result.toString().substr(1, result.length);
                    $(this).val(result + digit);
                }
            });
            return $(this);
        }
    });

    /*-----------------------------------------------------*/

    Ravesh.successToast = function (title, message) {
        return new Ravesh.Toast().setTitle(title).setMessage(message).setIcon('icon-check').setClass('success').setProgress(4000);
    }
    Ravesh.infoToast = function (title, message) {
        return new Ravesh.Toast().setTitle(title).setMessage(message).setIcon('icon-info').setClass('info').setProgress(4000);
    }
    Ravesh.warningToast = function (title, message) {
        return new Ravesh.Toast().setTitle(title).setMessage(message).setIcon('icon-warning').setClass('warning').setProgress(4000);
    }
    Ravesh.errorToast = function (title, message) {
        return new Ravesh.Toast().setTitle(title).setMessage(message).setIcon('icon-error').setClass('error').setProgress(4000);
    }

    Ravesh.warningModal = function (OKstr, message) {
        var dialog = RaveshUI.showDialog({ showHead: false, width: 450 });
        var content = $('<div>').addClass('ravesh-modal');
        dialog.setContent(content.append($('<i>').addClass('icon-warning'), message.replace(/\\n/g, '<br/>')));
        dialog.addFooterButton(OKstr, 'submit');
        return dialog;
    }

    Ravesh.deleteConfirmModal = function (yesStr, noStr, message, callback) {
        var dialog = RaveshUI.showDialog({ showHead: false, width: 470, zIndex:1061 });
        var content = $('<div>').addClass('ravesh-modal');
        dialog.setContent(content.append($('<i>').addClass('icon-warning'), message));
        var yesBtn = dialog.addFooterButton(yesStr, 'red', function () { dialog.close(); callback() });
        dialog.addFooterButton(noStr);
        yesBtn.focus();
        return dialog;
    }

    Ravesh.confirmModal = function (yesStr, noStr, cancelStr, message, callback) {
        var dialog = RaveshUI.showDialog({ showHead: false, width: 470 });
        var content = $('<div>').addClass('ravesh-modal');
        dialog.setContent(content.append(message.replace(/\\n/g, '<br/>')));
        dialog.addFooterButton(yesStr, 'submit', function () { dialog.close(); callback(true) }).focus();
        dialog.addFooterButton(noStr, 'red', function () { dialog.close(); callback(false) });
        if (cancelStr != "") dialog.addFooterButton(cancelStr);
        return dialog;
    }
    Ravesh.promptSelectModal = function (title, OKstr, defaultValue, valueList, callback, closeAfterOk) {
        var dialog = RaveshUI.showDialog({ title: title, width: 400 });
        var content = $('<div>').addClass('ravesh-prompt');
        dialog.setContent(content);
        dialog.addFooterButton(OKstr, 'float submit', okPrompt);

        var input = $('<select>').addClass('ravesh-input').css('width', '99%').appendTo(content);
        for (var i = 0; i < valueList.length; ++i) {
            input.append($('<option>').val(valueList[i].id).text(valueList[i].text));
        };

        input.val(defaultValue);
        input.select().focus();
        input.keypress(function (ev) {
            if (ev.keyCode == 13) {
                okPrompt();
            }
        });

        function okPrompt() {
            var value = input.val();
            if (value != '') {
                if (closeAfterOk == undefined || closeAfterOk == true) dialog.close();
                callback(value);
            } else {
                input.focus();
            }
        }

        return dialog;
    }
    Ravesh.promptModal = function (title, OKstr, defaultValue, callback) {
        var dialog = RaveshUI.showDialog({ title: title, width: 400 });
        var content = $('<div>').addClass('ravesh-prompt');
        dialog.setContent(content);
        dialog.addFooterButton(OKstr, 'float submit', okPrompt);

        var input = $('<input>').addClass('ravesh-input').attr({ type: 'text' }).val(defaultValue).appendTo(content);
        input.select().focus();
        input.keypress(function (ev) {
            if (ev.keyCode == 13) {
                okPrompt();
            }
        });

        function okPrompt() {
            var value = input.val().trim();
            if (value != '') {
                dialog.close();
                callback(value);
            } else {
                input.focus();
            }
        }

        return dialog;
    }

    Ravesh.showDialog = function (option) {
        return new Ravesh.Dialog(option);
    }

    window.RaveshUI = Ravesh;
})(jQuery);

