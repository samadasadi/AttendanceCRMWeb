using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace ViewModel.BasicInfo
{
    public class MedicalCenterVm
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }

        public DateTime ModifiedDate { get; set; }
        //[DisplayName("نام")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string Name { get; set; }
        public string ConnectionString { get; set; }

        [Display(ResourceType = typeof(Md), Name = "MedicalCenter_DatabaseName")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatebaseName { get; set; }


        [Display(ResourceType = typeof(Md), Name = "MedicalCenter_ServerName")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string ServerName { get; set; }
        public string ServerNameLocal { get; set; }


        [Display(ResourceType = typeof(Md), Name = "MedicalCenter_DatabaseUser")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatabaseUser { get; set; }
        [Display(ResourceType = typeof(Md), Name = "MedicalCenter_Password")]

        [UIHint("HorizentalPassword")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatabasePassword { get; set; }

        //Create Propertys By Mobin
        public Nullable<DateTime> FromDate { get; set; }
        public Nullable<DateTime> ToDate { get; set; }
        public bool Status { get; set; }
        public string DomainSize { get; set; }
        public Nullable<int> PortNo { get; set; }
    }

    public class MedicalCenterTempVm
    {
        public Guid Id { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime ModifiedDate { get; set; }

        [Display(Name = "نام دامنه")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string Name { get; set; }

        public string ConnectionString { get; set; }

        [Display(Name = "نام پایگاه داده")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatebaseName { get; set; }

        [Display(Name = "نام سرور")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string ServerName { get; set; }

        [Display(Name = "نام کاربری")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatabaseUser { get; set; }

        [Display(Name = "کلمه عبور")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید")]
        public string DatabasePassword { get; set; }

        [Display(Name = "از تاریخ")]
        public Nullable<DateTime> FromDate { get; set; }

        [Display(Name = "تا تاریخ")]
        public Nullable<DateTime> ToDate { get; set; }

        public bool Status { get; set; }

        [Display(Name = "حجم دامنه")]
        public string DomainSize { get; set; }

        public Nullable<int> PortNo { get; set; }
    }

    public class SearchMedicalCenterVm
    {
        [Display(Name = "از تاریخ")]
        public Nullable<DateTime> FromDateForFilter { get; set; }

        [Display(Name = "تا تاریخ")]
        public Nullable<DateTime> ToDateForFilter { get; set; }

        [Display(Name = "حداقل حجم دامنه")]
        public string DomainSizeMin { get; set; }

        [Display(Name = "حداکثر حجم دامنه")]
        public string DomainSizeMax { get; set; }

        [Display(Name = "انقضا")]
        public bool Expiration { get; set; }

        [Display(Name = "وضعیت")]
        public bool StatusForFilter { get; set; }

        [Display(Name = "نامحدود")]
        public bool Unlimited { get; set; }
    }
}
