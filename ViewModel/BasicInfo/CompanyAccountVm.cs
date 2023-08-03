using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Utility.Utitlies;
using Utility;

namespace ViewModel.BasicInfo
{
    public class CompanyAccountVm 
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public Guid MedicalCenterId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int AutoID { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "TitleIncoming")]
        public string costInCode { get; set; }
        public bool TitleIncoming { get; set; }
        public List<NormalJsonClass> CostCodeList { get; set; }
        public string NameCoding { get; set; }

        //[UIHint("HorizentalCurrencyTextBoxDecimal")]
        [UIHint("HorizentalTextBox")]
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "Price")]
        public decimal Price { get; set; }
        public string PriceSplitStr { get { return this.Price.ToPrice(); } }

        public string PriceStr { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Factor_No")]
        public string Factor_No { get; set; }

        [UIHint("HorizentalTextArea")]
        [Display(ResourceType = typeof(Md), Name = "Coment")]
        public string Coment { get; set; }

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Date")]
        public DateTime DateEn { get; set; } = DateTime.Now;
        public string date
        {
            get
            {
                return DateEn != null ? DateTimeOperation.M2S((DateTime)DateEn) : "";
            }
            set
            { }
        }

        [UIHint("HorizentalTextBox")]
        [DisplayName("cost")]
        public decimal? cost { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        //public string costInPersonID { get; set; }
        public string costPersonID { get; set; }
        public List<NormalJsonClass> PersonList { get; set; }
        public string PersonName { get; set; }

        [UIHint("HorizentalTextBox")]
        [DisplayName("costInUserID")]
        public int? costInUserID { get; set; }
        public Guid costUserID { get; set; }
        public string UserName { get; set; }

        public bool? Exported { get; set; }
        public bool? Selected { get; set; }
        public int? RefvchhdrID { get; set; }
        public Guid? costRefIncomeID { get; set; }
        public Guid? costRefID { get; set; }

        public long Row { get; set; }

        public string IconInUploadOrCheck { get; set; }


        public bool IsEmployeeAccount { get; set; }
        public Guid? EmployeeAccountId { get; set; }
        public string UserType { get; set; }





        [UIHint("HorizentalTextBox")]
        [Display(Name = "مبلغ تخفیف")]
        public decimal? DiscountPrice { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "هزینه حمل و نقل")]
        public decimal? TransportCost { get; set; }


    }
    
    public class FilterModelCompanyAccount : PageingParamer
    {
        public Guid Id { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "TitleIncoming")]
        public Guid costInCode { get; set; }
        public List<NormalJsonClass> CostCodeList { get; set; }

        public string Type { get; set; }
        //[Display(ResourceType = typeof(Md), Name = "From")]
        //[UIHint("HorizentalCompleteDateTimeTextBoxNullable")]
        //public DateTime? fromDate { get; set; }

        //[Display(ResourceType = typeof(Md), Name = "To")]
        //[UIHint("HorizentalCompleteDateTimeTextBoxNullable")]
        //public DateTime? ToDate { get; set; }


        //public int PageNum { get; set; }

        //public int PageSiz { get; set; }

        //public string text { get; set; }

    }

}
