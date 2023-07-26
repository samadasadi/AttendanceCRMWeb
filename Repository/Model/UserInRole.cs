using System;

namespace Repository.Model
{
    public partial class UserInRole:BaseClass
    {
        public Guid? RoleId { get; set; }
        public Guid? UserGroupId { get; set; }
        public Guid? UserId { get; set; }
    }
}
