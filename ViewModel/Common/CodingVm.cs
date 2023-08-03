using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Utility.CommonAttribute;
using Utility.Utitlies;
using Utility;

namespace ViewModel.Common
{
    public class CodingVm
    {
        [UIHint("HorizentalTextBox")]
        //[DisplayName("code")]
        public string code { get; set; }

        public string Id { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        public string name { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("len")]
        public short len { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("level")]
        public short level { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("FaName")]
        [Display(ResourceType = typeof(Md), Name = "FormBuilderName")]
        [UIHint("HorizentalTextBox")]
        [MVCReadOnly(true)]
        public string FaName { get; set; }
        public List<NormalJsonClass> FormBuilderList { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("Factor")]
        public int? Factor { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "DiscountRate")]
        public string UserCode { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "ShareDoctor")]
        public string tag { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "ShareClinic")]
        public string index { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "ShareAssistant")]
        public string Price { get; set; }
        public string PriceStr { get { try { return !string.IsNullOrEmpty(this.Price) ? Convert.ToDecimal(this.Price).ToPrice() : "0"; } catch { return "0"; } } }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "ShowInMainMenu")]
        public bool? CodeActive { get; set; } = false;

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "عدم نمایش چارت دندان")]
        public bool Assistance { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "ShowInWorkFlow")]
        public bool? WorkFlow { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "ShowInForm")]
        public bool? MultiInsertedForm { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("CodeIsLimited")]
        public bool? CodeIsLimited { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("CodeCanGrow")]
        public bool? CodeCanGrow { get; set; }

        [UIHint("HorizentalTextBox")]
        //[DisplayName("CodeComments")]
        public string CodeComments { get; set; }
        public string codeActiveStatus { get; set; }
        public string Parent { get; set; }
        //public List<ProfileVm> ProfileList { get; set; }

        [UIHint("HorizentalCurrencyTextBoxDecimal")]
        [Display(Name = "هزینه درمان")]
        public decimal? Fixedprice { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "عنوان درمان")]
        public string TitleDarman { get; set; }

        public int CountAllForPageing { get; set; }

        [UIHint("HorizentalDropdwonRCol-4-8")]
        [Display(Name = "انتخاب فرم")]
        public string ToothColor { get; set; }


        [UIHint("HorizentalTextBox")]
        [Display(Name = "آی پی دستگاه")]
        public string POS_Ip { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "پورت")]
        public string POS_Port { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "شماره حساب")]
        public string POS_InvoiceNumber { get; set; }


        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "شرکت")]
        public int? POS_DeviceId { get; set; }
        public List<NormalJsonClass> POS_DeviceLists { get; set; }

        public bool POS_IsIPDevice { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد بین المللی")]
        public string InternationalServiceCode { get; set; }


        [UIHint("HorizentalCheckBox")]
        [Display(Name = "کسر کل هزینه درمان از سقف تعهد بیمه")]
        public bool DeductionCommitmentCeiling { get; set; }





    }

    public class Filter_CodingVm : PageingParamer
    {
        public string Code { get; set; }
    }
}
