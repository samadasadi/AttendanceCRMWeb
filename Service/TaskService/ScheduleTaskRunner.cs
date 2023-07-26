using Repository.Infrastructure;
using Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public interface IScheduleTaskRunner
    {
        /// <summary>
        /// Executes the task
        /// </summary>
        /// <param name="scheduleTask">Schedule task</param>
        /// <param name="forceRun">Force run</param>
        /// <param name="throwException">A value indicating whether exception should be thrown if some error happens</param>
        /// <param name="ensureRunOncePerPeriod">A value indicating whether we should ensure this task is run once per run period</param>
        System.Threading.Tasks.Task ExecuteAsync(ScheduleTask scheduleTask,
            bool forceRun = false,
            bool throwException = false,
            bool ensureRunOncePerPeriod = true);
    }
    public partial class ScheduleTaskRunner : IScheduleTaskRunner
    {
        #region Fields

        private bool? _enabled;
        //var _scheduleTaskService = EngineContext.Resolve<IScheduleTaskService>();
        private readonly IScheduleTaskService _scheduleTaskService;
        #endregion

        #region Ctor

        /// <summary>
        /// Ctor for Task
        /// </summary>
        /// <param name="task">Task </param>
        public ScheduleTaskRunner(ScheduleTask task, IScheduleTaskService scheduleTaskService)
        {
            ScheduleTask = task;
            _scheduleTaskService = scheduleTaskService;
        }

        #endregion

        #region Utilities

        /// <summary>
        /// Initialize and execute task
        /// </summary>
        //private void ExecuteTask()
        //{
        //    var scheduleTaskService = EngineContext.Resolve<IScheduleTaskService>();

        //    if (!Enabled)
        //        return;

        //    var type = Type.GetType(ScheduleTask.Type) ??
        //        //ensure that it works fine when only the type name is specified (do not require fully qualified names)
        //        AppDomain.CurrentDomain.GetAssemblies()
        //        .Select(a => a.GetType(ScheduleTask.Type))
        //        .FirstOrDefault(t => t != null);
        //    if (type == null)
        //        throw new Exception($"Schedule task ({ScheduleTask.Type}) cannot by instantiated");

        //    object instance = null;
        //    try
        //    {
        //        instance = EngineContext.Resolve(type);
        //    }
        //    catch
        //    {
        //        //try resolve
        //    }

        //    if (instance == null)
        //    {
        //        //not resolved
        //        instance = EngineContext.ResolveUnregistered(type);
        //    }

        //    var task = instance as IScheduleTask;
        //    if (task == null)
        //        return;

        //    ScheduleTask.LastStartUtc = DateTime.UtcNow;
        //    //update appropriate datetime properties
        //    scheduleTaskService.UpdateTask(ScheduleTask);
        //    task.ExecuteAsync();
        //    ScheduleTask.LastEndUtc = ScheduleTask.LastSuccessUtc = DateTime.UtcNow;
        //    //update appropriate datetime properties
        //    scheduleTaskService.UpdateTask(ScheduleTask);
        //}

        /// <summary>
        /// Is task already running?
        /// </summary>
        /// <param name="scheduleTask">Schedule task</param>
        /// <returns>Result</returns>
        protected virtual bool IsTaskAlreadyRunning(ScheduleTask scheduleTask)
        {
            //task run for the first time
            if (!scheduleTask.LastStartUtc.HasValue && !scheduleTask.LastEndUtc.HasValue)
                return false;

            var lastStartUtc = scheduleTask.LastStartUtc ?? DateTime.UtcNow;

            //task already finished
            if (scheduleTask.LastEndUtc.HasValue && lastStartUtc < scheduleTask.LastEndUtc)
                return false;

            //task wasn't finished last time
            if (lastStartUtc.AddSeconds(scheduleTask.Seconds) <= DateTime.UtcNow)
                return false;

            return true;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Executes the task
        /// </summary>
        /// <param name="throwException">A value indicating whether exception should be thrown if some error happens</param>
        /// <param name="ensureRunOncePerPeriod">A value indicating whether we should ensure this task is run once per run period</param>
        //public async System.Threading.Tasks.Task ExecuteAsync(bool throwException = false, bool ensureRunOncePerPeriod = true)
        //{
        //    if (ScheduleTask == null || !Enabled)
        //        return;

        //    if (ensureRunOncePerPeriod)
        //    {
        //        //task already running
        //        if (IsTaskAlreadyRunning(ScheduleTask))
        //            return;

        //        //validation (so nobody else can invoke this method when he wants)
        //        if (ScheduleTask.LastStartUtc.HasValue && (DateTime.UtcNow - ScheduleTask.LastStartUtc).Value.TotalSeconds < ScheduleTask.Seconds)
        //            //too early
        //            return;
        //    }

        //    try
        //    {
        //        //get expiration time
        //        var expirationInSeconds = Math.Min(ScheduleTask.Seconds, 300) - 1;
        //        var expiration = TimeSpan.FromSeconds(expirationInSeconds);

        //        //execute task with lock
        //        //var locker = EngineContext.Resolve<ILocker>();
        //        //locker.PerformActionWithLock(ScheduleTask.Type, expiration, ExecuteTask);

        //        ExecuteTask();

        //    }
        //    catch (Exception exc)
        //    {
        //        var scheduleTaskService = EngineContext.Resolve<IScheduleTaskService>();

        //        ScheduleTask.Enabled = !ScheduleTask.StopOnError;
        //        ScheduleTask.LastEndUtc = DateTime.UtcNow;
        //        scheduleTaskService.UpdateTask(ScheduleTask);

        //        if (throwException)
        //            throw;
        //    }
        //}





        protected async System.Threading.Tasks.Task ExecuteTask(ScheduleTask scheduleTask)
        {
            var type = Type.GetType(scheduleTask.Type) ??
                       //ensure that it works fine when only the type name is specified (do not require fully qualified names)
                       AppDomain.CurrentDomain.GetAssemblies()
                           .Select(a => a.GetType(scheduleTask.Type))
                           .FirstOrDefault(t => t != null);
            if (type == null)
                throw new Exception($"Schedule task ({scheduleTask.Type}) cannot by instantiated");

            object instance = null;

            try
            {
                //instance = EngineContext.Current.Resolve(type);
                instance = EngineContext.Resolve(type);
            }
            catch
            {
                // ignored
            }

            //instance ??= EngineContext.Current.ResolveUnregistered(type);
            instance = instance ?? EngineContext.ResolveUnregistered(type);


            var task = instance as IScheduleTask;
            if (task == null)
                return;

            //var _scheduleTaskService = EngineContext.Resolve<IScheduleTaskService>();
            scheduleTask.LastStartUtc = DateTime.UtcNow;
            //update appropriate datetime properties

            await _scheduleTaskService.UpdateTask(scheduleTask);
            await task.ExecuteAsync();
            scheduleTask.LastEndUtc = scheduleTask.LastSuccessUtc = DateTime.UtcNow;
            //update appropriate datetime properties
            await _scheduleTaskService.UpdateTask(scheduleTask);
        }
        public async System.Threading.Tasks.Task ExecuteAsync(ScheduleTask scheduleTask,
            bool forceRun = false,
            bool throwException = false,
            bool ensureRunOncePerPeriod = true)
        {
            var enabled = forceRun || (scheduleTask?.Enabled ?? false);

            if (scheduleTask == null || !enabled)
                return;

            if (ensureRunOncePerPeriod)
            {
                //task already running
                if (IsTaskAlreadyRunning(scheduleTask))
                    return;

                //validation (so nobody else can invoke this method when he wants)
                if (scheduleTask.LastStartUtc.HasValue && (DateTime.UtcNow - scheduleTask.LastStartUtc).Value.TotalSeconds < scheduleTask.Seconds)
                    //too early
                    return;
            }

            try
            {
                //get expiration time
                var expirationInSeconds = Math.Min(scheduleTask.Seconds, 300) - 1;
                var expiration = TimeSpan.FromSeconds(expirationInSeconds);

                //execute task with lock
                //_locker.PerformActionWithLock(scheduleTask.Type, expiration, () => ExecuteTask(scheduleTask));
                await ExecuteTask(scheduleTask);
            }
            catch (Exception exc)
            {
                //var store = await _storeContext.GetCurrentStoreAsync();

                //var scheduleTaskUrl = $"{store.Url}{NopTaskDefaults.ScheduleTaskPath}";

                //scheduleTask.Enabled = !scheduleTask.StopOnError;
                //scheduleTask.LastEndUtc = DateTime.UtcNow;
                //await _scheduleTaskService.UpdateTaskAsync(scheduleTask);

                //var message = string.Format(await _localizationService.GetResourceAsync("ScheduleTasks.Error"), scheduleTask.Name,
                //    exc.Message, scheduleTask.Type, store.Name, scheduleTaskUrl);

                ////log error
                //await _logger.ErrorAsync(message, exc);
                if (throwException)
                    throw;
            }
        }

        #endregion

        #region Properties

        /// <summary>
        /// Schedule task
        /// </summary>
        public ScheduleTask ScheduleTask { get; }

        /// <summary>
        /// A value indicating whether the task is enabled
        /// </summary>
        public bool Enabled
        {
            get
            {
                if (!_enabled.HasValue)
                    _enabled = ScheduleTask?.Enabled;

                return _enabled.HasValue && _enabled.Value;
            }

            set => _enabled = value;
        }

        #endregion
    }
}
