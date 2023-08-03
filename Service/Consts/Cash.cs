using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModel.Basic;

namespace Service.Consts
{
    public class TemplateSetting
    {
        public string TitleLink { get; set; }
    }
    public class Cach
    {
        public static TemplateSetting TemplateSetting
        {
            get
            {
                return (System.Web.HttpContext.Current.Cache["TemplateSetting"] != null)
                    ? ((TemplateSetting)System.Web.HttpContext.Current.Cache["TemplateSetting"])
                    : null;
            }
        }

    }
}
