/// <reference path="jquery-1.4.4.min.js" />
function ManagePaymentGateway() {
    var self = this;
    var serviceUrl = '/WebServices/PaymentService_.asmx/';

    var resources = {
        fa: {
            row: 'ردیف',
            logo: 'لوگوی درگاه',
            title: 'نام درگاه',
            website: 'وبسایت',
            properties: 'پارامترها',
            status: 'پیش‌فرض',
            mode: 'نوع درگاه',
            modeFree: 'واسط',
            modeDirect: 'مستقیم',
            setting: 'تنظیم درگاه',
            notSet: 'تنظیم نشده',
            isSet: 'تنظیم شده',
            ok: 'تایید',
            cancel: 'انصراف',
            helpApi: 'راهنمای دریافت تنظیمات',
            transactionInfo: 'اطلاعات تراکنش',
            trnsDate: 'تاریخ تراکنش',
            trnsStatus: 'وضعیت',
            trnsComment: 'توضیحات',
            trnsAmount: 'مبلغ',
            trnsGateway: 'درگاه',
            trnsRefId: 'كد مرجع تراكنش',
            trnsId: 'کد رهگیری',
            trnsSuccess: 'موفق',
            trnsFail: 'ناموفق',
            orderId: 'شناسه&zwnj;ی خرید',
            noAccess: 'دسترسی مجاز نمی&zwnj;باشد'
        },
        en: {
            row: 'Row',
            logo: 'Gateway logo',
            title: 'Gateway name',
            website: 'Website',
            properties: 'Parameters',
            status: 'Default',
            mode: 'Type',
            modeFree: 'Mirror',
            modeDirect: 'Direct',
            setting: 'Setting',
            notSet: 'Not set',
            isSet: 'Is set',
            ok: 'Ok',
            cancel: 'Cancel',
            helpApi: 'Getting Settings Help',
            transactionInfo: 'Transaction Info',
            trnsDate: 'Date',
            trnsStatus: 'Status',
            trnsComment: 'Description',
            trnsAmount: 'Amount',
            trnsGateway: 'Gateway',
            trnsRefId: 'Refrence Id',
            trnsId: 'Transaction Id',
            trnsSuccess: 'Success',
            trnsFail: 'Fail',
            orderId: 'Order id',
            noAccess: 'No access'
        }
    }

    //Methods
    self.createPaymentGatewayGrid = createPaymentGatewayGrid;
    self.showPaymentTransaction = showPaymentTransaction;


    var postExtra = function (url, data, callback) {
        var e = { token: [$('#HFdomain').val(), $('#HFUserCode').val(), $('#HFcodeDU').val()], data: data };
        $.ajax({
            type: "POST", url: url,
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                if (callback) callback(c.d[0] == 'success', c.d[1]);
            },
            error: function (c) {
                if (callback) callback(false, '');
            }
        });
    }

    var spiltWithComma = function (text) {
        if (text != undefined && text != null) {
            text = text.toString();
            var scale = '';
            if (text.indexOf(".") != -1) {
                scale = text.substr(text.indexOf("."), text.length);
                text = text.substr(0, text.indexOf("."));
            }
            text = text.replace(/,/gi, '');
            var result = text.substr(0, text.length % 3);
            text = text.substr(text.length % 3, text.length);
            for (i = 0; i < text.length; i = i + 3) result += ',' + text.substr(i, 3);
            if (result.charAt(0) == ",") result = result.substr(1, result.length);
            return result + scale;
        } else {
            return '';
        }
    }

    var convertDate = function (date, lang, addedMinuts) {
        if (addedMinuts == null) addedMinuts = parseInt($('#HFTimeZone').val()) || 0;
        if ((lang == null && $('#HFlang').val() == 'fa') || lang == 'fa') {
            moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });
        } else {
            moment.locale('en');
        }
        var mDate = moment(date, 'MM/DD/YYYY HH:mm').add(addedMinuts, 'm');
        //if (mDate.isDST()) mDate.add(60, 'm');
        return mDate;
    }

    var numberLocalize = function (text, lang) {
        if (lang == null) lang = $('#HFlang').val();
        if (lang == null || lang == "en") return text;
        var str = text.toString();
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        for (var i = 0; i <= 9; i++) str = str.replace(new RegExp(i, "g"), persian[i]);
        return str;
    }

    function createPaymentGatewayGrid() {
        var res = resources[$('#HFlang').val()];
        var container = $('<div>').addClass('scrollBehavior');

        container.append($('<div>').addClass('spinner'));
        postExtra(serviceUrl + 'getGateways_', { lang: $('#HFlang').val() }, function (isSuccess, data) {
            if (isSuccess) {
                createGatewayGrid(data);
            } else {
                container.empty().append($('<div>').css({ 'text-align': 'center', 'font-size': '18px', 'margin': '0 0 40px' }).append(res.noAccess));
            }
        });

        function createGatewayGrid(data) {
            var tbl = $('<table>').css('width', '100%');

            $('<tr>').append(
                (RaveshUI.isMobile ? '' : $('<td>').css({ width: 60, textAlign: 'center' }).text(res.row)),
                $('<td>').css({ width: RaveshUI.isMobile ? 120 : 200 }).text(res.logo),
                $('<td>').css({ width: 'auto' }).text(res.title),
                (RaveshUI.isMobile ? '' : $('<td>').css({ width: 150 }).text(res.mode)),
                (RaveshUI.isMobile ? '' : $('<td>').css({ width: 'auto' }).text(res.website)),
                $('<td>').css({ textAlign: 'center' }).text(res.properties),
                $('<td>').css({ textAlign: 'center' }).text(res.status)
            ).css({ background: '#f8f8ff', 'line-height': '40px' }).appendTo(tbl);

            var activeType = '';
            $.each(data, function (g, gatewayData) {

                gatewayData.btnProperty = $('<input>').attr({ type: 'submit' }).addClass('ravesh-button').css('min-width', 75);
                gatewayData.btnActive = $('<i>').css({ 'font-size': 20 });

                setBtnPropertyStyle();
                if (gatewayData.isActive) activeType = gatewayData.type;

                $('<tr>').css({ height: 70 }).append(
                    (RaveshUI.isMobile ? '' : $('<td>').css({ textAlign: 'center' }).text(g + 1)),
                    $('<td>').append($('<a>').addClass('ravesh-link').attr({ 'href': gatewayData.website, target: '_blank' }).append($('<img>').attr('src', gatewayData.logo).css({ maxWidth: 120, display: 'inline' }))),
                    $('<td>').text(gatewayData.title),
                    (RaveshUI.isMobile ? '' : $('<td>').text(gatewayData.isFree ? res.modeFree : res.modeDirect)),
                    (RaveshUI.isMobile ? '' : $('<td>').css({ direction: 'ltr' }).append($('<a>').addClass('ravesh-link').attr({ 'href': gatewayData.website, target: '_blank' }).text(gatewayData.website))),
                    $('<td>').css({ textAlign: 'center' }).append(gatewayData.btnProperty),
                    $('<td>').css({ textAlign: 'center' }).append(gatewayData.btnActive)
                ).appendTo(tbl);


                gatewayData.btnProperty.click(function () {
                    var dialogContainer = $('<div>').css({ overflow: 'hidden', padding: '0 15px' });
                    var dialog = RaveshUI.showDialog({ title: res.setting, detail: gatewayData.title, width: 400 });
                    var btnOk = dialog.addFooterButton(res.ok, 'submit float', okSetting);
                    dialog.addFooterButton(res.cancel, 'float');
                    dialog.setContent(dialogContainer);

                    $.each(gatewayData.property, function (p, property) {
                        property.input = $('<input>').attr({ 'type': 'text', 'value': property.value }).css({ 'width': '100%' }).addClass('ravesh-input');
                        dialogContainer.append($('<div>').addClass('ravesh-input-cover').append($('<span>').addClass('ravesh-label').text(property.title), property.input));
                    });

                    if (gatewayData.helpUrl != '') dialogContainer.append($('<a>').addClass('ravesh-link').attr({ 'href': gatewayData.helpUrl, target: '_blank' }).text(res.helpApi));

                    function okSetting() {
                        var properties = [];
                        $.each(gatewayData.property, function (p, property) {
                            property.value = property.input.val().trim();
                            properties.push({ key: property.key, value: property.value });
                        });
                        postExtra(serviceUrl + 'setGatewayProperty_', { properties: properties, type: gatewayData.type });
                        dialog.close();
                        setBtnPropertyStyle();
                    }

                    return false;
                });

                gatewayData.btnActive.click(function () {
                    if (gatewayData.isActive) return false;
                    setBtnActiveStyle(gatewayData.type);
                    postExtra(serviceUrl + 'setActiveGateway_', { type: gatewayData.type });
                });

                function setBtnPropertyStyle() {
                    var hasSetting = $.grep(gatewayData.property, function (s) { return s.value == '' });
                    if (hasSetting.length > 0) {
                        gatewayData.btnProperty.val(res.notSet).addClass('red').removeClass('save');
                    } else {
                        gatewayData.btnProperty.val(res.isSet).addClass('save').removeClass('red');
                    }
                }

            });

            function setBtnActiveStyle(type) {
                $.each(data, function (g, gatewayData) {
                    if (gatewayData.type == type) {
                        gatewayData.isActive = true;
                        gatewayData.btnActive.removeClass('icon-circle').addClass('icon-check-circle').css({ color: '#4CAF50', cursor: 'default' });
                    } else {
                        gatewayData.isActive = false;
                        gatewayData.btnActive.removeClass('icon-check-circle').addClass('icon-circle').css({ color: '#777777', cursor: 'pointer' });
                    }
                });
            }
            setBtnActiveStyle(activeType);


            tbl.find('td').css({ 'vertical-align': 'middle' });
            container.empty().append(tbl);
        }

        return container;
    }

    function showPaymentTransaction(mode, linkedId) {
        var res = resources[$('#HFlang').val()];
        var dialogContainer = $('<div>').css({ overflow: 'hidden', padding: '0 15px 15px' });
        var dialog = RaveshUI.showDialog({ title: res.transactionInfo, width: 600 });
        dialog.setContent(dialogContainer);

        var createTr = function (title, value) {
            return $('<tr>').append($('<td>').css({ width: 200, padding: '0 10px' }).append(title), $('<td>').append(value)).css({ 'line-height': '40px' });
        }

        dialog.showLoading();
        postExtra(serviceUrl + 'getPaymentByLinkedId_', { mode: mode, linkedId: linkedId }, function (isSuccess, data) {
            dialog.hideLoading();
            if (isSuccess) {
                var tbl = $('<table>').css({ width: '100%' }).appendTo(dialogContainer);
                $.each(data, function (t, trns) {
                    tbl.append(
                        createTr(res.trnsDate, convertDate(trns.date + ' ' + trns.time).format('LLL')).css({ 'background': '#f1f1f1' }),
                        createTr(res.trnsStatus, trns.status == 0 ? $('<span>').css('color', 'green').text(res.trnsSuccess) : $('<span>').css('color', 'red').text(res.trnsFail)),
                        createTr(res.trnsComment, trns.errorMessage.replace(/\\n/g, '<br>')),
                        createTr(res.trnsAmount, numberLocalize(spiltWithComma(trns.amount))),
                        createTr(res.trnsGateway, trns.gateway),
                        createTr(res.trnsRefId, trns.refId),
                        createTr(res.trnsId, trns.trnsId),
                        createTr(res.orderId, numberLocalize(trns.random))
                    );
                });
            }
        });
    }
}
var mngPaymentGateway = new ManagePaymentGateway();
