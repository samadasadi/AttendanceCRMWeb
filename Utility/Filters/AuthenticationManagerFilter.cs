using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Utility.Utitlies;

namespace Utility.Filters
{
    //Create Class By Mobin
    public class AuthenticationManagerFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session[VaribleForName.SessionManager] != null)
                base.OnActionExecuting(filterContext);
            else
                filterContext.Result = new RedirectResult("/Account/LoginManager");
        }
    }
}