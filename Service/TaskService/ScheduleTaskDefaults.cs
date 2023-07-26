using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public static partial class ScheduleTaskDefaults
    {
        /// <summary>
        /// Gets a running schedule task path
        /// </summary>
        //public static string ScheduleTaskPath => "scheduletask/runtask";
        public static string ScheduleTaskPath => "TaskScheduler/RunTask";
    }
}
