using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class LinkSong : Base
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Tone { get; set; }
        public string Link { get; set; }
    }
}
