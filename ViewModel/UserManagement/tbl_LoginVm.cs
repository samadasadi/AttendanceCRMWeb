using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement
{
    public class tbl_LoginVm
    {
        public int ID { get; set; }
        public Guid EmployeeId { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FilePath { get; set; }
        public string SessionId { get; set; }
        public string IpAddress { get; set; }
        public string OperatingSystem { get; set; }
        public string Browser { get; set; }
        public bool? LoggedIn { get; set; }
        public string LoggedInStr { get { return (this.LoggedIn ?? false) ? "لاگین" : "خروج"; } }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedDate_DateStr { get { return DateTimeOperation.M2S(this.ModifiedDate ?? DateTime.Now); } }
        public string ModifiedDate_TimeStr { get { return (this.ModifiedDate ?? DateTime.Now).ToShortTimeString(); } }
    }
}
