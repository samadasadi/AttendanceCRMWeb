//using Resources;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using System.Web;
//using Utility;

//namespace ViewModel.UserManagement
//{
//    public class EditUserVm
//    {
//        public Guid Id { get; set; }
//        public Guid MedicalCenterId { get; set; }

//        [Required(ErrorMessage = "*")]
//        [Display(ResourceType = typeof(Md), Name = "DocNO")]
//        [UIHint("HorizentalTextBox")]
//        [Remote("CheckDuplicateDocNo", "Register", HttpMethod = "POST", ErrorMessage = "رکورد تکراری است")]
//        public string EmployeeID { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Name")]
//        [Required(ErrorMessage = "*")]
//        //[DisplayName("نام ")]
//        [UIHint("HorizentalTextBox")]
//        public string Name { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Family")]
//        [Required(ErrorMessage = "*")]
//        //[DisplayName("نام خانوادگی ")]
//        [UIHint("HorizentalTextBox")]
//        public string Family { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "FatherName")]
//        //[DisplayName("نام پدر ")]
//        [UIHint("HorizentalTextBox")]
//        public string FatherName { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Phone")]
//        // [DisplayName("تلفن ")]
//        [UIHint("HorizentalTextBox")]
//        public string PhoneNo { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "MobileNumber")]
//        [RegularExpression(@"^09[1-9]\d{2,9}$", ErrorMessage = "فرمت موبایل را اینگونه 09126666666 وارد کنید")]
//        [UIHint("HorizentalTextBox")]
//        public string MobileNumber { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "UserName")]
//        //[DisplayName("نام کاربری ")]
//        [UIHint("HorizentalTextBox")]
//        [Required(ErrorMessage = "*")]
//        [Remote("CheckDuplicate", "Register", HttpMethod = "POST", ErrorMessage = "نام کاربری شما تکراری است")]
//        public string UserName { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Password")]
//        [DisplayName("رمز عبور ")]
//        [Required(ErrorMessage = "*")]
//        [UIHint("HorizentalPassword")]
//        public string Password { get; set; }

//        //[DisplayName("وضعیت دسترسی")]
//        //[UIHint("HorizentalDropdwonGuidNullable")]
//        //public Guid? ParentId { get; set; }
//        //public List<NormalJsonClass> ParentLists { get; set; }
//        public string GetFullName()
//        {
//            return this.Name + " " + this.Family;
//        }

//        public List<NormalJsonClass> RoleGroups { get; set; }
//        // public List<NormalJsonClass> TreatmentTopicsList { get; set; }
//        public List<NormalJsonClass> TreatmentTopicsList { get; set; }
//        //[Display(Name = "سرفصل های تخصصی")]
//        [Display(ResourceType = typeof(Md), Name = "TreatmentTopics")]
//        [UIHint("HorizentalDropdwonMultiple")]
//        public int[] TreatmentTopics { get; set; }

//        public List<UserGroupVm> UserGroupsList { get; set; }
//        public Guid[] SelectedRoleGroups { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "IsMale")]
//        //[DisplayName("جنسیت ")]
//        [UIHint("HorizentalDropdwonR")]
//        public bool IsMale { get; set; }
//        public Guid CreatorId { get; set; }
//        public DateTime ModifiedDate { get; set; }
//        public bool IsDeleted { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "UserType")]
//        //[DisplayName("سمت شغلی ")]
//        [Required(ErrorMessage = "*")]
//        [UIHint("HorizentalDropdwonR")]
//        public string UserType { get; set; }
//        public string UserTypeName { get; set; }
//        public List<NormalJsonClass> UserTypeList { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "NationalCode")]
//        //[DisplayName("کد ملی")]
//        [UIHint("HorizentalTextBox")]
//        public string NationalCode { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "NezamCode")]
//        //[DisplayName("نظام پزشکی")]
//        [UIHint("HorizentalTextBox")]
//        public string NezamCode { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "PercentOfPay")]
//        [UIHint("HorizentalNumberTextBox")]
//        public decimal? PercentOfPay { get; set; }


//        [Display(ResourceType = typeof(Md), Name = "DateofBirth")]
//        //[DisplayName("تاریخ تولد")]
//        [UIHint("HorizentalCompleteDateTimeTextBox")]
//        public DateTime? DateBirthEn { get; set; }
//        public string DateofBirth { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "ValidityDateFrom")]
//        [UIHint("HorizentalCompleteDateTimeTextBox")]
//        public DateTime? FromValidityDate { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "ValidityDateTo")]
//        [UIHint("HorizentalCompleteDateTimeTextBox")]
//        public DateTime? ToValidityDate { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "PlaceofBirth")]
//        //[DisplayName("محل تولد")]
//        [UIHint("HorizentalTextBox")]
//        public string PlaceofBirth { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Education")]
//        [UIHint("HorizentalDropdwonR")]
//        public string Education { get; set; }
//        public string EducationName { get; set; }
//        public List<NormalJsonClass> EducationList { get; set; }


//        [Display(ResourceType = typeof(Md), Name = "Degree")]
//        [UIHint("HorizentalDropdwonR")]
//        public string DegreeID { get; set; }
//        public List<NormalJsonClass> DegreeList { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Married")]
//        [UIHint("HorizentalDropdwonR")]
//        public bool Married { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Address")]
//        [UIHint("HorizentalTextArea")]
//        public string Address { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "EmployeeActive")]
//        [UIHint("HorizentalCheckBox")]
//        public bool EmployeeActive { get; set; }

//        [Display(ResourceType = typeof(Md), Name = "Assistant")]
//        [UIHint("HorizentalCheckBox")]
//        public bool empIsAssistant { get; set; }
//        [Display(ResourceType = typeof(Md), Name = "File")]
//        public Guid FileId { get; set; }
//        public HttpPostedFileBase File { get; set; }
//        public string ImgPath { get; set; }

//        [DisplayName("کابر ارشد")]
//        [UIHint("HorizentalDropdwonGuidNullable")]
//        public Guid? ParentId { get; set; }
//        public List<NormalJsonClass> ParentLists { get; set; }
//    }
//}
