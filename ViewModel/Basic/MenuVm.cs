using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility.PublicEnum;

namespace ViewModel.Basic
{
    public class MenuVm
    {
        public System.Guid Id { get; set; }
        public string EnName { get; set; }
        public string FaName { get; set; }
        //public string Name { get; set; }
        public string Url { get; set; }
        public int Priority { get; set; }
        public System.Guid ParentId { get; set; }
        public string Icon { get; set; }

        public System.Guid RoleId { get; set; }
        public bool IsVisible { get; set; }
        public System.Guid CreatorId { get; set; }

        public PubMenuEnum ItemType { get; set; }
    }
}
