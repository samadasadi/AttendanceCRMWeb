using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Utility;

namespace ViewModel.UserManagement
{
    public class RoleVm
    {
        public Guid Id { get; set; }
        [StringLength(100, ErrorMessage = "طول آیتم ورودی بیشتر از حد مجاز است")]
        [DisplayName("نام فارسی ")]
        [UIHint("HorizentalTextBox")]
        public string FaName { get; set; }
        public string EnName { get; set; }
        public int Priority { get; set; }
        public bool IsDeleted { get; set; }
        public Guid? ParentId { get; set; }
        public string groupName { get; set; }
        public System.Guid CreatorId { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public Guid[] SelectedRole { get; set; }

    }
}