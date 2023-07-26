using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModel.Report;

namespace ViewModel.UserManagement.Attendance
{
    public class ReportVm<T> where T : class
    {
        public T reportModel { get; set; }
        public List<T> reportList { get; set; }
        public InformationGlobalReport informationGlobalReport { get; set; }
    }

    public class AttLogEvent_Report
    {
        public List<TimeRecordVm> timeRecordVms { get; set; }
        public InformationGlobalReport informationGlobalReport { get; set; }
    }

}
