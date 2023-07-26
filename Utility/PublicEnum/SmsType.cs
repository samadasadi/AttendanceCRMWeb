using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum PatientPaymentSentType
    {
        DateEn = 1,
        ModifiedDate = 2
    }
    public enum SmsType
    {
        [Display(Name = "تبریک تولد   ")]
        Birthdays = 1,
        [Display(Name = "یاد اوری چک بیمار   ")]
        CeckRemindeds = 2,
        [Display(Name = "پرداختی بیمار   ")]
        PatientPayments = 3,
        [Display(Name = "یاد اوری چک مطب   ")]
        CeckClinics = 4,
        [Display(Name = "توصیه های درمانی   ")]
        Recommendationss = 5,
        [Display(Name = "وقت ملاقات های بیمار  ")]
        Appointments = 6,
        [Display(Name = "خوش امد گویی ")]
        Welcomes = 7,




        //[Display(Name = "خوش امد گویی ")]
        //Welcome = 1000,
        //[Display(Name = "وقت ملاقات های بیمار  ")]
        //Appointment = 1001,
        //[Display(Name = "ارسال صورت حساب  ")]
        //Billing = 1002,
        //[Display(Name = "توصیه های درمانی   ")]
        //Recommendations = 1003,
        //[Display(Name = "یاد اوری چک بیمار   ")]
        //CeckReminded = 1004,
        //[Display(Name = "تبریک تولد   ")]
        //Birthday = 1005,
        //[Display(Name = "بیماران بدهکار ")]
        //Debtor = 1006,
        //[Display(Name = "کارهای نیمه کاره بیمار ")]
        //SemiKars = 1007,
        //[Display(Name = "یاد آوری فلوآپ  ")]
        //Flvap = 1008,
        //[Display(Name = "پاسخ گویی به افراد مشخص شده  ")]
        //Responding = 1009,
        //[Display(Name = "تبلیغات  ")]
        //Advertising = 1010,
        //[Display(Name = "متن ساده  ")]
        //SimpleText = 1011,
        //[Display(Name = "یاد اوری چک مطب   ")]
        //CeckClinic = 1012,

    }

    public enum BlackListTypeSms
    {
        PrescriptionConfirm = 1,
        other = 2
    }
}
