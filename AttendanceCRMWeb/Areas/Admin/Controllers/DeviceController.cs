using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Service.Attendance;
using Service.UserManagement.Attendance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Utility.Filters;
using Utility.PublicEnum;
using Utility.Utitlies;
using ViewModel.UserManagement.Attendance;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [RoleFullMedicalCenterFilter(Role = MedicalCenterRole.Attendance)]
    public class DeviceController : BaseController
    {
        #region Fields
        private readonly IDeviceInfoService _serviceDeviceInfo;
        #endregion

        #region ctor
        public DeviceController(
            IDeviceInfoService serviceShiftService
            )
        {
            _serviceDeviceInfo = serviceShiftService;
        }
        #endregion

        public async Task<ActionResult> Index()
        {
            var _res = await PrepareAction(
                new NewDeviceVm
                {
                    PageNum = 1,
                    UrlData = "/Admin/Device/P_Calendar",
                    PageSize = _selectCount,
                    FirstPage = 1
                });
            return View(_res);
        }

        #region Calendar

        private async Task<viewModel<NewDeviceVm>> PrepareAction(NewDeviceVm model)
        {
            try
            {
                viewModel<NewDeviceVm> list2 = new viewModel<NewDeviceVm>();
                list2.TLists = await _serviceDeviceInfo.GetAllDevice();

                list2.CommonCustomViewTablePaging = list2.FillPageingData(list2.TLists.Count(),
                    urlData: model.UrlData,
                    _selectCount,
                    list2.CountAll_TLists,
                    "/Admin/Device/Delete",
                    urlEdit: "",
                    tableIdDiv: "divListsCalendar",
                    urlDeleteRows: "/Admin/Device/Delete",
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
            var model = await PrepareAction(new NewDeviceVm { PageNum = page, UrlData = "/Admin/Device/P_Calendar", PageSize = _selectCount, FirstPage = 1 });
            return Json(this.RenderPartialToString("Calendar_Index", model), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_Calendar(NewDeviceVm model)
        {
            try
            {
                model.UrlData = "/Admin/Device/P_Calendar";
                return Json(this.RenderPartialToString("P_Calendar", (await PrepareAction(model))), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Create()
        {
            try
            {
                viewModel<NewDeviceVm> result = new viewModel<NewDeviceVm>();
                result.TLists = new List<NewDeviceVm>();
                result.T_model = new NewDeviceVm();
                result.T_model = await _serviceDeviceInfo.GetCalendar(null);
                SetViewBag_Calendar(result.T_model);
                //return PartialView(result);
                return Json(this.RenderPartialToString("Create", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ActionResult> Edit(int id)
        {
            try
            {
                viewModel<NewDeviceVm> result = new viewModel<NewDeviceVm>();
                result.TLists = new List<NewDeviceVm>();
                result.T_model = new NewDeviceVm();
                result.T_model = await _serviceDeviceInfo.GetCalendar(id);
                SetViewBag_Calendar(result.T_model);
                //return PartialView("Create", result);
                return Json(this.RenderPartialToString("Create", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Save(viewModel<NewDeviceVm> model)
        {
            try
            {
                await _serviceDeviceInfo.Save(model.T_model);
                return Json(new { }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> Delete(NewDeviceVm model)
        {
            await _serviceDeviceInfo.DeleteDevice(model.Id);
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public void SetViewBag_Calendar(NewDeviceVm model)
        {
            ViewData["YearsNumber"] = new SelectList(model.YearsNumberList, "Value", "Text", model.YearsNumber);
        }
        #endregion
    }
}