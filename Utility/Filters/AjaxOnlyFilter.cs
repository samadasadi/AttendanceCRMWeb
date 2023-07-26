using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Utility.Filters
{
    //Create Class By Mobin
    public class AjaxOnlyFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAjaxRequest())
                base.OnActionExecuting(filterContext);
            else
                filterContext.Result = new HttpNotFoundResult();
        }

       
    }
}