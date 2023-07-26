
using System;

namespace Repository.Model
{
    
    public partial class PubRole: BaseClass
    {
        public string FaName { get; set; }
        public string EnName { get; set; }
        public int Priority {  get; set; }
        public Guid? CreatorId { get; set; }
        public string groupName { get; set; }
        public Guid? ParentId { get; set; }
    }
}
