
(function (minaDent, $) {

    var validationMessge = {
        TitleValidation: (window.lang === "fa" ? "عنوان الزامیست" : "Title is Required"),
        PriceValidation: (window.lang === "fa" ? "مبلغ الزامیست" : "Price is Required"),
    };

    function refreshComponents(idGrid, res, idComboBox, idTextBox) {
        $("#" + idComboBox).val($("#" + idComboBox + " option:first").val());
        $("#" + idTextBox).val("");
        $("#" + idGrid).html(res);
    }


    var costValidation = function () {
        $('#CostFrm')
            .formValidation({
                framework: 'bootstrap',
                excluded: ':disabled',
                icon: {
                    invalid: 'fa fa-remove',
                    validating: 'fa fa-refresh'
                },
                fields: {
                    "CostCode": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.TitleValidation
                            }
                        }
                    },
                    "Price": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.PriceValidation
                            }
                        }
                    },
                }
            });
    }

    function filter(url, idTextSearch, idComboSelectCount, page, firstPage) {

        var fromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
        var Search = $('#Search').val();
        var PageSize = $('#cboSelectCount').val();


        var SortType = 1;
        if (document.getElementById('SortType1').checked) {
            SortType = 1;
        } else if (document.getElementById('SortType2').checked) {
            SortType = 2;
        }

        var _url = (!window.isEmpty(fromDate) && !window.isEmpty(ToDate)) ? url : url + "1";
        window.AjaxCallAction("POST", _url, { text: Search, page: page, SelectCount: PageSize, firstPage: firstPage, fromDate: fromDate, ToDate: ToDate, SortType: SortType }, true, function (result) {

            var fnName = 'successCallBack' + '_' + idTextSearch;
            window[fnName](result, page);
        }, true);
    }

    function filter_SindhWarehouse(url, idTextSearch, idComboSelectCount, page, firstPage) {

        var fromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
        var Search = $('#Search').val();
        var PageSize = $('#cboSelectCount').val();

        var _url = (!window.isEmpty(fromDate) && !window.isEmpty(ToDate)) ? url : url + "1";
        window.AjaxCallAction("POST", _url, { text: Search, page: page, SelectCount: PageSize, firstPage: firstPage, fromDate: fromDate, ToDate: ToDate }, true, function (result) {

            var fnName = 'successCallBack' + '_' + idTextSearch;
            window[fnName](result, page);
        }, true);
    }

    function validationFilterPanel() {
        if (window.isEmpty($('#FromDate').val())) {
            AlertDialog("ازتاریخ را وارد کنید");
            return false;
        }
        if (window.isEmpty($('#ToDate').val())) {
            AlertDialog("تاتاریخ را وارد کنید");
            return false;
        }
        return true;
    }

    function reloadCompanyAccount(Id) {
        //window.AjaxCallAction("POST", "/Admin/Cost/CheckCompanyAccount", { Id: Id }, true, function (result) {
        //    successCallBack_ReloadCompanyAccount(result);
        //}, false);

        InitModal('ثبت', '/Admin/Cost/GetCheckCompanyAccount', { Id: Id },
            function () {
                MinaDent.CostModal.SaveReloadCompanyAccount()
            });
    }

    function saveReloadCompanyAccount() {
        //window.AjaxCallAction("POST", "/Admin/Cost/CheckCompanyAccount", $("#CostFrm").serialize(), true, function (result) {
        //    successCallBack_ReloadCompanyAccount(result);
        //}, false);

        AjaxCallAction('POST', '/Admin/Cost/CheckCompanyAccount', $("#frmUploadCompanyAccToCost").serialize(), true, function (res) {
            if (!res.error) {
                successCallBack_ReloadCompanyAccount(res);
                CloseModal();
            }
            else {
                AlertDialog(res.message, '', 'error');
            }
        }, false);
    }

    function gridReloadCompanyAccount(idGrid, res, idComboBox, idTextBox) {
        refreshComponents(idGrid, res, idComboBox, idTextBox);
        AlertDialog("بارگذاری طرف حساب با موفقیت انجام شد");
    }

    function activeTabCompanyAccount(id) {
        $("a[href='#" + id + "']").parent().addClass("active");
    }

    function activeTabCost(id) {
        $("a[href='#" + id + "']").parent().addClass("active");
    }

    function activeTabSindhWarehouse(id) {
        $("a[href='#" + id + "']").parent().addClass("active");
    }

    function reloadWarehouseGrid(Id) {
        //window.AjaxCallAction("POST", "/Admin/Cost/CheckWarehouse", { Id: Id }, true, function (result) {

        //    successCallBack_ReloadWarehouseGrid(result);
        //}, false);
        InitModal('ثبت', '/Admin/Cost/GetCheckWarehouse', { Id: Id }, function () { MinaDent.CostModal.SaveReloadWarehouseGrid() });
    }

    function saveReloadWarehouseGrid() {

        AjaxCallAction('POST', '/Admin/Cost/CheckWarehouse', $("#frmUploadWarehouseToCost").serialize(), true, function (res) {
            if (!res.error) {
                successCallBack_ReloadWarehouseGrid(res);
                CloseModal();
            }
            else {
                AlertDialog(res.message, '', 'error');
            }
        }, false);
    }

    function gridReloadWarehouseGrid(idGrid, res, idComboBox, idTextBox) {

        refreshComponents(idGrid, res, idComboBox, idTextBox);
        AlertDialog("بارگذاری سند انبار با موفقیت انجام شد");
    }

    minaDent.CostModal = {
        CostValidation: costValidation,
        //CreateCostModal: CreateCostModal,
        //EditCostModal: EditCostModal,
        Filter: filter,
        Filter_SindhWarehouse: filter_SindhWarehouse,
        ValidationFilterPanel: validationFilterPanel,
        SaveReloadCompanyAccount: saveReloadCompanyAccount,
        ReloadCompanyAccount: reloadCompanyAccount,
        GridReloadCompanyAccount: gridReloadCompanyAccount,
        ActiveTabCompanyAccount: activeTabCompanyAccount,
        ActiveTabCost: activeTabCost,
        ActiveTabSindhWarehouse: activeTabSindhWarehouse,
        ReloadWarehouseGrid: reloadWarehouseGrid,
        SaveReloadWarehouseGrid: saveReloadWarehouseGrid,
        GridReloadWarehouseGrid: gridReloadWarehouseGrid
    };

})(MinaDent, jQuery);