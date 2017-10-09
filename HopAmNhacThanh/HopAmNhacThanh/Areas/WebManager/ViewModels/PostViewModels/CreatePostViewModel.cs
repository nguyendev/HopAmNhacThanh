using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.PostViewModels
{
    public class CreatePostViewModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public int? ImageID { get; set; }
        //public Images Image { get; set; }

        public string Note { get; set; }

        public string AuthorID { get; set; }
        public string TempTag { get; set; }
    }
}
