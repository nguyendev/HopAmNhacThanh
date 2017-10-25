using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.SidebarViewModels
{
    public class SingleSongSidebarViewModel
    {
        public List<SimpleLinkSongViewModel> ListLinkSong { get; set; }
        public List<SimpleChordsViewModel> ListChords { get; set; }
        public List<SimpleVideoViewModel> ListVideos { get; set; }
        public List<SimpleSongInAblumViewModel> ListSongInAblum { get; set; }
        public List<SimpleSongInAblumViewModel> ListSongInCategory { get; set; }
    }


    public class SimpleChordsViewModel
    {
        public string Slug { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ApplicationUser Author { get; set; }
        public string StyleName { get; set; }
        public bool Selected { get; set; }
    }

    public class SimpleLinkSongViewModel
    {
        public string Tone { get; set; }
        public string Link { get; set; }
        [Display(Name = "Tên ca sỹ")]
        public string SingleSongName { get; set; }
        public string Slug { get; set; }
    }

    public class SimpleVideoViewModel
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public int Type { get; set; }
    }

    public class SimpleSongInAblumViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Number { get; set; }
    }
}
