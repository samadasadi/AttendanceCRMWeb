/* MultiGroupSelector
   version 1.0.0 */

$(function () {

    // bind component
    $.fn.CustomerSearch = function (options, data) {
        if (typeof options === 'string') {
            var container = $(this);
            if (options == "get") {
                //var ret_ = container.data('data');
                //if (ret_ == undefined) {
                //    return []
                //} else {
                //    return ret_
                //}
            } else if (options == "clear") {
                //container.data('data', []);
                //container.empty();
            } else if (options == "disable") {
               // container.addClass('disable');
            } else if (options == "enable") {
               // container.removeClass('disable');
            } else if (options == "set") {
                //container.empty();
                //$.each(data, function (i, item) {
                //    container.append(generateReturnItemCustomerChoice(item));
                //});
                //container.data('data', data);
            }

        } else {

            var result;
            this.each(function () {
                result = (new $.CustomerSearch(options, $(this)));
            })
            return result;

        }

    };



    $.CustomerSearch = function (options, Container) {
        var FirstOption = options;
        options = $.extend({}, defaultOptionsCustomerSearch, options);

        //call click function
        Container.click(function (e) {
            if (Container.hasClass('disable')) return false;
            //Load Component
            if ($('#UCdialog_WU_Cus_search_Component').length == 0) {//if ghablan uc ro load nakarde bood
                load_uc('WU_Cus_search_Component', "", options.title, {
                    //  callback_Str: callback_Str //Send Elenetes
                    'modeSearch': options.modeSearch,
                    'multiSelect': options.multiSelect,
                    'callback': options.callback
                },
                      {//dialog Property
                          width: 700, modal: true, minWidth: 350,
                          open: function () {
                              openDialog($(this));
                              $("#dialog_cus_search_Component #chk_serahc_cus_one").removeAttr("checked");
                              $('#dialog_cus_search_Component .btnserach_select_selected').hide();
                              $('#dialog_cus_search_Component .btnsearch_back').click();
                              $("#dialog_cus_search_Component #dialog_cus_search").unmask();

                          }
                      });
            }
            else {//if dilaog is loade then call open dialog
                 $('#UCdialog_WU_Cus_search_Component').data({
                    //  callback_Str: callback_Str //Send Elenetes
                    'modeSearch': options.modeSearch,
                    'multiSelect': options.multiSelect,
                    'callback': options.callback
                 })
                 UCParam = {
                     //  callback_Str: callback_Str //Send Elenetes
                     'modeSearch': options.modeSearch,
                     'multiSelect': options.multiSelect,
                     'callback': options.callback
                 }
                 modeSearchComponent_ = UCParam.modeSearch;
                 multiSelect_ = UCParam.multiSelect;
                $("#UCdialog_WU_Cus_search_Component").dialog("open");
            }
             
        });



    };

     var modeSearchEnum ={search:'search',email:'email',sms:'sms'}
    var defaultOptionsCustomerSearch = {
        multiSelect: true,
        searchPro:true,
        modeSearch: modeSearchEnum.search,
        title: resources.customer_search,
        onSelect: function () { },
        callback: function () { }
    };

});



//if (callback && typeof (callback) === "function") {
//    callback();
//}


