using System;
using System.ComponentModel.DataAnnotations;

namespace Repository.Model.Chat
{
    public class ChatHistory 
    {
        [Key]
        public int Id { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string UserName { get; set; }
        public string ReciverUserName { get; set; }
        public Guid UserId { get; set; }

        public string MessageText { get; set; }

        public ChatHistoryType Type { get; set; }
    }
}