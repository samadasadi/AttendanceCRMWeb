using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.BasicInfo
{
    public class Config
    {
        private static string _HostIp = "";
        public static string HostIp
        {
            get
            {

                if (_HostIp == "")
                {

                    //using (ClinicDbEntities db = new ClinicDbEntities())
                    //{
                    //    _HostIp = "http://" + (
                    //    from row in db.tbl_Application
                    //    select row.appHostIp
                    //    ).FirstOrDefault();
                    //}
                }
                return _HostIp;
            }

        }
    }
}
namespace ViewModel.BasicInfo
{
    public class ResultModel<T>
    {
        public string message { get; set; }
        public bool error { get; set; }
        public T model { get; set; }

    }
    public class DataModel
    {
        /// <summary>
        /// If Error Eccured then true else false
        /// </summary>
        /// <param name="_error"></param>
        public DataModel(bool _error = false)
        {
            this.error = _error;
        }
        public string message { get; set; }
        public List<string> messages { get; set; }
        public bool error { get; set; }
        public string errorCode { get; set; }

    }

    public class Login : DataModel
    {
        public string usertitle { get; set; }
        public Guid apiKey { get; set; }
        public string loginUserName { get; set; }
        public bool licence { get; set; }
        public bool AutoDocNO { get; set; }
        public string CommitText { get; set; }
    }

    public class Note : DataModel
    {
        public int id { get; set; }
        public int patientid { get; set; }
        public Nullable<int> toothid { get; set; }
        public Nullable<int> severity { get; set; }
        public string content { get; set; }
        public string path { get; set; }
        public string NoteDate { get; set; }
    }
    public class Voice : DataModel
    {
        public int id { get; set; }
        public int patientid { get; set; }
        public string path { get; set; }
    }
    public class VisitTimes : DataModel
    {
        public int id { get; set; }
        public int patientid { get; set; }
        public string visitdate { get; set; }
        public string fromtime { get; set; }
        public string duetime { get; set; }
        public string coment { get; set; }
        public string drname { get; set; }
        public string drid { get; set; }
        public int color { get; set; }

        public bool InsertWithConflict { get; set; }
    }
    public class Picture : DataModel
    {
        public int id { get; set; }
        public int patientid { get; set; }
        public string path { get; set; }
        public string content { get; set; }
    }
    public class Dr : DataModel
    {

        public int drid { get; set; }
        public string drname { get; set; }

    }
    public class Photo : DataModel
    {

        public int patientid { get; set; }
        public string path { get; set; }

    }
    public class Patient : DataModel
    {
        // ClinicDbEntities db = new ClinicDbEntities();
        public int patientID { get; set; }//شناسه
        public string name { get; set; }
        public string firstName { get; set; }//نام
        public string lastName { get; set; }//فامیلی
        public string dateOfBirth { get; set; }//تاریخ تولد
        public string DateOfInspection { get; set; }//تاریخ معاینه
        public string phone { get; set; }//موبایل
        public string photoUrl { get; set; }
        public string address { get; set; }//آدرس
        public string alergies { get; set; }
        public string diseases
        {
            get;
            set;
        }//بیماری خاص
        public string diseasesIds
        {
            get;
            set;
        }//بیماری خاص
        public string occupation { get; set; }//شغل
        public string fatherName { get; set; }//نام پدر
        public int picture { get; set; }
        public bool pregnant { get; set; }//حامله
        public string prescriptionDrugs { get; set; }//داروی مصرفی
        public string description { get; set; }//توضیحات
        public bool underMedicalTreatment { get; set; }//
        public string signUrl { get; set; }
        public string docno { get; set; }//شماره پرونده
        public string homephone { get; set; }//تلفن منزل
        public string workphone { get; set; }//تلفن محل کار
        public string drid { get; set; }//پزشک معاینه
        public string drName { get; set; }//پزشک معاینه
        public string email { get; set; }//ایمیل
        public string gender { get; set; }//جنسیت
        public string married { get; set; }//تاهل
        public string cardno { get; set; }//شماره کارت
        public string reagent { get; set; }//معرف
        public int educationid { get; set; }//شناسه تحصیلات

        public string Userid { get; set; }//کاربر ثبت کننده
        public bool AutoDocNO { get; set; }

    }
    public class Sikness : DataModel
    {

        public string id { get; set; }
        public string name { get; set; }

    }
    public class SmsBox : DataModel
    {
        public int MsgID { get; set; }
        public int Status { get; set; }
        public string Phone { get; set; }
        public string MsgBody { get; set; }
        public string RecTime { get; set; }
        public string ContactName { get; set; }
        public float RefID { get; set; }
        public string msgCreateDate { get; set; }
        public string msgEventDate { get; set; }
        public string msgRefCode { get; set; }
        public bool msgIsSystematic { get; set; }
        public string msgTag { get; set; }
        public int msgDeliveryStatus { get; set; }
        public string msgDeliveryStatusText { get; set; }
        public string msgResultID { get; set; }
        public int shareWith { get; set; }
    }
    public class Doings : DataModel
    {
        public int AutoID { get; set; }
        public string DocNo { get; set; }
        public string DoingCode { get; set; }
        public string DentisKey { get; set; }
        public string DoingChildCode { get; set; }
        public string Coment { get; set; }
        public double Price { get; set; }
        public string Date { get; set; }
        public string Employeeid { get; set; }
        public double ImPortPrice { get; set; }
        public string ChekNo { get; set; }
        public string MoneyType { get; set; }
        public string BankCenter { get; set; }
        public string CheckDate { get; set; }
        public string Center { get; set; }
        public bool CheckPassed { get; set; }
        public string NextReferDate { get; set; }
        public int DentisQty { get; set; }
        public double RealPrice { get; set; }
        public double InsurancePrice { get; set; }
        public bool UseInsurance { get; set; }
        public int DoingUserID { get; set; }
        public double Discount { get; set; }
        //public int UsedAwardId { get; set; }
        public string doInsulerCode { get; set; }
        public int doCustomerInsuranceID { get; set; }
        //public int doDocId { get; set; }
        public int fvKeyID { get; set; }
        public string doMM { get; set; }
        public string doYY { get; set; }
        public bool Printed { get; set; }
        //public bool ShowBtnRefresh { get; set; }
        public string posDateTime { get; set; }
        public string posMerchantId { get; set; }
        public string posRRN { get; set; }
        public string posStan { get; set; }
        public string posCardNo { get; set; }
        public string posTerminalId { get; set; }
        public string Discounter { get; set; }
        public double doDoctorShare { get; set; }
        public char SharingType { get; set; }
        public char doingType { get; set; }
        public long DrDiscountShare { get; set; }
        public long AssDiscountShare { get; set; }
        public long fvAssDiscountShare { get; set; }
        public long ClDiscountShare { get; set; }
        public double doAssistantShare { get; set; }
        public string doAssistantID { get; set; }
        public char doAssSharingType { get; set; }
    }
    public class readyToShip : DataModel
    {
        public int id { get; set; }
        public string messageready { get; set; }
        public string name { get; set; }
        public string mobile { get; set; }
        public string status { get; set; }
        public string title { get; set; }
        public string titleId { get; set; }
    }


    public class Debt : DataModel
    {
        public string DocNo { get; set; }
        public string Service { get; set; }
        public string ServiceDetail { get; set; }
        public string DentisKey { get; set; }
        public string Date { get; set; }
        public string DebtPrice { get; set; }
        public string DentistName { get; set; }
        public string Comment { get; set; }
        public string Count { get; set; }
    }
    public class Paid : DataModel
    {
        public string PaymentType { get; set; }
        public string Date { get; set; }
        public string AmountPaid { get; set; }
        public string Receiver { get; set; }
    }
    public class Bill : DataModel
    {
        public string TotalCosts { get; set; }
        public string TotalPayout { get; set; }
        public string AccountBalance { get; set; }
    }
    public class PatientAccount : DataModel
    {
        public List<Debt> patientAccountDebt { get; set; }
        public List<Paid> patientAccountPaid { get; set; }
        public List<Bill> patientAccountBill { get; set; }
    }


    public class ListOfTreatmentHeading : DataModel
    {
        public string TreatmentHeadingCode { get; set; }//کد سرفصل درمان
        public string TreatmentHeadingName { get; set; }//نام سرفصل درمان
    }
    public class ListOfTreatmentDescription : DataModel
    {
        public string TreatmentDescriptionCode { get; set; }//کد شرح درمان
        public string TreatmentDescriptionName { get; set; }//نام شرح درمان
    }
    public class InfoForCalcCost : DataModel
    {
        public string DocNo { get; set; }//شماره پرونده
        public string NumberOfTeeth { get; set; }// تعداد دندان
        public string TreatmentDescriptionHeadCode { get; set; }//کد سرفصل درمان
        public string TreatmentDescriptionCode { get; set; }//کد شرح درمان
        public string AmountOfDiscount { get; set; }//مبلغ تخفیف
        public string DiscountDode { get; set; }//کد تخفیف
        public string DentistCode { get; set; }//کد دندانپزشک(اگر تعرفه خاصی برای این درمان برای این پزشک ثبت شده بود آن تعرفه محاسبه شود)و
    }
    public class CalculatePatientCost : DataModel
    {
        public string TotalTreatmentCost { get; set; }//کل هزینه درمان
        public string InsuranceShare { get; set; }//سهم بیمه
        public string Payable { get; set; }//قابل پرداخت
        public string f2 { get; set; }
        public string f3 { get; set; }
        public string f4 { get; set; }

    }


    public class Assistant : DataModel
    {
        public string AssName { get; set; }
        public string AssCode { get; set; }
    }
    public class ServicesList : DataModel
    {
        public string ServiceName { get; set; }
        public string ServiceCode { get; set; }
        public List<ServiceDetailList> ServiceDetailsList { get; set; }
    }
    public class ServiceDetailList
    {
        public string ServiceName { get; set; }
        public string ServiceCode { get; set; }
    }
    public class Servivces
    {
        public List<ServicesList> ServiceList { get; set; }
    }

    public class Prices : DataModel
    {
        public string Tarifee { get; set; }
        public string Count { get; set; }
        public string HazineDarman { get; set; }
        public string SahmBimeh { get; set; }
        public string MandehBimeh { get; set; }
        public string Takhfif { get; set; }
        public string GhabelPardakht { get; set; }
        public string MandehAzSaghfBimeh { get; set; }
        public string canChangeDiscount { get; set; }
        public string Status { get; set; }
    }
    public class tblDoing : DataModel
    {
        public string DocNo { get; set; }
        public string DoingCode { get; set; }
        public string DentisKey { get; set; }
        public string DoingChildCode { get; set; }
        public string Comment { get; set; }
        public decimal Price { get; set; }
        public string Date { get; set; }
        public string Employeeid { get; set; }
        public decimal ImPortPrice { get; set; }
        public string ChekNo { get; set; }
        public string MoneyType { get; set; }
        public string BankCenter { get; set; }
        public string CheckDate { get; set; }
        public string Center { get; set; }
        public bool CheckPassed { get; set; }
        public string NextReferDate { get; set; }
        public int DentisQty { get; set; }
        public decimal RealPrice { get; set; }
        public decimal InsurancePrice { get; set; }
        public Nullable<bool> UseInsurance { get; set; }
        public int DoingUserID { get; set; }
        public decimal Discount { get; set; }
        //public int UsedAwardId { get; set; }
        public string doInsulerCode { get; set; }
        public Nullable<int> doCustomerInsuranceID { get; set; }
        //public int doDocId { get; set; }
        public int fvKeyID { get; set; }
        public string doMM { get; set; }
        public string doYY { get; set; }
        public bool Printed { get; set; }
        //public bool ShowBtnRefresh { get; set; }
        public string posDateTime { get; set; }
        public string posMerchantId { get; set; }
        public string posRRN { get; set; }
        public string posStan { get; set; }
        public string posCardNo { get; set; }
        public string posTerminalId { get; set; }
        public string Discounter { get; set; }
        public decimal doDoctorShare { get; set; }
        public string SharingType { get; set; }
        public string doingType { get; set; }
        public float DrDiscountShare { get; set; }
        public float AssDiscountShare { get; set; }
        public long fvAssDiscountShare { get; set; }
        public float ClDiscountShare { get; set; }
        public decimal doAssistantShare { get; set; }
        public string doAssistantID { get; set; }
        public string doAssSharingType { get; set; }


        public int basicPrice { get; set; }
        public string status { get; set; }
    }


    public class DiscountList
    {
        public string DiscountId { get; set; }
        public string DiscountName { get; set; }
        public string DiscountPercent { get; set; }
        public string Discount_Doctor_Percent_Sahm { get; set; }
        public string Discount_Center_Percent_Sahm { get; set; }
    }


    public class PaymentType
    {
        public string PaymentTypeName { get; set; }
        public string PaymentTypeCode { get; set; }
    }

    public class PatientDrList : DataModel
    {
        public string DoctorId { get; set; }
        public string DoctorFirstName { get; set; }
        public string DoctorLastName { get; set; }
        public string DoctorFullName { get; set; }
    }


    public class SalamatTokenInfoVm
    {
        public int terminalId { get; set; }
        public string username { get; set; }
        public string password { get; set; }
    }
    public class SalamatDoctorSessionInfoVm
    {
        public string cpartyUsername { get; set; }
        public string cpartyPassword { get; set; }
    }
    public class SalamatTwoStepDoctorSessionInfoVm
    {
        public string cpartySessionId { get; set; }
        public int otp { get; set; }
    }
    public class SalamatPatientSessionInfoVm
    {
        public string cpartySessionId { get; set; }
        public string nationalNumber { get; set; }
    }
    public class SalamatRequestVm<T> : DataModel
    {
        public int resCode { get; set; }
        public string resMessage { get; set; }
        public T info { get; set; }
    }
    public class PrintOorderFilter
    {
        public string cpartySessionId { get; set; }
        public string citizenSessionId { get; set; }
        public string nationalNumber { get; set; }
        public string samadCode { get; set; }
        public string type { get; set; }
    }
    public class PrintOorder
    {
        public string print { get; set; }
        public string DownloadPath { get; set; }
    }
    public class PrintDeliverOrderFilter
    {
        public string cpartySessionId { get; set; }
        public string checkCode { get; set; }
    }
    public class FetchOrderBySamadFilter
    {
        public string cpartySessionId { get; set; }
        public string citizenSessionId { get; set; }
        public string samadCode { get; set; }
    }
    public class FetchOrderBySamad
    {
        public string creationDate { get; set; }
        public string partnerName { get; set; }
        public string partnerPhone { get; set; }
        public string contractPartyName { get; set; }
        public string SamadCode { get; set; }
        public string NationalCode { get; set; }
        public string trackingCode { get; set; }
        public Guid DoctorId { get; set; }
        public List<SubscriptionInfosFetch> subscriptionInfos { get; set; }
    }
    public partial class SubscriptionInfosFetch
    {
        public string checkCode { get; set; }
        public int bulkId { get; set; }
        public string description { get; set; }
        public float numberOfRequest { get; set; }
        public string consumption { get; set; }
        public string consumptionSNOMEDCode { get; set; }
        public int typeId { get; set; }
        public string typeIdStr
        {
            get
            {
                var _result = "";
                switch (this.typeId)
                {
                    case 1: _result = "drug"; break;
                    case 2: _result = "test"; break;
                    case 3: _result = "imaging"; break;
                    case 4: _result = "physiotherapy"; break;
                    case 5: _result = "doctor"; break;
                    case 6: _result = "reference"; break;
                }
                return _result;
            }
        }
        public string serviceDescription { get; set; }
        public string serviceFullName { get; set; }
        public string shape { get; set; }
        public string consumptionInstruction { get; set; }
        public string serviceInterfaceName { get; set; }
        public string serviceNationalNumber { get; set; }
        public string serviceShortName { get; set; }
        public float numberOfPeriod { get; set; }
        public string status { get; set; }
        public List<DeliveredSubscriptionInfos> deliveredSubscriptionInfos { get; set; }

    }
    public class DeliveredSubscriptionInfos
    {
        public string description { get; set; }
        public float numberOfDelivered { get; set; }
        public string consumption { get; set; }
        public string consumptionSNOMEDCode { get; set; }
        public string shape { get; set; }
        public string consumptionInstruction { get; set; }
        public string serviceDescription { get; set; }
        public string serviceFullName { get; set; }
        public string serviceInterfaceName { get; set; }
        public string serviceNationalNumber { get; set; }
        public string serviceShortName { get; set; }
        public int numberOfPeriod { get; set; }

    }



    public class Token
    {
        public int ttl { get; set; }
        public string token { get; set; }
        public DateTime dto { get; set; }
    }
    public class DoctorSession
    {
        public string sessionId { get; set; }

        public int userId { get; set; }
        public string fullName { get; set; }
        public string gender { get; set; }
        public string cellPhone { get; set; }
        public bool isTwoStep { get; set; }
        public string partnerName { get; set; }
        public string partnerNN { get; set; }
        public string cPartyNN { get; set; }
        public int partnerId { get; set; }
        public int cPartyId { get; set; }
    }


    public class PatientSession
    {
        public PatientSession()
        {
            message = new Message();
        }

        public bool isCovered { get; set; }
        public string IsCoveredStr { get { return isCovered ? "بله" : "خیر"; } }
        public int coverageReferenceInternalOwnerId { get; set; }// 74055604,
        public int age { get; set; }// 27,
        public string birthDate { get; set; }//example : "13721122",
        public string BirthDateStr { get { return (!string.IsNullOrEmpty(birthDate) && !birthDate.Contains("*")) ? (birthDate.Substring(0, 4) + "/" + birthDate.Substring(4, 2) + "/" + birthDate.Substring(6, 2)) : ""; } }
        public DateTime? BirthDateEn { get { return !string.IsNullOrEmpty(birthDate) ? DateTimeOperation.S2M(BirthDateStr) : (DateTime?)null; } }
        public int countOfFamilyMember { get; set; }//": 1,
        public string gender { get; set; }//": "M",
        public string geoInfo { get; set; }//": "روستايي: استان لرستان, شهرستان خرم آباد, بخش مركزي, دهستان كرگاه غربي, آبادي تلوري پايين",
        public string lastName { get; set; }//": "اسدي باراني",
        public string lifeStatus { get; set; }//": null,
        public string name { get; set; }//": "ميثم",
        public string memberImage { get; set; }//": "data:image/jpg;base64,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",
        //public Image memberImage { get; set; }//": "data:image/jpg;base64,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",
        public string productName { get; set; }//": "روستاييان",
        public string registrationStatus { get; set; }//": "F",
        public string relationType { get; set; }//": "R",
        public string RelationTypeStr
        {
            get
            {
                switch (relationType)
                {
                    case "R": return "سرپرست";
                    case "C": return "فرزند";
                    case "S": return "همسر";
                    case "T": return "خواهر";
                    case "B": return "برادر";
                    case "F": return "پدر";
                    case "M": return "مادر";
                    case "O": return "متفرقه";
                    default: return "";
                }
            }
        }
        public string responsibleFullName { get; set; }//": "ميثم اسدي باراني",
        public string responsibleNN { get; set; }//": "6120010807",
        public string zipCode { get; set; }//": "6819639798",
        public string nationalNumber { get; set; }//": "6120010807",
        public string accountValidto { get; set; }//": "14000631",
        public string AccountValidtoStr { get { return (!string.IsNullOrEmpty(accountValidto) && !accountValidto.Contains("*")) ? accountValidto.Substring(0, 4) + "/" + accountValidto.Substring(4, 2) + "/" + accountValidto.Substring(6, 2) : ""; } }
        public string issuerType { get; set; }//": "I",
        public string IssuerTypeStr
        {
            get
            {
                switch (issuerType)
                {
                    case "I": return "بیمه سلامت";
                    case "T": return "بیمه تامین اجتماعی";
                    case "B": return "بیتسا(آزاد)";
                    case "M": return "نامشخص";
                    default: return "";
                }
            }
        }
        public int productId { get; set; }//": 8,
        public string ProductIdStr
        {
            get
            {
                switch (productId)
                {
                    case 1: return "بیمه سلامت همگانی";
                    case 2: return "کارکنان دولت";
                    case 4: return "سایر اقشار - بهزیستی";
                    case 6: return "ایرانیان";
                    case 8: return "روستاییان";
                    case 121: return "سایراقشار - ایثارگران";
                    case 160: return "سایر اقشار - اتباع خارجی آسیب پذیر";
                    case 221: return "سایر اقشار - طلاب و روحانیون";
                    case 222: return "سایر اقشار - مجتمع امام";
                    case 240: return "سایر اقشار - ورزشکاران";
                    case 241: return "سایر اقشار - دانشجویان";
                    case 1040: return "بانک قرض الحسنه مهر ایرانیان";
                    case 1200: return "کارکنان دولت - ماده 6";
                    case 1360: return "سایر اقشار - کارآموزان قضایی فوه قضاییه";
                    case 1362: return "سایر اقشار - نظام ارجاع 1";
                    case 1400: return "سایر اقشار - مجهول الهویه";
                    case 1440: return "سایر اقشار - اتباع غیر آسیب پذیر";
                    case 1562: return "سلامت همگانی ایرانیان - گ یک";
                    case 1566: return "روستاییان گروه اول";
                    case 1568: return "روستاییان بیمه پرداز";
                    case 1570: return "روستاییان همگانی ایرانیان - گ دو";
                    case 1578: return "سلامت همگانی ایرانیان";
                    default: return "";
                }
            }
        }
        public bool isReferenceable { get; set; }//": false,
        public string cellPhoneNumber { get; set; }//": "09106575672",
        public string maritalStatus { get; set; }//": "S",
        public Message message { get; set; }
        public string citizenSessionId { get; set; }//": "7338748a5b3109abad20547478099b3fb19421973bce4582fddb2a574b6202d914bfcb1239a44209ee305س٤سص٢7٣ر٣رضݥbس٥٦١c3bbb31cba3cf6a9b62e7604960051f2cbfcb0083c610b113ae10ce77475e59e3a2b72293219cf364ca88c11d5bf8559517c514ae3c516b16686bdd9fe02c6d5dbed802e3e60547cede1653ecb2d8e91aeccb0c4b3eae6fe49fa18d248b4283dc7e2e988681f2dcdb0cec757ddd0446b1a0d627dea6a٢س١ݡ3ذط٥رܸc3833f79371c3a46dafb819a4a2119bbbc75c10f754757e195af88fdefed6a1e52485a306c3f2b8962d096e7c2203cef3b4216c9eeac4413532d378c6606f12917bf8d9f13f7da12b60f8fd3bd1464a87de0b1624c957e58a27b1dedfb447e89995aa4e4b21e95b5e4b6f1151e50704f0f1315831ed707577b1cafa54e0a8eeff115d1355eb086f3fbaa7af79d1300010feb0df067404982d0d31ec4b4024ed075e03e9369b128de476821c3d270e78097fdc7af7bd5822e084bdfd5c3c64f4991bd4ecbff9f096d70285c82f7bc65f3b0bd2082976a071a990e6253475f7be752a612d2c55606d5927479a5abe3ac51d45ec0f494ca6b6db674bee01efe30efb0edddb252fa960ed9b9a43ecda5c4c52dd6c9341ceffbfee63b4921478fe08adbcfa6c0f26fddcf9ec3e596b40af1b815d471783abbf504f220d45a280d97cc275ae52c0aebf4cd0b0e4854e5a75967e877e8ba2b3e0368e0ca4edac27160de51d7135dc19a8d542d0ba4e4094e9bbbd4a88c84b572da90f235dcea687d2fff0f86cef311d88f1ab43174f939ce3fbbc0f0abcc4a0d7a4510223a557cae5cac1e88d1a130a2a33c2d65",
        public string familyPhysician { get; set; }//": null
        public string specialAccount { get; set; }//": null
    }
    public class SamadCode
    {
        public string samadCode { get; set; }
        public Message message { get; set; }
    }
    public class SalamatSamadCodeSessionInfoVm
    {
        public string cpartySessionId { get; set; }
        public string citizenSessionId { get; set; }
    }


    public class Message
    {
        public List<SnackMessage> snackMessage { get; set; }
        public List<InfoMessage> infoMessage { get; set; }
    }
    public class SnackMessage
    {
        public string text { get; set; }
        public string type { get; set; }
    }
    public class InfoMessage
    {

    }



    public class SamadOrderedSearchFilter
    {
        public string cpartySessionId { get; set; }
        public string nationalNumber { get; set; }
        public string status { get; set; }
        public string fromDate { get; set; }
        public string toDate { get; set; }
        public int index { get; set; }
        public int count { get; set; }
    }
    public class SamadOrderedSearch
    {
        public string creationDate { get; set; }
        public string nationalNumber { get; set; }
        public string status { get; set; }
        public string statusStr
        {
            get
            {
                var _res = status == "R" ? ("ثبت") : (status == "O" ? ("تجویز") : (status == "D" ? ("ارائه") : ""));
                return _res;
            }
        }
        public string partnerName { get; set; }
        public string picture { get; set; }
        public string productName { get; set; }
        public string gender { get; set; }
        public string genderStr { get { return gender == "F" ? "زن" : (gender == "M" ? "مرد" : ""); } }
        public string name { get; set; }
        public string lastName { get; set; }
        public int age { get; set; }
        public string samadCode { get; set; }
        public string trackingCode { get; set; }
        public string referenceTrackingCode { get; set; }







        public Guid CustomerId { get; set; }
        [Required(ErrorMessage = "*")]
        [Display(Name = "پزشک")]
        [UIHint("HorizentalDropdwonR")]
        public Guid DoctorId { get; set; }
        public List<NormalJsonClass> doctorList { get; set; }
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName("از تاریخ ")]
        public DateTime FromDate { get; set; }
        public string FromDateStr { get { return DateTimeOperation.M2S(FromDate).Replace("/", ""); } }
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName(" تا تاریخ")]
        public DateTime ToDate { get; set; }
        public string ToDateStr { get { return DateTimeOperation.M2S(FromDate).Replace("/", ""); } }
        public string UrlData { get; set; }
    }

    public class SamadDeliveredSearch
    {
        public int rowNum { get; set; }
        public string prescriptionType { get; set; }
        public string prescriptionTypeStr
        {
            get
            {
                var _res = prescriptionType == "E" ? ("الکترونیک") : (prescriptionType == "P" ? ("کاغذی") : "");
                return _res;
            }
        }
        public string deliveredDate { get; set; }
        public string nationalNumber { get; set; }
        public string productName { get; set; }
        public int sequenceNumber { get; set; }
        public string picture { get; set; }
        public string samadStatus { get; set; }
        public string samadStatusStr
        {
            get
            {
                var _res = samadStatus == "R" ? ("ثبت") : (samadStatus == "O" ? ("تجویز") : (samadStatus == "D" ? ("ارائه") : ""));
                return _res;
            }
        }
        public string checkCode { get; set; }
        public string dto { get; set; }
        public string gender { get; set; }
        public string genderStr
        {
            get
            {
                var _res = gender == "F" ? ("زن") : (gender == "M" ? ("مرد") : "");
                return _res;
            }
        }
        public string name { get; set; }
        public string lastName { get; set; }
        public int age { get; set; }
        public string relationType { get; set; }
        public string validTo { get; set; }
        public string trackingCode { get; set; }




        public Guid CustomerId { get; set; }
        [Required(ErrorMessage = "*")]
        [Display(Name = "پزشک")]
        [UIHint("HorizentalDropdwonR")]
        public Guid DoctorId { get; set; }
        public List<NormalJsonClass> doctorList { get; set; }
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName("از تاریخ ")]
        public DateTime FromDate { get; set; }
        public string FromDateStr { get { return DateTimeOperation.M2S(FromDate).Replace("/", ""); } }
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [DisplayName(" تا تاریخ")]
        public DateTime ToDate { get; set; }
        public string ToDateStr { get { return DateTimeOperation.M2S(FromDate).Replace("/", ""); } }
        public string UrlData { get; set; }
    }
}