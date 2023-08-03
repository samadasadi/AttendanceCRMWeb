using Newtonsoft.Json;
using Repository.iContext;
using Repository.Model;
using Repository;
using Service.Common;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Utility.PublicEnum;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;

namespace Service.Cost
{
    public interface ICompanyAccountService
    {
        Task<IEnumerable<CompanyAccountVm>> GetAllAsync(FilterModelCompanyAccount model);
        Task<int> CountAll_GetAllAsync(FilterModelCompanyAccount model);

        Task<CompanyAccountVm> GetCompanyAccountVmAsync(Guid? id);
        Task<List<NormalJsonClass>> GetCompanyAccountListAsync();
        Task<List<NormalJsonClass>> GetPersonListAsync();
        Task<List<NormalJsonClass>> GetListAsync(string parentId);
        Task<List<NormalJsonClass>> GetListCompanyAsync(string parentId);
        Task<int> CountAll_GetAllWarehouseHeaderAsync(FilterModelCost entity);
        Task<FilterModelCompanyAccount> GetFilterModelCompanyAccountAsync();


        Task<Cost_Incoming> SaveCompanyAccountAsync(CompanyAccountVm model);
        Task<Cost_Incoming> GetCompanyAccountAsync(CompanyAccountVm model);
        System.Threading.Tasks.Task DeleteAsync(Guid Id);
        Task<string> Deletes(string[] Id);

        Task<List<NormalJsonClass>> GetListAccountPartiesAsync(string parentId);
    }
    public class CompanyAccountService : ICompanyAccountService
    {
        private IRepository<Cost_Incoming> _repo;
        private IRepository<Tbl_Cost> _Costrepo;
        private IRepository<PubUser> _PubUserrepo;
        private IRepository<Coding> _Codingrepo;
        private readonly ICodingService _codingService;

        public CompanyAccountService(
            IContextFactory contextFactory,
            IRepository<Cost_Incoming> repo,
            ICodingService Codingrepo,
            IRepository<PubUser> PubUserrepo,
            IRepository<Tbl_Cost> Costrepo,
            IRepository<Coding> CodingVmrepo
            )
        {
            var currentcontext = contextFactory.GetContext();
            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _repo.DbFactory = contextFactory;

            _Codingrepo = CodingVmrepo;
            _Codingrepo.FrameworkContext = currentcontext;
            _Codingrepo.DbFactory = contextFactory;

            _PubUserrepo = PubUserrepo;
            _PubUserrepo.FrameworkContext = currentcontext;
            _PubUserrepo.DbFactory = contextFactory;

            _Costrepo = Costrepo;
            _Costrepo.FrameworkContext = currentcontext;
            _Costrepo.DbFactory = contextFactory;

        }


        public async Task<IEnumerable<CompanyAccountVm>> GetAllAsync(FilterModelCompanyAccount model)
        {
            var preCulture = Thread.CurrentThread.CurrentCulture;

            var _query =
                $"EXEC [dbo].[getListCompanys] " +
                $"@fromDate = N'{model.FromDate.ToString("yyyy-MM-dd")}'," +
                $"@toDate = N'{model.ToDate.ToString("yyyy-MM-dd")}'," +
                $"@From = {model.From_PageNum}," +
                $"@To = {model.To_PageNum}," +
                $"@text = {(string.IsNullOrEmpty(model.Search) ? "NULL" : "N'" + model.Search + "'")}";

            var res = await _repo.RunQuery<CompanyAccountVm>(_query);

            return res;
        }
        public async Task<List<NormalJsonClass>> GetCompanyAccountListAsync()
        {
            return (await _codingService.GetAllChild((("0" + (int)CodingEnum.CostList).ToString()), 4))
                .Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code.ToString(),
                }).ToList();
        }
        public async Task<List<NormalJsonClass>> GetPersonListAsync()
        {
            return (await _PubUserrepo.Get(m => 
                m.IsDeleted == false &&
                m.UserType == ("0" + (int)CodingEnum.Reception).ToString() && 
                m.UserType == ("0" + (int)CodingEnum.Doctor).ToString())
                ).Select(z => new NormalJsonClass
                    {
                        Text = z.Name + " " + z.Family,
                        Value = z.Id.ToString()
                    }).ToList();
        }
        public async Task<CompanyAccountVm> GetCompanyAccountVmAsync(Guid? id)
        {
            if (id == null)
            {
                var model = new CompanyAccountVm
                {
                    CostCodeList = await GetCompanyAccountListAsync(),
                    PersonList = await GetPersonListAsync(),
                };
                return model;
            }
            else
            {
                var model = await _repo.Find(id);
                Mapping.GenericMapping<Cost_Incoming, CompanyAccountVm>.CreateMapping();
                var Accountlist = Mapping.GenericMapping<Cost_Incoming, CompanyAccountVm>.Map(model);
                Accountlist.CostCodeList = await GetCompanyAccountListAsync();

                if (Accountlist.costInCode == "0" + ((int)Utility.PublicEnum.CodingEnum.DoctorsRights).ToString())//پزشک
                {
                    Accountlist.PersonList = await GetListAsync("DocCode");
                }
                else if (model.costInCode == "0" + ((int)Utility.PublicEnum.CodingEnum.StaffSalaries).ToString())//دستیار
                {
                    Accountlist.PersonList = await GetListAsync("PersonnelCode");
                }
                else if (model.costInCode == ("0" + ((int)Utility.PublicEnum.CodingEnum.Company).ToString()))
                {
                    Accountlist.PersonList = await GetListCompanyAsync("0" + ((int)Utility.PublicEnum.CodingEnum.Company).ToString());
                }

                else if (model.costInCode == "0150103")
                {
                    Accountlist.PersonList = await GetListAccountPartiesAsync("");
                }

                else
                {
                    Accountlist.PersonList = new List<NormalJsonClass>();
                }
                return Accountlist;
            }
        }
        public async Task<List<NormalJsonClass>> GetListAsync(string parentId)
        {
            if (parentId == "DocCode")
            {
                return (await _PubUserrepo.Get(m => m.UserType == "0" + ((int)CodingEnum.Doctor).ToString() && m.EmployeeActive == true && m.IsDeleted == false))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString()
                    }).ToList();
            }
            else if (parentId == "PersonnelCode")
            {
                return (await _PubUserrepo.Get(m => m.UserType != "0" + ((int)CodingEnum.Doctor).ToString() && m.EmployeeActive == true && m.IsDeleted == false))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString()
                    }).ToList();
            }
            else if (parentId == "0" + ((int)CodingEnum.Doctor).ToString())
            {
                return (await _PubUserrepo.Get(m =>
                    m.UserType == "0" + ((int)CodingEnum.Doctor).ToString() &&
                    m.EmployeeActive == true &&
                    m.IsDeleted == false))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString()
                    }).ToList();
            }
            else if (parentId != "0" + ((int)CodingEnum.Doctor).ToString())
            {
                return (await _PubUserrepo.Get(m => m.UserType != "0" + ((int)CodingEnum.Doctor).ToString() && m.EmployeeActive == true && m.IsDeleted == false && m.UserName != "admin"))
                    .Select(m => new NormalJsonClass
                    {
                        Text = m.Name + " " + m.Family,
                        Value = m.Id.ToString()
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
        public async Task<List<NormalJsonClass>> GetListCompanyAsync(string parentId)
        {
            List<NormalJsonClass> res = new List<NormalJsonClass>();
            res.AddRange((await _codingService.GetAllChild(("0" + (int)CodingEnum.Company).ToString(), 1))
                .Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                }).ToList());
            res.AddRange((await _codingService.GetAllChild(("0" + (int)CodingEnum.CostLabretory).ToString(), 1))
                .Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                }).ToList());
            return res;
        }

        public async Task<List<NormalJsonClass>> GetListAccountPartiesAsync(string parentId)
        {
            List<NormalJsonClass> res = new List<NormalJsonClass>();
            res.AddRange((await _Codingrepo.Get(p => p.code.StartsWith("0150103") && p.level == 6 &&
            p.CodeActive == true && !p.code.StartsWith(("0" + (int)CodingEnum.Company).ToString()) && !p.code.StartsWith(("0" + (int)CodingEnum.CostLabretory).ToString())))
                .Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                }).ToList());
            return res;
        }

        public async Task<List<NormalJsonClass>> GetCompanyList()
        {
            var res = (await _codingService.GetAllChild(("0" + (int)CodingEnum.Company).ToString(), 1))
                .Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code,
                }).ToList();
            return res;
        }
        public async Task<FilterModelCompanyAccount> GetFilterModelCompanyAccountAsync()
        {
            var model = new FilterModelCompanyAccount
            {
                CostCodeList = await GetCheckNoList(),
            };
            return model;
        }
        public async Task<List<NormalJsonClass>> GetCheckNoList()
        {
            return (await _repo.GetAll()).Select(z => new NormalJsonClass
            {
                Text = z.costInCode,
                Value = z.Id.ToString(),
            }).ToList();
        }



        public async Task<Cost_Incoming> GetCompanyAccountAsync(CompanyAccountVm model)
        {
            try
            {
                if (model.Id == Guid.Empty) return new Cost_Incoming();

                var _model = await _repo.Find(model.Id);
                return _model ?? new Cost_Incoming();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<Cost_Incoming> SaveCompanyAccountAsync(CompanyAccountVm model)
        {
            Guid UserId = Public.CurrentUser.Id;

            var _result = new Cost_Incoming();

            if (model.Id != Guid.Empty)
            {
                var _cost_incoming = await _repo.Find(model.Id);
                if (_cost_incoming != null)
                {
                    //edit
                    _result = Mapping.GenericMapping<CompanyAccountVm, Cost_Incoming>.Map(model);
                    _result.costUserID = UserId;
                    _result.IsEmployeeAccount = _cost_incoming.IsEmployeeAccount;
                    _result.EmployeeAccountId = _cost_incoming.EmployeeAccountId;
                    await _repo.Detached(_cost_incoming);
                    await _repo.Update(_result);
                }
            }
            else
            {
                //create
                _result = Mapping.GenericMapping<CompanyAccountVm, Cost_Incoming>.Map(model);
                _result.costUserID = UserId;
                await _repo.Add(_result);

            }
            return _result;
        }
        
        #region Deletes
        public async System.Threading.Tasks.Task DeleteAsync(Guid Id)
        {
            var costIncomeID = await _Costrepo.Get(m => m.costRefIncomeID == Id && m.IsDeleted == false);
            if (!costIncomeID.Any())
            {
                var cost = await _repo.Find(Id);
                await _repo.LogicalDelete(m => m.Id == Id);

                if (cost.IsEmployeeAccount)
                {
                    var _query = string.Format(@" update EmployeeAccounting set Uploaded = 0, UploadType = null where Id = '{0}' ", cost.EmployeeAccountId);
                    await _repo.ExecuteSqlCommand(_query);
                }
            }
            else
            {
                throw new Exception("این ایتم در ثبت هزینه ها اضافه شده است وامکان حذف وجود ندارد");
            }
        }
        public async Task<string> Deletes(string[] Id)
        {
            string strMessage = "ایتم های روبه رو به دلیل داشتن هزینه امکان حذف ندارند : ";
            bool isCheck = false;
            foreach (var item in Id)
            {
                Guid id = Guid.Parse(item);
                var costIncomeID = await _Costrepo.Get(m => m.costRefIncomeID == id && m.IsDeleted == false);
                if (!costIncomeID.Any())
                {
                    var cost = await _repo.Find(id);
                    await _repo.LogicalDelete(m => m.Id == id);

                    if (cost.IsEmployeeAccount)
                    {
                        var _query = string.Format(@" update EmployeeAccounting set Uploaded = 0, UploadType = null where Id = '{0}' ", cost.EmployeeAccountId);
                        await _repo.ExecuteSqlCommand(_query);
                    }
                }
                else
                {
                    var cost = await _repo.Find(id);
                    if (cost != null)
                    {
                        Guid gud;
                        if (Guid.TryParse(cost.costPersonID, out gud))
                        {
                            var user = await _PubUserrepo.Find(gud);
                            strMessage += (user != null ? user.Name + " " + user.Family : string.Empty) + " - ";
                            isCheck = true;
                        }
                        else
                        {
                            var code = await _Codingrepo.Find(cost.costPersonID);
                            strMessage += (code != null ? code.name : string.Empty) + " - ";
                            isCheck = true;
                        }
                    }
                }
            }
            return isCheck ? strMessage : string.Empty;
        }
        #endregion

        public async Task<int> CountAll_GetAllAsync(FilterModelCompanyAccount model)
        {
            var _query = string.Format(
                "EXEC [dbo].[CountAll_getListCompanys] " +
                "@medicalCenterId = '{0}', " +
                "@fromDate = N'{1}', " +
                "@toDate = N'{2}'," +
                "@text = {3}",
                model.FromDate,
                model.ToDate,
                (string.IsNullOrEmpty(model.Search) ? "NULL" : "N'" + model.Search + "'"));
            return await _repo.RunQuery_int(_query);
        }

        public async Task<int> CountAll_GetAllWarehouseHeaderAsync(FilterModelCost entity)
        {

            var _query = "EXEC [dbo].[CountAll_getListWarehouseHeaderForCompanys]" +
                $"@type = N'{entity.Type}'," +
                $"@text = {(string.IsNullOrEmpty(entity.Search) ? "NULL" : "N'" + entity.Search + "'")}," +
                $"@fromDate = N'{entity.FromDate}'," +
                $"@toDate = N'{entity.ToDate}'";


            return await _repo.RunQuery_int(_query);
        }
    }
}
