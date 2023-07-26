using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model.ApplicationMenu
{
    public class PubMenuDefault
    {
        /// <summary>
        /// داشبورد
        /// </summary>
        public static string Dashboard => "Dashboard";
        /// <summary>
        /// پرونده بیمار
        /// </summary>
        public static string PatientFile => "PatientFile";
        /// <summary>
        /// وقت ملاقات
        /// </summary>
        public static string Appointment => "Appointment";
        /// <summary>
        /// آوا
        /// </summary>
        public static string VoiceCall => "VoiceCall";
        /// <summary>
        /// پیامک
        /// </summary>
        public static string SMS => "SMS";
        /// <summary>
        /// لابراتوار
        /// </summary>
        public static string Laboratory => "Laboratory";
        /// <summary>
        /// حضور و غیاب
        /// </summary>
        public static string PresenceAbsence => "PresenceAbsence";



        #region گزارشات
        /// <summary>
        /// گزارشات
        /// </summary>
        public static string AppReports => "AppReports";
        public static string AppReports_Admission => "AppReports.Admission";
        public static string AppReports_Warehouse => "AppReports.Warehouse";
        public static string AppReports_Accounting => "AppReports.Accounting";
        public static string AppReports_SystemManagement => "AppReports.SystemManagement";
        #endregion


        #region انبار
        /// <summary>
        /// انبار
        /// </summary>
        public static string Warehouse => "Warehouse";
        public static string Warehouse_ProductCoding => "Warehouse.ProductCoding";
        public static string Warehouse_Stock => "Warehouse.Stock";
        public static string Warehouse_ImportationGoods => "Warehouse.ImportationGoods";
        public static string Warehouse_GoodsDeparture => "Warehouse.GoodsDeparture";
        public static string Warehouse_Inventory => "Warehouse.Inventory";
        #endregion


        #region ثبت نسخ
        /// <summary>
        /// ثبت نسخ
        /// </summary>
        public static string Prescription => "Prescription";
        public static string Prescription_PrescriptionList => "Prescription.PrescriptionList";
        public static string Prescription_PrescriptionSettings => "Prescription.PrescriptionSettings";
        #endregion


        #region کاربران
        /// <summary>
        /// کاربران
        /// </summary>
        public static string AppUsers => "AppUsers";
        public static string AppUsers_UserGroups => "AppUsers.UserGroups";
        public static string AppUsers_UserManagement => "AppUsers.UserManagement";
        public static string AppUsers_DoctorWorkingHours => "AppUsers.DoctorWorkingHours";
        public static string AppUsers_HolidayCalendar => "AppUsers.HolidayCalendar";
        #endregion


        #region حسابداری
        /// <summary>
        /// حسابداری
        /// </summary>
        public static string Accounting => "Accounting";
        public static string Accounting_Costs => "Accounting.Costs";
        public static string Accounting_CostIncoming => "Accounting.CostIncoming";
        public static string Accounting_Cheque => "Accounting.Cheque";
        public static string Accounting_ReceiptFromInsurance => "Accounting.ReceiptFromInsurance";
        #endregion


        #region حسابداری پیشرفته
        /// <summary>
        /// حسابداری پیشرفته
        /// </summary>
        public static string AdvancedAccounting => "AdvancedAccounting";

			


        public static string AdvancedAccounting_CustomersSales => "AdvancedAccounting.CustomersSales";
        public static string AdvancedAccounting_SuppliersWarehouse => "AdvancedAccounting.SuppliersWarehouse";
        public static string AdvancedAccounting_ReceivePay => "AdvancedAccounting.ReceivePay";
        public static string AdvancedAccounting_Accounting => "AdvancedAccounting.Accounting";
        public static string AdvancedAccounting_Company => "AdvancedAccounting.Company";
        public static string AdvancedAccounting_Settings => "AdvancedAccounting.Settings";




        public static string AdvancedAccounting_InitialSetup => "AdvancedAccounting.InitialSetup";
        public static string AdvancedAccounting_FirstOperationOfCourse => "AdvancedAccounting.FirstOperationOfCourse";
        public static string AdvancedAccounting_Customers => "AdvancedAccounting.Customers";
        public static string AdvancedAccounting_DocumentsList => "AdvancedAccounting.DocumentsList";
        public static string AdvancedAccounting_Reports => "AdvancedAccounting.Reports";
        public static string AdvancedAccounting_FirstOperationOfCourse_testaaaaaaaaaaaa => "AdvancedAccounting.FirstOperationOfCourse.testaaaaaaaaaaaa";
        #endregion


        #region باشگاه مشتریان
        /// <summary>
        /// باشگاه مشتریان
        /// </summary>
        public static string CustomerClub => "CustomerClub";
        public static string CustomerClub_AwardsScoring => "CustomerClub.AwardsScoring";
        public static string CustomerClub_Scoring => "CustomerClub.Scoring";
        public static string CustomerClub_Settings => "CustomerClub.Settings";
        public static string CustomerClub_Announcements => "CustomerClub.Announcements";
        public static string CustomerClub_PointsList => "CustomerClub.PointsList";
        #endregion


        #region امکانات
        /// <summary>
        /// امکانات
        /// </summary>
        public static string Possibilities => "Possibilities";
        public static string Possibilities_Calls => "Possibilities.Calls";
        public static string Possibilities_Workflow => "Possibilities.Workflow";
        public static string Possibilities_Correspondence => "Possibilities.Correspondence";
        public static string Possibilities_Contacts => "Possibilities.Contacts";
        #endregion


        #region نسخه پیچی
        /// <summary>
        /// نسخه پیچی
        /// </summary>
        public static string TherapeuticPrescription => "TherapeuticPrescription";
        public static string TherapeuticPrescription_TN_TaminEjtemaei => "TherapeuticPrescription.TN_TaminEjtemaei";
        public static string TherapeuticPrescription_TN_Salamat => "TherapeuticPrescription.TN_Salamat";
        #endregion


        public static string ReportBuilder => "ReportBuilder";


        #region تنظیمات
        /// <summary>
        /// تنظیمات
        /// </summary>
        public static string AppSettings => "AppSettings";
        public static string AppSettings_Backup => "AppSettings.Backup";
        public static string AppSettings_BasicSettings => "AppSettings.BasicSettings";
        public static string AppSettings_SystemCoding => "AppSettings.SystemCoding";
        #endregion

    }
}
