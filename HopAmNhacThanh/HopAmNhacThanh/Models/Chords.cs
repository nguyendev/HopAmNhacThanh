using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Chords : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        public long SongID { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Display(Name = "Tên phiên bản")]
        public string Version { get; set; }
        [StringLength(30, MinimumLength = 3)]
        [Display(Name = "Slug")]
        public string Slug { get; set; }
        [Display(Name = "Thông tin mô tả ngắn")]
        [StringLength(30, MinimumLength = 3)]
        public string InfoShort { get; set; }
        [Display(Name = "Thông tin đầy đủ")]
        public string Info { get; set; }
        [Display(Name = "Điệu")]
        public int? StyleID { get; set; }
        public Style Style { get; set; }
        [StringLength(5)]
        [Display(Name = "Tông chủ")]
        public string Tone { get; set; }
        [Display(Name = "Lời và hợp âm bài hát")]
        public string Lyric { get; set; }
        [Display(Name = "Intro")]
        public string Intro { get; set; }
    }
}
