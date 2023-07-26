using Utility.PublicEnum;

namespace Repository.Model
{
    public partial class PubMenu : BaseClass
    {
        public string Url { get; set; }
        public System.Guid ParentId { get; set; }
        public string EnName { get; set; }
        public string FaName { get; set; }
        //public string Name { get { return FaName; } }
        public int Priority { get; set; }
        public string Icon { get; set; }
        public System.Guid RoleId { get; set; }
        public bool IsVisible { get; set; }
        public System.Guid CreatorId { get; set; }
        public PubMenuEnum ItemType { get; set; }
    }
}
