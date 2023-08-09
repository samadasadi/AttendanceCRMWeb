using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.BasicInfo
{
    public class Cost_IncomingVm
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int AutoID { get; set; }

        [UIHint("HorizentalDropdwon")]
        [Display(ResourceType = typeof(Md), Name = "TitleIncoming")]
        public string costInCode { get; set; }
        [UIHint("HorizentalDropdwon")]
        public bool TitleIncoming { get; set; }
        public List<NormalJsonClass> CostCodeList { get; set; }
        public string NemeCoding { get; set; }


        [UIHint("HorizentalNumberTextBox")]
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "Price")]        
        public decimal Price { get; set; }

        [UIHint("HorizentalTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Factor_No")]        
        public string Factor_No { get; set; }

        [UIHint("HorizentalTextArea")]
        [Required(ErrorMessage = "*")]
        [Display(ResourceType = typeof(Md), Name = "Coment")]        
        public string Coment { get; set; }

        [UIHint("HorizentalCompleteDateTimeTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Date")]    
        public DateTime? DateEn { get; set; }
        public string date { get; set; }

        [UIHint("HorizentalTextBox")]
        [DisplayName("cost")]
        public decimal? cost { get; set; }

        [UIHint("HorizentalDropdwon")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        //public string costInPersonID { get; set; }
        public Guid costPersonID { get; set; }
        public List<NormalJsonClass> PersonList { get; set; }


        [UIHint("HorizentalTextBox")]
        [DisplayName("costInUserID")]
        public int? costInUserID { get; set; }
        public Guid costUserID { get; set; }

        public bool IsEmployeeAccount { get; set; }
        public Guid? EmployeeAccountId { get; set; }
        public string UserType { get; set; }


    }
}
