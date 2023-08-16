using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Service.Consts;
using Service.Cost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using Utility.EXT;
using Utility.Filters;
using Utility.PublicEnum;
using Utility.Utitlies;
using Utility;
using ViewModel.BasicInfo;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount })]
    public class CompanyAccountController : BaseController
    {
        private readonly ICompanyAccountService _service;

        public CompanyAccountController(
            ICompanyAccountService Service
            )
        {
            _service = Service;

        }


        protected override string FormName
        {
            get { return Resources.Md.CostIncoming; }
        }


        [FillSecurityDepFilter(RoleType = EnumRole.CompanyAccount)]
        public async Task<ActionResult> Index()
        {
            var CompanyAccountList = EnumHelper<CompanyAccountEnum>.EnumToNormalJsonClass();
            ViewBag.CompanyAccountList = CompanyAccountList;
            var _result = await PrepareAction_CompanyAccount(new FilterModelCompanyAccount());
            return View(_result);
        }

        #region CompanyAccount
        private async Task<viewModel<CompanyAccountVm>> PrepareAction_CompanyAccount(FilterModelCompanyAccount filter)
        {
            viewModel<CompanyAccountVm> list2 = new viewModel<CompanyAccountVm>();
            list2.TLists = (await _service.GetAllAsync(filter)).ToList();

            list2.CommonCustomViewTablePaging = list2.FillPageingData(
                list2.TLists.Count(),
                urlData: "/Admin/CompanyAccount/P_GetList_CompanyAccount",
                filter.PageSize,
                await _service.CountAll_GetAllAsync(filter),
                urlDelete: "/Admin/CompanyAccount/DeleteRow",
                //urlEdit: "MinaDent.CompanyAccountModal.ShowCompanyAccountModal",
                urlEdit: "EditCompanyAccount",
                urlDeleteRows: "/Admin/CompanyAccount/DeleteRows",
                isHrefEditClick: true,
                firstPage: filter.FirstPage,
                message: null,
                functionWillGoForPageing: "operationAjaxFor_CompanyAccount",
                idTextSearch: "txtSearch_CompanyAccount",
                idComboSelectCount: "cboSelectCount_CompanyAccount",
                tableIdDiv: "divLists_CompanyAccount",
                pageingId: "divPageingLists_CompanyAccount",
                functionTempForPageing: $@"MinaDent.CompanyAccountModal.ActiveTabCompanyAccount({((int)CompanyAccountEnum.CompanyAccount).ToString()});",
                FunctionWillGoForDelete: "DeleteCompanyAccountItem");

            return list2;
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_GetList_CompanyAccount(FilterModelCompanyAccount filter)
        {
            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", await PrepareAction_CompanyAccount(filter)), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_GetList_CompanyAccount1(FilterModelCompanyAccount filter)
        {
            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", await PrepareAction_CompanyAccount(filter)), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount_Delete })]
        public async Task<JsonResult> DeleteRow(string id)
        {
            await _service.DeleteAsync(Guid.Parse(id));


            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", await PrepareAction_CompanyAccount(new FilterModelCompanyAccount())), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount_Delete })]
        public async Task<JsonResult> DeleteRows(string[] ids, int SelectCount)
        {
            string strMessage = await _service.Deletes(ids);
            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", await PrepareAction_CompanyAccount(new FilterModelCompanyAccount())), JsonRequestBehavior.AllowGet);
        }


        public async Task<JsonResult> GetListName(int? Id, string parentId)
        {
            if (parentId == "0120202")
            {
                var result = await _service.GetListAsync("DocCode");
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (parentId == "0120203")
            {
                var result = await _service.GetListAsync("PersonnelCode");
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            else if (parentId == "0150103")
            {
                var result = await _service.GetListAccountPartiesAsync("");
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            else
            {
                var result = await _service.GetListCompanyAsync(parentId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }


        [FillSecurityDepFilter(RoleType = EnumRole.CompanyAccount)]
        public async Task<ActionResult> GetListCompanyAccount()
        {
            return PartialView(await PrepareAction_CompanyAccount(new FilterModelCompanyAccount()));
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount_Add })]
        public async Task<ActionResult> Create()
        {
            var model = await _service.GetCompanyAccountVmAsync(null);
            await SetViewBag(model);

            return Json(this.RenderPartialToString("Create", model), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount_Update })]
        public async Task<ActionResult> Edit(Guid id)
        {
            var model = await _service.GetCompanyAccountVmAsync(id);
            await SetViewBag(model);
            //return PartialView("Create", model);
            return Json(this.RenderPartialToString("Create", model), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [CustomAutorizeFilter(Role = new[] { EnumRole.CompanyAccount_Add, EnumRole.CompanyAccount_Update })]
        public async Task<ActionResult> Create(CompanyAccountVm model)
        {
            var _result = await _service.SaveCompanyAccountAsync(model);

            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", await PrepareAction_CompanyAccount(new FilterModelCompanyAccount())), JsonRequestBehavior.AllowGet);
        }


        public async Task SetViewBag(CompanyAccountVm model)
        {
            ViewData["costInCode"] = new SelectList(model.CostCodeList, "Value", "Text", model.costInCode);
            ViewData["costPersonID"] = new SelectList(model.PersonList, "Value", "Text", model.costPersonID);
        }


        #endregion


    }
}