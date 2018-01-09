using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.ViewModels
{
    public class SimpleSongApiViewModel
    {
        public string Name { get; set; }
        public int? Number { get; set; }
        public string Lyric { get; set; }
        public string Slug { get; set; }
        public string VersionSlug { get; set; }
    }
}
