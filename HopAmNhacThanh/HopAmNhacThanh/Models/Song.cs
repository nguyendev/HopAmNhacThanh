using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Song : Base
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Required]
        [Display(Name =" Tên bài hát")]

        public string Name { get; set; }
        [MaxLength(60)]
        [Display(Name = " Tên khác")]
        public string OrtherName { get; set; }
        [Display(Name = " Slug")]
        [MaxLength(30)]
        [Required]
        public string Slug { get; set; }
        [Display(Name = " Thể loại")]
        [Required]
        public int CategoryID { get; set; }
        public Category Category {get;set;}
        [Display(Name = "Album")]
        [Required]
        public int? AlbumID { get; set; }
        public Album Album { get; set; }
        [Display(Name = "Tác giả")]
        [Required]
        public int? AuthorSongID { get; set; }
        public AuthorSong AuthorSong { get; set; }
        [Display(Name = "Lời việt")]
        public int? VietnameseLyric { get; set; }
        [Display(Name = "Năm xuất bản")]
        public string YearPublish { get; set; }
        public List<LinkSong> ListLinkSong { get; set; }
        public List<Chords> ListChords { get; set; }
        public List<Video> ListVideos { get; set; }
        public List<SheetMusic> ListSheetMusic { get; set; }
        [Display(Name= "Lượt xem")]
        public int Views { get; set; }
        //the se tinh sau

    }
}
