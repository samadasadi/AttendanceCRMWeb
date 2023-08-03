using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Repository.Model
{
    [Table("QuickLink")]
    public partial class QuickLink : BaseClass
    {

        [Required]
        [StringLength(500)]
        public string URLAddress { get; set; }

        [Required]
        [StringLength(500)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Comment { get; set; }

        [StringLength(500)]
        public string Icon { get; set; }

        public int Priority { get; set; }

        public string TextColor { get; set; }
        public string IconColor { get; set; }

        public bool IsActive { get; set; }

        public Guid? PubMenu_Id { get; set; }

        public Guid User_Id { get; set; }

        public QuickLinkType LinkType { get; set; }

        public LinkTarget LinkTarget { get; set; }
    }

    public enum QuickLinkType
    {
        [Display(Name = "لینک سیستمی")]
        Systemic = 1,
        [Display(Name = "لینک خارجی")]
        External = 2
    }
    public enum LinkTarget
    {
        [Display(Name = "صفحه جدید")]
        _blank = 1,
        [Display(Name = "صفحه فعلی")]
        _parent = 2
    }
}
