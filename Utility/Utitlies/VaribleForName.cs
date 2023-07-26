﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Utility.Utitlies
{
    //Create Class By Mobin
    /// <summary>
    /// این کلاس برای این است که برای کار با متغییر سیشن و متغییر اپلیکشن یک نام قرار دهیم برای آن نام یک پراپرتی تعریف کنیم
    /// که از یک جا تغییر دهییم همه جا تغییر کند
    /// </summary>
    public class VaribleForName
    {
        public static string SessionCustomerClub
        {
            get
            {
                return "CustomerClub";
            }
        }

        /// <summary>
        /// این خصوصیت برای این است که چک کنیم کدام لاگین انجام شده است
        /// لاگین با کارد یا کدملی
        /// </summary>
        public static string SessionCustomerClubForCardOrMobile
        {
            get
            {
                return "SessionCustomerClubForCardOrMobile";
            }
        }

        public static string valueSessionWithCard
        {
            get
            {
                return "Card";
            }
        }

        public static string valueSessionWithCodeMeli
        {
            get
            {
                return "CodeMeliAndMobile";
            }
        }

        public static string SessionManager
        {
            get
            {
                return "Manager";
            }
        }

        public static string SessionSignatureEmployee
        {
            get
            {
                return "SessionSignature";
            }
        }

        /// <summary>
        /// موقعی که کاربر یا بیمار امضایی وارد نمی کند این رشته نال عکس می باشد
        /// </summary>
        public static string emptyCanvas
        {
            get
            {
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAHgCAYAAAB+eQ8JAAAZ4klEQVR4Xu3WMQ0AAAzDsJU/6cHI4xGoZO3IzhEgQIAAAQIECBAIBBZsmiRAgAABAgQIECBwQtQTECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECAgRP0AAQIECBAgQIBAIiBEE3ajBAgQIECAAAECQtQPECBAgAABAgQIJAJCNGE3SoAAAQIECBAgIET9AAECBAgQIECAQCIgRBN2owQIECBAgAABAkLUDxAgQIAAAQIECCQCQjRhN0qAAAECBAgQICBE/QABAgQIECBAgEAiIEQTdqMECBAgQIAAAQJC1A8QIECAAAECBAgkAkI0YTdKgAABAgQIECDwit0B4fcRcLsAAAAASUVORK5CYII=";
            }
        }        

        /// <summary>
        /// این خصوصیت برای این است که نام ویو دیتا را از هر جای نرم افزار فراخوانی کنیم در قسمت مکاتبه
        /// </summary>
        public static string NameViewDataInCommunicationIndexForResponseFormSecurity
        {
            get
            {
                return "ViewDataInResponseFormSecurity";
            }
        }

        public static string NameImageForShowImage
        {
            get
            {
                return "ImagePath";
            }
        }

        public static string NameIdForOperation
        {
            get
            {
                return "Id";
            }
        }

        public static string NamePartialOperationPageing
        {
            get
            {
                return "P_CommonCustomViewTablePaging";
            }
        }

        #region Responsive-Mobin
        public static string AddressLayoutMaster
        {
            get
            {
                return "~/Views/Shared/AdminResponsiveLayoutAndPartial/_Layout.cshtml";
            }
        }
        public static string AddressLayoutMasterNew
        {
            get
            {
                return "~/Views/Shared/AdminResonsiveUpdate/_Layout.cshtml";
            }
        }
        #endregion

    }
}