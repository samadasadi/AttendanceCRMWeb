using System;
using System.Drawing;
using System.IO;


namespace Service.FileManagement
{
    public static class FileManagement
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="root">مسیر اصلی زخیره در هارد دیسک</param>
        /// <param name="inputStream">فایل به صورت استریم</param>
        /// <param name="fileExtention">پسوند فایل</param>
        /// <param name="localPath"> dar halate pish farz masire zakhire file ha ~/App_Data/Temp/... mibahsad ... addref foldere dakhele Temp mibashad</param>
        /// <returns></returns>
        public static string SaveFileAndGetPath(string root, Stream inputStream, string fileExtention, string localPath)
        {
            var gui = Guid.NewGuid();
            //var path1 = localPath + "/" + gui + Path.GetExtension(file.FileName);
            var path = Path.Combine(root , gui + fileExtention);
            var byt = new byte[inputStream.Length];
            inputStream.Read(byt, 0, (int)inputStream.Length);
            var fsw = new FileStream(path, FileMode.CreateNew);
            fsw.Write(byt, 0, byt.Length);
            fsw.Flush();
            fsw.Close();
            return localPath+"/" +gui + fileExtention;
        }


        public static ImageSize GetImageSize(string path)
        {
            var img = new Bitmap(path);
            var res = new ImageSize {Height = img.Height, Width = img.Width};
            return res;
        }

        //public string SaveTempJpeg(string root, Stream inputStream, out int w, out int h)
        //{
        //    var fileName = Guid.NewGuid() + ".jpg";
        //    var filePath = root + TempPath + fileName;
        //    using (var image = Image.FromStream(inputStream))
        //    {
        //        var resized = Imager.Resize(image, 533, 400, true);
        //        Imager.SaveJpeg(filePath, resized);

        //        w = resized.Width;
        //        h = resized.Height;
        //        return fileName;
        //    }
        //}
    }
}