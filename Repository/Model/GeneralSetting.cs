
using System;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string ActivationLisc { get; set; }
        public Nullable<int> StartNumber { get; set; }
        [Column("appLockUnitPice")]
        public bool? ChangeCostBase { get; set; }

        public Nullable<int> appAlarmTime { get; set; }


        public string Asanak_ApiKey { get; set; }


        public string LastUpdateSMSInbox { get; set; }

        public string appLastBackupDate { get; set; }
        //حالت غیر فعال موارد اماده ارسال
        public int? appAutoSmsSend { get; set; }
        //ارسال در هر چنددقیقه یکبار
        public int? appSmsAutoSendInterval { get; set; }

        //ارسال در چه ساعتی
        public DateTime? appAutoSmsTime { get; set; }

        public int? appBackupAlarmDay { get; set; }

        public string appCommitText { get; set; }

        //به هنگام سازی صندوق ورودی
        public int? appSmsRefreshTime { get; set; }
        //نام کاربری
        public string appSmsWebUN { get; set; }
        //شماره فرستنده
        public string appSmsWebPW { get; set; }
        //پسورد
        public string appSmsWebPN { get; set; }



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
        public string appImageUrl { get; set; }

        public Nullable<float> appAwardDrPercent { get; set; }
        public Nullable<float> appAwardPercent { get; set; }
        public string appEnAddress { get; set; }
        public float? appColorCode { get; set; }

        public byte[] appLogo { get; set; }
        public string appClinicAccountNo { get; set; }
        public int? VisitInterval { get; set; }

        public string Log { get; set; }
        public bool PatientImages { get; set; }
        public bool Theraphies { get; set; }
        /// <summary>
        /// برای احراز هویت وقت ملاقات در باشگاه مشتریان از این خصوصیت استفاده می شود
        /// </summary>
        public bool CheckVisitTimeShowAndRequest { get; set; }
        public bool PatientPayments { get; set; }

        public string Comment { get; set; }


        /// <summary>
        /// این فیلد برای مبالغ می باشد
        /// </summary>
        public string appmoneyunit { get; set; }
        public bool appshowzeroprice { get; set; }
        public bool appshowzeropriceforins { get; set; }
        public bool appshowassistname { get; set; }
        public bool appshowdocname { get; set; }
        public bool IsShowAlarmTypeSickness { get; set; }
        /// <summary>
        /// نام درگاه پرداخت
        /// </summary>
        public string PaymentName { get; set; }
        public string SenderTypeSMS { get; set; }
        public bool SentTnPrescWithCurrentDay { get; set; }

        public string TNCreatorType { get; set; }
        public string Faraz_Username { get; set; }
        public string Faraz_Password { get; set; }
        public string Faraz_SourceNumber { get; set; }
        public string KeyCodeHash { get; set; }
        public bool Asanak_Enable { get; set; }
        public bool Faraz_Enable { get; set; }

        public int ApplicationVersion { get; set; }



    }
}
