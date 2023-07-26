using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    public enum SmsStatus
    {
        /// <summary>
        /// ارسال نشده و در انتظار ارسال می باشد
        /// چه با وب سرویس چه به صورت دستی
        /// </summary>
        Pending = 1,
        /// <summary>
        /// به صورت دستی اس ام اس از پنل ارسال شده 
        /// آماده ی ارسال از سمت وب سرویس می باشد
        /// </summary>
        ManualSending = 2,
        /// <summary>
        /// ارسال شده 
        /// </summary>
        Sent = 3,
        Other = 4,
        Canceled = 5
    }

    public enum DeliveryStatus
    {
        /// <summary>
        /// تحویل موفق
        /// </summary>
        Successful = 1,
        /// <summary>
        /// رسیده به مخابرات
        /// </summary>
        TransferedToCenter = 8,
        /// <summary>
        /// لیست غیر مجاز
        /// </summary>
        BlackList = 27,
        /// <summary>
        /// نرسیده به گوشی
        /// </summary>
        NotRecivedToPhone = 2,
        /// <summary>
        /// ارسال شده
        /// </summary>
        Sent = 21,
        /// <summary>
        /// رسیده به اپراتور
        /// </summary>
        TransferedToOperator = 17,
        /// <summary>
        /// ارسال شده توسط گوشی
        /// </summary>
        SentByMobile = 5,
        /// <summary>
        /// شبکه اجتماعی
        /// </summary>
        SocialNetwork = 6,
        /// <summary>
        /// بقیه موارد
        /// </summary>
        Others = 33
    }

    public enum RecivedSMSStatus
    {
        UnSeen = 0,
        Unread = 1,
        Read = 2,
    }

    public enum SenderTypeEnum
    {
        Sms = 0,
        Avanak = 1,
        Faraz = 2,
        WhatsApp = 3
    }
}


