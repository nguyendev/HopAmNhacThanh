using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace DoVuiHaiNao.Services
{
    public static class StringExtensions
    {
        private static Random random = new Random();
        private const int MaxDescriptionSEO = 150;
        private const int MaxDescriptionNormal = 300;
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string RandomNumber(int length)
        {
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string MakeUrlFriendly(this string value)
        {
            value = value.ToLowerInvariant().Replace(" ", "-");
            value = value.ToLowerInvariant().Replace(".", "");
            value = Regex.Replace(value, @"[^0-9a-z-]", string.Empty);

            return value;
        }
        //Chuyen chuoi sang danh sach chuoi
        public static List<string> ConvertStringToListString(string value)
        {

            while (value.IndexOf("  ") >= 0)    //tim trong chuoi vi tri co 2 khoang trong tro len  
            {
                value = value.Replace("  ", " ");   //sau do thay the bang 1 khoang trong
            }
            List<string> list = new List<string>(10000);

            //Ham cat chuoi
            while (value.IndexOf(" ") >= 0 && value.IndexOf(",") >= 0)
            {

                int begin = 0;
                int end = 0;
                if (value.IndexOf(" ") == 0 || value.IndexOf(",") == 0)
                    begin = 1;
                if (value.IndexOf(", ") == 0)
                    begin = 2;
                if (value.IndexOf(",", begin) != -1)
                {
                    end = value.IndexOf(",", begin);
                }
                else
                {
                    end = value.Length;
                }
                string temp = "";
                if (begin == 0)
                {
                    temp = value.Substring(begin, end);
                }
                else if (begin == 1)
                {
                    temp = value.Substring(begin, end - 1);
                }
                else
                {
                    temp = value.Substring(begin, end - 2);
                }
                value = value.Remove(0, end);
                list.Add(temp);

            }
            return list;
        }
        //Chuyen sang tieng viet khong dau
        public static string ConvertToUnSign3(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            temp = temp.ToLower();
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D').Replace(" ", "-");
        }
        public static string RemoveBr(string s)
        {
            return Regex.Replace(s, @"(<br */>)|(\[br */\])", " ");
        }

    }

}
