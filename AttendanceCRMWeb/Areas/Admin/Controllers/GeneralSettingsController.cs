using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Service.Common;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static Stimulsoft.Report.QuickButtons.StiWpfQuickButtonAttribute;
using Utility.EXT;
using Utility.PublicEnum;
using Utility;
using ViewModel.Common;
using Service.Attendance;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.BasicSetting })]
    public class GeneralSettingsController : BaseController
    {

        private readonly IGeneralSettingService _service;
        private readonly IDeviceInfoService _serviceDeviceInfo;

        protected override string FormName
        {
            get { return Resources.Md.Setting; }
        }

        public GeneralSettingsController(
            IGeneralSettingService Service,
            IDeviceInfoService serviceDeviceInfo
            )
        {
            _service = Service;
            _serviceDeviceInfo = serviceDeviceInfo;
        }

        [FillSecurityDepFilter(RoleType = EnumRole.BasicSetting)]
        public async Task<ActionResult> Index()
        {
            var model = await _service.GetGeneralSettingVm();

            List<NormalJsonClass> lstEnumList = new List<NormalJsonClass>();
            foreach (var item in EnumHelper<FieldDynamicPatient>.EnumToList())
                lstEnumList.Add(new NormalJsonClass()
                {
                    Text = item.ToString(),
                    Value = EnumHelper<FieldDynamicPatient>.GetDisplayValue(item)
                });

            ViewBag.enumList = lstEnumList;
            ViewData["PaymentName"] = new SelectList(_service.GetPaymentNameEnumList(), "Value", "Text", model.PaymentName);

            var _deviceList = (from item in await _serviceDeviceInfo.GetAllDevice()
                               select new NormalJsonClass
                               {
                                   Text = item.DeviceFullName,
                                   Value = item.Id.ToString(),
                               }).ToList();
            ViewData["FingerPrintDevice"] = new SelectList(_deviceList, "Value", "Text", model.FingerPrintDevice);

            return View(model);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.BasicSetting_Update })]
        [HttpPost]
        public async Task<ActionResult> SaveSetting(GeneralSettingVm model)
        {
            if (ModelState.IsValid)
            {
                var isCreate = model.Id == Guid.Empty;
                try
                {
                    var _result = await _service.SaveGeneralSetting(model, Server.MapPath(AppSettings.SettingFolder), AppSettings.SettingFolder);

                    if (_result != null && _result.error)
                    {
                        ModelState.AddModelError("", _result.message);
                        return View("Index", model);
                    }
                    else
                    {
                        Sessions.ResultMessage = isCreate
                        ? GlobalMessage.InsertResult(FormName)
                        : GlobalMessage.UpdateResult(FormName);
                    }
                }
                catch (Exception ex)
                {
                    Sessions.ResultMessage = isCreate
                    ? GlobalMessage.InsertResult(FormName, false)
                    : GlobalMessage.UpdateResult(FormName, false);
                    return View("Index", model);
                }
            }
            else
            {
                ModelState.AddModelError("", "لطفا در تکمیل اطلاعات دقت نمایید");
                return View("Index", model);
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<ActionResult> DeleteImg()
        {
            var isCreate = true;
            try
            {
                await _service.DeleteImgSetting();
                Sessions.ResultMessage = isCreate
                ? GlobalMessage.InsertResult(FormName)
                : GlobalMessage.UpdateResult(FormName);
            }
            catch (Exception ex)
            {
                Sessions.ResultMessage = isCreate
                ? GlobalMessage.InsertResult(FormName, false)
                : GlobalMessage.UpdateResult(FormName, false);
            }
            return RedirectToAction("Index");
        }

    }
}