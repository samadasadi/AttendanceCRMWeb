using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace Repository
{
    public interface IConnection
    {
        SqlConnection Connection {get;}
    }

    public class CommonConnection : IConnection
    {
        private readonly SqlConnection _connection;

        public CommonConnection(SqlConnection connection)
        {
            _connection = connection;
        }

        public SqlConnection Connection
        {
            get { return _connection; }
        }
    }

    public class LogConnection : IConnection
    {
        private readonly SqlConnection _connection;

        public LogConnection(SqlConnection connection)
        {
            _connection = connection;
        }

        public SqlConnection Connection
        {
            get { return _connection; }
        }
    }
  
    public class BaseDAO
    {
        public SqlConnection CleanSeeSqlConnection
        {
            get
            {
                return CleanSeeConnection.Connection;
            }
        }

        public SqlConnection LogSqlConnection
        {
            get
            {
                return LogConnection.Connection;
            }
        }


        public CommonConnection CleanSeeConnection { get; set; }
        public LogConnection LogConnection { get; set; }
    }
}
