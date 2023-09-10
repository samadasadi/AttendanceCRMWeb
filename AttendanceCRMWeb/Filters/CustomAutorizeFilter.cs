using System;
using System.Linq;
using System.Web.Mvc;

using Service.Consts;
using Service.Security;
//using EyeSoft.ServiceLocator.Windsor;
using Repository.Model;
using Utility.PublicEnum;
using ViewModel.Security;
using Repository;
using Repository.iContext;
using static System.Net.Mime.MediaTypeNames;
using ViewModel.BasicInfo;

namespace AttendanceCRMWeb.Filters
{
    public class CustomAutorizeFilter : ActionFilterAttribute, IActionFilter
    {


        //public IUserService Service { get; set; }

        private EnumRole[] _EnumRole;

        public EnumRole[] Role
        {
            get { return _EnumRole ?? new EnumRole[] { }; }
            set { _EnumRole = value; }
        }

        //private EnumUserType[] _UserType;

        //public EnumUserType[] UserType
        //{
        //    get { return _UserType ?? new EnumUserType[] { }; }
        //    set { _UserType = value; }
        //}

        async void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {

            var currentUser = (UserLogin)filterContext.HttpContext.Session["CurrentUser"];
            if (currentUser != null)
            {
                //var serviceLocator = new WindsorDependencyContainer(IoC.Container);
                //Service = serviceLocator.GetInstance<IUserService>();
                filterContext.HttpContext.Session["CurrentUser"] = currentUser;
                var currentUserEnumRole = currentUser.AvailableRole;
                if (_EnumRole != null)
                {

                    if (DateTime.Now.Date > Public.CurrentUser.ExpierDate)
                    {
                        if (filterContext.HttpContext.Request.IsAjaxRequest())
                            filterContext.Result = new JsonResult() { Data = new { statusCode = "303" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

                        else
                            filterContext.Result = new RedirectResult("~/Account/UpdateActivationLisc");

                    }
                    else
                    {
                        var rolesCheck = _EnumRole.Any(currentUserEnumRole.Contains);
                        if (rolesCheck)
                            base.OnActionExecuting(filterContext);

                        else
                        {
                            if (filterContext.HttpContext.Request.IsAjaxRequest())
                                filterContext.Result = new JsonResult() { Data = new { statusCode = "301" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

                            else
                                filterContext.Result = new RedirectResult("~/Home/AccessDenied");

                        }
                    }
                }
            }
            else
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    //throw new Exception("شما مجاز به انجام این عملیات نیستید.");
                    filterContext.Result = new JsonResult() { Data = new { statusCode = "301" }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                    return;
                }
                Sessions.LogoutUrlReferrer = filterContext.HttpContext.Request.Url.LocalPath;
                filterContext.Result = new RedirectResult("~/Account/Login");
            }
        }




    }
}