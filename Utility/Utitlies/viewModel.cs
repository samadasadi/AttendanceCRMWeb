using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.Utitlies
{
    public class viewModel<T> where T : class
    {
        public T T_model { get; set; }
        /// <summary>
        /// لیست رکورد
        /// </summary>
        public IList<T> TLists { get; set; }
        /// <summary>
        /// تعداد کل رکورد ها
        /// </summary>
        public int CountAll_TLists { get; set; }

        public CommonCustomViewTablePaging CommonCustomViewTablePaging { get; set; }

        public CommonCustomViewTablePaging FillPageingData(
            int countModel, 
            string urlData, 
            int currentPageForAllCount, 
            int countAll,
            string urlDelete, 
            string urlDeleteRows, 
            string urlEdit, 
            string tableIdDiv = "divLists", 
            string idComboSelectCount = "cboSelectCount",
            string idTextSearch = "txtSearch", 
            string pageingId = "divPageingLists", 
            int firstPage = 1, 
            bool isHrefEditClick = false, 
            string divIdForCreateAndUpdate = "divCreateUpdate", 
            string functionTempForDelete = "", 
            string functionTempForPageing = "", 
            string functionTempForEdit = "", 
            string message = "", 
            string functionWillGoForPageing = "",
            string FunctionWillGoForDelete = "")
        {
            CommonCustomViewTablePaging res = new CommonCustomViewTablePaging();
            res.CountAll = countAll;
            res.CurrentPageForAllCount = currentPageForAllCount;
            res.TableIdDiv = tableIdDiv;
            res.TableName = "لیست";
            res.PageingId = pageingId;
            res.UrlData = urlData;
            res.FirstPage = firstPage;
            res.countModel = countModel;
            res.IdComboSelectCount = idComboSelectCount;
            res.IdTextSearch = idTextSearch;
            res.UrlDelete = urlDelete;
            res.UrlEdit = urlEdit;
            res.UrlDeleteRows = urlDeleteRows;
            res.IsHrefEditClick = isHrefEditClick;
            res.DivIdForCreateAndUpdate = divIdForCreateAndUpdate;
            res.FunctionTempForDelete = functionTempForDelete;
            res.FunctionTempForPageing = functionTempForPageing;
            res.FunctionTempForEdit = functionTempForEdit;
            res.Message = message;
            res.FunctionWillGoForPageing = functionWillGoForPageing;
            res.FunctionWillGoForDelete = FunctionWillGoForDelete;
            return res;
        }
    }
    public class MessageVm
    {
        public string message { get; set; }
        public bool error { get; set; }
    }
}
