using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    public class UserChatHistory
    {
        public string Username { get; set; }
        public DateTime ConnectionDate { get; set; }
        public DateTime LastCheck { get; set; }
    }
}
