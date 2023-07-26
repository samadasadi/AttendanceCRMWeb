
namespace Repository.Model
{
       
    public partial class PubUserGroup:BaseClass
    {
        public string Name { get; set; }
        public string EnName { get; set; }
        public System.Guid CreatorId { get; set; }
    }
}
