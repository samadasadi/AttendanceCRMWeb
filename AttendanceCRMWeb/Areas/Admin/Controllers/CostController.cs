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
    [CustomAutorizeFilter(Role = new[] { EnumRole.Cost })]
    public class CostController : BaseController
    {
        private readonly ICostService _service;
        private readonly ICompanyAccountService _serviceCompanyAccountService;
        //private readonly IAccountService _serviceAccounting;


        public CostController(ICostService service,
            ICompanyAccountService serviceCompanyAccountService
            //IAccountService serviceAccounting
            )
        {
            _service = service;
            _serviceCompanyAccountService = serviceCompanyAccountService;


        }




        protected override string FormName
        {
            get { return Resources.Md.Registrationcosts; }
        }

        [FillSecurityDepFilter(RoleType = EnumRole.Cost)]
        public async Task<ActionResult> Index()
        {
            var costList = EnumHelper<CostEnum>.EnumToNormalJsonClass();
            ViewBag.CostList = costList;
            return PartialView();
        }

        [FillSecurityDepFilter(RoleType = EnumRole.Cost)]
        public async Task<ActionResult> GridList(FilterModelCost entity)
        {
            if (entity.typeId == CostEnum.Cost)
            {
                return PartialView(await PrepareAction_Cost(entity));
            }
            else
            {
                return PartialView("GetListCompanyAccount", await PrepareAction_CompanyAccount(new FilterModelCompanyAccount
                {
                    FromDate = entity.FromDate,
                    ToDate = entity.ToDate,
                    PageNum = entity.PageNum,
                    PageSize = entity.PageSize,
                    Search = entity.Search,
                    FirstPage = entity.FirstPage
                }));
            }
        }

        #region Cost
        private async Task<viewModel<CostVm>> PrepareAction_Cost(FilterModelCost entity)
        {
            viewModel<CostVm> list2 = new viewModel<CostVm>();
            list2.TLists = (await _service.GetAll(entity)).ToList();

            list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(), urlData: "/Admin/Cost/P_GetList_Cost",
                entity.PageSize,
                await _service.CountAll_GetAll(entity),
                "/Admin/Cost/DeleteRow",
                urlEdit: "EditCost",
                urlDeleteRows: "/Admin/Cost/DeleteRows", isHrefEditClick: true,
                firstPage: entity.FirstPage,
                message: "",
                functionWillGoForPageing: "MinaDent.CostModal.Filter",
                idTextSearch: "txtSearch_Cost",
                idComboSelectCount: "cboSelectCount_Cost",
                tableIdDiv: "divLists_Cost",
                pageingId: "divPageingLists_Cost",
                functionTempForPageing: $@"MinaDent.CostModal.ActiveTabCost({((int)CostEnum.Cost).ToString()});",
                FunctionWillGoForDelete: "DeleteCostItem");

            return list2;
        }


        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_GetList_Cost(
            string text = "", 
            int SelectCount = 10, 
            int page = 1, 
            int firstPage = 1,
            DateTime? fromDate = null, 
            DateTime? ToDate = null, 
            CostSortType SortType = CostSortType.DateEn
            )
        {
            var _result = await PrepareAction_Cost(new FilterModelCost
            {
                text = text,
                PageNum = page,
                PageSize = SelectCount,
                FirstPage = firstPage,
                FromDate = fromDate ?? DateTime.Now.AddMonths(-1),
                ToDate = ToDate ?? DateTime.Now,
                SortType = SortType
            });
            return Json(this.RenderPartialToString("P_GetList_Cost", _result), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_GetList_Cost1(string text = "", int SelectCount = 10, int page = 1, int firstPage = 1, string fromDate = "", string ToDate = "")
        {
            var _result = await PrepareAction_Cost(new FilterModelCost
            {
                text = text,
                PageNum = page,
                PageSize = SelectCount,
                FirstPage = firstPage
            });
            return Json(this.RenderPartialToString("P_GetList_Cost", _result), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.Cost_Add })]
        public async Task<ActionResult> Create()
        {
            var model = await _service.GetCostVm(null);
            await SetViewBag(model);
            model.CostDateEn = model.DateEn;
            return Json(this.RenderPartialToString("Create", model), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.Cost_Update })]
        public async Task<ActionResult> Edit(Guid id)
        {
            var model = await _service.GetCostVm(id);

            //Create By Mobin            
            if (model.CostCode == "0" + ((int)CodingEnum.StaffSalaries).ToString())
                model.CostCode = "0" + ((int)CodingEnum.StaffSalaries).ToString();
            else if (model.CostCode == "0" + ((int)CodingEnum.DoctorsRights).ToString())
                model.CostCode = "0" + ((int)CodingEnum.DoctorsRights).ToString();

            Session["Id"] = id;
            await SetViewBag(model);

            model.CostDateEn = model.DateEn;

            return Json(this.RenderPartialToString("Create", model), JsonRequestBehavior.AllowGet);
        }


        public async Task SetViewBag(CostVm model)
        {

            ViewData["CostCode"] = new SelectList(model.CostCodeList, "Value", "Text", model.CostCode);
            ViewData["costPersonID"] = new SelectList(model.PersonList, "Value", "Text", model.costPersonID);

        }


        [HttpPost]
        [CustomAutorizeFilter(Role = new[] { EnumRole.Cost_Add, EnumRole.Cost_Update })]
        public async Task<ActionResult> Create(CostVm model)
        {

            model.DateEn = model.CostDateEn;
            var _result = await _service.SaveCost(model);

            return Json(new DataModel(), JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.Cost_Delete })]
        public async Task<JsonResult> DeleteRow(string id)
        {
            var _result = await _service.Delete(Guid.Parse(id));
            return Json(_result, JsonRequestBehavior.AllowGet);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.Cost_Delete })]
        public async Task<JsonResult> DeleteRows(string[] ids, int SelectCount)
        {
            foreach (string item in ids)
            {
                var _result = await _service.Delete(Guid.Parse(item));

            }

            return Json(new DataModel(), JsonRequestBehavior.AllowGet);
        }


        public async Task<JsonResult> GetListName(int? Id, string parentId, string selected = null)
        {
            if (parentId == "0" + ((int)CodingEnum.DoctorsRights).ToString())
            {
                var result = await _service.GetList("DocCode", selected);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (parentId == "0" + ((int)CodingEnum.StaffSalaries).ToString())
            {
                var result = await _service.GetList("PersonnelCode", selected);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (parentId == "0" + ((int)Utility.PublicEnum.CodingEnum.Company).ToString())
            {
                var result = await _service.GetListForCombo("0" + ((int)Utility.PublicEnum.CodingEnum.Company).ToString(), selected);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (parentId == "0" + ((int)Utility.PublicEnum.CodingEnum.CostLabretory).ToString())
            {
                var result = await _service.GetListForCombo("0" + ((int)Utility.PublicEnum.CodingEnum.CostLabretory).ToString(), selected);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var result = await _service.GetListCompanyWithOtherCode(parentId, selected);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region CompanyAccount
        private async Task<viewModel<CompanyAccountVm>> PrepareAction_CompanyAccount(FilterModelCompanyAccount entity)
        {
            viewModel<CompanyAccountVm> list2 = new viewModel<CompanyAccountVm>();
            list2.TLists = (await _service.GetCompanyAccount(entity)).ToList();

            list2.CommonCustomViewTablePaging = list2.FillPageingData(
                    list2.TLists.Count(),
                    urlData: "/Admin/Cost/P_GetList_CompanyAccount",
                    entity.PageSize,
                    await _serviceCompanyAccountService.CountAll_GetAllAsync(entity),
                    "", urlEdit: "",
                    urlDeleteRows: "",
                    isHrefEditClick: true,
                    firstPage: entity.FirstPage,
                    message: "",
                    functionWillGoForPageing: "",
                    idTextSearch: "txtSearch_CompanyAccount",
                    idComboSelectCount: "cboSelectCount_CompanyAccount",
                    tableIdDiv: "divLists_CompanyAccount",
                    pageingId: "divPageingLists_CompanyAccount",
                    functionTempForPageing: $@"MinaDent.CostModal.ActiveTabCompanyAccount({((int)CostEnum.CompanyAccount).ToString()});"
                );

            return list2;
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_GetList_CompanyAccount(
            string text = "", int SelectCount = 10, int page = 1, int firstPage = 1,
            DateTime? fromDate = null, DateTime? ToDate = null)
        {
            //var _result = await PrepareAction_CompanyAccount(SelectCount, text, page, firstPage);
            var _result = await PrepareAction_CompanyAccount(new FilterModelCompanyAccount
            {
                Search = text,
                PageNum = page,
                PageSize = SelectCount,
                FirstPage = firstPage,
                FromDate = fromDate ?? DateTime.Now.AddMonths(-1),
                ToDate = ToDate ?? DateTime.Now
            });
            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", _result), JsonRequestBehavior.AllowGet);
        }


        public async Task<ActionResult> GetCheckCompanyAccount(Guid Id)
        {
            var model = await _service.GetCostVm(null);
            await SetViewBag(model);
            model.CostDateEn = model.DateEn ?? DateTime.Now;
            model.Id = Id;

            return Json(this.RenderPartialToString("GetCheckCompanyAccount", model), JsonRequestBehavior.AllowGet);
        }


        public async Task<ActionResult> CheckCompanyAccount(CostVm model)
        {

            var _result = await _service.CheckCompanyAccount(model);



            var resultdata = await PrepareAction_CompanyAccount(new FilterModelCompanyAccount());
            return Json(this.RenderPartialToString("P_GetList_CompanyAccount", resultdata), JsonRequestBehavior.AllowGet);
        }
        
        #endregion




    }
}