using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.Utitlies
{
    //Create Class By Mobin
    public class GenericTypeCompare<T> : IEqualityComparer<T> where T : class
    {

        private string _fieldName;
        public GenericTypeCompare(string fieldName)
        {
            _fieldName = fieldName;
        }

        public bool Equals(T x, T y)
        {
            return x.GetType().GetProperty(_fieldName).GetValue(x).Equals(y.GetType().GetProperty(_fieldName).GetValue(y));
        }

        public int GetHashCode(T obj)
        {
            return obj.GetType().GetProperty(_fieldName).GetValue(obj).GetHashCode();
        }

    }
}
