using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    //Create Class By Mobin
    public class Users : BaseClass
    {        
        public string Name { get; set; }
        public string Family { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string DateInsert { get; set; }
        public string DateUpdate { get; set; }
        public Nullable<bool> Gender { get; set; }        
        public byte Role { get; set; }
        public string ActiveCode { get; set; }
        public bool Status { get; set; }
    }
}
