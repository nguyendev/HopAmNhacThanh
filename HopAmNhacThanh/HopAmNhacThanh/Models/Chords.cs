using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Chords
    {
        public int ID { get; set; }
        public int SongID { get; set; }
        public int? StyleID { get; set; }
        public Style Style { get; set; } 
    }
}
