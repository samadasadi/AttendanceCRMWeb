
$(function () {
    $.CustSelector = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptions, options);

        Container.hide();
        Container.data('options', options);

        var id = Container.attr('id');
        if (!id) {
            id = $(this).attr('id', 'tags' + new Date().getTime() + Math.random().toString(36).substring(7)).attr('id');
        }

        var DivContainer = $('<div class="container-custSelector"></div>').attr('id', id + '_custSelector');
        Container.after(DivContainer);
        DivContainer.css('width', Container.css('width'));

        var txtAutoComplete = $('<input type="text">');
        DivContainer.append(txtAutoComplete);
        DivContainer.click(function () {
            txtAutoComplete.focus();
        });

        var ajaxXhr;
        txtAutoComplete.keyup(function (event) {
            txtAutoComplete.removeClass('error');

            if (event.keyCode == 13 && options.allowManual) { //manial
                var manualText = txtAutoComplete.val();
                if (manualText.length < 3 || DivContainer.find('[item=' + manualText + ']').length != 0) { txtAutoComplete.addClass('error'); return false; }
                if (ajaxXhr && ajaxXhr.readyState != 4) {
                    ajaxXhr.abort();
                }
                $('#popup_' + id).remove();
                var tagItem = $('<div class="tag-custSelector right_left" title="' + manualText + '" item="' + manualText + '">' + manualText + '</div>').data('item', { code: 0, name: manualText, label: manualText, picture: '' });
                var closeBtn = $('<i class="icon-times right_left" title="Delete"></i>');
                tagItem.append(closeBtn);
                closeBtn.click(function () {
                    tagItem.remove();
                    options.onchange();
                });
                txtAutoComplete.before(tagItem);
                options.onchange();
                txtAutoComplete.val('');
                return false;
            }

            if (txtAutoComplete.val().length > 2) {// in list
                var popup;
                if ($('#popup_' + id).length == 0) {
                    popup = $('<div class="popup-custSelector" id="popup_' + id + '"></div>');
                    $('body').append(popup.hide().fadeIn());
                    popup.css({
                        left: DivContainer.offset().left,
                        top: DivContainer.offset().top + DivContainer.height() + 1,
                        width: DivContainer.width() + 4,
                        height: 30
                    });
                } else {
                    popup = $('#popup_' + id);
                }
                if (ajaxXhr && ajaxXhr.readyState != 4) {
                    ajaxXhr.abort();
                    popup.find('.wait').remove();
                }
                var serviceUrl = 'cust_autocomplete.aspx?m=' + options.mode + '&t=' + txtAutoComplete.val() + '&d=' + $('#HFdomain').val() + '&u=' + $('#HFUserCode').val() + '&c=' + $("#HFcodeDU").val() + '&rnd_=' + $("#HFRnd").val();
                popup.append('<div class="wait" style="margin: 5px;"></div>');
                ajaxXhr = $.post(serviceUrl, function (data, status) {
                    popup.empty();
                    $.each(data, function (i, item) {
                        var popupitem = $('<div class="popup-item-custSelector th-bgcolor-hover" style="' + (i % 2 == 0 ? 'background:#f7f7f7;' : 'background:#fff;') + '">' +
                                               (item.label == "" ? "" : '<div class="popup-item-label-custSelector left_right">' + item.label + '</div>') +
                                               '<img class="right_left" src="' + (item.picture == '' ? options.defaultPic : item.picture) + '">' +
                                               '<a class="popup-item-name-custSelector" onclick="customer_Show_Info(' + item.code + ',\'' + item.name + '\');return false;">' + item.name + '</a>' +
                                               '<div class="popup-item-code-custSelector">' + item.code + '</div>' +
                                          '</div>');

                        popupitem.click(function () {

                            if (DivContainer.find('[item=' + item.name + "_" + item.label + ']').length != 0
                                || (!options.allowEmptyLable && item.label == "")) {
                                txtAutoComplete.addClass('error');
                                return false;
                            }

                            var title = "";var value = "";
                            if (options.showproperty == 'name') { value = item.name, title = item.label }
                            if (options.showproperty == 'label') { value = item.label, title = item.name }
                            var tagItem = $('<div class="tag-custSelector right_left" title="' + title + '" item="' + item.name + "_" + item.label + '"><a onclick="customer_Show_Info(' + item.code + ',\'' + item.name + '\');return false;">' + value + '</a></div>').data('item', item);

                            var closeBtn = $('<i class="icon-times right_left" title="Delete"></i>');
                            tagItem.append(closeBtn);
                            closeBtn.click(function () {
                                tagItem.remove();
                                options.onchange();
                            });

                            txtAutoComplete.before(tagItem);
                            options.onchange();

                            txtAutoComplete.removeClass('error');
                            txtAutoComplete.val('').focus();
                            popup.remove();
                        });

                        popup.append(popupitem);
                    });
                    var height = Math.min(options.rows, $('.popup-item-custSelector').length) * 34;
                    if (popup.height() != height) {
                        popup.stop().animate({ height: height }, 250, function () {
                            if (height == 0) $(this).remove();
                        });
                    }
                });
            }
        });

    }

    $.fn.CustSelector = function (options, values) {
        if (typeof options === 'string') {
            if (options == "get") {

                var result = new Array();
                var DivContainer = $('#' + $(this).attr('id') + '_custSelector');
                DivContainer.find('.tag-custSelector').each(function (i, item) {
                    result.push($(item).data('item'));
                });
                return result;

            } else if (options == "set") {

                var firstOptions = $(this).data('options');
                var DivContainer = $('#' + $(this).attr('id') + '_custSelector');
                DivContainer.find('.tag-custSelector').remove();
                var txtAutoComplete = DivContainer.find('input');
                $.each(values, function (i, item) {
                    if (item.code == "") item.code = 0;
                    if (DivContainer.find('[item=' + item.name + "_" + item.label + ']').length == 0) {
                        var title = ""; var value = "";
                        if (firstOptions.showproperty == 'name') { value = item.name, title = item.label }
                        if (firstOptions.showproperty == 'label') { value = item.label, title = item.name }
                        var tagItem = $('<div class="tag-custSelector right_left" title="' + title + '" item="' + item.name + "_" + item.label + '">' +
                                            (item.code == "0" ? item.name : '<a onclick="customer_Show_Info(' + item.code + ',\'' + item.name + '\');return false;">' + value + '</a>') +
                                      '</div>').data('item', item);

                        var closeBtn = $('<i class="icon-times right_left" title="Delete"></i>');
                        tagItem.append(closeBtn);
                        closeBtn.click(function () {
                            tagItem.remove();
                            firstOptions.onchange();
                        });

                        txtAutoComplete.before(tagItem);
                    }
                });
                firstOptions.onchange();

            } else if (options == "disable") {

                var DivContainer = $('#' + $(this).attr('id') + '_custSelector');
                DivContainer.addClass('disbale');
                DivContainer.find('input,.icon-times').hide();

            } else if (options == "enable") {

                var DivContainer = $('#' + $(this).attr('id') + '_custSelector');
                DivContainer.removeClass('disbale');
                DivContainer.find('input,.icon-times').show();

            }

        } else {
            return this.each(function () {
                (new $.CustSelector(options, $(this)));
            })
        }
    }

    var defaultOptions = {
        rows: 5,
        defaultPic: '../themes/resources/images/noimage.jpg',
        mode: 'email',
        allowManual: true,
        allowEmptyLable: false,
        showproperty: 'name',
        onchange: function () { }
    };

    $(document).bind('mousedown', function (e) {
        if (!$(e.target).hasClass('popup-custSelector') && $(e.target).parents('.popup-custSelector').length == 0 &&
            !$(e.target).hasClass('container-custSelector') && $(e.target).parents('.container-custSelector').length == 0) {
            $('.popup-custSelector').remove();
            $('.container-custSelector input').val('').removeClass('error');
        }
    });
});