using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Chat
{
    public class ChatSocket
    {
        public static void sendToClient(
          ChatSocket.Action action,
          string domain,
          int userId,
          object data)
        {
            CrmSocket.SendToClient(CrmSocket.Channel.Chat, domain, userId, (object)new object[2]
            {
                (object) action,
                RuntimeHelpers.GetObjectValue(data)
            });
        }

        public static void sendToDomain(ChatSocket.Action action, string domain, object data) => CrmSocket.SendToDomain(CrmSocket.Channel.Chat, domain, (object)new object[2]
        {
            (object) action,
            RuntimeHelpers.GetObjectValue(data)
        });

        public static List<int> getOnlineUsers(string domain)
        {
            var _result = CrmSocket.getOnlineUsers(domain);
            return _result;
        }

        public enum Action
        {
            RECECIVE_MESSAGE,
            VIEW_MESSAGE,
            UNREAD_COUNT,
            USER_STATUS,
            IS_TYPING,
            SEND_MESSAGE,
            CLEAR_HISTORY,
        }
    }
}
