using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    //public class PagingViewModel
    //{
    //    public int PageNumber { get; set; }
    //    public int PageSize { get; set; }
    //    public string Search { get; set; }
    //    public int DeviceId { get; set; }
    //    public int GroupId { get; set; }
    //}
    public class DataModelResult
    {
        public string Message { get; set; }
        public bool Error { get; set; }
    }
    public class SerialNumbers
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; }
    }
    public class ApplicationConfiguration
    {
        public bool HasConnection { get; set; }
        public string Server { get; set; }
        public string Database { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Exhibition { get; set; }
        public string Economy { get; set; }
        public string Connection_String { get; set; }
        public string CheckSNeumber { get; set; }
        public string SerialNumberCheckType { get; set; }
        public string ShowLicence { get; set; }
        public string AutoRunAttTask { get; set; }
    }

    public class EventLog_Report
    {

        public string EmployeeName { get; set; }
        public DateTime? EditTime { get; set; }
        public string EditTimeStr { get { return EditTime != null ? DateTimeOperation.M2S(EditTime.Value) : ""; } }
        public string Coment { get; set; }
        public string CommentText
        {
            get
            {
                if (this.Coment == "BU")
                {
                    return "قبل از تغییر";
                }
                else if (this.Coment == "AU")
                {
                    return "بعد از تغییر";
                }
                else if (this.Coment == "I")
                {
                    return "افزودن";
                }
                else
                {
                    return "حذف";
                }
            }
        }
    }
}
