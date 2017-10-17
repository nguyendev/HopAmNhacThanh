using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.HomeViewModels
{
    public class MainSingleViewModel
    {
        public string Name { get; set; }
        public string OrtherName { get; set; }
        public string Slug { get; set; }
        [Display(Name = " Thể loại")]
        public string CategoryName { get; set; }
        [Display(Name = "Album")]
        public string AlbumName { get; set; }
        [Display(Name = "Tác giả")]
        public string AuthorSongName { get; set; }
        [Display(Name = "Lời việt")]
        public string VietnameseLyricName { get; set; }
        public string Intro { get; set; }
        public string Lyric { get; set; }
        [Display(Name = "Năm xuất bản")]
        public List<SimpleLinkSongViewModel> ListLinkSong { get; set; }
        public List<SimpleChordsViewModel> ListChords { get; set; }
        public List<SimpleVideoViewModel> ListVideos { get; set; }
        public bool IsSheetExisted { get; set; }
        [Display(Name = "Lượt xem")]
        public int Views { get; set; }
    }


    public class SimpleChordsViewModel
    {
        public string Slug { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string AuthorName { get; set; }
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
}
