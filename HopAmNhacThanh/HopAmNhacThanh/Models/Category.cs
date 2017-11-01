using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Category
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ID { get; set; }
        [Required]
        [Display(Name="Tên")]
        [MaxLength(60)]
        public string Name { get; set; }
        public string Description { get; set; }
        [Display(Name = "Hình ảnh")]
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        [Display(Name = "Slug")]
        public string Slug { get; set; }
        [Display(Name = "Ghi chú")]
        public bool IsDeleted { get; set; }
        public string Note { get; set; }
    }
}
