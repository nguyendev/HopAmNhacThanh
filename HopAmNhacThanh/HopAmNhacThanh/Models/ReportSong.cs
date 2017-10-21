using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class ReportSong
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        
        public long SongID { get; set; }
        public Song Song { get; set; }
        public int Type { get; set; }
        public string Error { get; set; }
        public DateTime? CreateDT { get; set; }
        public bool Deleted { get; set; }
        public bool IsFinished { get; set; }
    }
}
