using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Resources;
using Utility;

namespace ViewModel.UserManagement
{
    public class UserGroupVm
    {
        public Guid Id { get; set; }

        [StringLength(100, ErrorMessage = "طول آیتم ورودی بیشتر از حد مجاز است")]
        [Required(ErrorMessage = "لطفا برای گروه کاربری یک نام فارسی انتخاب کنید")]

        //Comment By Mobin
        //[Display(ResourceType = typeof(Md), Name = "FaName")]

        //Create By Mobin
        [Display(ResourceType = typeof(Md), Name = "Name")]
        [UIHint("HorizentalTextBox")]
        public string Name { get; set; }
        [Display(ResourceType = typeof(Md), Name = "EnName")]

        //Comment By Mobin
        //[Required(ErrorMessage = "لطفا برای گروه کاربری یک نام انگلیسی انتخاب کنید")]

        [UIHint("HorizentalTextBox")]
        public string EnName { get; set; }

        public System.Guid CreatorId { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }

        public List<NormalJsonClass> Role { get; set; }
        public List<NormalJsonClass> GroupName { get; set; }
        public Guid[] SelectedGroupName { get; set; }
        public IEnumerable<RoleVm> RoleList { get; set; }

        [UIHint("HorizentalDropdwonGuidNullable")]
        [Display(ResourceType = typeof(Md), Name = "RoleUser")]
        public Guid RoleId { get; set; }
        public Guid[] SelectedRole { get; set; }

    }
}
