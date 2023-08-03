using Newtonsoft.Json;
using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;
using Utility.CommonAttribute;
using Utility.PublicEnum;
using Utility;
using ViewModel.Message;

namespace ViewModel.Common
{
    public class GeneralSettingVm
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public Guid MedicalCenterId { get; set; }
        public DateTime ModifiedDate { get; set; }


        [UIHint("HorizentalTextBox")]
        [Display(Name = "آدرس برنامه")]
        public string HostUrl { get; set; }


        public int appID { get; set; }
        //اطلاعات مرکزی
        [Display(ResourceType = typeof(Md), Name = "NameClinic")]
        [UIHint("HorizentalTextBox")]
        public string NameClinic { get; set; }
        // [DisplayName("تلفن")]
        [Display(ResourceType = typeof(Md), Name = "Phone")]
        [UIHint("HorizentalTextBox")]
        public string Phone { get; set; }

        [Display(ResourceType = typeof(Md), Name = "MobileNumber")]
        [UIHint("HorizentalTextBox")]
        public string Mobile { get; set; }
        //[DisplayName("فاکس")]
        [Display(ResourceType = typeof(Md), Name = "Fax")]
        [UIHint("HorizentalTextBox")]
        public string Fax { get; set; }

        //[DisplayName("تیتر")]
        [Display(ResourceType = typeof(Md), Name = "Title")]
        [UIHint("HorizentalTextBox")]
        public string Title { get; set; }

        //[DisplayName("وب سایت")]
        [Display(ResourceType = typeof(Md), Name = "WebSite")]
        [UIHint("HorizentalTextBox")]
        public string WebSite { get; set; }





        [DisplayName("شناسه ملی")]
        [UIHint("HorizentalTextBox")]
        public string NationalID { get; set; }
        [DisplayName("کد اقتصادی")]
        [UIHint("HorizentalTextBox")]
        public string EconomicCode { get; set; }
        [DisplayName("شماره ثبت")]
        [UIHint("HorizentalTextBox")]
        public string RegistrationNumber { get; set; }
        [DisplayName("کد پستی")]
        [UIHint("HorizentalTextBox")]
        public string PostalCode { get; set; }





        //[DisplayName("آدرس")]
        [Display(ResourceType = typeof(Md), Name = "Address")]
        [UIHint("HorizentalTextArea")]
        public string Address { get; set; }

        //[DisplayName("ایمیل")]
        [Display(ResourceType = typeof(Md), Name = "Email")]
        [RegularExpression(@".+\@.+\..+", ErrorMessage = "فرمت ایمیل را صحیح وارد کنید")]
        [UIHint("HorizentalTextBox")]
        public string Email { get; set; }

        //آرم مرکزی
        public Nullable<System.Guid> FileId { get; set; }

        [DisplayName("آرم مرکز")]
        public HttpPostedFileBase File { get; set; }
        public string Img { get; set; }

        //یادآوری زمانی
        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Appointment")]
        public Nullable<int> Appointment { get; set; }
        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "TimeReminder")]
        public Nullable<int> TimeReminder { get; set; }
        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Backup")]
        public Nullable<int> Backup { get; set; }
        public DateTime BackupDate { get; set; }

        //نمایشگر تماس تلفنی
        //[DisplayName("طول ارقام شماره تلفن")]
        [Display(ResourceType = typeof(Md), Name = "lengthPhone")]

        [UIHint("HorizentalNumberTextBox")]
        public Nullable<int> lengthPhone { get; set; }

        //[DisplayName("پیش کد شهر")]
        [Display(ResourceType = typeof(Md), Name = "CityCode")]

        [UIHint("HorizentalNumberTextBox")]
        public Nullable<int> CityCode { get; set; }

        //[DisplayName("پیش کد کشور")]
        [Display(ResourceType = typeof(Md), Name = "CountryCode")]

        [UIHint("HorizentalNumberTextBox")]
        public Nullable<int> CountryCode { get; set; }

        [DisplayName("کد محرمانه API")]
        [UIHint("HorizentalTextBox")]
        public string Asanak_ApiKey { get; set; }

        //سایر
        [Display(ResourceType = typeof(Md), Name = "NumberStatus")]
        public bool NumberStatus { get; set; }

        //[DisplayName("شماره شروع")]
        [Display(ResourceType = typeof(Md), Name = "StartNumber")]

        [UIHint("HorizentalStartNumber")]
        public Nullable<int> StartNumber { get; set; }
        [Display(ResourceType = typeof(Md), Name = "ChangeCostBase")]
        public bool ChangeCostBase { get; set; }

        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "PositionTeethId")]

        //[DisplayName("استاندارد موقعیت دندان ها")]
        //Iranian=1
        //America Ul-LL=2
        //America T1~32=3
        public Nullable<int> PositionTeethId { get; set; }


        //متن تعهد بیمار
        [Display(ResourceType = typeof(Md), Name = "patientsCommitment")]
        [UIHint("HorizentalTextArea")]
        public string Description { get; set; }

        [Display(Name = "آدرس آی پی")]
        [UIHint("HorizentalTextBox")]
        public string appHostIp { get; set; }
        [Display(Name = "کد قفل")]
        [UIHint("HorizentalTextBox")]
        [MVCReadOnly(true)]
        public string Log { get; set; }
        [Display(ResourceType = typeof(Md), Name = "appAwardPercent")]

        [UIHint("HorizentalNumberTextBox")]
        public Nullable<float> appAwardPercent { get; set; }
        [Display(ResourceType = typeof(Md), Name = "appAwardDrPercent")]

        [UIHint("HorizentalNumberTextBox")]
        public Nullable<float> appAwardDrPercent { get; set; }
        [Display(ResourceType = typeof(Md), Name = "appToothQtyLock")]

        [UIHint("HorizentalCheckBox")]
        public bool appToothQtyLock { get; set; }

        [Display(ResourceType = typeof(Md), Name = "publication")]
        [UIHint("HorizentalNumberTextBox")]
        public Nullable<int> appver { get; set; }

        //تنظیمات پیامک
        //وقت ملاقات
        [Display(ResourceType = typeof(Md), Name = "VisitTime")]
        [UIHint("HorizentalTextBox")]
        public int? appVisitSmsTime { get; set; }


        [UIHint("HorizentalTextBox")]
        public string appLastBackupDate { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserName")]
        [UIHint("HorizentalTextBox")]
        //حالت غیر فعال موارد اماده ارسال
        public int? appAutoSmsSend { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserName")]
        [UIHint("HorizentalTextBox")]
        //ارسال در چه ساعتی
        public DateTime? appAutoSmsTime { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserName")]
        [UIHint("HorizentalTextBox")]
        //ارسال در هر چنددقیقه یکبار
        public int? appSmsAutoSendInterval { get; set; }

        [Display(ResourceType = typeof(Md), Name = "UserName")]
        [UIHint("HorizentalTextBox")]
        //به هنگام سازی صندوق ورودی
        public int? appSmsRefreshTime { get; set; }


        [UIHint("HorizentalTimeSpan")]
        public int? appBackupAlarmDay { get; set; }

        //نام کاربری
        [Display(ResourceType = typeof(Md), Name = "UserName")]
        [UIHint("HorizentalTextBox")]
        public string appSmsWebUN { get; set; }

        //شماره فرستنده
        [Display(ResourceType = typeof(Md), Name = "Password")]
        [UIHint("HorizentalTextBox")]
        public string appSmsWebPW { get; set; }
        //پسورد
        [Display(ResourceType = typeof(Md), Name = "SenderNumber")]
        [UIHint("HorizentalTextBox")]
        public string appSmsWebPN { get; set; }
        //توصیه های درمانی
        [Display(ResourceType = typeof(Md), Name = "TreatmentRecommendations")]
        [UIHint("HorizentalTextBox")]
        public int? appCareAlarmSMS { get; set; }
        //چک های بیمار
        [Display(ResourceType = typeof(Md), Name = "PatientChecks")]
        [UIHint("HorizentalTextBox")]
        public int? appCheckAlarmPatSMS { get; set; }
        //چکهای مطب
        [Display(ResourceType = typeof(Md), Name = "OfficeChecks")]
        [UIHint("HorizentalTextBox")]
        public int? appCheckAlarmSMS { get; set; }
        public int? appExpireAlarmDay { get; set; }

        [Display(ResourceType = typeof(Md), Name = "DateofBirth")]
        [UIHint("HorizentalTextBox")]
        //تاریخ تولد
        public int? appBirthDateSmsTime { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "SMSSickPay")]
        //پیامک پرداختی بیمار
        public bool appSendPaySMS { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "SMSWelcome")]
        //پیامک خوش آمد گویی
        public bool appSmsWelcome { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "وقت ملاقات های بیمار")]
        public bool appSmsAppointment { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "ارسال صورت حساب")]
        public bool appSmsBilling { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "توصیه های درمانی")]
        public bool appSmsRecommendations { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "یاد اوری چک بیمار")]
        public bool appSmsCeckReminded { get; set; }
        [UIHint("HorizentalCheckBox")]
        [Display(Name = "یاد اوری چک مطب")]
        public bool appSmsCeckClinic { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "تبریک تولد")]
        public bool appSmsBirthday { get; set; }


        [UIHint("HorizentalCheckBox")]
        [Display(Name = "بیماران بدهکار")]
        public bool appSmsDebtor { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "کارهای نیمه کاره بیمار")]
        public bool appSmsSemiKars { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "یاد آوری فلوآپ")]
        public bool appSmsFlvap { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = " پاسخ گویی به افراد مشخص شده")]
        public bool appSmsResponding { get; set; }


        [UIHint("HorizentalCheckBox")]
        [Display(Name = " تبلیغات")]
        public bool appSmsAdvertising { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "VisitInterval")]
        public int? VisitInterval { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "OpeningHour")]
        public int? OpeningHour { get; set; }

        [UIHint("HorizentalNumberTextBox")]
        [Display(ResourceType = typeof(Md), Name = "ClosingHour")]
        public int? ClosingHour { get; set; }




        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinter_ShowTotalPrice { get; set; }
        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinter_ShowRemainPrice { get; set; }


        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinterActive { get; set; }

        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinterPage1 { get; set; }
        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinterPage2 { get; set; }
        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinterPage3 { get; set; }
        [UIHint("HorizentalNumberTextBox")]
        [Display(Name = "شماره پایانه پذیرنده اینترنتی")]
        public string PazirandeNumber { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "نام کاربری")]
        public string PayUserName { get; set; }
        [UIHint("HorizentalPassword")]
        [Display(Name = "رمز عبور")]
        public string PayPassword { get; set; }
        [UIHint("HorizentalTextArea")]
        [Display(Name = "توضیحات")]
        public string Comment { get; set; }

        public List<string> SelectedFieldPatient { get; set; }
        [Display(Name = "Port")]
        [UIHint("HorizentalNumberTextBox")]
        public string appHostPort { get; set; }



        //[Display(Name = "نام مرکز")]
        //public Guid MedicalCenterIdForPort { get; set; }
        //public List<NormalJsonClass> lstMedicalCenterListForPort { get; set; }


        //Add By Samad
        //------Prescription Register---------------------
        public string P_CenterTypeMosallah { get; set; }
        public bool P_Mosallah_ApplyKSoldier { get; set; }
        public bool P_Mosallah_ApplyKJanbaz { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب ارزشیابی")]
        public string P_Mosallah_ValuationK { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب ارزشیابی نسخ جانبازان")]
        public string P_Mosallah_ValuationKJanbaz { get; set; }
        public string P_Mosallah_CalcVisitType { get; set; }
        public string P_Mosallah_CalcGeraphyType { get; set; }
        public string P_CenterTypeOtherInsurance { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب K دولتی")]
        public decimal? P_GovernmentK { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب K خصوصی")]
        public decimal? P_PrivateK { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب K غیر دولتی")]
        public decimal? P_NongovernmentalK { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب K خیریه")]
        public decimal? P_CharityK { get; set; }
        public string P_FranshizCharityOtherInsurance { get; set; }
        public string P_FranshizNonGovernmentOtherInsurance { get; set; }
        public string P_FranshizPublicOtherInsurance { get; set; }
        public string P_FranshizPrivateOtherInsurance { get; set; }
        public string P_OtherInsurance_CalcGeraphyVisitType { get; set; }


        [Display(Name = "نوع بیمه")]
        [UIHint("HorizentalDropdwonR")]
        public int? NS_InsurCods { get; set; }
        public List<NormalJsonClass> insuranceList { get; set; }



        /// <summary>
        /// رنگ روز فعلی در وقت ملاقات
        /// </summary>
        public string ColorCurrentDayVisitTime { get; set; }

        /// <summary>
        /// رنگ روز حضور پزشک در وقت ملاقات
        /// </summary>
        public string ColorPresenceDayVisitTime { get; set; }

        /// <summary>
        /// رنگ روز عدم حضور پزشک در وقت ملاقات
        /// </summary>
        public string ColorNotPresenceDayVisitTime { get; set; }


        /// <summary>
        /// رنگ روزهای تعطیل مرکز
        /// </summary>
        public string HolidayColor { get; set; }


        //شماره دهی بیماران
        public string appDocNoStart { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "واحد پول")]
        /// <summary>
        /// این فیلد برای مبالغ می باشد
        /// </summary>
        public string appmoneyunit { get; set; }






        #region Responsive-Mobin
        //[UIHint("HorizentalDropdwonR")]
        [Display(Name = "نام پرینتر")]
        [UIHint("HorizentalDropdwonR")]
        #endregion
        public string appRollPrinterName { get; set; }
        public List<NormalJsonClass> appRollPrinterList { get; set; }


        [UIHint("HorizentalCheckBox")]
        public bool appRollPrinterView { get; set; }



        [Display(Name = "عدم نمایش تعرفه های صفر مرکز در شرح درمان")]
        [UIHint("HorizentalCheckBox")]
        public bool appshowzeroprice { get; set; }
        [Display(Name = "عدم نمایش تعرفه های صفر بیمه ها در شرح درمان")]
        [UIHint("HorizentalCheckBox")]
        public bool appshowzeropriceforins { get; set; }
        [Display(Name = "خالی بودن نام دستیار در ثبت درمان")]
        [UIHint("HorizentalCheckBox")]
        public bool appshowassistname { get; set; }
        [Display(Name = "خالی بودن نام پزشک در ثبت درمان")]
        [UIHint("HorizentalCheckBox")]
        public bool appshowdocname { get; set; }





        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب ریالی کا حرفه ای مرکز")]
        public string P_ProfessionalK_Medical { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "ضریب ریالی کا فنی مرکز")]
        public string P_TechnicalK_Medical { get; set; }


        public string P_CenterType_Medical { get; set; }
        public string P_GovernmentProfessionalK_Medical { get; set; }
        public string P_GovernmentTechnicalK_Medical { get; set; }
        public string P_NonGovernmentProfessionalK_Medical { get; set; }
        public string P_NonGovernmentTechnicalK_Medical { get; set; }
        public string P_PrivateProfessionalK_Medical { get; set; }
        public string P_PrivateTechnicalK_Medical { get; set; }
        public string P_CharityProfessionalK_Medical { get; set; }
        public string P_CharityTechnicalK_Medical { get; set; }

        [UIHint("HorizentalCheckBox")]
        public bool IsShowAlarmTypeSickness { get; set; }



        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد درمانگاه")]
        public string P_OrganizationalCode { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد نظام پزشکی")]
        public string P_MedicalSystemCode { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "شماره حساب")]
        public string P_HesabNo { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "نام بانک")]
        public string P_BankName { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد کامپیوتری")]
        public string P_ComputerCode { get; set; }



        [Display(Name = "درجه مرکز")]
        [UIHint("HorizentalDropdwonR")]
        public string P_CenterDegree { get; set; }
        public List<NormalJsonClass> P_CenterDegreeList { get; set; }




        [Display(ResourceType = typeof(Md), Name = "AvanakUserName")]
        [UIHint("HorizentalTextBox")]
        public string Avanak_Username { get; set; }

        [Display(ResourceType = typeof(Md), Name = "AvanakPassword")]
        [UIHint("HorizentalTextBox")]
        public string Avanak_Password { get; set; }








        [Display(ResourceType = typeof(Md), Name = "Avanak_ServerId")]
        [UIHint("HorizentalDropdwonR")]
        public string Avanak_ServerId { get; set; }
        public List<NormalJsonClass> Avanak_ServerList { get; set; }

        /// <summary>
        /// نمایش ماشین حساب زایمان
        /// </summary>
        public bool IsDisplayDeliveryCalculator { get; set; }
        [Display(Name = "ضریب ارزشیابی رند شود")]
        [UIHint("HorizentalCheckBox")]
        public bool P_UseRoundedPercent { get; set; }

        /// <summary>
        /// کد پرداخت
        /// </summary>
        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد پرداخت")]
        public string PaymentId { get; set; }

        /// <summary>
        /// شماره حساب
        /// </summary>
        [UIHint("HorizentalTextBox")]
        [Display(Name = "شماره حساب")]
        public string InvoiceNo { get; set; }

        /// <summary>
        /// نام درگاه پرداخت
        /// </summary>
        [Display(Name = "نام درگاه پرداخت")]
        [UIHint("HorizentalDropdwonR")]
        public string PaymentName { get; set; }

        [Display(Name = "سرور ارسال پیامک")]
        public string SenderTypeSMS { get; set; }
        [Display(Name = "نسخه با تاریخ روز بارگزاری شود")]
        [UIHint("HorizentalCheckBox")]
        public bool SentTnPrescWithCurrentDay { get; set; }
        [Display(Name = "ارسال پیامک بعد از ثبت نسخه بیمار")]
        [UIHint("HorizentalCheckBox")]
        public bool SentPrescriptionConfirmMessage { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد الگوی ارسال پیام")]
        public string PrescriptionConfirmMessagePatternCode { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(Name = "کد مرکز")]
        public string TNCreatorType { get; set; }

        public bool IsRequireNationalCodeInSavePatients { get; set; }


        public string Salamat_AuthToken { get; set; }
        public DateTime? Salamat_AuthTokenDate { get; set; }

        public bool IsRequireSponsorNameInSavePatients { get; set; }

        public bool IsNameDoctorInPrinterHararatiAnd3Bargi { get; set; }








        [Display(Name = "نام کاربری")]
        [UIHint("HorizentalTextBox")]
        public string Faraz_Username { get; set; }
        [Display(Name = "رمز عبور")]
        [UIHint("HorizentalTextBox")]
        public string Faraz_Password { get; set; }
        [Display(Name = "شماره مبدا")]
        //[UIHint("HorizentalTextBox")]
        [UIHint("HorizentalDropdwonR")]
        public string Faraz_SourceNumber { get; set; }
        public List<Faraz_SourceNumberList> Faraz_SourceNumberList
        {
            get
            {
                var _result = new List<Faraz_SourceNumberList>();
                _result.Add(new Faraz_SourceNumberList { Id = Guid.NewGuid(), Value = "3000505" });
                return string.IsNullOrEmpty(Faraz_SourceNumberListAttr) ? _result : JsonConvert.DeserializeObject<List<Faraz_SourceNumberList>>(Faraz_SourceNumberListAttr);
            }
        }
        public string Faraz_SourceNumberListAttr { get; set; }



        [UIHint("HorizentalCheckBox")]
        [Display(Name = "فعال سازی پنل 1")]
        public bool Asanak_Enable { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "فعال سازی پنل 2")]
        public bool Faraz_Enable { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(Name = "عدم نمایش درمان ها در فیش پرینت حرارتی")]
        public bool ShowTreatmentInThermalPrinter { get; set; }

        public string KeyCodeHash { get; set; }







        [Display(Name = "آدرس سرویس دهنده")]
        [UIHint("HorizentalTextBox")]
        public string WhatsApp_ServiceAddress { get; set; }
        [Display(Name = "شماره مبدا")]
        [UIHint("HorizentalTextBox")]
        public string WhatsApp_SenderNumber { get; set; }
        [Display(Name = "کلید اختصاصی")]
        [UIHint("HorizentalTextBox")]
        public string WhatsApp_Key { get; set; }



        [UIHint("HorizentalCheckBox")]
        [Display(Name = "فعال")]
        public bool AutoSendMessageEnabled { get; set; }
        [Display(Name = "بازه ارسال (بر حسب دقیقه)")]
        [UIHint("HorizentalNumberTextBox")]
        public int AutoSendMessageTime { get; set; }

        public PatientPaymentSentType appSendPaySMSSortType { get; set; }


    }
}
