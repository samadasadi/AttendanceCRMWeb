using Mapping;
using Newtonsoft.Json;
using Repository;
using Repository.iContext;
using Repository.Model;
using Repository.Model.Attendance;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.PublicEnum;
using Utility.Utitlies;
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

        #region Att Log
        Task<DataModelResult> SaveAttLog(TimeRecordVm entity);
        Task<TimeRecordVm> GetAttLog(TimeRecordVm entity);
        Task<viewModel<TimeRecordVm>> GetAllAttLog(TimeRecordVm value);
        Task<DataModelResult> Delete_AttLog(TimeRecordVm model);

        #endregion
    }
    public class AttendanceReportService : IAttendanceReportService
    {

        #region prop
        public Context _context;
        private IRepository<PubUser> _repoPubUser;
        private IRepository<PubUser_Shift> _repoPubUser_Shift;
        private IRepository<FingerTemplate> _repoTEMPLATE;
        private IRepository<TimeRecords> _repoTimeRecord;
        private IRepository<Calendar> _repoCalendar;
        private IRepository<JobTime> _repoJobTime;
        private IRepository<NewDevice> _repoNewDevice;
        private IRepository<ShiftWork> _repoShiftWork;
        private IRepository<TransactionRequest> _repoTransactionRequest;
        private IRepository<EmployeeAccounting> _repoEmployeeAccounting;
        private readonly IRepository<PersonHoghogh> _repoPersonHoghogh;
        private IRepository<Tbl_Cost> _repoCost;
        private IRepository<Cost_Incoming> _repoCostIncoming;



        Guid[] transMorkhasiIds = new Guid[7] {
                    Guid.Parse("F1AC3ACA-C785-23EB-9A89-0EFA126E3C8E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-9A99-0EFA126E3C9E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-1A89-0EFA126E1C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-2A89-0EFA126E2C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-3A89-0EFA126E3C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-4A89-0EFA126E4C7E"),
                    Guid.Parse("F1AC3ACA-C785-23EB-5A89-0EFA126E5C7E")
                };

        Guid[] transMamoriyatIds = new Guid[3] {
            Guid.Parse("F1AC3ACA-C785-23EB-9A59-0EFA126E3C5E"),
            Guid.Parse("F1AC3ACA-C785-23EB-9A69-0EFA126E3C6E"),
            Guid.Parse("F1AC3ACA-C785-23EB-9A79-0EFA126E3C7E")
        };
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
            IRepository<Cost_Incoming> repoCostIncoming,
            IRepository<FingerTemplate> repoTEMPLATE)
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;

            _repoPubUser_Shift = repoPubUser_Shift;
            _repoPubUser_Shift.FrameworkContext = currentcontext;
            _repoPubUser_Shift.DbFactory = contextFactory;

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

                var _user = (await _repoPubUser.Get(x => x.Id == model.PersonId)).FirstOrDefault();
                if (_user == null) return new AttendanceVM { Error = true, Message = "لطفا کاربر را انتخاب نمایید" };


                if (_user != null)
                {
                    try { model.UserId = _user.UserId != null ? _user.UserId.Value : Convert.ToInt32(_user.EmployeeID); } catch { model.UserId = 0; return _model; }
                    _model.personInfoVm.FirstName = _user.Name;
                    _model.personInfoVm.LastName = _user.Family;
                    _model.personInfoVm.FromDateStr = model.FromDate != null ? DateTimeOperation.M2S(model.FromDate.Value) : "";
                    _model.personInfoVm.ToDateStr = model.ToDate != null ? DateTimeOperation.M2S(model.ToDate.Value) : "";
                    _model.personInfoVm.PersonalCode = model.UserId.ToString();

                    _model.personInfoVm.FatherName = _user.FatherName;
                    _model.personInfoVm.NationalCode = _user.NationalCode;


                }


                var _fromDate = model.FromDate.Value;
                var _toDate = model.ToDate.Value;

                var _totalDay = Math.Abs((_toDate - _fromDate).TotalDays);
                _totalDay += 1;

                for (int index = 0; index < _totalDay; index++)
                {
                    var _date = new AttendanceList
                    {
                        DateEn = _fromDate.AddDays(index),
                        UserId = model.UserId,
                        PersonID = _user.UserId != null ? _user.UserId.Value : 0
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
                    await CalcTimeWorkPerDay(_model, _transactionReq);

                    //محاسبه تمامی اطلاعات مربوط به مرخصی و ماموریت
                    CalcTotalMissionAndVacation(_transactionReq, _model);

                    //اعمال پارامتر های گزارش
                    CalcReportParams(_model, model);

                    //محاسبه تمام ساعات کاری
                    CalcTotalWorkTime(_model);


                    _model.personInfoVm.CountPresentDay = _model.listAttenDanceVm.Where(x => x.IsPresent == false).Count();
                    _model.personInfoVm.CountHozorDay = _model.listAttenDanceVm.Where(x => x.IsPresent == true && !x.IsHoliday).Count();
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
                            {
                                timeRecord_item.EnterDate = item.DatetimeIO;
                                timeRecord_item.EnterChangebyPerson = item.ChangebyPerson;
                            }
                            else if (_index == 1)
                            {
                                timeRecord_item.LeaveDate = item.DatetimeIO;
                                timeRecord_item.LeaveChangebyPerson = item.ChangebyPerson;
                            }
                            else if (_index == 2)
                            {
                                timeRecord_item.EnterDate2 = item.DatetimeIO;
                                timeRecord_item.EnterChangebyPerson2 = item.ChangebyPerson;
                            }
                            else if (_index == 3)
                            {
                                timeRecord_item.LeaveDate2 = item.DatetimeIO;
                                timeRecord_item.LeaveChangebyPerson2 = item.ChangebyPerson;
                            }
                            else if (_index == 4)
                            {
                                timeRecord_item.EnterDate3 = item.DatetimeIO;
                                timeRecord_item.EnterChangebyPerson3 = item.ChangebyPerson;
                            }
                            else if (_index == 5)
                            {
                                timeRecord_item.LeaveDate3 = item.DatetimeIO;
                                timeRecord_item.LeaveChangebyPerson3 = item.ChangebyPerson;
                            }


                            _index++;
                            if (_index == 6) break;
                        }
                        timeRecord_item.IsPresent = true;
                    }
                    else
                    {
                        timeRecord_item.Descriptions = PublicResource.DailyAbsense;
                        timeRecord_item.IsPresent = false;
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
        private async System.Threading.Tasks.Task CalcTimeWorkPerDay(AttendanceVM model, List<TransactionRequestVm> transReq)
        {
            try
            {
                foreach (var timeRecord_item in model.listAttenDanceVm)
                {
                    var _shift_work_query = string.Format(QueryString.ShiftWorkList, timeRecord_item.PersonID);
                    var _shift_work = (await _repoShiftWork.RunQuery<ShiftWorkVm>(_shift_work_query)).ToList().FirstOrDefault();
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
                                    //ثبت خروج برای روزهایی که خروج آنها ثبت نشده است
                                    RegisterLeaveTimeForNoneLeave(timeRecord_item, _jobTime);
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

                                //دریافت عنوان ساعت کاری
                                timeRecord_item.JobTimeName = _jobTime != null ? _jobTime.JobTimeName : "";

                                if (_jobTime != null && _jobTime.ShiftTaRoozeBad == true)
                                {

                                }
                                else
                                {
                                    if (_jobTime != null && _jobTime.ShiftShenavar == true)
                                    {
                                        //محاسبه تاخیر آیتم فعلی
                                        CalcTakhir_Shenavar(timeRecord_item, _jobTime);
                                        //محاسبه اضافه کاری
                                        ClacEzafeKari_Shenavar(timeRecord_item, _jobTime);

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
                                        //محاسبه غیبت آیتم فعلی
                                        CalcGheybat(timeRecord_item);
                                    }
                                    else
                                    {

                                        //چک کردن روز تعطیل
                                        CheckVacationDay(timeRecord_item, _shift_work);
                                        //محاسبه تاخیر آیتم فعلی
                                        CalcTakhir(timeRecord_item, _jobTime);
                                        //محاسبه تاخیر آیتم فعلی
                                        CalcTajil(timeRecord_item, _jobTime);
                                        //محاسبه اضافه کاری
                                        ClacEzafeKari(timeRecord_item, _jobTime);

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

                                        //if (timeRecord_item.IsPresent)
                                        //{
                                        //    if ((_totalTime + timeRecord_item.Takhir + timeRecord_item.Tajil) < timeRecord_item.TotalMinuteCurrentDay)
                                        //    {
                                        //        var _res = timeRecord_item.TotalMinuteCurrentDay.Value - (_totalTime + timeRecord_item.Takhir + timeRecord_item.Tajil);
                                        //        timeRecord_item.EzafeKari = _res < timeRecord_item.EzafeKari ? _res - timeRecord_item.EzafeKari : 0;
                                        //        if (_res > timeRecord_item.EzafeKari)
                                        //        {
                                        //            timeRecord_item.Takhir += (_res - timeRecord_item.EzafeKari);
                                        //        }
                                        //    }
                                        //}
                                        //محاسبه غیبت آیتم فعلی
                                        CalcGheybat(timeRecord_item);
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
        private void RegisterLeaveTimeForNoneLeave(AttendanceList attItem, JobTime jobTime)
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
                    var _res = new[] { timeRecord_item.LeaveDate, timeRecord_item.LeaveDate2, timeRecord_item.LeaveDate3 }.Max();

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
        private void CalcGheybat(AttendanceList timeRecord_item)
        {
            try
            {
                if (timeRecord_item.IsHoliday && timeRecord_item.IsPresent)
                    //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود 
                    return;

                timeRecord_item.Gheybat = timeRecord_item.Tajil + timeRecord_item.Takhir;

                timeRecord_item.Gheybat = timeRecord_item.VacationsHour > timeRecord_item.Gheybat ? 0 : (timeRecord_item.Gheybat - timeRecord_item.VacationsHour);
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
                        timeRecord_item.IsPresent = true;

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
                        model.personInfoVm.Vacations_Hour += (item.ToDateRequest > item.FromDateRequest ? ((int)item.ToDateRequest.Subtract(item.FromDateRequest).TotalMinutes) : 0); ;
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

                if (jobTime.TimeShiftLength == null) return;

                if (jobTime == null) return;
                var _totalTakhir = 0;
                var _zeroTime = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, 0, 0, 0);
                jobTime.TimeShiftLength = new DateTime(timeRecord_item.EnterDate.Value.Year, timeRecord_item.EnterDate.Value.Month, timeRecord_item.EnterDate.Value.Day, jobTime.TimeShiftLength.Value.Hour, jobTime.TimeShiftLength.Value.Minute, jobTime.TimeShiftLength.Value.Second);
                var _totalminutework = (int)jobTime.TimeShiftLength.Value.Subtract(_zeroTime).TotalMinutes;

                var _res1 = timeRecord_item.LeaveDate != null && timeRecord_item.EnterDate != null ? ((int)timeRecord_item.LeaveDate.Value.Subtract(timeRecord_item.EnterDate.Value).TotalMinutes) : 0;
                var _res2 = timeRecord_item.LeaveDate2 != null && timeRecord_item.EnterDate2 != null ? ((int)timeRecord_item.LeaveDate2.Value.Subtract(timeRecord_item.EnterDate2.Value).TotalMinutes) : 0;
                var _res3 = timeRecord_item.LeaveDate3 != null && timeRecord_item.EnterDate3 != null ? ((int)timeRecord_item.LeaveDate3.Value.Subtract(timeRecord_item.EnterDate3.Value).TotalMinutes) : 0;

                var _res = _res1 + _res2 + _res3;
                _totalTakhir = _res >= _totalminutework || _res == 0 ? 0 : _totalminutework - _res;


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
                var model = await TotalPerformancePersonal_Report(new ReportParameter { PersonId = filter.Id, FromDate = filter.personAccountingFilter.FromDate, ToDate = filter.personAccountingFilter.ToDate });

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
                    filter.personAccountingFilter.Nahar == false ? false : true,
                    filter.personAccountingFilter.Sobhane == false ? false : true,
                    filter.personAccountingFilter.AyabZahab == false ? false : true,
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

                if (reportParameter.ReportType.Id == (int)SystemReportType.TransactionReq_Mamoriyat)
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
                                            "\n     ISNULL(device.GroupId, 0) as DeviceGroupId, " +
                                            "\n     ISNULL(userr.GroupId, 0) as UserGroupId " +
                                            "\n from TimeRecords " +
                                            "\n left join PubUser userr on TimeRecords.CardNo = userr.UserId " +
                                            "\n left join UserGroup userrgroup on userrgroup.Id = userr.GroupId " +
                                            "\n left join NewDevice device on device.Code = TimeRecords.DeviceCode " +
                                            "\n Left join DeviceGroup deviceGroup on deviceGroup.Id = device.GroupId " +
                                            "\n where (cast(TimeRecords.DatetimeIOMain as date)>=CAST(@_from as date) or @_from is null) " +
                                            "\n     and ((cast(TimeRecords.DatetimeIOMain as date)<=CAST(@_to as date)) or @_to is null) " +
                                            "\n     and (DeviceCode = @_devicecode or @_devicecode is null) " +
                                            "\n     and (TimeRecords.CardNo = @_user or @_user is null)" +
                                            "\n     and (TimeRecords.RecordID = @_timeRecordId or @_timeRecordId is null)" +
                                            "\n     and (TimeRecords.IsDelete = 0)" +
                                            "\n     and (deviceGroup.Id = @_devicegroup or @_devicegroup is null)" +
                                            "\n     and (userrgroup.Id = @_usergroup or @_usergroup is null)" +
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

        #endregion

    }
}
