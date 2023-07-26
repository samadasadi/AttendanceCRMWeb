using Repository;
using Repository.Infrastructure;
using Repository.Model;
using Repository.Model.Common;
using Service.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Service.TaskService
{
    public class KeepAliveTask : IScheduleTask
    {
        public async System.Threading.Tasks.Task ExecuteAsync()
        {

            //var taskService = EngineContext.Resolve<IGenericAttributeService>();
            //var _hostUrl = taskService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.HostURL).Result;
            //_hostUrl = _hostUrl ?? "http://127.0.0.1/";
            //var scheduleTaskUrl = $"{_hostUrl.TrimEnd('/')}/{"KeepAlive/Index"}";

            var taskService = EngineContext.Resolve<IGenericAttributeService>();
            var _hostUrl = taskService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.HostURL).Result;
            _hostUrl = _hostUrl ?? "127.0.0.1:80";
            var scheduleTaskUrl = $"http://{_hostUrl}/{"KeepAlive/Index"}";


            using (var wc = new WebClient())
            {
                var _result = wc.DownloadString(scheduleTaskUrl);
            }
        }
    }
}
