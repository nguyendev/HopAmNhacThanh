using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoVuiHaiNao.Services
{
    public static class Global
    {
        public static string DIR_IMAGE = "images";
        public const string APPROVED = "A";
        public const string UNAPPROVED = "U";
        public const int LENGTH_LYRIC = 196;
    }
    public enum TypeQuestion
    {
        MultipleChoice = 1,
        MultipleWithImage = 2
    }

    public static class Fonsize
    {
        public static int BIGGEST = 3;
        public static int BIG = 2;
        public static int NORMAL = 1;
        public static int SMALL = 0;
    }

}
