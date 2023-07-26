using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    public class File:BaseClass
    {
        public byte[] Source { get; set; } 
        public string Extention { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public int Size { get; set; }
    }
}
