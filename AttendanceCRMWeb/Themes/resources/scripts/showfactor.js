
function objFactorUtility() {
    this.template = { text: '' };
    this.setting = {
        currenttime: '',
        currentdate: '',
        CompanyCommander: '',
        CompanyName: '',
        RegNumber: '',
        Province: '',
        City: '',
        CompanyAddress: '',
        EconomicNumber: '',
        ZipCode: '',
        CompanyTel: '',
        CompanyFax: ''
    }
    this.factorItem=function(){
        id='';
        idStore='';
        idGroup='';
        nameGroup='';
        idproduct='';
        productName='';
        productName2='';
        price_b='';
        price_s='';
        idPrice='';
        count='';
        unit='';
        detail='';
        codeproduct='';
        price_detail='';
        ArzeshAfzode='';
        discount = '';
    }
    this.factor = {
        idkol: '',
        idmoin: '',
        idtafzili: '',
        name_tafzili: '',
        id_customer: '',
        name_Owner: '',
        factor: {
            AddedValue: '',
            code: '',
            Cost: '',
            date: '',
            detail: '',
            Discount: '',
            ID: '',
            Id_Tafzili: '',
            Id_User: '',
            pay: '',
            pay_status: '',
            status: '',
            subtract: '',
            Tax: '',
            temp: '',
            time: '',
            type: '',
            Seller :'',
        },
        factorItem: new Array()
    }
    this.customer = {};
    this.option = {
        showsplit: true,
        lang: 'en',
        res_factor: 'invoice',
        res_prefactor: 'pre-invoice',
        user_print: 'master'
    }
}

function GetCountAndPrice(objFactor, setting) { // mohasebeye gheymat kol va tedad kala darj shode dar tblItemDoc
   
    var factor = objFactor.factor;
    var factorItem = objFactor.factorItem;
    var towDigit = false;
    try { towDigit = JSON.parse(setting.towDigit) } catch (e) { };

    var price0 = 0;        //sum(count * price_s)
    var price = 0;         //sum(count * price_s) - AllDiscount
    var count = 0;         //sum(count)
    var price_nocount = 0; //sum(price_s)
    var addvalue_old = false;

    var AllDiscount = 0;
    var AllCost = 0;
    var AllTax = 0;
    var AllAddValue_New = 0;

    var itemResult = new Array();
    var discountForAll = true;

    $.each(factorItem, function (i, item) {
        count += parseFloat(item.count);
        price += item.count * parseFloat(item.price_s.toString().replace(/,/gi, '')); //gheymate forosh
        if (resources.lang == "fa" && !towDigit) price = Math.round(price);
        price_nocount += parseFloat(item.price_s.toString().replace(/,/gi, ''));
        if (item.discount != 0) discountForAll = false;
        if (item.addvalue == null || resources.lang == "en") addvalue_old = true
    });

    

    price0 = price;
    if (factor.Discount != '0') AllDiscount = GetPriceByPercent2(factor.Discount, price);
    if (factor.Cost != '0') AllCost = GetPriceByPercent2(factor.Cost, price);
    price = parseFloat(price) - parseFloat(AllDiscount);
    if (resources.lang == "fa" && !towDigit) price = Math.round(price);

    if (factor.Tax != '0') AllTax = GetPriceByPercent2(factor.Tax + '%', price);

   

    $.each(factorItem, function (i, item) {
        var priceProduct = item.count * parseFloat(item.price_s.toString().replace(/,/gi, ''));
        if (addvalue_old) {
            var priceAddedValueProduct = 0;
            var priceDiscount = (discountForAll) ? getNewPriceP2(price0, priceProduct, factor.Discount) : item.discount;
            if (priceDiscount.toString().indexOf('%') == -1) {
                priceAddedValueProduct = getNewPriceP2(price, priceProduct - priceDiscount, factor.AddedValue + '%');
            }
            else {
                priceDiscount = getNewPriceP2(price0, priceProduct, item.discount)
                priceAddedValueProduct = getNewPriceP2(price, priceProduct - priceDiscount, factor.AddedValue + '%');
            }
            itemResult.push({ discount: parseFloat(priceDiscount), addedvalue: parseFloat(priceAddedValueProduct) });
        }
        else {
            var priceDiscount = 0;
            if (item.discount != '' && item.discount != null) priceDiscount = item.discount;
            if (priceDiscount.toString().indexOf('%') != -1) priceDiscount = Math.round((parseFloat((priceDiscount.replace('%', '')) / 100) * parseFloat(priceProduct)));
            var priceAddedValueProduct = 0;
            if (item.addvalue != '' && item.addvalue != null) priceAddedValueProduct = Math.round((parseFloat((item.addvalue) / 100) * (parseFloat(priceProduct) - priceDiscount)));
            itemResult.push({ discount: parseFloat(priceDiscount), addedvalue: parseFloat(priceAddedValueProduct) });
            AllAddValue_New += parseFloat(priceAddedValueProduct);
        }
    });

    var result = {};
    result.count = count;
    result.price = price0;
    result.price_nocount = price_nocount;

    
    if (factor.AddedValue != 0) {
        if (resources.lang == "fa" && !towDigit) {
            result.pricekol = parseInt(price + (((price) / 100) * parseFloat(factor.AddedValue)) - AllTax + parseFloat(AllCost));
            result.addedvalue = parseInt(((price) / 100) * parseFloat(factor.AddedValue));
        }
        else {
            result.pricekol = price + (((price) / 100) * parseFloat(factor.AddedValue)) - AllTax + parseFloat(AllCost);
            result.addedvalue = ((price) / 100) * parseFloat(factor.AddedValue);
        }
    }
    else {
        var InternalPrice = price;
        InternalPrice = price + AllAddValue_New;
        if (resources.lang == "fa" && !towDigit) result.pricekol = parseInt(InternalPrice - AllTax + parseFloat(AllCost));
        else result.pricekol = InternalPrice - AllTax + parseFloat(AllCost);
        result.addedvalue = AllAddValue_New; //gablan 0 bud
    }
    
    result.discount = AllDiscount;
    result.cost = AllCost;
    result.tax = AllTax;
    result.addedvalue_percent = factor.AddedValue + '%';
    result.items = itemResult;

    return result;
}

function GetDiscountPrice(factor, allprice) {
    var Disarr = factor.factor.Discount.toString().split('%');
    var ret = Disarr[0];
    if (Disarr.length > 1)
        ret = ((parseFloat(Disarr[0]) * parseFloat(allprice.price)) / 100).toString();
    return ret;
}
                                          
function replace_FactorItem(objFactor) {   //**************************************
                                           //*  this function has server side    **
    var strF = objFactor.template.text;    //*  on change this function          **
    var setting = objFactor.setting;       //*  andalso change vb function       **
    var factor = objFactor.factor;         //**************************************
    var option = objFactor.option;
    var showtype = objFactor.showtype;
    var cust = objFactor.customer;
    var allprice = GetCountAndPrice(factor, setting);
    var facTitle = (factor.factor.type == 2) ? option.res_prefactor : option.res_factor;
    var DiscountPrice = GetDiscountPrice(factor, allprice);
    $('#PreviewContainer').remove();

    var towDigit = false;
    try { towDigit = JSON.parse(setting.towDigit) } catch (e) { };
   
    strF = strF.replace(/#F_title#/gi, facTitle);
    strF = strF.replace(/#F_code#/gi, factor.factor.code);
    strF = strF.replace(/#F_special_code#/gi, factor.factor.code2);
    strF = strF.replace(/#F_date#/gi, factor.factor.date);
    strF = strF.replace(/#F_detail#/gi, factor.factor.detail);
    strF = strF.replace(/#F_owner#/gi, factor.name_Owner);
    strF = strF.replace(/#F_seller#/gi, '<span class="FCseller rcrmCustSpan">' + factor.factor.Seller + '</span>');
    strF = strF.replace(/#F_creator#/gi, option.user_print);
    strF = strF.replace(/#F_currenttime#/gi, nUnd(setting.currenttime));
    strF = strF.replace(/#F_currentdate#/gi, nUnd(setting.currentdate));

    strF = strF.replace(/#F_price#/gi, GetCurrencySales(allprice.price, option.showsplit, towDigit));
    strF = strF.replace(/#F_pricefa#/gi, convertNumberToString(parseInt(allprice.price), option.lang) + ' ' + nUnd(setting.UnitPrice));
    strF = strF.replace(/#F_pricekol#/gi, GetCurrencySales(allprice.pricekol, option.showsplit, towDigit));
    strF = strF.replace(/#F_pricekolAlfa#/gi, convertNumberToString(allprice.pricekol, option.lang) + ' ' + nUnd(setting.UnitPrice));

    strF = strF.replace(/#F_discount_price#/gi, GetCurrencySales(DiscountPrice, option.showsplit, towDigit));
    strF = strF.replace(/#F_discount#/gi, GetCurrencySales(factor.factor.Discount, option.showsplit, towDigit));
    strF = strF.replace(/#F_cost#/gi, GetCurrencySales(factor.factor.Cost, option.showsplit, towDigit));
    strF = strF.replace(/#F_tax#/gi, GetCurrencySales(allprice.tax, option.showsplit, towDigit));
    strF = strF.replace(/#F_tax_percent#/gi, GetCurrencySales(factor.factor.Tax, option.showsplit, towDigit));
    strF = strF.replace(/#F_addedvalue#/gi, GetCurrencySales(allprice.addedvalue, option.showsplit, towDigit));
    strF = strF.replace(/#F_addedvalue_percent#/gi, factor.factor.AddedValue);
    strF = strF.replace(/#F_after_discount#/gi, GetCurrencySales((allprice.price - DiscountPrice), option.showsplit, towDigit)); //'<span class="F_after_discount"></span>'
    strF = strF.replace(/#F_price_nocount#/gi, GetCurrencySales(allprice.price_nocount, option.showsplit, towDigit));
    

    strF = strF.replace(/#F_settlement#/gi, '<span class="FCSettlement rcrmCustSpan"> </span>');
    //strF = strF.replace(/#F_seller#/gi, '<span class="FCseller rcrmCustSpan"> </span>');
    strF = strF.replace(/#F_unitprice#/gi, nUnd(setting.UnitPrice));
    strF = strF.replace(/#F_count#/gi, allprice.count);

    strF = strF.replace(/#S_name#/gi, nUnd(setting.CompanyCommander));
    strF = strF.replace(/#S_companyname#/gi, nUnd(setting.CompanyName));
    strF = strF.replace(/#S_regnumber#/gi, nUnd(setting.RegNumber));
    strF = strF.replace(/#S_state#/gi, nUnd(setting.Province));
    strF = strF.replace(/#S_city#/gi, nUnd(setting.City));
    strF = strF.replace(/#S_address#/gi, nUnd(setting.CompanyAddress));
    strF = strF.replace(/#S_economicNumber#/gi, nUnd(setting.EconomicNumber));
    strF = strF.replace(/#S_zipcode#/gi, nUnd(setting.ZipCode));
    strF = strF.replace(/#S_phoneOrfax#/gi, nUnd(setting.CompanyTel));
    strF = strF.replace(/#S_fax#/gi, nUnd(setting.CompanyFax));
    
    strF = strF.replace(/#B_name#/gi, '<span class="FCtafzili rcrmCustSpan">' + factor.name_tafzili + '</span>');
    strF = strF.replace(/#B_code#/gi, factor.codetafzili);
    strF = strF.replace(/#B_cust_code#/gi, factor.id_customer);
    strF = strF.replace(/#B_kol#/gi, factor.idkol);
    strF = strF.replace(/#B_moin#/gi, factor.idmoin);
    
    strF = strF.replace(/#F_discount_priceAlfa#/gi, convertNumberToString(DiscountPrice, option.lang) + ' ' + nUnd(setting.UnitPrice));
    strF = strF.replace(/#F_addedvalueAlfa#/gi, convertNumberToString(allprice.addedvalue, option.lang) + ' ' + nUnd(setting.UnitPrice));
    strF = strF.replace(/#F_taxAlfa#/gi, convertNumberToString(allprice.tax, option.lang) + ' ' + nUnd(setting.UnitPrice));
    strF = strF.replace(/#F_costAlfa#/gi, convertNumberToString(allprice.cost, option.lang) + ' ' + nUnd(setting.UnitPrice));

    
    $.each(cust, function (value, text) {
        var regex = new RegExp('#' + value + '#', 'gi');
        strF = strF.replace(regex, '<span class="FC' + value + ' rcrmCustSpan">' + text + '</span>');
    });
    
    if (cust.CUSFIELD_title != undefined || cust.CUSFIELD_title != null) 
        strF = strF.replace(/#CUSFIELD[_]\d*[_]\d*#/gi, ' ');
    
    if (showtype == undefined) strF = strF.replace(/#\w*#/gi, ' ');
    
    var ft = $('<div id="PreviewContainer"><meta http-equiv="Content-Type" content="text/html;charset=utf-8">' + strF + '</div>');
    if (ft.find('#rcrm_document_main').length > 0) {
        if (ft.find('#rcrm_document_main').find('link').length == 0) ft.find('#rcrm_document_main').prepend('<link href="../Themes/resources/css/reportcrm.css" type="text/css" rel="stylesheet" />');
    }
        
    for (var j = 0; j <= factor.factorItem.length - 1; j++) {
        var dtR = factor.factorItem[j];
        var proparr = new Array();
        var ProductField = new Array();
        var propertis = ""
        for (var i = 0; i < dtR.propertis.length; i++) {
            proparr.push(dtR.propertis[i].title == null ? dtR.propertis[i].text : dtR.propertis[i].title.Text + ' : ' + dtR.propertis[i].text);
        }
        propertis = proparr.join(',');
        var pricekol = (resources.lang == "fa" && !towDigit) ? Math.round(parseFloat(dtR.price_s.toString().replace(/,/gi, '')) * dtR.count) : (parseFloat(dtR.price_s.toString().replace(/,/gi, '')) * dtR.count);
        var price_after_discount_row = (pricekol - allprice.items[j].discount);

        //Replace Kardan jadval Gadim --------------------------------------------------------------------------------------
        if (ft.find('#Tmtbl').length > 0) {
            var TrHead = ft.find('#Tmtbl tr:first');
            TrHead.find("td").each(function () {
                var fieldName = $(this).attr("item");
                var t = fieldName.toString().split('_');
                if (t.length > 0)
                    if (t[0] == 'ProductField')
                        ProductField.push(t[1]);
            });
            var direction = resources.direction;
            var newRow = $('<tr></tr>');
            TrHead.find("td").each(function () {
                var tdStyle = "border: 1px solid #888;padding:5px;";
                if ($(this).attr('tdfontfamily') != undefined && $(this).attr('tdfontfamily') != null && $(this).attr('tdfontfamily') != "-1" && $(this).attr('tdfontfamily') != "")
                    tdStyle += "font-family:" + $(this).attr('tdfontfamily') + ";"
                else {
                    if (direction == 'ltr')
                        tdStyle += "font-family: tahoma;";
                    else
                        tdStyle += "font-family: BKoodakBold,B Koodak,tahoma;";
                }
                if ($(this).attr('tdfontsize') != undefined && $(this).attr('tdfontsize') != null && $(this).attr('tdfontsize') != "")
                    tdStyle += "font-size:" + $(this).attr('tdfontsize') + "px;"
                else
                    tdStyle += "font-size: 11px;";

                var newtd = $('<td></td>');
                newtd.attr('style', tdStyle);
                newtd.css('text-align', $(this).css('text-align'));
                var fieldName = $(this).attr("item");
                newtd.html(getTableParametrsValue(fieldName, dtR, factor, pricekol, option, price_after_discount_row, allprice, j, propertis, ProductField, towDigit))
                newRow.append(newtd);
            });
            TrHead.parent().append(newRow);
        };

        //Replace Kardan jadval jadid --------------------------------------------------------------------------------------
        if (ft.find('.rcrmTableElement').length > 0) {
            ft.find('.rcrmTableElement[tabletype=repeating]').each(function () {
                var table = $(this);
                table.find('thead').find('tr:first').attr('id', 'rcrmTr_h');
                table.find('tfoot').find('tr:first').attr('id', 'rcrmTr_f');
                var tr = table.find('tbody').find('tr:first').clone();
                var newRow = tr.attr('id', 'rcrmTr_' + j);
                newRow.find('.rcrmDocElementContentText').each(function () {
                    var paramName = $(this).html().toString().split("$").join('').trim();
                    var t = paramName.split('_');
                    if (t.length > 0) if (t[0] == 'ProductField') ProductField.push(t[1]);
                    var paramVal = getTableParametrsValue(paramName, dtR, factor, pricekol, option, price_after_discount_row, allprice, j, propertis, ProductField, towDigit);
                    $(this).html(paramVal);
                });
                table.find('tbody').append(newRow);
                if (j == factor.factorItem.length - 1) {
                    table.find('tbody').find('tr:first').hide();
                }
            });
        }
    };
    rcrmSetElementPosition(ft);
    //------------------------------------------------------------------------------------------------------------------------------
    renderStamp(ft, factor);
    return ft;
}

function getTableParametrsValue(paramName, dtR, factor, pricekol, option, price_after_discount_row, allprice, j, propertis, ProductField, towDigit) {
    var paramVal = "";
    switch (paramName) {
        case "pricekol":
            paramVal = GetCurrencySales(pricekol, option.showsplit, towDigit);
            break;
        case "price_s":
            paramVal = GetCurrencySales(dtR[paramName], option.showsplit, towDigit);
            break;
        case "price_buy":
            if (factor.factor.type == 1)
                paramVal = GetCurrencySales(dtR['price_s'], option.showsplit, towDigit);
            else
                paramVal = GetCurrencySales(dtR['price_b'], option.showsplit, towDigit);
            break;
        case "price_after_discount":
            paramVal = GetCurrencySales(price_after_discount_row, option.showsplit, towDigit);
            break;
        case "price_addedvalue":
            paramVal = GetCurrencySales(allprice.items[j].addedvalue, option.showsplit, towDigit);
            break;
        case "price_discount_addedvalue":
            paramVal = GetCurrencySales(price_after_discount_row + allprice.items[j].addedvalue, option.showsplit, towDigit);
            break;
        case "row":
            paramVal = (j + 1);
            break;
        case "productName":
            paramVal = ((dtR.productName2 == null || dtR.productName2 == "") ? dtR[paramName] : dtR.productName2);
            break;
        case "propertis_product":
            paramVal = propertis.toString().split(',').join("<br>");
            break;
        case "name_propertis_product":
            var d = '<div><div class="rcrmMixedParam" style="font-weight: bold">' + ((dtR.productName2 == null || dtR.productName2 == '') ? dtR['productName'] : dtR.productName2) + '</div> <div class="rcrmMixedParam">' + propertis.toString().split(',').join("<br>") + '</div></div>';
            paramVal = d;
            break;
        case "discount":
            var d = allprice.items[j].discount == dtR.discount ? GetCurrencySales(allprice.items[j].discount, option.showsplit, towDigit) : "(" + dtR.discount + ")" + GetCurrencySales(allprice.items[j].discount, option.showsplit, towDigit);
            paramVal = d;
            break;
        case "product_img":
            if (dtR[paramName] != null && dtR[paramName] != "")
                paramVal = '<img style="width:70px;height:70px;" src="' + dtR[paramName] + '" />';
            else
                paramVal = "";
            break;
        case "product_name_img":
            var pic = (dtR.product_img == null || dtR.product_img == "") ? '' : '<div class="rcrmMixedParam"><img style="width:70px;height:70px;" src="' + dtR.product_img + '" /></div>';
            var d = '<div><div class="rcrmMixedParam">' + ((dtR.productName2 == null || dtR.productName2 == '') ? dtR['productName'] : dtR.productName2) + '</div>' + pic + '</div>';
            paramVal = d;
            break;
        case "product_name_propertis_img":
            var prop = propertis == "" ? '' : '<div class="rcrmMixedParam">' + propertis.toString().split(',').join("<br />") + '</div>';
            var pic = (dtR.product_img == null || dtR.product_img == "") ? '' : '<div class="rcrmMixedParam"><img style="width:70px;height:70px;" src="' + dtR.product_img + '" /></div>';
            var d = '<div><div class="rcrmMixedParam" style="font-weight: bold">' + ((dtR.productName2 == null || dtR.productName2 == '') ? dtR['productName'] : dtR.productName2) + '</div>' + prop + pic + '</div>';
            paramVal = d;
            break;
        case "count":
            paramVal = dtR[paramName];
            break;
        default:
            if (dtR[paramName] != undefined) paramVal = dtR[paramName];
    };

    for (var i = 0; i < ProductField.length; i++) {
        if (paramName == 'ProductField_' + ProductField[i].toString()) {
            var title = Enumerable.from(dtR.propertis).firstOrDefault(function (c) { return c.id == ProductField[i] })
            if (title != null)
                title = title.text
            paramVal = title;
            break;
        }
    }
    return paramVal;
}

function rcrmSetElementPosition(ft) {
    try {
        setTimeout(function () {
            if (ft.find('#rcrm_document_main').find('script').length == 0)
                ft.find('#rcrm_document_main').prepend('<script src="../Themes/resources/scripts/TemplateDesignPreview.js"></script>');
        }, 100);
    } catch (e) { }
}

function renderStamp(ft, factor) {
    try {
        if (factor.factor.pay_status != -3 && factor.factor.pay_status != 0 && factor.factor.pay_status != '' && factor.factor.pay_status != null) {
            if (ft.find('#stampDiv').length > 0) {
                ft.find('#stampDiv').show().css('cursor', 'default');
                ft.find('#StampClose').hide();
                ft.find('#stampDiv').find('.ui-resizable-handle').hide();
                ft.find('#stampDiv').css('border', '0');
                $('#printPreViewFactor').css('position', 'relative');
                $('.printPreView').css('position', 'relative');
                if (ft.find('#stampDiv').css('top') == 'unset')
                    if (ft.find('#stampDiv').css('bottom') != undefined)
                        ft.find('#stampDiv').css('bottom', (Number(ft.find('#stampDiv').css('bottom').replace('px', '')) - 35) + 'px')
            }
        } else ft.find('#stampDiv').hide();
        
        ft.find('img[source="F_stamp_select"]').each(function () {
            if (factor.factor.pay_status != -3 && factor.factor.pay_status != 0 && factor.factor.pay_status != '' && factor.factor.pay_status != null) $(this).parents('.rcrmImageElement').show();
            else $(this).parents('.rcrmImageElement').hide();
        });

        ft.find('img[source="F_stamp_default"]').each(function () {
            $(this).attr('src', '../Themes/resources/images/paid-' + resources.calander + '.png');
            if (factor.factor.pay_status != -3 && factor.factor.pay_status != 0 && factor.factor.pay_status != '' && factor.factor.pay_status != null) $(this).parents('.rcrmImageElement').show();
            else $(this).parents('.rcrmImageElement').hide();
        });

        ft.find('.rcrmSizer').remove();
        
    } catch (e) { }
}

function getNewPriceP2(priceKol, priceProduct, price) {
    if (price.search('%') != '-1') {
        price = Math.round((parseFloat((price.replace('%', '')) / 100) * parseFloat(priceProduct)));
    }
    else {
        price = Math.round(parseFloat(priceProduct) * parseFloat(price) / parseFloat(priceKol));
    }
    return price;
}

function GetPriceByPercent2(priceC, priceKol) {  //daryaf mizan gheymat bar hasab darsad 
    if (priceC.search('%') != '-1') {
        priceC = Math.ceil((parseFloat((priceC.replace('%', '')) / 100) * parseFloat(priceKol)));
    }
    return priceC;
}

function nUnd(inputStr) { //change null item to ''
    if (inputStr != null)
        return inputStr;
    else
        return '';
}

function GetCurrencySales(inputCurrency, showsplit, towDigit) {
    if (towDigit == undefined || towDigit == null) towDigit = false;
    if (showsplit) inputCurrency = GetCurrency(inputCurrency, towDigit);
    return '<span class="currency">' + inputCurrency + '</span>';
}

function GetCurrency(InputMoney, towDigit) { //sample input 100000 --> 100,000
    if (InputMoney != undefined && InputMoney != null) {

        var digit = '';
        if (resources.lang == 'en' || towDigit) InputMoney = parseFloat(InputMoney.toString().replace(/,/gi, '')).toFixed(2);
        if (InputMoney.toString().indexOf(".") > -1) {
            digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
            InputMoney = InputMoney.toString().substr(0, InputMoney.toString().indexOf("."));
        }

        InputMoney = InputMoney.toString().replace(/,/gi, '');
        var result = InputMoney.toString().substr(0, InputMoney.length % 3);
        InputMoney = InputMoney.toString().substr(InputMoney.length % 3, InputMoney.length);
        for (i = 0; i < InputMoney.length; i = i + 3) result += ',' + InputMoney.toString().substr(i, 3);
        if (result.charAt(0) == ",") result = result.toString().substr(1, result.length);
        return result + digit;
    } else return "";
}