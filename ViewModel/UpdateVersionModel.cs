using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel
{
    public class CheckUpdateVersionModelVm
    {
        public bool CheckForUpdate { get; set; }
        public DateTime Last_CheckForUpdate { get; set; }
        public bool AvailabilityNewUpdates { get; set; }
        public List<UpdateVersionModel> VersionUpdates { get; set; }
        public DataSettings DataSetting { get; set; }
    }
    public class UpdateVersionModel
    {
        public int Version { get; set; }
        public string VersionStr
        {
            get
            {
                var _res = "";

                _res = string.Join(".", this.Version.ToString().ToCharArray());

                return _res;
            }
        }
        public string VersionDate { get; set; }
        public Dictionary<int, string> Changes { get; set; }
        public bool HasThisVersion { get; set; }
    }
}
