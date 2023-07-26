using Microsoft.Web.WebSockets;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Utility;

[CompilerGenerated]
[DebuggerDisplay("<generated method>", Type = "<generated method>")]
public delegate TResult VB_0024AnonymousDelegate_1<TArg0, TResult>(TArg0 a);



public class CrmSocket : WebSocketHandler
{
    public static string Domain = "minadent";
    private string _domain;
    private int _userId;
    private string _userCode;
    private string _title;
    private static WebSocketCollection chatapp = new WebSocketCollection();

    public CrmSocket(string Domain_, int UserId_, string userCode_, string title_)
    {
        this._domain = Domain_;
        this._userId = UserId_;
        this._userCode = userCode_;
        this._title = title_;
    }
    public override void OnOpen()
    {
        string secWebSocketKey = ((WebSocketHandler)this).WebSocketContext.SecWebSocketKey;
        if (!IsOnlineUser(_domain, _userId))
        {
            SendToDomain(Channel.UserStatus, _domain, new object[2] { _userId, true });
        }
        chatapp.Add((WebSocketHandler)(object)this);
        base.OnOpen();
    }
    public override void OnClose()
    {
        try
        {
            string secWebSocketKey = this.WebSocketContext.SecWebSocketKey;
            CrmSocket.chatapp.Remove((WebSocketHandler)this);
            if (CrmSocket.IsOnlineUser(this._domain, this._userId))
                return;
            CrmSocket.SendToDomain(CrmSocket.Channel.UserStatus, this._domain, (object)new object[2]
            {
                    (object) this._userId,
                    (object) false
            });
        }
        catch (Exception ex)
        {
            //ProjectData.SetProjectError(ex);
            //ex.Message.ToString();
            //ProjectData.ClearProjectError();
        }
        base.OnClose();
    }
    public override void OnMessage(string message)
    {
    }








    public static void SendToClient(CrmSocket.Channel Channel_, string Domain_, int UserId_, object Data_)
    {
        int Count = 1;
        try
        {
            Domain_ = Domain;
            //var _list = Enumerable.Where<WebSocketHandler>((IEnumerable<WebSocketHandler>)CrmSocket.chatapp, (Func<WebSocketHandler, bool>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => Operators.CompareString(a._domain, Domain_, false) == 0 & a._userId == UserId_))((CrmSocket)a0)));

            //var _list_test = (IEnumerable<WebSocketHandler>)(CrmSocket.chatapp);
            var _list = Enumerable.Where<WebSocketHandler>(CrmSocket.chatapp, (a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._domain == Domain_ && a._userId == UserId_))((CrmSocket)a0)));
            foreach (WebSocketHandler webSocketHandler in _list)
            {
                webSocketHandler.Send(CrmSocket.convertDataToString(Channel_, RuntimeHelpers.GetObjectValue(Data_), Count));
                checked { ++Count; }
            }
        }
        catch (Exception ex)
        {

        }
        finally
        {

        }
    }

    public static void SendToDomain(CrmSocket.Channel Channel_, string Domain_, object Data_)
    {
        try
        {
            Domain_ = Domain;
            //var _list = (IEnumerable<WebSocketHandler>)(CrmSocket.chatapp);
            var _list = Enumerable.Where<WebSocketHandler>(CrmSocket.chatapp, (a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._userCode != "hardware"))((CrmSocket)a0)));
            foreach (WebSocketHandler webSocketHandler in _list)
                webSocketHandler.Send(CrmSocket.convertDataToString(Channel_, RuntimeHelpers.GetObjectValue(Data_), 1));
        }
        finally
        {

        }
    }

    public static bool IsOnlineUser(string Domain_, int UserId_)
    {
        Domain_ = Domain;
        var _result = Enumerable.Where<WebSocketHandler>((IEnumerable<WebSocketHandler>)CrmSocket.chatapp, (Func<WebSocketHandler, bool>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._userId == UserId_))((CrmSocket)a0))).Count<WebSocketHandler>() > 0;
        return _result;
    }

    public static List<int> getOnlineUsers(string Domain_)
    {
        Domain_ = Domain;
        //var _result = Enumerable.Select<WebSocketHandler, int>(Enumerable.Where<WebSocketHandler>((IEnumerable<WebSocketHandler>)CrmSocket.chatapp, (Func<WebSocketHandler, bool>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => Operators.CompareString(a._domain, Domain_, false) == 0))((CrmSocket)a0))), (Func<WebSocketHandler, int>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, int>)(a => a._userId))((CrmSocket)a0))).ToList<int>();
        var _result = Enumerable.Select<WebSocketHandler, int>(
            Enumerable.Where<WebSocketHandler>((IEnumerable<WebSocketHandler>)CrmSocket.chatapp,
                (Func<WebSocketHandler, bool>)(a0 =>
                    ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._domain == Domain_))
                    ((CrmSocket)a0))), (Func<WebSocketHandler, int>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, int>)(a => a._userId))((CrmSocket)a0))).ToList<int>();
        return _result;
    }
    private static string convertDataToString(CrmSocket.Channel Channel_, object Data_, int Count)
    {
        try
        {
            JavaScriptSerializer scriptSerializer = new JavaScriptSerializer();
            scriptSerializer.MaxJsonLength = Int32.MaxValue;
            return "{\"channel\": \"" + Channel_.ToString() + "\",\"data\": " + scriptSerializer.Serialize(RuntimeHelpers.GetObjectValue(Data_)) + ",\"counter\": " + Count.ToString() + "}";
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public static List<WebSocketHandler> GetOnlineUsers()
    {
        try
        {
            var _list_test = (IEnumerable<WebSocketHandler>)(CrmSocket.chatapp);
            return _list_test.ToList();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    public static List<NormalJsonClass> GetOnlineHardwareAppList(string Domain_)
    {
        try
        {
            //var _list = (IEnumerable<WebSocketHandler>)(CrmSocket.chatapp);
            //var _list = Enumerable.Where<Dictionary<int, string>>(CrmSocket._userId, (a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._userCode == "hardware"))((CrmSocket)a0)));

            var _list = Enumerable.Select<WebSocketHandler, NormalJsonClass>(
                            Enumerable.Where<WebSocketHandler>((IEnumerable<WebSocketHandler>)CrmSocket.chatapp,
                                (Func<WebSocketHandler, bool>)(a0 =>
                                ((VB_0024AnonymousDelegate_1<CrmSocket, bool>)(a => a._userCode == "hardware"))
                                ((CrmSocket)a0))), (Func<WebSocketHandler, NormalJsonClass>)(a0 => ((VB_0024AnonymousDelegate_1<CrmSocket, NormalJsonClass>)(a => new NormalJsonClass { Value = a._userId.ToString(), Text = a._title }))((CrmSocket)a0))).ToList<NormalJsonClass>();

            return _list.ToList();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public enum Channel
    {
        Notification = 1,
        Chat = 2,
        CountStatistician = 3,
        NotificationEvent = 4,
        NotificationUpdate = 5,
        Comment = 6,
        Sale = 7,
        CallerId = 8,
        Events = 9,
        SocialNetwork = 10, // 0x0000000A
        Store = 11, // 0x0000000B
        Calendar = 12, // 0x0000000C
        Email = 13, // 0x0000000D
        Sms = 14, // 0x0000000E
        Support = 15, // 0x0000000F
        CrmInfo = 16, // 0x00000010
        Dashboard = 17, // 0x00000011
        UserLog = 18, // 0x00000012
        UserStatus = 19, // 0x00000013
        ChatAgent = 20, // 0x00000014
        ExcelExport = 21, // 0x00000015

        ImageScanning = 22
    }


}
