using System;
using System.Linq;
using Repository.Model;

namespace Repository.iContext
{
    public class ContextFactory : IContextFactory
    {
        private Context _dbContext;
        private CommonContext _commonContext;

        public string MainConnectionString { get; set; }
        public ContextFactory(string connection)
        {
            MainConnectionString = connection;
            if (connection != "")
            {
                _dbContext = new Context(connection);
            }
            //_commonContext = new CommonContext();
            _commonContext = new CommonContext(connection);
        }
        public Context GetContext()
        {
            return _dbContext;
        }

        public Context GetNewContext()
        {
            return new Context(MainConnectionString);
        }

        public CommonContext GetCommonContext()
        {
            return _commonContext;
        }

        public string GetConnectionString()
        {
            return MainConnectionString;
        }
    }

    public interface IContextFactory
    {
        Context GetContext();
        CommonContext GetCommonContext();
        Context GetNewContext();
        string GetConnectionString();
    }
}