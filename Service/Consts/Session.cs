using System;
using System.Globalization;
using System.Web;
using Repository.Model;
using ViewModel.Security;

namespace Service.Consts
{

    public class Sessions
    {
        public static string ResultMessage
        {
            get
            {
                return HttpContext.Current.Session["ResultMessage"] != null
                    ? (string)HttpContext.Current.Session["ResultMessage"]
                    : null;
            }
            set
            {                    
                HttpContext.Current.Session["ResultMessage"] = value;
            }
        }

        public static string RealStateList
        {
            get
            {
                return HttpContext.Current.Session["RealStateId"] != null
                    ? (string)HttpContext.Current.Session["RealStateId"]
                    : null;
            }
            set { HttpContext.Current.Session["RealStateId"] = value; }
        }

        public static string LogoutUrlReferrer
        {
            get
            {
                return HttpContext.Current.Session["LogoutUrlReferrer"] != null
                    ? (string)HttpContext.Current.Session["LogoutUrlReferrer"]
                    : null;
            }
            set { HttpContext.Current.Session["LogoutUrlReferrer"] = value; }
        }

        public static int ChequePaymentType
        {
            get
            {
                return HttpContext.Current.Session["ChequePaymentType"] != null
                    ? (int)HttpContext.Current.Session["ChequePaymentType"]
                    : 1;
            }
            set { HttpContext.Current.Session["ChequePaymentType"] = value; }
        }

        public static string SelectedConnection
        {
            get
            {
                return HttpContext.Current.Session["SelectedConnection"] != null
                    ? (string)HttpContext.Current.Session["SelectedConnection"]
                    : null;
            }
            set { HttpContext.Current.Session["SelectedConnection"] = value; }
        }

    }
}