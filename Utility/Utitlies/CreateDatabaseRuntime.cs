using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Utility.Utitlies
{
    //Create Class By Mobin   
    public class CreateDatabaseRuntime
    {
        public static bool CreateDatabase(string connectionString, bool alterDatabase = false)
        {
            try
            {
                var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                var databaseName = sqlConnectionStringBuilder.InitialCatalog;

                sqlConnectionStringBuilder.InitialCatalog = "master";

                using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
                {
                    sqlConnection.Open();

                    using (var sqlCommand = sqlConnection.CreateCommand())
                    {
                        sqlCommand.CommandText = !alterDatabase ? string.Format("CREATE DATABASE {0}", databaseName) : string.Format("ALTER DATABASE {0}", databaseName);
                        sqlCommand.ExecuteNonQuery();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool DatabaseExists(string connectionString)
        {
            var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

            var databaseName = sqlConnectionStringBuilder.InitialCatalog;

            sqlConnectionStringBuilder.InitialCatalog = "master";

            using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
            {
                sqlConnection.Open();

                using (var command = sqlConnection.CreateCommand())
                {
                    command.CommandText = $"SELECT db_id('{databaseName}')";

                    return command.ExecuteScalar() != DBNull.Value;
                }
            }
        }

        public static void DropDatabase(string connectionString)
        {
            var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

            var databaseName = sqlConnectionStringBuilder.InitialCatalog;

            sqlConnectionStringBuilder.InitialCatalog = "master";

            using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
            {
                sqlConnection.Open();

                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandText = $@"
                    ALTER DATABASE {databaseName} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                    DROP DATABASE [{databaseName}]
                ";
                    sqlCommand.ExecuteNonQuery();
                }
            }
        }

        public static void ExecScriptSql(string sql, string connectionString)
        {
            try
            {
                var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                var databaseName = sqlConnectionStringBuilder.InitialCatalog;

                sqlConnectionStringBuilder.InitialCatalog = databaseName;

                using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
                {
                    sqlConnection.Open();

                    using (var sqlCommand = sqlConnection.CreateCommand())
                    {
                        string strTable = sql.Substring(sql.IndexOf("--StartC"), (sql.IndexOf("--EndC") - sql.IndexOf("--StartC")));

                        string strProcedure = sql.Substring(sql.IndexOf("--StartP"), (sql.IndexOf("--EndP") - sql.IndexOf("--StartP")));

                        string strView = sql.Substring(sql.IndexOf("--StartV"), (sql.IndexOf("--EndV") - sql.IndexOf("--StartV")));

                        string strFunction = sql.Substring(sql.IndexOf("--StartF"), (sql.IndexOf("--EndF") - sql.IndexOf("--StartF")));

                        sqlCommand.CommandText = strTable;
                        sqlCommand.ExecuteNonQuery();

                        foreach (string item in strFunction.Split(new string[] { "--,--" }, StringSplitOptions.None))
                        {
                            sqlCommand.CommandText = item;
                            sqlCommand.ExecuteNonQuery();
                        }

                        foreach (var item in strView.Split(new string[] { "--,--" }, StringSplitOptions.None))
                        {
                            sqlCommand.CommandText = item;
                            sqlCommand.ExecuteNonQuery();
                        }

                        foreach (string item in strProcedure.Split(new string[] { "--,--" }, StringSplitOptions.None))
                        {
                            sqlCommand.CommandText = item;
                            sqlCommand.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string GetConnectionStringWithParammetr(string serverName, string databaseName, string databaseUser, string databasePassword, bool multipleActiveResultSets = true)
        {
            try
            {
                return "Data Source = " + serverName + "; initial catalog = " + databaseName + "; user id = " + databaseUser + "; password = " + databasePassword + "; MultipleActiveResultSets = " + multipleActiveResultSets + "";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        public static string CheckServerToConnect(string connectionString)
        {
            try
            {
                var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                var databaseName = sqlConnectionStringBuilder.InitialCatalog;

                sqlConnectionStringBuilder.InitialCatalog = "master";

                using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
                {
                    sqlConnection.Open();
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public static bool BackupDatabase(string connectionString, string backupFileName)
        {
            try
            {
                var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                var databaseName = sqlConnectionStringBuilder.InitialCatalog;

                sqlConnectionStringBuilder.InitialCatalog = databaseName;

                using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
                {
                    sqlConnection.Open();

                    using (var sqlCommand = sqlConnection.CreateCommand())
                    {
                        sqlCommand.CommandText = String.Format("BACKUP DATABASE {0} TO DISK='{1}'",
                        databaseName, backupFileName);
                        sqlCommand.ExecuteNonQuery();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static long GetSizeDb(string connectionString)
        {
            int res = 0;
            try
            {
                var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(connectionString);

                var databaseName = sqlConnectionStringBuilder.InitialCatalog;

                sqlConnectionStringBuilder.InitialCatalog = databaseName;

                using (var sqlConnection = new SqlConnection(sqlConnectionStringBuilder.ConnectionString))
                {
                    sqlConnection.Open();

                    using (var sqlCommand = sqlConnection.CreateCommand())
                    {
                        sqlCommand.CommandType = CommandType.StoredProcedure;
                        sqlCommand.CommandText = "sp_Get_AllTableSize";
                        SqlParameter retval = sqlCommand.Parameters.Add("@result", SqlDbType.Int);
                        retval.Direction = ParameterDirection.Output;
                        sqlCommand.ExecuteNonQuery();
                        res = (int)sqlCommand.Parameters["@result"].Value;
                    }
                }
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
