using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Error404()
        {
            return View();
        }

        public ActionResult Error500()
        {
            Response.StatusCode = 500;
            return View();
        }

        public ActionResult Error403()
        {
            Response.StatusCode = 403;
            return View();
        }


        public ActionResult ErrorGeneral(string exceptionerror)
        {
            ViewBag.ExceptionError = exceptionerror;
            return View();
        }
    }
}