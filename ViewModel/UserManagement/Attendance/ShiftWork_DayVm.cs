using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.UserManagement.Attendance
{
    public class ShiftWork_DayVm
    {
        public int JobTime_Id { get; set; }
        public DateTime DayValue { get; set; }
        public bool IsVacation { get; set; }
    }
}
