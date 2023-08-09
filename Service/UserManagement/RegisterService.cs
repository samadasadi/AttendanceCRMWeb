using Mapping;
using Repository.iContext;
using Repository.Model;
using Repository;
using Service.BasicInfo;
using Service.Consts;
using Service.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.PublicEnum;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;
using ViewModel.UserManagement;
using System.Web.Script.Serialization;
using Service.Common;

namespace Service.UserManagement
{
    public interface IRegisterService
    {
        Task<bool> CanAddUserAsync(Guid? employeeId);
        Task<UserVm> GetUserVmAsync(Guid? id);
        System.Threading.Tasks.Task<PubUser> SaveUserAsync(UserVm model, string serverPath, string LocalPath);
        Task<IEnumerable<UserVm>> GetAllAsync();
        Task<IEnumerable<UserVm>> GetAllAsync(Filter_UserVm model);
        System.Threading.Tasks.Task DeleteAsync(Guid id);
        Task<List<NormalJsonClass>> GetAllUserGroupAsync(Guid? Id);
        Task<List<NormalJsonClass>> GetAllUserTypeListAsync();
        Task<List<NormalJsonClass>> GetEducationListAsync();
        Task<List<NormalJsonClass>> GetAllParentsAsync(Guid selected);
        Task<bool> CheckUserNameAsync(string userName, Guid? Id);
        Task<bool> ChangePasswordAsync(string oldPassword, string newPassword);
        System.Threading.Tasks.Task SaveUsergroupAsync(UserVm model);
        Task<UserVm> GetUserDetailAsync(Guid id);
        System.Threading.Tasks.Task SaveUserActiveAsync(UserVm model);
        System.Threading.Tasks.Task ResetPasswordAsync(Guid userId, string newPassword);

        Task<bool> CheckDocNo(string DocNo, Guid? Id);


        Task<int> GetUserActiveCount(Guid? employeeId);

        Task<int> GetDoctorActiveCount(Guid? employeeId);
        Task<UserVm> GetUuserVmForDetail(Guid? id);
        Task<DataModel> DeleteImgAsync(Guid id);

        Task<DataModel> Delete_QuickLinkAsync(QuickLinkVm entity);
        Task<DataModel> Save_QuickLinkAsync(QuickLinkVm entity);
        Task<List<QuickLinkVm>> Search_QuickLinkAsync(QuickLinkVm entity);
        Task<QuickLinkVm> Get_QuickLinkAsync(QuickLinkVm entity);
        Task<DataModel> ActiveChange_QuickLinkAsync(QuickLinkVm entity);


    }

    public class RegisterService : IRegisterService
    {
        private readonly IRepository<PubUser> _repo;
        private readonly IRepository<PersonHoghogh> _repoPersonHoghogh;
        private readonly IRepository<PubUserGroup> _repoUserGroup;
        private readonly IRepository<UserInRole> _repoUserInRole;
        private readonly IRepository<PubRole> _roleRepo;
        private readonly IRepository<File> _repoFile;
        private readonly IRepository<tbl_FP> _repotbl_FP;
        private readonly IRepository<QuickLink> _repoQuickLink;
        private readonly IFileService _fileService;
        private readonly ICodingService _repoCoding;

        public RegisterService(
            IContextFactory contextFactory,
            IRepository<PubUser> repo,
            IRepository<PubUserGroup> userGroupRepo,
            IRepository<UserInRole> userInRoleRepo,
            IRepository<PubRole> roleRepo,
            ICodingService Codingrepo,
            IFileService fileService,
            IRepository<File> filerepo,
            IRepository<PersonHoghogh> repoPersonHoghogh,
            IRepository<QuickLink> repoQuickLink,
            IRepository<tbl_FP> tbl_FP)
        {
            var currentcontext = contextFactory.GetContext();
            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _repo.DbFactory = contextFactory;


            _repoQuickLink = repoQuickLink;
            _repoQuickLink.FrameworkContext = currentcontext;
            _repoQuickLink.DbFactory = contextFactory;


            _repoPersonHoghogh = repoPersonHoghogh;
            _repoPersonHoghogh.FrameworkContext = currentcontext;
            _repoPersonHoghogh.DbFactory = contextFactory;


            _repoUserGroup = userGroupRepo;
            _repoUserGroup.FrameworkContext = currentcontext;
            _repoUserGroup.DbFactory = contextFactory;

            _repoUserInRole = userInRoleRepo;
            _repoUserInRole.FrameworkContext = currentcontext;
            _repoUserInRole.DbFactory = contextFactory;

            _roleRepo = roleRepo;
            _roleRepo.FrameworkContext = currentcontext;
            _roleRepo.DbFactory = contextFactory;

            _repoCoding = Codingrepo;
            _fileService = fileService;
            _repoFile = filerepo;
            _repotbl_FP = tbl_FP;
            _repotbl_FP.FrameworkContext = currentcontext;
        }

        public async Task<IEnumerable<UserVm>> GetAllAsync()
        {
            Mapping.GenericMapping<PubUser, UserVm>.CreateMapping();
            //commented by samad
            // var lst = _repo.Get(m => m.IsDeleted == false && m.Name != "Admin" && m.MedicalCenterId == ).ToList();

            var _query = string.Format(@"select	coding.name as UserTypeName, filee.Path as ImgPath, emp.FirstName as 'Name', emp.LastName as Family, emp.Id, "
                                        + "\n		emp.EmployeeActive, ISNULL(emp.FileId, '00000000-0000-0000-0000-000000000000'), "
                                        + "\n		emp.EmployeeID, CAST(ISNULL(emp.IsUserActive, 0) as bit), emp.EmpMobileNo as MobileNumber, "
                                        + "\n		emp.PhoneNo, emp.Address, emp.NetworkUserName as UserName "
                                        + "\n from tbl_Employees emp "
                                        + "\n left join tbl_Coding coding on emp.EmployeeTypeID = coding.code "
                                        + "\n left join [File] filee on filee.Id = emp.FileId "
                                        + "\n where emp.IsDeleted = 0 ");

            var _result = (await _repo.RunQuery<UserVm>(_query)).ToList();
            return _result;
        }

        public async Task<IEnumerable<UserVm>> GetAllAsync(Filter_UserVm model)
        {
            Mapping.GenericMapping<PubUser, UserVm>.CreateMapping();
            //commented by samad
            // var lst = _repo.Get(m => m.IsDeleted == false && m.Name != "Admin" && m.MedicalCenterId == ).ToList();

            var _lstEmp = (await _repo.Get(m =>
                m.IsDeleted == false
                )).ToList();


            if (model.EmployeeActive != null)
                _lstEmp = _lstEmp.Where(x => x.EmployeeActive == model.EmployeeActive).ToList();

            if (model.IsUserActive != null)
                _lstEmp = _lstEmp.Where(x => (x.IsUserActive ?? false) == model.IsUserActive).ToList();

            if (!string.IsNullOrEmpty(model.UserType))
                _lstEmp = _lstEmp.Where(x => x.UserType == model.UserType).ToList();

            if (!string.IsNullOrEmpty(model.Search))
                _lstEmp = _lstEmp.Where(x =>
                    (x.Name + " " + x.Family).Contains(model.Search)
                    || (x.MobileNumber ?? "").Contains(model.Search)
                    || x.EmployeeID.Contains(model.Search)).ToList();



            var _lstFile = (await _repoFile.GetAll()).ToList();

            var res = (from z in _lstEmp
                       join pet in _lstFile on z.FileId equals pet.Id into f
                       from file in f.DefaultIfEmpty()
                       select new UserVm
                       {
                           ImgPath = file != null ? file.Path : null,
                           Name = z.Name,
                           Family = z.Family,
                           Id = z.Id,
                           EmployeeActive = z.EmployeeActive,
                           FileId = z.FileId != null ? z.FileId.Value : Guid.Empty,
                           EmployeeID = z.EmployeeID,
                           IsUserActive = z.IsUserActive != null ? z.IsUserActive.Value : false,
                           MobileNumber = z.MobileNumber,
                           PhoneNo = z.PhoneNo,
                           Address = z.Address,

                       }).ToList();
            return res;
        }

        public async Task<UserVm> GetUserDetailAsync(Guid id)
        {

            var user = await _repo.Find(id);
            var fileId = user.FileId;
            if (fileId != Guid.Empty)
            {
                var imgpath = await _fileService.GetPath(fileId);
                if (user.FileId != null)
                    return new UserVm
                    {
                        ImgPath = imgpath,
                        Name = user.Name,
                        Family = user.Family,
                        Id = user.Id,
                        FileId = user.FileId.Value,
                        EmployeeActive = user.EmployeeActive,
                        UserName = user.UserName,
                        PhoneNo = user.PhoneNo,
                        ModifiedDate = user.ModifiedDate
                    };
            }
            return new UserVm
            {
                Name = user.Name,
                Family = user.Family,
                Id = user.Id,
                EmployeeActive = user.EmployeeActive,
                UserName = user.UserName,
                PhoneNo = user.PhoneNo,
                ModifiedDate = user.ModifiedDate

            };
            //return res;
        }

        public async System.Threading.Tasks.Task DeleteAsync(Guid id)
        {
                var admin = await _repo.First(m => m.IsDeleted == false && m.Id == id);
                if (admin.UserName == "admin")
                {
                    throw new Exception("شما امکان حذف ادمین را ندارید");
                }
                await _repo.Delete(m => m.Id == id);
        }


        public async Task<string> GetNewEmployeerDocNo()
        {
            var Number = 8606;
            var employee = await _repo.Get(m => m.IsDeleted == false );
            if (employee.Count() == 0)
            {
                return Number.ToString();
            }
            else
            {
                var StartNumber = employee.OrderByDescending(m => m.EmployeeID).FirstOrDefault().EmployeeID;
                if (Number > int.Parse(StartNumber))
                {
                    return Number.ToString();
                }
                else
                {
                    string result = (await System.Threading.Tasks.Task.FromResult(_repo.FrameworkContext.Database.SqlQuery<string>("SELECT [dbo].[fn_GetNewDocNo4EM] ()"))).First();
                    return result;
                }
            }
        }

        public async Task<UserVm> GetUserVmAsync(Guid? id)
        {
            if (id == null)
            {
                var model = new UserVm
                {
                    EmployeeID = await GetNewEmployeerDocNo(),
                    RoleGroups = await GetAllUserGroupAsync(id),
                    UserTypeList = await GetAllUserTypeListAsync(),
                    EducationList = await GetEducationListAsync(),
                    ParentLists = await GetAllParentsAsync(Guid.Empty),
                    UserActiveCount = await GetUserActiveCount(null),

                    UserDoctorCount = await GetDoctorActiveCount(null),

                    CanAddUser = await CanAddUserAsync(null),

                };
                return model;
            }
            else
            {
                var user = await _repo.Find(id);
                Mapping.GenericMapping<PubUser, UserVm>.CreateMapping();
                var model = Mapping.GenericMapping<PubUser, UserVm>.Map(user);
                var selectedGrpup =
                    (await _repoUserInRole.Get(m => m.UserId == user.Id && m.IsDeleted == false && m.UserGroupId != null)
                        ).Select(m => m.UserGroupId.Value)
                        .ToArray();
                var r = await _repotbl_FP.First(x => x.FC == id);
                if (r != null)
                {
                    model.Image = Convert.ToBase64String(r.FP);
                }
                else
                {
                    model.Image = null;
                }
                model.SelectedRoleGroups = selectedGrpup;
                model.Password = !string.IsNullOrEmpty(model.Password) ? EncDec.Decrypt(model.Password) : null;
                model.UserTypeList = await GetAllUserTypeListAsync();
                model.RoleGroups = await GetAllUserGroupAsync(id);
                model.EducationList = await GetEducationListAsync();
                model.ParentLists = await GetAllParentsAsync(user.ParentId ?? Guid.Empty);
                model.UserActiveCount = await GetUserActiveCount(id);

                model.UserDoctorCount = await GetDoctorActiveCount(id);

                model.CanAddUser = await CanAddUserAsync(id);
                if (user.FileId != Guid.Empty)
                {
                    var Id = user.FileId;
                    var imgpath = await _fileService.GetPath(Id);
                    model.ImgPath = imgpath;
                }


                var _personHoghogh = (await _repoPersonHoghogh.Get(x => x.PersonID == id.Value)).ToList().FirstOrDefault();
                model.personHoghogh = _personHoghogh != null ? GenericMapping<PersonHoghogh, PersonHoghoghVm>.Map(_personHoghogh) : new PersonHoghoghVm();


                return model;
            }
        }

        public async Task<UserVm> GetUuserVmForDetail(Guid? id)
        {
            var user = await _repo.Find(id);
            if (user != null)
            {
                Mapping.GenericMapping<PubUser, UserVm>.CreateMapping();
                var model = Mapping.GenericMapping<PubUser, UserVm>.Map(user);
                if (user.FileId != Guid.Empty)
                {
                    var Id = user.FileId;
                    var imgpath = await _fileService.GetPath(Id);
                    model.ImgPath = imgpath;
                }
                if (!string.IsNullOrEmpty(model.Education))
                {
                    model.EducationName = (await _repoCoding.GetCodingName(model.Education));
                }
                if (!string.IsNullOrEmpty(model.UserType))
                {
                    model.UserTypeName = (await _repoCoding.GetCodingName(model.UserType));
                }

                model.FromValidityDateStr = model.FromValidityDate != null ? DateTimeOperation.M2S(model.FromValidityDate.Value) : "";
                model.ToValidityDateStr = model.ToValidityDate != null ? DateTimeOperation.M2S(model.ToValidityDate.Value) : "";


                var _personHoghogh = (await _repoPersonHoghogh.Get(x => x.PersonID == id.Value)).ToList().FirstOrDefault();
                model.personHoghogh = _personHoghogh != null ? GenericMapping<PersonHoghogh, PersonHoghoghVm>.Map(_personHoghogh) : new PersonHoghoghVm();


                return model;
            }
            else return new UserVm();
        }

        public async Task<int> GetUserActiveCount(Guid? employeeId)
        {
            if (employeeId == null || employeeId == Guid.Empty)
            {
                var _res = (await _repo.Get(x =>
                                   x.EmployeeActive == true
                                && x.IsUserActive == true
                                && x.IsDeleted == false)).ToList();
                return (_res != null && _res.Count > 0) ? _res.Count : 1;
            }
            else
            {
                var _res = (await _repo.Get(x =>
                                   x.EmployeeActive == true
                                && x.IsUserActive == true
                                && x.IsDeleted == false
                                && x.Id != employeeId.Value)).ToList();
                return (_res != null && _res.Count > 0) ? _res.Count : 1;
            }
        }
        public async Task<bool> CanAddUserAsync(Guid? employeeId)
        {
            var _usercount = await GetUserActiveCount(employeeId);
            var _maxUserCount = Public.CurrentUser.UserCount;
            return (_usercount < _maxUserCount ? true : false);
        }

        public async Task<List<NormalJsonClass>> GetAllParentsAsync(Guid selected)
        {
            return (await _repo.Get(m => m.IsDeleted == false)
                ).Select(m => new NormalJsonClass
                {
                    Text = m.Name + " " + m.Family,
                    Value = m.Id.ToString(),
                    Selected = m.Id == selected
                }).ToList();
        }

        public async Task<List<NormalJsonClass>> GetAllUserGroupAsync(Guid? Id)
        {
            if (Id != null)
            {
                var userGroup = (await _repoUserInRole.Get(m => m.IsDeleted == false && m.UserId == Id)).Select(m => m.UserGroupId).ToArray();
                var res = (await _repoUserGroup.GetAll()).Select(m => new NormalJsonClass()
                {
                    Text = m.Name,
                    Value = m.Id.ToString(),
                    Selected = userGroup.Contains(m.Id)
                }).ToList();
                return res;
            }
            else
            {
                var res = (await _repoUserGroup.GetAll()).Select(m => new NormalJsonClass()
                {
                    Text = m.Name,
                    Value = m.Id.ToString()
                }).ToList();
                return res;
            }
            //return _userGroupRepo.GetAll().Select(m => new NormalJsonClass
            //{
            //    Text = m.Name,
            //    Value = m.Id.ToString(),
            //    Selected = selectedGroup != null && selectedGroup.Contains(m.Id)
            //}).ToList();
        }

        public async Task<List<NormalJsonClass>> GetAllUserTypeListAsync()
        {
            return (await _repoCoding.GetAllChild((("0" + (int)CodingEnum.UserType).ToString()), 1)).Select(z => new NormalJsonClass
            {
                Text = z.name,
                Value = z.code.ToString(),
            }).ToList();
        }

        public async Task<List<NormalJsonClass>> GetEducationListAsync()
        {
            return (await _repoCoding.GetAllChild((("0" + (int)CodingEnum.Education).ToString()), 1)).Select(z => new NormalJsonClass
            {
                Text = z.name,
                Value = z.code.ToString(),
            }).ToList();
        }

        public async System.Threading.Tasks.Task SaveUserActiveAsync(UserVm model)
        {
            if (model.Id != Guid.Empty)
            {
                var user = await _repo.Find(model.Id);
                user.EmployeeActive = model.EmployeeActive;
                await _repo.Commit();
            }
        }

        public async Task<PubUser> SaveUserAsync(UserVm model, string serverPath, string LocalPath)
        {
            //var _result = new PubUser();
            if (!string.IsNullOrEmpty(model.Canvas))//آیا کاربر امضاء دارد
            {
                var currentFile = (model.SignFileId.HasValue && model.SignFileId != Guid.Empty) ? await _fileService.Find(model.SignFileId.Value) : null;
                if (currentFile != null)
                {
                    await _fileService.Delete(currentFile.Id);
                    if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath(currentFile.Path)))
                        System.IO.File.Delete(System.Web.HttpContext.Current.Server.MapPath(currentFile.Path));
                }
                var source = model.Canvas;
                string base64 = source.Substring(source.IndexOf(',') + 1);
                base64 = base64.Trim('\0');
                byte[] chartData = Convert.FromBase64String(base64);
                var signFile = await _fileService.AddFileWithByteArray(chartData, serverPath, LocalPath, "Employee");
                model.SignFileId = signFile.Id;
                model.cbiSignImage = signFile.Path;
            }



            var _result = new PubUser();
            if (model.Id != Guid.Empty)
            {
                //Edit
                try
                {
                    _result = await _repo.Find(model.Id);
                    _result.SignFileId = model.SignFileId;
                    _result.cbiSignImage = model.cbiSignImage;
                    _result.Name = model.Name;
                    _result.EmployeeID = model.EmployeeID;
                    _result.UserId = Convert.ToInt32(model.EmployeeID);
                    _result.TaxPercent = model.TaxPercent;
                    _result.Family = model.Family;
                    _result.PhoneNo = model.PhoneNo;
                    _result.Address = model.Address;
                    _result.DateofBirth = model.DateBirthEn.ToString();
                    _result.DateBirthEn = model.DateBirthEn;
                    _result.PlaceofBirth = model.PlaceofBirth;
                    _result.FatherName = model.FatherName;
                    _result.UserType = model.UserType;
                    _result.IsMale = model.IsMale;
                    _result.Married = model.Married;
                    _result.Education = model.Education;
                    _result.DegreeID = model.DegreeID;
                    _result.Married = model.Married;
                    _result.CreatorId = Public.CurrentUser.Id;
                    _result.EmployeeActive = _result.UserName == "admin" ? true : model.EmployeeActive;
                    _result.MobileNumber = model.MobileNumber;
                    _result.ParentId = model.ParentId;
                    _result.FileId = model.FileId;
                    _result.FromValidityDate = model.FromValidityDate;
                    _result.ToValidityDate = model.ToValidityDate;
                    _result.UserName = _result.UserName == "admin" ? "admin" : (!string.IsNullOrEmpty(model.UserName) ? model.UserName.Trim() : model.UserName);
                    _result.Password = !string.IsNullOrEmpty(model.Password) ? EncDec.Encrypt(model.Password) : null;
                    _result.IsUserActive = await CanAddUserAsync(model.Id) == true ? model.IsUserActive : false;
                    _result.NationalCode = model.NationalCode;
                    _result.IsCallerActive = model.IsCallerActive;
                    _result.ModifiedDate = DateTime.Now;
                    _result.PrinterName = model.PrinterName;
                    await _repo.Commit();

                    if (Public.CurrentUser.Id == model.Id)
                    {
                        Public.CurrentUser.Name = _result.Name;
                        Public.CurrentUser.Family = _result.Family;
                    }

                    if (!string.IsNullOrEmpty(model.Image))
                    {
                        var fp = await _repotbl_FP.First(x => x.FC == model.Id);
                        if (fp == null)
                        {
                            try
                            {
                                var tbl_FP = new tbl_FP
                                {
                                    DoingUserID = Public.CurrentUser.Id,
                                    FC = _result.Id,
                                    Type = "E",
                                    FP = Convert.FromBase64String(model.Image),
                                    ModifiedDate = DateTime.Now,
                                    ID = Guid.NewGuid(),
                                    Status = true
                                };
                                await _repotbl_FP.AddInt(tbl_FP);
                            }
                            catch (Exception ex) { }
                        }
                        else
                        {
                            try
                            {
                                fp.DoingUserID = Public.CurrentUser.Id;
                                fp.FC = fp.FC;
                                fp.Type = "E";
                                fp.FP = Convert.FromBase64String(model.Image);
                                fp.ModifiedDate = DateTime.Now;
                                fp.Status = true;
                                fp.ID = fp.ID;
                                await _repotbl_FP.Update(fp);
                            }
                            catch (Exception ex) { }
                        }
                    }
                    await _repoUserInRole.LogicalDelete(m => m.UserId == model.Id);
                    if (model.SelectedRoleGroups != null)
                    {
                        try
                        {
                            foreach (var item in model.SelectedRoleGroups)
                            {
                                var userInRole = new UserInRole
                                {
                                    RoleId = Guid.Empty,
                                    UserGroupId = item,
                                    UserId = _result.Id,
                                };
                                await _repoUserInRole.AddNoSaveChange(userInRole);
                            }
                            await _repoUserInRole.Commit();
                        }
                        catch (Exception ex) { }
                    }

                }
                catch (Exception ex) { }
            }
            else
            {
                try
                {
                    _result = GenericMapping<UserVm, PubUser>.Map(model);
                    _result.CreatorId = Public.CurrentUser.Id;
                    _result.Name = model.Name;
                    _result.Family = model.Family;
                    _result.DateofBirth = model.DateBirthEn.ToString();
                    _result.DateBirthEn = model.DateBirthEn;
                    _result.Password = !string.IsNullOrEmpty(model.Password) ? EncDec.Encrypt(model.Password) : null;
                    _result.IsUserActive = await CanAddUserAsync(null) == true ? model.IsUserActive : false;
                    _result.FromValidityDate = model.FromValidityDate;
                    _result.ToValidityDate = model.ToValidityDate;
                    _result.NationalCode = model.NationalCode;
                    _result.IsCallerActive = model.IsCallerActive;
                    _result.UserName = !string.IsNullOrEmpty(model.UserName) ? model.UserName.Trim() : model.UserName;
                    _result.EmployeeActive = model.Id == Guid.Empty ? true : model.EmployeeActive;
                    _result.UserId = Convert.ToInt32(model.EmployeeID);
                    _result = await _repo.AddWithReturn(_result);
                    if (!string.IsNullOrEmpty(model.Image))
                    {
                        try
                        {
                            tbl_FP tbl_FP = new tbl_FP
                            {
                                ID = Guid.NewGuid(),
                                DoingUserID = Public.CurrentUser.Id,
                                FC = _result.Id,
                                Type = "E",
                                FP = Convert.FromBase64String(model.Image),
                                ModifiedDate = DateTime.Now,
                                Status = true
                            };
                            await _repotbl_FP.AddInt(tbl_FP);
                        }
                        catch (Exception ex) { }
                    }
                    if (model.SelectedRoleGroups != null)
                    {
                        try
                        {
                            foreach (var item in model.SelectedRoleGroups)
                            {
                                var userInRole = new UserInRole
                                {
                                    IsDeleted = false,
                                    ModifiedDate = DateTime.Now,
                                    RoleId = Guid.Empty,
                                    UserGroupId = item,
                                    UserId = _result.Id
                                };
                                await _repoUserInRole.AddNoSaveChange(userInRole);
                            }
                            await _repoUserInRole.Commit();
                        }
                        catch (Exception ex) { }
                    }
                }
                catch (Exception ex) { }
            }



            #region ذخیره اطلاعات استخدامی

            model.personHoghogh.PersonID = _result.Id;
            model.personHoghogh.ModifiedDate = DateTime.Now;
            model.personHoghogh.IsActive = true;
            model.personHoghogh.IsDeleted = false;
            var _query = string.Format(@" delete from PersonHoghogh where PersonID = '{0}' ", _result.Id);
            await _repoPersonHoghogh.ExecuteSqlCommand(_query);
            await _repoPersonHoghogh.AddInt(GenericMapping<PersonHoghoghVm, PersonHoghogh>.Map(model.personHoghogh));

            #endregion

            return _result;
        }

        public async Task<bool> CheckUserNameAsync(string userName, Guid? Id)
        {
            if (Id == Guid.Empty || Id == null)
                return await _repo.CustomAny(m => m.IsDeleted == false &&  m.UserName == userName.Trim() && !string.IsNullOrEmpty(m.UserName));
            return await _repo.CustomAny(m => m.IsDeleted == false && m.UserName == userName.Trim() && !string.IsNullOrEmpty(m.UserName) && !m.Id.Equals(Id.Value));

        }

        public async Task<bool> ChangePasswordAsync(string oldPassword, string newPassword)
        {
            var useLogin = Public.CurrentUser;
            var user = await _repo.Find(useLogin.Id);
            var old = EncDec.Encrypt(oldPassword);
            var newP = EncDec.Encrypt(newPassword);
            if (user.Password == old)
            {
                user.Password = newP;
                useLogin.Password = newP;
                Public.CurrentUser = useLogin;
                await _repo.Update(user);
                return true;
            }
            else
            {
                return false;
            }
        }

        public async System.Threading.Tasks.Task SaveUsergroupAsync(UserVm model)
        {
            //Edit
            var user = await _repo.Find(model.Id);
            //user.Name = model.Name;
            // user.Family = model.Family;
            //user.Phone = model.Phone;
            //user.CompanyId = model.CompanyId;
            //user.CreatorId = Public.CurrentUser.Id;
            // _repo.Commit();
            await _repoUserInRole.LogicalDelete(m => m.UserId == model.Id);
            if (model.SelectedRoleGroups.Count() == 0)
            {
                foreach (var item in model.SelectedRoleGroups)
                {
                    var userInRole = new UserInRole
                    {
                        RoleId = Guid.Empty,
                        UserGroupId = item,
                        UserId = user.Id
                    };
                    await _repoUserInRole.AddNoSaveChange(userInRole);
                }
            }
            await _repoUserInRole.Commit();
        }

        public async System.Threading.Tasks.Task ResetPasswordAsync(Guid userId, string newPassword)
        {
            var user = await _repo.Find(userId);
            user.Password = EncDec.Encrypt(newPassword);
            await _repo.Update(user);
        }
        public async Task<bool> CheckDocNo(string DocNo, Guid? Id)
        {
            if (Id != Guid.Empty)
            {
                DocNo = DocNo.ToLower();
                var result = await _repo.CustomAny(m => m.EmployeeID == DocNo && m.Id != Id );
                return result;
            }
            else
            {
                DocNo = DocNo.ToLower();
                var result = await _repo.CustomAny(m => m.EmployeeID == DocNo);
                return result;
            }
        }

        public async Task<int> GetDoctorActiveCount(Guid? employeeId)
        {
            List<PubUser> _res = (await _repo.Get(x =>
                               x.EmployeeActive == true
                               //&& x.IsUserActive == true
                               && x.IsDeleted == false
                               && x.UserType == "0" + ((int)CodingEnum.Doctor).ToString())).ToList();
            if (employeeId != null && employeeId != Guid.Empty)
                _res = _res.Where(x => x.Id != employeeId.Value).ToList();
            return (_res != null && _res.Count > 0) ? _res.Count : 0;
        }

        public async Task<DataModel> DeleteImgAsync(Guid id)
        {
            try
            {
                var _query = string.Format(@" update tbl_Employees set FileId = null where FileId = '{0}' ", id);
                await _repo.ExecuteSqlCommand(_query);
                await _fileService.Delete(id);
                return new DataModel { error = false };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #region Quick Link

        public async Task<QuickLinkVm> Get_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _result = new QuickLinkVm();

                if (entity.Id != Guid.Empty)
                {
                    _result = GenericMapping<QuickLink, QuickLinkVm>.Map(await _repoQuickLink.Find(entity.Id));
                }

                _result.PubMenuList = (from item in Public.CurrentUser.Menus.OrderBy(m => m.Priority).Where(x => x.Url != "javascript:;")
                                       select new NormalJsonClass
                                       {
                                           Text = item.FaName,
                                           Value = item.Id.ToString()
                                       }).ToList();

                _result.Icon = !string.IsNullOrEmpty(_result.Icon) ? _result.Icon : "fa-link";
                _result.TextColor = !string.IsNullOrEmpty(_result.TextColor) ? _result.TextColor : "#000";
                _result.IconColor = !string.IsNullOrEmpty(_result.IconColor) ? _result.IconColor : "#000";

                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<QuickLinkVm>> Search_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {

                //var _query = $"select _lnk.Id, _lnk.Title, _lnk.Comment, _lnk.Icon, _lnk.LinkType, _lnk.[User_Id], _menu.FaName, _menu.[Url]," +
                //    $"\n(case when _menu.id is null then [Url] else _lnk.URLAddress end) as URLAddress" +
                //    $"\nfrom QuickLink _lnk" +
                //    $"\nLeft Join PubMenu _menu on _menu.Id = _lnk.PubMenu_Id" +
                //    $"\nwhere _lnk.[User_Id] = N'{Public.CurrentUser.Id}'";
                var _query = $"select * from QuickLink where [User_Id] = N'{Public.CurrentUser.Id}'  order by [Priority] ";
                var _result = (await _repoQuickLink.RunQuery<QuickLinkVm>(_query)).ToList();
                return _result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModel> Save_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var model = new QuickLink();

                if (entity.Id != Guid.Empty && entity.Id != null)
                {
                    //Edit
                    model = await _repoQuickLink.Find(entity.Id);
                }
                else
                {
                    //create
                }

                if (entity.LinkType == QuickLinkType.Systemic)
                {
                    if (entity.PubMenu_Id == null || entity.PubMenu_Id == Guid.Empty)
                        return new DataModel { error = true, message = "لطفا لینک سیستمی را انتخاب نمایید" };

                    var _pubmenuItem = (await _repoQuickLink.RunQuery<PubMenu>($"select Top(1) * from PubMenu where Id=N'{entity.PubMenu_Id}'")).FirstOrDefault();
                    if (_pubmenuItem != null)
                    {
                        //model.Title = _pubmenuItem.FaName;
                        model.URLAddress = _pubmenuItem.Url;
                    }
                }
                else
                {
                    //model.Title = entity.Title;
                    model.URLAddress = entity.URLAddress;
                }

                model.Title = entity.Title;

                model.LinkType = entity.LinkType;
                model.LinkTarget = entity.LinkTarget;
                model.PubMenu_Id = entity.PubMenu_Id;
                model.Comment = entity.Comment;
                model.IsActive = entity.IsActive;
                model.Priority = entity.Priority;
                model.Icon = entity.Icon;
                model.TextColor = entity.TextColor;
                model.IconColor = entity.IconColor;

                model.ModifiedDate = DateTime.Now;
                model.User_Id = Public.CurrentUser.Id;


                if (entity.Id != Guid.Empty && entity.Id != null)
                {
                    //Edit
                    await _repoQuickLink.Commit();
                }
                else
                {
                    //create
                    await _repoQuickLink.Add(model);
                }

                return new DataModel();
            }
            catch (Exception ex)
            {
                return new DataModel { error = true, message = ex.Message };
            }
        }
        public async Task<DataModel> ActiveChange_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _query = $"update QuickLink set IsActive = ~IsActive where Id = N'{entity.Id}'";
                await _repoQuickLink.ExecuteSqlCommand(_query);
                return new DataModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModel> Delete_QuickLinkAsync(QuickLinkVm entity)
        {
            try
            {
                var _query = $"delete from QuickLink where Id = N'{entity.Id}'";
                await _repoQuickLink.ExecuteSqlCommand(_query);
                return new DataModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

    }
}
