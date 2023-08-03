using Mapping;
using Repository;
using Repository.iContext;
using Repository.Model;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.PublicEnum;
using Utility.Utitlies;
using ViewModel.UserManagement.Attendance;

namespace Service.UserManagement.Attendance
{
    public interface ITransactionRequestService
    {
        Task<List<TransactionValue>> GetAll_TransactionValue(TransactionValue value);
        Task<viewModel<TransactionRequestVm>> GetAllTransactionRequest(TransactionRequestVm value);
        Task<TransactionRequestVm> GetTransactionRequest(TransactionRequestVm value);
        Task<DataModelResult> Save(TransactionRequestVm entity);
        Task<DataModelResult> ChangeReqStatus(TransactionRequestVm model);
        Task<DataModelResult> DeleteReqStatus(TransactionRequestVm model);
        List<NormalJsonClass> GetReqTypeList();
        List<NormalJsonClass> GetReqStatusList();
        Task<DataModelResult> AcceptTransactionRequest(Guid Id);
        Task<DataModelResult> DeclineTransactionRequest(Guid Id);
    }
    public class TransactionRequestService : ITransactionRequestService
    {
        #region prop
        public Context _context;
        IRepository<PubUser> _repoPubUser;
        IRepository<TransactionValue> _repoTransactionValue;
        IRepository<TransactionRequest> _repoTransactionRequest;
        #endregion


        #region ctor
        public TransactionRequestService(IContextFactory contextFactory,
            IRepository<PubUser> repoPubUser,
            IRepository<TransactionValue> repoTransactionValue,
            IRepository<TransactionRequest> repoTransactionRequest
            )
        {
            var currentcontext = contextFactory.GetContext();

            _context = currentcontext;

            _repoPubUser = repoPubUser;
            _repoPubUser.FrameworkContext = currentcontext;
            _repoPubUser.DbFactory = contextFactory;

            _repoTransactionValue = repoTransactionValue;
            _repoTransactionValue.FrameworkContext = currentcontext;
            _repoTransactionValue.DbFactory = contextFactory;

            _repoTransactionRequest = repoTransactionRequest;
            _repoTransactionRequest.FrameworkContext = currentcontext;
            _repoTransactionRequest.DbFactory = contextFactory;
        }
        #endregion


        #region Method
        public async Task<List<NormalJsonClass>> GetPersonelList()
        {
            var _model = (await _repoPubUser.Get(m => m.IsDeleted == false && m.EmployeeActive == true)
                ).Select(z => new NormalJsonClass
                {
                    Text = z.Name + " " + z.Family,
                    Value = z.Id.ToString(),
                }).ToList();
            return _model;
        }
        public async Task<List<TransactionValue>> GetAll_TransactionValue(TransactionValue value)
        {
            try
            {
                var _res = (await _repoTransactionValue.Get(x => x.TransType == value.TransType)).OrderBy(x => x.TransValue).ToList();
                return _res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<TransactionRequestVm> GetTransactionRequest(TransactionRequestVm value)
        {
            try
            {
                var _res = new TransactionRequestVm();
                _res.ReqType = (int)TransactionReqType.ReqDay;
                value.ReqType = value.ReqType == 0 ? 1 : value.ReqType;
                if (value != null && value.Id != Guid.Empty)
                {
                    var model = (await _repoTransactionRequest.Get(x => x.Id == value.Id)).FirstOrDefault();
                    _res = GenericMapping<TransactionRequest, TransactionRequestVm>.Map(model);

                    if (_res.ReqStatus == (int)TransactionReqStatus.ReqStatus_Accept)
                        _res.AcceptReq = true;

                    _res.TimeFrom_Value = _res.FromDateRequest.ToString("HH:mm");
                    _res.TimeTo_Value = _res.ToDateRequest.ToString("HH:mm");

                }
                _res.TransactionList = (await GetAll_TransactionValue(new TransactionValue { TransType = value.ReqType })).ToList().Select(z => new NormalJsonClass
                {
                    Text = z.TransValue,
                    Value = z.Id.ToString(),
                }).ToList();
                _res.PuUserList = await GetPersonelList();
                _res.ReqTypeList = GetReqTypeList();


                return _res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<viewModel<TransactionRequestVm>> GetAllTransactionRequest(TransactionRequestVm value)
        {
            try
            {
                var _result = new viewModel<TransactionRequestVm>();
                _result.TLists = new List<TransactionRequestVm>();
                var _query = string.Format(@"EXEC GetAllTransactionRequest "
                                            + "\n @ReqStatus = {0}, "
                                            + "\n @ReqType  = {1}, "
                                            + "\n @PersonId  = {2}, "
                                            + "\n @AcceptorId  = {3}, "
                                            + "\n @TransValue  = {4}, "
                                            + "\n @Search  = {5}, "
                                            + "\n @FromDate  = {6}, "
                                            + "\n @ToDate  = {7},"
                                            + "\n @From  = {8},"
                                            + "\n @To  = {9}",
                                            value.ReqStatus > 0 ? "N'" + value.ReqStatus + "'" : "NULL",
                                            value.ReqType > 0 ? "N'" + value.ReqType + "'" : "NULL",
                                            value.PersonID != Guid.Empty ? "N'" + value.PersonID + "'" : "NULL",
                                            value.AccepterID != Guid.Empty && value.AccepterID != null ? "N'" + value.AccepterID + "'" : "NULL",
                                            value.Transaction_Id != Guid.Empty && value.Transaction_Id != null ? "N'" + value.Transaction_Id + "'" : "NULL",
                                            !string.IsNullOrEmpty(value.Search) ? "N'" + value.Search + "'" : "NULL",
                                             value.FromDateRequest != null ? "N'" + value.FromDateRequest.ToString("yyyy-MM-dd") + "'" : "NULL",
                                             value.ToDateRequest != null ? "N'" + value.ToDateRequest.ToString("yyyy-MM-dd") + "'" : "NULL",
                                            value.PageNum == 1 ? 1 : ((value.PageNum * value.PageSize) - value.PageSize),
                                            value.PageNum * value.PageSize
                                            );
                _result.TLists = (await _repoTransactionRequest.RunQuery<TransactionRequestVm>(_query)).ToList();
                _result.CountAll_TLists = await _repoTransactionRequest.TCount(x => x.IsDeleted == false);
                return _result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<DataModelResult> Save(TransactionRequestVm entity)
        {
            try
            {

                if (entity.AcceptReq == true)
                {
                    entity.AccepterID = Public.CurrentUser.Id;
                    entity.ReqAnsDate = DateTime.Now;
                    entity.ReqStatus = (int)TransactionReqStatus.ReqStatus_Accept;
                }
                else
                {
                    entity.ReqStatus = (int)TransactionReqStatus.ReqStatus_InProccess;
                }


                if (entity.ReqType == 1)
                {
                    entity.ReqType = (int)TransactionReqType.ReqDay;
                    entity.FromDateRequest = entity.FromDateRequest + new TimeSpan(0, 0, 0);
                    entity.ToDateRequest = entity.ToDateRequest + new TimeSpan(0, 0, 0);
                }
                else if (entity.ReqType == 2)
                {
                    if (string.IsNullOrEmpty(entity.TimeFrom_Value)) { return new DataModelResult { Error = true, Message = "ساعت درخواست را وارد نمایید" }; }
                    if (string.IsNullOrEmpty(entity.TimeTo_Value)) { return new DataModelResult { Error = true, Message = "ساعت درخواست را وارد نمایید" }; }
                    entity.ReqType = (int)TransactionReqType.ReqHour;

                    //entity.FromDateRequest = DateTime.Now;
                    //entity.ToDateRequest = DateTime.Now;

                    TimeSpan time;
                    if (!string.IsNullOrEmpty(entity.TimeFrom_Value) && TimeSpan.TryParse(entity.TimeFrom_Value, out time))
                        entity.FromDateRequest = new DateTime(entity.FromDateRequest.Year, entity.FromDateRequest.Month, entity.FromDateRequest.Day, time.Hours, time.Minutes, 0);

                    if (!string.IsNullOrEmpty(entity.TimeTo_Value) && TimeSpan.TryParse(entity.TimeTo_Value, out time))
                        entity.ToDateRequest = new DateTime(entity.FromDateRequest.Year, entity.FromDateRequest.Month, entity.FromDateRequest.Day, time.Hours, time.Minutes, 0);

                }








                #region Add
                var _model = new TransactionRequest();
                entity.ModifiedDate = DateTime.Now;

                if (entity.Id == Guid.Empty)
                {
                    entity.IsDeleted = false;
                    entity.Id = Guid.NewGuid();

                    await _repoTransactionRequest.Add(GenericMapping<TransactionRequestVm, TransactionRequest>.Map(entity));
                }
                #endregion

                #region Edit
                else
                {
                    var _trans = await _repoTransactionRequest.Find(entity.Id);
                    if (_trans != null)
                    {
                        _trans.PersonID = entity.PersonID;
                        _trans.AccepterID = entity.AccepterID;
                        _trans.Comment = entity.Comment;
                        _trans.FromDateRequest = entity.FromDateRequest;
                        _trans.ReqAnsDate = entity.ReqAnsDate;
                        _trans.ReqStatus = entity.ReqStatus;
                        _trans.ReqType = entity.ReqType;
                        _trans.ToDateRequest = entity.ToDateRequest;
                        _trans.Transaction_Id = entity.Transaction_Id;

                        await _repoTransactionRequest.Detached(_trans);
                        await _repoTransactionRequest.Update(_trans);
                        _model.Id = _trans.Id;
                    }
                }
                #endregion

                return new DataModelResult();
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> ChangeReqStatus(TransactionRequestVm model)
        {
            try
            {
                var _query = string.Format(@"update TransactionRequest set ReqStatus = N'{0}', ReqAnsDate = GETDATE(), AccepterID = N'{1}' where Id = N'{2}'",
                    model.ReqStatus,
                    model.AccepterID,
                    model.Id);
                await _repoTransactionRequest.ExecuteSqlCommand(_query);
                return new DataModelResult { Message = "با موفقیت انجام شد" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> DeleteReqStatus(TransactionRequestVm model)
        {
            try
            {
                var _query = string.Format(@"update TransactionRequest set IsDeleted = 1 where Id = N'{0}'", model.Id);
                await _repoTransactionRequest.ExecuteSqlCommand(_query);
                return new DataModelResult { Message = "با موفقیت انجام شد" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> AcceptTransactionRequest(Guid Id)
        {
            try
            {
                var _query = string.Format(@"update TransactionRequest set ReqStatus = '2', ReqAnsDate = GETDATE(), AccepterID = '{0}' where Id = '{1}'", Public.CurrentUser.Id, Id);
                await _repoTransactionRequest.ExecuteSqlCommand(_query);
                return new DataModelResult { Message = "با موفقیت انجام شد" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public async Task<DataModelResult> DeclineTransactionRequest(Guid Id)
        {
            try
            {
                var _query = string.Format(@"update TransactionRequest set ReqStatus = '3', ReqAnsDate = GETDATE(), AccepterID = '{0}' where Id = '{1}'", Public.CurrentUser.Id, Id);
                await _repoTransactionRequest.ExecuteSqlCommand(_query);
                return new DataModelResult { Message = "با موفقیت انجام شد" };
            }
            catch (Exception ex)
            {
                return new DataModelResult { Error = true, Message = ex.Message };
            }
        }
        public List<NormalJsonClass> GetReqTypeList()
        {
            try
            {
                return new List<NormalJsonClass>
                {
                    new NormalJsonClass{Id = 0, Text = "همه" },
                    new NormalJsonClass{ Id = (int)TransactionReqType.ReqDay, Text = "روزانه" },
                    new NormalJsonClass{Id = (int)TransactionReqType.ReqHour, Text = "ساعتی" }
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<NormalJsonClass> GetReqStatusList()
        {
            try
            {
                return new List<NormalJsonClass>
                {
                    new NormalJsonClass{Id = 0, Text = "همه" },
                    new NormalJsonClass{ Id = (int)TransactionReqStatus.ReqStatus_InProccess, Text = "درحال بررسی" },
                    new NormalJsonClass{Id = (int)TransactionReqStatus.ReqStatus_Accept, Text = "تایید شده" },
                    new NormalJsonClass{Id = (int)TransactionReqStatus.ReqStatus_Decline, Text = "رد شده" }
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #endregion

    }
}
