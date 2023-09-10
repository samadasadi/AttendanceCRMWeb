using Service.UserManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Utility.Utitlies;
using ViewModel.Attendance;

namespace AttendanceCRMWeb.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IRegisterService _registerService;
        public HomeController(IRegisterService registerService)
        {
            _registerService = registerService;
        }

        public async Task<ActionResult> Index()
        {
            var _userlist = (await _registerService.GetAllAsync()).ToList();
            await _registerService.CheckPersonsAttEvent(_userlist);
            Service.Consts.Public.UserVmList = _userlist;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public async Task<JsonResult> DashboardDeviceList()
        {
            return Json(this.RenderPartialToString("DashboardDeviceList"), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}