using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model.Common
{
    public class BackUp : BaseClass
    {
        public string LocalPath { get; set; }
        public Guid UserId { get; set; }
        public string FileName { get; set; }
        public int Type { get; set; }
        public int FileSize { get; set; }
    }
}
