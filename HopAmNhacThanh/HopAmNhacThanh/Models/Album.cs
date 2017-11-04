using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Album : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ID { get; set; }
        [Display(Name = "Tên album")]
        [StringLength(50)]
        public string Name { get; set; }
        [Display(Name = "Tên rút gọn")]
        [StringLength(20)]
        public string ShortName { get; set; }
        [Display(Name = "Mô tả")]
        [StringLength(300)]
        public string Description { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
        [Display(Name = "Slug")]
        [StringLength(30)]
        public string Slug { get; set; }
    }
}
