using Mapping;
using Repository.iContext;
using Repository.Model;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModel.UserManagement.Attendance;
using ViewModel.Attendance;
using Repository.Model.Attendance;
using Service.Consts;

namespace Service.Attendance
{
    public interface IDeviceInfoService
    {

        Task<DataModelResult> Save(NewDeviceVm entity);

        Task<NewDeviceVm> GetDeviceInfo(int? id);

        Task<NewDevice> GetDeviceInfobyCode(int? code);

        Task<DataModelResult> DeleteDevice(int? id);

        Task<List<NewDeviceVm>> GetAllDevice();

        Task<DataModelResult> UpdateLastTimeReport(NewDevice entity);

        Task<DataModelResult> GetLastTimeReport(NewDeviceVm entity);

        Task<DataModelResult> GetVerifyStatus(NewDevice device, int verifyStat);

        Task<DataModelResult> UpdateDeviceAutoRecive(NewDeviceVm entity);

        Task<DataModelResult> UpdateDeviceCapacity(NewDeviceVm entity);

        Task<List<DeviceGroupVm>> GetAllDeviceGroup(PagingViewModel value);

        Task<DataModelResult> Delete_DeviceGroup(int? Id);

        Task<DeviceGroupVm> GetDeviceGroup(int? id);

        Task<DeviceGroup> Save_DeviceGroup(DeviceGroupVm entity);

        Task<DataModelResult> UpdateDeviceIP(NewDeviceVm entity);

        Task<DataModelResult> LoadDeviceList();

        Task<DataModelResult> ImportAllAttLogFromDevice(int Id);

        Task<DataModelResult> ClearAdmin(int Id);

        Task<DataModelResult> ClearAllData(int Id);

        Task<DataModelResult> ClearAllLogs(int Id);

        Task<DataModelResult> ClearAllFp(int Id);

        Task<DataModelResult> ClearAllUser(int Id);

        Task<DataModelResult> ConnectDevice(int Id);

        Task<DataModelResult> DisConnectDevice(int Id);


    }
    public class DeviceInfoService : IDeviceInfoService
    {
        private IRepository<NewDevice> _repoNewDevice;
        private IRepository<DeviceGroup> _repoDeviceGroup;
        public Context _context;

        public DeviceInfoService(
            IContextFactory contextFactory,
            IRepository<NewDevice> repoNewDevice,
            IRepository<DeviceGroup> repoDeviceGroup)
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;


            _repoNewDevice = repoNewDevice;
            _repoNewDevice.FrameworkContext = currentcontext;
            _repoNewDevice.DbFactory = contextFactory;


            _repoDeviceGroup = repoDeviceGroup;
            _repoDeviceGroup.FrameworkContext = currentcontext;
            _repoDeviceGroup.DbFactory = contextFactory;
        }



        #region Device Information
        public async Task<DataModelResult> Save(NewDeviceVm entity)
        {
            try
            {
                var _device = await GetDeviceInfobyCode(entity.Code);
                #region Add
                var _model = Mapping.GenericMapping<NewDeviceVm, NewDevice>.Map(entity);

                if (entity.Id == 0)
                {
                    if (_device == null)
                        await _repoNewDevice.AddInt(_model);
                    else return new DataModelResult { Error = true, Message = "کد دستگاه تکراری است!" };
                }
                #endregion

                #region Edit
                else
                {
                    var _oldentity = await _repoNewDevice.Find(entity.Id);
                    if (_device == null || (_device != null && _device.Id == entity.Id))
                    {
                        await _repoNewDevice.Detached(_model);
                        await _repoNewDevice.Detached(_oldentity);
                        await _repoNewDevice.Update(_model, _oldentity);
                    }
                    else
                    {
                        return new DataModelResult { Error = true, Message = "کد دستگاه تکراری است!" };
                    }
                }
                #endregion


                await LoadDeviceList();

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> UpdateDeviceIP(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" update NewDevice set [IP] = N'{0}' where idn = N'{1}' ", entity.IP, entity.Id);
                await _repoNewDevice.ExecuteSqlCommand(_query);

                await LoadDeviceList();

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public async Task<NewDeviceVm> GetDeviceInfo(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new NewDeviceVm();
                }
                else
                {
                    var model = await _repoNewDevice.Find(id.Value);
                    return GenericMapping<NewDevice, NewDeviceVm>.Map(model);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<NewDevice> GetDeviceInfobyCode(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new NewDevice();
                }
                else
                {
                    var model = (await _repoNewDevice.Get(x => x.Code == id.Value && x.IsDeleted == false)).FirstOrDefault();
                    return model;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> GetVerifyStatus(NewDevice device, int verifyStat)
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
        public async Task<DataModelResult> DeleteDevice(int? id)
        {
            try
            {
                var _entity = await _repoNewDevice.Find(id.Value);
                if (_entity != null)
                {
                    var _query = string.Format(@" update NewDevice set IsDeleted = '1' where Id ='{0}' ", id);
                    await _repoNewDevice.ExecuteSqlCommand(_query);

                    await LoadDeviceList();
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<NewDeviceVm>> GetAllDevice()
        {
            try
            {
                var _query = string.Format(@" select * from NewDevice where IsDeleted = '0' order by Name");

                var _res = (await _repoNewDevice.RunQuery<NewDeviceVm>(_query)).ToList();

                return _res;
            }
            catch (Exception ex)
            {
                return new List<NewDeviceVm>();
            }
        }
        public async Task<DataModelResult> UpdateDeviceCapacity(NewDeviceVm entity)
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
                    entity.Id
                    );
                await _repoNewDevice.ExecuteSqlCommand(_query);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> UpdateLastTimeReport(NewDevice entity)
        {
            try
            {
                var _device = (await _repoNewDevice.Get(x => x.Code == entity.Code)).FirstOrDefault();
                if (_device != null)
                {
                    var _query = string.Format(@"update NewDevice set LastTimeExport = N'{0}' where Code = N'{1}'", entity.LastTimeExport, entity.Code);
                    await _repoNewDevice.ExecuteSqlCommand(_query);
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> GetLastTimeReport(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" select LastTimeExport from NewDevice where Code = N'{0}' ", entity.Code);
                return new DataModelResult { Message = await _repoNewDevice.RunQuery_Str(_query) };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> UpdateDeviceAutoRecive(NewDeviceVm entity)
        {
            try
            {
                var _query = string.Format(@" update NewDevice set GetAutoData = {0} where idn = '{1}' ",
                    (entity.GetAutoData == true ? "1" : "0"), entity.Id);
                await _repoNewDevice.ExecuteSqlCommand(_query);
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = false, Message = ex.Message };
            }
        }


        public async Task<DataModelResult> LoadDeviceList()
        {
            var _device = await GetAllDevice();
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
            return new DataModelResult();
        }

        public async Task<DataModelResult> ImportAllAttLogFromDevice(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.Run_ImportAllAttLogFromDevice();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DataModelResult> ConnectDevice(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ConnectTCP();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> DisConnectDevice(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_DisConnect();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<DataModelResult> ClearAdmin(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ClearAdmin();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> ClearAllUser(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ClearAllUsers();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> ClearAllFp(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ClearAllFps();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> ClearAllLogs(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ClearAllLogs();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> ClearAllData(int Id)
        {
            try
            {
                var _deviceVm = FingerPrintDeviceService.Devices.Where(x => x.deviceVm.Id == Id).FirstOrDefault();
                var _result = _deviceVm.sDK.sta_ClearAllData();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        #endregion



        #region User Group
        public async Task<DeviceGroupVm> GetDeviceGroup(int? id)
        {
            try
            {
                if (id == null)
                {
                    return new DeviceGroupVm();
                }
                else
                {
                    var model = (await _repoDeviceGroup.Get(x => x.Id == id.Value)).FirstOrDefault();
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
        public async Task<List<DeviceGroupVm>> GetAllDeviceGroup(PagingViewModel value)
        {
            try
            {
                var _res = (from item in (await _repoDeviceGroup.Get(x => x.IsDelete == false)).OrderBy(x => x.GroupTitle).ToList()
                            select new DeviceGroupVm
                            {
                                GroupTitle = item.GroupTitle,
                                GroupExplain = item.GroupExplain,
                                Id = item.Id,
                                IsDelete = item.IsDelete,
                                ModifiedDate = item.ModifiedDate

                            }).ToList().OrderBy(x => x.GroupTitle).ToList();

                return _res;
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return new List<DeviceGroupVm>();
        }
        public async Task<DeviceGroup> Save_DeviceGroup(DeviceGroupVm entity)
        {
            try
            {
                #region Add
                var _model = new DeviceGroup();
                entity.ModifiedDate = DateTime.Now;
                if (entity.Id == 0)
                {
                    entity.IsDelete = false;
                    await _repoDeviceGroup.Add(Mapping.GenericMapping<DeviceGroupVm, DeviceGroup>.Map(entity));
                }
                #endregion

                #region Edit
                else
                {
                    var _user = (await _repoDeviceGroup.Find(entity.Id));
                    if (_user != null)
                    {
                        _user.Id = entity.Id;
                        _user.GroupTitle = entity.GroupTitle;
                        _user.GroupExplain = entity.GroupExplain;
                        _user.ModifiedDate = entity.ModifiedDate;

                        await _repoDeviceGroup.Detached(_user);
                        await _repoDeviceGroup.Update(_user);
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
        public async Task<DataModelResult> Delete_DeviceGroup(int? Id)
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


    }
}
