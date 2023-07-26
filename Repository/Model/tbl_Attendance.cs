using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    public class tbl_Attendance
    {
        public Guid ID { get; set; }
        public Guid? PersonID { get; set; }
        public string PersonCode { get; set; }
        public DateTime? EntranceTime { get; set; }
        public DateTime? LeavingTime { get; set; }
        public string EnterYear { get; set; }
        public string EnterMonth { get; set; }
        public string EnterDay { get; set; }
        public string EnterHour { get; set; }
        public string EnterMinute { get; set; }
        public string EnterSecond { get; set; }
        public string LeaveYear { get; set; }
        public string LeaveMonth { get; set; }
        public string LeaveDay { get; set; }
        public string LeaveHour { get; set; }
        public string LeaveMinute { get; set; }
        public string LeaveSecond { get; set; }
        public string Status { get; set; }
        public bool AutoRegLeave { get; set; }

    }
}
