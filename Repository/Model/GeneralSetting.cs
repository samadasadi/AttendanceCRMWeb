using Repository.Model.AdvancedDentalChart;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.PublicEnum;

namespace Repository.Model
{
    [Table("tbl_Application")]
    public partial class GeneralSetting : BaseClass
    {
        public int appID { get; set; }

        //اطلاعات مرکزی
        [Column("appFaTitle")]
        public string NameClinic { get; set; }
        [Column("appPhoneNo")]
        public string Phone { get; set; }
        public string Mobile { get; set; }
        [Column("appFaxNo")]
        public string Fax { get; set; }
        [Column("appEnTitle")]
        public string Title { get; set; }

        [Column("appWebsite")]
        public string WebSite { get; set; }

        [Column("appFaAddress")]

        public string Address { get; set; }

        [Column("appEmail")]
        public string Email { get; set; }

        //آرم مرکزی
        public Nullable<System.Guid> FileId { get; set; }
        public string appLogoFileName { get; set; }
        public string appImageRootPath { get; set; }

        //یادآوری زمانی
        public Nullable<int> Appointment { get; set; }
        public Nullable<int> TimeReminder { get; set; }


        public string appBackupPath { get; set; }
        public Nullable<int> Backup { get; set; }
        public DateTime BackupDate { get; set; }

        //نمایشگر تماس تلفنی
        public Nullable<int> lengthPhone { get; set; }
        public Nullable<int> CityCode { get; set; }
        public Nullable<int> CountryCode { get; set; }

        //سایر
        public bool? NumberStatus { get; set; }
        public Nullable<int> StartNumber { get; set; }
        [Column("appLockUnitPice")]
        public bool? ChangeCostBase { get; set; }

        [Column("appToothCoding")]
        //استاندارد موقعیت دندان ها
        public Nullable<int> PositionTeethId { get; set; }
        public Nullable<int> appAlarmTime { get; set; }
        public string DiactiveList { get; set; }


        //متن تعهد بیمار
        public string Description { get; set; }
        public string Asanak_ApiKey { get; set; }


        //public bool? appCardReader { get; set; }
        public bool? appDocNoIsIdentity { get; set; }
        //public bool? appAwardOption { get; set; }
        //public Nullable<int> appShowCallerID { get; set; }
        //public Nullable<int> appCallerIDPortNo { get; set; }
        //public Nullable<int> appCallerIDLen { get; set; }
        public string appCallerIDCityCode { get; set; }
        //public Nullable<int> appCallerIDCountrycode { get; set; }
        //public bool? appAutoConnectSmsDevice { get; set; }
        //public Nullable<int> appSmsDevicePortNo { get; set; }
        //public bool? appAutoDetectSmsDevice { get; set; }
        /* *vp */
        public string LastUpdateSMSInbox { get; set; }
        //وقت ملاقات
        public Nullable<int> appVisitSmsTime { get; set; }
        public string appLastBackupDate { get; set; }
        //حالت غیر فعال موارد اماده ارسال
        public int? appAutoSmsSend { get; set; }
        //ارسال در هر چنددقیقه یکبار
        public int? appSmsAutoSendInterval { get; set; }

        //ارسال در چه ساعتی
        public DateTime? appAutoSmsTime { get; set; }
        //نگارش
        public Nullable<int> appver { get; set; }
        public int? appBackupAlarmDay { get; set; }

        public string appCommitText { get; set; }
        //شماره دهی بیماران
        public string appDocNoStart { get; set; }

        //به هنگام سازی صندوق ورودی
        public int? appSmsRefreshTime { get; set; }
        //نام کاربری
        public string appSmsWebUN { get; set; }
        //شماره فرستنده
        public string appSmsWebPW { get; set; }
        //پسورد
        public string appSmsWebPN { get; set; }
        //public bool? appSmsWebActive { get; set; }
        //public bool? appSmsDeviceActive { get; set; }
        //public bool? appContinuousBill { get; set; }
        public string appDefaultScanner { get; set; }
        public bool appRollPrinterActive { get; set; }
        public string appRollPrinterName { get; set; }
        public bool appRollPrinterView { get; set; }
        public bool appRollPrinterPage1 { get; set; }
        public bool appRollPrinterPage2 { get; set; }
        public bool appRollPrinterPage3 { get; set; }

        public bool appRollPrinter_ShowTotalPrice { get; set; }
        public bool appRollPrinter_ShowRemainPrice { get; set; }

        //توصیه های درمانی
        public int? appCareAlarmSMS { get; set; }
        //چک های بیمار
        public int? appCheckAlarmPatSMS { get; set; }
        //چک های مطب
        public int? appCheckAlarmSMS { get; set; }
        public int? appExpireAlarmDay { get; set; }
        //تاریخ تولد
        public int? appBirthDateSmsTime { get; set; }
        //پیامک پرداختی بیمار
        public bool appSendPaySMS { get; set; }
        //پیامک خوش آمد گویی
        public bool appSmsWelcome { get; set; }

        public bool appSmsAppointment { get; set; }

        //ارسال صورت حساب
        public bool appSmsBilling { get; set; }

        //توصیه های درمانی
        public bool appSmsRecommendations { get; set; }

        //یاد اوری چک بیمار
        public bool appSmsCeckReminded { get; set; }

        //تبریک تولد
        public bool appSmsBirthday { get; set; }


        //بیماران بدهکار
        public bool appSmsDebtor { get; set; }

        //کارهای نیمه کاره بیمار"
        public bool appSmsSemiKars { get; set; }

        //یاد آوری فلوآپ
        public bool appSmsFlvap { get; set; }

        // " پاسخ گویی به افراد مشخص شده
        public bool appSmsResponding { get; set; }


        //تبلیغات
        public bool appSmsAdvertising { get; set; }
        //یادآوری چک مطب
        public bool appSmsCeckClinic { get; set; }

        //appHostIp
        public string appHostIp { get; set; }
        public string appHostPort { get; set; }
        //public bool? appSaveImageOnDb { get; set; }
        public string appImageUrl { get; set; }
        //public bool? appIgnoreConvertImage { get; set; }
        //ویرایش تعداد دندان در ثبت درمان ممکن نباشد
        public bool? appToothQtyLock { get; set; }

        public Nullable<float> appAwardDrPercent { get; set; }
        //public real appCardReader { get; set; }

        public Nullable<float> appAwardPercent { get; set; }
        //public string appFaTitle { get; set; }
        //public string appEnTitle { get; set; }
        //public string appPhoneNo { get; set; }
        //public string appFaxNo { get; set; }
        //public string appFaAddress { get; set; }
        public string appEnAddress { get; set; }
        //public string appEmail { get; set; }
        //public string appWebsite { get; set; }
        //public int? appToothCoding { get; set; }
        public float? appColorCode { get; set; }
        //public int? appSqlVer { get; set; }
        public string appPosIp { get; set; }
        public byte[] appLogo { get; set; }
        public string appClinicAccountNo { get; set; }
        public int? VisitInterval { get; set; }

        public int? OpeningHour { get; set; }
        public int? ClosingHour { get; set; }
        public string Log { get; set; }
        public bool PatientImages { get; set; }
        public bool Theraphies { get; set; }

        /// <summary>
        /// برای احراز هویت وقت ملاقات در باشگاه مشتریان از این خصوصیت استفاده می شود
        /// </summary>
        public bool CheckVisitTimeShowAndRequest { get; set; }

        public bool PatientPayments { get; set; }
        public string PazirandeNumber { get; set; }
        public string PayUserName { get; set; }
        public string PayPassword { get; set; }
        public string Comment { get; set; }

        //Add By Samad
        //------Prescription Register---------------------
        public string P_CenterTypeMosallah { get; set; }
        public Nullable<double> P_Mosallah_ValuationK { get; set; }
        public Nullable<double> P_Mosallah_ValuationKJanbaz { get; set; }
        public bool? P_Mosallah_ApplyKSoldier { get; set; }
        public bool? P_Mosallah_ApplyKJanbaz { get; set; }
        public string P_Mosallah_CalcVisitType { get; set; }
        public string P_Mosallah_CalcGeraphyType { get; set; }
        public string P_CenterTypeOtherInsurance { get; set; }
        public string P_FranshizPublicOtherInsurance { get; set; }
        public string P_FranshizPrivateOtherInsurance { get; set; }
        public string P_FranshizCharityOtherInsurance { get; set; }
        public string P_FranshizNonGovernmentOtherInsurance { get; set; }
        public decimal? P_GovernmentK { get; set; }
        public decimal? P_PrivateK { get; set; }
        public decimal? P_NongovernmentalK { get; set; }
        public decimal? P_CharityK { get; set; }
        public string P_OtherInsurance_CalcGeraphyVisitType { get; set; }

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

        /// <summary>
        /// این فیلد برای مبالغ می باشد
        /// </summary>
        public string appmoneyunit { get; set; }




        public bool appshowzeroprice { get; set; }
        public bool appshowzeropriceforins { get; set; }
        public bool appshowassistname { get; set; }
        public bool appshowdocname { get; set; }




        public string P_CenterType_Medical { get; set; }
        public Nullable<double> P_GovernmentProfessionalK_Medical { get; set; }
        public Nullable<double> P_GovernmentTechnicalK_Medical { get; set; }
        public Nullable<double> P_NonGovernmentProfessionalK_Medical { get; set; }
        public Nullable<double> P_NonGovernmentTechnicalK_Medical { get; set; }
        public Nullable<double> P_PrivateProfessionalK_Medical { get; set; }
        public Nullable<double> P_PrivateTechnicalK_Medical { get; set; }
        public Nullable<double> P_CharityProfessionalK_Medical { get; set; }
        public Nullable<double> P_CharityTechnicalK_Medical { get; set; }

        public bool IsShowAlarmTypeSickness { get; set; }



        public string P_OrganizationalCode { get; set; }
        public string P_MedicalSystemCode { get; set; }
        public string P_HesabNo { get; set; }
        public string P_BankName { get; set; }
        public string P_ComputerCode { get; set; }
        public string P_CenterDegree { get; set; }

        public string Avanak_Username { get; set; }
        public string Avanak_Password { get; set; }
        public string Avanak_ServerId { get; set; }

        /// <summary>
        /// نمایش ماشین حساب زایمان
        /// </summary>
        public bool IsDisplayDeliveryCalculator { get; set; }
        public bool P_UseRoundedPercent { get; set; }

        /// <summary>
        /// کد پرداخت
        /// </summary>
        public string PaymentId { get; set; }

        /// <summary>
        /// شماره حساب
        /// </summary>
        public string InvoiceNo { get; set; }

        /// <summary>
        /// نام درگاه پرداخت
        /// </summary>
        public string PaymentName { get; set; }
        public string SenderTypeSMS { get; set; }
        public bool SentTnPrescWithCurrentDay { get; set; }
        public bool SentPrescriptionConfirmMessage { get; set; }
        public string PrescriptionConfirmMessagePatternCode { get; set; }
        public string TNCreatorType { get; set; }

        public bool IsRequireNationalCodeInSavePatients { get; set; }


        public string Salamat_AuthToken { get; set; }
        public DateTime? Salamat_AuthTokenDate { get; set; }

        public bool IsRequireSponsorNameInSavePatients { get; set; }

        public bool IsNameDoctorInPrinterHararatiAnd3Bargi { get; set; }



        public string Faraz_Username { get; set; }
        public string Faraz_Password { get; set; }
        public string Faraz_SourceNumber { get; set; }
        public string KeyCodeHash { get; set; }



        public bool Asanak_Enable { get; set; }

        public bool Faraz_Enable { get; set; }
        public bool ShowTreatmentInThermalPrinter { get; set; }        
        
        public int ApplicationVersion { get; set; }



        public string NationalID { get; set; }
        public string EconomicCode { get; set; }
        public string RegistrationNumber { get; set; }
        public string PostalCode { get; set; }


        public ChartDentType ChartDentType { get; set; }
        public PatientPaymentSentType appSendPaySMSSortType { get; set; }


    }
}
