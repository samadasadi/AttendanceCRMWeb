using Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Utility.EXT;
using Utility.PublicEnum;
using Utility;

namespace ViewModel.Message
{

    public class SMSVm
    {
        public Guid Id { get; set; }
        public SmsStatus Status { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; }
        public string StatusName
        {
            get
            {
                switch (DeliveryStatus)
                {
                    case DeliveryStatus.Successful:
                        return Resources.Md.DeliveryStatue_Success;
                    case DeliveryStatus.TransferedToCenter:
                        return Resources.Md.DeliveryStatue_TransferedToCenter;
                    case DeliveryStatus.BlackList:
                        return Resources.Md.DeliveryStatue_BlackList;
                    case DeliveryStatus.NotRecivedToPhone:
                        return Resources.Md.DeliveryStatue_NotRecivedToPhone;
                    case DeliveryStatus.Sent:
                        return Resources.Md.DeliveryStatue_Sent;
                    case DeliveryStatus.TransferedToOperator:
                        return Resources.Md.DeliveryStatue_TransferedToOperetor;
                    case DeliveryStatus.SentByMobile:
                        return Resources.Md.DeliveryStatue_SentByMobile;
                    case DeliveryStatus.SocialNetwork:
                        return Resources.Md.DeliveryStatue_SocialNetwork;
                    default:
                        return Resources.Md.DeliveryStatue_Others;
                }
            }
        }

        public bool IsDeleted { get; set; }
        public DateTime ModifiedDate { get; set; }

        [UIHint("HorizentalTextArea")]
        [Display(ResourceType = typeof(Md), Name = "Text")]
        public string Text { get; set; }
        public string FormatName { get; set; }
        [UIHint("HorizentalDropdwonR")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        public Guid ReceiverId { get; set; }
        [UIHint("HorizentalTextBox")]
        [Display(ResourceType = typeof(Md), Name = "Name")]
        public DateTime SendTime { get; set; }

        public string SentTimeString
        {
            get
            {
                return SendTime != null ? SendTime.ToString("HH:mm:ss - yyyy/MM/dd") : "";
            }
        }
        //public IEnumerable<CustomerBasicInformationVm> ReceiverList { get; set; }
        public int NumberOfSMS { get; set; }
        public int NumberOfCharacter { get; set; }
        public string PhoneNumber { get; set; }
        [Display(ResourceType = typeof(Md), Name = "receivers")]
        [UIHint("HorizentalDropdwonMultiple")]
        public Guid[] Receivers { get; set; }
        public List<NormalJsonClass> ReceiverList { get; set; }
        public string ReceiversName { get; set; }


        [Display(ResourceType = typeof(Md), Name = "TemplatesList")]
        [UIHint("HorizentalDropdwonR")]
        public int? TemplatesId { get; set; }
        public List<NormalJsonClass> TemplatesList { get; set; }


        [DisplayName("انتخاب الگو")]
        [UIHint("HorizentalDropdwonR")]
        public Guid? TemplatesId_Pattern { get; set; }
        public List<NormalJsonClass> TemplatesList_Pattern { get; set; }






        public string PhoneNumberDetail
        {
            get
            {
                if (PhoneNumber != null)
                {
                    //var jsonSerializer = new JavaScriptSerializer();
                    //var res = jsonSerializer.Deserialize<List<NormalJsonClass>>(PhoneNumber).Select(m => m.Value);
                    //return string.Join(",", res);
                    return PhoneNumber;
                }
                else
                {
                    return "";
                }

            }
        }
        public string EntityId { get; set; }
        public SmsType SmsType { get; set; }
        public string SmsTypeDesciption { get { return (SmsType != 0) ? EnumHelper<SmsType>.GetDisplayValue(this.SmsType) : ""; } }




        [UIHint("HorizentalDropdwonR")]
        [Display(Name = "پارامترها")]
        public int SmsParameter { get; set; }
        public List<NormalJsonClass> SmsParameterList { get; set; }
    }

    public class Faraz_SourceNumberList
    {
        public Guid Id { get; set; }
        public string Value { get; set; }
        public string Text { get { return this.Value; } }
        public FarazSourceNumber Status { get; set; }
    }

    public enum FarazSourceNumber
    {
        add = 1,
        delete = 2
    }

}
