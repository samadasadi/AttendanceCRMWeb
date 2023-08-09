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
using Utility;

namespace ViewModel
{
    public class ReportParameter : PageingParamer
    {
        public ReportParameter()
        {
            FromDate = DateTime.Now.AddMonths(-1);
            ToDate = DateTime.Now;

            FromDate_Time = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 00, 00, 00);
            ToDate_Time = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
            //ToDate_Time = DateTime.Now;
        }

        [Display(ResourceType = typeof(Md), Name = "vchhdrSupplier")]
        [UIHint("HorizentalDropdwonR")]
        public string vchhdrSupplier { get; set; }

        [Display(ResourceType = typeof(Md), Name = "InvoiceNumber")]
        [UIHint("HorizentalTextBox")]
        public string InvoiceNumber { get; set; }


        //[UIHint("HorizentalCompleteDateTimeTextBox")]
        //[DisplayName("از تاریخ ")]
        //public DateTime FromDate { get; set; }
        public string FromDateStr
        {
            get
            {
                return DateTimeOperation.M2S(FromDate);
            }
        }


        //[UIHint("HorizentalCompleteDateTimeTextBox")]
        //[DisplayName(" تا تاریخ")]
        //public DateTime ToDate { get; set; }
        public string ToDateStr
        {
            get
            {
                return DateTimeOperation.M2S(ToDate);
            }
        }



        [UIHint("HorizentalCompleteDateTimeTextBoxWithTime")]
        [DisplayName("از تاریخ ")]
        public DateTime FromDate_Time { get; set; }
        public string FromDate_TimeStr
        {
            get
            {
                return DateTimeOperation.M2S(FromDate_Time);
            }
        }
        [UIHint("HorizentalCompleteDateTimeTextBoxWithTime")]
        [DisplayName(" تا تاریخ")]
        public DateTime ToDate_Time { get; set; }
        public string ToDate_TimeStr
        {
            get
            {
                return DateTimeOperation.M2S(ToDate_Time);
            }
        }




        public string FromDate1 { get; set; }
        public string ToDate1 { get; set; }
        [UIHint("HorizentalNumberTextBox")]
        [DisplayName("از قیمت")]
        public long FromPrice { get; set; }
        [UIHint("HorizentalNumberTextBox")]
        [DisplayName("تا قیمت")]
        public long ToPrice { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Month")]
        public int Mounth { get; set; }
        [DisplayName("سال")]
        [UIHint("HorizentalTextBox")]
        [RegularExpression(@"(?:1[6-9]|[2-9]\d)?", ErrorMessage = "لطفا تاریخ را به صورت '1396' وارد کنید")]
        public int Year { get; set; }
        public string Status { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "partCodeDescription")]
        public string InventoryLevel { get; set; }
        public List<NormalJsonClass> InventoryLevelList { get; set; }




        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "partCategoryCode")]
        public string partCategory { get; set; }
        public List<NormalJsonClass> partCategoryList { get; set; }



        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "پزشک")]
        public Guid? Doctor { get; set; }


        [Display(Name = "پزشک")]
        [UIHint("HorizentalDropdwonMultiple")]
        public Guid[] DoctorsIds { get; set; }

        public Guid? CustomerId { get; set; }
        public List<NormalJsonClass> DoctorList { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "UserRecipient")]
        public Guid User { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "UserRecipient")]
        public string UserName { get; set; }
        public List<NormalJsonClass> UserList { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "تنظیم کننده")]
        public Guid User1 { get; set; }


        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "MoneyType")]
        public string PaymentType { get; set; }


        [Display(ResourceType = typeof(Md), Name = "MoneyType")]
        [UIHint("HorizentalDropdwonMultiple")]
        public string[] PaymentTypeIds { get; set; }


        public List<NormalJsonClass> PaymentTypeList { get; set; }
        public List<NormalJsonClass> RadioButtonList { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "CostCode")]
        public string CostCode { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        public string costPersonID { get; set; }

        public string UserType { get; set; }

        [Display(ResourceType = typeof(Md), Name = "Assistant")]
        [UIHint("HorizentalDropdwonR")]
        public string AssistantID { get; set; }
        public List<NormalJsonClass> AssistantLists { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "ListTreatment")]
        public string TherapyCode { get; set; }
        public List<NormalJsonClass> TherapyCodeList { get; set; }
        [Display(ResourceType = typeof(Md), Name = "DoingChildCode")]
        [UIHint("HorizentalDropdwonR")]
        public string DoingChildCode { get; set; }
        public List<NormalJsonClass> DoingChildCodeLists { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "نوع گزارش")]
        public string SharingType { get; set; }
        public List<NormalJsonClass> SharingTypeLists { get; set; }
        public string ImagePath { get; set; }
        public Nullable<System.Guid> FileId { get; set; }
        /// <summary>
        /// نوع بیمه
        /// </summary>
        [UIHint("HorizentalDropdwonR")]
        [DisplayName("نوع بیمه")]
        public string InsuranceType { get; set; }
        public List<NormalJsonClass> InsuranceTypeList { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [DisplayName("بیمه گر")]
        public string InsuranceList { get; set; }
        public List<NormalJsonClass> GetInsuranceList { get; set; }

        //[UIHint("HorizentalDropdwonR")]
        [UIHint("HorizontalSearchTextBlock")]
        [DisplayName("نام و نام خانوادگی")]
        public string DisplayName { get; set; }
        public List<NormalJsonClass> DisplayNameList { get; set; }




        //[UIHint("HorizentalDropdwonR")]
        [UIHint("HorizontalSearchTextBlock")]
        [DisplayName("نام و نام خانوادگی")]
        [Required(ErrorMessage = "لطفا نام و نام خانوادگی راانتخاب کنید")]
        public string DisplayNameCustomerNumber { get; set; }







        [UIHint("HorizontalSearchTextBlock")]
        [DisplayName("نام و نام خانوادگی")]
        [Required(ErrorMessage = "لطفا نام و نام خانوادگی راانتخاب کنید")]
        public string SearchPatientUtility { get; set; }








        /// <summary>
        /// شماره پرونده
        /// </summary>
        [UIHint("HorizentalDropdwonR")]
        [DisplayName("شماره پرونده")]
        public string CustomerNumber { get; set; }
        public List<NormalJsonClass> CustomerNumberList { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [DisplayName("نام فرم")]
        public string FormName { get; set; }

        /// <summary>
        /// نام بیمه
        ///// </summary>
        //[UIHint("HorizentalDropdwonR")]
        //[DisplayName("نام بیمه")]
        public string InsuranceName { get; set; }

        //public List<NormalJsonClass> InsuranceNameList { get; set; }
        /// <summary>
        /// نام پزشک
        /// </summary>
        [UIHint("HorizentalDropdwonR")]
        [DisplayName("نام پزشک")]
        public string DoctorName { get; set; }


        [UIHint("HorizentalDropdwonR")]
        [DisplayName("انواع فرم ها")]
        public string GetReportInsuranceFormsEnumReport { get; set; }


        [UIHint("HorizentalDropdwonR")]
        [DisplayName("نام و نام خانوادگی")]
        public string Personnel { get; set; }

        public List<NormalJsonClass> DoctorNameList { get; set; }
        public List<NormalJsonClass> PersonnelList { get; set; }
        /// <summary>
        /// نوع تعرفه
        /// </summary>
        [UIHint("HorizentalDropdwonR")]
        [DisplayName("نوع تعرفه")]
        public bool? TariffType { get; set; }
        public string TariffTypestr { get; set; }
        public List<NormalJsonClass> TariffTypeList { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "TitleIncoming")]
        public string costInCode { get; set; }

        [Display(Name = "نوع تخفیف")]
        [UIHint("HorizentalDropdwonR")]
        public string DiscountCoding { get; set; }
        public List<NormalJsonClass> DiscountCodingLists { get; set; }
        public bool IncludingInsurance { get; set; }
        //شماره حساب
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "AccountNO")]
        public string AccountNO { get; set; }
        //نوع عملیات چک ها
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "CheckType")]
        public string Type { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Day")]
        public int Day { get; set; }


        //Add by Samad


        [UIHint("HorizentalDropdwonR")]
        [DisplayName("سرفصل اقدام")]
        public string LaboratoryServiceList { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [DisplayName("شرح")]
        public string LaboratoryServiceDetailList { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [DisplayName("لابراتوار")]
        public string LaboratoryList { get; set; }

        public string StatusDate { get; set; }

        //Create Propertys By Mobin
        //این پراپرتی برای این است که در گزارش ارزش موجودی انبار یک چک باکس باشد که بتوانیم موجودی صفر را نمایش دهیم یا خیر
        public bool NoHypocrisyZero { get; set; }

        //این پراپرتی برای این است که در گزارش آخرین موجودی انبار یک چک باکس باشد که بتوانیم موجودی صفر را نمایش دهیم یا خیر
        public bool LastInventory { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت به صورت پرداخت شده و پرداخت نشده و همه موارد       
        /// </summary>        
        public string Pardakht { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای همراه با نام پزشک
        /// </summary>
        public bool HamraDoctor { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای همراه با نام گیرنده
        /// </summary>
        public bool HamraGirande { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت نوع تراکنش را مشخص می کند که از نوع افزایشی یا کاهشی یا پرداختی یا کلی است
        /// </summary>
        public string TypeTransaction { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای بیماران عادی می باشد
        /// </summary>
        public bool NormalPatients { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای سرپرست خانوار می باشد
        /// </summary>
        public bool Households { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای نوع گزارش می باشد
        /// </summary>
        public string TypeReport { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای ترتیب گزارش می باشد
        /// </summary>
        public string SortReport { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای براساس کیف پول می باشد
        /// </summary>
        public bool wallet { get; set; }

        //Create By Mobin
        /// <summary>
        /// این خصوصیت برای براساس اعتبار می باشد
        /// </summary>
        public bool Credit { get; set; }

        public string StatusRadioButton { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "ListTreatment")]
        public string TherapyCodeForPresentSituation { get; set; }

        public bool IsReportExecl { get; set; }

        public bool TrackingFactor { get; set; }


        public int ConcatOparator { get; set; }


        public bool RepeatRecordForm { get; set; }


        /// <summary>
        /// این پراپرتی برای تعیین لیست نسخه های تامین اجتماعی استد که بارگزاری شده اند یا خیر
        /// 1 - ارسال نشده
        /// 2 - ارسال شده
        /// 3 - همه موارد
        /// </summary>
        public string SentToServer { get; set; }



        public string InsuranceStatusFinal { get; set; }
        public string InsuranceStatusSend { get; set; }
        public string ReportDateTypeFilter { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "نام کالا")]
        public string PartName { get; set; }
        public string FrDateType { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "وضعیت")]
        public bool partActive { get; set; }

        public bool IsNotCange3DateFilterReports { get; set; }

        public bool IsVchitmPartInventoryLevel_Group { get; set; }






        [Display(Name = "نام پرینتر")]
        [UIHint("HorizentalDropdwonR")]
        public string appRollPrinterName { get; set; }
        public List<NormalJsonClass> appRollPrinterList { get; set; }












        [DisplayName("قفسه")]
        [UIHint("HorizentalDropdwonR")]
        public Guid LaboratoryShelf { get; set; }
        public List<NormalJsonClass> LaboratoryShelfLists { get; set; }

        [DisplayName("شماره قفسه")]
        [UIHint("HorizentalDropdwonR")]
        public int LaboratoryShelvesNum { get; set; }
        public List<NormalJsonClass> LaboratoryShelvesNumLists { get; set; }

        [DisplayName("فضای قفسه")]
        [UIHint("HorizentalDropdwonR")]
        public int LaboratoryShelfSpaceNum { get; set; }
        public List<NormalJsonClass> LaboratoryShelfSpaceNumLists { get; set; }


        public bool BoolParam1 { get; set; }
        public bool BoolParam2 { get; set; }
        public bool BoolParam3 { get; set; }
        public bool BoolParam4 { get; set; }

    }
}
