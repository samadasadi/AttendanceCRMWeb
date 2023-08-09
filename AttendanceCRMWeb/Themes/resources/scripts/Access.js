/// <reference path="Access.js" />
/// <reference path="Access.js" />
/// <reference path="../../../controls/assignAccess.ascx" />
/// <reference path="../../../controls/assignAccess.ascx" />
var Num = 1;
var OrderNum = 1;

jQuery.fn.extend({
    CreateParentAccess: function (Access) {
        var newAccess = $('.TemplateMainAccess').clone().removeClass("TemplateMainAccess").show();
        newAccess.attr('OrderNum', OrderNum);
        newAccess.addClass('AccessOrder');
        newAccess.attr('MainAccess', Access.Code).attr('AccessCode', Access.Code).attr('ParentId', Access.ParentId);
        newAccess.find('.HeaderAccess').text(Access.Name);
        newAccess.find('.HeaderImage').addClass(CreateHeaderPicture(Access.Code));
        newAccess.find('.DeAcceptAccess').html('<div class="Access DeActive" Id=' + Access.Id + ' Code_Access=' + Access.Code + ' ParentId=' + Access.Code + ' Num=' + Num + '>' + Access.Name + '</div>');
        $(this).append(newAccess);
        Num += 1;
        OrderNum += 1;
        $.fn.CreateChildAccess(Access.ChildAccess, Access.Code);
    },

    CreateChildAccess: function (AccessChild, ParentID) {
        var CountChild = AccessChild.length;

        if (CountChild > 0) {
            $('.Access[code_Access=' + ParentID + ']').remove();
        }

        for (var j = 0; j < CountChild; j++) {
            var strDeAccept = '';
            //---------------------------------------------------------------------------------------------------------------ChildeDeAccess
            if (AccessChild[j].ChildAccess.length > 0) {
                strDeAccept = $('.Template').clone().removeClass('Template').show();
                strDeAccept.attr('AccessCode', AccessChild[j].Code).attr('ParentId', AccessChild[j].ParentId);
                strDeAccept.find('.HeaderAccess').text(AccessChild[j].Name);
                strDeAccept.find('.DeAcceptAccess').html('<div class="Access DeActive" Id=' + AccessChild[j].Id + ' Code_Access=' + AccessChild[j].Code + ' ParentId=' + AccessChild[j].Code + ' Num=' + Num + '>' + AccessChild[j].Name + '</div>');
                strDeAccept.find('.AcceptAccess').remove();
                strDeAccept.find('.DeAcct').hide();
            }
            else {
                strDeAccept += '<div class="Access DeActive" Id=' + AccessChild[j].Id + ' Code_Access=' + AccessChild[j].Code + ' ParentId=' + AccessChild[j].ParentId + ' Num=' + Num + '>' + AccessChild[j].Name + '</div>';
            }
            $('[AccessCode=' + ParentID + ']').find('.DeAcceptAccess').first().append(strDeAccept);

            //---------------------------------------------------------------------------------------------------------------ChildeAccess
            var strAccept = '';
            if (AccessChild[j].ChildAccess.length > 0) {
                strAccept = $('.Template').clone().removeClass('Template').show();
                strAccept.attr('AccessCode', AccessChild[j].Code).attr('ParentId', AccessChild[j].ParentId).hide();
                strAccept.find('.HeaderAccess').text(AccessChild[j].Name);
                strAccept.find('.DeAcceptAccess').remove();
                strAccept.find('.Acct').hide();
            }
            $('[AccessCode=' + ParentID + ']').find('.AcceptAccess').first().append(strAccept);

            Num += 1;
            $.fn.CreateChildAccess(AccessChild[j].ChildAccess, AccessChild[j].Code);

        }
        if (CountChild > 0) {
            $('[AccessCode=' + ParentID + ']').attr('Num', Num);
            Num += 1;
        }
    },

    ActiveDeActive: function () {
        ParentTxt = '';
        var me = $(this);
        var meId = me.attr('Id');
        var meCode = me.attr('Code_Access');
        var meName = me.text();
        var mePId = me.attr('parentid');
        var meNum = me.attr('Num');
        var ActDeAct = '';

        if (me.hasClass('DeActive')) {
            var MainDiv = $('[AccessCode=' + mePId + ']').find('.AcceptAccess');
            SetPlaceInActivDeActiv(MainDiv, me, meNum);
            ShowParentDiv(mePId);
            HideParentDiv(mePId, 'DeAcceptAccess');
            me.removeClass('DeActive').addClass('Active');
            ActDeAct = 'Active';
        }
        else {
            var MainDiv = $('[AccessCode=' + mePId + ']').find('.DeAcceptAccess');
            SetPlaceInActivDeActiv(MainDiv, me, meNum);
            ShowParentDiv(mePId);
            HideParentDiv(mePId, 'AcceptAccess');
            me.removeClass('Active').addClass('DeActive');
            ActDeAct = 'DeActive';
        }

        ChangeColor(me);
        InDelInAccessDiv(me, meId, mePId, ActDeAct);
        return [meId, meCode, mePId, meName, ActDeAct];
    },

    ChangeOrderAccessPlace: function () {
        var Order = 1;

        var cont = $('.DivParentAccess.AccessOrder:visible');
        cont.detach().sort(function (a, b) {
            var an = parseInt($(a).attr('OrderNum'));
            var bn = parseInt($(b).attr('OrderNum'));
            return (an > bn) ? (an > bn) ? 1 : 0 : -1;
        });

        $.grep(cont, function (value) {
            $('.AccessDiv' + Order + '').append($(value));

            Order += 1;
            if (Order == 4)
                Order = 1;
        });
    }
});

function ChangeColor(me) {
    var Parent = $('[accesscode=' + me.attr('parentid') + ']');

    var IsActive = Parent.find('.AcceptAccess').children().hasClass('Active');
    var IsDeActive = Parent.find('.DeAcceptAccess').children().hasClass('DeActive');

    if (Parent.length == 2) {
        SetColor($(Parent[0]), IsActive, IsDeActive);
        SetColor($(Parent[1]), IsActive, IsDeActive);
    }
    else {
        SetColor(Parent, IsActive, IsDeActive);
    }

    if (Parent.attr('parentid') != "0") {
        ChangeColor(Parent)
    }
}

function SetColor(Parent, IsActive, IsDeActive) {
    if (IsActive == false)
        Parent.find('.Header').first().removeClass('FullAccess').removeClass('MediuomAccess').addClass('NoneAccess');//.find('.HeaderImage').css('color', '#DF8383');
    else if (IsDeActive == false)
        Parent.find('.Header').first().addClass('FullAccess').removeClass('MediuomAccess').removeClass('NoneAccess');//.find('.HeaderImage').css('color', '#35B60F');
    else
        Parent.find('.Header').first().removeClass('FullAccess').addClass('MediuomAccess').removeClass('NoneAccess');//.find('.HeaderImage').css('color', '#FFCC00');
}

function SetPlaceInActivDeActiv(MainDiv, me, meNum) {
    var arr = MainDiv.find('[Num]').filter(function (value) {
        return (parseInt($(this).attr('Num')) < parseInt(meNum))
    }).sort(function (a, b) {
        return parseInt($(a).attr('Num')) - parseInt($(b).attr('Num'));
    });

    if (arr.length > 0) {
        $(arr[arr.length - 1]).after(me);
    }
    else {
        MainDiv.first().prepend(me);
    }
}

function ShowParentDiv(mePId) {
    var Par = $('[AccessCode=' + mePId + ']');
    if (Par.attr('parentid') != "0") {
        Par.show();
        Par.find('.DivParentAccess').show();
        ShowParentDiv(Par.attr('parentid'));
    }
}

function HideParentDiv(mePId, ActiveDeactiv) {
    var Par = $('[AccessCode=' + mePId + ']');
    if (Par.attr('parentid') != "0") {
        var FindHideDiv = Par.find('.' + ActiveDeactiv).parent().parent().parent();
        if (FindHideDiv.find('.Access').length == 0) {
            FindHideDiv.hide();
            HideParentDiv(Par.attr('parentid'), ActiveDeactiv);
        }
    }
}

function InDelInAccessDiv(me, meId, mePId, ActDeAct) {
    var Parent = $('[AccessCode=' + mePId + ']');

    var AccessItemsDiv;
    if (Parent.attr('parentid') != "0") {
        if (FaEn == 'en') ParentTxt = ParentTxt + Parent.find('.HeaderAccess').first().text() + '>';
        else ParentTxt = Parent.find('.HeaderAccess').first().text() + ' > ' + ParentTxt;

        InDelInAccessDiv(me, meId, Parent.attr('parentid'), ActDeAct);
    }
    else {

        AccessItemsDiv = Parent.find('.AccessItemsDiv');

        if (ActDeAct == "Active") {
            var MeTemp = me.clone();
            MeTemp.text(ParentTxt.toString() + MeTemp.text().toString());
            AccessItemsDiv.append(MeTemp);
        }
        else {
            AccessItemsDiv.find('[code_access=' + me.attr('code_access') + ']').remove();
        }
        if (Parent.find('.MainAcceptDeAcceptDiv').is(':visible') == false) {
            if (AccessItemsDiv.find('.Access').length > 0)
                AccessItemsDiv.show();
            else
                AccessItemsDiv.hide();
        }
    }
}

function FillArrayForSave(Info) {
    var TempAccess = {};
    TempAccess.AccessId = Info[0];
    TempAccess.AccessCode = Info[1];
    TempAccess.AccessPId = Info[2];
    TempAccess.AccessName = Info[3];

    var Type = Info[4];
    if (Type == 'Active') {
        DeAcceptedIds = $.grep(DeAcceptedIds, function (index) { return index.AccessCode != TempAccess.AccessCode });
        AcceptedIds.push(TempAccess);
        //add hearde s id in AcceptedIds if $('[accesscode=10]').find('.Header').hasClass('FullAccess')==true
    }
    else if (Type == 'DeActive') {
        AcceptedIds = $.grep(AcceptedIds, function (index) { return index.AccessCode != TempAccess.AccessCode });
        if (TempAccess.AccessId != undefined) {
            DeAcceptedIds.push(TempAccess);
        }
        //clear harder s id in DeAcceptedIds
    }
    checkParentAccess(TempAccess.AccessPId, Type);//sadeg
}

function checkParentAccess(parentId, type) {//sadeg
    var parent__ = $('[accesscode=' + parentId + ']').eq(0);
    var TempAccess = {};
    TempAccess.AccessId = parent__.attr("id");
    TempAccess.AccessCode = parent__.attr("accesscode");
    TempAccess.AccessPId = parent__.attr("parentid");
    TempAccess.AccessName = parent__.find(".HeaderAccess").first().text();

    if (type == 'Active') {
        if (parent__.find('.Header').first().hasClass('FullAccess') == true) {

            DeAcceptedIds = $.grep(DeAcceptedIds, function (index) { return index.AccessCode != TempAccess.AccessCode });
            AcceptedIds.push(TempAccess);

            if (parent__.attr("parentid") != "0") {
                if (parent__.find('.Header').first().hasClass('FullAccess')) {
                    checkParentAccess(parent__.attr("parentid"), 'Active')
                } else {
                    checkParentAccess(parent__.attr("parentid"), 'DeActive')
                };

            }
        }

    } else {
        if (TempAccess.AccessId != '') {
            AcceptedIds = $.grep(AcceptedIds, function (index) { return index.AccessCode != TempAccess.AccessCode });
            if ($.grep(DeAcceptedIds, function (index) { return index.AccessCode == TempAccess.AccessCode }).length == 0) {
                DeAcceptedIds.push(TempAccess);
            }
        }
        if (parent__.attr("parentid") != "0") {
            checkParentAccess(parent__.attr("parentid"), 'DeActive')
        }
    }
    //parentid
}

function CreateAccess() {
    $('.form').mask('Loading ...');
    var a = false;
    if ($('.FixDiv').hasClass('ButtomSaveDiv') == true) {
        $('.FixDiv').removeClass('ButtomSaveDiv');
        a = true;
    }

    EmptyArray();

    var data = {};
    data.Items = {
        Logdomain: $("#HFdomain").val(),
        Loguser_code: $("#HFUserCode").val(),
        Logrnd: $("#HFRnd").val()
    };
    $.ajax({
        type: "POST", url: "../WebServices/assignAccess.asmx/GenerateTreeView_", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(data), success: function (c) {
            //$('.AccessDiv').html('');
            $('.AccessDiv1').html('');
            $('.AccessDiv2').html('');
            $('.AccessDiv3').html('');

            var DivNum = 1;
            var CountAccess = c.d.length;
            for (var i = 0; i < CountAccess; i++) {
                //$('.AccessDiv').CreateParentAccess(c.d[i]);
                $('.AccessDiv' + DivNum + '').CreateParentAccess(c.d[i]);
                DivNum += 1;
                if (DivNum == 4)
                    DivNum = 1;
            }
            $('.form').unmask();
            if (a == true) {
                $('.FixDiv').addClass('ButtomSaveDiv');
            }
        }
    });
}

function EmptyArray() {
    AcceptedIds = [];
    DeAcceptedIds = [];

    $('.MainAcceptDeAcceptDiv').hide();
}

function user_group(code_, name_) {
    $('.txtuser_group_code').val(code_);
    $('.txtuser_group_name').val(name_);
}

function user_group2(code_, name_) {
    $('.form').mask('Loading ...');
    $('.txtuser_group2_code').val(code_);
    $('.txtuser_group2_name').val(name_);
    $('.Label5').text(name_);

    EmptyArray();
    $('.AccessDiv').children().find('[id]').removeAttr('id');

    var me = $(this);
    var data = {};
    data.Items = {
        txtuser_group2_code: code_,
        Logdomain: $("#HFdomain").val(),
        Loguser_code: $("#HFUserCode").val(),
        Logrnd: $("#HFRnd").val()
    };
    $.ajax({
        type: "POST", url: "../WebServices/assignAccess.asmx/LinkButton1_Click_", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(data), success: function (c) {
            $('.MainAcceptDeAcceptDiv').find('.Access.Active').each(function () {
                $(this).ActiveDeActive();
            });

            $('.AccessItemsDiv').html('').hide();

            var CountAccess = c.d.length;
            for (var i = 0; i < CountAccess; i++) {
                var Access = $('[Code_Access=' + c.d[i].Code + ']');
                Access.attr('Id', c.d[i].Id);
                if (Access.length > 0) {
                    Access.ActiveDeActive();
                } else {//sadeg
                    // is parent
                    $('[accesscode=' + c.d[i].Code + ']').attr("Id", c.d[i].Id);
                }
            }
            $('.form').unmask();
        }
    });
}

function UpdateAllChildren(nodes, checked) {
    var i;
    for (i = 0; i < nodes.length; i++) {
        if (checked)
            nodes[i].Check();
        else
            nodes[i].UnCheck();

        if (nodes[i].Nodes.length > 0)
            UpdateAllChildren(nodes[i].Nodes, checked);
    }
}

function AfterCheck(node) {
    if (!node.Checked && node.Parent != null) {
        node.Parent.UnCheck();
    }

    var siblingCollection = (node.Parent != null) ? node.Parent.Nodes : node.TreeView.Nodes;

    var allChecked = true;
    for (var i = 0; i < siblingCollection.length; i++) {
        if (!siblingCollection[i].Checked) {
            allChecked = false;
            break;
        }
    }
    if (allChecked && node.Parent != null) {
        node.Parent.Check();
    }

    UpdateAllChildren(node.Nodes, node.Checked);
}

$(function () {
    $('#hierarchybreadcrumb1').menuA({
        content: $('#hierarchybreadcrumb1').next().html(),
        backLink: false
    });
    $('#hierarchybreadcrumb2').menuA({
        content: $('#hierarchybreadcrumb2').next().html(),
        backLink: false
    });
});

function CreateHeaderPicture(Id) {
    var strPic = '';

    switch (Id) {
        case '1': //____________________________________________________________ دفتر تلفن
            strPic = 'icon-donate';
            break;
        case '10': //____________________________________________________________ پیامک 
            strPic = 'icon-sms';
            break;
        case '11': //____________________________________________________________ پست الکترونیکی  
            strPic = 'icon-envelope-alt';
            break;
        case '12': //____________________________________________________________ صندوق صوتی
            strPic = 'icon-volume-up';
            break;
        case '13': //____________________________________________________________ فکس
            strPic = 'icon-fax';
            break;
        case '14': //____________________________________________________________ تقویم 
            strPic = 'icon-Calendar';
            break;
        case '15': //____________________________________________________________ نامه های آماده
            strPic = 'icon-inbox';
            break;
        case '16': //____________________________________________________________ پشتیبانی 
            strPic = 'icon-shield-alt';
            break;
        case '17': //____________________________________________________________ گردش کار در سیستم 
            strPic = 'icon-workflow';
            break;
        case '18': //____________________________________________________________ حسابداری 
            strPic = 'icon-usd-circle';
            break;
        case '19': //____________________________________________________________ مدیریت زمانبندی 
            strPic = 'icon-clock';
            break;
        case '2': //____________________________________________________________ تعریف مشتری 
            strPic = 'icon-male';
            break;
        case '20': //____________________________________________________________ مدیریت فایل 
            strPic = 'icon-folder-close';
            break;
        case '21': //____________________________________________________________ تنظیمات پایه 
            strPic = 'icon-cogs';
            break;
        case '22': //____________________________________________________________ وقایع مشتری 
            strPic = 'icon-tag';
            break;
        case '23': //____________________________________________________________ IVR 
            strPic = 'icon-phone';
            break;
        case '24': //____________________________________________________________ آخرین فعالیت های کاربر 
            strPic = 'icon-user';
            break;
        case '25': //____________________________________________________________ گزارش ساز 
            strPic = 'icon-bar-chart';
            break;
        case '26': //____________________________________________________________ sale 
            strPic = 'icon-donate';
            break;
        case '3': //____________________________________________________________ دسترسی 
            strPic = 'icon-Key';
            break;
        case '4': //____________________________________________________________ تعاریف 
            strPic = 'icon-edit';
            break;
        case '5': //____________________________________________________________ تنظیمات 
            strPic = 'icon-cog';
            break;
        case '6': //____________________________________________________________ کاربران 
            strPic = 'icon-user';
            break;
        case '7': //____________________________________________________________ فرم ها 
            strPic = 'icon-list-alt';
            break;
        case '8': //____________________________________________________________ ارتباط با  بانک اطلاعاتی 
            strPic = 'icon-database';
            break;
        case '9': //____________________________________________________________ کارتابل 
            strPic = 'icon-inbox';
            break;
        case 'chat_mng': //_____________________________________________________ مدیریت گفتگوی آنلاین 
            strPic = 'icon-comments';
            break;
        case 'gp': //____________________________________________________________ گروه کالا 
            strPic = 'icon-shopping-cart';
            break;
        case 'gr': //____________________________________________________________ گروه های مشتری 
            strPic = 'icon-users';
            break;
        case 'gru': //____________________________________________________________ گروه کاربران 
            strPic = 'icon-users';
            break;
        default://____________________________________________________________
            strPic = '';
    }
    return strPic;
}
