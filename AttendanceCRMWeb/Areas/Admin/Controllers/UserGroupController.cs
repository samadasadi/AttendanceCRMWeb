using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Utility.PublicEnum;
using Utility;
using ViewModel.Security;
using ViewModel.UserManagement;
using Service.UserManagement;
using static Stimulsoft.Report.StiRecentConnections;
using ViewModel.UserManagement.Attendance;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.UserGroup })]
    public class UserGroupController : BaseController
    {
        private readonly IUserGroupService _service;
        protected override string FormName
        {
            get { return Resources.Md.UserGroup; }
        }
        public UserGroupController(IUserGroupService service)
        {
            _service = service;
        }

        [FillSecurityDepFilter(RoleType = EnumRole.UserGroup)]
        public async Task<ActionResult> Index()
        {
            var list = (await _service.GetUserGroupAll()).ToList();
            return View(list);
        }

        public async Task<JsonResult> GetList()
        {
            var list = (await _service.GetUserGroupAll()).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.UserGroup_Delete })]
        public async Task<JsonResult> DeleteRow(Guid id)
        {
            await _service.Delete(id);
            return Json(new DataModelResult { Error = false }, JsonRequestBehavior.AllowGet);
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.UserGroup_Add })]
        public async Task<ActionResult> Create(Guid? id)
        {
            var model = await _service.GetUserGroupVm(null);
            return View(model);
        }

        [HttpPost]
        [CustomAutorizeFilter(Role = new[] { EnumRole.UserGroup_Add, EnumRole.UserGroup_Update })]
        public async Task<ActionResult> Create(UserGroupVm model)
        {
            if (ModelState.IsValid)
            {
                var isCreate = model.Id == Guid.Empty;
                try
                {
                    await _service.SaveUserGroup(model);
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
            }
            else
            {
                ModelState.AddModelError("", "لطفا در تکمیل اطلاعات دقت نمایید");
                model.Role = await _service.GetAllRole(model.SelectedRole);
                return View(model);
            }
            return RedirectToAction("Index");
        }

        [CustomAutorizeFilter(Role = new[] { EnumRole.UserGroup_Update })]
        public async Task<ActionResult> Edit(Guid id)
        {
            var model = await _service.GetUserGroupVm(id);
            return View("Create", model);
        }

        public async Task<ActionResult> RollGroup()
        {
            var model = await _service.GetAllRollGroup();
            return PartialView(model as UserGroupVm);
        }

        public ActionResult test()
        {
            return View();
        }
    }
}