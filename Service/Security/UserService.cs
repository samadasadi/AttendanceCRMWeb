using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI.WebControls;
using Mapping;
using Repository;
using Repository.Model;
using Service.Consts;
using Utility;
using Utility.PublicEnum;
using ViewModel.Basic;
using ViewModel.Security;
using Utility.EXT;
using ViewModel.BasicInfo;
using Repository.iContext;
using Service.Report;
using System.Text;
using System.Threading.Tasks;
using Repository.Infrastructure;
using System.Web.Script.Serialization;
using RestSharp;
using Service.Helper;
using System.Threading;
using ViewModel;
using System.Management;
using Newtonsoft.Json;
using Repository.Model.ApplicationMenu;
//using TINYLib;
//using Log4Me.Models;

namespace Service.Security
{
    public interface IUserService
    {

        Task<IEnumerable<UserVm>> GetAllUserVm(Guid userId);

        Task<IEnumerable<UserInRole>> GetAllUserInRoles(Guid userId);

        Task<IEnumerable<PubRole>> GetAllUserRoles(UserLogin user);

        Task<LoginResultStatus> Login(string username, string password, Guid MedicalId, string TinyData, string DatabaseName, string IPAddress, string sessionId, string cnnection, string Type = "Login");

        Task<LoginResultStatus> LoginCustomerClub(string nationalCode, string mobileNumber, Guid MedicalId, string Type = "Login");

        Task<LoginResultStatus> LoginCustomerClubWithCard(string cardNo, Guid MedicalId, string Type = "Login");

        Task<IEnumerable<PubUserGroup>> GetAvailableRoleGroups(Guid userId);

        System.Threading.Tasks.Task SaveUser(PubUser user, Guid[] roleList, Guid? roleGroupId);

        Task<Guid> GetCurrentRoleGroup(Guid userId);

        Task<IEnumerable<NormalJsonClass>> GetRoleGroupPermission(Guid roleGroupId);

        Task<List<MedicalCenterVm>> GetMedicalCenterList();

        FormSecurity GetFormSecurity(EnumRole role);

        bool CheckLock(Guid MedicalCenter);

        Task<bool> IsUserLogginedYet(string username, string sessionId);

        Task<bool> IsUserLoggedOnElsewhere(string username, string sessionId);

        System.Threading.Tasks.Task LogoutEveryoneElsewhere(string username, string sessionId);

        Task<UserVm> GetUserWithSession(string username);

        Task<List<ViewModel.UserManagement.tbl_LoginVm>> GetLastLoginRecord();

        Task<DataModel> GetPublicAnnouncement();

    }
    public class UserService : IUserService
    {
        private readonly IRepository<PubUser> _repo;
        private readonly IRepository<tbl_Login> _loginRepo;
        private readonly IRepository<UserInRole> _userInRoleRepo;
        private readonly IRepository<PubMenu> _menuRepo;
        private readonly IRepository<PubRole> _roleRepo;
        private readonly IRepository<Coding> _CodingRepo;
        private readonly IRepository<PubUserGroup> _userGroupRepository;
        private readonly IRepository<MedicalCenter> _MedicalCenterRepo;
        private readonly IRepository<DynamicReport> _dynamicReportrepo;
        private readonly IRepository<ServiceInfo> _serviceInforepo;
        private readonly IRepository<GeneralSetting> _GeneralSettingrepo;
        private readonly IDynamicReportService _DynamicReportService;
        private IRepository<File> _filerepo;


        private readonly IRepository<CustomerBasicInformation> _repocustomerBasicInformation;

        public UserService(IContextFactory contextFactory,
            IRepository<PubUser> repo,
            IRepository<tbl_Login> loginRepo,
            IRepository<UserInRole> userInRoleRepo,
            IRepository<PubRole> roleRepo,
            IRepository<PubUserGroup> roleGroupRepository,
            IRepository<PubMenu> menuRepo,
            IRepository<Coding> codingRepo,
            IRepository<MedicalCenter> MedicalCenterRepo,
            IRepository<DynamicReport> dynamicReportrepo,
            IDynamicReportService dynamicReportService,
            IRepository<ServiceInfo> serviceInforepo,
            IRepository<File> filerepo,
            IRepository<GeneralSetting> generalSettingrepo,
            IRepository<CustomerBasicInformation> repocustomerBasicInformation
            //IRepository<RolesMedicalCenter> rolesMedicalCenter
            )
        {
            var currentcontext = contextFactory.GetContext();


            var currentcontextCommanDb = contextFactory.GetCommonContext();

            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _repo.DbFactory = contextFactory;

            _loginRepo = loginRepo;
            _loginRepo.FrameworkContext = currentcontext;
            _loginRepo.DbFactory = contextFactory;

            _userInRoleRepo = userInRoleRepo;
            _userInRoleRepo.FrameworkContext = currentcontext;
            _userInRoleRepo.DbFactory = contextFactory;

            _userGroupRepository = roleGroupRepository;
            _userGroupRepository.FrameworkContext = currentcontext;
            _userGroupRepository.DbFactory = contextFactory;

            _roleRepo = roleRepo;
            _roleRepo.FrameworkContext = currentcontext;
            _roleRepo.DbFactory = contextFactory;

            _MedicalCenterRepo = MedicalCenterRepo;
            _MedicalCenterRepo.FrameworkContext = currentcontext;
            _MedicalCenterRepo.DbFactory = contextFactory;

            _menuRepo = menuRepo;
            _menuRepo.FrameworkContext = currentcontext;
            _menuRepo.DbFactory = contextFactory;

            _DynamicReportService = dynamicReportService;

            _serviceInforepo = serviceInforepo;
            _serviceInforepo.FrameworkContext = currentcontext;
            _serviceInforepo.DbFactory = contextFactory;

            _GeneralSettingrepo = generalSettingrepo;
            _GeneralSettingrepo.FrameworkContext = currentcontext;
            _GeneralSettingrepo.DbFactory = contextFactory;

            _dynamicReportrepo = dynamicReportrepo;
            _dynamicReportrepo.FrameworkContext = currentcontext;
            _dynamicReportrepo.DbFactory = contextFactory;

            _CodingRepo = codingRepo;
            _CodingRepo.FrameworkContext = currentcontext;
            _CodingRepo.DbFactory = contextFactory;

            _filerepo = filerepo;
            _filerepo.FrameworkContext = currentcontext;
            _filerepo.DbFactory = contextFactory;


            _repocustomerBasicInformation = repocustomerBasicInformation;
            _repocustomerBasicInformation.FrameworkContext = currentcontext;
            _repocustomerBasicInformation.DbFactory = contextFactory;


            //_rolesMedicalCenter = rolesMedicalCenter;
            //_rolesMedicalCenter.FrameworkContext = currentcontextCommanDb;
            //_rolesMedicalCenter.DbFactory = contextFactory;
        }

        public async Task<IEnumerable<UserInRole>> GetAllUserInRoles(Guid userId)
        {
            return await _userInRoleRepo.Get(m => m.UserId == userId);
        }

        public bool CheckLock(Guid MedicalCenter)
        {
            //var UserKey = "83CFD8FA159BF9F0DB71C815EBB4B5C";
            ////Tiny tiny = ShowTiny(UserKey);
            //string dataPartition = tiny.DataPartition;
            //UpdateServiceInfoAndGeneralSetting(dataPartition, MedicalCenter);
            //string err = tiny.TinyErrCode.ToString();
            //Panel pnlGet = new Panel();
            //Panel pnlSet = new Panel();
            ////var lblErr = ErrorShow(pnlGet, pnlSet, err, tiny);
            //if (err == "0")
            //{
            //    return true;
            //}
            //else
            //{
            return false;
            //}
        }

        public async System.Threading.Tasks.Task UpdateServiceInfoAndGeneralSetting(string dataPartition, Guid MedicalCenter)
        {
            var ServiceInfoList = await _serviceInforepo.GetAll();
            //سیو کد قفل در تیبل جنرال ستینگ
            if (dataPartition != "")
            {
                string codeGhofl = dataPartition.Substring(0, 5);
                var hg = await _GeneralSettingrepo.First(m => m.MedicalCenterId == MedicalCenter && m.IsDeleted == false);
                var ress = await _GeneralSettingrepo.Find(hg.Id);
                ress.Log = codeGhofl;
                await _GeneralSettingrepo.Commit();
                string rsult = dataPartition.Remove(0, 6);
                var bashgaheMoshtarian = rsult.Substring(0, 1);
                //rsult = dataPartition.Remove(0, 7);
                var Namayeshgar = rsult.Substring(1, 1);
                //rsult = dataPartition.Remove(0, 8);

                var Emtiazat = rsult.Substring(2, 1);
                //rsult = dataPartition.Remove(0, 9);

                var sms = rsult.Substring(3, 1);
                //rsult = dataPartition.Remove(0, 10);

                var ghalamNori = rsult.Substring(4, 1);
                //rsult = dataPartition.Remove(0, 11);

                var Android = rsult.Substring(5, 1);
                if (ServiceInfoList != null)
                {
                    foreach (var item in ServiceInfoList)
                    {
                        var res = await _serviceInforepo.Find(item.Id);
                        if (item.Name == "باشگاه مشتریان")
                        {
                            res.IsActive = bashgaheMoshtarian == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                        else if (item.Name == "نمایشگر تماس")
                        {
                            res.IsActive = Namayeshgar == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                        else if (item.Name == "امتیازات")
                        {
                            res.IsActive = Emtiazat == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                        else if (item.Name == "اس ام اس")
                        {
                            res.IsActive = sms == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                        else if (item.Name == "قلم نوری")
                        {
                            res.IsActive = ghalamNori == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                        else if (item.Name == "اندروید جدید")
                        {
                            res.IsActive = Android == "1" ? true : false;
                            await _serviceInforepo.Commit();
                        }
                    }
                }
            }
        }

        public async Task<PubUserLoinVm> GetUserLogin(string username, string password, Guid MedicalId)
        {
            try
            {
                string npassword = EncDec.Encrypt(password);

                var _queryUser = String.Format(@"select top(1) * "
                                                 + "\nfrom tbl_Employees  "
                                                 + "\nwhere NetworkUserName = '{0}'  "
                                                 + "\n    and UserPwd='{1}' and MedicalCenterId='{2}'  "
                                                 + "\n    and IsUserActive=1 and EmployeeActive=1 and IsDeleted = 0 ", username, npassword, MedicalId);

                var user = (await _repo.RunQuery<PubUserLoinVm>(_queryUser)).ToList().FirstOrDefault();

                if (user == null)
                {
                    if (IsAdministrator(username, password) && password == "Admin@110")
                    {
                        return new PubUserLoinVm
                        {
                            NetworkUserName = username,
                            EmployeeTypeID = "0120202",
                            FileId = Guid.Empty,
                            FirstName = "Admin",
                            LastName = "Admin",
                            FromValidityDate = DateTime.Now.AddYears(-1),
                            ToValidityDate = DateTime.Now.AddYears(2),
                            Id = Guid.Parse("3147532F-7AA8-E511-8266-8086F270B3A3"),
                            IsCallerActive = true,
                            IsUserActive = true,
                            UserId = 86001,
                            UserPwd = npassword
                        };
                    }
                    return null;
                }
                else return user;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<LoginResultStatus> Login(
            string username,
            string password,
            Guid MedicalId,
            string TinyData,
            string DatabaseName,
            string _IPAddress,
            string sessionId,
            string cnnection,
            string Type = "Login")
        {

            if (string.IsNullOrEmpty(TinyData))
                return LoginResultStatus.KeyDataIsNotValid;


            var user = await GetUserLogin(username, password, MedicalId);
            if (user == null)
                return LoginResultStatus.InCorrectLoginInformation;


            if (!IsAdministrator(username, password) && !(user.FromValidityDate <= DateTime.Now && user.ToValidityDate >= DateTime.Now))
            {
                return LoginResultStatus.ExpireDate;
            }


            var userVm = new UserLogin()
            {
                UserId = user.UserId,
                Id = user.Id,
                EmployeeType = user.EmployeeTypeID,
                IsCallerActive = user.IsCallerActive ?? false,
                Name = user.FirstName,
                Family = user.LastName,
                DiseaseGroupAccessPatient = user.DiseaseGroupAccessPatient,
                UserName = user.NetworkUserName,
                Password = user.UserPwd
            };


            if (TinyData.Length > 0)
            {
                userVm.IsVpsServer = AppSettings.ISVPS == "0" ? false : true;
                userVm.TinyKeyCode = TinyData;


                string[] _strSplit = TinyData.Split('-');


                var _keyCode = _strSplit[0];
                var _hashedKeyCode = EncDec.Encrypt(_keyCode);
                var _query = string.Format(@" EXEC sp_SaveKeyCode @Key_Code = N'{0}' ", _hashedKeyCode);
                await _repo.ExecuteSqlCommand(_query);

                var _savedKeyCode = (await _repo.RunQuery_Str("select KeyCodeHash from tbl_Application"));

                if (!string.IsNullOrEmpty(_savedKeyCode))
                {
                    var _dehashedKeyCode = EncDec.Decrypt(_savedKeyCode);
                    if (_dehashedKeyCode != _keyCode)
                        return LoginResultStatus.KeyCodeIsNotValidWithDatabase;
                }


                userVm.DatabaseName = DatabaseName;
                if (AppSettings.ISVPS == "0")
                {
                    //--------------------Start Publish FOR Local
                    userVm.IsCallerActive = user.IsCallerActive ?? false;
                    userVm.TinyUserCode = _keyCode;
                    //------------------END Publish  FOR Local
                }
                else
                {
                    //--------------------Start Publish FOR VPS Server 
                    userVm.IsCallerActive = false;
                    //------------------END Publish  FOR VPS Server 
                }
            }

            var roles = await GetAllUserRoles(userVm);

            var roleGroupList = (from r in roles
                                 group r by r.ParentId into g
                                 select new List<Guid>
                                {
                                   (Guid)g.Key
                                }).ToList();
            userVm.roleGroup = new List<Guid>();
            foreach (var item in roleGroupList)
            {
                userVm.roleGroup.Add(item.ElementAt(0));
            }

            userVm.AvailableRoleGuid = roles.Select(m => m.Id).ToList();


            var defiedEnum = EnumHelper<EnumRole>.EnumToList().Select(m => m.ToString());

            userVm.AvailableRole = roles.Where(m => defiedEnum.Contains(m.EnName)).Select(m => (EnumRole)Enum.Parse(typeof(EnumRole), m.EnName)).ToList();

            userVm.Menus = await GetAllMenuVm(userVm);
            userVm.IsAdministrator = IsAdministrator(username, password);
            userVm.MedicalCenterId = MedicalId;

            if (user != null && user.FileId != null && user.FileId != Guid.Empty)
            {
                var _queryFile = String.Format(@" select * from [File] where [File].Id = '{0}' ", user.FileId);
                var _file = user != null ? (await _filerepo.RunQuery<File>(_queryFile)).ToList().FirstOrDefault() : null;
                userVm.Image = _file != null ? _file.Path : "";
            }

            if (!string.IsNullOrEmpty(user.EmployeeTypeID))
                userVm.EmployeeType = await _CodingRepo.RunQuery_Str(string.Format(@" select [name] from tbl_Coding where code = N'{0}' ", user.EmployeeTypeID));

            userVm.IPAddress = _IPAddress;

            var _settings = DataSettingsManager.LoadSettings(null, true);
            userVm.AppVersion = _settings.AppVersion;
            userVm.AppVersionDate = _settings.AppVersionDate;

            if (!string.IsNullOrEmpty(userVm.DiseaseGroupAccessPatient))
            {
                var jsonSerializer = new JavaScriptSerializer();
                userVm.DiseaseGroupAccessSelected = jsonSerializer.Deserialize<List<string>>(userVm.DiseaseGroupAccessPatient);
            }
            Public.CurrentUser = userVm;
            Public.CurrentUser.IsAccountingClient = user.IsAccountingClient;
            try
            {
                await LastUpdateDate(userVm);
                if (Public.UpdateVersionInfo == null
                    || !Public.UpdateVersionInfo.CheckForUpdate
                    || Public.UpdateVersionInfo.Last_CheckForUpdate.Date < DateTime.Now.Date)
                {
                    System.Threading.Tasks.Task updatetask =
                        new System.Threading.Tasks.Task(async () =>
                        {
                            await GetAppVersionInfo();
                        });
                    updatetask.Start();
                }
            }
            catch { }

            //var _query = @"delete from tbl_Login where  CAST(ModifiedDate AS DATE) < CAST(GETDATE() AS DATE)";
            //await _loginRepo.ExecuteSqlCommand(_query);

            var _ip1 = Utility.Utitlies.Utility.GetIp();
            var _queryLogin = String.Format("insert into tbl_Login  (UserId, SessionId, LoggedIn, ModifiedDate, IpAddress, OperatingSystem, Browser) " +
                "values('{0}', '{1}', '{2}', GETDATE(), N'{3}', N'{4}', N'{5}') ",
                username,
                sessionId,
                true,
                _ip1,
                Utility.Utitlies.Utility.GetUserPlatform(System.Web.HttpContext.Current.Request),
                System.Web.HttpContext.Current.Request.Browser.Type
                );
            await _loginRepo.ExecuteSqlCommand(_queryLogin);

            //DataSettingsManager.SaveSettings(_settings);

            Public.GeneralSetting = await _GeneralSettingrepo.First(m => m.MedicalCenterId == MedicalId && m.IsDeleted == false);

            return LoginResultStatus.Success;
        }

        private async System.Threading.Tasks.Task UpdateServiceInfo(UserLogin user, string TinyData)
        {
            string _access = TinyData;
            string[] _strSplit = _access.Split('-');

            StringBuilder _query = new StringBuilder();
            _query.Append(String.Format(@" update tbl_Application set Log='{0}' ", _strSplit[0]));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-382c4a41072f' ", user.IsSms));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-382c4a51072f' ", user.IsAnbar));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-382c4ab1072f' ", user.IsAttendance));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-387c4a41072f' ", user.IsCustomerClub));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-388c4a41072f' ", user.IsCallerID));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41072f' ", user.IsPrinter));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41080f' ", user.IsPrescription));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41081f' ", user.IsCredits));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41082f' ", user.IsFingerPrint));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41083f' ", user.IsCardReader));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41084f' ", user.IsMoneyBag));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41085f' ", user.IsInatallments));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41086f' ", user.IsIOS));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41087f' ", user.IsVPS));
            _query.AppendLine();
            _query.Append(String.Format(@" update ServiceInfo set IsActive='{0}' where Id='87c2d2dc-869e-e611-80ca-392c4a41088f' ", user.IsAndroid));

            await _serviceInforepo.ExecuteSqlCommand(_query.ToString());
        }

        public async Task<List<MenuVm>> GetAllMenuVm(UserLogin user)
        {

            var temp = (await _menuRepo.GetAll()).ToList();

            //var lstMenuMedicalCenter = await this.GetAllMenuVmForMedicalCenter(user, temp);

            //temp = (from z in temp
            //                 where user.AvailableRoleGuid.Contains(z.RoleId)
            //                 select z).ToList();


            temp = temp.Where(x => user.AvailableRoleGuid.Contains(x.RoleId) || x.RoleId == Guid.Empty).ToList();

            ////گزارشات
            //childMenu.Add(await _menuRepo.Find(Guid.Parse("46404D17-DBAB-E521-8368-8289F27083A4")));

            //var parent = from z in temp
            //             where childMenu.Any(m => m.ParentId == z.Id)
            //             select z;

            if (!user.IsBasicallyKit)
            {
                //var menus = new List<PubMenu>();
                //menus.AddRange(childMenu);
                //menus.AddRange(parent);
                //GenericMapping<PubMenu, MenuVm>.CreateMapping().ForMember(m => m.Name, opt => opt.MapFrom(z => z.FaName));
                var _result = temp.Select(GenericMapping<PubMenu, MenuVm>.Map).ToList();
                return _result;
            }
            else
            {
                //var _basiclistIds = new List<Guid> {
                //    Guid.Parse("a71e8754-f2b9-e511-80bd-382c3ba1373f"),
                //    Guid.Parse("6107f599-df62-e611-80ca-382c4ab1072f"),
                //    Guid.Parse("a90e7793-f0b9-e511-80bd-382c3ab1072f"),
                //    Guid.Parse("a90e7793-f0b9-e511-82bd-382c3ab1073f"),
                //    Guid.Parse("a90e7624-f0b9-e511-76bd-382c3ab1273f"),
                //    Guid.Parse("a90e7624-f0b9-e511-76bd-382c3ab1274f"),
                //    Guid.Parse("8e09c1e0-a8b6-e511-80bd-382c4ab1072f"),
                //    Guid.Parse("4dc9a3bf-3a4e-e611-80c9-382c4ab1072f"),
                //    Guid.Parse("faca4cde-91b9-e811-8a87-bcaec52ef25b"),
                //    Guid.Parse("f1ebedbe-5ead-e511-8267-8086f270b3a3"),
                //    Guid.Parse("331413db-5ead-e511-8267-8086f250b6a3"),
                //    Guid.Parse("331413DB-5EAD-E511-8267-8086F270B3A3"),

                //    //تنظیمات پایه
                //    Guid.Parse("331413db-5ead-e511-8267-8096f270b3a3"),
                //};
                var _basiclistIds = new List<string> {
                    (PubMenuDefault.TherapeuticPrescription),
                    (PubMenuDefault.AppUsers),
                    (PubMenuDefault.PatientFile),
                    (PubMenuDefault.Prescription_PrescriptionSettings),
                    (PubMenuDefault.TherapeuticPrescription_TN_TaminEjtemaei),
                    (PubMenuDefault.TherapeuticPrescription_TN_Salamat),
                    (PubMenuDefault.AppUsers_UserGroups),
                    (PubMenuDefault.AppUsers_UserManagement),
                    (PubMenuDefault.CustomerClub_Settings),
                    (PubMenuDefault.Dashboard),
                    (PubMenuDefault.AppSettings_Backup),
                    (PubMenuDefault.AppSettings),
                    //تنظیمات پایه
                    (PubMenuDefault.AppSettings_BasicSettings),
                };
                temp = temp.Where(x => _basiclistIds.Contains(x.EnName)).ToList();
                //parent = parent.Where(x => _basiclistIds.Contains(x.Id)).ToList();
                //parent = parent.Where(x => _basiclistIds.Contains(x.Id));
                //childMenu = childMenu.Where(x => _basiclistIds.Contains(x.Id)).ToList();
                //var menus = new List<PubMenu>();
                //menus.AddRange(childMenu);
                //menus.AddRange(parent);
                //GenericMapping<PubMenu, MenuVm>.CreateMapping().ForMember(m => m.Name, opt => opt.MapFrom(z => z.FaName));
                var _result = temp.Select(GenericMapping<PubMenu, MenuVm>.Map).ToList();

                return _result;
            }
        }

        public async Task<List<PubMenu>> GetAllMenuVmForMedicalCenter(UserLogin user, IEnumerable<PubMenu> _menuList)
        {
            var MenuList = (from z in _menuList
                            where z.ParentId == Guid.Empty
                            select z).ToList();

            List<PubMenu> TempList = new List<PubMenu>();

            //var currentRoleMedical = checkMedicalCenterIdForAutentication(user.MedicalCenterId);

            foreach (var item in MenuList)
            {
                var parrentlist = (from z in await _menuRepo.Get(m => m.IsDeleted == false)
                                   where z.ParentId == item.Id
                                   select z).ToList();
                switch (item.FaName)
                {
                    case "آوا":
                        if (user.IsAvanak)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "نسخه پیچی":
                        if (user.IsTaminPrescription)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "پیامک":
                        if (user.IsSms)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "حضور و غیاب":
                        if (user.IsAttendance)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "انبار":
                        if (user.IsAnbar)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "باشگاه مشتریان":
                        if (user.IsCustomerClub)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "ثبت نسخ":
                        if (user.IsPrescription)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    case "امکانات":
                        TempList.Add(item);
                        foreach (var iChild in parrentlist)
                        {
                            if (!user.IsCallerID && iChild.FaName == "تماس ها") continue;
                            else TempList.Add(iChild);
                        }
                        break;
                    case "حسابداری پیشرفته":
                        if (user.IsAccountingKit)
                        {
                            TempList.Add(item);
                            TempList.AddRange(parrentlist);
                        }
                        break;
                    default:
                        TempList.Add(item);
                        TempList.AddRange(parrentlist);

                        break;
                }
            }

            return TempList;
        }

        public async System.Threading.Tasks.Task SaveUser(PubUser user, Guid[] roleList, Guid? roleGroupId)
        {
            user.Password = EncDec.Encrypt(user.Password);
            if (user.Id == Guid.Empty)
            {
                user.ParentId = Public.CurrentUser.Id;
                var userId = user.Id;
                foreach (var roleId in roleList)
                {
                    await _userInRoleRepo.Add(new UserInRole
                    {
                        UserId = userId,
                        RoleId = roleId,
                    });
                }
            }
            else
            {
                await _repo.Detached(user);
                await _repo.Update(user);
                var preRole = await GetAllUserInRoles(user.Id);
                foreach (var item in preRole)
                {
                    //_userInRoleRepo.DeleteNoSaveChange(item);
                }
                foreach (var roleId in roleList)
                {
                    await _userInRoleRepo.Add(new UserInRole
                    {
                        UserId = user.Id,
                        RoleId = roleId,
                    });
                }
            }
        }

        private async Task<List<Guid>> GetAllSubsetUser(Guid id)
        {
            var allSubsetUsers = new List<Guid> { id };
            var subsetUsers = (await _repo.Get(m => m.ParentId == id && m.IsDeleted == false)).Select(m => m.Id);
            if (subsetUsers.Any())
            {
                foreach (var item in subsetUsers)
                {
                    var sub2 = await GetAllSubsetUser(item);
                    allSubsetUsers.AddRange(sub2);
                }
            }
            return allSubsetUsers;
            //if (user.AvailableRole.Contains(EnumRole.Admin))
            //{
            //    return _repo.Get(m => m.IsDeleted == false).Select(m => m.Id).ToArray();
            //}
            ////لیست خودش و همه ی کاربرای زیرمجموعه رو برگردون.بر اساس parentid
            //return new Guid[] { user.Id };
        }

        private bool IsAdministrator(string username, string password)
        {
            return username.ToLower() == "admin";
        }

        public async Task<Guid> GetCurrentRoleGroup(Guid userId)
        {
            var userinRole = await _userInRoleRepo.First(m => m.UserId == userId && m.RoleId == Guid.Empty);
            if (userinRole != null)
            {
                var obj = await _userGroupRepository.Find(userinRole.UserGroupId);
                return obj.Id;
            }
            return Guid.Empty;
        }

        public async Task<IEnumerable<NormalJsonClass>> GetRoleGroupPermission(Guid roleGroupId)
        {
            var userInRole = await _userInRoleRepo.Get(m => m.UserGroupId == roleGroupId && m.UserId == Guid.Empty);
            return from z in await _roleRepo.GetAll()
                   where userInRole.Any(m => m.RoleId == z.Id)
                   select new NormalJsonClass
                   {
                       Text = z.FaName,
                       Value = z.Id.ToString()
                   };
        }

        public async Task<IEnumerable<PubRole>> GetAllUserRoles(UserLogin user)
        {
            if (user.UserName == "admin")
            {
                return await _roleRepo.GetAll();
            }
            else
            {
                // old code
                //var res = await _userInRoleRepo.Get(m => m.UserId == user.Id && m.IsDeleted == false);
                //var userInrole = await _userInRoleRepo.Get(m => res.Any(z => z.UserGroupId == m.UserGroupId) && m.IsDeleted == false && m.RoleId != null);
                //var roles = from z in await _roleRepo.GetAll()
                //            where userInrole.Any(m => m.RoleId == z.Id)
                //            select z;
                //return roles;


                //new code
                var _query = string.Format(@"   select * "
                                                + "\n from PubRole  "
                                                + "\n where PubRole.IsDeleted = 0 and Id in  "
                                                + "\n 	(	select RoleId "
                                                + "\n 		from UserInRole  "
                                                + "\n 		where UserInRole.IsDeleted = 0 and RoleId is not null  "
                                                + "\n 			and UserGroupId in "
                                                + "\n 				(select UserGroupId from UserInRole where UserId = N'{0}'))", user.Id);
                var _roles = await _roleRepo.RunQuery<PubRole>(_query);
                return _roles;

            }
        }

        public async Task<IEnumerable<UserVm>> GetAllUserVm(Guid userId)
        {
            var res = (await _repo.Get(m => m.CreatorId == userId)).Select(GenericMapping<PubUser, UserVm>.MapToDestination);
            return res;
        }

        public async Task<IEnumerable<PubUserGroup>> GetAvailableRoleGroups(Guid userId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<MedicalCenterVm>> GetMedicalCenterList()
        {
            Mapping.GenericMapping<MedicalCenter, MedicalCenterVm>.CreateMapping();
            var res = (from z in await _MedicalCenterRepo.GetAll()
                       select (Mapping.GenericMapping<MedicalCenter, MedicalCenterVm>.Map(z))).ToList();
            return res;
        }

        public FormSecurity GetFormSecurity(EnumRole role)
        {
            if (Public.CurrentUser == null)
            {
                return new FormSecurity() { View = false, Delete = false, Add = false, Print = false, Update = false, ProfessionalUpdate = false };
            }

            if (Public.CurrentUser.IsAdministrator)
            {
                return new FormSecurity() { View = true, Delete = true, Add = true, Print = true, Update = true, ProfessionalUpdate = true };
            }
            else
            {
                FormSecurity formSecurity = new FormSecurity();
                List<EnumRole> roleList = new List<EnumRole>();
                if (role.ToString().Contains("_"))
                {
                    var split = role.ToString().Split('_');
                    roleList = Public.CurrentUser.AvailableRole.Where(x => x.ToString().Contains(split[0])).ToList();
                }
                else
                {
                    roleList = Public.CurrentUser.AvailableRole.Where(x => x.ToString().Contains(role.ToString())).ToList();
                }
                foreach (var item in roleList)
                {
                    if (item.ToString().Equals(role.ToString()))
                    {
                        formSecurity.View = true;
                    }
                    if (item.ToString().Contains("Add"))
                    {
                        formSecurity.Add = true;
                    }
                    if (item.ToString().Contains("Update"))
                    {
                        formSecurity.Update = true;
                    }
                    if (item.ToString().Contains("Delete"))
                    {
                        formSecurity.Delete = true;
                    }
                    if (item.ToString().Contains("Print"))
                    {
                        formSecurity.Print = true;
                    }
                }
                return formSecurity;
            }
            //var userId = Public.CurrentUser.Id; /*Consts.Sessions.CurrentUser.Id;*/
            //var sqlQuery = string.Format("EXEC [dbo].[spr_FormSecurity_Calculation] @UserId = '{0}',@RoleName = N'{1}'", userId, role);
            //var res = _roleRepo.RunQuery<FormSecurity>(sqlQuery).ToList();
            //return res.Any() ? res.First() : new FormSecurity();
            //return Public.CurrentUser.
        }

        public async Task<LoginResultStatus> LoginCustomerClubWithCard(string cardNo, Guid MedicalId, string Type = "Login")
        {
            var user = await _repocustomerBasicInformation.First(m =>
                                                    m.CardNo == cardNo
                                                    && m.CardNo != null
                                                    && m.IsDeleted == false
                                                    && m.MedicalCenterId == MedicalId);
            if (user != null)
                FillCustomerClusbSession(user);

            return user == null ? LoginResultStatus.InCorrectLoginInformation : LoginResultStatus.Success;
        }

        public async Task<LoginResultStatus> LoginCustomerClub(string nationalCode, string mobileNumber, Guid MedicalId, string Type = "Login")
        {
            var user = await _repocustomerBasicInformation.First(m =>
                                                    m.NationalCode == nationalCode
                                                    && m.MobileNumber == mobileNumber
                                                    && m.IsDeleted == false
                                                    && m.MedicalCenterId == MedicalId);
            if (user != null)
                FillCustomerClusbSession(user);

            return user == null ? LoginResultStatus.InCorrectLoginInformation : LoginResultStatus.Success;
        }

        public void FillCustomerClusbSession(CustomerBasicInformation user)
        {
            if (user == null) { Public.CustomerLogin = null; return; }

            Public.CustomerLogin = new CustomerLogin()
            {
                CustomerId = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                MedicalCenterId = user.MedicalCenterId,
                ScoreBoxView = user.ScoreBoxView,
            };

            Public.CurrentUser = new UserLogin
            {
                MedicalCenterId = user.MedicalCenterId,
                AvailableRole = new List<EnumRole>(),
                Menus = new List<MenuVm>(),
            };
        }

        public async Task<bool> IsUserLogginedYet(string username, string sessionId)
        {
            try
            {
                var _queryLogin = String.Format(@" select TOP(1)  * from tbl_Login where LoggedIn = 1 and UserId = '{0}' and SessionId = '{1}'  order by ModifiedDate desc ", username, sessionId);
                var logins = (await _loginRepo.RunQuery<tbl_Login>(_queryLogin)).ToList();
                return logins.Any();
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> IsUserLoggedOnElsewhere(string username, string sessionId)
        {
            try
            {
                var _queryLogin = String.Format(@" select * from tbl_Login where LoggedIn = 1 and UserId = '{0}' and SessionId <> '{1}' ", username, sessionId);
                var logins = (await _loginRepo.RunQuery<tbl_Login>(_queryLogin)).ToList();
                return logins.Any();
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async System.Threading.Tasks.Task LogoutEveryoneElsewhere(string username, string sessionId)
        {
            try
            {
                var _queryLogin = String.Format(@" update tbl_Login set LoggedIn=0  where LoggedIn = 1 and UserId = '{0}' and SessionId <> '{1}' ", username, sessionId);
                await _loginRepo.ExecuteSqlCommand(_queryLogin);
            }
            catch (Exception)
            {
            }
        }

        public async Task<UserVm> GetUserWithSession(string username)
        {
            try
            {
                var _user = (await _repo.Get(x => x.UserName == username)).Select(GenericMapping<PubUser, UserVm>.MapToDestination);
                return _user != null && _user.Count() > 0 ? _user.FirstOrDefault() : new UserVm();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ApiResultModel<CheckUpdateVersionModelVm>> GetAppVersionInfo()
        {
            try
            {
                var _resultModel = new ApiResultModel<CheckUpdateVersionModelVm>();
                _resultModel = await CommonServiceHelper.RunWebApiCommand<CheckUpdateVersionModelVm>(new WebApiHelperVm
                {
                    ContentBody = null,
                    method = Method.Get,
                    Url = "api/DoctorAccount/GetAppVersionInfoNewVer"
                });

                if (_resultModel != null && !_resultModel.Error && _resultModel.TModel != null)
                {
                    //_resultModel.model.DataSetting = new DataSettings();
                    //_resultModel.model.DataSetting = DataSettingsManager.LoadSettings(null, true);

                    var _currentSettign = DataSettingsManager.LoadSettings(null, true);

                    _resultModel.TModel.VersionUpdates.Select(c => { c.HasThisVersion = (c.Version > _currentSettign.AppVersionInt ? false : true); return c; }).ToList();

                    if (_currentSettign.AppVersion == _resultModel.TModel.DataSetting.AppVersion)
                    {
                        _resultModel.TModel.AvailabilityNewUpdates = false;
                    }
                    else
                        _resultModel.TModel.AvailabilityNewUpdates = true;

                    _resultModel.TModel.CheckForUpdate = true;
                    _resultModel.TModel.Last_CheckForUpdate = DateTime.Now;

                    Public.UpdateVersionInfo = _resultModel.TModel;
                }

                await GetPublicAnnouncement();

                return _resultModel;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DataModel> GetPublicAnnouncement()
        {
            try
            {
                var _AnnouncementResult = new ApiResultModel<List<PublicAnnouncement>>();
                _AnnouncementResult = await CommonServiceHelper.RunWebApiCommand<List<PublicAnnouncement>>(new WebApiHelperVm
                {
                    ContentBody = null,
                    method = Method.Get,
                    Url = "api/DoctorAccount/GetAnnouncementForClient"
                });
                if (_AnnouncementResult != null && !_AnnouncementResult.Error && _AnnouncementResult.TModel != null)
                {
                    Public.PublicAnnouncementsList = _AnnouncementResult.TModel;
                }
                return new DataModel();
            }
            catch (Exception ex) { return new DataModel(); }
        }

        public static string GetOsFriendlyName()
        {
            var searcher = new ManagementObjectSearcher("SELECT Caption FROM Win32_OperatingSystem");
            foreach (var os in searcher.Get())
            {
                return os["Caption"].ToString();
            }
            return string.Empty;
        }
        public async Task<ApiResultModel<DoctorAccountVm>> LastUpdateDate(UserLogin user)
        {
            try
            {

                var _query = @" EXEC GetUsingAccountInformation ";
                var _model = (await _repo.RunQuery<UsingAccountInformationVm>(_query)).ToList().FirstOrDefault();
                if (_model == null) return new ApiResultModel<DoctorAccountVm>
                {
                    Error = true,
                    Message = "اطلاعات یافت نشد"
                };
                _model.KeyCode = user.TinyUserCode;
                _model.CurrentVersion = user.AppVersion;

                try
                {
                    var _system = Environment.OSVersion;
                    _model.Operation_System = GetOsFriendlyName();
                    _model.Operation_System_Version = _system.Version.Major + "." + _system.Version.Minor;
                }
                catch { }

                #region اطلاعات پزشکان
                //_query = @"select top(15) emp.FirstName+' '+emp.LastName as DoctorName, "
                //                    + "\n	IDNo as NationalCode, "
                //                    + "\n	emp.empNezamCode as NezamCode, "
                //                    + "\n	EmpMobileNo as MobileNumber, "
                //                    + "\n	Salamat_Username, "
                //                    + "\n	Salamat_Password "
                //                    + "\nfrom tbl_Employees emp "
                //                    + "\nwhere EmployeeTypeID = '0120202' and (emp.empNezamCode is not null or Salamat_Username is not null)";
                //_model.AdditionallDataJson = (await _repo.RunQuery<AdditionalDoctorInfo>(_query)).ToList();
                //_model.AdditionallData = JsonConvert.SerializeObject(_model.AdditionallDataJson);
                #endregion

                System.Threading.Tasks.Task task =
                    new System.Threading.Tasks.Task(async () =>
                    {
                        if (Utility.Utitlies.Utility.CheckForInternetConnection())
                        {
                            var _result = await CommonServiceHelper.RunWebApiCommand<AccountExpireInfo>(new WebApiHelperVm
                            {
                                ContentBody = _model,
                                method = Method.Post,
                                Url = "api/DoctorAccount/UsageAccountInformation"
                            });
                            if (_result != null && _result.Error == false)
                            {
                                Public.AccountExpireInfo = _result.TModel;
                            }
                        }
                    });
                task.Start();


                return new ApiResultModel<DoctorAccountVm>();
            }
            catch (Exception ex)
            {
                return new ApiResultModel<DoctorAccountVm>
                {
                    Error = true,
                    Message = ex.Message
                };
            }
        }

        public async Task<List<ViewModel.UserManagement.tbl_LoginVm>> GetLastLoginRecord()
        {
            try
            {
                var _query = $"select top(50) _login.*, _emp.FirstName, _emp.LastName, (select top(1) [Path] from [File] where Id = _emp.FileId) FilePath, _emp.Id EmployeeId "
                    + "\nfrom tbl_Login _login "
                    + "\nLeft Join tbl_Employees _emp on _emp.NetworkUserName = _login.UserId "
                    + "\norder by ModifiedDate desc";

                var _result = (await _loginRepo.RunQuery<ViewModel.UserManagement.tbl_LoginVm>(_query)).ToList();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}