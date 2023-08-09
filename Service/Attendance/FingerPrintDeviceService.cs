using Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;
using Utility.PublicEnum.Attendance;
using System.Threading;
using ViewModel.UserManagement;

namespace Service.Attendance
{

    public class DevicesList
    {
        public DevicesList(NewDeviceVm device)
        {
            //sDK = new SDKHelper(Parent, device);
            sDK = new TwainDeviceCreator().TwainDevice(device);
            deviceVm = device;
        }
        public NewDeviceVm deviceVm { get; set; }
        //public SDKHelper sDK { get; set; }
        public IFPDevice sDK { get; set; }
    }

    public interface IFPDevice
    {
        NewDeviceVm _DeviceVm { get; set; }
        int sta_ConnectTCP();
        void sta_DisConnect();
        bool PingDevice();
        void Run_ImportAttLogFromDevice();
        void Run_ImportAllAttLogFromDevice();
        int sta_SetDeviceTime(DateTime dateTime);
        int sta_SYNCTime();
        string sta_GetDeviceDate();
        string sta_GetDeviceTime();
        int sta_GetCapacityInfo(out int adminCnt, out int userCount, out int fpCnt, out int recordCnt, out int pwdCnt, out int oplogCnt, out int faceCnt);
        int sta_GetDeviceInfo(out string sFirmver, out string sMac, out string sPlatform, out string sSN, out string sProductTime, out string sDeviceName, out int iFPAlg, out int iFaceAlg, out string sProducter);
        int SetUserInfo(UserVm user);
        int sta_GetSeialNumber();
        int sta_SetUserInfo(UserVm value);
        int sta_ClearAdmin();
        int sta_ClearAllLogs();
        int sta_ClearAllFps();
        int sta_ClearAllUsers();
        int sta_ClearAllData();

        List<UserVm> sta_GetAllUserFPInfo();
        bool GetConnectState();
        void SetConnectState(bool state);
        //void SaveTransactionLog(DeviceTransactionEventVm model);
    }
    public abstract class Creator
    {
        public abstract IFPDevice TwainDevice(NewDeviceVm dashboard);
    }
    public class TwainDeviceCreator : Creator
    {
        public override IFPDevice TwainDevice(NewDeviceVm dashboard)
        {
            switch (dashboard.FPDeviceType)
            {
                case FPDeviceType.ZKTimeDevice: return new SDKHelper(dashboard);
                case FPDeviceType.FDKAttendDevice: return new FDKHelper(dashboard);
                default: return new SDKHelper(dashboard);
                    //default: throw new ArgumentException("Invalid type", "type");
            }
        }
    }


    public class SDKHelper : IFPDevice
    {
        #region Fields
        public zkemkeeper.CZKEMClass axCZKEM1;
        public NewDeviceVm _DeviceVm { get; set; }

        public DeviceMethodHlper deviceMethodHlper { get; set; }
        #endregion

        #region ctor
        public SDKHelper(NewDeviceVm device)
        {
            axCZKEM1 = new zkemkeeper.CZKEMClass();
            deviceMethodHlper = new DeviceMethodHlper();
            this._DeviceVm = device;
            _DeviceVm.IsConected = false;
            //برای اتصال اتوماتیک به دستگاه
            //sta_ConnectTCP();
        }
        #endregion

        #region Insert Data Into Database

        public DataModelResult AttLog_Save(TimeRecordVm entity)
        {
            try
            {
                //if (Properties.Settings.Default.AutoSaveAttendance)
                    //deviceMethodHlper.ExecuteSqlScript(MakeCommand(entity));
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
            return new DataModelResult();
        }

        public void Run_ImportAttLogFromDevice()
        {
            try
            {
                Run_ImportAttLogFromDeviceFirstway();
            }
            catch { }
        }
        /// <summary>
        /// روش اول چک کردن شماره سریال. با شماره سریال ثبت شده در بخش مدیریت دستگاه ها
        /// </summary>
        public void Run_ImportAttLogFromDeviceFirstway()
        {
            try
            {
                //if (CurrentUser.CurrentUserS.applicationConfiguration.CheckSNeumber == "1" && string.IsNullOrEmpty(_DeviceVm.SerialNumber))
                //{
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotNotDefined, _DeviceVm.Name, _DeviceVm.Code) });
                //    return;
                //}
                if (sta_ConnectTCP() == 1)
                {
                    if (string.IsNullOrEmpty(_DeviceVm.SerialNumber))// اگر شماره سریال ثبت نشده باشد عملیات تخلیه را انجام میدهد
                        ImportAttLogFromDevice();
                    else
                    {//اگر شماره سریال دستگاه ثبت شده باشد
                        if (string.IsNullOrEmpty(_DeviceVm.deviceHardwareInfo.sSN))
                        {// اگر شماره سریال دستگاه دریافت نشده باشد آن را دریافت میکند و بعد از چک کردن عملیات تخلیه را انجام میدهد
                            if (sta_GetSeialNumber() == 1)
                                if (_DeviceVm.SerialNumber == _DeviceVm.deviceHardwareInfo.sSN)
                                {
                                    ImportAttLogFromDevice();
                                }
                                else
                                {
                                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                                }
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotLoaded, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }

                        }
                        else
                        {
                            if (_DeviceVm.deviceHardwareInfo.sSN == _DeviceVm.SerialNumber)
                                ImportAttLogFromDevice();
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }

        private void ImportAttLogFromDevice()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _daycount = Math.Abs(FingerPrintDeviceService.SaveDatePerDayAgo);
                    if (_daycount > 0)
                    {
                        var _res = sta_ImportLogByPeriod();
                    }
                    else
                    {
                        var _res = sta_ImportAttLog();
                    }
                }
                else
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "ارتباط با دستگاه : " + _DeviceVm.Name + " برقرار نیست  " });
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }









        /// <summary>
        /// دریافت تمامی لاگ های دستگاه
        /// </summary>
        public void Run_ImportAllAttLogFromDevice()
        {
            try
            {
                Run_ImportAllAttLogFromDeviceFirstway();
            }
            catch { }
        }
        /// <summary>
        /// روش اول چک کردن شماره سریال. با شماره سریال ثبت شده در بخش مدیریت دستگاه ها
        /// </summary>
        public void Run_ImportAllAttLogFromDeviceFirstway()
        {
            try
            {
                //if (CurrentUser.CurrentUserS.applicationConfiguration.CheckSNeumber == "1" && string.IsNullOrEmpty(_DeviceVm.SerialNumber))
                //{
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotNotDefined, _DeviceVm.Name, _DeviceVm.Code) });
                //    return;
                //}
                if (sta_ConnectTCP() == 1)
                {
                    if (string.IsNullOrEmpty(_DeviceVm.SerialNumber))// اگر شماره سریال ثبت نشده باشد عملیات تخلیه را انجام میدهد
                        ImportAllAttLogFromDevice();
                    else
                    {//اگر شماره سریال دستگاه ثبت شده باشد
                        if (string.IsNullOrEmpty(_DeviceVm.deviceHardwareInfo.sSN))
                        {// اگر شماره سریال دستگاه دریافت نشده باشد آن را دریافت میکند و بعد از چک کردن عملیات تخلیه را انجام میدهد
                            if (sta_GetSeialNumber() == 1)
                                if (_DeviceVm.SerialNumber == _DeviceVm.deviceHardwareInfo.sSN)
                                {
                                    ImportAllAttLogFromDevice();
                                }
                                else
                                {
                                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                                }
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotLoaded, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }

                        }
                        else
                        {
                            if (_DeviceVm.deviceHardwareInfo.sSN == _DeviceVm.SerialNumber)
                                ImportAllAttLogFromDevice();
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }

        private void ImportAllAttLogFromDevice()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _res = sta_ImportAttLog();
                }
                else
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "ارتباط با دستگاه : " + _DeviceVm.Name + " برقرار نیست  " });
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }


        #endregion

        #region Methods
        public int SetUserInfo(UserVm user)
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                if (user == null || user.UserId == null || user.UserId == 0)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.InputData });
                    return -1023;
                }



                int iPrivilege = user.Previlige != null ? user.Previlige.Value : 0;

                bool bFlag = false;
                if (iPrivilege == 5)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*نقش کاربر با خطا مواجه شد! لطفا دوباره تلاش نمایید!" });
                    return -1023;
                }

                int iPIN2Width = 0;
                int iIsABCPinEnable = 0;
                int iT9FunOn = 0;
                string strTemp = "";
                axCZKEM1.GetSysOption(GetMachineNumber(), "~PIN2Width", out strTemp);
                iPIN2Width = Convert.ToInt32(strTemp);
                axCZKEM1.GetSysOption(GetMachineNumber(), "~IsABCPinEnable", out strTemp);
                iIsABCPinEnable = Convert.ToInt32(strTemp);
                axCZKEM1.GetSysOption(GetMachineNumber(), "~T9FunOn", out strTemp);
                iT9FunOn = Convert.ToInt32(strTemp);

                if (user.UserId.ToString().Length > iPIN2Width)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*User ID error! The max length is " + iPIN2Width.ToString() });
                    return -1022;
                }


                if (iIsABCPinEnable == 0 || iT9FunOn == 0)
                {
                    if (user.UserId.ToString().Substring(0, 1) == "0")
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*User ID error! The first letter can not be as 0" });
                        return -1022;
                    }

                    foreach (char tempchar in user.UserId.ToString().ToCharArray())
                    {
                        if (!(char.IsDigit(tempchar)))
                        {
                            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*User ID error! User ID only support digital" });
                            return -1022;
                        }
                    }
                }

                int idwErrorCode = 0;
                string sdwEnrollNumber = user.UserId.ToString().Trim();
                string sName = user.Name.Trim();
                string sCardnumber = user.EmployeeID.Trim();
                string sPassword = user.Password.Trim();
                int iFaceIndex = 50;

                bool bEnabled = true;
                /*if (iPrivilege == 4)
                {
                    bEnabled = false;
                    iPrivilege = 0;
                }
                else
                {
                    bEnabled = true;
                }*/

                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, false);
                axCZKEM1.SetStrCardNumber(sCardnumber);//Before you using function SetUserInfo,set the card number to make sure you can upload it to the device
                if (axCZKEM1.SSR_SetUserInfo(_DeviceVm.iMachineNumber, sdwEnrollNumber, sName, sPassword, iPrivilege, bEnabled))//upload the user's information(card number included)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "ذخیره اطلاعات کاربر " + user.FirstName + " با موفقیت انجام شد" });


                    if (!string.IsNullOrEmpty(user.FaceImage))
                    {
                        var faceimage = CnvertStrToImage(user.FaceImage);
                        if (faceimage.Length > 0)
                        {
                            var iLength = faceimage.Length;
                            //ذخیره تصویر چهره کاربر
                            axCZKEM1.SetUserFaceStr(_DeviceVm.iMachineNumber, sdwEnrollNumber, iFaceIndex, user.FaceImage, iLength);
                        }
                    }
                    //ذخیره اثر انگشتد های کاربر
                    if (user.FingerPrints != null && user.FingerPrints.Count > 0)
                    {
                        foreach (var item in user.FingerPrints)
                        {
                            axCZKEM1.SetUserTmpExStr(_DeviceVm.iMachineNumber, sdwEnrollNumber, item.FINGERID, item.Flag != null ? item.Flag.Value : 0, item.FingerVal);
                        }
                    }

                }
                else
                {
                    axCZKEM1.GetLastError(ref idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + idwErrorCode.ToString() });

                }



                axCZKEM1.RefreshData(_DeviceVm.iMachineNumber);//the data in the device should be refreshed
                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, true);


                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        private byte[] CnvertStrToImage(string value)
        {
            try
            {
                if (!string.IsNullOrEmpty(value))
                {
                    byte[] data = Convert.FromBase64String(value);
                    //using (var stream = new MemoryStream(data, 0, data.Length))
                    //{
                    //    Image image = Image.FromStream(stream);
                    //    //TODO: do something with image
                    //}
                    return data;
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
            return new byte[0];
        }
        #endregion

        #region UserBioTypeClass

        private SupportBiometricType _supportBiometricType = new SupportBiometricType();
        public class SupportBiometricType
        {
            public bool fp_available { get; set; }
            public bool face_available { get; set; }
            public bool fingerVein_available { get; set; }
            public bool palm_available { get; set; }
        }

        #endregion

        #region ConnectDevice

        public bool GetConnectState()
        {
            return _DeviceVm.IsConected;
        }

        public void SetConnectState(bool state)
        {
            _DeviceVm.IsConected = state;
            //connected = state;
        }

        public int GetMachineNumber()
        {
            return _DeviceVm.iMachineNumber;
        }

        /// <summary>
        /// برقراری ارتباط با دستگاه
        /// </summary>
        /// <returns></returns>
        public int sta_ConnectTCP()
        {
            try
            {
                if (!PingDevice())
                {
                    SetConnectState(false);
                    return -1;
                }
                if (GetConnectState()) return 1;

                if (_DeviceVm == null || string.IsNullOrEmpty(_DeviceVm.IP) || _DeviceVm.port == null)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*نام، آی پی یا پورت اشتباه می باشد !", DeviceId = _DeviceVm.idn });
                    return -1;// ip or port is null
                }

                if (_DeviceVm.port <= 0 || _DeviceVm.port > 65535)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*پورت اشتباه است!" });
                    return -1;
                }

                if (Convert.ToInt32(_DeviceVm.CommonKey) < 0 || Convert.ToInt32(_DeviceVm.CommonKey) > 999999)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.CommKeyIllegal, DeviceId = _DeviceVm.idn });
                    return -1;
                }

                int idwErrorCode = 0;

                axCZKEM1.SetCommPassword(Convert.ToInt32(_DeviceVm.CommonKey));


                for (int index = 0; index < 3; index++)
                {
                    if (axCZKEM1.Connect_Net(_DeviceVm.IP, _DeviceVm.port.Value) == true)
                    {
                        SetConnectState(true);
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "ارتباط برقرار شد. نام دستگاه: " + _DeviceVm.Name + "   کد دستگاه : " + _DeviceVm.Code, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                        sta_RegRealTime();
                        //sta_getBiometricType();
                        return 1;
                    }
                }
                axCZKEM1.GetLastError(ref idwErrorCode);
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.UnableConnectDevice, _DeviceVm.Name) + idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                return idwErrorCode;

            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1;
            }
        }
        public bool PingDevice()
        {
            try
            {
                int timeout = 1200;
                using (var ping = new Ping())
                {
                    for (int index = 0; index < 5; index++)
                    {
                        var reply = ping.Send(IPAddress.Parse(_DeviceVm.IP), timeout);
                        if (reply.Status == IPStatus.Success)
                        {
                            return true;
                        }
                    }
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + $"دستگاه:  {_DeviceVm.Name} پینگ نشد", DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                    SetConnectState(false);
                    return false;
                }
            }
            catch (Exception ex)
            {
                SetConnectState(false);
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "شبکه یافت نشد" });
                return false;
            }
        }
        public int sta_GetDeviceInfo(out string sFirmver, out string sMac, out string sPlatform, out string sSN, out string sProductTime, out string sDeviceName, out int iFPAlg, out int iFaceAlg, out string sProducter)
        {
            try
            {
                int iRet = 0;

                sFirmver = "";
                sMac = "";
                sPlatform = "";
                sSN = "";
                sProducter = "";
                sDeviceName = "";
                iFPAlg = 0;
                iFaceAlg = 0;
                sProductTime = "";
                string strTemp = "";

                if (!PingDevice())
                {
                    SetConnectState(false);
                    return -1024;
                }
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn });
                    return -1024;
                }


                axCZKEM1.EnableDevice(GetMachineNumber(), false);//disable the device

                axCZKEM1.GetSysOption(GetMachineNumber(), "~ZKFPVersion", out strTemp);
                iFPAlg = Convert.ToInt32(strTemp);

                axCZKEM1.GetSysOption(GetMachineNumber(), "ZKFaceVersion", out strTemp);
                iFaceAlg = Convert.ToInt32(strTemp);



                axCZKEM1.GetVendor(ref sProducter);
                axCZKEM1.GetProductCode(GetMachineNumber(), out sDeviceName);
                axCZKEM1.GetDeviceMAC(GetMachineNumber(), ref sMac);
                axCZKEM1.GetFirmwareVersion(GetMachineNumber(), ref sFirmver);


                axCZKEM1.GetPlatform(GetMachineNumber(), ref sPlatform);
                axCZKEM1.GetSerialNumber(GetMachineNumber(), out sSN);
                axCZKEM1.GetDeviceStrInfo(GetMachineNumber(), 1, out sProductTime);

                axCZKEM1.EnableDevice(GetMachineNumber(), true);//enable the device

                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "اطلاعات با موفقیت دریافت شد", DeviceId = _DeviceVm.idn });


                iRet = 1;
                return iRet;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                sFirmver = null;
                sMac = null;
                sPlatform = null;
                sSN = null;
                sProductTime = null;
                sDeviceName = null;
                iFPAlg = 0;
                iFaceAlg = 0;
                sProducter = null;
                return -1024;
            }
        }
        public int sta_GetCapacityInfo(out int adminCnt, out int userCount, out int fpCnt, out int recordCnt, out int pwdCnt, out int oplogCnt, out int faceCnt)
        {
            int ret = 0;

            adminCnt = 0;
            userCount = 0;
            fpCnt = 0;
            recordCnt = 0;
            pwdCnt = 0;
            oplogCnt = 0;
            faceCnt = 0;

            if (!PingDevice())
            {
                SetConnectState(false);
                return -1024;
            }
            if (GetConnectState() == false)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn });
                return -1024;
            }


            axCZKEM1.EnableDevice(GetMachineNumber(), false);//disable the device

            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 2, ref userCount);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 1, ref adminCnt);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 3, ref fpCnt);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 4, ref pwdCnt);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 5, ref oplogCnt);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 6, ref recordCnt);
            axCZKEM1.GetDeviceStatus(GetMachineNumber(), 21, ref faceCnt);

            axCZKEM1.EnableDevice(GetMachineNumber(), true);//enable the device

            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "دریافت اطلاعات دستگاه با موفقیت انجام شد" });


            ret = 1;
            return ret;
        }
        public int sta_GetSeialNumber()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _serialNumber = "";
                    axCZKEM1.GetSerialNumber(GetMachineNumber(), out _serialNumber);
                    _DeviceVm.deviceHardwareInfo.sSN = _serialNumber;
                    return 1;
                }
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ex.Message });
            }
            return 1024;
        }
        public void sta_DisConnect()
        {
            try
            {
                if (PingDevice())
                    if (GetConnectState() == true)
                    {
                        axCZKEM1.Disconnect();
                        sta_UnRegRealTime();
                    }
                _DeviceVm.IsConected = false;
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "* ارتباط با دستگاه " + _DeviceVm.Name + " قطع شد.", DeviceId = _DeviceVm.idn, DeviceName = _DeviceVm.Name, ModifiedDate = DateTime.Now });
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }

        #endregion

        #region RealTimeEvent

        public void sta_UnRegRealTime()
        {
            this.axCZKEM1.OnFinger -= new zkemkeeper._IZKEMEvents_OnFingerEventHandler(axCZKEM1_OnFinger);
            this.axCZKEM1.OnVerify -= new zkemkeeper._IZKEMEvents_OnVerifyEventHandler(axCZKEM1_OnVerify);
            this.axCZKEM1.OnAttTransactionEx -= new zkemkeeper._IZKEMEvents_OnAttTransactionExEventHandler(axCZKEM1_OnAttTransactionEx);
            this.axCZKEM1.OnFingerFeature -= new zkemkeeper._IZKEMEvents_OnFingerFeatureEventHandler(axCZKEM1_OnFingerFeature);
            this.axCZKEM1.OnDeleteTemplate -= new zkemkeeper._IZKEMEvents_OnDeleteTemplateEventHandler(axCZKEM1_OnDeleteTemplate);
            this.axCZKEM1.OnNewUser -= new zkemkeeper._IZKEMEvents_OnNewUserEventHandler(axCZKEM1_OnNewUser);
            this.axCZKEM1.OnHIDNum -= new zkemkeeper._IZKEMEvents_OnHIDNumEventHandler(axCZKEM1_OnHIDNum);
            this.axCZKEM1.OnAlarm -= new zkemkeeper._IZKEMEvents_OnAlarmEventHandler(axCZKEM1_OnAlarm);
            this.axCZKEM1.OnDoor -= new zkemkeeper._IZKEMEvents_OnDoorEventHandler(axCZKEM1_OnDoor);
            this.axCZKEM1.OnEnrollFingerEx -= new zkemkeeper._IZKEMEvents_OnEnrollFingerExEventHandler(axCZKEM1_OnEnrollFingerEx);
            this.axCZKEM1.OnWriteCard += new zkemkeeper._IZKEMEvents_OnWriteCardEventHandler(axCZKEM1_OnWriteCard);
            this.axCZKEM1.OnEmptyCard += new zkemkeeper._IZKEMEvents_OnEmptyCardEventHandler(axCZKEM1_OnEmptyCard);
            this.axCZKEM1.OnHIDNum += new zkemkeeper._IZKEMEvents_OnHIDNumEventHandler(axCZKEM1_OnHIDNum);
            this.axCZKEM1.OnAttTransaction -= new zkemkeeper._IZKEMEvents_OnAttTransactionEventHandler(axCZKEM1_OnAttTransaction);
            this.axCZKEM1.OnKeyPress += new zkemkeeper._IZKEMEvents_OnKeyPressEventHandler(axCZKEM1_OnKeyPress);
            this.axCZKEM1.OnEnrollFinger += new zkemkeeper._IZKEMEvents_OnEnrollFingerEventHandler(axCZKEM1_OnEnrollFinger);

        }

        public int sta_RegRealTime()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });


                    return -1024;
                }

                int ret = 0;

                if (axCZKEM1.RegEvent(GetMachineNumber(), 65535))//Here you can register the realtime events that you want to be triggered(the parameters 65535 means registering all)
                {
                    //common interface
                    this.axCZKEM1.OnFinger += new zkemkeeper._IZKEMEvents_OnFingerEventHandler(axCZKEM1_OnFinger);
                    this.axCZKEM1.OnVerify += new zkemkeeper._IZKEMEvents_OnVerifyEventHandler(axCZKEM1_OnVerify);
                    this.axCZKEM1.OnFingerFeature += new zkemkeeper._IZKEMEvents_OnFingerFeatureEventHandler(axCZKEM1_OnFingerFeature);
                    this.axCZKEM1.OnDeleteTemplate += new zkemkeeper._IZKEMEvents_OnDeleteTemplateEventHandler(axCZKEM1_OnDeleteTemplate);
                    this.axCZKEM1.OnNewUser += new zkemkeeper._IZKEMEvents_OnNewUserEventHandler(axCZKEM1_OnNewUser);
                    this.axCZKEM1.OnHIDNum += new zkemkeeper._IZKEMEvents_OnHIDNumEventHandler(axCZKEM1_OnHIDNum);
                    this.axCZKEM1.OnAlarm += new zkemkeeper._IZKEMEvents_OnAlarmEventHandler(axCZKEM1_OnAlarm);
                    this.axCZKEM1.OnDoor += new zkemkeeper._IZKEMEvents_OnDoorEventHandler(axCZKEM1_OnDoor);

                    //only for color device
                    this.axCZKEM1.OnAttTransactionEx += new zkemkeeper._IZKEMEvents_OnAttTransactionExEventHandler(axCZKEM1_OnAttTransactionEx);
                    this.axCZKEM1.OnEnrollFingerEx += new zkemkeeper._IZKEMEvents_OnEnrollFingerExEventHandler(axCZKEM1_OnEnrollFingerEx);

                    //only for black&white device
                    this.axCZKEM1.OnAttTransaction -= new zkemkeeper._IZKEMEvents_OnAttTransactionEventHandler(axCZKEM1_OnAttTransaction);
                    this.axCZKEM1.OnWriteCard += new zkemkeeper._IZKEMEvents_OnWriteCardEventHandler(axCZKEM1_OnWriteCard);
                    this.axCZKEM1.OnEmptyCard += new zkemkeeper._IZKEMEvents_OnEmptyCardEventHandler(axCZKEM1_OnEmptyCard);
                    this.axCZKEM1.OnKeyPress += new zkemkeeper._IZKEMEvents_OnKeyPressEventHandler(axCZKEM1_OnKeyPress);
                    this.axCZKEM1.OnEnrollFinger += new zkemkeeper._IZKEMEvents_OnEnrollFingerEventHandler(axCZKEM1_OnEnrollFinger);


                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    ret = _DeviceVm.idwErrorCode;

                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*خطایی رخ داد, کد خطا: " + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn });

                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code), DeviceId = _DeviceVm.idn });

                    }
                }
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        //When you are enrolling your finger,this event will be triggered.
        void axCZKEM1_OnEnrollFingerEx(string EnrollNumber, int FingerIndex, int ActionResult, int TemplateLength)
        {
            try
            {
                if (ActionResult == 0)
                {
                    //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Enroll finger succeed. UserID=" + EnrollNumber.ToString() + "...FingerIndex=" + FingerIndex.ToString() });
                }
                else
                {
                    //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Enroll finger failed. Result=" + ActionResult.ToString() });
                }
                throw new NotImplementedException();
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }

        //Door sensor event
        void axCZKEM1_OnDoor(int EventType)
        {
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Door opened" + "...EventType=" + EventType.ToString() });

            throw new NotImplementedException();
        }

        //When the dismantling machine or duress alarm occurs, trigger this event.
        void axCZKEM1_OnAlarm(int AlarmType, int EnrollNumber, int Verified)
        {
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Alarm triggered" + "...AlarmType=" + AlarmType.ToString() + "...EnrollNumber=" + EnrollNumber.ToString() + "...Verified=" + Verified.ToString() });

            throw new NotImplementedException();
        }

        //When you swipe a card to the device, this event will be triggered to show you the card number.
        void axCZKEM1_OnHIDNum(int CardNumber)
        {
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Card event" + "...Cardnumber=" + CardNumber.ToString() });

            throw new NotImplementedException();
        }

        //When you have enrolled a new user,this event will be triggered.
        void axCZKEM1_OnNewUser(int EnrollNumber)
        {
            //onMessage("message");
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Enroll a　new user" + "...UserID=" + EnrollNumber.ToString() });

            throw new NotImplementedException();
        }

        //When you have deleted one one fingerprint template,this event will be triggered.
        void axCZKEM1_OnDeleteTemplate(int EnrollNumber, int FingerIndex)
        {
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Delete a finger template" + "...UserID=" + EnrollNumber.ToString() + "..FingerIndex=" + FingerIndex.ToString() });

            throw new NotImplementedException();
        }

        //When you have enrolled your finger,this event will be triggered and return the quality of the fingerprint you have enrolled
        void axCZKEM1_OnFingerFeature(int Score)
        {
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Press finger score=" + Score.ToString() });

            throw new NotImplementedException();
        }

        //If your fingerprint(or your card) passes the verification,this event will be triggered,only for color device
        void axCZKEM1_OnAttTransactionEx(string EnrollNumber, int IsInValid, int AttState, int VerifyMethod, int Year, int Month, int Day, int Hour, int Minute, int Second, int WorkCode)
        {
            var _res = new TimeRecordVm
            {
                CardNo = EnrollNumber.ToString(),
                Day = Day,
                Hour = Hour,
                Minute = Minute,
                Month = Month,
                Year = Year,
                DatetimeIO = new DateTime(Year, Month, Day, Hour, Minute, 0),
                DeviceCode = _DeviceVm.Code,
                VerifyMethod = VerifyMethod,
                WorkCode = WorkCode,
            };
            try
            {
                AttLog_Save(_res);
            }
            catch (Exception ex)
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = ex.Message });
            }

            string time = Year + "-" + Month + "-" + Day + " " + Hour + ":" + Minute + ":" + Second;

            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "اعتبار سنجی انجام شد. کد کابر =" + EnrollNumber + " اعتبارسنجی =" + IsInValid.ToString() + " حالت =" + AttState.ToString() + "  نوع اعتبار سنجی =" + VerifyMethod.ToString() + " زمان =" + time });

            throw new NotImplementedException();
        }

        //If your fingerprint(or your card) passes the verification,this event will be triggered,only for black%white device
        private void axCZKEM1_OnAttTransaction(int EnrollNumber, int IsInValid, int AttState, int VerifyMethod, int Year, int Month, int Day, int Hour, int Minute, int Second)
        {
            var _res = new TimeRecordVm
            {
                CardNo = EnrollNumber.ToString(),
                Day = Day,
                Hour = Hour,
                Minute = Minute,
                Month = Month,
                Year = Year,
                DatetimeIO = new DateTime(Year, Month, Day, Hour, Minute, 0),
                DeviceCode = _DeviceVm.Code,
                VerifyMethod = VerifyMethod,

            };
            try
            {
                AttLog_Save(_res);
            }
            catch (Exception ex)
            {
                // Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = ex.Message });
            }

            string time = Year + "-" + Month + "-" + Day + " " + Hour + ":" + Minute + ":" + Second;
            //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Verify OK.UserID=" + EnrollNumber.ToString() + " isInvalid=" + IsInValid.ToString() + " state=" + AttState.ToString() + " verifystyle=" + VerifyMethod.ToString() + " time=" + time });

            throw new NotImplementedException();
        }

        //After you have placed your finger on the sensor(or swipe your card to the device),this event will be triggered.
        //If you passes the verification,the returned value userid will be the user enrollnumber,or else the value will be -1;
        void axCZKEM1_OnVerify(int UserID)
        {
            if (UserID != -1)
            {
                // Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "User fingerprint verified... UserID=" + UserID.ToString() });
            }
            else
            {
                // Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Failed to verify... " });
            }

            throw new NotImplementedException();
        }

        //When you place your finger on sensor of the device,this event will be triggered
        void axCZKEM1_OnFinger()
        {
            // Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "OnFinger event " });

            throw new NotImplementedException();
        }

        //When you have written into the Mifare card ,this event will be triggered.
        void axCZKEM1_OnWriteCard(int iEnrollNumber, int iActionResult, int iLength)
        {
            if (iActionResult == 0)
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Write Mifare Card OK" + "...EnrollNumber=" + iEnrollNumber.ToString() + "...TmpLength=" + iLength.ToString() });
            }
            else
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "...Write Failed" });
            }
        }

        //When you have emptyed the Mifare card,this event will be triggered.
        void axCZKEM1_OnEmptyCard(int iActionResult)
        {
            if (iActionResult == 0)
            {
                // Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Empty Mifare Card OK..." });
            }
            else
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Empty Failed..." });
            }
        }

        //When you press the keypad,this event will be triggered.
        void axCZKEM1_OnKeyPress(int iKey)
        {
            try
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "RTEvent OnKeyPress Has been Triggered, Key: " + iKey.ToString() });
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }

        //When you are enrolling your finger,this event will be triggered.
        void axCZKEM1_OnEnrollFinger(int EnrollNumber, int FingerIndex, int ActionResult, int TemplateLength)
        {
            if (ActionResult == 0)
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Enroll finger succeed. UserID=" + EnrollNumber + "...FingerIndex=" + FingerIndex.ToString() });
            }
            else
            {
                //Terminal.RealTimeEventLog(new DeviceEventLogVm { LogData = "Enroll finger failed. Result=" + ActionResult.ToString() });
            }
            throw new NotImplementedException();
        }

        #endregion

        #region UserMng

        #region UserInfo
        public List<UserVm> sta_GetAllUserFPInfo()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });

                    return new List<UserVm>();
                }

                var _userList = new List<UserVm>();


                string sEnrollNumber = "";
                bool bEnabled = false;
                string sName = "";
                string sPassword = "";
                int iPrivilege = 0;
                string sFPTmpData = "";
                string sCardnumber = "";
                int idwFingerIndex = 0;
                int iFlag = 0;
                int iFPTmpLength = 0;
                //int i = 0;
                int num = 0;
                int iFpCount = 0;
                //int xx = 1;
                int iFaceIndex = 50;
                string sTmpData = "";
                int iLength = 0;


                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, false);
                axCZKEM1.ReadAllUserID(_DeviceVm.iMachineNumber);
                axCZKEM1.ReadAllTemplate(_DeviceVm.iMachineNumber);
                while (axCZKEM1.SSR_GetAllUserInfo(_DeviceVm.iMachineNumber, out sEnrollNumber, out sName, out sPassword, out iPrivilege, out bEnabled))//get all the users' information from the memory
                {
                    axCZKEM1.GetStrCardNumber(out sCardnumber);

                    var _userItem = new UserVm();
                    _userItem.FingerPrints = new List<FingerTemplate>();
                    _userItem.UserId = Convert.ToInt32(sEnrollNumber);

                    string[] _fullname = ConvertToArabic(sName).Split(' ');
                    _userItem.Name = _fullname[0];
                    int _index = 0;
                    foreach (var item in _fullname)
                    {
                        if (!string.IsNullOrEmpty(item))
                        {
                            if (_index == 0)
                            {
                                _index++; continue;
                            }
                            _userItem.Family += item + " ";
                        }
                    }

                    _userItem.EmployeeID = sCardnumber;
                    _userItem.Password = sPassword;
                    _userItem.DeviceId = _DeviceVm.Code != null ? _DeviceVm.Code.Value : 0;


                    //i = 0;
                    //xx = 1;
                    for (idwFingerIndex = 0; idwFingerIndex < 10; idwFingerIndex++)
                    {
                        if (axCZKEM1.GetUserTmpExStr(_DeviceVm.iMachineNumber, sEnrollNumber, idwFingerIndex, out iFlag, out sFPTmpData, out iFPTmpLength))//get the corresponding templates string and length from the memory
                        {
                            //if (xx == 1)
                            //{
                            var _userFinger = new FingerTemplate();
                            _userFinger.PubUser_Id = Convert.ToInt32(sEnrollNumber);
                            _userFinger.FingerVal = sFPTmpData;
                            _userFinger.Flag = (short)iFlag;
                            _userFinger.FINGERID = idwFingerIndex;
                            _userItem.FingerPrints.Add(_userFinger);
                            //}
                            //xx = 0;
                            iFpCount++;
                        }
                        //else
                        //{
                        //    //i++;
                        //}
                    }


                    if (axCZKEM1.GetUserFaceStr(_DeviceVm.iMachineNumber, sEnrollNumber, iFaceIndex, ref sTmpData, ref iLength))//get the face templates from the memory
                    {
                        _userItem.FaceImage = sTmpData;
                    }
                    _userItem.Previlige = iPrivilege;

                    num++;

                    _userList.Add(_userItem);
                }
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تعداد کاربران دریافت شده : " + num.ToString() + " ,  تعداد اثر انگشت ها : " + iFpCount.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, true);
                return _userList;
            }
            catch (Exception ex)
            {
                //// Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return new List<UserVm>();
            }
        }
        public string ConvertToArabic(string value)
        {
            try
            {
                //way 7
                byte[] utf8Bytes = new byte[value.Length];
                for (int i = 0; i < value.Length; ++i)
                {
                    utf8Bytes[i] = (byte)value[i];
                }
                var result = Encoding.Default.GetString(utf8Bytes, 0, utf8Bytes.Length);
                return result;
            }
            catch (Exception ex)
            {
                return value;
            }
        }
        public int sta_SetUserInfo(UserVm value)
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });

                    return -1024;
                }
                if (value.UserId == null || value.Previlige == null)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.InputData });

                    return -1023;
                }



                int iPrivilege = value.Previlige.Value;

                if (iPrivilege == 5)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*نقش انتخابی کاربر اشتباه است!" });

                    return -1023;
                }


                int iPIN2Width = 0;
                int iIsABCPinEnable = 0;
                int iT9FunOn = 0;
                string strTemp = "";
                axCZKEM1.GetSysOption(GetMachineNumber(), "~PIN2Width", out strTemp);
                iPIN2Width = Convert.ToInt32(strTemp);
                axCZKEM1.GetSysOption(GetMachineNumber(), "~IsABCPinEnable", out strTemp);
                iIsABCPinEnable = Convert.ToInt32(strTemp);
                axCZKEM1.GetSysOption(GetMachineNumber(), "~T9FunOn", out strTemp);
                iT9FunOn = Convert.ToInt32(strTemp);

                if (value.UserId.ToString().Length > iPIN2Width)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*خطا در کد کاربر! حداکثر طول کد برابر : " + iPIN2Width.ToString() });

                    return -1022;
                }


                if (iIsABCPinEnable == 0 || iT9FunOn == 0)
                {
                    if (value.UserId.ToString().Substring(0, 1) == "0")
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*خطا در کد کاربر! اولین کاراکتر نمیتواند 0 باشد" });
                        return -1022;
                    }


                    foreach (char tempchar in value.UserId.ToString().ToCharArray())
                    {
                        if (!(char.IsDigit(tempchar)))
                        {
                            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*خطا در کد کاربر! کد کاربر فقط باید شامل عدد باشد" });
                            return -1022;
                        }
                    }
                }

                int idwErrorCode = 0;
                string sdwEnrollNumber = value.UserId.ToString().Trim();
                string sName = value.Name + " " + value.Family;
                string sCardnumber = value.EmployeeID;
                string sPassword = value.Password;

                bool bEnabled = true;

                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, false);
                axCZKEM1.SetStrCardNumber(sCardnumber);
                if (axCZKEM1.SSR_SetUserInfo(_DeviceVm.iMachineNumber, sdwEnrollNumber, sName, sPassword, iPrivilege, bEnabled))
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "اطلاعات کاربر با موفقیت ذخیره شد" });
                }
                else
                {
                    axCZKEM1.GetLastError(ref idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + idwErrorCode.ToString() });
                }



                axCZKEM1.RefreshData(_DeviceVm.iMachineNumber);
                axCZKEM1.EnableDevice(_DeviceVm.iMachineNumber, true);


                return 1;
            }
            catch (Exception ex)
            {
                //// Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        #endregion

        #region UserBio
        private string sta_getSysOptions(string option)
        {
            try
            {
                string value = string.Empty;
                axCZKEM1.GetSysOption(_DeviceVm.iMachineNumber, option, out value);
                return value;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return "";
            }
        }
        public void sta_getBiometricType()
        {
            try
            {
                string result = string.Empty;
                result = sta_getSysOptions("BiometricType");
                if (!string.IsNullOrEmpty(result))
                {
                    _supportBiometricType.fp_available = result[1] == '1';
                    _supportBiometricType.face_available = result[2] == '1';
                    if (result.Length >= 9)
                    {
                        _supportBiometricType.fingerVein_available = result[7] == '1';
                        _supportBiometricType.palm_available = result[8] == '1';
                    }
                }
                _DeviceVm.BiometricType = result;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        #endregion

        #endregion

        #region PersonalizeMng
        //private void getShortkeyName(string shortkeyList, ComboBox cb_stKey)
        //{
        //    try
        //    {
        //        int tmpIndex = 0;
        //        string shortkeyName = "";

        //        tmpIndex = shortkeyList.IndexOf("\r\n", 1);
        //        shortkeyName = shortkeyList.Substring(0, tmpIndex);
        //        shortkeyList = shortkeyList.Substring(tmpIndex + 2);

        //        cb_stKey.Items.Add(shortkeyName);

        //        if (shortkeyList.Length > 2)
        //            getShortkeyName(shortkeyList, cb_stKey);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
        //    }
        //}
        //private void getFuncName(string funcList, ComboBox cb_function)
        //{
        //    try
        //    {
        //        int tmpIndex1 = 0;
        //        int tmpIndex2 = 0;
        //        string funcName = "";
        //        int funcID = 0;

        //        //tmpIndex1 = shortkeyList.IndexOf("\r\n", 1);
        //        //tmpIndex2 = shortkeyList.IndexOf(",", 1);
        //        //funcID = Convert.ToInt32(shortkeyList.Substring(0, tmpIndex2));
        //        //funcName = shortkeyList.Substring(tmpIndex2 + 1, tmpIndex1 - tmpIndex2 - 1);
        //        //shortkeyList = shortkeyList.Substring(tmpIndex1 + 2);

        //        tmpIndex1 = funcList.IndexOf("\r\n", 1);
        //        tmpIndex2 = funcList.IndexOf(",", 1);
        //        funcName = funcList.Substring(tmpIndex2 + 1, tmpIndex1 - tmpIndex2 - 1);
        //        funcList = funcList.Substring(tmpIndex1 + 2);

        //        cb_function.Items.Add(funcName);

        //        if (funcList.Length > 2)
        //            getFuncName(funcList, cb_function);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
        //    }
        //}
        #endregion

        #region DataMng


        #region  AttLogMng
        public int sta_ImportAttLog()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }




                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);//disable the device

                string sdwEnrollNumber = "";
                int idwVerifyMode = 0;
                int idwInOutMode = 0;
                int idwYear = 0;
                int idwMonth = 0;
                int idwDay = 0;
                int idwHour = 0;
                int idwMinute = 0;
                int idwSecond = 0;
                int idwWorkcode = 0;

                if (axCZKEM1.ReadGeneralLogData(GetMachineNumber()))
                {
                    var _attList = new List<TimeRecordVm>();
                    while (axCZKEM1.SSR_GetGeneralLogData(GetMachineNumber(), out sdwEnrollNumber, out idwVerifyMode,
                                out idwInOutMode, out idwYear, out idwMonth, out idwDay, out idwHour, out idwMinute, out idwSecond, ref idwWorkcode))//get records from the memory
                    {
                        var _value = new TimeRecordVm
                        {
                            DeviceCode = _DeviceVm.Code,
                            CardNo = sdwEnrollNumber,
                            Day = idwDay,
                            Hour = idwHour,
                            Minute = idwMinute,
                            Month = idwMonth,
                            Year = idwYear,
                            AttStatus = idwInOutMode,
                            VerifyMethod = idwVerifyMode,
                            DatetimeIO = new DateTime(idwYear, idwMonth, idwDay, idwHour, idwMinute, 0)
                        };

                        _attList.Add(_value);
                    }
                    if (_attList != null && _attList.Count() > 0)
                    {
                        InsertAttLogToDB(_attList);
                        _DeviceVm.LastImportLogCount = _attList.Count;
                        UpdateLastTimeRecord(_attList.Count);

                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "- " + "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==>  تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                        //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                        //{
                        //    PublicMethod.SaveLogFile(_DeviceVm.Name, "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==>  تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                        //});
                    }
                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    ret = _DeviceVm.idwErrorCode;

                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*دریافت اطلاعات شکست خورد, ک خطا: " + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                        //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                        //{
                        //    //PublicMethod.SaveLogFile(_DeviceVm.Name, string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code) + "  ==>  زمان: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                        //});
                    }
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);//enable the device

                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_ImportLogByPeriod()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                    //{
                    //    PublicMethod.SaveLogFile(_DeviceVm.Name, PublicResource.ConnectDevice + "  ==>  زمان: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                    //});
                    return -1024;
                }



                var _daycount = Math.Abs(FingerPrintDeviceService.SaveDatePerDayAgo);
                _daycount = -1 * _daycount;
                var _fromTime = DateTime.Now.AddDays(_daycount);
                var _fromTimeStr = _fromTime.Year + "-"
                                    + (_fromTime.Month < 10 ? "0" + _fromTime.Month.ToString() : _fromTime.Month.ToString()) + "-"
                                    + (_fromTime.Day < 10 ? "0" + _fromTime.Day.ToString() : _fromTime.Day.ToString()) + " "
                                    + (_fromTime.Hour < 10 ? "0" + _fromTime.Hour.ToString() : _fromTime.Hour.ToString()) + ":"
                                    + (_fromTime.Minute < 10 ? "0" + _fromTime.Minute.ToString() : _fromTime.Minute.ToString()) + ":"
                                    + (_fromTime.Second < 10 ? "0" + _fromTime.Second.ToString() : _fromTime.Second.ToString());
                var _toTime = DateTime.Now;
                var _toTimeStr = _toTime.Year + "-"
                                    + (_toTime.Month < 10 ? "0" + _toTime.Month.ToString() : _toTime.Month.ToString()) + "-"
                                    + (_toTime.Day < 10 ? "0" + _toTime.Day.ToString() : _toTime.Day.ToString()) + " "
                                    + (_toTime.Hour < 10 ? "0" + _toTime.Hour.ToString() : _toTime.Hour.ToString()) + ":"
                                    + (_toTime.Minute < 10 ? "0" + _toTime.Minute.ToString() : _toTime.Minute.ToString()) + ":"
                                    + (_toTime.Second < 10 ? "0" + _toTime.Second.ToString() : _toTime.Second.ToString());


                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);//disable the device

                string sdwEnrollNumber = "";
                int idwVerifyMode = 0;
                int idwInOutMode = 0;
                int idwYear = 0;
                int idwMonth = 0;
                int idwDay = 0;
                int idwHour = 0;
                int idwMinute = 0;
                int idwSecond = 0;
                int idwWorkcode = 0;


                if (axCZKEM1.ReadTimeGLogData(GetMachineNumber(), _fromTimeStr, _toTimeStr))
                {
                    var _attList = new List<TimeRecordVm>();
                    while (axCZKEM1.SSR_GetGeneralLogData(GetMachineNumber(), out sdwEnrollNumber, out idwVerifyMode,
                                out idwInOutMode, out idwYear, out idwMonth, out idwDay, out idwHour, out idwMinute, out idwSecond, ref idwWorkcode))//get records from the memory
                    {
                        var _value = new TimeRecordVm
                        {
                            DeviceCode = _DeviceVm.Code,
                            CardNo = sdwEnrollNumber,
                            Day = idwDay,
                            Hour = idwHour,
                            Minute = idwMinute,
                            Month = idwMonth,
                            Year = idwYear,
                            AttStatus = idwInOutMode,
                            VerifyMethod = idwVerifyMode,
                            DatetimeIO = new DateTime(idwYear, idwMonth, idwDay, idwHour, idwMinute, 0),
                        };
                        _attList.Add(_value);
                    }
                    if (_attList != null && _attList.Count() > 0)
                    {
                        InsertAttLogToDB(_attList);
                        _DeviceVm.LastImportLogCount = _attList.Count;
                        UpdateLastTimeRecord(_attList.Count);

                        //Terminal.SaveAndShowLog(new DeviceEventLogVm
                        //{
                        //    LogData = "- " + "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==> تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"),
                        //    DeviceId = _DeviceVm.idn,
                        //    SaveInDB = true,
                        //    ModifiedDate = DateTime.Now
                        //});
                        //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                        //{
                        //    PublicMethod.SaveLogFile(_DeviceVm.Name, "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==> تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                        //});
                    }
                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    ret = _DeviceVm.idwErrorCode;

                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*دریافت اطلاعات با خطا مواجه شد, کد خطا: " + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                        //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                        //{
                        //    Helper.PublicMethod.SaveLogFile(_DeviceVm.Name, string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code) + "  ==>  زمان: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                        //});
                    }
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);//enable the device

                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public string MakeCommand(TimeRecordVm item)
        {
            try
            {
                var _query = string.Format(@" IF((Select COUNT(*) from TimeRecords where {0} = DeviceCode and {1} = CardNo and {2} = [Year] and {3} = [Month] and {4} = [Day] and {5} = Hour and {6} = Minute) <=0) " +
                                            "\n BEGIN " +
                                            "\n 	INSERT INTO [dbo].[TimeRecords]([CardNo],[DeviceCode],[Year],[Month],[Day],[Hour],[Minute],[DatetimeIO],[AttStatus],[VerifyMethod],[IsDelete],[ChangebyPerson],[WorkCode], [DatetimeIOMain]) " +
                                            "\n 	VALUES({1}, {0}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, '0', '0', {10}, {11}) " +
                                            "\n END",
                                            item.DeviceCode != null ? "N'" + item.DeviceCode + "'" : "NULL",
                                            !string.IsNullOrEmpty(item.CardNo) ? "N'" + item.CardNo + "'" : "NULL",
                                            item.Year != null ? "N'" + item.Year + "'" : "NULL",
                                            item.Month != null ? "N'" + item.Month + "'" : "NULL",
                                            item.Day != null ? "N'" + item.Day + "'" : "NULL",
                                            item.Hour != null ? "N'" + item.Hour + "'" : "NULL",
                                            item.Minute != null ? "N'" + item.Minute + "'" : "NULL",
                                            item.DatetimeIO != null ? "N'" + item.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL",
                                            "N'" + item.AttStatus + "'",
                                            item.VerifyMethod != null ? "N'" + item.VerifyMethod + "'" : "NULL",
                                            "N'" + item.WorkCode + "'",
                                            item.DatetimeIO != null ? "N'" + item.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL");

                #region Insert by Query
                //deviceMethodHlper.ExecuteSqlScript(_query);
                #endregion
                return _query;
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
            return "";
        }
        public void UpdateLastTimeRecord(int attcount)
        {
            try
            {
                _DeviceVm.LastTimeExport = DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm:ss");
                _DeviceVm.LastTimeExportEn = DateTime.Now;
                var _query = string.Format(@" update NewDevice set LastTimeExport = N'{0}', LastImportLogCount = '{1}', LastTimeExportEn = GETDATE() where Code = N'{2}' ", _DeviceVm.LastTimeExport, attcount, _DeviceVm.Code);

                deviceMethodHlper.ExecuteSqlScript(_query);
            }
            catch (Exception ex)
            {

            }
        }
        public void InsertAttLogToDB(List<TimeRecordVm> list)
        {
            try
            {
                int _recordCount = 25;
                if (list == null || list.Count <= 0) return;

                if (list.Count > _recordCount)
                {
                    int _index = 0;
                    var _Commands = "";
                    foreach (var item in list)
                    {
                        _Commands += MakeCommand(item) + Environment.NewLine;
                        _index++;
                        if (_index == _recordCount)
                        {
                            deviceMethodHlper.ExecuteSqlScript(_Commands);
                            _index = 0;
                            _Commands = "";
                        }
                    }
                    if (!string.IsNullOrEmpty(_Commands))
                        deviceMethodHlper.ExecuteSqlScript(_Commands);
                }
                else
                {
                    var _Commands = "";
                    foreach (var item in list)
                    {
                        _Commands += MakeCommand(item) + Environment.NewLine;
                    }
                    deviceMethodHlper.ExecuteSqlScript(_Commands);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public void SaveTransactionLog(DeviceTransactionEventVm model)
        //{
        //    try
        //    {
        //        var _query = string.Format(" Insert Into DeviceTransactionEvent([Id],[IsDelete],[ModifiedDate]," +
        //            "\n [DeviceId],[LastTransaction_Date],[LastTransaction_Count],[LastTransaction_Msg]," +
        //            "\n [LastTransaction_ErrorCode],[LastTransaction_Success],[TransactionPeriod],[TransactionType])" +
        //            "\n Values(NEWID(), 0, GETDATE(), N'{0}', GETDATE(), N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}') ",
        //            model.DeviceId,
        //            model.LastTransaction_Count,
        //            model.LastTransaction_Msg,
        //            model.LastTransaction_ErrorCode,
        //            model.LastTransaction_Success == true ? "1" : "0",
        //            model.TransactionPeriod,
        //            model.TransactionType != 0 ? model.TransactionType : 1
        //            );

        //        deviceMethodHlper.ExecuteSqlScript(_query);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
        #endregion

        #region ClearData
        public int sta_ClearAdmin()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }
                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);

                if (axCZKEM1.ClearAdministrators(GetMachineNumber()))
                {
                    axCZKEM1.RefreshData(GetMachineNumber());//the data in the device should be refreshed
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی ادمین ها ا سیستم حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*حذف اطلاعات ادمین انجام نشد, کد خطا :=" + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                    }
                    ret = _DeviceVm.idwErrorCode;
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_ClearAllLogs()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });

                    return -1024;
                }
                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);

                if (axCZKEM1.ClearData(GetMachineNumber(), 1))
                {
                    axCZKEM1.RefreshData(GetMachineNumber());//the data in the device should be refreshed
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی لاگ های ورود و خروج از سیستم حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*حذف تمامی لاگ ها با خطا مواجه شد, کد خطا=" + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code), DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                    }
                    ret = _DeviceVm.idwErrorCode;
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_ClearAllFps()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);

                if (axCZKEM1.ClearData(GetMachineNumber(), 2))
                {
                    axCZKEM1.RefreshData(GetMachineNumber());
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی اثر انگشت ها از دستگاه حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*حذف اثر انگشت ها با خطا مواجه شد, کد خطا=" + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code) });
                    }
                    ret = _DeviceVm.idwErrorCode;
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_ClearAllUsers()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                int ret = 0;

                axCZKEM1.EnableDevice(GetMachineNumber(), false);

                if (axCZKEM1.ClearData(GetMachineNumber(), 5))
                {
                    axCZKEM1.RefreshData(GetMachineNumber());//the data in the device should be refreshed
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی کاربران دستگاه حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*ClearAllUsers failed,ErrorCode=" + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code) });

                    }
                    ret = _DeviceVm.idwErrorCode;
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_ClearAllData()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                int ret = 0;
                axCZKEM1.EnableDevice(GetMachineNumber(), false);
                if (axCZKEM1.ClearKeeperData(GetMachineNumber()))
                {
                    axCZKEM1.RefreshData(GetMachineNumber());//the data in the device should be refreshed
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی داده های دستگاه حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });

                    ret = 1;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    if (_DeviceVm.idwErrorCode != 0)
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*ClearAllData failed,ErrorCode=" + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.NoDataForShowingInDevice, _DeviceVm.Name, _DeviceVm.Code) });

                    }
                    ret = _DeviceVm.idwErrorCode;
                }

                axCZKEM1.EnableDevice(GetMachineNumber(), true);
                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        #endregion

        #endregion

        #region OtherMng

        #region control
        public int sta_btnRestartDevice()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }

                if (axCZKEM1.RestartDevice(_DeviceVm.iMachineNumber))
                {
                    sta_DisConnect();
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "دستگاه باید ریستارت شود", DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                }

                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                }
                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        public int sta_btnPowerOffDevice()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                if (axCZKEM1.PowerOffDevice(_DeviceVm.iMachineNumber))
                {
                    sta_DisConnect();
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "دستگاه خاموش شد", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString(), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                }
                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1;
            }
        }
        #endregion



        #region sync time
        /// <summary>
        /// همگام سازی زمان و تاریخ با سیستم
        /// </summary>
        /// <returns></returns>
        public int sta_SYNCTime()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                if (axCZKEM1.SetDeviceTime(_DeviceVm.iMachineNumber))
                {
                    axCZKEM1.RefreshData(_DeviceVm.iMachineNumber);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullySyncTime });
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString() });
                }
                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        public string sta_GetDeviceDate()
        {
            if (sta_ConnectTCP() == 1)
            {
                int idwYear = 0;
                int idwMonth = 0;
                int idwDay = 0;
                int idwHour = 0;
                int idwMinute = 0;
                int idwSecond = 0;

                if (axCZKEM1.GetDeviceTime(_DeviceVm.iMachineNumber, ref idwYear, ref idwMonth, ref idwDay, ref idwHour, ref idwMinute, ref idwSecond))//show the time
                {
                    var _res = new DateTime(idwYear, idwMonth, idwDay);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullyGetDeviceTime });
                    return DateTimeOperation.M2S(_res);
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString() });
                }
                return "1";
            }

            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
            return "-1024";
        }
        public string sta_GetDeviceTime()
        {
            if (sta_ConnectTCP() == 1)
            {
                int idwYear = 0;
                int idwMonth = 0;
                int idwDay = 0;
                int idwHour = 0;
                int idwMinute = 0;
                int idwSecond = 0;

                if (axCZKEM1.GetDeviceTime(_DeviceVm.iMachineNumber, ref idwYear, ref idwMonth, ref idwDay, ref idwHour, ref idwMinute, ref idwSecond))//show the time
                {
                    var _res = idwHour.ToString() + ":" + idwMinute.ToString() + ":" + idwSecond.ToString();
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullyGetDeviceTime });
                    return _res;
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString() });
                }
                return "1";
            }

            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
            return "-1024";
        }

        /// <summary>
        /// تنظیم دستی ساعت و تاریخ
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public int sta_SetDeviceTime(DateTime dateTime)
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                DateTime date = dateTime;
                int idwYear = Convert.ToInt32(date.Year.ToString());
                int idwMonth = Convert.ToInt32(date.Month.ToString());
                int idwDay = Convert.ToInt32(date.Day.ToString());
                int idwHour = Convert.ToInt32(date.Hour.ToString());
                int idwMinute = Convert.ToInt32(date.Minute.ToString());
                int idwSecond = Convert.ToInt32(date.Second.ToString());

                if (axCZKEM1.SetDeviceTime2(_DeviceVm.iMachineNumber, idwYear, idwMonth, idwDay, idwHour, idwMinute, idwSecond))
                {
                    axCZKEM1.RefreshData(_DeviceVm.iMachineNumber);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullySetDeviceTime });
                }
                else
                {
                    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString() });
                }
                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        #endregion

        #endregion
    }

    public class FDKHelper : IFPDevice
    {
        #region Fields
        public NewDeviceVm _DeviceVm { get; set; }
        // private MainWindow Terminal { get; set; }
        public DeviceMethodHlper deviceMethodHlper { get; set; }
        #endregion


        #region ctor
        public FDKHelper(NewDeviceVm device)
        {
            deviceMethodHlper = new DeviceMethodHlper();
            //this.Terminal = Parent;
            this._DeviceVm = device;
            _DeviceVm.IsConected = false;
        }
        #endregion


        public int sta_ConnectTCP()
        {
            try
            {
                if (!PingDevice())
                {
                    SetConnectState(false);
                    return -1;
                }
                if (GetConnectState()) return 1;

                _DeviceVm.gnCommHandleIndex = FKAttendHelper.FK_ConnectNet(
                    anMachineNo: _DeviceVm.Code ?? 1,
                    astrIpAddress: _DeviceVm.IP,
                    anNetPort: _DeviceVm.port ?? 5005,
                    anTimeOut: 5000,
                    anProtocolType: (int)enumProtocolType.PROTOCOL_TCPIP,
                    anNetPassword: 0, anLicense: 1263);


                if (_DeviceVm.gnCommHandleIndex > 0)
                {
                    SetConnectState(true);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm
                    //{
                    //    LogData = "ارتباط برقرار شد. نام دستگاه: " + _DeviceVm.Name + "   کد دستگاه : " + _DeviceVm.Code,
                    //    DeviceId = _DeviceVm.idn,
                    //    SaveInDB = true,
                    //    ModifiedDate = DateTime.Now
                    //});
                    return 1;
                }
                else
                {
                    FKAttendHelper.FK_DisConnect(1);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm
                    //{
                    //    LogData = string.Format(PublicResource.UnableConnectDevice, _DeviceVm.Name) + " - " + ReturnResultPrint(_DeviceVm.gnCommHandleIndex),
                    //    DeviceId = _DeviceVm.idn,
                    //    SaveInDB = true,
                    //    ModifiedDate = DateTime.Now
                    //});
                    return _DeviceVm.gnCommHandleIndex;
                }

            }
            catch (Exception ex)
            {
                return -1;
            }
        }
        public void sta_DisConnect()
        {
            try
            {
                if (PingDevice())
                    if (GetConnectState() == true)
                    {
                        FKAttendHelper.FK_DisConnect(_DeviceVm.gnCommHandleIndex);
                    }
                _DeviceVm.IsConected = false;
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "* ارتباط با دستگاه " + _DeviceVm.Name + " قطع شد.", DeviceId = _DeviceVm.idn, DeviceName = _DeviceVm.Name, ModifiedDate = DateTime.Now });
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        public bool PingDevice()
        {
            try
            {
                int timeout = 1200;
                using (var ping = new Ping())
                {
                    for (int index = 0; index < 5; index++)
                    {
                        var reply = ping.Send(IPAddress.Parse(_DeviceVm.IP), timeout);
                        if (reply.Status == IPStatus.Success)
                        {
                            return true;
                        }
                    }
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + $"دستگاه:  {_DeviceVm.Name} پینگ نشد", DeviceId = _DeviceVm.idn, ModifiedDate = DateTime.Now });
                    SetConnectState(false);
                    return false;
                }
            }
            catch (Exception ex)
            {
                SetConnectState(false);
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "شبکه یافت نشد" });
                return false;
            }
        }


        public void DownloadAttRecord()
        {
            try
            {

            }
            catch (Exception ex)
            {

            }
        }
        public static string ReturnResultPrint(long anResultCode)
        {
            switch (anResultCode)
            {
                case (long)enumErrorCode.RUN_SUCCESS:
                    return "موفقیت آمیز!";
                case (long)enumErrorCode.RUNERR_NOSUPPORT:
                    return "پشتیبانی نمیشود";
                case (long)enumErrorCode.RUNERR_UNKNOWNERROR:
                    return "خطای نامشخص";
                case (long)enumErrorCode.RUNERR_NO_OPEN_COMM:
                    return "No Open Comm";
                case (long)enumErrorCode.RUNERR_WRITE_FAIL:
                    return "خطای نوشتن";
                case (long)enumErrorCode.RUNERR_READ_FAIL:
                    return "خطا خواندن";
                case (long)enumErrorCode.RUNERR_INVALID_PARAM:
                    return "خطای پارامتر";
                case (long)enumErrorCode.RUNERR_NON_CARRYOUT:
                    return "اجرای فرمان ناموفق بود";
                case (long)enumErrorCode.RUNERR_DATAARRAY_END:
                    return "پایان داده ها";
                case (long)enumErrorCode.RUNERR_DATAARRAY_NONE:
                    return "Nonexistence data";
                case (long)enumErrorCode.RUNERR_MEMORY:
                    return "خطای تخصیص حافظه";
                case (long)enumErrorCode.RUNERR_MIS_PASSWORD:
                    return "خطای مجوز";
                case (long)enumErrorCode.RUNERR_MEMORYOVER:
                    return "داده های ثبت نام کامل است و نمی توان داده های ثبت نام را قرار داد";
                case (long)enumErrorCode.RUNERR_DATADOUBLE:
                    return "این شناسه قبلاً وجود ثبت شده است.";
                case (long)enumErrorCode.RUNERR_MANAGEROVER:
                    return "ظرفیت مدیران کامل شده و نمیتوان مورد جدیدی اضافه کرد";
                case (long)enumErrorCode.RUNERR_FPDATAVERSION:
                    return "اشتباه نسخه داده اثر انگشت.";
                default:
                    return "Unknown error";
            }
        }
        public bool GetConnectState()
        {
            return _DeviceVm.IsConected;
        }
        public void SetConnectState(bool state)
        {
            _DeviceVm.IsConected = state;
        }




        #region Insert Data Into Database

        public DataModelResult AttLog_Save(TimeRecordVm entity)
        {
            try
            {
                //if (Properties.Settings.Default.AutoSaveAttendance)
                //deviceMethodHlper.ExecuteSqlScript(MakeCommand(entity));
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
            return new DataModelResult();
        }

        public void Run_ImportAttLogFromDevice()
        {
            try
            {
                Run_ImportAttLogFromDeviceFirstway();
            }
            catch { }
        }
        /// <summary>
        /// روش اول چک کردن شماره سریال. با شماره سریال ثبت شده در بخش مدیریت دستگاه ها
        /// </summary>
        public void Run_ImportAttLogFromDeviceFirstway()
        {
            try
            {
                //if (CurrentUser.CurrentUserS.applicationConfiguration.CheckSNeumber == "1" && string.IsNullOrEmpty(_DeviceVm.SerialNumber))
                //{
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotNotDefined, _DeviceVm.Name, _DeviceVm.Code) });
                //    return;
                //}
                if (sta_ConnectTCP() == 1)
                {
                    if (string.IsNullOrEmpty(_DeviceVm.SerialNumber))// اگر شماره سریال ثبت نشده باشد عملیات تخلیه را انجام میدهد
                        ImportAttLogFromDevice();
                    else
                    {//اگر شماره سریال دستگاه ثبت شده باشد
                        if (string.IsNullOrEmpty(_DeviceVm.deviceHardwareInfo.sSN))
                        {// اگر شماره سریال دستگاه دریافت نشده باشد آن را دریافت میکند و بعد از چک کردن عملیات تخلیه را انجام میدهد
                            if (sta_GetSeialNumber() == 1)
                                if (_DeviceVm.SerialNumber == _DeviceVm.deviceHardwareInfo.sSN)
                                {
                                    ImportAttLogFromDevice();
                                }
                                else
                                {
                                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                                }
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotLoaded, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }

                        }
                        else
                        {
                            if (_DeviceVm.deviceHardwareInfo.sSN == _DeviceVm.SerialNumber)
                                ImportAttLogFromDevice();
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        private void ImportAttLogFromDevice()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _daycount = Math.Abs(FingerPrintDeviceService.SaveDatePerDayAgo);
                    if (_daycount > 0)
                    {
                        var _res = sta_ImportLogByPeriod();
                    }
                    else
                    {
                        var _res = sta_ImportAttLog();
                    }
                }
                else
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "ارتباط با دستگاه : " + _DeviceVm.Name + " برقرار نیست  " });
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }









        /// <summary>
        /// دریافت تمامی لاگ های دستگاه
        /// </summary>
        public void Run_ImportAllAttLogFromDevice()
        {
            try
            {
                Run_ImportAllAttLogFromDeviceFirstway();
            }
            catch { }
        }
        /// <summary>
        /// روش اول چک کردن شماره سریال. با شماره سریال ثبت شده در بخش مدیریت دستگاه ها
        /// </summary>
        public void Run_ImportAllAttLogFromDeviceFirstway()
        {
            try
            {
                //if (CurrentUser.CurrentUserS.applicationConfiguration.CheckSNeumber == "1" && string.IsNullOrEmpty(_DeviceVm.SerialNumber))
                //{
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotNotDefined, _DeviceVm.Name, _DeviceVm.Code) });
                //    return;
                //}
                if (sta_ConnectTCP() == 1)
                {
                    if (string.IsNullOrEmpty(_DeviceVm.SerialNumber))// اگر شماره سریال ثبت نشده باشد عملیات تخلیه را انجام میدهد
                        ImportAllAttLogFromDevice();
                    else
                    {//اگر شماره سریال دستگاه ثبت شده باشد
                        if (string.IsNullOrEmpty(_DeviceVm.deviceHardwareInfo.sSN))
                        {// اگر شماره سریال دستگاه دریافت نشده باشد آن را دریافت میکند و بعد از چک کردن عملیات تخلیه را انجام میدهد
                            if (sta_GetSeialNumber() == 1)
                                if (_DeviceVm.SerialNumber == _DeviceVm.deviceHardwareInfo.sSN)
                                {
                                    ImportAllAttLogFromDevice();
                                }
                                else
                                {
                                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                                }
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotLoaded, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }

                        }
                        else
                        {
                            if (_DeviceVm.deviceHardwareInfo.sSN == _DeviceVm.SerialNumber)
                                ImportAllAttLogFromDevice();
                            else
                            {
                                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = string.Format(PublicResource.DeviceSerialNumberNotEqualToRegisterSN, _DeviceVm.Name, _DeviceVm.Code), SaveInDB = true, DeviceId = _DeviceVm.idn });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }
        private void ImportAllAttLogFromDevice()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _res = sta_ImportAttLog();
                }
                else
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + "ارتباط با دستگاه : " + _DeviceVm.Name + " برقرار نیست  " });
                }
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
        }


        #endregion


        #region  AttLogMng
        public int sta_ImportAttLog()
        {
            try
            {
                if (!GetConnectState())
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }

                int ret = 0;
                int vSEnrollNumber = 0;
                int vVerifyMode = 0;
                int vInOutMode = 0;
                DateTime vdwDate = DateTime.MinValue;
                int vnCount = 0;
                int vnResultCode = 0;
                //string vstrFileName = "";
                //string vstrFileData = "";
                int vnReadMark = 0;

                vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode == 0)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = GlobalConstants.gstrNoDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }
                System.Threading.Thread.Sleep(10);
                vnResultCode = FKAttendHelper.FK_LoadGeneralLogData(_DeviceVm.gnCommHandleIndex, vnReadMark);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }
                else
                {
                    var _attList = new List<TimeRecordVm>();
                    vnCount = 1;
                    do
                    {
                        vnResultCode = FKAttendHelper.FK_GetGeneralLogData(_DeviceVm.gnCommHandleIndex, ref vSEnrollNumber, ref vVerifyMode, ref vInOutMode, ref vdwDate);
                        if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                        {
                            if (vnResultCode == (int)enumErrorCode.RUNERR_DATAARRAY_END)
                            {
                                vnResultCode = (int)enumErrorCode.RUN_SUCCESS;
                            }
                            break;
                        }

                        var _value = new TimeRecordVm
                        {
                            DeviceCode = _DeviceVm.Code,
                            CardNo = vSEnrollNumber.ToString(),
                            Day = vdwDate.Day,
                            Hour = vdwDate.Hour,
                            Minute = vdwDate.Minute,
                            Month = vdwDate.Month,
                            Year = vdwDate.Year,
                            AttStatus = vInOutMode,
                            VerifyMethod = vVerifyMode,
                            DatetimeIO = vdwDate
                        };
                        _attList.Add(_value);

                        vnCount = vnCount + 1;
                    } while (true);

                    if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                    {
                        InsertAttLogToDB(_attList);
                        _DeviceVm.LastImportLogCount = _attList.Count;
                        UpdateLastTimeRecord(_attList.Count);
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "- " + "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==>  تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                        //System.Windows.Application.Current.Dispatcher.Invoke(delegate
                        //{
                        //    PublicMethod.SaveLogFile(_DeviceVm.Name, "تخلیه اطلاعات از دستگاه: " + _DeviceVm.Name + " با موفقیت انجام شد. " + "   ==>  تعداد رکورد ها : " + _attList.Count() + "   ==> " + "زمان آخرین تخلیه: " + DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm"));
                        //});
                        ret = 1;
                    }
                    else
                    {
                        //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                        return -1024;
                    }
                }
                FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);

                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        public int sta_ImportLogByPeriod()
        {
            return sta_ImportAttLog();
        }
        public string MakeCommand(TimeRecordVm item)
        {
            try
            {
                var _query = string.Format(@" IF((Select COUNT(*) from TimeRecords where {0} = DeviceCode and {1} = CardNo and {2} = [Year] and {3} = [Month] and {4} = [Day] and {5} = Hour and {6} = Minute) <=0) " +
                                            "\n BEGIN " +
                                            "\n 	INSERT INTO [dbo].[TimeRecords]([CardNo],[DeviceCode],[Year],[Month],[Day],[Hour],[Minute],[DatetimeIO],[AttStatus],[VerifyMethod],[IsDelete],[ChangebyPerson],[WorkCode], [DatetimeIOMain]) " +
                                            "\n 	VALUES({1}, {0}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, '0', '0', {10}, {11}) " +
                                            "\n END",
                                            item.DeviceCode != null ? "N'" + item.DeviceCode + "'" : "NULL",
                                            !string.IsNullOrEmpty(item.CardNo) ? "N'" + item.CardNo + "'" : "NULL",
                                            item.Year != null ? "N'" + item.Year + "'" : "NULL",
                                            item.Month != null ? "N'" + item.Month + "'" : "NULL",
                                            item.Day != null ? "N'" + item.Day + "'" : "NULL",
                                            item.Hour != null ? "N'" + item.Hour + "'" : "NULL",
                                            item.Minute != null ? "N'" + item.Minute + "'" : "NULL",
                                            item.DatetimeIO != null ? "N'" + item.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL",
                                            "N'" + item.AttStatus + "'",
                                            item.VerifyMethod != null ? "N'" + item.VerifyMethod + "'" : "NULL",
                                            "N'" + item.WorkCode + "'",
                                            item.DatetimeIO != null ? "N'" + item.DatetimeIO.Value.ToString("yyyy-MM-dd HH:mm:ss") + "'" : "NULL");

                #region Insert by Query
                //deviceMethodHlper.ExecuteSqlScript(_query);
                #endregion
                return _query;
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
            }
            return "";
        }
        public void UpdateLastTimeRecord(int attcount)
        {
            try
            {
                _DeviceVm.LastTimeExport = DateTimeOperation.M2S(DateTime.Now) + " " + DateTime.Now.ToString("HH:mm:ss");
                _DeviceVm.LastTimeExportEn = DateTime.Now;
                var _query = string.Format(@" update NewDevice set LastTimeExport = N'{0}', LastImportLogCount = '{1}', LastTimeExportEn = GETDATE() where Code = N'{2}' ", _DeviceVm.LastTimeExport, attcount, _DeviceVm.Code);

                deviceMethodHlper.ExecuteSqlScript(_query);
            }
            catch (Exception ex)
            {

            }
        }
        public void InsertAttLogToDB(List<TimeRecordVm> list)
        {
            try
            {
                int _recordCount = 25;
                if (list == null || list.Count <= 0) return;

                if (list.Count > _recordCount)
                {
                    int _index = 0;
                    var _Commands = "";
                    foreach (var item in list)
                    {
                        _Commands += MakeCommand(item) + Environment.NewLine;
                        _index++;
                        if (_index == _recordCount)
                        {
                            deviceMethodHlper.ExecuteSqlScript(_Commands);
                            _index = 0;
                            _Commands = "";
                        }
                    }
                    if (!string.IsNullOrEmpty(_Commands))
                        deviceMethodHlper.ExecuteSqlScript(_Commands);
                }
                else
                {
                    var _Commands = "";
                    foreach (var item in list)
                    {
                        _Commands += MakeCommand(item) + Environment.NewLine;
                    }
                    deviceMethodHlper.ExecuteSqlScript(_Commands);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public void SaveTransactionLog(DeviceTransactionEventVm model)
        //{
        //    try
        //    {
        //        var _query = string.Format(" Insert Into DeviceTransactionEvent([Id],[IsDelete],[ModifiedDate]," +
        //            "\n [DeviceId],[LastTransaction_Date],[LastTransaction_Count],[LastTransaction_Msg]," +
        //            "\n [LastTransaction_ErrorCode],[LastTransaction_Success],[TransactionPeriod],[TransactionType])" +
        //            "\n Values(NEWID(), 0, GETDATE(), N'{0}', GETDATE(), N'{1}', N'{2}', N'{3}', N'{4}', N'{5}', N'{6}') ",
        //            model.DeviceId,
        //            model.LastTransaction_Count,
        //            model.LastTransaction_Msg,
        //            model.LastTransaction_ErrorCode,
        //            model.LastTransaction_Success == true ? "1" : "0",
        //            model.TransactionPeriod,
        //            model.TransactionType != 0 ? model.TransactionType : 1
        //            );

        //        deviceMethodHlper.ExecuteSqlScript(_query);
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
        #endregion


        #region sync time
        /// <summary>
        /// همگام سازی زمان و تاریخ با سیستم
        /// </summary>
        /// <returns></returns>
        public int sta_SYNCTime()
        {
            try
            {
                return sta_SetDeviceTime(DateTime.Now);
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        public string sta_GetDeviceDate()
        {
            if (sta_ConnectTCP() == 1)
            {
                string _result = "1";
                DateTime vdwDate = DateTime.Now;
                //string strDataTime;
                int vnResultCode;
                //cmdGetDeviceTime.Enabled = false;
                //lblMessage.Text = "Working...";
                //Application.DoEvents();
                vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //lblMessage.Text = GlobalConstants.gstrNoDevice;
                    //cmdGetDeviceTime.Enabled = true;
                    //return;
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + vnResultCode.ToString() });
                }
                vnResultCode = FKAttendHelper.FK_GetDeviceTime(_DeviceVm.gnCommHandleIndex, ref vdwDate);
                if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                {
                    //strDataTime = "Date = " + vdwDate.ToLongDateString() + ", Time = " + vdwDate.ToLongTimeString();
                    //lblMessage.Text = strDataTime;

                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullyGetDeviceTime });
                    _result = DateTimeOperation.M2S(vdwDate);
                }
                else
                    //lblMessage.Text = ReturnResultPrint(vnResultCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode) });

                    FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);
                //cmdGetDeviceTime.Enabled = true;

                return _result;
            }

            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
            return "-1024";
        }

        public string sta_GetDeviceTime()
        {
            if (sta_ConnectTCP() == 1)
            {
                string _result = "1";
                DateTime vdwDate = DateTime.Now;
                int vnResultCode;
                vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + vnResultCode.ToString() });
                }
                vnResultCode = FKAttendHelper.FK_GetDeviceTime(_DeviceVm.gnCommHandleIndex, ref vdwDate);
                if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                {
                    //strDataTime = "Date = " + vdwDate.ToLongDateString() + ", Time = " + vdwDate.ToLongTimeString();
                    //lblMessage.Text = strDataTime;

                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullyGetDeviceTime });
                    _result = vdwDate.ToString("HH:mm");
                }
                else
                    //lblMessage.Text = ReturnResultPrint(vnResultCode);
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode) });

                    FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);
                //cmdGetDeviceTime.Enabled = true;

                return _result;
            }

            //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
            return "-1024";
        }

        /// <summary>
        /// تنظیم دستی ساعت و تاریخ
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public int sta_SetDeviceTime(DateTime dateTime)
        {
            try
            {
                //if (GetConnectState() == false)
                //{
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                //    return -1024;
                //}
                //DateTime date = dateTime;
                //int idwYear = Convert.ToInt32(date.Year.ToString());
                //int idwMonth = Convert.ToInt32(date.Month.ToString());
                //int idwDay = Convert.ToInt32(date.Day.ToString());
                //int idwHour = Convert.ToInt32(date.Hour.ToString());
                //int idwMinute = Convert.ToInt32(date.Minute.ToString());
                //int idwSecond = Convert.ToInt32(date.Second.ToString());
                //if (axCZKEM1.SetDeviceTime2(_DeviceVm.iMachineNumber, idwYear, idwMonth, idwDay, idwHour, idwMinute, idwSecond))
                //{
                //    axCZKEM1.RefreshData(_DeviceVm.iMachineNumber);
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullySetDeviceTime });
                //}
                //else
                //{
                //    axCZKEM1.GetLastError(ref _DeviceVm.idwErrorCode);
                //  //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + _DeviceVm.idwErrorCode.ToString() });
                //}
                //return 1;





                var vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //lblMessage.Text = GlobalConstants.gstrNoDevice;
                    //cmdSetDeviceTime.Enabled = true;
                    //return;
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.OperationfailedErrorCode + vnResultCode.ToString() });
                }

                vnResultCode = FKAttendHelper.FK_SetDeviceTime(_DeviceVm.gnCommHandleIndex, dateTime);
                //lblMessage.Text = ReturnResultPrint(vnResultCode);
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.SuccessfullySetDeviceTime });
                FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);

                return 1;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }
        #endregion


        public int sta_GetCapacityInfo(out int adminCnt, out int userCount, out int fpCnt, out int recordCnt, out int pwdCnt, out int oplogCnt, out int faceCnt)
        {
            throw new NotImplementedException();
        }

        public int sta_GetDeviceInfo(out string sFirmver, out string sMac, out string sPlatform, out string sSN, out string sProductTime, out string sDeviceName, out int iFPAlg, out int iFaceAlg, out string sProducter)
        {
            throw new NotImplementedException();
        }

        public int SetUserInfo(UserVm user)
        {
            return 0;
        }

        public int sta_GetSeialNumber()
        {
            try
            {
                if (sta_ConnectTCP() == 1)
                {
                    var _serialNumber = "";
                    //axCZKEM1.GetSerialNumber(GetMachineNumber(), out _serialNumber);
                    var vnResultCode = FuncGetProductData((long)enumProductInfo.PRODUCT_SERIALNUMBER, ref _serialNumber);
                    if (vnResultCode == (long)enumErrorCode.RUN_SUCCESS)
                    {
                        _DeviceVm.deviceHardwareInfo.sSN = _serialNumber;
                    }
                    return 1;
                }
            }
            catch (Exception ex)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm
                //{
                //    LogData = ex.Message
                //});
            }
            return 1024;
        }
        private long FuncGetProductData(long anIndex, ref string astrItem)
        {
            long vnResultCode;
            string vstrData = new string((char)0x20, 256);

            vnResultCode = FKAttendHelper.FK_GetProductData(this._DeviceVm.gnCommHandleIndex, (int)anIndex, ref vstrData);
            if (vnResultCode != (long)enumErrorCode.RUN_SUCCESS)
            {
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ReturnResultPrint(vnResultCode) });
                return vnResultCode;
            }
            astrItem = vstrData.Trim();
            return vnResultCode;
        }
        public int sta_SetUserInfo(UserVm value)
        {
            return 0;
        }

        public int sta_ClearAdmin()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice, DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                    return -1024;
                }
                int ret = 0;

                ret = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (ret != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = GlobalConstants.gstrNoDevice });
                    return -1024;
                }

                ret = FKAttendHelper.FK_BenumbAllManager(_DeviceVm.gnCommHandleIndex);
                //if (ret == (int)enumErrorCode.RUN_SUCCESS)
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی ادمین ها ا سیستم حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                //else
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(ret), DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);


                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        public int sta_ClearAllLogs()
        {
            return 0;
        }

        public int sta_ClearAllFps()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                int vnResultCode = 0;


                vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = GlobalConstants.gstrNoDevice });
                    return -1024;
                }

                vnResultCode = FKAttendHelper.FK_EmptyEnrollData(_DeviceVm.gnCommHandleIndex);
                //if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی داده های دستگاه حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                //else
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode) });

                FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);


                return vnResultCode;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }
        }

        public int sta_ClearAllUsers()
        {
            return 0;
        }

        public int sta_ClearAllData()
        {
            try
            {
                if (GetConnectState() == false)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = PublicResource.ConnectDevice });
                    return -1024;
                }
                int ret = 0;


                int vnResultCode;
                vnResultCode = FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 0);
                if (vnResultCode != (int)enumErrorCode.RUN_SUCCESS)
                {
                    //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = GlobalConstants.gstrNoDevice });
                    return -1024;
                }
                vnResultCode = FKAttendHelper.FK_ClearKeeperData(_DeviceVm.gnCommHandleIndex);
                //if (vnResultCode == (int)enumErrorCode.RUN_SUCCESS)
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "تمامی داده های دستگاه حذف شدند", DeviceId = _DeviceVm.idn, SaveInDB = true, ModifiedDate = DateTime.Now });
                //else
                //Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = ReturnResultPrint(vnResultCode) });

                FKAttendHelper.FK_EnableDevice(_DeviceVm.gnCommHandleIndex, 1);

                return ret;
            }
            catch (Exception ex)
            {
                // Terminal.SaveAndShowLog(new DeviceEventLogVm { LogData = "*" + ex.Message });
                return -1024;
            }

        }

        public List<UserVm> sta_GetAllUserFPInfo()
        {
            return new List<UserVm>();
        }

    }



    public class FingerPrintDeviceService
    {
        public static int SaveDatePerDayAgo { get; set; } = 3;
        public static int MaxThreadCount { get; set; } = 3;
        public static List<DevicesList> Devices { get; set; }
        public static CancellationTokenSource TokenSource { get; set; } = new CancellationTokenSource();
    }



}
