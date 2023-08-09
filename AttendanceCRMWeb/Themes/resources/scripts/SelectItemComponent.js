

$(function () {

    $.fn.selectItemComponent = function (options, id, text, mode) {

        if (typeof options === 'string') {
            var container = $(this);
            if (options == "get") {
                var retid = container.find(".TxtSelectItemComponent").attr("resultid");
                var rettext = container.find(".TxtSelectItemComponent").find('a').html();
                return { 'id': retid, 'text': rettext };
            }
            else if (options == "clear") {
                container.find(".TxtSelectItemComponent").attr("resultid", "");
                container.find(".TxtSelectItemComponent").html("");
                container.find(".BtnRemoveSelectItemComponent").hide();
                    
            } else if (options == "disable") {
                container.addClass('disable');
            } else if (options == "enable") {
                container.removeClass('disable');
            } else if (options == "set") {
                if (id == null) id = "";
                if (text == null || text == "") {
                    text = "";
                    $(container).find(".BtnRemoveSelectItemComponent").hide();
                }
                else
                    $(container).find(".BtnRemoveSelectItemComponent").css('display', 'inline-block');

                if (container != null && container != undefined) {
                    switch (mode) {
                        case 1:
                            container.find(".TxtSelectItemComponent").attr("resultid", id);
                            container.find(".TxtSelectItemComponent").html('<a>' + text + '</a>');
                            if (id != "") container.find(".TxtSelectItemComponent").find('a').click(function () { showfactorInfo(id, ''); });
                            break;
                        case 2:
                            container.find(".TxtSelectItemComponent").attr("resultid", id);
                            container.find(".TxtSelectItemComponent").html('<a>' + text + '</a>');
                            if (id != "") container.find(".TxtSelectItemComponent").find('a').click(function () { showSaleInfo(id, ''); });
                            container.find(".TxtSelectItemComponent").css("line-height", '20px');
                            break;
                        case 3:
                            container.find(".TxtSelectItemComponent").attr("resultid", id);
                            container.find(".TxtSelectItemComponent").html(text);
                            break;
                        default:
                            break;
                    }
                }
            }
        } else {
            var result;
            this.each(function () {
                result = (new $.selectItemComponent(options, $(this)));
            })
            return result;
        }
    };

    //-----------------------------------------------------------------------------

    $.selectItemComponent = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptionssearch_component, options);

        var innerhtm = '<div class="BtnSelectItemComponent" > <i class="' + options.icon + '"></i> </div>' +
                       '<div class="TxtSelectItemComponent"></div>' +
                       '<span class="BtnRemoveSelectItemComponent"><i class="icon-remove"></i></span>'

        Container.html(innerhtm);
        Container.addClass('selectItemComponent');
        if (resources.lang == "en") Container.addClass('SelectItemComponentEn');


        Container.find('.BtnSelectItemComponent').click(function () {
            switch (options.modeSearch) {
                case 1:
                    show_factor_search(function (item) {
                        Container.find(".TxtSelectItemComponent").html('<a onclick="showfactorInfo(' + FacId + ',\'' + FacCode + '\');">' + FacCode + '</a>');
                        Container.find(".TxtSelectItemComponent").attr("resultid", FacId);
                        Container.find(".BtnRemoveSelectItemComponent").css('display', 'inline-block');
                        options.callback(item);
                        if (options.closedialogafterSelect == true) $('#UCdialog_searchFactor').dialog('close');
                    }, 2);
                    break;
                case 2:
                    show_sale_search(function (item) {
                        Container.find(".TxtSelectItemComponent").attr("resultid", item.saleId);
                        Container.find(".TxtSelectItemComponent").html('<a onclick="showSaleInfo(' + item.saleId + ',\'' + item.saleTxt + '\');">' + item.saleTxt + '</a>');
                        Container.find(".TxtSelectItemComponent").css("line-height", '20px');
                        Container.find(".BtnRemoveSelectItemComponent").css('display', 'inline-block');
                        options.callback(item);
                        if (options.closedialogafterSelect == true) {
                            $('#UCdialog_searchSale').find('.oder').hide();
                            $('#UCdialog_searchSale').dialog('close');
                        } 
                    });
                    break;
                case 3:
                    show_doc_search(function (item) {
                        Container.find(".TxtSelectItemComponent").html(item.doc_code);
                        Container.find(".TxtSelectItemComponent").attr("resultid", item.ID);
                        Container.find(".BtnRemoveSelectItemComponent").css('display', 'inline-block');
                        options.callback(item);
                        if (options.closedialogafterSelect == true) $('#UCdialog_searchDoc').dialog('close');
                    });
                    break;
                default:
                    break;
            }
        });

        Container.find('.icon-remove').click(function () {
            Container.find(".TxtSelectItemComponent").html("");

            if (options.modeSearch == 2)
                Container.find(".TxtSelectItemComponent").attr("resultid", "-2");
            else
                Container.find(".TxtSelectItemComponent").attr("resultid", "");

            Container.find(".BtnRemoveSelectItemComponent").hide();
           
            if (options.modeSearch == 1) {
                $('#TxtSaleAmountFinal').val("");
                $('#TxtSaleAmountFinal').attr('disabled', false);
                try { $('#TxtEditSaleFinalPrice').val(""); } catch (e) { }
                try { $('#TxtEditSaleFinalPrice').attr('disabled', false); } catch (e) { }
                try { clearFactor() } catch (e) { }
            };

            if (options.modeSearch == 3) {
                getNewCodeMain('#TxtCodeDocMain');
            };

        });

    };

    //-----------------------------------------------------------------------------

    var defaultOptionssearch_component = {
        modeSearch: 1,
        icon: "icon-dollar",
        callback: function (data) { },
        closedialogafterSelect: true,
    };

});

