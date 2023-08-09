using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.Attendance
{
    public class DeviceGroupVm
    {
        public int Id { get; set; }
        public string GroupTitle { get; set; }
        public string GroupExplain { get; set; }

        public bool IsDelete { get; set; }

        public DateTime ModifiedDate { get; set; }

        public bool Selected { get; set; }
    }
}
