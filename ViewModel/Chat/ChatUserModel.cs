using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.Chat
{
    public class ChatUserModel
    {
        public Guid UserId { get; set; }
        public int id { get; set; }

        public string code { get; set; }

        public int custCode { get; set; }

        public string name { get; set; }

        public string picture { get; set; }

        public bool isOnline { get; set; }

        public ChatUserModel.StatusEnum status { get; set; }

        public int unreadMessageCount { get; set; }

        public enum StatusEnum
        {
            INVISIBLE,
            ONLINE,
            BUSY,
            AWAY,
        }
    }


    public class UserInformation
    {
        public int UserId { get; set; }

        public string UserCode { get; set; }

        public string Name { get; set; }

        public int CustomerCode { get; set; }

        public string picture { get; set; }

        public List<user_group> Group { get; set; }

        public int Status { get; set; }
    }
    public class user_group
    {
        public string user_code;
        public string group_code;
        public string group_name;

        public user_group(string user_code_, string group_code_, string group_name_)
        {
            this.user_code = user_code_;
            this.group_code = group_code_;
            this.group_name = group_name_;
        }
    }

    public class TChatModeFilter
    {
        public int fromId { get; set; }
        public int toId { get; set; }
        public int skip { get; set; }
        public int take { get; set; }
        public int totalRow { get; set; }
        public string chatIds { get; set; }

        public int status { get; set; }
        public string tabId { get; set; }
        public string message { get; set; }
    }
}
