using Repository.Infrastructure;
using Repository.Model;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public interface ITaskScheduler
    {
        /// <summary>
        /// Initializes task scheduler
        /// </summary>
        System.Threading.Tasks.Task InitializeAsync();

        /// <summary>
        /// Starts the task scheduler
        /// </summary>
        void StartScheduler();

        /// <summary>
        /// Stops the task scheduler
        /// </summary>
        void StopScheduler();
    }
    public partial class TaskManager : ITaskScheduler
    {
        #region Fields

        private readonly List<TaskThread> _taskThreads = new List<TaskThread>();

        #endregion

        #region Ctor

        //private TaskManager(IHttpClientFactory httpClientFactory)
        private TaskManager()
        {
            //TaskThread.HttpClientFactory = httpClientFactory;
        }

        #endregion

        #region Methods

        public async System.Threading.Tasks.Task InitializeAsync()
        {
            _taskThreads.Clear();

            var taskService = EngineContext.Resolve<IScheduleTaskService>();

            var _tasks =  await taskService.GetAllTasks();

            var scheduleTasks = _tasks.ToList();

            //var scheduleTaskUrl = $"{store.Url.TrimEnd('/')}/{NopTaskDefaults.ScheduleTaskPath}";
            //var scheduleTaskUrl = $"/{"TaskScheduler/RunTask"}";
            var scheduleTaskUrl = $"/{ScheduleTaskDefaults.ScheduleTaskPath}";
            //var timeout = _appSettings.Get<CommonConfig>().ScheduleTaskRunTimeout;
            var timeout = 300;

            if (scheduleTasks == null || scheduleTasks.Count() <= 0) return;

            foreach (var scheduleTask in scheduleTasks)
            {
                var taskThread = new TaskThread(scheduleTask, scheduleTaskUrl, timeout)
                {
                    Seconds = scheduleTask.Seconds
                };

                if (scheduleTask.LastStartUtc.HasValue)
                {
                    var secondsLeft = (DateTime.UtcNow - scheduleTask.LastStartUtc).Value.TotalSeconds;

                    if (secondsLeft >= scheduleTask.Seconds)
                        taskThread.InitSeconds = 0;
                    else
                        taskThread.InitSeconds = (int)(scheduleTask.Seconds - secondsLeft) + 1;
                }
                else
                {
                    taskThread.InitSeconds = scheduleTask.Seconds;
                }

                //taskThread.AddTask(scheduleTask);
                _taskThreads.Add(taskThread);
            }
        }

        public void StartScheduler()
        {
            if (_taskThreads == null || _taskThreads.Count() <= 0) return;
            foreach (var taskThread in _taskThreads)
            {
                taskThread.InitTimer();
            }
        }

        public void StopScheduler()
        {
            if (_taskThreads == null || _taskThreads.Count() <= 0) return;
            foreach (var taskThread in _taskThreads)
            {
                taskThread.Dispose();
            }
        }

        #endregion

        #region Properties

        public static TaskManager Instance { get; } = new TaskManager();

        public IList<TaskThread> TaskThreads => new ReadOnlyCollection<TaskThread>(_taskThreads);

        #endregion
    }
}
