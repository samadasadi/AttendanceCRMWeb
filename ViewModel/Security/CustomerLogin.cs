using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModel.Security
{
    public class CustomerLogin
    {
        public Guid MedicalCenterId { get; set; }
        public Guid CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool ScoreBoxView { get; set; }

    }
}
