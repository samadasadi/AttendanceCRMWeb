using System;

namespace Model.Utilitize.CommonAttribute
{
    [AttributeUsage(AttributeTargets.Parameter | AttributeTargets.Field | AttributeTargets.Property | AttributeTargets.Method, AllowMultiple = false)]
    public class DisplayFiledAttribute : Attribute
    {
        public string Name { get; set; }
    }
}