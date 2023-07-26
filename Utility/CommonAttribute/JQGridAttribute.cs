using System;

namespace Utility.CommonAttribute
{
    public class JqGridAttribute : Attribute
    {
        public readonly int _width = 80;
        public readonly string FormatFunction;
        public readonly bool Searchable=false;
        public JqGridAttribute(int width = 80)
        {
            _width = width;
        }

        public JqGridAttribute(string formatFunction, int width = 80)
        {
            FormatFunction = formatFunction;
        }

        public JqGridAttribute(string formatFunction, int width ,bool searchable)
        {
            FormatFunction = formatFunction;
            _width = width;
            Searchable = searchable;
        }

    }
}