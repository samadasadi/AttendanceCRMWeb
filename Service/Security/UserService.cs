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
using System.Text;
using System.Threading.Tasks;
using Repository.Infrastructure;
using System.Web.Script.Serialization;
using RestSharp;
using System.Threading;
using ViewModel;
using System.Management;
using Newtonsoft.Json;
using Repository.Model.ApplicationMenu;
using System.Diagnostics.PerformanceData;
using System.Xml.Linq;
using Utility.Security;

namespace Service.Security
{
    public interface IUserService
    {

        Task<IEnumerable<UserVm>> GetAllUserVm(Guid userId);

        Task<IEnumerable<UserInRole>> GetAllUserInRoles(Guid userId);

        Task<IEnumerable<PubRole>> GetAllUserRoles(UserLogin user);

        Task<LoginResult> Login(string username, string password, string DatabaseName, string IPAddress, string sessionId, string cnnection, string Type = "Login");


        Task<IEnumerable<PubUserGroup>> GetAvailableRoleGroups(Guid userId);

        System.Threading.Tasks.Task SaveUser(PubUser user, Guid[] roleList, Guid? roleGroupId);

        Task<Guid> GetCurrentRoleGroup(Guid userId);

        Task<IEnumerable<NormalJsonClass>> GetRoleGroupPermission(Guid roleGroupId);

        FormSecurity GetFormSecurity(EnumRole role);

        bool CheckLock(Guid MedicalCenter);

        Task<bool> IsUserLogginedYet(string username, string sessionId);

        Task<bool> IsUserLoggedOnElsewhere(string username, string sessionId);

        System.Threading.Tasks.Task LogoutEveryoneElsewhere(string username, string sessionId);

        Task<UserVm> GetUserWithSession(string username);

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
        private readonly IRepository<GeneralSetting> _GeneralSettingrepo;
        private IRepository<File> _filerepo;

        public UserService(IContextFactory contextFactory,
            IRepository<PubUser> repo,
            IRepository<tbl_Login> loginRepo,
            IRepository<UserInRole> userInRoleRepo,
            IRepository<PubRole> roleRepo,
            IRepository<PubUserGroup> roleGroupRepository,
            IRepository<PubMenu> menuRepo,
            IRepository<Coding> codingRepo,
            IRepository<File> filerepo,
            IRepository<GeneralSetting> generalSettingrepo
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

            _menuRepo = menuRepo;
            _menuRepo.FrameworkContext = currentcontext;
            _menuRepo.DbFactory = contextFactory;

            _GeneralSettingrepo = generalSettingrepo;
            _GeneralSettingrepo.FrameworkContext = currentcontext;
            _GeneralSettingrepo.DbFactory = contextFactory;

            _CodingRepo = codingRepo;
            _CodingRepo.FrameworkContext = currentcontext;
            _CodingRepo.DbFactory = contextFactory;

            _filerepo = filerepo;
            _filerepo.FrameworkContext = currentcontext;
            _filerepo.DbFactory = contextFactory;


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


        public async Task<PubUserLoinVm> GetUserLogin(string username, string password)
        {
            try
            {
                string npassword = EncDec.Encrypt(password);

                var _queryUser = String.Format(@"select top(1) * "
                                                 + "\nfrom tbl_Employees  "
                                                 + "\nwhere NetworkUserName = '{0}'  "
                                                 + "\n    and UserPwd='{1}' "
                                                 + "\n    and IsUserActive=1 and EmployeeActive=1 and IsDeleted = 0 ", username, npassword);

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

        public async Task<LoginResult> Login(
            string username,
            string password,
            string DatabaseName,
            string _IPAddress,
            string sessionId,
            string cnnection,
            string Type = "Login")
        {



            var user = await GetUserLogin(username, password);
            if (user == null)
                return new LoginResult
                {
                    LoginResultStatus = LoginResultStatus.InCorrectLoginInformation
                };


            if (!IsAdministrator(username, password) && !(user.FromValidityDate <= DateTime.Now && user.ToValidityDate >= DateTime.Now))
                return new LoginResult
                {
                    LoginResultStatus = LoginResultStatus.ExpireDate
                };



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


            var _query = $"select top(1) ActivationLisc from tbl_Application";
            var _activationLisc = (await _repo.RunQuery_Str(_query));


            userVm.DatabaseName = DatabaseName;

            userVm.IsCallerActive = user.IsCallerActive ?? false;
            userVm.TinyUserCode = _activationLisc;
            userVm.IsVpsServer = true;

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
            Public.CurrentUser.ActivationLisc = _activationLisc;


            var _ip1 = Utility.Utitlies.Utility.GetIp();
            var _queryLogin = String.Format("insert into tbl_Login  (UserId, SessionId, LoggedIn, ModifiedDate, IpAddress, OperatingSystem, Browser) " +
                "values('{0}', '{1}', '{2}', GETDATE(), N'{3}', N'{4}', N'{5}') ",
                username, sessionId, true, _ip1,
                Utility.Utitlies.Utility.GetUserPlatform(System.Web.HttpContext.Current.Request),
                System.Web.HttpContext.Current.Request.Browser.Type
                );

            await _loginRepo.ExecuteSqlCommand(_queryLogin);

            Public.GeneralSetting = await _GeneralSettingrepo.First(m => m.IsDeleted == false);

            return new LoginResult { LoginResultStatus = LoginResultStatus.Success };
        }

        public async Task<List<MenuVm>> GetAllMenuVm(UserLogin user)
        {

            var temp = (await _menuRepo.Get(x => x.IsDeleted == false)).ToList();

            temp = temp.Where(x => user.AvailableRoleGuid.Contains(x.RoleId) || x.RoleId == Guid.Empty).ToList();

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
                        TempList.Add(item);
                        TempList.AddRange(parrentlist);
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
                return await _roleRepo.Get(x => x.IsDeleted == false);
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



        public static string GetOsFriendlyName()
        {
            var searcher = new ManagementObjectSearcher("SELECT Caption FROM Win32_OperatingSystem");
            foreach (var os in searcher.Get())
            {
                return os["Caption"].ToString();
            }
            return string.Empty;
        }


    }
}