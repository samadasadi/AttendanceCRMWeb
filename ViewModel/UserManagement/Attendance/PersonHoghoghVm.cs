using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using Utility.EXT;
using Utility.PublicEnum;

namespace ViewModel.UserManagement.Attendance
{
    public class PersonHoghoghVm 
    {
        public int Id { get; set; }

        public bool IsActive { get; set; }

        public DateTime ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }

        public Guid PersonID { get; set; }

        /// <summary>
        /// حقوق پایه
        /// </summary>
        [Display(Name = "حقوق پایه")]
        [UIHint("HorizentalTextBox")]
        public decimal? HoghoghePaye { get; set; }

        /// <summary>
        /// پاداش بهره وری
        /// </summary>
        [Display(Name = "پاداش بهره وری")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? PadasheBahrevari { get; set; }

        /// <summary>
        /// ضریب اضافه کار
        /// </summary>
        [Display(Name = "ضریب اضافه کار")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? EKarZarib { get; set; }

        public bool? EydiSanavatMahane { get; set; }

        /// <summary>
        /// حق مسکن
        /// </summary>
        [Display(Name = "حق مسکن")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? HagheMaskan { get; set; }

        /// <summary>
        /// بن کارگری
        /// </summary>
        [Display(Name = "بن کارگری")]
        [UIHint("HorizentalNumberTextBox")]
        public int? Bon { get; set; }

        /// <summary>
        /// شماره بیمه
        /// </summary>
        [Display(Name = "شماره بیمه")]
        [UIHint("HorizentalTextBox")]
        public string BimehNumber { get; set; }

        /// <summary>
        /// ضریب بیمه
        /// </summary>
        [Display(Name = "ضریب بیمه")]
        [UIHint("HorizentalNumberTextBox")]
        public int? BimehZarib { get; set; }

        public DateTime? SaghfeKasreKar1 { get; set; }

        public DateTime? SaghfeKasreKar2 { get; set; }

        [Display(Name = "ضریب کسر کار")]
        [UIHint("HorizentalNumberTextBox")]
        public int? SaghfeKasreKar1Zarib { get; set; }

        public int? SaghfeKasreKar2Zarib { get; set; }

        public int? SaghfeKasreKar3Zarib { get; set; }

        /// <summary>
        /// هزینه ناهار
        /// </summary>
        [Display(Name = "هزینه ناهار")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? Nahar { get; set; }

        /// <summary>
        /// هزینه صبحانه
        /// </summary>
        [Display(Name = "هزینه صبحانه")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? Sobhane { get; set; }

        /// <summary>
        /// ایاب و ذهاب
        /// </summary>
        [Display(Name = "ایاب و ذهاب")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal? AyaboZahab { get; set; }

        /// <summary>
        /// نام بانک
        /// </summary>
        [Display(Name = "نام بانک")]
        [UIHint("HorizentalTextBox")]
        public string BankName { get; set; }

        /// <summary>
        /// شماره حساب
        /// </summary>
        [Display(Name = "شماره حساب")]
        [UIHint("HorizentalTextBox")]
        public string HesabNumber { get; set; }

        /// <summary>
        /// شماره کارت
        /// </summary>
        [Display(Name = "شماره کارت")]
        [UIHint("HorizentalTextBox")]
        public string AaberNumber { get; set; }

        /// <summary>
        /// تعداد فرزند
        /// </summary>
        [Display(Name = "تعداد فرزند")]
        [UIHint("HorizentalNumberTextBox")]
        public int? OladCount { get; set; }

    }
    public class PersonAccountingFilter
    {
        public PersonAccountingFilter()
        {
            this.PersonelSalariMonthList = EnumHelper<PersonelSalariMonth>.EnumToNormalJsonClass();
        }
        public Guid EmployeesId { get; set; }

        [Display(Name = "هزینه عیدی")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal HazinehEydi { get; set; }


        [Display(Name = "هزینه سنوات")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal HazinehSanavat { get; set; }


        [Display(Name = "سایر مزایا")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal SayerMazaya { get; set; }


        [Display(Name = "سهم کارکرد")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal SahmKarkard { get; set; }


        [Display(Name = "سایر کسورات")]
        [UIHint("HorizentalNumberTextBox")]
        public decimal SayerKosorat { get; set; }


        [DisplayName("محاسبه کسر کار")]
        [UIHint("HorizentalCheckBox")]
        public bool CalcKasrKar { get; set; }


        [DisplayName("هزینه ناهار")]
        [UIHint("HorizentalCheckBox")]
        public bool Nahar { get; set; }


        [DisplayName("هزینه صبحانه")]
        [UIHint("HorizentalCheckBox")]
        public bool Sobhane { get; set; }


        [DisplayName("ایاب و ذهاب")]
        [UIHint("HorizentalCheckBox")]
        public bool AyabZahab { get; set; }



        [DisplayName("از تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? FromDate { get; set; }
        public string FromDateStr
        {
            get
            {
                return ((this.FromDate != null) ? DateTimeOperation.M2S(this.FromDate.Value) : "");
            }
        }
        [DisplayName("تا تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? ToDate { get; set; }
        public string ToDateStr
        {
            get
            {
                return ((this.ToDate != null) ? DateTimeOperation.M2S(this.ToDate.Value) : "");
            }
        }




        [Display(Name = "ماه")]
        [UIHint("HorizentalDropdwonR")]
        public int PersonelSalariMonth { get; set; }
        public List<NormalJsonClass> PersonelSalariMonthList { get; set; }

        
    }
    public class PersonAccounting : DataModelResult
    {
        public PersonAccounting(
            PersonHoghoghVm _personHoghogh,
            int _totalPresentDays,
            bool _calc_Hazineh_Nahar,
            bool _calc_Hazineh_Sobhaneh,
            bool _calc_Hazineh_AyaboZahab,
            decimal _sayerKosorat = 0,
            decimal _hazinehSanavat = 0,
            decimal _hazinehEydi = 0,
            decimal _sayerMazaya = 0,
            int _totalEzafeKar = 0,
            int _totalKasreKar = 0,
            bool _calc_TotalKasreKar = false,
            decimal _sahmKarkard = 0)
        {
            this.PersonHoghogh = _personHoghogh;
            this.Calc_Hazineh_Nahar = _calc_Hazineh_Nahar;
            this.Calc_Hazineh_Sobhaneh = _calc_Hazineh_Sobhaneh;
            this.Calc_Hazineh_AyaboZahab = _calc_Hazineh_AyaboZahab;
            this.TotalPresentDays = _totalPresentDays;
            this.SayerKosorat = _sayerKosorat;
            this.SayerMazaya = _sayerMazaya;
            this.SahmKarkard = _sahmKarkard;
            this.HazinehEydi = _hazinehEydi;
            this.HazinehSanavat = _hazinehSanavat;
            this.TotalEzafeKar = _totalEzafeKar;
            this.TotalKasreKar = _totalKasreKar;
            this.Calc_TotalKasreKar = _calc_TotalKasreKar;
        }
        public PersonHoghoghVm PersonHoghogh { get; set; }
        public int TotalPresentDays { get; set; }
        public int TotalEzafeKar { get; set; }
        public int TotalKasreKar { get; set; }
        public bool Calc_TotalKasreKar { get; set; }


        public decimal SayerKosorat { get; set; }
        public bool Calc_Hazineh_Nahar { get; set; }
        public bool Calc_Hazineh_Sobhaneh { get; set; }
        public bool Calc_Hazineh_AyaboZahab { get; set; }
        public decimal Hazineh_Nahar
        {
            get
            {
                try
                {
                    return Calc_Hazineh_Nahar && PersonHoghogh != null && PersonHoghogh.Nahar > 0 ? PersonHoghogh.Nahar.Value * TotalPresentDays : 0;
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }
        public decimal Hazineh_Sobhaneh
        {
            get
            {
                try
                {
                    return Calc_Hazineh_Sobhaneh && PersonHoghogh != null && PersonHoghogh.Sobhane > 0 ? PersonHoghogh.Sobhane.Value * TotalPresentDays : 0;
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }
        public decimal Hazineh_AyaboZahab
        {
            get
            {
                try
                {
                    return Calc_Hazineh_AyaboZahab && PersonHoghogh != null && PersonHoghogh.AyaboZahab > 0 ? PersonHoghogh.AyaboZahab.Value * TotalPresentDays : 0;
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }
        public decimal Total_Kosorat
        {
            get
            {
                try
                {
                    var _res = SayerKosorat;
                    _res += Hazineh_Nahar;
                    _res += Hazineh_Sobhaneh;
                    _res += Hazineh_AyaboZahab;
                    _res += HazinehBimeh;
                    _res += Total_KasreKarPrice;
                    return _res;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }

        public decimal Total_EzafeKarPrice
        {
            get
            {
                try
                {
                    decimal _roralPriceEzafe = 0;
                    var _totalEzafekari = TotalEzafeKar;
                    if (_totalEzafekari > 0 && PersonHoghogh != null && PersonHoghogh.EKarZarib != null)
                    {
                        var _hourrr = (int)(_totalEzafekari / 60);
                        var _minn = (_totalEzafekari - ((_hourrr) * 60));
                        _roralPriceEzafe = (int)(_hourrr > 0 && PersonHoghogh.EKarZarib > 0 ? _hourrr * PersonHoghogh.EKarZarib : 0);
                        _roralPriceEzafe += (int)(_hourrr > 0 && PersonHoghogh.EKarZarib > 0 && _minn > 0 ? (PersonHoghogh.EKarZarib / 60) * _minn : 0);
                    }
                    return _roralPriceEzafe;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }
        public decimal Total_KasreKarPrice
        {
            get
            {
                try
                {
                    if (Calc_TotalKasreKar == false) return 0;


                    decimal _roralPriceEzafe = 0;
                    var _totalEzafekari = TotalKasreKar;
                    if (_totalEzafekari > 0 && PersonHoghogh != null && PersonHoghogh.SaghfeKasreKar1Zarib != null)
                    {
                        var _hourrr = (int)(_totalEzafekari / 60);
                        var _minn = (_totalEzafekari - ((_hourrr) * 60));
                        _roralPriceEzafe = (int)(_hourrr > 0 && PersonHoghogh.SaghfeKasreKar1Zarib > 0 ? _hourrr * PersonHoghogh.SaghfeKasreKar1Zarib : 0);
                        _roralPriceEzafe += (int)(_hourrr > 0 && PersonHoghogh.SaghfeKasreKar1Zarib > 0 && _minn > 0 ? (PersonHoghogh.SaghfeKasreKar1Zarib / 60) * _minn : 0);
                    }
                    return _roralPriceEzafe;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }

        public decimal HazinehBimeh
        {
            get
            {
                try
                {
                    var _res = PersonHoghogh != null && PersonHoghogh.BimehZarib > 0 && PersonHoghogh.HoghoghePaye > 0 ?
                        ((PersonHoghogh.HoghoghePaye.Value / 100) * PersonHoghogh.BimehZarib.Value) : 0;
                    return _res;
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }

        public decimal HazinehEydi { get; set; }
        public decimal HazinehSanavat { get; set; }
        public decimal SayerMazaya { get; set; }
        public decimal SahmKarkard { get; set; }

        public decimal Total_Mazaya
        {
            get
            {
                try
                {
                    var _res = PersonHoghogh != null && PersonHoghogh.HoghoghePaye > 0 ? PersonHoghogh.HoghoghePaye.Value : 0;
                    _res += HazinehEydi;
                    _res += HazinehSanavat;
                    _res += SayerMazaya;
                    _res += SahmKarkard;
                    _res += PersonHoghogh != null && PersonHoghogh.HagheMaskan > 0 ? PersonHoghogh.HagheMaskan.Value : 0;
                    _res += PersonHoghogh != null && PersonHoghogh.PadasheBahrevari > 0 ? PersonHoghogh.PadasheBahrevari.Value : 0;
                    _res += PersonHoghogh != null && PersonHoghogh.Bon > 0 ? PersonHoghogh.Bon.Value : 0;
                    _res += Total_EzafeKarPrice;

                    return _res;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }
        public decimal KhalesPardakhti
        {
            get
            {
                try
                {
                    return Total_Mazaya - Total_Kosorat;
                }
                catch (Exception ex)
                {
                    return 0;
                }
            }
        }

    }
}
