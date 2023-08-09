

$(document).ready(function () {


    //$('.btnQuick-phone').click(function () {
    $('#CallerIdLog').click(function () {

        $('.btnQuick-phone span').text(0).hide();
        $('.IvrNumLcd').val('').removeClass('error');

        if ($('.boxIvrUtility').length == 0) {


            //var boxivr = $('<div class="boxIvrUtility boxIvrUtility-' + resources.direction + '"></div>');
            var boxivr = $('<div class="dropdown-menu dropdown-menu-lg dropdown-menu-left" style="max-height:350px;"></div>');

            //boxivr.append('<div class="Qdivuserline">' +
            //    '</div>');
            /*------------------------------------------------------*/
            var Ivrcontent = $('<div class="QdivIvrcontent"></div>');

            Ivrcontent.append('<div class="QItemsContent QItemsContent_1">' +
                '<div class="QtabCallerId">' +
                //'<div value="1" class="ItemTabcallerid th-color selected" style="width: 49%;"><i class="icon-edge-d"></i></div>' +
                '<div value="1" class="ItemTabcallerid th-color selected" ></div>' +
                //'<div value="2" class="ItemTabcallerid th-color" style="width: 49%;"><i class="icon-edge-u"></i></div>' +
                '</div>' +
                '<div mode="0" class="QitemsCallerId QCallerId_1"></div>' +
                '<div mode="1" class="QitemsCallerId QCallerId_2" style="display:none"></div>' +
                '</div>');
            //------------                     
            Ivrcontent.append('<div class="QItemsContent QItemsContent_2" style="display:none">' +
                '<div class="QtabCallerId">' +
                '<div value="1" class="ItemTabcallerid th-color selected" style="width: 32%;"><i class="icon-star"></i></div>' +
                '<div value="2" class="ItemTabcallerid th-color" style="width: 33%;"><i class="icon-time"></i></div>' +
                '<div value="3" class="ItemTabcallerid th-color" style="width: 32%;"><i class="icon-search"></i></div>' +
                '</div>' +
                '<div class="QitemsCallerId QCallerId_1"></div>' +
                '<div class="QitemsCallerId QCallerId_2" style="display:none"></div>' +
                '<div class="QitemsCallerId QCallerId_3" style="display:none"></div>' +
                '</div>');
            //------------
            Ivrcontent.append('<div class="QItemsContent QItemsContent_3" style="display:none">' +
                '<input class="IvrNumLcd" type="text" maxlength="15">' +
                '<div class="IvrNumBackspace"><span></span></div>' +
                '<div class="IvrNumPlc th-color">' +
                '<div char="1" class="IvrNumItem"><div class="th-bgcolor-hover"><b>1</b><span></span></div></div>' +
                '<div char="2" class="IvrNumItem" style="width:34%"><div class="th-bgcolor-hover"><b>2</b><span>ABC</span></div></div>' +
                '<div char="3" class="IvrNumItem"><div class="th-bgcolor-hover"><b>3</b><span>DEF</span></div></div>' +
                '<div char="4" class="IvrNumItem"><div class="th-bgcolor-hover"><b>4</b><span>GHI</span></div></div>' +
                '<div char="5" class="IvrNumItem" style="width:34%"><div class="th-bgcolor-hover"><b>5</b><span>JKL</span></div></div>' +
                '<div char="6" class="IvrNumItem"><div class="th-bgcolor-hover"><b>6</b><span>MNO</span></div></div>' +
                '<div char="7" class="IvrNumItem"><div class="th-bgcolor-hover"><b>7</b><span>PQR</span></div></div>' +
                '<div char="8" class="IvrNumItem" style="width:34%"><div class="th-bgcolor-hover"><b>8</b><span>STU</span></div></div>' +
                '<div char="9" class="IvrNumItem"><div class="th-bgcolor-hover"><b>9</b><span>VWXZ</span></div></div>' +
                '<div char="*" class="IvrNumItem"><div class="th-bgcolor-hover"><b>*</b></div></div>' +
                '<div char="0" class="IvrNumItem" style="width:34%;"><div class="th-bgcolor-hover"><b>0</b></div></div>' +
                '<div char="#" class="IvrNumItem"><div class="th-bgcolor-hover"><b>#</b></div></div>' +
                '</div>' +
                '<div class="IvrNumbtnPlc">' +
                '<div class="IvrNumBtnCall">Call</div>' +
                '</div>' +
                '</div>');

            boxivr.append(Ivrcontent);

            /*------------------------------------------------------*/
            //boxivr.append('<div class="QdivIvrButton">' +
            //    '<div value="2" class="ItemIvrButton BtnIvrCustList"><i class="icon-user-circle th-color"></i></span></div>' +
            //    '<div value="1" class="ItemIvrButton select" style="width: 34%;"><i class="icon-updown th-color"></i></div>' +
            //    '<div value="3" class="ItemIvrButton"><i class="icon-th-larg th-color"></i></div>' +
            //    '</div>');

            boxivr.find('.Qdivuserline,.QdivIvrcontent,.QdivIvrButton').hide();

            var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
            e.o.clientId = clientId;
            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                //url: "../pages/IVR_WebService.asmx/getIvrUserInfo_",
                url: "/Caller/GetCallerLog",
                //data: JSON.stringify(e),
                data: { count: 10, skip: 0, mode: '' },
                dataType: "json",
                success: function (c) {
                    //if (c.d[0] != "error") {
                    if (c) {
                        boxivr.find('.Qdivuserline,.QdivIvrcontent,.QdivIvrButton').show();
                        //$('.IvrNumBtnCall').text(c.d[2]);
                        //$.each(c.d[1].lineInfo, function (i, item) {
                        //    boxivr.find('.Qdivuserline').css('min-height', Math.ceil(c.d[1].lineInfo.length / 2) * 34);
                        //    var lineItem = $('<div class="itemuserline' + ((item.stateCall) ? ' th-bgcolor' : '') + '" item="' + item.ext + '">' +
                        //        '<i class="icon-phone btnSetTelCaller" style="margin:6px 4px;float: right;font-size: 14pt;" stateCall="' + item.stateCall + '"></i>' +
                        //        '<span class="ivrstatusOption">' +
                        //        '<span class="ivr-icon-status ico-' + item.state + '" style="display: inline-block;margin: 0 1px;"></span>' +
                        //        '<span class="ui-icon ui-icon-triangle-1-s" style="display: inline-block;height: 13px;margin: 1px -2px 0 -2px;vertical-align: bottom;"></span>' +
                        //        '</span>' +
                        //        '<div class="popupIvrStatus" style="display:none"><div><span class="ivr-icon-status ico-1"></span><a item="1">On</a></div><div><span class="ivr-icon-status ico-2"></span><a item="2">Pause</a></div><div><span class="ivr-icon-status ico-0"></span><a item="0">Off</a></div></div>' +
                        //        '<span class="ivrextnumber">' + item.ext + '</span>' +
                        //        '</div>').data('data', item);
                        //    if (c.d[1].lineInfo.length == 1 || item.ivrSystem == 2) lineItem.addClass("oneLine") //lineItem.css({ 'width': '99%' });
                        //    boxivr.find('.Qdivuserline').append(lineItem.hide());
                        //    lineItem.animateCSS('zoomIn', { delay: 200 * (i + 1), speed: 500 });
                        //});
                        //'-----------
                        //$.each(c.d[1].callIn, function (i, item) {
                        $.each(c, function (i, item) {
                            item.tel = item.from;
                            var itemCall = generateCallInfo(item);
                            boxivr.find('.QItemsContent_1 .QCallerId_1').append(itemCall);
                            //if (!item.viewed) itemCall.animate({ 'background-color': '#bbb' }, 400, function () { itemCall.delay(2000).animate({ 'background-color': '#dedede' }, 800); });
                            //if (!item.viewed) itemCall.animate({ 'background-color': '#bbb' }, 400, function () { itemCall.delay(2000).animate({ 'background-color': '#dedede' }, 800); });
                        });
                        //$.each(c.d[1].callOut, function (i, item) {
                        //    item.tel = item.to;
                        //    boxivr.find('.QItemsContent_1 .QCallerId_2').append(generateCallInfo(item));
                        //});
                        //if (jQuery.grep(c.d[1].lineInfo, function (a) { return a.state == 1; }).length == 0) {
                        //    $(".header-button-group-new .btnQuick-phone i").removeClass("icon-phone").addClass("icon-phone-miss");
                        //} else {
                        //    $(".header-button-group-new .btnQuick-phone i").addClass("icon-phone").removeClass("icon-phone-miss");
                        //}
                    }
                }
            });

            $(this).after(boxivr.hide().fadeIn());
            boxivr.css({ 'left': ((resources.direction == 'rtl') ? $(this).offset().left - 5 : $(this).offset().left - boxivr.width() + 35) });

            $('.QItemsContent_1 .QitemsCallerId').each(function () { //ajax scroll show calls
                var thisCon = $(this);
                thisCon.perfectScrollbar({
                    wheelSpeed: 20,
                    wheelPropagation: true,
                    minScrollbarLength: 20
                });
                thisCon.data('processing', false);
                thisCon.find('.ps-scrollbar-x-rail').remove();
                thisCon.bind("scroll", function (a, b) {
                    if (thisCon.data('processing') == 'true' || thisCon.data('processing') == 'complete')
                        return false;

                    if (thisCon.scrollTop() >= thisCon[0].scrollHeight - thisCon.height() - 50) {
                        thisCon.data('processing', 'true');
                        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                        e.o.count = 10;
                        e.o.skip = thisCon.find('.ItemCallerid').length;
                        e.o.mode = thisCon.attr('mode');
                        $.ajax({
                            type: "GET",
                            //url: "../pages/IVR_WebService.asmx/getCallInfoRange_",
                            url: "/Caller/GetCallerLog",
                            //data: JSON.stringify(e),
                            data: { count: 10, skip: thisCon.find('.ItemCallerid').length, mode: thisCon.attr('mode') },
                            contentType: "application/json; charset=utf-8", dataType: "json",
                            success: function (c) {
                                thisCon.data('processing', 'false');
                                //if (c.d[0] != "error") {
                                if (c) {
                                    //if (c.d[1].length == 0) thisCon.data('processing', 'complete');
                                    if (c.length == 0) thisCon.data('processing', 'complete');
                                    $.each(c, function (i, item) {
                                        item.tel = (item.mode == 0) ? item.from : item.to;
                                        thisCon.append(generateCallInfo(item));
                                    });
                                    thisCon.perfectScrollbar('update');
                                }
                            }
                        });
                    }
                });
            });


        } else {
            if ($('.boxIvrUtility').css('display') != 'none') {
                $('.boxIvrUtility').fadeOut();
            } else {
                $('.boxIvrUtility').fadeIn();
                var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
                e.o.clientId = clientId;
                //$.ajax({
                //    type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/IVR_WebService.asmx/setViewdedCall_",
                //    data: JSON.stringify(e), dataType: "json", success: function (c) { }
                //});
            }
        }
    });

    $('.IvrNumLcd').live('keydown', function (evt) {

        // Allow: backspace, delete, tab, escape, and enter
        if (evt.keyCode == 46 || evt.keyCode == 8 || evt.keyCode == 9 || evt.keyCode == 27 || evt.keyCode == 13 ||
            // Allow: dash (-)
            (evt.keyCode == 109 || evt.keyCode == 189) ||
            // Allow: paranteses ()
            ((evt.keyCode == 48 || evt.keyCode == 57) && evt.shiftKey === true) ||
            // Allow: Space
            (evt.keyCode == 32) ||
            // Allow: Ctrl+A
            (evt.keyCode == 65 && evt.ctrlKey === true) ||
            // Allow: F1 - F12
            (evt.keyCode >= 112 && evt.keyCode <= 123) ||
            // Allow: home, end, left, right
            (evt.keyCode >= 35 && evt.keyCode <= 39)) {
            if (evt.keyCode == 13) {
                if (enterOperation != undefined && typeof enterOperation == "function") {
                    enterOperation();
                }
            }
            // let it happen, don't do anything
            return;
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57) && (evt.keyCode < 96 || evt.keyCode > 105)) {
                evt.preventDefault();
                $('.IvrNumLcd').addClass('error');
            }
        }

        if ($('.IvrNumLcd').val().length >= $('.IvrNumLcd').attr('maxlength')) return false;
        var num = String.fromCharCode((96 <= evt.keyCode && evt.keyCode <= 105) ? evt.keyCode - 48 : evt.keyCode);
        $('.IvrNumItem:[char=' + num + ']').addClass('active');
    });
    $('.IvrNumLcd').live('keyup', function (e) {
        var charCode = (e.which) ? e.which : e.keyCode;
        var num = String.fromCharCode((96 <= charCode && charCode <= 105) ? charCode - 48 : charCode);
        $('.IvrNumItem:[char=' + num.toString() + ']').removeClass('active');
        $('.IvrNumLcd').removeClass('error');
    });
    $('.IvrNumItem').live('click', function () {
        if ($('.IvrNumLcd').val().length >= $('.IvrNumLcd').attr('maxlength')) return false;
        $('.IvrNumLcd').val($('.IvrNumLcd').val() + $(this).attr('char'));
        $('.IvrNumLcd').focus();
    });
    $('.IvrNumBackspace').live('click', function () {
        $('.IvrNumLcd').val($('.IvrNumLcd').val().substring(0, $('.IvrNumLcd').val().length - 1)).focus();
    });
    $('.IvrNumBtnCall').live('click', function () {
        $('.IvrNumLcd').focus();
        var tel = $('.IvrNumLcd').val();
        if (tel == "") {
            $('.IvrNumLcd').addClass('error');
            return false;
        } else {
            $('.IvrNumLcd').removeClass('error');
        }
        StartCallOut(tel, '', '', 0);

        var thisBtn = $(this);
        thisBtn.attr('disabled', 'disabled');
        setTimeout(function () {
            thisBtn.attr('disabled', '');
            $('.boxIvrUtility').fadeOut();
        }, 500);

        return false;
    });
    $('.ItemTabcallerid').live('click', function () {
        var parent = $(this).parents('.QItemsContent');
        parent.find('.ItemTabcallerid.selected').removeClass('selected');
        $(this).addClass('selected');
        parent.find('.QitemsCallerId').hide();
        parent.find('.QCallerId_' + $(this).attr('value')).show();
    });
    $('.ItemIvrButton').live('click', function () {
        $('.ItemIvrButton.select').removeClass('select');
        $(this).addClass('select');
        $('.QItemsContent').hide();
        $('.QItemsContent_' + $(this).attr('value')).show();
        if ($(this).attr('value') == "3") { $('.IvrNumLcd').focus(); }
    });
    $('.btnSetTelCaller').live('click', function () {
        var state = false;
        if ($(this).attr('stateCall').toLowerCase() == "true") {
            $(this).attr('stateCall', 'false');
            $(this).parents('.itemuserline').removeClass('th-bgcolor');
        } else {
            state = true;
            $('.itemuserline').removeClass('th-bgcolor');
            $('.btnSetTelCaller').attr('stateCall', 'false');
            $(this).attr('stateCall', 'true');
            $(this).parents('.itemuserline').addClass('th-bgcolor');
        }
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.state = state;
        e.o.did = $(this).parents('.itemuserline').data('data').did;
        e.o.id = $(this).parents('.itemuserline').data('data').id;
        e.o.serverid = $(this).parents('.itemuserline').data('data').serverid;
        e.o.ext = $(this).parents('.itemuserline').attr('item');
        e.o.clientId = clientId;
        //$.ajax({
        //    type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/IVR_WebService.asmx/setStateCall_",
        //    data: JSON.stringify(e), dataType: "json", success: function (c) { }
        //});
    });
    $('.ivrstatusOption').live('click', function () {
        var thisItem = $(this).parents('.itemuserline');
        if (thisItem.find('.popupIvrStatus').css('display') != 'none') {
            $('.popupIvrStatus').hide();
        } else {
            $('.popupIvrStatus').hide();
            thisItem.find('.popupIvrStatus').css({ 'left': $(this).offset().left - $('.boxIvrUtility').offset().left, 'top': $(this).offset().top - $('.boxIvrUtility').offset().top + 17 }).show();
        }
    });
    $('.popupIvrStatus a').live('click', function () {
        var thisbtn = $(this);
        var status = thisbtn.attr('item');
        var data = thisbtn.parents('.itemuserline').data('data')
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), o: {} };
        e.o.state = status;
        e.o.id = data.id;
        e.o.did = data.did;
        e.o.serverid = data.serverid;
        e.o.lineType = data.lineType;
        e.o.ext = thisbtn.parents('.itemuserline').attr('item');
        e.o.clientId = clientId;
        //$.ajax({
        //    type: "POST", contentType: "application/json; charset=utf-8", url: "../pages/IVR_WebService.asmx/setStateLine_",
        //    data: JSON.stringify(e), dataType: "json", success: function (c) {
        //        if (c.d[0] == 'success') {
        //            thisbtn.parents('.itemuserline').find('.ivrstatusOption .ivr-icon-status').removeAttr('class').addClass('ivr-icon-status ico-' + status);
        //            if ($(".boxIvrUtility .itemuserline .ivrstatusOption .ivr-icon-status.ico-1").length == 0) {
        //                $(".header-button-group-new .btnQuick-phone i").removeClass("icon-phone").addClass("icon-phone-miss");
        //            } else {
        //                $(".header-button-group-new .btnQuick-phone i").addClass("icon-phone").removeClass("icon-phone-miss");
        //            }
        //        }
        //        showMessageIvrBox(c.d[1]);
        //    }
        //});
    });
    $(document).bind('click', function (e) {
        if (!$(e.target).hasClass('ivrstatusOption') && $(e.target).parents('.ivrstatusOption').length == 0) { $('.popupIvrStatus').hide(); }
        if (!$(e.target).hasClass('ivrstatusOptionDashboard') && $(e.target).parents('.ivrstatusOptionDashboard').length == 0) { $('.popupIvrStatusDashboard').hide(); }
        if (!$(e.target).hasClass('boxIvrUtility') && $(e.target).parents('.boxIvrUtility').length == 0 &&
            !$(e.target).hasClass('btnQuick-phone') && $(e.target).parents('.btnQuick-phone').length == 0) { $('.boxIvrUtility').fadeOut(); }
    });
});





$(function () {

    $('#BtnCreateCustQuickIvr').live('click', function () {
        var BtnData = $(this).data('data');
        var data = { tel: BtnData.tel, mode: BtnData.mode, user: BtnData.user, savelog: true };
        customer_create_quick(BtnData.name, 'Inserted_customer_callerid', 'tel=' + data.tel);
        $('#UCdialog_customer_create_quick').data('ivr', data);
        return false;
    });
    $('.callerid .BtnShowListFormCallerId').live('click', function () {

        new RaveshFormUtility.FormGridMini("", {
            custCode: $(this).attr('cust_code'),
            custName: $(this).attr('cust_name'),
            showDialog: true
        });
        // registerForm(0, $(this).attr('cust_code'), '', 'insert', '');
        return false;
    });


    //---------------------------
    $('.btnFavorites').live('click', function () {
        var active = !$(this).hasClass('active');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.active = active;
        e.o.cust_code = $(this).parents('.ItemCallerid').attr('cust_code');
        e.o.detail = $(this).parents('.ItemCallerid').attr('tel');
        if (active) {
            $('.ItemCallerid:[cust_code=' + e.o.cust_code + '] .btnFavorites').addClass('active');
            var cloneItemCall = $(this).parents('.ItemCallerid').clone();
            cloneItemCall.find('.itemcalleriddate').remove();
            $('.QItemsContent_2 .QCallerId_1 .ItemCallerid:[cust_code=' + e.o.cust_code + ']').remove();
            $('.QItemsContent_2 .QCallerId_1').prepend(cloneItemCall);
        }
        else {
            $('.ItemCallerid:[cust_code=' + e.o.cust_code + '] .btnFavorites').removeClass('active');
        }
        //$.ajax({
        //    type: "POST", url: "../pages/IVR_WebService.asmx/setFavoritesCust_",
        //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
        //    success: function (c) { }
        //});
    });
    $('.BtnIvrCustList').live('click', function () {
        if (!$(this).attr('loaded')) {
            $(this).attr('loaded', true);

            var conFav = $('.QItemsContent_2 .QCallerId_1'); /*favorites cust list*/
            conFav.perfectScrollbar({ wheelSpeed: 20, wheelPropagation: true, minScrollbarLength: 20 });
            conFav.data('processing', false);
            conFav.find('.ps-scrollbar-x-rail').remove();
            var loadFav = function (take, skip) {
                conFav.data('processing', 'true');
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.take = 10;
                e.o.skip = conFav.find('.ItemCallerid').length;
                //$.ajax({
                //    type: "POST", url: "../pages/IVR_WebService.asmx/getFavoritesCust_",
                //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                //    success: function (c) {
                //        conFav.data('processing', 'false');
                //        if (c.d[0] != "error") {
                //            if (c.d[1].length == 0) conFav.data('processing', 'complete');
                //            $.each(c.d[1], function (i, item) {
                //                conFav.append(generateCallInfo({ tranno: '', cust_name: item.name, cust_code: item.code, cust_picture: item.picture, tel: item.detail, date2: '', viewed: true, favorites: item.favorites, mode: item.mode }));
                //            });
                //            conFav.perfectScrollbar('update');
                //        }
                //    }
                //});
            }
            loadFav(10, 0);
            conFav.bind("scroll", function (a, b) { /*box scroll*/
                if (conFav.data('processing') == 'true' || conFav.data('processing') == 'complete') return false;
                if (conFav.scrollTop() >= conFav[0].scrollHeight - conFav.height() - 50) {
                    loadFav(10, conFav.find('.ItemCallerid').length);
                }
            });
            //------------------------
            var conRece = $('.QItemsContent_2 .QCallerId_2');/*recent cust list*/
            conRece.perfectScrollbar({ wheelSpeed: 20, wheelPropagation: true, minScrollbarLength: 20 });
            conRece.data('processing', false);
            conRece.find('.ps-scrollbar-x-rail').remove();
            var loadRece = function (take, skip) {
                conRece.data('processing', 'true');
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.take = 10;
                e.o.skip = conRece.find('.ItemCallerid').length;
                //$.ajax({
                //    type: "POST", url: "../pages/IVR_WebService.asmx/getRecentCust_",
                //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                //    success: function (c) {
                //        conRece.data('processing', 'false');
                //        if (c.d[0] != "error") {
                //            if (c.d[1].length == 0) conRece.data('processing', 'complete');
                //            $.each(c.d[1], function (i, item) {
                //                conRece.append(generateCallInfo({ tranno: '', cust_name: item.name, cust_code: item.code, cust_picture: item.picture, tel: item.detail, date2: '', viewed: true, favorites: item.favorites, mode: item.mode }));
                //            });
                //            conRece.perfectScrollbar('update');
                //        }
                //    }
                //});
            }
            loadRece(10, 0);
            conRece.bind("scroll", function (a, b) { /*box scroll*/
                if (conRece.data('processing') == 'true' || conRece.data('processing') == 'complete') return false;
                if (conRece.scrollTop() >= conRece[0].scrollHeight - conRece.height() - 50) {
                    loadRece(10, conRece.find('.ItemCallerid').length);
                }
            });

        }
    });
});

function showMessageIvrBox(message) {
    var box = $(".box .title").eq(0).parents('.box');
    if (box.length == 0) box = $('.box .page-utility-contain').eq(0).parents('.box');
    var msgPlc = box.find('.ivrBoxMsgPlace');
    if (msgPlc.length == 0) {
        msgPlc = $('<div>').addClass('ivrBoxMsgPlace').css({ 'position': 'fixed', 'top': '50px', 'z-index': '1000' });
        box.prepend(msgPlc);
    }
    msgPlc.html(message).hide();
    msgPlc.animateCSS('fadeInDown');
    var timer = setTimeout(function () {
        msgPlc.animateCSS('fadeOutUp', function () { msgPlc.hide(); });
    }, 3000);
}




function generateCallInfo(item) {

    var _color = item.Status == "1" ? "#43A047" : (item.Status == "2" ? "#1565C0" : (item.Status == "3" ? "#e53935" : (item.Status == "4" ? "#43A047" : "#000000")));


    var _result2 = $(
        ((item.CustomerId != null && item.CustomerId != '00000000-0000-0000-0000-000000000000') ?
            '<a href="/Admin/CustomerInfo/Detail/' + item.CustomerId + '" class="dropdown-item" target="_blank">' :
            '<a href="javascript:void(0)" onclick="QuickRegistrationFromIncomCall(\'' + item.TelNumber + '\')" class="dropdown-item">') +
        '<div class="media">' +
        ((item.Image != '' && item.Image != null && item.Image != undefined) ?
            '<img src="' + item.Image + '" alt="User Avatar" class="img-size-50 mr-3 img-circle">'
            :
            '<img src="/Content/Image/people.png" alt="User Avatar" class="img-size-50 mr-3 img-circle">') +
        '<div class="media-body" >' +
        '<p class="">' + item.CustomerName + '</p>' +
        '<p class="" style="margin-top:5px;font-size:9px;">'+item.TelNumber+'</p>' +
        '<p style="margin-top:5px;color:' +_color+';font-size:9px;" class=""><i class="far fa-clock mr-1"></i>' + item.DateTime +'</p>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '<div class="dropdown-divider"></div>')

    return _result2;
}


function Inserted_customer_callerid(cust_info) {
    var ivrData = $('#UCdialog_customer_create_quick').data('ivr');
    ivrData.cust_code = cust_info.code;
    ivrData.cust_name = cust_info.name;
    ivrData.user_cust_code = $('#HFUser_Cust_Code').val();
    ivrData.user_name = $('#HFUserUserName').val();
    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: ivrData };
    //$.ajax({
    //    type: "POST", url: "../pages/IVR_WebService.asmx/setLogCustCreated_",
    //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        if (c.d[0] != "error") { $('.btnQuick-phone span').text(c.d[1]); if (c.d[1] == 0) $('.btnQuick-phone span').hide() }
    //    }
    //});

    setIvrCustCreated(ivrData.tel, ivrData.cust_code, ivrData.cust_name);
}
function setIvrCustCreated(tel, cust_code, cust_name) {
    //--------ivr box
    var callinfo = $('.ItemCallerid:[tel=' + tel + ']');
    callinfo.attr('cust_code', cust_code);
    callinfo.find('.btnFavorites').show();
    callinfo.find('.itemcalleridtitle').html('<a class="th-color" onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');

    //--------callerid
    var callid = $('.callerid-container:[tel="' + tel + '"]');
    callid.find('.callname').html('<a onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');
    callid.find('.BtnCustLogIvr').show().attr('cust_code', cust_code).attr('name', cust_name);
    callid.find('.BtnShowListFormCallerId').show().attr('cust_code', cust_code).attr('cust_name', cust_name);

    //-------viewline-ivrviewcalls
    var itemviewlines = $('.BtnCreateCustQuickIvrView:[tel=' + tel + ']');
    itemviewlines.after('<a class="ivrlinecustname" onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');
    itemviewlines.remove();
}


function StartCallOut(tel, code, mode, cust_code) {

    RaveshUI.infoToast(resources.conntIvr, convertNumber(tel, resources.lang));


    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    e.o.cust_code = cust_code;
    e.o.tel = tel;
    e.o.tocode = code;
    e.o.mode = mode;
    e.o.clientId = clientId;
    e.o.user_name = $('#HFUserUserName').val();
    e.o.user_cust_code = $('#HFUser_Cust_Code').val();
    //$.ajax({
    //    type: "POST", url: "../pages/IVR_WebService.asmx/start_callout",
    //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        if (c.d[0] == "error") {
    //            RaveshUI.errorToast(c.d[1], convertNumber(tel, resources.lang))

    //        } else if (c.d[0] == "success") {

    //            //call by application
    //            if (c.d.length == 2) {
    //                RaveshUI.successToast(c.d[1], convertNumber(tel, resources.lang));
    //                return;
    //            }

    //            //var cust = c.d[2];
    //            //var date2 = c.d[3];
    //            //if (cust.picture != '') callStr.find('.custimg').attr('src', cust.picture);
    //            //callStr.find('.DivCustimg').show();
    //            //callStr.find('.iconcallout').remove();

    //            //var linkName = $('<a href="#" id="BtnCreateCustQuickIvr">' + cust.customerName + '</a>').data('data', { tel: tel, name: cust.customerName, user: '', mode: 1 });
    //            //if (cust.cust_code != "0") {
    //            //    callStr.find('.BtnCustLogIvr').show().attr('name', cust.customerName).attr('cust_code', cust.cust_code);
    //            //    callStr.find('.BtnShowListFormCallerId').show().attr('cust_code', cust.cust_code);
    //            //    linkName = $('<a onclick="customer_Show_Info(' + cust.cust_code + ',\'' + cust.customerName + '\');return false;">' + cust.customerName + '</a>');
    //            //}
    //            //callStr.find('.callname').html(linkName);
    //            //callStr.find('.callinfo').show().html(c.d[3]);

    //        }
    //    }
    //});
}


function Inserted_customer_callerid(cust_info) {
    var ivrData = $('#UCdialog_customer_create_quick').data('ivr');
    ivrData.cust_code = cust_info.code;
    ivrData.cust_name = cust_info.name;
    ivrData.user_cust_code = $('#HFUser_Cust_Code').val();
    ivrData.user_name = $('#HFUserUserName').val();
    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: ivrData };
    //$.ajax({
    //    type: "POST", url: "../pages/IVR_WebService.asmx/setLogCustCreated_",
    //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        if (c.d[0] != "error") { $('.btnQuick-phone span').text(c.d[1]); if (c.d[1] == 0) $('.btnQuick-phone span').hide() }
    //    }
    //});

    setIvrCustCreated(ivrData.tel, ivrData.cust_code, ivrData.cust_name);
}
function setIvrCustCreated(tel, cust_code, cust_name) {
    //--------ivr box
    var callinfo = $('.ItemCallerid:[tel=' + tel + ']');
    callinfo.attr('cust_code', cust_code);
    callinfo.find('.btnFavorites').show();
    callinfo.find('.itemcalleridtitle').html('<a class="th-color" onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');

    ////--------callerid
    //var callid = $('.callerid-container:[tel="' + tel + '"]');
    //callid.find('.callname').html('<a onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');
    //callid.find('.BtnCustLogIvr').show().attr('cust_code', cust_code).attr('name', cust_name);
    //callid.find('.BtnShowListFormCallerId').show().attr('cust_code', cust_code).attr('cust_name', cust_name);

    //-------viewline-ivrviewcalls
    var itemviewlines = $('.BtnCreateCustQuickIvrView:[tel=' + tel + ']');
    itemviewlines.after('<a class="ivrlinecustname" onclick="customer_Show_Info(' + cust_code + ',\'' + cust_name + '\');return false;">' + cust_name + '</a>');
    itemviewlines.remove();
}

addSocketEventListener("CallerId", function (data) {
    switch (data.Action) {
        case "CreateCustomer":
            var noti = notiCenter.getNotiById(data.id);
            if (!noti) return false;
            noti.setTitle(data.Title);
            break;
        case "Extra":

            var detail = "";
            switch (data.items.mode) {
                case "1":
                case 1:
                    //registerForm(data.items.formid, 0, data.items.list, "search");
                    //detail = '<a onclick="registerForm(' + data.items.formid + ',0, \'' + data.items.list + '\',\'search\');return false;">' + data.items.detail + '</a>';
                    break;
                case "2":
                case 2:
                    show_ticket(data.items.ticket, 'Ticket : ' + data.items.ticket);
                    detail = '<a onclick="show_ticket(' + data.items.ticket + ',\'Ticket :' + data.items.ticket + '\');return false;">' + data.items.detail + '</a>';
                    break;
                case "5":
                case 5:
                    detail = '';
                    if (data.items.cust.cust_code != "0")
                        detail = '<a  style="color: #31A2FA;" onclick="customer_Show_Infooo(\'' + data.items.tel + '\',\'' + data.items.cust.cust_Id + '\');return false;">' + data.items.cust.customerName + '</a><br/>';
                    //detail = '<a style="color: #31A2FA;" onclick="customer_Show_Info(' + data.items.cust.cust_code + ',\'' + data.items.cust.customerName + '\');return false;">' + data.items.cust.customerName + '</a><br/>';
                    if (data.items.state == "success")
                        detail += '<a  onclick="customer_Show_Infooo(\'' + data.items.tel + '\',\'' + data.items.cust.cust_Id + '\');return false;" >' + data.items.detail + '</a>';
                    //detail += '<a onclick="showFormInfo(' + data.items.form_valueid + ', \'' + data.items.detail + '\'); return false;">' + data.items.detail + '</a>';
                    else
                        detail += "<br/>" + data.items.detail;
                    break;
            }

            CreateNotification({
                Id: 2,
                Mode: NOTIFICATION_TYPE.CallerId,
                Title: '',
                Description: detail,
                ExtraData: '',
                LinkCode: 0,
                Pin: false,
                NotificationDateTime: data.CreateDateTime,
                Viewed: false,
                CustomerCode: 1,
                //Picture: 'data:image/png;base64,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',
                Picture: data.items.cust.picture,
                Type: NOTIFICATION_TYPE.CallerId,
                Sound: 6,
                Color: '#4CAF50',
                BrowserNotification: false
            }).showInPage();
            break;
        case "callerid_state":
            var noti = notiCenter.getNotiByExtraId(NOTIFICATION_TYPE.CallerId + ',' + data.tranno);
            if (!noti) return false;
            if (!noti.originDetail) noti.originDetail = noti.getDetail();
            noti.setDetail(noti.originDetail + '\n' + data.stateStr);
            break;
        case "StateLine":
            $('.itemuserline:[item=' + data.ext + '] .ivrstatusOption .ivr-icon-status').removeAttr('class').addClass('ivr-icon-status ico-' + data.state);
            break;
        case "StateCaller":
            $('.btnSetTelCaller').attr('stateCall', 'false');
            $('.itemuserline:[item=' + data.ext + ']').removeClass('th-bgcolor');
            if (data.state.toLowerCase() == "true") {
                $('.itemuserline:[item=' + data.ext + '] .btnSetTelCaller').attr('stateCall', 'true');
                $('.itemuserline:[item=' + data.ext + ']').addClass('th-bgcolor');
            }
            else {
                $('.itemuserline:[item=' + data.ext + '] .btnSetTelCaller').attr('stateCall', 'false');
            }
            break;
        case "CustCreated":
            setIvrCustCreated(data.tel, data.code, data.name);
            break;
        case "callerid_viewed":
            $('.btnQuick-phone span').text(data.countViewed).show(); if (data.countViewed == 0) $('.btnQuick-phone span').text(0).hide();
            break;
    }
});


function customer_Show_Infooo(phoneNumber, customerId) {
    if (customerId === '0' || customerId === 'null' || customerId === '' || customerId === undefined) {
        QuickRegistrationFromIncomCall(phoneNumber);
    } else {
        var url = window.location.href;
        var arr = url.split("/");
        window.location.href = arr[0] + '/Admin/CustomerInfo/Detail/' + customerId;
    }
}


function getIcon_CallerId_state(class_, state, title, mode, tranno) {
    var result = { class_: 'icon-phone', color_: '#000' };
    if (mode == 0 && state == 0) {
        result.class_ = 'icon-phone';
        result.color_ = '#34B900';
    } else if (mode == 1 && state == 0) {
        result.class_ = 'icon-phone';
        result.color_ = '#00B5E2';
    } else if (mode == 0 && state == 3) {
        result.class_ = 'icon-phone-incoming';
        result.color_ = '#34B900';
    } else if (mode == 1 && state == 3) {
        result.class_ = 'icon-phone-outgouing';
        result.color_ = '#00B5E2';
    } else if (mode == 0 && state == 5) {
        result.class_ = 'icon-phone-incoming';
        result.color_ = '#FFA300';
    } else if (mode == 1 && state == 5) {
        result.class_ = 'icon-phone-outgouing';
        result.color_ = '#FFA300';
    } else if (state == 2) {
        result.class_ = 'icon-phone-miss';
        result.color_ = '#f00';
    }
    return '<i title="' + title + '" tranno="' + tranno + '" ' + ((tranno != "") ? 'onclick="showcallinfo(' + tranno + ');return false;"' : "") + ' class="' + class_ + ' ' + result.class_ + '" style="color:' + result.color_ + '"></i>';
}



function convertNumber(str, lang) {
    if (str == null) str = '';
    if (lang == "fa") {
        str = str.toString();
        return str.replace(/\d+/g, function (digit) {
            var ret = '';
            for (var i = 0, len = digit.length; i < len; i++) {
                ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
            }
            return ret;
        });
    }
    else
        return str;
}
function Cbool(input) {
    if (input == null) return false;
    if (input.toString().toLowerCase() == "true") return true; else return false;
}