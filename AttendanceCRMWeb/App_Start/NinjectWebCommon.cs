[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(AttendanceCRMWeb.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(AttendanceCRMWeb.App_Start.NinjectWebCommon), "Stop")]

namespace AttendanceCRMWeb.App_Start
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Net.Http;
    using System.Reflection;
    using System.Web;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using Ninject.Web.Common.WebHost;
    using Repository;
    using Repository.iContext;
    using Repository.Infrastructure;
    using Service;
    using Service.Attendance;
    using Service.Common;
    using Service.Cost;
    //using Service.Accounting;
    //using Service.Basic.Classes.Service.EssentialInfo;
    //using Service.BasicInfo;
    //using Service.Common;
    //using Service.Messages;
    //using Service.Report;
    //using Service.score;
    using Service.Security;
    using Service.TaskService;
    using Service.UserManagement;
    using Service.UserManagement.Attendance;
    //using Service.Warehouses;
    //using AttendanceCRMWeb.Areas.BasicInfo.Factories;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application.
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
                RegisterServices(kernel);

                EngineContext.Create();
                EngineContext.Replace(kernel);

                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            CommonHelper.DefaultFileProvider = new NopFileProvider(HostingEnvironment.MapPath("~"));

            var _connstring = ConnectionStringManager.LoadSettings(true);
            if (_connstring == null || !ConnectionStringManager.DatabaseIsInstalled)
            {
                _connstring = new MainConnectionString();
                _connstring.ConnectionString = $"Data Source=.;initial catalog=MinaDB;user id=sa;password=Admin@110;MultipleActiveResultSets=True;";
            }



            // static connection string
            //kernel.Bind<IContextFactory>().To<ContextFactory>().InRequestScope().WithConstructorArgument("connection", "Data Source=.;initial catalog=MinaDB;user id=it;password=Ab123456;MultipleActiveResultSets=True;");
            //kernel.Bind<IContextFactory>().To<ContextFactory>().InRequestScope().WithConstructorArgument("connection", "Name=CommonContext");
            kernel.Bind<IContextFactory>().To<ContextFactory>().InRequestScope().WithConstructorArgument("connection", _connstring.ConnectionString);

            // dynamic connection string
            //kernel.Bind<IContextFactory>().To<ContextFactory>().InRequestScope().WithConstructorArgument("connection", ConnectionString);

            kernel.Bind(typeof(IRepository<>)).To(typeof(MasterRepository<>)).InRequestScope();
            kernel.Bind<ICodingRepository>().To<CodingRepository>();
            kernel.Bind<IUserService>().To<UserService>();
            kernel.Bind<IScheduleTaskService>().To<ScheduleTaskService>();
            kernel.Bind<IGenericAttributeService>().To<GenericAttributeService>();
            kernel.Bind<IAttendanceReportService>().To<AttendanceReportService>();
            kernel.Bind<IShiftService>().To<ShiftService>();
            kernel.Bind<ITransactionRequestService>().To<TransactionRequestService>();
            kernel.Bind<ICodingService>().To<CodingService>();
            kernel.Bind<Service.BasicInfo.IFileService>().To<Service.BasicInfo.FileService>();
            kernel.Bind<IRegisterService>().To<RegisterService>();
            kernel.Bind<IChatService>().To<ChatService>();
            kernel.Bind<IGeneralSettingService>().To<GeneralSettingService>();
            kernel.Bind<ICompanyAccountService>().To<CompanyAccountService>();
            kernel.Bind<IUserGroupService>().To<UserGroupService>();
            kernel.Bind<ICostService>().To<CostService>();
            kernel.Bind<IMCenterService>().To<MCenterService>();
            kernel.Bind<IDeviceInfoService>().To<DeviceInfoService>();

            //kernel.Bind<IScheduleTaskService>().To<TaskService>();
            //kernel.Bind<IScheduleTask>().To<QueuedMessagesSendTask>();
            //kernel.Bind<IDentRepository>().To<DentRepository>();
            //kernel.Bind<IWorkFlowRepository>().To<WorkFlowRepository>();
            //kernel.Bind<IAnnouncementsService>().To<AnnouncementsService>();
            //kernel.Bind<IAttendanceService>().To<AttendanceService>();
            //kernel.Bind<IAvanakService>().To<AvanakService>();
            //kernel.Bind<IBackupsDBService>().To<BackupsDBService>();
            //kernel.Bind<ICallerHistoryService>().To<CallerHistoryService>();
            //kernel.Bind<Service.Basic.Classes.Service.EssentialInfo.IFileService>().To<Service.Basic.Classes.Service.EssentialInfo.FileService>();
            //kernel.Bind<ICheckService>().To<CheckService>();
            //kernel.Bind<IClubService>().To<ClubService>();
            //kernel.Bind<ICommunicationService>().To<CommunicationService>();
            //kernel.Bind<ICustomerClubService>().To<CustomerClubService>();
            //kernel.Bind<ICustomerDocumentService>().To<CustomerDocumentService>();
            //kernel.Bind<ICustomerInfoService>().To<CustomerInfoService>();
            //kernel.Bind<IDescriptionToothService>().To<DescriptionToothService>();
            //kernel.Bind<IFieldDynamicPatientService>().To<FieldDynamicPatientService>();
            //kernel.Bind<IHolidayService>().To<HolidayService>();
            //kernel.Bind<IInsuranceCashService>().To<InsuranceCashService>();
            //kernel.Bind<IInsuranceService>().To<InsuranceService>();
            //kernel.Bind<IMedicalCenterService>().To<MedicalCenterService>();
            //kernel.Bind<IMultiInsertFormService>().To<MultiInsertFormService>();
            //kernel.Bind<INotebookService>().To<NotebookService>();
            //kernel.Bind<IOptionService>().To<OptionService>();
            //kernel.Bind<IPatientAccountService>().To<PatientAccountService>();
            //kernel.Bind<IPhoneBookService>().To<PhoneBookService>();
            //kernel.Bind<IPregnancyCalculatorService>().To<PregnancyCalculatorService>();
            //kernel.Bind<IPrescriptionService>().To<PrescriptionService>();
            //kernel.Bind<IProfileService>().To<ProfileService>();
            //kernel.Bind<IRolesMedicalCenterService>().To<RolesRolesMedicalCenterService>();
            //kernel.Bind<ISearchService>().To<SearchService>();
            //kernel.Bind<ISMSDraftService>().To<SMSDraftService>();
            //kernel.Bind<ISMSService>().To<SMSService>();
            //kernel.Bind<Itbl_DragService>().To<tbl_DragService>();
            //kernel.Bind<ITherapyService>().To<TherapyService>();
            //kernel.Bind<ITNPrescriptionService>().To<TNPrescriptionService>();
            //kernel.Bind<IUsersService>().To<UsersService>();
            //kernel.Bind<IWorkFlowService>().To<WorkFlowService>();
            //kernel.Bind<IDynamicReportService>().To<DynamicReportService>();
            //kernel.Bind<IAwardService>().To<AwardService>();
            //kernel.Bind<IRequestCustomerClubVisitTimeService>().To<RequestCustomerClubVisitTimeService>();
            //kernel.Bind<IScoringService>().To<ScoringService>();
            //kernel.Bind<IUserRateHistoryService>().To<UserRateHistoryService>();
            //kernel.Bind<ISindhWarehouseService>().To<SindhWarehouseService>();
            //kernel.Bind<IWarehouseLogInService>().To<WarehouseLogInService>();
            //kernel.Bind<IWarehousesCodingService>().To<WarehousesCodingService>();
            //kernel.Bind<INotificationService>().To<NotificationService>();
            //kernel.Bind<ILaboratoryShelfService>().To<LaboratoryShelfService>();
            //kernel.Bind<IAccountService>().To<AccountingService>();
            //kernel.Bind<IAccontingAssetService>().To<AccontingAssetService>();
            //kernel.Bind<IAdvancedChartDentService>().To<AdvancedChartDentService>();


            kernel.Bind<IScheduleTaskRunner>().To<ScheduleTaskRunner>();
            kernel.Bind<ITaskScheduler>().To<TaskManager>().InSingletonScope();
            kernel.Bind<ITaskScheduler>().To<TaskManager>().InSingletonScope();
            kernel.Bind<ObservableCollection<ITaskScheduler>>().ToConstructor(x => new ObservableCollection<ITaskScheduler>(x.Inject<IList<ITaskScheduler>>()));
            kernel.Bind<ITaskScheduler>().To<TaskManager>().InSingletonScope().WithConstructorArgument("httpClientFactory", HttpClientFactory.Create());

            //kernel.Bind<IAccountingModelFactory>().To<AccountingModelFactory>();
            //kernel.Bind<IAccountingWarehouseService>().To<AccountingWarehouseService>();
            kernel.Bind<IWebHelper>().To<WebHelper>();
        }
    }
}