using Repository;
using Repository.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ViewModel.UserManagement.Attendance;

namespace Service.Attendance
{

    public class DeviceHelper
    {
        public BackgroundWorker workerConnectAllDevice;
        public BackgroundWorker dbWorker;
        public BackgroundWorker bg_ImportFromSelected;
        public BackgroundWorker bg_DeviceCapacityInfo;
        public DeviceMethodHlper deviceMethodHlper { get; set; }

        private readonly IDeviceInfoService _deviceInfoService;

        public DeviceHelper()
        {
            //Terminal.cancellationToken = Terminal.TokenSource.Token;
            OnLoad_ConnectAllDevice();
            OnLoad_ImportAttLog();
            OnLoad__FromSelectedDevice();
            OnLoad_DeviceCapacityInfo();
            deviceMethodHlper = new DeviceMethodHlper();

            _deviceInfoService = EngineContext.Resolve<IDeviceInfoService>();

        }




        #region Fetch Device List from database
        public async Task LoadDeviceList()
        {
            if (bg_DeviceCapacityInfo != null && !bg_DeviceCapacityInfo.IsBusy
                && bg_ImportFromSelected != null && !bg_ImportFromSelected.IsBusy
                && dbWorker != null && !dbWorker.IsBusy)
            {
                var _device = await _deviceInfoService.GetAllDevice();
                FingerPrintDeviceService.Devices = new List<DevicesList>();
                if (_device != null && _device.Count > 0)
                {
                    foreach (var item in _device)
                    {
                        var _deviceItem = new DevicesList(item);
                        FingerPrintDeviceService.Devices.Add(_deviceItem);
                    }
                }
                else
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "لطفا دستگاه را تعریف کنید" });
                }
            }
            else
            {
                ShowDoWorkMesage();
            }
        }
        public void ShowDoWorkMesage()
        {
            if (dbWorker != null && dbWorker.IsBusy)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات تخلیه اتوماتیک در حال اجراست." + PublicResource.PleaseWaitToCompletePreviuseTask });
            }
            else if (bg_ImportFromSelected != null && bg_ImportFromSelected.IsBusy)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات تخلیه دستی در حال اجراست." + PublicResource.PleaseWaitToCompletePreviuseTask });
            }
            else if (bg_DeviceCapacityInfo != null && bg_DeviceCapacityInfo.IsBusy)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات دریافت اطلاعات دستگاه ها در حال اجراست." + PublicResource.PleaseWaitToCompletePreviuseTask });
            }
            else if (workerConnectAllDevice != null && workerConnectAllDevice.IsBusy)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات اتصال به دستگاه ها در حال اجراست." + PublicResource.PleaseWaitToCompletePreviuseTask });
            }
        }
        #endregion


        #region Connect to all device
        public void OnLoad_ConnectAllDevice()
        {
            workerConnectAllDevice = new BackgroundWorker();
            workerConnectAllDevice.DoWork += new DoWorkEventHandler(workerConnectAllDevice_DoWork);
            workerConnectAllDevice.ProgressChanged += new ProgressChangedEventHandler(workerConnectAllDevice_ProgressChanged);
            workerConnectAllDevice.RunWorkerCompleted += new RunWorkerCompletedEventHandler(workerConnectAllDevice_RunWorkerCompleted);
            workerConnectAllDevice.WorkerReportsProgress = true;
            workerConnectAllDevice.WorkerSupportsCancellation = true;
        }
        public void ConnectAllDevice()
        {
            if (workerConnectAllDevice != null && !workerConnectAllDevice.IsBusy
                && bg_DeviceCapacityInfo != null && !bg_DeviceCapacityInfo.IsBusy
                && bg_ImportFromSelected != null && !bg_ImportFromSelected.IsBusy
                && dbWorker != null && !dbWorker.IsBusy)
            {
                workerConnectAllDevice.RunWorkerAsync();
            }
            else
            {
                ShowDoWorkMesage();
            }
        }
        private void workerConnectAllDevice_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            if (e.Cancelled)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + PublicResource.OperationCancelled });
            }
            else if (e.Error != null)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = @"*Error occurred: " + e.Error.Message });
            }
            else
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationSuccessfullyDone });
            }
        }
        private void workerConnectAllDevice_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {

        }
        private void workerConnectAllDevice_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                if (FingerPrintDeviceService.Devices == null || FingerPrintDeviceService.Devices.Count <= 0) return;

                int tablesCount = FingerPrintDeviceService.Devices.Count;
                int maximumConcurentThreadCount = 15;
                List<Task> tasks = new List<Task>();

                LimitedConcurrencyLevelTaskScheduler limitedConcurencyTaskScheduler =
                    new LimitedConcurrencyLevelTaskScheduler(maximumConcurentThreadCount);
                TaskFactory customTaskFactory = new TaskFactory(limitedConcurencyTaskScheduler);

                foreach (var item in FingerPrintDeviceService.Devices)
                {
                    if (workerConnectAllDevice.CancellationPending == true)
                    {
                        e.Cancel = true;
                        break;
                    }
                    Task task = customTaskFactory.StartNew(
                        () =>
                        {
                            //item.sDK = new SDKHelper(Terminal, item.deviceVm);
                            item.sDK = new TwainDeviceCreator().TwainDevice(item.deviceVm);
                            if (item.sDK.sta_ConnectTCP().Error == false)
                                item.sDK.sta_GetSeialNumber();
                        }, FingerPrintDeviceService.TokenSource.Token);
                    tasks.Add(task);
                }

                if (tasks.Count > 0)
                {
                    try
                    {
                        Task.WaitAll(tasks.ToArray(), FingerPrintDeviceService.TokenSource.Token);
                    }
                    catch (OperationCanceledException ex)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "عملیات لغو شد. " });
                    }
                }
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
        }
        #endregion


        #region Import Att log from All Device
        public void OnLoad_ImportAttLog()
        {
            //ایجاد یک نخ جدا برای دریافت اتوماتیک اطلاعات از دستگاه
            dbWorker = new BackgroundWorker();
            dbWorker.DoWork += new DoWorkEventHandler(dbWorker_DoWork);
            dbWorker.ProgressChanged += new ProgressChangedEventHandler(dbWorker_ProgressChanged);
            dbWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(dbWorker_RunWorkerCompleted);
            dbWorker.WorkerReportsProgress = true;
            dbWorker.WorkerSupportsCancellation = true;
        }
        public void RunImportAttLog()
        {
            if (bg_DeviceCapacityInfo != null && !bg_DeviceCapacityInfo.IsBusy
                && bg_ImportFromSelected != null && !bg_ImportFromSelected.IsBusy
                && dbWorker != null && !dbWorker.IsBusy)
            {
                dbWorker.RunWorkerAsync();
            }
            else
            {
                ShowDoWorkMesage();
            }
        }
        private void dbWorker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            if (e.Cancelled)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationCancelled });
            }
            else if (e.Error != null)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = @"*Error occurred: " + e.Error.Message });
            }
            else
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationSuccessfullyDone });
            }
        }
        private void dbWorker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {

        }
        private void dbWorker_DoWork(object sender, DoWorkEventArgs e)
        {
            try
            {
                //new Task(() => { ImportAttLogFromAllDevice(); }).Start();
                ImportAttLogFromAllDevice(e);
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        private void ImportAttLogFromAllDevice(DoWorkEventArgs e)
        {
            try
            {
                if (FingerPrintDeviceService.Devices == null || FingerPrintDeviceService.Devices.Count <= 0 || FingerPrintDeviceService.Devices.Where(x => x.deviceVm.GetAutoData).ToList().Count <= 0) return;

                ExecuteImportAtt(FingerPrintDeviceService.Devices.Where(x => x.deviceVm.GetAutoData).ToList(), e);
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
        }
        #endregion


        #region Import Att log from Selected Device
        public int DeviceGroupId = 0;
        public void OnLoad__FromSelectedDevice()
        {
            bg_ImportFromSelected = new BackgroundWorker();
            bg_ImportFromSelected.DoWork += new DoWorkEventHandler(dbWorker_DoWork_FromSelectedDevice);
            bg_ImportFromSelected.ProgressChanged += new ProgressChangedEventHandler(dbWorker_ProgressChanged);
            bg_ImportFromSelected.RunWorkerCompleted += new RunWorkerCompletedEventHandler(dbWorker_RunWorkerCompleted);
            bg_ImportFromSelected.WorkerReportsProgress = true;
            bg_ImportFromSelected.WorkerSupportsCancellation = true;
        }
        public void RunImportAttLog_FromSelectedDevice(int deviceGroup)
        {
            DeviceGroupId = deviceGroup;
            if (bg_DeviceCapacityInfo != null && !bg_DeviceCapacityInfo.IsBusy
                && bg_ImportFromSelected != null && !bg_ImportFromSelected.IsBusy
                && dbWorker != null && !dbWorker.IsBusy)
            {
                bg_ImportFromSelected.RunWorkerAsync();
            }
            else
            {
                ShowDoWorkMesage();
            }
        }
        private void dbWorker_DoWork_FromSelectedDevice(object sender, DoWorkEventArgs e)
        {
            try
            {
                ImportAttLog_FromSelectedDevice(e);
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        private void ImportAttLog_FromSelectedDevice(DoWorkEventArgs e)
        {
            try
            {
                var _devices = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.GetAutoData == true && (x.deviceVm.GroupId == DeviceGroupId || DeviceGroupId == 0)).ToList();
                if (FingerPrintDeviceService.Devices == null || FingerPrintDeviceService.Devices.Count <= 0 || _devices.Count <= 0) return;

                ExecuteImportAtt(_devices, e);

            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
        }
        #endregion


        public void ExecuteImportAtt(List<DevicesList> devicesLists, DoWorkEventArgs e)
        {
            try
            {
                if (FingerPrintDeviceService.Devices == null || FingerPrintDeviceService.Devices.Count <= 0 || devicesLists.Count <= 0) return;

                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات تخلیه شروع شد. لطفا تا انتهای عملیات منتظر بمانید" });



                int maximumConcurentThreadCount = FingerPrintDeviceService.MaxThreadCount;
                List<Task> tasks = new List<Task>();

                LimitedConcurrencyLevelTaskScheduler limitedConcurencyTaskScheduler =
                    new LimitedConcurrencyLevelTaskScheduler(maximumConcurentThreadCount);
                TaskFactory customTaskFactory = new TaskFactory(limitedConcurencyTaskScheduler);

                foreach (var item in devicesLists.OrderBy(x => x.deviceVm.LastTimeExportEn).ToList())
                {
                    if (bg_ImportFromSelected.CancellationPending == true || dbWorker.CancellationPending == true)
                    {
                        e.Cancel = true;
                        break;
                    }

                    Task task = customTaskFactory.StartNew(
                        () =>
                        {
                            //item.sDK = new SDKHelper(Terminal, item.deviceVm);
                            item.sDK = new TwainDeviceCreator().TwainDevice(item.deviceVm);
                            if (item.sDK.sta_ConnectTCP().Error == false)
                                item.sDK.Run_ImportAttLogFromDevice();
                            if (item.sDK.sta_ConnectTCP().Error == false) item.sDK.sta_DisConnect();
                        }, FingerPrintDeviceService.TokenSource.Token);
                    tasks.Add(task);
                }

                if (tasks.Count > 0)
                {
                    try
                    {
                        Task.WaitAll(tasks.ToArray(), FingerPrintDeviceService.TokenSource.Token);
                    }
                    catch (OperationCanceledException ex)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "عملیات لغو شد. " });
                    }
                }
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
        }









        #region Import Att log from Selected Device
        public void OnLoad_DeviceCapacityInfo()
        {
            bg_DeviceCapacityInfo = new BackgroundWorker();
            bg_DeviceCapacityInfo.DoWork += new DoWorkEventHandler(dbWorker_DeviceCapacityInfo);
            bg_DeviceCapacityInfo.ProgressChanged += new ProgressChangedEventHandler(dbWorker_ProgressChanged);
            bg_DeviceCapacityInfo.RunWorkerCompleted += new RunWorkerCompletedEventHandler(dbWorker_RunWorkerCompleted);
            bg_DeviceCapacityInfo.WorkerReportsProgress = true;
            bg_DeviceCapacityInfo.WorkerSupportsCancellation = true;
        }
        public void Run_DeviceCapacityInfo()
        {
            if (bg_DeviceCapacityInfo != null && !bg_DeviceCapacityInfo.IsBusy
                && bg_ImportFromSelected != null && !bg_ImportFromSelected.IsBusy
                && dbWorker != null && !dbWorker.IsBusy)
            {
                bg_DeviceCapacityInfo.RunWorkerAsync();
            }
            else
            {
                ShowDoWorkMesage();
            }
        }
        private void dbWorker_DeviceCapacityInfo(object sender, DoWorkEventArgs e)
        {
            try
            {
                GetDeviceCapacityInfo(e);
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        private void getDeviceInfo(DevicesList deviceVm)
        {
            int adminCnt = 0;
            int userCount = 0;
            int fpCnt = 0;
            int recordCnt = 0;
            int pwdCnt = 0;
            int oplogCnt = 0;
            int faceCnt = 0;

            try
            {
                deviceVm.sDK.sta_GetCapacityInfo(out adminCnt, out userCount, out fpCnt, out recordCnt, out pwdCnt, out oplogCnt, out faceCnt);

                deviceVm.deviceVm.adminCnt = adminCnt;
                deviceVm.deviceVm.userCount = userCount;
                deviceVm.deviceVm.fpCnt = fpCnt;
                deviceVm.deviceVm.recordCnt = recordCnt;
                deviceVm.deviceVm.pwdCnt = pwdCnt;
                deviceVm.deviceVm.oplogCnt = oplogCnt;
                deviceVm.deviceVm.faceCnt = faceCnt;

                deviceVm.deviceVm.deviceHardwareInfo.InfoLoaded = true;

                _deviceInfoService.UpdateDeviceCapacity(deviceVm.deviceVm);

            }
            catch (Exception ex)
            {
                deviceVm.deviceVm.deviceHardwareInfo.InfoLoaded = false;
            }
        }
        public void GetDeviceCapacityInfo(DoWorkEventArgs e)
        {
            try
            {
                if (FingerPrintDeviceService.Devices == null || FingerPrintDeviceService.Devices.Count <= 0) return;
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "عملیات دریافت اطلاعات دستگاه ها شروع شد. لطفا تا انتهای عملیات منتظر بمانید" });

                int maximumConcurentThreadCount = 20;
                List<Task> tasks = new List<Task>();

                LimitedConcurrencyLevelTaskScheduler limitedConcurencyTaskScheduler =
                    new LimitedConcurrencyLevelTaskScheduler(maximumConcurentThreadCount);
                TaskFactory customTaskFactory = new TaskFactory(limitedConcurencyTaskScheduler);

                foreach (var item in FingerPrintDeviceService.Devices.OrderBy(x => x.deviceVm.deviceHardwareInfo.InfoLoaded).ToList())
                {
                    if (bg_DeviceCapacityInfo.CancellationPending == true)
                    {
                        e.Cancel = true;
                        break;
                    }
                    if (!item.deviceVm.deviceHardwareInfo.InfoLoaded)
                    {
                        Task task = customTaskFactory.StartNew(
                            () =>
                            {
                                //item.sDK = new SDKHelper(Terminal, item.deviceVm);
                                item.sDK = new TwainDeviceCreator().TwainDevice(item.deviceVm);
                                if (item.sDK.sta_ConnectTCP().Error == false)
                                {
                                    getDeviceInfo(item);
                                }
                                if (item.sDK.sta_ConnectTCP().Error == false) item.sDK.sta_DisConnect();
                            }, FingerPrintDeviceService.TokenSource.Token);
                        tasks.Add(task);
                    }
                }

                if (tasks.Count > 0)
                {
                    try
                    {
                        Task.WaitAll(tasks.ToArray(), FingerPrintDeviceService.TokenSource.Token);
                    }
                    catch (OperationCanceledException ex)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "عملیات لغو شد. " });
                    }
                }
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
        }
        #endregion


    }


    public class DeviceMethodHlper
    {
        public DeviceMethodHlper()
        {

        }
        private static IList<string> GetCommandsFromScript(string sql)
        {
            if (string.IsNullOrEmpty(sql)) return new List<string>();
            var commands = new List<string>();

            sql = Regex.Replace(sql, @"\\\r?\n", string.Empty);
            var batches = Regex.Split(sql, @"^\s*(GO[ \t]+[0-9]+|GO)(?:\s+|$)", RegexOptions.IgnoreCase | RegexOptions.Multiline);

            for (var i = 0; i < batches.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(batches[i]) || batches[i].StartsWith("GO", StringComparison.OrdinalIgnoreCase))
                    continue;

                var count = 1;
                if (i != batches.Length - 1 && batches[i + 1].StartsWith("GO", StringComparison.OrdinalIgnoreCase))
                {
                    var match = Regex.Match(batches[i + 1], "([0-9]+)");
                    if (match.Success)
                        count = int.Parse(match.Value);
                }

                var builder = new StringBuilder();
                for (var j = 0; j < count; j++)
                {
                    builder.Append(batches[i]);
                    if (i == batches.Length - 1)
                        builder.AppendLine();
                }

                commands.Add(builder.ToString());
            }

            return commands;
        }
        public DataModelResult ExecuteSqlScript(string sql)
        {
            try
            {
                if (string.IsNullOrEmpty(sql)) return new DataModelResult();


                var _connstring = ConnectionStringManager.LoadSettings(true);
                if (_connstring == null || !ConnectionStringManager.DatabaseIsInstalled)
                {
                    _connstring = new MainConnectionString();
                    _connstring.ConnectionString = $"Data Source=.;initial catalog=MinaDB;user id=sa;password=Admin@110;MultipleActiveResultSets=True;";
                }

                using (DbConnection connection = new SqlConnection(_connstring.ConnectionString.Replace("MultipleActiveResultSets=True;App=EntityFramework", "")))
                {
                    connection.Open();
                    try
                    {
                        var sqlCommands = GetCommandsFromScript(sql);

                        foreach (var _cmd in sqlCommands)
                            using (DbCommand command = new SqlCommand(_cmd))
                            {
                                command.Connection = connection;
                                command.ExecuteNonQuery();
                            }
                        connection.Close();
                    }
                    catch (Exception ex)
                    {
                        return new DataModelResult { Error = true, Message = ex.Message };
                    }
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
    }

}
