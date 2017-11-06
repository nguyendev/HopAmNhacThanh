using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SheetMusicViewModels
{
    public class IndexSheetMusicViewModel : PageListItemTemplate
    {
        public List<SimpleIndexSheetMusicViewModel> ListSheetMusic { get; set; }
    }
    public class SimpleIndexSheetMusicViewModel : BaseIndexViewModel
    {
        public long ID { get; set; }
        public long? SongID { get; set; }
        public Song Song { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public string Type { get; set; }

    }
}
