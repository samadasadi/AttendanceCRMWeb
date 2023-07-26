using System.Web.Mvc;

using Ninject;
using Repository.Infrastructure;
using Service.Security;
using Utility.PublicEnum;
using AttendanceCRMWeb.App_Start;

namespace AttendanceCRMWeb.Filters
{
    public class FillSecurityDepFilter : ActionFilterAttribute
    {
        private EnumRole _RoleType;

        public EnumRole RoleType
        {
            get { return _RoleType; }
            set { _RoleType = value; }
        }

        /* get new instance of UserService and bind user privilages to ViewBag.  */
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //var serviceLocator = new WindsorDependencyContainer(IoC.Container, true);
            //var serviceLocator = NinjectWebCommon.GetKernel();
            var service = EngineContext.Resolve<IUserService>();
            var res = service.GetFormSecurity(_RoleType);
            filterContext.Controller.ViewBag.FormSecurity = res;
        }

        //public override void OnActionExecuted(ActionExecutedContext filterContext)
        //{
        //    filterContext.Controller.ViewBag.CustomActionMessage2 = "Custom Action Filter: Message from OnActionExecuted method.";
        //}

        //public override void OnResultExecuting(ResultExecutingContext filterContext)
        //{
        //    filterContext.Controller.ViewBag.CustomActionMessage3 = "Custom Action Filter: Message from OnResultExecuting method.";
        //}

        //public override void OnResultExecuted(ResultExecutedContext filterContext)
        //{
        //    filterContext.Controller.ViewBag.CustomActionMessage4 = "Custom Action Filter: Message from OnResultExecuted method.";
        //}
    }

}