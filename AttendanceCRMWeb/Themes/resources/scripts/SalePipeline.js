
$(document).ready(function () {

    $('.Saleitem').live('click', function () {
        editSale($(this).attr('saleid'), true, $(this).attr('showeditmenu'));
    });

    $('.doneRad').live('click', function () {
        var elem = $(this);
        var e = { domain: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), SaveObj: { ActivityId: elem.attr('activityid'), Done: elem.attr('checked'), EventId: elem.attr('eventid') } };
        $.ajax({
            type: "POST",
            url: "../WebServices/Sale_.asmx/EditSaleActivity_Done",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                if (c.d[0] == 1) {
                    var row = elem.parents('.ActivityRow').first();
                    if (elem.attr('checked')) row.addClass('doned'); else row.removeClass('doned');
                    var menu = row.parents('.ActivityList').first();
                    var minDiff = menu.find('.ActivityRow:not(.doned):not(.done)').first().attr('daydiff');
                    setMenuIcon(minDiff, $('.Item_Activity.active').parents('.Saleitem').first());
                }
            }
        });
    });

});

function bindPipeline(showSpinner) {
    if (showSpinner == undefined || showSpinner) $('.SaleTitle .spinner').fadeIn();
    var e = {};
    var q = {};
    e.domain = $('#HFdomain').val();
    e.user_code = $('#HFUserCode').val();
    e.codeing = $('#HFcodeDU').val();
    q.ProcessId = $('#FilterProccess').attr('ProcessId');
    q.SelectedUser = '0';
    q.filter = saleRes.gridFilter;
    q.lang = saleRes.saleLang;
    e.Q_ = q;

    if (q.ProcessId == 0) {
        $('.SaleTitle .spinner').fadeOut();
        $('.divSaleMain').unmask('...');
        RaveshUI.warningToast('', saleRes.msg_error_process);
        return false;
    };

    $.ajax({
        url: "../WebServices/Sale_.asmx/Sale_getSaleProcesswithSalestate",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {

            $('.SaleTitle .spinner').fadeOut();
            $('.divSaleMain').unmask('...');
            if (c.d[0] == 1) {
                var data = c.d[1];
                $('#ChangeState').empty();
                var State = data.States;
                var w = 100 / State.length;
                var allPrice = 0;

                for (i = 0; i <= State.length - 1 ; i++) {
                    var mainSolt = $('#CloneArea .Mainsolt').clone();
                    if (State[i].Color != null && State[i].Color != '') mainSolt.find('.Solt_Header').css('border-bottom-color', State[i].Color);
                    mainSolt.find('.Solt_Title').html(State[i].Title).attr('title', State[i].Title);
                    mainSolt.find('.Solt_Percent').html('%' + State[i].Percent);
                    mainSolt.find('.Solt').attr({ 'id': 'Solt_' + State[i].Code + "_" + q.ProcessId, 'Statecode': State[i].Code, 'EndTitle': State[i].Title, 'SaleProcessId': q.ProcessId });
                    mainSolt.css("width", w + "%").appendTo($('#ChangeState'));

                    $(".Mainsolt #Solt_" + State[i].Code + "_" + q.ProcessId).droppable({
                        accept: '.Saleitem',
                        hoverClass: "Solt_highlight",
                        drop: handleCardDrop
                    });

                    var soltPrice = 0;
                    for (j = 0; j <= data.Sales.length - 1 ; j++) {
                        var Sale = data.Sales[j];
                        if (State[i].Code == Sale.LastStateCode) {
                            var AmountApproximate = GetCurrencyAndUnit(Sale.SaleAmountApproximate);
                            var saleItem = $('#CloneArea .Saleitem').clone(true);
                            saleItem.attr('SaleProcessId', q.ProcessId).attr('Statecode', State[i].Code).attr('SaleId', Sale.SaleId).attr('won', Sale.Won).attr('user_code', Sale.User_code).css('position', 'relative');
                            saleItem.find('.Item_Title').html(Sale.CustomerName).attr('title', Sale.CustomerName);
                            saleItem.find('.Item_Price').html(AmountApproximate).attr('title', AmountApproximate).attr('price', Sale.SaleAmountApproximate);
                            if (Sale.UserPic == '') saleItem.find('.Item_User').empty().append($('<i>').attr({ 'class': 'icon-customer fas', 'title': Sale.UserName }));
                            else saleItem.find('.Item_User').empty().append($('<img>').attr({ 'src': Sale.UserPic, 'title': Sale.UserName }));
                            saleItem.find('.Item_Activity').attr('saleid', Sale.SaleId).attr('custcode', Sale.Tcustomer_code);
                            saleItem.find('.Item_Menu').attr('saleid', Sale.SaleId);
                            if (RaveshUI.isMobile) saleItem.addClass('isMobile');

                            if (Sale.Owners != null) {
                                var owners = Sale.Owners.split(',');
                                for (var k = 0; k < owners.length; k++) {
                                    var owner = owners[k].split('#');
                                    if (owner.length > 3) {
                                        if (owner[3] != null && owner[3] != "") saleItem.find('.Item_User').append($('<img>').attr({ 'src': owner[3], 'title': owner[0], 'class': 'ShareUser' }));
                                        else saleItem.find('.Item_User').append($('<i>').attr({ 'class': 'icon-customer fas ShareUser', 'title': owner[0] }));
                                    }
                                }
                            };

                            setMenuIcon(Sale.MinDateDiff, saleItem);
                          
                            saleItem.prependTo($("#Solt_" + State[i].Code + "_" + q.ProcessId)).draggable({
                                containment: getPipeContainment($('#ChangeState'), $(saleItem)),
                                appendTo: '#ChangeState',
                                helper: 'clone',
                                revert: true,
                                scroll: true,
                                revertDuration: 0,
                                opacity: 0.7,
                                zIndex: 30,
                                start: function (e, ui) { $('.Solt .AddSale').css('visibility', 'hidden'); $(ui.helper).width(saleItem.outerWidth()) },
                                drag: function (e, ui) { $(ui.helper).css('cursor', 'grabbing') },
                                stop: function (e, ui) { $('.Solt .AddSale').css('visibility', 'visible'); $(this).css('cursor', 'pointer').css('opacity', 1).css('z-index', 2); }
                            });
                            saleItem.draggable('option', 'cancel', '.Item_Activity,.Item_Menu');
                                                       
                            soltPrice = soltPrice + parseFloat(Sale.SaleAmountApproximate);
                            
                            var showEditMenu = true;
                            var showDeleteMenu = true;
                            var showSharedMenu = true;
                            if ($('#HFUserCode').val() != "master") {
                                var row_shared_user = new Array();
                                var edit_shared = "";
                                var delete_shared = "";
                                if (Sale.Owners != null) {
                                    owners = Sale.Owners.split(',');
                                    for (var k = 0; k < owners.length; k++) {
                                        var owner = owners[k].split('#')
                                        if (owner.length > 2) {
                                            if (owner[1] != null && owner[1] != "") row_shared_user.push(owner[1]);
                                            if (owner[1] == $('#HFUserCode').val() && owner[2] != "") {
                                                edit_shared = owner[2].split('|')[0];
                                                delete_shared = owner[2].split('|')[1];
                                            }
                                        }
                                    }
                                };
                                //--------------------------------------------------------------------------------------------
                                if (edit_shared == "0") showEditMenu = false;
                                else if (edit_shared == "" || edit_shared == undefined || edit_shared == null) {
                                    if (saleRes.SaleEditAllAccess == 'False') {
                                        if (saleRes.SaleEditAccess == 'False') showEditMenu = false;
                                        else if (Sale.User_code != $('#HFUserCode').val()) showEditMenu = false;
                                    }
                                }
                                //--------------------------------------------------------------------------------------------
                                if (delete_shared == "0") showDeleteMenu = false;
                                else if (delete_shared == "" || delete_shared == null || delete_shared == undefined) {
                                    if (saleRes.SaleDeleteAllAccess == 'False') {
                                        if (saleRes.SaleDeleteAccess == 'False') showDeleteMenu = false;
                                        else if (Sale.user_code != $('#HFUserCode').val()) showDeleteMenu = false;
                                    }
                                }
                                //--------------------------------------------------------------------------------------------
                                if (saleRes.EditSharedAccess == "False") showSharedMenu = false;
                                else if ($.inArray($('#HFUserCode').val(), row_shared_user) == 0) showSharedMenu = false;
                                //--------------------------------------------------------------------------------------------
                            };

                            saleItem.attr('showeditmenu', showEditMenu).attr('showdeletemenu', showDeleteMenu).attr('showsharedmenu', showSharedMenu);
                            //--------------------------------------------------------------------------------------------
                            var optionArray = new Array();
                            var gridMenu = new RaveshUI.Menu(saleItem.find('.Item_Menu'), { align: saleRes.saleLang == 'fa' ? 'right' : 'left', cssClass: 'PipeMenu' });
                            optionArray = [{ title: saleRes.view, cssIcon: 'icon-search', callback: function (ev) { editSale($('.Item_Menu.active').attr('saleid'), true, $('.Item_Menu.active').parent().attr('showeditmenu')) } }];
                            if (saleItem.attr('showeditmenu') == 'true') optionArray.push({ title: saleRes.edit, cssIcon: 'icon-edit', callback: function (ev) { editSale($('.Item_Menu.active').attr('saleid')) } });
                            if (saleItem.attr('showdeletemenu') == 'true') optionArray.push({ title: saleRes.remove, cssIcon: 'icon-trash', callback: function (ev) { deleteSale_SaleList({ id: $('.Item_Menu.active').attr('saleid'), user_code: $('.Item_Menu.active').parents('.Saleitem').attr('user_code') }) } });
                            optionArray.push({ title: saleRes.copy, cssIcon: 'icon-copy', callback: function (ev) { editSale($('.Item_Menu.active').attr('saleid'), undefined, undefined, true) } });
                            optionArray.push({ isLine: true });
                            if (saleItem.attr('showsharedmenu') == 'true') optionArray.push({ title: saleRes.sale_owners, cssIcon: 'icon-user', callback: function (ev) { saleOwnersInit_List($('.Item_Menu.active').attr('saleid'), '') } });
                            optionArray.push({ title: saleRes.reminder, cssIcon: 'icon-bell', callback: function (ev) { showDialogReminder_SaleList($('.Item_Menu.active').attr('saleid')); } });
                            
                            gridMenu.setOptions(optionArray);
                            //--------------------------------------------------------------------------------------------
                            var ActivityMenu = new RaveshUI.Menu(saleItem.find('.Item_Activity'), {
                                align: saleRes.saleLang == 'fa' ? 'right' : 'left',
                                cssClass: 'PipeActivity',
                                options: [{ title: saleRes.schedule_activity, cssIcon: 'icon-plus', callback: function (event) { showDialogEvent_SaleList($('.Item_Activity.active').attr('saleid'), saleRes.schedule_activity, $('.Item_Activity.active').attr('custcode')); } }, { isLine: true }, { title: '' }]
                            });
                            saleItem.find('.Item_Activity').click(function () { bindActivityMenu($(this).attr('saleid')) });
                            //--------------------------------------------------------------------------------------------
                        };
                    };
                    var soltPriceWithUnit = GetCurrencyAndUnit(soltPrice);
                    var solt = $(".Mainsolt #Solt_" + State[i].Code + "_" + q.ProcessId);
                    mainSolt.find('.Solt_Price').html(soltPriceWithUnit).attr('title', soltPriceWithUnit).attr('price', soltPrice);
                    allPrice = allPrice + soltPrice;
                };
                var allPriceWithUnit = GetCurrencyAndUnit(allPrice);
                $('#All_Price').html(allPriceWithUnit).attr('title', allPriceWithUnit).attr('price', allPrice);
                $('#All_Count').html(data.Sales.length + ' ' + saleRes.sale);
            }
            else if (c.d[0] == -1) RaveshUI.warningToast('', saleRes.no_information);
            else if (c.d[0] == 0) RaveshUI.errorToast('', c.d[1]);
        }
    });
};

function getPipeContainment($box, $drag) {
    var x1 = $box.position().left + (saleRes.saleLang == 'fa' ? 15 : 8);
    var y1 = $box.position().top + 50;
    var x2 = $box.position().left + $('#ChangeState').width() - $drag.width() - (saleRes.saleLang == 'fa' ? 20 : 28);
    var y2 = $box.position().top + $('#ChangeState').height() - $drag.height() - 28;
    return [x1, y1, x2, y2];
};

function handleCardDrop(event, ui) {
    if (($(this).attr("SaleProcessId") == $(ui.draggable).attr('SaleProcessId')) && ($(this).attr("Statecode") != $(ui.draggable).attr('Statecode'))) {
        $(ui.draggable).insertBefore($(this).find('.AddSale'));
        newStateCode = $(this).attr("Statecode");
        SaleId = $(ui.draggable).attr('SaleId');
        SaleProcessId = $(this).attr("SaleProcessId");
        EndTitle = $(this).attr("EndTitle");
        var itemPrice = parseFloat($(ui.draggable).find('.Item_Price').attr('price'));
        //---------------------------------------------------------------------------------------------------------------------------
        var PriceElem = $(this).parent().find('.Solt_Price');
        var newPrice = itemPrice + parseFloat(PriceElem.attr('price'));
        PriceElem.html(GetCurrencyAndUnit(newPrice)).attr('price', newPrice);
        //---------------------------------------------------------------------------------------------------------------------------
        var prevSolt = $(".Mainsolt #Solt_" + $(ui.draggable).attr('Statecode') + "_" + SaleProcessId);
        var prevPriceElem = prevSolt.parent().find('.Solt_Price');
        var prevNewPrice = parseFloat(prevPriceElem.attr('price')) - itemPrice;
        prevPriceElem.html(GetCurrencyAndUnit(prevNewPrice)).attr('price', prevNewPrice);
        //---------------------------------------------------------------------------------------------------------------------------
        $(ui.draggable).attr('Statecode', newStateCode);
        var PrevWon = $(ui.draggable).attr('won');
        UpdateSaleStatus(SaleId, newStateCode, SaleProcessId, EndTitle, PrevWon);
        //---------------------------------------------------------------------------------------------------------------------------
        $(this).scrollTop(this.scrollHeight);
    }
    setTimeout(function () { $(ui.draggable).css('top', '0px') }, 50);
};

function UpdateSaleStatus(SaleId, SaleStateCode, SaleProcessId, EndTitle, PrevWon) {
        SaveObj = { "SaleStateCode": SaleStateCode, "SaleId": SaleId, "SaleProcessId": SaleProcessId };
        var dto = { "SaveObj": SaveObj, "domain": $('#HFdomain').val(), "user_code": $('#HFUserCode').val(), "codeing": $('#HFcodeDU').val() };
        $.ajax({
            url: "../WebServices/Sale_.asmx/UpdateSaleStatus_",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dto),
            success: function (c) {
                var Won = 0
                if (EndTitle == 'پایان موفق' || EndTitle == 'End success') Won = 1;
                else if (EndTitle == 'پایان ناموفق' || EndTitle == 'End fail') Won = 2;
                if (PrevWon != Won) UpdateWon(Won, SaleId);
            }
        });
    };

function UpdateWon(woncode, saleid) {
        SaveObj = { "SaleId": saleid, "Woncode": woncode };
        var dto = { "SaveObj": SaveObj, "domain": $('#HFdomain').val(), "user_code": $('#HFUserCode').val(), "codeing": $('#HFcodeDU').val() };
        $.ajax({
            url: "../WebServices/Sale_.asmx/UpdateWon_",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dto),
            success: function (c) {
                setTimeout(function () { bindPipeline() }, 500);
                if (woncode == 2) {
                    WfSaleFailCommet(saleid, $('#HFUserCode').val(), true);
                    saleFailTagSetting();
                    return false
                }
            }
        });
};

function bindActivityMenu(saleId) {
    if ($('.PipeActivity.open').length == 1) {
        $('.PipeActivity.open .option:last-child').css('text-align', 'center').append('<div class="spinner"></div><div class="emptyActive"></div>').find('> span:first-child').remove();
        $('.PipeActivity.open .option:first-child').hide();
        $('.emptyActive').hide();

        if (saleId != 0 && saleId != '' && saleId != undefined && saleId != null) {
            var e = { domain_: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), o: { saleId: saleId, Done: false } };
            $.ajax({
                type: "POST",
                url: "../WebServices/Sale_.asmx/get_sale_activity",
                data: JSON.stringify(e),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (c) {

                    $('.PipeActivity.open .option:last-child').addClass('ActivityList').addClass('ravesh-scrollbar');
                    $('.ActivityList .spinner').hide();
                    $('.PipeActivity.open .option:first-child').show();
                    $('.PipeActivity.open').css('top', $('.PipeActivity.open').offset().top - 30);

                    if (c.d[0] == 1) {
                        var data = c.d[1];
                        if (data != null) if (data.NotDone.Count > 0) addActivityRow(data.NotDone, saleRes.activitis, false);
                        else $('.ActivityList .emptyActive').show().html(saleRes.no_activity_for_deal);
                        if (data.Done.Count > 0) addActivityRow(data.Done, saleRes.done_items, true);

                        if (saleRes.saleLang == 'fa') {
                            $('.PipeActivity.open').css({ 'left': $('.Item_Activity.active').offset().left - $('.PipeActivity.open').width() - 5, 'top': $('.PipeActivity.open').offset().top - 42 }); // $('.PipeActivity.open').offset().left  -37 
                            if ($('.PipeActivity.open').offset().left <= 0) $('.PipeActivity.open').css({ 'left': $('.PipeActivity.open').offset().left + 320 });
                        }
                        else {
                            $('.PipeActivity.open').css({ 'left': $('.Item_Activity.active').offset().left + 25, 'top': $('.PipeActivity.open').offset().top - 42 }); //$('.PipeActivity.open').offset().left + 10
                            if ($('.divSaleMain').offset().left + $('.divSaleMain').width() < $('.PipeActivity.open').offset().left + 240) $('.PipeActivity.open').css({ 'left': $('.PipeActivity.open').offset().left - 343 });
                        }
                    };

                }
            });
        };
    }
};

function addActivityRow(data, title, done) {
    $('.ActivityList').parent().css('border-color', '#eee');
    if (data.Count) {
        var header = $('#CloneArea .ActivityHeader').clone();
        header.find('.title').html(title);
        header.find('.counter').html(data.Count);
        $('.ActivityList').append(header);
    }
    
    for (i = 0; i <= data.past.length - 1 ; i++) {
        var row = $('#CloneArea .ActivityRow').clone();
        if (done) row.addClass('done');
        row.addClass('past').attr('daydiff', data.past[i].diffDay);
        row.find('.doneRad').attr('activityid', data.past[i].ActivityId).attr('eventid', data.past[i].EventId);
        row.find('.subject').text(data.past[i].Subject).attr('title', data.past[i].Subject);
        row.find('.footer').html((Number(data.past[i].diffDay) * -1) + ' ' + saleRes.days_overdue + ' <div style="color:#aaa; margin:0" title="' + data.past[i].Create_user + '">' + ' . ' + data.past[i].Create_user + '<div/>');
        if (data.past[i].Comment != '') row.find('.commentTxt').show().html(data.past[i].Comment);
        $('.ActivityList').append(row);
    }
    
    for (j = 0; j <= data.today.length - 1 ; j++) {
        var row = $('#CloneArea .ActivityRow').clone();
        if (done) row.addClass('done');
        row.addClass('today').attr('daydiff', data.today[j].diffDay);
        row.find('.doneRad').attr('activityid', data.today[j].ActivityId).attr('eventid', data.today[j].EventId);
        row.find('.subject').text(data.today[j].Subject).attr('title', data.today[j].Subject);
        row.find('.footer').html(saleRes.today + ' <div style="color:#aaa; margin:0" title="' + data.today[j].Create_user + '">' + ' . ' + data.today[j].Create_user + '<div/>');
        if (data.today[j].Comment != '') row.find('.commentTxt').show().html(data.today[j].Comment);
        $('.ActivityList').append(row);
    }
    
    for (k = 0; k <= data.planed.length - 1 ; k++) {
        var row = $('#CloneArea .ActivityRow').clone();
        if (done) row.addClass('done');
        row.addClass('planed').attr('daydiff', data.planed[k].diffDay);
        row.find('.doneRad').attr('activityid', data.planed[k].ActivityId).attr('eventid', data.planed[k].EventId);
        row.find('.subject').text(data.planed[k].Subject).attr('title', data.planed[k].Subject);
        row.find('.footer').html(data.planed[k].diffDay + ' ' + saleRes.days_left + ' <div style="color:#aaa; margin:0" title="' + data.planed[k].Create_user + '">' + ' . ' + data.planed[k].Create_user + '<div/>');
        if (data.planed[k].Comment != '') row.find('.commentTxt').show().html(data.planed[k].Comment);
        $('.ActivityList').append(row);
    }
};

function setMenuIcon(minDateDiff, saleItem) {
    if (minDateDiff == undefined) minDateDiff = null;
    if (minDateDiff < 0) saleItem.css('border-bottom', '3px solid #f44336');
    else if (minDateDiff == 0) saleItem.css('border-bottom', '3px solid #4caf50');
    else if (minDateDiff > 0) saleItem.css('border-bottom', '3px solid #bbb');
    else if (minDateDiff == null) saleItem.css('border-bottom', '0');
};

