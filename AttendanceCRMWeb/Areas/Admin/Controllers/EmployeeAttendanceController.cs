using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Repository.Infrastructure;
using Service.Attendance;
using Service.BasicInfo;
using Service.Consts;
using Service.UserManagement.Attendance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Utility;
using Utility.Filters;
using Utility.PublicEnum;
using Utility.Utitlies;
using ViewModel.Common;
using ViewModel.UserManagement.Attendance;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.PresenceAbsence })]
    public class EmployeeAttendanceController : BaseController
    {
        #region Fields
        private readonly IAttendanceReportService _serviceAttendanceReport;
        private readonly IShiftService _serviceShiftService;
        private readonly ITransactionRequestService _serviceTransactionRequest;
        private readonly IDeviceInfoService _serviceDeviceInfo;
        #endregion

        #region ctor
        public EmployeeAttendanceController(
            IAttendanceReportService serviceAttendanceReport,
            IShiftService serviceShiftService,
            ITransactionRequestService serviceTransactionRequest,
            IDeviceInfoService serviceDeviceInfo
            )
        {
            _serviceAttendanceReport = serviceAttendanceReport;
            _serviceShiftService = serviceShiftService;
            _serviceTransactionRequest = serviceTransactionRequest;
            _serviceDeviceInfo = serviceDeviceInfo;
        }
        #endregion

        public async Task<ActionResult> Index()
        {
            var _res = await PrepareAction_Calendar(new CalendarVm { PageNum = 1, UrlData = "/Admin/EmployeeAttendance/P_Calendar", PageSize = _selectCount, FirstPage = 1 });
            return View(_res);
        }

        #region Calendar

        private async Task<viewModel<CalendarVm>> PrepareAction_Calendar(CalendarVm model)
        {
            try
            {
                viewModel<CalendarVm> list2 = await _serviceShiftService.GetAllCalendar(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_Calendar",
                    urlEdit: "",
                    tableIdDiv: "divListsCalendar",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_Calendar",
                    functionWillGoForPageing: "operationAjaxFor_Calendar", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Calendar_Index(int page = 1)
        {
            var model = await PrepareAction_Calendar(new CalendarVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_Calendar", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("Calendar_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_Calendar(CalendarVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_Calendar";
                return Json(this.RenderPartialToString("P_Calendar", (await PrepareAction_Calendar(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_Calendar()
        {
            try
            {
                viewModel<CalendarVm> result = new viewModel<CalendarVm>();
                result.TLists = new List<CalendarVm>();
                result.T_model = new CalendarVm();
                result.T_model = await _serviceShiftService.GetCalendar(null);
                SetViewBag_Calendar(result.T_model);
                //return PartialView(result);
                return Json(this.RenderPartialToString("Create_Calendar", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Edit_Calendar(int id)
        {
            try
            {
                viewModel<CalendarVm> result = new viewModel<CalendarVm>();
                result.TLists = new List<CalendarVm>();
                result.T_model = new CalendarVm();
                result.T_model = await _serviceShiftService.GetCalendar(id);
                SetViewBag_Calendar(result.T_model);
                //return PartialView("Create_Calendar", result);
                return Json(this.RenderPartialToString("Create_Calendar", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save_Calendar(viewModel<CalendarVm> model)
        {
            try
            {
                await _serviceShiftService.SaveCalendar(model.T_model);
                return Json(new { }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete_Calendar(CalendarVm model)
        {
            await _serviceShiftService.Delete_Calendar(model);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public void SetViewBag_Calendar(CalendarVm model)
        {
            ViewData["YearsNumber"] = new SelectList(model.YearsNumberList, "Value", "Text", model.YearsNumber);
        }
        #endregion

        #region JobTime
        private async Task<viewModel<JobTimeVm>> PrepareAction_JobTime(JobTimeVm model)
        {
            try
            {
                viewModel<JobTimeVm> list2 = await _serviceShiftService.GetAllJobTime(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_JobTime",
                    urlEdit: "",
                    tableIdDiv: "divListsJobTime",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_JobTime",
                    functionWillGoForPageing: "operationAjaxFor_JobTime", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> JobTime_Index(int page = 1)
        {
            var model = await PrepareAction_JobTime(new JobTimeVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_JobTime", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("JobTime_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_JobTime(JobTimeVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_JobTime";
                return Json(this.RenderPartialToString("P_JobTime", (await PrepareAction_JobTime(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_JobTime()
        {
            try
            {
                var result = new viewModel<JobTimeVm>();
                result.TLists = new List<JobTimeVm>();
                result.T_model = new JobTimeVm();
                result.T_model = await _serviceShiftService.GetJobTime(null);
                return Json(this.RenderPartialToString("Create_JobTime", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Edit_JobTime(int id)
        {
            var result = new viewModel<JobTimeVm>();
            result.TLists = new List<JobTimeVm>();
            result.T_model = new JobTimeVm();
            result.T_model = await _serviceShiftService.GetJobTime(id);
            //return PartialView("Create_JobTime", model);
            return Json(this.RenderPartialToString("Create_JobTime", result), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> Save_JobTime(viewModel<JobTimeVm> model)
        {
            try
            {
                await _serviceShiftService.SaveJobTime(model.T_model);
                return Json(new { }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete_JobTime(JobTimeVm model)
        {
            await _serviceShiftService.Delete_JobTime(model);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region ShiftWork
        private async Task<viewModel<ShiftWorkVm>> PrepareAction_ShiftWork(ShiftWorkVm model)
        {
            try
            {
                viewModel<ShiftWorkVm> list2 = await _serviceShiftService.GetAllShiftWork(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_ShiftWork",
                    urlEdit: "",
                    tableIdDiv: "divListsShiftWork",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_ShiftWork",
                    functionWillGoForPageing: "operationAjaxFor_ShiftWork", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> ShiftWork_Index(int page = 1)
        {
            var model = await PrepareAction_ShiftWork(new ShiftWorkVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_ShiftWork", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("ShiftWork_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_ShiftWork(ShiftWorkVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_ShiftWork";
                return Json(this.RenderPartialToString("P_ShiftWork", (await PrepareAction_ShiftWork(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_ShiftWork()
        {
            var result = new viewModel<ShiftWorkVm>();
            result.TLists = new List<ShiftWorkVm>();
            result.T_model = new ShiftWorkVm();
            result.T_model = await _serviceShiftService.GetShiftWork(null);
            SetViewBag_ShiftWork(result.T_model);
            ShiftMonthData = new List<ShiftMonth>();
            return Json(this.RenderPartialToString("Create_ShiftWork", result), JsonRequestBehavior.AllowGet);
        }
        public async Task<ActionResult> Edit_ShiftWork(int id)
        {
            var result = new viewModel<ShiftWorkVm>();
            result.TLists = new List<ShiftWorkVm>();
            result.T_model = new ShiftWorkVm();
            result.T_model = await _serviceShiftService.GetShiftWork(id);
            SetViewBag_ShiftWork(result.T_model);
            return Json(this.RenderPartialToString("Edit_ShiftWork", result), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> Save_ShiftWork(viewModel<ShiftWorkVm> model)
        {
            try
            {
                List<ShiftWork_DayVm> UnSetJobTimeRecord = new List<ShiftWork_DayVm>();
                model.T_model.ModifiedDate = DateTime.Now;

                var _shiftWork_daylist = new List<ShiftWork_DayVm>();
                foreach (var item in ShiftMonthData)
                {
                    if (item.shiftMonth_Days != null && item.shiftMonth_Days.Count > 0)
                    {
                        foreach (var _subItem in item.shiftMonth_Days)
                        {
                            var _shiftwork_day = new ShiftWork_DayVm
                            {
                                DayValue = _subItem.DateEn,
                                IsVacation = _subItem.IsVacation,
                                JobTime_Id = _subItem.JobTime
                            };
                            _shiftWork_daylist.Add(_shiftwork_day);
                        }
                    }
                }
                UnSetJobTimeRecord = new List<ShiftWork_DayVm>();
                UnSetJobTimeRecord = _shiftWork_daylist.Where(x => x.IsVacation == false && x.JobTime_Id == 0).ToList();
                if (UnSetJobTimeRecord.Count() > 0)
                {
                    return Json(new { error = true, message = "لطفا برای تمامی روزهای سال ساعت کاری را تنظیم نمایید" }, JsonRequestBehavior.AllowGet);
                }
                model.T_model.shiftWork_DayVms = _shiftWork_daylist;

                await _serviceShiftService.SaveShiftWork(model.T_model);
                return Json(new { }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete_ShiftWork(ShiftWorkVm model)
        {
            await _serviceShiftService.Delete_ShiftWork(model);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        public void SetViewBag_ShiftWork(ShiftWorkVm model)
        {
            ViewData["Calendar_Id"] = new SelectList(model.calendarvmList, "Value", "Text", model.Calendar_Id);
            ViewData["jobTimevm"] = new SelectList(model.jobTimevmList, "Value", "Text", model.jobTimevm);
        }
        #endregion

        #region User shift
        private async Task<viewModel<PubUser_ShiftVm>> PrepareAction_UserShift(PubUser_ShiftVm model)
        {
            try
            {
                viewModel<PubUser_ShiftVm> list2 = await _serviceShiftService.GetAllUserShift(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_JobTime",
                    urlEdit: "",
                    tableIdDiv: "divListsUserShift",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_JobTime",
                    functionWillGoForPageing: "operationAjaxFor_UserShift", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> UserShift_Index(int page = 1)
        {
            var model = await PrepareAction_UserShift(new PubUser_ShiftVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_UserShift", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("UserShift_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_UserShift(PubUser_ShiftVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_UserShift";
                return Json(this.RenderPartialToString("P_UserShift", (await PrepareAction_UserShift(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_UserShift()
        {
            try
            {
                var result = new viewModel<PubUser_ShiftVm>();
                result.TLists = new List<PubUser_ShiftVm>();
                result.T_model = new PubUser_ShiftVm();
                result.T_model = await _serviceShiftService.GetUserShift(null);

                ViewData["PuUser_Id"] = new SelectList(result.T_model.PuUserList, "Value", "Text", result.T_model.PuUser_Id);
                ViewData["ShiftWork_Id"] = new SelectList(result.T_model.ShiftWorkList, "Value", "Text", result.T_model.ShiftWork_Id);

                return Json(this.RenderPartialToString("Create_UserShift", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save_UserShift(viewModel<PubUser_ShiftVm> model)
        {
            try
            {
                if (model.T_model.ShiftWork_Id == 0) return Json(new DataModelResult { Error = true, Message = "شیفت کاری را انتخاب نمایید" }, JsonRequestBehavior.AllowGet);

                var _result = await _serviceShiftService.Entesab_UserShift(model.T_model);
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public static List<ShiftMonth> ShiftMonthData;
        public async Task<ActionResult> LoadCalendar(CalendarVm calendar)
        {
            ShiftMonthData = await _serviceShiftService.LoadCalendar(calendar);

            ViewData["JobTimeList"] = (await _serviceShiftService.GetAllJobTime(new ViewModel.PageingParamer { PageNum = 1, PageSize = 10000 })).TLists;
            return Json(this.RenderPartialToString("LoadCalendar", ShiftMonthData), JsonRequestBehavior.AllowGet);
        }
        public async Task<ActionResult> Edit_LoadCalendar(int id)
        {
            var _shiftwork = await _serviceShiftService.GetShiftWork(id);
            if (_shiftwork == null) return Json(new { error = true, message = "شیفت کاری یافت نشد" }, JsonRequestBehavior.AllowGet);

            ShiftMonthData = await _serviceShiftService.Edit_LoadCalendar(_shiftwork);

            ViewData["JobTimeList"] = (await _serviceShiftService.GetAllJobTime(new ViewModel.PageingParamer { PageNum = 1, PageSize = 10000 })).TLists;
            return Json(this.RenderPartialToString("LoadCalendar", ShiftMonthData), JsonRequestBehavior.AllowGet);
        }

        public async Task<ActionResult> SetJobTimeForDays(ShiftWorkVm jobTime)
        {
            try
            {
                ShiftMonthData = await _serviceShiftService.SetJobTimeForDays(jobTime, ShiftMonthData);
                ViewData["JobTimeList"] = (await _serviceShiftService.GetAllJobTime(new ViewModel.PageingParamer { PageNum = 1, PageSize = 10000 })).TLists;
                return Json(this.RenderPartialToString("LoadCalendar", ShiftMonthData), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ActionResult> ChangeJobTimeForDays(ShiftMonth_Day entity)
        {
            try
            {
                ShiftMonthData = await _serviceShiftService.ChangeJobTimeForDays(entity, ShiftMonthData);
                ViewData["JobTimeList"] = (await _serviceShiftService.GetAllJobTime(new ViewModel.PageingParamer { PageNum = 1, PageSize = 10000 })).TLists;
                return Json(this.RenderPartialToString("LoadCalendar", ShiftMonthData), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> ChangeVcation(ShiftMonth_Day date)
        {
            try
            {
                if (ShiftMonthData != null && ShiftMonthData.Count > 0)
                {
                    var _break = false;
                    foreach (var _shiftmonth in ShiftMonthData)
                    {
                        foreach (var item in _shiftmonth.shiftMonth_Days)
                        {
                            if (item.DateEn.Date == date.DateEn.Date)
                            {
                                item.IsVacation = !item.IsVacation;
                                item.JobTime = 0;
                                item.JobTimeName = "";
                                _break = true;
                                break;
                            }
                        }
                        if (_break) break;
                    }
                }
                ViewData["JobTimeList"] = (await _serviceShiftService.GetAllJobTime(new ViewModel.PageingParamer { PageNum = 1, PageSize = 10000 })).TLists;
                return Json(this.RenderPartialToString("LoadCalendar", ShiftMonthData), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region Att Log
        private async Task<viewModel<TimeRecordVm>> PrepareAction_AttLog(TimeRecordVm model)
        {
            try
            {
                var list2 = await _serviceAttendanceReport.GetAllAttLog(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_AttLog",
                    urlEdit: "",
                    tableIdDiv: "divListsAttLog",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_AttLog",
                    functionWillGoForPageing: "operationAjaxFor_AttLog", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> AttLog_Index(int page = 1)
        {
            var model = await PrepareAction_AttLog(new TimeRecordVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_AttLog", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("AttLog_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_AttLog(TimeRecordVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_AttLog";
                return Json(this.RenderPartialToString("P_AttLog", (await PrepareAction_AttLog(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_AttLog()
        {
            try
            {
                viewModel<TimeRecordVm> result = new viewModel<TimeRecordVm>();
                result.TLists = new List<TimeRecordVm>();
                result.T_model = new TimeRecordVm();
                result.T_model = await _serviceAttendanceReport.GetAttLog(new TimeRecordVm());
                SetViewBag_AttLog(result.T_model);
                return Json(this.RenderPartialToString("Create_AttLog", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Edit_AttLog(TimeRecordVm model)
        {
            try
            {
                viewModel<TimeRecordVm> result = new viewModel<TimeRecordVm>();
                result.TLists = new List<TimeRecordVm>();
                result.T_model = new TimeRecordVm();
                result.T_model = await _serviceAttendanceReport.GetAttLog(model);
                SetViewBag_AttLog(result.T_model);
                return Json(this.RenderPartialToString("Create_AttLog", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save_AttLog(viewModel<TimeRecordVm> model)
        {
            try
            {
                var _res = await _serviceAttendanceReport.SaveAttLog(model.T_model);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete_AttLog(TimeRecordVm model)
        {
            var _res = await _serviceAttendanceReport.Delete_AttLog(model);
            return Json(_res, JsonRequestBehavior.AllowGet);
        }
        public void SetViewBag_AttLog(TimeRecordVm model)
        {
            ViewData["CardNo"] = new SelectList(model.PersonelLists, "Value", "Text", model.CardNo);
        }
        #endregion

        #region Transaction Request
        private async Task<viewModel<TransactionRequestVm>> PrepareAction_TransReq(TransactionRequestVm model)
        {
            try
            {
                model.FromDateRequest = DateTime.Now.AddYears(-5);
                model.ToDateRequest = DateTime.Now.AddYears(15);
                var list2 = await _serviceTransactionRequest.GetAllTransactionRequest(model);

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/EmployeeAttendance/Delete_TransReq",
                    urlEdit: "",
                    tableIdDiv: "divListsTransReq",
                    urlDeleteRows: "/Admin/EmployeeAttendance/Delete_TransReq",
                    functionWillGoForPageing: "operationAjaxFor_TransReq", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> TransReq_Index(int page = 1)
        {
            var model = await PrepareAction_TransReq(new TransactionRequestVm { PageNum = page, UrlData = "/Admin/EmployeeAttendance/P_TransReq", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("TransReq_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_TransReq(TransactionRequestVm model)
        {
            try
            {
                model.UrlData = "/Admin/EmployeeAttendance/P_TransReq";
                return Json(this.RenderPartialToString("P_TransReq", (await PrepareAction_TransReq(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_TransReq()
        {
            try
            {
                viewModel<TransactionRequestVm> result = new viewModel<TransactionRequestVm>();
                result.TLists = new List<TransactionRequestVm>();
                result.T_model = new TransactionRequestVm();
                result.T_model = await _serviceTransactionRequest.GetTransactionRequest(new TransactionRequestVm());
                SetViewBag_TransReq(result.T_model);
                return Json(this.RenderPartialToString("Create_TransReq", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create_EmployeeTransReq(Guid PersonelId)
        {
            try
            {
                viewModel<TransactionRequestVm> result = new viewModel<TransactionRequestVm>();
                result.TLists = new List<TransactionRequestVm>();
                result.T_model = new TransactionRequestVm();
                result.T_model = await _serviceTransactionRequest.GetTransactionRequest(new TransactionRequestVm());
                result.T_model.PersonID = PersonelId;
                SetViewBag_TransReq(result.T_model);
                return Json(this.RenderPartialToString("Create_EmployeeTransReq", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Edit_TransReq(TransactionRequestVm model)
        {
            try
            {
                viewModel<TransactionRequestVm> result = new viewModel<TransactionRequestVm>();
                result.TLists = new List<TransactionRequestVm>();
                result.T_model = new TransactionRequestVm();
                result.T_model = await _serviceTransactionRequest.GetTransactionRequest(model);
                SetViewBag_TransReq(result.T_model);
                return Json(this.RenderPartialToString("Create_TransReq", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save_TransReq(viewModel<TransactionRequestVm> model)
        {
            try
            {
                var _res = await _serviceTransactionRequest.Save(model.T_model);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete_TransReq(TransactionRequestVm model)
        {
            var _res = await _serviceTransactionRequest.DeleteReqStatus(model);
            return Json(_res, JsonRequestBehavior.AllowGet);
        }
        public void SetViewBag_TransReq(TransactionRequestVm model)
        {
            ViewData["ReqType"] = new SelectList(model.ReqTypeList, "Value", "Text", model.ReqType);
            ViewData["Transaction_Id"] = new SelectList(model.TransactionList, "Value", "Text", model.Transaction_Id);
            ViewData["PersonID"] = new SelectList(model.PuUserList, "Value", "Text", model.PersonID);
        }



        public async Task<ActionResult> GetTranactionReqList()
        {
            var list = await _serviceTransactionRequest.GetAllTransactionRequest(new TransactionRequestVm
            {
                FromDateRequest = DateTime.Now,
                ToDateRequest = DateTime.Now.AddYears(5),
                ReqStatus = 1,
                PageNum = 1,
                PageSize = 1000
            });
            return PartialView(list);
            //return Json(this.RenderPartialToString("GetTranactionReqList", list), JsonRequestBehavior.AllowGet);
        }
        public async Task<ActionResult> GetTranactionReqList_Header()
        {
            try
            {
                var list = await _serviceTransactionRequest.GetAllTransactionRequest(new TransactionRequestVm
                {
                    FromDateRequest = DateTime.Now,
                    ToDateRequest = DateTime.Now.AddYears(5),
                    ReqStatus = 1,
                    PageNum = 1,
                    PageSize = 1000
                });
                return PartialView(list);
                //return Json(this.RenderPartialToString("GetLaboratorList_Header", list), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> AcceptTransactionRequest(Guid Id)
        {
            return Json(await _serviceTransactionRequest.AcceptTransactionRequest(Id), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> DeclineTransactionRequest(Guid Id)
        {
            return Json(await _serviceTransactionRequest.DeclineTransactionRequest(Id), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Import with Excel

        public async Task<ActionResult> ImportFromUSB()
        {
            try
            {
                var model = new ImportFromUSBVm();

                var _deviceList = (from item in await _serviceDeviceInfo.GetAllDevice()
                                   select new NormalJsonClass
                                   {
                                       Text = item.DeviceFullName,
                                       Value = item.Id.ToString(),
                                   }).ToList();
                ViewData["FingerPrintDevice"] = new SelectList(_deviceList, "Value", "Text", model.FingerPrintDevice);


                return View(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpPost]
        public async Task<ActionResult> ImportFromUSB(ImportFromUSBVm model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var _fileService = EngineContext.Resolve<IFileService>();
            var fileVm = await _fileService.AddFileWithHttpPostedFilePath(model.ExcelFile, Server.MapPath(AppSettings.DocumentFolder), AppSettings.DocumentFolder, "Employee");

            model.File_Id = fileVm.Id;
            var _result = await _serviceAttendanceReport.ImportAttLogFromUSB(model);
            if(_result != null && _result.error)
            {
                return View(model);
            }
            else
            {
                return View(model);
            }
        }

        #endregion

    }
}