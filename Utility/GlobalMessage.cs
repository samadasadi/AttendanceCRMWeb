using System;

namespace Utility
{
    public static class GlobalMessage
    {
        public static string UpdateResult(string formName, bool isOk = true)
        {
            return isOk
                       ? String.Format("ویرایش {0} با موفقیت انجام شد", formName)
                       : String.Format("در ویرایش {0} خطا رخ داده است", formName);
        }

        public static string NotAlowUpdateAfterConfirm()
        {
            return "پس از ثبت نهایی امکان تغییر اطلاعات اصلی وجود ندارد.";
        }

        public static string InsuranceResult(string formName, bool isOk = true)
        {
            return isOk
                       ? String.Format("عملیات ویرایش {0} با موفقیت انجام شد.", formName)
                       : String.Format("متاسفانه تاریخ اطلاعات بیمه در{0} با هم تداخل دارد .", formName);
        }

        public static string ActiveResult(string formName, bool isOk = true)
        {
            return isOk
                       ? String.Format("عملیات ویرایش {0} با موفقیت انجام شد.", formName)
                       : String.Format("در بخش بیمه ها بیش از یک بیمه ی فعال وجود دارد .", formName);
        }
        public static string InsertResult(string formName, bool isOk = true)
        {
            return isOk
                       ? String.Format("ثبت {0} با موفقیت انجام شد", formName)
                       : String.Format("در ثبت {0} خطا رخ داده است", formName);
        }
        public static string ErrorMessageOperation()
        {
            return "متأسفانه عملیات با موفقیت انجام نشد.";
        }

        /// <summary>
        /// این متد برای جلوگیری از درخواست های کاربر می باشد مثل حذف یا ثبت یا ویرایش که پیغام مورد نظر را چاپ می کند
        /// </summary>
        /// <param name="strMessage"></param>
        /// <returns></returns>
        public static string requestMessage(string strMessage)
        {
            return string.Format("امکان {0} این درخواست وجود ندارد", strMessage);
        }
    }
}