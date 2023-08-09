
$(document).ready(function () {

    $('#btn_sale_ShowDlgQuickBlock').click(function () {
        $("#DlgQuickBlock").dialog('open');
        $('.MnuSettingDash').fadeOut();
        $('.btnsetting_dashboard').removeClass('selected');

        if ($('.btnsetting_dashboard .newdashboard').length != 0) {
            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
            $.ajax({
                type: "POST", url: "SaleReport.aspx/setLastView_", //hh
                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                success: function (c) { }
            });
            $('.btnsetting_dashboard .newdashboard').remove();
        };

        var wrapper = $('.manage-block-wrapper');

        var QuickBlocks = wrapper.data('date');
        var blockCount = QuickBlocks.length;
        var rowsCount = 3;
        var colsCount = 3;
        wrapper.attr('colsCount', colsCount);
        $.each(QuickBlocks, function (i, item) {
            var j = Math.ceil((i + 1) / rowsCount);
            var column = $('.manage-block-wrapper-column-' + j);
            if (column.length == 0) {
                column = $('<div>').addClass('block-wrapper-column manage-block-wrapper-column-' + j);
                wrapper.append(column);
            }
            var block = dashboard.geneTblItemQuickBlock(item);
            block.click(function () {
                wrapper.find('.selected').removeClass('selected');
                block.addClass('selected');
                block.animateCSS('pulse');
                var Exists = $('.quickblock-container .QuickBlock:[item=' + item.id + ']').length != 0;
                if (!Exists || item.ctlMulti) {
                    $('.manage-block-buttons .btnAdd').removeClass('disable');
                } else {
                    $('.manage-block-buttons .btnAdd').addClass('disable');
                }
            });

            column.append(block.hide());
            var blockCol = column.children().length;
            setTimeout(function () {
                block.animateCSS('zoomIn');
            }, (j * blockCol) * 50);
        });
        var blockWidth = wrapper.find('.manage-block-item:first').outerWidth(true);
        wrapper.css('width', Math.ceil(blockCount / rowsCount) * blockWidth);
        wrapper.find('.block-wrapper-column').css('width', blockWidth);

        return false;
    });

    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            $('.QuickBlock').each(function (i, item) {
                dashboard.callResize($(item).attr('id'));
            });
        }, 500);
    });

    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    $.ajax({
        type: "POST", url: "SaleReport.aspx/getDashboard_",
        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
        success: function (c) {
            if (c.d[0] == 'success') {
                var QuickLinks = c.d[1].QuickLinks;
                var QuickBlocks = c.d[1].QuickBlocks;
              
                $.each(QuickLinks, function (i, item) {
                    $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').css('display', '');
                });

                QuickBlocks.sort(function (a, b) { return a.style.order - b.style.order; });

                $.each(QuickBlocks, function (i, item) {
                    $('.ColQuickBlock').eq(item.style.col - 1).append(dashboard.geneQuickBlocks(item));
                    //dashboard.setComet(item.num, item.setting, false);
                });

                var createBlock = function () {
                    var item = QuickBlocks[0];
                    dashboard.getBlockStr(item.id, item.filename, item.mode, function (str) {

                        dashboard.geneQuickBlockContent(item, str);

                        if (QuickBlocks.length > 1) {
                            QuickBlocks.splice(0, 1);
                            createBlock();
                        }
                    });
                }
                if (QuickBlocks.length != 0) createBlock();
                //-------------------------------------------------

                var SettQuickLinks = c.d[2].QuickLinks;
                var SettQuickBlocks = c.d[2].QuickBlocks;

                $.each(SettQuickLinks, function (i, item) {
                    $('.TblQuickLink').append(dashboard.geneTblItemQuickLink(item));
                });

                $('.manage-block-wrapper').data('date', SettQuickBlocks);

                var newBlockCount = $.grep(SettQuickBlocks, function (s) { return s.isNew == true }).length;
                if (newBlockCount != 0) {
                    $('.btnsetting_dashboard').append($('<div>').addClass('newdashboard').text(newBlockCount));
                }

                //bind kardan etalate dore link ha
                $.each(QuickLinks, function (i, item) {
                    
                    $('.firstdiv:[item=' + item.id + ']').find('#dur_num').val((item.duration.duration_num == undefined || item.duration.duration_num == null || item.duration.duration_num == "") ? 1 : item.duration.duration_num)
                    $('.firstdiv:[item=' + item.id + ']').find('#dur_type').val((item.duration.duration_type == undefined || item.duration.duration_type == null || item.duration.duration_type == "") ? 0 : item.duration.duration_type).attr('selected', "selected");
                    $('.firstdiv:[item=' + item.id + ']').find('#dur_val').val((item.duration.duration_val == undefined || item.duration.duration_val == null || item.duration.duration_val == "") ? 1 : item.duration.duration_val).attr('selected', "selected");
                    

                    if (item.duration.duration_val == "2") $('.firstdiv:[item=' + item.id + ']').find('#dur_num').hide();
                    else $('.firstdiv:[item=' + item.id + ']').find('#dur_num').show();


                    if (item.duration.duration_type == "5") //agar halte salejari gadimy bood
                    {
                        $('.firstdiv:[item=' + item.id + ']').find('#dur_num').hide();
                        $('.firstdiv:[item=' + item.id + ']').find('#dur_num').val(1);
                        $('.firstdiv:[item=' + item.id + ']').find('#dur_type').val("1").attr('selected', "selected");
                        $('.firstdiv:[item=' + item.id + ']').find('#dur_val').val("2").attr('selected', "selected");
                    }

                    if (item.id == 10) $('.firstdiv:[item=' + item.id + ']').find('#date_base').val(item.mode);

                });

            }
        }
    });

    $('.itemQuickLink').live('click', function () {
        var Modes = { workflow: 3, todo: 4, event: 5 };
        var mode = $(this).attr('mode');
        if (mode == Modes.workflow) {
            $('.quickPage-container,.page-backdashboard').show();
            $('.quickblock-container,.itemQuickPage').hide();
            if ($('.worflow-container').length == 0) {
                $('.overlay-quickPage').show();
                $('.quickPage-container').append('<div class="worflow-container itemQuickPage"></div>');
                var e = { r: $('#HFRnd').val() };
                $.ajax({
                    type: "POST", url: "Load_UserControl.aspx/Get_Wf_User", contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(e), dataType: "json", success: function (c) {
                        $('.overlay-quickPage').hide();
                        $('.worflow-container').html('<div class="box"><div class="form"><div class="fields">' + c.d + '</div></div></div>');
                    }
                });
            }
            $('.worflow-container').show();
            return false;
        } else if (mode == Modes.todo) {
            $('.quickPage-container,.page-backdashboard').show();
            $('.quickblock-container,.itemQuickPage').hide();
            if ($('.todo-container').length == 0) {
                $('.overlay-quickPage').show();
                $('.quickPage-container').append('<div class="todo-container itemQuickPage"></div>');
                var e = { n: "Todo", u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
                $.ajax({
                    type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(e), dataType: "json", success: function (c) {
                        $('.overlay-quickPage').hide();
                        $('.todo-container').html(c.d[1]);
                    }
                });
            }
            $('.todo-container').show();
            return false;
        } else if (mode == Modes.event) {
            $('.quickPage-container,.page-backdashboard').show();
            $('.quickblock-container,.itemQuickPage').hide();
            if ($('.event-container').length == 0) {
                $('.overlay-quickPage').show();
                $('.quickPage-container').append('<div class="event-container itemQuickPage"></div>');
                var e = { n: "Event", u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '', r: $('#HFRnd').val() };
                $.ajax({
                    type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(e), dataType: "json", success: function (c) {
                        $('.overlay-quickPage').hide();
                        $('.event-container').html(c.d[1]);
                    }
                });
            }
            $('.event-container').show();
            return false;
        }
    });
    $('.page-backdashboard').click(function () {
        $(this).hide();
        $('.quickPage-container').hide();
        $('.quickblock-container,').show();
    });

    $("#DlgQuickLink").dialog({
        autoOpen: false,
        modal: true,
        minWidth: 470,
        minHeight: 610,
        maxHeight: 610,
        open: function () {
            openDialog($(this));
        },
        hide: { effect: 'drop', direction: 'up', duration: 400 }
    });

    $("#DlgQuickBlock").dialog({
        autoOpen: false,
        modal: true,
        width: 650,
        height: 400,
        resizable: false,
        open: function () {
            openDialog($(this));
        },
        close: function () {//reset dialog
            var wrapper = $('.manage-block-wrapper');
            wrapper.empty();
            $('.manage-block-buttons .btnAdd').addClass('disable');
            wrapper.attr('num', 0);
            wrapper.css({ 'transform': 'translateX(0px)' });
        },
        hide: { effect: 'drop', direction: 'up', duration: 400 }
    });

    $(".ColQuickBlock").sortable({
        tolerance: "pointer",
        scrollSensitivity: 1,
        connectWith: ".ColQuickBlock",
        handle: ".QuickBlock-head:not(.disable)",
        placeholder: "QuickBlock-highlight",
        opacity: 0.9,
        revert: true,
        dropOnEmpty: true,
        forcePlaceholderSize: true,
        stop: function (event, ui) {
            dashboard.callResize($(ui.item).attr('id'));
        },
        update: function (event, ui) {
            if (this === ui.item.parent()[0]) {

                var arrOrder = new Array();
                $('.ColQuickBlock').each(function (c, col) {
                    $(col).find('.QuickBlock').each(function (i, item) {
                        arrOrder.push([$(item).attr('id'), c + 1, i + 1]);
                    });
                });
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.order = arrOrder;
                $.ajax({
                    type: "POST", url: "SaleReport.aspx/setBlockOrder_",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) { }
                });
            }
        }
    });

    $(".quicklink-container").sortable({
        opacity: 0.9,
        update: function (event, ui) {
            if (this === ui.item.parent()[0]) {
                var arrOrder = new Array();
                var checkLoadtblQuickLink = $('.TblQuickLink div').length != 0;
                $('.quicklink-container .itemQuickLink').each(function (i, item) {
                    arrOrder.push([$(item).attr('id'), i + 1]);
                    if (checkLoadtblQuickLink) $('.TblQuickLink div:[item=' + $(item).attr('id') + ']').data('data').order = i + 1;
                });
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.order = arrOrder;
                $.ajax({
                    type: "POST", url: "SaleReport.aspx/setLinkOrder_", //hh
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) { }
                });
            }
        }
    }).disableSelection();

    $('.QuickBlock .icon-times').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');

        if (thisBlock.attr('item') != 'salelist') {
            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
            e.o.num = thisBlock.attr('id');
            $.ajax({
                type: "POST", url: "SaleReport.aspx/closeBlock_",
                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                success: function (c) { }
            });
            thisBlock.animate({ 'height': 0, 'opacity': 0 }, 500, function () {
                thisBlock.remove();
            });
            return false;
        }

    });

    $('.QuickBlock-head-icon .icon-minus,.QuickBlock-head-icon .icon-plus').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');
        var isExpand = $(this).hasClass('icon-plus');
        if (isExpand) {
            thisBlock.find('.icon-minus').show();
            thisBlock.find('.icon-plus').hide();
            thisBlock.find('.QuickBlock-content').slideDown(500);
        } else {
            thisBlock.find('.icon-plus').show();
            thisBlock.find('.icon-minus').hide();
            thisBlock.find('.QuickBlock-content').slideUp(500, function () { $(this).hide(); });
        }

        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.isExpand = isExpand;
        e.o.num = thisBlock.attr('id');
        $.ajax({
            type: "POST", url: "SaleReport.aspx/setExpand_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
    });
    $('.QuickBlock .QuickBlock-title').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');

        if (thisBlock.find('.QuickBlock-head input:[type=text]').length != 0) return false;
        var thisSubject = $(this);
        var firstValue = thisSubject.text();
        var renametxt = $('<input type="text" value="' + firstValue + '" style="margin-top:5px"/>');
        thisSubject.after(renametxt);
        thisSubject.hide();
        renametxt.focus();
        renametxt.select();
        var fnUpdateBlock = function () {
            if (firstValue != renametxt.val()) {
                thisSubject.text(renametxt.val());
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.num = thisBlock.attr('id');
                e.o.name = renametxt.val();
                $.ajax({
                    type: "POST", url: "SaleReport.aspx/renameBlock_",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) { }
                });
            }
            thisSubject.show();
            renametxt.remove();
        }
        renametxt.blur(function () {
            fnUpdateBlock();
        });
        renametxt.keyup(function (event) {
            if (event.keyCode == 13) {
                fnUpdateBlock();
            }
        });

        return false;
    });
    $('.QuickBlock .icon-cog').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');
        if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
            thisBlock.find('.container-block-setting').show();
            thisBlock.find('.container-block').hide();
            if (thisBlock.attr('item') == "salelist")
                searchcustomer();
            dashboard.CallshowSetting(thisBlock.attr('id'));
        } else {
            thisBlock.find('.container-block').show();
            $(this).parents('.QuickBlock-content').css('height', 530);
            thisBlock.find('.container-block-setting').hide();
            thisBlock.find('.icon-cog').removeClass('selected');
        }
        return false;
    });

    $('#BtnNewSale').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');
        thisBlock.find('.container-block-setting').show();
        $(this).parents('.QuickBlock-content').css('height', 950);
        thisBlock.find('.container-block').hide();
        if (thisBlock.attr('item') == "salelist")
            searchcustomer();
        dashboard.CallshowSetting(thisBlock.attr('id'));
        return false;
    });

    $('.QuickBlock .icon-refresh').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');
        dashboard.CallRefreshBlock(thisBlock.attr('id'));
        return false;
    });
    $('.QuickBlock .blockSettingCancel').live('click', function () {
        var thisBlock = $(this).parents('.QuickBlock');
        thisBlock.find('.container-block').show();
        if (thisBlock.attr('item') == 'salelist')
            $(this).parents('.QuickBlock-content').css('height', '600px');
        thisBlock.find('.container-block-setting').hide();
        thisBlock.find('.icon-cog').removeClass('selected');
        return false;
    });


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

    $('.btnuser_dashboard').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.MnuUserDash').hide();
        }
        else {
            var mnu = $('.MnuUserDash');
            if (resources.direction == 'rtl') {
                mnu.css({ left: $(this).offset().left - $('.page-utility-contain').offset().left, top: $(this).offset().top + 24 - $('.page-utility-contain').offset().top });
            } else {
                mnu.css({ left: $(this).offset().left - mnu.width() + 24 - $('.page-utility-contain').offset().left, top: $(this).offset().top + 24 - $('.page-utility-contain').offset().top });
            }
            mnu.show();
            $(this).addClass('selected');
        }
    });

    $('#btn_sale_ShowDlgQuickLink').click(function () {
        $("#DlgQuickLink").dialog('open');
        $('.fieldListQuickLink').show();
        $('.fieldNewQuickLink').hide();
        return false;
    });

    $('.manage-block-buttons .btnPrev,.manage-block-buttons .btnNext').click(function () {
        var wrapper = $('.manage-block-wrapper');
        var blockWidth = wrapper.find('.manage-block-item:first').outerWidth(true);
        var colCount = wrapper.children().length;
        var showColCount = parseFloat(wrapper.attr('colsCount'));
        var currentIndex = parseFloat(wrapper.attr('num')) || 0;
        if ($(this).hasClass('btnNext')) {
            if (colCount - currentIndex > showColCount) {
                currentIndex++;
                wrapper.css({ 'transform': 'translateX(-' + (currentIndex * blockWidth) + 'px)' });
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
                wrapper.css({ 'transform': 'translateX(-' + (currentIndex * blockWidth) + 'px)' });
            }
        }
        wrapper.attr('num', currentIndex);
    });

    $('.manage-block-buttons .btnAdd').click(function () {
        if ($(this).hasClass('disable')) return false;

        var item = $('.manage-block-item.selected').data('data');

        $('.manage-block-overlay,.wait-manage-block').show();
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: item };
        $.ajax({
            type: "POST", url: "SaleReport.aspx/enableBlock_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.manage-block-overlay,.wait-manage-block').hide();
                if (c.d[0] == 'success') {
                    var num = c.d[1];
                    item.num = num;

                    $('.ColQuickBlock').eq(item.style.col - 1).append(dashboard.geneQuickBlocks(item));
                    dashboard.getBlockStr(item.id, item.filename, item.mode, function (str) {
                        dashboard.geneQuickBlockContent(item, str);
                    });

                    //dashboard.setComet(item.num, item.setting, true);
                    $(item).removeClass("selected");
                    $('.manage-block-buttons .btnAdd').addClass('disable');
                    //$("#DlgQuickBlock").dialog('close');
                }
            }
        });

    });

    //vagti tik gozashte ya bardashte mishvad  
    $('.TblQuickLink #manualcheck').live('click', function () {
        var visible = $(this).hasClass('icon-check-empty');
        var item = $(this).parents('div:first').data('data');
        item.url = item.defaultUrl;
        if (visible) {
            $(this).addClass('icon-check').removeClass('icon-check-empty');
            item.duration.duration_num = $(this).parents('.firstdiv').find('#dur_num').val();
            item.duration.duration_type = $(this).parents('.firstdiv').find('#dur_type').find("option:selected").val();
            item.duration.duration_val = $(this).parents('.firstdiv').find('#dur_val').find("option:selected").val();
            if (item.duration.duration_type == 0) {
                $(this).parents('.firstdiv').find('#dur_num').show();
                $(this).parents('.firstdiv').find('#dur_num').val(1);
                $(this).parents('.firstdiv').find('#dur_val').val("1").attr('selected', "selected");
            }
            call_duration_functions(item.id, item.duration.duration_num, item.duration.duration_type, item.duration.duration_val);
        } else {
            $(this).removeClass('icon-check').addClass('icon-check-empty');
            $(this).parents('.firstdiv').find('#dur_num').show();
            $(this).parents('.firstdiv').find('#dur_num').val(1);
            $(this).parents('.firstdiv').find('#dur_type').val("0").attr('selected', "selected");
            $(this).parents('.firstdiv').find('#dur_val').val("1").attr('selected', "selected");
        }
        dashboard.enableLink(item, visible, true);
        return false;
    }); 

    //vagti adad tagir mikond
    $('.TblQuickLink #dur_num').live('change', function () {
        save_Duration(this);
    });

    //vagti type tagir mikond = sal , mah 
    $('.TblQuickLink #dur_type').live('change', function () {
        save_Duration(this);
    });

    //vagti value tagir mikond = Akhir jary
    $('.TblQuickLink #dur_val').live('change', function () {
        $(this).parents('.firstdiv').find('#dur_num').val(1);
        if ($(this).val() == 1)
            $(this).parents('.firstdiv').find('#dur_num').show();
        else
            $(this).parents('.firstdiv').find('#dur_num').hide();
        save_Duration(this);
    });

    //vagti type tagir mikond = sal , mah 
    $('.TblQuickLink #date_base').live('change', function () {
        save_DateBase(this);
    });

    //zakhire dore link ha dar xml
    function save_Duration(elem) {
        var item = $(elem).parents('.firstdiv').data('data');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.id = item.id;
        e.o.duration_num = $(elem).parents('.firstdiv').find('#dur_num').val();
        e.o.duration_type = $(elem).parents('.firstdiv').find('#dur_type').find("option:selected").val();
        e.o.duration_val = $(elem).parents('.firstdiv').find('#dur_val').find("option:selected").val();

        if ((item.visible)) {
            $.ajax({
                url: "SaleReport.aspx/setshowallLink_",
                type: "POST",
                data: JSON.stringify(e),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (c) {
                    call_duration_functions(item.id, e.o.duration_num, e.o.duration_type, e.o.duration_val);
                }
            });
            return false;
        }
    };

    function save_DateBase(elem) {
        var item = $(elem).parents('.firstdiv').data('data');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.id = item.id;
        e.o.date_base = $(elem).parents('.firstdiv').find('#date_base').find("option:selected").val();

        if ((item.visible)) {
            $.ajax({
                url: "SaleReport.aspx/setDateBase_",
                type: "POST",
                data: JSON.stringify(e),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (c) {
                    try {
                        wonsale_datebase = e.o.date_base;
                        GetSaleCount_ForLink();
                        RenderCurrentYearwonLineChart();
                        RenderCurrentmonthwonLineChart();
                    } catch (e) { }
                }
            });
            return false;
        }
    }

    $('.TblQuickLink .icon-times').live('click', function () {
        if (!confirm(DashboardRes.question_delete)) return false;
        var item = $(this).parents('div:first').data('data');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.id = item.id;
        $.ajax({
            type: "POST", url: "SaleReport.aspx/deleteQuickLink_", //hh
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });

        $(this).parents('div:first').remove();
        $('.itemQuickLink:[id=' + item.id + ']').remove();
        return false;
    });
    $('.TblQuickLink .icon-edit').live('click', function () {
        var item = $(this).parents('div:first').data('data');
        $('.fieldListQuickLink').hide();
        $('.fieldNewQuickLink').show();
        dashboard.loadQuickLinkEditor(function () {
            if (item.mode == 1 || item.mode == 2) {
                $('.fieldSelectModeQuickLink').show();
                $('#RadModeQuickLink_' + item.mode).attr('checked', 'checked');
                $('.DivModeQuickLink_1,.DivModeQuickLink_2').hide();
                $('.DivModeQuickLink_' + item.mode).show();
                if (item.mode == 1) {
                    $('#DrdLinkNameQuickLink').val(item.defaultUrl).attr('selected', 'selected');
                    $("#DrdLinkNameQuickLink").multiselect('refresh');
                    $('.itemTestQuickLink a').attr('href', $('#DrdLinkNameQuickLink').val());
                } else {
                    $('#TxtUrlQuickLink').val(item.defaultUrl);
                    $('.itemTestQuickLink a').attr('href', item.defaultUrl);
                }
            } else {
                $('.fieldSelectModeQuickLink').hide();
            }
            $('#TxtTitleQuickLink').val(item.title);
            $('.itemTestQuickLink .quicklink-title').text(item.title);
            $('#DrdFontSizeQuickLink').val(item.font_size).attr('selected', 'selected').msDropDown().data("dd");
            $('#DrdSizeQuickLink').val(item.size).attr('selected', 'selected').msDropDown().data("dd");
            $('.itemTestQuickLink .quicklink-title').css('font-size', item.font_size);
            if (item.color == "") {
                $('#RadColorQuickLink_0').attr('checked', 'checked');
            } else {
                $('#RadColorQuickLink_1').attr('checked', 'checked');
                $('#TxtColorQuickLink').spectrum("enable");
                $('#TxtColorQuickLink').spectrum("set", item.color);
                $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', item.color);
                $('.itemTestQuickLink a').removeClass('th-bgcolor-hover');
                $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', item.color);
            }
            if ($('.iconPlaceQuickLink span:[item=' + item.icon + ']').length == 0) {
                var tempIcon = $(dashboard.getIcons([item.icon])).addClass('temp');
                $('.iconPlaceQuickLink').prepend(tempIcon);
            }
            $('.iconPlaceQuickLink span.selected').removeClass('selected');
            $('.iconPlaceQuickLink span:[item=' + item.icon + ']').addClass('selected');
            $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + item.icon);

            $('.BtnCreateQuickLink').hide();
            $('.BtnEditQuickLink').show().data('data', item);
        });
        return false;
    });

    $('#AddNewQuickLink').click(function () {
        $('.fieldListQuickLink').hide();
        $('.fieldNewQuickLink').show();
        dashboard.loadQuickLinkEditor(function () {
        });
        return false;
    });

    $(".itemQuickLink .dynamicColor").live({
        mouseenter: function () {
            $(this).css('background-color', $(this).attr('color'));
            $(this).find('i').css('color', '#fff');
        },
        mouseleave: function () {
            $(this).css('background-color', '#F7F7F7');
            $(this).find('i').css('color', $(this).attr('color'));
        }
    });

    $('.iconPlaceQuickLink span').live('click', function () {
        $('.iconPlaceQuickLink span.selected').removeClass('selected');
        $(this).addClass('selected');
        $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + $(this).attr('item'));
    });

    $('[name=RadModeQuickLink]').change(function () {
        $('.DivModeQuickLink_1,.DivModeQuickLink_2').hide();
        $('.DivModeQuickLink_' + $(this).val()).show();
        if ($(this).val() == 1) {
            if ($('#DrdLinkNameQuickLink').val() == 0)
                $('.itemTestQuickLink a').attr('href', '#');
            else
                $('.itemTestQuickLink a').attr('href', $('#DrdLinkNameQuickLink').val());
        } else {
            $('.itemTestQuickLink a').attr('href', $('#TxtUrlQuickLink').val());
        }
    });
    $('[name=RadColorQuickLink]').change(function () {
        if ($(this).val() == 0) {
            $('#TxtColorQuickLink').spectrum("disable");
            $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', '');
            $('.itemTestQuickLink a').addClass('th-bgcolor-hover');
            $('.itemTestQuickLink a').removeClass('dynamicColor').removeAttr('color', color);
        }
        else {
            var color = ($('#TxtColorQuickLink').spectrum("get")).toHexString();
            $('#TxtColorQuickLink').spectrum("enable");
            $('.iconPlaceQuickLink i,.itemTestQuickLink i').css('color', color);
            $('.itemTestQuickLink a').removeClass('th-bgcolor-hover');
            $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color);
        }
    });
    $('#TxtTitleQuickLink').keyup(function () {
        $('.itemTestQuickLink .quicklink-title').text($(this).val());
    });
    $('#TxtUrlQuickLink').keyup(function () {
        $('.itemTestQuickLink a').attr('href', $(this).val());
    });
    $('#DrdFontSizeQuickLink').change(function () {
        $('.itemTestQuickLink .quicklink-title').css('font-size', $(this).val());
    });
    $('.BtnCreateQuickLink').click(function () {
        var item = {};
        item.id = dashboard.getRandomInt(100, 100000);
        item.mode = $('[name=RadModeQuickLink]:checked').val();
        item.isDefault = true;
        item.title = $('#TxtTitleQuickLink').val();
        if (item.title == "") return false;
        item.title_res = item.title;
        item.url = (item.mode == 1) ? $('#DrdLinkNameQuickLink').val() : $('#TxtUrlQuickLink').val();
        item.defaultUrl = item.url;
        if (item.mode == 1 && item.url == 0) return false;
        item.icon = $('.iconPlaceQuickLink span.selected').attr('item');
        item.color = ($('[name=RadColorQuickLink]:checked').val() == 0) ? '' : ($('#TxtColorQuickLink').spectrum("get")).toHexString();
        item.order = 0;
        item.font_size = $('#DrdFontSizeQuickLink').val();
        item.size = $('#DrdSizeQuickLink').val();
        dashboard.enableLink(item, true, true);

        $('.fieldListQuickLink').show();
        $('.fieldNewQuickLink').hide();
        dashboard.clearFormQuickLinks();
        $('.TblQuickLink').append(dashboard.geneTblItemQuickLink(item));
        return false;
    });
    $('.BtnEditQuickLink').click(function () {
        var item = $(this).data('data');
        if (item.mode == 1 || item.mode == 2) {
            item.mode = $('[name=RadModeQuickLink]:checked').val();
            item.url = (item.mode == 1) ? $('#DrdLinkNameQuickLink').val() : $('#TxtUrlQuickLink').val();
            if (item.mode == 1 && item.url == 0) return false;
        }

        item.isDefault = true;
        item.title = $('#TxtTitleQuickLink').val();
        if (item.title == "") return false;
        item.title_res = item.title;
        item.icon = $('.iconPlaceQuickLink span.selected').attr('item');
        item.color = ($('[name=RadColorQuickLink]:checked').val() == 0) ? '' : ($('#TxtColorQuickLink').spectrum("get")).toHexString();
        item.font_size = $('#DrdFontSizeQuickLink').val();
        item.size = $('#DrdSizeQuickLink').val();
        dashboard.enableLink(item, true, false);

        $('.fieldListQuickLink').show();
        $('.fieldNewQuickLink').hide();
        dashboard.clearFormQuickLinks();
        var oldItem = $('.TblQuickLink div:[item=' + item.id + ']');
        oldItem.after(dashboard.geneTblItemQuickLink(item));
        oldItem.remove();
        return false;
    });
    $('.BtnListQuickLink').click(function () {
        $('.fieldListQuickLink').show();
        $('.fieldNewQuickLink').hide();
        dashboard.clearFormQuickLinks();
        return false;
    });
});

$(document).bind('click', function (e) {
    if (!$(e.target).hasClass('btnsetting_dashboard')) {
        if ($(e.target).parents('.btnsetting_dashboard').length == 0) {
            $('.MnuSettingDash').hide();
            $('.btnsetting_dashboard').removeClass('selected');
        }
    }
    if (!$(e.target).hasClass('btnuser_dashboard')) {
        if ($(e.target).parents('.btnuser_dashboard').length == 0) {
            $('.MnuUserDash').hide();
            $('.btnuser_dashboard').removeClass('selected');
        }
    }
});

var dashboard_mng = function () {
    /* load block------------*/
    var arrLoadBlock = new Array();
    this.load_block = function (block_num, callback) {
        arrLoadBlock.push([block_num, callback]);
    }
    this.callLoad_block = function (block_num, block) {
        var request = $.grep(arrLoadBlock, function (s) { return s[0] == block_num; });
        if (request.length != 0) request[0][1](block, block.data('data').setting);
    }
    /* setting block---------*/
    var ArrShowSetting = new Array();
    this.showSetting = function (block, callback) {
        var id = block.attr('id');
        ArrShowSetting.push({ id: id, callback: callback });
    }
    this.CallshowSetting = function (id) {
        if (id != "bc5712695fb694b6ea23df64a6b5417c7") {
            var request = $.grep(ArrShowSetting, function (e) { return e.id == id; });
            if (request.length != 0) request[0].callback($('.QuickBlock:[id=' + id + ']').data('data').setting);
        }
    };
    this.setSetting = function (block, setting) {
        block.data('data').setting = setting;
        block.find('.container-block').show();
        block.find('.container-block-setting').hide();
        block.find('.icon-cog').removeClass('selected');
        //thisBlock.find('.icon-shopping-cart').removeClass('selected');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { num: block.attr('id'), setting: setting } };
        $.ajax({
            type: "POST", url: "SaleReport.aspx/setBlockSetting_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
        return false;
    };
    this.setTitle = function (block, title) {
        block.find('.QuickBlock-title').text(title);
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.num = block.attr('id');
        e.o.name = title
        $.ajax({
            type: "POST", url: "SaleReport.aspx/renameBlock_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
        return false;
    };
    this.getSetting = function (block) {
        var id = block.attr('id');
        if (id != "bc5712695fb694b6ea23df64a6b5417c7") {
            return $('.QuickBlock:[id=' + id + ']').data('data').setting;
        }
    };
    this.getStyle = function (block) {
        var id = block.attr('id');
        if (id != "bc5712695fb694b6ea23df64a6b5417c7") {
            return $('.QuickBlock:[id=' + id + ']').data('data').style;
        }
    };
    /* refresh block---------*/
    var ArrRefresh = new Array();
    this.refresh = function (block, callback) {
        var id = block.attr('id');
        ArrRefresh.push({ id: id, callback: callback });
    }
    this.CallRefreshBlock = function (id) {
        var request = $.grep(ArrRefresh, function (e) { return e.id == id; });
        if (request.length != 0) request[0].callback();
    };
    /* comet block---------*/
    //var ArrComet = new Array();
    //this.setComet = function (num, setting, updateChannel) {
    //    if (setting.hasOwnProperty("comet")) {
    //        comet.addListenerChannel(setting.comet, function (c) {
    //            var request = $.grep(ArrComet, function (s) { return s.id == num; });
    //            $.each(request, function (i, item) {
    //                item.callback(c);
    //            });
    //        });
    //        if (updateChannel) {
    //            //comet.updatechannel();
    //        }
    //    }
    //}
    //this.comet = function (block, callback) {
    //    var id = block.attr('id');
    //    var comet_channel = dashboard.getSetting(block).comet;
    //    ArrComet.push({ id: id, comet_channel: comet_channel, callback: callback });
    //};

    /* mask unmask---------*/
    this.mask = function (block) {
        var id = block.attr('id');
        var thisBlock = $('.QuickBlock:[id=' + id + ']');
        thisBlock.find('.QuickBlock-overlay').fadeIn();
    }
    this.unmask = function (block) {
        var id = block.attr('id');
        var thisBlock = $('.QuickBlock:[id=' + id + ']');
        thisBlock.find('.QuickBlock-overlay').fadeOut();
    }
    /* resize block---------*/
    var arrResize = new Array();
    this.resize = function (block, callback) {
        var id = block.attr('id');
        arrResize.push({ id: id, callback: callback });
    }
    this.getSize = function (block) {
        return { width: block.width(), height: block.height() };
    }
    this.callResize = function (id) {
        if (id != "bc5712695fb694b6ea23df64a6b5417c7") {
            var block = $('.QuickBlock:[id=' + id + ']');
            block.data('data').style.height = block.height() + 'px';
            var request = $.grep(arrResize, function (e) { return e.id == id; });
            if (request.length != 0) request[0].callback(block.width(), block.height());
        }
    }
    //------------------------------------------
    var icons_ = ['icon-globe', 'icon-upload', 'icon-ivr-user', 'icon-dollar',
                  'icon-shopping-cart', 'icon-cog', 'icon-external-link', 'icon-male',
                  'icon-search', 'icon-comment', 'icon-reminder', 'icon-event',
                  'icon-workflow', 'icon-edit', 'icon-tag', 'icon-link',
                  'icon-activity', 'icon-task', 'icon-folder-close', 'icon-support',
                  'icon-inbox', 'icon-sms', 'icon-star', 'icon-book',
                  'icon-bell', 'icon-task', 'icon-home', 'icon-mobile-phone',
                  'icon-file-text', 'icon-user', 'icon-refresh', 'icon-phone',
                  'icon-bar-chart', 'icon-envelope-alt'];
    this.icons = icons_;
    this.getIcons = function (icon_list) {
        var result = '';
        $.each(icon_list, function (i, icon) {
            result += '<span item="' + icon + '"><i class="' + icon + ' th-color"></i></span>';
        });
        return result;
    };
    //------------------------------------------
    this.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    this.clearFormQuickLinks = function () {
        $('#RadModeQuickLink_1').attr('checked');
        $('#DrdLinkNameQuickLink option:first').attr('selected', 'selected');
        $("#DrdLinkNameQuickLink").multiselect('refresh');
        $('.DivModeQuickLink_1').show();
        $('.DivModeQuickLink_0').hide();
        $('#DrdFontSizeQuickLink').val('16pt').attr('selected', 'selected').msDropDown().data("dd");
        $('#DrdSizeQuickLink').val('2').attr('selected', 'selected').msDropDown().data("dd");
        $('#TxtTitleQuickLink').val('');
        $('#TxtUrlQuickLink').val('http://');
        $('#RadColorQuickLink_0').attr('checked', 'checked');
        $('#TxtColorQuickLink').spectrum("disable");
        $('.iconPlaceQuickLink span.selected').removeClass('selected');
        $('.iconPlaceQuickLink span:first').addClass('selected');
        $('.iconPlaceQuickLink i').css('color', '');
        $('.itemTestQuickLink i').removeAttr('class').addClass('left_right th-color ' + $('.iconPlaceQuickLink span:first').attr('item')).css('color', '');
        $('.itemTestQuickLink .quicklink-title').text('').css('font-size', '16pt');
        $('.itemTestQuickLink a').attr('href', '#').addClass('th-bgcolor-hover').removeClass('dynamicColor').removeAttr('color', color);
        $('.iconPlaceQuickLink span.temp').remove();
        $('#TxtColorQuickLink').spectrum("set", '#2E2C2C');
        $('.BtnCreateQuickLink').show();
        $('.BtnEditQuickLink').hide();
    }
    this.loadQuickLinkEditor = function (callback) {
        if ($('.fieldNewQuickLink').attr('loaded')) {
            dashboard.clearFormQuickLinks();
            callback();
        }
        else {
            $('.fieldNewQuickLink').attr('loaded', true);
            $('.fieldNewQuickLink').mask('...');
            var arrScripts = new Array();
            arrScripts.push('../Themes/resources/scripts/jquery.multiselect.js');
            arrScripts.push('../Themes/resources/scripts/spectrum.js');

            if ($('#CssMultiselect').length == 0) $('head').append('<link id="CssMultiselect" href="../Themes/resources/css/jquery.multiselect.css" rel="stylesheet" type="text/css" />');
            if ($('#CssColorPicker').length == 0) $('head').append('<link id="CssColorPicker" href="../Themes/resources/css/spectrum.css" rel="stylesheet" type="text/css" />');
            dashboard.getScripts(arrScripts, function () {

                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                $.ajax({
                    type: "POST", url: "SaleReport.aspx/getDefaultPage_",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        $.each(c.d[1], function (i, item) {
                            $("#DrdLinkNameQuickLink").append('<option value="' + item.Value + '">' + item.Text + '</option>');
                        });

                        $("#DrdLinkNameQuickLink").multiselect({
                            click: function (event, ui) {
                                if (ui.value == 0) {
                                    $('.itemTestQuickLink a').attr('href', '#');
                                    $('.itemTestQuickLink .quicklink-title').text('');
                                    $('#TxtTitleQuickLink').val('');
                                } else {
                                    $('.itemTestQuickLink a').attr('href', ui.value + "&rnd_=" + $('#HFRnd').val());
                                    $('.itemTestQuickLink .quicklink-title').text(ui.text);
                                    $('#TxtTitleQuickLink').val(ui.text);
                                }
                            },
                            multiple: false,
                            selectedList: 1,
                            classes: 'right_left',
                            noneSelectedText: 'select'
                        }).multiselectfilter({ placeholder: DashboardRes.title, width: '147', label: DashboardRes.search });

                        callback();
                        $('.fieldNewQuickLink').unmask();
                    }
                });

                $('#TxtColorQuickLink').spectrum({
                    cancelText: DashboardRes.cancel, chooseText: DashboardRes.select, color: "#2E2C2C",
                    showInput: true, showInitial: true, preferredFormat: "hex6", clickoutFiresChange: true, showPalette: true,
                    move: function (color) {
                        $('.iconPlaceQuickLink i,.itemTestQuickLink i').css({ 'color': color.toHexString() });
                        $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color.toHexString());
                    },
                    change: function (color) {
                        $('.iconPlaceQuickLink i,.itemTestQuickLink i').css({ 'color': color.toHexString() });
                        $('.itemTestQuickLink a').addClass('dynamicColor').attr('color', color.toHexString());
                    }
                });

                $('.iconPlaceQuickLink').html(dashboard.getIcons(dashboard.icons));
                $('.iconPlaceQuickLink span:first').addClass('selected');
                $('.itemTestQuickLink i').addClass($('.iconPlaceQuickLink span:first').attr('item'));

            });
        }
    };
   
    this.enableLink = function (item, visible, setOrder) {
        if (visible) {
            //if (setOrder) {
            //    var maxOrder = 0;
            //    $('.quicklink-container .itemQuickLink').each(function (i, item) {
            //        if (parseInt($(item).attr('order')) > maxOrder) maxOrder = parseInt($(item).attr('order'));
            //    });
            //    item.order = maxOrder + 1;
            //}
            //var checkExists = $('.itemQuickLink:[id=' + item.id + ']');
            //if (checkExists.length == 0) {
            //    $('.quicklink-container').append(dashboard.geneQuickLinks(item));
            //} else {
            //    checkExists.after(dashboard.geneQuickLinks(item));
            //    checkExists.remove();
            //}
            $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').css('display', '');
        } else {
            $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').css('display', 'none')
        }
        item.url = item.defaultUrl;
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: item };
        e.o.visible = visible;

        $.ajax({
            type: "POST", url: "SaleReport.aspx/enableLink_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
        return false;
    }

    var arrBlockStr = new Array();
    this.getBlockStr = function (id, filename, mode, callback) {
        var checkExists = $.grep(arrBlockStr, function (s) { return s[0] == id });
        if (checkExists.length != 0) { setTimeout(function () { callback(checkExists[0][1]); }, 500); return false; }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.rnd_ = $('#HFRnd').val();
        e.o.filename = filename;
        e.o.mode = mode;
        $.ajax({
            type: "POST", url: "SaleReport.aspx/getBlockDetail_",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                arrBlockStr.push([id, c.d[1]]);
                setTimeout(function () { callback(c.d[1]); }, 500);
            }
        });
    }
    this.geneQuickBlockContent = function (item, str) {

        str = str.replace(/#block#/gi, item.num);

        var block = $('.QuickBlock:[id=' + item.num + ']');
        var contentBlock = $('.QuickBlock:[id=' + item.num + '] .QuickBlock-content');
        contentBlock.find('.QuickBlock-overlay').hide();
        contentBlock.prepend(str);
        contentBlock.find('input:submit').button();
        contentBlock.find('.mydds').msDropDown().data("dd");

        contentBlock.find('.container-block').removeClass('ravesh-scrollbar').addClass('ravesh-scrollbar');

        dashboard.callLoad_block(item.num, block);
    }

    //sakhtan link ha 
    this.geneTblItemQuickLink = function (item) {
        var Exists = $('.quicklink-container .itemQuickLink:[id=' + item.id + ']').css('display') != 'none';

        //-------------------------------------------------------------

        var dur_string = '';
        if (item.id == 1 || item.id == 4 || item.id == 5)
            dur_string = '<div style="display:inline-block; width: 35px"><input id="dur_num" max="31" min="1" value="1" type="number" onkeyup="handleChange(this);" style="width: 30px; padding: 0px; margin-top: 4px; font-size:12px;"></div>' +
                         '<div style="display:inline-block; width: 75px; margin-right: 5px"><select id="dur_type" style="width:75px; font-size: 12px; margin-top: 5px">' +
                         '<option value="0"></option>' +
                         '<option value="1">' + DashboardRes.cap_year + '</option>' +
                         '<option value="2">' + DashboardRes.cap_month + '</option>' +
                         '<option value="3">' + DashboardRes.cap_week + '</option>' +
                         '<option value="4">' + DashboardRes.cap_day + '</option>' +
                         '</select></div>' +
                         '<div style="display:inline-block; width: 50px; margin-right: 5px"><select id="dur_val" style="width:60px; font-size: 12px; margin-top: 5px">' +
                         '<option value="1">' + DashboardRes.cap_curent + '</option>' +
                         '<option value="2">' + DashboardRes.cap_current + '</option>' +
                         '</select></div>' +
                         '</div>'

        if (item.id == 10) dur_string = '<select id="date_base" style="width:110px; font-size: 12px; margin-top: 5px">' +
                                        '<option value="1">' + DashboardRes.cap_date_create + ' ' + DashboardRes.cap_sell + '</option>' +
                                        '<option value="2">' + DashboardRes.cap_date_final + ' ' + DashboardRes.cap_sell + '</option>' +
                                        '</select>';
        
        item.defaultUrl = item.url;
        item.url = item.url.replace('#rnd#', $('#HFRnd').val());
        return $('<div class="firstdiv" item="' + item.id + '">' +
                       '<i class="' + item.icon + ' right_left th-color" style="margin:0 5px;"></i>' +
                       '<a ' + ((item.mode == 2) ? 'target="_blank"' : '') + ' href="' + item.url + '" style="color:#696969;font-size:9pt">' + item.title + '</a>' +
                       '<i id="manualcheck" class="' + (Exists ? 'icon-check' : 'icon-check-empty') + ' left_right cursor" style="margin:0 50px;color:#444;'+ (item.id == 10 ? 'display:none' : '') +'"></i>' +
                       '<div class="left_right" style="width:' + (item.id == 10 ? '255px' : '175px') + ';height:30px">' +
                       dur_string +
                  '</div>').data('data', item);
    };

    this.geneTblItemQuickBlock = function (item) {
        var result = $('<div class="manage-block-item">' +
                         '<div class="block-title" title="' + item.title + '">' + item.title + '</div>' +
                         '<div class="block-detail th-bgcolor">' + (resources.lang == "fa" ? item.detail_fa : item.detail_en) + '</div>' +
                         '<div class="block-icon block-icon-' + resources.direction + '"><i class="fas ' + item.icon + '"></i></div>' +
                         (item.isNew ? '<div class="block-noti-new animated infinite pulse">' + DashboardRes.cap_new + '</div>' : '') +
                       '</div>').data('data', item);
        return result;
    };

    this.geneQuickLinks = function (item) {
        var url = item.url;
        url = url.replace('#rnd#', $('#HFRnd').val());
        return '<li id="' + item.id + '" title="' + item.title + '" mode="' + item.mode + '" order="' + item.order + '" class="col-QuickLink' + item.size + ' right_left itemQuickLink">' +
                    '<a ' + ((item.mode == 2) ? 'target="_blank"' : '') + ' href="' + url + '" ' + ((item.color == "") ? 'class="th-bgcolor-hover"' : 'class="dynamicColor" color="' + item.color + '"') + '>' +
                        '<i class="' + item.icon + ' left_right th-color" ' + ((item.color == "") ? '' : 'style="color:' + item.color + '"') + '></i>' +
                        '<span class="quicklink-title" style="font-size:' + item.font_size + '">' + item.title + '</span>' +
                        '<span class="quicklink-detail"></span>' +
                    '</a>' +
                '</li>';
    }
    this.geneQuickBlocks = function (item) {
        var disabled = item.id == "salelist" ? 'disable' : ''
        var result = $('<div class="QuickBlock" id="' + item.num + '" item="' + item.id + '">' +
                    '<div class="QuickBlock-head ' + disabled + '">' +
                        '<div class="QuickBlock-head-icon">' +
                            '<i class="icon-times"></i>' +
                            '<i class="icon-minus" ' + (item.isExpand ? '' : 'style="display:none"') + '></i>' +
                            '<i class="icon-plus" ' + (item.isExpand ? 'style="display:none"' : '') + ' ></i>' +
                            (item.ctlSetting ? '<i class="icon-cog"></i>' : '') +   //' + (item.id == "salelist" ? 'icon-shopping-cart' : '
                            (item.ctlRefresh ? '<i class="icon-refresh"></i>' : '') +
                        '</div>' +
                        '<i class="QuickBlock-icon ' + item.icon + ' th-color"></i>' +
                        '<div class="QuickBlock-title">' + item.title + '</div>' +
                    '</div>' +
                    '<div class="QuickBlock-content" style="' + (item.isExpand ? '' : 'display:none;') + ((item.style.hasOwnProperty('height')) ? 'height:' + item.style.height + ';' : '') + '">' +
                        '<div class="QuickBlock-overlay"><div style="margin-top: 100px;"><img src="../Themes/resources/images/Ballsline.gif"></div></div>' +
                    '</div>' +
               '</div>').data('data', item)

        result.find('.QuickBlock-content').resizable({
            grid: [10000, 1],
            minHeight: 150,
            maxHeight: 600,
            stop: function (event, ui) {

                result.find('.QuickBlock-content').css('width', 'auto');

                dashboard.callResize(item.num);

                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.height = ui.size.height;
                e.o.num = item.num;
                $.ajax({
                    type: "POST", url: "SaleReport.aspx/setBlockHeight_",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) { }
                });

            }
        });

        return result;
    }

    this.getScripts = function (urls, callback) {
        if (!$.isArray(urls)) {
            urls = [urls];
        }
        var url = "";
        var i = 0;
        var FnGetScript = function (urls) {
            if (urls.length == 1) {
                url = urls[i];
            } else {
                url = urls[i];
                i++;
                if (i > urls.length) { callback(); return false };
            }
            $.getScript(url, function () {
                if (i == 0)
                    callback();
                else {
                    FnGetScript(urls);
                }
            });
        }
        FnGetScript(urls);
    };
};

var dashboard = new dashboard_mng();


//Product & Store ===========================================================================================

var Client = new GetJsonData;
function GetJsonData() {
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllSalesUrl = "../WebServices/Sale_.asmx/Sale_getAllSales";
    this.Sale_getAllSaleStateUrl = "../WebServices/Sale_.asmx/Sale_getAllSaleStatewithSale";
    this.Sale_getAllSettingUrl = "../WebServices/Store_.asmx/store_getAllSetting";
    this.Sale_getAllNavigationPropertisUrl = "../WebServices/Sale_.asmx/Sale_getNavigationPropertis_";
    this.Sale_DeleteSaleUrl = "../WebServices/Sale_.asmx/Sale_DeleteSale";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllLeadsourceType = "../WebServices/Sale_.asmx/Sale_getAllLeadsourceType";
    this.Sale_InsertLeadsourceTypeUrl = "../WebServices/Sale_.asmx/Sale_InsertLeadsourceType";
    this.Sale_UpdateLeadsourceTypeUrl = "../WebServices/Sale_.asmx/Sale_UpdateLeadsourceType";
    this.Sale_DeleteLeadsourceTypeUrl = "../WebServices/Sale_.asmx/Sale_DeleteLeadsourceType";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllExtendedPropertisUrl = "../WebServices/Sale_.asmx/Sale_getAllExtendedPropertis";
    this.Sale_InsertExtendedPropertisUrl = "../WebServices/Sale_.asmx/Sale_InsertExtendedPropertis";
    this.Sale_UpdateExtendedPropertisUrl = "../WebServices/Sale_.asmx/Sale_UpdateExtendedPropertis";
    this.Sale_DeleteExtendedPropertisUrl = "../WebServices/Sale_.asmx/Sale_DeleteExtendedPropertis";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllSaleState = "../WebServices/Sale_.asmx/Sale_getAllSaleState";
    this.Sale_InsertSaleStateUrl = "../WebServices/Sale_.asmx/Sale_InsertSaleState";
    this.Sale_UpdateSaleStateUrl = "../WebServices/Sale_.asmx/Sale_UpdateSaleState";
    this.Sale_DeleteSaleStateUrl = "../WebServices/Sale_.asmx/Sale_DeleteSaleState";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllLeadGeneration = "../WebServices/Sale_.asmx/Sale_getAllLeadGeneration";
    this.Sale_InsertLeadGenerationUrl = "../WebServices/Sale_.asmx/Sale_InsertLeadGeneration";
    this.Sale_UpdateLeadGenerationUrl = "../WebServices/Sale_.asmx/Sale_UpdateLeadGeneration";
    this.Sale_DeleteLeadGenerationUrl = "../WebServices/Sale_.asmx/Sale_DeleteLeadGeneration";
    this.Sale_UpdateApprovementUrl = "../WebServices/Sale_.asmx/Sale_UpdateApprovement";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllSaleProcessUrl = "../WebServices/Sale_.asmx/Sale_getAllSaleProcess";
    this.Sale_InsertSaleProcessUrl = "../WebServices/Sale_.asmx/Sale_InsertSaleProcess";
    this.Sale_UpdateSaleProcessUrl = "../WebServices/Sale_.asmx/Sale_UpdateSaleProcess";
    this.Sale_DeleteSaleProcessUrl = "../WebServices/Sale_.asmx/Sale_DeleteSaleProcess";
    this.Sale_getSaleProcesswithSalestateUrl = "../WebServices/Sale_.asmx/Sale_getAllSaleProcesswithSalestate";
    this.Sale_getwfSalestateUrl = "../WebServices/Sale_.asmx/Sale_getwfSalestate";
    //----------------------------------------------------------------------------------------------
    this.get_productsUrl = "../WebServices/Store_.asmx/store_getProduct";
    this.get_MojodiUrl = "../WebServices/Store_.asmx/store_getMojodi";
    //----------------------------------------------------------------------------------------------
    this.sale_getProductDrdUrl = "../WebServices/Store_.asmx/store_getProductDrd";
    //----------------------------------------------------------------------------------------------
    this.Sale_getAllTarget = "../WebServices/Sale_.asmx/Sale_getAllTarget";
    this.Sale_InsertTargetUrl = "../WebServices/Sale_.asmx/Sale_InsertTarget";
    this.Sale_UpdateTargetUrl = "../WebServices/Sale_.asmx/Sale_UpdateTarget";
    this.Sale_DeleteTargetUrl = "../WebServices/Sale_.asmx/Sale_DeleteTarget";
    //---------------------------------------------------------------------------------------------


    this.getAllSales = function (c, e) {
        this.POST(this.Sale_getAllSalesUrl, c, e)
    };
    this.getAllSaleStateForChange = function (c, e) {
        this.POST(this.Sale_getAllSaleStateUrl, c, e)
    };
    this.getAllSetting = function (c, e) {
        this.POST(this.Sale_getAllSettingUrl, c, e)
    };
    this.getAllNavigationPropertis = function (c, e) {
        this.POST(this.Sale_getAllNavigationPropertisUrl, c, e)
    };
    this.DeleteSale = function (c, e) {
        this.POST(this.Sale_DeleteSaleUrl, c, e)
    };

    //----------------------------------------------------------------------------------------------

    this.getAllLeadsourceType = function (c, e) {
        this.POST(this.Sale_getAllLeadsourceType, c, e)
    };
    this.InsertLeadsourceType = function (c, e) {
        this.POST(this.Sale_InsertLeadsourceTypeUrl, c, e)
    };
    this.UpdateLeadsourceType = function (c, e) {
        this.POST(this.Sale_UpdateLeadsourceTypeUrl, c, e)
    };
    this.DeleteLeadsourceType = function (c, e) {
        this.POST(this.Sale_DeleteLeadsourceTypeUrl, c, e)
    };

    //----------------------------------------------------

    this.getAllExtendedPropertis = function (c, e) {
        this.POST(this.Sale_getAllExtendedPropertisUrl, c, e)
    };
    this.InsertExtendedPropertis = function (c, e) {
        this.POST(this.Sale_InsertExtendedPropertisUrl, c, e)
    };
    this.UpdateExtendedPropertis = function (c, e) {
        this.POST(this.Sale_UpdateExtendedPropertisUrl, c, e)
    };
    this.DeleteExtendedPropertis = function (c, e) {
        this.POST(this.Sale_DeleteExtendedPropertisUrl, c, e)
    };

    //-------------------------------------------------------

    this.getAllSaleState = function (c, e) {
        this.POST(this.Sale_getAllSaleState, c, e)
    };
    this.InsertSaleState = function (c, e) {
        this.POST(this.Sale_InsertSaleStateUrl, c, e)
    };
    this.UpdateSaleState = function (c, e) {
        this.POST(this.Sale_UpdateSaleStateUrl, c, e)
    };
    this.DeleteSaleState = function (c, e) {
        this.POST(this.Sale_DeleteSaleStateUrl, c, e)
    };

    //----------------------------------------------------

    this.getAllLeadGeneration = function (c, e) {
        this.POST(this.Sale_getAllLeadGeneration, c, e)
    };
    this.InsertLeadGeneration = function (c, e) {
        this.POST(this.Sale_InsertLeadGenerationUrl, c, e)
    };
    this.UpdateLeadGeneration = function (c, e) {
        this.POST(this.Sale_UpdateLeadGenerationUrl, c, e)
    };
    this.DeleteLeadGeneration = function (c, e) {
        this.POST(this.Sale_DeleteLeadGenerationUrl, c, e)
    };
    this.UpdateApprovement = function (c, e) {
        this.POST(this.Sale_UpdateApprovementUrl, c, e)
    };

    //----------------------------------------------------

    this.getAllSaleProcess = function (c, e) {
        this.POST(this.Sale_getAllSaleProcessUrl, c, e)
    };
    this.InsertSaleProcess = function (c, e) {
        this.POST(this.Sale_InsertSaleProcessUrl, c, e)
    };
    this.UpdateSaleProcess = function (c, e) {
        this.POST(this.Sale_UpdateSaleProcessUrl, c, e)
    };
    this.DeleteSaleProcess = function (c, e) {
        this.POST(this.Sale_DeleteSaleProcessUrl, c, e)
    };
    this.getSaleProcesswithSalestate = function (c, e) {
        this.POST(this.Sale_getSaleProcesswithSalestateUrl, c, e)
    };
    this.getwfSalestate = function (c, e) {
        this.POST(this.Sale_getwfSalestateUrl, c, e)
    };

    //----------------------------------------------------

    this.get_products = function (c, e) {
        this.POST(this.get_productsUrl, c, e)
    };
    this.get_Mojodi = function (c, e) {
        this.POST(this.get_MojodiUrl, c, e)
    };

    //----------------------------------------------------

    this.getProductDrd = function (c, e) {
        this.POST(this.sale_getProductDrdUrl, c, e)
    };

    //----------------------------------------------------------------------------------------------

    this.getAllTarget = function (c, e) {
        this.POST(this.Sale_getAllTarget, c, e)
    };
    this.InsertTarget = function (c, e) {
        this.POST(this.Sale_InsertTargetUrl, c, e)
    };
    this.UpdateTarget = function (c, e) {
        this.POST(this.Sale_UpdateTargetUrl, c, e)
    };
    this.DeleteTarget = function (c, e) {
        this.POST(this.Sale_DeleteTargetUrl, c, e)
    };

    //----------------------------------------------------

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
jQuery.extend({
    get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
    put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
    post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
    delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
});

function call_duration_functions(id, du_num, du_type, du_val) {
    switch (id) {
        case "1":
            duration_salecurrent_num = du_num;
            duration_salecurrent_type = du_type;
            duration_salecurrent_val = du_val;
            RenderCurrentSales();
            break;
        case "4":
            duration_salecount_num = du_num;
            duration_salecount_type = du_type;
            duration_salecount_val = du_val;
            GetSaleCount_ForLink();
            break;
        case "5":
            duration_salepercent_num = du_num;
            duration_salepercent_type = du_type;
            duration_salepercent_val = du_val;
            GetAllSalePercent();
            break;
        default: break;
    };
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
    //$('#TxtProductName').hide();
    $(".mydds").msDropDown().data("dd");
}

var ItemCode = 0;
function ReciveProductDetail(idprice) { //get property product
    var idproduct = $('#DrdProductItem').find("option:selected").val();
    if (idproduct != 0) {

        var data = GetProductDetail(idproduct);
        ItemCode = data.codeproduct;

        $('#TxtProductName').fadeIn();
        $('#DrdOtpriceItem,#DrdOtpriceproperty').empty();
        $.each(data.otPrices, function (val, text) {
            if (text.Enabled != false)
                $('#DrdOtpriceItem').append($('<option></option>').val(text.value).html(text.text).attr('price', text.price));
            else {
                if (idprice == text.value)
                    $('#DrdOtpriceItem').append($('<option disabled></option>').val(text.value).html(text.text).attr('price', text.price));
            }
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
            $('#HFidGroup_Sale').val(data.idgroup);
            $('#HFnameGroup_Sale').val(data.name);
            var price = $('#DrdOtpriceItem').find("option:selected").attr('price');
            if (price != "" && price != null && price != undefined) {
                if (resources.lang == "fa")
                    price = GetCurrency(price);
                $('#TxtPrice_sItem').val(price);
            }
            //$('#TxtPrice_sItem').val($('#DrdOtpriceItem').find("option:first").attr('price'));
            getMojodi(idproduct);
        }
        $(".mydds").msDropDown().data("dd");
    }
    else {
        clearDialog();
        $('#TxtProductName').fadeOut();
    }
}

var DbDocItem = new Array();
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
        mojodiclient = mojodiclient - parseFloat((STblItem != null) ? STblItem.count : 0);
    }
    if ($('#HFFactorType').val() == 3) mojodiclient = mojodiclient * -1;// Agar Factor Forosh Bood az mojodi kam shavad -> * -1
    if ($('#HFFactorType').val() == 2)
        if (nUnd(AllSetting.PreFactor) == 'true') mojodiclient = mojodiclient * -1; //pish factor forosh bood va dar tanzimate pish factor barabar ba hesab shavad bood .kam shavad
        else mojodiclient = 0;  //dar gheyre in sorat hesab nashavad

    getMojodiST(idStore, idproduct, domain, UserID, mojodiclient);
    //get mojodi db + clientTbl if click edititem mojodiClient - Count Edited Row
}

function getMojodiClient(idStore, idproduct) {
    var result = 0;
    $('#tblDocItem tr').each(function (i, row) {
        if (i != 0) {
            var myObject = $(row).find('#HidRowData').val();
            var data = eval('(' + myObject + ')');
            if (data.idproduct == idproduct && data.idStore == idStore) {
                result += parseFloat(data.count);
            }
        }
    });
    return result;
};

function handleChange(input) {
    if (input.value != "") {
        if (input.value < 1) input.value = 1;
        if (input.value > 31) input.value = 31;
    }
    else
        input.value = 1; 
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
};

function BtnAddItem() { //add
    if (!validData_DialogDoc()) return false;
    $("#dialog_docItem").dialog("close");
    AddItem('#tblDocItem tr:last', 'tblrow' + $('#tblDocItem tr').length); //add to last tr
    $('#DrdProductItem option:first').attr('selected', "selected");
    $("#DrdProductItem").multiselect('refresh');
    clearDialog();
};

function BtnAddItemcontinue() { //add continu
    if (!validData_DialogDoc()) return false;
    AddItem('#tblDocItem tr:last', 'tblrow' + $('#tblDocItem tr').length);
    $('#DrdProductItem option:first').attr('selected', "selected");
    $("#DrdProductItem").multiselect('refresh');
    clearDialog();

};

function CancelDialog() { //cancel
    $("#dialog_docItem").dialog("close");
    $('#DrdProductItem option:first').attr('selected', "selected");
    $("#DrdProductItem").multiselect('refresh');
    clearDialog();
    STblItem = null;
}

function LoadSettingControl(Controlnme) {
    $('#dialog_DivLoadFroms').empty();
    var e = { n: Controlnme, u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), d: $('#HFdomain').val(), p: '', m: '~/controls/Sale/', r: $('#HFRnd').val() };
    $.ajax({
        type: "POST", url: "Load_UserControl.aspx/Load_Control", contentType: "application/json; charset=utf-8", dataType: "json",
        data: JSON.stringify(e), success: function (c) {
            $('#dialog_DivLoadFroms').html(c.d[1]);
        }
    });
    $("#dialog_DivLoadFroms").dialog("open");
};

function RefreshDoc() {
    if ($('#tblDocItem tr').length <= 1) $('.divTableWf').hide(); else $('.divTableWf').show(); //Change Display tblDocItem By RowCount
    BuildTblItemStyle(); //Build tblDocItem Color Alternate Rows
    GetCountAndPrice_Sale();  //get PriceKol And Get Count Product 
}

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
};

function GetCountAndPrice_Sale() { // mohasebeye gheymat kol va tedad kala darj shode dar tblItemDoc
    var price = 0;
    var count = 0;

    $('#tblDocItem tr').each(function (i, row) {
        if (i != 0) {
            var myObject = $(row).find('#HidRowData').val();
            var data = eval('(' + myObject + ')');
            count += data.count;
            price += data.count * parseFloat(data.price_s);
        }
    });

    var result = {};
    result.count = count;
    result.price = price;
    $('#TxtSaleAmountApproximate').val(GetCurrencyForSale(result.price)); //GetCurrencyAndUnit(
    return result;
};

function GetCurrencyForSale(InputMoney) { //sample input 100000 --> 100,000
    if (InputMoney != undefined && InputMoney != null) {
        var digit = "";
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
    }
    else
        return "";
}

function GetCurrencyAndUnit(InputMoney) { //sample input 100000 --> 100,000 toman
    if (InputMoney != undefined && InputMoney != null) {
        var digit = "";
        if (InputMoney.toString().indexOf(".") > -1) {
            digit = InputMoney.toString().substr(InputMoney.toString().indexOf("."), InputMoney.length);
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

//===================================================================================================