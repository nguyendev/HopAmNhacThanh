using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.SheetMusicViewModels
{
    public class SingleSheetMusicViewModel
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string SlugVersion { get; set; }
        public List<SimpleSheetMusicViewModel> ListPNG { get; set; }
        public List<SimpleSheetMusicViewModel> ListJPG { get; set; }
        public List<SimpleSheetMusicViewModel> ListPDF { get; set; }
    }

    public class SimpleSheetMusicViewModel

    {
        public string Source { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Number { get; set; }
    }
}

