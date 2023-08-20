using AutoMapper;
using Repository.iContext;
using Repository.Model;
using Repository;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.ApplicationServices;
using Utility.EXT;
using Utility.PublicEnum;
using Utility.Utitlies;
using Utility;
using ViewModel.BasicInfo;
using ViewModel.UserManagement.Attendance;
using ViewModel.Common;

namespace Service.Common
{
    public interface ICodingService
    {
        Task<List<NormalJsonClass>> GetLaboratoryServiceList();
        Task<List<NormalJsonClass>> GetLaboratoryServiceDetail(string serviceId);
        Task<Coding> SaveNewCode(CodingVm model);
        Task<Coding> SavePreCode(CodingVm model);
        Task<string> Delete(string code);
        Task<IEnumerable<CodingVm>> GetChild(string code);
        Task<IEnumerable<CodingVm>> GetChild(Filter_CodingVm model);
        Task<int> CountAll_GetChild(Filter_CodingVm model);
        Task<CodingVm> GetCode(string code, bool edit);
        Task<IEnumerable<CodingVm>> GetAllChild(string code, int levelNum);
        Task<IEnumerable<CodingVm>> GetAllFormChild(string code, int levelNum);
        Task<IEnumerable<CodingVm>> GetAllFormChild_CustomerTab(string code);
        Task<IEnumerable<CodingVm>> GetAllChildFormBuilderTrue(string code, int levelNum);
        Task<IEnumerable<CodingVm>> GetAllChildWithoutLevel(string code);
        Task<string> GetCodingName(string code);
        Task<IEnumerable<CodingVm>> GetAllChildWhitWorkFlow(string code, int levelNum);
        Task<IEnumerable<CodingVm>> Get(string code);
        Task<IEnumerable<CodingVm>> GetAllChildFormBuilder(string code);
        Task<List<NormalJsonClass>> GetAllInsurance();
        Task<IEnumerable<CodingVm>> GetAllChildFormBuilder(string code, int levelNum);
        Task<Coding> FindByCode(string code);
        Task<IEnumerable<CodingVm>> GetAll();
        Task<List<NormalJsonClass>> GetFormLists();
        Task<List<NormalJsonClass>> GetAccountPartiesList(CodingVm entity);

    }
    public class CodingService : ICodingService
    {
        private readonly ICodingRepository _repo;
        private readonly IRepository<Coding> _repoCoding;
        private readonly IRepository<Tbl_Cost> _Tbl_CostRepo;
        private readonly IRepository<Cost_Incoming> _Cost_IncomingRepo;


        public CodingService(
            IContextFactory contextFactory,
            ICodingRepository repo,
            IRepository<Cost_Incoming> Cost_IncomingRepo,
            IRepository<Profile> profileRepo,
            IRepository<Tbl_Cost> Tbl_CostRepo,
            IRepository<Coding> repoCoding
            )
        {

            var currentcontext = contextFactory.GetContext();

            _repo = repo;
            _repo.FrameworkContext = currentcontext;

            _Tbl_CostRepo = Tbl_CostRepo;
            _Tbl_CostRepo.FrameworkContext = currentcontext;
            _Tbl_CostRepo.DbFactory = contextFactory;

            _Cost_IncomingRepo = Cost_IncomingRepo;
            _Cost_IncomingRepo.FrameworkContext = currentcontext;
            _Cost_IncomingRepo.DbFactory = contextFactory;

            _repoCoding = repoCoding;
            _repoCoding.FrameworkContext = currentcontext;
            _repoCoding.DbFactory = contextFactory;

        }



        public async Task<string> Delete(string code)
        {
            string strMessage = await checkValidateDragInNotDeletedAndUpdated(code);


            #region tbl_Cost_Incoming

             if ((await _Cost_IncomingRepo.CountAll_WithQuery("tbl_Cost_Incoming", "(" + "costCode = '" + code + "' OR costPersonID = '" + code + "') AND IsDeleted = 0 ")) > 0)
                strMessage = "به علت استفاده از این هزینه درخواست قابل حذف نیست";

            #endregion

            #region Tbl_Cost
            else if ((await _Tbl_CostRepo.CountAll_WithQuery("Tbl_Cost", "(" + "CostCode = '" + code + "' OR costPersonID = '" + code + "') AND IsDeleted = 0 ")) > 0)
                strMessage = "به علت استفاده از این هزینه درخواست قابل حذف نیست";
            #endregion

            else if (code == "02401") strMessage = "امکان حذف این درخواست وجود ندارد";

            else if ((code == "0" + ((int)CodingEnum.Company).ToString()) || (code == "0" + ((int)InsuranceEnum.Center).ToString()) || (code == "0" + ((int)CodingEnum.CostLabretory).ToString()) || (code == "015010301") || (code == "0150103"))
                strMessage = "امکان حذف این درخواست وجود ندارد";

            else if ((await _repo.Get(m => m.code.StartsWith(code))).Count() > 1)
                strMessage = "امکان حذف این درخواست  به دلیل وجود زیرمجموعه وجود ندارد";

            else if (code.Equals("0131413"))
                strMessage = "امکان حذف اطفال وجود ندارد";

            else if (code.StartsWith("018"))
                strMessage = "امکان حذف این درخواست وجود ندارد";

            else if (code.StartsWith("01202"))
                strMessage = "امکان حذف این درخواست وجود ندارد";

            else if (code.StartsWith("01201"))
                strMessage = "امکان حذف این درخواست وجود ندارد";


            else if (code.StartsWith("030"))
            {
                await _repo.Delete(m => m.code == code);

            }
            else
            {
                if (code == "0" + ((int)DiscountEnum.AllDiscount).ToString() || code.StartsWith("0" + ((int)InsuranceEnum.InsuranceType).ToString()))
                {
                    strMessage = "امکان حذف این درخواست وجود ندارد";
                }
                else
                {
                    await _repo.Delete(m => m.code == code);
                }
                strMessage = "این درخواست قابل حذف نیست";
            }
            return strMessage;
        }

        /// <summary>
        /// این متد برای این است که به هیچ عنوان نتواند آیتم های دارو یا آزمایش را تغییر بدهد
        /// </summary>
        /// <returns></returns>
        private async Task<string> checkValidateDragInNotDeletedAndUpdated(string code, string strOperationMessage = "حذف")
        {
            if ((await System.Threading.Tasks.Task.FromResult((code == "0" + ((int)PrescriptionEnum.Experiment).ToString()))) ||
                (code == "0" + ((int)PrescriptionEnum.Medicine).ToString()) ||
                (code == "0" + ((int)PrescriptionEnum.MedicineName).ToString()) ||
                (code == "0" + ((int)PrescriptionEnum.MedicineType).ToString()) ||
                (code == "0" + ((int)PrescriptionEnum.MedicineDoz).ToString()) ||
                (code == "0" + ((int)PrescriptionEnum.MedicineCount).ToString()) ||
                (code == "0" + ((int)PrescriptionEnum.MedicineConsumptionInstruction).ToString()))
                return string.Format("امکان {0} این درخواست وجود ندارد", strOperationMessage);
            return string.Empty;
        }

        public async Task<IEnumerable<CodingVm>> GetAll()
        {
            try
            {
                var _centerType = Public.CurrentUser.IsCenterActivityType;

                var _res = (await _repo.Get(m => m.code != "016")).ToList();
                var res = _res.ToList().Select(z => new CodingVm()
                    {
                        code = z.code,
                        FaName = z.FaName,
                        name = z.name,
                        CodeCanGrow = z.CodeCanGrow,
                        CodeActive = z.CodeActive,
                        Assistance = (z.Assistance == true ? true : false),
                        len = z.len,
                        level = z.level,
                        WorkFlow = z.WorkFlow == null ? false : true,
                        //ProfileList = (_profileRepo.Get(m => m.GroupId == z.code & m.IsDeleted == false).Result.Select(n => new ProfileVm { Id = n.Id, FaName = n.FaName, FieldName = n.FieldName })).ToList(),
                    });

                if (_centerType)
                    res = res.Where(x => x.code != "019");

                return res.Where(m => m.code != "016");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<CodingVm>> GetAllChild(string code, int levelNum)
        {
            var model = await _repo.Find(code);
            if (model == null) return new List<CodingVm>();

            var res = (await _repo.Get(m => m.level == model.level + levelNum && m.code.StartsWith(model.code) &&
            m.CodeActive == true)).Select(z => new CodingVm
            {
                code = z.code,
                FaName = z.FaName,
                name = z.name,
                Factor = z.Factor,
                index = z.index,
                Assistance = (z.Assistance == true ? true : false),
                codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive),
                InternationalServiceCode = z.InternationalServiceCode,
                //AccountingCollection_Id = z.AccountingCollection_Id,
            }).ToList();
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllFormChild(string code, int levelNum)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == model.level + levelNum && m.CodeActive == true))
                .Select(z => new CodingVm
                {
                    code = z.code,
                    FaName = z.FaName,
                    name = z.name,
                    Factor = z.Factor,
                    Assistance = (z.Assistance == true ? true : false),
                    codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive)
                });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllFormChild_CustomerTab(string code)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == 3 &&
            m.code.StartsWith(model.code) &&
            m.CodeActive == true)).Select(z => new CodingVm
            {
                code = z.code,
                FaName = z.FaName,
                name = z.name,
                Factor = z.Factor,
                Assistance = (z.Assistance == true ? true : false),
                codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive)
            });

            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllChildFormBuilderTrue(string code, int levelNum)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == model.level + levelNum && m.MultiInsertedForm == true && m.code.StartsWith(model.code) &&
           m.MultiInsertedForm == true)).Select(z => new CodingVm
           {
               code = z.code,
               FaName = z.FaName,
               name = z.name,
               Factor = z.Factor,
               Assistance = (z.Assistance == true ? true : false),
               codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive),
               CodeActive = z.CodeActive
           });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllChildFormBuilder(string code, int levelNum)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == model.level + levelNum && m.CodeActive == true
             && m.code.StartsWith(model.code))).Select(z => new CodingVm
             {
                 code = z.code,
                 FaName = z.FaName,
                 name = z.name,
                 Factor = z.Factor,
                 Assistance = (z.Assistance == true ? true : false),
                 codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive),
                 CodeActive = z.CodeActive
             });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllChildWhitWorkFlow(string code, int levelNum)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == model.level + levelNum && m.WorkFlow == true && m.code.StartsWith(model.code)))
                .Select(z =>
                new CodingVm
                {
                    code = z.code,
                    FaName = z.FaName,
                    name = z.name,
                    Factor = z.Factor,
                    codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive)
                });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetChild(string code)
        {
            var model = await _repo.Find(code);
            var _parentCode = (model.code == "030" ? "03" : model.code);

            var res = (await _repo.Get(m => m.level == model.level + 1 && m.code.StartsWith(_parentCode) ))
                .Select(z => new CodingVm { code = z.code, name = z.name, codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive) });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> Get(string code)
        {

            var res = (await _repo.Get(m => m.code.StartsWith((code).ToString())))
                .Select(z =>
                new CodingVm
                {
                    code = z.code,
                    name = z.name,
                    codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive)
                });
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetAllChildFormBuilder(string code)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.level == model.level + 1
                                        && m.code.StartsWith(model.code)))
                .Select(z =>
                new CodingVm
                {
                    code = z.code,
                    name = z.name,
                    codeActiveStatus = ((z.CodeActive == true) || (z.WorkFlow == true) || (z.MultiInsertedForm == true) ? Resources.Md.Active : Resources.Md.DeActive)
                });
            return res;
        }

        public async Task<List<NormalJsonClass>> GetAllInsurance()
        {

            var res = (await _repo.Get(m => m.level > 3
                                    && m.code.StartsWith("0" + ((int)CodingEnum.Insurer).ToString())))
            .Select(z =>
                new NormalJsonClass()
                {
                    Value = z.code.ToString(),
                    Text = z.name
                }).ToList();
            return res;
        }

        public async Task<CodingVm> GetCode(string code, bool edit)
        {
            var _result = new CodingVm();

                if (!edit)
                {
                    if (code != "0")
                    {
                        var level = (await _repo.Find(code)).level;

                        _result.CodeActive = false;
                        _result.Assistance = false;
                        _result.WorkFlow = false;
                        _result.MultiInsertedForm = false;
                        _result.Parent = code;
                       // _result.FormBuilderList = await GetFormBuilderList();
                        _result.level = level;
                    }
                }
                else
                {
                    if (code != "0")
                    {
                        var coding = await _repo.Find(code);
                        if (coding != null)
                        {
                            _result = Mapping.GenericMapping<Coding, CodingVm>.Map(coding);
                            if (code.StartsWith("022"))
                            {
                                _result.Parent = code.Substring(0, 3);
                            }
                            _result.Assistance = _result.Assistance == true ? true : false;
                        }
                    }
                }
            

            return _result;
        }

        public async Task<string> GetCodingName(string code)
        {
            try
            {
                var _res = (await _repo.Get(x => x.code == code)).FirstOrDefault();
                return _res != null ? _res.name : code;
            }
            catch (Exception ex) { throw ex; }
        }

        private void checkDragInAdd(string parent)
        {
            if (parent == "0" + ((int)PrescriptionEnum.Prescription).ToString())
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (parent == "0" + ((int)PrescriptionEnum.Medicine).ToString())
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.MedicineDoz).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.MedicineDoz).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.MedicineName).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.MedicineName).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.MedicineType).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.MedicineType).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.MedicineCount).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.MedicineCount).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.MedicineConsumptionInstruction).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.MedicineConsumptionInstruction).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));

            if (!parent.Equals("0" + ((int)PrescriptionEnum.Experiment).ToString()) && parent.StartsWith("0" + ((int)PrescriptionEnum.Experiment).ToString()))
                throw new Exception(GlobalMessage.requestMessage("ثبت"));
        }

        public async Task<Coding> SaveNewCode(CodingVm model)
        {
            checkDragInAdd(model.Parent);

            if (model.Parent.StartsWith("018")) throw new Exception("امکان ثبت کد وجود ندارد");

            var parent = await _repo.Find(model.Parent);

            var level = parent.level + 1;

            #region Start Validation

            if (model.Parent.StartsWith("030") && level > 3) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("024") && (level == 3)) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("021") && level > 3) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("017") && level > 3) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("011") && level > 3) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("014") && level > 3) throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("012") && (level == 3 || level > 4)) throw new Exception("امکان ثبت کد وجود ندارد");

            if (model.Parent == "020") throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("020") && level > 4) throw new Exception("امکان ثبت کد وجود ندارد");

            if (model.Parent == "019") throw new Exception("امکان ثبت کد وجود ندارد");
            if (model.Parent.StartsWith("019") && level > 5) throw new Exception("امکان ثبت کد وجود ندارد");

            if (model.Parent.StartsWith("013") && level > 5) throw new Exception("امکان ثبت کد وجود ندارد");

            if (model.Parent.StartsWith("015"))
            {
                if (level == 3) throw new Exception("امکان ثبت کد وجود ندارد");
                if ((model.Parent.StartsWith("015010302") || model.Parent.StartsWith("015010301")) && level > 6) throw new Exception("امکان ثبت کد وجود ندارد");
                if (level >= 6 && !model.Parent.StartsWith("0150103")) throw new Exception("امکان ثبت کد وجود ندارد");
            }

            #endregion

            var _parentCode = model.Parent == "030" ? "03" : model.Parent;
            var res = await _repo.Get(m => m.level == level && m.code.StartsWith(_parentCode));
            var i = res.ToList().Select(m => m.code);
            var res2 = i.Select(m => long.Parse(m));
            var last = long.Parse(model.Parent + 0.ToString("D" + parent.len));

            var ss = string.Empty;

            if (res.Count() >= 99)
                throw new Exception("حداکثر تعداد 99 زیر گروه میتوان تعریف کرد");

            if (res.Count() != 0)
            {
                for (int _index = 0; _index <= 99; _index++)
                {
                    var _new_code = Convert.ToInt32(_parentCode) + (_index < 10 ? "0" + _index : _index + "");
                    if (!res2.Any(x => x.ToString() == _new_code))
                    {
                        ss = _new_code;
                        break;
                    }
                }
            }
            else
            {

                string lastChr = last.ToString().Substring(last.ToString().Length - 1);
                if (lastChr == "0")
                    ss = last + "1";
            }
            model.code = "0" + ss;
            model.level = short.Parse(level.ToString());


            var coding2 = Mapping.GenericMapping<CodingVm, Coding>.Map(model);

            //-------if(1 or True) => Medical      if(0 or False) => Dental---------------------
            var _ismedical = Public.CurrentUser.IsCenterActivityType;
            if (_ismedical == true)
            {
                if (model.code.StartsWith("014"))
                    coding2.Assistance = model.Assistance;
                else
                    coding2.Assistance = true;
            }

            await _repo.Add(coding2);

            model.code = coding2.code;
            model.level = coding2.level;

            return coding2;
        }

        public async Task<Coding> SavePreCode(CodingVm model)
        {
            ////////////////////////////////////////////Start Drag//////////////////////////////////////////////////////////
            string resMessage = await checkValidateDragInNotDeletedAndUpdated(model.code, "ویرایش");
            if (!string.IsNullOrEmpty(resMessage)) throw new Exception(resMessage);
            ////////////////////////////////////////////Drag Drag//////////////////////////////////////////////////////////

            #region Validation Not Opperation Edit
            if (model.code == "02401" || model.code == "01201" || model.code == "01202") throw new Exception("امکان ویرایش این درخواست وجود ندارد");
            #endregion

            var code = await _repo.Find(model.code);
            code.ToothColor = model.ToothColor;
            code.name = model.name;
            code.CodeActive = model.CodeActive;
            code.FaName = model.FaName;
            code.WorkFlow = model.WorkFlow;
            code.MultiInsertedForm = model.MultiInsertedForm;
            code.Assistance = model.Assistance == true ? true : false;
            code.tag = model.tag;
            code.index = model.index;
            code.UserCode = model.UserCode;
            code.Factor = model.Factor != null ? model.Factor.Value : 0;
            code.Price = model.Price;

            code.POS_DeviceId = model.POS_DeviceId;
            code.POS_Ip = model.POS_Ip;
            code.POS_Port = model.POS_Port;
            code.POS_IsIPDevice = model.POS_IsIPDevice;
            code.POS_InvoiceNumber = model.POS_InvoiceNumber;
            code.InternationalServiceCode = model.InternationalServiceCode;
            code.DeductionCommitmentCeiling = model.DeductionCommitmentCeiling;

            //code.Factor = model.Factor;

            //-------if(1 or True) => Medical      if(0 or False) => Dental---------------------
            var _ismedical = Public.CurrentUser.IsCenterActivityType;
            if (_ismedical == true)
            {
                if (model.code.StartsWith("014"))
                    code.Assistance = model.Assistance;
                else
                    code.Assistance = true;
            }
            await _repo.Commit();


            model.code = code.code;
            model.level = code.level;

            return code;
        }

        public async Task<IEnumerable<CodingVm>> GetAllChildWithoutLevel(string code)
        {
            var model = await _repo.Find(code);

            var res = (await _repo.Get(m => m.code.StartsWith(model.code) && m.CodeActive == true))
                .Select(z =>
                new CodingVm
                {
                    code = z.code,
                    FaName = z.FaName,
                    name = z.name,
                    codeActiveStatus = (z.CodeActive == true ? Resources.Md.Active : Resources.Md.DeActive)
                });
            return res;
        }


        #region CustomerClub


        public async Task<Coding> FindByCode(string code)
        {
            return await _repo.First(p => p.code.Equals(code));
        }

        public async Task<List<NormalJsonClass>> GetLaboratoryServiceList()
        {
            var res = (await GetAllChild("019", 2)).Select(
                m => new NormalJsonClass()
                {
                    Text = m.name,
                    Value = m.code,
                    Number = m.Factor,
                    Selected = m.Assistance,
                }).OrderBy(m => m.Number).ToList();
            return res;
        }

        public async Task<List<NormalJsonClass>> GetLaboratoryServiceDetail(string serviceId)
        {
            var res = (await GetAllChild(serviceId, 1)).Select(
            m => new NormalJsonClass()
            {
                Text = m.name,
                Value = m.code,
                Number = m.Factor,
                Selected = m.Assistance,
            }).OrderBy(m => m.Number).ToList();
            return res;
        }

        public async Task<IEnumerable<CodingVm>> GetChild(Filter_CodingVm model)
        {
            if (model == null || string.IsNullOrEmpty(model.Code)) return new List<CodingVm>();
            var q = await _repo.Find(model.Code);
            return await _repoCoding.RunQuery<CodingVm>(
                string.Format("EXEC [dbo].[getListCodings] " +
                "@code = '{0}'," +
                "@From = {1}," +
                "@To = {2}," +
                "@txtKey = {3}," +
                "@level = {4}" , 
                (q.code == "030" ? "03" : q.code), 
                (model.PageNum == 1 ? 1 : ((model.PageNum * model.PageSize) - model.PageSize)), 
                model.PageNum * model.PageSize, 
                string.IsNullOrEmpty(model.Search) ? "NULL" : "'" + model.Search + "'", q.level + 1));
        }

        public async Task<int> CountAll_GetChild(Filter_CodingVm model)
        {
            var lst = await GetChild(model);
            return lst.Count() > 0 ? lst.FirstOrDefault().CountAllForPageing : 0;
        }


        #endregion

        public async Task<List<NormalJsonClass>> GetFormLists()
        {

            var _model = (await _repoCoding.Get(m =>
            m.code.StartsWith("0" + ((int)CodingEnum.FormBuilder).ToString()) &&
            m.CodeActive == true && m.code != "0" + ((int)CodingEnum.FormBuilder).ToString())
                ).Select(z => new NormalJsonClass
                {
                    Text = z.name,
                    Value = z.code.ToString(),
                }).ToList();
            return _model;
        }

        public async Task<List<NormalJsonClass>> GetAccountPartiesList(CodingVm entity)
        {
            try
            {
                var _query = $" select code as [Value], code +' - '+ name as [Text] from tbl_Coding where code like N'0150103%' and [level] = 5 ";
                var _result = (await _repoCoding.RunQuery<NormalJsonClass>(_query)).ToList();
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}
