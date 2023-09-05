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
                    UrlData = "/Admin/Device/P_Device",
                    PageSize = _selectCount,
                    FirstPage = 1
                });
            return View(_res);
        }

        #region Device

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
                    tableIdDiv: "divListsDevice",
                    urlDeleteRows: "/Admin/Device/Delete",
                    functionWillGoForPageing: "operationAjaxFor_Device", firstPage: model.FirstPage);

                return list2;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [AjaxOnlyFilter]
        public async Task<ActionResult> P_Device(NewDeviceVm model)
        {
            try
            {
                model.UrlData = "/Admin/Device/P_Device";
                return Json(this.RenderPartialToString("P_Device", (await PrepareAction(model))), JsonRequestBehavior.AllowGet);
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
                result.T_model = await _serviceDeviceInfo.GetDeviceInfo((int?)null);
                SetViewBag(result.T_model);
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
                result.T_model = await _serviceDeviceInfo.GetDeviceInfo((int?)id);
                SetViewBag(result.T_model);
                return Json(this.RenderPartialToString("Create", result), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void SetViewBag(NewDeviceVm model)
        {
            ViewData["FPDeviceType"] = new SelectList(model.FPDeviceTypeList, "Value", "Text", model.FPDeviceType);
        }

        [HttpPost]
        public async Task<ActionResult> Save(viewModel<NewDeviceVm> model)
        {
            try
            {
                var _res = await _serviceDeviceInfo.Save(model.T_model);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<JsonResult> Delete(NewDeviceVm model)
        {
            var _res = await _serviceDeviceInfo.DeleteDevice(model.Id);
            return Json(_res, JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> ImportAllAttLogFromDevice(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ImportAllAttLogFromDevice(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<JsonResult> ConnectDevice(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ConnectDevice(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> DisConnectDevice(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.DisConnectDevice(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<JsonResult> ClearAdmin(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ClearAdmin(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> ClearAllData(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ClearAllData(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> ClearAllLogs(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ClearAllLogs(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> ClearAllFp(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ClearAllFp(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JsonResult> ClearAllUser(int Id)
        {
            try
            {
                var _res = await _serviceDeviceInfo.ClearAllUser(Id);
                return Json(_res, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        #endregion


    }
}