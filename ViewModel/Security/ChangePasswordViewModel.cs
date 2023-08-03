using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Utility;

namespace ViewModel.Security
{

    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ChangePasswordViewModel
    {
        [Required(ErrorMessage = "*")]
        //[EmailAddress]
        [Display(Name = "کلمه عبور فعلی")]
        [UIHint("HorizentalPassword")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "*")]
        // [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [UIHint("HorizentalPassword")]
        [Display(Name = "کلمه عبور جدید")]
        public string NewPassword { get; set; }

        [UIHint("HorizentalPassword")]
        [Display(Name = "تکرار کلمه عبور ")]
        [Compare("NewPassword", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(Name = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(Name = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "*")]
        [Display(Name = "نام کاربری")]
        public string UserName { get; set; }

        //[Required(ErrorMessage = "*")]
        [DataType(DataType.Password)]
        [Display(Name = "کلمه عبور")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }



        [Display(ResourceType = typeof(Md), Name = "CardNo")]
        [UIHint("HorizentalTextBox")]
        public string CardNo { get; set; }

        //Change By Mobin        
        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Md), Name = "MobileNumber")]
        [UIHint("HorizentalTextBox")]
        public string MobileNumber { get; set; }

        [Display(ResourceType = typeof(Md), Name = "NationalCode")]
        [UIHint("HorizentalTextBox")]
        public string NationalCode { get; set; }


        public string FullName { get; set; }
        public string ImagePath { get; set; }
    }

    public class LoginCustomerClubViewModel
    {

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }

        public List<NormalJsonClass> MedicalList { get; set; }

        [Required(ErrorMessage = "لطفا کلینیک را انتخاب کنید")]
        public Guid MedicalId { get; set; }

        [Display(ResourceType = typeof(Md), Name = "CardNo")]
        [UIHint("HorizentalTextBox")]
        public string CardNo { get; set; }

        //Change By Mobin
        [Required(ErrorMessage = "*")]
        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Md), Name = "MobileNumber")]
        [UIHint("HorizentalTextBox")]
        public string MobileNumber { get; set; }

        //Change By Mobin
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "NationalCode")]
        [UIHint("HorizentalTextBox")]
        public string NationalCode { get; set; }
    }

    public class LoginCustomerClubWithCardViewModel
    {
        public List<NormalJsonClass> MedicalList { get; set; }

        [Required(ErrorMessage = "لطفا کلینیک را انتخاب کنید")]
        public Guid MedicalId { get; set; }

        [Display(ResourceType = typeof(Md), Name = "CardNo")]
        [UIHint("HorizentalTextBox")]
        public string CardNo { get; set; }
    }

    public class LoginManagerViewModel
    {
        [Required(ErrorMessage = "*")]
        [Display(Name = "نام کاربری")]
        public string UserName { get; set; }

        //[Required(ErrorMessage = "*")]
        [DataType(DataType.Password)]
        [Display(Name = "کلمه عبور")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

}
