using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Infrastructure
{
    public interface ILocker
    {
        bool PerformActionWithLock(string resource, TimeSpan expirationTime, Action action);
    }
}
