
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
        [Column("empNezamCode")]
        public string NezamCode { get; set; }
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
        public bool? empIsAssistant { get; set; }
        public Nullable<System.Guid> FileId { get; set; }
        public decimal? PercentOfPay { get; set; }
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

        public bool empContarctWithNM { get; set; }
        public bool? IsUserActive { get; set; }

        /// <summary>
        /// امضای کاربر
        /// </summary>
        public string cbiSignImage { get; set; }
        public Guid? SignFileId { get; set; }

        //public bool? FileConverted { get; set; }

        //public bool? HasSign { get; set; }
        //public Guid? SignKey { get; set; }

        //public string SignKeyString { get; set; }

        //public double? EmpAppColorCode { get; set; }

        //public int? EmpAppCallerIDPortNo { get; set; }

        //public int? EmpAppShowCallerID { get; set; }

        //public string NetworkUserName { get; set; }

        //public byte[] Photo { get; set; }

        //public byte[] DigitalSignature { get; set; }

        //public string ComputerName { get; set; }

        //public string LocalIP { get; set; }

        //public int? RoleID { get; set; }

        //public string DateofBirth { get; set; }
        //public string IDNo { get; set; }


        public bool? IsCallerActive { get; set; }

        public float? PercentOfCost { get; set; }
        public float? PercentOfLaboratory { get; set; }

        public string PrinterName { get; set; }

        public string DiseaseGroupAccessPatient { get; set; }




        public string AuthorizationsSessionId { get; set; }
        public DateTime? LastAuthorizationsSessionDate { get; set; }
        public string TwoStep_AuthorizationsSessionId { get; set; }
        public DateTime? TwoStep_LastAuthorizationsSessionDate { get; set; }
        public bool isTwoStepSalamatVerification { get; set; }
        public string Salamat_Username { get; set; }
        public string Salamat_Password { get; set; }


        public int ChatStatus { get; set; }
        public decimal TaxPercent { get; set; }
        public bool IsAccountingClient { get; set; }

    }

}
