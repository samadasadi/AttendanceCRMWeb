using System;
using System.Globalization;
using System.Web;
using System.Web.Mvc;
using Service.Consts;
using Utility;
using System.IO;
using ViewModel.Basic;
using Service.BasicInfo;
using System.Threading;
using Utility.EXT;
using Repository;
using Repository.iContext;
using Repository.Model;
using Service.Security;
using System.Threading.Tasks;
using System.Diagnostics;
using Ninject;
using Repository.Infrastructure;
using AttendanceCRMWeb.Filters;
using static System.Net.Mime.MediaTypeNames;

namespace AttendanceCRMWeb.Controllers
{
    // [NoCache]
    [CustomAutorizeFilter]
    [FrameworkHandleError]
    public class BaseController : Controller
    {
        public IFileService FileService { get; set; }

        public IUserService usersService { get; set; }

        protected int _selectCount = 10;

        public BaseController()
        {
            //serviceLocator = NinjectWebCommon.kernel;
            usersService = EngineContext.Resolve<IUserService>();
            FileService = EngineContext.Resolve<IFileService>();
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (AppSettings.ISVPS == "0")
            {
                //--------------------Start Publish FOR Local
                OnActionExecutedForLocal(filterContext);
                //------------------END Publish  FOR Local
            }
            else
            {
                //--------------------Start Publish FOR VPS Server 
                OnActionExecutedForVPSServer(filterContext);
                //------------------END Publish  FOR VPS Server 
            }
        }

        private void getCurrentMenuId(string action, string control)
        {
            try
            {
                var _url = "/" + control + "/" + action;
                switch (_url)
                {
                    case "/Home/IndexR": GlobalApp.CurrentMenuItem = "F1EBEDBE-5EAD-E511-8267-8086F270B3A3"; break;
                    case "/CustomerInfo/index": GlobalApp.CurrentMenuItem = "A90E7793-F0B9-E511-80BD-382C3AB1072F"; break;
                    case "/Holiday/Visit": GlobalApp.CurrentMenuItem = "331413DB-5EAD-E511-8263-8533F270B3A3"; break;
                    case "/Avanak/Index": GlobalApp.CurrentMenuItem = "F1EBEDBE-5EAD-E511-8267-8085F270B3A3"; break;
                    case "/SMS/Index": GlobalApp.CurrentMenuItem = "931413DB-5EAD-E511-8267-8096F290B3A3"; break;

                    case "/Prescription/ExportInsuranceReport": GlobalApp.CurrentMenuItem = "A90E7793-F0B9-E511-80BD-382C3AB1073F"; GlobalApp.CurrentChildMenuItem = "A90E7793-F0B9-E511-81BD-382C3AB1073F"; break;
                    case "/Prescription/Prescription_Backup":
                    case "/Prescription/IndexPrescriptionServiceList":
                    case "/Prescription/PrescriptionSetting": GlobalApp.CurrentMenuItem = "A90E7793-F0B9-E511-80BD-382C3AB1073F"; GlobalApp.CurrentChildMenuItem = "A90E7793-F0B9-E511-82BD-382C3AB1073F"; break;

                    case "/TNPrescription/Index": GlobalApp.CurrentMenuItem = "A71E8754-F2B9-E511-80BD-382C3BA1373F"; GlobalApp.CurrentChildMenuItem = "A90E7624-F0B9-E511-76BD-382C3AB1273F"; break;
                    case "/TNPrescription/TN_ServiceList":
                    case "/TNPrescription/TN_Setting": GlobalApp.CurrentMenuItem = "A71E8754-F2B9-E511-80BD-382C3BA1373F"; GlobalApp.CurrentChildMenuItem = "A90E7624-F0B9-E511-76BD-382C3AB1274F"; break;

                    case "/CompanyAccount/GetListCompanyAccount":
                    case "/CompanyAccount/index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC4F-CCD0-E611-80CE-982C4AB1072F"; break;
                    case "/Cost/GridList":
                    case "/Cost/index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC4F-CCD0-E611-80CE-382C4AB1072F"; break;
                    case "/Check/index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC4F-CCD0-E611-80CE-387C4AB1072F"; break;
                    case "/InsuranceCash/index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC7F-CCD0-E611-80CE-387C4AB1072F"; break;

                    case "/SindhWarehouse/IndexInput": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEF4F-CCD0-E611-80CE-38244AB1072F"; break;
                    case "/SindhWarehouse/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEF4F-CCD5-E611-80CE-38244AB1072F"; break;
                    case "/SindhWarehouse/StockWarehouse": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEF4F-CCD5-E611-80CE-38544AB1072F"; break;
                    case "/WarehousesCoding/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC4F-CCD0-E611-80CE-38244AB1072F"; break;

                    case "/WorkFlow/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-388C4AB1072F"; GlobalApp.CurrentChildMenuItem = "6707F599-DF62-E611-80CA-584C8AB1072F"; break;
                    case "/Communication/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-388C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEF7F-CCD0-E611-80CE-989C4AB1072F"; break;
                    case "/Phonebooks/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-388C4AB1072F"; GlobalApp.CurrentChildMenuItem = "F7FCEC4F-CCD0-E611-80CE-989C4AC1072F"; break;
                    case "/Caller/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-388C4AB1072F"; GlobalApp.CurrentChildMenuItem = "6707F599-DF62-E611-80CA-544C4AB1444F"; break;

                    case "/Register/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "4DC9A3BF-3A4E-E611-80C9-382C4AB1072F"; break;
                    case "/UserGroup/Index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "8E09C1E0-A8B6-E511-80BD-382C4AB1072F"; break;
                    case "/Holiday/FilterModelDoctorTime":
                    case "/Holiday/index": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "331413DB-5EAD-E511-8267-8286F270B3A3"; break;
                    case "/Holiday/OfficialHoliday": GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "331413DB-5EAD-E511-8267-8586F270B3A3"; break;

                    case "/Attendance/Index": GlobalApp.CurrentMenuItem = "F1AC3ACA-B785-23EB-9A89-0EFA126E3C7E"; break;

                    //case "/StaticReport/Index": GlobalApp.CurrentMenuItem = "46404D17-DBAB-E521-8368-8289F27083A4"; break;

                    case "/Setting/UserAuthorize": GlobalApp.CurrentMenuItem = "8654F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "FACA4CDE-91B9-E811-8A87-BCAEC52EF25B"; break;
                    case "/Announcements/Index": GlobalApp.CurrentMenuItem = "8654F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "FACA4CDE-91B9-E811-8A87-BCAEF32EF25B"; break;
                    case "/Award/GetList":
                    case "/Scoring/Index":
                    case "/Scoring/GetList":
                    case "/Award/GetScoring":
                    case "/Award/Index": GlobalApp.CurrentMenuItem = "8654F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "1354F599-DF62-E611-80CA-386C4AB1072F"; break;
                    case "/UserRateHistory/Index": GlobalApp.CurrentMenuItem = "8654F599-DF62-E611-80CA-382C4AB1072F"; GlobalApp.CurrentChildMenuItem = "8654F599-DF62-E611-80CA-389C4AB1072F"; break;

                    case "/DescriptionTooth/getlist_lightpentemplate":
                    case "/DescriptionTooth/Index":
                    case "/GeneralSettings/Index": GlobalApp.CurrentMenuItem = "331413DB-5EAD-E511-8267-8086F270B3A3"; GlobalApp.CurrentChildMenuItem = "331413DB-5EAD-E511-8267-8096F270B3A3"; break;
                    case "/MedicalCenter/Index": GlobalApp.CurrentMenuItem = "331413DB-5EAD-E511-8267-8086F270B3A3"; GlobalApp.CurrentChildMenuItem = "331413DB-5EAD-E511-8267-8086F250B6A3"; break;
                    case "/Coding/index": GlobalApp.CurrentMenuItem = "331413DB-5EAD-E511-8267-8086F270B3A3"; GlobalApp.CurrentChildMenuItem = "331413DB-5EAD-E511-8267-8186F270B3A3"; break;
                    default: GlobalApp.CurrentMenuItem = "F1EBEDBE-5EAD-E511-8267-8086F270B3A3"; break;
                }
                if (control == "Home")
                {
                    GlobalApp.CurrentMenuItem = "F1EBEDBE-5EAD-E511-8267-8086F270B3A3";
                }
                else if (control == "CustomerInfo")
                {
                    GlobalApp.CurrentMenuItem = "A90E7793-F0B9-E511-80BD-382C3AB1072F";
                }
                else if (control == "Avanak")
                {
                    GlobalApp.CurrentMenuItem = "F1EBEDBE-5EAD-E511-8267-8085F270B3A3";
                }
                else if (control == "SMS")
                {
                    GlobalApp.CurrentMenuItem = "931413DB-5EAD-E511-8267-8096F290B3A3";
                }
                else if (control == "SindhWarehouse")
                {
                    GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F";
                }
                else if (control == "WarehousesCoding")
                {
                    GlobalApp.CurrentMenuItem = "6107F599-DF62-E611-80CA-387C8AB1072F";
                }
                else if (control == "Attendance")
                {
                    GlobalApp.CurrentMenuItem = "F1AC3ACA-B785-23EB-9A89-0EFA126E3C7E";
                }
                //else if (control == "StaticReport")
                //{
                //    GlobalApp.CurrentMenuItem = "46404D17-DBAB-E521-8368-8289F27083A4";
                //}
                else if (control == "Setting")
                {
                    GlobalApp.CurrentMenuItem = "8654F599-DF62-E611-80CA-382C4AB1072F";
                }
                else if (control == "Coding")
                {
                    GlobalApp.CurrentMenuItem = "331413DB-5EAD-E511-8267-8086F270B3A3";
                }
            }
            catch { }
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //
            //Thread.CurrentThread.CurrentCulture = CultureInfo.InvariantCulture;
            getCurrentMenuId(filterContext.ActionDescriptor.ActionName, filterContext.ActionDescriptor.ControllerDescriptor.ControllerName);
            base.OnActionExecuting(filterContext);
        }

        private void OnActionExecutedForVPSServer(ActionExecutedContext filterContext)
        {
            if (Sessions.ResultMessage != null)
            {
                ViewBag.ResultMessage = Sessions.ResultMessage;
            }
            base.OnActionExecuted(filterContext);
        }

        private void OnActionExecutedForLocal(ActionExecutedContext filterContext)
        {
            if (Session["sessionid"] == null)
                Session["sessionid"] = "empty";

            //var currentUser = (ViewModel.Security.UserLogin)filterContext.HttpContext.Session["CurrentUser"];
            if (usersService.IsUserLogginedYet(System.Web.HttpContext.Current.User.Identity.Name, Session["sessionid"].ToString()).Result)
            {
                if (usersService.IsUserLoggedOnElsewhere(System.Web.HttpContext.Current.User.Identity.Name, Session["sessionid"].ToString()).Result)
                {
                    if (AppSettings.ISVPS == "0") // فقط در حالت لوکال یوزر های دیگر را بیرون میکند
                    {
                        usersService.LogoutEveryoneElsewhere(System.Web.HttpContext.Current.User.Identity.Name, Session["sessionid"].ToString());
                    }
                }
                if (Sessions.ResultMessage != null)
                {
                    ViewBag.ResultMessage = Sessions.ResultMessage;
                }
                base.OnActionExecuted(filterContext);
            }
            else
            {
                Public.CurrentUser = null;
                Sessions.LogoutUrlReferrer = filterContext.HttpContext.Request.Url.LocalPath;
                filterContext.Result = new RedirectResult("~/Account/Login");
            }
        }

        //TODo:User File service insted of this function
        /// <summary>
        /// Global Save HttpPostedFile2ase /Create directory » year/filename.
        /// create a  file directory every year and stores file in there.
        /// and create a FileVm obj model and insert it to db and return it to controller.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public FileVm GlobalSaveFile(HttpPostedFileBase file, string routFolder)
        {
            try
            {
                var jc = new PersianCalendar();
                var year = jc.GetYear(DateTime.Now);
                var yearPath = Server.MapPath(routFolder + year + "/");
                var localPath = routFolder + year + "/";

                #region DirectoryBuilder
                if (!Directory.Exists(yearPath))
                    Directory.CreateDirectory(yearPath);
                #endregion

                #region SaveWithNewGuid
                var guid = Guid.NewGuid();
                var fileEXtention = Path.GetExtension(file.FileName);
                localPath = localPath + guid + fileEXtention;
                var path = Server.MapPath("~" + localPath);
                file.SaveAs(path);
                #endregion

                var fileVm = new FileVm()
                {
                    FileName = file.FileName,
                    Extention = fileEXtention,
                    Path = localPath
                };
                var id = System.Threading.Tasks.Task.Run(async () => await FileService.Save(fileVm)).Result;
                fileVm.Id = id;
                return fileVm;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected virtual string FormName
        {
            get { return "edit"; }
        }

        ///// <summary>
        ///// Show File with primary Key
        ///// </summary>
        ///// <param name="id">File Id</param>
        ///// <returns></returns>
        //public FileResult ShowFile(int id)
        //{
        //    var file = FileUploadBusiness.FindById(id);
        //    if (file != null)
        //    {
        //        var extention = Path.GetExtension(Server.MapPath(file.FilePath));
        //        var contentType = "";
        //        switch (extention)
        //        {
        //            case ".png":
        //                contentType = "image/png";
        //                break;
        //            case ".jpg":
        //                contentType = "image/jpeg";
        //                break;
        //            case ".gif":
        //                contentType = "image/gif";
        //                break;
        //        }

        //        return File(Server.MapPath(file.FilePath), contentType);
        //    }
        //    return null;
        //}

        public JsonResult S2M(string date)
        {
            if (!date.IsNotNullOrEmpty())
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }
            //
            var res = DateTimeOperation.S2M(date).ToString();
            //
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public static string ResolveServerUrl(string serverUrl, bool forceHttps)
        {
            if (serverUrl.IndexOf("://") > -1)
                return serverUrl;
            string newUrl = serverUrl;
            Uri originalUri = System.Web.HttpContext.Current.Request.Url;
            newUrl = (forceHttps ? "https" : originalUri.Scheme) +
                "://" + originalUri.Authority + newUrl;
            return newUrl;
        }

        public JsonResult M2S(string date)
        {
            var rDate = DateTime.Parse(date);
            return Json(DateTimeOperation.M2S(rDate));
        }

        public FileResult Download(string path)
        {
            var p = "/";
            string contentType = "application/pdf";
            var str = String.Concat(Globals.LocalFilePath + p, path);
            var fileName = str.Split('/')[2];
            var extention = fileName.Split('.')[1];
            if (extention.Contains("jpg") || extention.Contains("png") || extention.Contains("gif"))
            {
                contentType = "image/jpeg";
            }
            return File(str, contentType, fileName);
        }

        protected JsonResult ErrorJson(object errors)
        {
            return Json(new
            {
                error = errors
            });
        }

    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class NoCacheAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            filterContext.HttpContext.Response.Cache.SetExpires(DateTime.UtcNow.AddDays(-1));
            filterContext.HttpContext.Response.Cache.SetValidUntilExpires(false);
            filterContext.HttpContext.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            filterContext.HttpContext.Response.Cache.SetNoStore();
            base.OnResultExecuting(filterContext);
        }
    }
}