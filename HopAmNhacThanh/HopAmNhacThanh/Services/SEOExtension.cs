﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoVuiHaiNao.Services
{
    public static class SEOExtension
    {
        public const int MaxDescriptionSEO = 150;
        public const int MaxDescriptionNormal = 300;
        
        public static string GetStringToLength(string s, int Length)
        {
            string endLine = "...";
            int length = Length;
            if (s.Length < Length)
            {
                length = s.Length - 1;
                endLine = " ?";
            }
            try
            {
                while (s[length] != ' ')
                {
                    length--;
                }
                s = s.Substring(0, length);
                s = s + endLine;
                return s;
            }
            catch {
                return "";
            }
        }
    }
}
