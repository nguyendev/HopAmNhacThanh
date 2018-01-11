using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.ViewModels
{
    public class SimpleAuthorSongApiViewModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public List<SimpleSongApiViewModel> ListSong { get; set; }
    }
}
