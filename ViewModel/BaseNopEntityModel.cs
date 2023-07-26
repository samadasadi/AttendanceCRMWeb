using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel
{
    public class BaseNopEntityModel : BaseNopModel
    {
        public virtual Guid Id { get; set; }
    }
}
