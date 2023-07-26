using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model
{
    public class Task:BaseClass
    {
        public System.Guid RecivierId { get; set; }
        public System.Guid SenderId { get; set; }
        public bool IsDone { get; set; }
        public System.DateTime CreateDate { get; set; }
        public string Name { get; set; }
        public string DetailText { get; set; }
        public string ReplyText { get; set; }
        public bool IsSeen { get; set; }
        public Nullable<System.DateTime> ConfirmDate { get; set; }
    }
}
