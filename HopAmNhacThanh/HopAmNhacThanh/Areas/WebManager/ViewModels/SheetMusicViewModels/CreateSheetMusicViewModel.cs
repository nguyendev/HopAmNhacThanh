using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SheetMusicViewModels
{
    public class CreateSheetMusicViewModel
    {
        public long SongID { get; set; }
        public Song Song { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public string Type { get; set; }
    }
}
