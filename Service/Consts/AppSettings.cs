using System.Web.Configuration;

namespace Service.Consts
{
    public class AppSettings
    {
        public static string ApplicationScripts
        {
            get { return WebConfigurationManager.AppSettings["ApplicationScripts"]; }
        }
        public static string HashKey
        {
            get { return WebConfigurationManager.AppSettings["HashKey"]; }
        }

        public static string BackUpPath
        {
            get { return WebConfigurationManager.AppSettings["BackUpPath"]; }
        }
        public static string DynamicReportFolder
        {
            get { return WebConfigurationManager.AppSettings["DynamicReportFolder"]; }
        }
        public static string TempDirectory
        {
            get { return WebConfigurationManager.AppSettings["TempDirectory"]; }
        }
        public static string FounderRoleGroupId
        {
            get { return WebConfigurationManager.AppSettings["FounderRoleGroupId"]; }
        }
        public static string AccountantRoleGroupId
        {
            get { return WebConfigurationManager.AppSettings["AccountantRoleGroupId"]; }
        }

        public static string FinancialManagerRoleGroupId
        {
            get { return WebConfigurationManager.AppSettings["FinancialManagerRoleGroupId"]; }
        }
        public static string ManagerRoleGroupId
        {
            get { return WebConfigurationManager.AppSettings["ManagerRoleGroupId"]; }
        }

        public static string ProfileFolder
        {
            get { return WebConfigurationManager.AppSettings["ProfileFolder"]; }
        }
        public static string CompanyId
        {
            get { return WebConfigurationManager.AppSettings["CompanyId"]; }
        }
        public static string CompanyFolder
        {
            get { return WebConfigurationManager.AppSettings["CompanyFolder"]; }
        }
        public static string UserImageFolder
        {
            get { return WebConfigurationManager.AppSettings["UserImageFolder"]; }
        }
        public static string LegalCustomerFolder
        {
            get { return WebConfigurationManager.AppSettings["LegalCustomerFolder"]; }
        }
        public static string RequestAtachment
        {
            get { return WebConfigurationManager.AppSettings["RequestAtachmentFolder"]; }
        }

        public static string SettingFolder
        {
            get { return WebConfigurationManager.AppSettings["SettingFolder"]; }
        }
        public static string DocumentFolder
        {
            get { return WebConfigurationManager.AppSettings["DocumentFolder"]; }
        }
        public static string PatientFolder
        {
            get { return WebConfigurationManager.AppSettings["PatientFolder"]; }
        }
        public static string ExcelFolder
        {
            get { return WebConfigurationManager.AppSettings["ExcelFolder"]; }
        }

        public static string DefaultLogo
        {
            get { return WebConfigurationManager.AppSettings["DefaultLogo"]; }
        }

        public static string SMSPanleUrl
        {
            get { return WebConfigurationManager.AppSettings["SMSURL"]; }
        }

        public static string Asanak_SMSPanleUrl
        {
            get { return WebConfigurationManager.AppSettings["Asanak_SMSURL"]; }
        }

        public static string LogServicePath
        {
            get { return "/Media/Logs/"; }
        }
        public static string AppVersion
        {
            get
            {
                var _settings = Repository.DataSettingsManager.LoadSettings(null, true);
                return _settings.AppVersion;
                //return WebConfigurationManager.AppSettings["AppVersion"];
            }
        }
        public static string AppVersionDate
        {
            get { return WebConfigurationManager.AppSettings["AppVersionDate"]; }
        }
        public static string ISVPS
        {
            get { return WebConfigurationManager.AppSettings["ISVPS"]; }
        }
    }
}