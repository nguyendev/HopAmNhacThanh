using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models;

namespace HopAmNhacThanh.Areas.APIManager.ViewModels
{
    public class SimpleCategoryApiViewModel
    {
        public string Slug { get; set; }
        public string Name { get; set; }
        public int Count { get; set; }
    }

    public class SingleCategoryApiViewModel
    {
        public string Name { get; set;}
        public string Description { get; set; }
        public Images Image { get; set; }
        public List<SimpleSongApiViewModel> ListSong { get; set;}
    }
}
