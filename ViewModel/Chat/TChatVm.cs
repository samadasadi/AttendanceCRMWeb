using Repository.Model.Chat;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.Chat
{
    public class TChatVm
    {
        public TChatVm()
        {
            this.deleted = DeleteModeEnum.NotDeleted;
        }
        public int id { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime ModifiedDate { get; set; }


        public int totalRow { get; set; }
        public int row { get; set; }

        public int fromId { get; set; }
        public int toId { get; set; }
        [Required]
        [StringLength(1000)]
        public string message { get; set; }
        public MessageModeEnum messageMode { get; set; }
        [StringLength(1000)]
        public string extra { get; set; }
        public bool viewed { get; set; }
        public DateTime createDate { get; set; }
        //public string createDateStr_En { get { return this.createDate.ToString("MM/dd/yyyy HH:mm:ss"); } }
        public string createDateStr_En { get { return this.createDate.ToString("MM/dd/yyyy HH:mm:ss"); } }
        internal DeleteModeEnum deleted { get; set; }
        public string tabId { get; set; }
    }
}
