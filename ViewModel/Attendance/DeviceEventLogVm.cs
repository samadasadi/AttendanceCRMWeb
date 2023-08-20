using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;

namespace ViewModel.Attendance
{
    public class DeviceEventLogVm : DataModelResult
    {
        public int Id { get; set; }

        public int DeviceId { get; set; }
        public int DeviceGroupId { get; set; }

        public string LogData { get; set; }

        public DateTime ModifiedDate { get; set; }
        public string ModifiedDateStr { get { return DateTimeOperation.M2S(ModifiedDate); } }
        public string TimeStr { get { return ModifiedDate.ToString("HH:mm"); } }

        public bool IsDelete { get; set; }

        public Guid PubUserId { get; set; }

        public bool SaveInDB { get; set; }

        public string DeviceName { get; set; }
    }
}
