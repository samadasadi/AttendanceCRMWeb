
$(function () {
    $.MultiGroupSelector = function (options, Container) {

        var $head = $("head");
        var $headlinklast = $head.find("link[rel='stylesheet']:last");
        var linkElement = '';
        linkElement += "<link type='text/css' href='../Themes/resources/css/ui.all" + resources.lang + ".css' media='screen' rel='stylesheet' />";
        linkElement += "<script type='text/javascript' src='../Themes/resources/scripts/fg.menu.js'></script>";
        linkElement += "<link href='../Themes/resources/css/User_GroupCustomer.css' rel='stylesheet' />";
        if ($headlinklast.length) {
            $headlinklast.after(linkElement);
        }
        else {
            $head.append(linkElement);
        }

        var FirstOption = options;
        options = $.extend({}, defaultOptions, options);
        Container.data('options', options);
        Container.after('<input type="hidden" id="' + options.mode + '_DeleteIds" value=""/>')
        Container.addClass('MultiGroupSelector');

        var str = '';
        str += ' <div id="' + options.content + '" class="hidden">';
        str += '     <span id="' + options.content + '_Lbl"></span>';
        str += ' </div>';
        Container.append(str)

        var createMultiGroup = function () {
            var e = {
                d: $('#HFdomain').val(),
                u: $('#HFUserCode').val(),
                c: $('#HFcodeDU').val(),
                o: {},
                ReplaceFunc: options.callback_str
            };
            e.o.mode = options.mode
            e.o.firstSelect = options.firstSelect
            $.ajax({
                type: "POST", url: "../pages/MultiGroupSelector.aspx/get_group", contentType: "application/json; charset=utf-8", dataType: "json",
                data: JSON.stringify(e), success: function (c) {
                    if (c.d[0] == true) {
                        $('#' + options.content + '_Lbl').html(c.d[1]);
                        Container.menuA({
                            content: $('#' + options.content).html(),
                            backLink: options.backLink
                        });
                    }
                }
            });
        }

        createMultiGroup();

        //if selected group call this function
        window[options.callback_str] = function (code, name) {
            if (options.callback && typeof (options.callback) === "function" && options.appendTagBeforeCallback == false) {
                options.callback(code, name);
            } else {
                // if not callbacl function then append
                if (Container.find('[code_' + options.mode + '=' + code + ']').length != 0)
                    return false;

                if (options.multiSelect == false && options.appendTagBeforeCallback == false) {
                    Container.MultiGroupSelector('clear');
                }

                Container.append(generateTag(code, name, Container));

                if (options.appendTagBeforeCallback == true) options.callback(code, name);

            }
        }
    }

    function generateTag(code, name, Container) {
        var tag = $('<div>').addClass('tag-groupSelector right_left');
        tag.append(name);
        var options = Container.data('options');
        tag.attr('code_' + options.mode, code);
        tag.attr('Mode', options.mode);

        if (options.multiSelect == true || options.allowNull == true) {
            var delTag = $('<i>').addClass('icon-times right_left');
            tag.append(delTag);
            delTag.click(function (event) {
                var CountSelect = Container.MultiGroupSelector('get').length;
                if (CountSelect == options.minimumNumberOfSelected)
                    return false;

                if ($('#' + options.mode + '_DeleteIds').val() == '')
                    $('#' + options.mode + '_DeleteIds').val(tag.attr('code_' + options.mode));
                else {
                    if ($('#' + options.mode + '_DeleteIds').val())
                        $('#' + options.mode + '_DeleteIds').val($('#' + options.mode + '_DeleteIds').val() + ',' + tag.attr('code_' + options.mode));

                }

                tag.remove();
                event.stopPropagation();
            });
        }

        return tag;
    }

    function DeleteTagsId(Container) {
        var DeleteIds = 0;
        var options = Container.data('options');
        DeleteIds = $('#' + options.mode + '_DeleteIds').val();
        return DeleteIds;
    }

    function Clear(Container) {
        var options = Container.data('options');
        $('#' + options.mode + '_DeleteIds').val('');
    }

    $.fn.MultiGroupSelector = function (options, values) {
        if (typeof options === 'string') {
            var Container = $(this);
            var ContOptions = Container.data('options');

            if (options == "get") {
                var arrResult = new Array();
                Container.find('.tag-groupSelector').each(function (i, item) {
                    var me = $(item);
                    var temp = {};
                    temp.name = me.text();
                    temp.code = me.attr('code_' + (me.attr('Mode')));
                    arrResult.push(temp);    ////////////////////////////////////////////////////////////////////
                })
                return arrResult;

            }
            else if (options == "set") {
                $.each(values, function (i, item) {
                    Container.append(generateTag(item.code, item.name, Container));
                });
            }
            else if (options == "disable") {
                Container.addClass("disabled");
                Container.after("<div id='MultiGroupSelectorDisabled' class='MultiGroupSelectorDisabled'></div>");
                Container.next().filter('[id=MultiGroupSelectorDisabled]').attr("style", Container.attr("style"))
            }
            else if (options == "enable") {
                Container.removeClass("disabled");
                Container.next().filter('[id=MultiGroupSelectorDisabled]').remove();
               
            }
            else if (options == "clear") {
                Container.html('');
                Clear(Container);
            }
            else if (options == "GetDeleteIDs") {
                return DeleteTagsId(Container);
            }
            else if (options == "clearDeleteIDs") {
                Clear(Container);
            }

        } else {
            return this.each(function () {
                (new $.MultiGroupSelector(options, $(this)));
            })
        }
    }

    var defaultOptions = {
        mode: '',
        callback_str: 'func',
        content: 'Sample_content',
        backLink: false,
        multiSelect: true,
        minimumNumberOfSelected: 0,
        firstSelect: false,
        allowNull:false,
        callback: '',
        appendTagBeforeCallback: false
    };
});

