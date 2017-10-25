using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.SidebarViewModels
{
    public class CommonSidebarViewModel
    {
        public List<SimpleStyleViewModel> ListStyle { get; set; }
        public List<BestSimpleSongViewModel> ListSong { get; set; }
        public List<SimpleAlbumViewModel> ListTopAlbum { get; set; }
    }
    public class SimpleStyleViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
    }
    public class BestSimpleSongViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Views { get; set; }
        public string Version { get; set; }
    }

    public class SimpleAlbumViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
    }
}
