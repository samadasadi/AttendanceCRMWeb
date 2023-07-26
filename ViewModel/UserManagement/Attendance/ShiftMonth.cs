using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class ShiftMonth
    {
        public ShiftMonth()
        {
            shiftMonth_Days = new List<ShiftMonth_Day>();
        }
        public int month { get; set; }
        public string name { get { return DateTimeOperation.GetStringOfMonthPersian(month); } }
        public List<ShiftMonth_Day> shiftMonth_Days { get; set; }
    }
    public class ShiftMonth_Day
    {
        public int JobTime { get; set; }
        public string JobTimeName { get; set; }
        public int month { get; set; }
        public int day { get; set; }
        public string name { get { return DateTimeOperation.GetPersianDayName(DateEn); } }
        public DateTime DateEn { get; set; }
        public string DateFa { get { return DateTimeOperation.M2S(DateEn); } }
        public bool IsVacation { get; set; }
        public bool IsRamazan { get; set; }
    }
}
