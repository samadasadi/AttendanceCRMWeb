using Repository.Infrastructure;
using Repository.Model;
using Repository.Model.Common;
using Service.Common;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Service.TaskService
{
    public partial class TaskThread : IDisposable
    {
        #region Fields

        protected readonly string _scheduleTaskUrl;
        protected readonly ScheduleTask _scheduleTask;
        protected readonly int? _timeout;

        //private readonly Dictionary<string, string> _tasks;
        private Timer _timer;
        private bool _disposed = false;

        //private int _index = 0;
        #endregion

        #region Ctor

        //static TaskThread()
        //{
        //    _scheduleTaskUrl = $"https://localhost:15536/scheduletask/runtask";
        //    _timeout = 300;
        //}

        //internal TaskThread()
        //{
        //    _tasks = new Dictionary<string, string>();
        //    Seconds = 10 * 60;
        //}

        public TaskThread(ScheduleTask task, string scheduleTaskUrl, int? timeout)
        {
            _scheduleTaskUrl = scheduleTaskUrl;
            _scheduleTask = task;
            _timeout = timeout;

            Seconds = 10 * 60;
        }
        #endregion

        #region Utilities

        internal static IHttpClientFactory HttpClientFactory { get; set; }
        private async System.Threading.Tasks.Task Run()
        {
            if (Seconds <= 0)
                return;

            StartedUtc = DateTime.UtcNow;
            IsRunning = true;
            //HttpClient client = null;

            //foreach (var taskName in _tasks.Keys)
            //{
            //    var taskType = _tasks[taskName];
            try
            {

                //create and configure client
                //client = HttpClientFactory.CreateClient("default");
                //client = HttpClientFactory.CreateClient(String.Empty);
                //if (_timeout.HasValue)
                //    client.Timeout = TimeSpan.FromMilliseconds(_timeout.Value);

                ////send post data
                //var data = new FormUrlEncodedContent(new[] { new KeyValuePair<string, string>("taskType", _scheduleTask.Type) });
                //await client.PostAsync(_scheduleTaskUrl, data);



                var taskService = EngineContext.Resolve<IGenericAttributeService>();
                var _hostUrl = taskService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.HostURL).Result;
                //_hostUrl = _hostUrl ?? "http://127.0.0.1/";
                //var scheduleTaskUrl = $"{_hostUrl.TrimEnd('/')}/{ScheduleTaskDefaults.ScheduleTaskPath}";
                _hostUrl = _hostUrl ?? "127.0.0.1:80";
                var scheduleTaskUrl = $"http://{_hostUrl}/{ScheduleTaskDefaults.ScheduleTaskPath}";

                string apiResponse = "";
                using (var httpClient = new HttpClient())
                {
                    if (_timeout.HasValue)
                        httpClient.Timeout = TimeSpan.FromMilliseconds(_timeout.Value);
                    var data = new FormUrlEncodedContent(new[] { new KeyValuePair<string, string>("taskType", _scheduleTask.Type) });

                    //await httpClient.PostAsync("http://localhost:8098" + _scheduleTaskUrl, data);
                    //await httpClient.PostAsync(_hostUrl + _scheduleTaskUrl, data);
                    await httpClient.PostAsync(scheduleTaskUrl, data);
                }





                //var _taskRunner = EngineContext.Resolve<IScheduleTaskRunner>();
                //await _taskRunner.ExecuteAsync(_scheduleTask);



                // For Test
                //var _query = string.Format(@"INSERT INTO [dbo].[Log]([ShortMessage],[IpAddress],[CustomerId],[LogLevelId],[FullMessage],[PageUrl],[ReferrerUrl],[CreatedOnUtc])
                //                        VALUES('{0}','{1}','{2}','{2}','{0}','{0}','{0}',GETDATE())",
                //                        taskName, _index.ToString(), _index.ToString());
                //InsertLog(_query);
            }
            catch (Exception ex)
            {
                //var serviceScopeFactory = EngineContext.Current.Resolve<IServiceScopeFactory>();
                //using var scope = serviceScopeFactory.CreateScope();
                //// Resolve
                //var logger = scope.ServiceProvider.GetRequiredService<ILogger>();
                //var localizationService = scope.ServiceProvider.GetRequiredService<ILocalizationService>();
                //var storeContext = scope.ServiceProvider.GetRequiredService<IStoreContext>();

                //var message = ex.InnerException?.GetType() == typeof(TaskCanceledException) ? localizationService.GetResource("ScheduleTasks.TimeoutError") : ex.Message;

                //message = string.Format(localizationService.GetResource("ScheduleTasks.Error"), taskName,
                //    message, taskType, storeContext.CurrentStore.Name, _scheduleTaskUrl);

                //logger.Error(message, ex);
            }
            finally
            {
                //if (client != null)
                //{
                //    client.Dispose();
                //    client = null;
                //}
            }
            //}

            IsRunning = false;
        }


        public void InsertLog(string query)
        {
            try
            {
                var connectionString = string.Format("Data Source={0};initial catalog={1};user id={2};password={3};MultipleActiveResultSets=True;",
                    @".\SQL_2014", "MinaDB", "sa", "7176");

                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand(query, connection);
                    command.Connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private void TimerHandler(object state)
        {
            try
            {
                _timer.Change(-1, -1);

                Run().Wait();

                if (RunOnlyOnce)
                    Dispose();
                else
                    _timer.Change(Interval, Interval);
            }
            catch
            {
                // ignore
            }
        }

        #endregion

        #region Methods

        /// <summary>
        /// Disposes the instance
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                lock (this)
                {
                    _timer?.Dispose();
                }
            }

            _disposed = true;
        }
        /// <summary>
        /// Inits a timer
        /// </summary>
        public void InitTimer()
        {
            if (_timer == null)
                _timer = new Timer(TimerHandler, null, InitInterval, Interval);
        }

        /// <summary>
        /// Adds a task to the thread
        /// </summary>
        /// <param name="task">The task to be added</param>
        //public void AddTask(ScheduleTask task)
        //{
        //    if (!_tasks.ContainsKey(task.Name))
        //        _tasks.Add(task.Name, task.Type);
        //}

        #endregion

        #region Properties

        /// <summary>
        /// Gets or sets the interval in seconds at which to run the tasks
        /// </summary>
        public int Seconds { get; set; }

        /// <summary>
        /// Get or set the interval before timer first start 
        /// </summary>
        public int InitSeconds { get; set; }

        /// <summary>
        /// Get or sets a datetime when thread has been started
        /// </summary>
        public DateTime StartedUtc { get; private set; }

        /// <summary>
        /// Get or sets a value indicating whether thread is running
        /// </summary>
        public bool IsRunning { get; private set; }

        /// <summary>
        /// Gets the interval (in milliseconds) at which to run the task
        /// </summary>
        public int Interval
        {
            get
            {
                //if somebody entered more than "2147483" seconds, then an exception could be thrown (exceeds int.MaxValue)
                var interval = Seconds * 1000;
                if (interval <= 0)
                    interval = int.MaxValue;
                return interval;
            }
        }

        /// <summary>
        /// Gets the due time interval (in milliseconds) at which to begin start the task
        /// </summary>
        public int InitInterval
        {
            get
            {
                //if somebody entered less than "0" seconds, then an exception could be thrown
                var interval = InitSeconds * 1000;
                if (interval <= 0)
                    interval = 0;
                return interval;
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the thread would be run only once (on application start)
        /// </summary>
        public bool RunOnlyOnce { get; set; }

        #endregion
    }
}
