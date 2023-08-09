
var saleOwnersDialog = null;
var changeUserDialog = null;
var oldPageNum = 1;

$(document).ready(function () {

    var commet_list = $("#commentComponentList").commentComponent({
        mode: 1,
        width: 550,
        height: 310,
        maxDataLoad: 3,
        expand: false,
        editable: true,
        removeable: true,
        changeOnlyMaster: false,
        openDialog: true,
        textHeightGrowDuble: true,
        dialogTitle: saleRes.concern_sale,
        iconSelector: '.BtnCommenting',
        closeDialogCallBack: function () {
            $("#commentComponentList").find('.cCompSearchMenu').removeClass('cCompVisible').addClass('cCompHidden').hide();
            $("#commentComponentList").find('.cCompTxtSearch').val('');
            $("#commentComponentList").find('.cCompChkSearchAttach').attr('checked', false);
        }
    });

    $('.ravesh-grid .BtneditSaleowners').live({ mouseenter: function (e) {
            var myObject = $(this).parents("tr:first").attr('item');
            var data = eval('(' + myObject + ')');
            var title = new Array();
            if (data.Owners != null) {
                var owns = data.Owners.split(',')
                for (var i = 0; i < owns.length; i++) {
                    title.push(owns[i].split('#')[0]);
                }
            }
            $('.ravesh-grid .BtneditSaleowners').attr("title", title.join(','));
        }, });

    $('.ravesh-grid .BtneditSaleowners').live('click', function () {
        var myObject = $(this).parents("tr:first").attr('item');
        var data = eval('(' + myObject + ')');
        saleOwnersInit_List(data.id, data.user_code);
    });

    $('#dialog_DivSaleOwners #DrdSelectUser_owen').live('change', function () {
        var index = 0;
        if ($('#dialog_DivSaleOwners .UserFac').length > 1) {
            var myString = $('#dialog_DivSaleOwners .UserFac').last().attr('id');
            index = Number(myString[myString.length - 1]) + 1;
        }
        if ($(this).find('option:selected').val() != 0) AddSaleOwnerRow($(this).find('option:selected').val(), null, null, null, index);
    });

    $('#dialog_DivSaleOwners #btnDel').live('click', function (e) {
        RaveshUI.deleteConfirmModal(saleRes.yes, saleRes.no, saleRes.confirm_delete_text, function () {
            var deletedOption = $('#dialog_DivSaleOwners #' + $(e.target).attr('item')).find('#lblUserFac');
            $('#dialog_DivSaleOwners #DrdSelectUser_owen option[value="' + deletedOption.val() + '"]').css("display", "block");
            $('#dialog_DivSaleOwners #' + $(e.target).attr('item')).remove();
        });
    });

    var pageSizeSelectorOptions = new Array();
    pageSizeSelectorOptions.push({ title: 10, isLink: true, target: 10 }, { title: 20, isLink: true, target: 20 }, { title: 30, isLink: true, target: 30 }, { title: 50, isLink: true, target: 50 }, { title: 100, isLink: true, target: 100 });
    new RaveshUI.Menu($('.page-size-selector'), { options: pageSizeSelectorOptions, cssClass: 'pageSizeSelector', });

    createHeadOfList(saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn);

    $('.SaleExportGroup').click(function () {
        RaveshUI.confirmModal(saleRes.all_columns, saleRes.selected_column, saleRes.cancel, saleRes.msg_export_to_excel, function (isYes) {
            var col = isYes ? 'All': saleRes.gridColumn;
            bindSaleList(-1, -1, saleRes.gridOrder, saleRes.gridOrderDir, col);
        });
        $('.ravesh-button[value=' + saleRes.selected_column + ']').removeClass('red').addClass('submit');
    });

    $('.SaleChangeUserGroup').click(function () {
        changeUserDialog = RaveshUI.showDialog({ id: 'changeUserDialog', title: saleRes.change_user, width: '400px', minWidth: 400 });
        var container = $('<div>').append($('#dialog_DivChangeuser').clone(true).attr('id', 'dialog_Changeuser')).html();
        changeUserDialog.setContent(container);
        changeUserDialog.dialog.find('.head').height(50);
        changeUserDialog.addFooterButton(saleRes.ok, 'submit float', function () {
            $('.SaleTitle .spinner').fadeIn();
            var arrSelected = new Array();
            $('.ravesh-grid .tbl-row').each(function (i, item) {
                if ($(item).find('.check input').attr('checked')) {
                    var data = eval('(' + $(item).attr('item') + ')');
                    arrSelected.push(data.id);
                };
            });
            var e = { domain: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), Code: arrSelected, Edit_UserCode: $("#dialog_Changeuser #DrdSelectUser_ListChange").val() }
            $.ajax({
                url: "../WebServices/Sale_.asmx/EditSaleUsersGrouply_",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(e),
                success: function (c) {
                    $('.SaleTitle .spinner').fadeOut();
                    if (c.d[0] == 1) RaveshUI.successToast(saleRes.successful, saleRes.msg_done_edit);
                    else RaveshUI.errorToast(saleRes.error, $(c.d[1]).find('.text').html().split('</strong>')[1]);
                    $('.SaleChangeUserGroup').hide();
                    $('.SaleDeleteGroup').hide();
                    changeUserDialog.close();
                }
            });
        });
        changeUserDialog.addFooterButton(saleRes.cancel, 'float', function () { changeUserDialog.close() });
    });

    $('.SaleDeleteGroup').click(function () {
        deleteSale_SaleList();
    });

});

//bindList----------------------------------------------------------------------------------------------

function createHeadOfList(order, orderDir, gridColumn) {
    $('.ravesh-grid .headcell,.ravesh-grid .headcellrow').remove();
    var cols = gridColumn.split(',');
    var Header = $('.ravesh-grid .tr-head');
    
    Header.append('<td class="headcellrow" style="width:47px; text-align: center" ordernum="0">' + saleRes.row + '</td>');
    Header.append('<td colid="id" class="headcell sortable selectedCol" style="width:70px" ordernum="1"><span>' + saleRes.code + ' ' + saleRes.sale + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="CustomerName" class="headcell sortable selectedCol" style="text-align: initial" ordernum="2"><span>' + saleRes.name_customer + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="SaleStateTitle" class="headcell selectedCol" style="text-align: initial" ordernum="3"><span>' + saleRes.sms_status + '</span></td>');
    Header.append('<td colid="Percente" class="headcell selectedCol" style="width:80px; text-align: initial" ordernum="4"><span>' + saleRes.percent + ' ' + saleRes.progress + '</span></td>');
    Header.append('<td colid="regdate" class="headcell sortable selectedCol" style="width:70px" ordernum="5"><span>' + saleRes.date_create + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="saleamountapproximate" class="headcell sortable selectedCol" ordernum="6"><span>' + saleRes.amount_forcast + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="saledateapproximate" class="headcell sortable" style="width:70px" ordernum="-1"><span>' + saleRes.date_forcast + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="DateDiff" class="headcell" style="text-align: initial; width:125px" ordernum="-1"><span>' + saleRes.day_untile_estimated + '</span></td>');
    Header.append('<td colid="saleamountfinal" class="headcell sortable" style="width:120px" ordernum="-1"><span>' + saleRes.amount_final + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="salefinaldate" class="headcell sortable" style="width:70px" ordernum="-1"><span>' + saleRes.date_final + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="saledescription" class="headcell" style="text-align: initial" ordernum="-1"><span>' + saleRes.description + '</span></td>');
    Header.append('<td colid="Username" class="headcell sortable selectedCol" style="text-align: initial;width:90px" ordernum="7"><span>' + saleRes.user + '</span><div class="order-icon float-left"><i class="icon-angle-up"></i><i class="icon-angle-down"></i></div></td>');
    Header.append('<td colid="Commenting" class="headcell selectedCol" style="text-align: initial;width:40px" ordernum="8"><span>' + saleRes.comments + '</span></td>');
    Header.append('<td colid="Owners" class="headcell selectedCol" id="SaleOwnersHeader" style="text-align: initial;width:80px" ordernum="9"><span>' + saleRes.sale_owners + '</span></td>');
    Header.append('<td colid="WorkflowState" class="headcell selectedCol" style="width:120px" ordernum="10"><span title="' + saleRes.process + '">' + saleRes.process + '</span></td>');

    if (gridColumn != '') {
        Header.find('.headcell').removeClass('selectedCol').attr('ordernum', '-1');
        for (var i = 0; i < cols.length; i++) {
            var id = cols[i].replace(',', '');
            Header.find('.headcell[colid=' + id + ']').addClass('selectedCol').attr('ordernum', i+1);
        };
    }

    $('.headcell,.headcellrow').sort(function (a, b) { return Number($(b).attr('ordernum')) - Number($(a).attr('ordernum')) }).appendTo(Header);

    if ($('#HFUserCode').val() != "master" && saleRes.EditSharedAccess == "False") $('#SaleOwnersHeader').hide();

    if (order != '' && orderDir != '') {
        Header.find('td').removeClass('is-asc').removeClass('is-desc');
        Header.find('td[colid=' + order + ']').addClass('is-' + orderDir);
    }

    Header.find(".sortable").click(function (e) {
        var asc = $(this).hasClass("is-asc");
        Header.find("td").removeClass("is-asc").removeClass("is-desc");
        $(this).addClass(asc ? "is-desc" : "is-asc");
        bindSaleList(parseFloat($('.page-num').val()), saleRes.gridSize, $(this).attr('colid'), asc ? "desc" : "asc", saleRes.gridColumn);
    });

    Header.find('input[type=checkbox]').live('change', function () {
        var checked = $(this).attr('checked');
        $('.ravesh-grid .tbl-row .check input').attr('checked', checked);
        $('.ravesh-grid .tbl-row.selected').removeClass('selected');
        if (checked) $('.ravesh-grid .tbl-row').addClass('selected');
        showBtnTblSale();
    });
};

function bindSaleList(pagenum, pagesize, order, orderDir, gridColumn) {
  
    if (pagenum == -1) $('.SaleTitle .spinner').fadeIn();
    else {
        $('.ravesh-grid-loading').fadeIn();
        $('#All_Price_SaleList').hide().html(GetCurrencyAndUnit(0));
        $('#All_Count_SaleList').hide().html(0 + ' ' + saleRes.sale);
        if (saleRes.gridSize != pagesize || saleRes.gridOrder != order || saleRes.gridOrderDir != orderDir || saleRes.gridColumn != gridColumn) saveGridSetting(pagesize, order, orderDir, gridColumn);
        try { saleRes.gridSize = pagesize } catch (e) { }
        try { saleRes.gridOrder = order } catch (e) { }
        try { saleRes.gridOrderDir = orderDir } catch (e) { }
        try { saleRes.gridColumn = gridColumn } catch (e) { }
        try {
            switch (localStorage["SaleListProcessType" + $('#HFdomain').val()]) {
                case '-1': $('#FilterProccess_List span').text(saleRes.proccessType); break;
                case '0': $('#FilterProccess_List span').text(saleRes.proccess_mode); break;
                case '1': $('#FilterProccess_List span').text(saleRes.workflow); break;
            }
        } catch (e) { }
    };

    var e = {};
    e.domain_ = $('#HFdomain').val();
    e.user_code = $('#HFUserCode').val();
    e.codeing = $('#HFcodeDU').val();

    var q = {};
    q.pagesize = pagesize;
    q.pagenum = pagenum;
    q.order = order;
    q.orderDir = orderDir;
    q.UserCode = $('#HFUserCode').val();
    q.SelectedUser = '0'                
    q.name = ''                         
    q.state = '-1'                      
    q.ProgressSearch = null             
    q.StatusSearch = null               
    q.FromDate = null                   
    q.ToDate = null                     
    q.Describsearch = '';               
    q.extendedsearch = '';              
    q.saleStateType = localStorage["SaleListProcessType" + $('#HFdomain').val()];
    q.filter = saleRes.gridFilter;
    q.lang = saleRes.saleLang;
    if (pagenum == -1) q.gridColumn = gridColumn;
    e.Q_ = q;

    $.ajax({
        url: "../WebServices/Sale_.asmx/Sale_getAllSales",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {
            if (pagenum != -1) {
                $('.ravesh-grid-loading').fadeOut();
                $('.ravesh-grid .tr-head .check input').attr('checked', false);

                //pageing--------------------------------------------------------------------------------------------------
                try {
                    var totalRow = 0;
                    if (c.d[0] == 1) {
                        var rowdata = c.d[1][0];
                        if (rowdata.length > 0) totalRow = rowdata[0].TotalRow;
                        var lastRecord = parseFloat(pagenum) * parseFloat(pagesize);
                        $('.ravesh-grid-footer .gridInfo').text(saleRes.show + ' ' + (((parseFloat(pagenum) - 1) * parseFloat(pagesize)) + 1) + ' ' + saleRes.until + ' ' + (lastRecord > totalRow ? totalRow : lastRecord) + ' ' + saleRes.from + ' ' + totalRow + ' ' + saleRes.record);
                        $('.ravesh-grid-footer .page-count').text(Math.ceil(parseFloat(totalRow) / parseFloat(pagesize)));
                    }
                    else {
                        $('.ravesh-grid-footer .gridInfo').text(saleRes.no_information);
                        $('.ravesh-grid-footer .page-count').text('1');
                    }
                    $('.page-number-selector .page-num').val(pagenum);
                    $('.ravesh-grid-footer .page-size-selector').text(pagesize);
                    if (saleRes.saleLang == 'en') {
                        $('.ravesh-grid-footer .grid-first').removeClass('icon-angle-double-right').addClass('icon-angle-double-left');
                        $('.ravesh-grid-footer .grid-prev').removeClass('icon-angle-right').addClass('icon-angle-left');
                        $('.ravesh-grid-footer .grid-next').removeClass('icon-angle-left').addClass('icon-angle-right');
                        $('.ravesh-grid-footer .grid-last').removeClass('icon-angle-double-left').addClass('icon-angle-double-right');
                    }
                    oldPageNum = pagenum;
                } catch (e) { }
                //-----------------------------------------------------------------------------------------------------------

                $('.ravesh-grid .tbl-row').remove();
                if (c.d[0] == 1) {
                    var rowdata = c.d[1][0];
                    var cols = gridColumn.split(',');

                    for (var i = 0; i <= rowdata.length - 1; i++) {

                        var wfSend = new Array();
                        var wfarr = Enumerable.from(c.d[1][1]).firstOrDefault("x=>x.saleid=='" + rowdata[i].id + "'");
                        if (wfarr != null && wfarr != undefined) wfSend = wfarr.wfobj;

                        var item = rowdata[i];
                        var saleid = item.id;
                        rowdata[i].data = JSON.stringify(item);
                        var tblRow = $('#CloneArea #TblRow').clone(true);
                        tblRow.find('.tbl-row').attr('item', rowdata[i].data).attr('saleid', saleid);



                        tblRow.find('.tbl-row').append('<td class="row_num" ordernum="0" style="width: 47px; min-width: 47px; text-align: center">' + item.row + '</td>');

                        rowdata[i].id = item.user_code == $('#HFUserCode').val() ? '<a href="#" onclick="showSaleInfo_SaleList(' + item.id + ');return false;" >' + item.id + '</a>' : '<a href="#" onclick="showSaleInfo_SaleList(' + item.id + ');return false;" style="color:blue" class="shared"> ' + item.id + '</a>'
                        tblRow.find('.tbl-row').append('<td colid="id" ordernum="1" class="selectedCol"><div>' + rowdata[i].id + '</div></td>');

                        rowdata[i].CustomerName = (item.tcustomer_code != 0) ? ('<a href="#" onclick="customer_Show_Info(' + item.tcustomer_code + ',\'' + item.CustomerName + '\');return false;">' + item.CustomerName + '</a>') : item.CustomerName;
                        tblRow.find('.tbl-row').append('<td colid="CustomerName" ordernum="2" class="selectedCol"><div style="text-align: initial">' + rowdata[i].CustomerName + '</div></td>');

                        rowdata[i].SaleStateTitle = item.SaleStateTitle == null ? "" : item.SaleStateTitle;
                        tblRow.find('.tbl-row').append('<td colid="SaleStateTitle" ordernum="3" class="selectedCol"><div style="text-align: initial">' + rowdata[i].SaleStateTitle + '</div></td>');

                        rowdata[i].Percente = item.Percente == null ? "" : item.Percente;
                        tblRow.find('.tbl-row').append('<td colid="Percente" ordernum="4" class="selectedCol"><div>' + rowdata[i].Percente + '</div></td>');

                        tblRow.find('.tbl-row').append('<td colid="regdate" ordernum="5" class="selectedCol"><div>' + item.regdate + '</div></td>');

                        rowdata[i].saleamountapproximate = item.saleamountapproximate == null ? 0 : item.saleamountapproximate;
                        rowdata[i].saleamountapproximate = GetCurrency(Math.round(Number(rowdata[i].saleamountapproximate)));
                        tblRow.find('.tbl-row').append('<td colid="saleamountapproximate" ordernum="6" class="selectedCol"><div>' + rowdata[i].saleamountapproximate + '</div></td>');

                        rowdata[i].saledateapproximate = item.saledateapproximate == null ? "" : item.saledateapproximate;
                        tblRow.find('.tbl-row').append('<td colid="saledateapproximate" ordernum="-1"><div>' + rowdata[i].saledateapproximate + '</div></td>');

                        if (item.DateDiff == null) rowdata[i].DateDiff = ""
                        else {
                            if (item.DateDiff < 0) rowdata[i].DateDiff = saleRes.old;
                            if (item.DateDiff == 0) rowdata[i].DateDiff = saleRes.today;
                            if (item.DateDiff > 0) rowdata[i].DateDiff = item.DateDiff + " " + saleRes.day;
                        }
                        tblRow.find('.tbl-row').append('<td colid="DateDiff" ordernum="-1"><div>' + rowdata[i].DateDiff + '</div></td>');

                        rowdata[i].saleamountfinal = item.saleamountfinal == null ? 0 : item.saleamountfinal;
                        rowdata[i].saleamountfinal = GetCurrency(Math.round(Number(rowdata[i].saleamountfinal)));
                        tblRow.find('.tbl-row').append('<td colid="saleamountfinal" ordernum="-1"><div>' + rowdata[i].saleamountfinal + '</div></td>');

                        rowdata[i].salefinaldate = item.salefinaldate == null ? "" : item.salefinaldate;
                        tblRow.find('.tbl-row').append('<td colid="salefinaldate" ordernum="-1"><div>' + rowdata[i].salefinaldate + '</div></td>');

                        if (rowdata[i].saledescription != null) { if (rowdata[i].saledescription.length > 30) rowdata[i].saledescription = rowdata[i].saledescription.toString().substring(0, 30) + ' ... ' };
                        tblRow.find('.tbl-row').append('<td colid="saledescription" ordernum="-1"><div style="text-align: initial">' + rowdata[i].saledescription + '</div></td>');

                        tblRow.find('.tbl-row').append('<td colid="Username" ordernum="7" class="selectedCol"><div style="text-align: initial">' + item.Username + '</div></td>');

                        rowdata[i].Commenting = '<span  class="BtnCommenting" saleId="' + saleid + '" saleTitle="' + saleRes.concern_sale + '"></span>';
                        tblRow.find('.tbl-row').append('<td colid="Commenting" ordernum="8" class="selectedCol"><div>' + rowdata[i].Commenting + '</div></td>');

                        item.editSaleowners = item.Owners != null ? '<div class="BtneditSaleowners"></div>' : '<span class="icon-plus BtneditSaleowners"></span>'
                        tblRow.find('.tbl-row').append('<td colid="Owners" ordernum="9" class="selectedCol"><div>' + rowdata[i].editSaleowners + '</div></td>');
                        if (item.Owners != null) {
                            var owners = item.Owners.split(',');
                            for (var k = 0; k < owners.length; k++) {
                                var owner = owners[k].split('#');
                                if (owner.length > 3) {
                                    if (owner[3] != null && owner[3] != "") tblRow.find('.tbl-row .BtneditSaleowners').append($('<img>').attr({ 'src': owner[3], 'title': owner[0], 'class': 'ShareUser' }));
                                    else tblRow.find('.tbl-row .BtneditSaleowners').append($('<i>').attr({ 'class': 'icon-customer fas ShareUser', 'title': owner[0] }));
                                }
                            }
                        };

                        var btn = '';
                        if (item.salestatetype == 1) btn = '<span  class="icon-workflow BtnChangeSaleState" onclick="showWfInfo_List(this); return false"></span>';
                        else {
                            var processTitle = '';
                            try { var proccess = jQuery.grep(proccessList, function (a) { return a.id == item.ProcessId }); if (proccess.length > 0); processTitle = proccess[0].title } catch (e) { };
                            btn = '<span title="' + processTitle + '">' + processTitle + '</span>'
                        }
                        tblRow.find('.tbl-row').append('<td colid="WorkflowState" ordernum="10" class="selectedCol"><div>' + btn + '</div></td>');
                        if (item.salestatetype == 1) renderWf(tblRow.find('.tbl-row'), wfSend, item.won, saleid);

                        if (gridColumn != '') {
                            tblRow.find('.tbl-row td').removeClass('selectedCol').attr('ordernum', '-1');
                            for (var m = 0; m < cols.length; m++) {
                                var id = cols[m].replace(',', '');
                                tblRow.find('.tbl-row td[colid=' + id + ']').addClass('selectedCol').attr('ordernum', (m + 1));
                            }
                        };

                        tblRow.find('.tbl-row td:not(.check):not(.action)').sort(function (a, b) {
                            return Number($(b).attr('ordernum')) - Number($(a).attr('ordernum'));
                        }).appendTo(tblRow.find('.tbl-row'));

                        //Access-------------------------------------------------------------------------------------------
                        var showEditMenu = true;
                        var showDeleteMenu = true;
                        var showSaleOwnerCell = true;
                        var showSaleOwnerBtn = true;
                        if ($('#HFUserCode').val() != "master") {
                            var row_shared_user = new Array();
                            var edit_shared = "";
                            var delete_shared = "";
                            if (item.Owners != null) {
                                owners = item.Owners.split(',');
                                for (var j = 0; j < owners.length; j++) {
                                    var owner = owners[j].split('#')
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
                                    else if (item.user_code != $('#HFUserCode').val()) showEditMenu = false;
                                }
                            }
                            if (saleRes.EditSharedAccess == "False") showSaleOwnerCell = false;
                            else if ($.inArray($('#HFUserCode').val(), row_shared_user) == 0) showSaleOwnerBtn = false;
                            //--------------------------------------------------------------------------------------------
                            if (delete_shared == "0") showDeleteMenu = false;
                            else if (delete_shared == "" || delete_shared == null || delete_shared == undefined) {
                                if (saleRes.SaleDeleteAllAccess == 'False') {
                                    if (saleRes.SaleDeleteAccess == 'False') showDeleteMenu = false;
                                    else if (item.user_code != $('#HFUserCode').val()) showDeleteMenu = false;
                                }
                            }
                        };
                        if (!showSaleOwnerCell) tblRow.find('.tbl-row .BtneditSaleowners').parent().parent().hide();
                        if (!showSaleOwnerBtn) tblRow.find('.tbl-row .BtneditSaleowners').hide();
                        //-------------------------------------------------------------------------------------------------

                        var optionArray = new Array();
                        var gridMenu = new RaveshUI.Menu(tblRow.find('.tbl-row .grid-row-actions'), {
                            align: saleRes.saleLang == 'fa' ? 'right' : 'left',
                            cssClass: 'GridRowActions'
                        });
                        tblRow.find('.tbl-row .grid-row-actions').attr('showeditmenu', showEditMenu);
                        optionArray = [{ title: saleRes.view, cssIcon: 'icon-search', callback: function (ev) { var saleId = saleList_GetSaleId(ev); editSale(saleId, true, $('.tbl-row .grid-row-actions.active').attr('showeditmenu')); } }];
                        if (showEditMenu) optionArray.push({ title: saleRes.edit, cssIcon: 'icon-edit', callback: function (ev) { var saleId = saleList_GetSaleId(ev); editSale(saleId) } });
                        if (showDeleteMenu) optionArray.push({ title: saleRes.remove, cssIcon: 'icon-trash', callback: function (ev) { var saleData = saleList_GetSaleData(ev); deleteSale_SaleList(saleData) } });
                        else tblRow.find('.check input').remove();
                        optionArray.push({ title: saleRes.copy, cssIcon: 'icon-copy', callback: function (ev) { var saleId = saleList_GetSaleId(ev); editSale(saleId, undefined, undefined, true); } });
                        optionArray.push({ isLine: true });
                        optionArray.push({ title: saleRes.reminder, cssIcon: 'icon-bell', callback: function (ev) { var saleId = saleList_GetSaleId(ev); showDialogReminder_SaleList(saleId) } });
                        optionArray.push({ title: saleRes.event, cssIcon: 'icon-clipboard-check', callback: function (ev) { var saleId = saleList_GetSaleId(ev); showDialogEvent_SaleList(saleId, saleRes.event) } });

                        gridMenu.setOptions(optionArray);

                        tblRow.find('.check input').change(function () {
                            $(this).parents('.tbl-row.selected').removeClass('selected');
                            if ($(this).attr('checked')) $(this).parents('.tbl-row').addClass('selected');
                            showBtnTblSale();
                        });

                        $('.ravesh-grid tbody').append(tblRow.find('.tbl-row'));
                    };

                    if (rowdata.length > 0) {
                        var allPriceWithUnit_SaleList = GetCurrencyAndUnit(rowdata[0].TotalPrice);
                        $('#All_Price_SaleList').show().html(allPriceWithUnit_SaleList).attr('title', allPriceWithUnit_SaleList).attr('price', rowdata[0].TotalPrice);
                        $('#All_Count_SaleList').show().html(rowdata[0].TotalRow + ' ' + saleRes.sale).attr('title', rowdata[0].TotalRow + ' ' + saleRes.sale);
                    }
                    $("#commentComponentList").commentComponent("setCodeAttribute", 'saleId', 'saleTitle');
                }
                else if (c.d[0] == 0) { RaveshUI.errorToast(saleRes.error, saleRes.msg_error_act_done); $('#All_Price_SaleList,#All_Count_SaleList').show() }
                else $('#All_Price_SaleList,#All_Count_SaleList').show();
            }
            else {
                $('.SaleTitle .spinner').fadeOut();
                if (c.d[0] == 1) {
                    $("#SaleGetExcelFileLink").attr('href', c.d[1]);
                    setTimeout(function () { $("#SaleGetExcelFileLink")[0].click(); }, 200);
                }
                else {
                    $("#SaleGetExcelFileLink").attr('href', "#");
                    RaveshUI.errorToast(saleRes.error, c.d[1]);
                }
            }
        }
    });
};

function saleList_GetSaleId(ev) {
    var saleId = 0;
    try { var optId = $(ev.target).parents('.ravesh-menu').attr('class').split('ravesh_')[1].substr(0, 10); saleId = $('.elemravesh_' + optId).parents('.tbl-row').first().attr('saleid') } catch (e) { };
    return saleId;
};

function saleList_GetSaleData(ev) {
    var saleData = null;
    try {
        var optId = $(ev.target).parents('.ravesh-menu').attr('class').split('ravesh_')[1].substr(0, 10);
        saleData = $('.elemravesh_' + optId).parents('.tbl-row').first().attr('item');
        saleData = eval('(' + saleData + ')');
    } catch (e) { };
    return saleData;
};

function showBtnTblSale() {
    if ($('.ravesh-grid .tbl-row .check input:checked').length == $('.ravesh-grid .tbl-row .check input').length) $('.ravesh-grid .tr-head .check input').attr('checked', true);
    else $('.ravesh-grid .tr-head .check input').attr('checked', false);

    if ($('.ravesh-grid .tbl-row .check input:checked').length != 0) {
        $('.SaleChangeUserGroup').show();
        $('.SaleDeleteGroup').show();
    }
    else {
        $('.SaleChangeUserGroup').hide();
        $('.SaleDeleteGroup').hide();
    }
};

//pageing----------------------------------------------------------------------------------------------

$('.ravesh-grid-footer .grid-first').click(function () {
    var pageNum = parseFloat($('.page-num').val());
    var ab = pageNum != 1;
    if (ab) { pageNum = 1; $('.page-num').val(pageNum); bindSaleList(pageNum, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) };
    return ab;
});

$('.ravesh-grid-footer .grid-prev').click(function () {
    var pageNum = parseFloat($('.page-num').val());
    var ab = pageNum > 1;
    if (ab) { pageNum--; $('.page-num').val(pageNum); bindSaleList(pageNum, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) };
    return ab;
});

$('.ravesh-grid-footer .page-num').blur(function () {
    var pageCount = parseFloat($('.page-count').text());
    var pageNum = parseFloat($('.page-num').val());
    var ab = pageNum;
    if (ab < 1) ab = 1;
    if (ab > pageCount) ab = pageCount;
    $('.page-num').val(ab);
    if (ab != oldPageNum) { pageNum = ab; bindSaleList(pageNum, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) };
});

$('.ravesh-grid-footer .page-num').click(function () {
    this.select();
});

$('.ravesh-grid-footer .page-num').keypress(function () {
    return Sale_isNumber(event)
});

$('.ravesh-grid-footer .grid-next').click(function () {
    var pageCount = parseFloat($('.page-count').text());
    var pageNum = parseFloat($('.page-num').val());
    var ab = pageCount > pageNum;
    if (ab) { pageNum++; $('.page-num').val(pageNum); bindSaleList(pageNum, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) };
    return ab;
});

$('.ravesh-grid-footer .grid-last').click(function () {
    var pageCount = parseFloat($('.page-count').text());
    var pageNum = parseFloat($('.page-num').val());
    var ab = pageCount != pageNum;
    if (ab) { pageNum = pageCount; $('.page-num').val(pageNum); bindSaleList(pageNum, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn) };
    return ab;
});

$('.pageSizeSelector .option').live('click', function () {
    bindSaleList(1, $(this).attr('target'), saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn);
});

//gridSetting-------------------------------------------------------------------------------------------

$('#box-list .btn-setting').live('click', function () {
    $('#dialog_GridSetting .visibleRow').empty();
    $('#dialog_GridSetting .hideRow').empty();

    $('.ravesh-grid .tr-head .headcell').each(function () {
        if ($(this).hasClass('selectedCol')) $('#dialog_GridSetting .visibleRow').prepend('<div colid="' + $(this).attr('colid') + '" class="tbl-row"><i class="icon-arrows-v"></i><div title="' + $(this).find('> span').text() + '">' + $(this).find('> span').text() + '</div></div>');
        else $('#dialog_GridSetting .hideRow').prepend('<div colid="' + $(this).attr('colid') + '" class="tbl-row"><div title="' + $(this).find('> span').text() + '">' + $(this).find('> span').text() + '</div></div>')
    });

    var saleGridColDialog = RaveshUI.showDialog({ id: 'saleGridColDialog', title: saleRes.table_setting, detail: saleRes.show_wanted_column, icon: 'icon-cog', width: '600px', minWidth: 600 });
    var container = $('<div>').append($('#dialog_GridSetting').clone(true).attr('id', 'dialog_DivGridSetting')).html();
    saleGridColDialog.setContent(container);

    saleGridColDialog.addFooterButton(saleRes.ok, 'submit float', function () {
        var gridColumn = new Array();
        $('#dialog_DivGridSetting .visibleRow .tbl-row').each(function () { gridColumn.push($(this).attr('colid')) });
        createHeadOfList(saleRes.gridOrder, saleRes.gridOrderDir, gridColumn.join(','));
        bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, gridColumn.join(','));
        saleGridColDialog.close();
    });

    saleGridColDialog.addFooterButton(saleRes.cancel, 'float', function () { saleGridColDialog.close() });

    $('#dialog_DivGridSetting .visibleRow .tbl-row').live('click', function () { if ($('#dialog_DivGridSetting .visibleRow .tbl-row').length > 1) $(this).detach().appendTo('#dialog_DivGridSetting .hideRow'); });
    $('#dialog_DivGridSetting .hideRow .tbl-row').live('click', function () { $(this).detach().appendTo('#dialog_DivGridSetting .visibleRow') });

    $("#dialog_DivGridSetting .visibleRow").sortable({
        axis: "y",
        cursor: "s-resize",
        opacity: 0.4,
        items: "div.tbl-row",
        forcePlaceholderSize: true,
    }).disableSelection();

});

function saveGridSetting(pagesize, order, orderDir, gridColumn) {
    var colArr = new Array();
    $('.ravesh-grid .headcell').each(function () {
        colArr.push({ id: $(this).attr('colid'), selected: $(this).hasClass('selectedCol'), orderNum: $(this).attr('orderNum') })
    });

    var e = {};
    var q = {};
    e.domain = $('#HFdomain').val();
    e.user_code = $('#HFUserCode').val();
    e.codeing = $('#HFcodeDU').val();
    q.gridId = saleRes.gridId;
    q.gridName = 'Sale';
    q.gridSize = pagesize;
    q.order = order;
    q.orderDir = orderDir;
    q.gridColumn = colArr;
    e.SaveObj = q;

    $.ajax({
        url: "../WebServices/GridServices.asmx/Save_GrideSettings",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {
            if (c.d[0] == 1) {
                saleRes.gridId = c.d[1];
            }
        }
    });
};

//gridWorkflow------------------------------------------------------------------------------------------

function renderWf(tblRow, wfarr, won, id) {
    if (wfarr == undefined || wfarr == null) {
        tblRow.find('td:[colid="Percente"] div').html(0);
        tblRow.find('td:[colid="SaleStateTitle"] div').html("");
    }
    else {
        if (wfarr.length == 0) {
            tblRow.find('td:[colid="Percente"] div').html(0);;
            tblRow.find('td:[colid="SaleStateTitle"] div').html("");
        }
        else if (wfarr.length == 1) {
            tblRow.find('td:[colid="Percente"] div').html(wfarr[0].progress);
            var allTitle = wfarr[0].task_subject;
            if (allTitle == '' || allTitle == null)
                allTitle = wfarr[0].task_title;
            var shortTitle = allTitle;
            if (allTitle != null && allTitle != undefined) {
                if (allTitle.length > 25) shortTitle = allTitle.toString().substring(0, 25) + ' ... ';
            }
            
            if (won == 2) shortTitle = '<a class="WfSaleFailCommetLink" href="#" >' + shortTitle + '</a>';
            tblRow.find('td:[colid="SaleStateTitle"] div').html(shortTitle).attr('title', allTitle);
            tblRow.find('td:[colid="SaleStateTitle"] div .WfSaleFailCommetLink').click(function () {
                WfSaleFailCommet(id, $('#HFUserCode').val(), true);
                saleFailTagSetting();
                return false;
            });
            tblRow.find('.BtnChangeSaleState').attr('id_wfs', wfarr[0].id_wfs).attr('id_ts', wfarr[0].id_ts);
        }
        else if (wfarr.length > 1) {
            tblRow.find('td:[colid="Percente"] div').html(wfarr[0].progress);
            var allTitle = wfarr[0].task_subject;
            if (allTitle == '' || allTitle == null)
                allTitle = wfarr[0].task_title;
            var shortTitle = allTitle;
            if (allTitle != null && allTitle != undefined) {
                if (allTitle.length > 25) shortTitle = allTitle.toString().substring(0, 25) + ' ... ';
            }
            if (won == 2) shortTitle = '<a class="WfSaleFailCommetLink" href="#">' + shortTitle + '</a>';
            tblRow.find('td:[colid="SaleStateTitle"] div').html(shortTitle).attr('title', allTitle);
            tblRow.find('td:[colid="SaleStateTitle"] div .WfSaleFailCommetLink').click(function () {
                WfSaleFailCommet(id, $('#HFUserCode').val(), true);
                saleFailTagSetting();
                return false;
            });
            tblRow.find('.BtnChangeSaleState').attr('id_wfs', wfarr[0].id_wfs).attr('id_ts', wfarr[0].id_ts);
            tblRow.find('td:[colid="WorkflowState"] div').append('<span class="icon-caret-down ShowOthreRow" style="display: inline-block;font-size:17px;cursor:pointer;margin:5px;"></span>');
            tblRow.find('td:[colid="WorkflowState"] div').append('<span class="icon-caret-up HideOthreRow" onclick="HideWfNewRow(' + id + ',' + 'this);" style="display: none;font-size:17px;cursor:pointer;margin:5px;"></span>');
            tblRow.find('td:[colid="WorkflowState"] div').find(".ShowOthreRow").bind({ click: function () { ShowWfNewRow(tblRow, id, wfarr); return false } });
        }
    }
};

function ShowWfNewRow(tblRow, id, wflist) {
    for (var i = 1; i < wflist.length; i++) {
        var row = tblRow.clone(true);
        row.find('td:[colid="Percente"]').css('height', '20px').find('div').html(wflist[i].progress);
        if (wflist[i].id_task_start != null) row.find(".icon-workflow").css("font-size", "15px").addClass("fas");
        var allTitle = wflist[i].task_subject;
        if (allTitle == '' || allTitle == null) allTitle = wflist[i].task_title;
        var shortTitle = allTitle;
        if (allTitle != null && allTitle != undefined) { if (allTitle.length > 25) shortTitle = allTitle.toString().substring(0, 25) + ' ... '; };
        row.find('td:[colid="SaleStateTitle"] div').html(shortTitle).attr('title', allTitle);
        row.find('.BtneditSaleowners').parent().remove();
        row.find('.BtnCommenting').parent().remove();
        row.find('input[type=checkbox]').remove();
        row.find('.grid-row-actions').remove();
        row.find('.ShowOthreRow').remove();
        row.find('td').css('background-color', "#eee");
        row.attr('fake-tr', id);
        row.find('.BtnChangeSaleState').attr('id_wfs', wflist[i].id_wfs).attr('id_ts', wflist[i].id_ts);
        tblRow.after(row);
    };
    tblRow.find('td:[colid="WorkflowState"] div').find('.HideOthreRow').css('display', 'inline-block');
    tblRow.find('td:[colid="WorkflowState"] div').find(".ShowOthreRow").hide();
};

function HideWfNewRow(id, elem) {
    $('.ravesh-grid').find('.tbl-row:[fake-tr="' + id + '"]').remove();
    $(elem).parent().find('.ShowOthreRow').css('display', 'inline-block');
    $(elem).hide();
};

function showWfInfo_List(elem) {
    var id_wfs = $(elem).attr("id_wfs");
    var id_ts = $(elem).attr("id_ts");
    if (id_wfs != null && id_wfs != "" && id_wfs != undefined && id_ts != null && id_ts != "" && id_ts != undefined) {
        Workflow_Show_Info(id_wfs, id_ts, '');
        return false;
    }
};

//-------------------------------------------------------------------------------------------------------