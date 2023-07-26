using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.UserManagement
{
    public class PubUserProfileVm
    {
        public Guid Id { get; set; }

        [DisplayName("نام")]
        [UIHint("HorizentalTextBox")]
        public string Name { get; set; }
        [DisplayName("نام خانوادگی")]
        [UIHint("HorizentalTextBox")]
        public string Family { get; set; }
        [DisplayName("نام پدر")]
        [UIHint("HorizentalTextBox")]
        public string FathersName { get; set; }
        [DisplayName("کد ملی")]
        [UIHint("HorizentalNumberTextBox")]
        public string NationalCode { get; set; }
        [DisplayName("آدرس")]
        [UIHint("HorizentalTextArea")]
        public string Address { get; set; }
        [DisplayName("جنسیت")]
        [UIHint("HorizentalTextBox")]
        public Nullable<bool> IsMale { get; set; }
        [DisplayName("تاریخ تولد")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime Datebirth { get; set; }
        [DisplayName("تاریخ تولد")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public string BirthPlace { get; set; }
        [DisplayName("تحصیلات")]
        [UIHint("HorizentalTextBox")]
        public string Education { get; set; }
        [DisplayName("سمت شغلی")]
        [UIHint("HorizentalTextBox")]
        public string Job { get; set; }
        [DisplayName("رشته تحصیلی")]
        [UIHint("HorizentalTextBox")]
        public string FieldStudy { get; set; }
        [DisplayName("تلفن ثابت")]
        [UIHint("HorizentalNumberTextBox")]
        public int Phone { get; set; }
        [DisplayName("همراه")]
        [UIHint("HorizentalNumberTextBox")]
        public int Mobile { get; set; }
        [DisplayName("درصد پرداخت")]
        [UIHint("HorizentalTextBox")]
        public int HorizentalNumberTextBox { get; set; }
        [DisplayName("ایمیل")]
        [UIHint("HorizentalTextBox")]
        public string Email { get; set; }
        public System.Guid CreatorId { get; set; }
    }
}
