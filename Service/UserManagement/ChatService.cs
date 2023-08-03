using Repository.Chat;
using Repository.iContext;
using Repository.Model.Chat;
using Repository.Model;
using Repository;
using Service.Consts;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using ViewModel.Chat;
using ViewModel.UserManagement;

namespace Service.UserManagement
{
    [DebuggerDisplay("<generated method>", Type = "<generated method>")]
    [CompilerGenerated]
    public delegate TResult VB_0024AnonymousDelegate_11<TArg0, TArg1, TResult>(TArg0 MessageMode_, TArg1 Message_);

    public interface IChatService
    {
        Task<IEnumerable<UserVm>> GetAllUsers();
        Task<List<ChatUserModel>> GetUserList();
        Task<List<ChatUserModel>> GetUserListAndUnreadMessage();
        System.Threading.Tasks.Task setUserStatus(int userId, int status);
        Task<TChat> InsertChat(TChatVm entity);
        Task<List<TChatVm>> GetChatList(TChatModeFilter entity);
        Task<int> ViewChat(TChatModeFilter entity);
        Task<ChatUserModel> GetUserById(int userId);
        System.Threading.Tasks.Task clearHistory(int fromId, int toId);

    }
    public class ChatService : IChatService
    {
        #region Fields
        private string _domain = "minadent";
        private readonly IRepository<PubUser> _repo;
        private readonly IRepository<TChat> _repoTChat;
        #endregion

        #region Ctor
        public ChatService(
            IContextFactory contextFactory,
            IRepository<PubUser> repo,
            IRepository<TChat> repoTChat
            )
        {
            var currentcontext = contextFactory.GetContext();


            _repo = repo;
            _repo.FrameworkContext = currentcontext;
            _repo.DbFactory = contextFactory;


            _repoTChat = repoTChat;
            _repoTChat.FrameworkContext = currentcontext;
            _repoTChat.DbFactory = contextFactory;

        }
        #endregion

        #region Method
        public async Task<IEnumerable<UserVm>> GetAllUsers()
        {
            var _query = string.Format(@"select	coding.name as UserTypeName, filee.Path as ImgPath, emp.FirstName as 'Name', emp.LastName as Family, emp.Id, "
                                        + "\n		emp.EmployeeActive, ISNULL(emp.FileId, '00000000-0000-0000-0000-000000000000'), "
                                        + "\n		emp.EmployeeID, emp.UserId, CAST(ISNULL(emp.IsUserActive, 0) as bit), emp.EmpMobileNo as MobileNumber, "
                                        + "\n		emp.PhoneNo, emp.Address, emp.NetworkUserName as UserName "
                                        + "\n from tbl_Employees emp "
                                        + "\n left join tbl_Coding coding on emp.EmployeeTypeID = coding.code "
                                        + "\n left join [File] filee on filee.Id = emp.FileId "
                                        + "\n where emp.IsDeleted = 0 and EmployeeActive = 1 and IsUserActive = 1 ");

            var _result = (await _repo.RunQuery<UserVm>(_query)).ToList();
            return _result;
        }
        public async Task<List<ChatUserModel>> GetUserList()
        {
            List<ChatUserModel> userList = new List<ChatUserModel>();

            var _userList = await GetAllUsers();

            //List<UserInformation> groupingChatUser = new users_mng(ChatUtility.getDomainConn(domain), "users").GetGroupingChatUser(domain, userId);
            try
            {
                foreach (var item in _userList)
                    userList.Add(new ChatUserModel()
                    {
                        UserId = item.Id,
                        id = item.UserId ?? 0,
                        code = item.EmployeeID,
                        custCode = item.UserId ?? 0,
                        name = item.Name + " " + item.Family,
                        picture = item.ImgPath ?? "/themes/resources/images/noimage.jpg",
                        status = ChatUserModel.StatusEnum.ONLINE
                    });
                return userList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<ChatUserModel>> GetUserListAndUnreadMessage()
        {
            List<ChatUserModel> userList = await GetUserList();
            var _query = "SELECT fromId as UserId, COUNT(1) AS UnreadCount FROM TChat\r\nWHERE IsDeleted = 0 AND toId = '" + Public.CurrentUser.UserId + "' AND viewed = 0 GROUP BY fromId";

            try
            {
                var _listUnreadMessage = (await _repo.RunQuery<UserVm>(_query)).ToList();
                foreach (var item in _listUnreadMessage)
                {
                    var chatUserModel = userList.Where(x => x.id == item.UserId).FirstOrDefault();
                    if (chatUserModel != null)
                    {
                        chatUserModel.unreadMessageCount = item.UnreadCount;
                    }

                }
                List<int> onlineUsers = ChatSocket.getOnlineUsers(_domain);

                foreach (var num in onlineUsers)
                {
                    //userId = num;
                    //ChatUserModel chatUserModel = Enumerable.FirstOrDefault<ChatUserModel>((IEnumerable<ChatUserModel>)userList, (Func<ChatUserModel, bool>)(s => s.Id == Public.CurrentUser.Id));
                    ChatUserModel chatUserModel = userList.Where(s => s.id == num).ToList().FirstOrDefault();
                    if (chatUserModel != null)
                        chatUserModel.isOnline = true;
                }
                return userList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async System.Threading.Tasks.Task setUserStatus(int userId, int status)
        {
            var _query = "UPDATE tbl_Employees SET ChatStatus = " + status.ToString() + " WHERE EmployeeID=" + userId.ToString();
            await _repo.ExecuteSqlCommand(_query);
        }
        public async Task<TChat> InsertChat(TChatVm entity)
        {
            try
            {
                var _model = new TChat
                {
                    createDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    toId = entity.toId,
                    fromId = entity.fromId,
                    extra = entity.extra ?? "",
                    message = entity.message,
                    messageMode = entity.messageMode,
                    viewed = entity.viewed,
                    deleted = DeleteModeEnum.NotDeleted,

                };
                await _repoTChat.AddInt(_model);
                entity.id = _model.id;

                return _model;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<List<TChatVm>> GetChatList(TChatModeFilter entity)
        {
            try
            {
                var _result = new List<TChatVm>();
                //DataSet dataSet = ChatUtility.executeSqlQuery("WITH yourcte AS (SELECT Row_number() OVER (ORDER BY id DESC) AS [row],\r\n* from TChat WHERE ((fromId = " + fromId.ToString() + " AND toId = " + toId.ToString() + " AND deleted != " + 1.ToString() + ") OR (fromId = " + toId.ToString() + " AND toId = " + fromId.ToString() + " AND deleted != " + 2.ToString() + ")) \r\n) SELECT *,Cast((SELECT Max([row]) FROM yourcte) AS INT) AS 'totalRow'\r\nFROM  yourcte WHERE [row] BETWEEN " + skip.ToString() + " AND " + take.ToString(), domainConn);
                var _query = "WITH yourcte AS (SELECT CAST(Row_number() OVER (ORDER BY ModifiedDate DESC) as int) AS [row],\r\n* from TChat WHERE ((fromId = '" + entity.fromId.ToString() + "' AND toId = '" + entity.toId.ToString() + "' AND deleted != " + 1.ToString() + ") OR (fromId = '" + entity.toId.ToString() + "' AND toId = '" + entity.fromId.ToString() + "' AND deleted != " + 2.ToString() + ")) \r\n) SELECT *,Cast((SELECT Max([row]) FROM yourcte) AS int) AS 'totalRow'\r\nFROM  yourcte WHERE [row] BETWEEN " + entity.skip.ToString() + " AND " + entity.take.ToString();


                var _lst = (await _repoTChat.RunQuery<TChatVm>(_query)).ToList();
                // ISSUE: variable of a compiler-generated type
                //VB_0024AnonymousDelegate_11<ChatModel.MessageModeEnum, string, string> anonymousDelegate11 = (VB_0024AnonymousDelegate_11<ChatModel.MessageModeEnum, string, string>)((MessageMode_, Message_) => MessageMode_ == ChatModel.MessageModeEnum.Picture | MessageMode_ == ChatModel.MessageModeEnum.Sound | MessageMode_ == ChatModel.MessageModeEnum.File ? fileManager.getUrl(Message_) : Message_);
                //VB_0024AnonymousDelegate_11<MessageModeEnum, string, string> anonymousDelegate11 = (VB_0024AnonymousDelegate_11<MessageModeEnum, string, string>)((MessageMode_, Message_) => MessageMode_ == MessageModeEnum.Picture | MessageMode_ == MessageModeEnum.Sound | MessageMode_ == MessageModeEnum.File ? Message_ : Message_);
                return _lst;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> ViewChat(TChatModeFilter entity)
        {
            try
            {
                var chatModelList = new List<TChatVm>();

                string str = "UPDATE TChat SET viewed = 1 where fromId = '" + entity.fromId.ToString() + "' AND toId = '" + entity.toId.ToString() + "' AND viewed = 0";
                //if (Microsoft.VisualBasic.CompilerServices.Operators.CompareString(entity.chatIds, "all", false) != 0)
                if (entity.chatIds != "all")
                {
                    IEnumerable<int> ints = Enumerable.Select<string, int>((IEnumerable<string>)entity.chatIds.Split(','), (Func<string, int>)(s => int.Parse(s)));
                    str = str + " AND id IN (" + string.Join<int>(",", ints) + ")";
                }
                //return Conversions.ToInteger(ChatUtility.executeSqlQuery(str + "\r\nSELECT COUNT(1) FROM TChat WHERE fromId = " + entity.fromId.ToString() + " AND toId = " + entity.toId.ToString() + " AND viewed=0").Tables[0].Rows[0][0]);
                return await _repoTChat.RunQuery_int(str + "\r\nSELECT COUNT(1) FROM TChat WHERE fromId = '" + entity.fromId.ToString() + "' AND toId = '" + entity.toId.ToString() + "' AND viewed=0");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async System.Threading.Tasks.Task clearHistory(int fromId, int toId)
        {
            List<TChatVm> chatModelList = new List<TChatVm>();
            var _query = "DELETE FROM TChat WHERE fromId = " + fromId.ToString() + " AND toId = " + toId.ToString() + " AND deleted = " + 2.ToString() + "\r\nDELETE FROM TChat WHERE fromId = " + toId.ToString() + " AND toId = " + fromId.ToString() + " AND deleted = " + 1.ToString() + "\r\nUPDATE TChat SET deleted = " + 1.ToString() + " WHERE fromId = " + fromId.ToString() + " And toId = " + toId.ToString() + "\r\nUPDATE TChat SET viewed = 1, deleted = " + 2.ToString() + " WHERE fromId = " + toId.ToString() + " AND toId = " + fromId.ToString() + "";
            await _repoTChat.ExecuteSqlCommand(_query);
        }

        public async Task<ChatUserModel> GetUserById(int userId)
        {
            //var _result = Enumerable.FirstOrDefault<ChatUserModel>((IEnumerable<ChatUserModel>)ChatClass.getUserList(domain, userId), (Func<ChatUserModel, bool>)(s => s.id == userId));
            var _res = (await GetUserList()).Where(x => x.id == userId).FirstOrDefault();


            return _res ?? new ChatUserModel();
        }

        #endregion
    }
}
