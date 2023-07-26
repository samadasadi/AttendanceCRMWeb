using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ViewModel.Security;

namespace AttendanceCRMWeb.Filters
{
    public class CustomerAutorizeFilter : ActionFilterAttribute, IActionFilter
    {
        
        void IActionFilter.OnActionExecuting(ActionExecutingContext filterContext)
        {
            var currentUser = (CustomerLogin)filterContext.HttpContext.Session["CustomerLogin"];
            if (currentUser != null)
            {
                filterContext.HttpContext.Session["CustomerLogin"] = currentUser;

            }
            else
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    filterContext.Result = new JsonResult()
                    {
                        Data = new { statusCode = "301" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                    return;
                }
                filterContext.Result = new RedirectResult("~/Club/LoginClub/Login");
            }
        }
    }
    public class AuthenticationCustomerClubFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //if (filterContext.HttpContext.Session[VaribleForName.SessionCustomerClub] != null)
            //    base.OnActionExecuting(filterContext);
            //else
            //    filterContext.Result = new RedirectResult("/Account/LoginCustomerClub");



            if (Public.CustomerLogin != null)
            {
                base.OnActionExecuting(filterContext);
            }
            else
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
                filterContext.Result = new RedirectResult("~/Account/LoginCustomerClub");
            }


        }
    }
}