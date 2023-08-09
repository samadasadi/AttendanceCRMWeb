
var productDialogList = null;
var productDialog = null;
var drdLeadSource = null;
var drdExtendedPropertis = null;
var drdLeadGenration = null;
var drdSaleUser = null;
var drdChangeWon = null;
var IntroductioncustCode = new Array();
var EditSale_STblItem = null;
var EditSale_ItemCode = 0;
var EditSale_allProductInGroup;
var EditStage = false;
var viewMode = 'edit';

$(document).ready(function () {

    var saleDir = saleRes.saleLang == 'fa' ? 'rtl' : 'ltr';

    $('#ReturnSaleList').click(function () {
        editSaleShowList();
    });

    $('#EditSaleSave').live('click', function () {
        if ($(this).hasClass('SaveSale')) saveEditSale($('.descriptionHead a.title').attr("iscopy"));
        else editSale($('.descriptionHead a.title').attr("Saleid"));
    });

    $('#EditSaleWf').click(function () {
        saleEditQuicViewWfInfo($(this).find('> i'));
    });

    $('.SaleEditProduct').click(function () {
        productDialogList = RaveshUI.showDialog({ id: 'SaleProductDialog', title: '', width: '700px', minWidth: 700 });
        if (viewMode == 'view') productDialogList.dialog.addClass('viewMode'); else productDialogList.dialog.removeClass('viewMode');
        var container = $('<div>').append($('.ProduvtDivEditSale').clone(true).attr('id', 'dialog_DivProductList')).html();
        productDialogList.setContent(container);
        productDialogList.dialog.find('.head').height(50).append('<span id="LnkAddProductRowEdit">' + saleRes.add_product + '</span>');
        productDialogList.dialog.find('.content').css('padding', '20px');
        productDialogList.addFooterButton(saleRes.ok, 'submit float', function () { SaveSaleProduct() });
        productDialogList.addFooterButton(saleRes.cancel, 'float', function () { productDialogList.close() });
        EditSale_ReCreateTblItems($('.SaleEditProduct').data('SaleItems'));
    });

    $('.descriptionHead a.title').click(function () {
        if (viewMode == 'copy') {
            RaveshUI.selectCustomerDialog(0, function (custData) {
                editSale_LoadCustomerinfo(custData.id);
                $('.descriptionHead a.title').text(custData.title).attr("custcode", custData.id);
                $('.SaleEditCustomerInfo .icon-external-link').attr("custcode", custData.id).attr("custname", custData.title);
                if (custData.picture == '' || custData.picture == null) { $('.descriptionHead .icon-customer').attr('title', custData.title).show() }
                else { $('.descriptionHead .icon-customer').hide(); $('.SaleCustomerPic').attr('title', custData.title).attr('src', custData.picture).show() };
                setTimeout(function () { $('.actionsContent,.valueRelatedItemsContent').css('visibility', 'visible'); }, 500);
            });
        }
        else
        {
            customer_Show_Info($(this).attr('custcode'), $(this).text());
            return false;
        }
    });

    $('.SaleEditCustomerInfo .icon-external-link').click(function () {
        window.location = 'cus.aspx?code=' + $(this).attr('custcode') + '&rnd_=' + $("#HFRnd").val();
        return false;
    });

    $('#LnkAddProductRowEdit').live('click' ,function () {
        EditSale_OpenPruductDialog('insert');
        EditSale_STblItem = null;
    });

    $('#EditSaleTab .tab-item').click(function () {
        if (!$(this).hasClass('active')) {
            $('#EditSaleTab .tab-item').removeClass('active');
            $('#EditSaleTabBoxes > div').hide();
            $(this).addClass('active');
            $('#box-' + $(this).attr('id')).fadeIn();
            $('#DivFactorPreview').empty();
            if ($(this).attr('id') == 'EditSaleFactor') {
                var storedocid = $("#TxtSaleEditFactor").attr('storedocid');
                bindFactor(storedocid, true);
            };
            if ($(this).attr('id') == 'EditSaleComments') { $("#SaleEdit_Comments").commentComponent("setCode", $('.descriptionHead a.title').attr("Saleid"), '') }
            if ($(this).attr('id') == 'EditSaleReminder') {
                var e = { control: '~/controls/reminder_uc.ascx', Mode: 3, Code: $('.descriptionHead a.title').attr("Saleid"), CustomerCode: 0 };
                $.ajax({
                    type: "POST",
                    url: "server_load_usercontrol.aspx/Get_usercontroler_reminder",
                    data: JSON.stringify(e),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (c) {
                        $('#SaleEdit_Reminder .form .fields').html(c.d); 
                        $('#SaleEdit_Reminder').find('#btnCancel').remove();
                        Ed_detail_UcRem[0].disable(false).refresh();
                    }
                });
            }
            return false;
        }
    });

    $('.EditSaleSolt').click(function () {
        if ($(this).parents('.SaleTitleEdit').hasClass('viewMode')) return false;
        $('.EditSaleSolt').removeClass('Selected').removeClass('th-color');
        $(this).addClass('Selected').addClass('th-color').prevAll().addClass('Selected').addClass('th-color');
        $('#EditSaleStage').attr('LastStageCode', $(this).attr('StageCode'));
        $('.EditSaleSolt').removeClass('Success').removeClass('Fail');
        if ($(this).hasClass('EndSuccess')) { $('.EditSaleSolt.Selected').addClass('Success'); $('#ChangeWonMenu span').text(saleRes.Successful).attr('won', 1); }
        else if ($(this).hasClass('EndFail')) { $('.EditSaleSolt.Selected').addClass('Fail'); $('#ChangeWonMenu span').text(saleRes.unsuccessful).attr('won', 2); }
    else $('#ChangeWonMenu span').text(saleRes.changeState).attr('won', 0);
        EditStage = true;
    });

    $('.TxtIntroductionCust').live('click', function () {
        RaveshUI.selectCustomerDialog(0, function (custData) {
            if (!IntroductioncustCode.includes(custData.id)) {
                var ext = ' - ';
                var custnamestring = $('.TxtIntroductionCust').val();
                if (custnamestring == '') ext = '';
                custnamestring += ext + custData.title;
                $('.TxtIntroductionCust').val(custnamestring);
                IntroductioncustCode.push(custData.id);
            }
        });
    });

    $('.SaleAddAttchment').click(function () {
        createUploadFile();
    });

    $("#TxtSaleEditFactor").selectItemComponent({
        modeSearch: 1,
        closedialogafterSelect: false,
        callback: function (data) {
            if (data != null && data != undefined) {
                if (data.Factor_Type != 3 && data.Factor_Type != null && data.Factor_Type != undefined) {
                    RaveshUI.warningToast(saleRes.only_salsefactore_allowed, '');
                    clearFactor();
                }
                else {
                    $("#TxtEditSaleFinalPrice").val(data.finalPrice);
                    $("#TxtEditSaleFinalDate").val(data.finalDate.toString().split('-')[0].replace(/ /g, ""));
                    $("#TxtSaleEditFactor").attr('storedocid', data.facId);
                    bindFactor(data.facId, false);
                    $('#UCdialog_searchFactor').dialog('close');
                }
            }
        }
    });

    $("#SaleEdit_Comments").commentComponent({
        mode: 1,
        width: '99%',
        height: 280,
        dialogWidth: 0,
        maxDataLoad: 3,
        expand: false,
        editable: true,
        removeable: true,
        changeOnlyMaster: false,
        textHeightGrowDuble: true,
        openDialog: false,
        sendByEnter: false,
        search: false
    });

    $('#TxtEditSaleFinalPrice,#TxtEditSaleForcastPrice').click(function () { $(this).select(); });

    $('#TxtEditSaleForcastDate,#TxtEditSaleForcastPrice').live('focus', function () { $(this).removeClass('error') });

    //----------------------------------------------------------------------------------

    drdLeadSource = new RaveshUI.Multiselect({ cssClass: 'TxtCustInfoEdit', width: 252, height: 20 });
    drdLeadSource.setItems(JSON.parse(saleRes.leadSourceType));
    $('.DrdLeadSourceType').append(drdLeadSource.getUI());

    drdExtendedPropertis = new RaveshUI.Multiselect({ cssClass: 'TxtSaleInfoEdit', width: 252, height: 20 });
    drdExtendedPropertis.setItems(JSON.parse(saleRes.extendedPropertisArr));
    $('.DrdExtendedpropertis').append(drdExtendedPropertis.getUI());

    drdLeadGenration = new RaveshUI.Multiselect({ cssClass: 'TxtSaleInfoEdit', width: 252, height: 20 });
    drdLeadGenration.setItems(JSON.parse(saleRes.leadGenration));
    $('.DrdLeadGenration').append(drdLeadGenration.getUI());

    drdSaleUser = new RaveshUI.selectUser({ dir: saleDir, width: 252, defaultTitle: saleRes.please_select });
    $('.DrdSaleUser').append(drdSaleUser.getUI());

    drdChangeWon = new RaveshUI.Menu($('#ChangeWonMenu'), {
        align: saleRes.saleLang == 'fa' ? 'right' : 'left',
        options: [
            {
                title: saleRes.Successful, cssIcon: 'icon-thumbs-up', callback: function () {
                    $('#ChangeWonMenu span').text(saleRes.Successful).attr('won', 1);
                    try { $('.EditSaleSolt.EndSuccess').trigger('click'); } catch (e) { };
                }
            },
            {
                title: saleRes.unsuccessful, cssIcon: 'icon-thumbs-down', callback: function () {
                    if ($('.EditSaleSolt.EndSuccess').hasClass('Success')) {
                        try { $('.EditSaleSolt.EndFail').trigger('click'); } catch (e) { };
                        return false;
                    }
                    $('.EditSaleSolt').removeClass('Success').removeClass('Fail');
                    $('.EditSaleSolt.Selected').addClass('Fail');
                    $('#ChangeWonMenu span').text(saleRes.unsuccessful).attr('won', 2);
                }
            }],
        marginTop: 8,
        cssClass: 'ChangeWonMenu'
    });

    //----------------------------------------------------------------------------------

    var dateFormat = "mm/dd/yy";
    if (saleRes.saleLang == 'en') $('#TxtEditSaleForcastDate').datepicker({ regional: '', dateFormat: dateFormat }); else $('#TxtEditSaleForcastDate').datepicker();
    if (saleRes.saleLang == 'en') $('#TxtEditSaleFinalDate').datepicker({ regional: '', dateFormat: dateFormat }); else $('#TxtEditSaleFinalDate').datepicker();

    //----------------------------------------------------------------------------------

    $('#txt_sale_add_tag').tagsInput({
        height: '35px',
        width: '100%',
        autocomplete_url: 'tag_autocomplete.ashx?domain=' + $('#HFdomain').val() + '&Owner=' + $('#HFUserCode').val() + '&TagTypeID=' + 6 + '&codeing=' + $('#HFcodeDU').val(),
        autocomplete: { minLength: 0, delay: 150, selectFirst: true, width: '100px', autoFill: true },
        removeWithBackspace: true,
        minChars: 2,
        maxChars: 100,
        defaultText: saleRes.add_tags,
        placeholderColor: '#888'
    });
    
    $('.SaleTag').click(function () {
        $('#SaleTagDiv').toggle();
        $('#txt_sale_add_tag_tag').val(saleRes.add_tags);
    });

    $('#txt_sale_add_tag_tagsinput').append('<a class="editSaleTag" onclick="manage_tags(TagTypeID.sale);return false">'+ saleRes.edit + ' ' + saleRes.tag +'</a>');

});

function editSale(saleId, view, access, isCopy) {
    if (saleId != 0 && saleId != '' && saleId != undefined && saleId != null) {
        $('#EditSaleSave').attr('disabled', false);
        EditStage = false;
        if (isCopy == undefined) isCopy = false;
        $('.SaleEditProduct').hide();
        $('.divSaleMain').hide();
        $('.SaleTitle').hide();
        $('#EditSaleStage').css('visibility', 'hidden');
        $('#EditSaleWf').hide();
        $('.divSaleMainEdit').show();
        $('.SaleTitleEdit').show();
        $('.LblEditAmountForcast').text(saleRes.amount_forcast + ' (' + AllSetting.UnitPrice + ')');
        $('.LblEditAmountFinal').text(saleRes.amount_final + ' (' + AllSetting.UnitPrice + ')');

        var e = { domain_: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), o: { id: saleId, SelectedUser: "0" } };
        $.ajax({
            type: "POST",
            url: "../WebServices/Sale_.asmx/get_sale_info",
            data: JSON.stringify(e),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                if (c.d[0] == 1) {
                    var data = c.d[1];
                    if (data != null) {
                        if (data.attachment_picture == '' || data.attachment_picture == null) { $('.descriptionHead .icon-customer').attr('title', data.CustomerName).show(); }
                        else { $('.descriptionHead .icon-customer').hide(); $('.SaleCustomerPic').attr('title', data.CustomerName).attr('src', data.attachment_picture).show(); }
                        setTimeout(function () { $('.actionsContent,.valueRelatedItemsContent').css('visibility', 'visible'); }, 500);
                        $('.descriptionHead a.title').text(data.CustomerName).attr("custcode", data.tcustomer_code).attr("Saleid", data.id).attr('regdate', data.regdate).attr('salestatetype', data.salestatetype).attr('owners', createOwnerString(data.Owners)).attr('iscopy', isCopy);
                        $('.SaleEditCustomerInfo .icon-external-link').attr("custcode", data.tcustomer_code).attr("custname", data.CustomerName)
                        $('#TxtEditSaleCode').val(data.id);
                        $('.SaleTag').attr('saleid', data.id);
                        if (data.saleamountapproximate != null && data.saleamountapproximate != undefined && data.saleamountapproximate !== "") {
                            $('.SaleEditPrice').text(GetCurrencyAndUnit(data.saleamountapproximate));
                            $('#TxtEditSaleForcastPrice').val(GetCurrency(data.saleamountapproximate));
                        }
                        else { $('.SaleEditPrice').text(0); $('#TxtEditSaleForcastPrice').val(0) };
                        $('.SaleEditUSer').text(data.Username);
                        editSale_LoadCustomerinfo(data.tcustomer_code);
                        $('.SaleEditProduct').data('SaleItems', data.SaleItems);
                        $('#TxtEditSaleForcastDate').val(data.saledateapproximate);
                        $("#TxtEditSaleDescrip").val(data.saledescription).trigger('input');
                        drdSaleUser.setSelectedById(data.user_code);
                        $("#TxtEditSaleFinalPrice").val(GetCurrency(data.saleamountfinal));
                        $("#TxtEditSaleFinalDate").val(data.salefinaldate);
                        if (data.SaleItems.length <= 0) $('.SaleEditProduct').text(saleRes.add_product);
                        else $('.SaleEditProduct').text(data.SaleItems.length + ' ' + saleRes.product_count);

                        //Process -------------------------------------------------------------------------------------------------
                        if (data.salestatetype == 0) {
                            if (data.Process.length > 0) {
                                $('#EditSaleStage').show();
                                $('#EditSaleStage').css('visibility', 'visible');
                                editSale_BindPipeline(data.Process[0].Id, data.SaleStateCode, data.won);
                            }
                        }
                        else {
                            $('#EditSaleStage').hide();
                            $('#EditSaleWf').show();
                            sqProcess = saleRes.workflow + ' <i class="icon-workflow" id_wfs="' + (data.workflowStartInfo == null ? 0 : data.workflowStartInfo.id_wfs) + '" id_ts="' + (data.workflowStartInfo == null ? 0 : data.workflowStartInfo.id_ts) + '"></i>';
                            $('#EditSaleWf').html(sqProcess).attr('title', sqProcess);
                        };

                        //LeadSource ----------------------------------------------------------------------------------------------
                        var selectedLeads = new Array();
                        IntroductioncustCode = new Array();
                        for (var i = 0; i < data.Leadsource.length; i++) {
                            if (data.Leadsource[i].Type == '1') IntroductioncustCode.push(data.Leadsource[i].Code);
                            else selectedLeads.push(data.Leadsource[i].Code);
                        };
                        $('.DrdLeadSourceType .TxtCustInfoEdit .item').remove();
                        if (saleRes.leadSourceType != "") drdLeadSource.setSelectedOptions(selectedLeads);

                        //Introduction--------------------------------------------------------------------------------------------------------
                        $('.TxtCustomerExpection').val(data.customerexpection);
                        var st = "";
                        var ext = ' - ';
                        for (var j = 0; j < data.Introductioncusts.length; j++) {
                            if (j == data.Introductioncusts.length - 1) ext = "";
                            st += data.Introductioncusts[j] + ext;
                        }
                        $('.TxtIntroductionCust').val(st);

                        //ExtendedPropertis --------------------------------------------------------------------------------------
                        var selectedProp = new Array();
                        for (var i = 0; i < data.ExtendedPropertis.length; i++) { selectedProp.push(data.ExtendedPropertis[i].Code) };
                        $('.DrdExtendedpropertis .TxtSaleInfoEdit .item').remove();
                        if (saleRes.extendedPropertisArr != "") drdExtendedPropertis.setSelectedOptions(selectedProp);

                        //LeadGenration ------------------------------------------------------------------------------------------
                        var selectedLeadGenration = new Array();
                        for (var i = 0; i < data.LeadGeneration.length; i++) { selectedLeadGenration.push(data.LeadGeneration[i].Id) };
                        $('.DrdLeadGenration .TxtSaleInfoEdit .item').remove();
                        if (saleRes.leadGenration != "") drdLeadGenration.setSelectedOptions(selectedLeadGenration);

                        //Attachments ---------------------------------------------------------------------------------------------
                        $('#box-EditSaleFile .ravesh-file-upload').remove();
                        var sf = data.SaleFiles;
                        if (sf.length == 0) createUploadFile();
                        for (var k = 0; k < sf.length; k++) { var upElem = createUploadFile(); upElem.setFile(sf[k].id, sf[k].TfileId, sf[k].FileName, sf[k].FileUrl) }; //setTimeout(function () {  },500, upElem)

                        //Factor----------------------------------------------------------------------------------------------------
                        $("#TxtSaleEditFactor").attr('storedocid', data.storedocid);
                        $("#TxtSaleEditFactor").selectItemComponent("set", data.storedocid, '', 1); //bara zamani ke be tab factor nemirim ama save mikonim;
                        if ($('#EditSaleTab .tab-item.active').attr('id') == 'EditSaleFactor') bindFactor(data.storedocid, true);

                        //Tags------------------------------------------------------------------------------------------------------
                       
                        if (data.SaleTags != undefined && data.SaleTags != null) {
                            for (t = 0; t < data.SaleTags.length; t++) {
                                var saleTagElem = $('<span>');
                                saleTagElem.text(data.SaleTags[t].TagName).addClass('saleTagElem');
                                if (data.SaleTags[t].Color != '') {
                                    var bgColor = data.SaleTags[t].Color.split(',')[0];
                                    var fontColor = data.SaleTags[t].Color.split(',')[1];
                                    if (bgColor != undefined && bgColor != '') saleTagElem.css('background-color', bgColor.replace(',', ''));
                                    if (fontColor != undefined && fontColor != '') saleTagElem.css('color', fontColor.replace(',', ''));
                                }
                                $('.SaleTagView').append(saleTagElem);
                            }
                        }
                        if (data.won == 2) EditSale_getFailTag(data.id);

                        //SetView------------------------------------------------------------------------------------------------------

                        if (view == undefined || isCopy) {
                            if (isCopy) { $('#EditSaleFile,#EditSaleComments,#EditSaleReminder').hide(); viewMode = 'copy' }
                            else viewMode = 'edit';
                            $('.SaleTitleEdit').removeClass('viewMode');
                            $('.divSaleMainEdit').removeClass('viewMode');
                            $('#EditSaleSave').removeClass('SaveSale').addClass('SaveSale').val(saleRes.save).show();
                            $('#ChangeWonMenu span').text(saleRes.changeState).attr('won', 0);
                            if (data.won == 1) $('#ChangeWonMenu span').text(saleRes.Successful).attr('won', 1);
                            if (data.won == 2) $('#ChangeWonMenu span').text(saleRes.unsuccessful).attr('won', 2);
                            $('.SaleEditProduct').show();
                            $('.SaleTag').show();
                            $('#SaleTagViewDiv').hide();
                            if (data.SaleTags != undefined && data.SaleTags != null) {
                                for (t = 0; t < data.SaleTags.length; t++) {
                                    $('#txt_sale_add_tag').addTag(data.SaleTags[t].TagName, '', data.SaleTags[t].TagID);
                                }
                            };
                        }
                        else {
                            viewMode = 'view';
                            $('.SaleTitleEdit').addClass('viewMode');
                            $('.divSaleMainEdit').addClass('viewMode');
                            $('#EditSaleSave').removeClass('SaveSale').val(saleRes.edit);
                            if (access == 'true') $('#EditSaleSave').show(); else $('#EditSaleSave').hide();
                            if (data.SaleFiles.length == 0) $('.ravesh-file-upload').hide();
                            if (data.SaleItems.length <= 0) $('.SaleEditProduct').hide(); else $('.SaleEditProduct').show();
                            $('.SaleTag').hide();
                            if ($('.SaleTagView .saleTagElem').length == 0) $('#SaleTagViewDiv').hide(); else $('#SaleTagViewDiv').show();
                        }
                    }
                }
            }
        });
    }
};

function saleEditQuicViewWfInfo(elem) {
    var sqid_wfs = $(elem).attr('id_wfs');
    var sqid_ts = $(elem).attr('id_ts');
    if (sqid_wfs != null && sqid_wfs != "" && sqid_wfs != undefined && sqid_ts != null && sqid_ts != "" && sqid_ts != undefined) {
        Workflow_Show_Info(sqid_wfs, sqid_ts, '');
        return false;
    }
};

function editSale_BindPipeline(ProcessId, LastStageCode, won) {
    $('.SaleTitleEdit .spinner').fadeIn();
    $('#EditSaleStage').empty();
    if (ProcessId == '' || ProcessId == undefined || ProcessId == 0) return false;
    if (LastStageCode == undefined || LastStageCode == '' || LastStageCode == null || LastStageCode == 0) LastStageCode = -1;

    var e = {};
    var q = {};
    q.ProcessId = ProcessId;
    e.Q_ = q;
    e.domain = $('#HFdomain').val();
    e.user_code = $('#HFUserCode').val();
    e.codeing = $('#HFcodeDU').val();

    $.ajax({
        url: "../WebServices/Sale_.asmx/Sale_getProcessStageById",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {
            if (c.d[0] == 1) {
                $('#EditSaleStage').empty();
                var Stages = c.d[1];
                $('.EditSaleSolt').removeClass('Selected').removeClass('th-color').removeClass('EndSuccess').removeClass('EndFail');;
                $('#EditSaleStage').attr('ProcessId', ProcessId);
                $('.EditSaleSolt').removeClass('Success').removeClass('Fail');

                for (i = 0; i <= Stages.length - 1 ; i++) {
                    var mainSolt = $('#CloneArea .EditSaleSolt').clone(true);
                    mainSolt.attr('StageCode', Stages[i].Code).attr('stagtitle', Stages[i].Title).appendTo($('#EditSaleStage').attr('LastStageCode', LastStageCode));
                    mainSolt.tooltiper(Stages[i].Title);
                    if (LastStageCode == -1) { if (i == 0) mainSolt.addClass('Selected').addClass('th-color') }
                    else $('.EditSaleSolt[StageCode=' + LastStageCode + ']').addClass('Selected').addClass('th-color').prevAll().addClass('Selected').addClass('th-color');

                    if (Stages[i].Title == 'پایان موفق' || Stages[i].Title == 'End success') { mainSolt.addClass('EndSuccess') }
                    else if (Stages[i].Title == 'پایان ناموفق' || Stages[i].Title == 'End fail') { mainSolt.addClass('EndFail') };
                };
                if (won == 1) $('.EditSaleSolt.Selected').addClass('Success');
                if (won == 2) $('.EditSaleSolt.Selected').addClass('Fail');
            }
            else if (c.d[0] == 0) { };
            $('.SaleTitleEdit .spinner').fadeOut();
        }
    });
};

function editSale_LoadCustomerinfo(customerId) {
    if (customerId != "" && customerId != null) {
        var cust_ = {
            domain: $('#HFdomain').val(),
            user_code: $('#HFUserCode').val(),
            codeing: $('#HFcodeDU').val(),
            cus_code: customerId,
            islogic: true,
            rnd: $("#HFRnd").val()
        };
        $(".SaleEditCustomerInfo .SaleEditCustFixDiv .spinner").show();
        $.ajax({
            type: "POST",
            url: "../WebServices/customer_service.asmx/get_customer_info",
            data: JSON.stringify(cust_),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (c) {
                $(".SaleEditCustomerInfo .SaleEditCustFixDiv .spinner").hide();
                $('.SaleEditCustFixDiv .ShowCustInfoRow').remove();
                $('.ShowCustInfoRow .TxtCustInfo').attr('disabled', true);
                var primaryField = c.d.primary_field;
                if (primaryField != null) {
                    for (var i = 0; i < primaryField.length; i++) {
                        var valueArr = primaryField[i].value.split('|*|');
                        for (var j = 0; j < valueArr.length; j++) {
                            var row = $('#CloneArea .ShowCustInfoRow').clone(true);
                            row.find('.LblCustInfoEdit').text(primaryField[i].parameter);
                            row.find('.TxtCustInfoEdit').val(valueArr[j].replace('|*|', '')).attr('paramId', primaryField[i].id).attr('code', primaryField[i].code).attr('mode', primaryField[i].mode).attr('ParamType', primaryField[i].type);
                            $('.SaleEditCustFixDiv').prepend(row);
                        }
                    }
                }
            }
        });
    }
};

function bindFactor(storedocid, setComponent) {
    if (storedocid != null && storedocid != "" && storedocid != undefined && storedocid != 0) {
        $('#DivFactorPreview').hide();
        $('#DivSaleEditFactor .spinner').show();
        var dto = { 'domain_': $('#HFdomain').val(), 'idDoc_': storedocid };
        $.ajax({
            url: "../WebServices/Store_.asmx/Store_GetFactorByID",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dto),
            success: function (c) {
                if (c.d != null && c.d != "" && c.d != undefined) {
                    var factorData = c.d;
                    if (setComponent) $("#TxtSaleEditFactor").selectItemComponent("set", storedocid, factorData.factor.code, 1);
                    $('#TxtEditSaleFinalPrice').attr('disabled', true);
                    //----------------------------------------------------------------------------------------------------------
                    showfactorInfo(storedocid, '', false, '#DivFactorPreview');
                    setTimeout(function () {
                        $('#DivSaleEditFactor .spinner').hide();
                        $('#DivFactorPreview').fadeIn();
                        try { rcrmSetHeight() } catch (e) { }
                    }, 900);
                }
                else clearFactor();
            }
        });
    }
    else clearFactor();
}

function editSaleShowList() {
    $('.divSaleMainEdit').hide();
    $('.SaleTitleEdit').hide();
    $('.divSaleMain').show();
    $('.SaleTitle').show();
    clearEditPage();
    if (viewType == 'pipeline') try { $('a[tabid=box-pipeline]').trigger('click'); bindPipeline(); } catch (e) { }
    if (viewType == 'list') try { $('a[tabid=box-list]').trigger('click'); bindSaleList(1, saleRes.gridSize, saleRes.gridOrder, saleRes.gridOrderDir, saleRes.gridColumn); } catch (e) { }
};

function clearEditPage() {
    $('#EditSaleInfo').trigger('click');
    $('.SaleEditCustFixDiv .ShowCustInfoRow').remove();
    $('.actionsContent,.valueRelatedItemsContent').css('visibility', 'hidden');
    $('.descriptionHead .icon-customer').hide();
    $('.SaleCustomerPic').hide().attr('src', '');
    $('#EditSaleStage').empty();
    clearFactor();
    $('#SaleEdit_Comments .cCompTxtComment').attr('ccompcommentid', '0').html('');
    $('#TxtEditSaleForcastDate,#TxtEditSaleForcastPrice').removeClass('error');
    $('#SaleTagDiv').hide();
    $('#SaleTagViewDiv').hide();
    $('#SaleTagDiv .tag').remove();
    $('.SaleTagView').empty();
    $('#EditSaleFile,#EditSaleComments,#EditSaleReminder').show();
    $('.EditSaleFailContiner').empty();
    $('.EditSaleFailDiv').hide();
};

function clearFactor() {
    $("#TxtSaleEditFactor").attr('storedocid', '');
    $("#TxtSaleEditFactor").selectItemComponent("clear");
    $('#TxtSaleAmountFinal').attr('disabled', false);
    $('#DivFactorPreview').empty();
};

function saveEditSale(isCopy) {
    $('#EditSaleSave').attr('disabled', true);
    $('.SaleTitleEdit .spinner').show();

    var LeadsourcesArr = new Array();
    for (var i = 0; i < IntroductioncustCode.length; i++) { LeadsourcesArr.push({ "Type": 1, "Code": IntroductioncustCode[i] }) }
    var drdLeadSourceArr = drdLeadSource.getSelectedOptions();
    $(drdLeadSourceArr).each(function () { LeadsourcesArr.push({ "Type": 2, "Code": Number(this) }) });

    var ProcessArr = new Array();
    var ProcessId = $('#EditSaleStage').attr('ProcessId');
    if (ProcessId != null && ProcessId != undefined && ProcessId != "" && ProcessId != '-1') ProcessArr.push(ProcessId);

    var LastStageCode = $('#EditSaleStage').attr('laststagecode');
    if (LastStageCode == undefined || LastStageCode == '' || LastStageCode == null || LastStageCode == 0) LastStageCode = -1;

    var Won = 0;
    try {
        if ($('.descriptionHead a.title').attr('salestatetype') == 0) {
            var EndTitle = "";
            var lastStateElem = $('.EditSaleSolt[stagecode=' + $('#EditSaleStage').attr('laststagecode') + ']');
            if (lastStateElem.length > 0) {
                if (lastStateElem.hasClass('Success')) Won = 1;
                else if (lastStateElem.hasClass('Fail')) Won = 2;
            }
        } else Won = $('#ChangeWonMenu span').attr('won');
    } catch (e) { };

    var ProductArr = new Array();
    $($('.SaleEditProduct').data('SaleItems')).each(function (i, data) {
        Productobj = {
            'codeproduct': data.codeproduct,
            'idStore': data.idStore,
            'idGroup': data.idGroup,
            'nameGroup': data.nameGroup,
            'ProductId': data.idproduct,
            'productName': data.productName,
            'count': data.count,
            'idPrice': data.idPrice,
            'price_s': data.price_s,
            'unit': data.unit,
        };
        ProductArr.push(Productobj);
    });

    var factobj = $("#TxtSaleEditFactor").selectItemComponent("get");
    var factobjid = 0;
    if (factobj.id != null && factobj.id != undefined) factobjid = factobj.id;

    var tagNames = '';
    var tagIds = '';
    if ($('#txt_sale_add_tag_tag').val() != saleRes.add_tags) tagNames = $('#txt_sale_add_tag_tag').val();
    $(".tagsinput .tag").each(function (index) {
        if (tagNames != "") tagNames += ","
        if (tagIds != "") tagIds += ","
        tagNames += $(this).find('span').text().trim();
        tagIds += $(this).find('.IDTag').val();
    });

    SaveObj = {
        "SaleId": $('.descriptionHead a.title').attr("Saleid"),
        "Tcustomercode": $('.descriptionHead a.title').attr('custcode'),
        "CustomerExpection": $('.TxtCustomerExpection').val(),
        "SaleDateApproximate": $("#TxtEditSaleForcastDate").val(),
        "SaleAmountApproximate": $("#TxtEditSaleForcastPrice").val() == '' ? 0 : $("#TxtEditSaleForcastPrice").val().toString().replace(/,/gi, ''),
        "User": drdSaleUser.getSelectedOption().id != '' ? drdSaleUser.getSelectedOption().id : $('#HFUserCode').val(),
        "SaleDescription": $("#TxtEditSaleDescrip").val(),
        "Products": ProductArr,
        "Won": Won,
        "SaleAmountFinal": $("#TxtEditSaleFinalPrice").val() == '' ? 0 : $("#TxtEditSaleFinalPrice").val().toString().replace(/,/gi, ''),
        "SaleFinalDate": $("#TxtEditSaleFinalDate").val(),
        "RegDate": $('.descriptionHead a.title').attr('regdate'),
        "SaleStateType": $('.descriptionHead a.title').attr('salestatetype'),
        "Process": ProcessArr,
        "StageCode": LastStageCode,
        "Leadsources": LeadsourcesArr,
        "ExtendedPropertis": drdExtendedPropertis.getSelectedOptions(),
        "LeadGenrations": drdLeadGenration.getSelectedOptions(),
        "StoreDocId": factobjid == "" ? 0 : factobjid,
        "SaleAmountUnit": '',
        "EditProccess": false,
        "EditStage": EditStage,
        "Owners": $('.descriptionHead a.title').attr("owners"),
        "tagNames": tagNames,
        "tagIds": tagIds,
        "deleteTags": $('#SaleTagDiv .DeleteTags').attr("deletetagsid")
    };

    var Valid = editSale_ValidateChanges(SaveObj);
    if (Valid.success) {
        var Url = "../WebServices/Sale_.asmx/UpdateSales_";
        if (isCopy == 'true') {
            Url = "../WebServices/Sale_.asmx/SaveSales_";
            SaveObj.RunWorkflowId = -1;
            SaveObj.wfid = 0;
            SaveObj.RegDate = saleRes.nowDate;
        }
        var dto = { "SaveObj": SaveObj, "domain": $('#HFdomain').val(), "user_code": $('#HFUserCode').val(), "codeing": $('#HFcodeDU').val() };
        $.ajax({
            url: Url,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(dto),
            success: function (c) {
                var result = c.d;
                if (isCopy == 'true') result = c.d[1];
                $('.SaleTitleEdit .spinner').hide();
                if ($(result).hasClass('message-success')) RaveshUI.successToast(saleRes.successful, (isCopy == 'true' ? saleRes.msg_done_save : saleRes.msg_done_edit));
                else if ($(result).hasClass('message-error')) RaveshUI.errorToast(saleRes.error, saleRes.msg_error_edit);
                else if ($(result).hasClass('message-warning')) RaveshUI.warningToast(saleRes.error, $(c.d).find('.text').text());
                editSaleShowList();
                if (Won == 2) {
                    WfSaleFailCommet(SaveObj.SaleId, $('#HFUserCode').val(), true);
                    saleFailTagSetting();
                }
                setTimeout(function () { $('#EditSaleSave').attr('disabled', false); }, 1000);
                return false;
            }
        });
    }
    else {
        $('#EditSaleSave').attr('disabled', false);
        $('.SaleTitleEdit .spinner').hide();
        $.each(Valid.message, function (i, msg) { RaveshUI.warningToast('', msg) });
        return false;
    }
};

function editSale_ValidateChanges(SaveObj) {
    valid = { success: true, message: new Array() };
    if (SaveObj.Tcustomercode == "0") { valid.success = false; valid.message.push(saleRes.msg_warning_sp_customer) }
    if (SaveObj.SaleDateApproximate == "") { valid.success = false; $('#TxtEditSaleForcastDate').addClass('error') }
    if (SaveObj.SaleAmountApproximate == "") { valid.success = false; $('#TxtEditSaleForcastPrice').addClass('error') }
    if (SaveObj.SaleStateType == "0" && SaveObj.Process.length <= 0) { valid.success = false; valid.message.push(saleRes.msg_error_process) };
    if (SaveObj.SaleAmountApproximate == "" || SaveObj.SaleDateApproximate == "") { valid.message.push(saleRes.empty_fields); };
    return valid;
};

function createOwnerString(OwnerArr) {
    var ret = '';
    if (OwnerArr != null && OwnerArr != undefined) {
        if (OwnerArr.length > 0) {
            var ownerStringArr = new Array();
            for (var i = 0; i < OwnerArr.length; i++) { ownerStringArr.push(OwnerArr[i].UserName + '#' + OwnerArr[i].User_code + '#' + OwnerArr[i].Access) };
            ret = ownerStringArr.join(',');
        }
    }
    return ret
};

function createInsertFieldUI(data, seleRes) {
    var that = this;
    var container = $('<div>').addClass('ravesh-file-upload form-input');
    var selectedFile = null;
    var uploadForm;
    var uploadFile;
    var accept = "";

    that.setOption = function () {

        var defaultProperty = {
            width: 'medium',
            defaultValue: '',
            fileType: 'image', // file | image
            fileLength: '1mb'
        }
        data.property = $.extend(true, defaultProperty, data);

        accept = (function () {
            switch (data.property.fileType) {
                case 'image': return 'image/*';
                case 'sound': return 'audio/*';
                case 'video': return 'video/*';
                case 'pdf': return 'application/pdf';
            }
            return '';
        })();

        var id = FormUtility.randomId('file');
        container.empty().attr('id', id);
        var iconUpload = $('<div>');
        var dragHere = $('<span>').addClass('drag-here').text(seleRes.dragFile);
        var btnSelect = $('<a>').attr({ 'href': '#' }).text(seleRes.please_select);
        var btnDownload = $('<a>').attr({ 'href': '#', target: '_blank' }).text(seleRes.view).hide();
        var btnCancel = $('<span>').css({ 'text-decoration': 'underline', 'cursor': 'pointer', 'margin': '0 10px' }).attr({ 'sale_fileid': '', 't_fileid': '' }).text(seleRes.remove).hide();
        var previewImg = $('<img>').hide();
        var spinner = $('<div>').attr({ 'class': 'spinner' }).hide();
        uploadForm = $('<form>').attr({ 'id': 'frm_fileUploadSale' + id, 'action': 'upload_fileManager.ashx?d=' + $('#HFdomain').val() + '&u=' + $('#HFUserCode').val() + '&c=' + $('#HFcodeDU').val() + "&t=3", 'method': 'post', 'enctype': 'multipart/form-data' });
        uploadFile = $('<input>').attr({ 'id': 'fileUploadSale' + id, 'name': 'fileUploadSale' + id + '_', 'type': 'file', accept: accept }).hide();
        uploadFile.appendTo(uploadForm);
        container.append(iconUpload, spinner, previewImg, dragHere, btnCancel, '&nbsp;', btnSelect, btnDownload, uploadForm);

        if (that.isApp) {
            dragHere.remove();
            iconUpload.remove();
            btnDownload.remove();
            btnSelect.addClass('ravesh-button float-right');
            btnCancel.addClass('ravesh-button float-right');
        }

        container.bind('dragover', function (ev) {
            if (data.property.disable) return false;
            ev.stopPropagation();
            ev.preventDefault();
            container.addClass('active');
        });

        container.bind('drop', function (ev) {
            if (data.property.disable) return false;
            ev.stopPropagation();
            ev.preventDefault();
            container.removeClass('active');

            var files = ev.originalEvent.dataTransfer.files;
            uploadFile[0].files = files;
            that.setFileName(files[0]);
        });

        btnSelect.click(function () {
            if (data.property.disable) return false;
            if (!that.isApp) {
                uploadFile.click();
            }
            else appMng.showInput(data.id, "", function (value, title) {
                that.setFileName(value, title);
            });
            return false;
        });

        btnCancel.click(function () {
            data.property.disable = false;
            that.setFileName(null);
            uploadFile.val('');

            var TfileId = btnCancel.attr('t_fileid');
            if (TfileId != '' && TfileId != null && TfileId != undefined) {
                var dto = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { id: TfileId } };
                $.ajax({
                    url: "../WebServices/fileManager_.asmx/delete_files",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(dto),
                    success: function (c) {
                        if (c.d[0] != "error") {
                            btnDownload.attr("href", '#').html(seleRes.view);
                            btnCancel.attr('t_fileid', '');
                        }
                    }
                });
            }

            var Delid = btnCancel.attr('sale_fileid');
            if (Delid != '' && Delid != null && Delid != undefined) {
                var delObj = { domain: $('#HFdomain').val(), user_code: $('#HFUserCode').val(), codeing: $('#HFcodeDU').val(), 'Delid': Delid };
                $.ajax({
                    url: "../WebServices/Sale_.asmx/DeleteSaleFiles_",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(delObj),
                    success: function (c) {
                        if (c.d[0] == 1) {
                            RaveshUI.successToast(saleRes.successful, seleRes.msg_delete_attach_done);
                            btnCancel.attr('sale_fileid', '');
                            try { btnCancel.parents('.ravesh-file-upload').first().remove() } catch (e) { };
                        }
                        else { RaveshUI.errorToast(saleRes.error, c.d[1]); }
                    }
                });
            }

        });

        uploadFile.change(function () {
            if (data.property.disable) return false;
            that.setFileName(uploadFile[0].files[0]);
        });

        that.setFileName = function (file, title) {
            btnDownload.hide();
            btnCancel.hide();
            previewImg.hide();
            dragHere.show();
            btnSelect.show();
            iconUpload.show();

            if (file == null) {
                selectedFile = null;
                that.toggleError(false);
            }
            else {
                selectedFile = file;
                btnSelect.hide();
                btnCancel.show();
                dragHere.hide();
                if (file.name) {
                    var error = that.checkValid().error;
                    that.toggleError(error, error);
                    if (that.checkValid().valid) {
                        uploadForm.ajaxForm({
                            beforeSend: function () { iconUpload.hide(); spinner.show(); previewImg.show(); },
                            complete: function (c) {
                                iconUpload.show(); previewImg.hide(); spinner.hide();
                                var result = JSON.parse(c.responseText)
                                if (result[0] == 'success') {
                                    var dto = { "SaveObj": { SaleId: $('.descriptionHead a.title').attr("Saleid"), TfileId: result[1][0][0], fileName: result[1][0][2] }, "domain": $('#HFdomain').val(), "user_code": $('#HFUserCode').val(), "codeing": $('#HFcodeDU').val() };
                                    $.ajax({
                                        url: "../WebServices/Sale_.asmx/SaveSaleFiles_",
                                        type: "POST",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data: JSON.stringify(dto),
                                        success: function (c) {
                                            if (c.d[0] == 1) {
                                                RaveshUI.successToast(saleRes.successful, result[1][0][1]);
                                                btnDownload.attr("href", result[1][0][3]).html(result[1][0][2]).show();
                                                btnCancel.attr('sale_fileid', c.d[1]).attr('t_fileid', result[1][0][0]);
                                                data.property.disable = true;
                                            }
                                            else { RaveshUI.errorToast(saleRes.error, '') }
                                        }
                                    });
                                }
                                else if (result[0] == 'error') { RaveshUI.errorToast(saleRes.error, result[1][0][1]) }
                            },
                            error: function (c) { }
                        });
                        uploadForm.submit();
                    }
                }
                else { btnDownload.attr("href", title).html(saleRes.view).show(); data.property.disable = true }
            }
        };

        that.toggleError = function (enable, message) {
            if (enable) RaveshUI.errorToast(FormUtility.numberLocalize(message), '');
        };

        that.setFile = function (SaleFileId, TFileId, FileNAme, FileUrl) {
            btnSelect.hide();
            dragHere.hide();
            btnDownload.attr("href", FileUrl).html(FileNAme).show();
            btnCancel.attr('sale_fileid', SaleFileId).attr('t_fileid', TFileId).show();
            data.property.disable = true;
        };

        var removeActiveClass = function () {
            container.removeClass('active');
            if ($('#' + id).length == 0) $(window).unbind('dragover', removeActiveClass);
        }
        $(window).bind('dragover', removeActiveClass);
    }

    that.getUI = function () {
        that.setOption();
        return container;
    }

    that.setWidth = function (mode, width) {
        container.css({ 'width': width, 'max-width': '100%' });
    }

    that.setDisable = function (enable) {
        container.toggleClass('disabled', enable);
        uploadFile.attr('disabled', enable);
    }

    that.setValue = function (value) {
        that.setFileName(value.value, value.title);
    }

    that.setFile = function (SaleFileId, TFileId, FileNAme, FileUrl) {
        that.setFile(SaleFileId, TFileId, FileNAme, FileUrl);
    }

    that.getValue = function () {
        return { title: '', value: selectedFile || '', number: 0 }
    }

    that.checkValid = function () {
        if (selectedFile == null) return { valid: false, error: false };
        if (selectedFile.type == null) return { valid: false, error: false };

        // check file type
        if (data.property.fileType == 'pdf') { if (!selectedFile.type == 'application/pdf') return { valid: false, error: saleRes.fileExtensionNotValid } }
        else { if (!selectedFile.type.match(accept.replace('/', '.'))) return { valid: false, error: saleRes.fileExtensionNotValid } }

        // check file length
        var length = parseInt(data.property.fileLength.replace("kb", "").replace("mb", "")) * 1024
        if (data.property.fileLength.indexOf("mb") != -1) length *= 1024;
        if (selectedFile.size > length) return { valid: false, error: saleRes.fileSizeNotValid };

        return { valid: true, error: false };
    }
};

function createUploadFile() {
    var saleAttchFile = new createInsertFieldUI({ fileType: 'file' }, saleRes);
    (saleAttchFile.getUI()).insertBefore($('.SaleAddAttchment'));
    return saleAttchFile;
};

function EditSale_getFailTag(SaleId) {
    $('.EditSaleFailContiner').empty();
    var dto = { "d": $('#HFdomain').val(), "u": $('#HFUserCode').val(), "c": $('#HFcodeDU').val(), "SaleId": SaleId };
    var Send_ = { 'Searchobj': dto }
    $.ajax({
        url: "../WebServices/Sale_.asmx/GetTags_",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(Send_),
        success: function (c) {
            if (c.d[0] == true) {
                var tags = c.d[1];
                if (tags != null && tags != undefined) {
                    if (tags.length > 0) $('.EditSaleFailDiv').show();
                    for (i = 0; i < tags.length; i += 1) {
                        $('.EditSaleFailContiner').append('<span class="tag" title="' + tags[i].TagName + '"><span>' + tags[i].TagName + '</span></span>');
                    };
                }
            }
        }
    });
};

//Product -------------------------------------------------------------------------

function EditSale_OpenPruductDialog(saveType) {
    productDialog = RaveshUI.showDialog({
        id: 'productDialog',
        title: saleRes.product,
        width: '420',
        minWidth: 420,
        closeMethods: ['escape'],
        onClose: function () { $('.positionHelper').hide(); $('body').removeClass('ravesh-dialog-opened'); }
    });
    var container = $('<div>').append($('#dialog_docItemEditSale').clone(true).show().attr('id', 'dialog_DivPruduct')).html();
    productDialog.setContent(container);
    $('body').removeClass('ravesh-dialog-opened').addClass('ravesh-dialog-opened');
    if (saveType == 'insert') productDialog.addFooterButton(saleRes.adding, 'submit float AddSaleProduct', function () { EditSale_BtnAddItem(); return false });
    else productDialog.addFooterButton(saleRes.edit, 'submit float EditSaleProduct', function () { EditSale_BtnEditItem(); return false });
    productDialog.addFooterButton(saleRes.cancel, 'float', function () { EditSale_STblItem = null; productDialog.close(); });
    var dialog = productDialog.dialog;

    dialog.find('#hierarchybreadcrumb2EditSale').menuA({
        content: dialog.find('#hierarchybreadcrumb2EditSale').next().html(),
        backLink: false
    });

    dialog.find('#DrdProductItemEditSale').change(function () {
        var data = EditSale_GetProductDetail($(this).val());
        if (data != null && data != undefined) {
            EditSale_ItemCode = data.codeproduct;
            try { dialog.find('.EditSaleItemUnit').text(data.unit) } catch (e) { };
            var price = data.otPrices;
            if (price.length > 0) {
                var idPrice = price[0].value;
                price = price[0].price;
                if (price != "" && price != null && price != undefined) {
                    if (saleRes.saleLang == "fa") price = GetCurrency(price);
                    dialog.find('#TxtPrice_sItemEditSale').val(price).attr('idprice', idPrice);
                }
            };
        }
        else EditSale_clearProductrDialog();
    });

    dialog.find("#DrdProductItemEditSale").multiselect({
        minWidth: '180px',
        multiple: false,
        selectedList: 1,
        classes: 'right_left',
        noneSelectedText: saleRes.please_select,
    }).multiselectfilter({ placeholder: saleRes.name + ' ' + saleRes.product, width: '105', label: saleRes.search, codeAttrbiutName: "codeproduct", propertiAttrbiutName: "productproperty" });

};

function EditSale_product_group(code, name, domain) {
    EditSale_GetProductInGroup(code, name, domain, 0, 0);
};

function EditSale_GetProductInGroup(code, name, domain, idproduct, idprice) {
    EditSale_clearProductrDialog();
    var e = {};
    e.domain_ = domain;
    e.idgroup = code;
    e.id_user_ = e.id_user_ = $('#HFUserCode').val();
    $.ajax({
        url: "../WebServices/Store_.asmx/store_getProduct",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(e),
        success: function (c) {
            productDialog.dialog.find('#DrdProductItemEditSale').html('<option value="0">' + saleRes.please_select + '</option>');
            $.each(c.d, function (val, text) {
                if (this.enable == true) {
                    if (text.PrColumn != undefined && text.PrColumn != null) propertyStr = Enumerable.from(text.PrColumn).select(function (w) { return w.content }).toArray().join(',');
                    productDialog.dialog.find('#DrdProductItemEditSale').append($('<option codeproduct="' + text.codeproduct + '" productproperty="' + propertyStr + '"></option>').val(text.id).html(text.name));
                }
            });
            EditSale_allProductInGroup = c.d;
            try {
                if (idproduct != 0) productDialog.dialog.find('#DrdProductItemEditSale').val(idproduct).attr('selected', "selected");
                productDialog.dialog.find('#HFidGroup_EditSale').val(code);
                productDialog.dialog.find('#HFnameGroup_EditSale').val(name);
                productDialog.dialog.find('#hierarchybreadcrumb2EditSale').text(name);
            } catch (e) { }
            productDialog.dialog.find("#DrdProductItemEditSale").multiselect('refresh');
        }
    });
};

function EditSale_GetProductDetail(idproduct) {
    if (idproduct != 0) {
        var product;
        for (i = 0; i <= EditSale_allProductInGroup.length; i++) {
            if (EditSale_allProductInGroup[i].id == idproduct) {
                var product = EditSale_allProductInGroup[i];
                break;
            }
        }
        return product;
    }
    else return null;
};

function EditSale_BtnAddItem() {
    if (!EditSale_validData_DialogDoc()) return false;
    $('.AddSaleProduct').attr('disabled', true);
    setTimeout(function () { $('.AddSaleProduct').attr('disabled', false); }, 1500);
    productDialog.close();
    EditSale_AddItem('#dialog_DivProductList #tblDocItemEditSale tr:last', 'tblrow' + $('#dialog_DivProductList #tblDocItemEditSale tr').length);
};

function EditSale_BtnEditItem() {
    if (!EditSale_validData_DialogDoc()) return false;
    $('.EditSaleProduct').attr('disabled', true);
    setTimeout(function () { $('.EditSaleProduct').attr('disabled', false); }, 1500);
    var PreRow = $('#' + $('#HFforUpdateEditSale').val()).prev();
    $('#' + $('#HFforUpdateEditSale').val()).remove();
    EditSale_AddItem(PreRow, $('#HFforUpdateEditSale').val());
    productDialog.close();
};

function EditSale_validData_DialogDoc() {
    var msg = '';
    if (productDialog.dialog.find('#TxtPrice_sItemEditSale').val() == null || productDialog.dialog.find('#TxtPrice_sItemEditSale').val() == '') msg = saleRes.msg_error_price_sell;
    if (productDialog.dialog.find('#TxtCountItemEditSale').val() == null || productDialog.dialog.find('#TxtCountItemEditSale').val() <= 0) msg = saleRes.msg_error_product_count;
    if (productDialog.dialog.find('#DrdProductItemEditSale').find("option:selected").val() == null || productDialog.dialog.find('#DrdProductItemEditSale').find("option:selected").val() == 0) msg = saleRes.msg_error_product_select;
    if (productDialog.dialog.find('#HFidGroup_EditSale').val() == null || productDialog.dialog.find('#HFidGroup_EditSale').val() == '' || productDialog.dialog.find('#HFidGroup_EditSale').val() == 0) msg = saleRes.msg_warning_group_select;
    if (msg == '') return true;
    else { RaveshUI.warningToast('', msg); return false };
};

function EditSale_AddItem(place, idrow) { //insert new item
    productDialog.dialog.find('.money').each(function () { $(this).val($(this).val().replace(/,/gi, '')) });
    var objTblItem = new Object;
    objTblItem.id = (EditSale_STblItem != null) ? EditSale_STblItem.id : 0;
    objTblItem.codeproduct = EditSale_ItemCode;
    objTblItem.idStore = productDialog.dialog.find('#DrdStoreItemEditSale').find("option:selected").val();
    objTblItem.idGroup = productDialog.dialog.find('#HFidGroup_EditSale').val();
    objTblItem.nameGroup = productDialog.dialog.find('#HFnameGroup_EditSale').val();
    objTblItem.idproduct = productDialog.dialog.find('#DrdProductItemEditSale').find("option:selected").val();
    objTblItem.productName = productDialog.dialog.find('#DrdProductItemEditSale').find("option:selected").text();
    objTblItem.price_s = productDialog.dialog.find('#TxtPrice_sItemEditSale').val().replace(/,/gi, '');
    objTblItem.idPrice = productDialog.dialog.find('#TxtPrice_sItemEditSale').attr('idprice');
    objTblItem.count = productDialog.dialog.find('#TxtCountItemEditSale').val();
    objTblItem.unit = productDialog.dialog.find('.EditSaleItemUnit').text();
    EditSale_AddRowInTblItem(place, idrow, objTblItem);
    EditSale_STblItem = null;
};

function EditSale_clearProductrDialog() {
    productDialog.dialog.find('#TxtPrice_sItemEditSale').val('');
    productDialog.dialog.find('#TxtPrice_sItemEditSale').attr('idprice', '');
    productDialog.dialog.find('#TxtCountItemEditSale').val('');
    productDialog.dialog.find('.EditSaleItemUnit').text('');
    productDialog.dialog.find(".mydds").msDropDown().data("dd");
    if (AllSetting.UnitPrice != null && AllSetting.UnitPrice != undefined) productDialog.dialog.find('.EditSalePriceUnit').text(AllSetting.UnitPrice)
};

function EditSale_ReCreateTblItems(data) {
    if (data != null) {
        if (data.length == 0) $('#dialog_DivProductList.ProduvtDivEditSale').hide(); else $('#dialog_DivProductList.ProduvtDivEditSale').show();
        $('#dialog_DivProductList #tblDocItemEditSale tr').each(function (i, row) {
            if (i != 0) $(row).remove();
        });
        for (var i = 0; i <= data.length - 1; i++) {
            EditSale_AddRowInTblItem('#dialog_DivProductList #tblDocItemEditSale tr:last', 'tblrow' + (Number(i + 1)).toString(), data[i]);
        };
    }
};

function EditSale_AddRowInTblItem(place, idrow, objTblItem) {
    if ($('#dialog_DivProductList #tblDocItemEditSale tr').length == 0) $('#dialog_DivProductList #tblDocItemEditSale').append('<tr><th width="50px" class="center" >' + saleRes.row + '</th><th class="center" width="50px">' + saleRes.code + '</th><th class="center" width="250px">' + saleRes.name + " " + saleRes.product + '</th><th class="center" width="80px">' + saleRes.count + '</th><th class="center" width="120px">' + saleRes.price_sell + '</th><th class="center" width="150px">' + saleRes.total_price + '</th><th width="40" class="center" >' + saleRes.remove + '</th><th width="40" class="center" >' + saleRes.edit + '</th></tr>');
    var HFRowData = "<input name=\'HidRowDataEditSale\' id=\'HidRowDataEditSale\' type=\'hidden\' value='" + JSON.stringify(objTblItem) + "' />"

    $(place).after('<tr id=' + idrow + ' ><td class="center" ></td><td class="center">' + HFRowData + objTblItem.codeproduct + '</td><td class="center">' + ((objTblItem.productName2 == null || objTblItem.productName2 == "") ? objTblItem.productName : objTblItem.productName2) + '</td><td class="center">' +
                objTblItem.count + " " + objTblItem.unit + '</td><td class="center">' + GetCurrency(objTblItem.price_s.toString()) + '</td><td class="center">' + GetCurrency((parseFloat(objTblItem.price_s) * objTblItem.count).toString()) +
                '</td><td class="center"><span id="deleteTblRowEditSale" class=\'Crm-icon Crm-icon-delete-16\' title="' + saleRes.remove + '" ></span></td><td class="center" ><span id="editTblRowEditSale" class="Crm-icon Crm-icon-Edit-16" title="' + saleRes.edit + '"></span></td></tr>');;

    EditSale_RefreshDoc();
};

function EditSale_RefreshDoc() {
    if ($('#dialog_DivProductList #tblDocItemEditSale tr').length <= 1) $('#dialog_DivProductList.ProduvtDivEditSale').hide(); else $('#dialog_DivProductList.ProduvtDivEditSale').show();
    EditSale_BuildTblItemStyle();
};

function EditSale_BuildTblItemStyle() {
    $('#dialog_DivProductList #tblDocItemEditSale tr').each(function (i, row) {
        if (i != 0) {
            if (i % 2 != 0) $(row).addClass('alternate');
            else $(row).removeClass('alternate');
            $(row).find('td:first').text(i);
        }
    });
};

function EditSale_GetCountAndPrice() {
    var price = 0;
    var count = 0;
    $('#dialog_DivProductList #tblDocItemEditSale tr').each(function (i, row) {
        if (i != 0) {
            var myObject = $(row).find('#HidRowDataEditSale').val();
            var data = eval('(' + myObject + ')');
            count += Number(data.count);
            price += Number(data.count) * parseFloat(data.price_s);
        }
    });
    var result = {};
    result.count = count;
    result.price = price;
    $('.SaleEditPrice').text(GetCurrencyAndUnit(result.price));
    $('#TxtEditSaleForcastPrice').val(GetCurrency(result.price));
    
    if ($('#dialog_DivProductList #tblDocItemEditSale tr').length <= 1) $('.SaleEditProduct').text(saleRes.add_product);
    else $('.SaleEditProduct').text(($('#dialog_DivProductList #tblDocItemEditSale tr').length - 1) + ' ' + saleRes.product_count);

    return result;
};

function EditSale_DecimalPoints(id) {
    $('#' + id).val(GetCurrency($('#' + id).val()));
};

function SaveSaleProduct() {
    productDialogList.close();
    EditSale_GetCountAndPrice();
    var ProductArr = new Array();
    $('#dialog_DivProductList #tblDocItemEditSale tr').each(function (i, row) {
        if (i != 0) {
            var myObject = $(row).find('#HidRowDataEditSale').val();
            var data = eval('(' + myObject + ')');
            ProductArr.push(data);
        }
    });
    $('.SaleEditProduct').data('SaleItems', ProductArr);
};

$('#dialog_DivProductList #deleteTblRowEditSale').live('click', function () {
    var elem = $(this);
    RaveshUI.deleteConfirmModal(saleRes.yes, saleRes.no, saleRes.confirm_delete_text, function () {
        elem.parents("tr").remove();
        EditSale_RefreshDoc();
    });
});

$('#dialog_DivProductList #editTblRowEditSale').live('click', function () {
    var domain = $('#HFdomain').val();
    EditSale_OpenPruductDialog('update');
    $('#HFforUpdateEditSale').val($(this).parents('tr').attr('id'));
    var myObject = $(this).parents("tr").find('#HidRowDataEditSale').val();
    var data = eval('(' + myObject + ')');
    productDialog.dialog.find('#DrdStoreItemEditSale').val(data.idStore).attr('selected', "selected");
    productDialog.dialog.find('#hierarchybreadcrumb2EditSale').text(data.nameGroup);
    productDialog.dialog.find('#HFidGroup_EditSale').val(data.idGroup);
    productDialog.dialog.find('#HFnameGroup_EditSale').val(data.nameGroup);
    EditSale_GetProductInGroup(data.idGroup, data.nameGroup, domain, data.idproduct, data.idPrice);
    EditSale_STblItem = data;
    EditSale_ItemCode = data.codeproduct;
    var price_s_me = data.price_s
    if (saleRes.saleLang == "fa") price_s_me = GetCurrency(data.price_s);
    productDialog.dialog.find('#TxtPrice_sItemEditSale').val(price_s_me);
    productDialog.dialog.find('#TxtPrice_sItemEditSale').attr('idprice', data.idPrice);
    productDialog.dialog.find('#TxtCountItemEditSale').val(data.count);
    productDialog.dialog.find('.EditSaleItemUnit').text(data.unit);
    productDialog.dialog.find(".mydds").msDropDown().data("dd");
});