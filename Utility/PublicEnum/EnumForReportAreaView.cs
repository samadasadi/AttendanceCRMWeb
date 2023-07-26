using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    /// <summary>
    /// این شمارنده فقط برای دسترسی به نام می باشد
    /// و در قسمت گزارشات استفاده می شود
    /// </summary>
    public enum EnumForReportAreaView
    {
        UrlReport,
        ShowScriptFromDateAndToDate,
        SetConfigureDateComponent,
        SetAttributeForDivReportView,
        ShowNotification
    }
}
