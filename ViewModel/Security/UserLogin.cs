using Repository.Model.ApplicationMenu;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using Utility;
using Utility.PublicEnum;
using ViewModel.Basic;

namespace ViewModel.Security
{
    public class UserLogin
    {
        public bool IsAccountingClient { get; set; }
        public int UserId { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Family { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string EmployeeType { get; set; }
        [DisplayName("جنسیت")]
        public bool IsMale { get; set; }
        public string Image { get; set; }
        public IEnumerable<EnumRole> AvailableRole { get; set; }
        public IEnumerable<Guid> AvailableRoleGuid { get; set; }
        public List<Guid> roleGroup { get; set; }
        public Guid[] SubsetUser { get; set; }

        public List<MenuVm> Menus { get; set; }
        public List<MenuVm> AvailableMenus
        {
            get
            {
                var _result = this.Menus;

                // "آوا"
                if (!this.IsAvanak)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.VoiceCall));
                }
                // "نسخه پیچی"
                if (!this.IsTaminPrescription)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.TherapeuticPrescription));
                }
                // "پیامک"
                if (!this.IsSms)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.SMS));
                }
                // "حضور و غیاب"
                if (!this.IsAttendance)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.PresenceAbsence));
                }
                // "انبار"
                if (!this.IsAnbar)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.Warehouse));
                }
                // "باشگاه مشتریان"
                if (!this.IsCustomerClub)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.CustomerClub));
                }
                // "ثبت نسخ"
                if (!this.IsPrescription)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.Prescription));
                }
                // "تماس ها"
                if (!this.IsCallerID)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.Possibilities_Calls));
                }
                // "حسابداری پیشرفته"
                if (!this.IsAccountingKit)
                {
                    _result.RemoveAll(x => x.EnName.StartsWith(PubMenuDefault.AdvancedAccounting));
                }
                return _result;
            }
        }

        public string DatabaseName { get; set; }
        public Guid MedicalCenterId { get; set; }
        public string ConnectionString { get; set; }
        public string GetFullName()
        {
            return this.Name + " " + this.Family;
        }



        public string TinyKeyCode { get; set; }
        public string TinyKeyCode_Access
        {
            get
            {
                var _res = !string.IsNullOrEmpty(this.TinyKeyCode) ? this.TinyKeyCode.Split('-')[2] : "";
                return _res;
            }
        }
        public string Avilabel_Kits
        {
            get
            {
                try
                {
                    var _res = !string.IsNullOrEmpty(this.TinyKeyCode_Access) ? this.TinyKeyCode_Access.Split(';')[0] : "";
                    return _res;
                }
                catch (Exception ex)
                {
                    return this.TinyKeyCode_Access;
                }
            }
        }
        public bool IsVpsServer { get; set; }




        public bool IsAdministrator { get; set; }

        public bool IsSms { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(0, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsAnbar { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(1, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsAttendance { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(2, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsCustomerClub { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(3, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsCallerID { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(4, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsPrinter { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(5, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsCredits { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(6, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsPrescription { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(7, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsFingerPrint { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(8, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsCardReader { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(9, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsMoneyBag { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(10, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsInatallments { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(11, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsIOS { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(12, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsVPS { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(13, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsAndroid { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(14, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsCenterType { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(15, 1) == "1") ? true : false); } catch { return false; } } }
        
        /// <summary>
        /// اگر true باشد مدیکال است
        /// اگر false باشد دنتال است
        /// </summary>
        public bool IsCenterActivityType { get { try { return this.IsVpsServer ? false : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(16, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsAvanak { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(17, 1) == "1") ? true : false); } catch { return false; } } }

        public bool IsTaminPrescription { get { try { return this.IsVpsServer || this.IsBasicallyKit ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(18, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsBasicallyKit { get { try { return this.IsVpsServer ? false : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(19, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsAccountingKit { get { try { return this.IsVpsServer ? false : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(20, 1) == "1") ? true : false); } catch { return false; } } }
        public bool IsWhatsAppKit { get { try { return this.IsVpsServer ? true : ((!string.IsNullOrEmpty(Avilabel_Kits) && Avilabel_Kits.Substring(21, 1) == "1") ? true : false); } catch { return false; } } }


        public int DoctorCount
        {
            get
            {
                if (this.IsVpsServer) return 1000;

                string[] _personCount = TinyKeyCode_Access.Split(';');
                var _res = !string.IsNullOrEmpty(_personCount[2]) ? Convert.ToInt32(_personCount[2]) : 0;
                return _res;
            }
        }


        public int UserCount
        {
            get
            {
                if (this.IsVpsServer) return 1000;

                string[] _personCount = TinyKeyCode_Access.Split(';');
                var _res = !string.IsNullOrEmpty(_personCount[1]) ? Convert.ToInt32(_personCount[1]) : 0;
                return _res;
            }
        }



        public bool IsCallerActive { get; set; }
        public string ImgPath_Header
        {
            get
            {
                if (!string.IsNullOrEmpty(this.Image))
                {
                    return "<img src =\"" + this.Image + "\" class=\"img-circle\" style=\"width: 20px; height: 20px;box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);\">";
                }
                else
                {
                    return "<img src=\"/Content/Image/metacontact_offline.png\" class=\"img-circle\" style=\"width: 20px; height: 20px;box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);\">";
                }
            }
        }
        public string ImgPath_RightMenu
        {
            get
            {
                if (!string.IsNullOrEmpty(this.Image))
                {
                    return "<img src =\"" + this.Image + "\" class=\"img-circle\" style=\"width: 30px;  box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);\">";
                }
                else
                {
                    return "<img src=\"/Content/Image/metacontact_offline.png\" class=\"img-circle\" style=\"width: 30px; box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);\">";
                }
            }
        }
        public string ImgPath
        {
            get
            {
                if (!string.IsNullOrEmpty(this.Image))
                {
                    //return "<img src =\"" + this.Image + "\" class=\"img-circle\" style=\"width: 30px; height: 30px;box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);\">";
                    return "<img src =\"" + this.Image + "\" class=\"img-circle\" style=\"box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);width: 75px;\">";
                }
                else
                {
                    return "<img src=\"/Content/Image/profile-empty.jpg\" class=\"img-circle\" style=\"box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);width: 75px;\">";
                }
            }
        }
        public string IPAddress { get; set; }
        public string TinyUserCode { get; set; }

        public DateTime CurrentDate { get { return DateTime.Now; } }
        public string CurrentDateStr { get { return DateTimeOperation.M2S(CurrentDate); } }
        public string CurrentDatePersian
        {
            get
            {
                return (DateTimeOperation.GetPersianDayName(DateTime.Now) + " " + Convert.ToInt32(DateTimeOperation.M2S(DateTime.Now).Substring(8, 2)).ToString() + " " + DateTimeOperation.GetStringOfMonth(Convert.ToInt32(DateTimeOperation.M2S(DateTime.Now).Substring(5, 2))));
            }
        }



        public string AppVersion { get; set; }
        public string AppVersionDate { get; set; }

        public string DiseaseGroupAccessPatient { get; set; }

        public List<string> DiseaseGroupAccessSelected { get; set; }

    }
}
