
var AllSetting = null;
var saleRuleManager = null;
var gridFilters = new Array();
var filterMenu = null;
var filterProccessMenu = null;
var filterProccessMenu_list = null;
var proccessList = new Array;
var viewType = 'pipeline';

$(document).ready(function () {
    
    if (localStorage["SaleSettingControlInfo" + $('#HFdomain').val()] != undefined) {
        var info = JSON.parse(localStorage["SaleSettingControlInfo" + $('#HFdomain').val()]);
        LoadSaleSettingControl(info.Controlnme, info.minWidth, info.title);
        localStorage.removeItem('SaleSettingControlInfo' + $('#HFdomain').val());
    }

    if ($('#HFAllSetting').val() != '') AllSetting = eval('(' + $('#HFAllSetting').val() + ')');

    getAllSaleProcess();

    $('#Salepipeline').click(function () {
        if (!$(this).hasClass('Saleactive')) {
            $('#divSaleTab .tab-item').removeClass('Saleactive');
            $(this).addClass('Saleactive');
            $('a[tabid=box-pipeline]').trigger('click');
            bindPipeline();
            $('#FilterProccess').css('display', 'inline-block');
            $('#All_Price').css('display', 'inline-block');
            $('#All_Count').css('display', 'inline-block');
            $('#FilterSale').css('display', 'inline-block');
            $('#FilterProccess_List').hide();
            $('#All_Price_SaleList').hide();
            $('#All_Count_SaleList').hide();
            viewType = 'pipeline';
            return false;
        }
    });

    $('#Salelist').click(function () {
        if (!$(this).hasClass('Saleactive')) {
            $('#divSaleTab .tab-item').removeClass('Saleactive');
            $(this).addClass('Saleactive');
            $('a[tabid=box-list]').trigger('click');
            bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn);
            $('#FilterProccess_List').css('display', 'inline-block');
            $('#All_Price_SaleList').css('display', 'inline-block');
            $('#All_Count_SaleList').css('display', 'inline-block');
            $('#FilterSale').css('display', 'inline-block');
            $('#FilterProccess').hide();
            $('#All_Price').hide();
            $('#All_Count').hide();
            viewType = 'list';
            return false;
        }
    });

    $('#Saleworkflow').click(function () {
        if (!$(this).hasClass('Saleactive')) {
            $('#divSaleTab .tab-item').removeClass('Saleactive');
            $(this).addClass('Saleactive');
            $('a[tabid=box-workflow]').trigger('click');
            $('#FilterProccess').hide();
            $('#FilterProccess_List').hide();
            $('#All_Price').hide();
            $('#All_Count').hide();
            $('#All_Price_SaleList').hide();
            $('#All_Count_SaleList').hide();
            $('#FilterSale').hide();
            viewType = 'workflow';
            $('#FilterContainer').hide();
            return false;
        }
    });

    $('#BtnNewSale').live('click', function () {
        var ProcessId = null;
        try { if ($('#Salepipeline').hasClass('Saleactive')) ProcessId = $('#ChangeState .Mainsolt').first().find('.Solt').attr('saleprocessid'); } catch (e) { }
        AddSaleDialog(ProcessId);
        return false;
    });

    $('.AddSale').live('click', function () {
        var parent = $(this).parents('.Solt').first();
        AddSaleDialog(parent.attr('saleprocessid'), parent.attr('statecode'));
        return false;
    });
    
    try {
        $('.SaleFilterMenu .option').live('click', function () {
            localStorage["SaleFilterId" + $('#HFdomain').val()] = $(this).attr('target');
            selectSaleFilter();
        });
    } catch (e) { };

    try {
        $('.SaleProcessMenu .option').live('click', function () {
            $('#FilterProccess').attr('ProcessId', $(this).attr('target'));
            $('#FilterProccess span').text($(this).find('span:not(.ActivityCount)').text()).attr('title', $(this).find('span:not(.ActivityCount)').text());
            localStorage["pipelineProcessId" + $('#HFdomain').val()] = $(this).attr('target');
            bindPipeline();
        });
    } catch (e) { };

    if (localStorage["SaleListProcessType" + $('#HFdomain').val()] == undefined) localStorage["SaleListProcessType" + $('#HFdomain').val()] = -1;
    try {
        $('.SaleProcessMenu_List .option').live('click', function () {
            localStorage["SaleListProcessType" + $('#HFdomain').val()] = $(this).attr('target');
            bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn);
        });
    } catch (e) { };

    //ruleManager--------------------------------------------------------

    var saleFields = new Array();
    saleFields.push({ id: 'sales.id', title: saleRes.code + ' ' + saleRes.sale, type: 'number', icon: 'icon-hashtag' });
    saleFields.push({ id: 'sales.tcustomer_code', title: saleRes.customer, type: 'customer', icon: 'icon-customer' });
    saleFields.push({ id: 'sales.won', title: saleRes.status_end, type: 'list', icon: 'icon-dropdown', items: [{ id: 0, title: saleRes.current }, { id: 1, title: saleRes.Successful }, { id: 2, title: saleRes.unsuccessful }] });
    saleFields.push({ id: 'sales.regdate', title: saleRes.Joined + ' ' + saleRes.sale, type: 'date', icon: 'icon-date' });
    saleFields.push({ id: 'sales.user_code', title: saleRes.registrar, type: 'user', icon: 'icon-user' });
    saleFields.push({ id: 'sales.extendedpropertis', title: saleRes.extendedpropertis, icon: 'icon-dropdown', type: 'list-IN', items: JSON.parse(saleRes.extendedPropertisArr.toLowerCase()) });
    saleFields.push({ id: 'sales.owners', title: saleRes.sale_owners, type: 'user-IN', icon: 'icon-user' });
    saleFields.push({ id: 'sales.percent', title: saleRes.percent + ' ' + saleRes.progress, type: 'number-IN', icon: 'icon-badge-percent' });
    saleFields.push({ id: 'sales.statustitle', title: saleRes.status, type: 'text-IN', icon: 'icon-list' });
    saleFields.push({ id: 'sales.SaleAmountApproximate', title: saleRes.amount_forcast, type: 'number', icon: 'icon-dollar', isPrice: true });
    saleFields.push({ id: 'sales.SaleDateApproximate', title: saleRes.date_forcast, type: 'date', icon: 'icon-date' });
    saleFields.push({ id: 'sales.SaleAmountFinal', title: saleRes.amount_final, type: 'number', icon: 'icon-dollar', isPrice: true });
    saleFields.push({ id: 'sales.SaleFinalDate', title: saleRes.date_final, type: 'date', icon: 'icon-date' });
    saleFields.push({ id: 'sales.leadsource', title: saleRes.way_attract, type: 'list-IN', icon: 'icon-dropdown', items: JSON.parse(saleRes.leadSourceType.toLowerCase()) });
    saleFields.push({ id: 'sales.introduction', title: saleRes.reagent, type: 'customer-IN', icon: 'icon-customer' });
    saleFields.push({ id: 'sales.leadgenration', title: saleRes.leadgenration, type: 'list-IN', icon: 'icon-dropdown', items: JSON.parse(saleRes.leadGenration.toLowerCase()) });
    saleFields.push({ id: 'sales.factor', title: saleRes.factor, type: 'factor', icon: 'icon-dollar', extraInfo: '3' });
    saleFields.push({ id: 'sales.product', title: saleRes.product, type: 'product-IN', icon: 'icon-product' });
    saleFields.push({ id: 'sales.productgroup', title: saleRes.group_product, type: 'productGroup-IN', icon: 'icon-product' });
    saleFields.push({ id: 'sales.customergroup', title: saleRes.group_customer, type: 'customerGroup-IN', icon: 'icon-customer' });
    saleFields.push({ id: 'sales.tag', title: saleRes.tag + ' ' + saleRes.sale, type: 'list-IN', icon: 'icon-dropdown', items: JSON.parse(saleRes.saleTags.toLowerCase()) });

    saleRuleManager = new CreateRuleManagerField({ lang: saleRes.saleLang, Fields: saleFields });
    saleRuleManager.init();
    $('.filtermain').append(saleRuleManager.getUI());

    $('#FilterSale').live('click', function (e) {
        if ($(e.target).hasClass('icon-caret-down')) return false;
        $('#FilterContainer').slideToggle();
        setTimeout(function () { try { if (viewType == 'pipeline' && $('#FilterContainer').css('display') == 'none') bindPipeline(false) } catch (e) { } }, 500);
        return false;
    });

    $('#RunFilter').click(function () {
        runFilter();
        return false;
    });

    $('#CloseFilter').click(function () {
        $('#FilterContainer').slideUp();
        setTimeout(function () { try { if (viewType == 'pipeline') bindPipeline(false) } catch (e) { } }, 500);
        return false;
    });

    $('#SaveFilter').click(function () {
        var rules = saleRuleManager.getSerialize(true);
        if (rules.hasError) return false;
        delete rules.hasError;

        var defaultTitle = '';
        var currentFilterId = localStorage["SaleFilterId" + $('#HFdomain').val()];
        if (currentFilterId != '0') defaultTitle = $('#FilterSale span').text();

        var saveDialog = RaveshUI.promptModal(saleRes.enter_filter_title, saleRes.ok, defaultTitle, function (value) {
            
            saveDialog.dialog.find('.ravesh-button').attr('disabled', true);
            setTimeout(function () { saveDialog.dialog.find('.ravesh-button').attr('disabled', false); }, 1500);

            $('.SaleTitle .spinner').fadeIn();
            var e = {};
            var q = {};
            e.domain = $('#HFdomain').val();
            e.user_code = $('#HFUserCode').val();
            e.codeing = $('#HFcodeDU').val();
            q.gridId = saleRes.gridId;
            q.gridName = 'Sale';
            q.FilterId = currentFilterId;
            q.FilterName = value;
            q.Rule = JSON.stringify(rules.data);
            e.SaveObj = q;

            $.ajax({
                url: "../WebServices/GridServices.asmx/Save_GridFilter",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    if (c.d[0] == 1) {
                        RaveshUI.successToast(saleRes.Successful, saleRes.filter_saved_success);
                        saleRes.gridId = c.d[1].GridId;
                        if (currentFilterId == '0') { gridFilters.push({ Id: c.d[1].FilterId, ruleJson: q.Rule, title: value }) };
                        var filter = jQuery.grep(gridFilters, function (n, i) { return n.Id == c.d[1].FilterId });
                        if (filter != undefined && filter != null) {
                            if (filter.length > 0) {
                                filter[0].ruleJson = q.Rule;
                                filter[0].title = value;
                                setFilterOptions();
                            }
                        };
                        localStorage["SaleFilterId" + $('#HFdomain').val()] = c.d[1].FilterId;
                        selectSaleFilter();
                    } else $('.SaleTitle .spinner').fadeOut();
                }
            });
        });
        return false;
    });

    $('#RemoveFilter').click(function () {
        var deleteDialog = RaveshUI.deleteConfirmModal(saleRes.yes, saleRes.no, saleRes.confirm_delete_text, function () {
            $('.SaleTitle .spinner').fadeIn();

            deleteDialog.dialog.find('.ravesh-button.red').attr('disabled', true);
            setTimeout(function () { deleteDialog.dialog.find('.ravesh-button.red').attr('disabled', false); }, 1500);

            var currentFilterId = localStorage["SaleFilterId" + $('#HFdomain').val()];
            var e = {};
            e.domain = $('#HFdomain').val();
            e.user_code = $('#HFUserCode').val();
            e.codeing = $('#HFcodeDU').val();
            e.filterId = currentFilterId;

            $.ajax({
                url: "../WebServices/GridServices.asmx/Remove_GridFilter",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    $('.SaleTitle .spinner').fadeOut();
                    if (c.d[0] == 1) {
                        RaveshUI.successToast(saleRes.Successful, saleRes.msg_done_delete);
                        gridFilters = jQuery.grep(gridFilters, function (value) { return value.Id != currentFilterId });
                        setFilterOptions();
                        $('#FilterContainer').slideUp();
                        newFilter();
                        setTimeout(function () { runFilter() }, 50);
                    }
                }
            });
        });
        return false;
    });

    $('#NewFilter').click(function () {
        newFilter();
        return false;
    });

    //-------------------------------------------------------------------
   
    filterMenu = new RaveshUI.Menu($('#FilterSale .icon-caret-down'), { align: saleRes.saleLang == 'fa' ? 'right' : 'left', options: [], marginTop: 3, cssClass: 'SaleFilterMenu', onOpen: function () { $('.SaleFilterMenu.open').css({ 'left': $('#FilterSale').offset().left }); } });
    try { gridFilters = JSON.parse(saleRes.gridFilters) } catch (e) { };
    setFilterOptions();
    
    filterProccessMenu = new RaveshUI.Menu($('#FilterProccess'), { align: saleRes.saleLang == 'fa' ? 'right' : 'left', options: [], marginTop: 3, cssClass: 'SaleProcessMenu' });

    filterProccessMenu_list = new RaveshUI.Menu($('#FilterProccess_List'), { align: saleRes.saleLang == 'fa' ? 'right' : 'left', options: [], marginTop: 3, cssClass: 'SaleProcessMenu_List' });

    //-------------------------------------------------------------------

    $('.btn_add_event').live('click', function () {
        setTimeout(function () {
            $('.messagcall').hide();
            $('.ravesh-dialog .head .icon-close').trigger('click');
            try { if (viewType == 'pipeline') bindPipeline() } catch (e) { };
        }, 500);
        return false;
    });

});

function selectSaleFilter() {
    var filterId = localStorage["SaleFilterId" + $('#HFdomain').val()];
    $('#RemoveFilter').show(); $('#SaveFilter').show(); $('#NewFilter').show();
    var filter = jQuery.grep(gridFilters, function (n, i) { return n.Id == filterId });
    var rule = '';
    var title = '';
    if (filter != undefined && filter != null) { if (filter.length > 0) { rule = filter[0].ruleJson; title = filter[0].title; } }
    if (filterId == 0) { title = saleRes.filters; $('#FilterSale .icon-filter').css('color', '#26292c').removeClass('fas') } else $('#FilterSale .icon-filter').css('color', '#03a9f4').addClass('fas');
   $('#FilterSale span').unbind().text(title).tooltiper(title);

    var searchTitle = title;
    if (filterId == '0') searchTitle = filterRes[saleRes.saleLang].showAllSubmissions;
    else searchTitle = filterRes[saleRes.saleLang].filterBy.replace('{0}', searchTitle);
    $('#box-list .head-title').html(searchTitle);

    if (filterId == '0') { saleRuleManager.init(); $('#RemoveFilter').hide() }
    else
    {
        var ruleObj = null;
        try { if (rule != '') ruleObj = JSON.parse(rule.replace(/'/g, '"')); } catch (e) { };
        if (ruleObj != null) saleRuleManager.build(ruleObj);
        $('#RemoveFilter').show();
    };
    if (filterId == -1) { $('#RemoveFilter').hide(); $('#SaveFilter').hide(); }
    setTimeout(function () { runFilter() }, 100);
};

function newFilter() {
    localStorage["SaleFilterId" + $('#HFdomain').val()] = 0;
    $('#FilterSale span').text(saleRes.filters);
    $('#box-list .head-title').html(filterRes[saleRes.saleLang].showAllSubmissions);
    saleRuleManager.init();
    $('#SaveFilter').show();
    $('#NewFilter').show();
    $('#RemoveFilter').hide();
};

function runFilter() {
    var rules = saleRuleManager.getSerialize();
    if (rules.hasError) return false;
    if (rules.data.length > 0) saleRes.gridFilter = rules.data;
    else saleRes.gridFilter = null;
    if ($('.Saleactive').attr('id') == 'Salepipeline') try { bindPipeline() } catch (e) { }
    if ($('.Saleactive').attr('id') == 'Salelist') try { bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) } catch (e) { }
};

function setFilterOptions() {
    var gridOptions = new Array();
    for (var i = 0; i < gridFilters.length; i++) { gridOptions.push({ target: gridFilters[i].Id, title: gridFilters[i].title, isLink: true }) };
    filterMenu.setOptions(gridOptions);
};

function GetCurrencyAndUnit(InputMoney) {
    if (InputMoney != undefined && InputMoney != null) {
        var digit = "";
        if (InputMoney.toString().indexOf(".") > -1) {
            digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
            InputMoney = InputMoney.toString().substr(0, InputMoney.toString().indexOf("."));
        }
        InputMoney = InputMoney.toString().replace(/,/gi, '');
        var result = InputMoney.toString().substr(0, InputMoney.length % 3);
        InputMoney = InputMoney.toString().substr(InputMoney.length % 3, InputMoney.length);
        for (k = 0; k < InputMoney.length; k = k + 3) result += ',' + InputMoney.toString().substr(k, 3);
        if (result.charAt(0) == ",") result = result.toString().substr(1, result.length);
        if (AllSetting != null) return (result + digit + ' ' + nUnd(AllSetting.UnitPrice));
        else return result + digit;
    }
    else return "";
};

function Sale_isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
};

function showSaleInfo_SaleList(saleId) {
    var dialog = RaveshUI.showDialog({
        id: 'ShowSaleInfoDialog',
        title: saleRes.view + ' ' +  saleRes.sale,
        width: '65%', minWidth: 700,
        removeAfterClose: false
    });
    if ($('#UCdialog_ShowSaleInfo').length == 0) {
        var container = $('<div>').addClass('form').css({ overflow: 'hidden', padding: '0 15px', minHeight: 400 });
        var content = $('<div>').addClass('fields').appendTo(container);
        content.attr('id', 'UCdialog_ShowSaleInfo').addClass('ShowSaleInfo_SaleList').data('data', { 'SaleId': saleId })
        dialog.setContent(container);
        dialog.showLoading();
        var e = { u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), r: $('#HFRnd').val(), p: '', n: 'ShowSaleInfo', m: '' };
        $.ajax({
            type: "POST",
            url: "../pages/Load_UserControl.aspx/Load_Control",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                dialog.hideLoading();
                content.html(c.d[1]);
            }
        });
    }
    else showSaleInfo_content(saleId, false);
};

function deleteSale_SaleList(saleData) {
    RaveshUI.deleteConfirmModal(saleRes.yes, saleRes.no, saleRes.confirm_delete_text, function () {
        $('.SaleTitle .spinner').fadeIn();
        var arrSelected = new Array();
        if (saleData == undefined) {
            $('.ravesh-grid .tbl-row').each(function (i, item) {
                if ($(item).find('.check input').attr('checked')) {
                    var data = eval('(' + $(item).attr('item') + ')');
                    arrSelected.push({ 'Code': data.id, 'user_code': data.user_code, 'Owners': data.Owners });
                }
            });
        } else arrSelected.push({ 'Code': saleData.id, 'user_code': saleData.user_code, 'Owners': saleData.Owners });
        var e = { domain: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), Saveobj: arrSelected };
        $.ajax({
            type: "POST",
            url: "../WebServices/Sale_.asmx/Sale_DeleteSale",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                $('.SaleTitle .spinner').fadeOut();
                if (c.d[0] == 1) RaveshUI.successToast(saleRes.successful, saleRes.msg_done_delete);
                else RaveshUI.warningToast(saleRes.Warning, $(c.d[1]).find('.text').html().split('</strong>')[1]);
                if (saleData == undefined) {
                    $('.SaleChangeUserGroup').hide();
                    $('.SaleDeleteGroup').hide();
                }
            }
        });

    });
};

function showDialogReminder_SaleList(saleId) {
    var container = $('<div>').addClass('form').css({ overflow: 'hidden', padding: '0 15px', minHeight: 400 });
    var content = $('<div>').addClass('fields').appendTo(container);
    var dialog = RaveshUI.showDialog({ id: 'ReminderDialog', title: saleRes.reminder, width: '70%', minWidth: 700 });
    dialog.setContent(container);
    dialog.showLoading();
    var e = { control: '~/controls/reminder_uc.ascx', Mode: 3, Code: saleId, CustomerCode: 0 };
    $.ajax({
        type: "POST",
        url: "server_load_usercontrol.aspx/Get_usercontroler_reminder",
        data: JSON.stringify(e),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (c) {
            dialog.hideLoading();
            content.html(c.d);
            content.find('#btnCancel').remove();
            Ed_detail_UcRem[0].disable(false).refresh();
        }
    });
};

function showDialogEvent_SaleList(saleId, title, custcode) {
    Event_Add_WU(custcode, '', '', title, true, saleId, function () {
        $('.WU_event_add_reminder *').hide();
        $('.chk_event_add_allday_class input[type=checkbox]').attr('checked', 'checked').trigger('change');
    });
};

function saleFailTagSetting() {
    $('[aria-labelledby=ui-dialog-title-dialog_SaleFailTagWf]').css('visibility', 'hidden');
    setTimeout(function () {
        $('[aria-labelledby=ui-dialog-title-dialog_SaleFailTagWf] .ui-dialog-titlebar-close span').text('').unbind().click(function () { $('#tab1.Salebox').unmask(); $('body').removeClass('ravesh-dialog-opened') });
        $('[aria-labelledby=ui-dialog-title-dialog_SaleFailTagWf]').css('visibility', 'visible');
        $('#tab1.Salebox').mask();
    }, 700);
};

function getAllSaleProcess() {
    $('.SaleTitle .spinner').fadeIn();
    $('.divSaleMain').mask();
    var e = {};
    var q = {};
    e.Q_ = q;
    e.domain = $('#HFdomain').val();
    e.user_code = $('#HFUserCode').val();
    e.codeing = $('#HFcodeDU').val();

    $.ajax({
        url: "../WebServices/Sale_.asmx/Sale_getSaleProcess",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {

            var listOptions = new Array();
            listOptions.push({ title: saleRes.all, isLink: true, target: -1 });
            listOptions.push({ title: saleRes.proccess_mode, isLink: true, target: 0 });
            listOptions.push({ title: saleRes.workflow, isLink: true, target: 1 });
            filterProccessMenu_list.setOptions(listOptions);

            if (c.d[0] == 1) {
                var data = c.d[1];
                if (data.length > 0) {
                    var pipeLineOptions = new Array();
                    for (var i = 0; i < data.length; i++) {
                        pipeLineOptions.push({ target: data[i].Id, title: data[i].Title, isLink: true });
                        proccessList.push({ id: data[i].Id, title: data[i].Title });
                    };
                    filterProccessMenu.setOptions(pipeLineOptions);
                  
                    $('#FilterProccess').click(function () {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].ActivityCount != 0) $('.SaleProcessMenu.open .option[target=' + data[j].Id + ']').append('<span class="ActivityCount">' + data[j].ActivityCount + '</span>');
                        }
                    });

                    if (localStorage["pipelineProcessId" + $('#HFdomain').val()] == undefined) { $('#FilterProccess').attr('ProcessId', data[0].Id); $('#FilterProccess span').text(data[0].Title); }
                    else {
                        $('#FilterProccess').attr('ProcessId', localStorage["pipelineProcessId" + $('#HFdomain').val()]);
                        var opt = new Array();
                        try { opt = jQuery.grep(data, function (n, i) { return n.Id == localStorage["pipelineProcessId" + $('#HFdomain').val()] }); } catch (e) { };
                        if (opt != null) { if (opt.length > 0) $('#FilterProccess span').text(opt[0].Title).tooltiper(opt[0].Title) };
                    }
                }
            }
            else if (c.d[0] == 0) { };

            if (localStorage["SaleFilterId" + $('#HFdomain').val()] == undefined) localStorage["SaleFilterId" + $('#HFdomain').val()] = -1;
            selectSaleFilter();
        }
    });
};

addSocketEventListener("Sale", function (data) {
    switch (data.Action) {
        case 'savesale': try {
            if ($('.Saleactive').attr('id') == 'Salepipeline') try { bindPipeline() } catch (e) { }
            if ($('.Saleactive').attr('id') == 'Salelist') try { bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) } catch (e) { }
            if ($('.Saleactive').attr('id') == 'Saleworkflow') $('a[tabid=box-workflow]').trigger('click');
        } catch (err) { } break;
        default: break;
    }
});

function saleAutoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
};

//saleOwners ----------------------------------------------------------------------------------------------

function saleOwnersInit_List(Id, user_code) {
    var searchobj = { "SaleId": Id, "Owners": "" };
    var e = { 'searchobj': searchobj, "domain": $('#HFdomain').val(), "user_code": $('#HFUserCode').val(), "codeing": $('#HFcodeDU').val() };
    $.ajax({
        url: "../WebServices/Sale_.asmx/Sale_getNavigationPropertis_",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {
            var data = c.d.Owners;
            saleOwnersDialog = RaveshUI.showDialog({ id: 'saleOwnersDialog', title: saleRes.sale_owners, width: '930px', minWidth: 930 });
            var container = $('<div>').append($('#dialog_SaleOwners').clone(true).attr('id', 'dialog_DivSaleOwners')).html();
            saleOwnersDialog.setContent(container);
            saleOwnersDialog.dialog.find('.head').height(50);
            saleOwnersDialog.addFooterButton(saleRes.ok, 'submit float SaveSaleownersBtn', function () { SaveSaleowners_List() });
            saleOwnersDialog.addFooterButton(saleRes.cancel, 'float', function () { saleOwnersDialog.close() });

            for (i = 0; i <= data.length - 1; i++) { AddSaleOwnerRow(data[i].User_code, data[i].ValidDateFrom, data[i].ValidDateTo, data[i].Access, i) };
            $("#dialog_DivSaleOwners #DrdSelectUser_owen").attr("SaleId", Id);
            $("#dialog_DivSaleOwners #DrdSelectUser_owen").val(0);
        }
    });
};

function AddSaleOwnerRow(UserID, datefrom, dateto, Access, index) {
    var option = $('#dialog_DivSaleOwners #DrdSelectUser_owen option[value="' + UserID + '"]');
    newUserFac = $('#dialog_DivSaleOwners #SampleUserFac').clone();
    newUserFac.find(".Txtdatefrom").attr('ID', 'Txtdatefrom' + index).attr('item', 'UserFac' + index);
    newUserFac.find(".Txtdateto").attr('ID', 'Txtdateto' + index).attr('item', 'UserFac' + index);
    newUserFac.show();
    newUserFac.attr('id', 'UserFac' + index);
    newUserFac.find('#btnDel').attr('item', 'UserFac' + index);
    newUserFac.find('#lblUserFac').text(option.text()).val(option.val());
    newUserFac.find('#div_Store').empty();
    var drdselectedList = '';
    if (datefrom != null && dateto != null) {
        newUserFac.find(".Txtdatefrom").val(datefrom);
        newUserFac.find(".Txtdateto").val(dateto);
    };
    if (Access != null && Access != '') {
        if (Access.toString().split('|').length > 1) {
            newUserFac.find(".chk-edit").attr('checked', Access.toString().split('|')[0] == 1 ? true : false);
            newUserFac.find(".chk-delete").attr('checked', Access.toString().split('|')[1] == 1 ? true : false);
        }
    }
    if (saleRes.saleLang == 'en') {
        newUserFac.find("#Txtdatefrom" + index).datepicker({
            regional: '', dateFormat: dateFormat,
            onSelect: function (dateText, inst) {
                var the_date = $.datepicker.parseDate(dateFormat, dateText);
                $("#dialog_DivSaleOwners #div_Store").find("#Txtdateto" + $(this).attr("item").replace("UserFac", "").toString()).datepicker('option', 'minDate', the_date)
            }
        });
        newUserFac.find("#Txtdateto" + index).datepicker({ regional: '', dateFormat: dateFormat });
    }
    else {
        newUserFac.find("#Txtdatefrom" + index).datepicker({
            onSelect: function (selectedDate) {
                $("#dialog_DivSaleOwners #div_Store").find("#Txtdateto" + $(this).attr("item").replace("UserFac", "").toString()).datepicker("option", "minDate", selectedDate);
            }
        });
        newUserFac.find("#Txtdateto" + index).datepicker();
    }
    $('#dialog_DivSaleOwners .UserFac').last().after(newUserFac);
    var dateFormat = "mm/dd/yy";
    option.css("display", "none");
};

function SaveSaleowners_List() {

    $('.SaveSaleownersBtn').attr('disabled', true);
    setTimeout(function () { $('.SaveSaleownersBtn').attr('disabled', false); }, 1500);

    var SaleOwnersArr = new Array();
    $("#dialog_DivSaleOwners .UserFac").each(function (index) {
        if (index != 0) {
            SaleOwners = {
                "User_code": $(this).find("#lblUserFac").val(),
                "FromDate": $(this).find(".Txtdatefrom").val(),
                "ToDate": $(this).find(".Txtdateto").val(),
                "Access": ($(this).find('.chk-edit').attr('checked') == true ? "1" : "0") + '|' + ($(this).find('.chk-delete').attr('checked') == true ? "1" : "0")
            };
            SaleOwnersArr.push(SaleOwners);
        };
    });
    var Valid = ValidateSaleowners_List(SaleOwnersArr);
    if (Valid.success) {
        var dto = {
            "SaveObj": {
                "SaleId": $("#dialog_DivSaleOwners #DrdSelectUser_owen").attr("SaleId"),
                "SaleOwners": SaleOwnersArr
            },
            "domain": $('#HFdomain').val(),
            "user_code": $('#HFUserCode').val(),
            "codeing": $('#HFcodeDU').val()
        };
        $.ajax({
            url: "../WebServices/Sale_.asmx/SaveSaleOwners_",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dto),
            success: function (c) {
                if ($(c.d).hasClass('message-success')) RaveshUI.successToast(saleRes.successful, saleRes.msg_done_save);
                else if ($(c.d).hasClass('message-error')) RaveshUI.errorToast(saleRes.error, saleRes.msg_error_save);
                saleOwnersDialog.close();
            }
        });
    }
    else { RaveshUI.warningToast('', Valid.message); return false }
};

function ValidateSaleowners_List(SaveObj) {
    valid = { success: true, message: "" };
    if (SaveObj != undefined && SaveObj != null) {
        for (var i = 0; i < SaveObj.length; i++) {
            if (SaveObj[i].FromDate == "" || SaveObj[i].ToDate == "") { valid.success = false; valid.message = saleRes.empty_fields; };
        }
    }
    return valid;
};

//---------------------------------------------------------------------------------------------------------