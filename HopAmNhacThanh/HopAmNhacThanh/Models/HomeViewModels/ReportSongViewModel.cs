using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.HomeViewModels
{
    public class ReportSongViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Url { get; set; }
        public int Type { get; set; }
        public string Error { get; set; }
        public DateTime? CreateDT { get; set; }
        public bool Deleted { get; set; }
    }
}
