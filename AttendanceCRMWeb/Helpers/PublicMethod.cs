using Repository;
using Repository.Infrastructure;
using Service.BasicInfo;
using Service.Common;
using Service.Consts;
using Service.Security;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Hosting;
using ViewModel.BasicInfo;
using ViewModel.Common;
using ViewModel.UserManagement.Attendance;

namespace AttendanceCRMWeb.Helpers
{
    public class PublicMethod
    {
        public static void RunTableScript(string path)
        {
            try
            {
                //var _connstring = ConfigurationManager.ConnectionStrings["CommonContext"];
                //var csb = new SqlConnectionStringBuilder(_connectionString.ConnectionString);
                var _connectionString = ConnectionStringManager.LoadSettings(true);
                var _medical = new MedicalCenterVm
                {
                    ServerNameLocal = _connectionString.ServerName,
                    DatebaseName = _connectionString.Database,
                    DatabaseUser = _connectionString.UserId,
                    DatabasePassword = _connectionString.Password,
                };
                PublicMethod.AlterDatabase(_medical, path);
            }
            catch (Exception ex)
            {

            }
        }
        public static DataModelResult AlterDatabase(MedicalCenterVm model, string path)
        {
            try
            {
                var connectionString = @"data source=" + model.ServerNameLocal +
                                                  ";initial catalog=" + model.DatebaseName +
                                                  ";user id=" + model.DatabaseUser +
                                                  ";password=" + model.DatabasePassword +
                                                  ";MultipleActiveResultSets=True;App=EntityFramework";

                using (DbConnection connection = new SqlConnection(connectionString.Replace("MultipleActiveResultSets=True;App=EntityFramework", "")))
                {
                    try
                    {
                        connection.Open();
                        try { RunSqlCommand(connection, String.Format(@"Alter Database {0} Set Recovery Simple DBCC SHRINKFILE ('MinaDB_log') Alter Database {0} Set Recovery Full; ", model.DatebaseName)); } catch { }
                        try { RunSqlCommand(connection, String.Format(@"Alter Database {0} Set Recovery Simple DBCC SHRINKDATABASE ('MinaDB') Alter Database {0} Set Recovery Full; ", model.DatebaseName)); } catch { }
                        string _storeprocedureScript = File.ReadAllText(path);
                        var sqlCommands = GetCommandsFromScript(_storeprocedureScript);
                        foreach (var _cmd in sqlCommands)
                        {
                            try
                            {
                                RunSqlCommand(connection, _cmd);
                            }
                            catch (Exception ex)
                            {

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public static void RunSqlCommand(DbConnection connection, string _cmd)
        {
            try
            {
                using (DbCommand command = new SqlCommand(_cmd))
                {
                    command.CommandTimeout = 300;
                    command.Connection = connection;
                    command.ExecuteNonQuery();
                    System.Threading.Thread.Sleep(10);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static IList<string> GetCommandsFromScript(string sql)
        {
            var commands = new List<string>();

            //origin from the Microsoft.EntityFrameworkCore.Migrations.SqlServerMigrationsSqlGenerator.Generate method
            sql = Regex.Replace(sql, @"\\\r?\n", string.Empty);
            var batches = Regex.Split(sql, @"^\s*(GO[ \t]+[0-9]+|GO)(?:\s+|$)", RegexOptions.IgnoreCase | RegexOptions.Multiline);

            for (var i = 0; i < batches.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(batches[i]) || batches[i].StartsWith("GO", StringComparison.OrdinalIgnoreCase))
                    continue;

                var count = 1;
                if (i != batches.Length - 1 && batches[i + 1].StartsWith("GO", StringComparison.OrdinalIgnoreCase))
                {
                    var match = Regex.Match(batches[i + 1], "([0-9]+)");
                    if (match.Success)
                        count = int.Parse(match.Value);
                }

                var builder = new StringBuilder();
                for (var j = 0; j < count; j++)
                {
                    builder.Append(batches[i]);
                    if (i == batches.Length - 1)
                        builder.AppendLine();
                }

                commands.Add(builder.ToString());
            }

            return commands;
        }

        public static void UpdateApplicationVersion()
        {
            try
            {
                //var _connstring = ConfigurationManager.ConnectionStrings["CommonContext"];
                //var csb = new SqlConnectionStringBuilder(_connstring.ConnectionString);

                var _connectionString = ConnectionStringManager.LoadSettings(true);
                var _settings = DataSettingsManager.LoadSettings(null, true);
                if (_settings != null)
                {
                    var _query = string.Format(@" update tbl_Application set ApplicationVersion = N'{0}' ", _settings.AppVersionInt.ToString());

                    var connectionString = @"data source=" + _connectionString.ServerName +
                                                      ";initial catalog=" + _connectionString.Database +
                                                      ";user id=" + _connectionString.UserId +
                                                      ";password=" + _connectionString.Password +
                                                      "; MultipleActiveResultSets=True;App=EntityFramework";
                    using (DbConnection connection = new SqlConnection(connectionString.Replace("MultipleActiveResultSets=True;App=EntityFramework", "")))
                    {
                        try
                        {
                            connection.Open();
                            RunSqlCommand(connection, _query);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        finally
                        {
                            connection.Close();
                        }
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }

        public static void CreateRunTimeDatabaseBackup()
        {
            try
            {
                var taskService = EngineContext.Resolve<IMCenterService>();
                var backUp = new BackUpVm
                {
                    FileName = "Auto-MinaDB",
                    Type = 1,
                    LocalPath = AppSettings.BackUpPath,
                    UserId = Guid.Empty,
                };
                System.Threading.Tasks.Task.Run(async () => { await taskService.BackupDataBase(backUp); });
            }
            catch (Exception ex)
            {

            }
        }
        public static void CreateRunTimeMediaBackup()
        {
            try
            {
                var taskService = EngineContext.Resolve<IMCenterService>();
                var backUp = new BackUpVm
                {
                    FileName = "Auto-Directory-Backup-1401-12",
                    Type = 2,
                    LocalPath = AppSettings.BackUpPath,
                    UserId = Guid.Empty,
                };
                System.Threading.Tasks.Task.Run(async () => { await taskService.BackupDirectory(backUp); });
            }
            catch (Exception ex)
            {

            }
        }

    }
}