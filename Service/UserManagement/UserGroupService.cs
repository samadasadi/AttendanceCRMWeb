using Repository.iContext;
using Repository.Model;
using Repository;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModel.UserManagement;

namespace Service.UserManagement
{
    public interface IUserGroupService
    {
        Task<UserGroupVm> GetUserGroupVm(Guid? id);
        System.Threading.Tasks.Task SaveUserGroup(UserGroupVm model);
        Task<IEnumerable<UserGroupVm>> GetUserGroupAll();
        Task<IEnumerable<ViewModel.UserManagement.RoleVm>> GetAllRollGroup();
        Task<List<NormalJsonClass>> GetAllRole(Guid[] selectedRole = null);
        System.Threading.Tasks.Task Delete(Guid id);
        Task<List<NormalJsonClass>> GetAllGroupName();
    }

    public class UserGroupService : IUserGroupService
    {
        private readonly IRepository<PubUser> _repo;
        private readonly IRepository<PubUserGroup> _userGroupRepo;
        private readonly IRepository<UserInRole> _userInRoleRepo;
        private readonly IRepository<PubRole> _roleRepo;

        public UserGroupService(IContextFactory contextFactory, IRepository<PubUser> repo, IRepository<PubUserGroup> userGroupRepo,
            IRepository<UserInRole> userInRoleRepo, IRepository<PubRole> roleRepo)
        {
            var currentcontext = contextFactory.GetContext();
            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _userGroupRepo = userGroupRepo;
            _userGroupRepo.FrameworkContext = currentcontext;
            _userInRoleRepo = userInRoleRepo;
            _userInRoleRepo.FrameworkContext = currentcontext;
            _roleRepo = roleRepo;
            _roleRepo.FrameworkContext = currentcontext;
        }


        public async Task<UserGroupVm> GetUserGroupVm(Guid? id)
        {
            if (id == null)
            {
                var model = new UserGroupVm
                {
                    Role = await GetAllRole(),
                    GroupName = await GetAllGroupName(),
                    RoleList = await GetAllRollGroup()
                };
                return model;
            }
            else
            {
                var userGroup = await _userGroupRepo.Find(id);
                Mapping.GenericMapping<PubUserGroup, UserGroupVm>.CreateMapping();
                var model = Mapping.GenericMapping<PubUserGroup, UserGroupVm>.Map(userGroup);
                var selectedGroup =
                    (await _userInRoleRepo.Get(m => m.UserGroupId == id && m.RoleId != Guid.Empty && m.IsDeleted == false && m.RoleId != null)
                        ).Select(m => m.RoleId.Value)
                        .ToArray();
                model.Role = await GetAllRole(selectedGroup);
                model.GroupName = await GetAllGroupName();
                model.RoleList = await GetAllRollGroup();
                model.SelectedRole = selectedGroup;
                return model;
            }
        }

        public async Task<List<NormalJsonClass>> GetAllGroupName()
        {
            return (await _roleRepo.Get(m => m.IsDeleted == false)).Select(m => new NormalJsonClass
            {
                Text = m.FaName,
                Value = m.Id.ToString()
            }).ToList();
        }

        public async Task<List<NormalJsonClass>> GetAllRole(Guid[] selectedRole = null)
        {
            return (await _roleRepo.Get(m => m.EnName != "Admin" && m.IsDeleted == false)).ToList()
                .Select(m => new NormalJsonClass
                {
                    Text = m.FaName,
                    Value = m.Id.ToString(),
                    Selected = selectedRole != null && selectedRole.Contains(m.Id)
                }).ToList();
        }

        public async Task<IEnumerable<ViewModel.UserManagement.RoleVm>> GetAllRollGroup()
        {
            var res = (from z in await _roleRepo.Get(m => m.IsDeleted == false)
                       select new ViewModel.UserManagement.RoleVm
                       {
                           Id = z.Id,
                           EnName = z.EnName,
                           FaName = z.FaName,
                           groupName = z.groupName,
                           Priority = z.Priority
                       }).AsEnumerable();
            return res;
        }

        public async System.Threading.Tasks.Task SaveUserGroup(UserGroupVm model)
        {

            if (model.Id != Guid.Empty)
            {
                //Edit
                var userGroup = await _userGroupRepo.Find(model.Id);
                userGroup.Name = model.Name;
                userGroup.EnName = model.EnName;
                await _userGroupRepo.Commit();

                await _userInRoleRepo.LogicalDelete(m => m.UserGroupId == model.Id && m.RoleId != Guid.Empty);
                foreach (var item in model.SelectedRole)
                {
                    var userInRole = new UserInRole
                    {
                        UserId = Guid.Empty,
                        RoleId = item,
                        UserGroupId = userGroup.Id,
                    };
                    await _userInRoleRepo.AddNoSaveChange(userInRole);
                }
                await _userInRoleRepo.Commit();
            }
            else
            {
                var userGroup = Mapping.GenericMapping<UserGroupVm, PubUserGroup>.Map(model);
                userGroup.CreatorId = Public.CurrentUser.Id;
                await _userGroupRepo.Add(userGroup);

                //Create Conditional By Mobin
                try
                {
                    var _time = DateTime.Now;
                    if (model.SelectedRole != null)
                        foreach (var item in model.SelectedRole)
                        {
                            var userInRole = new UserInRole
                            {
                                IsDeleted = false,
                                ModifiedDate = DateTime.Now,
                                RoleId = item,
                                UserGroupId = userGroup.Id
                            };
                            await _userInRoleRepo.AddNoSaveChange(userInRole);
                        }
                    await _userInRoleRepo.Commit();
                }
                catch (Exception ex) { }
            }
        }

        /* get all user groups.  */
        public async Task<IEnumerable<UserGroupVm>> GetUserGroupAll()
        {

            Mapping.GenericMapping<PubUserGroup, UserGroupVm>.CreateMapping();
            var res = (from z in await _userGroupRepo.Get(m => m.IsDeleted == false)
                       select new UserGroupVm
                       {
                           Id = z.Id,
                           Name = z.Name,
                       }).AsEnumerable();
            return res;
        }

        /* get an id and delete related record.  */
        public async System.Threading.Tasks.Task Delete(Guid id)
        {
            var user = await _userInRoleRepo.First(p => p.UserGroupId == id && p.IsDeleted == false && p.UserId != null && p.UserId != Guid.Empty);
            if (user != null)
            {
                throw new Exception("به دلیل استفاده از این گروه درخواست شما قابل حذف نمی باشد");
            }

            var user1 = await _userInRoleRepo.First(p => p.UserGroupId == id && p.IsDeleted == false);
            if (user1 != null)
                if (await _repo.CustomAny(p => p.Id == user1.UserId && p.IsDeleted == false))
                {
                    throw new Exception("از این گروه در قسمت کاربران استفاده شده است و قابل حذف نیست");
                }
            await _userGroupRepo.LogicalDelete(m => m.Id == id);
            await _userInRoleRepo.LogicalDelete(m => m.UserGroupId == id);
        }

        /* check to see is there a user with specific username or not.  */
        public async Task<bool> CheckUserName(string userName)
        {
            return await _repo.CustomAny(m => m.UserName == userName);
        }
    }
}
