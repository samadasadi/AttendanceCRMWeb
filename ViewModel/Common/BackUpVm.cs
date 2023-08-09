using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.Common
{
    public class BackUpVm
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedDateStr
        {
            get
            {
                return ModifiedDate != null ? DateTimeOperation.M2S(ModifiedDate) : "";
            }
            set
            {
            }
        }
        public string ServerPath { get; set; }
        public string LocalPath { get; set; }
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string FileName { get; set; }
        public int Type { get; set; }
        public int FileSize { get; set; }
        public string FileSizeStr
        {
            get
            {
                if (FileSize > 1000)
                    return (Math.Round((Double)(FileSize / 1024F), 2) + " GIG");
                else
                    return (FileSize + " MB");
            }
        }

        public byte[] BackupFileData { get; set; }
        public string ContentType { get; set; }
    }
    public class DbInfo
    {
        public string Name { get; set; }
        public int Size { get; set; }
    }
}
