
(function (minaDent, $) {

    var validationMessge = {
        NameValidation: (window.lang === "fa" ? "نام الزامیست" : "Name is Required"),
        GroupValidation: (window.lang === "fa" ? "گروه الزامیست" : "Group is Required"),
        PriceValidation: (window.lang === "fa" ? "مبلغ الزامیست" : "Price is Required"),
    };

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

    function filter(url, idTextSearch, idComboSelectCount, page, firstPage) {
        
        var fromDate = $('#FromDate').val();
        var ToDate = $('#ToDate').val();
        var _url = (!window.isEmpty(fromDate) && !window.isEmpty(ToDate)) ? url : url + "1";
        window.AjaxCallAction("POST", _url, { text: $("#" + idTextSearch).val(), page: page, SelectCount: $("#" + idComboSelectCount).val(), firstPage: firstPage, fromDate: fromDate, ToDate: ToDate }, true, function (result) {
            
            var fnName = 'successCallBack' + '_' + idTextSearch;
            window[fnName](result, page);
        }, true);
    }

    function refreshComponents(idGrid, res, idComboBox, idTextBox) {
        //$("#" + idComboBox).val($("#" + idComboBox + " option:first").val());
        $("#" + idTextBox).val("");
        $("#" + idGrid).html(res);
    }

    var ShowCompanyAccountModal = function (Id, idGrid, idComboBox, idTextBox) {
        if (Id) {
            $.ajax({
                type: "Get",
                url: "/Admin/CompanyAccount/Edit",
                data: { Id: Id },
                beforeSend: function () {
                    showWait();
                },
                success: function (result) {
                    var box = bootbox.dialog({
                        message: result,
                        size: 'large',
                        className: "large",
                        title: MinaDent.Common.CostIncoming,
                        buttons: {
                            main: {
                                label: MinaDent.Common.addBtnTxt,
                                className: "blue",
                                callback: function () {
                                    
                                    $("#CompanyFrm").data('formValidation').validate();
                                    if ($("#CompanyFrm").data('formValidation').isValid()) {

                                        $('#Price').val(!isEmpty($('#Price').val()) ? removeComaForString($('#Price').val()) : $('#Price').val());

                                        $.post("/Admin/CompanyAccount/Create", $("#CompanyFrm").serialize()).done(function (result) {
                                            

                                            refreshComponents(idGrid, result, idComboBox, idTextBox);

                                            $.get("/Admin/CompanyAccount/Index");
                                            box.hide();
                                        })
                                    }
                                    else {
                                        return false;

                                    }
                                }
                            },
                            cancel: {
                                className: "red",
                                label: '<i class="fa fa-times"></i> ' + MinaDent.Common.cancelBtnTxt
                            },
                        }
                    });
                },
                complete: function () {
                    hideWait();
                }
            });
        }
        else {
            $.ajax({
                type: "Get",
                url: "/Admin/CompanyAccount/Create",
                beforeSend: function () {
                    showWait();
                },
                success: function (result) {
                    var box = bootbox.dialog({
                        message: result,
                        size: 'large',
                        className: "large",
                        title: MinaDent.Common.CostIncoming,
                        buttons: {
                            main: {
                                label: MinaDent.Common.addBtnTxt,
                                className: "blue",
                                callback: function () {
                                    
                                    $("#CompanyFrm").data('formValidation').validate();
                                    if ($("#CompanyFrm").data('formValidation').isValid()) {

                                        $('#Price').val(!isEmpty($('#Price').val()) ? removeComaForString($('#Price').val()) : $('#Price').val());

                                        $.post("/Admin/CompanyAccount/Create", $("#CompanyFrm").serialize()).done(function (result) {
                                            

                                            refreshComponents(idGrid, result, idComboBox, idTextBox);

                                            $.get("/Admin/CompanyAccount/Index");
                                            box.hide();
                                        })
                                    }
                                    else {
                                        return false;
                                    }
                                }
                            },
                            cancel: {
                                className: "red",
                                label: '<i class="fa fa-times"></i> ' + MinaDent.Common.cancelBtnTxt
                            },
                        }
                    });
                },
                complete: function () {
                    hideWait();
                }
            });
        }
    }

    var CompanyCreateValidation = function () {
        $('#CompanyFrm')
            .formValidation({
                framework: 'bootstrap',
                excluded: ':disabled',
                icon: {

                    validating: 'fa fa-refresh'
                },
                fields: {
                    "costInCode": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.GroupValidation
                            }
                        }
                    },
                    "costPersonID": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.NameValidation
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

    function activeTabCompanyAccount(id) {
        $("a[href='#" + id + "']").parent().addClass("active");
    }

    function activeTabSindhWarehouse(id) {
        $("a[href='#" + id + "']").parent().addClass("active");
    }

    function reloadWarehouseGrid(Id) {
        window.AjaxCallAction("POST", "/Admin/CompanyAccount/CheckWarehouse", { Id: Id }, true, function (result) {

            if (result.error) {
                AlertDialog(result.message, '', 'error');
            }

            //successCallBack_ReloadWarehouseGridForCompany(result);
            ReloadOpeningDocument_Type('2');

        }, false);
    }

    function gridReloadWarehouseGrid(idGrid, res, idComboBox, idTextBox) {
        
        refreshComponents(idGrid, res, idComboBox, idTextBox);
        AlertDialog("بارگذاری سند انبار با موفقیت انجام شد");
    }

    minaDent.CompanyAccountModal = {
        ShowCompanyAccountModal: ShowCompanyAccountModal,
        CompanyCreateValidation: CompanyCreateValidation,
        ValidationFilterPanel: validationFilterPanel,
        Filter: filter,
        ActiveTabCompanyAccount: activeTabCompanyAccount,
        ActiveTabSindhWarehouse: activeTabSindhWarehouse,
        ReloadWarehouseGrid: reloadWarehouseGrid,
        GridReloadWarehouseGrid: gridReloadWarehouseGrid
    };
})(MinaDent, jQuery);