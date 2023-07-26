using System;
using System.Web.Mvc;

namespace Utility.CommonAttribute
{
    public class IgnoreInEditAfterConfirm : Attribute, IMetadataAware
    {
        private bool IsIgnored { get; set; }
        public IgnoreInEditAfterConfirm()
        {
            IsIgnored = true;
        }

        public void OnMetadataCreated(ModelMetadata metadata)
        {
            metadata.AdditionalValues["IgnoreInEdit"] = IsIgnored;
        }
    }
}