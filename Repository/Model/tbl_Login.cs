using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    [Table("tbl_Login")]
    public class tbl_Login
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string UserId { get; set; }
        public string SessionId { get; set; }
        public string IpAddress { get; set; }
        public string OperatingSystem { get; set; }
        public string Browser { get; set; }
        public bool? LoggedIn { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
