using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DoVuiHaiNao.Services
{
    public static class Global
    {
        public static string DIR_IMAGE = "images";
        public static string APPROVED = "A";
        public static string UNAPPROVED = "U";
        public static int LENGTH_LYRIC = 196;
        public static int LENGTH_LYRIC_MOBILE = 45;
        public static string API_KEY = "NGUYENIT";
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
