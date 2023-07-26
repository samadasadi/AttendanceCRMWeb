using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    //Create By Mobin
    /// <summary>
    /// Management : برای مدیران است
    /// User : برای کاربران است
    /// Writer : برای نویسنده است
    /// Protector : برای بخش پشتیبان است
    /// For Table Users And Database CommonMinaDentTest1
    /// </summary>
    public enum UserRole : byte
    {
        Management = 1,
        User = 2,
        Writer = 3,
        Protector = 4
    }
}
