using Repository.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.iContext
{
    /*
     * manage connection to Medical center table.
     * medical center is a table that stores medical centers property such as name , connection string etc..
      
     */
    public class CommonContext : FrameworkContext
    {
        //public CommonContext() : base("CommonContext")
        //{
        //    Database.CreateIfNotExists();
        //    Database.SetInitializer<CommonContext>(null);
        //    Configuration.LazyLoadingEnabled = true;
        //}
        public CommonContext(string connection) : base(connection)
        {
            Database.CreateIfNotExists();
            Database.SetInitializer<CommonContext>(null);
            Configuration.LazyLoadingEnabled = true;
            ((IObjectContextAdapter)this).ObjectContext.CommandTimeout = 0;
        }
        public DbSet<MedicalCenter> MedicalCenters { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<RolesMedicalCenter> RolesMedicalCenters { get; set; }
        public DbSet<BackupsDB> BackupsDB { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }
    }
}
