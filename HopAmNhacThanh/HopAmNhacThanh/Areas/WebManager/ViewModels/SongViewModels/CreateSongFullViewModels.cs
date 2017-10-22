using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels
{
    public class CreateSongFullViewModels
    {
        [Display(Name = "Tên bài hát")]
        [MaxLength(60)]
        [Required]
        public string NameSong { get; set; }
        [MaxLength(60)]
        [Display(Name = "Tên khác")]
        public string OrtherNameSong { get; set; }
        //[Display(Name = "Slug")]
        //[MaxLength(30)]
        //[Required]
        //public string Slug { get; set; }
        [Display(Name = " Thể loại")]
        [Required]
        public int CategoryID { get; set; }
        [Display(Name = "Tác giả")]
        public int AuthorSongID { get; set; }
        public int VietNameseLyric { get; set; }
        [Display(Name = "Năm xuất bản")]
        public string YearPublish { get; set; }
        public List<TempChords> ArrChords { get; set; }
        public List<TempLinkSong> ArrLinkSong { get; set; }
        public List<TempVideo> ArrVideo {get;set;}
        public List<TempSheetMusic> ArrSheetMusic { get; set; }



    }
    public class TempChords
    {
        public string Intro { get; set; }
        public string Lyric { get; set; }
    }

    public class TempLinkSong
    {
        public int SongID { get; set; }
        public string Tone { get; set; }
        public string Link { get; set; }
    }

    public class TempVideo
    {
        public string Name { get; set; }
        public string Link { get; set; }
    }

    public class TempSheetMusic
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }
}
