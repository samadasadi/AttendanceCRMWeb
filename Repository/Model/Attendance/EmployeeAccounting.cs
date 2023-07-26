using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model.Attendance
{
    [Table("EmployeeAccounting")]
    public partial class EmployeeAccounting : BaseClass
    {
        public Guid DoingUserId { get; set; }
        public Guid PuUser_Id { get; set; }
        public int PersonelSalariYear { get; set; }
        public int PersonelSalariMonth { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string DataJson { get; set; }
        public string FilterJson { get; set; }
        public bool Uploaded { get; set; }
        public string UploadType { get; set; }
    }
}
