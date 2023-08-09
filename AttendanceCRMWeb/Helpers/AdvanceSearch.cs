using System;
using System.Web.Mvc;

namespace AttendanceCRMWeb.Helpers
{
    public class AdvanceSearch
    {
        public AdvanceSearch()
        {
            SelectListShowAll = true;
            DefaultDateValue = DateTime.Now;
        }

        public string Title { get; set; }

        public ItemType ItemType { get; set; }
        public string RedioBtnName { get; set; }
        public string RedioBtnValue { get; set; }
        public SelectList SelectList { get; set; }
        public bool SelectListShowAll { get; set; }
        public DateTime DefaultDateValue { get; set; }
        public bool Selected { get; set; }
        public bool ClearRight { get; set; }
        public string MinWidth { get; set; }

        public string ClientId { get; set; }

    }

    public enum ItemType
    {
        DropDownList = 1,
        String = 2,
        Int = 3,
        Date = 4,
        Price = 5,
        CheckBox = 6,
        RedioBtn = 7,
        EmptyDropDownList = 8,

    }
}