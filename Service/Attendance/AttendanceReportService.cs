using Mapping;
using Newtonsoft.Json;
using Repository;
using Repository.iContext;
using Repository.Infrastructure;
using Repository.Model;
using Repository.Model.Attendance;
using Service.Attendance;
using Service.Attendance.Helper;
using Service.BasicInfo;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Hosting;
using Utility;
using Utility.PublicEnum;
using Utility.Utitlies;
using ViewModel.Attendance;
using ViewModel.BasicInfo;
using ViewModel.Common;
using ViewModel.Report;
using ViewModel.UserManagement;
using ViewModel.UserManagement.Attendance;

namespace Service.UserManagement.Attendance
{

    public interface IAttendanceReportService
    {
        Task<AttendanceVM> GetAttendanceList(ReportParameter model);
        List<NormalJsonClass> GetReportType(int reportType = 0);
        /// <summary>
        /// گزارش عملکرد کلی
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<AttendanceVM> TotalPerformancePersonal_Report(ReportParameter model);
        /// <summary>
        /// گزارش شیفت کاری
        /// </summary>
        /// <returns></returns>
        Task<ReportVm<ShiftWorkVm>> GetShiftWorkReport();
        /// <summary>
        /// گزارش حضور و غیاب در بازه زمانی
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<ReportVm<DailyAttendance>> DailyAttendanceReport(ReportParameter model);
        /// <summary>
        /// گزارش افرادی که خروج ندارند
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<ReportVm<DailyAttendance>> PersonsAreNotExitReport(ReportParameter model);
        /// <summary>
        /// گزارش مرخصی/ماموریت
        /// </summary>
        /// <param name="reportParameter"></param>
        /// <returns></returns>
        Task<ReportVm<TransactionRequestVm>> TransactionReqReport(ReportParameter reportParameter);

        Task<List<NormalJsonClass>> GetPersonelList();

        #region EventLog Report
        Task<ReportVm<TimeRecordVm>> TimeRecord_EventLogReport(ReportParameter parameter);
        #endregion

        Task<AttendanceVM> CalculatePatientAccount(UserVm filter);
        Task<DataModelResult> SavePersonelAccount(UserVm filter);
        Task<viewModel<EmployeeAccountingVm>> GetAllPersonAccount(UserVm value);
        Task<EmployeeAccountingVm> GetPersonAccount(EmployeeAccountingVm filter);
        Task<DataModelResult> DeletePersonelAccount(EmployeeAccountingVm filter);
        Task<DataModelResult> SavePersonelAccount_Cost(ViewModel.BasicInfo.CostVm model);
        Task<ViewModel.BasicInfo.ResultModel<Cost_Incoming>> SavePersonelAccount_CostIncoming(ViewModel.BasicInfo.CostVm model);

        /// <summary>
        /// لاگ ورود و خروج پرسنل
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<AttLogEvent_Report> GetAttendanceLog(ReportParameter model);

        Task<List<UsersPerformance>> TotalPerformancePersonal_AllUser_Excel(ReportParameter parameter);

        #region Att Log
        Task<DataModelResult> SaveAttLog(TimeRecordVm entity);
        Task<TimeRecordVm> GetAttLog(TimeRecordVm entity);
        Task<viewModel<TimeRecordVm>> GetAllAttLog(TimeRecordVm value);
        Task<DataModelResult> Delete_AttLog(TimeRecordVm model);

        #endregion


        Task<DataModel> ImportAttLogFromUSB(ImportFromUSBVm model);



    }

    public class AttendanceReportService : IAttendanceReportService
    {

        #region prop

        public Context _context;
        private readonly IRepository<Tbl_Cost> _repoCost;
        private readonly IRepository<PubUser> _repoPubUser;
        private readonly IRepository<JobTime> _repoJobTime;
        private readonly IRepository<Calendar> _repoCalendar;
        private readonly IRepository<NewDevice> _repoNewDevice;
        private readonly IRepository<ShiftWork> _repoShiftWork;
        private readonly IRepository<TimeRecords> _repoTimeRecord;
        private readonly IRepository<FingerTemplate> _repoTEMPLATE;
        private readonly IRepository<Cost_Incoming> _repoCostIncoming;
        private readonly IRepository<PubUser_Shift> _repoPubUser_Shift;
        private readonly IRepository<PersonHoghogh> _repoPersonHoghogh;
        private readonly IRepository<TransactionRequest> _repoTransactionRequest;
        private readonly IRepository<EmployeeAccounting> _repoEmployeeAccounting;

        private readonly IFileService _fileService;

        private readonly Guid[] transMorkhasiIds = new Guid[7] {
                    Guid.Parse("F1AC3ACA-C785-23EB-9A89-0EFA126E3C8E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-9A99-0EFA126E3C9E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-1A89-0EFA126E1C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-2A89-0EFA126E2C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-3A89-0EFA126E3C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-4A89-0EFA126E4C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-5A89-0EFA126E5C7E")
                };
        private readonly Guid[] transMamoriyatIds = new Guid[3] {
            Guid.Parse("F1AC3ACA-C785-23EB-9A59-0EFA126E3C5E"),
            Guid.Parse("F1AC3ACA-C785-23EB-9A69-0EFA126E3C6E"),
            Guid.Parse("F1AC3ACA-C785-23EB-9A79-0EFA126E3C7E")
        };

        private List<TimeRecordVm> AttLogRecordList { get; set; }
        #endregion

        #region ctor
        public AttendanceReportService(IContextFactory contextFactory,
            IRepository<PubUser> repoPubUser,
            IRepository<PubUser_Shift> repoPubUser_Shift,
            IRepository<TimeRecords> repoTimeRecrd,
            IRepository<Calendar> repoCalendar,
            IRepository<JobTime> repoJobTime,
            IRepository<NewDevice> repoNewDevice,
            IRepository<ShiftWork> repoShiftWork,
            IRepository<TransactionRequest> repoTransactionRequest,
            IRepository<PersonHoghogh> repoPersonHoghogh,
            IRepository<EmployeeAccounting> repoEmployeeAccounting,
            IRepository<Tbl_Cost> repoCost,
            IFileService fileService,
            IRepository<Cost_Incoming> repoCostIncoming,
            IRepository<FingerTemplate> repoTEMPLATE)
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;

            _repoPubUser_Shift = repoPubUser_Shift;
            _repoPubUser_Shift.FrameworkContext = currentcontext;
            _repoPubUser_Shift.DbFactory = contextFactory;

            _fileService = fileService;

            _repoEmployeeAccounting = repoEmployeeAccounting;
            _repoEmployeeAccounting.FrameworkContext = currentcontext;
            _repoEmployeeAccounting.DbFactory = contextFactory;

            _repoPersonHoghogh = repoPersonHoghogh;
            _repoPersonHoghogh.FrameworkContext = currentcontext;
            _repoPersonHoghogh.DbFactory = contextFactory;

            _repoPubUser = repoPubUser;
            _repoPubUser.FrameworkContext = currentcontext;
            _repoPubUser.DbFactory = contextFactory;

            _repoTimeRecord = repoTimeRecrd;
            _repoTimeRecord.FrameworkContext = currentcontext;
            _repoTimeRecord.DbFactory = contextFactory;

            _repoTEMPLATE = repoTEMPLATE;
            _repoTEMPLATE.FrameworkContext = currentcontext;
            _repoTEMPLATE.DbFactory = contextFactory;

            _repoCalendar = repoCalendar;
            _repoCalendar.FrameworkContext = currentcontext;
            _repoCalendar.DbFactory = contextFactory;

            _repoJobTime = repoJobTime;
            _repoJobTime.FrameworkContext = currentcontext;
            _repoJobTime.DbFactory = contextFactory;

            _repoShiftWork = repoShiftWork;
            _repoShiftWork.FrameworkContext = currentcontext;
            _repoShiftWork.DbFactory = contextFactory;

            _repoTransactionRequest = repoTransactionRequest;
            _repoTransactionRequest.FrameworkContext = currentcontext;
            _repoTransactionRequest.DbFactory = contextFactory;

            _repoNewDevice = repoNewDevice;
            _repoNewDevice.FrameworkContext = currentcontext;
            _repoNewDevice.DbFactory = contextFactory;

            _repoCost = repoCost;
            _repoCost.FrameworkContext = currentcontext;
            _repoCost.DbFactory = contextFactory;

            _repoCostIncoming = repoCostIncoming;
            _repoCostIncoming.FrameworkContext = currentcontext;
            _repoCostIncoming.DbFactory = contextFactory;

        }
        #endregion

        #region Methods
        public List<NormalJsonClass> GetReportType(int reportType = 0)
        {
            try
            {
                var _permission = Public.CurrentUser;
                var _res = new List<NormalJsonClass>();
                if (reportType == 0)
                {
                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.AttLogEvent))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.AttLog_Report, Text = PublicResource.AttLog });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.EzafekarReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.Ezafekar_Report, Text = PublicResource.Ezafekar });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.GheybatReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.Gheybat_Report, Text = PublicResource.Gheybat });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.KarkardReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.Karkard_Report, Text = PublicResource.Karkard });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.TajilReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.Tajil_Report, Text = PublicResource.Tajil });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.TakhirReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.Takhir_Report, Text = PublicResource.Takhir });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.DailyAttendanceReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.DailyAttendance_Report, Text = PublicResource.DailyAttendance });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.PersonsAreNotExitReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.PersonsAreNotExit, Text = PublicResource.PersonsAreNotExit });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.TransactionReq_MamoriyatReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.TransactionReq_Mamoriyat, Text = PublicResource.TransactionReq_Mamoriyat });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.TransactionReq_MorkhasiReport))
                    _res.Add(new NormalJsonClass { Id = (int)SystemReportType.TransactionReq_Morkhasi, Text = PublicResource.TransactionReq_Morkhasi });
                }
                else
                {
                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.PersonsReport))
                    _res.Add(new NormalJsonClass { Id = (int)PubliReportType.Persons_Report, Text = PublicResource.Persons });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.UserGroupsReport))
                    _res.Add(new NormalJsonClass { Id = (int)PubliReportType.UserGroups_Report, Text = PublicResource.UserGroups });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.ShiftReport))
                    _res.Add(new NormalJsonClass { Id = (int)PubliReportType.Shift_Report, Text = PublicResource.Shift });

                    //if (Public.CurrentUser.IsAdministrator || _permission.AvailableRole.Contains(PubRoles.DevicesReport))
                    _res.Add(new NormalJsonClass { Id = (int)PubliReportType.Devices_Report, Text = PublicResource.DevicesName });
                }
                return _res;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.GetReportType => " + ex.Message);
            }
        }
        public async Task<AttendanceVM> GetAttendanceList(ReportParameter model)
        {
            try
            {
                var _model = new AttendanceVM();
                _model.reportParameter = new ReportParameter();
                _model.personInfoVm = new PersonelInfo();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.listAttenDanceVm = new List<AttendanceList>();

                var _user = (await _repoPubUser.Get(x => x.UserId == model.UserId)).FirstOrDefault();
                if (_user == null) return new AttendanceVM { Error = true, Message = "لطفا کاربر را انتخاب نمایید" };

                var _usershiftwork = (await _repoPubUser_Shift.Get(x => x.PuUser_Id == _user.Id)).ToList().OrderByDescending(x => x.EntesabDate).ToList().FirstOrDefault();
                if (_usershiftwork == null) return new AttendanceVM { Error = true, Message = "لطفا برای کاربر شیفت کاری تعریف کنید" };

                var _shftwork = (await _repoShiftWork.Get(x => x.Id == _usershiftwork.ShiftWork_Id)).ToList().FirstOrDefault();
                if (_shftwork == null) return new AttendanceVM { Error = true, Message = "شیفت کاری در سیستم تعریف نشده است" };
                var _shiftcalendar = JsonConvert.DeserializeObject<List<ShiftWork_DayVm>>(_shftwork.Data);
                var _vacation_days = _shiftcalendar.Where(x => x.IsVacation).ToList();
                if (_user != null)
                {
                    _model.personInfoVm.FirstName = _user.Name;
                    _model.personInfoVm.LastName = _user.Family;
                    _model.personInfoVm.FromDateStr = model.FromDate != null ? DateTimeOperation.M2S(model.FromDate.Value) : "";
                    _model.personInfoVm.ToDateStr = model.ToDate != null ? DateTimeOperation.M2S(model.ToDate.Value) : "";
                    _model.personInfoVm.PersonalCode = model.UserId.ToString();
                }


                var _fromDate = model.FromDate.Value;
                var _toDate = model.ToDate.Value;

                var _totalDay = Math.Abs((_toDate - _fromDate).TotalDays);

                //var _ListRecord = new List<AttendanceList>();
                for (int index = 0; index < _totalDay; index++)
                {
                    var _date = new AttendanceList
                    {
                        DateEn = _fromDate.AddDays(index)
                    };
                    _model.listAttenDanceVm.Add(_date);
                }

                if (_model.listAttenDanceVm != null && _model.listAttenDanceVm.Count > 0)
                {
                    //دریافت ساعات کاری
                    foreach (var timeRecord_item in _model.listAttenDanceVm)
                    {
                        //timeRecord_item.DayStr = DateTimeOperation.GetPersianDayName(timeRecord_item.DateEn);
                        var _query_timerecord = string.Format(" declare @_from datetime = {0} " +
                                                    " declare @_to datetime = {1} " +
                                                    " declare @_user int = {2} " +
                                                    " select " +
                                                    " TimeRecords.CardNo, TimeRecords.VerifyMethod, TimeRecords.DatetimeIO, TimeRecords.Day, TimeRecords.DeviceCode, " +
                                                    " TimeRecords.Hour, TimeRecords.Minute, TimeRecords.Month, TimeRecords.RecordID, TimeRecords.Year," +
                                                    " userr.FirstName+' '+userr.LastName as [Name], TimeRecords.AttStatus " +
                                                    " from TimeRecords " +
                                                    " left join PubUser userr on TimeRecords.CardNo = userr.UserId" +
                                                    " where (cast(TimeRecords.DatetimeIO as date)>=CAST(@_from as date) or @_from is null) " +
                                                    " and ((cast(TimeRecords.DatetimeIO as date)<=CAST(@_to as date)) or @_to is null) " +
                                                    " and (TimeRecords.CardNo = @_user or @_user is null)" +
                                                    " and (TimeRecords.IsDelete = 0)" +
                                                    " order by TimeRecords.DatetimeIO",
                                                    (timeRecord_item.DateEn != null ? "N'" + timeRecord_item.DateEn.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                                    (timeRecord_item.DateEn != null ? "N'" + timeRecord_item.DateEn.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                                    (model.UserId > 0 ? "N'" + model.UserId + "'" : "NULL"));
                        var _timeRecord = (await _repoTimeRecord.RunQuery<TimeRecordVm>(_query_timerecord)).ToList();

                        if (_timeRecord != null && _timeRecord.Count() > 0)
                        {
                            int _index = 0;
                            foreach (var item in _timeRecord)
                            {
                                if (_index == 0)
                                    timeRecord_item.EnterDate = item.DatetimeIO;
                                else if (_index == 1)
                                    timeRecord_item.LeaveDate = item.DatetimeIO;
                                else if (_index == 2)
                                    timeRecord_item.EnterDate2 = item.DatetimeIO;
                                else if (_index == 3)
                                    timeRecord_item.LeaveDate2 = item.DatetimeIO;
                                else if (_index == 4)
                                    timeRecord_item.EnterDate3 = item.DatetimeIO;
                                else if (_index == 5)
                                    timeRecord_item.LeaveDate3 = item.DatetimeIO;


                                _index++;
                                if (_index == 6) break;
                            }
                        }
                        else
                        {
                            timeRecord_item.Descriptions = PublicResource.DailyAbsense;
                        }
                    }



                    //محاسبه ساعت کاری در هر روز
                    foreach (var timeRecord_item in _model.listAttenDanceVm)
                    {
                        var _totalTime = 0;
                        if (timeRecord_item.EnterDate != null && timeRecord_item.LeaveDate != null && timeRecord_item.LeaveDate > timeRecord_item.EnterDate)
                        {
                            TimeSpan span = timeRecord_item.LeaveDate.Value.Subtract(timeRecord_item.EnterDate.Value);
                            _totalTime += (int)span.TotalMinutes;
                        }
                        if (timeRecord_item.EnterDate2 != null && timeRecord_item.LeaveDate2 != null && timeRecord_item.LeaveDate2 > timeRecord_item.EnterDate2)
                        {
                            TimeSpan span = timeRecord_item.LeaveDate2.Value.Subtract(timeRecord_item.EnterDate2.Value);
                            _totalTime += (int)span.TotalMinutes;
                        }
                        if (timeRecord_item.EnterDate3 != null && timeRecord_item.LeaveDate3 != null && timeRecord_item.LeaveDate3 > timeRecord_item.EnterDate3)
                        {
                            TimeSpan span = timeRecord_item.LeaveDate3.Value.Subtract(timeRecord_item.EnterDate3.Value);
                            _totalTime += (int)span.TotalMinutes;
                        }
                        timeRecord_item.TotalTime = _totalTime;

                    }
                    //محاسبه تمام ساعات کاری


                    var _totalminut = _model.listAttenDanceVm.Sum(x => x.TotalTime);
                    _model.personInfoVm.TotalTimeHourValue = _totalminut;

                    //_model.listAttenDanceVm = _model.listAttenDanceVm.Select(item => { item.DayStr = DateTimeOperation.GetPersianDayName(item.DateEn); return item; }).ToList();
                    foreach (var item in _model.listAttenDanceVm)
                    {
                        if (_vacation_days.Any(x => x.DayValue.Date == item.DateEn.Date))
                        {
                            item.IsHoliday = true;
                            item.Descriptions = "تعطیل";
                            item.IsPresent = true;
                        }
                    }
                    _model.personInfoVm.CountPresentDay = _model.listAttenDanceVm.Where(x => x.IsPresent == false).Count();
                    _model.personInfoVm.CountHozorDay = _model.listAttenDanceVm.Where(x => x.IsPresent == true && !x.IsHoliday).Count();
                }
                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.GetAttendanceList => " + ex.Message);
            }
        }
        public async Task<List<TransactionRequestVm>> GetAllTransactionRequest(TransactionRequestVm value)
        {
            try
            {
                var _query = string.Format(@"EXEC GetAllTransactionRequest "
                                            + "\n @ReqStatus = {0}, "
                                            + "\n @ReqType  = {1}, "
                                            + "\n @PersonId  = {2}, "
                                            + "\n @AcceptorId  = {3}, "
                                            + "\n @TransValue  = {4}, "
                                            + "\n @Search  = {5}, "
                                            + "\n @FromDate  = {6}, "
                                            + "\n @ToDate  = {7},"
                                            + "\n @From  = {8},"
                                            + "\n @To  = {9}",
                                            value.ReqStatus > 0 ? "N'" + value.ReqStatus + "'" : "NULL",
                                            value.ReqType > 0 ? "N'" + value.ReqType + "'" : "NULL",
                                            value.PersonID != Guid.Empty ? "N'" + value.PersonID + "'" : "NULL",
                                            value.AccepterID != Guid.Empty && value.AccepterID != null ? "N'" + value.AccepterID + "'" : "NULL",
                                            value.Transaction_Id != Guid.Empty && value.Transaction_Id != null ? "N'" + value.Transaction_Id + "'" : "NULL",
                                            !string.IsNullOrEmpty(value.Comment) ? "N'" + value.Comment + "'" : "NULL",
                                            value.FromDateRequest != null ? "N'" + value.FromDateRequest.ToString("yyyy-MM-dd") + "'" : "NULL",
                                            value.ToDateRequest != null ? "N'" + value.ToDateRequest.ToString("yyyy-MM-dd") + "'" : "NULL",
                                            value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize),
                                            value.PageNum * value.PageSize
                                            );
                var _result = (await _repoTransactionRequest.RunQuery<TransactionRequestVm>(_query)).ToList();
                return _result;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.GetAllTransactionRequest => " + ex.Message);
            }
        }


        #region گزارش شیفت کاری
        public async Task<ReportVm<ShiftWorkVm>> GetShiftWorkReport()
        {
            try
            {
                var _model = new ReportVm<ShiftWorkVm>();
                _model.reportModel = new ShiftWorkVm();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.reportList = new List<ShiftWorkVm>();

                _model.reportList = (from item in (await _repoShiftWork.Get(x => x.IsDeleted == false)).ToList()
                                     select new ShiftWorkVm
                                     {
                                         ShiftName = item.ShiftName,
                                         Id = item.Id,
                                         IsDeleted = item.IsDeleted,
                                         ModifiedDate = item.ModifiedDate,
                                     }).ToList();
                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.GetShiftWorkReport => " + ex.Message);
            }
        }
        #endregion


        #region گزارش حضور و غیاب در بازه زمانی
        public async Task<ReportVm<DailyAttendance>> DailyAttendanceReport(ReportParameter model)
        {
            try
            {
                var _model = new ReportVm<DailyAttendance>();
                _model.reportModel = new DailyAttendance();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.reportList = new List<DailyAttendance>();



                var _fromDate = model.FromDate.Value;
                var _toDate = model.ToDate.Value;

                var _totalDay = Math.Abs((_toDate - _fromDate).TotalDays);

                for (int index = 0; index < _totalDay + 1; index++)
                    _model.reportList.Add(new DailyAttendance { DateEn = _fromDate.AddDays(index) });

                foreach (var item in _model.reportList)
                {
                    item.UserInfo = new List<UserInfoList>();

                    var _users = (await _repoPubUser.Get(x => x.UserId == model.UserId || model.UserId == 0)).ToList();
                    foreach (var _person in _users)
                    {
                        var _item = new UserInfoList
                        {
                            UserId = _person.UserId != null ? _person.UserId.Value : 0,
                            FatherName = _person.FatherName,
                            NationalCode = _person.NationalCode,
                            PersonName = _person.Name + " " + _person.Family,
                            GroupName = ""
                        };

                        //دریافت تمامی اطلاعات مربوط به مرخصی و ماموریت
                        var _transactionReq = await GetAllTransactionRequest(new TransactionRequestVm
                        {
                            FromDateRequest = model.FromDate.Value,
                            ToDateRequest = model.ToDate.Value,
                            PersonID = _person.Id,
                            UserId = _person.UserId != null ? _person.UserId.Value : 0,
                            ReqStatus = (int)TransactionReqStatus.ReqStatus_Accept,
                            PageNum = 1,
                            PageSize = 10000
                        });

                        var _params = new AttendanceVM { listAttenDanceVm = new List<AttendanceList> { new AttendanceList { DateEn = item.DateEn, UserId = _person.UserId != null ? _person.UserId.Value : 0 } } };
                        await GetTimeWork(_params);

                        if (_params.listAttenDanceVm.FirstOrDefault().IsPresent)
                        {
                            _item.IsPresent = true;
                        }
                        else
                        {

                            _item.IsMamoriyat = IsMissionCurrentItem(_params.listAttenDanceVm.FirstOrDefault(), _transactionReq);
                            if (!_item.IsMamoriyat)
                            {
                                _item.IsMorakhasi = IsVacationCurrentItem(_params.listAttenDanceVm.FirstOrDefault(), _transactionReq);
                                if (!_item.IsMorakhasi)
                                    _item.IsGheybat = true;
                            }
                        }

                        item.UserInfo.Add(_item);
                    }
                }




                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.DailyAttendanceReport => " + ex.Message);
            }
        }

        #endregion


        #region گزارش افرادی که خروج ندارند
        public async Task<ReportVm<DailyAttendance>> PersonsAreNotExitReport(ReportParameter model)
        {
            try
            {
                var _model = new ReportVm<DailyAttendance>();
                _model.reportModel = new DailyAttendance();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.reportList = new List<DailyAttendance>();



                var _fromDate = model.FromDate.Value;
                var _toDate = model.ToDate.Value;

                var _totalDay = Math.Abs((_toDate - _fromDate).TotalDays);

                for (int index = 0; index < _totalDay + 1; index++)
                    _model.reportList.Add(new DailyAttendance { DateEn = _fromDate.AddDays(index) });

                foreach (var item in _model.reportList)
                {
                    item.UserInfo = new List<UserInfoList>();

                    var _users = (await _repoPubUser.Get(x => x.UserId == model.UserId || model.UserId == 0)).ToList();
                    foreach (var _person in _users)
                    {
                        var _item = new UserInfoList
                        {
                            UserId = _person.UserId != null ? _person.UserId.Value : 0,
                            FatherName = _person.FatherName,
                            NationalCode = _person.NationalCode,
                            PersonName = _person.Name + " " + _person.Family,
                            GroupName = ""
                        };


                        var _params = new AttendanceVM { listAttenDanceVm = new List<AttendanceList> { new AttendanceList { DateEn = item.DateEn, UserId = _person.UserId != null ? _person.UserId.Value : 0 } } };
                        await GetTimeWork(_params);

                        if (_params.listAttenDanceVm.FirstOrDefault().IsPresent)
                        {
                            if (_params.listAttenDanceVm.FirstOrDefault().EnterDate != null
                                && (_params.listAttenDanceVm.FirstOrDefault().LeaveDate == null))
                            {
                                _item.EnterDate = _params.listAttenDanceVm.FirstOrDefault().EnterDate;
                                _item.IsPresent = true;
                                item.UserInfo.Add(_item);
                            }
                        }
                    }
                }
                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.PersonsAreNotExitReport => " + ex.Message);
            }
        }

        #endregion


        #region گزارش عملکرد کلی

        public async Task<AttendanceVM> TotalPerformancePersonal_Report(ReportParameter model)
        {
            try
            {
                var _model = new AttendanceVM();
                _model.reportParameter = new ReportParameter();
                _model.personInfoVm = new PersonelInfo();
                _model.listAttenDanceVm = new List<AttendanceList>();
                _model.informationGlobalReport = new InformationGlobalReport();

                _model.reportParameter.CalcEzafeBeforeVoroud = model.CalcEzafeBeforeVoroud;


                var _user = (await _repoPubUser.Get(x => x.Id == model.PersonId)).FirstOrDefault();
                if (_user == null)
                {
                    _model.Error = true;
                    _model.Message = "لطفا کاربر را انتخاب نمایید";
                    return _model;
                }



                if (_user != null)
                {
                    _model.personInfoVm.FirstName = _user.Name;
                    _model.personInfoVm.LastName = _user.Family;
                    _model.personInfoVm.FromDateStr = model.FromDate != null ? DateTimeOperation.M2S(model.FromDate.Value) : "";
                    _model.personInfoVm.ToDateStr = model.ToDate != null ? DateTimeOperation.M2S(model.ToDate.Value) : "";
                    _model.personInfoVm.PersonalCode = model.UserId.ToString();

                    _model.personInfoVm.TarkeKar = _user.TarkeKar ?? false;
                    _model.personInfoVm.TarkeKarDateEn = _user.TarkeKarDateEn;

                    _model.personInfoVm.FatherName = _user.FatherName;
                    _model.personInfoVm.NationalCode = _user.NationalCode;

                }


                var _fromDate = model.FromDate.Value;
                var _toDate = model.ToDate.Value;

                var _totalDay = Math.Abs((_toDate - _fromDate).TotalDays);
                _totalDay += 1;

                for (int index = 0; index < _totalDay; index++)
                {
                    var _currdate = _fromDate.AddDays(index);

                    if (_model.personInfoVm.TarkeKarDateEn != null && _model.personInfoVm.TarkeKarDateEn.Value <= _currdate && (_user.TarkeKar ?? false))
                    {
                        break;
                    }

                    var _date = new AttendanceList
                    {
                        DateEn = _currdate,
                        UserId = model.UserId,
                        PersonID = _user.UserId ?? 0
                    };
                    _model.listAttenDanceVm.Add(_date);
                }

                if (_model.listAttenDanceVm != null && _model.listAttenDanceVm.Count > 0)
                {
                    //دریافت تمامی اطلاعات مربوط به مرخصی و ماموریت
                    var _transactionReq = await GetAllTransactionRequest(new TransactionRequestVm
                    {
                        FromDateRequest = model.FromDate.Value,
                        ToDateRequest = model.ToDate.Value,
                        UserId = model.UserId,
                        PersonID = _user.Id,
                        ReqStatus = (int)TransactionReqStatus.ReqStatus_Accept,
                        PageNum = 1,
                        PageSize = 10000
                    });

                    //دریافت ساعات کاری
                    await GetTimeWork(_model);

                    //محاسبه ساعت کاری در هر روز
                    await CalcTimeWorkPerDay(_model, _transactionReq, model);

                    //محاسبه تمامی اطلاعات مربوط به مرخصی و ماموریت
                    CalcTotalMissionAndVacation(_transactionReq, _model);

                    //اعمال پارامتر های گزارش
                    CalcReportParams(_model, model);

                    //محاسبه تمام ساعات کاری
                    CalcTotalWorkTime(_model);


                    _model.personInfoVm.CountPresentDay = _model.listAttenDanceVm.Where(x => x.IsPresent == false).Count();
                    //_model.personInfoVm.CountHozorDay = _model.listAttenDanceVm.Where(x => x.IsPresent == true && !x.IsHoliday).Count();
                    //_model.personInfoVm.CountHozorDay = _model.listAttenDanceVm.Where(x => x.IsPresent == true ).Count();
                    _model.personInfoVm.CountHozorDay = _model.listAttenDanceVm.Where(x =>
                    x.IsPresent == true // حاضر باشد
                    || (x.IsHoliday) //تعطیللات رسمی باشد
                    || x.IsMamoriyat //ماموریت باشد
                    || (x.IsVacation && x.IsVacation_WithoutCash == false) //مرخصی با حقوق باشد
                    ).Count();


                    _model.personInfoVm.CountHozorDay_AllWithVacataion = _model.listAttenDanceVm.Where(x => x.IsPresent == true).Count();

                }
                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.TotalPerformancePersonal_Report => " + ex.Message);
            }
        }


        /// <summary>
        /// دریافت ساعات کاری
        /// </summary>
        /// <param name="model"></param>
        private async System.Threading.Tasks.Task GetTimeWork(AttendanceVM model)
        {
            try
            {
                foreach (var timeRecord_item in model.listAttenDanceVm)
                {
                    var _query_timerecord = string.Format(" declare @_from datetime = {0} " +
                                                "\n declare @_to datetime = {1} " +
                                                "\n declare @_user int = {2} " +
                                                "\n select TimeRecords.*, userr.FirstName+' '+userr.LastName as [Name] " +
                                                "\n from TimeRecords " +
                                                "\n left join tbl_Employees userr on TimeRecords.CardNo = userr.UserId" +
                                                "\n where (cast(TimeRecords.DatetimeIO as date)>=CAST(@_from as date) or @_from is null) " +
                                                "\n and ((cast(TimeRecords.DatetimeIO as date)<=CAST(@_to as date)) or @_to is null) " +
                                                "\n and (TimeRecords.CardNo = @_user or @_user is null)" +
                                                "\n and (TimeRecords.IsDeleted = 0)" +
                                                "\n order by TimeRecords.DatetimeIO ",
                                                (timeRecord_item.DateEn != null ? "N'" + timeRecord_item.DateEn.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                                (timeRecord_item.DateEn != null ? "N'" + timeRecord_item.DateEn.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                                (timeRecord_item.UserId > 0 ? "N'" + timeRecord_item.UserId + "'" : "NULL"));
                    var _timeRecord = (await _repoTimeRecord.RunQuery<TimeRecordVm>(_query_timerecord)).ToList();

                    if (_timeRecord != null && _timeRecord.Count() > 0)
                    {

                        int _index = 0;
                        foreach (var item in _timeRecord)
                        {

                            if (_index == 0)
                                timeRecord_item.EnterDate = item.DatetimeIOMain;
                            else if (_index == 1)
                                timeRecord_item.LeaveDate = item.DatetimeIOMain;


                            else if (_index == 2)
                                timeRecord_item.EnterDate2 = item.DatetimeIOMain;
                            else if (_index == 3)
                                timeRecord_item.LeaveDate2 = item.DatetimeIOMain;


                            else if (_index == 4)
                                timeRecord_item.EnterDate3 = item.DatetimeIOMain;
                            else if (_index == 5)
                                timeRecord_item.LeaveDate3 = item.DatetimeIOMain;



                            else if (_index == 6)
                                timeRecord_item.EnterDate4 = item.DatetimeIOMain;
                            else if (_index == 7)
                                timeRecord_item.LeaveDate4 = item.DatetimeIOMain;



                            else if (_index == 8)
                                timeRecord_item.EnterDate5 = item.DatetimeIOMain;
                            else if (_index == 9)
                                timeRecord_item.LeaveDate5 = item.DatetimeIOMain;



                            else if (_index == 10)
                                timeRecord_item.EnterDate6 = item.DatetimeIOMain;
                            else if (_index == 11)
                                timeRecord_item.LeaveDate6 = item.DatetimeIOMain;



                            else if (_index == 12)
                                timeRecord_item.EnterDate7 = item.DatetimeIOMain;
                            else if (_index == 13)
                                timeRecord_item.LeaveDate7 = item.DatetimeIOMain;



                            else if (_index == 14)
                                timeRecord_item.EnterDate8 = item.DatetimeIOMain;
                            else if (_index == 15)
                                timeRecord_item.LeaveDate8 = item.DatetimeIOMain;



                            else if (_index == 16)
                                timeRecord_item.EnterDate9 = item.DatetimeIOMain;
                            else if (_index == 17)
                                timeRecord_item.LeaveDate9 = item.DatetimeIOMain;



                            else if (_index == 18)
                                timeRecord_item.EnterDate10 = item.DatetimeIOMain;
                            else if (_index == 19)
                                timeRecord_item.LeaveDate10 = item.DatetimeIOMain;



                            else if (_index == 20)
                                timeRecord_item.EnterDate11 = item.DatetimeIOMain;
                            else if (_index == 21)
                                timeRecord_item.LeaveDate11 = item.DatetimeIOMain;



                            else if (_index == 22)
                                timeRecord_item.EnterDate12 = item.DatetimeIOMain;
                            else if (_index == 23)
                                timeRecord_item.LeaveDate12 = item.DatetimeIOMain;



                            else if (_index == 24)
                                timeRecord_item.EnterDate13 = item.DatetimeIOMain;
                            else if (_index == 25)
                                timeRecord_item.LeaveDate13 = item.DatetimeIOMain;



                            else if (_index == 26)
                                timeRecord_item.EnterDate14 = item.DatetimeIOMain;
                            else if (_index == 27)
                                timeRecord_item.LeaveDate14 = item.DatetimeIOMain;



                            else if (_index == 28)
                                timeRecord_item.EnterDate15 = item.DatetimeIOMain;
                            else if (_index == 29)
                                timeRecord_item.LeaveDate15 = item.DatetimeIOMain;



                            else if (_index == 30)
                                timeRecord_item.EnterDate16 = item.DatetimeIOMain;
                            else if (_index == 31)
                                timeRecord_item.LeaveDate16 = item.DatetimeIOMain;



                            else if (_index == 32)
                                timeRecord_item.EnterDate17 = item.DatetimeIOMain;
                            else if (_index == 33)
                                timeRecord_item.LeaveDate17 = item.DatetimeIOMain;



                            else if (_index == 34)
                                timeRecord_item.EnterDate18 = item.DatetimeIOMain;
                            else if (_index == 35)
                                timeRecord_item.LeaveDate18 = item.DatetimeIOMain;



                            else if (_index == 36)
                                timeRecord_item.EnterDate19 = item.DatetimeIOMain;
                            else if (_index == 37)
                                timeRecord_item.LeaveDate19 = item.DatetimeIOMain;



                            else if (_index == 38)
                                timeRecord_item.EnterDate20 = item.DatetimeIOMain;
                            else if (_index == 39)
                                timeRecord_item.LeaveDate20 = item.DatetimeIOMain;







                            _index++;
                            if (_index == 40) break;
                        }
                        timeRecord_item.IsPresent = true;
                        timeRecord_item.IsKarkard = true;
                    }
                    else
                    {
                        timeRecord_item.Descriptions = PublicResource.DailyAbsense;
                        timeRecord_item.IsPresent = false;
                        timeRecord_item.IsKarkard = false;
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه ساعت کاری در هر روز
        /// </summary>
        /// <param name="model"></param>
        private async System.Threading.Tasks.Task CalcTimeWorkPerDay(AttendanceVM model, List<TransactionRequestVm> transReq, ReportParameter filter)
        {
            try
            {
                foreach (var timeRecord_item in model.listAttenDanceVm)
                {
                    var _shift_work_query = string.Format(QueryString.ShiftWorkList, timeRecord_item.PersonID);
                    var _shift_work = (await _repoShiftWork.RunQuery<ShiftWorkVm>(_shift_work_query)).ToList().FirstOrDefault();

                    timeRecord_item.CalcEzafeBeforeVoroud = model.reportParameter.CalcEzafeBeforeVoroud;

                    if (_shift_work != null && !string.IsNullOrEmpty(_shift_work.Data) && _shift_work.DataList != null && _shift_work.DataList.Count > 0)
                    {
                        if (_shift_work.DataList != null && _shift_work.DataList.Count > 0)
                        {
                            var _shiftworkItem = _shift_work.DataList.Where(x => x.DayValue.Date == timeRecord_item.DateEn.Date).FirstOrDefault();
                            if (_shiftworkItem != null)
                            {
                                var _jobTime = (await _repoJobTime.Get(x => x.Id == _shiftworkItem.JobTime_Id)).FirstOrDefault();
                                if (_jobTime != null)
                                {
                                    if (_jobTime.ShiftShenavar == false)
                                    {
                                        _jobTime.TimeVorod = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, _jobTime.TimeVorod.Hour, _jobTime.TimeVorod.Minute, _jobTime.TimeVorod.Second);
                                        _jobTime.TimeKhoroj = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, _jobTime.TimeKhoroj.Hour, _jobTime.TimeKhoroj.Minute, _jobTime.TimeKhoroj.Second);


                                        if (_jobTime.TimeFVorod != null)
                                            _jobTime.TimeFVorod = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, _jobTime.TimeFVorod.Value.Hour, _jobTime.TimeFVorod.Value.Minute, _jobTime.TimeFVorod.Value.Second);
                                        if (_jobTime.TimeFKhoroj != null)
                                            _jobTime.TimeFKhoroj = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, _jobTime.TimeFKhoroj.Value.Hour, _jobTime.TimeFKhoroj.Value.Minute, _jobTime.TimeFKhoroj.Value.Second);

                                        timeRecord_item.TotalMinuteCurrentDay = (int)(_jobTime.TimeKhoroj - _jobTime.TimeVorod).TotalMinutes;
                                    }
                                    else
                                    {
                                        var _zeroTime = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, 0, 0, 0);
                                        var _EndTime = new DateTime(timeRecord_item.DateEn.Year, timeRecord_item.DateEn.Month, timeRecord_item.DateEn.Day, _jobTime.TimeShiftLength.Value.Hour, _jobTime.TimeShiftLength.Value.Minute, 0);
                                        timeRecord_item.TotalMinuteCurrentDay = (int)_EndTime.Subtract(_zeroTime).TotalMinutes;
                                    }
                                }

                                if (_jobTime != null && _jobTime.ShiftShenavar == false)
                                {
                                    if (filter.SetExitAttRecord)
                                    {
                                        //ثبت خروج برای روزهایی که خزوج آنها ثبت نشده است
                                        await RegisterLeaveTimeForNoneLeave(timeRecord_item, _jobTime);
                                    }
                                }

                                // روز فعلی ماموریت بوده یا خیر
                                IsMissionCurrentItem(timeRecord_item, transReq);
                                //محاسبه ماموریت ساعتی روز فعلی
                                CalcHourMissionCurrentItem(timeRecord_item, transReq);
                                // روز فعلی مرخصی بوده یا خیر
                                IsVacationCurrentItem(timeRecord_item, transReq);
                                //محاسبه مرخصی ساعتی روز فعلی
                                CalcHourVacationCurrentItem(timeRecord_item, transReq);

                                //---------------------------------------------------------------------------


                                timeRecord_item.CurrentJobTime = _jobTime;

                                //دریافت عنوان ساعت کاری
                                //timeRecord_item.JobTimeName = _jobTime != null ? _jobTime.JobTimeName : "";

                                //چک کردن روز تعطیل
                                CheckVacationDay(timeRecord_item, _shift_work);
                                if (_jobTime != null && _jobTime.ShiftTaRoozeBad == true)
                                {

                                }
                                else
                                {
                                    if (_jobTime != null && _jobTime.ShiftShenavar == true)
                                    {
                                        if (timeRecord_item.IsPresent)
                                        {
                                            //محاسبه تاخیر آیتم فعلی
                                            CalcTakhir_Shenavar(timeRecord_item, _jobTime);
                                            //محاسبه اضافه کاری
                                            timeRecord_item.EzafeKari = timeRecord_item._EzafeKari;


                                            //timeRecord_item.TotalTime = _totalTime;
                                            timeRecord_item.TotalTime = timeRecord_item._TotalTime;
                                            //محاسبه غیبت آیتم فعلی
                                            CalcGheybat(timeRecord_item, filter);
                                        }
                                    }
                                    else
                                    {
                                        if (timeRecord_item.IsPresent)
                                        {
                                            //محاسبه تاخیر آیتم فعلی
                                            CalcTakhir(timeRecord_item, _jobTime);

                                            //محاسبه تاخیر آیتم فعلی
                                            CalcTajil(timeRecord_item, _jobTime);

                                            //محاسبه اضافه کاری
                                            timeRecord_item.EzafeKari = timeRecord_item._EzafeKari;




                                            //timeRecord_item.TotalTime = _totalTime;
                                            timeRecord_item.TotalTime = timeRecord_item._TotalTime;


                                            //if (_jobTime != null && !_jobTime.ShiftShenavar)
                                            //{
                                            //    if (!timeRecord_item.IsHoliday && !timeRecord_item.IsVacation && !timeRecord_item.IsMamoriyat)
                                            //    {
                                            //        if ((timeRecord_item.TotalTime + timeRecord_item.Takhir + timeRecord_item.Tajil) < timeRecord_item.TotalMinuteCurrentDay)
                                            //        {
                                            //            var _res = timeRecord_item.TotalMinuteCurrentDay.Value - (timeRecord_item.TotalTime + timeRecord_item.Takhir + timeRecord_item.Tajil);
                                            //            timeRecord_item.EzafeKari = _res < timeRecord_item.EzafeKari ? _res - timeRecord_item.EzafeKari : 0;
                                            //            if (_res > timeRecord_item.EzafeKari)
                                            //            {
                                            //                timeRecord_item.Takhir = (_res - timeRecord_item.EzafeKari);
                                            //            }
                                            //        }
                                            //    }
                                            //}
                                            //محاسبه غیبت آیتم فعلی
                                            CalcGheybat(timeRecord_item, filter);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// ثبت خروج برای روزهایی که خزوج آنها ثبت نشده است
        /// </summary>
        /// <param name="attItem"></param>
        /// <param name="jobTime"></param>
        private async System.Threading.Tasks.Task RegisterLeaveTimeForNoneLeave(AttendanceList attItem, JobTime jobTime)
        {
            try
            {
                if (jobTime == null) return;
                if (attItem.EnterDate != null && (attItem.LeaveDate == null && attItem.LeaveDate2 == null && attItem.LeaveDate3 == null))
                {
                    attItem.LeaveDate = (jobTime != null && jobTime.TimeKhoroj != null ? (attItem.EnterDate.Value.Date + jobTime.TimeKhoroj.TimeOfDay) : (DateTime?)null);
                    attItem.AutoRegLeave = true;
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// تعیین تعطیلی آیتم جاری
        /// </summary>
        /// <param name="attItem"></param>
        /// <param name="shiftWorkVm"></param>
        private void CheckVacationDay(AttendanceList attItem, ShiftWorkVm shiftWorkVm)
        {
            try
            {
                var _vacation_days = shiftWorkVm.DataList.Where(x => x.IsVacation).ToList();
                if (_vacation_days.Any(x => x.DayValue.Date == attItem.DateEn.Date))
                {
                    attItem.IsHoliday = true;
                    attItem.Descriptions = "تعطیل";
                    attItem.IsPresent = true;
                }
            }
            catch (Exception ex)
            {

            }
        }


        /// <summary>
        /// محاسبه تمام ساعات کاری
        /// </summary>
        /// <param name="model"></param>
        private void CalcTotalWorkTime(AttendanceVM model)
        {
            try
            {
                if (model != null && model.listAttenDanceVm != null && model.listAttenDanceVm.Count > 0)
                {
                    var _totalminut = model.listAttenDanceVm.Sum(x => x.TotalTime);
                    model.personInfoVm.TotalTimeHourValue = _totalminut;

                    model.personInfoVm.TotalTakhir = model.listAttenDanceVm.Sum(x => x.Takhir);
                    model.personInfoVm.TotalTajil = model.listAttenDanceVm.Sum(x => x.Tajil);
                    model.personInfoVm.TotalEzafeKari = model.listAttenDanceVm.Sum(x => x.EzafeKari);
                    model.personInfoVm.TotalEzafeKari_T = model.listAttenDanceVm.Sum(x => x.EzafeKari_T);
                    model.personInfoVm.TotalGheybat = model.listAttenDanceVm.Sum(x => x.Gheybat);
                }
            }
            catch (Exception ex) { }
        }


        /// <summary>
        /// محاسبه تاخیر آیتم ورودی
        /// </summary>
        /// <param name="attItem"></param>
        /// <param name="shiftWorkVm"></param>
        private void CalcTakhir(AttendanceList timeRecord_item, JobTime jobTime)
        {
            try
            {
                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود 
                    return;



                if (jobTime == null) return;
                var _totalTakhir = 0;
                jobTime.TimeVorod = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day,
                    jobTime.TimeVorod.Hour, jobTime.TimeVorod.Minute, jobTime.TimeVorod.Second);

                if (jobTime.TimeFVorod != null)
                {
                    jobTime.TimeFVorod = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day,
                        jobTime.TimeFVorod.Value.Hour, jobTime.TimeFVorod.Value.Minute, jobTime.TimeFVorod.Value.Second);
                    if (timeRecord_item.EnterDate != null)
                    {
                        jobTime.TimeVorod = timeRecord_item.EnterDate.Value.Date + new TimeSpan(jobTime.TimeVorod.Hour, jobTime.TimeVorod.Minute, jobTime.TimeVorod.Second);
                        if (jobTime.TimeFVorod != null)
                            jobTime.TimeFVorod = timeRecord_item.EnterDate.Value.Date + new TimeSpan(jobTime.TimeFVorod.Value.Hour, jobTime.TimeFVorod.Value.Minute, jobTime.TimeFVorod.Value.Second);
                        else jobTime.TimeFVorod = jobTime.TimeVorod;

                        if (timeRecord_item.EnterDate.Value >= jobTime.TimeVorod && timeRecord_item.EnterDate.Value <= jobTime.TimeFVorod)
                            _totalTakhir = 0;
                        else
                            _totalTakhir = timeRecord_item.EnterDate != null ?
                                                (timeRecord_item.EnterDate.Value <= jobTime.TimeVorod ? 0 :
                                                    ((int)timeRecord_item.EnterDate.Value.Subtract(jobTime.TimeVorod).TotalMinutes)) : 0;
                    }
                }
                else
                {
                    jobTime.TimeVorod = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day,
                        jobTime.TimeVorod.Hour, jobTime.TimeVorod.Minute, jobTime.TimeVorod.Second);
                    _totalTakhir = timeRecord_item.EnterDate != null ?
                                        (timeRecord_item.EnterDate.Value <= jobTime.TimeVorod ? 0 :
                                            ((int)timeRecord_item.EnterDate.Value.Subtract(jobTime.TimeVorod).TotalMinutes)) : 0;
                }

                timeRecord_item.Takhir = _totalTakhir;
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه تعجیل آیتم ورودی
        /// </summary>
        /// <param name="timeRecord_item"></param>
        /// <param name="shiftWorkVm"></param>
        private void CalcTajil(AttendanceList timeRecord_item, JobTime jobTime)
        {
            try
            {
                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود 
                    return;

                if (jobTime == null) return;
                if (timeRecord_item.LeaveDate != null || timeRecord_item.LeaveDate2 != null || timeRecord_item.LeaveDate3 != null)
                {
                    var _res = new[] {
                        timeRecord_item.LeaveDate,
                        timeRecord_item.LeaveDate2,
                        timeRecord_item.LeaveDate3,

                        timeRecord_item.LeaveDate4,
                        timeRecord_item.LeaveDate5,
                        timeRecord_item.LeaveDate6,
                        timeRecord_item.LeaveDate7,
                        timeRecord_item.LeaveDate8,
                        timeRecord_item.LeaveDate9,
                        timeRecord_item.LeaveDate10,
                        timeRecord_item.LeaveDate11,
                        timeRecord_item.LeaveDate12,
                        timeRecord_item.LeaveDate13,
                        timeRecord_item.LeaveDate14,
                        timeRecord_item.LeaveDate15,
                        timeRecord_item.LeaveDate16,
                        timeRecord_item.LeaveDate17,
                        timeRecord_item.LeaveDate18,
                        timeRecord_item.LeaveDate19,
                        timeRecord_item.LeaveDate20,
                    }.Max();

                    if (_res != null)
                    {
                        jobTime.TimeKhoroj = _res.Value.Date + new TimeSpan(jobTime.TimeKhoroj.Hour, jobTime.TimeKhoroj.Minute, jobTime.TimeKhoroj.Second);

                        var _total = 0;
                        _total = _res != null ? (_res.Value >= jobTime.TimeKhoroj ? 0 : ((int)jobTime.TimeKhoroj.Subtract(_res.Value).TotalMinutes)) : 0;
                        timeRecord_item.Tajil = _total;
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه غیبت آیتم ورودی
        /// </summary>
        /// <param name="timeRecord_item"></param>
        private void CalcGheybat(AttendanceList timeRecord_item, ReportParameter filter)
        {
            try
            {
                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود 
                    return;

                //اگر روز فعلی مرخصی یا ماموریت باشد نباید غیبت بخورد
                if (timeRecord_item.VacationsDay || timeRecord_item.MissionDay) return;

                var _tot_valid = (timeRecord_item.VacationsHour + timeRecord_item.MissionHour) + filter.NaharTime;

                timeRecord_item.Gheybat = timeRecord_item.Tajil + timeRecord_item.Takhir;
                timeRecord_item.Gheybat = _tot_valid > timeRecord_item.Gheybat ? 0 : (timeRecord_item.Gheybat - (_tot_valid));
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه اضافه کاری
        /// </summary>
        private void ClacEzafeKari(AttendanceList timeRecord_item, JobTime jobTime)
        {
            try
            {
                var _total = 0;

                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                {
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود

                    var _res = new[] { timeRecord_item.LeaveDate, timeRecord_item.LeaveDate2, timeRecord_item.LeaveDate3 }.Max();

                    if (_res != null)
                    {
                        timeRecord_item.LeaveDate = _res.Value;

                        _total = _res != null ? _res <= timeRecord_item.EnterDate ? 0 : ((int)_res.Value.Subtract(timeRecord_item.EnterDate.Value).TotalMinutes) : 0;
                    }
                    timeRecord_item.EzafeKari = _total;
                    return;
                }



                if (jobTime == null) return;


                if (timeRecord_item.LeaveDate != null || timeRecord_item.LeaveDate2 != null || timeRecord_item.LeaveDate3 != null)
                {
                    var _res = new[] { timeRecord_item.LeaveDate, timeRecord_item.LeaveDate2, timeRecord_item.LeaveDate3 }.Max();

                    if (_res != null)
                    {
                        jobTime.TimeKhoroj = _res.Value.Date + new TimeSpan(jobTime.TimeKhoroj.Hour, jobTime.TimeKhoroj.Minute, jobTime.TimeKhoroj.Second);

                        _total = _res != null ? _res <= jobTime.TimeKhoroj ? 0 : ((int)_res.Value.Subtract(jobTime.TimeKhoroj).TotalMinutes) : 0;

                        if (timeRecord_item.EnterDate != null && timeRecord_item.EnterDate < jobTime.TimeVorod)
                        {
                            _total += ((int)jobTime.TimeVorod.Subtract(timeRecord_item.EnterDate.Value).TotalMinutes);
                        }
                    }
                }


                timeRecord_item.EzafeKari = _total;
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        ///  روز فعلی ماموریت بوده یا خیر
        /// </summary>
        /// <param name="timeRecord_item"></param>
        private bool IsMissionCurrentItem(AttendanceList timeRecord_item, List<TransactionRequestVm> transReq)
        {
            try
            {
                if (transReq != null && transReq.Count > 0)
                {
                    var _res = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay
                                     && (timeRecord_item.DateEn.Date >= x.FromDateRequest.Date
                                     && timeRecord_item.DateEn.Date <= x.ToDateRequest.Date)
                                     && transMamoriyatIds.Contains(x.Transaction_Id)).ToList();
                    if (_res != null && _res.Count > 0)
                    {
                        timeRecord_item.MissionDay = true;
                        timeRecord_item.Descriptions = _res.FirstOrDefault().Transaction_Name;
                        timeRecord_item.IsPresent = true;
                        timeRecord_item.IsMamoriyat = true;
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }


        /// <summary>
        /// محاسبه ماموریت ساعتی
        /// </summary>
        /// <param name="timeRecord_item"></param>
        /// <param name="transReq"></param>
        private void CalcHourMissionCurrentItem(AttendanceList timeRecord_item, List<TransactionRequestVm> transReq)
        {
            try
            {
                Guid[] missionIds = new Guid[3] { Guid.Parse("F1AC3ACA-C785-23EB-9A59-0EFA126E3C5E"), Guid.Parse("F1AC3ACA-C785-23EB-9A69-0EFA126E3C6E"), Guid.Parse("F1AC3ACA-C785-23EB-9A79-0EFA126E3C7E") };
                if (transReq != null && transReq.Count > 0)
                {
                    var _res = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqHour
                                     && (timeRecord_item.DateEn.Date >= x.FromDateRequest.Date
                                     && timeRecord_item.DateEn.Date <= x.ToDateRequest.Date)
                                     && missionIds.Contains(x.Transaction_Id)).ToList();
                    if (_res != null && _res.Count > 0)
                    {
                        timeRecord_item.MissionHour = (_res.FirstOrDefault().ToDateRequest > _res.FirstOrDefault().FromDateRequest ? ((int)_res.FirstOrDefault().ToDateRequest.Subtract(_res.FirstOrDefault().FromDateRequest).TotalMinutes) : 0);
                        timeRecord_item.Descriptions = _res.FirstOrDefault().Transaction_Name;
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        ///  روز فعلی مرخصی بوده یا خیر
        /// </summary>
        /// <param name="timeRecord_item"></param>
        private bool IsVacationCurrentItem(AttendanceList timeRecord_item, List<TransactionRequestVm> transReq)
        {
            try
            {
                if (transReq != null && transReq.Count > 0)
                {
                    var _res = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay
                                     && (timeRecord_item.DateEn.Date >= x.FromDateRequest.Date
                                     && timeRecord_item.DateEn.Date <= x.ToDateRequest.Date)
                                     && transMorkhasiIds.Contains(x.Transaction_Id)).ToList();
                    if (_res != null && _res.Count > 0)
                    {
                        timeRecord_item.VacationsDay = true;
                        timeRecord_item.Descriptions = _res.FirstOrDefault().Transaction_Name;
                        timeRecord_item.IsVacation = true;
                        //اگر مرخصی بدون حقوق باشد
                        if (_res.Where(x => x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-2A89-0EFA126E2C7E")).ToList().Count > 0)
                        {
                            timeRecord_item.IsVacation_WithoutCash = true;
                            timeRecord_item.IsPresent = false;
                        }
                        else
                        {
                            timeRecord_item.IsPresent = true;
                        }

                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }


        /// <summary>
        /// محاسبه مرخصی ساعتی
        /// </summary>
        /// <param name="timeRecord_item"></param>
        /// <param name="transReq"></param>
        private void CalcHourVacationCurrentItem(AttendanceList timeRecord_item, List<TransactionRequestVm> transReq)
        {
            try
            {
                Guid[] missionIds = new Guid[7] {
                    Guid.Parse("F1AC3ACA-C785-23EB-9A89-0EFA126E3C8E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-9A99-0EFA126E3C9E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-1A89-0EFA126E1C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-2A89-0EFA126E2C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-3A89-0EFA126E3C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-4A89-0EFA126E4C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-5A89-0EFA126E5C7E")
                };

                if (transReq != null && transReq.Count > 0)
                {
                    var _res = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqHour
                                     && (timeRecord_item.DateEn.Date >= x.FromDateRequest.Date
                                     && timeRecord_item.DateEn.Date <= x.ToDateRequest.Date)
                                     && missionIds.Contains(x.Transaction_Id)).ToList();
                    if (_res != null && _res.Count > 0)
                    {
                        timeRecord_item.VacationsHour = (_res.FirstOrDefault().ToDateRequest > _res.FirstOrDefault().FromDateRequest ? ((int)_res.FirstOrDefault().ToDateRequest.Subtract(_res.FirstOrDefault().FromDateRequest).TotalMinutes) : 0);
                        timeRecord_item.Descriptions = _res.FirstOrDefault().Transaction_Name;


                        //foreach (var item in _res)
                        //{
                        //    timeRecord_item.VacationsHour += (item.ToDateRequest > item.FromDateRequest ? ((int)item.ToDateRequest.Subtract(item.FromDateRequest).TotalMinutes) : 0);
                        //    timeRecord_item.Descriptions = _res.FirstOrDefault().Transaction_Name;
                        //}


                    }
                }

            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه مجموع مرخصی و ماموریت
        /// </summary>
        /// <param name="transReq"></param>
        /// <param name="model"></param>
        private void CalcTotalMissionAndVacation(List<TransactionRequestVm> transReq, AttendanceVM model)
        {
            try
            {
                //ماموریت
                model.personInfoVm.Mission_City = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-9A79-0EFA126E3C7E")).ToList());
                model.personInfoVm.Mission_BetweenCity = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-9A59-0EFA126E3C5E")).ToList());
                model.personInfoVm.Mission_Day = model.personInfoVm.Mission_City + model.personInfoVm.Mission_BetweenCity;

                var _mission_hour = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqHour && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-9A69-0EFA126E3C6E")).ToList();
                if (_mission_hour != null && _mission_hour.Count > 0)
                {
                    foreach (var item in _mission_hour)
                    {
                        model.personInfoVm.Mission_Hour += (item.ToDateRequest > item.FromDateRequest ? ((int)item.ToDateRequest.Subtract(item.FromDateRequest).TotalMinutes) : 0); ;
                    }
                }



                //مرخصی
                model.personInfoVm.Vacations_1 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-9A99-0EFA126E3C9E")).ToList());
                model.personInfoVm.Vacations_2 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-1A89-0EFA126E1C7E")).ToList());
                model.personInfoVm.Vacations_3 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-3A89-0EFA126E3C7E")).ToList());
                model.personInfoVm.Vacations_4 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-2A89-0EFA126E2C7E")).ToList());
                model.personInfoVm.Vacations_5 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-9A89-0EFA126E3C8E")).ToList());
                model.personInfoVm.Vacations_6 = GetDayCount(transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqDay && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-5A89-0EFA126E5C7E")).ToList());

                model.personInfoVm.Vacations_Day = model.personInfoVm.Vacations_1 +
                                                   model.personInfoVm.Vacations_2 +
                                                   model.personInfoVm.Vacations_3 +
                                                   model.personInfoVm.Vacations_4 +
                                                   model.personInfoVm.Vacations_5 +
                                                   model.personInfoVm.Vacations_6;
                var _vacation_hour = transReq.Where(x => x.ReqType == (int)TransactionReqType.ReqHour && x.Transaction_Id == Guid.Parse("F1AC3ACA-C785-23EB-4A89-0EFA126E4C7E")).ToList();
                if (_vacation_hour != null && _vacation_hour.Count > 0)
                {
                    foreach (var item in _vacation_hour)
                    {
                        model.personInfoVm.Vacations_Hour += (item.ToDateRequest > item.FromDateRequest ? ((int)item.ToDateRequest.Subtract(item.FromDateRequest).TotalMinutes) : 0);
                    }
                }


            }
            catch (Exception ex)
            {
            }
        }


        private int GetDayCount(List<TransactionRequestVm> transReq)
        {
            try
            {
                if (transReq != null && transReq.Count > 0)
                {
                    var _count = 0;
                    foreach (var item in transReq)
                    {
                        if (item.FromDateRequest.Date >= item.ToDateRequest.Date) _count++;
                        else
                        {
                            _count += (Math.Abs((int)(item.ToDateRequest.Date - item.FromDateRequest.Date).TotalDays) + 1);
                        }
                    }
                    return _count;
                }
                return 0;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }


        /// <summary>
        /// اعمال پارامتر های گزارش
        /// </summary>
        private void CalcReportParams(AttendanceVM model, ReportParameter reportParam)
        {
            try
            {
                if (model != null && model.listAttenDanceVm != null && model.listAttenDanceVm.Count > 0)
                {
                    foreach (var item in model.listAttenDanceVm)
                    {
                        if (item.IsPresent)
                        {
                            /// ساعت مرخصی ساعتی در روز، غیبت لحاظ شود
                            if (reportParam.chbHour1 && reportParam.Hour1 > 0)
                            {
                                var _min = reportParam.Hour1 * 60;
                                if (_min < item.VacationsHour)
                                {
                                    item.IsPresent = false;
                                    item.Descriptions = PublicResource.DailyAbsense;
                                }
                            }


                            ///ساعت غیبت ساعتی در روز، به غیبت روزانه تبدیل شود
                            if (reportParam.chbHour2 && reportParam.Hour2 > 0)
                            {
                                var _min = reportParam.Hour2 * 60;
                                if (_min < item.Gheybat)
                                {
                                    item.IsPresent = false;
                                    item.Descriptions = PublicResource.DailyAbsense;
                                }
                            }



                            //ساعت از غیبت فرد بخشیده شود
                            if (reportParam.chbHour3 && reportParam.Hour3 > 0)
                            {
                                var _min = reportParam.Hour3 * 60;
                                item.Gheybat = _min > item.Gheybat ? 0 : item.Gheybat - _min;
                            }


                            //ساعت، از تاخیر و تعجیل فرد بخشیده شود
                            if (reportParam.chbHour4 && reportParam.Hour4 > 0)
                            {
                                var _min = reportParam.Hour4 * 60;
                                item.Tajil = _min > item.Tajil ? 0 : item.Tajil - _min;
                                item.Takhir = _min > item.Takhir ? 0 : item.Takhir - _min;

                                item.Gheybat = item.Tajil + item.Takhir;
                            }


                            //ساعت، از کارکرد فرد کسر شود
                            if (reportParam.chbHour5 && reportParam.Hour5 > 0)
                            {
                                var _min = reportParam.Hour5 * 60;
                                item.TotalTime = _min > item.TotalTime ? 0 : item.TotalTime - _min;
                            }

                        }
                    }

                }
            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه تاخیر آیتم ورودی شناور
        /// </summary>
        /// <param name="attItem"></param>
        /// <param name="shiftWorkVm"></param>
        private void CalcTakhir_Shenavar(AttendanceList timeRecord_item, JobTime jobTime)
        {
            try
            {
                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود 
                    return;


                if (jobTime == null) return;
                if (jobTime.TimeShiftLength == null) return;
                var _totalTakhir = 0;
                var _zeroTime = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, 0, 0, 0);
                jobTime.TimeShiftLength = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, jobTime.TimeShiftLength.Value.Hour, jobTime.TimeShiftLength.Value.Minute, jobTime.TimeShiftLength.Value.Second);
                var _totalminutework = (int)jobTime.TimeShiftLength.Value.Subtract(_zeroTime).TotalMinutes;

                //_totalTakhir = (timeRecord_item._TotalTime + timeRecord_item.VacationsHour + timeRecord_item.MissionHour) >= _totalminutework ? 0 : _totalminutework - (timeRecord_item._TotalTime+timeRecord_item.VacationsHour + timeRecord_item.MissionHour);
                _totalTakhir = (timeRecord_item._TotalTime) >= _totalminutework ? 0 : _totalminutework - (timeRecord_item._TotalTime);

                timeRecord_item.Takhir = _totalTakhir;


            }
            catch (Exception ex)
            {
            }
        }


        /// <summary>
        /// محاسبه اضافه کاری شناور
        /// </summary>
        private void ClacEzafeKari_Shenavar(AttendanceList timeRecord_item, JobTime jobTime)
        {
            try
            {
                var _total = 0;

                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                {
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود

                    var _res = new[] { timeRecord_item.LeaveDate, timeRecord_item.LeaveDate2, timeRecord_item.LeaveDate3 }.Max();

                    if (_res != null)
                    {
                        timeRecord_item.LeaveDate = _res.Value;

                        _total = _res != null ? _res <= timeRecord_item.EnterDate ? 0 : ((int)_res.Value.Subtract(timeRecord_item.EnterDate.Value).TotalMinutes) : 0;
                    }
                    timeRecord_item.EzafeKari = _total;
                    return;
                }



                if (jobTime == null || jobTime.TimeShiftLength == null) return;


                if (timeRecord_item.LeaveDate != null || timeRecord_item.LeaveDate2 != null || timeRecord_item.LeaveDate3 != null)
                {
                    var _res = new[] { timeRecord_item.LeaveDate, timeRecord_item.LeaveDate2, timeRecord_item.LeaveDate3 }.Max();

                    if (_res != null)
                    {
                        jobTime.TimeShiftLength = _res.Value.Date + new TimeSpan(jobTime.TimeShiftLength.Value.Hour, jobTime.TimeShiftLength.Value.Minute, jobTime.TimeShiftLength.Value.Second);

                        var _zeroTime = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, 0, 0, 0);
                        jobTime.TimeShiftLength = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, jobTime.TimeShiftLength.Value.Hour, jobTime.TimeShiftLength.Value.Minute, jobTime.TimeShiftLength.Value.Second);
                        var _totalminutework = (int)jobTime.TimeShiftLength.Value.Subtract(_zeroTime).TotalMinutes;

                        var _res1 = timeRecord_item.LeaveDate != null && timeRecord_item.EnterDate != null ? ((int)timeRecord_item.LeaveDate.Value.Subtract(timeRecord_item.EnterDate.Value).TotalMinutes) : 0;
                        var _res2 = timeRecord_item.LeaveDate2 != null && timeRecord_item.EnterDate2 != null ? ((int)timeRecord_item.LeaveDate2.Value.Subtract(timeRecord_item.EnterDate2.Value).TotalMinutes) : 0;
                        var _res3 = timeRecord_item.LeaveDate3 != null && timeRecord_item.EnterDate3 != null ? ((int)timeRecord_item.LeaveDate3.Value.Subtract(timeRecord_item.EnterDate3.Value).TotalMinutes) : 0;

                        var _restime = _res1 + _res2 + _res3;
                        _total = _restime < _totalminutework ? 0 : _restime - _totalminutework;
                    }
                }


                timeRecord_item.EzafeKari = _total;
            }
            catch (Exception ex)
            {
            }
        }


        public async Task<AttendanceVM> CalculatePatientAccount(UserVm filter)
        {
            try
            {
                var model = await TotalPerformancePersonal_Report(
                    new ReportParameter
                    {
                        PersonId = filter.Id,
                        FromDate = filter.personAccountingFilter.FromDate,
                        ToDate = filter.personAccountingFilter.ToDate,
                        CalcEzafeBeforeVoroud = filter.personAccountingFilter.CalcEzafeBeforeVoroud,
                        SetExitAttRecord = filter.personAccountingFilter.SetExitAttRecord,
                        NaharTime = filter.personAccountingFilter.NaharTime
                    });

                var _personHoghogh = (await _repoPersonHoghogh.Get(x => x.PersonID == filter.Id)).ToList().FirstOrDefault();
                model.personHoghogh = _personHoghogh != null ? GenericMapping<PersonHoghogh, PersonHoghoghVm>.Map(_personHoghogh) : new PersonHoghoghVm();

                var _presentDays = model.listAttenDanceVm.Where(x => x.IsPresent == true && x.IsHoliday == false && !x.VacationsDay && !x.MissionDay).ToList().Count;

                int? _dayCountKasKar = 0;
                if (model != null && model.listAttenDanceVm != null && model.listAttenDanceVm.Count > 0)
                {
                    _dayCountKasKar = model.listAttenDanceVm.Where(x => x.IsHoliday == false && x.IsPresent == false).ToList().Sum(x => x.TotalMinuteCurrentDay);
                    _dayCountKasKar += model.listAttenDanceVm.Sum(x => x.Gheybat);
                }
                var _accounting = new PersonAccounting(model.personHoghogh,
                    _presentDays,
                    filter.personAccountingFilter.Nahar,
                    filter.personAccountingFilter.Sobhane,
                    filter.personAccountingFilter.AyabZahab,
                    filter.personAccountingFilter.SayerKosorat,
                    filter.personAccountingFilter.HazinehSanavat,
                    filter.personAccountingFilter.HazinehEydi,
                    filter.personAccountingFilter.SayerMazaya,
                    model.listAttenDanceVm.Sum(x => x.EzafeKari),
                    _dayCountKasKar != null ? _dayCountKasKar.Value : 0,
                    filter.personAccountingFilter.CalcKasrKar,
                    filter.personAccountingFilter.SahmKarkard);

                model.personAccounting = _accounting;
                return model;
            }
            catch (Exception ex) { throw ex; }
        }


        public async Task<EmployeeAccountingVm> GetPersonAccount(EmployeeAccountingVm filter)
        {
            try
            {
                if (filter.Id == null || filter.Id == Guid.Empty)
                {
                    return new EmployeeAccountingVm();
                }
                else
                {
                    var model = (await _repoEmployeeAccounting.Get(x => x.Id == filter.Id)).FirstOrDefault();
                    var _modelVm = GenericMapping<EmployeeAccounting, EmployeeAccountingVm>.Map(model);

                    return _modelVm;
                }
            }
            catch (Exception ex) { throw ex; }
        }


        public async Task<DataModelResult> SavePersonelAccount(UserVm filter)
        {
            try
            {
                var _year = Convert.ToInt32(DateTimeOperation.M2SYear(filter.personAccountingFilter.FromDate.Value) ?? DateTimeOperation.M2SYear(DateTime.Now));

                if (!(await _repoEmployeeAccounting.CustomAny(x => x.PuUser_Id == filter.Id && x.IsDeleted == false && x.PersonelSalariMonth == filter.personAccountingFilter.PersonelSalariMonth && x.PersonelSalariYear == _year)))
                {
                    filter.personAccountingFilter.EmployeesId = filter.Id;
                    var _personelAccounting = await CalculatePatientAccount(filter);

                    var _model = new EmployeeAccounting
                    {
                        FromDate = filter.personAccountingFilter.FromDate.Value,
                        ToDate = filter.personAccountingFilter.ToDate.Value,
                        Id = Guid.NewGuid(),
                        IsDeleted = false,
                        ModifiedDate = DateTime.Now,
                        PuUser_Id = filter.Id,
                        DoingUserId = Public.CurrentUser.Id,
                        PersonelSalariMonth = filter.personAccountingFilter.PersonelSalariMonth,
                        PersonelSalariYear = _year,
                        DataJson = JsonConvert.SerializeObject(_personelAccounting),
                        FilterJson = JsonConvert.SerializeObject(filter.personAccountingFilter)
                    };

                    await _repoEmployeeAccounting.Add(_model);
                    return new DataModelResult();
                }
                else return new DataModelResult { Error = true, Message = "حقوق این ماه قبلا ثبت شده. امکان ثبت وجود ندارد" };

            }
            catch (Exception ex) { throw ex; }
        }


        public async Task<viewModel<EmployeeAccountingVm>> GetAllPersonAccount(UserVm value)
        {
            try
            {
                var _result = new viewModel<EmployeeAccountingVm>();
                _result.TLists = new List<EmployeeAccountingVm>();
                var _query = string.Format(@"EXEC GetAllPersonelAccount "
                                            + "\n @PersonId  = {0}, "
                                            + "\n @Search  = {1}, "
                                            + "\n @From  = {2},"
                                            + "\n @To  = {3}",
                                            value.Id != Guid.Empty ? "N'" + value.Id + "'" : "NULL",
                                            !string.IsNullOrEmpty(value.Search) ? "N'" + value.Search + "'" : "NULL",
                                            value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize),
                                            value.PageNum * value.PageSize
                                            );
                _result.TLists = (await _repoEmployeeAccounting.RunQuery<EmployeeAccountingVm>(_query)).ToList();
                _result.CountAll_TLists = await _repoEmployeeAccounting.TCount(x => x.IsDeleted == false && x.PuUser_Id == value.Id);
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<DataModelResult> DeletePersonelAccount(EmployeeAccountingVm filter)
        {
            try
            {
                var _personAccount = await GetPersonAccount(new EmployeeAccountingVm { Id = filter.Id });
                if (_personAccount == null) return new DataModelResult { Error = true, Message = "مورد یافت نشد" };
                if (_personAccount.Uploaded == true) return new DataModelResult { Error = true, Message = "مورد بارگزاری شده، امکان حذف وجود ندارد" };

                var _qyery = string.Format(@"update EmployeeAccounting set IsDeleted = 1, ModifiedDate = GETDATE(), DoingUserId = '{0}' where Id = '{1}'", Public.CurrentUser.Id, filter.Id);
                await _repoEmployeeAccounting.ExecuteSqlCommand(_qyery);

                return new DataModelResult();
            }
            catch (Exception ex) { throw ex; }
        }


        public async Task<DataModelResult> SavePersonelAccount_Cost(ViewModel.BasicInfo.CostVm model)
        {
            try
            {

                var _personAccount = await GetPersonAccount(new EmployeeAccountingVm { Id = model.EmployeeAccountId ?? Guid.Empty });
                if (_personAccount == null) return new DataModelResult { Error = true, Message = "مورد یافت نشد" };
                if (_personAccount.Uploaded == true) return new DataModelResult { Error = true, Message = "مورد قبلا بارگزاری شده" };


                var _employee = await _repoPubUser.Find(model.PersonID);



                var _model = new Tbl_Cost
                {
                    Type = CostType.Cost,
                    costPersonID = _personAccount.PuUser_Id.ToString(),
                    CostCode = _employee.UserType == "0120202" ? "015010101" : "015010102",
                    Price = _personAccount.DataJson_Value.personAccounting.KhalesPardakhti,
                    Coment = "حقوق ماه " + _personAccount.PersonelSalariMonthStr,
                    date = DateTimeOperation.M2S(DateTime.Now),
                    DateEn = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    Id = Guid.NewGuid(),
                    UserID = Public.CurrentUser.Id,
                    IsEmployeeAccount = true,
                    EmployeeAccountId = _personAccount.Id
                };

                await _repoCost.Add(_model);

                var _query = string.Format(@" update EmployeeAccounting set Uploaded = 1, UploadType = 'cost' where Id = '{0}' ", model.EmployeeAccountId);
                await _repoEmployeeAccounting.ExecuteSqlCommand(_query);

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<ViewModel.BasicInfo.ResultModel<Cost_Incoming>> SavePersonelAccount_CostIncoming(ViewModel.BasicInfo.CostVm model)
        {
            try
            {

                var _personAccount = await GetPersonAccount(new EmployeeAccountingVm { Id = model.EmployeeAccountId ?? Guid.Empty });
                if (_personAccount == null) return new ViewModel.BasicInfo.ResultModel<Cost_Incoming> { error = true, message = "مورد یافت نشد" };
                if (_personAccount.Uploaded == true) return new ViewModel.BasicInfo.ResultModel<Cost_Incoming> { error = true, message = "مورد قبلا بارگزاری شده" };


                var _employee = await _repoPubUser.Find(model.PersonID);

                var _model = new Cost_Incoming
                {
                    costPersonID = _personAccount.PuUser_Id.ToString(),
                    costInCode = _employee.UserType == "0120202" ? "015010101" : "015010102",
                    Price = _personAccount.DataJson_Value.personAccounting.KhalesPardakhti,
                    Coment = "حقوق ماه " + _personAccount.PersonelSalariMonthStr,
                    date = DateTimeOperation.M2S(DateTime.Now),
                    DateEn = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    Id = Guid.NewGuid(),
                    costUserID = Public.CurrentUser.Id,
                    IsEmployeeAccount = true,
                    EmployeeAccountId = _personAccount.Id
                };

                await _repoCostIncoming.Add(_model);

                var _query = string.Format(@" update EmployeeAccounting set Uploaded = 1, UploadType = 'cost_incoming' where Id = '{0}' ", model.EmployeeAccountId);
                await _repoEmployeeAccounting.ExecuteSqlCommand(_query);

                return new ViewModel.BasicInfo.ResultModel<Cost_Incoming> { model = _model };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion


        #region گزارش مرخصی
        public async Task<ReportVm<TransactionRequestVm>> TransactionReqReport(ReportParameter reportParameter)
        {
            try
            {
                var _model = new ReportVm<TransactionRequestVm>();
                _model.reportModel = new TransactionRequestVm();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.reportList = new List<TransactionRequestVm>();

                _model.reportList = await GetAllTransactionRequest(new TransactionRequestVm
                {
                    FromDateRequest = reportParameter.FromDate.Value,
                    ToDateRequest = reportParameter.ToDate.Value,
                    PersonID = reportParameter.PersonId,
                    UserId = reportParameter.UserId,
                    PageNum = 1,
                    PageSize = 10000
                });

                if (reportParameter.SystemReportType == SystemReportType.TransactionReq_Mamoriyat)
                {
                    _model.reportList = _model.reportList.Where(x => transMamoriyatIds.Contains(x.Transaction_Id)).ToList();
                }
                else
                {
                    _model.reportList = _model.reportList.Where(x => transMorkhasiIds.Contains(x.Transaction_Id)).ToList();
                }

                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.TransactionReqReport => " + ex.Message);
            }
        }

        #endregion


        #region EventLog Report
        /// <summary>
        /// گزارش رویدادنگاری تردد
        /// </summary>
        /// <param name="parameter"></param>
        /// <returns></returns>
        public async Task<ReportVm<TimeRecordVm>> TimeRecord_EventLogReport(ReportParameter parameter)
        {
            try
            {
                var _model = new ReportVm<TimeRecordVm>();
                _model.reportModel = new TimeRecordVm();
                _model.informationGlobalReport = new InformationGlobalReport();
                _model.reportList = new List<TimeRecordVm>();
                var sql = string.Format("EXEC [dbo].[SP_TimeRecord_EventLog] '{0}' ,'{1}',{2}", parameter.FromDate.Value.ToString("yyyy-MM-dd"), parameter.ToDate.Value.ToString("yyyy-MM-dd"),
                    !string.IsNullOrEmpty(parameter.StatusStr) ? "'" + parameter.StatusStr + "'" : "NULL");

                _model.reportList = (await _repoTimeRecord.RunQuery<TimeRecordVm>(sql)).ToList();
                return _model;
            }
            catch (Exception ex)
            {
                throw new Exception("location: ReportService.TimeRecord_EventLogReport => " + ex.Message);
            }
        }
        #endregion


        #region Att Log
        public async Task<List<NormalJsonClass>> GetPersonelList()
        {
            var _model = (await _repoPubUser.Get(m => m.IsDeleted == false && m.EmployeeActive == true)
                ).Select(z => new NormalJsonClass
                {
                    Text = z.Name + " " + z.Family,
                    Value = z.UserId.ToString(),
                }).ToList();
            return _model;
        }
        public async Task<DataModelResult> SaveAttLog(TimeRecordVm entity)
        {
            try
            {
                if (string.IsNullOrEmpty(entity.CardNo)) return new DataModelResult { Error = true, Message = "" };

                entity.ChangebyPerson = true;
                TimeSpan time;
                if (!string.IsNullOrEmpty(entity.Time_Value) && TimeSpan.TryParse(entity.Time_Value, out time))
                    entity.DatetimeIO = new DateTime(entity.DatetimeIO.Value.Year, entity.DatetimeIO.Value.Month, entity.DatetimeIO.Value.Day, time.Hours, time.Minutes, 0);

                if (entity.RecordID == 0)
                {
                    #region Insert by Query
                    var _query = string.Format(@"INSERT INTO [dbo].[TimeRecords] "
                                                        + "\n        ([CardNo] "
                                                        + "\n        ,[DeviceCode] "
                                                        + "\n        ,[Year] "
                                                        + "\n        ,[Month] "
                                                        + "\n        ,[Day] "
                                                        + "\n        ,[Hour] "
                                                        + "\n        ,[Minute] "
                                                        + "\n        ,[DatetimeIO] "
                                                        + "\n        ,[AttStatus] "
                                                        + "\n        ,[IsDeleted] "
                                                        + "\n        ,[VerifyMethod] "
                                                        + "\n        ,[ChangebyPerson] "
                                                        + "\n        ,[WorkCode] "
                                                        + "\n        ,[DoingUserId] "
                                                        + "\n        ,[ModifiedDate]) "
                                                        + "\n  VALUES "
                                                        + "\n        ({0} "
                                                        + "\n        ,{1} "
                                                        + "\n        ,{2} "
                                                        + "\n        ,{3} "
                                                        + "\n        ,{4} "
                                                        + "\n        ,{5} "
                                                        + "\n        ,{6} "
                                                        + "\n        ,{7} "
                                                        + "\n        ,{8} "
                                                        + "\n        ,{9} "
                                                        + "\n        ,{10} "
                                                        + "\n        ,{11} "
                                                        + "\n        ,{12} "
                                                        + "\n        ,{13} "
                                                        + "\n        ,GETDATE()) ",
                                                       !string.IsNullOrEmpty(entity.CardNo) ? "'" + entity.CardNo + "'" : "NULL",
                                                       entity.DeviceCode != null ? "'" + entity.DeviceCode + "'" : "NULL",
                                                       "'" + entity.DatetimeIO.Value.Year + "'",
                                                       "'" + entity.DatetimeIO.Value.Month + "'",
                                                       "'" + entity.DatetimeIO.Value.Day + "'",
                                                       "'" + entity.DatetimeIO.Value.Hour + "'",
                                                       "'" + entity.DatetimeIO.Value.Minute + "'",
                                                       entity.DatetimeIO != null ? "'" + entity.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL",
                                                       "'" + entity.AttStatus + "'",
                                                       "'" + (entity.IsDeleted == true ? "1" : "0") + "'",
                                                       entity.VerifyMethod != null ? "'" + entity.VerifyMethod + "'" : "NULL",
                                                       "'" + (entity.ChangebyPerson ? "1" : "0") + "'",
                                                       "'" + entity.WorkCode + "'",
                                                       "N'" + Public.CurrentUser.Id + "'"
                                                       );
                    await _repoTimeRecord.ExecuteSqlCommand(_query);
                    #endregion

                    //await _repoTimeRecord.TimeRecord_EventLog(GenericMapping<TimeRecordVm, TimeRecord>.Map(entity), 'I', CurrentUser.CurrentUserS.UserName, CurrentUser.CurrentUserS.Id);
                    return new DataModelResult { Error = false };
                }
                else
                {
                    var _record = (await _repoTimeRecord.Get(x => x.RecordID == entity.RecordID)).ToList().FirstOrDefault();
                    //var _Oldrecord = (await _repoTimeRecord.Get(x => x.RecordID == entity.RecordID)).ToList().FirstOrDefault();
                    if (_record != null)
                    {
                        _record.CardNo = entity.CardNo;
                        _record.ChangebyPerson = entity.ChangebyPerson;
                        _record.DatetimeIO = entity.DatetimeIO;
                        _record.Day = entity.DatetimeIO.Value.Day;
                        _record.DeviceCode = entity.DeviceCode;
                        _record.Hour = entity.DatetimeIO.Value.Hour;
                        _record.Minute = entity.DatetimeIO.Value.Minute;
                        _record.Month = entity.DatetimeIO.Value.Month;
                        _record.Year = entity.DatetimeIO.Value.Year;
                        _record.DoingUserId = Public.CurrentUser.Id;


                        await _repoTimeRecord.Detached(_record);
                        //await _repoTimeRecord.Detached(_Oldrecord);
                        //await _repoTimeRecord.Update(_record, _Oldrecord, Public.CurrentUser.UserName, Public.CurrentUser.Id);
                        await _repoTimeRecord.Update(_record);
                    }
                    else
                    {
                        await _repoTimeRecord.Add(GenericMapping<TimeRecordVm, TimeRecords>.Map(entity), Public.CurrentUser.UserName);
                        return new DataModelResult { Error = false };
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return new DataModelResult();
        }
        public async Task<TimeRecordVm> GetAttLog(TimeRecordVm entity)
        {
            try
            {
                var _result = new TimeRecordVm();
                _result.PersonelLists = await GetPersonelList();
                if (entity.RecordID == 0)
                {
                    return _result;
                }
                else
                {
                    var model = (await _repoTimeRecord.Get(x => x.RecordID == entity.RecordID)).FirstOrDefault();
                    //var _modelVm = GenericMapping<JobTime, JobTimeVm>.Map(model);

                    if (model != null)
                    {
                        var _modelVm = new TimeRecordVm
                        {
                            IsDeleted = model.IsDeleted,
                            ModifiedDate = model.ModifiedDate,
                            RecordID = model.RecordID,
                            AttStatus = model.AttStatus,
                            CardNo = model.CardNo,
                            ChangebyPerson = model.ChangebyPerson,
                            DatetimeIO = model.DatetimeIO,
                            Day = model.Day,
                            DeviceCode = model.DeviceCode,
                            Hour = model.Hour,
                            Minute = model.Minute,
                            Month = model.Month,
                            Year = model.Year,
                            WorkCode = model.WorkCode,
                            PersonelLists = await GetPersonelList()
                        };
                        _modelVm.Time_Value = _modelVm.DatetimeIO.Value.ToString("HH:mm");
                        return _modelVm;
                    }
                    return new TimeRecordVm();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<viewModel<TimeRecordVm>> GetAllAttLog(TimeRecordVm value)
        {
            try
            {
                var _result = new viewModel<TimeRecordVm>();
                _result.TLists = new List<TimeRecordVm>();


                var _query = "EXEC [dbo].[sp_AttLogList] " +
                    $"\n@From = {(value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize))}," +
                    $"\n@To = {value.PageNum * value.PageSize}," +
                    $"\n@text = {(string.IsNullOrEmpty(value.Search) ? "NULL" : "N'" + value.Search + "'")}," +
                    "\n@type = {0}," +
                    $"\n@fromDate = {(value.FromDate != null ? "N'" + value.FromDate.ToString("yyyy-MM-dd") + "'" : "NULL")}," +
                    $"\n@toDate = {(value.ToDate != null ? "N'" + value.ToDate.ToString("yyyy-MM-dd") + "'" : "NULL")}";

                var _procedure = string.Format(_query, "1");
                _result.TLists = (await _repoTimeRecord.RunQuery<TimeRecordVm>(_procedure)).ToList();

                _procedure = string.Format(_query, "2");
                _result.CountAll_TLists = await _repoTimeRecord.RunQuery_int(_procedure);
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> Delete_AttLog(TimeRecordVm entity)
        {
            try
            {
                if (entity != null && entity.RecordID != 0)
                {
                    var _query = string.Format(@" update TimeRecords set IsDeleted = '1', ModifiedDate = GETDATE(), DoingUserId = '{0}' where RecordID ='{1}' ", Public.CurrentUser.Id, entity.RecordID);
                    await _repoJobTime.ExecuteSqlCommand(_query);
                    //await _repoJobTime.Delete(await _repoJobTime.Find(entity.RecordID));
                }
                return new DataModelResult { Message = "" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }

        #endregion


        #region Time Record
        public async Task<AttLogEvent_Report> GetAttendanceLog(ReportParameter model)
        {
            try
            {

                var _result = new AttLogEvent_Report();
                _result.informationGlobalReport = new InformationGlobalReport();
                _result.timeRecordVms = new List<TimeRecordVm>();
                var _query_timerecord = string.Format(" declare @_from datetime = {0} " +
                                            "\n declare @_to datetime = {1} " +
                                            "\n declare @_user int = {2} " +
                                            "\n declare @_devicecode int = {3} " +
                                            "\n declare @_timeRecordId int = {4} " +
                                            "\n declare @_devicegroup int = {5} " +
                                            "\n declare @_usergroup int = {6} " +
                                            "\n select  TimeRecords.RecordID, " +
                                            "\n     TimeRecords.CardNo, TimeRecords.ChangebyPerson, TimeRecords.VerifyMethod, TimeRecords.DatetimeIOMain as DatetimeIO, TimeRecords.Day, TimeRecords.DeviceCode, " +
                                            "\n     TimeRecords.Hour, TimeRecords.Minute, TimeRecords.Month, TimeRecords.Year," +
                                            "\n     userr.FirstName+' '+userr.LastName as [Name], TimeRecords.AttStatus, " +
                                            "\n     (select top(1) Name from NewDevice where Code = TimeRecords.DeviceCode) as DeviceName, " +
                                            "\n     ISNULL(device.GroupId, 0) as DeviceGroupId " +
                                            "\n from TimeRecords " +
                                            "\n left join tbl_Employees userr on TimeRecords.CardNo = userr.UserId " +
                                            "\n left join NewDevice device on device.Code = TimeRecords.DeviceCode " +
                                            "\n where (cast(TimeRecords.DatetimeIOMain as date)>=CAST(@_from as date) or @_from is null) " +
                                            "\n     and ((cast(TimeRecords.DatetimeIOMain as date)<=CAST(@_to as date)) or @_to is null) " +
                                            "\n     and (DeviceCode = @_devicecode or @_devicecode is null) " +
                                            "\n     and (TimeRecords.CardNo = @_user or @_user is null)" +
                                            "\n     and (TimeRecords.RecordID = @_timeRecordId or @_timeRecordId is null)" +
                                            "\n     and (TimeRecords.IsDeleted = 0)" +
                                            "\n order by TimeRecords.DatetimeIOMain",
                                            (model.FromDate != null ? "N'" + model.FromDate.Value.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                            (model.ToDate != null ? "N'" + model.ToDate.Value.ToString("yyyy-MM-dd") + "'" : "NULL"),
                                            (model.UserId > 0 ? "N'" + model.UserId + "'" : "NULL"),
                                            (model.DeviceId > 0 ? "N'" + model.DeviceId + "'" : "NULL"),
                                            (model.TimeRecordId > 0 ? "N'" + model.TimeRecordId + "'" : "NULL"),
                                            (model.DeviceGroupId > 0 ? "N'" + model.DeviceGroupId + "'" : "NULL"),
                                            (model.UserGroupId > 0 ? "N'" + model.UserGroupId + "'" : "NULL")
                                            );
                _result.timeRecordVms = (await _repoTimeRecord.RunQuery<TimeRecordVm>(_query_timerecord)).ToList();

                return _result;
            }
            catch (Exception ex)
            {
                throw new Exception("location: PubUserService.GetAttendanceLog => " + ex.Message);
            }
        }
        public async Task<DataModelResult> AttLog_Save(TimeRecordVm entity)
        {
            try
            {
                if (string.IsNullOrEmpty(entity.CardNo)) return new DataModelResult { Error = true, Message = "" };
                if (entity.RecordID == 0)
                {
                    #region Insert by Query
                    var _query = string.Format(@"INSERT INTO [dbo].[TimeRecords] "
                                                        + "\n        ([CardNo] "
                                                        + "\n        ,[DeviceCode] "
                                                        + "\n        ,[Year] "
                                                        + "\n        ,[Month] "
                                                        + "\n        ,[Day] "
                                                        + "\n        ,[Hour] "
                                                        + "\n        ,[Minute] "
                                                        + "\n        ,[DatetimeIO] "
                                                        + "\n        ,[AttStatus] "
                                                        + "\n        ,[IsDelete] "
                                                        + "\n        ,[VerifyMethod] "
                                                        + "\n        ,[ChangebyPerson] "
                                                        + "\n        ,[WorkCode] "
                                                        + "\n        ,[DatetimeIOMain]) "
                                                        + "\n  VALUES "
                                                        + "\n        ({0} "
                                                        + "\n        ,{1} "
                                                        + "\n        ,{2} "
                                                        + "\n        ,{3} "
                                                        + "\n        ,{4} "
                                                        + "\n        ,{5} "
                                                        + "\n        ,{6} "
                                                        + "\n        ,{7} "
                                                        + "\n        ,{8} "
                                                        + "\n        ,{9} "
                                                        + "\n        ,{10} "
                                                        + "\n        ,{11} "
                                                        + "\n        ,{12} "
                                                        + "\n        ,{13}) ",
                                                       !string.IsNullOrEmpty(entity.CardNo) ? "N'" + entity.CardNo + "'" : "NULL",
                                                       entity.DeviceCode != null ? "N'" + entity.DeviceCode + "'" : "NULL",
                                                       entity.Year != null ? "N'" + entity.Year + "'" : "NULL",
                                                       entity.Month != null ? "N'" + entity.Month + "'" : "NULL",
                                                       entity.Day != null ? "N'" + entity.Day + "'" : "NULL",
                                                       entity.Hour != null ? "N'" + entity.Hour + "'" : "NULL",
                                                       entity.Minute != null ? "N'" + entity.Minute + "'" : "NULL",
                                                       entity.DatetimeIO != null ? "N'" + entity.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL",
                                                       "N'" + entity.AttStatus + "'",
                                                       "N'" + (entity.IsDeleted == true ? "1" : "0") + "'",
                                                       entity.VerifyMethod != null ? "N'" + entity.VerifyMethod + "'" : "NULL",
                                                       "N'" + (entity.ChangebyPerson ? "1" : "0") + "'",
                                                       "N'" + entity.WorkCode + "'",
                                                       entity.DatetimeIO != null ? "N'" + entity.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL"
                                                       );
                    await _repoTimeRecord.ExecuteSqlCommand(_query);
                    #endregion


                    return new DataModelResult { Error = false };
                }
                else
                {
                    var _record = await _repoTimeRecord.Find(entity.RecordID);
                    var _Oldrecord = await _repoTimeRecord.Find(entity.RecordID);
                    if (_record != null)
                    {
                        _record.CardNo = entity.CardNo;
                        _record.ChangebyPerson = true;
                        _record.DeviceCode = entity.DeviceCode;


                        _record.DatetimeIOMain = entity.DatetimeIOMain;

                        //ابن قسمت غیرفعال شد، اگر کاربر تردد را ویرایش کرد بعد از تخلیه دستگاه دوباره اطلاعات تغییر نکند
                        //_record.DatetimeIO = entity.DatetimeIO;
                        //_record.Year = entity.Year;
                        //_record.Day = entity.Day;
                        //_record.Month = entity.Month;
                        //_record.Hour = entity.Hour;
                        //_record.Minute = entity.Minute;

                        await _repoTimeRecord.Detached(_record);
                        await _repoTimeRecord.Detached(_Oldrecord);
                        await _repoTimeRecord.Update(_record, _Oldrecord);
                    }
                    else
                    {
                        await _repoTimeRecord.Add(GenericMapping<TimeRecordVm, TimeRecords>.Map(entity));
                        return new DataModelResult { Error = false };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("location: PubUserService.AttLog_Save => " + ex.Message);
            }
            return new DataModelResult();
        }
        public async Task<bool> Delete_AttLog(int? Id)
        {
            try
            {
                if (Id != 0 && Id != null)
                {
                    var _query = string.Format(@" update TimeRecords set IsDelete = '1' where RecordID ='{0}' ", Id);
                    await _repoTimeRecord.ExecuteSqlCommand(_query);
                    //_repoPubUser.Delete(x => x.ID == Id.Value);
                }
                return true;
            }
            catch (Exception ex)
            {
                //throw new Exception("location: PubUserService.Delete_AttLog => " + ex.Message);
            }
            return false;
        }
        #endregion


        public async Task<List<UsersPerformance>> TotalPerformancePersonal_AllUser_Excel(ReportParameter parameter)
        {
            try
            {
                var _users = (await _repoPubUser.Get(x => !x.IsDeleted && (x.Id == parameter.PersonId || parameter.PersonId == Guid.Empty))).ToList();
                if (_users != null && _users.Count() > 0)
                {
                    var _model = new List<AttendanceVM>();

                    var _result = new List<UsersPerformance>();
                    foreach (var item in _users)
                    {
                        var _modelItem = await TotalPerformancePersonal_Report(new ReportParameter
                        {
                            FromDate = parameter.FromDate,
                            ToDate = parameter.ToDate,
                            UserId = item.UserId ?? 0,
                            PersonId = parameter.PersonId,
                            CalcEzafeBeforeVoroud = parameter.CalcEzafeBeforeVoroud,
                        });
                        _model.Add(_modelItem);

                        _result.Add(new UsersPerformance
                        {
                            CARD_NO = item.UserId ?? 0,
                            PER_NAME = _modelItem.personInfoVm.FirstName + " " + _modelItem.personInfoVm.LastName,
                            HOZOUR_DAY = _modelItem.personInfoVm.CountHozorDay,
                            HOZOUR_T = _modelItem.personInfoVm.TotalTimeHourValue - _modelItem.personInfoVm.TotalEzafeKari,
                            GHEIBAT_T = _modelItem.personInfoVm.TotalGheybat,
                            MORKHASI_D = _modelItem.personInfoVm.Vacations_Day,
                            MORKHASI_T = _modelItem.personInfoVm.Vacations_Hour,
                            EZFTATIL_T = _modelItem.personInfoVm.TotalEzafeKari_T,
                            EZAFE_T = _modelItem.personInfoVm.TotalEzafeKari - _modelItem.personInfoVm.TotalEzafeKari_T,
                            MAMURIAT = _modelItem.personInfoVm.Mission_Day,

                            KASR_T = 0
                        });

                    }

                    return _result;
                }
                return new List<UsersPerformance>();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<DataModel> ImportAttLogFromUSB(ImportFromUSBVm model)
        {
            try
            {

                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == model.FingerPrintDevice).FirstOrDefault();
                if (model.FingerPrintDevice <= 0 || _deviceVm == null) { return new DataModel { error = true, message = "لطفا دستگاه را انتخاب نمایید" }; }

                if (_deviceVm.deviceVm.FPDeviceType == Utility.PublicEnum.Attendance.FPDeviceType.ZKTimeDevice)
                    return await btnSSRAttLogRead(model);
                else return await funcGetGeneralLogData(model);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<DataModel> btnSSRAttLogRead(ImportFromUSBVm model)
        {
            try
            {
                if (model.ExcelFile == null) return new DataModel { error = true, message = "لطفا فایل را انتخاب نمایید" };

                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == model.FingerPrintDevice).FirstOrDefault();
                if (model.FingerPrintDevice <= 0 || _deviceVm == null) { return new DataModel { error = true, message = "لطفا دستگاه را انتخاب نمایید" }; }

                UDisk udisk = new UDisk();

                byte[] byDataBuf = null;
                int iLength;//length of the bytes to get from the data

                string sPIN2 = "";
                string sVerified = "";
                string sTime_second = "";
                string sDeviceID = "";
                string sStatus = "";
                string sWorkcode = "";

                if (model.ExcelFile == null)
                    return new DataModel { error = true, message = "فایل یافت نشد" };


                var _filePath = await _fileService.GetPath(model.File_Id);
                if (string.IsNullOrEmpty(_filePath))
                    return new DataModel();
                CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));
                var _serverPath = new NopFileProvider(HostingEnvironment.MapPath("~")).Root;
                _filePath = CommonHelper.DefaultFileProvider.Combine(_serverPath, _filePath);

                using (FileStream stream = new FileStream(_filePath, FileMode.OpenOrCreate, FileAccess.Read))
                {
                    byDataBuf = System.IO.File.ReadAllBytes(_filePath);
                    iLength = Convert.ToInt32(stream.Length);



                    //using (Stream stream = model.ExcelFile.InputStream)
                    //{
                    //    MemoryStream memoryStream = stream as MemoryStream;
                    //    if (memoryStream == null)
                    //    {
                    //        memoryStream = new MemoryStream();
                    //        model.ExcelFile.InputStream.CopyTo(memoryStream);
                    //    }
                    //    byDataBuf = memoryStream.ToArray();
                    //    iLength = Convert.ToInt32(stream.Length);





                    AttLogRecordList = new List<TimeRecordVm>();
                    //dtAttLogList.ItemsSource = null;

                    int iStartIndex = 0;
                    int iOneLogLength;//the length of one line of attendence log
                    for (int i = iStartIndex; i < iLength; i++)
                    {
                        if (byDataBuf[i] == 13 && byDataBuf[i + 1] == 10)
                        {
                            iOneLogLength = (i + 1) + 1 - iStartIndex;
                            byte[] bySSRAttLog = new byte[iOneLogLength];
                            Array.Copy(byDataBuf, iStartIndex, bySSRAttLog, 0, iOneLogLength);

                            udisk.GetAttLogFromDat(bySSRAttLog, iOneLogLength, out sPIN2, out sTime_second, out sDeviceID, out sStatus, out sVerified, out sWorkcode);
                            try
                            {

                                var _datetime = sTime_second.StartsWith("14") ? DateTimeOperation.S2M(sTime_second.Substring(0, 10).Replace("-", "/")) : DateTime.Parse(sTime_second);

                                var _hh = Convert.ToInt32(sTime_second.Substring(11, 2));
                                var _mm = Convert.ToInt32(sTime_second.Substring(14, 2));
                                var _ss = Convert.ToInt32(sTime_second.Substring(17, 2));


                                var _timespan = new TimeSpan(_hh, _mm, _ss);
                                _datetime = _datetime.Date + _timespan;

                                var item = new TimeRecordVm();
                                item.CardNo = !string.IsNullOrEmpty(sPIN2) ? sPIN2.Trim() : "";
                                item.DatetimeIO = _datetime;
                                item.DeviceCode = Convert.ToInt32(sDeviceID);
                                item.AttStatus = Convert.ToInt32(sStatus);
                                item.VerifyMode = Convert.ToInt32(sVerified);
                                item.VerifyMethod = Convert.ToInt32(sVerified);
                                item.WorkCode = Convert.ToInt32(sWorkcode);
                                item.Day = item.DatetimeIO.Value.Day;
                                item.Hour = item.DatetimeIO.Value.Hour;
                                item.Minute = item.DatetimeIO.Value.Minute;
                                item.Month = item.DatetimeIO.Value.Month;
                                item.Year = item.DatetimeIO.Value.Year;
                                AttLogRecordList.Add(item);


                            }
                            catch (Exception ex)
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
                            }

                            bySSRAttLog = null;
                            iStartIndex += iOneLogLength;
                            iOneLogLength = 0;
                        }
                    }
                    stream.Close();
                }

                var _saveResult = _deviceVm.sDK.InsertAttLogToDB(AttLogRecordList);
                return _saveResult;
                //dtAttLogList.ItemsSource = AttLogRecordList;
                //dtAttLogList.CanUserAddRows = false;
                //dtAttLogList.CanUserDeleteRows = false;
                //dtAttLogList.IsReadOnly = true;



            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private async Task<DataModel> funcGetGeneralLogData(ImportFromUSBVm model)
        {
            try
            {
                if (model.ExcelFile == null) return new DataModel { error = true, message = "لطفا فایل را انتخاب نمایید" };

                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == model.FingerPrintDevice).FirstOrDefault();
                if (model.FingerPrintDevice <= 0 || _deviceVm == null) { return new DataModel { error = true, message = "لطفا دستگاه را انتخاب نمایید" }; }


                int vSEnrollNumber = 0;
                int vVerifyMode = 0;
                int vInOutMode = 0;
                DateTime vdwDate = DateTime.MinValue;
                int vnCount = 1;
                int vnResultCode = 0;


                var _filePath = await _fileService.GetPath(model.File_Id);
                if (string.IsNullOrEmpty(_filePath))
                    return new DataModel { error = true, message = "لطفا فایل را انتخاب نمایید" };
                CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));
                var _serverPath = new NopFileProvider(HostingEnvironment.MapPath("~")).Root;
                _filePath = CommonHelper.DefaultFileProvider.Combine(_serverPath, _filePath);


                vnResultCode = FKAttendHelper.FK_USBLoadGeneralLogDataFromFile(0, _filePath);

                do
                {
                    //vnResultCode = FKAttendHelper.FK_GetGeneralLogData(frmMain.gnCommHandleIndex, ref vSEnrollNumber, ref vVerifyMode, ref vInOutMode, ref vdwDate);
                    vnResultCode = FKAttendHelper.FK_GetGeneralLogData(0, ref vSEnrollNumber, ref vVerifyMode, ref vInOutMode, ref vdwDate);
                    if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                    {
                        if (vnResultCode == (int)enumErrorCode.RUNERR_DATAARRAY_END)
                        {
                            vnResultCode = (int)enumErrorCode.RUN_SUCCESS;
                        }
                        break;
                    }
                    try
                    {
                        //if (funcShowGeneralLogDataToGrid(vnCount, vSEnrollNumber, vVerifyMode, vInOutMode, vdwDate) == false) break;
                        var _value = new TimeRecordVm
                        {
                            //DeviceCode = _DeviceVm.Code,
                            CardNo = vSEnrollNumber.ToString(),
                            Day = vdwDate.Day,
                            Hour = vdwDate.Hour,
                            Minute = vdwDate.Minute,
                            Month = vdwDate.Month,
                            Year = vdwDate.Year,
                            AttStatus = vInOutMode,
                            VerifyMethod = vVerifyMode,
                            DatetimeIO = vdwDate
                        };
                        AttLogRecordList.Add(_value);
                    }
                    catch (Exception ex)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
                    }
                    vnCount = vnCount + 1;
                } while (true);

                var _saveReslt = _deviceVm.sDK.InsertAttLogToDB(AttLogRecordList);

                return _saveReslt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private async Task<DataModel> funcGetSuperLogData(ImportFromUSBVm model)
        {
            int vSEnrollNumber = 0;
            int vGEnrollNumber = 0;
            int vManipulation = 0;
            int vBackupNumber = 0;
            DateTime vdwDate = DateTime.Now;
            int vnii;

            string[] vstrLogItem;
            //string vstrFileName;
            int vnReadMark;
            int vnResultCode;
            string vstrTmp;
            //System.Windows.Forms.ListViewItem vtItem;

            //vstrFileName = "";
            vstrTmp = "";

            vstrLogItem = new string[] { "", "SEnrollNo", "GEnrollNo", "Manipulation", "BackupNo", "DateTime" };


            //var dlgOpen = new System.Windows.Forms.OpenFileDialog();
            //dlgOpen.InitialDirectory = Directory.GetCurrentDirectory();
            //dlgOpen.Filter = "SLog Files (*.txt)|*.txt|All Files (*.*)|*.*";
            //dlgOpen.FilterIndex = 1;
            //if (dlgOpen.ShowDialog() != System.Windows.Forms.DialogResult.OK) return;
            //vstrFileName = dlgOpen.FileName;
            //if (vstrFileName == "") return;
            //dlgOpen.FileName = "";









            var _filePath = await _fileService.GetPath(model.File_Id);
            if (string.IsNullOrEmpty(_filePath))
                return new DataModel();

            CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));
            var _serverPath = new NopFileProvider(HostingEnvironment.MapPath("~")).Root;

            _filePath = CommonHelper.DefaultFileProvider.Combine(_serverPath, _filePath);





            vnResultCode = FKAttendHelper.FK_USBLoadSuperLogDataFromFile(0, _filePath);


            if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                return new DataModel { error = true, message = FDKHelper.ReturnResultPrint(vnResultCode) };
            else
            {
                vnii = 1;
                do
                {
                    vnResultCode = FKAttendHelper.FK_GetSuperLogData(0, ref vSEnrollNumber, ref vGEnrollNumber, ref vManipulation, ref vBackupNumber, ref vdwDate);

                    if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                    {
                        if (vnResultCode == (int)enumErrorCode.RUNERR_DATAARRAY_END)
                            vnResultCode = (int)enumErrorCode.RUN_SUCCESS;
                        break;
                    }





                    //vtItem = new System.Windows.Forms.ListViewItem();
                    //vtItem.Text = (Convert.ToString(vnii)).Trim();
                    //vtItem.SubItems.Add(vSEnrollNumber.ToString().Trim());
                    //vtItem.SubItems.Add(vGEnrollNumber.ToString().Trim());
                    //switch (vManipulation)
                    //{
                    //    case (int)enumSuperLogInfo.LOG_ENROLL_USER:
                    //        vstrTmp = "Enroll User"; break;
                    //    case (int)enumSuperLogInfo.LOG_ENROLL_MANAGER:
                    //        vstrTmp = "Enroll Manager"; break;
                    //    case (int)enumSuperLogInfo.LOG_ENROLL_DELFP:
                    //        vstrTmp = "Delete Fp Data"; break;
                    //    case (int)enumSuperLogInfo.LOG_ENROLL_DELPASS:
                    //        vstrTmp = "Delete Password"; break;
                    //    case (int)enumSuperLogInfo.LOG_ENROLL_DELCARD:
                    //        vstrTmp = "Delete Card Data"; break;
                    //    case (int)enumSuperLogInfo.LOG_LOG_ALLDEL:
                    //        vstrTmp = "Delete All LogData"; break;
                    //    case (int)enumSuperLogInfo.LOG_SETUP_SYS:
                    //        vstrTmp = "Modify System Info"; break;
                    //    case (int)enumSuperLogInfo.LOG_SETUP_TIME:
                    //        vstrTmp = "Modify System Time"; break;
                    //    case (int)enumSuperLogInfo.LOG_SETUP_LOG:
                    //        vstrTmp = "Modify Log Setting"; break;
                    //    case (int)enumSuperLogInfo.LOG_SETUP_COMM:
                    //        vstrTmp = "Modify Comm Setting"; break;
                    //    case (int)enumSuperLogInfo.LOG_PASSTIME:
                    //        vstrTmp = "Pass Time Set"; break;
                    //    case (int)enumSuperLogInfo.LOG_SETUP_DOOR:
                    //        vstrTmp = "Door Set Log"; break;
                    //    default:
                    //        vstrTmp = "--"; break;
                    //}
                    //vtItem.SubItems.Add(vstrTmp);

                    //if (vBackupNumber == (int)enumBackupNumberType.BACKUP_PSW)
                    //    vstrTmp = "Password";
                    //else if (vBackupNumber == (int)enumBackupNumberType.BACKUP_CARD)
                    //    vstrTmp = "Card";
                    //else if (vBackupNumber < (int)enumBackupNumberType.BACKUP_PSW)
                    //    vstrTmp = "Fp-" + vBackupNumber.ToString().Trim();
                    //else
                    //    vstrTmp = "--";

                    //vtItem.SubItems.Add(vstrTmp);

                    //vstrTmp = vdwDate.Year + vdwDate.Month.ToString("/0#") + vdwDate.Day.ToString("/0#") +
                    //    vdwDate.Hour.ToString(" 0#") + vdwDate.Minute.ToString(":0#") + vdwDate.Second.ToString(":0#");

                    //vtItem.SubItems.Add(vstrTmp);
                    //vtItem = null;









                    vnResultCode = FKAttendHelper.FK_GetSuperLogData(0, ref vSEnrollNumber, ref vGEnrollNumber, ref vManipulation, ref vBackupNumber, ref vdwDate);
                    //vnResultCode = FKAttendHelper.FK_GetGeneralLogData(0, ref vSEnrollNumber, ref vVerifyMode, ref vInOutMode, ref vdwDate);
                    if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                    {
                        if (vnResultCode == (int)enumErrorCode.RUNERR_DATAARRAY_END)
                            vnResultCode = (int)enumErrorCode.RUN_SUCCESS;
                        break;
                    }

                    try
                    {
                        var _value = new TimeRecordVm
                        {
                            //DeviceCode = _DeviceVm.Code,
                            CardNo = vSEnrollNumber.ToString(),
                            Day = vdwDate.Day,
                            Hour = vdwDate.Hour,
                            Minute = vdwDate.Minute,
                            Month = vdwDate.Month,
                            Year = vdwDate.Year,
                            AttStatus = 0,
                            VerifyMethod = 1,
                            DatetimeIO = vdwDate
                        };
                        AttLogRecordList.Add(_value);
                    }
                    catch (Exception ex)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
                    }












                    vnii = vnii + 1;
                } while (true);
                //dtAttLogList.ItemsSource = AttLogRecordList;
                //dtAttLogList.CanUserAddRows = false;
                //dtAttLogList.CanUserDeleteRows = false;
                //dtAttLogList.IsReadOnly = true;

                if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                {
                    return new DataModel();
                }
                else
                    return new DataModel { error = true, message = FDKHelper.ReturnResultPrint(vnResultCode) };
            }


        }

        #endregion

    }

}
