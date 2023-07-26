using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace ViewModel.UserManagement.Attendance
{
    public class PubUser_ShiftVm : PageingParamer
    {
        public PubUser_ShiftVm()
        {
            ModifiedDate = DateTime.Now;
            PuUserList = new List<NormalJsonClass>();
            ShiftWorkList = new List<NormalJsonClass>();
        }
        public int Id { get; set; }

        public DateTime ModifiedDate { get; set; }
        public Guid MedicalCenterId { get; set; }
        public Guid DoingUserId { get; set; }
        public bool IsDeleted { get; set; }



        [Display(Name = "پرسنل")]
        [UIHint("HorizentalDropdwonR")]
        public Guid PuUser_Id { get; set; }
        public List<NormalJsonClass> PuUserList { get; set; }


        public DateTime EntesabDate { get; set; }
        public string EntesabDateStr { get { return DateTimeOperation.M2S(EntesabDate); } }



        public string Type { get; set; }
        public string UrlData { get; set; }


        [Display(Name = "شیفت کاری")]
        [UIHint("HorizentalDropdwonR")]
        public int ShiftWork_Id { get; set; }
        public List<NormalJsonClass> ShiftWorkList { get; set; }
    }
}
