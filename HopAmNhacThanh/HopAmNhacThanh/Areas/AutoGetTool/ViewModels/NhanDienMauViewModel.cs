using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.ViewModels
{
    public class NhanDienMauViewModel
    {
        public string Url { get; set; }

        public string H1 { get; set; }

        public string[] P { get; set; }

        public string Template { get; set; }

        public NhanDienMauViewModel(string Url, string H1, string[] P, string Template)
        {
            this.Url = Url;
            this.H1 = H1;
            this.P = P;
            this.Template = Template;
        }
    }
    public class NhanDienLyricViewModel
    {
        public string Url { get; set; }

        public string H1 { get; set; }

        public string lyric { get; set; }

        public string Template { get; set; }

        public NhanDienLyricViewModel(string Url, string lyric, string Template)
        {
            this.Url = Url;
            this.lyric = lyric;
            this.Template = Template;
        }
    }
}
