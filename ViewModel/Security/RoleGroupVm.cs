using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ViewModel.Security
{
    public class RoleGroupVm : BasicVm
    {
        /// <summary>
        /// همی رل ها
        /// </summary>
        public IEnumerable<RoleVm> RoleVms { get; set; }

        /// <summary>
        ///آی دی رل های تخصیص داده شده
        /// </summary>
        public List<Guid> AddedRoleVms { get; set; }


        [UIHint("HorizentalTextBox")]
        [DisplayName("نام گروه کاربری")]
        public string Name { get; set; }

        [UIHint("HorizentalTextBox")]
        [DisplayName("نام گروه کاربری به لاتین")]
        public string EnName { get; set; }


        /// <summary>
        /// لیست رل های انتخابی
        /// </summary>
        public Guid[] SelectetRoles { get; set; }



    }
}