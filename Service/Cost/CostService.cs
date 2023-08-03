using Newtonsoft.Json;
using Repository.iContext;
using Repository.Model;
using Repository;
using Service.BasicInfo;
using Service.Common;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.PublicEnum;
using Utility.Utitlies;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;

namespace Service.Cost
{
    public interface ICostService
    {
        Task<Tbl_Cost> SaveCost(CostVm model);
        Task<DataModel> Delete(Guid Id);
        Task<Tbl_Cost> CheckCompanyAccount(CostVm model);

        Task<IEnumerable<CostVm>> GetAll(FilterModelCost model);

        Task<int> CountAll_GetAll(FilterModelCost model);

        Task<CostVm> GetCostVm(Guid? id);
        Task<Repository.Model.Tbl_Cost> GetCostById(Guid id);
        Task<List<NormalJsonClass>> GetCostCodeList();
        Task<List<NormalJsonClass>> GetCostCodeList(int level);
        Task<List<NormalJsonClass>> GetPersonList();
        Task<List<NormalJsonClass>> GetList(string parentId, string selected = null);

        Task<List<NormalJsonClass>> GetListCompany(string parentId);
        Task<List<NormalJsonClass>> GetListForCombo(string parentId, string selected = null);
        Task<List<NormalJsonClass>> GetListCompanyWithOtherCode(string parentId, string selected = null);

        Task<string> GetAllUserName(Guid? id);
        Task<string> GetGeneralSettingLogo();

        Task<viewModel<CostVm>> GetDoctorCostList(TherapyFilterVm value);
        Task<int> CountAll_DoctorCostList(TherapyFilterVm value);

        Task<DataModel> UpdateCostAccountCollectionId(CostVm entity);
    }

    public class CostService : ICostService
    {
        private readonly IRepository<Tbl_Cost> _repo;
        private readonly IRepository<Cost_Incoming> _CostIncomingRepo;
        private readonly IRepository<PubUser> _PubUserrepo;
        private readonly ICodingService _Codingrepo;
        private readonly IRepository<Coding> _codingrepository;
        private readonly ICompanyAccountService _CompanyAccountService;
        private readonly IRepository<GeneralSetting> _generalSettingrepo;
        private readonly IFileService _fileService;

        private Context _context;

        public CostService(IContextFactory contextFactory,
            IRepository<Tbl_Cost> repo,
            ICodingService Codingrepo,
            IRepository<PubUser> PubUserrepo,
            ICompanyAccountService CompanyAccountService,
            IRepository<Cost_Incoming> CostIncomingRepo,
            IRepository<Coding> codingrepository,
            IFileService fileService,
            IRepository<GeneralSetting> generalSettingrepo
            )
        {
            var currentcontext = contextFactory.GetContext();
            _context = currentcontext;

            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _repo.DbFactory = contextFactory;


            _generalSettingrepo = generalSettingrepo;
            _generalSettingrepo.FrameworkContext = currentcontext;
            _generalSettingrepo.DbFactory = contextFactory;

            _PubUserrepo = PubUserrepo;
            _PubUserrepo.FrameworkContext = currentcontext;
            _PubUserrepo.DbFactory = contextFactory;

            _CostIncomingRepo = CostIncomingRepo;
            _CostIncomingRepo.FrameworkContext = currentcontext;
            _CostIncomingRepo.DbFactory = contextFactory;

            _codingrepository = codingrepository;
            _codingrepository.FrameworkContext = currentcontext;
            _codingrepository.DbFactory = contextFactory;

            _fileService = fileService;

            _CompanyAccountService = CompanyAccountService;
            _Codingrepo = Codingrepo;

        }


        public async Task<Tbl_Cost> SaveCost(CostVm model)
        {
            try
            {
                Guid UserId = Public.CurrentUser.Id;

                var _result = new Tbl_Cost();
                if (model.Id != Guid.Empty)
                {
                    var _cost = await _repo.Find(model.Id);
                    if (_cost != null)
                    {
                        //edit
                        _result = Mapping.GenericMapping<CostVm, Tbl_Cost>.Map(model);
                        _result.UserID = UserId;
                        _result.IsEmployeeAccount = _cost.IsEmployeeAccount;
                        _result.EmployeeAccountId = _cost.EmployeeAccountId;

                        _result.DiscountPrice = model.DiscountPrice;
                        _result.CommissionAmount = model.CommissionAmount;
                        _result.TransportCost = model.TransportCost;
                        _result.AccountingCollection_Id = model.AccountingCollection_Id;

                        await _repo.Detached(_cost);
                        await _repo.Update(_result);
                    }
                }
                else
                {
                    //create
                    _result = Mapping.GenericMapping<CostVm, Tbl_Cost>.Map(model);
                    _result.UserID = UserId;
                    _result.Type = CostType.Cost;
                    await _repo.Add(_result);
                }



                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }




        public async Task<DataModel> Delete(Guid Id)
        {
            //اسناد انبار (Type=3)
            //طرفهای حساب (Type=2)
            //هزینه معمولی (Type=1)
            var cost = await _repo.Find(Id);
            if (cost.Type == CostType.CompanyAccount)
            {
                await _repo.LogicalDelete(m => m.Id == Id);
                var CompanyAccountId = cost.costRefIncomeID;
                var CompanyAccount = await _CostIncomingRepo.Find(CompanyAccountId);
                CompanyAccount.Exported = false;
                CompanyAccount.Selected = false;
                await _CostIncomingRepo.Update(CompanyAccount);


                if (CompanyAccount.IsEmployeeAccount)
                {
                    //برگشت به لیست طرف های حساب
                    var _query = string.Format(@" update EmployeeAccounting set Uploaded = 1, UploadType = 'cost_incoming' where Id = '{0}' ", CompanyAccount.EmployeeAccountId);
                    await _repo.ExecuteSqlCommand(_query);
                }
            }
            else if (cost.Type == CostType.Warehouse)
            {
                await _repo.LogicalDelete(m => m.Id == Id);
                var WarehouseHeaderId = cost.RefvchhdrID;
            }
            else
            {
                if (cost.IsEmployeeAccount)
                {
                    var _query = string.Format(@" update EmployeeAccounting set Uploaded = 0, UploadType = null where Id = '{0}' ", cost.EmployeeAccountId);
                    await _repo.ExecuteSqlCommand(_query);
                }
                var _query_2 = $"delete from CheckTransaction where [Entity_Id] = N'{Id}'";
                await _repo.ExecuteSqlCommand(_query_2);
                await _repo.LogicalDelete(m => m.Id == Id);
            }


            return new DataModel();
        }
        public async Task<Tbl_Cost> CheckCompanyAccount(CostVm model)
        {
            var CompanyAccount = await _CostIncomingRepo.Find(model.Id);
            CompanyAccount.Exported = true; /*/  .صادر شده به هزینه ها*/
            CompanyAccount.Selected = true;

            await _CostIncomingRepo.Update(CompanyAccount);

            var res = new Tbl_Cost
            {
                //اسناد انبار (Type=3)
                //طرفهای حساب (Type=2)
                //هزینه معمولی (Type=1)
                Type = CostType.CompanyAccount,
                CostCode = CompanyAccount.costInCode,
                Price = CompanyAccount.Price,
                Factor_No = CompanyAccount.Factor_No,
                //DateEn = CompanyAccount.DateEn,
                DateEn = model.CostDateEn ?? CompanyAccount.DateEn,
                UserID = Public.CurrentUser.Id,
                costRefIncomeID = model.Id,
                Coment = CompanyAccount.Coment,
                costPersonID = CompanyAccount.costPersonID,
                Autoid = 0,
                IsEmployeeAccount = CompanyAccount.IsEmployeeAccount,
                EmployeeAccountId = CompanyAccount.EmployeeAccountId,

                DiscountPrice = CompanyAccount.DiscountPrice,
                TransportCost = CompanyAccount.TransportCost,

                AccountingCollection_Id = model.AccountingCollection_Id,
                CommissionAmount = model.CommissionAmount,
            };
            await _repo.Add(res);


            if (CompanyAccount.IsEmployeeAccount)
            {
                //انتقال به لیست هزینه ها
                var _query = string.Format(@" update EmployeeAccounting set Uploaded = 1, UploadType = 'cost' where Id = '{0}' ", CompanyAccount.EmployeeAccountId);
                await _repo.ExecuteSqlCommand(_query);
            }

            return res;
        }



        public async Task<IEnumerable<CostVm>> GetAll(FilterModelCost model)
        {
            try
            {
                var _query = $"EXEC [dbo].[getListCosts] " +
                    $"@fromDate = N'{model.FromDate.ToShortDateString()}'," +
                    $"@toDate = N'{model.ToDate.ToShortDateString()}'," +
                    $"@From = {model.From_PageNum}," +
                    $"@To = {model.To_PageNum}," +
                    $"@sortType = {(int)model.SortType}," +
                    $"@text = {(string.IsNullOrEmpty(model.Search) ? "NULL" : "N'" + model.Search + "'")}";

                var res = (await _repo.RunQuery<CostVm>(_query)).ToList();
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> CountAll_GetAll(FilterModelCost model)
        {
            var _query = "EXEC [dbo].[CountAll_getListCosts] " +
                $"@fromDate = N'{model.FromDate}', " +
                $"@toDate = N'{model.ToDate}'," +
                $"@text = {(string.IsNullOrEmpty(model.text) ? "NULL" : "N'" + model.text + "'")}";

            return await _repo.RunQuery_int(_query);
        }

        public async Task<IEnumerable<CompanyAccountVm>> GetCompanyAccount(FilterModelCompanyAccount model)
        {
            return await _CompanyAccountService.GetAllAsync(model);
        }

        public async Task<List<NormalJsonClass>> GetCostCodeList()
        {
            try
            {
                var _res = (await _Codingrepo.GetAllChild((("0" + (int)CodingEnum.CostList).ToString()), 3)).ToList();
                var _result = (from item in _res
                               select new NormalJsonClass()
                               {
                                   Text = item != null ? item.name : "",
                                   Value = item != null ? item.code : "",
                               }).ToList();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<NormalJsonClass>> GetPersonList()
        {
            var res = (await _PubUserrepo.Get(m => m.IsDeleted == false &&
                                            m.UserType == ("0" + (int)CodingEnum.Reception).ToString() && m.UserType ==
                                            ("0" + (int)CodingEnum.Doctor).ToString())).Select(z => new NormalJsonClass
                                            {
                                                Text = z.Name + " " + z.Family,
                                                Value = z.Id.ToString()
                                            }).ToList();
            return res;
        }
        public async Task<CostVm> GetCostVm(Guid? id)
        {
            var model = new CostVm();
            if (id == null)
            {
                model.CostCodeList = await GetCostCodeList(1);
                model.PersonList = await GetPersonList();
            }
            else
            {
                var cost = await _repo.Find(id);
                model = Mapping.GenericMapping<Tbl_Cost, CostVm>.Map(cost);
                model.CostCodeList = await GetCostCodeList(1);
                if ((model.CostCode == "015010101") || (model.CostCode == "0" + ((int)CodingEnum.Doctor).ToString()))
                {
                    model.PersonList = await GetList("DocCode");
                }
                else if ((model.CostCode == "015010102" || model.CostCode == "015010103") || (model.CostCode == "0" + ((int)CodingEnum.Assistant).ToString()))
                {
                    model.PersonList = await GetList("PersonnelCode");
                }
                else if (model.CostCode == "0" + ((int)Utility.PublicEnum.CodingEnum.Company).ToString())
                {
                    model.PersonList = await GetListCompany("015132");
                }
                else
                {
                    model.PersonList = new List<NormalJsonClass>();
                }
            }
            return model;
        }
        public async Task<Tbl_Cost> GetCostById(Guid id)
        {
            var model = new Tbl_Cost();
            if (id == null)
            {
                return model;
            }
            else
            {
                var cost = await _repo.Find(id);
                return cost;
            }
        }
        public async Task<List<NormalJsonClass>> GetList(string parentId, string selected = null)
        {
            if (parentId == "DocCode")
            {
                return (await _PubUserrepo.Get(m => m.UserType == "0" + ((int)CodingEnum.Doctor).ToString() && m.EmployeeActive == true && m.IsDeleted == false))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString(),
                        Selected = !string.IsNullOrEmpty(selected) ? selected.Contains(m.Id.ToString()) : false
                    }).ToList();
            }
            else if (parentId == "PersonnelCode")
            {
                return (await _PubUserrepo.Get(m => m.UserType != "0" + ((int)CodingEnum.Doctor).ToString() && m.EmployeeActive == true && m.IsDeleted == false && m.UserName != "admin"))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString(),
                        Selected = !string.IsNullOrEmpty(selected) ? selected.Contains(m.Id.ToString()) : false
                    }).ToList();
            }
            else
            {
                return (await _PubUserrepo.Get(m => m.UserType == parentId && m.IsDeleted == false))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString()
                    }).ToList();
            }
        }
        public async Task<List<NormalJsonClass>> GetListCompany(string parentId)
        {
            var res = (await _Codingrepo.GetAllChild(("0" + (int)CodingEnum.Company).ToString(), 1))
                .Select(
                z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                }).ToList();
            return res;
        }

        public async Task<string> GetGeneralSettingLogo()
        {
            var generalSetting = (await _generalSettingrepo.Get(m => m.IsDeleted == false)).FirstOrDefault();

            if (generalSetting.FileId != null)
            {
                var _model = _context.Files.FindAsync(generalSetting.FileId.Value).GetAwaiter().GetResult();
                var imgPath = (_model != null ? _model.Path : "");
                return imgPath;
            }
            else
            {
                return Consts.AppSettings.DefaultLogo;
            }
        }
        public async Task<string> GetAllUserName(Guid? id)
        {
            var res = await _PubUserrepo.Find(id);
            return (res != null ? res.Name + " " + res.Family : "");
        }


        public async Task<List<NormalJsonClass>> GetListCompanyWithOtherCode(string parentId, string selected = null)
        {
            return (await _codingrepository.Get(m => (m.code.StartsWith(parentId)) && m.CodeActive == true && m.code != parentId)).Select(z => new NormalJsonClass
            {
                Text = z.name,
                Value = z.code.ToString(),
                Selected = !string.IsNullOrEmpty(selected) ? selected.Contains(z.code) : false
            }).ToList();
        }
        public async Task<List<NormalJsonClass>> GetCostCodeList(int level)
        {
            List<NormalJsonClass> lstres = (await _codingrepository.Get(m => (m.code.StartsWith("01501") || m.code.StartsWith("01502")) && m.CodeActive == true && m.level == 4))
            .Select(z => new NormalJsonClass
            {
                Text = z.name,
                Value = z.code.ToString(),
            }).ToList();
            var company = (await _codingrepository.Get(m => (m.code == "0" + ((int)CodingEnum.Company).ToString()) && m.CodeActive == true)).FirstOrDefault();
            if (company != null)
                lstres.Add(new NormalJsonClass
                {
                    Text = company.name,
                    Value = company.code.ToString(),
                });
            var lab = (await _codingrepository.Get(m => (m.code == "0" + ((int)CodingEnum.CostLabretory).ToString()) && m.CodeActive == true)).FirstOrDefault();
            if (lab != null)
                lstres.Add(new NormalJsonClass
                {
                    Text = lab.name,
                    Value = lab.code.ToString(),
                });
            lstres.Add(new NormalJsonClass
            {
                Text = "پزشک معاینه",
                Value = "0" + ((int)Utility.PublicEnum.CodingEnum.DoctorsRights).ToString(),
            });
            lstres.Add(new NormalJsonClass
            {
                Text = "دستیار معاینه",
                Value = "0" + ((int)Utility.PublicEnum.CodingEnum.StaffSalaries).ToString(),
            });
            return lstres;
        }
        public async Task<List<NormalJsonClass>> GetListForCombo(string parentId, string selected = null)
        {
            var res = (await _Codingrepo.GetAllChild(parentId, 1)).Select(
                z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                    Selected = !string.IsNullOrEmpty(selected) ? selected.Contains(z.code) : false
                }).ToList();
            return res;
        }

        public async Task<viewModel<CostVm>> GetDoctorCostList(TherapyFilterVm value)
        {
            try
            {
                var _model = new viewModel<CostVm>();
                _model.T_model = new CostVm();
                _model.TLists = new List<CostVm>();

                string _query = String.Format(" exec sp_GetDoctorCostList " +
                    "@doctorId ='{0}', " +
                    "@From ='{1}', " +
                    "@To ='{2}', " +
                    "@Text ={3}, " +
                    "@FromDate ='{4}', " +
                    "@ToDate ='{5}' ",
                    value.Id,
                    (value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize)),
                    value.PageNum * value.PageSize,
                    !string.IsNullOrEmpty(value.Text) ? "'" + value.Text + "'" : "NULL",
                    value.FromDate.ToString("yyyy-MM-dd"),
                    value.ToDate.ToString("yyyy-MM-dd"));

                _model.TLists = (await _repo.RunQuery<CostVm>(_query)).ToList();




                _query = String.Format(" exec sp_GetDoctorCostAccounting " + "@doctorId ='{0}'", value.Id);

                _model.T_model = (await _repo.RunQuery<CostVm>(_query)).ToList().FirstOrDefault();
                _model.T_model.Id = value.Id;


                return _model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> CountAll_DoctorCostList(TherapyFilterVm value)
        {
            try
            {

                string _query = String.Format(" exec CountAll_GetDoctorCostList " +
                    "@doctorId ='{0}', " +
                    "@Text ={1}, " +
                    "@FromDate ='{2}', " +
                    "@ToDate ='{3}'",
                    value.Id,
                    !string.IsNullOrEmpty(value.Text) ? "'" + value.Text + "'" : "NULL",
                    value.FromDate.ToString("yyyy-MM-dd"),
                    value.ToDate.ToString("yyyy-MM-dd"));
                return (await _repo.RunQuery_int(_query));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModel> UpdateCostAccountCollectionId(CostVm entity)
        {
            try
            {
                var _query = $"update Tbl_Cost set AccountingCollection_Id =  N'{entity.AccountingCollection_Id}' where Id = N'{entity.Id}'";
                await _repo.ExecuteSqlCommand(_query);
                return new DataModel();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
