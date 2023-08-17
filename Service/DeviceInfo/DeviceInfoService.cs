using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DeviceInfo
{
    public interface IDeviceInfoService
    {
        DataModelResult Save(NewDevice entity);
        NewDevice GetDeviceInfo(int? id);
        NewDevice GetDeviceInfobyCode(int? code);
        bool DeleteDevice(int? id);
        List<NewDeviceVm> GetAllDevice();
        DataModelResult UpdateLastTimeReport(NewDevice entity);
        DataModelResult GetLastTimeReport(NewDeviceVm entity);
        DataModelResult GetVerifyStatus(NewDevice device, int verifyStat);
        DataModelResult UpdateDeviceAutoRecive(NewDeviceVm entity);

        DataModelResult UpdateDeviceCapacity(NewDeviceVm entity);


        List<DeviceGroupVm> GetAllDeviceGroup(PagingViewModel value);
        List<DeviceTransactionEventVm> GetDeviceTransactionList(PagingViewModel value);
        List<DeviceTransactionEventVm> GetDeviceTransferUsersList(PagingViewModel value);


        DataModelResult Delete_DeviceGroup(int? Id);
        DeviceGroupVm GetDeviceGroup(int? id);
        DeviceGroup Save_DeviceGroup(DeviceGroupVm entity);


        DataModelResult AddEventLog(DeviceEventLog entity);
        List<DeviceEventLogVm> GetAllDeviceEventLog(ReportParameter value);
        DataModelResult DeleteEventLog(ReportParameter value);
        DataModelResult UpdateDeviceIP(NewDeviceVm entity);
    }
    public class DeviceInfoService : IDeviceInfoService
    {
        private IRepository<NewDevice> _repoNewDevice;
        private IRepository<DeviceEventLog> _repoDeviceEventLog;
        private IRepository<DeviceGroup> _repoDeviceGroup;
        public Context _context;

        public DeviceInfoService(IContextFactory contextFactory,
            IRepository<NewDevice> repoNewDevice,
            IRepository<DeviceEventLog> repoDeviceEventLog,
            IRepository<DeviceGroup> repoDeviceGroup)
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;


            _repoNewDevice = repoNewDevice;
            _repoNewDevice.FrameworkContext = currentcontext;
            _repoNewDevice.DbFactory = contextFactory;


            _repoDeviceEventLog = repoDeviceEventLog;
            _repoDeviceEventLog.FrameworkContext = currentcontext;
            _repoDeviceEventLog.DbFactory = contextFactory;


            _repoDeviceGroup = repoDeviceGroup;
            _repoDeviceGroup.FrameworkContext = currentcontext;
            _repoDeviceGroup.DbFactory = contextFactory;
        }


        #region Device Information
        public DataModelResult Save(NewDevice entity)
        {
            try
            {
                var _device = GetDeviceInfobyCode(entity.Code);
                #region Add
                var _model = new NewDevice();
                if (entity.idn == 0)
                {
                    if (_device == null)
                        _model = _repoNewDevice.Add(entity, CurrentUser.CurrentUserS.UserName, CurrentUser.CurrentUserS.Id);
                    else return new DataModelResult { Error = true, Message = "کد دستگاه تکراری است!" };
                }
                #endregion
                #region Edit
                else
                {
                    var _oldentity = _repoNewDevice.FindBy(x => x.idn == entity.idn);
                    if (_device == null || (_device != null && _device.idn == entity.idn))
                    {
                        _repoNewDevice.Detached(entity);
                        _repoNewDevice.Detached(_oldentity);
                        _repoNewDevice.Update(entity, _oldentity, CurrentUser.CurrentUserS.UserName, CurrentUser.CurrentUserS.Id);
                    }
                    else
                    {
                        return new DataModelResult { Error = true, Message = "کد دستگاه تکراری است!" };
                    }
                }
                #endregion
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public DataModelResult UpdateDeviceIP(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" update NewDevice set [IP] = N'{0}' where idn = N'{1}' ", entity.IP, entity.idn);
                _repoNewDevice.ExecuteSqlCommand(_query);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public NewDevice GetDeviceInfo(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new NewDevice();
                }
                else
                {
                    var model = _repoNewDevice.FindById(id.Value);
                    return model;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public NewDevice GetDeviceInfobyCode(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new NewDevice();
                }
                else
                {
                    var model = _repoNewDevice.FindBy(x => x.Code == id.Value && x.IsDelete == false);
                    return model;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataModelResult GetVerifyStatus(NewDevice device, int verifyStat)
        {
            try
            {
                int _khorouj = Convert.ToInt32(device.khorojCode);
                int _voroud = Convert.ToInt32(device.VorodCode);
                int _morkhasi = Convert.ToInt32(device.MorakhasiCode);
                int _mamoriyat = Convert.ToInt32(device.MamoriyatCode);

                if (verifyStat == _khorouj) return new DataModelResult { Message = "خروج" };
                if (verifyStat == _voroud) return new DataModelResult { Message = "ورود" };
                if (verifyStat == _morkhasi) return new DataModelResult { Message = "مرخصی" };
                if (verifyStat == _mamoriyat) return new DataModelResult { Message = "ماموریت" };

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Message = ex.Message, Error = true };
            }
        }
        public bool DeleteDevice(int? id)
        {
            try
            {
                var _entity = _repoNewDevice.FindBy(x => x.idn == id.Value);
                if (_entity != null)
                {
                    var _query = string.Format(@" update NewDevice set IsDelete = '1' where idn ='{0}' ", id);
                    _repoNewDevice.ExecuteSqlCommand(_query);

                    _entity.IsDelete = true;
                    _repoNewDevice.NewDevice_EventLog(_entity, 'D', CurrentUser.CurrentUserS.UserName, CurrentUser.CurrentUserS.Id, _entity);

                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<NewDeviceVm> GetAllDevice()
        {
            try
            {
                var _query = string.Format(@" select * from NewDevice where IsDelete = '0' order by Name");

                var _res = _repoNewDevice.RunQuery<NewDeviceVm>(_query).ToList();


                //var _res = (from item in _repoNewDevice.GetAll(x => x.IsDelete == false)
                //            select new NewDeviceVm
                //            {
                //                Code = item.Code,
                //                idn = item.idn,
                //                IP = item.IP,
                //                khorojCode = item.khorojCode,
                //                Laststatus = item.Laststatus,
                //                LastTimeExport = item.LastTimeExport,
                //                MamoriyatCode = item.MamoriyatCode,
                //                MorakhasiCode = item.MorakhasiCode,
                //                Naharcode = item.Naharcode,
                //                Name = item.Name,
                //                Pass = item.Pass,
                //                port = item.port,
                //                GroupId = item.GroupId,
                //                TaradodCode = item.TaradodCode,
                //                VorodCode = item.VorodCode,
                //                GetAutoData = item.GetAutoData,
                //                SerialNumber = item.SerialNumber
                //            }).ToList();
                if (!Consts.CurrentUser.CurrentUserS.IsAdministrator)
                    _res = _res.Where(x => Consts.CurrentUser.CurrentUserS.pubUser_DeviceGroups.Any(z => z.DeviceGroup_Id == x.GroupId)).ToList();
                return _res;
            }
            catch (Exception ex)
            {
                return new List<NewDeviceVm>();
            }
        }
        public DataModelResult UpdateDeviceCapacity(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(" UPDATE [dbo].[NewDevice] " +
                    "\n SET [adminCnt] = {0}, " +
                    "\n [userCount] = {1}, " +
                    "\n [fpCnt] = {2}, " +
                    "\n [recordCnt] = {3}, " +
                    "\n [pwdCnt] = {4}, " +
                    "\n [oplogCnt] = {5}, " +
                    "\n [faceCnt] = {6} " +
                    "\n WHERE idn = N'{7}' ",
                    entity.adminCnt != null ? "'" + entity.adminCnt + "'" : "NULL",
                    entity.userCount != null ? "'" + entity.userCount + "'" : "NULL",
                    entity.fpCnt != null ? "'" + entity.fpCnt + "'" : "NULL",
                    entity.recordCnt != null ? "'" + entity.recordCnt + "'" : "NULL",
                    entity.pwdCnt != null ? "'" + entity.pwdCnt + "'" : "NULL",
                    entity.oplogCnt != null ? "'" + entity.oplogCnt + "'" : "NULL",
                    entity.faceCnt != null ? "'" + entity.faceCnt + "'" : "NULL",
                    entity.idn
                    );
                _repoNewDevice.ExecuteSqlCommand(_query);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public DataModelResult UpdateLastTimeReport(NewDevice entity)
        {
            try
            {
                var _device = _repoNewDevice.FindBy(x => x.Code == entity.Code);
                if (_device != null)
                {
                    var _query = string.Format(@"update NewDevice set LastTimeExport = N'{0}' where Code = N'{1}'", entity.LastTimeExport, entity.Code);
                    _repoNewDevice.ExecuteSqlCommand(_query);
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public DataModelResult GetLastTimeReport(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" select LastTimeExport from NewDevice where Code = N'{0}' ", entity.Code);
                return new DataModelResult { Message = _repoNewDevice.RunQuery_Str(_query) };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public DataModelResult UpdateDeviceAutoRecive(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" update NewDevice set GetAutoData = {0} where idn = '{1}' ",
                    (entity.GetAutoData == true ? "1" : "0"), entity.idn);
                _repoNewDevice.ExecuteSqlCommand(_query);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        #endregion

        #region User Group

        public DeviceGroupVm GetDeviceGroup(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new DeviceGroupVm();
                }
                else
                {
                    var model = (_repoDeviceGroup.GetAll(x => x.Id == id.Value)).FirstOrDefault();
                    var _modelVm = GenericMapping<DeviceGroup, DeviceGroupVm>.Map(model);
                    return _modelVm;
                }
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new DeviceGroupVm();
        }
        public List<DeviceGroupVm> GetAllDeviceGroup(PagingViewModel value)
        {
            try
            {
                var _res = (from item in _repoDeviceGroup.GetAll(x => x.IsDelete == false).OrderBy(x => x.GroupTitle).ToList()
                            select new DeviceGroupVm
                            {
                                GroupTitle = item.GroupTitle,
                                GroupExplain = item.GroupExplain,
                                Id = item.Id,
                                IsDelete = item.IsDelete,
                                ModifiedDate = item.ModifiedDate

                            }).ToList().OrderBy(x => x.GroupTitle).ToList();
                if (!CurrentUser.CurrentUserS.IsAdministrator && _res != null && _res.Count > 0)
                    _res = _res.Where(x => CurrentUser.CurrentUserS.pubUser_DeviceGroups.Any(z => z.DeviceGroup_Id == x.Id)).ToList();
                return _res;
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new List<DeviceGroupVm>();
        }
        public List<DeviceTransactionEventVm> GetDeviceTransactionList(PagingViewModel value)
        {
            try
            {
                var _query = string.Format("select DISTINCT TransactionPeriod, MAX(ModifiedDate) as ModifiedDate " +
                    "\n from DeviceTransactionEvent " +
                    "\n where TransactionType = 1 " +
                    "\n group by TransactionPeriod " +
                    "\n order by MAX(ModifiedDate) desc, TransactionPeriod");
                var _res = _repoDeviceEventLog.RunQuery<DeviceTransactionEventVm>(_query).ToList();

                if (_res != null && _res.Count > 0)
                {
                    var _index = 1;
                    foreach (var item in _res)
                    {
                        item.LastTransaction_Date = item.ModifiedDate;
                        item.Title = "سری - " + _index + " - " + item.LastTransaction_DateStr + " " + item.LastTransaction_TiemStr;
                        _index++;
                    }
                }
                return _res != null ? _res : new List<DeviceTransactionEventVm>();
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new List<DeviceTransactionEventVm>();
        }
        public List<DeviceTransactionEventVm> GetDeviceTransferUsersList(PagingViewModel value)
        {
            try
            {
                var _query = string.Format("select DISTINCT TransactionPeriod, MAX(ModifiedDate) as ModifiedDate " +
                    "\n from DeviceTransactionEvent " +
                    "\n where TransactionType = 2 " +
                    "\n group by TransactionPeriod " +
                    "\n order by MAX(ModifiedDate) desc, TransactionPeriod");
                var _res = _repoDeviceEventLog.RunQuery<DeviceTransactionEventVm>(_query).ToList();

                if (_res != null && _res.Count > 0)
                {
                    var _index = 1;
                    foreach (var item in _res)
                    {
                        item.LastTransaction_Date = item.ModifiedDate;
                        item.Title = "سری - " + _index + " - " + item.LastTransaction_DateStr + " " + item.LastTransaction_TiemStr;
                        _index++;
                    }
                }
                return _res != null ? _res : new List<DeviceTransactionEventVm>();
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new List<DeviceTransactionEventVm>();
        }
        public DeviceGroup Save_DeviceGroup(DeviceGroupVm entity)
        {
            try
            {
                #region Add
                var _model = new DeviceGroup();
                entity.ModifiedDate = DateTime.Now;
                if (entity.Id == 0)
                {
                    entity.IsDelete = false;
                    _model = _repoDeviceGroup.Add(Data.Mapping.GenericMapping<DeviceGroupVm, DeviceGroup>.Map(entity));
                }
                #endregion

                #region Edit
                else
                {
                    var _user = _repoDeviceGroup.FindBy(x => x.Id == entity.Id);
                    if (_user != null)
                    {
                        _user.Id = entity.Id;
                        _user.GroupTitle = entity.GroupTitle;
                        _user.GroupExplain = entity.GroupExplain;
                        _user.ModifiedDate = entity.ModifiedDate;

                        _repoDeviceGroup.Detached(_user);
                        _repoDeviceGroup.Update(_user);
                        _model.Id = _user.Id;
                    }
                }
                #endregion


                return _model;
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new DeviceGroup();
        }
        public DataModelResult Delete_DeviceGroup(int? Id)
        {
            try
            {
                if (Id != 0 && Id != null)
                {
                    var _query = string.Format(@" update DeviceGroup set IsDelete = '1' where Id ='{0}' ", Id);
                    _repoDeviceGroup.ExecuteSqlCommand(_query);
                    //_repoPubUser.Delete(x => x.ID == Id.Value);
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new DataModelResult() { Error = true };
        }

        #endregion

        #region EventLog
        public DataModelResult AddEventLog(DeviceEventLog entity)
        {
            try
            {
                if (entity == null) return new DataModelResult();

                var _query = string.Format("INSERT INTO [dbo].[DeviceEventLog] " +
                                            "([DeviceId],[LogData],[ModifiedDate],[IsDelete],[PubUserId]) " +
                                            "VALUES (N'{0}',N'{1}',GETDATE(),N'0',N'{2}')",
                                            entity.DeviceId,
                                            entity.LogData,
                                            entity.PubUserId
                                            );
                _repoDeviceEventLog.ExecuteSqlCommand(_query);
                //_repoDeviceEventLog.Add(entity);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public List<DeviceEventLogVm> GetAllDeviceEventLog(ReportParameter value)
        {
            try
            {
                var _query = string.Format(@" declare @From AS int = {0} "
                                            + "\n declare @To AS int = {1} "
                                            + "\n declare @deviceId as int = {2} "
                                            + "\n declare @fromDate dateTime = '{3}' "
                                            + "\n declare @toDate dateTime = '{4}'"
                                            + "\n declare @deviceGroupId int = {5}"
                                            + "\n ;WITH cte AS "
                                            + "\n ( "
                                            + "\n       SELECT  *, ROW_NUMBER() OVER (ORDER BY cte.ModifiedDate desc) AS RN "
                                            + "\n 	    from( "
                                            + "\n           select	DeviceEventLog.ModifiedDate, DeviceEventLog.Id, DeviceId, LogData, device.[Name] as DeviceName, ISNULL(device.GroupId, 0) as DeviceGroupId "
                                            + "\n           from	DeviceEventLog "
                                            + "\n           Left    Join NewDevice device on DeviceEventLog.DeviceId = device.idn "
                                            //+ "\n           Left	Join DeviceGroup devicegroup on device.GroupId = DeviceEventLog.DeviceId "
                                            + "\n           where	(DeviceId = @deviceId or @deviceId is null) "
                                            + "\n                 and (device.GroupId = @deviceGroupId or @deviceGroupId is null)"
                                            + "\n                 and (Cast(DeviceEventLog.ModifiedDate as date) >= Cast(@fromDate as date) or @fromDate is null) "
                                            + "\n                 and (Cast(DeviceEventLog.ModifiedDate as date) <= Cast(@toDate as date) or @toDate is null)"
                                            + "\n 	) cte "
                                            + "\n ) "
                                            + "\n     SELECT  * "
                                            + "\n FROM cte "
                                            + "\n WHERE RN BETWEEN @From AND @To",
                                            1,
                                            10000,
                                            (value.DeviceId > 0 ? "'" + value.DeviceId + "'" : "NULL"),
                                            value.FromDate.Value.ToString("yyyy-MM-dd"),
                                            value.ToDate.Value.ToString("yyyy-MM-dd"),
                                            (value.DeviceGroupId > 0 ? "'" + value.DeviceGroupId + "'" : "NULL")
                                            );
                var _res = _repoDeviceEventLog.RunQuery<DeviceEventLogVm>(_query).ToList();


                if (!CurrentUser.CurrentUserS.IsAdministrator && _res != null && _res.Count > 0)
                {
                    _res = _res.Where(x => CurrentUser.CurrentUserS.pubUser_DeviceGroups.Any(z => z.DeviceGroup_Id == x.DeviceGroupId)).ToList();
                }
                return _res;
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new List<DeviceEventLogVm>();
        }
        public DataModelResult DeleteEventLog(ReportParameter value)
        {
            try
            {
                var _query = string.Format(@"declare @fromDate dateTime = '{0}' "
                                            + " declare @toDate dateTime = '{1}' "
                                            + " declare @deviceId as int = {2} "
                                            + " delete	from	DeviceEventLog  "
                                            + " where	(DeviceId = @deviceId or @deviceId is null) "
                                            + " 		and (Cast(ModifiedDate as date) >= Cast(@fromDate as date) or @fromDate is null) "
                                            + "         and (Cast(ModifiedDate as date) <= Cast(@toDate as date) or @toDate is null)",
                                            value.FromDate,
                                            value.ToDate,
                                            (value.DeviceId > 0 ? "'" + value.DeviceId + "'" : "NULL")
                                            );
                _repoDeviceEventLog.ExecuteSqlCommand(_query);
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
