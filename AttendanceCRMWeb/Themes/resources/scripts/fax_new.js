
var EditorInvoice;
$(document).ready(function () {

    $('.invoice-container-margin').disableSelection();

    $('.invoice-mnu-btn-back i,.invoice-search-btn-back i').addClass('icon-edge-' + (resources.direction == 'ltr' ? 'l' : 'r'));
    $('.invoice-item-btn-prev,.invoice-list-btn-prev').addClass('icon-chevron-' + (resources.direction == 'ltr' ? 'left' : 'right'));
    $('.invoice-item-btn-next,.invoice-list-btn-next').addClass('icon-chevron-' + (resources.direction == 'ltr' ? 'right' : 'left'));

    var generateStatusLabel = function (status, statusStr, serverid) {
        var errStatus = [1, 2, 3, 13];
        return '<span class="state-' + status + '">' + statusStr + (errStatus.indexOf(parseInt(status)) == -1 ? '' : '<i class="icon-repeat right_left invoice-list-item-retry" serverid="' + serverid + '" title="' + invoiceRes.cap_retry + '"></i>') + '</span>'
    }

    addSocketEventListener("CallerId", function (data) {
        if (data.Action == "faxs") {
            if (data.Mode == "new") {
                get_list(1, listSize, 1, 0, 0, 0, '', false);
            } else if (data.Mode == "new_cust") {
                $('.invoice-list-item .invoice-list-title:[tel=' + data.Item[0] + ']').html(data.Item[2]).attr('cust_code', data.Item[1]);
                $('.invoice-list-item .invoice-list-customer:[tel=' + data.Item[0] + ']').after('<a class="left_right invoice-list-customer" title="' + data.Item[0] + '" onclick="customer_Show_Info(' + data.Item[1] + ',\'' + data.Item[2] + '\');return false;"><i class="fas icon-user"></i></a>');
                $('.invoice-list-item .invoice-list-customer:[tel=' + data.Item[0] + ']').remove();
            } else if (data.Mode == "viewed") {
                $('.invoice-list-item:[item=' + data.Item[0] + ']').addClass('viewed');
                get_menucount();
            } else {
                $('.invoice-list-item:[item=' + data.Mode + '] .invoice-list-result-tag').html(generateStatusLabel(data.Item[0], data.Item[1], data.Item[2])).hide().fadeIn();
            }
        }

    });


            


    var showInvoiceMessage = function (message) {
        $('.invoice-msg').html(message).hide().fadeIn();
        setTimeout(function () {
            $('.invoice-msg').fadeOut();
        }, 3500);
    };

    var get_menucount = function () {
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.inbox = $('#HFInbox').val();
        $.ajax({
            type: "POST", url: "fax_new.aspx/get_menucount",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                if (c.d[0] == "success") {
                    $.each(c.d[1], function (i, item) {
                        var mnuItem = $('.invoice-menu-ul li:[item=' + i + ']')
                        mnuItem.attr('title', item + " " + invoiceRes.cap_number);
                        if (i == "inbox") {
                            mnuItem.find('.menu-count').show().text(c.d[1].inbox_new);
                            if (c.d[1].inbox_new <= 0) mnuItem.find('.menu-count').hide();
                        }
                    });
                }
            }
        });
    };

    /*folder*/

    $("#DlgInvoiceFolder").dialog({
        autoOpen: false,
        modal: true,
        width: 300,
        height: 410,
        open: function () {
            openDialog($(this));
        },
        resizable: false,
        hide: { effect: 'drop', direction: 'up', duration: 400 }
    });

    var generateInvoiceFolderItem = function (item) {
        return $('<div class="invoice-folder-list-item" id="invoice_folder_' + item.id + '" item="' + item.id + '">' +
                     '<i class="icon-ellipsis-vertical right_left"></i>' +
                     '<span class="subject right_left cursor">' + item.name + '</span>' +
                     '<i class="icon-times left_right" title="' + invoiceRes.cap_delete + '"></i>' +
                 '</div>').data('item', item);
    };
    var reloadMenuFolder = function () {
        var selectedItem = $('.invoice-menu-folder li.select').attr('item');
        $('.invoice-menu-folder').empty();
        $('.invoice-folder-list .invoice-folder-list-item').each(function (i, item) {
            $('.invoice-menu-folder').append('<li item="' + $(item).attr('item') + '"><i class="icon-folder-open"></i><span class="menu-title">' + $(item).find('.subject').text() + '</span></li>');
        });
        if (selectedItem) $('.invoice-menu-folder li:[item=' + selectedItem + ']').addClass('select');
    };

    $('.invoice-group-subject i').click(function () {
        $("#DlgInvoiceFolder").dialog('open');
        if (!$('.invoice-folder-list').attr('loaded')) {
            $('.invoice-folder-list').attr('loaded', true);
            $('.invoice-folder-list .wait').show();
            var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
            e.o.inbox = $('#HFInbox').val();
            $.ajax({
                type: "POST", url: "fax_new.aspx/list_folder",
                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                success: function (c) {
                    $('.invoice-folder-list .wait').hide();
                    if (c.d[0] == "success") {
                        $.each(c.d[1], function (i, item) {
                            $('.invoice-folder-list').append(generateInvoiceFolderItem(item));
                        });
                    }
                }
            });
        }
        return false;
    });

    $('.invoice-folder-btn-add').click(function () {
        var TxtName = $('.invoice-folder-tool input:[type=text]');
        if (TxtName.val() == "") return false;
        $('.invoice-folder-list .wait').show();
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.name = TxtName.val();
        e.o.inbox = $('#HFInbox').val();
        $.ajax({
            type: "POST", url: "fax_new.aspx/save_folder",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-folder-list .wait').hide();
                if (c.d[0] == "success") {
                    TxtName.val('');
                    var itemFolder = generateInvoiceFolderItem({ id: c.d[1], name: e.o.name });
                    $('.invoice-folder-list .wait').after(itemFolder);
                    itemFolder.animate({ 'background-color': '#D2FFC7' }, 200, function () { itemFolder.delay(500).animate({ 'background-color': '#fefefe' }, 800); });
                    reloadMenuFolder();
                }
            }
        });
        return false;
    });
    $(".invoice-folder-tool input:[type=text]").keyup(function (event) {
        if (event.keyCode == 13) {
            $('.invoice-folder-btn-add').click();
        }
    });
    $(".invoice-folder-list-item .icon-times").live('click', function () {
        var itemFolder = $(this).parents('.invoice-folder-list-item');
        if (!confirm(invoiceRes.cap_question_delete)) return false;
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.id = itemFolder.attr('id').replace('invoice_folder_', '');
        e.o.inbox = $('#HFInbox').val();
        $(this).parents('.invoice-folder-list-item').hide();
        $.ajax({
            type: "POST", url: "fax_new.aspx/delete_folder",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-folder-list .wait').hide();
                if (c.d[0] == "success") {
                    itemFolder.remove();
                    reloadMenuFolder();
                } else {
                    itemFolder.show();
                }
            }
        });
    });
    $('.invoice-folder-list-item .subject').live('click', function () {
        if ($('.invoice-folder-list-item input:[type=text]').length != 0) return false;
        $('.invoice-folder-list input:[type=text]').remove();
        var thisSubject = $(this);
        var firstValue = thisSubject.text();
        var renametxt = $('<input type="text" value="' + firstValue + '" item="' + $(this).parents('.invoice-folder-list-item').attr('id').replace('invoice_folder_', '') + '" style="margin-top:5px"/>');
        thisSubject.after(renametxt);
        thisSubject.hide();
        renametxt.focus();
        var fnUpdateFolder = function () {
            thisSubject.show();
            renametxt.remove();
            if (firstValue != renametxt.val()) {
                thisSubject.text(renametxt.val());
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.id = renametxt.attr('item')
                e.o.inbox = $('#HFInbox').val();
                e.o.name = renametxt.val();
                $.ajax({
                    type: "POST", url: "fax_new.aspx/update_folder",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) {
                        if (c.d[0] != "success") {
                            renametxt.val(firstValue);
                        } else {
                            reloadMenuFolder();
                        }
                    }
                });
            }
        }
        renametxt.blur(function () {
            fnUpdateFolder();
        });
        renametxt.keyup(function (event) {
            if (event.keyCode == 13) {
                fnUpdateFolder();
            }
        });
    });
    $(".invoice-folder-list").sortable({
        tolerance: "pointer",
        scrollSensitivity: 1,
        handle: ".icon-ellipsis-vertical",
        opacity: 0.9,
        forcePlaceholderSize: true,
        update: function (event, ui) {
            if (this === ui.item.parent()[0]) {
                var arrOrder = new Array();
                $('.invoice-folder-list-item').each(function (i, item) {
                    arrOrder.push($(item).attr('id').replace('invoice_folder_', ''));
                });
                var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
                e.o.order = arrOrder;
                e.o.inbox = $('#HFInbox').val();
                $.ajax({
                    type: "POST", url: "fax_new.aspx/order_folder",
                    data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (c) { reloadMenuFolder(); }
                });
            }
        }
    }).disableSelection();
    /*---------*/

    /*compose*/

    if ($('#DrdServerId option').length <= 1) $('.field-select-server').hide();

    $('.invoice-btn-compose').click(function () {
        $('.invoice-compose-container').show();
        $('.invoice-list-container,.invoice-viewitem-container').hide();

        $('#DrdServerId').attr('disabled', '');
        $('#invoice_txt_customer').CustSelector("set", []);
        $('#invoice_txt_customer').CustSelector('enable');
        $('.invoice-txt-subject').val('');
        $('.invoice-txt-desc').val('');
        $('.invoice_div_sendtype,.invoice-btn-send,.invoice-btn-cancel').show();
        $('.invoice-btn-save').hide();
        $('.field-select-sendtype').show();
        if ($('#DrdServerId option').length > 1) $('.field-select-server').show();
        $('.invoice-container-faxfile').remove();
        $('.field-select-sendtype div,.invoice-txt-subject,#invoice_txt_customer_custSelector').removeClass('error');

        $('.field-select-sendtype div').removeClass('selected').removeClass('disabled');
        $('.field-select-sendtype div:[item=1]').addClass('selected');

        $('.invoice_div_sendtype').hide();
        $('.invoice_div_sendtype_1').show();
        $('.invoice-btn-selectfilemanager').show();
        $('.invoice-result-box').remove();
        $('#invoice_HF_filemanager').val('');
        $('#invoice_editor').val('').blur();
        $('.invoice-txt-file').val('');
        $("#DrdTemplate").val(0);
        $("#DrdTemplate").change()
        return false;
    });

    $('.invoice-btn-cancel').click(function () {
        $('.invoice-compose-container,.invoice-viewitem-container').hide();
        $('.invoice-list-container').show();

        return false;
    });
    $('#invoice_txt_customer').CustSelector({
        mode: "fax",
        showproperty: "label",
        onchange: function () {
            $('#invoice_txt_customer_custSelector').removeClass('error');
        }
    });


    $('#DrdTemplate').change(function () {

        if ($(this).val() != 0) {
            var e = {};
            e.domain_ = $('#HFdomain').val();
            e.idTemplate_ = $(this).val();
            $('.invoiceTemplateWait').show();
            $.ajax({
                type: "POST", url: "../WebServices/workflow_.asmx/getTemplate_ByID",
                data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
                success: function (c) {
                    $('.invoiceTemplateWait').hide();
                    if (c.d != 0) {
                        if ($('.invoice-txt-subject').val() == "") $('.invoice-txt-subject').val(c.d.name);
                        $(".invoice_template").html(c.d.text);
                        $('#invoice_editor').val("").blur();
                        $('.invoice_div_sendtype_3 .cleditorMain').hide();
                    }
                }
            });
        } else {
            $('#invoice_editor').val("").blur();
            $(".invoice_template").html("");
            $('.invoice_div_sendtype_3 .cleditorMain').show();
        };

    });



    EditorInvoice = $("#invoice_editor").cleditor({
        width: '99%',
        height: 400,
        dir: resources.direction,
        controls:
                "bold italic underline strikethrough subscript superscript | font size " +
                "style | color highlight removeformat | bullets numbering | outdent " +
                "indent | alignleft center alignright justify | undo redo | " +
                " cut copy paste pastetext | print source",
    });




    $('.field-select-sendtype div').click(function () {
        if ($(this).hasClass('disabled')) return false;
        $('.invoice_div_sendtype').hide();
        $('.invoice_div_sendtype_' + $(this).attr('item')).show();
        $('.field-select-sendtype div').removeClass('selected').removeClass('error');
        $(this).addClass('selected');
        $('#hf_fax_sendtype').val($(this).attr('item'));

        if ($(this).attr('item') == 3) {
            EditorInvoice[0].disable(false).refresh();
        }
    });

    $('.invoice-btn-selectfilemanager').click(function () {
        var thisBtn = $(this);
        show_fileManager(4, function (item, urlmode) {
            $('#UCdialog_FileManager').dialog('close');
            thisBtn.after('<div class="invoice-result-selectfilemanager invoice-result-box">' +
                            '<div class="ui-icon ui-icon-close cursor right_left" title="' + invoiceRes.cap_delete + '" style="margin: 2px; "></div>' +
                            '<a href="' + ((urlmode == "relative") ? item.relative_url : item.url) + '" target="_blank" class="right_left" style="margin: 6px 0;">' + item.filename + '</a>' +
                          '</div>');
            $('#invoice_HF_filemanager').val(item.id);
            thisBtn.hide();
        });
    });
    $('.invoice-result-selectfilemanager .ui-icon-close').live('click', function () {
        $('.invoice-btn-selectfilemanager').show();
        $('.invoice-result-selectfilemanager').remove();
        $('#invoice_HF_filemanager').val('');
    });
    $('.invoice-result-file .ui-icon-close').live('click', function () {
        $('.div-invoice-file').show();
        $('.invoice-result-file').remove();
    });

    $('#invoice_form_send').ajaxForm({ //send
        beforeSend: function () {
            $('.invoice-wait,.invoice-overlay').show();
        },
        uploadProgress: function (event, position, total, percentComplete) {
            $('.invoice-wait-percent').text(percentComplete + '%');
        },
        complete: function (c) {
            var result = eval("(" + c.responseText + ")");
            showInvoiceMessage(result[1]);
            get_list(1, listSize, 2, 0, 0, 0, '', true);
            get_menucount();
            $('.invoice-wait,.invoice-overlay').hide();
            $('.invoice-wait-percent').empty();
        }
    });
    $('.invoice-btn-send').click(function () {
        if ($('#DrdServerId option').length == 0) { alert("please define a server"); return false; }
        var valid = true;
        var customers = $('#invoice_txt_customer').CustSelector("get");
        if (customers.length == 0) { $('#invoice_txt_customer_custSelector').addClass('error'); valid = false; }
        if ($('.invoice-txt-subject').val() == "") { $('.invoice-txt-subject').addClass('error'); valid = false; }
        var sendtype = $('.field-select-sendtype div.selected').attr('item');
        $('.field-select-sendtype div').removeClass('error');
        if (sendtype == 1 && $('.invoice-txt-file').val() == "" && $('.invoice-result-file').length == 0) {//select file
            valid = false;
            $('.field-select-sendtype div:[item=1]').addClass('error');
        }
        if (sendtype == 2 && $('.invoice-result-selectfilemanager').length == 0) {//select filemanager
            valid = false;
            $('.field-select-sendtype div:[item=2]').addClass('error');
        }
        if (sendtype == 3 &&  $('#DrdTemplate').val()==0 && $('#invoice_editor').val() == "") {//editor
            valid = false;
            $('.field-select-sendtype div:[item=3]').addClass('error');
        }
        if (!valid) return false;
        $('#invoice_hf_customer').val(JSON.stringify(customers));
        $("#invoice_form_send").attr("action", 'fax_new_upload.ashx?d=' + $('#HFdomain').val() + '&u=' + $('#HFUserCode').val() + '&c=' + $("#HFcodeDU").val());
        $("#invoice_form_send").submit();
    });
    $('.invoice-txt-subject').keyup(function () {
        $(this).removeClass('error');
    });
    $('.invoice-txt-subject,.invoice-txt-desc').focus(function () {
        $(this).data('value', $(this).val());
    });
    $('.invoice-txt-subject,.invoice-txt-desc').blur(function () {
        if ($(this).val() != $(this).data('value')) {
            $('.invoice-btn-save').removeClass('disabled');
        }
    });
    $('.invoice-btn-save').click(function () {
        if ($(this).hasClass('disabled')) return false;
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.subject = $('.invoice-txt-subject').val();
        e.o.desc = $('.invoice-txt-desc').val();
        e.o.inbox = $('#HFInbox').val();
        e.o.id = $('.invoice-viewitem-container').attr('item');
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/save_subject_desc",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                $('.invoice-btn-save').addClass('disabled');
                showInvoiceMessage(c.d[1]);
            }
        });
    });
    /*----------------*/

    /*change inbox*/

    $('.BtnShowMenuChangeInbox').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.invoice-mnu-inbox').hide();
        }
        else {
            var mnu = $('.invoice-mnu-inbox');
            if (resources.direction == 'ltr') {
                mnu.css({ left: $(this).offset().left, top: $(this).offset().top + 40 });
            } else {
                mnu.css({ left: $(this).offset().left - mnu.width() + $(this).width(), top: $(this).offset().top + 40 });
            }
            mnu.show();
            $(this).addClass('selected');

            var currentInbox = $('.page-title-inbox div').attr('item');
            mnu.find('.rowMnu:[item=' + currentInbox + ']').addClass('disabled');
        }
    });
    $('.invoice-mnu-inbox .rowMnu').click(function () {
        if ($(this).hasClass('disabled')) return false;

        var currentUrl = window.location.href;
        var currentInbox = $('.page-title-inbox div').attr('item');

        if (currentUrl.indexOf('inbox') == -1) {
            currentUrl += "&inbox=" + $(this).attr('item');
        } else {
            currentUrl = currentUrl.replace('inbox=' + currentInbox, "inbox=" + $(this).attr('item'));
        }

        window.location.href = currentUrl;
    });
    /*----------------*/

    /*invoice list*/

    var showBtnOnSelectItem = function () {
        if ($('.invoice-list-item-check:[checked=true]').length != 0) {
            $('.invoice-list-head-onselect').show();
            $('.invoice-mnu-btn-search').hide();
        } else {
            $('.invoice-list-head-onselect').hide();
            $('.invoice-mnu-btn-search').show();
        }
    };
    var checkItemList = function (checkitem, checked) {
        if (checked) {
            checkitem.removeClass('icon-check-empty').addClass('icon-check');
            checkitem.parents('.invoice-list-item').addClass('select');
            checkitem.attr('checked', "true");
        } else {
            checkitem.addClass('icon-check-empty').removeClass('icon-check');
            checkitem.parents('.invoice-list-item').removeClass('select');
            checkitem.attr('checked', "false");
        }
    };

    $('.invoice-mnu-btn-check').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.invoice-mnu-check').hide();
        }
        else {
            var mnu = $('.invoice-mnu-check');
            if (resources.direction == 'ltr') {
                mnu.css({ left: $(this).offset().left, top: $(this).offset().top + 27 });
            } else {
                mnu.css({ left: $(this).offset().left - mnu.width() + $(this).width(), top: $(this).offset().top + 27 });
            }
            mnu.show();
            $(this).addClass('selected');
        }
    });
    $('.invoice-mnu-btn-check-quick').click(function (e) {
        if ($(this).hasClass('icon-check-empty')) {
            $(this).removeClass('icon-check-empty').addClass('icon-check');
            $('.invoice-list-item-check').each(function () {
                checkItemList($(this), true);
            });
        } else {
            $(this).removeClass('icon-check').addClass('icon-check-empty');
            $('.invoice-list-item-check').each(function () {
                checkItemList($(this), false);
            });
        }
        showBtnOnSelectItem();
        e.stopPropagation();
    });
    $('.invoice-mnu-check .rowMnu').click(function () {
        switch ($(this).attr('item')) {
            case "1"://All
                $('.invoice-list-item-check').each(function () {
                    checkItemList($(this), true);
                });
                break;
            case "2"://None
                $('.invoice-list-item-check').each(function () {
                    checkItemList($(this), false);
                });
                break;
            case "3"://Read
                $('.invoice-list-item').each(function () {
                    checkItemList($(this).find('.invoice-list-item-check'), $(this).hasClass('viewed'));
                });
                break;
            case "4"://Unread
                $('.invoice-list-item').each(function () {
                    checkItemList($(this).find('.invoice-list-item-check'), !$(this).hasClass('viewed'));
                });
                break;
            case "5"://Starred
                $('.invoice-list-item').each(function () {
                    checkItemList($(this).find('.invoice-list-item-check'), $(this).find('.invoice-list-item-starred').hasClass('select'));
                });
                break;
            case "6"://Unstarred
                $('.invoice-list-item').each(function () {
                    checkItemList($(this).find('.invoice-list-item-check'), !$(this).find('.invoice-list-item-starred').hasClass('select'));
                });
                break;
        }
        showBtnOnSelectItem();
    });

    $('.invoice-mnu-btn-folder').click(function () {
        var thisBtn = $(this);
        if (thisBtn.hasClass('selected')) {
            thisBtn.removeClass('selected');
            $('.invoice-mnu-folder').hide();
        }
        else {
            var mnu = $('.invoice-mnu-folder');
            if (resources.direction == 'ltr') {
                mnu.css({ left: thisBtn.offset().left, top: thisBtn.offset().top + 30 });
            } else {
                mnu.css({ left: thisBtn.offset().left - mnu.width() + thisBtn.width(), top: thisBtn.offset().top + 30 });
            }
            mnu.empty();
            $('.invoice-menu-folder li').each(function (i, item) {
                mnu.append('<div class="rowMnu' + (thisBtn.hasClass('aitem') ? ' aitem' : '') + '" item="' + $(item).attr('item') + '">' +
                               '<i class="icon-folder-open right_left"></i>' +
                               '<span class="right_left">' + $(item).find('.menu-title').text() + '</span>' +
                           '</div>');
            });
            mnu.show();
            $(this).addClass('selected');
        }
    });


    $(document).bind('click', function (e) {
        if (!$(e.target).hasClass('BtnShowMenuChangeInbox')) {
            if ($(e.target).parents('.BtnShowMenuChangeInbox').length == 0) {
                $('.invoice-mnu-inbox').hide();
                $('.BtnShowMenuChangeInbox').removeClass('selected');
            }
        }
        if (!$(e.target).hasClass('invoice-mnu-btn-check')) {
            if ($(e.target).parents('.invoice-mnu-btn-check').length == 0) {
                $('.invoice-mnu-check').hide();
                $('.invoice-mnu-btn-check').removeClass('selected');
            }
        }
        if (!$(e.target).hasClass('invoice-mnu-btn-folder')) {
            if ($(e.target).parents('.invoice-mnu-btn-folder').length == 0) {
                $('.invoice-mnu-folder').hide();
                $('.invoice-mnu-btn-folder').removeClass('selected');
            }
        }
        if (!$(e.target).hasClass('invoice-mnu-btn-replay')) {
            if ($(e.target).parents('.invoice-mnu-btn-replay').length == 0) {
                $('.invoice-mnu-replay').hide();
                $('.invoice-mnu-btn-replay').removeClass('selected');
            }
        }
    });

    $('.invoice-list-item-check').live('click', function (e) {
        checkItemList($(this), $(this).attr('checked') == "false");
        showBtnOnSelectItem();
        e.stopPropagation();
    });
    $('.invoice-list-item-starred').live('click', function (event) {
        var starred = $(this).hasClass('select');
        if (starred) {
            $('.invoice-list-item-starred:[item=' + $(this).attr('item') + ']').removeClass('select').removeClass('fas');
        } else {
            $('.invoice-list-item-starred:[item=' + $(this).attr('item') + ']').addClass('fas select');
        }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.starred = !starred;
        e.o.inbox = $('#HFInbox').val();
        e.o.id = $(this).attr('item');
        $.ajax({
            type: "POST", url: "fax_new.aspx/starred_list",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
        event.stopPropagation();
    });
    $('.invoice-list-item a').live('click', function (e) {
        e.stopPropagation();
    });
    $('.invoice-list-item-retry').live('click', function (event) {
        var thisItem = $(this).parents('.invoice-list-item');
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.inbox = $('#HFInbox').val();
        e.o.faxid = thisItem.attr('item');
        e.o.serverid = $(this).attr('serverid');
        $('.invoice-overlay,.invoice-wait').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/send_retry",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-overlay,.invoice-wait').hide();
                if (c.d[0] == "success") {
                    thisItem.find('.invoice-list-result-tag').html(generateStatusLabel(c.d[1], c.d[2], e.o.serverid)).hide().fadeIn();
                } else {
                    showInvoiceMessage(c.d[1]);
                }
            }
        });
        event.stopPropagation();
    });

    var listSize = 10;
    var get_list = function (pagenum, pagesize, type, archive, starred, folder, search, backTolist, callback) {
        $('.invoice-overlay,.invoice-wait').show();


        $('.invoice-list-head-title').removeClass('no-detail');
        if (archive == 1) {
            $('.invoice-list-head-title').html(invoiceRes.cap_archive);
        } else if (type == 1) {//inbox
            $('.invoice-list-head-title').html(invoiceRes.cap_inbox);
        } else if (type == 2) {//send
            $('.invoice-list-head-title').html(invoiceRes.cap_posts);
        }
        if (search != '') {
            $('.invoice-list-head-title').append('<span>' + invoiceRes.cap_search + ': ' + search + '</span>');
        }

        $('.invoice-list-head-onselect').hide();
        if (archive == 1) {
            $('.invoice-mnu-btn-archive,.invoice-mnu-btn-folder').hide();
            $('.invoice-mnu-btn-delete').removeClass('single');
            $('.invoice-mnu-btn-unarchive').show();
        } else if (type == 1) {
            $('.invoice-mnu-btn-archive,.invoice-mnu-btn-folder').show();
            $('.invoice-mnu-btn-delete').removeClass('single');
            $('.invoice-mnu-btn-unarchive').hide();
        } else if (type == 2) {
            $('.invoice-mnu-btn-archive,.invoice-mnu-btn-folder').hide();
            $('.invoice-mnu-btn-delete').addClass('single');
            $('.invoice-mnu-btn-unarchive').hide();
        }

        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: { pagenum: pagenum, pagesize: pagesize, type: type, archive: archive, starred: starred, folder: folder, search: search } };
        e.o.inbox = $('#HFInbox').val();
        $.ajax({
            type: "POST", url: "fax_new.aspx/get_list",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {

                if (backTolist) {
                    $('.invoice-compose-container,.invoice-viewitem-container').hide();
                    $('.invoice-list-container').show();
                }

                $('.invoice-overlay,.invoice-wait').hide();

                if (c.d[0] == "success") {
                    e.o.total = c.d[2];
                    $('.invoice-list').data('o', e.o);
                    if (e.o.total == 0)
                        $('.invoice-list-head-detail').html(invoiceRes.cap_empty_list);
                    else if (e.o.total > 1)
                        $('.invoice-list-head-detail').html(invoiceRes.cap_result_list.replace('#1', (pagenum - 1) * pagesize + 1).replace('#2', Math.min(pagenum * pagesize, e.o.total)).replace('#3', e.o.total));
                    else {
                        $('.invoice-list-head-detail').empty();
                        $('.invoice-list-head-title').addClass('no-detail');
                    }
                    $('.invoice-list').empty();
                    $.each(c.d[1], function (i, item) {

                        if (item.cust_picture == '') item.cust_picture = '../themes/resources/images/noimage.jpg';
                        var custTitle = '<a onclick="customer_Show_Info(' + item.cust_code + ',\'' + item.cust_name + '\');return false;" class="left_right invoice-list-customer" title="' + item.tel + '"><i class="fas icon-user"></i></a>'
                        if (item.cust_code == 0 || item.cust_code == '') {
                            item.cust_name = item.tel;
                            item.cust_picture = '../themes/resources/images/noimage.jpg';
                            custTitle = '<a onclick="customer_create_quick_fax(\'' + item.cust_name + '\');return false;" class="left_right invoice-list-customer" title="' + invoiceRes.cap_create_customer + '" tel="' + item.tel + '"><i class="icon-user-plus"></i></a>'
                        }

                        $('.invoice-list').append('<div class="invoice-list-item ' + (item.viewed || e.o.type == 2 ? 'viewed' : '') + '" item="' + item.ID + '" num="' + i + '">' +
                                                      '<i class="icon-check-empty invoice-list-item-check right_left" checked="false"></i>' +
                                                      '<i class="icon-star invoice-list-item-starred right_left ' + (item.starred ? 'fas select' : '') + '" item="' + item.ID + '"></i>' +
                                                      '<div class="invoice-list-date left_right">' + item.date_ + '</div>' +
                                                      custTitle +
                                                      (type == 2 ? '<div class="invoice-list-result-tag left_right">' + generateStatusLabel(item.status, item.status_str, item.serverid) + '</div>' : '') +
                                                      '<div class="invoice-div-list-title">' +
                                                        '<img src="' + item.cust_picture + '" class="right_left"/>' +
                                                        '<div class="invoice-list-title ' + (item.subject == "" && item.desc_ == "" ? 'no-detail' : '') + '" cust_code="' + item.cust_code + '" tel="' + item.tel + '">' + item.cust_name + '</div>' +
                                                        '<div class="invoice-list-detail"><span class="right_left" style="margin: 0 5px;">' + item.subject + '</span>' + item.desc_ + '</div>' +
                                                      '</div>' +
                                                  '</div>');
                    });
                    $('.invoice-list').disableSelection();
                    if (callback && typeof (callback) === "function") {
                        callback();
                    }
                }
            }
        });
    }

    if ($('.invoice-msg').children().length != 0) {
        $('.invoice-overlay').show();
    } else {
        get_list(1, 10, 1, 0, 0, 0, '', false); //page load bind list
        get_menucount();
    }

    $('.invoice-menu-ul li').live('click', function () {
        $('.invoice-menu-ul li.select').removeClass('select');
        $(this).addClass('select');

        $('.invoice-list-head-search').hide();
        $('.invoice-list-head-tool').fadeIn();
        $('.invoice-text-search').val('');

        //get_list pagenum, pagesize, type, archive, starred, folder
        var item = $(this).attr('item');
        if (item == "inbox") {
            get_list(1, listSize, 1, 0, 0, 0, '', true);
        } else if (item == "starred") {
            get_list(1, listSize, 1, 0, 1, 0, '', true);
        } else if (item == "send") {
            get_list(1, listSize, 2, 0, 0, 0, '', true);
        } else if (item == "archive") {
            get_list(1, listSize, 1, 1, 0, 0, '', true);
        } else {
            get_list(1, listSize, 1, 0, 0, item, '', true);
        }
    });


    $('.invoice-mnu-folder .rowMnu').live('click', function () {
        var folderid = $(this).attr('item');
        var foldername = $(this).find('span').text();
        var aItem = $(this).hasClass('aitem');
        var arrSeleted = new Array();
        if (aItem) {
            arrSeleted.push([$('.invoice-viewitem-container .invoice-list-title').attr('cust_code') || 0, $('.invoice-viewitem-container').attr('item')]);
        } else {
            $('.invoice-list-item.select').each(function (i, item) {
                arrSeleted.push([$(item).find('.invoice-list-title').attr('cust_code') || 0, $(item).attr('item')]);
            });
        }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.items = arrSeleted;
        e.o.inbox = $('#HFInbox').val();
        e.o.folderid = folderid;
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/fax_in_folder",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                showInvoiceMessage(c.d[1]);
                if (c.d[0] == "success") {
                    $('.invoice-list-item.select .invoice-list-item-check').each(function (i, item) {
                        checkItemList($(item), false);
                    });
                    $('.invoice-mnu-btn-check-quick').removeClass('icon-check').addClass('icon-check-empty');
                    showBtnOnSelectItem();
                    get_menucount();

                    if ($('.invoice-item-folder:[item=' + folderid + ']').length == 0 && aItem) {
                        $('.invoice-item-folders').append('<div class="invoice-item-folder left_right" item="' + folderid + '">' + foldername + '<i class="icon-times right_left" title="' + invoiceRes.cap_delete + '"></i></div>');
                    }
                }
            }
        });
        return false;
    });
    $('.invoice-mnu-btn-archive').click(function () {
        var arrSeleted = new Array();
        if ($(this).hasClass('aitem')) {
            arrSeleted.push($('.invoice-viewitem-container').attr('item'));
        } else {
            $('.invoice-list-item.select').each(function (i, item) {
                arrSeleted.push($(item).attr('item'));
            });
        }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.items = arrSeleted;
        e.o.inbox = $('#HFInbox').val();
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/fax_archive",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                showInvoiceMessage(c.d[1]);
                if (c.d[0] == "success") {
                    $.each(arrSeleted, function (i, item) {
                        $('.invoice-list-item:[item=' + item + ']').remove();
                    });
                    $('.invoice-mnu-btn-check-quick').removeClass('icon-check').addClass('icon-check-empty');
                    showBtnOnSelectItem();
                    var listInfo = $('.invoice-list').data('o');
                    get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, listInfo.search, true);
                    get_menucount();
                }
            }
        });
        return false;
    });
    $('.invoice-mnu-btn-unarchive').click(function () {
        var arrSeleted = new Array();
        if ($(this).hasClass('aitem')) {
            arrSeleted.push($('.invoice-viewitem-container').attr('item'));
        } else {
            $('.invoice-list-item.select').each(function (i, item) {
                arrSeleted.push($(item).attr('item'));
            });
        }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.items = arrSeleted;
        e.o.inbox = $('#HFInbox').val();
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/fax_unarchive",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                showInvoiceMessage(c.d[1]);
                if (c.d[0] == "success") {
                    $.each(arrSeleted, function (i, item) {
                        $('.invoice-list-item:[item=' + item + ']').remove();
                    });
                    $('.invoice-mnu-btn-check-quick').removeClass('icon-check').addClass('icon-check-empty');
                    showBtnOnSelectItem();
                    var listInfo = $('.invoice-list').data('o');
                    get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, listInfo.search, true);
                    get_menucount();
                }
            }
        });
        return false;
    });
    $('.invoice-mnu-btn-delete').click(function () {
        if (!confirm(invoiceRes.cap_question_delete)) return false;
        var arrSeleted = new Array();
        if ($(this).hasClass('aitem')) {
            arrSeleted.push($('.invoice-viewitem-container').attr('item'));
        } else {
            $('.invoice-list-item.select').each(function (i, item) {
                arrSeleted.push($(item).attr('item'));
            });
        }
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.items = arrSeleted;
        e.o.inbox = $('#HFInbox').val();
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/fax_delete",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                showInvoiceMessage(c.d[1]);
                if (c.d[0] == "success") {
                    $.each(arrSeleted, function (i, item) {
                        $('.invoice-list-item:[item=' + item + ']').remove();
                    });
                    $('.invoice-mnu-btn-check-quick').removeClass('icon-check').addClass('icon-check-empty');
                    showBtnOnSelectItem();
                    var listInfo = $('.invoice-list').data('o');
                    get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, listInfo.search, true);
                    get_menucount();
                }
            }
        });
        return false;
    });
    $('.invoice-list-btn-next,.invoice-list-btn-prev').click(function () {
        var listInfo = $('.invoice-list').data('o');
        var maxPage = Math.ceil(listInfo.total / listInfo.pagesize);
        if ($(this).hasClass('invoice-list-btn-next')) {
            if (listInfo.pagenum >= maxPage) return false;
            listInfo.pagenum++;
        } else {
            if (listInfo.pagenum <= 1) return false;
            listInfo.pagenum--;
        }
        get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, listInfo.search, true);
    });

    /*search-----*/
    $('.invoice-list-head-search').click(function () {
        $('.invoice-text-search').focus();
    });
    $('.invoice-mnu-btn-search').click(function () {
        $('.invoice-list-head-search').fadeIn();
        $('.invoice-list-head-tool').hide();
        $('.invoice-text-search').focus();
    });
    $('.invoice-search-btn-back').click(function (event) {
        $('.invoice-list-head-search').hide();
        $('.invoice-list-head-tool').fadeIn();
        event.stopPropagation();
    });
    $('.invoice-icon-search').click(function (event) {
        var listInfo = $('.invoice-list').data('o');
        get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, $('.invoice-text-search').val(), true);
        event.stopPropagation();
    })
    $(".invoice-text-search").keyup(function (event) {
        if (event.keyCode == 13) {
            $('.invoice-icon-search').click();
            $('.invoice-search-btn-back').click();
        }
    });
    /*----------------------*/

    /* view item*/

    $('.invoice-mnu-btn-replay').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('.invoice-mnu-replay').hide();
        }
        else {
            var mnu = $('.invoice-mnu-replay');
            if (resources.direction == 'rtl') {
                mnu.css({ left: $(this).offset().left, top: $(this).offset().top + 27 });
            } else {
                mnu.css({ left: $(this).offset().left - mnu.width() + $(this).width(), top: $(this).offset().top + 27 });
            }
            mnu.show();
            $(this).addClass('selected');
        }
    });
    $('.invoice-mnu-replay .rowMnu').click(function () {

        var menuId = $(this).attr('item');
        var faxinfo = $('.invoice-viewitem-container').data('data');
        var data = faxinfo[1];

        if (menuId == 1) { //replay
            $('.invoice-btn-compose').click();
            var faxcustinfo = $.grep(faxinfo[3], function (s) { return s.cust_code == data.customer_code || s.cust_code == 0 })[0];
            $('#invoice_txt_customer').CustSelector("set", [{ code: faxcustinfo.cust_code, name: faxcustinfo.customerName, label: data.tel, picture: faxcustinfo.picture }]);
        } else if (menuId == 2) {//forward
            $('.invoice-btn-compose').click();
            $('.field-select-sendtype div').removeClass('selected');
            $('.field-select-sendtype div:[item=' + data.filetype + ']').addClass('selected');
            $('#hf_fax_sendtype').val(data.filetype);
            $('.invoice_div_sendtype').hide();
            $('.invoice_div_sendtype_' + data.filetype).show();
            if (data.filetype == 1) {
                $('.div-invoice-file').hide();
                $('.invoice_div_sendtype_1').append('<div class="invoice-result-file invoice-result-box">' +
                                                     '<div class="ui-icon ui-icon-close cursor right_left" title="' + invoiceRes.cap_delete + '" style="margin: 2px; "></div>' +
                                                     '<a target="_blank" href="' + (data.file_url_code) + '" target="_blank" class="right_left" style="margin: 6px 0;">' + invoiceRes.cap_view + '</a>' +
                                                     '<input type="hidden" name="forwardfile" value="' + data.file_url + '"/>' +
                                                   '</div>');

            } else if (data.filetype == 2) {
                $('.invoice-btn-selectfilemanager').hide();
                $('.invoice-btn-selectfilemanager').after('<div class="invoice-result-selectfilemanager invoice-result-box">' +
                                                            '<div class="ui-icon ui-icon-close cursor right_left" title="' + invoiceRes.cap_delete + '" style="margin: 2px; "></div>' +
                                                            '<a target="_blank" href="' + (data.file_url_code) + '" target="_blank" class="right_left" style="margin: 6px 0;">' + invoiceRes.cap_view + '</a>' +
                                                          '</div>');
                $('#invoice_HF_filemanager').val(data.body);

            } else if (data.filetype == 3) {
                $('#invoice_editor').val(data.body).blur();
            }
        } else if (menuId == 3) {//start workflow
            runwf_quick(5, 0, data.ID, data.customer_code, 'Workflow'); return false;
        }

        if (menuId != 3) {
            $('#DrdServerId').val(data.serverid).attr('selected', 'selected');
            $('.invoice-txt-subject').val(data.subject);
            $('.invoice-txt-desc').val(data.desc_);
        }

    });

    var viewItem = function (item) {
        $('.invoice-list-container').hide();
        $('.invoice-viewitem-container').show().attr('item', item.attr('item')).attr('num', item.attr('num'));

        $('.invoice-div-item-title').html(item.find('.invoice-div-list-title').html());
        $('.invoice-item-date').text(item.find('.invoice-list-date').html());
        $('.invoice-item-head-title').html($('.invoice-list-head-title').html());

        $('.invoice-item-head .invoice-list-item-starred').attr('item', item.attr('item'));
        $('.invoice-item-head .invoice-list-item-starred').removeClass('select').removeClass('fas');
        if (item.find('.invoice-list-item-starred').hasClass('select')) $('.invoice-item-head .invoice-list-item-starred').addClass('fas select');

        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.id = item.attr('item');
        e.o.inbox = $('#HFInbox').val();
        $('.invoice-wait,.invoice-overlay').show();
        $.ajax({
            type: "POST", url: "fax_new.aspx/get_byid",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                $('.invoice-wait,.invoice-overlay').hide();
                if (c.d[0] == "success") {



                    $('.invoice-viewitem-container').data('data', c.d);

                    $('.invoice-item-folders').empty();
                    $.each(c.d[2], function (i, folder) {
                        $('.invoice-item-folders').append('<div class="invoice-item-folder left_right" item="' + folder.id + '">' + folder.name + '<i class="icon-times right_left" title="' + invoiceRes.cap_delete + '"></i></div>');
                    });

                    var data = c.d[1];
                    data.file_url_code = c.d[5];

                    $('#DrdServerId').val(data.serverid).attr('selected', 'selected').attr('disabled', 'disabled');

                    var faxcustinfo = $.grep(c.d[3], function (s) { return s.cust_code == data.customer_code || s.cust_code == 0 })[0];
                    $('#invoice_txt_customer').CustSelector("set", [{ code: faxcustinfo.cust_code, name: faxcustinfo.customerName, label: data.tel, picture: faxcustinfo.picture }]);
                    $('#invoice_txt_customer').CustSelector('disable');

                    $('.invoice-compose-container').show();
                    $('.invoice-txt-subject').val(data.subject);
                    $('.invoice-txt-desc').val(data.desc_);
                    $('.invoice_div_sendtype,.invoice-btn-send,.invoice-btn-cancel').hide();
                    $('.invoice-btn-save').show().addClass('disabled');

                    var createfaxView = function () {
                        return '<div class="invoice-container-faxfile invoice-result-box"><span class="left_right" style="direction: ltr;margin:0 5px;">' + c.d[4] + '</span><a target="_blank" href="' + data.file_url_code + '&download=true" class="left_right">' + invoiceRes.cap_download + '</a><i class="left_right icon-download"></i><i class="icon-file-text right_left"></i><a target="_blank" href="' + data.file_url_code + '">' + invoiceRes.cap_view + '</a></div>'
                    }

                    $('.invoice-container-faxfile').remove();
                    if (data.type == 1) { //recive
                        $('.invoice-item-viewedby').html(invoiceRes.cap_viewed_by);
                        $('.field-select-server').hide();
                        $('.field-select-sendtype').hide();
                        $('.field-select-sendtype').after(createfaxView());
                    } else {//send
                        $('.invoice-item-viewedby').html(invoiceRes.cap_send_by);
                        if ($('#DrdServerId option').length > 1) $('.field-select-server').show();
                        $('.field-select-sendtype').show();
                        $('.field-select-sendtype div').removeClass('selected');
                        $('.field-select-sendtype div').addClass('disabled');
                        $('.field-select-sendtype div:[item=' + data.filetype + ']').addClass('selected');
                        $('#hf_fax_sendtype').val(data.filetype);
                        if (data.filetype == 1) {
                            $('.field-select-sendtype').after(createfaxView());
                        } else if (data.filetype == 2) {
                            $('.field-select-sendtype').after(createfaxView());
                        } else if (data.filetype == 3) {
                            $('.field-select-sendtype').after('<div class="invoice-container-faxfile invoice-result-box">' + data.body + '</div>');
                        }
                    }

                    var faxuserinfo = $.grep(c.d[3], function (s) { return s.user_code == data.user_code })[0];
                    $('.invoice-item-viewedby').append(' <a onclick="customer_Show_Info(' + faxuserinfo.cust_code + ',\'' + faxuserinfo.name + '\');return false;">' + faxuserinfo.name + '</a>');


                    item.addClass('viewed');



                }
            }
        });
    }
    $('.invoice-list-item').live('click', function () {
        viewItem($(this));
    });
    $('.invoice-item-btn-next,.invoice-item-btn-prev').click(function () {
        var currentItem = parseInt($('.invoice-viewitem-container').attr('num'));
        var mode = "prev";
        var nextItem = currentItem - 1;
        if ($(this).hasClass('invoice-item-btn-next')) { mode = "next"; nextItem = currentItem + 1 }
        if ($('.invoice-list-item:[num=' + nextItem + ']').length != 0) {
            viewItem($('.invoice-list-item:[num=' + nextItem + ']'));
        } else {
            var listInfo = $('.invoice-list').data('o');
            var maxPage = Math.ceil(listInfo.total / listInfo.pagesize);
            if (mode == "next") {
                if (listInfo.pagenum >= maxPage) return false;
                listInfo.pagenum++;
            } else {
                if (listInfo.pagenum <= 1) return false;
                listInfo.pagenum--;
            }
            get_list(listInfo.pagenum, listInfo.pagesize, listInfo.type, listInfo.archive, listInfo.starred, listInfo.folder, listInfo.search, false, function () {
                if (mode == "next")
                    viewItem($('.invoice-list-item:first'));
                else
                    viewItem($('.invoice-list-item:last'));
            });
        }
    });
    $('.invoice-item-folder i').live('click', function () {
        var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
        e.o.folderid = $(this).parents('.invoice-item-folder').attr('item');
        e.o.faxid = $('.invoice-viewitem-container').attr('item');
        e.o.inbox = $('#HFInbox').val();
        $(this).parents('.invoice-item-folder').remove();
        $.ajax({
            type: "POST", url: "fax_new.aspx/delete_faxinfolder",
            data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) { }
        });
    });

    $('.invoice-mnu-btn-back').click(function () {
        $('.invoice-list-container').show();
        $('.invoice-compose-container,.invoice-viewitem-container').hide();
    });
    /*------------*/

    /*node_ = send_fax*/
    if ($('#HFNodeSend').length != 0) {
        var info = eval("(" + $('#HFNodeSend').val() + ")");
        $('.invoice-btn-compose').click();
        $('.invoice-txt-subject').val(info.subject);
        if (info.hasOwnProperty('cust_code')) {
            $('#invoice_txt_customer').CustSelector("set", [{ code: info.cust_code, name: info.cust_name, label: info.cust_fax, picture: '' }]);
        }
        if (info.hasOwnProperty("file")) {
            $('.div-invoice-file').hide();
            $('.invoice_div_sendtype_1').append('<div class="invoice-result-file invoice-result-box">' +
                                                  '<div class="ui-icon ui-icon-close cursor right_left" title="' + invoiceRes.cap_delete + '" style="margin: 2px; "></div>' +
                                                  '<a target="_blank" href="' + (info.file.replace("~/", "../")) + '" target="_blank" class="right_left" style="margin: 6px 0;">' + invoiceRes.cap_view + '</a>' +
                                                  '<input type="hidden" name="forwardfile" value="' + info.file + '"/>' +
                                                '</div>');
        }
        $('.invoice-txt-desc').focus();
    }
    /*------------*/
});

/*create customer*/
function customer_create_quick_fax(tel) {
    $('body').data("fax", tel);
    customer_create_quick(invoiceRes.cap_create_customer, 'Inserted_customer_fax', 'fax=' + tel)
}
function Inserted_customer_fax(cust_info) {
    var tel = $('body').data("fax");
    $('.invoice-list-item .invoice-list-title:[tel=' + tel + ']').html(cust_info.name).attr('cust_code', cust_info.code);
    $('.invoice-list-item .invoice-list-customer:[tel=' + tel + ']').after('<a class="left_right invoice-list-customer" title="' + tel + '" onclick="customer_Show_Info(' + cust_info.code + ',\'' + cust_info.name + '\');return false;"><i class="icon-user"></i></a>');
    $('.invoice-list-item .invoice-list-customer:[tel=' + tel + ']').remove();

    var e = { d: $('#HFdomain').val(), u: $('#HFUserCode').val(), c: $('#HFcodeDU').val(), o: {} };
    e.o.cust_code = cust_info.code;
    e.o.cust_name = cust_info.name;
    e.o.tel = tel;
    $.ajax({
        type: "POST", url: "fax_new.aspx/set_customer",
        data: JSON.stringify(e), contentType: "application/json; charset=utf-8", dataType: "json",
        success: function (c) { }
    });
}


/*------------*/