using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.EXT;
using Utility;
using Utility.PublicEnum.Attendance;

namespace ViewModel.UserManagement.Attendance
{
    public class NewDeviceVm:PageingParamer
    {
        public NewDeviceVm()
        {
            biometricTypes = new List<string>();
            deviceHardwareInfo = new DeviceHardwareInformation();
        }
        //public int index { get; set; }
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public int? Code { get; set; }
        public string DeviceFullName { get { return this.Name + " - " + this.Code; } }

        public int? port { get; set; }

        [StringLength(15)]
        public string IP { get; set; }
        public int CommonKey { get; set; }

        public int? Pass { get; set; }

        public byte? VorodCode { get; set; }

        public byte? khorojCode { get; set; }

        public byte? TaradodCode { get; set; }

        public byte? MorakhasiCode { get; set; }

        public byte? MamoriyatCode { get; set; }

        public byte? Naharcode { get; set; }

        public byte? Laststatus { get; set; }

        [StringLength(20)]
        public string LastTimeExport { get; set; }
        public DateTime? LastTimeExportEn { get; set; }
        public int? LastImportLogCount { get; set; }
        public string Status { get { return IsDeleted ? "حذف شده" : "فعال"; } }
        public bool GetAutoData { get; set; }
        public bool IsConected { get; set; }
        public string IsConectedStr { get { return IsConected ? "متصل" : "قطع"; } }
        public int? GroupId { get; set; }
        public bool Selected { get; set; }

        public string SerialNumber { get; set; }
        public string UrlData { get; set; }

        #region SDK Prop
        public int iMachineNumber { get { return this.Id; } }
        public int idwErrorCode = 0;
        public int iDeviceTpye = 1;
        public List<string> biometricTypes { get; set; }
        public string BiometricType { get; set; }
        #endregion

        public int? adminCnt { get; set; }
        public int? userCount { get; set; }
        public int? fpCnt { get; set; }
        public int? recordCnt { get; set; }
        public int? pwdCnt { get; set; }
        public int? oplogCnt { get; set; }
        public int? faceCnt { get; set; }
        public DeviceHardwareInformation deviceHardwareInfo { get; set; }

        public Guid TransactionPeriod { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }




        public int gnCommHandleIndex { get; set; }
        public FPDeviceType FPDeviceType { get; set; }
        public List<NormalJsonClass> FPDeviceTypeList { get { return EnumHelper<FPDeviceType>.EnumToNormalJsonClass(); } }


    }
    public class DeviceHardwareInformation
    {
        public string sFirmver { get; set; }
        public string sMac { get; set; }
        public string sPlatform { get; set; }
        public string sSN { get; set; }
        public string sProductTime { get; set; }
        public string sDeviceName { get; set; }
        public int iFPAlg { get; set; }
        public int iFaceAlg { get; set; }
        public string sProducter { get; set; }
        public bool InfoLoaded { get; set; }
    }

    public class NewDevice_Small
    {
        public int idn { get; set; }
        public string Name { get; set; }
        public int? Code { get; set; }
        public string IP { get; set; }
    }
    public class ImportDeviceLogData
    {
        public ImportDeviceLogData()
        {
            DisConnectDevice = new List<NewDevice_Small>();
            ImportLogDevice = new List<NewDevice_Small>();
            NotPingedDevice = new List<NewDevice_Small>();
        }
        public List<NewDevice_Small> DisConnectDevice { get; set; }
        public List<NewDevice_Small> ImportLogDevice { get; set; }
        public List<NewDevice_Small> NotPingedDevice { get; set; }
    }
}
