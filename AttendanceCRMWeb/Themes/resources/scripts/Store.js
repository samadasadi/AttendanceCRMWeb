/* tab */
$(function () {
    $('.tab .title a').click(function () {
        var tabID = $(this).parents('.tab');
        tabID.find('.title li').removeClass('ui-tabs-selected');
        $(this).parents('li').addClass('ui-tabs-selected'); 
        tabID.find('.tabboxes .tabitem').hide();
        tabID.find('#' + $(this).attr('tabid')).fadeIn();
        return false;
    });
});   
/* end tab */

var DbDocItem = new Array(); //load AllItem DOc when clicked editItem in TblItemDoc for compute mojodi store

docState = {//for set of setting on element and function Doc And Factor
    state: "insert",
    temp: null,
    iddoc: 0,
    iduser: '',
    codedoc: 0,
    status: 0,
    submitchange: function () {
        if (this.state == "update") {
            if (this.temp) { $('#BtnInsertDoc').val(objResource.BtnUpdateText); }
        }
        else if (this.state == "insert") {
            $('#BtnInsertDoc').val(objResource.BtnInsertText);
            this.temp = null;
            this.iddoc = 0;
            this.iduser = '';
            this.codedoc = 0;
            this.status = 0;
        }
    }
};

function nUnd(inputStr) { //change null item to ''
    if (inputStr != null)
        return inputStr;
    else
        return '';
}

//for reload script dropdown
function CalljsDrd() {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "../Themes/resources/scripts/jquery.dropdawn.js";
    head.appendChild(script);
}

function GetCurrencyAndUnit(InputMoney) { //sample input 100000 --> 100,000 toman
    if (InputMoney != undefined && InputMoney != null) {
        var digit = '';
        if (resources.lang == 'en')
            digit = '.00';
        if (InputMoney.toString().indexOf(".") > -1) {
            digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
            if (resources.lang == 'en')
                if (digit.length == 2)
                    digit = digit + '0';

            InputMoney = InputMoney.toString().substr(0, InputMoney.toString().indexOf("."));
        }
    InputMoney = InputMoney.toString().replace(/,/gi, '');
    var result = InputMoney.toString().substr(0, InputMoney.length % 3);
    InputMoney = InputMoney.toString().substr(InputMoney.length % 3, InputMoney.length);
    for (i = 0; i < InputMoney.length; i = i + 3) result += ',' + InputMoney.toString().substr(i, 3);
    if (result.charAt(0) == ",") result = result.toString().substr(1, result.length);
    if (AllSetting != null)
        return (result + digit + ' ' + nUnd(AllSetting.UnitPrice));
    else
        return result + digit;
    }
    else
        return "";
}

function GetCurrency(InputMoney) { //sample input 100000 --> 100,000
    if (InputMoney != undefined && InputMoney != null) {

        var digit = '';
        if (resources.lang == 'en')
            digit = '.00';
        if (InputMoney.toString().indexOf(".") > -1) {
            digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
            if (resources.lang == 'en')
                if (digit.length == 2)
                    digit = digit + '0';

            InputMoney = InputMoney.toString().substr(0, InputMoney.toString().indexOf("."));
        }

        InputMoney = InputMoney.toString().replace(/,/gi, '');
        var result = InputMoney.toString().substr(0, InputMoney.length % 3);
        InputMoney = InputMoney.toString().substr(InputMoney.length % 3, InputMoney.length);
        for (i = 0; i < InputMoney.length; i = i + 3) result += ',' + InputMoney.toString().substr(i, 3);
        if (result.charAt(0) == ",") result = result.toString().substr(1, result.length);
        return result + digit;
    }
    else
        return "";
}

// build style tblItemDoc and set row number in first td
function BuildTblItemStyle() {
    $('#tblDocItem tr').each(function (i, row) {
        if (i != 0) {
            if (i % 2 != 0)
                $(row).addClass('alternate');
            else
                $(row).removeClass('alternate');
            $(row).find('td:first').text(i);
        }
    });
}


function Calljs() { //call scrpt for postback microsoft ajax
    var jscall = new Array();
    jscall[0] = "CallFunction.js";
    jscall[1] = "smooth.form.js";
    jscall[2] = "fg.menu.js";
    jscall[3] = "jquery.dropdawn.js";
    for (i = 0; i < jscall.length; i++) {
        var source = jscall[i];
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "../Themes/resources/scripts/" + source
        head.appendChild(script);
    }
}

function RefreshDoc() {

    if ($('#tblDocItem tr').length <= 1)
        $('#tblDocItem').parents('.field:first').hide();
    else
        $('#tblDocItem').parents('.field:first').show(); //Change Display tblDocItem By RowCount

   

    BuildTblItemStyle(); //Build tblDocItem Color Alternate Rows
    GetPriceByPercent('#TxtDiscountPercent', '#TxtDiscount'); // make price by percent
    GetPriceByPercent('#TxtCostPercent', '#TxtCost');
    GetCountAndPriceForFactor($('#HFFactorType').val());  //get PriceKol And Get Count Product  
}


 
function GetCountAndPriceForFactor(type) { // mohasebeye gheymat kol va tedad kala darj shode dar tblItemDoc
        var price0 = 0;
        var count = 0; var price = 0;
        var FcPrices = GetDocPrice();

        var priceAddedValue = 0;
        var AllDiscount = 0;
        var AllCost = 0;
        var AllTax = 0;


        $('#tblDocItem tr').each(function (i, row) {
            if (i != 0) {
                var myObject = $(row).find('#HidRowData').val();
                var data = eval('(' + myObject + ')');
                count += parseFloat(data.count);
                if (type == "0" || type == "1")//agar sabte avaliye ya factor kharid proce_b ya ghemate kharid mohasebe
                    price += data.count * parseInt(data.price_b);
                else
                    price += data.count * parseInt(data.price_s); //gheymate forosh
            }
        });
       

        if ($('#ChkDiscount').attr('checked')) AllDiscount = parseInt(($('#TxtDiscount').val() == "") ? 0 : $('#TxtDiscount').val());
        if ($('#ChkCost').attr('checked')) AllCost = parseInt(($('#TxtCost').val() == "") ? 0 : $('#TxtCost').val());
        price0 = price;
        price = price - AllDiscount ;

        if ($('#ChkTax').attr('checked')) AllTax = Math.ceil(parseFloat($('#TxtTax').val().replace('%', '') / 100) * parseInt(price));
        if ($('#ChkAddedValue').attr('checked')) priceAddedValue = Math.ceil(parseFloat($('#TxtAddedValue').val().replace('%', '') / 100) * parseInt(price));

        //if ($('#ChkAddedValue').attr('checked')) {
        //    $('#tblDocItem tr').each(function (j, row) {
        //        if (j != 0) {
        //            var myObject = $(row).find('#HidRowData').val();
        //            var data = eval('(' + myObject + ')');

        //            //var priceProduct = data.count * parseInt(data.price_s);
        //            if (type == "0" || type == "1") //agar sabte avaliye ya factor kharid proce_b ya ghemate kharid mohasebe
        //                priceProduct = data.count * parseInt(data.price_b);
        //            else
        //                priceProduct = data.count * parseInt(data.price_s); //gheymate forosh

        //            var priceDiscount = getNewPriceP(price0, priceProduct, FcPrices[0]);
        //            if (data.ArzeshAfzode) priceAddedValue += getNewPriceP(price, priceProduct - priceDiscount, FcPrices[3] + '%');

        //        }
        //    });
        //}
         

        var result = {};
        result.count = count;
        result.price = price0;
        result.pricekol = price + priceAddedValue - AllTax + AllCost;
        result.discount = $('#TxtDiscount').val();
        result.cost = $('#TxtCost').val();
        result.tax = AllTax;
        result.addedvalue = priceAddedValue;

        $('#LblCountDoc').text(parseFloat(result.count));
        $('#LblPriceDoc').text(GetCurrencyAndUnit(result.price));
        $('#LblPriceDocKol').text(GetCurrencyAndUnit(result.pricekol));
       
        return result;

       

    }

function getNewPriceP(priceKol, priceProduct, price) {
        if (price.search('%') != '-1') {
            price = Math.ceil((parseFloat((price.replace('%', '')) / 100) * parseFloat(priceProduct)));
        }
        else {
            price = Math.ceil(parseFloat(priceProduct) * parseFloat(price) / parseFloat(priceKol));
        }
        return price;
    }


    //Get All Product In Group
    var allProductInGroup;
    function GetProductInGroup(code, name, domain, idproduct, idprice) {
        $('#dialogForm').mask('Loading ...');
        clearDialog();
        var e = {};
        e.domain_ = domain;
        e.idgroup = code;
        e.id_user_ = e.id_user_ = $('#HFUserCode').val();
        Client.get_products(e, function (c) {
            populateDrd('DrdProductItem', c.d, objResource.DrdFirstOptionText);
            allProductInGroup = c.d;
            if (idproduct != 0) {
                $('#DrdProductItem').val(idproduct).attr('selected', "selected"); // for edit
                ReciveProductDetail(idprice);
            }
            $('#HFidGroup').val(code);
            $('#HFnameGroup').val(name);
            $('#dialogForm').unmask();
            $(".mydds").msDropDown().data("dd");
            $("#DrdProductItem").multiselect('refresh');
        })
    }

    //Build Option For Drd
    function populateDrd(dropdownname, data, pleaseSelectText) {
        $('#' + dropdownname).empty()
        if (pleaseSelectText != '') $('#' + dropdownname).append($('<option></option>').val('0').html(pleaseSelectText));
        $.each(data, function (val, text) {
            if (dropdownname == "DrdProductItem") {
                if (this.enable == true) {
                    var BuypropertyStr = "";
                    var BuypropertyArr = new Array();
                    if (text.PrColumn != undefined && text.PrColumn != null) {
                        $.each(text.PrColumn, function (v,t) {
                            BuypropertyArr.push(t.content);
                        })
                        BuypropertyStr = BuypropertyArr.join(',')
                    }
                    $('#' + dropdownname).append($('<option codeproduct="' + text.codeproduct + '" productproperty="' + BuypropertyStr + '" ></option>').val(text.id).html(text.name));
                }
            }
            else
                $('#' + dropdownname).append($('<option></option>').val(text.id).html(text.name));
        });
    }

    //get productByID
    function GetProductDetail(idproduct) {
        if (idproduct != 0) {
            var product;
            for (i = 0; i <= allProductInGroup.length; i++) {
                if (allProductInGroup[i].id == idproduct) {
                    var product = allProductInGroup[i]; //find product by id
                    break;
                }
            }
            return product;
        }
        else return null;
    }

    function ReciveProductDetail_Call(idprice) {
        setTimeout("ReciveProductDetail(" + idprice + ")", 200);
    }

    //Get Product Detail
    var ItemCode = 0;
    function ReciveProductDetail(idprice) { //get property product
        var idproduct = $('#DrdProductItem').find("option:selected").val();
        if (idproduct != 0) {
            
            var data = GetProductDetail(idproduct);
            ItemCode = data.codeproduct;
            
            $('#TxtProductName').fadeIn();
            $('#DrdOtpriceItem,#DrdOtpriceproperty').empty();
            $.each(data.otPrices, function (val, text) {
                $('#DrdOtpriceItem').append($('<option></option>').val(text.value).html(text.text).attr('price', text.price));
            });
            $.each(data.PrColumn, function (val, text) {
                $('#DrdOtpriceproperty').append($('<option></option>').val(text.content).html(text.content));
            });

            if ($('#DrdOtpriceItem option').length > 1) $('#DrdOtpriceItem').parents('.select').show(); else $('#DrdOtpriceItem').parents('.select').hide();
            if ($('#DrdOtpriceproperty option').length >= 1) { $('#DrdOtpriceproperty').prepend($('<option></option>').val("").html("")); $('#DrdOtpriceproperty').parents('.select').show(); } else { $('#DrdOtpriceproperty').parents('.select').hide(); }
            if (idprice != 0) {
                $('#DrdOtpriceItem').val(idprice).attr('selected', "selected");
            } else {
                $('#TxtPrice_bItem').val(data.price);
                $('#LblUnitItem').text(data.unit);
                $('#HFidGroup').val(data.idgroup);
                $('#TxtPrice_sItem').val($('#DrdOtpriceItem').find("option:first").attr('price'));
                getMojodi(idproduct);
            }
            $(".mydds").msDropDown().data("dd");
        }
        else {
            clearDialog();
            $('#TxtProductName').fadeOut();
        }
    }
     

    //Get Mojodi Store In DB
    function getMojodiST(idStore, idproduct, domain, iduser,ClientMojodi) {
        if (idproduct != 0) {
            var e = {};
            e.domain_ = domain;
            e.idproduct_ = idproduct;
            e.idstore_ = idStore;
            $('#BtnAddItem').attr('disabled', 'disabled');
            $('#BtnAddItemcontinue').attr('disabled', 'disabled');
            $('#BtnUpdateItem').attr('disabled', 'disabled');
            Client.get_Mojodi(e, function (c) {
                $('#LblMojodi').text((parseInt(c.d) + parseInt(ClientMojodi)));
                $('#BtnAddItem').attr('disabled', '');
                $('#BtnAddItemcontinue').attr('disabled', '');
                $('#BtnUpdateItem').attr('disabled', '');
            })
        }
    }
    //Get Mojodi Store In TblItem Client
    //if for update true get only id = 0  ( item hayi ke jadid darj shode miyare ) 
    function getMojodiClient(idStore, idproduct) {
        var result = 0;
        $('#tblDocItem tr').each(function (i, row) {
            if (i != 0) {
                var myObject = $(row).find('#HidRowData').val();
                var data = eval('(' + myObject + ')');
                if (data.idproduct == idproduct && data.idStore == idStore) {
                    result += parseInt(data.count);
                }
            }
        });
        return result;
    }

    function dialog_cus() { //open dialog for add item
        $("#dialog1").dialog("open");
        $('#BtnUpdateItem').hide();
        $('#BtnAddItem').show();
        $('#BtnAddItemcontinue').show();
        $('#DrdProductItem option:first').attr('selected', "selected");
        $("#DrdProductItem").multiselect('refresh');
        clearDialog();
        STblItem = null;
        $('#formChange').change();//factorsale if form change
    }
    function BtnUpdateItem() { //update
        if (!validData_DialogDoc()) return false;
        var PreRow = $('#' + $('#HFforUpdate').val()).prev();
        $('#' + $('#HFforUpdate').val()).remove(); // delete old row
        AddItem(PreRow, $('#HFforUpdate').val()); //add new row and set new id for row after old row 
        $("#dialog1").dialog("close");
        $('#DrdProductItem option:first').attr('selected', "selected");
        $("#DrdProductItem").multiselect('refresh');
        BuildTblItemStyle();
        clearDialog();
    }
    function BtnAddItem() { //add
        if (!validData_DialogDoc()) return false;
        $("#dialog1").dialog("close");
        AddItem('#tblDocItem tr:last', 'tblrow' + $('#tblDocItem tr').length); //add to last tr
        $('#DrdProductItem option:first').attr('selected', "selected");
        $("#DrdProductItem").multiselect('refresh');
        clearDialog();
    }
    function BtnAddItemcontinue() { //add continu
        if (!validData_DialogDoc()) return false;
        AddItem('#tblDocItem tr:last', 'tblrow' + $('#tblDocItem tr').length);
        $('#DrdProductItem option:first').attr('selected', "selected");
        $("#DrdProductItem").multiselect('refresh');
        clearDialog();

    }
     
    function CancelDialog() { //cancel
        $("#dialog1").dialog("close");
        $('#DrdProductItem option:first').attr('selected', "selected");
        $("#DrdProductItem").multiselect('refresh');
        clearDialog(); 
        STblItem = null;
    }
    function clearDialog() {
        $('#DrdOtpriceItem').empty();
        $('#DrdOtpriceItem').parents('.select').hide();
        $('#TxtPrice_bItem').val('');
        $('#TxtPrice_sItem').val('');
        $('#TxtCountItem').val('');
        $('#TxtDetailItem').val('');
        $('#LblUnitItem').text('');
        $('#LblMojodi').text('');
        $('#TxtProductName').val(null);
        $('#TxtProductName').hide();
        $(".mydds").msDropDown().data("dd");
    }

    

    //---------------------- Add new tafzili

    function AddnewTafziliView() {
        $("#dialog2").dialog("open");
        var domain = $('#HFdomain').val();
        var idmoin = ($('#DrdMoin').find("option:selected").val());
        $('#TxtNameTafzili').val('');
        $('#d2CustName').text('');
        $('#HFcus_code').val('');
        getNewCodeTafzili(domain, idmoin, '#TxtCodeTafzili');
        hide_Sub_tafzily();
    }


    function AddNewTafzili() { //For Factors In Dialog2
        var domain = $('#HFdomain').val();
        var idmoin = ($('#DrdMoin').find("option:selected").val());
        var idcust = 0;
        //var tafName = $('#TxtNameTafzili').val();
        idcust = $('#HFcus_code').val();
        tafName = $('#d2CustName').text();
        if (idcust == "" || idcust == 0) { alert(objResource.EnterCustomer); return false; }
        if (tafName == "") return false;
        $('#dialog2Form').mask('Loading ...');
        var e = {};
        e.domain_ = domain;
        e.idmoin_ = idmoin;
        e.idcust_ = idcust
        e.code_ = $('#TxtCodeTafzili').val();
        e.name_ = tafName
        e.type_ = ($('#DrdMahiatTafzili').find("option:selected").val());
        e.id_user_ = $('#HFUserCode').val();
        Client.InsertTafzili(e, function (c) {
            if (c.d[0] == 0 || c.d[0] == -1) {
                $('#dialog2msg').html(c.d[1])
                $('#dialog2Form').unmask();
                return false;
            } 
            $('#dialog2Form').unmask();
            $("#dialog2").dialog("close");
            populateDrdTafzili(idmoin, c.d[0]);
            if (idcust != 0) {
                $('#BtnShowUserInfo').show('slow');
            } else {
                $('#BtnShowUserInfo').hide('slow');
            }
        });
    }

    function search1(a) {
        document.getElementById("loading1").style.display = "";
        var b = {};
        var c = {};
        b.domain = $("#HFdomain").val();
        b.user_code = $("#HFUserCode").val();
        b.codeing = $("#HFcodeDU").val();
        b.name = $("#txtCust").val();
        b.rnd = $('#HFRnd').val();
        c.items = b;
        Client.cust_group_list2(c, function (d) {
            $("#td3").html(d.d);
            $("#loading1").hide()
        })
    }

    function select1(code_, name_, comment_) {
        $('#HFcus_code').val(code_);
        $("#txtCust").val('');
        $("#td3").empty();
        $('#d2CustName').text(name_);

      
        if (AllSetting.Sub_Tafzily != undefined && AllSetting.Sub_Tafzily != null)
            if (AllSetting.Sub_Tafzily == 'true') {

                $("#loading2").show();
                var e = { "domain_": $('#HFdomain').val(), "custcode_": code_ };

                $.ajax({
                    url: "../WebServices/store_.asmx/store_getCustomerParentBycustcode_",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(e),
                    success: function (c) {
                        $("#loading2").hide();
                        if (c.d[0] == 1) {
                            var parent_code = c.d[1];
                            var parent_name = c.d[2];

                            if (parent_code != null && parent_code != "" && parent_code != code_) {
                                $('#div_cust_sub').show();
                                $('#lblCustSubName').text(parent_name);
                                $('#lblCustSubName').attr('CustCode', code_);
                                $('#lblCustSubName').attr('CustName', name_);
                            }
                            else
                                hide_Sub_tafzily();

                        }
                    }
                });
            };
    }

    function hide_Sub_tafzily() {
        $('#div_cust_sub').hide();
        $('#lblCustSubName').text("");
        $('#lblCustSubName').attr('CustCode', "");
        $('#lblCustSubName').attr('CustName', "");
        $("#loading2").hide();
    };

    function SelectcustomerParent() {
        var cust_code = $('#lblCustSubName').attr('CustCode');
        var cust_name = $('#lblCustSubName').attr('CustName');
        if (cust_code != null && cust_code != "") {
            GetAndSaveTafzilyByCustomerCode_factorbuy(cust_code, cust_name);
            hide_Sub_tafzily();
            $("#dialog2").dialog("close");
        }
        else
            $('#BtnShowUserInfo').hide();
    };

    function CheckCodeTafzili(Code,idmoin,msg) {
            $('#TxtCodeTafzili_valid').show();
            $('#TxtCodeTafzili_valid').html('<div class="wait"></div>');
            var domain = $('#HFdomain').val(); 
            var e = {};
            e.domain_ = domain;
            e.idmoin_ = idmoin;
            e.code_ = Code;

            Client.CheckCodeTafzili(e, function (c) {
                if (c.d == true) {
                    $('#TxtCodeTafzili_valid').hide();
                    $('#TxtCodeTafzili').removeClass('error').addClass('valid');
                }
                else {
                    $('#TxtCodeTafzili_valid').html('<span style="color:red">' + msg + '</span>');
                    $('#TxtCodeTafzili').addClass('error').removeClass('valid');
                }
            });
    }

    function getNewCodeTafzili(domain, idmoin, outputShow) {
     
        var e = {};
        e.domain_ = domain;
        e.idmoin_ = idmoin;
        $(outputShow).attr('disabled', true);
        Client.getCodeTafzili(e, function (c) {
            $(outputShow).val(c.d);
            $(outputShow).attr('disabled', false);
        });

    }

    //-------------- End

    function populateDrdKol(selectedvalue) {
        $('#div_drdkol').mask('Loading ... ');

        var e = {};
        e.domain_ = $('#HFdomain').val();
        Client.getKol(e, function (c) {
            populateDrd('DrdKol', c.d, objResource.DrdFirstOptionText);
            $('#DrdKol').val(selectedvalue).attr('selected', "selected");
            if (selectedvalue == 0) { $('#DrdMoin').empty(); }
            $(".mydds").msDropDown().data("dd");
            $('#div_drdkol').unmask();
        });
    }
    
    function populateDrdMoin(idKol, selectedvalue) {

        if (idKol != 0) {
            $('#div_drdmoin').mask("loading");
            var domain = $('#HFdomain').val();
            var e = {};
            e.domain_ = domain;
            e.idkol_ = idKol;
            Client.get_Moin(e, function (c) {
                populateDrd('DrdMoin', c.d, objResource.DrdFirstOptionText);
                $('#DrdMoin').val(selectedvalue).attr('selected', "selected");
                if (selectedvalue == 0) { $('#DrdTafzili').empty(); $('#BtnAddnewTafziliView').hide("slow"); $('#BtnShowUserInfo').hide("slow"); }
                $(".mydds").msDropDown().data("dd");
                $('#div_drdmoin').unmask();
            })
        } else {
            $('#DrdMoin').empty();
            $('#DrdTafzili').empty();
            $('#BtnAddnewTafziliView').hide("slow"); 
            $('#BtnShowUserInfo').hide("slow");
            $("#DrdTafzili").multiselect('refresh');
            $(".mydds").msDropDown().data("dd");
        }
    }

    function populateDrdTafzili(idmoin, selectedValue) {

        if (idmoin != 0) {
            $('#div_drdtafzili').mask("loading");
            var domain = $('#HFdomain').val();
            var e = {};
            e.domain_ = domain;
            e.idmoin_ = idmoin;
            Client.get_Tafzili(e, function (c) {

                var NotZeroList = null;
                try {
                    if (reportBalance != undefined && reportBalance != null && reportBalance != -1)
                        NotZeroList = jQuery.grep(reportBalance, function (a) {
                            return (a.balance != 0);
                        });
                } catch (e) {}

                $('#DrdTafzili').empty()
                $('#DrdTafzili').append($('<option></option>').val('0').html(objResource.DrdFirstOptionText).attr('idcustomer', 0)); //objResource dar tamam safahat mord niaz var mikonim
            
              
                $.each(c.d, function (val, text) {
                    var optionElem = $('<option></option>').val(text.id).html(text.name).attr('idcustomer', text.idCustomer)
                    try {
                        if (NotZeroList != null && NotZeroList != -1 && NotZeroList != undefined) {
                          

                             var opt = NotZeroList.find(k => k.Tafzilyid == text.id);

                           
                            if (opt != undefined) {
                                if (opt.balance > 0)
                                    optionElem.html(text.name + ' (' + objResource.creditor + ')');
                                else if (opt.balance < 0)
                                    optionElem.html(text.name + ' (' + objResource.deptor + ')');
                            }
                        }
                    } catch (e) { }
                    $('#DrdTafzili').append(optionElem);
                });
           

                $('#DrdTafzili').val(selectedValue).attr('selected', "selected");
                $(".mydds").msDropDown().data("dd");
                $("#DrdTafzili").multiselect('refresh');
                $('#div_drdtafzili').unmask();
                $(document).trigger('function_populateDrdTafzili_complete');
            });
            $('#BtnAddnewTafziliView').show("slow");
        }
        else {
            $('#DrdTafzili').empty();
            $('#BtnShowUserInfo').hide("slow");
            $(".mydds").msDropDown().data("dd");
            $("#DrdTafzili").multiselect('refresh');
        }
        if (selectedValue == 0)
            $('#BtnShowUserInfo').hide("slow");
    }
     
    function GetTblData() { //recive All Item In Tbl
        var TblItem = new Array();
        $('#tblDocItem tr').each(function (i, row) {
            if (i != 0) {
                var hiddata = $(row).find('#HidRowData').val();
                TblItem[i - 1] = hiddata;
            }
        });
        return TblItem;
    }
    function GetDocPrice() { //Recive Prices
        var FcPrices = ["0", "0", "0", "0"];
        //discount , cost , tax , addedvalue 
        if ($('#ChkDiscount').attr('checked')) {
            if ($('#TxtDiscountPercent').val() != "0%")
                FcPrices[0] = $('#TxtDiscountPercent').val();
            else
                FcPrices[0] = $('#TxtDiscount').val();
        }
        if ($('#ChkCost').attr('checked')) {
            if ($('#TxtCostPercent').val() != "0%")
                FcPrices[1] = $('#TxtCostPercent').val();
            else
                FcPrices[1] = $('#TxtCost').val();
        }
        if ($('#ChkTax').attr('checked'))
            FcPrices[2] = $('#TxtTax').val().replace('%', '');
        if ($('#ChkAddedValue').attr('checked'))
            FcPrices[3] = $('#TxtAddedValue').val().replace('%', '');

        return FcPrices;
    }

    function resetDocPrice() {
        $('#ChkDiscount').attr('checked', '');
        $('#ChkCost').attr('checked', '');
        $('#ChkTax').attr('checked', '');
        $('#ChkAddedValue').attr('checked', '');
        $('#TxtDiscountPercent').val('0%').attr('disabled', true).removeClass('txtPriceActive');
        $('#TxtDiscount').val('0').attr('disabled', true).removeClass('txtPriceActive');
        $('#TxtCostPercent').val('0%').attr('disabled', true).removeClass('txtPriceActive');
        $('#TxtCost').val('0').attr('disabled', true).removeClass('txtPriceActive');
        $('#TxtTax').val('0%').attr('disabled', true).removeClass('txtPriceActive');
        $('#TxtAddedValue').val(nUnd(AllSetting.AddedValue)).attr('disabled', true).removeClass('txtPriceActive');
    }

    function SetDocPrice(Discount, Cost, Tax, AddedValue) { //Set Price in Txts Price
        resetDocPrice();

        if (Discount != 0) {
            $('#ChkDiscount').attr('checked', true);
            $('#TxtDiscount').attr('disabled', false);
            $('#TxtDiscountPercent').attr('disabled', false);
            if (Discount.search('%') != '-1')
                $('#TxtDiscountPercent').val(Discount).addClass('txtPriceActive');
            else
                $('#TxtDiscount').val(Discount).addClass('txtPriceActive');
        }

        if (Cost != 0) {
            $('#ChkCost').attr('checked', true);
            $('#TxtCost').attr('disabled', false);
            $('#TxtCostPercent').attr('disabled', false);
            if (Cost.search('%') != '-1')
                $('#TxtCostPercent').val(Cost).addClass('txtPriceActive');
            else
                $('#TxtCost').val(Cost).addClass('txtPriceActive');
        }

        if (Tax != 0) {
            $('#ChkTax').attr('checked', true);
            $('#TxtTax').val(Tax + '%');
            $('#TxtTax').attr('disabled', false).addClass('txtPriceActive');
        }

        if (AddedValue != 0) {
            $('#ChkAddedValue').attr('checked', true);
            $('#TxtAddedValue').val(AddedValue + '%');
            $('#TxtAddedValue').attr('disabled', false).addClass('txtPriceActive');
        }

    }

    function getNewCode(domain, UserID, type, outputShow) { 
        var e = {};
        e.domain_ = domain;
        e.Type_ = type;
        $(outputShow).attr('disabled', true);
        Client.GeCodeDoc(e, function (c) {
            $(outputShow).val(c.d);
            $(outputShow).attr('main_code',c.d);
            $(outputShow).attr('disabled', false);
        }); 
    }
     
    function ReCreateTblItems(data) { // update tblrows in postback 
       
        if (data != null) {

            $('#tblDocItem tr').each(function (i, row) { //remove old tblrow
                if (i != 0) $(row).remove();
            });

            for (var i = 0; i <= data.length - 1; i++) {
                AddRowInTblItem('#tblDocItem tr:last', 'tblrow' + (i + 1).toString(), data[i]);
            }
        }
    }



    $(function () {

        $('.onlynumber').live('keyup', function () {
            this.value = this.value.replace(/\D/g, ''); //not typing alfa 
        });

        $('#DrdOtpriceItem').change(function () { //get price in txt on drd
            $('#TxtPrice_sItem').val($('#DrdOtpriceItem').find("option:selected").attr('price'));
        });
        $('#DrdOtpriceproperty').change(function () { //get price in txt on drd
            $('#TxtDetailItem').val($(this).val());
        });
        $('#deleteTblRow').live('click', function () { //del row tblItem
            if (confirm(objResource.ConfirmDeleteText)) {
                $(this).parents("tr").remove();
                RefreshDoc();
                $('#formChange').change(); //factorsale if form change
            }
        });

        $('#editTblRow').live('click', function () { //Edit Item
            $("#dialog1").dialog("open");
            $('#HFforUpdate').val($(this).parents('tr').attr('id')); // send id row tbl for update
            var domain = $('#HFdomain').val();

            var myObject = $(this).parents("tr").find('#HidRowData').val();
            var data = eval('(' + myObject + ')');

            $('#DrdStoreItem').val(data.idStore).attr('selected', "selected");

            $('#hierarchybreadcrumb2').text(data.nameGroup); //title select group
            GetProductInGroup(data.idGroup, data.nameGroup, domain, data.idproduct, data.idPrice); //get data and select drd value 
            STblItem = data; //save id for update row

            $('#TxtProductName').val(data.productName2).fadeIn();

            getMojodi(data.idproduct);
            $('#TxtPrice_bItem').val(data.price_b);
            $('#TxtPrice_sItem').val(data.price_s);
            $('#TxtCountItem').val(data.count);
            $('#LblUnitItem').text(data.unit);
            $('#TxtDetailItem').val(data.detail);

            $('#BtnUpdateItem').show();
            $('#BtnAddItem').hide();
            $('#BtnAddItemcontinue').hide();

            $(".mydds").msDropDown().data("dd");
            RefreshDoc();
            $('#formChange').change(); //factorsale if form change
        });

        $('#DrdStoreItem').change(function () {
            getMojodi($('#DrdProductItem').find("option:selected").val());
        });

        $('#TxtDiscountPercent').keyup(function () {
            GetPriceByPercent(this, '#TxtDiscount');
            RefreshDoc();
        });
        $('#TxtDiscount').keyup(function () {
            $('#TxtDiscountPercent').val('0%');
            $(this).removeClass('txtPriceActive');
            RefreshDoc();
        });
        $('#TxtCostPercent').keyup(function () {
            GetPriceByPercent(this, '#TxtCost');
            RefreshDoc();
        });
        $('#TxtCost').keyup(function () {
            $('#TxtCostPercent').val('0%');
            $(this).removeClass('txtPriceActive');
            RefreshDoc();
        });
        $('#TxtTax').keyup(function () {
            RefreshDoc();
        });
        $('#TxtAddedValue').keyup(function () {
            RefreshDoc();
        });
        $('#TxtCost,#TxtDiscount').blur(function () {
            if ($(this).val() == "") { $(this).val('0'); }
        });
        $('#TxtAddedValue,#TxtTax,#TxtCostPercent,#TxtDiscountPercent').blur(function () {
            $(this).removeClass('txtPriceActive');
            //if ($(this).val() > 100) $(this).val('100%');
            if ($(this).val() == "") { $(this).val('0%'); }
            if ($(this).val().search('%') == -1) $(this).val($(this).val() + '%');
        });
        $('#TxtAddedValue,#TxtTax,#TxtCostPercent,#TxtDiscountPercent').click(function () {
            $(this).val($(this).val().replace(/%/gi, ''));
        });

        $('#DrdKol').change(function () {
            var idKol = ($('#DrdKol').find("option:selected").val());
            populateDrdMoin(idKol, 0);
        });

        $('#DrdMoin').change(function () {
            var idmoin = ($('#DrdMoin').find("option:selected").val());
            populateDrdTafzili(idmoin, 0);
        });

        $('#DrdTafzili').change(function () {
            //temp
        });

        $('#ChkDiscount').change(function () {
            ChkEnableTxt(this, '#TxtDiscount');
        });
        $('#ChkCost').change(function () {
            ChkEnableTxt(this, '#TxtCost');
        });
        $('#ChkTax').change(function () {
            ChkEnableTxt(this, '#TxtTax');
        });
        $('#ChkAddedValue').change(function () {
            ChkEnableTxt(this, '#TxtAddedValue');
        });
        function ChkEnableTxt(ChkName, TxtName) {
            $(TxtName).attr('disabled', !ChkName.checked).removeClass('txtPriceActive');
            $(TxtName + 'Percent').attr('disabled', !ChkName.checked).removeClass('txtPriceActive');
            RefreshDoc();
            $(TxtName).focus();
        }
    });

    function GetPriceByPercent(PercentEle, Ele) {  //daryaf mizan gheymat bar hasab darsad
        try {
            var price = GetCountAndPriceForFactor($('#HFFactorType').val()).price;
            if ($('#LblPriceDoc').text() != "" && $(PercentEle).val() != "0%") $(Ele).val(Math.ceil(parseFloat(($(PercentEle).val().replace('%', '')) / 100) * price));
        }
        catch (Err)
        { }
    }


    function getMojodi(idproduct) {
        var domain = $('#HFdomain').val();
        var idStore = $('#DrdStoreItem').find("option:selected").val();
        var UserID = $('#HFUserCode').val();

        var mojodiclient = 0;
        if (DbDocItem.length != 0) {
            mojodiclient = getMojodiClient(idStore, idproduct); //get All row
            var mojodiDb = 0;
            for (i = 0; i <= DbDocItem.length - 1; i++) {
                if (DbDocItem[i].idproduct == idproduct && DbDocItem[i].idStore == idStore)
                    mojodiDb += DbDocItem[i].count; //get Old Row
            }
            mojodiclient = (STblItem != null) ? mojodiclient + (mojodiDb * -1) - STblItem.count : mojodiclient + (mojodiDb * -1);
            //(STblItem != null)  yani vaghti ke item dar hale virayesh ast
            //STblItem = all property Item In TblItemDoc 
        }
        else {
            mojodiclient = getMojodiClient(idStore, idproduct);
            mojodiclient = mojodiclient - parseInt((STblItem != null) ? STblItem.count : 0);
        }
        if ($('#HFFactorType').val() == 3) mojodiclient = mojodiclient * -1;// Agar Factor Forosh Bood az mojodi kam shavad -> * -1
        if ($('#HFFactorType').val() == 2)
            if (nUnd(AllSetting.PreFactor) == 'true') mojodiclient = mojodiclient * -1; //pish factor forosh bood va dar tanzimate pish factor barabar ba hesab shavad bood .kam shavad
            else mojodiclient = 0;  //dar gheyre in sorat hesab nashavad
        
        getMojodiST(idStore, idproduct, domain, UserID, mojodiclient);
        //get mojodi db + clientTbl if click edititem mojodiClient - Count Edited Row
    }

    var STblItem = null; //for update
    function AddItem(place, idrow) { //insert new item
        var objTblItem = new Object;
        objTblItem.id = (STblItem != null) ? STblItem.id : 0;
        objTblItem.codeproduct = ItemCode;
        objTblItem.idStore = $('#DrdStoreItem').find("option:selected").val();
        objTblItem.idGroup = $('#HFidGroup').val();
        objTblItem.nameGroup = $('#HFnameGroup').val();
        objTblItem.idproduct = $('#DrdProductItem').find("option:selected").val();
        objTblItem.productName = htmlEncode($('#DrdProductItem').find("option:selected").text());
        objTblItem.productName2 = ($('#TxtProductName').val() == "" || $('#TxtProductName').length == 0) ? null : $('#TxtProductName').val();
        if (objTblItem.productName2 != null) {
            objTblItem.productName2 = htmlEncode(objTblItem.productName2);
        }
        objTblItem.price_b = $('#TxtPrice_bItem').val().replace(/,/gi, '');
        objTblItem.price_s = $('#TxtPrice_sItem').val().replace(/,/gi, '');
        objTblItem.idPrice = $('#DrdOtpriceItem').find("option:selected").val();
        objTblItem.count = $('#TxtCountItem').val() //.replace(/,/gi, '');;
        objTblItem.unit = $('#LblUnitItem').text();
        objTblItem.detail = htmlEncode($('#TxtDetailItem').val());
        objTblItem.price_detail = $('#DrdOtpriceItem').find("option:selected").text();
        objTblItem.ArzeshAfzode = GetProductDetail(objTblItem.idproduct).ArzeshAfzode;
        objTblItem.discount = 0;
        objTblItem.addvalue = 0;
        AddRowInTblItem(place, idrow, objTblItem);
        STblItem = null;
    }
     
    function CheckCodeDoc(type, code,txtname) {
        if (code == docState.codedoc) { $('#Valid_TxtCodeDoc').hide(); $(txtname).removeClass('error').addClass('valid'); return false; }
        $('#Valid_TxtCodeDoc').show();
        $('#Valid_TxtCodeDoc').html('<div class="wait"></div>');
        $('#BtnInsertDoc').attr('disabled','disabled');
        $('#BtnPermanenDoc').attr('disabled', 'disabled');
        $('#BtnSavePrint').attr('disabled', 'disabled');
        var e = {};
        e.domain_ = $('#HFdomain').val();
        e.type_ = type;
        e.code_ = code;

        Client.CheckCodeDoc(e, function (c) {
            if (c.d == true) {
                $('#Valid_TxtCodeDoc').hide();
                $('#BtnInsertDoc').attr('disabled', '');
                $('#BtnPermanenDoc').attr('disabled', '');
                $('#BtnSavePrint').attr('disabled', '');
                $(txtname).removeClass('error').addClass('valid');
            }
            else {
                $('#Valid_TxtCodeDoc').html('<span style="color:red">کد تکراری است</span>');
                $(txtname).addClass('error').removeClass('valid');
            } 
        });
    }
     

var Client = new GetJsonData;

function GetJsonData() {
    this.GetAccountsByGroupIdUrl = "../WebServices/Store_.asmx/store_GetAccountsByGroupId";
    this.GetAccountsByGroupId = function (c, e) {
        this.POST(this.GetAccountsByGroupIdUrl, c, e)
    };
    this.Insert_Factor_DocDetailUrl = "../WebServices/Store_.asmx/Insert_Factor_DocDetail";
    this.Insert_Factor_DocDetail = function (c, e) {
        this.POST(this.Insert_Factor_DocDetailUrl, c, e)
    };
    this.Store_getCodeDocMainUrl = "../WebServices/Store_.asmx/Store_getCodeDocMainForFactor";
    this.GeCodeDocMain = function (c, e) {
        this.POST(this.Store_getCodeDocMainUrl, c, e)
    };
    //======================================================

    this.Update_Product_ActiveUrl = "../WebServices/Store_.asmx/Update_Product_Active";
    this.Update_Product_Active = function (c, e) {
        this.POST(this.Update_Product_ActiveUrl, c, e)
    };

    //======================================================
    this.get_productsUrl = "../WebServices/Store_.asmx/store_getProduct";
    this.get_MojodiUrl = "../WebServices/Store_.asmx/store_getMojodi";
    this.getKolUrl = "../WebServices/Store_.asmx/store_getKol";
    this.get_moinsUrl = "../WebServices/Store_.asmx/store_getMoin";
    this.get_tafziliUrl = "../WebServices/Store_.asmx/store_getTafzili";

    this.Insert_FactorUrl = "../WebServices/Store_.asmx/Insert_Factor";
    this.Insert_DocUrl = "../WebServices/Store_.asmx/Insert_Doc";
    this.Store_InsertTafziliUrl = "../WebServices/Store_.asmx/Store_InsertTafzili";

    this.Store_getCodeDocUrl = "../WebServices/Store_.asmx/Store_getCodeDoc";
    this.Store_CheckCodeDocUrl = "../WebServices/Store_.asmx/Store_CheckCodeDoc";
    this.Store_getCodeTafziliUrl = "../WebServices/Store_.asmx/Store_getCodeTafzili";
    this.Store_CheckCodeTafziliUrl = "../WebServices/Store_.asmx/Store_CheckCodeTafzili";
    this.Store_DeleteDocUrl = "../WebServices/Store_.asmx/Store_DeleteDoc";
    this.Store_GetFactorByIDUrl = "../WebServices/Store_.asmx/Store_GetFactorByID";
    this.Store_GetFactorByCodeUrl = "../WebServices/Store_.asmx/Store_GetFactorByCode";
    this.Store_GetDocByIDUrl = "../WebServices/Store_.asmx/Store_GetDocByID";
    this.Store_getDateAndTimeNowUrl = "../WebServices/Store_.asmx/Store_getDateAndTimeNow";
    this.Store_CustomerInfoUrl = "../WebServices/Store_.asmx/store_CustomerInfo";
    this.Store_getDocUrl = "../WebServices/Store_.asmx/Store_getDoc";
    this.Store_getFactorUrl = "../WebServices/Store_.asmx/Store_getFactor";
    this.store_getFactorByCustUrl = "../WebServices/Store_.asmx/store_getFactorByCust";
    this.Store_getAllTafziliUrl = "../WebServices/Store_.asmx/Store_getAllTafzili";
    this.Store_DeleteTafziliUrl = "../WebServices/Store_.asmx/Store_DeleteTafzili";
    this.Store_UpdateTafziliUrl = "../WebServices/Store_.asmx/Store_UpdateTafzili";

    this.store_getAllSettingUrl = "../WebServices/Store_.asmx/store_getAllSetting";
    this.store_setAllSettingUrl = "../WebServices/Store_.asmx/store_setAllSetting";
    this.store_getAllSettingForEditUrl = "../WebServices/Store_.asmx/store_getAllSettingForEdit";
    this.store_default_SettingUrl = "../WebServices/Store_.asmx/store_default_Setting";

    this.Store_getGroupUrl = "../WebServices/Store_.asmx/Store_getGroup";
    this.Store_InsertGroupUrl = "../WebServices/Store_.asmx/Store_InsertGroup";
    this.Store_UpdateGroupUrl = "../WebServices/Store_.asmx/Store_UpdateGroup";
    this.Store_DeleteGroupUrl = "../WebServices/Store_.asmx/Store_DeleteGroup";

    this.Store_getColumnProductUrl = "../WebServices/Store_.asmx/store_getColumnProduct"; 
    this.Store_Insert_ProductUrl = "../WebServices/Store_.asmx/store_Insert_Product";
    this.Store_CheckCodeProductUrl = "../WebServices/Store_.asmx/Store_CheckCodeProduct";
    this.Store_getCodeProductUrl = "../WebServices/Store_.asmx/Store_getCodeProduct";
    this.Store_getProductByGroupUrl = "../WebServices/Store_.asmx/store_getProductByGroup";
    this.Store_DeleteProductUrl = "../WebServices/Store_.asmx/store_DeleteProduct";
    this.Store_getProductByIDUrl = "../WebServices/Store_.asmx/store_getProductByID";
    this.store_getProductDrdUrl = "../WebServices/Store_.asmx/store_getProductDrd";
    this.store_getProductStatusStUrl = "../WebServices/Store_.asmx/store_getProductStatusSt";
    this.store_getProductReportUrl = "../WebServices/Store_.asmx/store_getProductReport";
    this.store_getProductSaleReportUrl = "../WebServices/Store_.asmx/store_getProductSaleReport";
    this.store_getProductReport_saleUrl = "../WebServices/Store_.asmx/store_getProductReport_sale";
    this.Store_getSelectorGroupUrl = "../WebServices/Store_.asmx/Store_getSelectorGroup";

    this.cust_group_list2Url = "../WebServices/get_info.asmx/search_customer_byName";

    this.Insert_FacTemplateUrl = "../WebServices/template_service.asmx/Insert_Template"; //../WebServices/Store_.asmx/Insert_FacTemplate
    this.Duplicate_FacTemplateUrl = "../WebServices/Store_.asmx/Duplicate_FacTemplate";
    this.setDefault_FacTemplateUrl = "../WebServices/Store_.asmx/setDefault_FacTemplate";
    this.Update_FacTemplateUrl = "../WebServices/template_service.asmx/Update_Template"; //../WebServices/Store_.asmx/Update_FacTemplate
    this.Delete_FacTemplateUrl = "../WebServices/Store_.asmx/Delete_FacTemplate";
    this.Get_FacTemplateUrl = "../WebServices/template_service.asmx/Get_FacTemplate";
    this.GetByID_FacTemplateUrl = "../WebServices/template_service.asmx/GetByID_FacTemplate";
    this.showFactorUrl = "../WebServices/Store_.asmx/show_Factor";

    this.Insert_FacTemplate = function (c, e) {
        this.POST(this.Insert_FacTemplateUrl, c, e)
    };
    this.Duplicate_FacTemplate = function (c, e) {
        this.POST(this.Duplicate_FacTemplateUrl, c, e)
    };
    this.setDefault_FacTemplate = function (c, e) {
        this.POST(this.setDefault_FacTemplateUrl, c, e)
    };
    this.Update_FacTemplate = function (c, e) {
        this.POST(this.Update_FacTemplateUrl, c, e)
    };
    this.Delete_FacTemplate = function (c, e) {
        this.POST(this.Delete_FacTemplateUrl, c, e)
    };
    this.Get_FacTemplate = function (c, e) {
        this.POST(this.Get_FacTemplateUrl, c, e)
    };
    this.GetByID_FacTemplate = function (c, e) {
        this.POST(this.GetByID_FacTemplateUrl, c, e)
    };
    this.showFactor = function (c, e) {
        this.POST(this.showFactorUrl, c, e)
    };

    this.get_products = function (c, e) {
        this.POST(this.get_productsUrl, c, e)
    };
    this.get_Mojodi = function (c, e) {
        this.POST(this.get_MojodiUrl, c, e)
    };
    this.getKol = function (c, e) {
        this.POST(this.getKolUrl, c, e)
    };
    this.get_Moin = function (c, e) {
        this.POST(this.get_moinsUrl, c, e)
    };
    this.get_Tafzili = function (c, e) {
        this.POST(this.get_tafziliUrl, c, e)
    };

    this.Insert_Doc = function (c, e) {
        this.POST(this.Insert_DocUrl, c, e)
    };
    this.Insert_Factor = function (c, e) {
        this.POST(this.Insert_FactorUrl, c, e)
    };
    this.InsertTafzili = function (c, e) {
        this.POST(this.Store_InsertTafziliUrl, c, e)
    };

    this.GeCodeDoc = function (c, e) {
        this.POST(this.Store_getCodeDocUrl, c, e)
    };
    this.CheckCodeDoc = function (c, e) {
        this.POST(this.Store_CheckCodeDocUrl, c, e)
    };
    this.getCodeTafzili = function (c, e) {
        this.POST(this.Store_getCodeTafziliUrl, c, e)
    };
    this.CheckCodeTafzili = function (c, e) {
        this.POST(this.Store_CheckCodeTafziliUrl, c, e)
    };
    this.DeleteDoc = function (c, e) {
        this.POST(this.Store_DeleteDocUrl, c, e)
    };
    this.GetFactorByID = function (c, e) {
        this.POST(this.Store_GetFactorByIDUrl, c, e)
    };
    this.GetFactorByCode = function (c, e) {
        this.POST(this.Store_GetFactorByCodeUrl, c, e)
    };
    this.GetDocByID = function (c, e) {
        this.POST(this.Store_GetDocByIDUrl, c, e)
    };
    this.getDateAndTimeNow = function (c, e) {
        this.POST(this.Store_getDateAndTimeNowUrl, c, e)
    };
    this.CustomerInfo = function (c, e) {
        this.POST(this.Store_CustomerInfoUrl, c, e)
    };
    this.getDoc = function (c, e) {
        this.POST(this.Store_getDocUrl, c, e)
    };
    this.getFactor = function (c, e) {
        this.POST(this.Store_getFactorUrl, c, e)
    };
    this.getFactorByCust = function (c, e) {
        this.POST(this.store_getFactorByCustUrl, c, e)
    };
    this.getAllTafzili = function (c, e) {
        this.POST(this.Store_getAllTafziliUrl, c, e)
    };
    this.DeleteTafzili = function (c, e) {
        this.POST(this.Store_DeleteTafziliUrl, c, e)
    };
    this.UpdateTafzili = function (c, e) {
        this.POST(this.Store_UpdateTafziliUrl, c, e)
    }; 

    this.getAllSetting = function (c, e) {
        this.POST(this.store_getAllSettingUrl, c, e)
    };
    this.setAllSetting = function (c, e) {
        this.POST(this.store_setAllSettingUrl, c, e)
    };
    this.getAllSettingForEdit = function (c, e) {
        this.POST(this.store_getAllSettingForEditUrl, c, e)
    };
    this.default_Setting = function (c, e) {
        this.POST(this.store_default_SettingUrl, c, e)
    };


    this.getGroup = function (c, e) {
        this.POST(this.Store_getGroupUrl, c, e)
    };
    this.InsertGroup = function (c, e) {
        this.POST(this.Store_InsertGroupUrl, c, e)
    };
    this.UpdateGroup = function (c, e) {
        this.POST(this.Store_UpdateGroupUrl, c, e)
    };
    this.DeleteGroup = function (c, e) {
        this.POST(this.Store_DeleteGroupUrl, c, e)
    };

    this.getColumnProduct = function (c, e) {
        this.POST(this.Store_getColumnProductUrl, c, e)
    };
    this.Insert_ColumnProduct = function (c, e) {
        this.POST(this.Store_Insert_ColumnProductUrl, c, e)
    };
    this.Insert_Product = function (c, e) {
        this.POST(this.Store_Insert_ProductUrl, c, e)
    };
    this.CheckCodeProduct = function (c, e) {
        this.POST(this.Store_CheckCodeProductUrl, c, e)
    };
    this.getCodeProduct = function (c, e) {
        this.POST(this.Store_getCodeProductUrl, c, e)
    };
    this.getProductByGroup = function (c, e) {
        this.POST(this.Store_getProductByGroupUrl, c, e)
    };
    this.DeleteProduct = function (c, e) {
        this.POST(this.Store_DeleteProductUrl, c, e)
    };
    this.getProductByID = function (c, e) {
        this.POST(this.Store_getProductByIDUrl, c, e)
    };
    this.getProductDrd = function (c, e) {
        this.POST(this.store_getProductDrdUrl, c, e)
    };
    this.getProductStatusSt = function (c, e) {
        this.POST(this.store_getProductStatusStUrl, c, e)
    };
    this.getProductReport = function (c, e) {
        this.POST(this.store_getProductReportUrl, c, e)
    };
    this.getProductSaleReport = function (c, e) {
        this.POST(this.store_getProductSaleReportUrl, c, e)
    };
    this.getProductReport_sale = function (c, e) {
        this.POST(this.store_getProductReport_saleUrl, c, e)
    };
    this.getSelectorGroup = function (c, e) {
        this.POST(this.Store_getSelectorGroupUrl, c, e)
    };

    this.cust_group_list2 = function (c, e) {
        this.POST(this.cust_group_list2Url, c, e)
    };
    //--------------<<
     
    this.POST = function (c, e, d) {
        e = JSON.stringify(e);
        $.post_(c, e, function (c) {
            d && d(c);
        }, "json")
    };
}


function _ajax_request(c, e, d, f, g, k) {
    jQuery.isFunction(e) && (d = e, e = {});
    return jQuery.ajax({ type: "POST", url: c, data: e, success: d, dataType: f, contentType: k })
}
jQuery.extend({ get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
    put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
    post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
    delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
});
 