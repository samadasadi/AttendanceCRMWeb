using Ionic.Zip;
using Repository.iContext;
using Repository.Infrastructure;
using Repository;
using Service.Security;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Hosting;
using System.Web;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.Common;
using Repository.Model.Common;
using Repository.Model;
using System.IO.Compression;

namespace Service.Common
{
    public interface IMCenterService
    {
        System.Threading.Tasks.Task DeleteBackup(Guid Id);
        Task<ResultModel<List<BackUpVm>>> BackupDataBase(BackUpVm model);
        Task<List<BackUpVm>> GetBackupList(int type);
        Task<BackUpVm> GetBackUpDatabaseVm(Guid id);
        Task<ResultModel<List<BackUpVm>>> BackupDirectory(BackUpVm model);
        Task<BackUp> GetLastBackupDB();
        Task<DbInfo> GetDatabaseSize();
    }
    public class MCenterService : IMCenterService
    {

        private IRepository<BackUp> _BackUpRepo;
        private IRepository<GeneralSetting> _settingRepo;
        private IRepository<PubUser> _pubUser;

        private static bool dbWorkerBackupIsBusy = false;
        public Context Context { get; set; }
        public CommonContext CommonContext { get; set; }
        public MCenterService(
            IContextFactory contextFactory,
            IRepository<GeneralSetting> settingRepo,
            IRepository<BackUp> BackUpDatabaseRepo,
            IRepository<PubUser> pubUser
            )
        {
            var currentcontext = contextFactory.GetContext();

            Context = currentcontext;

            CommonContext = contextFactory.GetCommonContext();
            _settingRepo = settingRepo;
            _settingRepo.FrameworkContext = currentcontext;

            _BackUpRepo = BackUpDatabaseRepo;
            _BackUpRepo.FrameworkContext = currentcontext;

            _pubUser = pubUser;
            _pubUser.FrameworkContext = currentcontext;

        }





        public async Task<List<BackUpVm>> GetBackupList(int type)
        {
            var _query = $"select _itm.FileName, _itm.Id, _itm.ModifiedDate,  ISNULL(_emp.FirstName + ' ' + _emp.LastName, N'بکاپ اتوماتیک') as Username, " +
                    $"\n	_itm.LocalPath, _itm.FileSize, _itm.Type " +
                    $"\nfrom [BackUp] _itm " +
                    $"\nLeft Join tbl_Employees _emp on _emp.Id = _itm.UserId " +
                    $"\nwhere _itm.Type = N'{type}' " +
                    $"\norder by _itm.ModifiedDate desc";

            var _result = (await _BackUpRepo.RunQuery<BackUpVm>(_query)).ToList();
            return _result;
        }

        public async Task<BackUpVm> GetBackUpDatabaseVm(Guid id)
        {
            Mapping.GenericMapping<BackUp, BackUpVm>.CreateMapping();
            var database = await _BackUpRepo.Find(id);
            var model = Mapping.GenericMapping<BackUp, BackUpVm>.Map(database);

            if (model.Type == 1)
            {
                string _fullpath = CommonHelper.DefaultFileProvider.MapPath(model.LocalPath.Replace(".bak", ".mina"));
                model.BackupFileData = System.IO.File.ReadAllBytes(_fullpath);
                model.ContentType = MimeMapping.GetMimeMapping(_fullpath);
            }
            else
            {
                //string _fullpath = System.IO.Path.Combine(model.LocalPath, model.FileName+".mina");
                //model.BackupFileData = System.IO.File.ReadAllBytes(_fullpath);
                //model.ContentType = MimeMapping.GetMimeMapping(_fullpath);
            }

            return model;
        }

        public async Task<ResultModel<List<BackUpVm>>> BackupDataBase(BackUpVm model)
        {

            CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));
            var _serverPath = new NopFileProvider(HostingEnvironment.MapPath("~")).Root;
            var _connstring = ConnectionStringManager.LoadSettings(true);


            string _fileName = (!string.IsNullOrEmpty(model.FileName) ? model.FileName : "AttendanceCRM") + "-" + DateTimeOperation.M2S(DateTime.Now).Replace("/", "") + "-" + DateTime.Now.Hour + "" + DateTime.Now.Minute + "" + DateTime.Now.Second + ".bak";
            string _path = @"Backup\DatabaseBackup\";
            var backUpStringFormat = "BACKUP DATABASE {0} TO DISK = '{1}'";
            //var sqlCommandMinaDent = string.Format(backUpStringFormat, _dbName, model.ServerPath + _path + _fileName);
            var sqlCommandMinaDent = string.Format(backUpStringFormat, _connstring.Database, _serverPath + _path + _fileName);

            model.LocalPath = "/" + _path.Replace(@"\", @"/") + _fileName;
            model.FileName = _fileName;
            model.FileSize = (await GetDatabaseSize()).Size;

            Context.Database.ExecuteSqlCommand(TransactionalBehavior.DoNotEnsureTransaction, sqlCommandMinaDent);
            Mapping.GenericMapping<BackUpVm, BackUp>.CreateMapping();
            await _BackUpRepo.Add(Mapping.GenericMapping<BackUpVm, BackUp>.Map(model));

            System.Threading.Tasks.Task.Run(() =>
            {
                CompressBackupFiles(model);
            });
            return new ResultModel<List<BackUpVm>> { message = "پشتیبان گیری با موفقیت انجام شد" };
        }

        public void CompressBackupFiles(BackUpVm model)
        {
            CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));

            string _fullpath = CommonHelper.DefaultFileProvider.MapPath(@"Backup\DatabaseBackup\");

            //string[] _backupPath = System.IO.File.get
            try
            {
                DirectoryInfo di = new DirectoryInfo(_fullpath);
                FileInfo[] files = di.GetFiles("*.bak");

                //foreach (string file in Directory.EnumerateFiles(_fullpath, "*.xml"))
                foreach (var file in files)
                {
                    using (FileStream sourceFile = System.IO.File.OpenRead(file.FullName))
                    {
                        var _desFile = file.FullName.Replace(".bak", ".mina");
                        if (!CommonHelper.DefaultFileProvider.FileExists(_desFile))
                        {
                            using (FileStream destinationFile = System.IO.File.Create(_desFile))
                            {
                                using (GZipStream output = new GZipStream(destinationFile, CompressionMode.Compress))
                                {
                                    sourceFile.CopyTo(output);
                                }
                            }
                        }
                    }
                }

                foreach (var file in files)
                    System.IO.File.Delete(file.FullName);
            }
            catch (Exception ex)
            {

            }
        }

        private long GetDirectorySize(string folderPath)
        {
            DirectoryInfo di = new DirectoryInfo(folderPath);
            return di.EnumerateFiles("*", SearchOption.AllDirectories).Sum(fi => fi.Length);
        }

        public async Task<ResultModel<List<BackUpVm>>> BackupDirectory(BackUpVm model)
        {
            try
            {
                CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));
                model.ServerPath = new NopFileProvider(HostingEnvironment.MapPath("~")).Root;
                var _localPath = CommonHelper.DefaultFileProvider.MapPath("~/Backup/MediaBackup/");

                model.FileName = model.FileName ?? ("Directory-Backup" + $"-{DateTimeOperation.M2S(DateTime.Now).Replace('/', '-')}-{(DateTime.Now.Hour + "" + DateTime.Now.Minute + "" + DateTime.Now.Second)}");

                //model.FileName = string.Format("Directory-Backup" + "-{0}-{1}", DateTimeOperation.M2S(DateTime.Now).Replace('/', '-'),
                //    DateTime.Now.Hour + "" + DateTime.Now.Minute + "" + DateTime.Now.Second);

                model.LocalPath = _localPath + model.FileName + @"\";

                var _fullFilePath = model.LocalPath + model.FileName + ".mina";
                if (System.IO.File.Exists(_fullFilePath)) return new ResultModel<List<BackUpVm>> { error = false, message = "" };

                if (dbWorkerBackupIsBusy) return new ResultModel<List<BackUpVm>> { error = true, message = "پشتیبان گیری قبلا اجرا شده لطفا تا پایان عملیات صبر نمایید" };

                System.Threading.Tasks.Task.Run(async () =>
                {
                    try
                    {
                        dbWorkerBackupIsBusy = true;
                        var _allfileSize = GetDirectorySize(model.ServerPath + @"\Media\");
                        long _threeGig = (long)(3.5 * (1024 * 1024 * 1024));
                        using (ZipFile zip = new ZipFile())
                        {
                            zip.UseZip64WhenSaving = Zip64Option.Always;
                            if (!Directory.Exists(model.LocalPath))
                                Directory.CreateDirectory(model.LocalPath);
                            zip.AddDirectory(model.ServerPath + @"\Media\", model.FileName);
                            //if (_allfileSize > _threeGig)
                            //    zip.MaxOutputSegmentSize = (int)(1 * (int)(1024 * 1024 * 1024));
                            zip.Save(_fullFilePath);
                        }
                        long length = GetDirectorySize(model.LocalPath);
                        model.FileSize = (int)(length / 1048576);
                        Mapping.GenericMapping<BackUpVm, BackUp>.CreateMapping();
                        await _BackUpRepo.Add(Mapping.GenericMapping<BackUpVm, BackUp>.Map(model));
                        dbWorkerBackupIsBusy = false;
                    }
                    catch (Exception ex)
                    {
                        dbWorkerBackupIsBusy = false;
                    }
                });
                return new ResultModel<List<BackUpVm>> { error = false, message = "فرآیند پشتیبان گیری آغاز شده و ممکن است چند دقیقه طول بکشد" };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async System.Threading.Tasks.Task DeleteBackup(Guid Id)
        {
            await _BackUpRepo.ExecuteSqlCommand(String.Format(@" delete from [BackUp] where Id='{0}' ", Id));
        }

        public async Task<BackUp> GetLastBackupDB()
        {
            try
            {
                //var _query = @" use minaDB select top(1) * from [BackUp] order by ModifiedDate desc  ";
                //var _res = await _commonRepo.RunQuery<BackUpVm>(_query);

                var _res = (await _BackUpRepo.GetAll()).ToList().OrderByDescending(x => x.ModifiedDate).FirstOrDefault();

                if (_res != null) return _res;
                else return new BackUp();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DbInfo> GetDatabaseSize()
        {
            var _connstring = ConnectionStringManager.LoadSettings(true);

            SqlConnection connection = new SqlConnection(_connstring.ConnectionString);
            SqlCommand testCMD = new SqlCommand("sp_spaceused", connection);
            testCMD.CommandType = CommandType.StoredProcedure;
            connection.Open();
            SqlDataReader reader = testCMD.ExecuteReader();
            var info = new DbInfo
            {
                Name = "Empty",
                Size = 0
            };

            if (reader.HasRows)
            {

                while (reader.Read())
                {
                    var unallocated = reader["unallocated space"].ToString().Replace("MB", "").Trim().ToString();
                    var capacity = reader["database_size"].ToString().Replace("MB", "").Trim().ToString();
                    info.Name = reader["database_name"].ToString();
                    var culture = new CultureInfo("en-US");
                    var temp = decimal.Parse(unallocated, culture) - decimal.Parse(capacity, culture);
                    info.Size = (int)(decimal.Parse(capacity, culture) - decimal.Parse(unallocated, culture));
                }
            }
            return info;
        }


    }
}
