using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model.Common
{
    public class GenericAttribute : BaseClass
    {
        public Guid EntityId { get; set; }
        public string KeyGroup { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public DateTime? CreatedOrUpdatedDateUTC { get; set; }
    }
}
