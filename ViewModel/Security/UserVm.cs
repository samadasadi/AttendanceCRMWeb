using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Utility;
using ViewModel.UserManagement.Attendance;

namespace ViewModel.Security
{
    public class UserVm : BasicVm
    {

        [DisplayName("نام")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [StringLength(100, ErrorMessage = "*")]
        public string Name { get; set; }

        [DisplayName("نام خانوادگی")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [StringLength(100, ErrorMessage = "*")]
        public string Family { get; set; }

        [DisplayName("ایمیل")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [StringLength(100, ErrorMessage = "*")]
        public string Email { get; set; }

        [DisplayName("شماره تماس")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [StringLength(100, ErrorMessage = "*")]
        public string Phone { get; set; }

        [DisplayName("نام کاربری")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [StringLength(20, ErrorMessage = "*")]
        public string UserName { get; set; }

        [UIHint("HorizentalPassword")]
        [DisplayName("کلمه عبور")]
        [Required(ErrorMessage = "*")]
        [StringLength(20, ErrorMessage = "*")]
        public string Password { get; set; }
        [DisplayName("کابر ارشد")]
        [UIHint("HorizentalTextBox")]
        public Guid? ParentId { get; set; }

        public string GetFullName()
        {
            return this.Name + " " + this.Family;
        }

        [DisplayName("جنسیت")]
        public bool IsMale { get; set; }


    }


    public class PubUserLoinVm
    {
        public int UserId { get; set; }
        public Guid Id { get; set; }
        public Nullable<System.Guid> FileId { get; set; }
        public DateTime? FromValidityDate { get; set; }
        public DateTime? ToValidityDate { get; set; }
        public bool? IsUserActive { get; set; }
        public string EmployeeTypeID { get; set; }
        public bool? IsCallerActive { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NetworkUserName { get; set; }
        public bool IsAdministrator { get { return this.NetworkUserName.ToLower() == "admin"; } }
        public string UserPwd { get; set; }

        public string DiseaseGroupAccessPatient { get; set; }
        public bool IsAccountingClient { get; set; }
    }


    public class UsingAccountInformationVm
    {
        public string ExpierDate { get; set; }
        public DateTime? ExpierDateEn { get; set; }

        public DateTime? LastUpdateDate { get; set; }
        public int? PatientCount { get; set; }
        public DateTime? LastBackUpDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string KeyCode { get; set; }
        public string CurrentVersion { get; set; }


        public string Operation_System { get; set; }
        public string Operation_System_Version { get; set; }

        public int? DoctorCount { get; set; }
        public int? UserCount { get; set; }
        public int? ActiveUserCount { get; set; }


        public string AdditionallData { get; set; }
        public List<AdditionalDoctorInfo> AdditionallDataJson { get; set; }


    }


    public class DoctorAccountVm
    {
        public string KeyCode { get; set; }
    }
    public class AccountExpireInfo: UsingAccountInformationVm
    {
        public string ExpierDateEnStr { get { return ExpierDateEn != null ? DateTimeOperation.M2S(this.ExpierDateEn.Value) : ""; } }

        public int RemainDayCount
        {
            get
            {
                int _result = 0;

                if (this.ExpierDateEn == null) return _result;

                _result = (int)(this.ExpierDateEn.Value.Date - DateTime.Now.Date).TotalDays;

                return _result;
            }
        }
    }

    public class AdditionalDoctorInfo
    {
        public string DoctorName { get; set; }
        public string NationalCode { get; set; }
        public string NezamCode { get; set; }
        public string MobileNumber { get; set; }
        public string Salamat_Username { get; set; }
        public string Salamat_Password { get; set; }
    }

}