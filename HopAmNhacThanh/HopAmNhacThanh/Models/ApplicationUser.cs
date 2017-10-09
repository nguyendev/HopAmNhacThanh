using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace HopAmNhacThanh.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(100)]
        public string FullName { get; set; }
        [MaxLength(1000)]
        public string About { get; set; }
        [MaxLength(100)]
        public string PictureSmall { get; set; }
        [MaxLength(100)]
        public string Picture65x65 { get; set; }
        [MaxLength(50)]
        public string Slug { get; set; }
        [MaxLength(100)]
        public string PictureBig { get; set; }
        [MaxLength(100)]
        public string DateofBirth { get; set; }
        [MaxLength(100)]
        public string Facebook { get; set; }
        [MaxLength(100)]
        public string GooglePlus { get; set; }
        [MaxLength(100)]
        public string Linkedin { get; set; }
        [MaxLength(100)]
        public string Twitter { get; set; }
        [MaxLength(100)]
        public string IdentityFacebook { get; set; }
        public int Score { get; set; }
        [MaxLength(100)]
        public string Website { get; set; }
        public DateTime? CreateDT { get; set; }

        public bool IsDeleted { get; set; }
    }
}
