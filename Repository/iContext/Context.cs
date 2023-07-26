
using Repository.Model;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Repository.Mapping;
using Repository.Model.Chat;
using System;
using Repository.Model.Common;
using Repository.Model.Attendance;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;

namespace Repository.iContext
{
    public partial class Context : FrameworkContext
    {
        public Context(string connection) : base(connection)
        {
            //Database.CreateIfNotExists();
            Database.SetInitializer<Context>(null);
            Configuration.LazyLoadingEnabled = true;

            ((IObjectContextAdapter)this).ObjectContext.CommandTimeout = 0; // seconds

        }
        public DbSet<File> Files { get; set; }
        public DbSet<PubUser> PubUsers { get; set; }
        public DbSet<PubMenu> PubMenus { get; set; }
        public DbSet<PubRole> PubRoles { get; set; }
        public DbSet<UserInRole> UserInRoles { get; set; }
        public DbSet<PubUserGroup> PubUserGroups { get; set; }
        public DbSet<GeneralSetting> GeneralSettings { get; set; }
        public DbSet<Coding> Codings { get; set; }
        public DbSet<Tbl_Cost> Tbl_Costs { get; set; }
        public DbSet<Cost_Incoming> Cost_Incomings { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<tbl_Attendance> tbl_Attendance { get; set; }

        public virtual DbSet<ScheduleTask> ScheduleTask { get; set; }
        public virtual DbSet<GenericAttribute> GenericAttribute { get; set; }
        public virtual DbSet<TransactionRequest> TransactionRequest { get; set; }
        public virtual DbSet<TimeRecords> TimeRecord { get; set; }
        public virtual DbSet<ShiftWork> ShiftWork { get; set; }
        public virtual DbSet<PubUser_Shift> PubUser_Shift { get; set; }
        public virtual DbSet<PersonHoghogh> PersonHoghogh { get; set; }
        public virtual DbSet<JobTime> JobTime { get; set; }
        public virtual DbSet<Calendar> Calendar { get; set; }
        public virtual DbSet<TransactionValue> TransactionValue { get; set; }
        public virtual DbSet<NewDevice> NewDevice { get; set; }
        public virtual DbSet<FingerTemplate> FingerTemplate { get; set; }
        public virtual DbSet<EmployeeAccounting> EmployeeAccounting { get; set; }
        public virtual DbSet<TChat> TChats { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Configurations.Add(new DoingConfigMapping());


            modelBuilder.Entity<JobTime>()
                .Property(e => e.TimeShenavar)
                .IsFixedLength();

            modelBuilder.Entity<NewDevice>()
                .Property(e => e.IP)
                .IsUnicode(false);

            modelBuilder.Entity<NewDevice>()
                .Property(e => e.LastTimeExport)
                .IsUnicode(false);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.HoghoghePaye)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.PadasheBahrevari)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.EKarZarib)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.HagheMaskan)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.Nahar)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.Sobhane)
                .HasPrecision(18, 0);

            modelBuilder.Entity<PersonHoghogh>()
                .Property(e => e.AyaboZahab)
                .HasPrecision(18, 0);

            //modelBuilder.Entity<GeneralSetting>()
            //    .Property(e => e.appEnTitle)
            //    .IsUnicode(false);

            //modelBuilder.Entity<GeneralSetting>()
            //    .Property(e => e.appFaxNo)
            //    .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appEnAddress)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appLogoFileName)
                .IsUnicode(false);

            //modelBuilder.Entity<GeneralSetting>()
            //    .Property(e => e.appEmail)
            //    .IsUnicode(false);

            //modelBuilder.Entity<GeneralSetting>()
            //    .Property(e => e.appWebsite)
            //    .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appImageRootPath)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appBackupPath)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appDocNoStart)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appCallerIDCityCode)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appLastBackupDate)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appSmsWebUN)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appSmsWebPW)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appSmsWebPN)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appDefaultScanner)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appRollPrinterName)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appHostIp)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appImageUrl)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appPosIp)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.appClinicAccountNo)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.LastUpdateSMSInbox)
                .IsUnicode(false);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.P_GovernmentK)
                .HasPrecision(18, 0);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.P_NongovernmentalK)
                .HasPrecision(18, 0);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.P_CharityK)
                .HasPrecision(18, 0);

            modelBuilder.Entity<GeneralSetting>()
                .Property(e => e.P_PrivateK)
                .HasPrecision(18, 0);

            modelBuilder.Entity<tbl_Attendance>()
                .Property(e => e.Status)
                .IsFixedLength();

            modelBuilder.Entity<Coding>()
                .Property(e => e.UserCode)
                .IsUnicode(false);

            modelBuilder.Entity<Coding>()
                .Property(e => e.tag)
                .IsUnicode(false);

            modelBuilder.Entity<Coding>()
                .Property(e => e.index)
                .IsUnicode(false);

            modelBuilder.Entity<Coding>()
                .Property(e => e.Price)
                .IsUnicode(false);

            modelBuilder.Entity<Tbl_Cost>()
                .Property(e => e.CostCode)
                .IsUnicode(false);

            modelBuilder.Entity<Tbl_Cost>()
                .Property(e => e.Price)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Cost_Incoming>()
                .Property(e => e.costInCode)
                .IsUnicode(false);

            modelBuilder.Entity<Cost_Incoming>()
                .Property(e => e.Price)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Cost_Incoming>()
                .Property(e => e.cost)
                .HasPrecision(18, 0);










        }
    }
}

