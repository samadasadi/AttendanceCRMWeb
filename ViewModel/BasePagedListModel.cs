using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel
{
    public abstract partial class BasePagedListModel<T> : BaseNopModel, IPagedModel<T> where T : BaseNopModel
    {
        /// <summary>
        /// Gets or sets data records
        /// </summary>
        public IEnumerable<T> Data { get; set; }

        /// <summary>
        /// Gets or sets draw
        /// </summary>
        public string Draw { get; set; }

        /// <summary>
        /// Gets or sets a number of filtered data records
        /// </summary>
        public int RecordsFiltered { get; set; }

        /// <summary>
        /// Gets or sets a number of total data records
        /// </summary>
        public int RecordsTotal { get; set; }
    }
}
