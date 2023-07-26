using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.Utitlies
{
    public class CommonCustomViewTablePaging
    {
        /// <summary>
        /// تعداد کل آیتم های مدل
        /// </summary>
        public int countModel { get; set; }

        /// <summary>
        /// تعداد کل داده های برگشتی
        /// </summary>
        public int CountAll { get; set; }

        /// <summary>
        /// شماره صفحه جاری
        /// </summary>
        public int CurrentPageForAllCount { get; set; }

        /// <summary>
        /// آیدی قسمت پیجینگ مربوط به جدول
        /// </summary>
        public string PageingId { get; set; }

        /// <summary>
        /// عنوانی که در پایین جدول نمایش می دهد
        /// </summary>
        public string TableName { get; set; }

        /// <summary>
        /// آیدی بخشی که جدول در آن قرار می گیرد
        /// </summary>
        public string TableIdDiv { get; set; }

        /// <summary>
        /// آدرس متدی که داده ها را برمی گرداند
        /// /Home/PagerIndex
        /// </summary>
        public string UrlData { get; set; }

        public string UrlDelete { get; set; }

        public string UrlDeleteRows { get; set; }

        public string UrlEdit { get; set; }

        /// <summary>
        /// شماره صفحه اول
        /// </summary>
        public int FirstPage { get; set; }

        public string IdTextSearch { get; set; }

        public string IdComboSelectCount { get; set; }
        public bool IsHrefEditClick { get; set; }

        public string DivIdForCreateAndUpdate { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که بعد از انجام عملیات حذف یک متد دلخواه را اجرا کند
        /// </summary>
        public string FunctionTempForDelete { get; set; }

        public string FunctionTempForDeleteAll { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که بعد از انجام عملیات صفحه بندی یک متد دلخواه را اجرا کند
        /// </summary>
        public string FunctionTempForPageing { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که قبل از انجام عملیات ویرایش یک متد دلخواه را اجرا کند
        /// </summary>
        public string FunctionTempForEdit { get; set; }

        /// <summary>
        /// این پراپرتی برای نمایش پیغام می باشد
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که به جای پیجینگ یک عملیات دیگه ای انجام دهد
        /// </summary>
        public string FunctionWillGoForPageing { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که به جای حذف یک عملیات دیگه ای انجام دهد
        /// </summary>
        public string FunctionWillGoForDelete { get; set; }

        public int Page { get; set; }

        /// <summary>
        /// این پراپرتی برای این است که وقتی میخواهیم دکمه حذف را بزنیم به کاربر چه پیغامی نشان دهد
        /// </summary>
        public string MessageConfirmDelete { get; set; }

    }
}
