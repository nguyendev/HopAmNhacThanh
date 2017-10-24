using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Images : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ID { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(150)]
        public string ALT { get; set; }
        [MaxLength(150)]
        public string Title { get; set; }
        //[MaxLength(200)]
        //public string PicFull { get; set; }
        //[MaxLength(200)]
        //public string Pic640x480 { get; set; }
        //[MaxLength(200)]
        //public string Pic320x240 { get; set; }

    }
}
