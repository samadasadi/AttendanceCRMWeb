using Repository.Model;
using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement
{
    public class QuickLinkVm : BaseClass
    {

        [StringLength(500)]
        [Display(Name = "آدرس URL")]
        [UIHint("HorizentalTextBox")]
        public string URLAddress { get; set; }

        [StringLength(500)]
        [Display(Name = "عنوان")]
        [UIHint("HorizentalTextBox")]
        public string Title { get; set; }


        [Display(Name = "نام لینک")]
        [UIHint("HorizentalCheckBox")]
        public LinkTarget LinkTarget { get; set; } = LinkTarget._blank;
        public string LinkTargetStr { get { return this.LinkTarget == LinkTarget._blank ? "target='_blank'" : ""; } }


        [StringLength(500)]
        [Display(Name = "توضیحات")]
        [UIHint("HorizentalTextBox")]
        public string Comment { get; set; }


        [Display(Name = "اولویت")]
        [UIHint("HorizentalNumberTextBox")]
        public int Priority { get; set; }


        public string TextColor { get; set; }

        public string IconColor { get; set; }


        [StringLength(500)]
        [Display(Name = "آیکون")]
        [UIHint("HorizentalTextBox")]
        public string Icon { get; set; }


        [Display(Name = "نام لینک")]
        [UIHint("HorizentalDropdwonR")]
        public Guid? PubMenu_Id { get; set; }
        public List<NormalJsonClass> PubMenuList { get; set; } = new List<NormalJsonClass>();

        public Guid User_Id { get; set; }

        [UIHint("HorizentalCheckBox")]
        [Display(ResourceType = typeof(Md), Name = "Active")]
        public bool IsActive { get; set; }

        public QuickLinkType LinkType { get; set; } = QuickLinkType.Systemic;

    }
}
