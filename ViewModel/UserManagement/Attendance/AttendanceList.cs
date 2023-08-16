using Repository.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModel.Report;

namespace ViewModel.UserManagement.Attendance
{


    public class AttendanceVM : DataModelResult
    {

        public ReportParameter reportParameter { get; set; }
        public List<AttendanceList> listAttenDanceVm { get; set; }
        public PersonelInfo personInfoVm { get; set; }
        public InformationGlobalReport informationGlobalReport { get; set; }
        public PersonHoghoghVm personHoghogh { get; set; }
        public PersonAccounting personAccounting { get; set; }

    }


    public class AttendanceList
    {
        public int Id { get; set; }
        public int PersonID { get; set; }
        public int UserId { get; set; }
        public string User_Name { get; set; }
        public DateTime DateEn { get; set; }
        public string DateEnFa { get { return ((this.DateEn != null) ? DateTimeOperation.M2S(this.DateEn) : ""); } }
        public string DayStr { get { try { return DateTimeOperation.GetPersianDayName(this.DateEn); } catch { return string.Empty; } } }




        public JobTime CurrentJobTime { get; set; }



        public DateTime? EnterDate { get; set; }
        public string EnterTime { get { return EnterDate != null ? EnterDate.Value.ToString("HH:mm") : string.Empty; } }
        public string EnterDateFa { get { return ((this.EnterDate != null) ? DateTimeOperation.M2S(this.EnterDate.Value) : ""); } }

        public DateTime? LeaveDate { get; set; }
        public string LeaveTime { get { return LeaveDate != null ? LeaveDate.Value.ToString("HH:mm") : string.Empty; } }
        public string leaveDateFa { get { return ((this.LeaveDate != null) ? DateTimeOperation.M2S(this.LeaveDate.Value) : ""); } }


        public int KarkardTime1
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate != null && this.LeaveDate != null)
                        _res = (int)this.LeaveDate.Value.Subtract(this.EnterDate.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }






        public DateTime? EnterDate2 { get; set; }
        public string EnterTime2 { get { return EnterDate2 != null ? EnterDate2.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate2 { get; set; }
        public string LeaveTime2 { get { return LeaveDate2 != null ? LeaveDate2.Value.ToString("HH:mm") : string.Empty; } }
        public int KarkardTime2
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate2 != null && this.LeaveDate2 != null)
                        _res = (int)this.LeaveDate2.Value.Subtract(this.EnterDate2.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }






        public DateTime? EnterDate3 { get; set; }
        public string EnterTime3 { get { return EnterDate3 != null ? EnterDate3.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate3 { get; set; }
        public string LeaveTime3 { get { return LeaveDate3 != null ? LeaveDate3.Value.ToString("HH:mm") : string.Empty; } }
        public int KarkardTime3
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate3 != null && this.LeaveDate3 != null)
                        _res = (int)this.LeaveDate3.Value.Subtract(this.EnterDate3.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }




        public DateTime? EnterDate4 { get; set; }
        public DateTime? LeaveDate4 { get; set; }
        public int KarkardTime4
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate4 != null && this.LeaveDate4 != null)
                        _res = (int)this.LeaveDate4.Value.Subtract(this.EnterDate4.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate5 { get; set; }
        public DateTime? LeaveDate5 { get; set; }
        public int KarkardTime5
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate5 != null && this.LeaveDate5 != null)
                        _res = (int)this.LeaveDate5.Value.Subtract(this.EnterDate5.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate6 { get; set; }
        public DateTime? LeaveDate6 { get; set; }
        public int KarkardTime6
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate6 != null && this.LeaveDate6 != null)
                        _res = (int)this.LeaveDate6.Value.Subtract(this.EnterDate6.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate7 { get; set; }
        public DateTime? LeaveDate7 { get; set; }
        public int KarkardTime7
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate7 != null && this.LeaveDate7 != null)
                        _res = (int)this.LeaveDate7.Value.Subtract(this.EnterDate7.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate8 { get; set; }
        public DateTime? LeaveDate8 { get; set; }
        public int KarkardTime8
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate8 != null && this.LeaveDate8 != null)
                        _res = (int)this.LeaveDate8.Value.Subtract(this.EnterDate8.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate9 { get; set; }
        public DateTime? LeaveDate9 { get; set; }
        public int KarkardTime9
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate9 != null && this.LeaveDate9 != null)
                        _res = (int)this.LeaveDate9.Value.Subtract(this.EnterDate9.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate10 { get; set; }
        public DateTime? LeaveDate10 { get; set; }
        public int KarkardTime10
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate10 != null && this.LeaveDate10 != null)
                        _res = (int)this.LeaveDate10.Value.Subtract(this.EnterDate10.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate11 { get; set; }
        public DateTime? LeaveDate11 { get; set; }
        public int KarkardTime11
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate11 != null && this.LeaveDate11 != null)
                        _res = (int)this.LeaveDate11.Value.Subtract(this.EnterDate11.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate12 { get; set; }
        public DateTime? LeaveDate12 { get; set; }
        public int KarkardTime12
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate12 != null && this.LeaveDate12 != null)
                        _res = (int)this.LeaveDate12.Value.Subtract(this.EnterDate12.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate13 { get; set; }
        public DateTime? LeaveDate13 { get; set; }
        public int KarkardTime13
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate13 != null && this.LeaveDate13 != null)
                        _res = (int)this.LeaveDate13.Value.Subtract(this.EnterDate13.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate14 { get; set; }
        public DateTime? LeaveDate14 { get; set; }
        public int KarkardTime14
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate14 != null && this.LeaveDate14 != null)
                        _res = (int)this.LeaveDate14.Value.Subtract(this.EnterDate14.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate15 { get; set; }
        public DateTime? LeaveDate15 { get; set; }
        public int KarkardTime15
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate15 != null && this.LeaveDate15 != null)
                        _res = (int)this.LeaveDate15.Value.Subtract(this.EnterDate15.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate16 { get; set; }
        public DateTime? LeaveDate16 { get; set; }
        public int KarkardTime16
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate16 != null && this.LeaveDate16 != null)
                        _res = (int)this.LeaveDate16.Value.Subtract(this.EnterDate16.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate17 { get; set; }
        public DateTime? LeaveDate17 { get; set; }
        public int KarkardTime17
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate17 != null && this.LeaveDate17 != null)
                        _res = (int)this.LeaveDate17.Value.Subtract(this.EnterDate17.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate18 { get; set; }
        public DateTime? LeaveDate18 { get; set; }
        public int KarkardTime18
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate18 != null && this.LeaveDate18 != null)
                        _res = (int)this.LeaveDate18.Value.Subtract(this.EnterDate18.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate19 { get; set; }
        public DateTime? LeaveDate19 { get; set; }
        public int KarkardTime19
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate19 != null && this.LeaveDate19 != null)
                        _res = (int)this.LeaveDate19.Value.Subtract(this.EnterDate19.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }


        public DateTime? EnterDate20 { get; set; }
        public DateTime? LeaveDate20 { get; set; }
        public int KarkardTime20
        {
            get
            {
                var _res = 0;

                try
                {
                    if (this.EnterDate20 != null && this.LeaveDate20 != null && this.EnterDate20 > this.LeaveDate20)
                        _res = (int)this.LeaveDate20.Value.Subtract(this.EnterDate20.Value).TotalMinutes;
                }
                catch (Exception)
                {

                }

                return _res;
            }
        }




        public int _TotalTime
        {
            get
            {
                return this.KarkardTime1 +
                    this.KarkardTime2 +
                    this.KarkardTime3 +
                    this.KarkardTime4 +
                    this.KarkardTime5 +
                    this.KarkardTime6 +
                    this.KarkardTime7 +
                    this.KarkardTime8 +
                    this.KarkardTime9 +
                    this.KarkardTime10 +
                    this.KarkardTime11 +
                    this.KarkardTime12 +
                    this.KarkardTime13 +
                    this.KarkardTime14 +
                    this.KarkardTime15 +
                    this.KarkardTime16 +
                    this.KarkardTime17 +
                    this.KarkardTime18 +
                    this.KarkardTime19 +
                    this.KarkardTime20;
            }
        }



        public int TotalTime { get; set; }
        public string TotalTimeStr { get { return DateTimeOperation.FormatHour(this.TotalTime); } }
        public string Descriptions { get; set; }
        public bool IsKarkard { get; set; }
        public bool IsPresent { get; set; }
        public bool IsHoliday { get; set; }
        public bool AutoRegLeave { get; set; }
        public int? VerifyType { get; set; }
        public string VerifyTypeStr { get { return VerifyType != null ? (VerifyType == 1 ? "اثر انگشت" : "تشخیص چهره") : ""; } }

        /// <summary>
        /// تعداد دقیقه کاری روز جاری
        /// </summary>
        public int? TotalMinuteCurrentDay { get; set; }

        /// <summary>
        /// عنوان ساعت کاری
        /// </summary>
        public string JobTimeName
        {
            get
            {
                var _res = "";
                try
                {
                    if (this.CurrentJobTime != null)
                        return this.CurrentJobTime.JobTimeName;
                }
                catch (Exception ex)
                {

                }
                return _res;
            }
        }

        /// <summary>
        /// تاخیر
        /// </summary>
        public int Takhir { get; set; }
        public string TakhirStr { get { return DateTimeOperation.FormatHour(this.Takhir); } }

        /// <summary>
        /// تعجیل
        /// </summary>
        public int Tajil { get; set; }
        public string TajilStr { get { return DateTimeOperation.FormatHour(this.Tajil); } }




        public bool CalcEzafeBeforeVoroud { get; set; }
        public int _EzafeKari
        {
            get
            {
                try
                {

                    if (this.IsHoliday && this.IsPresent)
                    {
                        return this._TotalTime;
                    }

                    if (this.CurrentJobTime == null) return 0;

                    var _total = 0;
                    var _res = new[] {
                        this.LeaveDate,
                        this.LeaveDate2,
                        this.LeaveDate3,
                        this.LeaveDate4,
                        this.LeaveDate5,
                        this.LeaveDate6,
                        this.LeaveDate7,
                        this.LeaveDate8,
                        this.LeaveDate9,
                        this.LeaveDate10,
                        this.LeaveDate11,
                        this.LeaveDate12,
                        this.LeaveDate13,
                        this.LeaveDate14,
                        this.LeaveDate15,
                        this.LeaveDate16,
                        this.LeaveDate17,
                        this.LeaveDate18,
                        this.LeaveDate19,
                        this.LeaveDate20,
                    }.Max();


                    if (this.CurrentJobTime.ShiftShenavar == false)
                    {
                        if (this.LeaveDate != null || this.LeaveDate2 != null || this.LeaveDate3 != null)
                        {
                            //if (_res != null)
                            //{
                            //    this.CurrentJobTime.TimeKhoroj = _res.Value.Date + new TimeSpan(this.CurrentJobTime.TimeKhoroj.Hour, this.CurrentJobTime.TimeKhoroj.Minute, this.CurrentJobTime.TimeKhoroj.Second);
                            //    _total = _res != null ? _res <= this.CurrentJobTime.TimeKhoroj ? 0 : ((int)_res.Value.Subtract(this.CurrentJobTime.TimeKhoroj).TotalMinutes) : 0;
                            //    if (this.CalcEzafeBeforeVoroud)//اگر تسک محاسبه اضافه کاری قبل از ساعت ورود خورده باشد، محاسبه میشود
                            //    {
                            //        if (this.EnterDate != null && this.EnterDate < this.CurrentJobTime.TimeVorod)
                            //        {
                            //            _total += ((int)this.CurrentJobTime.TimeVorod.Subtract(this.EnterDate.Value).TotalMinutes);
                            //        }
                            //    }
                            //}

                            _total = this.TotalMinuteCurrentDay < (this._TotalTime + this.Takhir + this.Tajil) ? ((this._TotalTime + this.Takhir + this.Tajil) - this.TotalMinuteCurrentDay ?? 0) : 0;
                            //_total = _total + this.Takhir + this.Tajil;

                            if (!this.CalcEzafeBeforeVoroud)//اگر تسک محاسبه اضافه کاری قبل از ساعت ورود خورده باشد، محاسبه میشود
                            {
                                if (this.EnterDate != null && this.EnterDate < this.CurrentJobTime.TimeVorod)
                                {
                                    _total = _total - ((int)this.CurrentJobTime.TimeVorod.Subtract(this.EnterDate.Value).TotalMinutes);
                                }
                            }
                        }
                        return _total;
                    }
                    else
                    {
                        if (this.LeaveDate != null || this.LeaveDate2 != null || this.LeaveDate3 != null)
                        {

                            if (_res != null)
                            {
                                this.CurrentJobTime.TimeShiftLength = _res.Value.Date + new TimeSpan(this.CurrentJobTime.TimeShiftLength.Value.Hour, this.CurrentJobTime.TimeShiftLength.Value.Minute, this.CurrentJobTime.TimeShiftLength.Value.Second);

                                var _zeroTime = new DateTime(
                                    this.EnterDate.Value.Year,
                                    this.EnterDate.Value.Month,
                                    this.EnterDate.Value.Day, 0, 0, 0);

                                this.CurrentJobTime.TimeShiftLength = new DateTime(
                                    this.EnterDate.Value.Year,
                                    this.EnterDate.Value.Month,
                                    this.EnterDate.Value.Day,
                                    this.CurrentJobTime.TimeShiftLength.Value.Hour,
                                    this.CurrentJobTime.TimeShiftLength.Value.Minute,
                                    this.CurrentJobTime.TimeShiftLength.Value.Second);

                                var _totalminutework = (int)this.CurrentJobTime.TimeShiftLength.Value.Subtract(_zeroTime).TotalMinutes;


                                var _restime = this._TotalTime + this.VacationsHour + this.MissionHour;

                                _total = _restime < _totalminutework ? 0 : _restime - _totalminutework;
                            }
                        }


                        return _total;
                    }
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }




        /// <summary>
        /// اضافه کاری
        /// </summary>
        public int EzafeKari { get; set; }
        public string EzafeKariStr { get { return DateTimeOperation.FormatHour(this.EzafeKari); } }

        /// <summary>
        /// اضافه کاری در روزهای تعطیل
        /// </summary>
        public int EzafeKari_T
        {
            get
            {
                try
                {
                    if (this.IsHoliday && this.IsPresent)
                    {
                        //اگر روز تعطیل باشد و حضور داشته باشد باید کل روز به عنوان اضافه کار در نظر گرفته شود
                        return this._TotalTime;
                    }
                }
                catch (Exception)
                {
                }
                return 0;
            }
        }
        public string EzafeKari_TStr { get { return DateTimeOperation.FormatHour(this.EzafeKari_T); } }

        /// <summary>
        /// غیبت
        /// </summary>
        public int Gheybat { get; set; }
        public string GheybatStr { get { return DateTimeOperation.FormatHour(this.Gheybat); } }


        /// <summary>
        /// ماموریت روزانه
        /// </summary>
        public bool MissionDay { get; set; }
        public string MissionDayStr { get { return MissionDay == true ? "دارد" : "-"; } }
        /// <summary>
        /// ماموریت ساعتی
        /// </summary>
        public int MissionHour { get; set; }
        public string MissionHourStr { get { return DateTimeOperation.FormatHour(this.MissionHour); } }


        /// <summary>
        /// مرخصی روزانه
        /// </summary>
        public bool VacationsDay { get; set; }
        public string VacationsDayStr { get { return VacationsDay == true ? "دارد" : "-"; } }
        /// <summary>
        /// مرخصی ساعتی
        /// </summary>
        public int VacationsHour { get; set; }
        public string VacationsHourStr { get { return DateTimeOperation.FormatHour(this.VacationsHour); } }


        public bool IsVacation { get; set; }
        public bool IsVacation_WithoutCash { get; set; }
        public bool IsMamoriyat { get; set; }
    }


    public class DailyAttendance
    {
        public DateTime DateEn { get; set; }
        public string DateEnFa { get { return ((this.DateEn != null) ? DateTimeOperation.M2S(this.DateEn) : ""); } }
        public string DayStr { get { try { return DateTimeOperation.GetPersianDayName(this.DateEn); } catch { return string.Empty; } } }

        public List<UserInfoList> UserInfo { get; set; }

    }


    public class UserInfoList
    {
        public int UserId { get; set; }
        public string PersonName { get; set; }
        public string FatherName { get; set; }
        public string NationalCode { get; set; }
        public string GroupName { get; set; }
        public bool IsPresent { get; set; }
        public string IsPresentStr { get { return IsPresent ? "حاضر" : ""; } }
        public bool IsMorakhasi { get; set; }
        public string IsMorakhasiStr { get { return IsMorakhasi ? "مرخصی" : ""; } }
        public bool IsMamoriyat { get; set; }
        public string IsMamoriyatStr { get { return IsMamoriyat ? "ماموریت" : ""; } }
        public bool IsGheybat { get; set; }
        public string IsGheybatStr { get { return IsGheybat ? "غیبت" : ""; } }






        public DateTime? EnterDate { get; set; }
        public string EnterDateFa { get { return ((this.EnterDate != null) ? DateTimeOperation.M2S(this.EnterDate.Value) : ""); } }
        public string EnterTime { get { return EnterDate != null ? EnterDate.Value.ToString("HH:mm") : string.Empty; } }
        public DateTime? LeaveDate { get; set; }
        public string leaveDateFa { get { return ((this.LeaveDate != null) ? DateTimeOperation.M2S(this.LeaveDate.Value) : ""); } }
        public string LeaveTime { get { return LeaveDate != null ? LeaveDate.Value.ToString("HH:mm") : string.Empty; } }
        public bool IsHoliday { get; set; }
        /// <summary>
        /// عنوان ساعت کاری
        /// </summary>
        public string JobTimeName { get; set; }
    }


    public class UsersPerformance
    {
        /// <summary>
        /// شماره کارت
        /// </summary>
        public int CARD_NO { get; set; }
        /// <summary>
        /// نام پرسنل
        /// </summary>
        public string PER_NAME { get; set; }
        /// <summary>
        /// تعداد روز کارکرد
        /// تعداد روز کارکرد پرسنل در ماه عدد بین 1 تا 31
        /// </summary>
        public int HOZOUR_DAY { get; set; }
        /// <summary>
        /// مجموع کل ساعات حضور
        /// مجموع ساعات کارکرد پرسنل در ماه بر اساس دقیقه
        /// </summary>
        public int HOZOUR_T { get; set; }
        /// <summary>
        /// مجموع ساعات کسر کار
        /// مجموع ساعات کسر کار پرسنل در ماه به دقیقه
        /// </summary>
        public int KASR_T { get; set; }
        /// <summary>
        /// مجموع ساعات اضافه کار در روزهای تعطیل
        /// مجموع ساعات اضافه کار روزهای تعطیل پرسنل در ماه به دقیقه
        /// </summary>
        public int EZFTATIL_T { get; set; }
        /// <summary>
        /// مجموع ساعات اضافه کار
        /// مجموع ساعات اضافه کار در ماه به دقیقه
        /// </summary>
        public int EZAFE_T { get; set; }
        /// <summary>
        /// مجموع ساعات مرخصی
        /// </summary>
        public int MORKHASI_T { get; set; }
        /// <summary>
        /// تعداد روز مرخصی
        /// </summary>
        public int MORKHASI_D { get; set; }
        /// <summary>
        /// مجموع تعداد ماموریت در ماه
        /// </summary>
        public int MAMURIAT { get; set; }
        /// <summary>
        /// مجموع ساعات غیبت
        /// </summary>
        public int GHEIBAT_T { get; set; }

    }


}
