using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.iContext
{
    
    public class MyContextFactory : IDbContextFactory<Context>
    {
        public Context Create()
        {

            // return new Context("Data Source=185.81.96.70;initial catalog=MinaDent;user id=it;password=Ab123456;MultipleActiveResultSets=True;");
            return new Context("CommonContext");
        }
    }
}
