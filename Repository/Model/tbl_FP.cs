using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    public class tbl_FP
    {
        public Guid ID { get; set; }
        public Guid FC { get; set; }
        public byte[] FP { get; set; }
        public string Type { get; set; }
        public bool Status { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public Guid? DoingUserID { get; set; }
    }
}
