using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Song : Base
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int CategoryID { get; set; }
        public Category Category {get;set;}
        public int? AuthorSongID { get; set; }
        public AuthorSong AuthorSong { get; set; }
        public int? SingleSongID { get; set; }
        public SingleSong SingleSong { get; set; }

        public string YearPublish { get; set; }
        public List<LinkSong> ListLinkSong { get; set; }
        public List<Chords> ListChords { get; set; }
        public int Views { get; set; }
        //the se tinh sau

    }
}
