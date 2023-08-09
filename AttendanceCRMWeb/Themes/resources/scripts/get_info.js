
var get_info = new get_info_data;

function get_info_data() {

    this.getUser_ByGroupUrl = "../WebServices/get_info.asmx/getUser_ByGroup";
    this.getUser_ByGroup = function (c, e) { this.POST(this.getUser_ByGroupUrl, c, e) };
    //this.getlist_nowUrl = "../WebServices/Calendar_service.asmx/get_now_list";
    //this.getlist_now = function (c, e) { this.POST(this.getlist_nowUrl, c, e) };
    this.voice_inbox_property = function (c, e) { this.POST( "../WebServices/get_info.asmx/voice_inbox_property", c, e) };
    this.report_property = function (c, e) { this.POST("../WebServices/get_info.asmx/report_property", c, e) };
    //this.fax_select = function (c, e) { this.POST("../WebServices/get_info.asmx/fax_select", c, e) };
    //this.fax_archive_ = function (c, e) { this.POST("../WebServices/get_info.asmx/fax_archive_", c, e) };
    //this.fax_send= function (c, e) { this.POST("../WebServices/get_info.asmx/fax_send_", c, e) };
    this.account_property = function (c, e) { this.POST("../WebServices/get_info.asmx/account_property", c, e) };
    this.letter_steps = function (c, e) { this.POST("../WebServices/get_info.asmx/letter_steps", c, e) };
    this.letter_view = function (c, e) { this.POST("../WebServices/get_info.asmx/letter_view", c, e) };
    //this.form_info = function (c, e) { this.POST("../WebServices/get_info.asmx/form_info", c, e) };
    this.letter_result = function (c, e) { this.POST("../WebServices/get_info.asmx/letter_result", c, e) };
    this.letter_ready_property = function (c, e) { this.POST("../WebServices/get_info.asmx/letter_ready_property", c, e) };
    this.get_ticket = function (c, e) { this.POST("../WebServices/get_info.asmx/get_ticket", c, e) };
    this.close_ticket1 = function (c, e) { this.POST("../WebServices/get_info.asmx/close_ticket1", c, e) };
    this.support_search_with_cus = function (c, e) { this.POST("../WebServices/get_info.asmx/support_search_with_cus", c, e) };
    this.search_customer_byName = function (c, e) { this.POST("../WebServices/get_info.asmx/search_customer_byName", c, e) };
    this.felicity_property = function (c, e) { this.POST("../WebServices/get_info.asmx/felicity_property", c, e) };
    this.support_User = function (c, e) { this.POST("../WebServices/get_info.asmx/support_User", c, e) };
    this.user_show = function (c, e) { this.POST("../WebServices/get_info.asmx/user_show", c, e) };

    this.account_flow = function (c, e) { this.POST("../WebServices/get_info.asmx/account_flow", c, e) };
    this.smsReply_edit = function (c, e) { this.POST("../WebServices/get_info.asmx/smsReply_edit", c, e) };
    this.smsSender_edit_property = function (c, e) { this.POST("../WebServices/get_info.asmx/smsSender_edit_property", c, e) };
    this.email_user_group = function (c, e) { this.POST("../WebServices/get_info.asmx/email_user_group", c, e) };
    this.email_customer_group = function (c, e) { this.POST("../WebServices/get_info.asmx/email_customer_group", c, e) };
    this.Email_sender_property = function (c, e) { this.POST("../WebServices/get_info.asmx/Email_sender_property", c, e) };


    this.get_RatingTicket = function (c, e) { this.POST("../WebServices/get_info.asmx/get_RatingTicket", c, e) };
    
    //this.email_receiver_property = function (c, e) { this.POST("../WebServices/get_info.asmx/email_receiver_property", c, e) };
 
    this.user_group_list_email = function (c, e) { this.POST("../WebServices/get_info.asmx/user_group_list_email", c, e) };
    this.cust_group_list_email = function (c, e) { this.POST("../WebServices/get_info.asmx/cust_group_list_email", c, e) };
    this.show_Specifications = function (c, e) { this.POST("../WebServices/get_info.asmx/show_Specifications", c, e) };
    this.cust_group_list_fax = function (c, e) { this.POST("../WebServices/get_info.asmx/cust_group_list_fax", c, e) };
    this.log_ivr_info_table = function (c, e) { this.POST("../WebServices/get_info.asmx/log_ivr_info_table", c, e) };
    this.cust_group_list_tel = function (c, e) { this.POST("../WebServices/get_info.asmx/cust_group_list_tel", c, e) };

    this.Get_parametr_forms = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_parametr_forms", c, e) };
    this.Get_list_form = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_list_form", c, e) };
    this.Get_All_form_name = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_All_form_name", c, e) };
    this.Get_All_field_by_fieldid = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_All_field_by_fieldid", c, e) };
    this.Get_All_field_name = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_All_field_name", c, e) };
    this.Get_parametr_listed = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_parametr_listed", c, e) };
    this.user_group_list = function (c, e) { this.POST("../WebServices/Forms_script.asmx/user_group_list", c, e) };
    this.form_edit = function (c, e) { this.POST("../WebServices/Forms_script.asmx/form_edit", c, e) };
    this.Get_form_comment = function (c, e) { this.POST("../WebServices/Forms_script.asmx/Get_form_comment", c, e) };
    //this.form_info_show = function (c, e) { this.POST("../WebServices/Forms_script.asmx/form_info_show", c, e) };

    this.POST = function (c, e, d) { e = JSON.stringify(e); $.post_(c, e, function (c) { d && d(c); }, "json") };

    
    }
    var mode_get_list = '';
    var orderRunTs = { Mnew: { order: 'time', orderDir: 'desc', taskUserWf: null }, Mold: { order: 'time', orderDir: 'desc', taskUserWf: null} }
 

    function getWfTaskDay(List_idTs) {
        var result = new Array();
        var checkList = function (list, id) {
            for (j = 0; j <= list.length - 1; j++) {
                if (list[j].id_ts == id) return true;
            }
            return false;
        }
        for (m = 0; m <= orderRunTs.Mnew.taskUserWf.length - 1; m++) {
            var itemM = orderRunTs.Mnew.taskUserWf[m];
            for (n = 0; n <= itemM.item.length - 1; n++) {
                var itemN = itemM.item[n];
                if (checkList(List_idTs, itemN.id_ts)) result.push(itemN);
            }
        }
        return result;
    }


function _ajax_request(c, e, d, f, g, k) {
    jQuery.isFunction(e) && (d = e, e = {});
    return jQuery.ajax({ type: "POST", url: c, data: e, success: d, dataType: f, contentType: k })
}
jQuery.extend({ get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
    put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
    post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
    delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
});



 