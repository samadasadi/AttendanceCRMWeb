using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.Attendance
{
    public class DeviceTransactionEventVm
    {
        public Guid Id { get; set; }
        public bool IsDelete { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeviceId { get; set; }
        public string DeviceName { get; set; }
        public DateTime? LastTransaction_Date { get; set; }
        public string LastTransaction_DateStr { get { try { return LastTransaction_Date != null ? DateTimeOperation.M2S(LastTransaction_Date.Value) : ""; } catch (Exception ex) { return ""; } } }
        public string LastTransaction_TiemStr { get { try { return LastTransaction_Date != null ? LastTransaction_Date.Value.ToString("HH:mm") : ""; } catch (Exception ex) { return ""; } } }
        public int? LastTransaction_Count { get; set; }
        public string LastTransaction_Msg { get; set; }
        public string LastTransaction_ErrorCode { get; set; }
        public bool? LastTransaction_Success { get; set; }
        public string LastTransaction_SuccessStr { get { return LastTransaction_Success == true ? "موفق" : "ناموفق"; } }
        public Guid? TransactionPeriod { get; set; }
        public long AutoId { get; set; }
        public int TransactionType { get; set; }
        public string TransactionTypeStr
        {
            get
            {
                return TransactionType == 1 ? "تخلیه لاگ" : (TransactionType == 2 ? "انتقال کاربران" : "");
            }
        }
        public string Title { get; set; }
    }
}
