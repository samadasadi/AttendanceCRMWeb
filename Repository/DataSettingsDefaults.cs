using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public static partial class NopDataSettingsDefaults
    {
        public static string ConnectionString => "~/AppConfig.json";
        public static string ObsoleteFilePath => "~/App_Data/Settings.txt";
        public static string FilePath => "~/App_Data/dataSettings.json";
        public static string UpdateVersionPath => "~/App_Data/updateVersion.json";
        public static string TempOrderPrint => "~/Media/Temp/";

        public static string ServerUrl => "http://37.156.28.11:7124/";


        public static string VisitTime_DateTimeFormat => "yyyy-MM-dd HH:mm:ss";
    }
}
