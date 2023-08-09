
$(document).ready(function () {
    //var SettQuickLinks = [];
    //var SettQuickBlocks = [];

    //var resizeTimer;
    //$(window).resize(function () {
    //    clearTimeout(resizeTimer);
    //    resizeTimer = setTimeout(function () {
    //        $('.QuickBlock').each(function (i, item) {
    //            dashboard.callResize($(item).attr('id'));
    //        });
    //    }, 500);
    //});

    //var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //$.ajax({
    //    type: "POST", url: "dashboard.aspx/getDashboard_",
    //    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //    success: function (c) {
    //        if (c.d[0] == 'success') {
    //            var QuickLinks = c.d[1].QuickLinks;
    //            var QuickBlocks = c.d[1].QuickBlocks;
    //            var arrLinkModes = new Array();

    //            QuickLinks.sort(function (a, b) { return a.order - b.order; });
    //            $.each(QuickLinks, function (i, item) {
    //                $('.quicklink-container').append(dashboard.geneQuickLinks(item));
    //                arrLinkModes.push(item.mode);
    //            });

    //            //dashboard.getLinkDetail(arrLinkModes);

    //            QuickBlocks.sort(function (a, b) { return a.style.order - b.style.order; });

    //            $.each(QuickBlocks, function (i, item) {
    //                $('.ColQuickBlock').eq(item.style.col - 1).append(dashboard.geneQuickBlocks(item));
                  
    //            });
                

    //            var createBlock = function () {
    //                var item = QuickBlocks[0];
    //                dashboard.getBlockStr(item.id, item.filename, item.mode, function (str) {

    //                    dashboard.geneQuickBlockContent(item, str);

    //                    if (QuickBlocks.length > 1) {
    //                        QuickBlocks.splice(0, 1);
    //                        createBlock();
    //                    }
    //                });
    //            }
    //            if (QuickBlocks.length != 0) createBlock();
    //            //-------------------------------------------------

    //            SettQuickLinks = c.d[2].QuickLinks;
    //            SettQuickBlocks = c.d[2].QuickBlocks;

    //            $.each(SettQuickLinks, function (i, item) {
    //                $('.TblQuickLink').append(dashboard.geneTblItemQuickLink(item));
    //            });

    //            var newBlockCount = $.grep(SettQuickBlocks, function (s) { return s.isNew == true }).length;
    //            if (newBlockCount != 0) {
    //                $('.btnsetting_dashboard').append($('<div>').addClass('newdashboard').text(newBlockCount));
    //            }
    //        }
    //    }
    //});

    //$('.itemQuickLink').live('click', function () {
    //    var Modes = { workflow: 3, todo: 4, event: 5 };
    //    var mode = $(this).attr('mode');
    //    if (mode == Modes.workflow) {
    //        $('.quickPage-container,.page-backdashboard').show();
    //        $('.quickblock-container,.itemQuickPage').hide();
    //        if ($('.worflow-container').length == 0) {
    //            $('.overlay-quickPage').show();
    //            $('.quickPage-container').append('<div class="worflow-container itemQuickPage"></div>');
    //            var e = { r: $('#HFRnd').val() };
    //            $.ajax({
    //                type: "POST", url: "Load_UserControl.aspx/Get_Wf_User", contentType: "application/json; charset=utf-8",
    //                data: JSON.stringify(e), dataType: "json", success: function (c) {
    //                    $('.overlay-quickPage').hide();
    //                    $('.worflow-container').html('<div class="box"><div class="form"><div class="fields">' + c.d + '</div></div></div>');
    //                }
    //            });
    //        }
    //        $('.worflow-container').show();
    //        return false;
    //    } else if (mode == Modes.todo) {
    //        $('.quickPage-container,.page-backdashboard').show();
    //        $('.quickblock-container,.itemQuickPage').hide();
    //        if ($('.todo-container').length == 0) {
    //            $('.overlay-quickPage').show();
    //            $('.quickPage-container').append('<div class="todo-container itemQuickPage"></div>');
    //            var e = { n: "Todo", u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
    //            $.ajax({
    //                type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8",
    //                data: JSON.stringify(e), dataType: "json", success: function (c) {
    //                    $('.overlay-quickPage').hide();
    //                    $('.todo-container').html(c.d[1]);
    //                }
    //            });
    //        }
    //        $('.todo-container').show();
    //        return false;
    //    } else if (mode == Modes.event) {
    //        $('.quickPage-container,.page-backdashboard').show();
    //        $('.quickblock-container,.itemQuickPage').hide();
    //        if ($('.event-container').length == 0) {
    //            $('.overlay-quickPage').show();
    //            $('.quickPage-container').append('<div class="event-container itemQuickPage"></div>');
    //            var e = { n: "Event", u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
    //            $.ajax({
    //                type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8",
    //                data: JSON.stringify(e), dataType: "json", success: function (c) {
    //                    $('.overlay-quickPage').hide();
    //                    $('.event-container').html(c.d[1]);
    //                }
    //            });
    //        }
    //        $('.event-container').show();
    //        return false;
    //    }
    //});
    //$('.page-backdashboard').click(function () {
    //    $(this).hide();
    //    $('.quickPage-container').hide();
    //    $('.quickblock-container,').show();
    //});

    //$("#DlgQuickLink").dialog({
    //    autoOpen: false,
    //    modal: true,
    //    minWidth: 415,
    //    minHeight: 610,
    //    maxHeight: 610,
    //    open: function () {
    //        openDialog($(this));
    //    },
    //    hide: { effect: 'drop', direction: 'up', duration: 400 }
    //});

    //$(".ColQuickBlock").sortable({
    //    tolerance: "pointer",
    //    scrollSensitivity: 1,
    //    connectWith: ".ColQuickBlock",
    //    handle: ".QuickBlock-head",
    //    placeholder: "QuickBlock-highlight",
    //    opacity: 0.9,
    //    revert: true,
    //    dropOnEmpty: true,
    //    forcePlaceholderSize: true,
    //    stop: function (event, ui) {
    //        dashboard.callResize($(ui.item).attr('id'));
    //    },
    //    update: function (event, ui) {
    //        if (this === ui.item.parent()[0]) {

    //            var arrOrder = new Array();
    //            $('.ColQuickBlock').each(function (c, col) {
    //                $(col).find('.QuickBlock').each(function (i, item) {
    //                    arrOrder.push([$(item).attr('id'), c + 1, i + 1]);
    //                });
    //            });
    //            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //            e.o.order = arrOrder;
    //            $.ajax({
    //                type: "POST", url: "dashboard.aspx/setBlockOrder_",
    //                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //                success: function (c) { }
    //            });
    //        }
    //    }
    //});

    //$(".quicklink-container").sortable({
    //    opacity: 0.9,
    //    update: function (event, ui) {
    //        if (this === ui.item.parent()[0]) {
    //            var arrOrder = new Array();
    //            var checkLoadtblQuickLink = $('.TblQuickLink div').length != 0;
    //            $('.quicklink-container .itemQuickLink').each(function (i, item) {
    //                arrOrder.push([$(item).attr('id'), i + 1]);
    //                if (checkLoadtblQuickLink) $('.TblQuickLink div:[item=' + $(item).attr('id') + ']').data('data').order = i + 1;
    //            });
    //            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //            e.o.order = arrOrder;
    //            $.ajax({
    //                type: "POST", url: "dashboard.aspx/setLinkOrder_",
    //                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //                success: function (c) { }
    //            });
    //        }
    //    }
    //}).disableSelection();

    //$('.QuickBlock-head .icon-times').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');

    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //    e.o.num = thisBlock.attr('id');
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/closeBlock_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });

    //    thisBlock.animate({ 'height': 0, 'opacity': 0 }, 500, function () {
    //        thisBlock.remove();
    //    });

    //    return false;
    //});
    //$('.QuickBlock-head .icon-minus,.QuickBlock-head .icon-plus').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');
    //    var isExpand = $(this).hasClass('icon-plus');
    //    if (isExpand) {
    //        thisBlock.find('.QuickBlock-head .icon-minus').show();
    //        thisBlock.find('.QuickBlock-head .icon-plus').hide();
    //        thisBlock.find('.QuickBlock-content').slideDown(500);
    //    } else {
    //        thisBlock.find('.QuickBlock-head .icon-plus').show();
    //        thisBlock.find('.QuickBlock-head .icon-minus').hide();
    //        thisBlock.find('.QuickBlock-content').slideUp(500, function () { $(this).hide(); });
    //    }

    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //    e.o.isExpand = isExpand;
    //    e.o.num = thisBlock.attr('id');
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/setExpand_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });
    //});
    //$('.QuickBlock .QuickBlock-title').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');

    //    if (thisBlock.find('.QuickBlock-head input:[type=text]').length != 0) return false;
    //    var thisSubject = $(this);
    //    var firstValue = thisSubject.text();
    //    var renametxt = $('<input type="text" value="' + firstValue + '" style="margin-top:12px"/>');
    //    thisSubject.after(renametxt);
    //    thisSubject.hide();
    //    renametxt.focus();
    //    renametxt.select();
    //    var fnUpdateBlock = function () {
    //        if (firstValue != renametxt.val()) {
    //            thisSubject.text(renametxt.val());
    //            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //            e.o.num = thisBlock.attr('id');
    //            e.o.name = renametxt.val();
    //            $.ajax({
    //                type: "POST", url: "dashboard.aspx/renameBlock_",
    //                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //                success: function (c) { }
    //            });
    //        }
    //        thisSubject.show();
    //        renametxt.remove();
    //    }
    //    renametxt.blur(function () {
    //        fnUpdateBlock();
    //    });
    //    renametxt.keyup(function (event) {
    //        if (event.keyCode == 13) {
    //            fnUpdateBlock();
    //        }
    //    });

    //    return false;
    //});
    //$('.QuickBlock-head .icon-cog').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');
    //    if (!$(this).hasClass('selected')) {
    //        $(this).addClass('selected');
    //        thisBlock.find('.container-block-setting').show();
    //        thisBlock.find('.container-block').hide();
    //        dashboard.CallshowSetting(thisBlock.attr('id'));
    //    } else {
    //        thisBlock.find('.container-block').show();
    //        thisBlock.find('.container-block-setting').hide();
    //        thisBlock.find('.icon-cog').removeClass('selected');
    //    }
    //    return false;
    //});
    //$('.QuickBlock-head .icon-refresh').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');
    //    dashboard.CallRefreshBlock(thisBlock.attr('id'));
    //    return false;
    //});
    //$('.QuickBlock .blockSettingCancel').live('click', function () {
    //    var thisBlock = $(this).parents('.QuickBlock');
    //    thisBlock.find('.container-block').show();
    //    thisBlock.find('.container-block-setting').hide();
    //    thisBlock.find('.icon-cog').removeClass('selected');
    //    return false;
    //});


    $('.btnsetting_dashboard').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.MnuSettingDash').hide();
        }
        else {
            var mnu = $('.MnuSettingDash');
            if (resources.direction == 'rtl') {
                mnu.css({ left: $(this).offset().left - $('.page-utility-contain').offset().left, top: $(this).offset().top + 24 - $('.page-utility-contain').offset().top });
            } else {
                mnu.css({ left: $(this).offset().left - mnu.width() + 24 - $('.page-utility-contain').offset().left, top: $(this).offset().top + 24 - $('.page-utility-contain').offset().top });
            }
            mnu.show();
            $(this).addClass('selected');
        }
    });

    //$('#btnShowDlgQuickLink').click(function () {
    //    $("#DlgQuickLink").dialog('open');
    //    $('.fieldListQuickLink').show();
    //    $('.fieldNewQuickLink').hide();
    //    return false;
    //});

    //$('#btnShowDlgQuickBlock').click(function () {
    //    $('.MnuSettingDash').fadeOut();
    //    $('.btnsetting_dashboard').removeClass('selected');

    //    if ($('.btnsetting_dashboard .newdashboard').length != 0) {
    //        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //        $.ajax({
    //            type: "POST", url: "dashboard.aspx/setLastView_",
    //            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //            success: function (c) { }
    //        });
    //        $('.btnsetting_dashboard .newdashboard').remove();
    //    }


    //    var container = $('<div>').css({ padding: 15, overflow: 'hidden' });
    //    var dialog = RaveshUI.showDialog({
    //        title: DashboardRes.cap_manage_quickblock,
    //        detail: resources.lang == 'fa' ? 'بلاک مورد نظرتان را انتخاب و بر روی گزینه‌ی "اضافه کردن" کلیک نمایید' : '',
    //        width: '70%',
    //        allowMaximum: true,
    //        disableBodyScroll: true
    //    });
    //    dialog.setContent(container);
    //    var okBtn = dialog.addFooterButton(DashboardRes.cap_add_, 'float', addBlock);

    //    $.each(SettQuickBlocks, function (i, item) {
    //        var block = dashboard.geneTblItemQuickBlock(item).appendTo(container);
    //        block.click(function () {
    //            container.find('.selected').removeClass('selected');
    //            block.addClass('selected');
    //            block.animateCSS('pulse');
    //            var Exists = $('.quickblock-container .QuickBlock:[item=' + item.id + ']').length != 0;
    //            if (!Exists || item.ctlMulti) {
    //                okBtn.addClass('save');
    //            } else {
    //                okBtn.removeClass('save');
    //            }
    //        });
    //    });

    //    function addBlock() {
    //        if (!okBtn.hasClass('save')) return false;

    //        var item = $('.manage-block-item.selected').data('data');

    //        dialog.showLoading(true);
    //        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: item };
    //        $.ajax({
    //            type: "POST", url: "dashboard.aspx/enableBlock_",
    //            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //            success: function (c) {
    //                dialog.hideLoading();
    //                if (c.d[0] == 'success') {
    //                    var num = c.d[1];
    //                    item.num = num;

    //                    $('.ColQuickBlock').eq(item.style.col - 1).append(dashboard.geneQuickBlocks(item));
    //                    dashboard.getBlockStr(item.id, item.filename, item.mode, function (str) {
    //                        dashboard.geneQuickBlockContent(item, str);
    //                    });

                
    //                    RaveshUI.successToast(DashboardRes.cap_done, '');

    //                    $('.manage-block-item').removeClass('selected');
    //                    okBtn.removeClass('save');

    //                }
    //            }
    //        });
    //    }
    //    return false;
    //});


    //$('.TblQuickLink .icon-check-empty,.TblQuickLink .icon-check').live('click', function () {
    //    var visible = $(this).hasClass('icon-check-empty');
    //    var item = $(this).parents('div:first').data('data');
    //    item.url = item.defaultUrl;
    //    if (visible) {
    //        $(this).addClass('icon-check').removeClass('icon-check-empty');
    //    } else {
    //        $(this).removeClass('icon-check').addClass('icon-check-empty');
    //    }
    //    dashboard.enableLink(item, visible, true);
    //    return false;
    //});
    //$('.TblQuickLink .icon-times').live('click', function () {
    //    if (!confirm(DashboardRes.question_delete)) return false;
    //    var item = $(this).parents('div:first').data('data');
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //    e.o.id = item.id;
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/deleteQuickLink_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });

    //    $(this).parents('div:first').remove();
    //    $('.itemQuickLink:[id=' + item.id + ']').remove();
    //    return false;
    //});
    //$('.TblQuickLink .icon-edit').live('click', function () {
    //    var item = $(this).parents('div:first').data('data');
    //    $('.fieldListQuickLink').hide();
    //    $('.fieldNewQuickLink').show();
    //    dashboard.loadQuickLinkEditor(function () {
    //        if (item.mode == 1 || item.mode == 2) {
    //            $('.fieldSelectModeQuickLink').show();
    //            $('#RadModeQuickLink_' + item.mode).attr('checked', 'checked');
    //            $('.DivModeQuickLink_1,.DivModeQuickLink_2').hide();
    //            $('.DivModeQuickLink_' + item.mode).show();
    //            if (item.mode == 1) {
    //                $('#DrdLinkNameQuickLink').val(item.defaultUrl).attr('selected', 'selected');
    //                $("#DrdLinkNameQuickLink").multiselect('refresh');
    //                $('.itemTestQuickLink a').attr('href', $('#DrdLinkNameQuickLink').val());
    //            } else {
    //                $('#TxtUrlQuickLink').val(item.defaultUrl);
    //                $('.itemTestQuickLink a').attr('href', item.defaultUrl);
    //            }
    //        } else {
    //            $('.fieldSelectModeQuickLink').hide();
    //        }
    //        $('#TxtTitleQuickLink').val(item.title);
    //        $('.itemTestQuickLink .quicklink-title').text(item.title);
    //        $('#DrdFontSizeQuickLink').val(item.font_size).attr('selected', 'selected').msDropDown().data("dd");
    //        $('#DrdSizeQuickLink').val(item.size).attr('selected', 'selected').msDropDown().data("dd");
    //        $('.itemTestQuickLink .quicklink-title').css('font-size', item.font_size);
    //        if (item.color == "") {
    //            $('#RadColorQuickLink_0').attr('checked', 'checked');
    //        } else {
    //            $('#RadColorQuickLink_1').attr('checked', 'checked');
    //            $('#TxtColorQuickLink').spectrum("enable");
    //            $('#TxtColorQuickLink').spectrum("set", item.color);
    //            $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', item.color);
    //            $('.itemTestQuickLink a').removeClass('th-bgcolor-hover');
    //            $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', item.color);
    //        }
    //        if ($('.iconPlaceQuickLink span:[item=' + item.icon + ']').length == 0) {
    //            var tempIcon = $(dashboard.getIcons([item.icon])).addClass('temp');
    //            $('.iconPlaceQuickLink').prepend(tempIcon);
    //        }
    //        $('.iconPlaceQuickLink span.selected').removeClass('selected');
    //        $('.iconPlaceQuickLink span:[item=' + item.icon + ']').addClass('selected');
    //        $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + item.icon);

    //        $('.BtnCreateQuickLink').hide();
    //        $('.BtnEditQuickLink').show().data('data', item);
    //    });
    //    return false;
    //});

    //$('#AddNewQuickLink').click(function () {
    //    $('.fieldListQuickLink').hide();
    //    $('.fieldNewQuickLink').show();
    //    dashboard.loadQuickLinkEditor(function () {
    //    });
    //    return false;
    //});

    //$(".itemQuickLink .dynamicColor").live({
    //    mouseenter: function () {
    //        $(this).css('background-color', $(this).attr('color'));
    //        $(this).find('i').css('color', '#fff');
    //    },
    //    mouseleave: function () {
    //        $(this).css('background-color', '#fff');
    //        $(this).find('i').css('color', $(this).attr('color'));
    //    }
    //});

    //$('.iconPlaceQuickLink span').live('click', function () {
    //    $('.iconPlaceQuickLink span.selected').removeClass('selected');
    //    $(this).addClass('selected');
    //    $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + $(this).attr('item'));
    //    //if ($('.itemTestQuickLink i').hasClass($(this).attr('item'))) {
    //    //    $('.itemTestQuickLink i').toggleClass("fas");
    //    //} else {
    //    //    $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + $(this).attr('item'));

    //    //}
    //});

    //$('[name=RadModeQuickLink]').change(function () {
    //    $('.DivModeQuickLink_1,.DivModeQuickLink_2').hide();
    //    $('.DivModeQuickLink_' + $(this).val()).show();
    //    if ($(this).val() == 1) {
    //        if ($('#DrdLinkNameQuickLink').val() == 0)
    //            $('.itemTestQuickLink a').attr('href', '#');
    //        else
    //            $('.itemTestQuickLink a').attr('href', $('#DrdLinkNameQuickLink').val());
    //    } else {
    //        $('.itemTestQuickLink a').attr('href', $('#TxtUrlQuickLink').val());
    //    }
    //});
    //$('[name=RadColorQuickLink]').change(function () {
    //    if ($(this).val() == 0) {
    //        $('#TxtColorQuickLink').spectrum("disable");
    //        $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', '');
    //        $('.itemTestQuickLink a').addClass('th-bgcolor-hover');
    //        $('.itemTestQuickLink a').removeClass('dynamicColor').removeAttr('color', color);
    //    }
    //    else {
    //        var color = ($('#TxtColorQuickLink').spectrum("get")).toHexString();
    //        $('#TxtColorQuickLink').spectrum("enable");
    //        $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', color);
    //        $('.itemTestQuickLink a').removeClass('th-bgcolor-hover');
    //        $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color);
    //    }
    //});
    //$('#TxtTitleQuickLink').keyup(function () {
    //    $('.itemTestQuickLink .quicklink-title').text($(this).val());
    //});
    //$('#TxtUrlQuickLink').keyup(function () {
    //    $('.itemTestQuickLink a').attr('href', $(this).val());
    //});
    //$('#DrdFontSizeQuickLink').change(function () {
    //    $('.itemTestQuickLink .quicklink-title').css('font-size', $(this).val());
    //});
    //$('.BtnCreateQuickLink').click(function () {
    //    var item = {};
    //    item.id = dashboard.getRandomInt(100, 100000);
    //    item.mode = $('[name=RadModeQuickLink]:checked').val();
    //    item.isDefault = true;
    //    item.title = htmlEncode($('#TxtTitleQuickLink').val());
    //    if (item.title == "") return false;
    //    item.title_res = item.title;
    //    item.url = (item.mode == 1) ? $('#DrdLinkNameQuickLink').val() : $('#TxtUrlQuickLink').val();
    //    item.defaultUrl = item.url;
    //    if (item.mode == 1 && item.url == 0) return false;
    //    item.icon = $('.iconPlaceQuickLink span.selected').attr('item');
    //    item.color = ($('[name=RadColorQuickLink]:checked').val() == 0) ? '' : ($('#TxtColorQuickLink').spectrum("get")).toHexString();
    //    item.order = 0;
    //    item.font_size = $('#DrdFontSizeQuickLink').val();
    //    item.size = $('#DrdSizeQuickLink').val();
    //    dashboard.enableLink(item, true, true);

    //    $('.fieldListQuickLink').show();
    //    $('.fieldNewQuickLink').hide();
    //    dashboard.clearFormQuickLinks();
    //    $('.TblQuickLink').append(dashboard.geneTblItemQuickLink(item));
    //    return false;
    //});
    //$('.BtnEditQuickLink').click(function () {
    //    var item = $(this).data('data');
    //    if (item.mode == 1 || item.mode == 2) {
    //        item.mode = $('[name=RadModeQuickLink]:checked').val();
    //        item.url = (item.mode == 1) ? $('#DrdLinkNameQuickLink').val() : $('#TxtUrlQuickLink').val();
    //        if (item.mode == 1 && item.url == 0) return false;
    //    }

    //    item.isDefault = true;
    //    item.title = $('#TxtTitleQuickLink').val();
    //    if (item.title == "") return false;
    //    item.title_res = item.title;
    //    item.icon = $('.iconPlaceQuickLink span.selected').attr('item');
    //    item.color = ($('[name=RadColorQuickLink]:checked').val() == 0) ? '' : ($('#TxtColorQuickLink').spectrum("get")).toHexString();
    //    item.font_size = $('#DrdFontSizeQuickLink').val();
    //    item.size = $('#DrdSizeQuickLink').val();
    //    dashboard.enableLink(item, true, false);

    //    $('.fieldListQuickLink').show();
    //    $('.fieldNewQuickLink').hide();
    //    dashboard.clearFormQuickLinks();
    //    var oldItem = $('.TblQuickLink div:[item=' + item.id + ']');
    //    oldItem.after(dashboard.geneTblItemQuickLink(item));
    //    oldItem.remove();
    //    return false;
    //});
    //$('.BtnListQuickLink').click(function () {
    //    $('.fieldListQuickLink').show();
    //    $('.fieldNewQuickLink').hide();
    //    dashboard.clearFormQuickLinks();
    //    return false;
    //});
});

$(document).bind('click', function (e) {
    if (!$(e.target).hasClass('btnsetting_dashboard')) {
        if ($(e.target).parents('.btnsetting_dashboard').length == 0) {
            $('.MnuSettingDash').hide();
            $('.btnsetting_dashboard').removeClass('selected');
        }
    }
});

var dashboard_mng = function () {
    ///* load block------------*/
    //var arrLoadBlock = new Array();
    //this.load_block = function (block_num, callback) {
    //    arrLoadBlock.push([block_num, callback]);
    //}
    //this.callLoad_block = function (block_num, block) {
    //    var request = $.grep(arrLoadBlock, function (s) { return s[0] == block_num; });
    //    if (request.length != 0) request[0][1](block, block.data('data').setting);
    //}
    ///* setting block---------*/
    //var ArrShowSetting = new Array();
    //this.showSetting = function (block, callback) {
    //    var id = block.attr('id');
    //    ArrShowSetting.push({ id: id, callback: callback });
    //}
    //this.CallshowSetting = function (id) {
    //    var request = $.grep(ArrShowSetting, function (e) { return e.id == id; });
    //    if (request.length != 0) request[0].callback($('.QuickBlock:[id=' + id + ']').data('data').setting);
    //};
    //this.setSetting = function (block, setting) {
    //    block.data('data').setting = setting;
    //    block.find('.container-block').show();
    //    block.find('.container-block-setting').hide();
    //    block.find('.icon-cog').removeClass('selected');
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { num: block.attr('id'), setting: setting } };
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/setBlockSetting_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });
    //    return false;
    //};
    //this.setTitle = function (block, title) {
    //    block.find('.QuickBlock-title').text(title);
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //    e.o.num = block.attr('id');
    //    e.o.name = title
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/renameBlock_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });
    //    return false;
    //};
    //this.getSetting = function (block) {
    //    var id = block.attr('id');
    //    return $('.QuickBlock:[id=' + id + ']').data('data').setting;
    //};
    //this.getStyle = function (block) {
    //    var id = block.attr('id');
    //    return $('.QuickBlock:[id=' + id + ']').data('data').style;
    //};
    ///* refresh block---------*/
    //var ArrRefresh = new Array();
    //this.refresh = function (block, callback) {
    //    var id = block.attr('id');
    //    ArrRefresh.push({ id: id, callback: callback });
    //}
    //this.CallRefreshBlock = function (id) {
    //    var request = $.grep(ArrRefresh, function (e) { return e.id == id; });
    //    if (request.length != 0) request[0].callback();
    //};


    ///* mask unmask---------*/
    //this.mask = function (block) {
    //    var id = block.attr('id');
    //    var thisBlock = $('.QuickBlock:[id=' + id + ']');
    //    thisBlock.find('.QuickBlock-overlay').fadeIn();
    //}
    //this.unmask = function (block) {
    //    var id = block.attr('id');
    //    var thisBlock = $('.QuickBlock:[id=' + id + ']');
    //    thisBlock.find('.QuickBlock-overlay').fadeOut();
    //}
    ///* resize block---------*/
    //var arrResize = new Array();
    //this.resize = function (block, callback) {
    //    var id = block.attr('id');
    //    arrResize.push({ id: id, callback: callback });
    //}
    //this.getSize = function (block) {
    //    return { width: block.width(), height: block.height() };
    //}
    //this.callResize = function (id) {
    //    var block = $('.QuickBlock:[id=' + id + ']');
    //    //block.data('data').style.height = block.height() + 'px';
    //    var request = $.grep(arrResize, function (e) { return e.id == id; });
    //    if (request.length != 0) request[0].callback(block.width(), block.height());
    //}
    ////------------------------------------------
    //var icons_ = ['icon-globe', 'icon-upload', 'icon-ivr-user', 'icon-dollar',
    //              'icon-shopping-cart', 'icon-cog', 'icon-external-link', 'icon-users', 'fas icon-users',
    //              'icon-search', 'icon-comment', 'fas icon-comment', 'icon-reminder', 'fas icon-reminder', 'icon-event', 'fas icon-event',
    //              'icon-workflow', 'fas icon-workflow', 'icon-edit', 'icon-tag', 'fas icon-tag', 'icon-link',
    //              'fas icon-user-shield', 'icon-task', 'fas icon-folder-close', 'icon-support', 'fas icon-support',
    //              'icon-inbox', 'icon-sms', 'icon-star', 'fas icon-star', 'icon-book',
    //              'icon-donate', 'icon-check', 'fas icon-check', 'icon-home', 'fas icon-home', 'icon-mobile-phone',
    //              'icon-file-text', 'fas icon-file-text', 'icon-user', 'fas icon-user', 'icon-refresh', 'icon-phone', 'fas icon-phone',
    //              'icon-bar-chart', 'icon-envelope', 'fas icon-envelope'];
    //this.icons = icons_;
    //this.getIcons = function (icon_list) {
    //    var result = '';
    //    $.each(icon_list, function (i, icon) {
    //        result += '<span item="' + icon + '"><i class="' + icon + ' th-color"></i></span>';
    //    });
    //    return result;
    //};
    ////------------------------------------------
    //this.getRandomInt = function (min, max) {
    //    return Math.floor(Math.random() * (max - min + 1)) + min;
    //}
    //this.clearFormQuickLinks = function () {
    //    $('#RadModeQuickLink_1').attr('checked');
    //    $('#DrdLinkNameQuickLink option:first').attr('selected', 'selected');
    //    $("#DrdLinkNameQuickLink").multiselect('refresh');
    //    $('.DivModeQuickLink_1').show();
    //    $('.DivModeQuickLink_0').hide();
    //    $('#DrdFontSizeQuickLink').val('16pt').attr('selected', 'selected').msDropDown().data("dd");
    //    $('#DrdSizeQuickLink').val('2').attr('selected', 'selected').msDropDown().data("dd");
    //    $('#TxtTitleQuickLink').val('');
    //    $('#TxtUrlQuickLink').val('http://');
    //    $('#RadColorQuickLink_0').attr('checked', 'checked');
    //    $('#TxtColorQuickLink').spectrum("disable");
    //    $('.iconPlaceQuickLink span.selected').removeClass('selected');
    //    $('.iconPlaceQuickLink span:first').addClass('selected');
    //    $('.iconPlaceQuickLink i').css('color', '');
    //    $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + $('.iconPlaceQuickLink span:first').attr('item')).css('color', '');
    //    $('.itemTestQuickLink .quicklink-title').text('').css('font-size', '16pt');
    //    $('.itemTestQuickLink a').attr('href', '#').addClass('th-bgcolor-hover').removeClass('dynamicColor').removeAttr('color', color);
    //    $('.iconPlaceQuickLink span.temp').remove();
    //    $('#TxtColorQuickLink').spectrum("set", '#2E2C2C');
    //    $('.BtnCreateQuickLink').show();
    //    $('.BtnEditQuickLink').hide();
    //}
    //this.loadQuickLinkEditor = function (callback) {
    //    if ($('.fieldNewQuickLink').attr('loaded')) {
    //        dashboard.clearFormQuickLinks();
    //        callback();
    //    }
    //    else {
    //        $('.fieldNewQuickLink').attr('loaded', true);
    //        $('.fieldNewQuickLink').mask('...');
    //        var arrScripts = new Array();
    //        arrScripts.push('../Themes/resources/scripts/jquery.multiselect.js');
    //        arrScripts.push('../Themes/resources/scripts/spectrum.js');

    //        if ($('#CssMultiselect').length == 0) $('head').append('<link id="CssMultiselect" href="../Themes/resources/css/jquery.multiselect.css" rel="stylesheet" type="text/css" />');
    //        if ($('#CssColorPicker').length == 0) $('head').append('<link id="CssColorPicker" href="../Themes/resources/css/spectrum.css" rel="stylesheet" type="text/css" />');
    //        dashboard.getScripts(arrScripts, function () {

    //            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //            $.ajax({
    //                type: "POST", url: "dashboard.aspx/getDefaultPage_",
    //                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //                success: function (c) {
    //                    $.each(c.d[1], function (i, item) {
    //                        $("#DrdLinkNameQuickLink").append('<option value="' + item.Value + '">' + item.Text + '</option>');
    //                    });

    //                    $("#DrdLinkNameQuickLink").multiselect({
    //                        click: function (event, ui) {
    //                            if (ui.value == 0) {
    //                                $('.itemTestQuickLink a').attr('href', '#');
    //                                $('.itemTestQuickLink .quicklink-title').text('');
    //                                $('#TxtTitleQuickLink').val('');
    //                            } else {
    //                                $('.itemTestQuickLink a').attr('href', ui.value + "&rnd_=" + $('#HFRnd').val());
    //                                $('.itemTestQuickLink .quicklink-title').text(ui.text);
    //                                $('#TxtTitleQuickLink').val(ui.text);
    //                            }
    //                        },
    //                        multiple: false,
    //                        selectedList: 1,
    //                        classes: 'right_left',
    //                        noneSelectedText: 'select'
    //                    }).multiselectfilter({ placeholder: DashboardRes.title, width: '147', label: DashboardRes.search });

    //                    callback();
    //                    $('.fieldNewQuickLink').unmask();
    //                }
    //            });

    //            $('#TxtColorQuickLink').spectrum({
    //                cancelText: DashboardRes.cancel, chooseText: DashboardRes.select, color: "#2E2C2C",
    //                showInput: true, showInitial: true, preferredFormat: "hex6", clickoutFiresChange: true, showPalette: true,
    //                move: function (color) {
    //                    $('.iconPlaceQuickLink i,.itemTestQuickLink i').css({ 'color': color.toHexString() });
    //                    $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color.toHexString());
    //                },
    //                change: function (color) {
    //                    $('.iconPlaceQuickLink i,.itemTestQuickLink i').css({ 'color': color.toHexString() });
    //                    $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color.toHexString());
    //                }
    //            });

    //            $('.iconPlaceQuickLink').html(dashboard.getIcons(dashboard.icons));
    //            $('.iconPlaceQuickLink span:first').addClass('selected');
    //            $('.itemTestQuickLink i').addClass($('.iconPlaceQuickLink span:first').attr('item'));

    //        });
    //    }
    //}

    //this.getLinkDetail = function (modes) {
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { modes: modes } };
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/getLinkDetail_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) {
    //            if (c.d[0] == 'success') {
    //                $.each(c.d[1], function (i, item) {
    //                    $('.itemQuickLink:[mode=' + i + '] .quicklink-detail').html(item).show();
    //                });
    //            }
    //        }
    //    });
    //}
    //this.enableLink = function (item, visible, setOrder) {
    //    if (visible) {
    //        if (setOrder) {
    //            var maxOrder = 0;
    //            $('.quicklink-container .itemQuickLink').each(function (i, item) {
    //                if (parseInt($(item).attr('order')) > maxOrder) maxOrder = parseInt($(item).attr('order'));
    //            });
    //            item.order = maxOrder + 1;
    //        }
    //        var checkExists = $('.itemQuickLink:[id=' + item.id + ']');
    //        if (checkExists.length == 0) {
    //            $('.quicklink-container').append(dashboard.geneQuickLinks(item));
    //        } else {
    //            checkExists.after(dashboard.geneQuickLinks(item));
    //            checkExists.remove();
    //        }
    //    } else {
    //        $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').remove();
    //    }
    //    item.url = item.defaultUrl;
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: item };
    //    e.o.visible = visible;
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/enableLink_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) { }
    //    });
    //    return false;
    //}

    //var arrBlockStr = new Array();
    //this.getBlockStr = function (id, filename, mode, callback) {
    //    var checkExists = $.grep(arrBlockStr, function (s) { return s[0] == id });
    //    if (checkExists.length != 0) { setTimeout(function () { callback(checkExists[0][1]); }, 500); return false; }
    //    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //    e.o.rnd_ = $('#HFRnd').val();
    //    e.o.filename = filename;
    //    e.o.mode = mode;
    //    $.ajax({
    //        type: "POST", url: "dashboard.aspx/getBlockDetail_",
    //        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //        success: function (c) {
    //            arrBlockStr.push([id, c.d[1]]);
    //            setTimeout(function () { callback(c.d[1]); }, 500);
    //        }
    //    });
    //}
    //this.geneQuickBlockContent = function (item, str) {

    //    str = str.replace(/#block#/gi, item.num);

    //    var block = $('.QuickBlock:[id=' + item.num + ']');
    //    var contentBlock = $('.QuickBlock:[id=' + item.num + '] .QuickBlock-content');
    //    contentBlock.find('.QuickBlock-overlay').hide();
    //    contentBlock.prepend(str);
    //    contentBlock.find('input:submit').button();
    //    contentBlock.find('.mydds').msDropDown().data("dd");

    //    dashboard.callLoad_block(item.num, block);
    //}

    //this.geneTblItemQuickLink = function (item) {
    //    var Exists = $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').length != 0;
    //    item.defaultUrl = item.url;
    //    item.url = item.url.replace('#rnd#', $('#HFRnd').val());
    //    return $('<div item="' + item.id + '">' +
    //                   '<i class="' + item.icon + ' right_left th-color" style="margin:0 5px;"></i>' +
    //                   '<a ' + ((item.mode == 2) ? 'target="_blank"' : '') + ' href="' + item.url + '" style="color:#696969;font-size:9pt">' + item.title + '</a>' +
    //                   '<i class="' + (Exists ? 'icon-check' : 'icon-check-empty') + ' left_right cursor" style="margin:0 5px;color:#444"></i>' +
    //                   '<i class="icon-edit left_right cursor" title="Edit" style="margin:0 3px;color:#D88A26"></i>' +
    //                   ((item.mode == 1 || item.mode == 2) ? '<i class="icon-times left_right cursor" title="Delete" style="margin:0 3px;color:#EB4646"></i>' : '') +
    //             '</div>').data('data', item);
    //};
    //this.geneTblItemQuickBlock = function (item) {
    //    var result = $('<div class="manage-block-item">' +
    //                     '<div>' +
    //                     '<div class="block-title" title="' + item.title + '">' + item.title + '</div>' +
    //                     '<div class="block-detail th-bgcolor">' + (resources.lang == "fa" ? item.detail_fa : item.detail_en) + '</div>' +
    //                     '<div class="block-icon block-icon-' + resources.direction + '"><i class="fas ' + item.icon + '"></i></div>' +
    //                     (item.isNew ? '<div class="block-noti-new animated infinite pulse">' + DashboardRes.cap_new + '</div>' : '') +
    //                   '</div></div>').data('data', item);
    //    return result;
    //};

    //this.geneQuickLinks = function (item) {
    //    var url = item.url;
    //    url = url.replace('#rnd#', $('#HFRnd').val());
    //    return '<li id="' + item.id + '" title="' + item.title + '" mode="' + item.mode + '" order="' + item.order + '" class="col-QuickLink' + item.size + ' right_left itemQuickLink">' +
    //                '<a ' + ((item.mode == 2) ? 'target="_blank"' : '') + ' href="' + url + '" ' + ((item.color == "") ? 'class="th-bgcolor-hover"' : 'class="dynamicColor" color="' + item.color + '"') + '>' +
    //                    '<i class="' + item.icon + ' left_right th-color" ' + ((item.color == "") ? '' : 'style="color:' + item.color + '"') + '></i>' +
    //                    '<span class="quicklink-title" style="font-size:' + item.font_size + '">' + item.title + '</span>' +
    //                    '<span class="quicklink-detail"></span>' +
    //                '</a>' +
    //            '</li>';
    //}
    //this.geneQuickBlocks = function (item) {
    //    var result = $('<div class="QuickBlock" id="' + item.num + '" item="' + item.id + '">' +
    //                '<div class="QuickBlock-head">' +
    //                    '<div class="QuickBlock-head-icon left_right">' +
    //                        '<i class="icon-times left_right"></i>' +
    //                        '<i class="icon-minus left_right" ' + (item.isExpand ? '' : 'style="display:none"') + '></i>' +
    //                        '<i class="icon-plus left_right" ' + (item.isExpand ? 'style="display:none"' : '') + ' ></i>' +
    //                        (item.ctlSetting ? '<i class="icon-cog left_right"></i>' : '') +
    //                        (item.ctlRefresh ? '<i class="icon-refresh left_right"></i>' : '') +
    //                    '</div>' +
    //                    '<i class="QuickBlock-icon right_left ' + item.icon + ' th-color"></i>' +
    //                    '<div class="QuickBlock-title right_left">' + item.title + '</div>' +
    //                '</div>' +
    //                '<div class="QuickBlock-content" style="' + (item.isExpand ? '' : 'display:none;') + ((item.style.hasOwnProperty('height')) ? 'height:' + item.style.height + ';' : '') + '">' +
    //                    '<div class="QuickBlock-overlay"><div style="margin: 100px auto; display: block;" class="spinner"></div></div>' +
    //                '</div>' +
    //           '</div>').data('data', item)

    //    result.find('.QuickBlock-content').resizable({
    //        grid: [10000, 1],
    //        minHeight: 150,
    //        maxHeight: 800,
    //        stop: function (event, ui) {

    //            result.find('.QuickBlock-content').css('width', 'auto');

    //            dashboard.callResize(item.num);

    //            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    //            e.o.height = ui.size.height;
    //            e.o.num = item.num;
    //            $.ajax({
    //                type: "POST", url: "dashboard.aspx/setBlockHeight_",
    //                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
    //                success: function (c) { }
    //            });

    //        }
    //    });

    //    return result;
    //}

    //this.getScripts = function (urls, callback) {
    //    if (!$.isArray(urls)) {
    //        urls = [urls];
    //    }
    //    var url = "";
    //    var i = 0;
    //    var FnGetScript = function (urls) {
    //        if (urls.length == 1) {
    //            url = urls[i];
    //        } else {
    //            url = urls[i];
    //            i++;
    //            if (i > urls.length) { callback(); return false };
    //        }
    //        $.getScript(url, function () {
    //            if (i == 0)
    //                callback();
    //            else {
    //                FnGetScript(urls);
    //            }
    //        });
    //    }
    //    FnGetScript(urls);
    //};

    //this.showMessage = function (message) {
    //    var msgPlc = $('.dashboard-msg');
    //    msgPlc.html(message).hide();
    //    msgPlc.animateCSS('fadeInDown');
    //    var timer = setTimeout(function () {
    //        msgPlc.animateCSS('fadeOutUp', function () { msgPlc.hide(); });
    //    }, 3000);
    //    msgPlc.click(function () {
    //        clearTimeout(timer);
    //        msgPlc.animateCSS('fadeOutUp', function () { msgPlc.hide(); });
    //    });
    //}
}
var dashboard = new dashboard_mng();