using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Base
    {
        public DateTime? CreateDT { get; set; }
        public DateTime? UpdateDT { get; set; }
        public string AuthorID { get; set; }
        public ApplicationUser Author { get; set; }
        [MaxLength(1)]
        public string Approved { get; set; }
        [MaxLength(1)]
        public string Active { get; set; }
        public bool IsDeleted { get; set; }
        [MaxLength(200)]
        public string Note { get; set; }
    }
}
