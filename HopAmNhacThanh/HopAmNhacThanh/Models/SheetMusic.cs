using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class SheetMusic : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        public long? SongID { get; set; }
        public Song Song { get; set; }
        public string Name { get; set; }
        public string Source { get; set; }
        public int Number { get; set; }
        public string Type { get; set; }
    }
}
