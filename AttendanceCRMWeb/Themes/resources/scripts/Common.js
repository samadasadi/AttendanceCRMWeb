function setPage_Size(pagesize) { var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), p: pagesize }; if (e.p <= 0) return false; $.ajax({ type: "POST", url: "../WebServices/todo1.asmx/setPage_size", data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json", success: function (c) { } }); } //save page size
function GmTable_pageselectCallback(page_id, jq) { var tableID = $(jq).parents('.divGmTable:first').attr('id'); var tblInfo = GmTable_Info('#' + tableID); window.setTimeout("Bind_" + tableID + '(' + page_id + ',' + tblInfo.pagesize + ',\'' + tblInfo.order + '\',\'' + tblInfo.orderDir + '\')', 1); return false; }
function GmTable_mask(tableID, waitStr) { if ($(tableID).children().length == 0) $(tableID).css('min-height', '50px').mask(waitStr); $(tableID).find('.TblOverlay').show(); var loading = $(tableID).find('.tblLoading').show(); loading.find('.waitStr').html(waitStr); loading.css('left', $(tableID).width() / 2 - loading.width() / 2).css('top', -45); loading.animate({ 'top': 0 }, 'fast'); }  //tblMask
function GmTable_unmask(tableID) { $(tableID).find('.TblOverlay').hide(); $(tableID).find('.tblLoading').animate({ 'top': -45 }, 'fast', function () { $(this).hide() }); }  //tblUnMask
function GmTable_Info(tableID) { if ($('#table_' + tableID.replace("#", "")).length == 0) return { pagenum: 0, pagesize: 10, order: 'id', orderDir: 'asc' }; var result = {}; result.pagenum = parseInt($(tableID).attr('pagenum')); result.pagesize = parseInt($(tableID).attr('pagesize')); result.order = $(tableID).attr('order'); result.orderDir = $(tableID).attr('orderDir'); return result; }
$(function () {
    $('.divGmTable table .TblSortable').live('click', function () {//sort by head tbl
        $(this).parents('tr').find('.selected').removeClass('selected');
        $(this).parents('tr').find('.ui-icon-triangle-1-s,.ui-icon-triangle-1-n').remove();
        $(this).parents('tr').find('.ui-icon-triangle-2-n-s').show();
        $(this).addClass('selected');
        $(this).find('.ui-icon-triangle-2-n-s').hide();
        if ($(this).attr('orderDir') == "asc")
            $(this).append('<span class="ui-icon ui-icon-triangle-1-n right_left"></span>').attr('orderDir', 'desc');
        else
            $(this).append('<span class="ui-icon ui-icon-triangle-1-s right_left"></span>').attr('orderDir', 'asc');
        var tableID = $(this).parents('.divGmTable:first').attr('id');
        var tblInfo = GmTable_Info('#' + tableID);
        window.setTimeout("Bind_" + tableID + '(' + tblInfo.pagenum + ',' + tblInfo.pagesize + ',\'' + $(this).attr('item') + '\',\'' + $(this).attr('orderDir') + '\')', 1);
        return false;
    });
    $('.divGmTable .divPagination .drdPageSize').live('change', function () {//change page_size
        var tableID = $(this).parents('.divGmTable:first').attr('id');
        var tblInfo = GmTable_Info("#" + tableID);
        window.setTimeout("Bind_" + tableID + '(' + tblInfo.pagenum + ',' + $(this).val() + ',\'' + tblInfo.order + '\',\'' + tblInfo.orderDir + '\')', 1);
        setPage_Size($(this).val());
        return false;
    });
    $('.divGmTable table th input[type=checkbox]').live('click', function () {//checkbox selectAll
        try {
            $(this).parents('.divGmTable:first').find('td:[item=\'checkbox\'] input:[type=\'checkbox\']').attr('checked', $(this).attr('checked'));
            if ($(this).attr('checked'))
                $(this).parents('.divGmTable:first').find('tr').addClass('selected');
            else
                $(this).parents('.divGmTable:first').find('tr').removeClass('selected');
        }
        catch (err) {

        }

    });
    $.sadeg = function () {

    }

    $.GmTable = function (options, Container) {
        options = $.extend({}, defaultOptions, options);
        options.pagination = $.extend({}, defaultOptions.pagination, options.pagination);
        options.sortable = $.extend({}, defaultOptions.sortable, options.sortable);
        var tableID = 'table_' + Container.attr('id');
        var oldheight = Container.height();
        if (options.pagination.show) { //sync pagenum and pagesize
            if (parseInt(options.pagination.current_page) + 1 > Math.ceil(options.pagination.totalItem / options.pagination.items_per_page)) options.pagination.current_page = Math.ceil(options.pagination.totalItem / options.pagination.items_per_page) - 1;
        }
        Container.children().filter(":not(.tblLoading)").remove(); //delete all items else loading
        Container.addClass('divGmTable');
        Container.attr('pagenum', options.pagination.current_page);
        Container.attr('pagesize', options.pagination.items_per_page);
        Container.attr('order', options.sortable.order);
        Container.attr('orderDir', options.sortable.orderDir);
        Container.append('<div id="GmTableOuterdiv"><div id="GmTableInnerdiv"><table class="' + options.class1 + '" id="' + tableID + '"><tr class="trHead"></tr></table></div></div>'); //create table
        Container.append('<div class="TblOverlay" style="display:none"></div>'); //create overlay div
        if (Container.find('.tblLoading').length == 0) Container.append('<div class="tblLoading" style="display:none"><div class="wait right_left" style="margin: 10px 5px;"></div><div class="waitStr right_left" style="margin: 12px;color: #fff;">Loading</div></div>'); //creare spinner loading
        $('#' + tableID).css('width', options.width);
        if (options.showHead) {
            //create table head
            for (var key in options.table) {
                var item = options.table[key];
                var headTitle = key;
                if (item.hasOwnProperty("title")) headTitle = item.title;
                $('#' + tableID + ' tr').append('<th item="' + key + '">' + headTitle + '</th>');
                var th = $('#' + tableID + ' tr th:last');
                if (item.hasOwnProperty("width")) th.css("width", item.width);
                if (item.hasOwnProperty("textAlign")) th.css("text-align", item.textAlign);
                if (item.hasOwnProperty("tdclass")) th.addClass(item.tdclass);
                if (options.sortable.show && key != "index" && key != "indexPage" && !(options.table[key].hasOwnProperty("sortable") && !(options.table[key].sortable))) { //config th head if sortable is show
                    th.append('<span class="ui-icon ui-icon-triangle-2-n-s right_left"></span>');
                    th.addClass('TblSortable');
                }
                if (key == options.sortable.order && !(options.table[key].hasOwnProperty("sortable") && !(options.table[key].sortable))) {// afzodan icon sort be on columni ke sort az tarigh on emal shode
                    th.addClass('selected');
                    th.find('.ui-icon-triangle-2-n-s').hide();
                    if (options.sortable.orderDir == "asc")
                        th.append('<span class="ui-icon ui-icon-triangle-1-s right_left"></span>').attr('orderDir', 'asc');
                    else
                        th.append('<span class="ui-icon ui-icon-triangle-1-n right_left"></span>').attr('orderDir', 'desc');
                }
            }
            //create Buttons Head
            for (var key in options.buttons) {
                var item = options.buttons[key];
                var headTitle = key;
                if (item.hasOwnProperty("title")) headTitle = item.title;
                if (key == "checkbox")
                    $('#' + tableID + ' tr').append('<th item="' + key + '"><input type="checkbox" /></th>');
                else
                    $('#' + tableID + ' tr').append('<th item="' + key + '">' + headTitle + '</th>');
                if (item.hasOwnProperty("width")) $('#' + tableID + ' tr th:last').css("width", item.width);
                if (item.hasOwnProperty("textAlign")) $('#' + tableID + ' tr th:last').css("text-align", item.textAlign);
                if (item.hasOwnProperty("tdclass")) $('#' + tableID + ' tr th:last').addClass(item.tdclass);
            }
        }
        for (var i = 0; i <= options.jsonData.length - 1; i++) {
            var trItem = $("<tr></tr>");
            if (options.fieldId != "") {
                trItem.attr('item', options.jsonData[i][options.fieldId]);
                trItem.data("data", options.jsonData[i]);
            }
            //create table Items 
            for (var key in options.table) {
                if (options.jsonData[i].hasOwnProperty(key)) {
                    if (options.table[key].hasOwnProperty("userPicture")) {
                        trItem.append('<td item="' + key + '"><span>' + generateUserPic(eval("(" + options.jsonData[i][key] + ")")) + '</span></td>');
                    }
                    else {
                        if (typeof options.jsonData[i][key] == "object") {

                            trItem.append('<td item="' + key + '"><span>' + ((options.jsonData[i][key][options.table[key].field] == null) ? '' : options.jsonData[i][key][options.table[key].field]) + '</span></td>');
                        } else {
                            trItem.append('<td item="' + key + '"><span>' + ((options.jsonData[i][key] == null) ? '' : options.jsonData[i][key]) + '</span></td>');
                        }
                    }
                } else if (key == "index") {// agar shomare satr bood
                    trItem.append('<td item="' + key + '"><span>' + (i + 1) + '</span></td>');
                } else if (key == "indexPage") {// agar shomare satr pagi bood
                    trItem.append('<td item="' + key + '"><span>' + (options.pagination.current_page * options.pagination.items_per_page + i + 1) + '</span></td>');
                } else { // agar chize peyda nakard az jsonData
                    trItem.append('<td item="' + key + '">&nbsp;</td>');
                }
                if (options.table[key].hasOwnProperty("itemTextAlign")) trItem.find('td:last').css("text-align", options.table[key].itemTextAlign);
                if (options.table[key].hasOwnProperty("class1")) trItem.find('td:last').children().addClass(options.table[key].class1);
                if (options.table[key].hasOwnProperty("tdclass")) trItem.find('td:last').addClass(options.table[key].tdclass);
                if (!options.showHead) trItem.find('td:last').css("width", options.table[key].width);
            }
            //create table Button Items 
            for (var key in options.buttons) {
                if (options.buttons[key].hasOwnProperty("icon"))//agar icon tarif karde bood
                    trItem.append('<td>' + options.buttons[key].icon + '</td>');
                else
                    trItem.append('<td>' + defaultOptions.buttons[key].icon + '</td>'); //age icon tarif nakarde bood az icon defult estefade kon

                if (options.buttons[key].hasOwnProperty("title"))//agar title tarif karde bood
                    trItem.find('td:last').children().attr("title", options.buttons[key].title);
                else
                    trItem.find('td:last').children().attr("title", defaultOptions.buttons[key].title);

                if (options.buttons[key].hasOwnProperty("itemTextAlign")) trItem.find('td:last').css("text-align", options.buttons[key].itemTextAlign);
                if (!options.showHead) trItem.find('td:last').css("width", options.buttons[key].width);
                if (options.buttons[key].hasOwnProperty("tdclass")) trItem.find('td:last').addClass(options.buttons[key].tdclass);
            }
            $('#' + tableID).append(trItem);
        }

        $('#' + tableID).find('tr:even').addClass("alternate");

        if (options.buttons.hasOwnProperty("sort")) { //configuration sortable if Exists (move rows)
            $('#' + tableID + ' tbody').sortable({
                helper: fixHelperModified,
                handle: '.BtnSort',
                items: "tr:not(.trHead)",
                update: function (e, ui) {
                    window.setTimeout(tableID + '_sort(\'' + $(ui.item).attr('item') + '\');return false;', 1)
                }
            })
        } else if (options.jquerySort) {
            $('#' + tableID + ' tbody').sortable({
                helper: fixHelperModified,
                items: "tr:not(.trHead)",
                update: function (e, ui) {
                    window.setTimeout(tableID + '_sort(\'' + $(ui.item).attr('item') + '\');return false;', 1)
                }
            })
        }

        if (options.pagination.show) {// create pagination
            Container.append('<div class="divPagination"><div id="' + tableID + '_pagination" class="pagination"></div></div>');
            if (!options.pagination.hasOwnProperty("callback")) options.pagination.callback = GmTable_pageselectCallback
            $('#' + tableID + '_pagination').pagination(options.pagination.totalItem, options.pagination);
            if (options.pagination.selectSize) $('#' + tableID + '_pagination').parent().append('<select id="' + tableID + '_DrdPageSize" class="drdPageSize"><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>');
            $('#' + tableID + '_DrdPageSize').val(options.pagination.items_per_page).attr('selected', 'selected');
        }
        //create a hidden field az data ha
        if (options.HiddenField) Container.append('<input type="hidden" id="HF' + tableID + '" value=\'' + escape(JSON.stringify(options.jsonData)) + '\'/>'); //create hidden field contain of all jsondata

        // animate if change height
        Container.css('height', 'auto');
        var newHeight = Container.height();
        Container.css('height', oldheight);
        if (newHeight > 0)
            Container.animate({ "height": newHeight }, function () { $(this).css('height', 'auto'); });
        else
            Container.css('height', 'auto');
    }

    $.fn.GmTable = function (options) {
        return this.each(function () {
            (new $.GmTable(options, $(this)));
        });
    };

    var defaultOptions = {
        width: '100%',
        showHead: true,
        jsonData: {},
        table: {},
        fieldId: "",
        class1: "",
        HiddenField: true,
        jquerySort: false,
        buttons: {
            del: { icon: '<span class="Crm-icon Crm-icon16-grid Crm-icon-delete-16 BtnDelete" style="display: inline-block;"></span>', title: "Delete" },
            edit: { icon: '<span    class="Crm-icon Crm-icon16-grid Crm-icon-Edit-16 BtnEdit" style="display: inline-block;"></span>', title: "Edit" },
            insert: { icon: '<span class="Crm-icon Crm-icon16-grid Crm-icon-add-16 BtnInsert" style="display: inline-block;"></span>', title: "Insert" },
            select: { icon: '<span class="Crm-icon Crm-icon16-grid Crm-icon-add-16 BtnSelect" style="display: inline-block;"></span>', title: "Select" },
            sort: { icon: '<span class="Crm-icon Crm-icon16-grid Crm-icon-add-16 BtnSort" style="display: inline-block;cursor: url(../Themes/resources/images/openhand.cur), default;"></span>', title: "Sort" },
            checkbox: { icon: '<input type="checkbox"/>', title: 'select' },
            ChangeSaleState: { icon: '<span class="Crm-icon Crm-icon16-grid Crm-icon-select-16 BtnChangeSaleState" style="display: inline-block"></span>', title: "ChangeSaleState" },
            editSaleowners: { icon: '<span    class="Crm-icon Crm-icon16-grid Crm-icon-add-16 BtneditSaleowners" style="display: inline-block;"></span>', title: "editSaleowners" },
            copy: { icon: '<span  class="Crm-icon Crm-icon16-grid Crm-icon-copy-16 BtnCopy" style="display: inline-block"></span>', title: "Copy" },
        },
        pagination:
        {
            show: false,
            selectSize: false,
            current_page: 0,
            totalItem: 20,
            items_per_page: 10,
            num_display_entries: 4,
            num_edge_entries: 2,
            next_text: "Next",
            prev_text: "Previous"
        },
        sortable:
        {
            show: false,
            order: "",
            orderDir: "asc"
        }
    };

});