//using System;
//using System.Collections.Generic;
//using System.Linq;
//using Mapping;
//using Repository;
//using Repository.Model;
//using Service.Consts;
//using ViewModel.Security;

//namespace Service.Security
//{
//    public class RoleGroupService
//    {
//        private readonly IUserService _userService;
//        private readonly IRepository<PubRole> _roleRepo;
//        private readonly IRepository<UserInRole> _userInRoleRepo;

//        public RoleGroupService(IRepository<UserGroup> repo, IUserService userService, IRepository<UserInRole> userInRoleRepo,
//            IRepository<Role> roleRepo
//        )

//        {
//            _userService = userService;
//            _userInRoleRepo = userInRoleRepo;
//            _roleRepo = roleRepo;
//        }


//        public IEnumerable<RoleVm> GetAllRoleVm()
//        {
//            var lstRoles = _roleRepo.Get(m => m.EnName != AppSettings.AdminRoleName).Select(GenericMapping<Role, RoleVm>.MapToDestination);
//            return lstRoles;
//        }

//        public IEnumerable<UserGroupVm> GetAllRoleGroupVms()
//        {
//            var lstRoleVms = GetAll().Select(GenericMapping<UserGroup, UserGroupVm>.MapToDestination);
//            return lstRoleVms;
//        }



//        public UserGroupVm GetRoleGroupVm(Guid? id)
//        {
//            if (id.HasValue)
//            {
//                var obj = Find(id);
//                var roleGroupVm = GenericMapping<UserGroup, UserGroupVm>.MapToDestination(obj);
//                roleGroupVm.RoleVms = GetAllRoleVm();
//                roleGroupVm.AddedRoleVms = GetAllUserGroupInRoles(id.Value).Select(m => m.RoleId).ToList();
//                return roleGroupVm;
//            }
//            else
//            {
//                var roleGroupVm = new UserGroupVm { RoleVms = GetAllRoleVm(), AddedRoleVms = new List<Guid>() };
//                return roleGroupVm;
//            }
//        }



//        public void SaveRoleGroup(UserGroupVm model)
//        {
//            var roleG = GenericMapping<UserGroupVm, UserGroup>.MapToDestination(model);
//            if (model.Id == Guid.Empty)
//            {

//                var roleGroupId = roleG.Id;
//                foreach (var roleId in model.SelectetRoles)
//                {
//                    _userInRoleRepo.Add(new UserInRole
//                    {
//                        UserGroupId = roleGroupId,
//                        RoleId = roleId,
//                    });
//                }
//            }
//            else
//            {
//                Update(roleG);
//                var preRole = GetAllUserGroupInRoles(model.Id);
//                foreach (var item in preRole)
//                {
//                    //_userInRoleRepo.DeleteNoSaveChange(item);
//                }

//                foreach (var roleId in model.SelectetRoles)
//                {
//                    _userInRoleRepo.Add(new UserInRole
//                    {
//                        UserGroupId = model.Id,
//                        RoleId = roleId
//                    });
//                }
//            }
//        }


//        public IEnumerable<UserInRole> GetAllUserGroupInRoles(Guid roleGroupId)
//        {
//            return _userInRoleRepo.Get(m => m.UserGroupId == roleGroupId);
//        }

//        public bool CheckRoleGroup(string roleGroup, User user)
//        {
//            if (user == null)
//            {
//                return false;
//            }
//            var role = First(m => m.EnName == roleGroup);
//            var preGroupInRole = _userInRoleRepo.First(m => m.UserId == user.Id && m.RoleId == Guid.Empty);
//            if (preGroupInRole != null)
//            {
//                //کاربر عضو گروه کاربری می باشد
//                if (preGroupInRole.UserGroupId == role.Id)
//                {
//                    return true;
//                }

//            }
//            return false;
//        }

//        public UserGroup GetRoleGroup(User user)
//        {
//            var preGroupInRole = _userInRoleRepo.First(m => m.UserId == user.Id && m.RoleId == Guid.Empty);
//            if (preGroupInRole != null)
//            {
//                return Find(preGroupInRole.UserGroupId);
//            }
//            return null;
//        }




//    }
//}