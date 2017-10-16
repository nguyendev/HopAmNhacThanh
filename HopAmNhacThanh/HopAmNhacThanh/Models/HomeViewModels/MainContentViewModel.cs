using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.HomeViewModels
{
    public class MainContentViewModel
    {
        public List<SimpleSongViewModel> ListNewSong { get; set; }
        public List<SimpleSongViewModel> ListPupularSong { get; set; }
    }

    public class SimpleSongViewModel
    {
        public string Name { get; set; }
        public string OrtherName { get; set; }
        public string AuthorSong { get; set; }
        public string AlbumName { get; set; }
        public int View { get; set; }
        public string Lyric { get; set; }
    }
}
