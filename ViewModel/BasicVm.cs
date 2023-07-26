using Resources;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ViewModel
{
    public class BasicVm
    {
        public Guid Id { get; set; }

        public Guid CreatorId { get; set; }
    }

    /// <summary>
    /// این کلاس برای عملیات صفحه بندی میباشد
    /// </summary>
    public class PageingParamer
    {

        public int PageNum { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public int From_PageNum { get { return this.PageNum == 1 || this.PageNum == 0 ? 1 : ((this.PageNum * this.PageSize) - this.PageSize) + 1; } }
        public int To_PageNum { get { return this.PageNum == 0 ? 10 : this.PageNum * this.PageSize; } }


        [DisplayName("جستجو")]
        [UIHint("HorizentalTextBox")]
        public string Search { get; set; }
        public int FirstPage { get; set; } = 1;
        public string Message { get; set; }

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(Name = "از تاریخ")]
        public DateTime FromDate { get; set; } = DateTime.Now.AddMonths(-1);

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(Name = "تا تاریخ")]
        public DateTime ToDate { get; set; } = DateTime.Now;

    }




}