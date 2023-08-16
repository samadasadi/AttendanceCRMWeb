using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.EXT;
using Utility.PublicEnum;
using Utility.PublicEnum.Attendance;

namespace ViewModel.UserManagement.Attendance
{
    public class ReportParameter
    {
        public NormalJsonClass ReportType { get; set; }
        public int UserGroupId { get; set; }



        [DisplayName("پرسنل")]
        [UIHint("HorizentalDropdwonR")]
        public Guid PersonId { get; set; }
        public List<NormalJsonClass> Personel_Lists { get; set; }

        public bool CalcEzafeBeforeVoroud { get; set; }

        public int UserId { get; set; }
        public int DeviceGroupId { get; set; }
        public int DeviceId { get; set; }
        public int TimeRecordId { get; set; }
        public string Name { get; set; }


        public bool? TarkeKar { get; set; }

        public DateTime? TarkeKarDateEn { get; set; }


        [DisplayName("از تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? FromDate { get; set; } = DateTime.Now.AddMonths(-1);
        public string FromDateStr
        {
            get
            {
                return ((this.FromDate != null) ? DateTimeOperation.M2S(this.FromDate.Value) : "");
            }
        }


        [DisplayName("تا تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? ToDate { get; set; } = DateTime.Now;
        public string ToDateStr
        {
            get
            {
                return ((this.ToDate != null) ? DateTimeOperation.M2S(this.ToDate.Value) : "");
            }
        }


        /// <summary>
        /// ساعت مرخصی ساعتی در روز، غیبت لحاظ شود
        /// </summary>
        [DisplayName("بیش از")]
        [UIHint("HorizentalCheckBox")]
        public bool chbHour1 { get; set; }
        [DisplayName("ساعت مرخصی ساعتی در روز، غیبت لحاظ شود")]
        [UIHint("HorizentalNumberTextBox")]
        public int Hour1 { get; set; }

        /// <summary>
        /// ساعت غیبت ساعتی در روز، به غیبت روزانه تبدیل شود
        /// </summary>
        [DisplayName("بیش از")]
        [UIHint("HorizentalCheckBox")]
        public bool chbHour2 { get; set; }
        [DisplayName("ساعت غیبت ساعتی در روز، به غیبت روزانه تبدیل شود")]
        [UIHint("HorizentalNumberTextBox")]
        public int Hour2 { get; set; }


        /// <summary>
        /// ساعت از غیبت فرد بخشیده شود
        /// </summary>
        [DisplayName("مقدار")]
        [UIHint("HorizentalCheckBox")]
        public bool chbHour3 { get; set; }
        [DisplayName("ساعت از غیبت فرد بخشیده شود")]
        [UIHint("HorizentalNumberTextBox")]
        public int Hour3 { get; set; }

        /// <summary>
        /// ساعت، از تاخیر و تعجیل فرد بخشیده شود
        /// </summary>
        [DisplayName("مقدار")]
        [UIHint("HorizentalCheckBox")]
        public bool chbHour4 { get; set; }
        [DisplayName("ساعت، از تاخیر و تعجیل فرد بخشیده شود")]
        [UIHint("HorizentalNumberTextBox")]
        public int Hour4 { get; set; }


        [DisplayName("نوع گزارش")]
        [UIHint("HorizentalDropdwonR")]
        public SystemReportType SystemReportType { get; set; }
        public List<NormalJsonClass> SystemReportTypeList { get { return EnumHelper<SystemReportType>.EnumToNormalJsonClass(); } }



        /// <summary>
        /// ساعت، از کارکرد فرد کسر شود
        /// </summary>
        [DisplayName("مقدار")]
        [UIHint("HorizentalCheckBox")]
        public bool chbHour5 { get; set; }
        [DisplayName("ساعت، از کارکرد فرد کسر شود")]
        [UIHint("HorizentalNumberTextBox")]
        public int Hour5 { get; set; }

        public int Status { get; set; }
        public string StatusStr
        {
            get
            {
                var _res = "";
                switch (Status)
                {
                    case (int)EventLogReportType.All: _res = ""; break;
                    case (int)EventLogReportType.Added: _res = "I"; break;
                    case (int)EventLogReportType.Updated: _res = "E"; break;
                    case (int)EventLogReportType.Deleted: _res = "D"; break;
                }
                return _res;
            }
        }

        public NormalJsonClass UserGroup { get; set; }
        public NormalJsonClass ShiftWork { get; set; }











        public bool SetExitAttRecord { get; set; }
        public int NaharTime { get; set; }

    }

}
