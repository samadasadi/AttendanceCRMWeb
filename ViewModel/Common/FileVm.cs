using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Utility;

namespace ViewModel.Basic
{
    public class FileVm
    {
        public Guid Id { get; set; }
        public string Path { get; set; }
        public string FullPath { get; set; }
        public string Extention { get; set; }
        public string FileName { get; set; }
        public int Size { get; set; }
    
        public byte[] Source { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
