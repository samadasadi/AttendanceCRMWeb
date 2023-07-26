using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.PublicEnum
{
    //Create By Mobin
    /// <summary>
    /// Medical : برای مدیکال است
    /// Dental : برای دنتال است    
    /// Both : برای هردو است   
    /// </summary>
    /// For Table RolesMedicalCenter And Database CommonMinaDentTest1
    public enum TypeCenterRole : byte
    {
        Medical = 1,
        Dental = 2,
        Both = 3
    }
}
