namespace Repository.Model.Chat
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TChat")]
    public partial class TChat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public bool IsDeleted { get; set; }
        public Guid MedicalCenterId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public TChat() => this.deleted = DeleteModeEnum.NotDeleted;
        public int fromId { get; set; }

        public int toId { get; set; }

        [Required]
        [StringLength(1000)]
        public string message { get; set; }

        public MessageModeEnum messageMode { get; set; }

        [StringLength(1000)]
        public string extra { get; set; }

        public bool viewed { get; set; }

        public DateTime createDate { get; set; }

        public DeleteModeEnum deleted { get; set; }

    }
    public enum DeleteModeEnum
    {
        NotDeleted,
        FromUserDeleted,
        ToUserDeleted,
    }

    public enum MessageModeEnum
    {
        Text,
        Picture,
        File,
        Sound,
        Customer,
        Form,
    }
}
