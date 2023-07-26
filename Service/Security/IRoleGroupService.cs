using System;
using System.Collections.Generic;
using Repository.Model;
using ViewModel.UserManagement;
using RoleVm = ViewModel.Security.RoleVm;

namespace Service.Security
{
    public interface IRoleGroupService 
    {
        /// <summary>
        /// Get All Role 
        /// </summary>
        /// <returns></returns>
        IEnumerable<UserGroupVm> GetAllRoleGroupVms();

        /// <summary>
        /// لیست تمام رل های موجود در سیستم به منظور تعریف گروه کاربری  جدید
        /// </summary>
        /// <returns></returns>
        IEnumerable<RoleVm> GetAllRoleVm();

        UserGroupVm GetRoleGroupVm(Guid? id);

        /// <summary>
        /// Save RoleGroup >> Create New Or Update
        /// </summary>
        /// <param name="model"></param>
        void SaveRoleGroup(UserGroupVm model);

        IEnumerable<UserInRole> GetAllUserGroupInRoles(Guid roleGroupId);

        bool CheckRoleGroup(string roleGroup,PubUser user);

       PubUserGroup GetRoleGroup(PubUser user);
    }
}