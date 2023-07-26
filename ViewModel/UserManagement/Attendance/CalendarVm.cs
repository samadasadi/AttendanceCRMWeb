using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class CalendarVm : PageingParamer
    {
        public int ID { get; set; }
        [Display(Name = "عنوان")]
        [UIHint("HorizentalTextBox")]
        public string CalendarName { get; set; }

        public string Holidays { get; set; }
        public string HolidaysName { get { return GetHolidayName(); } }
        public string GetHolidayName()
        {
            try
            {
                if (string.IsNullOrEmpty(Holidays)) return "";
                var _result = "";
                string[] _dayArr = Holidays.Split(',');
                foreach (var item in _dayArr)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        switch (Convert.ToInt32(item))
                        {
                            case (int)DayOfWeek.Saturday: _result += "شنبه"; break;
                            case (int)DayOfWeek.Sunday: _result += "یک شنبه"; break;
                            case (int)DayOfWeek.Monday: _result += "دوشنبه"; break;
                            case (int)DayOfWeek.Tuesday: _result += "سه شنبه"; break;
                            case (int)DayOfWeek.Wednesday: _result += "چهارشنبه"; break;
                            case (int)DayOfWeek.Thursday: _result += "پنجشنبه"; break;
                            case (int)DayOfWeek.Friday: _result += "جمعه"; break;
                        }
                        _result += " - ";
                    }
                }
                return _result;
            }
            catch (Exception ex)
            {
            }
            return "";
        }

        [Display(Name = "ماه رمضان")]
        public bool? HasRamazan { get; set; }

        [Display(Name = "از تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? RamazanStartDate { get; set; }
        public string RamazanStartDateStr { get { return this.RamazanStartDate != null ? DateTimeOperation.M2S(this.RamazanStartDate.Value) : ""; } }

        [Display(Name = "تا تاریخ")]
        [UIHint("HorizentalCompleteDateTimeTextBox")]
        public DateTime? RamazanEndDate { get; set; }
        public string RamazanEndDateStr { get { return this.RamazanEndDate != null ? DateTimeOperation.M2S(this.RamazanEndDate.Value) : ""; } }



        public bool IsActive { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public bool IsDeleted { get; set; }
        public string UrlData { get; set; }





        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "سال")]
        public int YearsNumber { get; set; }
        //public List<NormalJsonClass> YearsNumberList { get; set; }
        public List<NormalJsonClass> YearsNumberList
        {
            get
            {
                return new List<NormalJsonClass>
                {
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-3)), Data = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-3)), Text = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-3)) },
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-2)), Data = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-2)) , Text = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-2)) },
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-1)), Data = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-1)), Text = DateTimeOperation.M2SYear(DateTime.Now.AddYears(-1)) },
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now), Data = DateTimeOperation.M2SYear(DateTime.Now), Text = DateTimeOperation.M2SYear(DateTime.Now) },
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now.AddYears(1)), Data = DateTimeOperation.M2SYear(DateTime.Now.AddYears(1)), Text = DateTimeOperation.M2SYear(DateTime.Now.AddYears(1)) },
                    new NormalJsonClass { Value = DateTimeOperation.M2SYear(DateTime.Now.AddYears(2)), Data = DateTimeOperation.M2SYear(DateTime.Now.AddYears(2)), Text = DateTimeOperation.M2SYear(DateTime.Now.AddYears(2)) },
                };
            }
        }




        [Display(Name = "یکشنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Sunday { get; set; }
        [Display(Name = "دوشنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Monday { get; set; }
        [Display(Name = "سه شنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Tuseday { get; set; }
        [Display(Name = "چهارشنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Wednesday { get; set; }
        [Display(Name = "پنجشنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Thursday { get; set; }
        [Display(Name = "جمعه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Friday { get; set; }
        [Display(Name = "شنبه")]
        [UIHint("HorizentalCheckBoxCol48")]
        public bool Saturday { get; set; }

        public string GetHolidays()
        {
            try
            {
                var _result = "";
                if (this.Saturday == true) _result += ((int)DayOfWeek.Saturday + ",");
                if (this.Sunday == true) _result += ((int)DayOfWeek.Sunday + ",");
                if (this.Monday == true) _result += ((int)DayOfWeek.Monday + ",");
                if (this.Tuseday == true) _result += ((int)DayOfWeek.Tuesday + ",");
                if (this.Wednesday == true) _result += ((int)DayOfWeek.Wednesday + ",");
                if (this.Thursday == true) _result += ((int)DayOfWeek.Thursday + ",");
                if (this.Friday == true) _result += ((int)DayOfWeek.Friday + ",");
                return _result;
            }
            catch (Exception ex)
            {
            }
            return "";
        }
        public void ShowHolidays()
        {
            try
            {
                if (string.IsNullOrEmpty(this.Holidays)) return;

                string[] _dayArr = this.Holidays.Split(',');
                foreach (var item in _dayArr)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        switch (Convert.ToInt32(item))
                        {
                            case (int)DayOfWeek.Saturday: this.Saturday = true; break;
                            case (int)DayOfWeek.Sunday: this.Sunday = true; break;
                            case (int)DayOfWeek.Monday: this.Monday = true; break;
                            case (int)DayOfWeek.Tuesday: this.Tuseday = true; break;
                            case (int)DayOfWeek.Wednesday: this.Wednesday = true; break;
                            case (int)DayOfWeek.Thursday: this.Thursday = true; break;
                            case (int)DayOfWeek.Friday: this.Friday = true; break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }
    }
}
