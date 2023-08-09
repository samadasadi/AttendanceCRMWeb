using AttendanceCRMWeb.Controllers;
using AttendanceCRMWeb.Filters;
using AttendanceCRMWeb.Helpers;
using Repository;
using Service.Common;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static Stimulsoft.Report.QuickButtons.StiWpfQuickButtonAttribute;
using Utility.PublicEnum;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.Common;

namespace AttendanceCRMWeb.Areas.Admin.Controllers
{
    [CustomAutorizeFilter(Role = new[] { EnumRole.MedicalCenter })]
    public class MedicalCenterController : BaseController
    {
        private readonly IMCenterService _service;

        //Create By Mobin
        private readonly IGeneralSettingService _serviceGeneralSettingService;

        protected override string FormName
        {
            get { return Resources.Md.CenterClinic; }
        }
        public MedicalCenterController(IMCenterService Service, IGeneralSettingService serviceGeneralSettingService)
        {
            _service = Service;

            //Create By Mobin
            _serviceGeneralSettingService = serviceGeneralSettingService;
        }


        [FillSecurityDepFilter(RoleType = EnumRole.MedicalCenter)]
        public async Task<ActionResult> Index()
        {
            try
            {
                var connection = Sessions.SelectedConnection;
                var directory = Path.GetDirectoryName(Server.MapPath(@"/Media/"));
                string grandParent = Path.GetDirectoryName(directory);
                ViewBag.DirecotrySize = DirectoryHelper.DirSize(new DirectoryInfo(directory)) / 1048576;
                ViewBag.DatabaseInfo = await _service.GetDatabaseSize();
            }
            catch (Exception ex)
            {
                ViewBag.DirecotrySize = 0;
                ViewBag.DatabaseInfo = await _service.GetDatabaseSize();
            }
            return View();
        }



        public async Task<ActionResult> CreateBackup(int type = 0)
        {
            if (type != 0)
            {
                var _result = new ResultModel<List<BackUpVm>>();
                _result.model = await _service.GetBackupList(type);
                ViewBag.Type = type;

                //Create By Mobin                
                ViewBag.AlarmDate = TempData["isAlarmDate"] != null ? TempData["isAlarmDate"].ToString() : string.Empty;

                return View(_result);
            }
            return RedirectToAction("Index");
        }


        [HttpPost]
        public async Task<ActionResult> CreateBackup(int type, string name, bool isAlarmDate = false)
        {
            var backUp = new BackUpVm
            {
                FileName = name,
                Type = type == 1 ? type : 2,
                ServerPath = Server.MapPath("~"),
                LocalPath = AppSettings.BackUpPath,
                UserId = Public.CurrentUser.Id,
            };

            var _result = new ResultModel<List<BackUpVm>>();

            if (type == 1)
            {
                _result = await _service.BackupDataBase(backUp);
            }
            else
            {
                //backUp.LocalPath = Server.MapPath("~/Backup/MediaBackup/");
                backUp.FileName = null;
                _result = await _service.BackupDirectory(backUp);
            }

            if (isAlarmDate)
                await _serviceGeneralSettingService.updateGeneralSettingWithBackUpDate();

            _result.model = await _service.GetBackupList(type);
            //return PartialView("_Backup", _result);
            return RedirectToAction("CreateBackup", new { type = type });
        }

        public async Task<ActionResult> DownloadFile(Guid id)
        {
            var file = await _service.GetBackUpDatabaseVm(id);
            if (file != null)
            {
                var extention = Path.GetExtension(Server.MapPath(file.LocalPath));
                return new DownloadResult
                {
                    VirtualPath = Url.Content(file.LocalPath),
                    FileDownloadName = file.LocalPath.ToString()
                };
            }
            return null;
        }

        [AllowAnonymous]
        public async Task<JsonResult> DeleteRowBackup(Guid id)
        {
            await _service.DeleteBackup(id);
            return Json(new { result = true }, JsonRequestBehavior.AllowGet);
        }


        public async Task<ActionResult> DownloadMedia3(Guid id)
        {
            try
            {
                var document = await _service.GetBackUpDatabaseVm(id);
                string failure = string.Empty;
                Stream stream = null;
                int bytesToRead = 10000;

                long LengthToRead;
                string _fullpath = "";
                if (document.Type == 1)
                {
                    _fullpath = CommonHelper.DefaultFileProvider.MapPath(document.LocalPath.Replace(".bak", ".mina"));
                }
                else
                {
                    _fullpath = System.IO.Path.Combine(document.LocalPath, document.FileName + ".mina");
                }

                if (System.IO.File.Exists(_fullpath))
                {
                    try
                    {

                        FileWebRequest fileRequest = (FileWebRequest)FileWebRequest.Create(_fullpath);
                        FileWebResponse fileResponse = (FileWebResponse)fileRequest.GetResponse();

                        if (fileRequest.ContentLength > 0)
                            fileResponse.ContentLength = fileRequest.ContentLength;

                        //Get the Stream returned from the response
                        stream = fileResponse.GetResponseStream();

                        LengthToRead = stream.Length;

                        Response.BufferOutput = true;
                        //Indicate the type of data being sent
                        //Response.ContentType = "application/octet-stream";
                        Response.ContentType = MimeMapping.GetMimeMapping(_fullpath);

                        //Name the file 
                        Response.AddHeader("Content-Disposition", $"attachment; filename={document.FileName.Replace(".bak", "")}.zip");
                        Response.AddHeader("Content-Length", fileResponse.ContentLength.ToString());

                        int length;
                        do
                        {
                            try
                            {
                                // Verify that the client is connected.
                                if (Response.IsClientConnected)
                                {
                                    byte[] buffer = new Byte[bytesToRead];

                                    // Read data into the buffer.
                                    length = stream.Read(buffer, 0, bytesToRead);

                                    // and write it out to the response's output stream
                                    Response.OutputStream.Write(buffer, 0, length);

                                    // Flush the data
                                    Response.Flush();
                                    //Clear the buffer
                                    LengthToRead = LengthToRead - length;
                                }
                                else
                                {
                                    // cancel the download if client has disconnected
                                    LengthToRead = -1;
                                }
                            }
                            catch (Exception ex)
                            {
                                break;
                            }
                        } while (LengthToRead > 0); //Repeat until no data is read

                    }
                    finally
                    {
                        if (stream != null)
                        {
                            //Close the input stream                   
                            stream.Close();
                        }
                        Response.End();
                        Response.Close();
                    }
                }
                var _result = new ResultModel<List<BackUpVm>>();
                _result.model = await _service.GetBackupList(document.Type);
                ViewBag.Type = document.Type;
                ViewBag.AlarmDate = TempData["isAlarmDate"] != null ? TempData["isAlarmDate"].ToString() : string.Empty;
                return View("CreateBackup", _result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }

    public static class DirectoryHelper
    {
        public static long DirSize(DirectoryInfo d)
        {
            long size = 0;
            // Add file sizes.
            FileInfo[] fis = d.GetFiles();
            foreach (FileInfo fi in fis)
            {
                size += fi.Length;
            }
            // Add subdirectory sizes.
            DirectoryInfo[] dis = d.GetDirectories();
            foreach (DirectoryInfo di in dis)
            {
                size += DirSize(di);
            }
            return size;
        }


    }
}