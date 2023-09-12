using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace AttendanceCRMWeb
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            //Not every request is called
            //All unhandled errors lead to the execution of this method


            Exception exception = Server.GetLastError();
            Response.Clear();

            HttpException httpException = exception as HttpException;
            if (httpException != null)
            {
                string action;

                switch (httpException.GetHttpCode())
                {
                    case 404:
                        // page not found
                        action = "Error404";
                        break;
                    case 500:
                        // server error
                        action = "Error500";
                        break;
                    case 403:
                        action = "Error403";
                        break;
                    default:
                        action = "ErrorGeneral";
                        break;
                }

                // clear error on server
                Server.ClearError();

                if (Service.Consts.Public.CurrentUser != null)
                {
                    //Response.Redirect(String.Format("~/Error/{0}/?message={1}", action, exception.Message));
                    Response.Redirect(String.Format("/Error/{0}", action));
                }
                else
                {
                    Response.Redirect(String.Format("/Home/IndexR", action));
                }
            }
            else
            {
                //Response.Redirect(String.Format("/Error/ErrorGeneral?exceptionerror={0}", exception.Message));
                Response.Redirect(String.Format("/Error/{0}", "ErrorGeneral"));
            }
            //if (exception != null) Response.Redirect(String.Format("/Admin/Error/{0}", "Error404"));
        }
    }
}
