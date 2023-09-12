using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum HoghoghType
    {
        [Display(Name = "ثابت")]
        Sabet = 1,
        [Display(Name = "روزمزد")]
        RoozMozd = 2

    }

    public enum FingerPrintEnum
    {
        IPIsNull,
        PortIsNull,
        DisConnect,
        Connect,
        UnableToConnect
    }

    public enum TransactionReqType
    {
        ReqDay = 1,
        ReqHour = 2
    }

    public enum TransactionReqStatus
    {
        ReqStatus_InProccess = 1,
        ReqStatus_Accept = 2,
        ReqStatus_Decline = 3
    }

    public enum MarriedEnum
    {
        Married,
        Single
    }


    public enum SystemReportType
    {
        AttLog_Report,
        Takhir_Report,
        Tajil_Report,
        Ezafekar_Report,
        Gheybat_Report,
        Karkard_Report,
        DailyAttendance_Report,
        PersonsAreNotExit,

        TransactionReq_Morkhasi,
        TransactionReq_Mamoriyat
    }
    public enum PubliReportType
    {
        Persons_Report,
        UserGroups_Report,
        Shift_Report,
        Devices_Report
    }

    public enum EventLogReportType
    {
        All = 1,
        Added = 2,
        Updated = 3,
        Deleted = 4,
    }
    public enum PersonelSalariMonth
    {
        [Display(Name = "فروردین")]
        Farvardin = 1,
        [Display(Name = "اردیبهشت")]
        Ordibehesht = 2,
        [Display(Name = "خرداد")]
        Khordad = 3,
        [Display(Name = "تیر")]
        Tir = 4,
        [Display(Name = "مرداد")]
        Mordad = 5,
        [Display(Name = "شهریور")]
        Shahrivar = 6,
        [Display(Name = "مهر")]
        Mehr = 7,
        [Display(Name = "آبان")]
        Aban = 8,
        [Display(Name = "آذر")]
        Azar = 9,
        [Display(Name = "دی")]
        Dey = 10,
        [Display(Name = "بهمن")]
        Bahman = 11,
        [Display(Name = "اسفند")]
        Esfand = 12,
    }
}
