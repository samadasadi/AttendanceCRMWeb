using Mapping;
using Newtonsoft.Json;
using Repository;
using Repository.iContext;
using Repository.Model;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.Utitlies;
using ViewModel;
using ViewModel.UserManagement.Attendance;

namespace Service.UserManagement.Attendance
{
    public interface IShiftService
    {
        Task<Calendar> SaveCalendar(CalendarVm entity);
        Task<CalendarVm> GetCalendar(int? id);
        Task<List<ShiftMonth>> LoadCalendar(CalendarVm calendar);
        Task<List<ShiftMonth>> Edit_LoadCalendar(ShiftWorkVm entity);
        Task<List<ShiftMonth>> SetJobTimeForDays(ShiftWorkVm jobTime, List<ShiftMonth> model);
        Task<List<ShiftMonth>> ChangeJobTimeForDays(ShiftMonth_Day entity, List<ShiftMonth> ShiftMonthData);
        Task<viewModel<CalendarVm>> GetAllCalendar(PageingParamer value);
        Task<DataModelResult> Delete_Calendar(CalendarVm entity);


        Task<JobTime> SaveJobTime(JobTimeVm entity);
        Task<JobTimeVm> GetJobTime(int? id);
        Task<viewModel<JobTimeVm>> GetAllJobTime(PageingParamer value);
        Task<DataModelResult> Delete_JobTime(JobTimeVm model);


        Task<ShiftWork> SaveShiftWork(ShiftWorkVm entity);
        Task<ShiftWorkVm> GetShiftWork(int? id);
        Task<viewModel<ShiftWorkVm>> GetAllShiftWork(PageingParamer value);
        Task<DataModelResult> Delete_ShiftWork(ShiftWorkVm model);


        Task<List<NormalJsonClass>> GetPersonelList();

        Task<PubUser_ShiftVm> GetUserShift(int? id);
        Task<List<PubUser_ShiftVm>> GetPerson_UserShift(Guid? user_id);
        Task<viewModel<PubUser_ShiftVm>> GetAllUserShift(PageingParamer value);
        Task<DataModelResult> Entesab_UserShift(PubUser_ShiftVm entity);
        Task<PubUser_Shift> Save_UserShift(PubUser_ShiftVm entity);
    }
    public class ShiftService : IShiftService
    {
        public Context _context;
        private IRepository<PubUser> _repoPubUser;
        private IRepository<FingerTemplate> _repoFingerTemplate;
        private IRepository<TimeRecords> _repoTimeRecord;
        private IRepository<Calendar> _repoCalendar;
        private IRepository<JobTime> _repoJobTime;
        private IRepository<ShiftWork> _repoShiftWork;
        private IRepository<PubUser_Shift> _repoPubUser_Shift;



        public ShiftService(IContextFactory contextFactory,
            IRepository<PubUser> repoPubUser,
            IRepository<TimeRecords> repoTimeRecrd,
            IRepository<Calendar> repoCalendar,
            IRepository<JobTime> repoJobTime,
            IRepository<ShiftWork> repoShiftWork,
            IRepository<FingerTemplate> repoTEMPLATE,
            IRepository<PubUser_Shift> repoPubUser_Shift)
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;

            _repoPubUser = repoPubUser;
            _repoPubUser.FrameworkContext = currentcontext;
            _repoPubUser.DbFactory = contextFactory;

            _repoTimeRecord = repoTimeRecrd;
            _repoTimeRecord.FrameworkContext = currentcontext;
            _repoTimeRecord.DbFactory = contextFactory;

            _repoFingerTemplate = repoTEMPLATE;
            _repoFingerTemplate.FrameworkContext = currentcontext;
            _repoFingerTemplate.DbFactory = contextFactory;

            _repoCalendar = repoCalendar;
            _repoCalendar.FrameworkContext = currentcontext;
            _repoCalendar.DbFactory = contextFactory;

            _repoJobTime = repoJobTime;
            _repoJobTime.FrameworkContext = currentcontext;
            _repoJobTime.DbFactory = contextFactory;

            _repoShiftWork = repoShiftWork;
            _repoShiftWork.FrameworkContext = currentcontext;
            _repoShiftWork.DbFactory = contextFactory;

            _repoPubUser_Shift = repoPubUser_Shift;
            _repoPubUser_Shift.FrameworkContext = currentcontext;
            _repoPubUser_Shift.DbFactory = contextFactory;
        }


        #region Calendar
        public async Task<Calendar> SaveCalendar(CalendarVm entity)
        {
            try
            {
                var _model = new Calendar();
                entity.ModifiedDate = DateTime.Now;
                entity.CalendarName = entity.YearsNumber.ToString();
                if (entity.ID == 0)
                {
                    await _repoCalendar.AddInt(GenericMapping<CalendarVm, Calendar>.Map(entity));
                }
                else
                {
                    var _user = await _repoCalendar.Find(entity.ID);
                    if (_user != null)
                    {
                        _user.CalendarName = entity.CalendarName;
                        _user.HasRamazan = entity.HasRamazan;
                        _user.RamazanEndDate = entity.RamazanEndDate;
                        _user.RamazanStartDate = entity.RamazanStartDate;
                        _user.YearsNumber = entity.YearsNumber;
                        _user.Holidays = entity.GetHolidays();

                        await _repoCalendar.Detached(_user);
                        await _repoCalendar.Update(_user);
                        _model.ID = _user.ID;
                    }
                }
                return _model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<CalendarVm> GetCalendar(int? id)
        {
            try
            {
                if (id == null || id == 0)
                {
                    return new CalendarVm();
                }
                else
                {
                    var model = (await _repoCalendar.Get(x => x.ID == id.Value)).FirstOrDefault();
                    var _modelVm = GenericMapping<Calendar, CalendarVm>.Map(model);
                    _modelVm.ShowHolidays();
                    return _modelVm;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<ShiftMonth>> LoadCalendar(CalendarVm calendar)
        {
            try
            {
                var _calendar = await GetCalendar(calendar.ID);
                var ShiftMonthData = new List<ShiftMonth>();

                for (int index = 1; index <= 12; index++)
                {
                    var item = new ShiftMonth();

                    item.month = index;
                    item.shiftMonth_Days = GetShiftMonth_Days(_calendar, index);

                    ShiftMonthData.Add(item);
                }
                return ShiftMonthData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<ShiftMonth>> Edit_LoadCalendar(ShiftWorkVm entity)
        {
            try
            {
                if (string.IsNullOrEmpty(entity.Data)) return await LoadCalendar(new CalendarVm { ID = entity.Calendar_Id });

                var ShiftMonthData = await LoadCalendar(new CalendarVm { ID = entity.Calendar_Id });
                var _data = JsonConvert.DeserializeObject<List<ShiftWork_DayVm>>(entity.Data);

                var _jobtimesList = (await GetAllJobTime(new PageingParamer { PageNum = 1, PageSize = 1000000 }));

                var _shiftWork_daylist = new List<ShiftWork_DayVm>();
                foreach (var item in ShiftMonthData)
                {
                    if (item.shiftMonth_Days != null && item.shiftMonth_Days.Count > 0)
                    {
                        foreach (var _subItem in item.shiftMonth_Days)
                        {
                            var _day = _data.Where(x => x.DayValue.Date == _subItem.DateEn.Date).FirstOrDefault();
                            if (_day != null)
                            {
                                _subItem.IsVacation = _day.IsVacation;
                                _subItem.JobTime = _day.JobTime_Id;
                                _subItem.JobTimeName = _day.JobTime_Id > 0 ? _jobtimesList.TLists.Where(x => x.Id == _day.JobTime_Id).FirstOrDefault().JobTimeName : "";
                                //break;
                            }
                        }
                    }
                }
                return ShiftMonthData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<ShiftMonth>> SetJobTimeForDays(ShiftWorkVm jobTime, List<ShiftMonth> ShiftMonthData)
        {
            try
            {
                var _jobTime = await GetJobTime(jobTime.Id);
                var _calendar = await GetCalendar(jobTime.Calendar_Id);
                if (ShiftMonthData != null && ShiftMonthData.Count > 0)
                {
                    var _startDate = jobTime.JobTime_FromDate.Value;
                    var _endDate = jobTime.JobTime_ToDate.Value;

                    for (var dt = _startDate; dt <= _endDate; dt = dt.AddDays(1))
                    {
                        foreach (var _shiftmonth in ShiftMonthData)
                        {
                            var _item = _shiftmonth.shiftMonth_Days.Where(x => x.DateEn.Date == dt.Date).FirstOrDefault();
                            if (_item != null && !GetIsVacation(dt, _calendar))
                            {
                                _item.JobTime = jobTime.Id;
                                _item.JobTimeName = _jobTime.JobTimeName;
                            }
                        }
                    }
                }
                return ShiftMonthData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<ShiftMonth>> ChangeJobTimeForDays(ShiftMonth_Day entity, List<ShiftMonth> ShiftMonthData)
        {
            try
            {
                if (ShiftMonthData != null && ShiftMonthData.Count > 0)
                {
                    var _break = false;
                    foreach (var _shiftmonth in ShiftMonthData)
                    {
                        foreach (var item in _shiftmonth.shiftMonth_Days)
                        {
                            if (item.DateEn.Date == entity.DateEn.Date)
                            {
                                item.JobTime = entity.JobTime;
                                item.JobTimeName = (await GetJobTime(entity.JobTime)).JobTimeName;
                                item.IsVacation = false;
                                _break = true;
                                break;
                            }
                        }
                        if (_break) break;
                    }
                }
                return ShiftMonthData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<ShiftMonth_Day> GetShiftMonth_Days(CalendarVm calendar, int month)
        {
            try
            {
                var _startDayOfMonth = DateTimeOperation.GetFirstDayOfMonth(calendar.YearsNumber, month);
                var _endDayOfMonth = DateTimeOperation.GetEndDayOfMonth(calendar.YearsNumber, month);

                var _list = new List<ShiftMonth_Day>();
                int _index = 1;
                for (var dt = _startDayOfMonth; dt <= _endDayOfMonth; dt = dt.AddDays(1))
                {
                    var ite = new ShiftMonth_Day
                    {
                        month = month,
                        DateEn = dt,
                        day = _index,
                        IsVacation = GetIsVacation(dt, calendar),
                        IsRamazan = GetIsRamazan(dt, calendar)
                    };
                    _list.Add(ite);
                    _index++;
                }
                return _list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool GetIsVacation(DateTime value, CalendarVm calendar)
        {
            try
            {
                
                var _dayOfweek = value.DayOfWeek;

                if (string.IsNullOrEmpty(calendar.Holidays)) return false;

                if (calendar != null && calendar.Holidays.Contains(((int)_dayOfweek).ToString())) return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return false;
        }
        public bool GetIsRamazan(DateTime value, CalendarVm calendar)
        {
            try
            {
                if (calendar != null)
                {
                    if (calendar.HasRamazan == true)
                    {
                        if (calendar.RamazanStartDate != null
                            && calendar.RamazanEndDate != null
                            && calendar.RamazanStartDate.Value.Date <= value.Date
                            && calendar.RamazanEndDate.Value.Date >= value.Date) return true;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return false;
        }
        public async Task<viewModel<CalendarVm>> GetAllCalendar(PageingParamer value)
        {
            try
            {
                var _result = new viewModel<CalendarVm>();
                _result.TLists = new List<CalendarVm>();

                var _query = string.Format("EXEC [dbo].[sp_CalendarList] @From = {0},@To = {1},@text = {2}",
                            (value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize)),
                            value.PageNum * value.PageSize,
                            (string.IsNullOrEmpty(value.Search) ? "NULL" : "N'" + value.Search + "'"));
                _result.TLists = (await _repoCalendar.RunQuery<CalendarVm>(_query)).ToList();

                _result.CountAll_TLists = await _repoCalendar.TCount(x => x.IsDeleted == false);

                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> Delete_Calendar(CalendarVm entity)
        {
            try
            {
                if (entity != null && entity.ID != 0)
                {
                    var _query = string.Format(@" update Calendar set IsDeleted = '1' where ID ='{0}' ", entity.ID);
                    //await _repoCalendar.ExecuteSqlCommand(_query);
                    await _repoCalendar.Delete(await _repoCalendar.Find(entity.ID));
                }
                return new DataModelResult { Message = "" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        #endregion

        #region JobTime
        public async Task<JobTime> SaveJobTime(JobTimeVm entity)
        {
            try
            {
                var _date = DateTime.Now;
                TimeSpan time;

                if (!string.IsNullOrEmpty(entity.TimeKhoroj_Value) && TimeSpan.TryParse(entity.TimeKhoroj_Value, out time))
                    entity.TimeKhoroj = new DateTime(_date.Year, _date.Month, _date.Day, time.Hours, time.Minutes, 0);

                if (!string.IsNullOrEmpty(entity.TimeVorod_Value) && TimeSpan.TryParse(entity.TimeVorod_Value, out time))
                    entity.TimeVorod = new DateTime(_date.Year, _date.Month, _date.Day, time.Hours, time.Minutes, 0);

                if (!string.IsNullOrEmpty(entity.TimeFKhoroj_Value) && TimeSpan.TryParse(entity.TimeFKhoroj_Value, out time))
                    entity.TimeFKhoroj = new DateTime(_date.Year, _date.Month, _date.Day, time.Hours, time.Minutes, 0);

                if (!string.IsNullOrEmpty(entity.TimeFVorod_Value) && TimeSpan.TryParse(entity.TimeFVorod_Value, out time))
                    entity.TimeFVorod = new DateTime(_date.Year, _date.Month, _date.Day, time.Hours, time.Minutes, 0);

                if (!string.IsNullOrEmpty(entity.TimeShenavar) && TimeSpan.TryParse(entity.TimeShenavar, out time))
                    entity.TimeShiftLength = new DateTime(_date.Year, _date.Month, _date.Day, time.Hours, time.Minutes, 0);



                var _model = new JobTime();
                entity.ModifiedDate = DateTime.Now;

                if (entity.Id == 0)
                {
                    await _repoJobTime.AddInt(GenericMapping<JobTimeVm, JobTime>.Map(entity));
                }
                else
                {
                    var _user = await _repoJobTime.Find(entity.Id);
                    if (_user != null)
                    {
                        _user.Explain = entity.Explain;
                        _user.JobTimeName = entity.JobTimeName;
                        _user.ShiftDovvom = entity.ShiftDovvom;
                        _user.ShiftTaRoozeBad = entity.ShiftTaRoozeBad;
                        _user.TimeFKhoroj = entity.TimeFKhoroj;
                        _user.TimeFKhoroj2 = entity.TimeFKhoroj2;
                        _user.TimeFVorod = entity.TimeFVorod;
                        _user.TimeFVorod2 = entity.TimeFVorod2;
                        _user.TimeKhoroj = entity.TimeKhoroj;
                        _user.TimeKhoroj2 = entity.TimeKhoroj2;
                        _user.TimeShenavar = entity.TimeShenavar;
                        _user.TimeShiftLength = entity.TimeShiftLength;
                        _user.TimeVorod = entity.TimeVorod;
                        _user.TimeVorod2 = entity.TimeVorod2;
                        _user.ShiftShenavar = entity.ShiftShenavar;

                        await _repoJobTime.Detached(_user);
                        await _repoJobTime.Update(_user);
                        _model.Id = _user.Id;
                    }
                }
                return _model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<JobTimeVm> GetJobTime(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new JobTimeVm();
                }
                else
                {
                    var model = (await _repoJobTime.Get(x => x.Id == id.Value)).FirstOrDefault();
                    //var _modelVm = GenericMapping<JobTime, JobTimeVm>.Map(model);

                    if (model != null)
                    {
                        var _modelVm = new JobTimeVm
                        {
                            Explain = model.Explain,
                            Id = model.Id,
                            IsActive = model.IsActive,
                            IsDeleted = model.IsDeleted,
                            JobTimeName = model.JobTimeName,
                            ModifiedDate = model.ModifiedDate,
                            TimeFKhoroj = model.TimeFKhoroj,
                            TimeFVorod = model.TimeFVorod,
                            TimeVorod = model.TimeVorod,
                            TimeKhoroj = model.TimeKhoroj,
                            TimeShenavar = model.TimeShenavar,
                            ShiftTaRoozeBad = model.ShiftTaRoozeBad,
                            ShiftDovvom = model.ShiftDovvom,
                            TimeShiftLength = model.TimeShiftLength,
                            ShiftShenavar = model.ShiftShenavar
                        };

                        _modelVm.TimeVorod_Value = _modelVm.TimeVorod.ToString("HH:mm");
                        _modelVm.TimeFVorod_Value = _modelVm.TimeFVorod != null ? _modelVm.TimeFVorod.Value.ToString("HH:mm") : "";
                        _modelVm.TimeKhoroj_Value = _modelVm.TimeKhoroj.ToString("HH:mm");
                        _modelVm.TimeFKhoroj_Value = _modelVm.TimeFKhoroj != null ? _modelVm.TimeFKhoroj.Value.ToString("HH:mm") : "";

                        _modelVm.TimeShenavar = _modelVm.TimeShiftLength != null ? _modelVm.TimeShiftLength.Value.ToString("HH:mm") : "";

                        return _modelVm;
                    }
                    return new JobTimeVm();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<viewModel<JobTimeVm>> GetAllJobTime(PageingParamer value)
        {
            try
            {
                var _result = new viewModel<JobTimeVm>();
                _result.TLists = new List<JobTimeVm>();


                var _query = string.Format("EXEC [dbo].[sp_JobTimeList] @From = {0},@To = {1},@text = {2}",
                            (value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize)),
                            value.PageNum * value.PageSize,
                            (string.IsNullOrEmpty(value.Search) ? "NULL" : "N'" + value.Search + "'"));
                _result.TLists = (await _repoJobTime.RunQuery<JobTimeVm>(_query)).ToList();

                _result.CountAll_TLists = await _repoJobTime.TCount(x => x.IsDeleted == false);
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> Delete_JobTime(JobTimeVm entity)
        {
            try
            {
                if (entity != null && entity.Id != 0)
                {
                    var _query = string.Format(@" update JobTime set IsDeleted = '1' where ID ='{0}' ", entity.Id);
                    //await _repoJobTime.ExecuteSqlCommand(_query);
                    await _repoJobTime.Delete(await _repoJobTime.Find(entity.Id));
                }
                return new DataModelResult { Message = "" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        #endregion

        #region ShiftWork
        public async Task<ShiftWork> SaveShiftWork(ShiftWorkVm entity)
        {
            try
            {
                var _model = new ShiftWork();
                entity.ModifiedDate = DateTime.Now;
                entity.Data = JsonConvert.SerializeObject(entity.shiftWork_DayVms);
                if (entity.Id == 0)
                {
                    await _repoShiftWork.AddInt(GenericMapping<ShiftWorkVm, ShiftWork>.Map(entity));
                }
                else
                {
                    var _user = await _repoShiftWork.Find(entity.Id);
                    if (_user != null)
                    {
                        _user.Calendar_Id = entity.Calendar_Id;
                        _user.ShiftName = entity.ShiftName;
                        _user.Data = entity.Data;

                        await _repoShiftWork.Detached(_user);
                        await _repoShiftWork.Update(_user);
                        _model.Id = _user.Id;
                    }
                }


                return _model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ShiftWorkVm> GetShiftWork(int? id)
        {
            try
            {
                var _res = new ShiftWorkVm();
                if (id != null)
                {
                    var model = (await _repoShiftWork.Get(x => x.Id == id.Value)).FirstOrDefault();
                    _res = GenericMapping<ShiftWork, ShiftWorkVm>.Map(model);
                }
                _res.calendarvmList = await GetCalendarList();
                _res.jobTimevmList = await GetJobTimeList();
                return _res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ShiftWorkVm> CreateNullShiftWork(ShiftWorkVm entity)
        {
            try
            {
                var _prescId = Guid.NewGuid();

                var _deletetemp = @" Delete ShiftWork where IsTemp = 1 ";
                await _repoShiftWork.ExecuteSqlCommand(_deletetemp);

                var _query = string.Format(@"   INSERT INTO [dbo].[ShiftWork] "
                                                + "\n ([ShiftName] "
                                                + "\n ,[IsDeleted] "
                                                + "\n ,[IsActive] "
                                                + "\n ,[ModifiedDate] "
                                                + "\n ,[Calendar_Id] "
                                                + "\n ,[UserId] "
                                                + "\n ,[Data] "
                                                + "\n ,[IsTemp]) "
                                                + "\n VALUES (N' ', 0, 1, GETDATE(), 0, '{0}', ' ', 1)",
                                                Public.CurrentUser.Id
                                                );
                await _repoShiftWork.ExecuteSqlCommand(_query);

                var _res = (await _repoShiftWork.Get(x => x.IsTemp == true)).ToList().FirstOrDefault();

                return new ShiftWorkVm { Id = _res.Id, Data = _res.Data };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<viewModel<ShiftWorkVm>> GetAllShiftWork(PageingParamer value)
        {
            try
            {
                var _result = new viewModel<ShiftWorkVm>();
                _result.TLists = new List<ShiftWorkVm>();

                var _query = string.Format("EXEC [dbo].[sp_ShiftWorkList] @From = {0},@To = {1},@text = {2}",
                            (value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize)),
                            value.PageNum * value.PageSize,
                            (string.IsNullOrEmpty(value.Search) ? "NULL" : "N'" + value.Search + "'"));
                _result.TLists = (await _repoShiftWork.RunQuery<ShiftWorkVm>(_query)).ToList();


                _result.CountAll_TLists = await _repoShiftWork.TCount(x => x.IsDeleted == false);
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> Delete_ShiftWork(ShiftWorkVm entity)
        {
            try
            {
                if (entity != null && entity.Id != 0)
                {
                    var _query = string.Format(@" update ShiftWork set IsDeleted = '1' where ID ='{0}' ", entity.Id);
                    //await _repoShiftWork.ExecuteSqlCommand(_query);
                    await _repoShiftWork.Delete(await _repoShiftWork.Find(entity.Id));
                }
                return new DataModelResult { Message = "" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }


        public async Task<List<NormalJsonClass>> GetCalendarList()
        {
            var res = (await GetAllCalendar(new PageingParamer { PageNum = 1, FirstPage = 1, PageSize = 10000 })).TLists.Select(
                m => new NormalJsonClass()
                {
                    Data = m.CalendarName,
                    Text = m.CalendarName,
                    Value = m.ID.ToString()
                }).ToList();
            return res;
        }
        public async Task<List<NormalJsonClass>> GetJobTimeList()
        {
            var res = (await GetAllJobTime(new PageingParamer { PageNum = 1, FirstPage = 1, PageSize = 10000 })).TLists.Select(
                m => new NormalJsonClass()
                {
                    Data = m.JobTimeName,
                    Text = m.JobTimeName,
                    Value = m.Id.ToString()
                }).ToList();
            return res;
        }
        #endregion

        #region User shift

        public async Task<List<NormalJsonClass>> GetShiftWorkList()
        {
            var _model = (await _repoShiftWork.Get(m => m.IsDeleted == false)
                ).Select(z => new NormalJsonClass
                {
                    Text = z.ShiftName,
                    Value = z.Id.ToString(),
                }).ToList();
            return _model;
        }
        public async Task<List<NormalJsonClass>> GetPersonelList()
        {
            var _model = (await _repoPubUser.Get(m => m.IsDeleted == false && m.EmployeeActive == true)
                ).Select(z => new NormalJsonClass
                {
                    Text = z.Name + " " + z.Family,
                    Value = z.Id.ToString(),
                }).ToList();
            return _model;
        }
        public async Task<PubUser_ShiftVm> GetUserShift(int? id)
        {
            try
            {
                var _result = new PubUser_ShiftVm();
                _result.PuUserList = await GetPersonelList();
                _result.ShiftWorkList = await GetShiftWorkList();
                if (id == null)
                {
                    return _result;
                }
                else
                {
                    var model = (await _repoPubUser_Shift.Get(x => x.Id == id.Value)).FirstOrDefault();
                    var _modelVm = GenericMapping<PubUser_Shift, PubUser_ShiftVm>.Map(model);
                    return _modelVm;
                }
            }
            catch (Exception ex)
            {
                //throw new Exception("location: PubUserService.GetUserShift => " + ex.Message);
            }
            return new PubUser_ShiftVm();
        }
        public async Task<List<PubUser_ShiftVm>> GetPerson_UserShift(Guid? user_id)
        {
            try
            {
                if (user_id != null)
                {
                    var model = (from item in (await _repoPubUser_Shift.Get(x => x.PuUser_Id == user_id.Value)).ToList()
                                 select new PubUser_ShiftVm
                                 {
                                     Id = item.Id,
                                     IsDeleted = item.IsDeleted,
                                     ModifiedDate = item.ModifiedDate,
                                     PuUser_Id = item.PuUser_Id,
                                     EntesabDate = item.EntesabDate,
                                     ShiftWork_Id = item.ShiftWork_Id

                                 }).ToList();
                    return model;
                }
            }
            catch (Exception ex)
            {
                //throw new Exception("location: PubUserService.GetPerson_UserShift => " + ex.Message);
            }
            return new List<PubUser_ShiftVm>();
        }
        public async Task<viewModel<PubUser_ShiftVm>> GetAllUserShift(PageingParamer value)
        {
            try
            {
                var _result = new viewModel<PubUser_ShiftVm>();
                _result.TLists = new List<PubUser_ShiftVm>();

                _result.TLists = (from item in (await _repoPubUser_Shift.Get(x => x.IsDeleted == false)).ToList()
                                  select new PubUser_ShiftVm
                                  {
                                      Id = item.Id,
                                      IsDeleted = item.IsDeleted,
                                      ModifiedDate = item.ModifiedDate,
                                      PuUser_Id = item.PuUser_Id,
                                      EntesabDate = item.EntesabDate,
                                      ShiftWork_Id = item.ShiftWork_Id
                                  }).ToList();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<DataModelResult> Entesab_UserShift(PubUser_ShiftVm entity)
        {
            try
            {
                if (entity.Type == "1")
                {
                    return await SetShiftWorkforPerson(entity);
                }
                else if (entity.Type == "3")
                {
                    return await SetShiftWorkforPersonNotHaveShift(entity);
                }
                else
                {
                    return await SetShiftWorkforAllPerson(entity);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<PubUser_Shift> Save_UserShift(PubUser_ShiftVm entity)
        {
            try
            {
                #region Add
                var _model = new PubUser_Shift();
                entity.ModifiedDate = DateTime.Now;
                entity.DoingUserId = Public.CurrentUser.Id;
                entity.EntesabDate = DateTime.Now;
                if (entity.Id == 0)
                {
                    entity.IsDeleted = false;
                    await _repoPubUser_Shift.AddInt(GenericMapping<PubUser_ShiftVm, PubUser_Shift>.Map(entity));
                }
                #endregion

                #region Edit
                //else
                //{
                //    var _user = await _repoPubUser_Shift.Find(entity.Id);
                //    if (_user != null)
                //    {
                //        _user.Id = entity.Id;
                //        _user.PuUser_Id = entity.PuUser_Id;
                //        _user.ShiftWork_Id = entity.ShiftWork_Id;
                //        _user.EntesabDate = entity.EntesabDate;
                //        await _repoPubUser_Shift.Detached(_user);
                //        await _repoPubUser_Shift.Update(_user);
                //        _model.Id = _user.Id;
                //    }
                //}
                #endregion


                return _model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> SetShiftWorkforPerson(PubUser_ShiftVm entity)
        {
            try
            {
                if (entity.PuUser_Id == Guid.Empty) return new DataModelResult { Error = true, Message = "پرسنل را انتخاب نمایید" };
                if (entity.ShiftWork_Id == 0) return new DataModelResult { Error = true, Message = "شیفت کاری را انتخاب نمایید" };

                var _model = new PubUser_ShiftVm
                {
                    PuUser_Id = entity.PuUser_Id,
                    ShiftWork_Id = entity.ShiftWork_Id,
                };

                await Save_UserShift(_model);

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> SetShiftWorkforAllPerson(PubUser_ShiftVm entity)
        {
            try
            {
                if (entity.ShiftWork_Id == 0) return new DataModelResult { Error = true, Message = "شیفت کاری را انتخاب نمایید" };


                var _users = (await _repoPubUser.Get(x => x.IsDeleted == false)).ToList();

                foreach (var item in _users)
                {
                    var _model = new PubUser_ShiftVm
                    {
                        PuUser_Id = item.Id,
                        ShiftWork_Id = entity.ShiftWork_Id,
                    };

                    await Save_UserShift(_model);
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> SetShiftWorkforPersonNotHaveShift(PubUser_ShiftVm entity)
        {
            try
            {
                if (entity.ShiftWork_Id == 0) return new DataModelResult { Error = true, Message = "شیفت کاری را انتخاب نمایید" };

                var _users = (await _repoPubUser.Get(x => x.IsDeleted == false)).ToList();
                foreach (var item in _users)
                {
                    if (!(await _repoPubUser_Shift.CustomAny(x => x.PuUser_Id == item.Id)))
                    {
                        var _model = new PubUser_ShiftVm
                        {
                            PuUser_Id = item.Id,
                            ShiftWork_Id = entity.ShiftWork_Id,
                        };
                        await Save_UserShift(_model);
                    }
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion

    }
}
