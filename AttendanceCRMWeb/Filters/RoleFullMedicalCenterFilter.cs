//using EyeSoft.ServiceLocator.Windsor;

using Service.Consts;
using Service.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Utility.PublicEnum;
using Utility.Utitlies;
using ViewModel.Security;

namespace AttendanceCRMWeb.Filters
{
    public class RoleFullMedicalCenterFilter : ActionFilterAttribute
    {
        public MedicalCenterRole Role { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //var serviceLocator = new WindsorDependencyContainer(IoC.Container, true);
            //var service = serviceLocator.GetInstance<IUserService>();

            //var medical = service.checkMedicalCenterIdForAutentication(Public.CurrentUser.MedicalCenterId);

            if(Public.CurrentUser == null)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //throw new Exception("شما مجاز به انجام این عملیات نیستید.");
                    filterContext.Result = new JsonResult()
                    {
                        Data = new { statusCode = "301" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                    return;
                }
                Sessions.LogoutUrlReferrer = filterContext.HttpContext.Request.Url.LocalPath;
                filterContext.Result = new RedirectResult("~/Account/Login");
                return;
            }


            bool operation = false;

            if (Public.CurrentUser != null)
                switch (Role)
            {
                case MedicalCenterRole.Attendance:
                    operation = Public.CurrentUser.IsAttendance;
                    break;
                case MedicalCenterRole.CustomerClub:
                    operation = Public.CurrentUser.IsCustomerClub;
                    break;
                case MedicalCenterRole.Wallet:
                    operation = Public.CurrentUser.IsMoneyBag;
                    break;
                case MedicalCenterRole.Supervisor:
                    operation = Public.CurrentUser.IsInatallments;
                    break;
                case MedicalCenterRole.Credits:
                    operation = Public.CurrentUser.IsCredits;
                    break;
                case MedicalCenterRole.Anbar:
                    operation = Public.CurrentUser.IsAnbar;
                    break;
                case MedicalCenterRole.Sms:
                    operation = Public.CurrentUser.IsSms;
                    break;
                case MedicalCenterRole.Avanak:
                    operation = Public.CurrentUser.IsAvanak;
                    break;
                case MedicalCenterRole.ThermalPrintPlug:
                    operation = Public.CurrentUser.IsPrinter;
                    break;
                case MedicalCenterRole.Prescription:
                    operation = Public.CurrentUser.IsPrescription;
                    break;
                case MedicalCenterRole.CallerID:
                    operation = Public.CurrentUser.IsCallerID;
                    break;
                default:
                    break;
            }

            if (operation)
                base.OnActionExecuting(filterContext);
            else
                filterContext.Result = new RedirectResult("/Home/AccessDeniedForMedicalCenter");
        }
    }
}
