using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    /// <summary>
    /// سایز کاغذ برای قسمت طرح نسخه
    /// </summary>
    public enum DraftVersionPaperSize
    {
        A4 = 1,
        A5 = 2,
    }

    /// <summary>
    /// وضعیت کاغذ برای قسمت طرح نسخه
    /// </summary>
    public enum DraftVersionOrientation
    {
        Landscape = 1,
        Portrait = 0,
    }

    /// <summary>
    /// سایز کاغذ برای قسمت عکس های درمانی
    /// </summary>
    public enum CustomerDocumentPaperSize
    {
        A4 = 1,
        A5 = 2,
        A6 = 3,
    }
}
