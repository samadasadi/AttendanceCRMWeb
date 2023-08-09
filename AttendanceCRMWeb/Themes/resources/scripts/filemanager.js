$(function () {
    $.GmFileMan = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOpFm, options);
        options.topbuttons = $.extend({}, defaultOpFm.topbuttons, options.topbuttons);
        var cssView = 'view-' + options.view;

        if (Container.data("data") != null) {
            var NewOptions = Container.data("data");
            if (NewOptions.view != options.view) Container.find('.fm-container').removeClass('view-' + NewOptions.view).addClass('view-' + options.view);
            NewOptions.view = options.view;
            NewOptions.data = options.data;
            NewOptions.parent = options.parent;
            Container.data("data", NewOptions);
            bind_fm(Container);
            return false
        }

        Container.addClass(options.mode);
        Container.data('navi', [{ id: 0, parent: 0 }]);
        Container.data('p', 0);
        Container.data("data", options);
        Container.data('mnu', false);
        /* toolbar*/
        var toolbar = $('<table style="width:100%;direction:ltr;"><tr>' +
                        '<td style="width:20px;"><span id="fm_back" class="fmicon16 ico-prev" title="back"></span></td>' +
                        '<td style="width:20px;"><span id="fm_next" class="fmicon16 ico-next" title="next"></span></td>' +
                        '<td><div class="fm-address">' +
                        '    <span class="fm-btnrefresh">' +
                        '        <span class="fmicon16 ico-refresh fmrefresh" title="refresh" style="margin: 1px 6px;font-size: 13px;"></span>' +
                        '    </span>' +
                        '    <span class="FmAddressBar">/</span>' +
                        '    <span class="fmicon16 ico-folderopen fmroot" title="root" style="margin: 1px 5px;float: left;"></span>' +
                        '</div></td></tr></table>');
        for (var key in options.topbuttons) {
            if (options.topbuttons[key] != '') {
                toolbar.find('tr').append('<td style="width:20px">' + options.topbuttons[key] + '</td>');
            }
        }
        Container.append(toolbar);

        /*container*/
        Container.append(' <div class="fm-container view-' + options.view + '">' +
                         '    <div class="fm-wait" style="display:none">' +
                         '        <div class="wait"></div>' +
                         '        <span>' + options.loadingstr + '</span>' +
                         '    </div>' +
                         '    <div class="fm-overlay"></div>' +
                         '</div>');
        $(".fm-container").disableSelection();

        /*footer place*/
        if (options.footer != '') Container.append('<div class="fm-footer">' + options.footer + '</div>');

        /*contex menu */
        $(document).bind('mousedown', function (e) {
            if (e.which == 1) {
                $('.fm-menu').fadeOut('fast', function () { $(this).remove(); });
            } else if (e.which == 3) {
                if (!$(e.target).hasClass('fm-container') && !$(e.target).hasClass('fm-menu') && !$(e.target).parents('.fm-container').length != 0) {
                    $('.fm-menu').fadeOut(function () { $(this).remove(); });
                }
            }
        });
        $(document).bind('contextmenu', function (e) {
            if ($(e.target).hasClass('fm-container') || $(e.target).hasClass('fm-menu') || $(e.target).parents('.fm-container').length != 0) {
                e.preventDefault(); //disable default contex menu
            }
        });
        var Mnufunc = function (event, thistag, type) {
            if (options.menu.length == 0) return false;
            if (event.which == 1) {
                $('.fm-menu').fadeOut('fast', function () { $(this).remove(); });
            }
            else if (event.which == 3) {
                $('.fm-menu').remove();
                var Mnu = $('<div class="fm-menu"></div>');
                Mnu.css({ 'left': event.pageX + 'px', 'top': event.pageY + 'px' });
                $('body').append(Mnu.fadeIn('fast'));
                if (type == 'item') {
                    Container.find('.fm-container .fm-item').removeClass('selected');
                    $(thistag).addClass('selected');
                }
                Container.data('data').menu($(thistag), Mnu);
            }
        }
        Container.find('.fm-container').live('mousedown', function (event) { if (Container.data('mnu')) { Container.data('mnu', false, 'container'); return false; } Mnufunc(event, this, "container"); });
        Container.find('.fm-item').live('mousedown', function (event) { Container.data('mnu', true); Mnufunc(event, this, 'item'); });

        /* event*/
        Container.find('.fm-item').live('click', function () {
            Container.find('.fm-container .fm-item').removeClass('selected');
            $(this).addClass('selected');
            options.clickfunction($(this).data());
        });
        Container.find('.fm-container').click(function () {
            Container.find('.fm-container .fm-item').removeClass('selected');
            options.clickfunction(null);
        });
        Container.find('.fm-item').live('dblclick', function () {
            var data = $(this).data();
            if (data.class == "folder") {//foldere  
                Container.data('navi').splice(Container.data('p') + 1, Container.data('navi').length);
                Container.data('navi').push(data);
                Container.data('p', Container.data('navi').length - 1);
                options.bindfunction(Container.data("data").view, data.id);
            }
            else {
                options.selectfunction(data);
            }
        });
        Container.find('#fm_back').click(function () {
            if (Container.data('p') > 0) {
                Container.data('p', Container.data('p') - 1);
                options.bindfunction(Container.data("data").view, Container.data('navi')[Container.data('p')].id);
            }
        });
        Container.find('#fm_next').click(function () {
            if (Container.data('p') < Container.data('navi').length - 1) {
                Container.data('p', Container.data('p') + 1);
                options.bindfunction(Container.data("data").view, Container.data('navi')[Container.data('p')].id);
            }
        });
        Container.find('.fmrefresh').click(function () {
            options.bindfunction(Container.data("data").view, $('.fm-container').attr('item'), true);
        });
        Container.find('.FmAddressBar a,.fmroot').live('click', function () {
            var data = $(this).data();
            if ($(this).hasClass('fmroot')) data = { id: 0, parent: 0 };
            if ($('.fm-container').attr('item') == data.id) return false;
            Container.data('navi').splice(Container.data('p') + 1, Container.data('navi').length);
            Container.data('navi').push(data);
            Container.data('p', Container.data('navi').length - 1);
            options.bindfunction(Container.data("data").view, data.id, true);
        });


    }

    /*sub function*/
    function getFmItem(data, itemid) {
        for (var i = 0; i <= data.length - 1; i++) {
            if (data[i].id == itemid) return data[i];
        }
        return null;
    }
    function getAddressBar(currentId, Container) {
        var AllResult = { html: {}, parents: [] };
        var parents = new Array();
        var result = $('<div><span>/</span></div>');
        if (currentId == 0) {
            AllResult.html = result;
            AllResult.parents = [0];
            return AllResult;
        }
        parents.push(currentId);
        while (currentId != 0) {
            var item = getFmItem(Container.data('navi'), currentId);
            currentId = item.parent;
            parents.push(currentId);
            result.prepend($('<a>' + item.title + '</a>').data(item));
            result.prepend('<span>/</span>');
        }
        AllResult.html = result;
        AllResult.parents = parents;
        return AllResult;
    }

    function bind_fm(Container) {
        var parent_id = Container.data("data").parent;
        Container.find('.fm-address .FmAddressBar').html(getAddressBar(parent_id, Container).html.children()); //set address bar
        Container.find('.fm-container .fm-item').remove();

        var getThumb = function (data) {
            if (data.class == "folder") return "";
            if (data.class == "picture") {
                if (data.thumb != "") {

                    //return ('<div class="thumb" thumb="' + data.thumb + '" style="background-image: url(\'' + data.thumb + '\');"></div>');

                    return ('<div class="thumb" thumb="' + data.thumb + '">' +
                            '<img class="BeforeLoadImg" src="../Themes/resources/images/movewait2.gif">' +
                            '<img style="display:none" src="' + data.thumb + '" onLoad="$(this).parent().find(\'.BeforeLoadImg\').hide(); $(this).show();"></img>' +
                            '</div>');
                } else {
                    return ('<div class="file-icon-fm fmicon32 ico-' + data.class + '"></div>');
                }
            }
            else return ('<div class="file-icon-fm fmicon32 ico-' + data.class + '"></div>');
        };

        $.each(Container.data("data").data, function (i, item) {
            if (Container.data("data").view == "folder") {
                Container.find('.fm-container').append($('<div class="fm-item" item="' + item.id + '">' +
                                                            '<div class="' + ((item.class == "folder") ? 'fmfolder' : 'fmfile') + '">' + getThumb(item) + '</div>' +
                                                            '<span class="fm-itemtitle">' + item.filename + '</span>' +
                                                        '</div>').data(item));
            }
            /*--------------------------------------*/
            if (Container.data("data").view == "tiles") {
                Container.find('.fm-container').append($('<div class="fm-item" item="' + item.id + '">' +
                                                              '<div class="' + ((item.class == "folder") ? 'fmfolder' : 'fmfile') + ' right_left">' + getThumb(item) + '</div>' +
                                                              '<div class="fm-itemtitle">' + item.filename + '</div>' +
                                                              '<div class="fm-itemtype">' + item.class + '</div>' +
                                                         '</div>').data(item));
            }
            /*--------------------------------------*/
        });



        Container.find('.fm-container').attr('item', parent_id);
    }

    $.fn.GmFileMan = function (options) {
        if (typeof options == "string") {
            if (options == "mask") { $(this).find('.fm-wait,.fm-overlay').show(); }
            if (options == "unmask") { $(this).find('.fm-wait,.fm-overlay').hide(); }
            if (options == "parent") return $(this).data('data').parent;
            if (options == "parents") return getAddressBar($(this).data('data').parent, $(this)).parents;
            if (options == "clipbourd") return $(this).data('clipbourd');
            if (options == "clearclipbourd") return $(this).data('clipbourd', null);
        } else {
            if (options.hasOwnProperty("clipbourd")) {
                $(this).data('clipbourd', options);
            }
            if (options.hasOwnProperty("callback")) $(this).data('data').selectfunction = options.callback;
            else {
                return this.each(function () {
                    (new $.GmFileMan(options, $(this)));
                });
            }
        }
    };

    var defaultOpFm = {
        bindfunction: function () { }, //function(show_type,parent);
        selectfunction: function () { },
        clickfunction: function () { },
        mode: 'fm-static',
        loadingstr: 'loading',
        topbuttons: {
            addfolder: '<span class="fmaddfolder fmicon16 ico-plusfolder" title="add folder" ></span>',
            link: '<span class="fmfilelink fmicon16 icon-link" title="link"></span>',
            upload: '<span class="fmuploadfile fmicon16 ico-upload" title="upload"></span>'
        },
        footer: '',
        view: 'folder',
        parent: 0,
        data: [],
        menu: []
    };
});

$(function () {
    $.GmMenu = function (options, Container) {
        options = $.extend({}, defaultOpMnu, options);
        Container.empty();
        var tbl = $('<table></table>');
        for (var i = 0; i <= options.items.length - 1; i++) {
            var item = options.items[i];
            if (typeof item == "string") {
                if (item == "split") tbl.append('<tr class="mnu-split"><td></td><td class="tdsplit"></td></tr>');
            }
            else {
                var enable = true;
                if (item.hasOwnProperty("enable")) enable = item.enable;
                tbl.append($('<tr class="mnu-item enable-' + enable + '">' +
                                  '<td class="mnu-item-ico">' + ((item.hasOwnProperty("icon")) ? item.icon : '') + '</td>' +
                                  '<td class="mnu-item-title">' + item.title + '</td>' +
                             '</tr>').data(item));
            }
        }
        Container.append(tbl);


        Container.find('.mnu-item').live('click', function () {
            if ($(this).data().hasOwnProperty('callback') && !$(this).hasClass('enable-false')) $(this).data().callback(options.e);
        });
    }

    $.fn.GmMenu = function (options) {
        return this.each(function () {
            (new $.GmMenu(options, $(this)));
        });
    };

    var defaultOpMnu = {
        e: {},
        items: []
    };
});