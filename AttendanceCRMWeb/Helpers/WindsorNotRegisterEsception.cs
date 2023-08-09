using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AttendanceCRMWeb.Helpers
{
    public class WindsorNotRegisterEsception : Exception
    {
        public WindsorNotRegisterEsception(string message) : base(message)
        {

        }
    }
}