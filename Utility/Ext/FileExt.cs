using System.IO;
using System.Web;

namespace Utility.Ext
{
    public static class FileExt
    {
        public static FileInfo GetFileInfo(this HttpPostedFileBase file)
        {
            var res = new FileInfo();
            long lengh = file.InputStream.Length;
            res.Source = new byte[lengh];
            file.InputStream.Read(res.Source, 0, (int)lengh);
            res.FileName = file.FileName;
            res.Extention=Path.GetExtension(file.FileName);
            res.Size = file.ContentLength;
            return res;
        }
    }

    public class FileInfo
    {
        public byte[] Source { get; set; }
        public string Extention { get; set; }
        public string FileName { get; set; }
        public int Size { get; set; }
    }
}