using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Model.Attendance
{
    [Table("DeviceGroup")]
    public partial class DeviceGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public DeviceGroup()
        {
            NewDevices = new HashSet<NewDevice>();
        }

        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string GroupTitle { get; set; }

        public bool IsDelete { get; set; }

        public DateTime ModifiedDate { get; set; }

        public string GroupExplain { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NewDevice> NewDevices { get; set; }

    }
}
