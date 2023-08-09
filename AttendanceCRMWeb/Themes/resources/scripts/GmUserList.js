
/*---------------Gm User Select-------------*/
function pokeGmUserList() {
    $('.GmSelect').each(function () {
        var thisDrd = $('#' + $(this).attr('id').replace('Gm_', ''));
        var options_ = thisDrd.data('options');
        $(this).find('.GmUsercode').text((thisDrd.val() == "" || thisDrd.val() == null) ? thisDrd.find('option:selected').text() : thisDrd.val());
        $(this).find('.GmUsername').text(thisDrd.find('option:selected').text());
        if (options_.showSelectedUserCodeLabel == false) {
            $(this).find('.GmUsercode').hide();
        }
        if (thisDrd.find('option:selected').attr('picture') != "")
            $(this).find('.imgUserCover').html('<img src="' + thisDrd.find('option:selected').attr('picture') + '" style="width:26px;height:26px"/>');
        else
            $(this).find('.imgUserCover').html($(this).attr('defaultPic'));

        if (thisDrd.attr('disabled')) {
            $(this).addClass('disable').removeClass('enable');
            $(this).find('.gmdrdtoggle').hide();
        }
        else {
            $(this).addClass('enable').removeClass('disable');
            $(this).find('.gmdrdtoggle').show();
        }
    });
}


$(function () {
    var ListGmDrd = new Array();

    $.fn.GmUserList = function (options,data) {
        if (typeof options === 'string') {
            var container = $(this);
            if (options == "get") {

                return container.val();

            } else if (options == "clear") {
                container.val("");
                pokeGmUserList();
            } else if (options == "poke") {

                pokeGmUserList();

            } else if (options == "disable") {

                container.attr("disabled", "true");
                pokeGmUserList();

            } else if (options == "enable") {

                container.removeAttr("disabled");
                pokeGmUserList();

            } else if (options == "set") {
                container.val(data);
                pokeGmUserList();
            }

        } else {
            return this.each(function () {
                (new $.GmUserList(options, $(this)));
            });
        };
      };
  

    $.GmUserList = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptions, options);


        var e = {};
        var send_ = {};
        e.user_code= $('#HFUserCode').val();
        e.codeing= $('#HFcodeDU').val();
        e.domain= $('#HFdomain').val();
        e.rnd= $('#HFRnd').val();
        send_.items = e;
        $.ajax({
            type: "POST", url: "../webservices/get_info.asmx/get_ListOfUser",
            data: JSON.stringify(send_), contentType: "application/json; charset=utf-8", dataType: "json",
            success: function (c) {
                    $('.property-mng-list .wait').hide();
                    Container.empty();
                    Container.append('<option value="' + options.defaultValue + '"  cust_code="0" picture="">' + options.defaultText + '</option>');
                    $.each(c.d, function (i, item) {
                        Container.append('<option cust_code="' + item.cust_code + '" picture="' + item.picture + '"  value="' + item.user_code + '">' + item.name + '</option>');
                    });

                    createGmUserList(Container, options);
                  //  options.callback();
             
            }
        });


        createGmUserList = function (Container, options) {
            Container.hide();
            Container.data('options', options);
            Container.attr('onChange', 'pokeGmUserList()');
            $("#Gm_" + Container.attr("id")).remove();
            Container.after('<div id="Gm_' + Container.attr("id") + '" class="GmSelect GmSelectItem right_left"></div>');
            var Pic = options.defaultPic;
            if (Container.find('option:selected').attr('picture')) Pic = '<img src="' + Container.find('option:selected').attr('picture') + '" style="width:26px;height:26px;"/>';
            var select = $("#Gm_" + Container.attr("id"));
            select.attr('defaultPic', Pic);
            var appendDisplay = '';
            var appendTopElem = '';
            if (options.showSelectedUserCodeLabel == false) {
                appendTopElem = "margin-top: 0px;"
                appendDisplay = "display:none;";
            }
            select.append('<span class="Crm-icon Crm-icon16 right_left gmdrdtoggle icon-angle-down" style=" margin: 8px 5px;"></span>' +
                                 '<div class="imgUserCover left_right">' + Pic + '</div>' +
                                 '<div style="' + appendTopElem + '" class="GmUsername">' + Container.find('option:selected').text() + '</div>' +
                                 '<div style="' + appendDisplay + '" class="GmUsercode">' + ((Container.val() == null || Container.val() == "") ? Container.find('option:selected').text() : Container.val()) + '</div>');
            if (Container.attr('disabled')) {
                select.addClass('disable').removeClass('enable');
                select.find('.gmdrdtoggle').hide();
            }
            else {
                select.addClass('enable').removeClass('disable');
            }

            select.disableSelection();
            select.css('width', options.width);

            if (ListGmDrd.indexOf(Container.attr("id")) == -1) ListGmDrd.push(Container.attr("id")); else return false; //tavabe ra faght yekbar barash set mikone ke moshkel pish nayad
            $("#Gm_" + Container.attr("id")).live('click', function () {
                if ($(this).hasClass('disable')) return false;
                if ($('.GmPanelDrd').attr('item') == Container.attr("id")) {
                    $('.GmPanelDrd').slideUp('fast', function () { $(this).remove(); });
                    return false; // agar ghablan bara in drd baz bood dg dobare nasaz
                }
                $('.GmPanelDrd').remove();
                var listUsers = $('<div class="GmPanelDrd" item="' + Container.attr("id") + '"></div>');

                //search panel
                if (options.search) {
                    listUsers.append('<div class="GmDrdSearchPanel">' +
                                            '<span class="CapSearch">' + options.searchStr + '</span>' +
                                            '<input type="text" id="GmDrdSearchInput" />' +
                                         '</div>');
                }

                //drd items
                var tableItems = $('<div class="GmDrdDivItems"><table></table></div>');
                var i = 0;
                while (i < Container.find("option").length) {
                    var Tr = $("<tr></tr>");
                    for (var j = 0; j <= options.cols - 1; j++) {
                        if (Container.find("option").eq(i).length != 0) {
                            var online = "";
                          //  if (options.showOnline)
                                //$('#dv_mblist a').each(function () {
                                //    if ($(this).text() == Container.find("option").eq(i).val()) online = '<div title="Online" class="ico-status ico-1 left_right"></div>';
                                //});
                            Tr.append('<td class="tdGmUser"style="width:' + options.width + '">' + '<div class="GmSelectItem">' +
                                                '<div class="imgUserCover right_left wait" style="background-repeat: no-repeat;background-position: center;">' + ((Container.find("option").eq(i).attr('picture') == "") ? options.defaultPic : '<img src="' + Container.find("option").eq(i).attr('picture') + '" style="width:26px;height:26px"/>') + '</div>' +
                                                '<div class="GmUsername" style="margin: 0;padding-top: 4px;">' + Container.find("option").eq(i).text() + '</div>' +
                                                  online +
                                                '<div class="GmUsercode">' +((Container.find("option").eq(i).val()=="0")? "" : Container.find("option").eq(i).val()) + '</div>' +
                                                '</div></td>');
                        }
                        else {
                            Tr.append('<td style="width:' + options.width + '">&nbsp;</td>');
                        }
                        if (Container.val() == Container.find("option").eq(i).val()) Tr.find('td:last').addClass('selected');
                        i++;
                    }
                    tableItems.find('table').append(Tr);
                }

                var RowCount = Math.ceil(Container.find("option").length / options.cols);
                var rowHeight = 33;
                var HeightShow = RowCount * rowHeight + ((options.search) ? 31 : 0) + 5;
                if (RowCount > options.rows) {
                    tableItems.css({ 'overflow-y': 'scroll', 'height': options.rows * rowHeight + 5 });
                    HeightShow = options.rows * rowHeight + ((options.search) ? 31 : 0) + 5;
                }
                listUsers.css('width', options.width.replace("px", '') * options.cols);
                listUsers.append(tableItems);

                listUsers.css('width', options.cols * options.width);
                listUsers.css('left', ($(this).offset().left - ((options.cols - 1) * $(this).width())));
                listUsers.css('top', ($(this).offset().top + $(this).height() + 2));
                listUsers.disableSelection();
                $('body').append(listUsers.animate({ "height": HeightShow }, 'fast'));
                $('#GmDrdSearchInput').focus();
            });

            $('.GmPanelDrd:[item=\'' + Container.attr("id") + '\'] .tdGmUser').live('click', function () {
                if (Container.val() != $(this).find('.GmUsercode').text()) {
                    Container.val($(this).find('.GmUsercode').text()).attr('selected', 'selected');
                    Container.change();
                    $('.GmPanelDrd').slideUp('fast', function () { $(this).remove(); });
                    pokeGmUserList();
                }
            });

            options.callback();
        }




    }



    var defaultOptions = {
        width: '200px',
        cols: 2,
        rows: 10,
        defaultPic: '<span class="Crm-icon Crm-icon16 mark_image Crm-icon-person-black" style="line-height: 27px;padding: 0px 2px 0px 2px;background-color: #fff;"></span>',
        showOnline: false,
        search: true,
        searchStr: 'Search',
        defaultText: resources.Please_select,
        defaultValue: '',
        showSelectedUserCodeLabel: true,
        callback: function () { }
    };

    $(document).bind('mousedown', function (e) {
        if (!$(e.target).hasClass('GmPanelDrd') && $(e.target).parents('.GmPanelDrd').length == 0
             && !$(e.target).hasClass('GmSelect') && $(e.target).parents('.GmSelect').length == 0) {
            $('.GmPanelDrd').slideUp('fast', function () { $(this).remove() });
        }
    });

    $('#GmDrdSearchInput').live('keyup', function (e) {
        var thisPanel = $(this).parents('.GmPanelDrd');
        var thisInput = $(this);
        thisPanel.find('.tdGmUser').show();
        thisPanel.find('.tdGmUser').each(function () {
            if ($(this).find('.GmUsercode').text().indexOf(thisInput.val()) == -1 && $(this).find('.GmUsername').text().indexOf(thisInput.val()) == -1) $(this).hide();
        });
    });
});
/*--------------END-Gm User Select-------------*/