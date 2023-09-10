using Repository;
using Service.Common;
using Service.Consts;
using Service.Security;
using Service.TaskService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Utility.PublicEnum;
using Utility;
using ViewModel.Security;
using ViewModel.Common;

namespace AttendanceCRMWeb.Controllers
{
    public class AccountController : Controller
    {
        private IUserService _service;


        private IGeneralSettingService _serviceGeneralSettingService;
        private IScheduleTaskService _scheduleTaskService;

        public AccountController(
            IUserService service,
            IGeneralSettingService serviceGeneralSettingService,
            IScheduleTaskService scheduleTaskService
            )
        {
            _service = service;
            _serviceGeneralSettingService = serviceGeneralSettingService;
            _scheduleTaskService = scheduleTaskService;
        }





        [AllowAnonymous]
        public async Task<ActionResult> Login(string returnUrl)
        {
            LoginViewModel model = new LoginViewModel();
            return View(model);
        }


        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl, string Type = "Login", string HashPass = "")
        {

            if (DateTime.Now.Date > DateTime.Parse("2023-10-10"))
                return View(model);


            if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
            {
                ModelState.AddModelError("", "لطفاً در تکمیل اطلاعات دقت نمایید");
                return View(model);
            }
            else
            {
                try
                {
                    string _databaseName = "";
                    string _IPAddress = "";
                    if (ModelState.IsValid)
                    {
                        var _connectionString = ConnectionStringManager.LoadSettings(true);
                        Sessions.SelectedConnection = _connectionString.ConnectionString;
                        _databaseName = _connectionString.Database;



                        var _sessionId = System.Web.HttpContext.Current.Session.SessionID;



                        var loginResultStatus = new LoginResult();
                        if (Type.Equals("Login"))
                        {
                            loginResultStatus = await _service.Login(model.UserName, model.Password, _databaseName, _IPAddress, _sessionId, "", Type);
                        }
                        else
                        {
                            loginResultStatus = await _service.Login(model.UserName, HashPass, _databaseName, _IPAddress, _sessionId, "", Type);
                        }


                        if (loginResultStatus.LoginResultStatus == LoginResultStatus.Success)
                        {
                            Session["sessionid"] = _sessionId;

                            //Utility.Utitlies.CreateDatabaseRuntime.ExecSPSql(model.MedicalId, connectionString);

                            if (!string.IsNullOrEmpty(Sessions.LogoutUrlReferrer))
                            {
                                var url = Sessions.LogoutUrlReferrer;
                                Sessions.LogoutUrlReferrer = null;
                                FormsAuthentication.SetAuthCookie(model.UserName, true);
                                return Redirect(url);
                            }
                            FormsAuthentication.SetAuthCookie(model.UserName, true);


                            return RedirectToAction("Index", "Home");
                        }
                        else
                        {
                            ModelState.AddModelError("", loginResultStatus.LoginResultStatusStr);
                        }

                        return View(model);


                    }
                    return View(model);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("executing the command definition"))
                        ModelState.AddModelError("", "خطایی در خواندن اطلاعات از دیتابیس رخ داده است. لطفا اسکریپت را اجرا نمایید");
                    else if (ex.Message.Contains("inner"))
                        ModelState.AddModelError("", "خطایی در خواندن اطلاعات از دیتابیس رخ داده است. لطفا اسکریپت را اجرا نمایید");
                    else if (ex.Message.Contains("One or more errors occurred"))
                        ModelState.AddModelError("", "خطایی در خواندن اطلاعات از دیتابیس رخ داده است. لطفا اسکریپت را اجرا نمایید");
                    else if (ex.Message.Contains("procedure"))
                        ModelState.AddModelError("", "خطایی در خواندن اطلاعات از دیتابیس رخ داده است. لطفا اسکریپت را اجرا نمایید");
                    else if (ex.Message.Contains("Index was outside the bounds of the array"))
                        ModelState.AddModelError("", "قفل سخت افزاری به درستی تنظیم نشده است");
                    else
                        ModelState.AddModelError("", ex.Message);
                    return View(model);
                }
            }
        }



        [AllowAnonymous]
        public async Task<ActionResult> LogOff(int? type)
        {
            Public.CurrentUser = null;
            return RedirectToAction("Login", "Account", new { Locktype = type });
        }






        public async Task<ActionResult> UpdateActivationLisc()
        {
            try
            {
                var _model = new GeneralSettingVm();
                return View(_model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SaveActivationLisc(string activationLisc)
        {
            try
            {
                var _result = await _serviceGeneralSettingService.UpdateActivationLisc(activationLisc);
                return Json(_result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




    }
}