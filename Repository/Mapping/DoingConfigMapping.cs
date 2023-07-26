using System.Data.Entity.ModelConfiguration;
using Repository.Model;

namespace Repository.Mapping
{
    public class DoingConfigMapping : EntityTypeConfiguration<Doing>
    {
        public DoingConfigMapping()
        {
            this.HasKey(t => t.Id);
            // Properties


            this.ToTable("tbL_Doing");
        }
    }
}