﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class LinkSong : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        public long SongID { get; set; }
        public Song Song { get; set; }
        [MaxLength(5)]
        [Display(Name = "Tông chủ")]
        public string Tone { get; set; }
        [Required]
        [Display(Name = "Link")]
        public string Link { get; set; }
        [Display(Name = "Tên ca sỹ")]
        public int? SingleSongID { get; set; }
        public SingleSong SingleSong { get; set; }
    }
}
