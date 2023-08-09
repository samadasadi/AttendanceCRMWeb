(function (minaDent, $) {

    //Only Number And Minus And .
    function keyPressOnlyNumber(e) {
        if (e.which != 8 && e.which != 45 && e.which != 46 && isNaN(String.fromCharCode(e.which)))
            e.preventDefault();
    }


    var isPlusNumberKey = function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    var amountMaskE2 = function (obj) {
        var amount = obj.value;
        var i, j, mystring, flag;
        if (amount == '')
            return "";
        i = amount.length;
        mystring = "";
        for (j = 0; j < i; j++) {
            if (amount.substring(j, j + 1) == ",") {
                flag = true;
            }
        }
        if (flag == true) {
            amount = dAmountMaskE(amount);
        }
        i = amount.length;
        if (i > 3) {
            for (j = i; j > 0; j = j - 3) {

                if (j > 3) {
                    mystring = "," + amount.substring(j - 3, j) + mystring;

                } else {
                    mystring = amount.substring(0, j) + mystring;
                }
            }
            obj.value = mystring;
        } else {
            obj.value = amount;
        }
    }


    var amountMaskE2ByValue = function (amount) {
        var i, j, mystring, flag;
        if (amount == '')
            return "";
        i = amount.length;
        mystring = "";
        for (j = 0; j < i; j++) {
            if (amount.substring(j, j + 1) == ",") {
                flag = true;
            }
        }
        if (flag == true) {
            amount = dAmountMaskE(amount);
        }
        i = amount.length;
        if (i > 3) {
            for (j = i; j > 0; j = j - 3) {

                if (j > 3) {
                    mystring = "," + amount.substring(j - 3, j) + mystring;

                } else {
                    mystring = amount.substring(0, j) + mystring;
                }
            }
            return mystring;
        } else {
            return amount;
        }
    }

    function dAmountMaskE(amount) {
        var i, j, mystring, str;
        i = amount.length;
        mystring = "";
        for (j = i; j >= 0; j -= 1) {
            str = amount.substring(j, j - 1);
            if (str != ",") {
                mystring = str + mystring;
            }
        }
        return mystring;
    }
    var removeComa = function (str) {
        if (str == "" || str == null) {
            return 0;
        }
        str = str.replace(",", "");
        str = str.replace(",", "");
        str = str.replace(",", "");
        str = str.replace(",", "");
        str = str.replace(",", "");
        return parseInt(str);
    }
    var setDataControl = function (selector) {
        $(selector).datepicker({ dateFormat: 'yy/mm/dd', autoSize: true, changeMonth: true, changeYear: true, shortYearCutoff: 50, minDate: new Date(1900, 1 - 1, 1), yearRange: '1360:1400' });
    }

    var FillSelectByAjax = function (url, selectId, data, hasChoosen) {

        EmptySelect(selectId);
        if (url == undefined || url == "") {
            return;
        }
        $.ajax({
            url: url,
            type: 'GET',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: data,
            success: function (state) {
                var optLable = document.createElement("option");
                document.getElementById(selectId).options.add(optLable);
                optLable.text = ("--");
                optLable.value = "";
                for (var i = 0; i < state.length; i++) {
                    var opt = document.createElement("option");
                    document.getElementById(selectId).options.add(opt);
                    opt.text = (state[i].Text);
                    opt.value = (state[i].Value);
                    opt.selected = state[i].Selected;
                }
                if (hasChoosen) {
                    RemoveDisableAttrTag(selectId);
                    $('#' + selectId).trigger("chosen:updated");
                }
            }, error: function () {
                AlertDialog("متاسفانه عملیات با موفقیت انجام نشد", "خطا", 'error');
            }
        });
    }
    var FillSelectByAjaxShowLable = function (url, selectId, data, hasChoosen, showLable) {
        EmptySelect(selectId);
        if (url == undefined || url == "") {
            return;
        }
        $.ajax({
            url: url,
            type: 'GET',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: data,
            success: function (state) {
                if (showLable) {
                    var optLable = document.createElement("option");
                    document.getElementById(selectId).options.add(optLable);
                    optLable.text = ("--");
                    optLable.value = "";
                }
                for (var i = 0; i < state.length; i++) {
                    var opt = document.createElement("option");
                    document.getElementById(selectId).options.add(opt);
                    opt.text = (state[i].Text);
                    opt.value = (state[i].Value);
                    opt.selected = state[i].Selected;
                }
                if (hasChoosen) {
                    RemoveDisableAttrTag(selectId);
                    $('#' + selectId).trigger("chosen:updated");
                }
            }, error: function () {
                AlertDialog("متاسفانه عملیات با موفقیت انجام نشد", "خطا", 'error');
            }
        });
    }

    var EmptyChoosenSelect = function (id) {

        EmptySelect(id);
        UpdateChoosenSelect(id);
    }
    ////choosen function
    function DisableChoosenSelect(selectId) {
        $('#' + selectId).val("");
        $('#' + selectId).attr('disabled', true).trigger("chosen:updated");
    }

    var UpdateChoosenSelect = function (selectId) {
        $('#' + selectId).trigger("chosen:updated");
    }


    function ajaxInitialization() {
        // mdDate
        $('.mdDate').MdPersianDateTimePicker({
            Placement: 'bottom',
            Trigger: 'click',
            EnableTimePicker: false,
            //  TargetSelector: '#ElementId',
            GroupId: '',
            ToDate: false,
            FromDate: false,
            DisableBeforeToday: false,
            Disabled: false,
            Format: 'yyyy/MM/dd',
            IsGregorian: false,
            EnglishNumber: false,
        });

        //var config = {
        //    '.chzn-select': {},
        //    '.chzn-select-limit': { max_selected_options: 20 },
        //    '.Multiselect': { max_selected_options: 20 },
        //    '.chzn-select-deselect': { allow_single_deselect: true },
        //    '.chzn-select-no-single': { disable_search_threshold: 10 },
        //    '.chzn-select-no-results': { no_results_text: 'Oops, nothing found!' },
        //    '.chzn-select-width': { width: "95%" }
        //};
        //for (var selector in config) {
        //    try {
        //        $(selector).chosen(config[selector]);
        //    } catch (e) {
        //    }
        //}

        setSearchCombo();
    }


    var ajaxLoader = function (el, options) {
        var defaults = {
            bgColor: '#fff',
            duration: 800,
            opacity: 0.7,
            classOveride: false
        };
        this.options = jQuery.extend(defaults, options);
        this.container = $(el);
        this.init = function () {
            var container = this.container;
            this.remove();
            var overlay = $('<div></div>').css({
                'background-color': this.options.bgColor,
                'opacity': this.options.opacity,
                'width': "99.9%",
                'height': "99.9%",
                'position': 'absolute',
                'top': '0px',
                'z-index': 100
            }).addClass('ajax_overlay');
            if (this.options.classOveride) {
                overlay.addClass(this.options.classOveride);
            }
            container.append(
                overlay.append(
                    $('<div></div>').addClass('ajax_loader')
                ).fadeIn(this.options.duration)
            );
        };
        this.remove = function () {
            var overlay = this.container.children(".ajax_overlay");
            if (overlay.length) {
                overlay.fadeOut(this.options.classOveride, function () {
                    overlay.remove();
                });
            }
        };
        this.init();
    }
    var hideModalBox = function (box) {
        box.hide();
        $(box[0]).remove();
    };

    var yesBtnTxt = window.lang === "fa" ? "بله" : "yes";
    var noBtnTxt = window.lang === "fa" ? "خیر" : "no";
    var exitBtnTxt = window.lang === "fa" ? "خروج" : "exit";
    var addBtnTxt = window.lang === "fa" ? "ثبت" : "Submit";
    var cancelBtnTxt = window.lang === "fa" ? "لغو" : "Cancel";
    var SaveBtnTxt = window.lang === "fa" ? "ذخیره" : "Save";
    var Detail = window.lang === "fa" ? "جزئیات" : "Detials";
    var codingTitle = window.lang === "fa" ? "ایجاد کدینگ" : "Create Coding";
    //var userEdit = window.lang === "fa" ? "ویرایش " : "User Edit";
    var Userdelete = window.lang === "fa" ? "حذف" : "User Delete";
    var CreateProfile = window.lang === "fa" ? "ایجاد پروفایل" : "Create Profile";
    var UploadDoc = window.lang === "fa" ? "ثبت فایل" : "Create File";
    var Therapy = window.lang === "fa" ? "ایجاد درمان" : "Create Therapy";
    var Phonebook = window.lang === "fa" ? "ایجاد دفترچه تلفن" : "Create Phonebook";
    var Timing = window.lang === "fa" ? "وقت دهی" : "Create Timing";
    var UploadTherapy = window.lang === "fa" ? "ثبت درمان" : "Create Therapy";
    var DoctorAppoinment = window.lang === "fa" ? "زمان حضور پزشک" : "visiting doctor";
    var FormUpload = window.lang === "fa" ? "آپلود" : "Create Upload";
    var QuickRegistration = window.lang === "fa" ? "ثبت سریع" : "Create Quick";
    var AdvancedSearch = window.lang === "fa" ? "جستجوی پیشرفته" : "Create Search";
    var SearchView = window.lang === "fa" ? "نمایش" : "Create Search";
    var SearchAdd = window.lang === "fa" ? "ذخیره جستجو" : "Create Quick";
    var Registrationcosts = window.lang === "fa" ? "ثبت هزینه ها" : "Create Cost";
    var WarehousesCoding = window.lang === "fa" ? "کدینگ کالا" : "Create Coding";
    var Check = window.lang === "fa" ? "کنترل چک" : "Create Check";
    var WarehouseLogIn = window.lang === "fa" ? "اقلام سند انبار" : "Create WarehouseLogIn";
    var CostIncoming = window.lang === "fa" ? "طرف های حساب" : "Create Incoming";
    var PatientAccount = window.lang === "fa" ? "حساب بیمار" : "Create PatientAccount";
    var CreateTask = window.lang === "fa" ? "ایجاد وظیفه" : "Create Task";
    var Response = window.lang === "fa" ? "پاسخ" : "Response";
    var Scoring = window.lang === "fa" ? "امتیاز دهی" : "Scoring";
    var Award = window.lang === "fa" ? "جوایز" : "Scoring";
    var Send = window.lang === "fa" ? "ارسال" : "Send";
    var SMS = window.lang === "fa" ? "پیام کوتاه" : "SMS";
    var Communication = window.lang === "fa" ? "مکاتبه" : "Communication";
    var WorkFlow = window.lang === "fa" ? "گردش کار" : "Work Flow";
    var end = window.lang === "fa" ? "اتمام" : "end";
    var resetPassword = window.lang === "fa" ? " تنظیم مجدد" : "Reset Password";
    var deleteMessage = window.lang === "fa" ? " آیا مایل به حذف این مورد هستید" : "Are you sure to delete this item?";
    var RegisterContinue = window.lang === "fa" ? " ثبت و ادامه" : "Register and Continue";
    var SMSDraft = window.lang === "fa" ? "قالب پیامک" : "SMS Draft";
    var Email = window.lang === "fa" ? "ایمیل" : "Email";
    var NoteBook = window.lang === "fa" ? "یادداشت" : "NoteBook";
    var Start = window.lang === "fa" ? "شروع" : "Start";

    minaDent.Common = {
        Email: Email,
        IsPlusNumberKey: isPlusNumberKey,
        codingTitle: codingTitle,
        AmountMaskE2: amountMaskE2,
        amountMaskE2ByValue: amountMaskE2ByValue,
        RemoveComa: removeComa,
        SetDataControl: setDataControl,
        AjaxLoader: ajaxLoader,
        yesBtnTxt: yesBtnTxt,
        noBtnTxt: noBtnTxt,
        DoctorAppoinment: DoctorAppoinment,
        exitBtnTxt: exitBtnTxt,
        addBtnTxt: addBtnTxt,
        cancelBtnTxt: cancelBtnTxt,
        Detail: Detail,
        Userdelete: Userdelete,
        CreateProfile: CreateProfile,
        UploadDoc: UploadDoc,
        Therapy: Therapy,
        Timing: Timing,
        UploadTherapy: UploadTherapy,
        FormUpload: FormUpload,
        FillSelectByAjaxShowLable: FillSelectByAjaxShowLable,
        FillSelectByAjax: FillSelectByAjax,
        QuickRegistration: QuickRegistration,
        AdvancedSearch: AdvancedSearch,
        SearchView: SearchView,
        SearchAdd: SearchAdd,
        EmptyChoosenSelect: EmptyChoosenSelect,
        UpdateChoosenSelect: UpdateChoosenSelect,
        Registrationcosts: Registrationcosts,
        WarehousesCoding: WarehousesCoding,
        Check: Check,
        WarehouseLogIn: WarehouseLogIn,
        CostIncoming: CostIncoming,
        AjaxInitialization: ajaxInitialization,
        PatientAccount: PatientAccount,
        CreateTask: CreateTask,
        Response: Response,
        Phonebook: Phonebook,
        DAmountMaskE: dAmountMaskE,
        Scoring: Scoring,
        Award: Award,
        Send: Send,
        SMS: SMS,
        Communication: Communication,
        WorkFlow: WorkFlow,
        end: end,
        ResetPassword: resetPassword,
        RegisterContinue: RegisterContinue,
        deleteMessage: deleteMessage,
        SMSDraft: SMSDraft,
        HideModalBox: hideModalBox,
        NoteBook: NoteBook,
        Start: Start,
        SaveBtnTxt: SaveBtnTxt,
        keyPressOnlyNumber: keyPressOnlyNumber
    };

})(MinaDent, jQuery);



var UserInterface;
(function (UserInterface) {
    var Notification = (function () {
        function Notification() {
            this.jq = function jq(id) {
                return id.replace(/(:|\[|\]|,)/g, "\\$1");
            };

            //z-index: 1000000; position: fixed;padding: 0px;
            //margin: 0 auto;width: 40%;left: 29%;
            //text-align: center;   color: rgb(0, 0, 0);
            //border: none;  background-color: rgb(255, 255, 255);
            //cursor: wait; height: 120px;


            this.showError = function (message, element) {
                var messageWidth = 40;
                var messageHeight = 120;
                var error = $('#error').clone();
                error.find('#modalContent').html(message);
                error.removeClass('hidden');
                if (element === undefined) {
                    $.blockUI({
                        css: {
                            width: messageWidth + "%",
                            height: "auto",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            //margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'background-color': '#fff',
                            'z-index': '100000',
                            color: '#787878'
                        },
                        overlayCSS: {
                            'z-index': '99999',
                            opacity: 0.7,
                            cursor: 'wait',
                            'background-color': 'rgba(158, 158, 158, 0.31)',
                        },
                        message: error
                    });
                    error.show();
                    error.find('#HideErrorModal').click(function () {
                        (new UserInterface.Notification()).hide();
                    });
                }
                else {
                    $(element).block({
                        css: {
                            width: messageWidth + "%",
                            height: "auto",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'background-color': '#d9534f',
                            color: '#dbdbdb'
                        },
                        overlayCSS: {
                            'z-index': '99999',
                            opacity: 0.7,
                            cursor: 'wait',
                            'background-color': 'rgba(158, 158, 158, 0.31)',
                        },
                        message: error
                    });
                    error.show();
                    error.find('#HideErrorModal').click(function () {
                        (new UserInterface.Notification()).hide(element);
                    });
                }
            };
            this.showSuccess = function (message, element) {
                var messageWidth = 40;
                var messageHeight = 120;
                var success = $('#success').clone();
                success.find('#modalContent').html(message);
                success.removeClass('hidden');
                if (element === undefined) {
                    $.blockUI({
                        css: {
                            width: messageWidth + "%",
                            height: "auto",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'background-color': '#009688',
                            'z-index': '100000',
                            color: '#dbdbdb'
                        },
                        overlayCSS: {
                            'z-index': '99999',
                            opacity: 0.7,
                            cursor: 'wait'
                        },
                        message: success
                    });
                    success.show();
                    success.find('#HideSuccessModal').click(function () {
                        (new UserInterface.Notification()).hide();
                    });
                }
                else {
                    $(element).block({
                        css: {
                            width: messageWidth + "%",
                            height: "auto",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'background-color': '#009688',
                            'z-index': '100000',
                            color: '#dbdbdb'
                        },
                        overlayCSS: {
                            'z-index': '99999',
                            opacity: 0.7,
                            cursor: 'wait'
                        },
                        message: success
                    });
                    success.show();
                    success.find('#HideSuccessModal').click(function () {
                        (new UserInterface.Notification()).hide(element);
                    });
                }
            };
            this.showWaiting = function (element) {
                var messageWidth = 40;
                var messageHeight = 120;
                var wait = $('#wait').clone();
                if (element === undefined) {
                    $.blockUI({
                        css: {
                            width: messageWidth + "%",
                            height: messageHeight + "px",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'opacity': '0'
                        },
                        overlayCSS: {
                            'z-index': '99999',
                            opacity: 0.7,
                            cursor: 'wait',
                            'background-color': 'rgba(158, 158, 158, 0.31)',
                        },
                        message: wait
                    });
                    wait.show();
                    $('.blockMsg').css('opacity', '1');
                    setTimeout(function () {
                        $('.blockPage').prev().css('z-index', '999999');
                        $('.blockPage').css('z-index', '1000000');
                    }, 100);
                }
                else {
                    $(element).block({
                        css: {
                            width: messageWidth + "%",
                            height: messageHeight + "px",
                            top: '50%',
                            left: '29%',
                            border: 'none',
                            margin: (-messageHeight / 2) + 'px 0 0 ' + 0 + 'px',
                            'opacity': '0'
                        },
                        message: wait
                    });
                    $('.blockMsg').css('opacity', '1');
                    wait.show();
                }
            };
            this.hide = function (element) {
                if (element === undefined) {
                    $('.blockMsg ').removeClass('zoomIn').addClass('zoomOut');
                    setTimeout(function () { $.unblockUI(); }, 100);
                }
                else {
                    $(element).find('.blockMsg ').removeClass('zoomIn').addClass('zoomOut');
                    setTimeout(function () { $(element).unblock(); }, 100);
                }
            };
            this.showNotification = function (userTitle, userMessage, type) {
                var notify = $("#notification");
                if (typeof notify.data("kendoNotification") === "undefined") {
                    notify.kendoNotification({
                        templates: [
                            {
                                // define a custom template for the built-in "warning" notification type
                                type: "success",
                                template: '<div class="framework-notofication" ><i class="fa fa-3x fa-thumbs-up"></i> <span class="k-icon k-i-close noty-close">Hide </span><h3>#= title #</h3> <p>#= message #</p> </div >'
                            },
                            {
                                // define a custom template for the built-in "warning" notification type
                                type: "error",
                                template: '<div class="framework-notofication" ><i class="fa fa-3x fa-thumbs-down"></i> <span class="k-icon k-i-close noty-close">Hide </span><h3>#= title #</h3> <p>#= message #</p> </div >'
                            },
                            {
                                // define a custom template for the built-in "warning" notification type
                                type: "info",
                                template: '<div class="framework-notofication" ><i class="fa fa-3x fa-info-circle"></i> <span class="k-icon k-i-close noty-close">Hide </span><h3>#= title #</h3> <p>#= message #</p> </div >'
                            },
                            {
                                // define a custom template for the built-in "warning" notification type
                                type: "warning",
                                template: '<div class="framework-notofication" ><i class="fa fa-3x fa-warning"></i> <span class="k-icon k-i-close noty-close">Hide </span><h3>#= title #</h3> <p>#= message #</p> </div >'
                            }
                        ],
                        autoHideAfter: 0,
                        allowHideAfter: 1000,
                        button: true,
                        hideOnClick: false,
                        position: {
                            pinned: true,
                            top: 20,
                            left: null,
                            bottom: null,
                            right: 20,
                            index: 0
                        },
                        stacking: "down",
                        show: function (e) {
                            //var elements = notify.data("kendoNotification").getNotifications();
                            //elements.each(function () {
                            //    var thisPosition = $(this).parent().position();
                            //    thisPositionTop = thisPosition.top - (e.element[0].clientHeight + 10);
                            //    $(this).parent().css('top', thisPositionTop + 'px');
                            //});
                        }
                    });
                }
                $(document).one("kendo:pageUnload", function () {
                    if (notify.data('kendoNotification')) {
                        notify.data('kendoNotification').hide();
                    }
                });
                notify.data('kendoNotification').show({
                    title: userTitle,
                    message: userMessage
                }, type);
            };
        }
        return Notification;
    })();
    UserInterface.Notification = Notification;
})(UserInterface || (UserInterface = {}));