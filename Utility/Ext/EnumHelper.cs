using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using Model.Utilitize.CommonAttribute;

namespace Utility.EXT
{
    public static class EnumHelper<T>
    {

        public static List<NormalJsonClass> EnumToNormalJsonClass()
        {
            var enumType = typeof(T);
            if (enumType.BaseType != typeof(Enum))
                throw new ArgumentException("T must be of type System.Enum");
            var enumValArray = Enum.GetValues(enumType);
            var enumValList = new List<NormalJsonClass>(enumValArray.Length);
            var displayName = "";
            foreach (int item in enumValArray)
            {
                var val = (T)Enum.Parse(enumType, item.ToString());
                enumValList.Add(new NormalJsonClass
                {
                    Text = GetDisplayValue(val),
                    Value = Convert.ToInt32(val).ToString()
                });
            }

            //var treatmentPlan = enumValList.FirstOrDefault(x => x.Value == "1314"); // get item
            //enumValList.Remove(treatmentPlan); //remove it
            //enumValList.Insert(0, treatmentPlan);

            //var treatment = enumValList.FirstOrDefault(x => x.Value == "1315"); // get item
            //enumValList.Remove(treatment); //remove it
            //enumValList.Insert(0, treatment);

            return enumValList;
        }

        public static List<T> EnumToList()
        {
            Type enumType = typeof(T);

            // Can't use type constraints on value types, so have to do check like this
            if (enumType.BaseType != typeof(Enum))
                throw new ArgumentException("T must be of type System.Enum");

            Array enumValArray = Enum.GetValues(enumType);

            List<T> enumValList = new List<T>(enumValArray.Length);

            foreach (int val in enumValArray)
            {
                enumValList.Add((T)Enum.Parse(enumType, val.ToString()));
            }

            return enumValList;
        }

        public static IEnumerable<TEnum> Values<TEnum>() where TEnum : struct, IComparable, IFormattable, IConvertible
        {
            var enumType = typeof(TEnum);

            // Optional runtime check for completeness    
            if (!enumType.IsEnum)
            {
                throw new ArgumentException();
            }

            return Enum.GetValues(enumType).Cast<TEnum>();
        }

        public static IList<T> GetValues(System.Enum value)
        {
            var enumValues = new List<T>();

            foreach (FieldInfo fi in value.GetType().GetFields(BindingFlags.Static | BindingFlags.Public))
                enumValues.Add((T)System.Enum.Parse(value.GetType(), fi.Name, false));
            return enumValues;
        }

        //  public static TEnum Parse<TEnum>(string name) where TEnum : struct
        //  {
        //      return (TEnum)System.Enum.Parse(typeof(TEnum), name);
        //  }

        //  public static IList<SelectListItem> EnumToSelectListItem()
        //  {
        //      var res = GetValues((System.Enum)typeof(T))
        //  .Cast<T>()
        //  .Select(m => new SelectListItem { Value = ((int)m).ToString(), Text = EnumHelper<T>.GetDisplayValue(m) })
        //  .ToList();
        ////      var res = GetValues(value).Cast<value.GetType()>().Select(m => new SelectListItem { Value = ((int)m).ToString(), Text = EnumHelper<value>.GetDisplayValue(m) })
        ////.ToList();
        //      return new List<SelectListItem>();
        //  }

        public static T Parse(string value)
        {
            return (T)System.Enum.Parse(typeof(T), value, true);
        }

        public static IList<string> GetNames(System.Enum value)
        {
            return value.GetType().GetFields(BindingFlags.Static | BindingFlags.Public).Select(fi => fi.Name).ToList();
        }

        public static IList<string> GetDisplayValues(System.Enum value)
        {
            return GetNames(value).Select(obj => GetDisplayValue(Parse(obj))).ToList();
        }

        public static string GetDisplayValue(T value)
        {
            var fieldInfo = value.GetType().GetField(value.ToString());
            if(fieldInfo == null) return String.Empty;

            var descriptionAttributes = fieldInfo.GetCustomAttributes(typeof(DisplayAttribute), false) as DisplayAttribute[];
            if (descriptionAttributes == null) return string.Empty;
            return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].Name : value.ToString();
        }
        public static string GetDisplayFiledValue(T value)
        {
            var fieldInfo = value.GetType().GetField(value.ToString());

            var descriptionAttributes = fieldInfo.GetCustomAttributes(
                typeof(DisplayFiledAttribute), false) as DisplayFiledAttribute[];

            if (descriptionAttributes == null) return string.Empty;
            return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].Name : value.ToString();
        }
    }

    public static class EnumHelperExt
    {
        public static string GetDisplayName(this Enum enumValue)
        {
            return enumValue.GetType()
                            .GetMember(enumValue.ToString())
                            .First()
                            .GetCustomAttribute<DisplayAttribute>()
                            .GetName();
        }
        public static string GetDisplayValue(this object value)
        {
            try
            {
                var fieldInfo = value.GetType().GetField(value.ToString());
                var descriptionAttributes = fieldInfo.GetCustomAttributes(typeof(DisplayAttribute), false) as DisplayAttribute[];
                if (descriptionAttributes == null) return string.Empty;
                return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].Name : value.ToString();
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
    }

}