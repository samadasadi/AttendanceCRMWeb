using Repository;
using Repository.iContext;
using Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public partial interface IScheduleTaskService
    {
        System.Threading.Tasks.Task DeleteTask(ScheduleTask task);
        System.Threading.Tasks.Task<ScheduleTask> GetTaskById(Guid taskId);
        System.Threading.Tasks.Task<ScheduleTask> GetTaskByType(string type);
        System.Threading.Tasks.Task<IList<ScheduleTask>> GetAllTasks(bool showHidden = false);
        System.Threading.Tasks.Task InsertTask(ScheduleTask task);
        System.Threading.Tasks.Task UpdateTask(ScheduleTask task);
    }
    public partial class ScheduleTaskService : IScheduleTaskService
    {
        #region Fields
        private readonly IRepository<ScheduleTask> _taskRepository;
        #endregion

        #region Ctor

        public ScheduleTaskService(
            IRepository<ScheduleTask> taskRepository,
            IContextFactory contextFactory)
        {
            var currentcontext = contextFactory.GetContext();

            _taskRepository = taskRepository;
            _taskRepository.FrameworkContext = currentcontext;
            _taskRepository.DbFactory = contextFactory;
        }

        #endregion

        #region Methods

        public virtual async System.Threading.Tasks.Task DeleteTask(ScheduleTask task)
        {
            if (task == null)
                throw new ArgumentNullException(nameof(task));

            await _taskRepository.LogicalDelete(task);
        }
        public virtual async System.Threading.Tasks.Task<ScheduleTask> GetTaskById(Guid taskId)
        {
            if (taskId == Guid.Empty)
                return null;

            return (await _taskRepository.Get(x => x.Id == taskId)).FirstOrDefault();
        }
        public virtual async System.Threading.Tasks.Task<ScheduleTask> GetTaskByType(string type)
        {
            if (string.IsNullOrWhiteSpace(type))
                return null;

            var query = await _taskRepository.GetAll();
            query = query.Where(st => st.Type == type);
            query = query.OrderByDescending(t => t.Id);

            var task = query.FirstOrDefault();
            return task;
        }
        public virtual async System.Threading.Tasks.Task<IList<ScheduleTask>> GetAllTasks(bool showHidden = false)
        {
            var query = await _taskRepository.GetAll();
            if (!showHidden)
            {
                query = query.Where(t => t.Enabled);
            }

            query = query.OrderByDescending(t => t.Seconds);

            var tasks = query.ToList();
            return tasks;
        }
        public virtual async System.Threading.Tasks.Task InsertTask(ScheduleTask task)
        {
            if (task == null)
                throw new ArgumentNullException(nameof(task));

            await _taskRepository.Add(task);
        }
        public virtual async System.Threading.Tasks.Task UpdateTask(ScheduleTask task)
        {
            try
            {
                if (task == null)
                    throw new ArgumentNullException(nameof(task));

                await _taskRepository.Update(task);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }
}
