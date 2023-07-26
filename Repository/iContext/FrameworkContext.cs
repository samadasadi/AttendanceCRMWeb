using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.iContext
{
    public class FrameworkContext: DbContext
    {
        public FrameworkContext(string connectionString):base(connectionString)
        {
        }
    }
}
