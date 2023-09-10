using Repository.Model;
using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.Web.Mvc;
using Utility;
using ViewModel.UserManagement.Attendance;

namespace ViewModel.UserManagement
{
    public class UserVm: PageingParamer
    {
        public UserVm()
        {
            personHoghogh = new PersonHoghoghVm();
            personAccountingFilter = new PersonAccountingFilter();

        }
        public Guid Id { get; set; }

        [Required(ErrorMessage = "*")]
        [Display(Name = "شماره پرسنلی")]
        [UIHint("HorizentalTextBox")]
        [Remote("CheckDuplicateDocNo", "Register", HttpMethod = "POST", ErrorMessage = "رکورد تکراری است")]
        //Create By Mobin
        [RegularExpression("([0-9]+)", ErrorMessage = "لطفا برای {0} عدد وارد کنید")]
        public string EmployeeID { get; set; }
        public string UrlData { get; set; }
        public int? UserId { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Name")]
        [Required(ErrorMessage = "*")]
        //[DisplayName("نام ")]
        [UIHint("HorizentalTextBox")]
        public string Name { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Family")]
        [Required(ErrorMessage = "*")]
        //[DisplayName("نام خانوادگی ")]
        [UIHint("HorizentalTextBox")]
        public string Family { get; set; }





        public int? Previlige { get; set; }
        public string FaceImage { get; set; }
        public List<FingerTemplate> FingerPrints { get; set; }
        public int DeviceId { get; set; }





        public int? ChatStatus { get; set; }
        [Display(ResourceType = typeof(Md), Name = "FatherName")]
        //[DisplayName("نام پدر ")]
        [UIHint("HorizentalTextBox")]
        public string FatherName { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Phone")]
        // [DisplayName("تلفن ")]
        [UIHint("HorizentalTextBox")]
        public string PhoneNo { get; set; }

        [Display(ResourceType = typeof(Md), Name = "MobileNumber")]
        [RegularExpression(@"^09[0-9]\d{2,9}$", ErrorMessage = "فرمت موبایل را اینگونه 09126666666 وارد کنید")]
        [UIHint("HorizentalTextBox")]
        public string MobileNumber { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserName")]
        //[DisplayName("نام کاربری ")]
        [UIHint("HorizentalTextBox")]
        //[Required(ErrorMessage = "*")]
        [Remote("CheckDuplicate", "Register", HttpMethod = "POST", ErrorMessage = "نام کاربری شما تکراری است", AdditionalFields = "Id")]
        public string UserName { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Password")]
        [DisplayName("رمز عبور ")]
        //[Required(ErrorMessage = "*")]
        [UIHint("HorizentalPassword")]
        public string Password { get; set; }

        //[DisplayName("وضعیت دسترسی")]
        //[UIHint("HorizentalDropdwonGuidNullable")]
        //public Guid? ParentId { get; set; }
        //public List<NormalJsonClass> ParentLists { get; set; }
        public string GetFullName()
        {
            return this.Name + " " + this.Family;
        }

        public List<NormalJsonClass> RoleGroups { get; set; }


        public List<UserGroupVm> UserGroupsList { get; set; }
        public Guid[] SelectedRoleGroups { get; set; }

        [Display(ResourceType = typeof(Md), Name = "IsMale")]
        //[DisplayName("جنسیت ")]
        [UIHint("HorizentalDropdwonR")]
        public bool IsMale { get; set; }
        public Guid CreatorId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserType")]
        //[DisplayName("سمت شغلی ")]
        [Required(ErrorMessage = "*")]
        [UIHint("HorizentalDropdwonR")]
        public string UserType { get; set; }
        public string UserTypeName { get; set; }
        public List<NormalJsonClass> UserTypeList { get; set; }

        [Display(ResourceType = typeof(Md), Name = "NationalCode")]
        //[DisplayName("کد ملی")]
        [UIHint("HorizentalTextBox")]
        public string NationalCode { get; set; }




        [Display(ResourceType = typeof(Md), Name = "DateofBirth")]
        //[DisplayName("تاریخ تولد")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? DateBirthEn { get; set; }
        public string DateBirthEnStrPersian
        {
            get
            {
                if (DateBirthEn.HasValue)
                {
                    return DateBirthEn != null ? DateTimeOperation.M2S(DateBirthEn.Value) : "";
                }
                return string.Empty;
            }
        }
        public string DateofBirth { get; set; }

        [Display(ResourceType = typeof(Md), Name = "ValidityDateFrom")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? FromValidityDate { get; set; }
        public string FromValidityDateStr { get; set; }

        [Display(ResourceType = typeof(Md), Name = "ValidityDateTo")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? ToValidityDate { get; set; }
        public string ToValidityDateStr { get; set; }

        [Display(ResourceType = typeof(Md), Name = "PlaceofBirth")]
        //[DisplayName("محل تولد")]
        [UIHint("HorizentalTextBox")]
        public string PlaceofBirth { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Education")]
        [UIHint("HorizentalDropdwonR")]
        public string Education { get; set; }
        public string EducationName { get; set; }
        public List<NormalJsonClass> EducationList { get; set; }


        [Display(ResourceType = typeof(Md), Name = "Degree")]
        [UIHint("HorizentalDropdwonR")]
        public string DegreeID { get; set; }
        public List<NormalJsonClass> DegreeList { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Married")]
        [UIHint("HorizentalDropdwonR")]
        public bool Married { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Address")]
        [UIHint("HorizentalTextArea")]
        public string Address { get; set; }

        [Display(ResourceType = typeof(Md), Name = "EmployeeActive")]
        [UIHint("HorizentalCheckBox")]
        public bool EmployeeActive { get; set; }

        [Display(ResourceType = typeof(Md), Name = "File")]
        public Guid FileId { get; set; }
        public HttpPostedFileBase File { get; set; }
        public string ImgPath { get; set; }

        [DisplayName("کابر ارشد")]
        [UIHint("HorizentalDropdwonGuidNullable")]
        public Guid? ParentId { get; set; }
        public List<NormalJsonClass> ParentLists { get; set; }
        public string Image { get; set; }
        public string RoleID { get; set; }


        [Display(Name = "فعالسازی نام کاربری")]
        [UIHint("HorizentalCheckBox")]
        public bool IsUserActive { get; set; }
        public bool CanAddUser { get; set; }
        public int UserActiveCount { get; set; }

        /// <summary>
        /// For Doctor
        /// </summary>
        public int UserDoctorCount { get; set; }

        /// <summary>
        /// امضای کاربر
        /// </summary>
        [Display(ResourceType = typeof(Md), Name = "cbiSignImage")]
        [UIHint("HorizentalTextBox")]
        public string cbiSignImage { get; set; }
        public string Canvas { get; set; }
        public Guid? SignFileId { get; set; }




        public string WebCamBase64 { get; set; }






        public string AuthorizationsSessionId { get; set; }
        public DateTime? LastAuthorizationsSessionDate { get; set; }
        public PersonHoghoghVm personHoghogh { get; set; }
        public PersonAccountingFilter personAccountingFilter { get; set; }



        [Display(Name = "کد تایید")]
        [UIHint("HorizentalTextBox")]
        public int OTP { get; set; }

        public int UnreadCount { get; set; }



        [Display(Name = "درصد مالیات")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal TaxPercent { get; set; }

        public bool IsAccountingClient { get; set; }













        public bool IsPresent { get; set; }
        public string IsPresentStr { get { return IsPresent ? "حاضر" : "غایب"; } }
        public DateTime? EnterDate { get; set; }
        public string EnterTime { get { return EnterDate != null ? EnterDate.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate { get; set; }
        public string LeaveTime { get { return LeaveDate != null ? LeaveDate.Value.ToString("HH:mm") : string.Empty; } }








    }

    public class Filter_UserVm : PageingParamer
    {

        public string UserType { get; set; }

        public bool? EmployeeActive { get; set; }

        public bool? IsUserActive { get; set; }

    }


}