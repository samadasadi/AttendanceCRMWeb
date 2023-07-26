using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class ImageScanningSocket
    {
        public static void sendImageScanningToClient(ImageScanningSocket.Action action, string domain, int userId, object data)
        {
            CrmSocket.SendToClient(CrmSocket.Channel.ImageScanning, domain, userId, data);
        }
        public static void sendToClient(ImageScanningSocket.Action action, string domain, int userId, object data)
        {
            CrmSocket.SendToClient(CrmSocket.Channel.ImageScanning, domain, userId, 
                (object)new object[2] {
                    (object) action, 
                    RuntimeHelpers.GetObjectValue(data)
                }
            );
        }
        public enum Action
        {
            SCAN_FINGERPRINT = 0,
            SCAN_RVG = 1,
            SCAN_LIST = 2,
            SCAN_SEARCH_PATIENT = 3,
            SCAN_ATTENDANCE = 4,
        }
    }
}
