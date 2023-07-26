using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public partial interface IScheduleTask
    {
        /// <summary>
        /// Executes a task
        /// </summary>
        Task ExecuteAsync();
    }
}
