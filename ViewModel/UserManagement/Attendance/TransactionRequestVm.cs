using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Utility;
using Utility.PublicEnum;

namespace ViewModel.UserManagement.Attendance
{
    public class TransactionRequestVm: PageingParamer
    {
        public TransactionRequestVm()
        {
            FromDateRequest = DateTime.Now;
            ToDateRequest = DateTime.Now;
        }



        public Guid Id { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
        public string ModifiedDateStr { get { try { return DateTimeOperation.M2S(ModifiedDate); } catch { return ""; } } }
        public string ModifiedDateStr_Time { get { try { return ModifiedDate.ToString("HH:mm"); } catch { return ""; } } }




        [Display(Name = "پرسنل")]
        [UIHint("HorizentalDropdwonR")]
        public Guid PersonID { get; set; }
        public List<NormalJsonClass> PuUserList { get; set; }



        public int UserId { get; set; }
        public string Person_Name { get; set; }


        [Display(Name = "نوع درخواست")]
        [UIHint("HorizentalDropdwonR")]
        public Guid Transaction_Id { get; set; }
        public List<NormalJsonClass> TransactionList { get; set; }


        public string Transaction_Name { get; set; }



        [Display(Name = "از تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime FromDateRequest { get; set; }
        public string FromDateRequestStr { get { try { return DateTimeOperation.M2S(FromDateRequest); } catch { return ""; } } }
        public string FromDateRequestStr_Time { get { try { return FromDateRequest.ToString("HH:mm"); } catch { return ""; } } }



        [Display(Name = "تا تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime ToDateRequest { get; set; }
        public string ToDateRequestStr { get { try { return DateTimeOperation.M2S(ToDateRequest); } catch { return ""; } } }
        public string ToDateRequestStr_Time { get { try { return ToDateRequest.ToString("HH:mm"); } catch { return ""; } } }

        [Required]
        [Display(Name = "توضیحات")]
        [UIHint("HorizentalTextBox")]
        public string Comment { get; set; }






        [Display(Name = "نوع مرخصی")]
        [UIHint("HorizentalDropdwonR")]
        public int ReqType { get; set; }
        public List<NormalJsonClass> ReqTypeList { get; set; }
        public string ReqTypeStr
        {
            get
            {
                if (ReqType == (int)TransactionReqType.ReqDay) return "روزانه";
                else if (ReqType == (int)TransactionReqType.ReqHour) return "ساعتی";
                else return "";
            }
        }

        public int ReqStatus { get; set; }
        public string ReqStatusStr
        {
            get
            {
                if (ReqStatus == (int)TransactionReqStatus.ReqStatus_InProccess) return "درحال بررسی";
                else if (ReqStatus == (int)TransactionReqStatus.ReqStatus_Accept) return "تایید شده";
                else if (ReqStatus == (int)TransactionReqStatus.ReqStatus_Decline) return "رد شده";
                else return "";
            }
        }

        public DateTime? ReqAnsDate { get; set; }
        public string ReqAnsDateStr { get { try { return ReqAnsDate != null ? DateTimeOperation.M2S(ReqAnsDate.Value) : ""; } catch { return ""; } } }
        public string ReqAnsDateStr_Time { get { try { return ReqAnsDate != null ? ReqAnsDate.Value.ToString("HH:mm") : ""; } catch { return ""; } } }

        public Guid? AccepterID { get; set; }
        public string AccepterName { get; set; }


        public string UrlData { get; set; }






        [Display(Name = "از ساعت")]
        [DataType(DataType.Time)]
        public string TimeFrom_Value { get; set; }


        [Display(Name = "تا ساعت")]
        [DataType(DataType.Time)]
        public string TimeTo_Value { get; set; }




        [Display(Name = "تایید درخواست")]
        [UIHint("HorizentalCheckBox")]
        public bool AcceptReq { get; set; }
    }
}
