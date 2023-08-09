namespace Repository.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("NewDevice")]
    public class NewDevice
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public int? Code { get; set; }

        public int? port { get; set; }

        [StringLength(15)]
        public string IP { get; set; }

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

        public DateTime ModifiedDate { get; set; }

        public bool IsDeleted { get; set; }

        public bool GetAutoData { get; set; }

        public int? GroupId { get; set; }

        [StringLength(150)]
        public string SerialNumber { get; set; }

        public int? adminCnt { get; set; }

        public int? userCount { get; set; }

        public int? fpCnt { get; set; }

        public int? recordCnt { get; set; }

        public int? pwdCnt { get; set; }

        public int? oplogCnt { get; set; }

        public int? faceCnt { get; set; }

        public DateTime? LastTimeExportEn { get; set; }

        public int? LastImportLogCount { get; set; }
    }
}
