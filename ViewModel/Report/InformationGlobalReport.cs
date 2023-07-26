using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.Report
{
    public class InformationGlobalReport
    {
        public InformationGlobalReport()
        {
            this.ReportTime = DateTime.Now.ToString("HH:mm");
            this.ReportDate = DateTimeOperation.M2S(DateTime.Now);
        }
        public string Name { get; set; }
        public string NameEn { get; set; }
        public string Address { get; set; }
        public string Tell { get; set; }
        public string Fax { get; set; }

        //Create By Mobin
        public string PriceTafrigh { get; set; }
        public string ReportDate { get; set; }
        public string ReportTime { get; set; }

        public string Appmoneyunit { get; set; }

        public string NationalID { get; set; }
        public string EconomicCode { get; set; }
        public string RegistrationNumber { get; set; }
        public string PostalCode { get; set; }

    }
}
