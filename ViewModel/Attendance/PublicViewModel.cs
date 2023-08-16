using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.Attendance
{


    public class PagingViewModel
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string Search { get; set; }
        public int DeviceId { get; set; }
        public int GroupId { get; set; }
    }


    public class PublicViewModel
    {
    }


}
