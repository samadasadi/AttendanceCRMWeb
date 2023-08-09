using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Service.Attendance
{
    public class FKAttendHelper
    {

        /////////////////////////////////////////////////////////////////////
        // FKAttend dll APIs
        /////////////////////////////////////////////////////////////////////

        #region Connection
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ConnectComm(
            int anMachineNo,
            int anComPort,
            int anBaudRate,
            string astrTelNumber,
            int anWaitDialTime,
            int anLicense,
            int anComTimeOut);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ConnectNet(
            int anMachineNo,
            string astrIpAddress,
            int anNetPort,
            int anTimeOut,
            int anProtocolType,
            int anNetPassword,
            int anLicense);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ConnectUSB(
            int anMachineNo,
            int anLicense);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern void FK_DisConnect(int anHandleIndex);
        #endregion Connection

        #region Error processing
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetLastError(int anHandleIndex);
        #endregion Error processing

        #region Device Setting
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_EnableDevice(int anHandleIndex, byte anEnableFlag);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern void FK_PowerOnAllDevice(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_PowerOffDevice(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetDeviceStatus(
            int anHandleIndex,
            int anStatusIndex,
            ref int apnValue);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetDeviceTime(
            int anHandleIndex,
            ref DateTime apnDateTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetDeviceTime(
            int anHandleIndex,
            DateTime anDateTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetDeviceInfo(
            int anHandleIndex,
            int anInfoIndex,
            ref int apnValue);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetDeviceInfo(
            int anHandleIndex,
            int anInfoIndex,
            int anValue);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetProductData(
            int anHandleIndex,
            int anDataIndex,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrValue);
        #endregion Device Setting

        #region Log Data
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_LoadSuperLogData(int anHandleIndex, int anReadMark);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBLoadSuperLogDataFromFile(
            int anHandleIndex,
            string astrFilePath);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetSuperLogData(
            int anHandleIndex,
            ref int apnSEnrollNumber,
            ref int apnGEnrollNumber,
            ref int apnMachinePrivilege,
            ref int apnBackupNumber,
            ref DateTime apnDateTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_EmptySuperLogData(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_LoadGeneralLogData(int anHandleIndex, int anReadMark);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBLoadGeneralLogDataFromFile(
            int anHandleIndex,
            string astrFilePath);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetGeneralLogData(
            int anHandleIndex,
            ref int apnEnrollNumber,
            ref int apnVerifyMode,
            ref int apnInOutMode,
            ref DateTime apnDateTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_EmptyGeneralLogData(int anHandleIndex);
        #endregion Log Data

        #region Enroll Data, User Name, Message
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_EnableUser(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            int anEnableFlag);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ModifyPrivilege(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            int anMachinePrivilege);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_BenumbAllManager(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ReadAllUserID(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetAllUserID(
            int anHandleIndex,
            ref int apnEnrollNumber,
            ref int apnBackupNumber,
            ref int apnMachinePrivilege,
            ref int apnEnable);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetEnrollData(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            ref int apnMachinePrivilege,
            byte[] apnEnrollData,
            ref int apnPassword);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_PutEnrollData(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            int anMachinePrivilege,
            byte[] apnEnrollData,
            int anPassword);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SaveEnrollData(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_DeleteEnrollData(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_EmptyEnrollData(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_ClearKeeperData(int anHandleIndex);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBReadAllEnrollDataFromFile(
            int anHandleIndex,
            string astrFilePath);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetUSBModel(
            int anHandleIndex,
            int anModel);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetUDiskFileFKModel(
            int anHandleIndex,
            string strFKModel);


        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBReadAllEnrollDataCount(
            int anHandleIndex, int apnValue);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBGetOneEnrollData(
            int anHandleIndex,
            ref int apnEnrollNumber,
            ref int apnBackupNumber,
            ref int apnMachinePrivilege,
            byte[] apnEnrollData,
            ref int apnPassword,
            ref int apnEnableFlag,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrEnrollName);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBSetOneEnrollData(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            int anMachinePrivilege,
            byte[] apnEnrollData,
            int anPassword,
            int anEnableFlag,
            string astrEnrollName);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBWriteAllEnrollDataToFile(
            int anHandleIndex,
            string astrFilePath);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBReadAllEnrollDataFromFile_Color(
            int anHandleIndex,
            string astrFilePath);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBWriteAllEnrollDataToFile_Color(
            int anHandleIndex,
            string astrFilePath,
            long anNewsKind);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBGetOneEnrollData_Color(
            int anHandleIndex,
            ref int apnEnrollNumber,
            ref int apnBackupNumber,
            ref int apnMachinePrivilege,
            byte[] apnEnrollData,
            ref int apnPassWord,
            ref int apnEnableFlag,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrEnrollName,
            int anNewsKind);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_USBSetOneEnrollData_Color(
            int anHandleIndex,
            int anEnrollNumber,
            int anBackupNumber,
            int anMachinePrivilege,
            byte[] apnEnrollData,
            int anPassWord,
            int anEnableFlag,
            string astrEnrollName,
            int anNewsKind);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetUserName(
            int anHandleIndex,
            int anEnrollNumber,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrUserName);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetUserName(
            int anHandleIndex,
            int anEnrollNumber,
            string astrUserName);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetNewsMessage(
            int anHandleIndex,
            int anNewsId,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrNews);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetNewsMessage(
            int anHandleIndex,
            int anNewsId,
            string astrNews);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetUserNewsID(
            int anHandleIndex,
            int anEnrollNumber,
            ref int apnNewsId);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetUserNewsID(
            int anHandleIndex,
            int anEnrollNumber,
            int anNewsId);
        #endregion Enroll Data, User Name, Message

        #region BELL setting
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetBellTime(
            int anHandleIndex,
            ref int apnBellCount,
            byte[] apnBellInfo);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetBellTime(
            int anHandleIndex,
            int anBellCount,
            byte[] apnBellInfo);
        #endregion BELL setting

        #region Access Control
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetDoorStatus(int anHandleIndex, ref int apnStatusVal);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetDoorStatus(int anHandleIndex, int anStatusVal);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetPassTime(
            int anHandleIndex,
            int anPassTimeID,
            byte[] apnPassTime,
            int anPassTimeSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetPassTime(
            int anHandleIndex,
            int anPassTimeID,
            byte[] apnPassTime,
            int anPassTimeSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetUserPassTime(
            int anHandleIndex,
            int anEnrollNumber,
            ref int apnGroupID,
            byte[] apnUserPassTimeInfo,
            int anUserPassTimeInfoSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetUserPassTime(
            int anHandleIndex,
            int anEnrollNumber,
            int anGroupID,
            byte[] apnUserPassTimeInfo,
            int anUserPassTimeInfoSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetGroupPassTime(
            int anHandleIndex,
            int anGroupID,
            byte[] apnGroupPassTimeInfo,
            int anGroupPassTimeInfoSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetGroupPassTime(
            int anHandleIndex,
            int anGroupID,
            byte[] apnGroupPassTimeInfo,
            int anGroupPassTimeInfoSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetGroupMatch(
            int nHandleIndex,
            byte[] apnGroupMatchInfo,
            int anGroupMatchInfoSize);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetGroupMatch(
            int nHandleIndex,
            byte[] apnGroupMatchInfo,
            int anGroupMatchInfoSize);
        #endregion Access Control

        #region Etc Functions
        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetAdjustInfo(
            int nHandleIndex,
            ref int apnAdjustedState,
            ref int apnAdjustedMonth,
            ref int apnAdjustedDay,
            ref int apnAdjustedHour,
            ref int apnAdjustedMinute,
            ref int apnRestoredState,
            ref int apnRestoredMonth,
            ref int apnRestoredDay,
            ref int apnRestoredHour,
            ref int apnRestoredMinte);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetAdjustInfo(
            int anHandleIndex,
            int anAdjustedState,
            int anAdjustedMonth,
            int anAdjustedDay,
            int anAdjustedHour,
            int anAdjustedMinute,
            int anRestoredState,
            int anRestoredMonth,
            int anRestoredDay,
            int anRestoredHour,
            int anRestoredMinte);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetAccessTime(
            int nHandleIndex,
            int anEnrollNumber,
            ref int apnAccessTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetAccessTime(
            int nHandleIndex,
            int anEnrollNumber,
            int anAccessTime);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetFontName(
            int nHandleIndex,
            string aStrFontName,
            int anFontType);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetRealTimeInfo(
            int anHandleIndex,
            byte[] apnRealTimeInfo);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetRealTimeInfo(
            int anHandleIndex,
            byte[] apnRealTimeInfo);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_GetServerNetInfo(
            int anHandleIndex,
            [MarshalAs(UnmanagedType.LPStr)] ref string apstrServerIPAddress,
            ref int apnServerPort,
            ref int apnServerRequest);

        [DllImport("FKAttend.dll", CharSet = CharSet.Ansi)]
        public static extern int FK_SetServerNetInfo(
            int nHandleIndex,
            string astrServerIPAddress,
            int anServerPort,
            int anServerRequest);
        #endregion
    }


    public class GlobalConstants
    {
        public const string gstrNoDevice = "No Device";
        public const short MAX_BELLCOUNT_DAY = 24;
        public const short MAX_PASSCTRLGROUP_COUNT = 50;
        public const short MAX_PASSCTRL_COUNT = 7;
        public const short MAX_USERPASSINFO_COUNT = 3;
        public const short MAX_GROUPPASSINFO_COUNT = 3;
        public const short MAX_GROUPMATCHINFO_COUNT = 10;
        public const short NEWS_EXTEND = 2;
        public const short NEWS_STANDARD = 1;

        public const short SIZE_BELLINFO = 72;
        public const short SIZE_PASSTIME = 4;
        public const short SIZE_PASSCRLTIME = 28;
        public const short SIZE_USERPASSINFO = 3;
        public const short SIZE_GROUPPASSINFO = 3;
        public const short SIZE_GROUPMATCHINFO = 20;
    }

    //******************************************************************/
    //*                            Structure                           */
    //******************************************************************/

    struct BELLINFO
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_BELLCOUNT_DAY)]
        public byte[] mValid;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_BELLCOUNT_DAY)]
        public byte[] mHour;
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_BELLCOUNT_DAY)]
        public byte[] mMinute;
    };//72byte

    //--- Pass Control Time ---
    struct PASSTIME
    {
        public byte StartHour;
        public byte StartMinute;
        public byte EndHour;
        public byte EndMinute;
    };//4byte

    //--- Pass Control Time Infomation ---
    struct PASSCTRLTIME
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_PASSCTRL_COUNT)]
        public PASSTIME[] PassCtrlTime;
    };//28byte

    struct USERPASSINFO
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_USERPASSINFO_COUNT)]
        public byte[] UserPassID;
    };
    //3byte

    struct GROUPPASSINFO
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_GROUPPASSINFO_COUNT)]
        public byte[] GroupPassID;
    };
    //3byte


    struct GROUPMATCHINFO
    {
        [MarshalAs(UnmanagedType.ByValArray, SizeConst = GlobalConstants.MAX_GROUPMATCHINFO_COUNT)]
        public short[] GroupMatch;
    };
    //20byte

    //=============== USBModel Kind  ===============//
    public enum enumUSBModelKind
    {
        FK625_FP1000 = 2001,
        FK625_FP2000 = 2002,
        FK625_FP3000 = 2003,
        FK625_FP5000 = 2004,
        FK625_FP10000 = 2005,
        FK625_FP30000 = 2006,
        FK625_ID30000 = 2007,
        FK635_FP700 = 3001,
        FK635_FP3000 = 3002,
        FK635_FP10000 = 3003,
        FK635_ID30000 = 3004,
        FK723_FP1000 = 4001,
        FK725_FP1000 = 5001,
        FK725_FP1500 = 5002,
        FK725_ID5000 = 5003,
        FK725_ID30000 = 5004,
        FK735_FP500 = 6001,
        FK735_FP3000 = 6002,
        FK735_ID30000 = 6003,
        FK925_FP3000 = 7001,
        FK935_FP3000 = 8001,
    };
    //=============== Protocol Type ===============//
    public enum enumProtocolType
    {
        PROTOCOL_TCPIP = 0,               // TCP/IP
        PROTOCOL_UDP = 1,                  // UDP
    };

    //=============== Backup Number Constant ===============//
    public enum enumBackupNumberType
    {
        BACKUP_FP_0 = 0,        // Finger 0
        BACKUP_FP_1 = 1,        // Finger 1
        BACKUP_FP_2 = 2,        // Finger 2
        BACKUP_FP_3 = 3,        // Finger 3
        BACKUP_FP_4 = 4,        // Finger 4
        BACKUP_FP_5 = 5,        // Finger 5
        BACKUP_FP_6 = 6,        // Finger 6
        BACKUP_FP_7 = 7,        // Finger 7
        BACKUP_FP_8 = 8,        // Finger 8
        BACKUP_FP_9 = 9,        // Finger 9
        BACKUP_PSW = 10,        // Password
        BACKUP_CARD = 11,       // Card
        BACKUP_FACE = 12,       // Face
        BACKUP_VEIN_0 = 20,     // Vein 0
    };
    //=============== Manipulation of SuperLogData ===============//
    public enum enumSuperLogInfo
    {
        LOG_ENROLL_USER = 3,               // Enroll-User
        LOG_ENROLL_MANAGER = 4,            // Enroll-Manager
        LOG_ENROLL_DELFP = 5,              // FP Delete
        LOG_ENROLL_DELPASS = 6,            // Pass Delete
        LOG_ENROLL_DELCARD = 7,            // Card Delete
        LOG_LOG_ALLDEL = 8,                // LogAll Delete
        LOG_SETUP_SYS = 9,                 // Setup Sys
        LOG_SETUP_TIME = 10,               // Setup Time
        LOG_SETUP_LOG = 11,                // Setup Log
        LOG_SETUP_COMM = 12,               // Setup Comm
        LOG_PASSTIME = 13,                 // Pass Time Set
        LOG_SETUP_DOOR = 14,               // Door Set Log
    };
    //=============== VerifyMode of GeneralLogData ===============//
    public enum enumGLogVerifyMode
    {
        LOG_FPVERIFY = 1,                 // Fp Verify
        LOG_PASSVERIFY = 2,               // Pass Verify
        LOG_CARDVERIFY = 3,               // Card Verify
        LOG_FPPASS_VERIFY = 4,            // Pass+Fp Verify
        LOG_FPCARD_VERIFY = 5,            // Card+Fp Verify
        LOG_PASSFP_VERIFY = 6,            // Pass+Fp Verify
        LOG_CARDFP_VERIFY = 7,            // Card+Fp Verify
        LOG_JOB_NO_VERIFY = 8,            // Job number Verify
        LOG_CARDPASS_VERIFY = 9,          // Card+Pass Verify
        LOG_CLOSE_DOOR = 10,              // Door Close
        LOG_OPEN_HAND = 11,               // Hand Open
        LOG_PROG_OPEN = 12,               // Open by PC
        LOG_PROG_CLOSE = 13,              // Close by PC
        LOG_OPEN_IREGAL = 14,             // Iregal Open
        LOG_CLOSE_IREGAL = 15,            // Iregal Close
        LOG_OPEN_COVER = 16,              // Cover Open
        LOG_CLOSE_COVER = 17,             // Cover Close

        LOG_OPEN_DOOR = 32,               // Door Open
        LOG_OPEN_THREAT = 48,             // Door Open as threat
    };
    //=============== IOMode of GeneralLogData ===============//
    public enum enumGLogIOMode
    {
        LOG_MODE_IO = 0,  // General
        LOG_MODE_IN1 = 1, // IN1
        LOG_MODE_IN2 = 2, // IN2
        LOG_MODE_IN3 = 3, // IN3
        LOG_MODE_OUT1 = 4, // OUT1
        LOG_MODE_OUT2 = 5, // OUT2
        LOG_MODE_OUT3 = 6, // OUT3
    };
    //=============== Machine Privilege ===============//
    public enum enumMachinePrivilege
    {
        MP_NONE = 0,                       // General user
        MP_ALL = 1,                        // Manager
    };
    //=============== Index of  GetDeviceStatus ===============//
    public enum enumGetDeviceStatus
    {
        GET_MANAGERS = 1,
        GET_USERS = 2,
        GET_FPS = 3,
        GET_PSWS = 4,
        GET_SLOGS = 5,
        GET_GLOGS = 6,
        GET_ASLOGS = 7,
        GET_AGLOGS = 8,
        GET_CARDS = 9,
    };
    //=============== Index of  GetDeviceInfo ===============//
    public enum enumGetDeviceInfo
    {
        DI_MANAGERS = 1,                   // Numbers of Manager
        DI_MACHINENUM = 2,                 // Device ID
        DI_LANGAUGE = 3,                   // Language
        DI_POWEROFF_TIME = 4,              // Auto-PowerOff Time
        DI_LOCK_CTRL = 5,                  // Lock Control
        DI_GLOG_WARNING = 6,               // General-Log Warning
        DI_SLOG_WARNING = 7,               // Super-Log Warning
        DI_VERIFY_INTERVALS = 8,           // Verify Interval Time
        DI_RSCOM_BPS = 9,                  // Comm Buadrate
        DI_DATE_SEPARATE = 10,             // Date Separate Symbol
        DI_VERIFY_KIND = 24,               // Verify Kind Symbol
        DI_MULTIUSERS = 77,                // MultiUser
        DI_NETENABLE = 14,                 // Network Enable
        DI_ALARMDELAY = 66,                // Alarm Output Delay Time
        DI_SENSORDELAY = 67,               // Sensor Output Delay Time
        DI_VERIFYFUNC = 25,
        DI_MACADDR0 = 42
    };
    //=============== Baudrate = value of DI_RSCOM_BPS ===============//
    public enum enumBaudrate
    {
        BPS_9600 = 3,
        BPS_19200 = 4,
        BPS_38400 = 5,
        BPS_57600 = 6,
        BPS_115200 = 7,
    };
    //=============== Product Data Index ===============//
    public enum enumProductInfo
    {
        PRODUCT_SERIALNUMBER = 1,     // Serial Number
        PRODUCT_BACKUPNUMBER = 2,     // Backup Number
        PRODUCT_CODE = 3,             // Product code
        PRODUCT_NAME = 4,             // Product name
        PRODUCT_WEB = 5,              // Product web
        PRODUCT_DATE = 6,             // Product date
        PRODUCT_SENDTO = 7,           // Product sendto
    };
    //=============== Door Status ===============//
    public enum enumDoorStatus
    {
        DOOR_CONROLRESET = 0,
        DOOR_OPEND = 1,
        DOOR_CLOSED = 2,
        DOOR_COMMNAD = 3,
    };
    //=============== Error code ===============//
    public enum enumErrorCode
    {
        RUN_SUCCESS = 1,
        RUNERR_NOSUPPORT = 0,
        RUNERR_UNKNOWNERROR = -1,
        RUNERR_NO_OPEN_COMM = -2,
        RUNERR_WRITE_FAIL = -3,
        RUNERR_READ_FAIL = -4,
        RUNERR_INVALID_PARAM = -5,
        RUNERR_NON_CARRYOUT = -6,
        RUNERR_DATAARRAY_END = -7,
        RUNERR_DATAARRAY_NONE = -8,
        RUNERR_MEMORY = -9,
        RUNERR_MIS_PASSWORD = -10,
        RUNERR_MEMORYOVER = -11,
        RUNERR_DATADOUBLE = -12,
        RUNERR_MANAGEROVER = -14,
        RUNERR_FPDATAVERSION = -15,
    };
}
