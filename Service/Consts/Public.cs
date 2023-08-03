using Repository.Model;
using Service.Security;
using System.Collections.Generic;
using System.Web;
using ViewModel;
using ViewModel.BasicInfo;
using ViewModel.Chat;
using ViewModel.Security;

namespace Service.Consts
{
    public class Public
    {


        public static UserLogin CurrentUser
        {
            get
            {
                try
                {
                    return HttpContext.Current.Session["CurrentUser"] != null
                        ? (UserLogin)HttpContext.Current.Session["CurrentUser"]
                        : null;
                }
                catch
                {
                    return null;
                }
            }
            set { HttpContext.Current.Session["CurrentUser"] = value; }
        }
        public static CustomerLogin CustomerLogin
        {
            get
            {
                return HttpContext.Current.Session["CustomerLogin"] != null
                    ? (CustomerLogin)HttpContext.Current.Session["CustomerLogin"]
                    : null;
            }
            set { HttpContext.Current.Session["CustomerLogin"] = value; }
        }
        public static CheckUpdateVersionModelVm UpdateVersionInfo
        {
            get;
            set;
        }
        public static List<ChatUserModel> UserChatList { get; set; }
        public static AccountExpireInfo AccountExpireInfo { get; set; }
        public static GeneralSetting GeneralSetting { get; set; }


    }
}