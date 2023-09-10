using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Ninject.Activation;
using Service.BasicInfo;
using Service.Consts;
using Service.UserManagement.Attendance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static Stimulsoft.Report.QuickButtons.StiWpfQuickButtonAttribute;
using Utility.Filters;
using Utility.PublicEnum;
using Utility.Utitlies;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;
using ViewModel.UserManagement;
using Service.UserManagement;
using Service.Cost;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
    public class RegisterController : BaseController
    {
        private readonly IRegisterService _service;
        private readonly IFileService _fileService;
        private readonly ICostService _costService;
        private readonly IAttendanceReportService _attendanceReportService;
        private readonly ITransactionRequestService _transactionRequestService;

        protected override string FormName
        {
            get { return Resources.Md.Users; }
        }

        public RegisterController(
            IRegisterService service,
            IFileService fileService,
            ICostService costService,
            IAttendanceReportService attendanceReportService,
            ITransactionRequestService transactionRequestService
            )
        {
            _service = service;
            _fileService = fileService;
            _costService = costService;
            _attendanceReportService = attendanceReportService;
            _transactionRequestService = transactionRequestService;
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
        [FillSecurityDepFilter(RoleType = EnumRole.Register)]
        public async Task<ActionResult> Index(Guid? id)
        {
            try
            {
                var formSecurity = (ViewModel.Security.FormSecurity)ViewBag.FormSecurity;
                ViewBag.usercount = await _service.GetUserActiveCount(null);
                var _model = (await _service.GetAllAsync()).ToList();


                ViewData["UserType"] = new SelectList(await _service.GetAllUserTypeListAsync(), "Value", "Text", "");

                return View(_model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
        [FillSecurityDepFilter(RoleType = EnumRole.Register)]
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> Filter(Filter_UserVm model)
        {
            var _model = (await _service.GetAllAsync(model)).ToList();
            return Json(this.RenderPartialToString("P_Grid_Users", _model), JsonRequestBehavior.AllowGet);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
        [FillSecurityDepFilter(RoleType = EnumRole.Register)]
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> Filter_WithHot_Part(Filter_UserVm model)
        {
            var _model = (await _service.GetAllAsync(model)).ToList();
            return Json(_model, JsonRequestBehavior.AllowGet);
        }

        public async System.Threading.Tasks.Task CheckUseractive(ViewModel.UserManagement.UserVm model)
        {
            var _user = await _service.GetUserVmAsync(model.Id);
            if (_user.UserName == "admin")
            {
                throw new Exception("شما امکان حذف ادمین را ندارید");
            }
            await _service.SaveUserActiveAsync(model);
        }


        [CustomAutorizeFilter(Role = new[] { EnumRole.Register_Update })]
        public async Task<ActionResult> Edit(Guid id)
        {
            //امضا کاربر
            SetSessionSignature();

            var model = await _service.GetUserVmAsync(id);



            if (model.FileId != Guid.Empty)
            {
                var _file = await _fileService.Find(model.FileId);
                var path = (_file != null ? _file.Path : string.Empty);
                ViewBag.path = path;
            }
            await SetViewBag(model);
            ViewBag.isEdit = true;
            return View("Create", model);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register_Add })]
        public async Task<ActionResult> Create()
        {
            //Create By Mobin
            //if (!_service.checkDoctorCountForRegister())
            //    return Redirect("/Home/AccessDeniedForMedicalCenter");

            //امضا کاربر
            SetSessionSignature();

            var model = await _service.GetUserVmAsync(null);
            if (model.FileId != Guid.Empty)
            {
                var path = (await _fileService.Find(model.FileId)).Path;
                ViewBag.path = path;
            }
            ViewBag.ID = Guid.NewGuid();

            await SetViewBag(model);

            return View(model);
        }

        [HttpPost]
        [CustomAutorizeFilter(Role = new[] { EnumRole.Register_Update, EnumRole.Register_Add })]
        public async Task<ActionResult> Create(ViewModel.UserManagement.UserVm model)
        {
            var isCreate = model.Id == Guid.Empty;

            if ((Public.CurrentUser.DoctorCount < model.UserDoctorCount) || (Public.CurrentUser.DoctorCount == model.UserDoctorCount && (model.UserType == "0" + ((int)CodingEnum.Doctor).ToString())))
            {
                Sessions.ResultMessage = "تعداد پزشک بیش از حد مجاز می باشد";
                //if (isCreate)
                //    return RedirectToAction("Create");
                //else
                //    return RedirectToAction("Edit", new { id = model.Id });


                ModelState.AddModelError("", "تعداد پزشک بیش از حد مجاز می باشد");
                model.RoleGroups = await _service.GetAllUserGroupAsync(model.Id);
                model.EducationList = await _service.GetEducationListAsync();
                model.UserTypeList = await _service.GetAllUserTypeListAsync();
                model.ParentLists = await _service.GetAllParentsAsync(model.ParentId ?? Guid.Empty);
                await SetViewBag(model);
                return View(model);
            }

            if (model.IsUserActive == true)
                if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
                    throw new Exception("نام کاربری و رمز عبور را وارد نمایید");


            if (ModelState.IsValid)
            {
                if (!string.IsNullOrWhiteSpace(model.RoleID))
                {
                    var temp = model.RoleID.Split(',');
                    model.SelectedRoleGroups = new Guid[temp.Length];
                    for (int i = 0; i < temp.Length; i++)
                    {
                        model.SelectedRoleGroups[i] = Guid.Parse(temp[i]);
                    }
                }

                try
                {
                    //امضا کاربر
                    model.Canvas = Session[VaribleForName.SessionSignatureEmployee] != null ? Session[VaribleForName.SessionSignatureEmployee].ToString() : model.Canvas;

                    #region Upload Pic Or Webcame
                    if (!string.IsNullOrEmpty(model.WebCamBase64))
                    {
                        await deleteFile(model, isCreate);
                        string base64 = model.WebCamBase64.Substring(model.WebCamBase64.IndexOf(',') + 1);
                        base64 = base64.Trim('\0');
                        byte[] chartData = Convert.FromBase64String(base64);
                        var File = await _fileService.AddFileWithByteArray(chartData, Server.MapPath(AppSettings.UserImageFolder), AppSettings.UserImageFolder, "Employee");
                        model.FileId = File.Id;
                        if (Public.CurrentUser.UserName == model.UserName)
                            Public.CurrentUser.Image = File.Path;
                    }
                    else if (model.File != null)
                    {
                        await deleteFile(model, isCreate);
                        var fileVm = await _fileService.AddFileWithHttpPostedFilePath(model.File, Server.MapPath(AppSettings.UserImageFolder), AppSettings.UserImageFolder, "Employee");
                        model.FileId = fileVm.Id;
                        if (Public.CurrentUser.Id == model.Id)
                            Public.CurrentUser.Image = fileVm.Path;
                    }
                    #endregion

                    var objPubUser = await _service.SaveUserAsync(model, Server.MapPath(AppSettings.UserImageFolder), AppSettings.UserImageFolder);

                    //امضا کاربر
                    SetSessionSignature();



                    Sessions.ResultMessage = isCreate
                        ? GlobalMessage.InsertResult(FormName)
                        : GlobalMessage.UpdateResult(FormName);
                    return RedirectToAction("DetailView", new { id = model.Id });
                }
                catch (Exception ex)
                {
                    Sessions.ResultMessage = isCreate
                       ? GlobalMessage.InsertResult(FormName, false)
                       : GlobalMessage.UpdateResult(FormName, false);
                }
            }
            else
            {
                ModelState.AddModelError("", "لطفا در تکمیل اطلاعات دقت نمایید");
                model.RoleGroups = await _service.GetAllUserGroupAsync(model.Id);
                model.EducationList = await _service.GetEducationListAsync();
                model.UserTypeList = await _service.GetAllUserTypeListAsync();
                model.ParentLists = await _service.GetAllParentsAsync(model.ParentId ?? Guid.Empty);

                await SetViewBag(model);
                return View(model);
            }
            return RedirectToAction("Index");
            //return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        private async System.Threading.Tasks.Task deleteFile(ViewModel.UserManagement.UserVm model, bool isCreate)
        {
            if (!isCreate)
            {
                var mm = (await _service.GetUserVmAsync(model.Id)).FileId;
                var objFile = await _fileService.Find(mm);
                if (objFile != null)
                {
                    await _fileService.Delete(objFile.Id);
                    if (System.IO.File.Exists(Server.MapPath(objFile.Path)))
                        System.IO.File.Delete(Server.MapPath(objFile.Path));
                }
            }
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public ActionResult SaveLightPenBySess(string canvas)
        {
            if (canvas == Utility.Utitlies.VaribleForName.emptyCanvas)
                return Json("شما امضایی رسم نکردید", JsonRequestBehavior.AllowGet);
            SetSessionSignature(canvas);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [NonAction]
        private void SetSessionSignature(string canvas = "")
        {
            if (!string.IsNullOrEmpty(canvas))
                Session[Utility.Utitlies.VaribleForName.SessionSignatureEmployee] = canvas;
            else
                Session[Utility.Utitlies.VaribleForName.SessionSignatureEmployee] = null;
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
        [FillSecurityDepFilter(RoleType = EnumRole.Register)]
        public async Task<ActionResult> Detail(Guid id)
        {
            var frmSecurityDetail = (ViewModel.Security.FormSecurity)ViewBag.frmSecurityDetail;

            var model = await _service.GetUserDetailAsync(id);
            //return PartialView(model);
            return Json(this.RenderPartialToString("Detail", model), JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> access(Guid? id)
        {
            var model = await _service.GetUserVmAsync(id);
            await SetViewBag(model);
            return PartialView(model);
        }

        [HttpPost]
        public async Task<ActionResult> access(ViewModel.UserManagement. UserVm model)
        {
            await _service.SaveUsergroupAsync(model);
            // ReSharper disable once Mvc.ActionNotResolved
            return RedirectToAction("SubsetUser");
        }

        public async System.Threading.Tasks.Task SetViewBag(ViewModel.UserManagement.UserVm model)
        {

            ViewData["UserType"] = new SelectList(model.UserTypeList, "Value", "Text", model.UserType);
            ViewData["Education"] = new SelectList(model.EducationList, "Value", "Text", model.Education);
            ViewData["ParentId"] = new SelectList(model.ParentLists, "Value", "Text", model.ParentId);

        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.Register_Delete })]
        public async System.Threading.Tasks.Task Delete(Guid id)
        {
            var _user = await _service.GetUserVmAsync(id);
            if (_user.UserName == "admin")
            {
                throw new Exception("شما امکان حذف ادمین را ندارید");
            }
            await _service.DeleteAsync(id);
        }

        public async Task<ActionResult> DeleteImg(Guid id)
        {
            var result = await _service.DeleteImgAsync(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChangePassword()
        {
            return View(new ViewModel.Security.ChangePasswordViewModel());
        }

        [HttpPost]
        public async Task<ActionResult> ChangePassword(ViewModel.Security.ChangePasswordViewModel model)
        {
            var res = await _service.ChangePasswordAsync(model.OldPassword, model.NewPassword);
            if (res)
            {
                Sessions.ResultMessage = "تغییر کلمه عبور با موفقیت انجام شد";
                return RedirectToAction("IndexR", "Home", new { area = "" });
            }
            else
            {
                Sessions.ResultMessage = "متاسفانه تغییر کلمه عبور با موفقیت انجام نشد";
            }
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> CheckDuplicate(string userName, Guid? Id = null)
        {
            var result = !await _service.CheckUserNameAsync(userName, Id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult drop()
        {
            return PartialView();
        }

        public ActionResult ResetPassword(Guid userId)
        {
            UserVm model = new UserVm() { Id = userId };
            return PartialView(model);
        }

        [HttpPost]
        public async Task<ActionResult> ResetPassword(UserVm model)
        {
            await _service.ResetPasswordAsync(model.Id, model.Password);
            return Json(new { }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> CheckDuplicateDocNo(UserVm model)
        {
            Guid Id = Guid.Empty;
            var item = Request.Url.Host;
            var result = !await _service.CheckDocNo(model.EmployeeID, Id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }



        [CustomAutorizeFilter(Role = new[] { EnumRole.Register })]
        [FillSecurityDepFilter(RoleType = EnumRole.Register)]
        public async Task<ActionResult> DetailView(Guid id)
        {
            var model = await _service.GetUuserVmForDetail(id);
            return View(model);
        }


        public async Task<ActionResult> AddCost(CostVm model)
        {
            try
            {
                var res = await _costService.GetCostVm(model.Id == null || model.Id == Guid.Empty ? (Guid?)null : model.Id);
                res.PersonID = model.PersonID;
                res.UserType = model.UserType;
                ViewData["CostCode"] = new SelectList(res.CostCodeList, "Value", "Text", res.CostCode);
                //return PartialView(model);
                return Json(this.RenderPartialToString("AddCost", res), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> SaveCost(CostVm model)
        {
            try
            {
                model.costPersonID = model.PersonID.ToString();
                if (model.UserType == "0120202")
                    model.CostCode = "015010101";
                else model.CostCode = "015010102";
                await _costService.SaveCost(model);
                //return Json(this.RenderPartialToString("P_GetCostList", await PrepareActionCost(new TherapyFilterVm { Id = model.PersonID, FirstPage = 1, PageNum = 1, PageSize = 10, FromDate = DateTime.Now.AddYears(-10), ToDate = DateTime.Now })), JsonRequestBehavior.AllowGet);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> DeleteRow(CostVm model)
        {
            try
            {
                await _costService.Delete(model.Id);
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { throw ex; }
        }
        private async Task<viewModel<CostVm>> PrepareActionCost(TherapyFilterVm model)
        {
            try
            {
                var list2 = await _costService.GetDoctorCostList(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: "/Admin/Register/P_GetCostList",
                    _selectCount,
                    await _costService.CountAll_DoctorCostList(model),
                    "",
                    urlEdit: "",
                    urlDeleteRows: "",
                    functionWillGoForPageing: "operationAjaxFor_Ava",
                    firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> GetCostList(UserVm value)
        {
            try
            {
                var _res = await PrepareActionCost(new TherapyFilterVm { FromDate = DateTime.Now.AddYears(-10), ToDate = DateTime.Now, PageNum = 1, Id = value.Id, PageSize = _selectCount, FirstPage = 1 });
                return Json(this.RenderPartialToString("GetCostList", _res), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> P_GetCostList(TherapyFilterVm model)
        {
            try
            {
                model.FromDate = DateTime.Now.AddYears(-10); model.ToDate = DateTime.Now;
                return Json(this.RenderPartialToString("P_GetCostList", (await PrepareActionCost(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<JsonResult> PatientAccount(UserVm entity)
        {
            try
            {
                var model = await _service.GetUuserVmForDetail(entity.Id);
                ViewData["PersonelSalariMonth"] = new SelectList(model.personAccountingFilter.PersonelSalariMonthList, "Value", "Text", model.personAccountingFilter.PersonelSalariMonth);
                return Json(this.RenderPartialToString("PatientAccount", model), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> CalcPatientAccount(UserVm entity)
        {
            try
            {
                entity.personAccountingFilter.EmployeesId = entity.Id;
                var model = await _attendanceReportService.CalculatePatientAccount(entity);
                return Json(this.RenderPartialToString("CalcPatientAccount", model), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> SavePersonelAccount(UserVm entity)
        {
            try
            {
                var model = await _attendanceReportService.SavePersonelAccount(entity);
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private async Task<viewModel<EmployeeAccountingVm>> PrepareAction_PersonelAccount(UserVm model)
        {
            try
            {
                var list2 = await _attendanceReportService.GetAllPersonAccount(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/DeletePersonelAccount",
                    urlEdit: "",
                    tableIdDiv: "divListsTransReq",
                    urlDeleteRows: "/Admin/EmployeeAttendance/DeletePersonelAccount",
                    functionWillGoForPageing: "operationAjaxFor_PersonelAccount", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> PersonelAccount_Index(UserVm entity)
        {
            var model = await PrepareAction_PersonelAccount(new UserVm { Id = entity.Id, PageNum = 1, UrlData = "/Admin/Register/P_PersonelAccount", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("PersonelAccount_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_PersonelAccount(UserVm model)
        {
            try
            {
                model.UrlData = "/Admin/Register/P_PersonelAccount";
                return Json(this.RenderPartialToString("P_PersonelAccount", (await PrepareAction_PersonelAccount(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ActionResult> DeletePersonelAccount(EmployeeAccountingVm model)
        {
            try
            {
                var _res = await _attendanceReportService.DeletePersonelAccount(model);

                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> SavePersonelAccount_Cost(CostVm model)
        {
            try
            {
                var _res = await _attendanceReportService.SavePersonelAccount_Cost(model);

                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> SavePersonelAccount_CostIncoming(CostVm model)
        {
            try
            {
                var _result = await _attendanceReportService.SavePersonelAccount_CostIncoming(model);

                try
                {
                    //ذخیره سند مالی
                    //var _res = await _accountingModelFactory.CreateAccountingDc_CompanyAccount(_result.model, new CompanyAccountVm());
                    //var _res = await _serviceAccounting.CreateFinancialDocument(new CreateFinancialDocumentVm
                    //{
                    //    entityId = _result.model.costPersonID,
                    //    entityId_Detail = _result.model.Id,
                    //    documentDate = _result.model.DateEn,
                    //    documentType = AccountingDocumentType.tbl_Cost_Incoming,
                    //    MoneyType = String.Empty,
                    //    AccountingCollection_Id = Guid.Empty,
                    //    EntityData = JsonConvert.SerializeObject(_result),
                    //    IsMakeNewFinancialDocument = true
                    //});
                }
                catch { }


                return Json(new DataModelResult { Error = _result.error, Message = _result.message }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        #region Quick Link
        public async Task<ActionResult> Get_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = await _service.Search_QuickLinkAsync(entity);
                return Json(this.RenderPartialToString("Get_QuickLinkAsync", _result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = await _service.Get_QuickLinkAsync(entity);


                ViewData["PubMenu_Id"] = new SelectList(_result.PubMenuList, "Value", "Text", _result.PubMenu_Id);

                return Json(this.RenderPartialToString("Create_QuickLinkAsync", _result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = await _service.Save_QuickLinkAsync(entity);
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Delete_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = await _service.Delete_QuickLinkAsync(entity);
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> ActiveChange_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = await _service.ActiveChange_QuickLinkAsync(entity);
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion



    }
}