

function Cbool(input) {
    if (input == null) return false;
    if (input.toString().toLowerCase() == "true") return true; else return false;
}
function validinput(inputName) {
    var result = true
    var regex = /[0-9]|\./;
    if (!regex.test($(inputName).val())) {
        result = false;
    }
    return result;
}



var Client = new GetJsonData;

function GetJsonData() {

    this.getUser_ByGroupUrl = "../WebServices/workflow_.asmx/getUser_ByGroup";
    this.getUser_ByGroup = function (c, e) {
        this.POST(this.getUser_ByGroupUrl, c, e)
    };
    //--------------<<
    this.getCartable_TemplateUrl = "../WebServices/workflow_.asmx/getCartable_Template";
    this.getCartable_Template = function (c, e) {
        this.POST(this.getCartable_TemplateUrl, c, e)
    };
    //--------------<<
    this.getTemplate_ByIDUrl = "../WebServices/workflow_.asmx/getTemplate_ByID";
    this.getTemplate_ByID = function (c, e) {
        this.POST(this.getTemplate_ByIDUrl, c, e)
    };
    //--------------<<
    this.Get_list_SelectUrl = "../WebServices/workflow_.asmx/Get_list";
    this.Get_list_Select = function (c, e) {
        this.POST(this.Get_list_SelectUrl, c, e)
    };
    //--------------<<
    this.Get_parametr_list_SelectUrl = "../WebServices/workflow_.asmx/Get_parametr_listed";
    this.Get_parametr_list_Select = function (c, e) {
        this.POST(this.Get_parametr_list_SelectUrl, c, e)
    };
    //--------------<<
    this.save_WorkflowUrl = "../WebServices/workflow_.asmx/save_Workflow";
    this.save_Workflow = function (c, e) {
        this.POST(this.save_WorkflowUrl, c, e)
    };
    //--------------<<
    this.get_WorkflowUrl = "../WebServices/workflow_.asmx/get_Workflow";
    this.get_Workflow = function (c, e) {
        this.POST(this.get_WorkflowUrl, c, e)
    };
    //--------------<<
    this.get_WorkflowByIDUrl = "../WebServices/workflow_.asmx/get_WorkflowByID";
    this.get_WorkflowByID = function (c, e) {
        this.POST(this.get_WorkflowByIDUrl, c, e)
    };
    //--------------<<
    this.get_WorkflowByIDRepUrl = "../WebServices/workflow_.asmx/get_WorkflowByIDRep";
    this.get_WorkflowByIDRep = function (c, e) {
        this.POST(this.get_WorkflowByIDRepUrl, c, e)
    };
    //--------------<<
    this.Delete_WfUrl = "../WebServices/workflow_.asmx/Delete_Wf";
    this.Delete_Wf = function (c, e) {
        this.POST(this.Delete_WfUrl, c, e)
    };
    //--------------<<
    this.run_TaskUserUrl = "../WebServices/workflow_.asmx/run_UserTask";
    this.run_TaskUser = function (c, e) {
        this.POST(this.run_TaskUserUrl, c, e)
    };
    //--------------<<
    this.Email_UserGroupUrl = "../WebServices/get_info.asmx/user_group_list_email";
    this.Email_UserGroup = function (c, e) {
        this.POST(this.Email_UserGroupUrl, c, e)
    };
    //--------------<<
    this.Email_CustomerUrl = "../WebServices/get_info.asmx/cust_group_list_email";
    this.Email_Customer = function (c, e) {
        this.POST(this.Email_CustomerUrl, c, e)
    };
    //--------------<<
    this.cust_group_list_faxUrl = "../WebServices/get_info.asmx/cust_group_list_fax";
    this.cust_group_list_fax = function (c, e) {
        this.POST(this.cust_group_list_faxUrl, c, e)
    };
    //--------------<<
    this.getTask_UserUrl = "../WebServices/workflow_.asmx/getTask_User";
    this.getTask_User = function (c, e) {
        this.POST(this.getTask_UserUrl, c, e)
    };
    //--------------<<
    this.run_wfUrl = "../WebServices/workflow_.asmx/run_wf";
    this.run_wf = function (c, e) {
        this.POST(this.run_wfUrl, c, e)
    };
    //--------------<<
    this.getWorkflow_StartUrl = "../WebServices/workflow_.asmx/getWorkflow_Start";
    this.getWorkflow_Start = function (c, e) {
        this.POST(this.getWorkflow_StartUrl, c, e)
    };
    //--------------<<
    this.delete_wfStartUrl = "../WebServices/workflow_.asmx/delete_wfStart";
    this.delete_wfStart = function (c, e) {
        this.POST(this.delete_wfStartUrl, c, e)
    };
    //--------------<<
    this.pause_wfStartUrl = "../WebServices/workflow_.asmx/pause_wfStart";
    this.pause_wfStart = function (c, e) {
        this.POST(this.pause_wfStartUrl, c, e)
    };
    //--------------<<
    this.run_schduleUrl = "../WebServices/workflow_.asmx/run_schdule";
    this.run_schdule = function (c, e) {
        this.POST(this.run_schduleUrl, c, e)
    };
    //--------------<<
    this.get_taskStartRepUrl = "../WebServices/workflow_.asmx/get_taskStartRep";
    this.get_taskStartRep = function (c, e) {
        this.POST(this.get_taskStartRepUrl, c, e)
    };
    //--------------<<
    this.get_taskStartOnlyUrl = "../WebServices/workflow_.asmx/get_taskStartOnly";
    this.get_taskStartOnly = function (c, e) {
        this.POST(this.get_taskStartOnlyUrl, c, e)
    }; 
    //--------------<<
    this.getTask_User_idUrl = "../WebServices/workflow_.asmx/getTask_User_id";
    this.getTask_User_id = function (c, e) {
        this.POST(this.getTask_User_idUrl, c, e)
    };
    //--------------<<
    this.get_TxtReportUrl = "../WebServices/workflow_.asmx/get_TxtReport";
    this.get_TxtReport = function (c, e) {
        this.POST(this.get_TxtReportUrl, c, e)
    };
    //--------------<<
    this.getWorkflow_StartByIDUrl = "../WebServices/workflow_.asmx/getWorkflow_StartByID";
    this.getWorkflow_StartByID = function (c, e) {
        this.POST(this.getWorkflow_StartByIDUrl, c, e)
    };
    //--------------<<
    this.getFactorByCodeUrl = "../WebServices/Store_.asmx/Store_GetFactorByCode";
    this.getFactorByCode = function (c, e) {
        this.POST(this.getFactorByCodeUrl, c, e)
    };
    //--------------<<
    this.resume_error_wfsUrl = "../WebServices/workflow_.asmx/resume_error_wfs";
    this.resume_error_wfs = function (c, e) {
        this.POST(this.resume_error_wfsUrl, c, e)
    };
    //--------------<<
    this.AddCustomer_WfStartUrl = "../WebServices/workflow_.asmx/AddCustomer_WfStart";
    this.AddCustomer_WfStart = function (c, e) {
        this.POST(this.AddCustomer_WfStartUrl, c, e)
    };
    //--------------<<
    this.getTask_User_id_SupportUrl = "../WebServices/workflow_.asmx/getTask_User_id_Support";
    this.getTask_User_id_Support = function (c, e) {
        this.POST(this.getTask_User_id_SupportUrl, c, e)
    };
    //--------------<<
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
jQuery.extend({ get_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "GET") },
    put_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "PUT") },
    post_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "POST", "application/json; charset=utf-8") },
    delete_: function (c, e, d, f) { return _ajax_request(c, e, d, f, "DELETE") }
});
 