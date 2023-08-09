using Repository;
using Repository.iContext;
using Repository.Model;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using ViewModel.Basic;
using Task = System.Threading.Tasks.Task;

namespace Service.BasicInfo
{
    public interface IFileService
    {
        Task Delete(Guid id);


        Task<Guid> Save(FileVm file);
        Task<FileVm> Find(Guid Id);
        Task<string> GetPath(Guid? Id);
        Task<FileVm> AddFileWithHttpPostedFilePath(HttpPostedFileBase file, string path, string localPat, string Type = "");
        Task<FileVm> AddFilePath(HttpPostedFileBase file, string path, string localPath, string imgpath, Guid fileName);
        Task<FileVm> AddFileWithByteArray(byte[] byt, string path, string localPath, string Type = "");
        Task<FileVm> AddFileWithByteArray(byte[] byt, string path, string localPath, string format, string Type);
        Task<FileVm> AddFilePathDocument(HttpPostedFileBase file, string path, string localPath, string extension, Guid fileName);
        Task<Repository.Model.File> first(Expression<Func<Repository.Model.File, bool>> predicate);
    }
    public class FileService : IFileService
    {
        private readonly IRepository<Repository.Model.File> _repo;
        public FileService(IRepository<Repository.Model.File> repo, IContextFactory contextFactory)
        {
            var currentcontext = contextFactory.GetContext();
            _repo = repo;
            _repo.FrameworkContext = currentcontext;
        }


        public async Task Delete(Guid id)
        {
            await _repo.LogicalDelete(m => m.Id == id);
        }


        public async Task<Guid> Save(FileVm file)
        {
            Mapping.GenericMapping<FileVm, Repository.Model.File>.CreateMapping();
            var obj = Mapping.GenericMapping<FileVm, Repository.Model.File>.Map(file);
            await _repo.Add(obj);
            return obj.Id;
        }
        public async Task<string> GetPath(Guid? Id)
        {
            var x = await _repo.Find(Id);

            return (x != null ? x.Path : @"~Media/Profile/NoPhoto.png");
        }
        public async Task<FileVm> Find(Guid Id)
        {
            var file = await _repo.Find(Id);
            if (file == null) return new FileVm();
            Mapping.GenericMapping<Repository.Model.File, FileVm>.CreateMapping();
            var model = Mapping.GenericMapping<Repository.Model.File, FileVm>.Map(file);
            return model;
        }
        public async Task<Guid> AddFileWithHttpPostedFile(HttpPostedFileBase file)
        {
            var res = new Repository.Model.File();
            long lengh = await Task.FromResult(file.InputStream.Length);
            res.Source = await Task.FromResult(new byte[lengh]);

            await Task.Run(() =>
            {
                file.InputStream.Read(res.Source, 0, (int)lengh);
            });

            res.FileName = file.FileName;
            res.Extention = System.IO.Path.GetExtension(file.FileName);
            res.Size = file.ContentLength;
            await _repo.Add(res);
            return res.Id;
        }
        public async Task<FileVm> AddFileWithHttpPostedFilePath(HttpPostedFileBase file, string path, string localPath, string Type = "")
        {
            var fileExtention = System.IO.Path.GetExtension(file.FileName);
            if (await Task.FromResult(System.IO.File.Exists(path + file.FileName)) == true)
            {
                var newPath = path + file.FileName.Replace(fileExtention, "") + "(1)" + fileExtention;
                var j = 2;

                await Task.Run(() =>
                {
                    while (System.IO.File.Exists(newPath))
                    {
                        newPath = path + file.FileName.Replace(fileExtention, "") + "(" + j + ")" + fileExtention;
                        j++;
                    }
                });
                localPath = localPath + file.FileName.Replace(fileExtention, "") + "(" + (j - 1) + ")" + fileExtention;
                path = newPath;
            }
            else
            {
                localPath = localPath + file.FileName;
                path = path + file.FileName;
            }

            var byt = await Task.FromResult(new byte[file.InputStream.Length]);
            await Task.FromResult(file.InputStream.Read(byt, 0, (int)file.InputStream.Length));
            var fsw = await Task.FromResult(new FileStream(path, FileMode.CreateNew));

            try
            {
                await Task.Run(() =>
                {
                    fsw.Write(byt, 0, byt.Length);
                    fsw.Flush();
                    fsw.Close();
                });
            }
            catch (Exception ex)
            {
            }
            var _id = Guid.NewGuid();
            if (Type == "Employee")
            {
                var res = new Repository.Model.File
                {
                    Path = localPath,
                    FileName = file.FileName,
                    Extention = fileExtention,
                    Size = file.ContentLength,
                    ModifiedDate = DateTime.Now
                };
                await _repo.Add(res);
                _id = res.Id;
            }
            return new FileVm
            {
                Id = _id,
                Path = localPath,
                FileName = file.FileName,
                Size = file.ContentLength,
                FullPath = path
            };
        }
        public async Task<FileVm> AddFilePathDocument(HttpPostedFileBase file, string path, string localPath, string extension, Guid fileName)
        {

            string fileExtention = string.Empty;
            if (file.ContentType == "image/tiff")
                fileExtention = Path.GetExtension(Path.ChangeExtension(file.FileName, "jpg"));
            else
                fileExtention = Path.GetExtension(file.FileName);
            extension = fileExtention;

            string _filename = fileName.ToString().Replace("-", string.Empty) + fileExtention;
            if (await Task.FromResult(System.IO.File.Exists(path + _filename)))
            {
                var newPath = path + _filename.Replace(extension, "") + "(1)" + extension;
                var j = 2;

                await Task.Run(() =>
                {
                    while (System.IO.File.Exists(newPath))
                    {
                        newPath = path + _filename.Replace(extension, "") + "(" + j + ")" + extension;
                        j++;
                    }
                });
                localPath = localPath + _filename.Replace(extension, "") + "(" + (j - 1) + ")" + extension;
                path = newPath;
            }
            else
            {
                localPath = localPath + _filename;
                path = path + _filename;
            }


            if (file.ContentType != "image/tiff")
            {
                var byt = await Task.FromResult(new byte[file.InputStream.Length]);
                await Task.Run(() =>
                {
                    file.InputStream.Read(byt, 0, (int)file.InputStream.Length);
                    var fsw = new FileStream(path, FileMode.CreateNew);
                    fsw.Write(byt, 0, byt.Length);
                    fsw.Flush();
                    fsw.Close();
                });
            }
            else
            {
                await Task.Run(() =>
                {
                    var byt = new byte[file.InputStream.Length];
                    file.InputStream.Read(byt, 0, (int)file.InputStream.Length);
                    Byte[] jpegBytes = Utility.Utitlies.Utility.ConvertTifToJpg(byt);
                    var fsw = new FileStream(path, FileMode.CreateNew);
                    fsw.Write(jpegBytes, 0, jpegBytes.Length);
                    fsw.Flush();
                    fsw.Close();
                });
            }

            return new FileVm
            {
                Id = Guid.NewGuid(),
                Path = localPath,
                FileName = file.FileName,
                Size = file.ContentLength,
                Extention = extension
            };
        }
        public async Task<FileVm> AddFileWithByteArray(byte[] byt, string path, string localPath, string Type)
        {
            var fileName = Guid.NewGuid() + ".jpg";
            localPath = localPath + fileName;
            path = path + fileName;

            await Task.Run(() =>
            {
                System.IO.File.WriteAllBytes(path, byt);
            });
            var _id = Guid.NewGuid();
            if (Type == "Employee")
            {
                var res = new Repository.Model.File
                {
                    Path = localPath,
                    FileName = fileName,
                    Extention = ".jpg",
                    ModifiedDate = DateTime.Now
                };
                await _repo.Add(res);
                _id = res.Id;
            }
            return new FileVm
            {
                Id = _id,
                Path = localPath,
                FileName = fileName,
                // Size = file.ContentLength
            };
        }
        public async Task<FileVm> AddFilePath(HttpPostedFileBase file, string path, string localPath, string imgpath, Guid fileName)
        {
            var fileExtention = System.IO.Path.GetExtension(imgpath);
            string _filename = fileName.ToString().Replace("-", string.Empty) + fileExtention;
            var result = Path.GetFileName(imgpath);
            localPath = localPath + _filename;
            path = path + _filename;

            var res = new Repository.Model.File
            {
                Path = localPath,
                FileName = result,
                Extention = fileExtention,
                //Size = file.ContentLength,
                ModifiedDate = DateTime.Now
            };
            await _repo.Add(res);
            return new FileVm
            {
                Id = res.Id,
                Path = localPath,
                FileName = _filename,
                //Size = file.ContentLength
            };
        }
        public async Task<Repository.Model.File> first(Expression<Func<Repository.Model.File, bool>> predicate)
        {
            return await _repo.First(predicate);
        }
        public async Task<FileVm> AddFileWithByteArray(byte[] byt, string path, string localPath, string format, string Type = "")
        {
            var extension = Utility.EXT.EnumHelper<Utility.PublicEnum.ImageFormmat>.Parse(format);
            var fileName = Guid.NewGuid() + "." + extension.ToString() + "";
            await Task.Run(() =>
            {
                localPath = localPath + fileName;
                path = path + fileName;
                System.IO.File.WriteAllBytes(path, byt);
            });
            var res = new Repository.Model.File
            {
                Path = localPath,
                FileName = fileName,
                Extention = "." + extension.ToString() + "",
                ModifiedDate = DateTime.Now
            };
            await _repo.Add(res);
            return new FileVm
            {
                Id = res.Id,
                Path = localPath,
                FileName = fileName,
            };
        }
    }
}
