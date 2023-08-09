using AttendanceCRMWeb.Controllers;
using Service.Common;
using Service.Cost;
using Service.UserManagement.Attendance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ViewModel.UserManagement;
using Utility;
using Utility.PublicEnum;
using ViewModel;
using ViewModel.Report;
using AttendanceCRMWeb.Filters;
using Stimulsoft.Report.Components;
using Utility.Utitlies;
using Service.Consts;
using Utility.Filters;
using Stimulsoft.Base;
using Stimulsoft.Base.Localization;
using System.Drawing.Printing;
using System.IO;
using Stimulsoft.Report;
using Stimulsoft.Report.Components.Table;
using Stimulsoft.Report.Mvc;
using ViewModel.UserManagement.Attendance;
using System.Drawing;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    public class StaticReportController : BaseController
    {
        #region Fields
        private readonly ICostService _serviceCost;
        private readonly IShiftService _serviceShift;
        private readonly ICodingService _serviceCoding;
        private readonly IGeneralSettingService _serviceGeneralSetting;
        private readonly ICompanyAccountService _serviceSompanyAccount;
        private readonly IAttendanceReportService _serviceAttendanceReport;
        private ViewModel.ReportParameter model { get; set; } = new ViewModel.ReportParameter();
        #endregion

        #region Ctor
        public StaticReportController(
            ICostService costService,
            ICompanyAccountService companyAccountServiceService,
            ICodingService codingService,
            IAttendanceReportService serviceAttendanceReport,
            IShiftService serviceShiftService,
            IAttendanceReportService attendanceReportService,
            IGeneralSettingService GeneralSettingService
            )
        {
            _serviceCost = costService;
            _serviceSompanyAccount = companyAccountServiceService;
            _serviceCoding = codingService;
            _serviceAttendanceReport = serviceAttendanceReport;
            _serviceShift = serviceShiftService;
            _serviceAttendanceReport = attendanceReportService;

            _serviceGeneralSetting = GeneralSettingService;

        }
        #endregion

        #region Utilities

        private async Task SetGeneralSeting(StiReport report, string namePage = "", string textDateName = "")
        {
            try
            {
                var model = await _serviceCost.GetGeneralSettingLogo();

                var image = string.IsNullOrEmpty(namePage) ? report.GetComponentByName("Logo") as StiImage : report.GetComponentByName(namePage) as StiImage;

                if (System.IO.File.Exists(Server.MapPath(model)) && image != null)
                {
                    image.Image = Image.FromFile(Server.MapPath(model));
                }
                SetDateForReportHeader(report, textDateName);
            }
            catch (Exception ex)
            {

            }
        }
        private void SetMinaLogo(StiReport report, string namePage = "")
        {
            try
            {
                var _minadentLogo = string.IsNullOrEmpty(namePage) ? report.GetComponentByName("logominadent") as StiImage : report.GetComponentByName(namePage) as StiImage;
                if (_minadentLogo != null)
                    _minadentLogo.Image = Public.CurrentUser.IsCenterActivityType == false ? Image.FromFile(Server.MapPath(@"/Media/logo.PNG")) :
                        Image.FromFile(Server.MapPath(@"/Media/LogoMedical.png"));
            }
            catch { }
        }
        private void SetDateForReportHeader(StiReport report, string textName = "")
        {
            try
            {
                var textDateb = string.IsNullOrEmpty(textName) ? report.GetComponentByName("txtDate") as StiText : report.GetComponentByName(textName) as StiText;
                //textDateb.SetText(Utility.Utitlies.Utility.IsPersianDate(DateTime.Now.ToString(Utility.Utitlies.Utility.yyyyMMdd)) ? DateTime.Now.ToString(Utility.Utitlies.Utility.yyyyMMdd) : DateTimeOperation.M2S(DateTime.Now));
                if (textDateb != null)
                    textDateb.SetText(DateTimeOperation.M2S(DateTime.Now));

            }
            catch { }
        }
        #endregion

        #region Methods

        public ActionResult Index(string flag)
        {
            ViewBag.flag = flag;
            return View();
        }

        #region StReport
        /* گزارش مربوطه رو نمایش می دهد.  */
        public ActionResult ShowReport()
        {
            try
            {
                try
                {
                    var _path = Server.MapPath("~/App_Data/license.key");
                    if (System.IO.File.Exists(_path))
                    {
                        StiLicense.LoadFromFile(_path);
                    }
                }
                catch (Exception ex)
                {
                }


                var _pathLocalization = Server.MapPath("~/Localization/fa.xml");
                StiLocalization.Load(_pathLocalization);
                // Create the dashboard object
                var report = (StiReport)Session["rptResult"];

                var _fontpath = Server.MapPath("~/fonts/Vazir-FD-WOL.ttf");
                Stimulsoft.Base.StiFontCollection.AddFontFile(_fontpath);
                // Return template to the Viewer
                return StiMvcViewer.GetReportResult(report);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult ShowPrint()
        {
            try
            {
                var report = (StiReport)Session["rptResult"];
                return StiMvcViewer.PrintReportResult(report);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult ViewerEvent()
        {
            try
            {
                var _resq = Request;
                return StiMvcViewer.ViewerEventResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region MedicalCenterCostReport
        //گزارش حسابداری(گزارشات هزینه ها)ا
        [CustomAutorizeFilter(Role = new[] { EnumRole.AppReports_AccountingReports_CostReport })]
        public async Task<ActionResult> MedicalCenterCostReport()
        {
            //var model = new ReportParameter();
            ViewData["CostCode"] = new SelectList(await _serviceCost.GetCostCodeList(1), "Value", "Text", model.CostCode);
            ViewData["costPersonID"] = new SelectList(await _serviceCost.GetPersonList(), "Value", "Text", model.costPersonID);
            return View(model);
        }

        /* گزارش حسابداری با توجه به پارامتر ورودی برمیگردونه.  */
        [CustomAutorizeFilter(Role = new[] { EnumRole.AppReports_AccountingReports_CostReport })]
        public async Task<ActionResult> GetMedicalCenterCostReport(ViewModel.ReportParameter parameter)
        {
            var model = await _serviceCost.GetMedicalCenterCostReport(parameter);
            var infoMedical = await _serviceGeneralSetting.GetInfoGlobal();
            var report = new StiReport();
            report.Load(Server.MapPath("~/App_Data/StimulSoftReport/MedicalCenterCostReport.mrt"));
            report.RegBusinessObject("MedicalCenterCostReport", model);
            report.RegBusinessObject("InformationGlobalReport", infoMedical);
            var _page1 = report.GetComponentByName("Page1") as StiPage;
            var _page2 = report.GetComponentByName("Page2") as StiPage;

            if (parameter.Status == "1")
            {
                _page1.Enabled = true;
                _page2.Enabled = false;
                await SetGeneralSeting(report);
                SetMinaLogo(report);
            }
            else
            {
                _page1.Enabled = false;
                _page2.Enabled = true;
                await SetGeneralSeting(report, "Image1", "Text21");
                SetMinaLogo(report, "Image2");
            }


            //await SetGeneralSeting(report);
            //SetMinaLogo(report);

            //SetFromDateAndToDateForReportHeader(report, parameter);

            Session["rptResult"] = report;
            return PartialView("_ReportResult");
        }

        #endregion

        #region CompanyAccountReport        

        /*گزارش  صورت وضعیت طرف های حساب*/
        [CustomAutorizeFilter(Role = new[] { EnumRole.AppReports_AccountingReports_CompanyAccountStatusReport })]
        public async Task<ActionResult> CompanyAccountReport()
        {
            //var model = new ReportParameter();
            ViewData["CostCode"] = new SelectList(await _serviceCost.GetCostCodeList(), "Value", "Text", model.CostCode);
            ViewData["costPersonID"] = new SelectList(await _serviceSompanyAccount.GetListCompanyAsync("0" + ((int)CodingEnum.Company)), "Value", "Text", model.costPersonID);
            //Accountlist.PersonList = GetListCompany("015132");
            return View(model);
        }

        public async Task<JsonResult> GetCompanyAccountListName(int? Id, string parentId)
        {
            //Comment By Mobin
            //if (parentId == "0120201" || parentId == "0120202")
            //Create By Mobin
            if (parentId == "0120201" || parentId == "0120202" || parentId == "0120203")
            {
                var result = await _serviceSompanyAccount.GetListAsync(parentId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var result = await _serviceSompanyAccount.GetListCompanyAsync(parentId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        /* گزارش صورت وضعیت طرف های حساب با توجه به پارامتر های ورودی برمی گردونه*/
        [CustomAutorizeFilter(Role = new[] { EnumRole.AppReports_AccountingReports_CompanyAccountStatusReport })]
        public async Task<ActionResult> GetCompanyAccount(ViewModel.ReportParameter parameter)
        {
            var model = await _serviceSompanyAccount.GetCompanyAccountAsync(parameter);
            decimal Pricecreditor = model.Sum(p => p.Pricecreditor);
            decimal Price = model.Sum(p => p.Price);
            var infoMedical = await _serviceGeneralSetting.GetInfoGlobal();
            infoMedical.PriceTafrigh = (Math.Abs(Pricecreditor - (decimal)Price)).ToString("#,##0");
            var report = new StiReport();
            report.Load(Server.MapPath("~/App_Data/StimulSoftReport/CompanyAccountReport.mrt"));
            var textDateb = report.GetComponentByName("txtDate") as StiText;
            textDateb.SetText(Utility.Utitlies.Utility.IsPersianDate(DateTime.Now.ToString(Utility.Utitlies.Utility.yyyyMMdd)) ? DateTime.Now.ToString(Utility.Utitlies.Utility.yyyyMMdd) : DateTimeOperation.M2S(DateTime.Now));
            await SetGeneralSeting(report);
            SetMinaLogo(report);
            report.RegBusinessObject("MedicalCenterCostReport", model);
            report.RegBusinessObject("InformationGlobalReport", infoMedical);
            Session["rptResult"] = report;
            return PartialView("_ReportResult");
        }


        public async Task<JsonResult> GetListName(int? Id, string parentId, Guid? selected = null)
        {
            if (parentId == "0120201" || parentId == "0120202" || parentId == "0120203")
            {
                var result = await _serviceSompanyAccount.GetListAsync(parentId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            else if (parentId == "015010402")
            {
                var result = await _serviceCost.GetListCompany("015010402");
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (parentId == "015010302")
            {
                var result = await _serviceSompanyAccount.GetListCompanyAsync("015010402");
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //var result = _costService.GetList(parentId);
                var result = await _serviceCost.GetListCompanyWithOtherCode(parentId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region Attendance Reoprt
        public async Task<ActionResult> TotalPerformancePersonal()
        {
            var model = new ViewModel.UserManagement.Attendance.ReportParameter();
            model.FromDate = DateTime.Now;
            model.ToDate = DateTime.Now;
            model.Personel_Lists = await _serviceShift.GetPersonelList();

            ViewData["PersonId"] = new SelectList(model.Personel_Lists, "Value", "Text", model.PersonId);

            return Json(this.RenderPartialToString("TotalPerformancePersonal", model), JsonRequestBehavior.AllowGet);
        }
        public async Task<ActionResult> TotalPerformancePersonal_Report(ViewModel.UserManagement.Attendance.ReportParameter parameter)
        {
            try
            {
                if (parameter.PersonId == Guid.Empty) throw new Exception("پرسنل را انتخاب نمایید");

                var _list = await _serviceAttendanceReport.TotalPerformancePersonal_Report(parameter);


                var report = new StiReport();
                report.Load(Server.MapPath("~/App_Data/StimulSoftReport/TotalPerformancecPersonal.mrt"));

                if (_list != null && _list.listAttenDanceVm != null && _list.listAttenDanceVm.Count > 0)
                {
                    report.BusinessObjectsStore.Clear();
                    report.RegBusinessObject("PersonelInfo", _list.personInfoVm);
                    report.RegBusinessObject("AttendanceList", _list.listAttenDanceVm);
                    report.RegBusinessObject("InformationGlobalReport", _list.informationGlobalReport);
                }
                Session["rptResult"] = report;

                return PartialView("_ReportResult");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #endregion

    }
}