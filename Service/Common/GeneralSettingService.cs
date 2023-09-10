using AutoMapper;
using Repository.iContext;
using Repository.Infrastructure;
using Repository.Model.Common;
using Repository.Model;
using Repository;
using Service.BasicInfo;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.PublicEnum;
using Utility;
using ViewModel.Common;
using ViewModel.Report;
using System.Xml.Linq;
using System.ComponentModel;
using Utility.Utitlies;
using ViewModel.BasicInfo;
using Utility.Security;

namespace Service.Common
{
    public interface IGeneralSettingService
    {
        Task<bool> CheckTheraphies();
        Task<bool> CheckPatientImages();
        Task<GeneralSetting> GetSingle();
        Task<bool> checkAlarmBackupDate();
        Task<bool> CheckPatientPayments();
        Task<GeneralSettingVm> GetSmsSettingVm();
        Task<bool> CheckVisitTimeShowAndRequest();
        Task<GeneralSettingVm> GetGeneralSettingVm();
        Task<InformationGlobalReport> GetInfoGlobal();
        System.Threading.Tasks.Task DeleteImgSetting();
        List<NormalJsonClass> GetPaymentNameEnumList();
        System.Threading.Tasks.Task updateGeneralSettingWithBackUpDate();
        System.Threading.Tasks.Task SaveSmsSetting(GeneralSettingVm model);
        System.Threading.Tasks.Task SaveAvaSetting(GeneralSettingVm model);
        Task<DataModel> SaveGeneralSetting(GeneralSettingVm model, string serverPath, string LocalPath);
        Task<DataModel> UpdateActivationLisc(string activationLisc);
    }
    public class GeneralSettingService : IGeneralSettingService
    {
        private IRepository<GeneralSetting> _repo;
        private IFileService _fileService;
        public GeneralSettingService(
            IContextFactory contextFactory,
            IRepository<GeneralSetting> repo,
            IFileService fileService
            )
        {
            var currentcontext = contextFactory.GetContext();

            _repo = repo;
            _repo.FrameworkContext = currentcontext;

            _fileService = fileService;

        }

        public async Task<GeneralSettingVm> GetGeneralSettingVm()
        {
            //سطح دسترسی به medicalcenterId
            var setting = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();
            if (setting == null)
            {
                var model = new GeneralSettingVm();
                return model;
            }
            else
            {
                var settingGeneral = (await _repo.Find(setting.Id));
                Mapping.GenericMapping<GeneralSetting, GeneralSettingVm>.CreateMapping();
                var model = Mapping.GenericMapping<GeneralSetting, GeneralSettingVm>.Map(settingGeneral);

                var taskService = EngineContext.Resolve<IGenericAttributeService>();
                model.HostUrl = await taskService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.HostURL);


                if (settingGeneral.FileId != null)
                {
                    try { model.Img = (await _fileService.Find((Guid)model.FileId)).Path; }
                    catch { model.Img = ""; }
                }
                return model;
            }
        }
        public async Task<InformationGlobalReport> GetInfoGlobal()
        {
            var generalSetting = await _repo.First(m => m.IsDeleted == false);
            var model = new InformationGlobalReport
            {
                Name = generalSetting.NameClinic,
                NameEn = generalSetting.Title,
                Address = generalSetting.Address,
                Fax = generalSetting.Fax,
                Tell = generalSetting.Phone,
                Appmoneyunit = generalSetting.appmoneyunit
            };
            return model;
        }
        public async Task<GeneralSettingVm> GetSmsSettingVm()
        {
            var setting = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();

            var model = Mapping.GenericMapping<GeneralSetting, GeneralSettingVm>.Map(setting);
            if (model.FileId != null)
            {
                var _path = (await _fileService.Find((Guid)model.FileId));
                if (_path != null)
                    model.Img = _path.Path;
            }

            if (Public.CurrentUser.IsWhatsAppKit)
            {
                var _genericService = EngineContext.Resolve<IGenericAttributeService>();
                var _serviceAddress = _genericService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_ServiceAddress).Result;
                var _senderNumber = _genericService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_SenderNumber).Result;
                var _key = _genericService.GetAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_Key).Result;

                model.WhatsApp_ServiceAddress = _serviceAddress;
                model.WhatsApp_SenderNumber = _senderNumber;
                model.WhatsApp_Key = _key;
            }

            return model;
        }
        public async Task<bool> CheckPatientImages()
        {
            bool pi = (await _repo.Get(x => x.IsDeleted == false)).FirstOrDefault().PatientImages;
            return pi;
        }
        public async Task<bool> CheckPatientPayments()
        {
            bool pi = (await _repo.Get(x => x.IsDeleted == false)).FirstOrDefault().PatientPayments;
            return pi;
        }
        public async Task<bool> CheckTheraphies()
        {
            bool pi = (await _repo.Get(x => x.IsDeleted == false)).FirstOrDefault().Theraphies;
            return pi;
        }
        public async Task<bool> CheckVisitTimeShowAndRequest()
        {
            bool pi = (await _repo.Get(x => x.IsDeleted == false)).FirstOrDefault().CheckVisitTimeShowAndRequest;
            return pi;
        }
        public async Task<bool> checkAlarmBackupDate()
        {
            var q = await GetGeneralSettingVm();
            int day = q.Backup.HasValue ? q.Backup.Value : 0;
            if (day != 0)
            {
                var total = (q.BackupDate.AddDays(day) - DateTime.Now).TotalDays;
                return (total < 0) ? true : false;
            }
            return false;
        }
        public async System.Threading.Tasks.Task updateGeneralSettingWithBackUpDate()
        {
            var setting = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();
            setting.BackupDate = DateTime.Now;
            await _repo.Update(setting);
        }
        public async Task<DataModel> SaveGeneralSetting(GeneralSettingVm model, string serverPath, string LocalPath)
        {
            try
            {

                if (string.IsNullOrEmpty(model.ActivationLisc)) return new DataModel { error = true, message = "کد فعالسازی را وارد نمایید" };


                string _data = StringCipher.Decrypt(model.ActivationLisc);
                string[] _dataSplit = _data.Split(':');
                var _expireDate = DateTimeOperation.S2M(_dataSplit[1]);
                if (DateTime.Now.Date <= _expireDate.Date)
                {
                    Public.CurrentUser.ActivationLisc = model.ActivationLisc;
                }
                else
                {
                    return new DataModel { error = true, message = "کد فعالسازی منقضی شده است" };
                }






                var taskService = EngineContext.Resolve<IGenericAttributeService>();
                await taskService.SaveAttribute<string>(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.HostURL, model.appHostIp + ":" + model.appHostPort);


                var setting = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();
                if (model.File != null)
                {
                    var fileVm = await _fileService.AddFileWithHttpPostedFilePath(model.File, serverPath, LocalPath, "Employee");
                    setting.FileId = fileVm.Id;
                    model.FileId = fileVm.Id;
                }
                if (setting == null) /* add new record.  */
                {
                    //Old Code
                    //Mapping.GenericMapping<ServiceInfoVm, ServiceInfo>.CreateMapping();
                    //Mapping.GenericMapping<GeneralSettingVm, GeneralSetting>.CreateMapping();
                    //var list = Mapping.GenericMapping<GeneralSettingVm, GeneralSetting>.Map(model);


                    // New Code
                    var list = Mapping.GenericMapping<GeneralSettingVm, GeneralSetting>.Map(model);

                    list.BackupDate = model.BackupDate == DateTime.Parse("1/1/0001 12:00:00 AM") ? DateTime.Now : model.BackupDate;
                    list.appID = model.appID;
                    list.IsDeleted = false;
                    list.ModifiedDate = DateTime.Now;
                    await _repo.Add(list);
                }
                else /* update.  */
                {
                    setting.lengthPhone = model.lengthPhone;
                    setting.NameClinic = model.NameClinic;

                    setting.Phone = model.Phone;
                    setting.Mobile = model.Mobile;
                    setting.StartNumber = model.StartNumber;
                    setting.TimeReminder = model.TimeReminder;
                    setting.Title = model.Title;
                    setting.WebSite = model.WebSite;


                    setting.Address = model.Address;
                    setting.Appointment = model.Appointment;
                    setting.Backup = model.Backup;
                    setting.BackupDate = DateTime.Now;
                    setting.ChangeCostBase = model.ChangeCostBase;
                    setting.CityCode = model.CityCode;
                    setting.Log = model.Log;
                    setting.CountryCode = model.CountryCode;
                    setting.Email = model.Email;
                    setting.Fax = model.Fax;
                    setting.IsDeleted = false;
                    setting.ModifiedDate = DateTime.Now;
                    setting.appAwardDrPercent = model.appAwardDrPercent;
                    setting.appAwardPercent = model.appAwardPercent;
                    setting.VisitInterval = model.VisitInterval;
                    setting.Comment = model.Comment;
                    setting.appExpireAlarmDay = model.appExpireAlarmDay;
                    setting.appmoneyunit = model.appmoneyunit;
                    setting.appshowassistname = model.appshowassistname;
                    setting.appshowdocname = model.appshowdocname;
                    setting.appshowzeroprice = model.appshowzeroprice;
                    setting.appshowzeropriceforins = model.appshowzeropriceforins;
                    setting.appHostIp = model.appHostIp;
                    setting.appHostPort = model.appHostPort;
                    setting.IsShowAlarmTypeSickness = model.IsShowAlarmTypeSickness;
                    setting.PaymentName = model.PaymentName;

                    setting.ActivationLisc = model.ActivationLisc;


                    await _repo.Update(setting);
                }

                return new DataModel();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async System.Threading.Tasks.Task SaveSmsSetting(GeneralSettingVm model)
        {
            try
            {

                var sms = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();
                sms.appAutoSmsSend = model.appAutoSmsSend;
                sms.appSmsAutoSendInterval = model.appSmsAutoSendInterval;
                sms.appAutoSmsTime = model.appAutoSmsTime;
                sms.appSmsRefreshTime = model.appSmsRefreshTime;
                sms.appBackupAlarmDay = model.appBackupAlarmDay;
                sms.appSmsWebUN = model.appSmsWebUN;
                sms.appSmsWebPW = model.appSmsWebPW;
                sms.appSmsWebPN = model.appSmsWebPN;
                sms.appBirthDateSmsTime = model.appBirthDateSmsTime;
                sms.appCheckAlarmSMS = model.appCheckAlarmSMS;
                sms.appSendPaySMS = model.appSendPaySMS;
                sms.appSmsAdvertising = model.appSmsAdvertising;
                sms.appSmsAppointment = model.appSmsAppointment;
                sms.appSmsAutoSendInterval = model.appSmsAutoSendInterval;
                sms.appSmsBilling = model.appSmsBilling;
                sms.appSmsBirthday = model.appSmsBirthday;
                sms.appSmsCeckReminded = model.appSmsCeckReminded;
                sms.appSmsDebtor = model.appSmsDebtor;
                sms.appSmsSemiKars = model.appSmsSemiKars;
                sms.appSmsFlvap = model.appSmsFlvap;
                sms.appSmsResponding = model.appSmsResponding;
                sms.appSmsAdvertising = model.appSmsAdvertising;
                sms.appSmsWelcome = model.appSmsWelcome;
                sms.appCareAlarmSMS = model.appCareAlarmSMS;
                sms.appCheckAlarmPatSMS = model.appCheckAlarmPatSMS;
                sms.appSmsCeckClinic = model.appSmsCeckClinic;
                sms.appSmsRecommendations = model.appSmsRecommendations;
                sms.SenderTypeSMS = model.SenderTypeSMS;
                sms.Asanak_ApiKey = model.Asanak_ApiKey;

                sms.Faraz_Password = model.Faraz_Password;
                sms.Faraz_SourceNumber = model.Faraz_SourceNumber;
                sms.Faraz_Username = model.Faraz_Username;
                sms.Faraz_Enable = model.Faraz_Enable;
                sms.Asanak_Enable = model.Asanak_Enable;

                await _repo.Update(sms);


                if (Public.CurrentUser.IsWhatsAppKit)
                {
                    var _genericService = EngineContext.Resolve<IGenericAttributeService>();

                    await _genericService.SaveAttribute(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_ServiceAddress, model.WhatsApp_ServiceAddress);
                    await _genericService.SaveAttribute(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_SenderNumber, model.WhatsApp_SenderNumber);
                    await _genericService.SaveAttribute(new BaseClass { Id = Guid.Empty }, GenericAttributeDefault.WhatsApp_Key, model.WhatsApp_Key);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async System.Threading.Tasks.Task SaveAvaSetting(GeneralSettingVm model)
        {
            var sms = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();

            sms.appCareAlarmSMS = model.appCareAlarmSMS;
            sms.appCheckAlarmPatSMS = model.appCheckAlarmPatSMS;
            sms.appCheckAlarmSMS = model.appCheckAlarmSMS;
            sms.appBirthDateSmsTime = model.appBirthDateSmsTime;
            sms.appSmsWelcome = model.appSmsWelcome;
            sms.appSendPaySMS = model.appSendPaySMS;

            await _repo.Update(sms);
        }
        public async System.Threading.Tasks.Task DeleteImgSetting()
        {
            var setting = (await _repo.Get(m => !m.IsDeleted)).FirstOrDefault();
            setting.FileId = null;
            await _repo.Commit();
        }
        public async Task<GeneralSetting> GetSingle()
        {
            var q = await _repo.First(x => x.IsDeleted == false);
            return q;
        }
        public List<NormalJsonClass> GetPaymentNameEnumList()
        {
            return Utility.EXT.EnumHelper<PaymentNameEnum>.EnumToNormalJsonClass();
        }


        public async Task<DataModel> UpdateActivationLisc(string activationLisc)
        {
            try
            {
                if (string.IsNullOrEmpty(activationLisc)) return new DataModel { error = true, message = "کد فعالسازی را وارد نمایید" };

                string _data = StringCipher.Decrypt(activationLisc);

                string[] _dataSplit = _data.Split(':');
                var _expireDate = DateTimeOperation.S2M(_dataSplit[1]);
                if (DateTime.Now.Date > _expireDate.Date)
                {
                    return new DataModel { error = true, message = "کد فعالسازی منقضی شده است" };
                }
                else
                {
                    Public.CurrentUser.ActivationLisc = activationLisc;
                }

                var _query = $"update tbl_Application set ActivationLisc = '{activationLisc}'";
                await _repo.ExecuteSqlCommand(_query);
                return new DataModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
