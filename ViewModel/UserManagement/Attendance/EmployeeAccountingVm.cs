using Newtonsoft.Json;
using Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public partial class EmployeeAccountingVm : BaseClass
    {

        public Guid PuUser_Id { get; set; }
        public Guid DoingUserId { get; set; }

        public int PersonelSalariYear { get; set; }
        public int PersonelSalariMonth { get; set; }
        public string PersonelSalariMonthStr { get { return DateTimeOperation.GetStringOfMonth(PersonelSalariMonth); } }

        /// <summary>
        /// از تاریخ
        /// </summary>
        public DateTime FromDate { get; set; }
        public string FromDateStr
        {
            get
            {
                return (this.FromDate != null) ? DateTimeOperation.M2S(this.FromDate) : "";
            }
        }
        /// <summary>
        /// تا تاریخ
        /// </summary>
        public DateTime ToDate { get; set; }
        public string ToDateStr
        {
            get
            {
                return ((this.ToDate != null) ? DateTimeOperation.M2S(this.ToDate) : "");
            }
        }


        public string DataJson { get; set; }
        public AttendanceVM DataJson_Value { get { return !string.IsNullOrEmpty(DataJson) ? JsonConvert.DeserializeObject<AttendanceVM>(DataJson) : new AttendanceVM(); } }


        public string FilterJson { get; set; }
        public PersonAccountingFilter FilterJson_Value { get { return !string.IsNullOrEmpty(FilterJson) ? JsonConvert.DeserializeObject<PersonAccountingFilter>(FilterJson) : new PersonAccountingFilter(); } }


        public string Person_Name { get; set; }
        public string DoingName { get; set; }


        public bool Uploaded { get; set; }
        public string UploadType { get; set; }
        public string UploadTypeStr { get { return Uploaded == true ? (UploadType == "cost" ? "پرداخت شده" : (UploadType == "cost_incoming" ? "بدهکار" : "محاسبه شده")) : "محاسبه شده"; } }

        public decimal PayedPrice { get; set; }
        public decimal RemainPrice { get { return DataJson_Value!=null && DataJson_Value.personAccounting!=null? DataJson_Value.personAccounting.KhalesPardakhti - this.PayedPrice:0; } }
    }
}








