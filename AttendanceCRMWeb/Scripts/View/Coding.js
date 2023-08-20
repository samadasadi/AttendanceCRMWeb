(function (minaDent, $) {
    var codingBox;

    var validationMessge = {
        insuranceItemCodeValidation: (window.lang === "fa" ? "بیمه گر الزامیست" : "Insurance is Required"),
        insuranceEmployeeIDValidation: (window.lang === "fa" ? "پزشک الزامیست" : "Doctor is Required"),
    };

    function getIdComboBoxForType(idComboSelectCount) {
        return idComboSelectCount.substring(idComboSelectCount.indexOf('_') + 1, idComboSelectCount.length);
    }

    function getIdTextBoxForCode(idTextSearch) {
        
        return $('#parentCode').val();
    }

    function ShowDivForDiscount(idGrid, idComboBox, idTextBox) {
        code = $('#parentCode').val();
        
        $.ajax({
            type: "Get",
            url: "/Admin/Coding/AddDiscount",
            data: { id: code },
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                codingBox = bootbox.dialog({
                    message: result,
                    size: 'small',
                    className: "small",
                    title: MinaDent.Common.codingTitle,
                    buttons: {
                        danger: {
                            label: MinaDent.Common.cancelBtnTxt,
                            className: "red",
                            callback: function () {
                                activeModal = false;
                            }
                        },
                        main: {
                            label: MinaDent.Common.addBtnTxt,
                            className: "blue",
                            callback: function () {
                                if (parseInt($("#Price").val()) + parseInt($("#tag").val()) + parseInt($("#index").val()) !== 100) {
                                    $("#SumAlert").html("مجموع سهم کلینیک و پزشک ودستیار باید برابر ۱۰۰ قرار دهید ");
                                    return false;
                                }
                                if (AddTolist(idGrid, idComboBox, idTextBox))
                                    codingBox.hide();
                                else
                                    codingBox.showWaiting();
                            }
                        }
                    }
                })
            },
            complete: function () {
                hideWait();
            }
        });
    }


    function EditDivForDiscount(code, idGrid, idComboBox, idTextBox) {
        $.ajax({
            type: "Get",
            url: "/Admin/Coding/EditDiscount",
            data: { id: code },
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                codingBox = bootbox.dialog({
                    message: result,
                    size: 'small',
                    className: "small",
                    title: MinaDent.Common.codingTitle,
                    buttons: {
                        danger: {
                            label: MinaDent.Common.cancelBtnTxt,
                            className: "red",
                            callback: function () {
                                activeModal = false;
                            }
                        },
                        main: {
                            label: MinaDent.Common.addBtnTxt,
                            className: "blue",
                            callback: function () {
                                
                                if (parseInt($("#Price").val()) + parseInt($("#tag").val()) + parseInt($("#index").val()) !== 100) {
                                    $("#SumAlert").html("مجموع سهم کلینیک و پزشک ودستیار را برابر ۱۰۰ قرار دهید ");
                                    return false;
                                }
                                if (EditTolist(idGrid, idComboBox, idTextBox))
                                    codingBox.hide();
                                else
                                    codingBox.showWaiting();
                            }
                        }
                    }
                })
            },
            complete: function () {
                hideWait();
            }
        });
    }


    function refreshComponents(idGrid, res, idComboBox, idTextBox) {
        $("#" + idComboBox).val($("#" + idComboBox + " option:first").val());
        $("#" + idTextBox).val("");
        $("#" + idGrid).html(res);
    }
    function ShowDiv(idGrid, idComboBox, idTextBox) {
        
        code = $('#parentCode').val();
        $('#tree_1').jstree('open_node', code);

        InitModal('', '/Admin/Coding/Add', { id: code },
            function (result) {
                AddTolist(idGrid, idComboBox, idTextBox)
            }, false, true, false, null, null, false, 1000);
        
        //$.ajax({
        //    type: "Get",
        //    url: "/Admin/Coding/Add",
        //    data: { id: code },
        //    beforeSend: function () {
        //        showWait();
        //    },
        //    success: function (result) {
        //        if (result.statusCode === "301") {
        //            AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
        //            return;
        //        }
        //        codingBox = bootbox.dialog({
        //            message: result,
        //            size: 'small',
        //            className: "small",
        //            title: MinaDent.Common.codingTitle,
        //            buttons: {
        //                danger: {
        //                    label: MinaDent.Common.cancelBtnTxt,
        //                    className: "red",
        //                    callback: function () {
        //                        activeModal = false;
        //                    }
        //                },
        //                main: {
        //                    label: MinaDent.Common.addBtnTxt,
        //                    className: "blue",
        //                    callback: function () {
        //                        if (AddTolist(idGrid, idComboBox, idTextBox))
        //                            codingBox.hide();
        //                        else
        //                            codingBox.showWaiting();
        //                    }
        //                }
        //            }
        //        })
        //    },
        //    complete: function () {
        //        hideWait();
        //    }
        //});
    }

    function SaveTreatmentConsiderations() {
        
        var Text = $("#Text").val();
        var CodingId = $('#parentCode').val();
        $.ajax({
            url: "/Admin/Coding/TreatmentConsideration",
            type: 'POST',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: { Text: Text, CodingId: CodingId },
            success: function (res) {
                if (res.statusCode === "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                AlertDialog("ملاحظات درمان با موفقیت ثبت شد", "");
            }
        });
    }

    function SaveHizeneDarman() {
        
        $.ajax({
            url: "/Admin/Insurance/SaveHizeneDarman",
            type: 'POST',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: $("#frmHazineDarman").serialize(),
            success: function (res) {
                if (res.statusCode === "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                AlertDialog("هزینه درمان با موفقیت ثبت شد", "");
            }
        });
    }

    function EditDiv(code, idGrid, idComboBox, idTextBox) {


        InitModal('', '/Admin/Coding/Edit', { id: code },
            function (result) {

                EditTolist(idGrid, idComboBox, idTextBox)

            }, false, true, false, null, null, false, 1000);
        
        //$.ajax({
        //    type: "Get",
        //    url: "/Admin/Coding/Edit",
        //    data: { id: code },
        //    beforeSend: function () {
        //        showWait();
        //    },
        //    success: function (result) {
        //        if (result.statusCode === "301") {
        //            AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
        //            return;
        //        }
        //        codingBox = bootbox.dialog({
        //            message: result,
        //            size: 'small',
        //            className: "small",
        //            title: MinaDent.Common.codingTitle,
        //            buttons: {
        //                danger: {
        //                    label: MinaDent.Common.cancelBtnTxt,
        //                    className: "red",
        //                    callback: function () {
        //                        activeModal = false;
        //                    }
        //                },
        //                main: {
        //                    label: MinaDent.Common.addBtnTxt,
        //                    className: "blue",
        //                    callback: function () {
        //                        if (EditTolist(idGrid, idComboBox, idTextBox))
        //                            codingBox.hide();
        //                        else
        //                            codingBox.showWaiting();
        //                    }
        //                }
        //            }
        //        })
        //    },
        //    complete: function () {
        //        hideWait();
        //    }
        //});
    }

    function ShowDivProfile(code, idGrid, idComboBox, idTextBox) {
        
        parent = isEmpty(code) ? $('#parentCode').val() : "";
        $.ajax({
            type: "Get",
            url: "/Admin/Profile/AddProfile",
            data: { id: code, groupId: parent },
            beforeSend: function () {
                showWait();
            },
            success: function (result) {
                if (result.statusCode === "301") {
                    AlertDialog('شما مجوز انجام این عملیات را ندارید', 'خطا');
                    return;
                }
                codingBox = bootbox.dialog({
                    message: result,
                    title: MinaDent.Common.codingTitle,
                    buttons: {
                        danger: {
                            label: MinaDent.Common.cancelBtnTxt,
                            className: "red",
                            callback: function () {
                                activeModal = false;
                            }
                        },
                        main: {
                            label: MinaDent.Common.addBtnTxt,
                            className: "blue",
                            callback: function () {
                                

                                var type = $("#Type").val();
                                if ((type === "103" || type === "107") && $("#ListItemTbl tr").length <= 1) {
                                    alert("لیست موردنظر فاقد آیتم می باشد");
                                    return false;
                                }
                                if (AddProfileTolist(idGrid, idComboBox, idTextBox))
                                    codingBox.hide();
                                else
                                    codingBox.showWaiting();
                            }
                        }
                    }
                })
            },
            complete: function () {
                hideWait();
            }
        });
    }

    function ShowModalInsurance(code, idGrid, idComboBox, idTextBox) {


        Type = getIdComboBoxForType(idComboBox);
        parentCode = isEmpty(code) ? $('#parentCode').val() : '';


        InitModal('نوشتن پیام جدید', '/Admin/Insurance/AddInsurance', { id: code, Type: Type, groupId: parentCode },
            function () {

                if ((Number($("#insuranceRefPrice").val()) < Number($("#insurancePrice").val())) || (Number($("#insuranceGnrRefPrice").val()) < Number($("#insuranceGnrPrice").val()))) {
                    $("#alert").html("لطفا مقدار تعرفه از سهم بیمه بیشتر باشد");
                    return false;
                }
                $("#FrmInsurance").data('formValidation').validate();
                if ($("#FrmInsurance").data('formValidation').isValid()) {

                    RemoveAllCharForPrice("insuranceGnrPriceStr");
                    RemoveAllCharForPrice("insurancePriceStr");

                    AjaxCallAction('POST', "/Admin/Insurance/AddInsurance", $("#FrmInsurance").serialize(), true,
                        function (res) {
                            if (!res.error) {
                                CloseModal();
                                activeModal = false;
                                refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
                            }
                            else {
                                AlertDialog(res.message, '', 'error');
                            }
                        }, true);


                } else {
                    AlertDialog('اطلاعات را کامل وارد نمایید', '', 'error');
                }

            });


    }




    function showModalInsuranceForAssistant(code, idGrid, idComboBox, idTextBox) {


        Type = getIdComboBoxForType(idComboBox);
        parentCode = isEmpty(code) ? $('#parentCode').val() : '';


        InitModal('نوشتن پیام جدید', '/Admin/Insurance/AddAssistantInsurance', { id: code, Type: Type, groupId: parentCode },
            function () {

                if ((Number($("#insuranceRefPrice").val()) < Number($("#insurancePrice").val())) || (Number($("#insuranceGnrRefPrice").val()) < Number($("#insuranceGnrPrice").val()))) {
                    $("#alert").html("لطفا مقدار تعرفه از سهم بیمه بیشتر باشد");
                    return false;
                }
                $("#FrmInsurance").data('formValidation').validate();
                if ($("#FrmInsurance").data('formValidation').isValid()) {

                    RemoveAllCharForPrice("insuranceGnrPriceStr");
                    RemoveAllCharForPrice("insurancePriceStr");

                    AjaxCallAction('POST', "/Admin/Insurance/AddInsurance", $("#FrmInsurance").serialize(), true,
                        function (res) {
                            if (!res.error) {
                                CloseModal();
                                activeModal = false;
                                refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
                            }
                            else {
                                AlertDialog(res.message, '', 'error');
                            }
                        }, true);


                } else {
                    AlertDialog('اطلاعات را کامل وارد نمایید', '', 'error');
                }

            });



    }

    function EditTolist(idGrid, idComboBox, idTextBox) {
        
        var name = $('#name').val();
        if (!CheckNullAddTolist(name)) return false;
        $.ajax({
            url: "/Admin/Coding/EditCode",
            type: 'GET',
            scriptCharset: "utf-16",
            contentType: "application/x-www-form-urlencoded; charset=UTF-16",
            data: $('Form').serialize(),
            success: function (res) {
                
                if (res.Selected) {
                    createNode($('#parentCode').val(), res.Class, name, "last");
                }
                else {
                    EditNode(name, res.Class);
                }
                refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
            }, error: function () {
                //AlertDialog("", "خطا");
            }
        });
        return true;
    }


    function CheckNullAddTolist(name) {
        if ((name === "") || (name === null)) {
            window.lang === "fa" ? AlertDialog("نام را وارد کنید", "هشدار") : AlertDialog("Enter Name", "Warning");
            return false;
        }
        return true;
    }


    function AddTolist(idGrid, idComboBox, idTextBox) {

        var name = $('#name').val();
        if (!CheckNullAddTolist(name)) return false;


        debugger;
        var _deviceId = $("#POS_DeviceId").val();
        if (_deviceId == '5') {
            var _serial = $("#POS_SerialNo").val();
            var _terminal = $("#POS_TerminalId").val();
            var _acceptor = $("#POS_AcceptorId").val();
            if (_serial == '' || _serial == undefined || _serial == null) {
                AlertDialog('شماره سریال را وارد نمایید', '', 'error');
                return;
            }
            if (_terminal == '' || _terminal == undefined || _terminal == null) {
                AlertDialog('شماره ترمینال را وارد نمایید', '', 'error');
                return;
            }
            if (_acceptor == '' || _acceptor == undefined || _acceptor == null) {
                AlertDialog('شماره پذیرنده را وارد نمایید', '', 'error');
                return;
            }
        }

        AjaxCallAction('GET', '/Admin/Coding/AddCode', $("Form").serialize(), true,
            function (res) {

                debugger;

                if (res.Selected) {
                    createNode($('#parentCode').val(), res.Class, name, "last");
                }
                else {
                    EditNode(name, res.Class);
                }
                refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
                CloseModal();
            }, false);

    }



    function CheckNullAddProfileTolist() {
        if ($("#FaName").val() === "") {
            //window.lang === "fa" ? AlertDialog("نام فارسی را وارد کنید", "هشدار") : AlertDialog("Enter Persian Name", "Warning");
            window.lang === "fa" ? AlertDialog("نام را وارد کنید", "هشدار") : AlertDialog("Enter Name", "Warning");
            return false;
        }
        if ($("#FieldName").val() === "") {
            window.lang === "fa" ? AlertDialog("نام انگلیسی را وارد کنید", "هشدار") : AlertDialog("Enter English Name", "Warning");
            return false;
        }
        if ($("#Type").val() === "") {
            window.lang === "fa" ? AlertDialog("نوع را وارد کنید", "هشدار") : AlertDialog("Enter Type", "Warning");
            return false;
        }
        return true;
    }


    function AddProfileTolist(idGrid, idComboBox, idTextBox) {
        
        if (!CheckNullAddProfileTolist()) return false;

        $.post("/Admin/Profile/AddProfileCode", $("form").serialize(),
            function (res) {
                if (res.Selected) {
                    
                    if (!($('#parentCode').val()).startsWith("013")) {
                        createNode($('#parentCode').val(), res.Class, $("#FaName").val(), "last");
                    }
                }
                else {
                    if (!($('#parentCode').val()).startsWith("013")) {
                        EditNode($("#FaName").val(), res.Class);
                    }
                }
                refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
            })
            .fail(function (response) {
                AlertDialog("متاسفانه عملیات با موفقیت انجام نشد", "خطا", 'error');
            });
        return true;
    }

    function createNode(parent_node, new_node_id, new_node_text, position) {
        
        $('#tree_1').jstree('create_node', $("#" + parent_node), { "text": new_node_text, "id": new_node_id }, position, false, false);
        $("#" + new_node_id + "_anchor").attr('onclick', 'ShowGrid("' + new_node_id + '")');
    }

    function EditNode(text, get_selected) {
        var tree = $('#tree_1');
        var node = tree.find("[id='" + get_selected + "']");
        tree.jstree(true).set_text(node, text);
    }

    function DeleteNode(get_selected) {
        $('#tree_1').jstree(true).delete_node($('#tree_1').find("[id=" + get_selected + "]"));
    }

    var InsuranceValidation = function () {
        $('#FrmInsurance')
            .formValidation({
                framework: 'bootstrap',
                excluded: ':disabled',
                icon: {
                    valid: 'fa fa-plus',
                    invalid: 'fa fa-remove',
                    validating: 'fa fa-refresh'
                },
                fields: {
                    "insuranceItemCode": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.insuranceItemCodeValidation
                            }
                        }
                    },
                    "insuranceEmployeeID": {
                        validators: {
                            notEmpty: {
                                message: validationMessge.insuranceEmployeeIDValidation
                            }
                        }
                    },
                }
            });
    }


    function deleteRowForListService(code, idGrid, idComboBox, idTextBox) {
        
        if ((code === 0) || (code === null))
            return;
        if (confirm("آیا از حذف اطمینان خاطر دارید"))
            $.ajax({
                url: "/Admin/Insurance/deleteRowForListService",
                type: 'POST',
                scriptCharset: "utf-16",
                contentType: "application/x-www-form-urlencoded; charset=UTF-16",
                data: { id: code, code: getIdTextBoxForCode(idTextBox), type: getIdComboBoxForType(idComboBox), SelectCount: $("#" + idComboBox).val() },
                beforeSend: function () {
                    showWait();
                },
                success: function (res) {
                    
                    refreshComponents(idGrid, res.Data, idComboBox, idTextBox);
                },
                error: function (error) {
                },
                complete: function () {
                    hideWait();
                }
            });
    }

    function deleteRowForBasingCoding(code, idGrid, idComboBox, idTextBox) {
        
        if ((code === 0) || (code === null))
            return;
        if (confirm("آیا از حذف اطمینان خاطر دارید"))
            $.ajax({
                url: "/Admin/Coding/Delete_BasicCoding",
                type: 'POST',
                scriptCharset: "utf-16",
                contentType: "application/x-www-form-urlencoded; charset=UTF-16",
                data: { id: code, SelectCount: $("#" + idComboBox).val() },
                beforeSend: function () {
                    showWait();
                },
                success: function (res) {
                    
                    refreshComponents(idGrid, res, idComboBox, idTextBox);
                    DeleteNode(code);
                },
                error: function (error) {
                },
                complete: function () {
                    hideWait();
                }
            });
    }

    function FullTextBox1() {
        $("i[class|='form-control-feedback fa fa-plus']").hide();
        
        if (($("#PercentinsuranceGnrPrice").val() === "") || ($("#insuranceGnrRefPriceStr").val() === "")) {
            $("#insuranceGnrPriceStr").val("");
            return;
        }
        var insuranceGnrRefPriceStr = $("#insuranceGnrRefPriceStr").val().split(",");

        var arrTempinsuranceGnrRefPriceStr = "";
        for (var i = 0; i < insuranceGnrRefPriceStr.length; i++)
            arrTempinsuranceGnrRefPriceStr += insuranceGnrRefPriceStr[i];


        $("#insuranceGnrPriceStr").val(moneyCommaSepWithReturn(((parseInt(arrTempinsuranceGnrRefPriceStr) / 100) * (parseInt($("#PercentinsuranceGnrPrice").val()))).toString()));
        $("#insuranceGnrPrice").val((parseInt(arrTempinsuranceGnrRefPriceStr) / 100) * (parseInt($("#PercentinsuranceGnrPrice").val())));
        $("i[class|='form-control-feedback fa fa-plus']").hide();
    }
    function FullTextBox2() {
        $("i[class|='form-control-feedback fa fa-plus']").hide();
        
        if (($("#PercentinsurancePrice").val() === "") || ($("#insuranceRefPriceStr").val() === "")) { $("#insurancePriceStr").val(""); return; }
        var insuranceGnrRefPriceStr = $("#insuranceRefPriceStr").val().split(",");

        var arrTempinsuranceGnrRefPriceStr = "";
        for (var i = 0; i < insuranceGnrRefPriceStr.length; i++)
            arrTempinsuranceGnrRefPriceStr += insuranceGnrRefPriceStr[i];

        $("#insurancePriceStr").val(moneyCommaSepWithReturn(((parseInt(arrTempinsuranceGnrRefPriceStr) / 100) * (parseInt($("#PercentinsurancePrice").val()))).toString()));
        $("#insurancePrice").val((parseInt(arrTempinsuranceGnrRefPriceStr) / 100) * (parseInt($("#PercentinsurancePrice").val())));
        $("i[class|='form-control-feedback fa fa-plus']").hide();
    }

    function operationAjaxFor_BasicCoding(url, idTextSearch, idComboSelectCount, page, firstPage) {
        
        window.AjaxCallAction("POST", url, { Search: $("#" + idTextSearch).val(), PageNum: page, PageSize: $("#" + idComboSelectCount).val(), FirstPage: firstPage }, true, function (result) {
            
            var fnName = 'successCallBack' + '_' + idTextSearch;
            window[fnName](result, page);
        }, true);
    }

    function operationAjaxFor_Insurance(url, idTextSearch, idComboSelectCount, page, firstPage) {
        
        window.AjaxCallAction("POST", url, { Search: $("#" + idTextSearch).val(), PageNum: page, PageSize: $("#" + idComboSelectCount).val(), FirstPage: firstPage, Code: getIdTextBoxForCode(idTextSearch), Type: getIdComboBoxForType(idComboSelectCount) }, true, function (result) {
            
            var fnName = 'successCallBack' + '_' + idTextSearch;
            window[fnName](result, page);
        }, true);
    }

    function functionTempForDelete() {
        
    }

    minaDent.Coding = {
        ShowDiv: ShowDiv,
        AddTolist: AddTolist,
        createNode: createNode,
        ShowDivProfile: ShowDivProfile,
        ShowModalInsurance: ShowModalInsurance,
        AddProfileTolist: AddProfileTolist,
        InsuranceValidation: InsuranceValidation,
        EditDiv: EditDiv,
        EditTolist: EditTolist,
        SaveTreatmentConsiderations: SaveTreatmentConsiderations,
        ShowDivForDiscount: ShowDivForDiscount,
        EditDivForDiscount: EditDivForDiscount,
        showModalInsuranceForAssistant: showModalInsuranceForAssistant,
        deleteRowForListService: deleteRowForListService,
        FullTextBox1: FullTextBox1,
        FullTextBox2: FullTextBox2,
        SaveHizeneDarman: SaveHizeneDarman,
        OperationAjaxFor_BasicCoding: operationAjaxFor_BasicCoding,
        OperationAjaxFor_Insurance: operationAjaxFor_Insurance,
        DeleteRowForBasingCoding: deleteRowForBasingCoding,
        FunctionTempForDelete: functionTempForDelete
    };
})(MinaDent, jQuery);




