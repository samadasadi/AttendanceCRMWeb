using System;
using System.Web.Mvc;

namespace Utility.CommonAttribute
{
    public class MVCReadOnlyAttribute: Attribute, IMetadataAware
    {
           private readonly bool _isReadOnly;
           public MVCReadOnlyAttribute(bool isReadOnly)
        {
            _isReadOnly = isReadOnly;
        }

        public void OnMetadataCreated(ModelMetadata metadata)
        {
            metadata.AdditionalValues["isReadOnly"] = _isReadOnly;
        }
    }
}