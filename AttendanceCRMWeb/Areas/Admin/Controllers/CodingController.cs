using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Service.Common;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.ApplicationServices;
using System.Web.Mvc;
using Utility.Filters;
using Utility.PublicEnum;
using Utility.Utitlies;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.Common;
using ViewModel.Security;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.Coding })]
    public class CodingController : BaseController
    {
        private readonly ICodingService _service;

        private static string _code;

        private static int _page = 1;

        protected override string FormName
        {
            get { return Resources.Md.Coding; }
        }

        public CodingController(
            ICodingService service
            )
        {
            _service = service;
        }



        [FillSecurityDepFilter(RoleType = EnumRole.Coding)]
        public async Task<ActionResult> Index()
        {
            var model = (await _service.GetAll()).ToList();
            return View(model);
        }


        #region Basic Coding

        [FillSecurityDepFilter(RoleType = EnumRole.Coding)]
        public async Task<ActionResult> GridList(string code)
        {
            var formSecurity = (FormSecurity)ViewBag.FormSecurity;
            ViewBag.grow = (await _service.GetCode(code, true)).CodeCanGrow == false ? false : true;
            var model = await _service.GetCode(code, true);
            ViewBag.Level = model.level.ToString();
            ViewBag.CodeParent = code.Substring(0, 3);
            ViewBag.Code = code;
            return PartialView();
        }

        private async Task<viewModel<CodingVm>> PrepareAction_BasicCoding(Filter_CodingVm model)
        {
            viewModel<CodingVm> list2 = new viewModel<CodingVm>();
            list2.TLists = (await _service.GetChild(model)).ToList();
            list2.T_model = new CodingVm { code = model.Code };
            list2.CommonCustomViewTablePaging = new CommonCustomViewTablePaging()
            {
                countModel = list2.TLists.Count(),
                UrlData = "/Admin/Coding/Search_BasicCoding",
                CurrentPageForAllCount = model.PageSize,
                CountAll = await _service.CountAll_GetChild(new Filter_CodingVm()
                {
                    FirstPage = model.FirstPage,
                    PageNum = 0,
                    PageSize = 0,
                    Search = model.Search,
                    Code = model.Code,
                    Message = model.Message,
                }),
                FunctionTempForPageing = "",
                TableIdDiv = "TableIdDivForBasicCoding",
                IdTextSearch = "txtSearchForBasicCoding",
                IdComboSelectCount = "cboSelectCountForBasicCoding",
                PageingId = "divPageingListsForBasicCoding",
                FunctionWillGoForPageing = "MinaDent.Coding.OperationAjaxFor_BasicCoding",
                FirstPage = model.FirstPage,
                FunctionWillGoForDelete = "MinaDent.Coding.DeleteRowForBasingCoding",
                TableName = Resources.Md.List,
                UrlEdit = "MinaDent.Coding.EditDiv",
                Message = model.Message,
                Page = model.PageNum
            };
            return list2;
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> Search_BasicCoding(Filter_CodingVm model)
        {
            model.Code = _code;
            _page = model.PageNum;

            return Json(this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_BasicCoding(model)), JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> GeBasicCodingVm(string code, bool isShowButtonAdd = true)
        {
            _code = code;
            _page = 1;
            ViewBag.IsShowButtonAdd = isShowButtonAdd;
            return PartialView(await PrepareAction_BasicCoding(new Filter_CodingVm
            {
                Code = _code,
                FirstPage = 1,
                Message = "",
                PageNum = 1,
                PageSize = _selectCount,
                Search = ""
            }));
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Coding_Delete })]
        public async Task<JsonResult> Delete_BasicCoding(string id, int SelectCount)
        {
            string strMessage = string.Empty;
            string[] _fixedCode = { "015010101", "015010102", "015010302", "015010301", "015010300", "015010301", "015010302", "015010303" };
            if (_fixedCode.Contains(id) || (id.Length == 7 && id.StartsWith("015"))) strMessage = "امکان حذف کردن این کد وجود ندارد";


            strMessage = await _service.Delete(id);
            if (!string.IsNullOrEmpty(strMessage)) throw new Exception("امکان حذف کردن این کد وجود ندارد");

            if (id.StartsWith("0" + ((int)Utility.PublicEnum.CodingEnum.DiscountCoding).ToString()))
                return Json(this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_Discount(new Filter_CodingVm()
                {
                    Code = _code,
                    FirstPage = 1,
                    Message = strMessage,
                    PageNum = 1,
                    PageSize = SelectCount,
                    Search = ""
                })));
            else
                return Json(this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_BasicCoding(new Filter_CodingVm()
                {
                    Code = _code,
                    FirstPage = 1,
                    Message = strMessage,
                    PageNum = 1,
                    PageSize = SelectCount,
                    Search = ""
                })));
        }

        public async System.Threading.Tasks.Task SetViewBag(CodingVm model)
        {
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Coding_Add })]
        public async Task<ActionResult> Add(string id)
        {
            ViewBag.CodeId = id;
            ViewBag.ParentCode = (id.Substring(0, 3)).ToString();
            var model = await _service.GetCode(id, false);

            model.CodeActive = true;

            if (string.IsNullOrEmpty(model.code))
                model.level = (short)(model.level + 1);

            await SetViewBag(model);

            return PartialView(model);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Coding_Update })]
        public async Task<ActionResult> Edit(string id)
        {
            ViewBag.CodeId = id;
            ViewBag.ParentCode = id.Substring(0, 3);
            var model = await _service.GetCode(id, true);

            await SetViewBag(model);

            model.Parent = model.code.Substring(0, model.code.Length - 2);

            return PartialView("Add", model);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Coding_Add })]
        public async Task<JsonResult> AddCode(CodingVm model)
        {
            var _coding = await _service.SaveNewCode(model);
            model.code = _coding.code;

            var create = true;
            if (model.code.StartsWith("0" + ((int)CodingEnum.DiscountCoding).ToString()))
            {
                return Json(new NormalJsonClass()
                {
                    Data = this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_Discount(new Filter_CodingVm()
                    {
                        Code = _code,
                        FirstPage = 1,
                        Message = "",
                        PageNum = _page,
                        PageSize = _selectCount,
                        Search = ""
                    })),
                    Class = _coding.code,
                    Selected = create
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new NormalJsonClass()
                {
                    Data = this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_BasicCoding(new Filter_CodingVm()
                    {
                        Code = _code,
                        FirstPage = 1,
                        Message = "",
                        PageNum = _page,
                        PageSize = _selectCount,
                        Search = ""
                    })),
                    Class = _coding.code,
                    Selected = create
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Coding_Update })]
        public async Task<JsonResult> EditCode(CodingVm model)
        {
            var _coding = await _service.SavePreCode(model);

            model.code = _coding.code;
            model.level = _coding.level;
            //await DeleteAccountingClient(model);

            var create = false;
            if (model.code.StartsWith("0" + ((int)CodingEnum.DiscountCoding).ToString()))
            {
                return Json(new NormalJsonClass()
                {
                    Data = this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_Discount(new Filter_CodingVm()
                    {
                        Code = _code,
                        FirstPage = 1,
                        Message = "",
                        PageNum = _page,
                        PageSize = _selectCount,
                        Search = ""
                    })),
                    Class = _coding.code,
                    Selected = create
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new NormalJsonClass()
                {
                    Data = this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_BasicCoding(new Filter_CodingVm()
                    {
                        Code = _code,
                        FirstPage = 1,
                        Message = "",
                        PageNum = _page,
                        PageSize = _selectCount,
                        Search = ""
                    })),
                    Class = _coding.code,
                    Selected = create
                }, JsonRequestBehavior.AllowGet);
            }
        }


        #endregion

        #region Manage Coding Customers

        public async Task<ActionResult> CeateAccountParties(CodingVm entity)
        {
            try
            {
                var _model = new CodingVm();

                return Json(this.RenderPartialToString("CeateAccountParties", _model), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> SaveAccountParties(CodingVm entity)
        {
            try
            {
                var _coding = await _service.SaveNewCode(entity);
                entity.code = _coding.code;

                return Json(new DataModel(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #region Discounts

        public async Task<ActionResult> AddDiscount(string id)
        {
            ViewBag.CodeId = id;
            var model = await _service.GetCode(id, false);

            //Change By Mobin
            model.CodeActive = true;

            await SetViewBag(model);
            return PartialView(model);
        }

        public async Task<ActionResult> EditDiscount(string id)
        {
            ViewBag.CodeId = id;
            var model = await _service.GetCode(id, true);
            await SetViewBag(model);
            return PartialView("AddDiscount", model);
        }

        private async Task<viewModel<CodingVm>> PrepareAction_Discount(Filter_CodingVm model)
        {
            viewModel<CodingVm> list2 = new viewModel<CodingVm>();
            list2.TLists = (await _service.GetChild(model)).ToList();
            list2.T_model = new CodingVm { code = model.Code };
            list2.CommonCustomViewTablePaging = new CommonCustomViewTablePaging()
            {
                countModel = list2.TLists.Count(),
                UrlData = "/Admin/Coding/Search_Discount",
                CurrentPageForAllCount = model.PageSize,
                CountAll = await _service.CountAll_GetChild(new Filter_CodingVm()
                {
                    FirstPage = model.FirstPage,
                    PageNum = 0,
                    PageSize = 0,
                    Search = model.Search,
                    Code = model.Code,
                    Message = model.Message,
                }),
                FunctionTempForPageing = "",
                TableIdDiv = "TableIdDivForDiscount",
                IdTextSearch = "txtSearchForDiscount",
                IdComboSelectCount = "cboSelectCountForDiscount",
                PageingId = "divPageingListsForDiscount",
                FunctionWillGoForPageing = "MinaDent.Coding.OperationAjaxFor_BasicCoding",
                FirstPage = model.FirstPage,
                UrlDelete = "/Admin/Coding/Delete_BasicCoding",
                TableName = Resources.Md.List,
                UrlEdit = "MinaDent.Coding.EditDivForDiscount",
                Message = model.Message,
                UrlDeleteRows = "",
                FunctionTempForDelete = $@"MinaDent.Coding.FunctionTempForDelete();",
                Page = model.PageNum
            };
            return list2;
        }

        public async Task<ActionResult> GeDiscountVm(string code)
        {
            _page = 1;
            _code = code;
            return PartialView(await PrepareAction_Discount(new Filter_CodingVm
            {
                Code = _code,
                FirstPage = 1,
                Message = "",
                PageNum = 1,
                PageSize = _selectCount,
                Search = ""
            }));
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> Search_Discount(Filter_CodingVm model)
        {
            model.Code = _code;
            _page = model.PageNum;
            return Json(this.RenderPartialToString("P_ListBasicCoding", await PrepareAction_Discount(model)), JsonRequestBehavior.AllowGet);
        }

        #endregion


    }
}