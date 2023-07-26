using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Repository.Model.AdvancedDentalChart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public enum DataProviderType
    {
        /// <summary>
        /// Unknown
        /// </summary>
        [EnumMember(Value = "")]
        Unknown,

        /// <summary>
        /// MS SQL Server
        /// </summary>
        [EnumMember(Value = "sqlserver")]
        SqlServer,

        /// <summary>
        /// MySQL
        /// </summary>
        [EnumMember(Value = "mysql")]
        MySql
    }
    public partial class DataSettings
    {
        #region Ctor

        public DataSettings()
        {
            RawDataSettings = new Dictionary<string, string>();
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets or sets a connection string
        /// </summary>
        //[JsonProperty(PropertyName = "DataConnectionString")]
        //public string ConnectionString { get; set; }
        public string AppVersion { get; set; }
        public int AppVersionInt
        {
            get
            {
                try
                {
                    var _res = 0;
                    if (!string.IsNullOrEmpty(this.AppVersion))
                    {
                        _res = Convert.ToInt32(this.AppVersion.Replace(".", ""));
                    }
                    return _res;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }
        public string AppVersionDate { get; set; }

        /// <summary>
        /// Gets or sets a data provider
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public DataProviderType DataProvider { get; set; }

        /// <summary>
        /// Gets or sets a raw settings
        /// </summary>
        public IDictionary<string, string> RawDataSettings { get; }

        /// <summary>
        /// Gets or sets a value indicating whether the information is entered
        /// </summary>
        /// <returns></returns>
        //[JsonIgnore]
        //public bool IsValid => DataProvider != DataProviderType.Unknown && !string.IsNullOrEmpty(ConnectionString);

        #endregion
    }


    public partial class MainConnectionString
    {
        /// <summary>
        /// Gets or sets a connection string
        /// </summary>
        [JsonProperty(PropertyName = "DataConnectionString")]
        public string ConnectionString { get; set; }
        public string ServerName { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public string Database { get; set; }
    }
}
