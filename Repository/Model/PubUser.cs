
namespace Repository.Model
{
    using System;
    using System.ComponentModel.DataAnnotations.Schema;

    /*
     * this model belongs to clinic stass and employes
      
     */
    [Table("tbl_Employees")]
    public partial class PubUser : BaseClass
    {
        public string EmployeeID { get; set; }
        public int? UserId { get; set; }

        [Column("FirstName")]
        public string Name { get; set; }
        [Column("LastName")]
        public string Family { get; set; }
        [Column("FatherName")]
        public string FatherName { get; set; }
        [Column("EmployeeTypeID")]
        public string UserType { get; set; }
        [Column("IDNo")]
        public string NationalCode { get; set; }

        public Nullable<bool> IsMale { get; set; }
        public DateTime? DateBirthEn { get; set; }
        public string DateofBirth { get; set; }
        [Column("PlaceofBirth")]
        public string PlaceofBirth { get; set; }
        [Column("EducationID")]
        public string Education { get; set; }
        [Column("PhoneNo")]
        public string PhoneNo { get; set; }

        [Column("EmpMobileNo")]
        public string MobileNumber { get; set; }

        [Column("DegreeID")]
        public string DegreeID { get; set; }


        [Column("SignKey")]
        public Guid? SignKey { get; set; }


        [Column("NetworkUserName")]
        public string UserName { get; set; }
        [Column("UserPwd")]
        public string Password { get; set; }
        //تاهل
        [Column("Married")]
        public Nullable<bool> Married { get; set; }
        public string Address { get; set; }
        public System.Guid CreatorId { get; set; }
        public Nullable<System.Guid> ParentId { get; set; }

        public bool EmployeeActive { get; set; }

        public Nullable<System.Guid> FileId { get; set; }

        /* تاریخ اعتبار از.  */
        public DateTime? FromValidityDate { get; set; }

        /* تاریخ اعتبار تا.  */
        public DateTime? ToValidityDate { get; set; }

        public string DisplayName
        {
            get
            {
                return this.Name + " " + this.Family;
            }
        }

        public bool? IsUserActive { get; set; }

        /// <summary>
        /// امضای کاربر
        /// </summary>
        public string cbiSignImage { get; set; }
        public Guid? SignFileId { get; set; }


        public bool? IsCallerActive { get; set; }

        public string PrinterName { get; set; }


        public int ChatStatus { get; set; }
        public decimal TaxPercent { get; set; }

    }
}
