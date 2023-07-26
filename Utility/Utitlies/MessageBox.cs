using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Utility.Utitlies
{
    public static class MessageBox
    {
        public static JavaScriptResult Show(string message, MessageType type = MessageType.Alert, bool modal = false, MessageAlignment layout = MessageAlignment.Center, bool dismissQueue = false)
        {
            string txt = "$.noty.closeAll(); noty({ text: \"" + message + "\", type: \"" + type.ToString().ToLower() + "\", layout: \"" + layout.ToString().ToLowerFirst() + "\", dismissQueue: " + dismissQueue.ToString().ToLower() + ", modal: " + modal.ToString().ToLower() + " });";
            return new JavaScriptResult() { Script = txt };
        }

        public static MessageVm getSendStatus(string result)
        {
            var _res = new MessageVm();

            try
            {
                var _resltCode = Convert.ToInt32(result);
                if (_resltCode > 0)
                {
                    _res.message = "با موفقیت ارسال شد.";
                    _res.error = false;
                    return _res;
                }
            }
            catch { }

            try
            {
                switch (result)
                {
                    case "0": _res.message = "کاربر دمو است و امکان ارسال وجود ندارد"; _res.error = true; break;
                    case "-1": _res.message = "نام کاربری یا رمز عبور اشتباه می باشد"; _res.error = true; break;
                    case "-100": _res.message = "دسترسی به وب سرویس غیرفعال میباشد"; _res.error = true; break;
                    case "-101": _res.message = "احراز هویت انجام نشده است"; _res.error = true; break;
                    case "-102": _res.message = "کاربری منقضی شده است"; _res.error = true; break;
                    case "-7": _res.message = "سرور آیدی اشتباه است یا وجود ندارد"; _res.error = true; break;
                    case "-2": _res.message = "اشکال در آپلود"; _res.error = true; break;
                    case "-3": _res.message = "اعتبار کافی نمی باشد"; _res.error = true; break;
                    case "-4": _res.message = "عدم اتصال به TTS"; break;
                    case "-5": _res.message = "تعداد کاراکتر بیشتر از 1000 است"; _res.error = true; break;
                    case "-6": _res.message = "خارج از محدوده زمانی ارسال است"; _res.error = true; break;
                    case "-8": _res.message = "طول پیام از حد مجاز کوتاهتر می باشد"; _res.error = true; break;
                    case "-25": _res.message = "خطایی رخ داده است"; _res.error = true; break;
                    case "-20": _res.message = "خطای ناشناخته"; _res.error = true; break;
                    default: _res.message = "خطایی رخ داده است"; _res.error = true; break;
                }
                return _res;
            }
            catch (Exception ex)
            {
                _res.message = ex.Message;
                _res.error = true;
                return _res;
            }
        }
    }

    public enum MessageType
    {
        Success,
        Error,
        Information,
        Warning,
        Alert,
        Notification
    }

    public enum MessageAlignment
    {
        Bottom,
        BottomCenter,
        BottomLeft,
        BottomRight,
        Center,
        CenterLeft,
        CenterRight,
        Inline,
        Top,
        TopCenter,
        TopLeft,
        TopRight
    }



}