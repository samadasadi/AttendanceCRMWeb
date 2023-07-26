using System;
using System.Web.Mvc;

namespace Utility.CommonAttribute
{
    [AttributeUsage(AttributeTargets.All)]
    public sealed class LtrAttribute : Attribute, IMetadataAware
    {
        public bool _IsLtr;
        public LtrAttribute(bool IsLtr)
        {
            _IsLtr = IsLtr;
        }

        public void OnMetadataCreated(ModelMetadata metadata)
        {
            metadata.AdditionalValues["ltr"] = _IsLtr;
        }
    }

    //[AttributeUsage(AttributeTargets.All)]
    //public sealed class ReadOnlyAttribute : Attribute
    //{
    //    /// <summary>
    //    /// Specifies that the property this attribute is bound to is read-only and cannot be modified in the server explorer. This static field is read-only.
    //    /// </summary>
    //    public static readonly ReadOnlyAttribute Yes;
    //    /// <summary>
    //    /// Specifies that the property this attribute is bound to is read/write and can be modified. This static field is read-only.
    //    /// </summary>
    //    public static readonly ReadOnlyAttribute No;
    //    /// <summary>
    //    /// Specifies the default value for the <see cref="T:System.ComponentModel.ReadOnlyAttribute"/>, which is <see cref="F:System.ComponentModel.ReadOnlyAttribute.No"/> (that is, the property this attribute is bound to is read/write). This static field is read-only.
    //    /// </summary>
    //    public static readonly ReadOnlyAttribute Default;
    //    /// <summary>
    //    /// Initializes a new instance of the <see cref="T:System.ComponentModel.ReadOnlyAttribute"/> class.
    //    /// </summary>
    //    /// <param name="isReadOnly">true to show that the property this attribute is bound to is read-only; false to show that the property is read/write. </param>
    //    [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")]
    //    public ReadOnlyAttribute(bool isReadOnly);
    //    /// <summary>
    //    /// Indicates whether this instance and a specified object are equal.
    //    /// </summary>
    //    /// 
    //    /// <returns>
    //    /// true if <paramref name="value"/> is equal to this instance; otherwise, false.
    //    /// </returns>
    //    /// <param name="value">Another object to compare to. </param>
    //    public override bool Equals(object value);
    //    /// <summary>
    //    /// Returns the hash code for this instance.
    //    /// </summary>
    //    /// 
    //    /// <returns>
    //    /// A hash code for the current <see cref="T:System.ComponentModel.ReadOnlyAttribute"/>.
    //    /// </returns>
    //    public override int GetHashCode();
    //    /// <summary>
    //    /// Determines if this attribute is the default.
    //    /// </summary>
    //    /// 
    //    /// <returns>
    //    /// true if the attribute is the default value for this attribute class; otherwise, false.
    //    /// </returns>
    //    public override bool IsDefaultAttribute();
    //    /// <summary>
    //    /// Gets a value indicating whether the property this attribute is bound to is read-only.
    //    /// </summary>
    //    /// 
    //    /// <returns>
    //    /// true if the property this attribute is bound to is read-only; false if the property is read/write.
    //    /// </returns>
    //    public bool IsReadOnly { [TargetedPatchingOptOut("Performance critical to inline this type of method across NGen image boundaries")] get; }
    //}
}