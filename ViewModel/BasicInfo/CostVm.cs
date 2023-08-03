
using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.EXT;
using Utility.PublicEnum;
using Utility.Utitlies;

namespace ViewModel.BasicInfo
{
    public class CostVm
    {
        public CostVm()
        {
            this.ModifiedDate = DateTime.Now;
            this.FromDate = DateTime.Now;
            this.ToDate = DateTime.Now;
        }

        public int WarehouseId { get; set; }

        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public Guid MedicalCenterId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int Autoid { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "CostCode")]
        public string CostCode { get; set; }
        public List<NormalJsonClass> CostCodeList { get; set; }
        public string NameCoding { get; set; }

        //[UIHint("HorizentalCurrencyTextBoxDecimal")]
        [UIHint("HorizentalCurrencyTextBoxDecimal")]
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
        public string date
        {
            get
            {
                return DateEn != null ? DateTimeOperation.M2S((DateTime)DateEn) : "";
            }
            set
            {
            }
        }

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Date")]
        public DateTime? DateEn { get; set; }

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Date")]
        public DateTime? CostDateEn { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        public string costPersonID { get; set; }
        public Guid PersonID { get; set; }
        public List<NormalJsonClass> PersonList { get; set; }
        public string PersonName { get; set; }

        //[UIHint("HorizentalTextBox")]
        //[DisplayName("costUserID")]
        //public int? costUserID { get; set; }
        public string UserName { get; set; }
        public Guid UserID { get; set; }
        public int? RefvchhdrID { get; set; }
        public Guid? costRefIncomeID { get; set; }
        public CostType Type { get; set; } = Utility.PublicEnum.CostType.Cost;
        public string TypeStr
        {
            get
            {
                if (this.Type == 0) return "سایر";
                return EnumHelper<CostType>.GetDisplayValue(this.Type);
            }
        }

        public long Row { get; set; }
        public string UserType { get; set; }





        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName("از تاریخ ")]
        public DateTime FromDate { get; set; }
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName(" تا تاریخ")]
        public DateTime ToDate { get; set; }

        public bool IsEmployeeAccount { get; set; }
        public Guid? EmployeeAccountId { get; set; }



        public decimal Total_Cost { get; set; }
        public int Count_Cost { get; set; }
        public decimal Total_CostIncoming { get; set; }
        public int Count_CostIncoming { get; set; }
        public string CostType { get; set; }



        [UIHint("HorizentalCurrencyTextBoxDecimal")]
        [Display(Name = "مبلغ تخفیف")]
        public decimal? DiscountPrice { get; set; }
        [UIHint("HorizentalCurrencyTextBoxDecimal")]
        [Display(Name = "هزینه حمل و نقل")]
        public decimal? TransportCost { get; set; }
        [UIHint("HorizentalCurrencyTextBoxDecimal")]
        [Display(Name = "کارمزد")]
        public decimal? CommissionAmount { get; set; }



        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "حساب")]
        public Guid? AccountingCollection_Id { get; set; }
        public List<NormalJsonClass> AccountingCollection_List { get; set; } = new List<NormalJsonClass>();





        [UIHint("HorizentalCheckBox")]
        [Display(Name = "پرداخت با چک")]
        public bool IsCheckPayment { get; set; }



        public Guid FinancialDocument_Id { get; set; }
        public bool FinancialDocumentIsFinal { get; set; }
        public int DocumentNumber { get; set; }

        public string Reference_FactorNo { get; set; }


    }

    public class TherapyFilterVm : PageingParamer
    {
        public TherapyFilterVm()
        {
            this.FromDate = DateTime.Now;
            this.ToDate = DateTime.Now;
        }
        public Guid Id { get; set; }
        //public DateTime FromDate { get; set; }
        //public DateTime ToDate { get; set; }
        public string Text { get; set; }
        public string UserType { get; set; }
    }


    public class FilterModelCost : PageingParamer
    {

        public Guid Id { get; set; }

        [DisplayName("نام و نام خانوادگی")]
        [UIHint("HorizentalDropdwonR")]
        public string PatientName { get; set; }
        public List<NormalJsonClass> PatientNameList { get; set; }

        [DisplayName("نوع تماس")]
        [UIHint("HorizentalDropdwonR")]
        public int? CallType { get; set; }

        [Display(Name = "شماره تلفن")]
        [UIHint("HorizentalTextBox")]
        public string NS_BookNos { get; set; }

        public string text { get; set; }

        public CostSortType SortType { get; set; } = CostSortType.DateEn;


        public CostEnum typeId { get; set; }

        public string Type { get; set; }

    }

}
