using System;
using System.Collections.Generic;
using System.Globalization;

namespace Utility.EXT
{
    public static class LongExt
    {

        public static string LongToStringSplit3Digit(this long n)
        {
            return n.ToString("#,##0");
        }
        public static string ConvertNumber(this long number)
        {
            //---------------------------------------------------'
            var num = new List<long>();
            var word = new List<string>();
            var text = "";
            //---------------------------------------------------'
            number = Math.Abs(number);
            if (number > 0)
            {
                do
                {
                    long a;
                    long b;
                    a = number / 1000;
                    b = number % 1000;
                    num.Add(b);
                    if (a >= 1000)
                    {
                        number = a;
                    }
                    else if (a != 0)
                    {
                        num.Add(a);
                        break; // TODO: might not be correct. Was : Exit Do
                    }
                    else
                    {
                        break; // TODO: might not be correct. Was : Exit Do
                    }
                }
                while (true);
            }
            else if (number == 0)
            {
                return "صفر";
            }
            //---------------------------------------------------'
            for (int I = 0; I <= num.Count - 1; I++)
            {
                word.Add(ChangingNum(num[I]));
            }
            //---------------------------------------------------'
            for (var counter = word.Count - 1; counter >= 0; counter += -1)
            {
                if (counter == 5)
                {
                    if (!string.IsNullOrEmpty(word[5]))
                    {
                        if (!string.IsNullOrEmpty(word[4]) || !string.IsNullOrEmpty(word[3]) || !string.IsNullOrEmpty(word[2]) || !string.IsNullOrEmpty(word[1]) || !string.IsNullOrEmpty(word[0]))
                        {
                            text += word[5] + " بيليارد و ";
                        }
                        else
                        {
                            text += word[5] + " بيليارد";
                            break; // TODO: might not be correct. Was : Exit For
                        }
                    }
                }
                else if (counter == 4)
                {
                    if (!string.IsNullOrEmpty(word[4]))
                    {
                        if (!string.IsNullOrEmpty(word[3]) || !string.IsNullOrEmpty(word[2]) || !string.IsNullOrEmpty(word[1]) || !string.IsNullOrEmpty(word[0]))
                        {
                            text += word[4] + " بيليون و ";
                        }
                        else
                        {
                            text += word[4] + " بيليون";
                            break; // TODO: might not be correct. Was : Exit For
                        }
                    }
                }
                else if (counter == 3)
                {
                    if (!string.IsNullOrEmpty(word[3]))
                    {
                        if (!string.IsNullOrEmpty(word[2]) || !string.IsNullOrEmpty(word[1]) || !string.IsNullOrEmpty(word[0]))
                        {
                            text += word[3] + " ميليارد و ";
                        }
                        else
                        {
                            text += word[3] + " ميليارد";
                            break; // TODO: might not be correct. Was : Exit For
                        }
                    }
                }
                else if (counter == 2)
                {
                    if (!string.IsNullOrEmpty(word[2]))
                    {
                        if (!string.IsNullOrEmpty(word[1]) || !string.IsNullOrEmpty(word[0]))
                        {
                            text += word[2] + " ميليون و ";
                        }
                        else
                        {
                            text += word[2] + " ميليون";
                            break; // TODO: might not be correct. Was : Exit For
                        }
                    }
                }
                else if (counter == 1)
                {
                    if (!string.IsNullOrEmpty(word[1]))
                    {
                        if (!string.IsNullOrEmpty(word[0]))
                        {
                            text += word[1] + " هزار و ";
                        }
                        else
                        {
                            text += word[1] + " هزار";
                            break; // TODO: might not be correct. Was : Exit For
                        }
                    }
                }
                else
                {
                    text += word[0];
                }
            }
            //---------------------------------------------------'
            //---------------------------------------------------'
            return text;
        }

        private static string ChangingNum(long number)
        {
            //---------------------------------------------------'
            var n = new List<string>();
            var yekan = "";
            var dahgan = "";
            var sadgan = "";
            var value = "";
            //---------------------------------------------------'
            do
            {
                var a = Convert.ToInt64(number / 10);
                var b = number % 10;
                n.Add(b.ToString(CultureInfo.InvariantCulture));
                if (a >= 10)
                {
                    number = a;
                }
                else
                {
                    n.Add(a.ToString(CultureInfo.InvariantCulture));
                    break; // TODO: might not be correct. Was : Exit Do
                }
            }
            while (true);
            //---------------------------------------------------'
            if (n.Count == 3)
            {
                switch (n[2])
                {
                    case "0":
                        sadgan = "";
                        break;
                    case "1":
                        sadgan = "صد";
                        break;
                    case "2":
                        sadgan = "دويست";
                        break;
                    case "3":
                        sadgan = "سيصد";
                        break;
                    case "4":
                        sadgan = "چهارصد";
                        break;
                    case "5":
                        sadgan = "پانصد";
                        break;
                    case "6":
                        sadgan = "ششصد";
                        break;
                    case "7":
                        sadgan = "هفتصد";
                        break;
                    case "8":
                        sadgan = "هشتصد";
                        break;
                    case "9":
                        sadgan = "نهصد";
                        break;
                }
            }
            //---------------------------------------------------'
            switch (n[0])
            {
                case "0":
                    yekan = "";
                    break;
                case "1":
                    yekan = "يك";
                    break;
                case "2":
                    yekan = "دو";
                    break;
                case "3":
                    yekan = "سه";
                    break;
                case "4":
                    yekan = "چهار";
                    break;
                case "5":
                    yekan = "پنج";
                    break;
                case "6":
                    yekan = "شش";
                    break;
                case "7":
                    yekan = "هفت";
                    break;
                case "8":
                    yekan = "هشت";
                    break;
                case "9":
                    yekan = "نه";
                    break;
            }
            //---------------------------------------------------'
            switch (n[1])
            {
                case "0":
                    dahgan = "";
                    break;
                case "1":
                    switch (n[0])
                    {
                        case "0":
                            yekan = "ده";
                            break;
                        case "1":
                            yekan = "يازده";
                            break;
                        case "2":
                            yekan = "دوازده";
                            break;
                        case "3":
                            yekan = "سيزده";
                            break;
                        case "4":
                            yekan = "چهارده";
                            break;
                        case "5":
                            yekan = "پانزده";
                            break;
                        case "6":
                            yekan = "شانزده";
                            break;
                        case "7":
                            yekan = "هفده";
                            break;
                        case "8":
                            yekan = "هيجده";
                            break;
                        case "9":
                            yekan = "نوزده";
                            break;
                    }
                    break;


                case "2":
                    dahgan = "بيست";
                    break;
                case "3":
                    dahgan = "سي";
                    break;
                case "4":
                    dahgan = "چهل";
                    break;
                case "5":
                    dahgan = "پنجاه";
                    break;
                case "6":
                    dahgan = "شصت";
                    break;
                case "7":
                    dahgan = "هفتاد";
                    break;
                case "8":
                    dahgan = "هشتاد";
                    break;
                case "9":
                    dahgan = "نود";
                    break;
            }
            //---------------------------------------------------'
            if (!string.IsNullOrEmpty(sadgan))
            {
                value += sadgan;
                if (!string.IsNullOrEmpty(dahgan))
                {
                    value += " و " + dahgan;
                    if (!string.IsNullOrEmpty(yekan))
                    {
                        value += " و " + yekan;
                    }
                }
                else if (!string.IsNullOrEmpty(yekan))
                {
                    value += " و " + yekan;
                }
            }
            else if (!string.IsNullOrEmpty(dahgan))
            {
                value += dahgan;
                if (!string.IsNullOrEmpty(yekan))
                {
                    value += " و " + yekan;
                }
            }
            else
            {
                value += yekan;
            }
            //---------------------------------------------------'
            //---------------------------------------------------'
            return value;
        } 
    }
}