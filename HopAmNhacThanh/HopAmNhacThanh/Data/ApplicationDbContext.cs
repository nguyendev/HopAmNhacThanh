using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Models;

namespace HopAmNhacThanh.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
        public DbSet<Song> Song { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<Chords> Chords { get; set; }
        public DbSet<LinkSong> LinkSong { get; set; }
        public DbSet<SingleSong> SingleSong { get; set; }
        public DbSet<Style> Style { get; set; }
        public DbSet<Video> Video { get; set; }
        public DbSet<Album> Album { get; set; }
        public DbSet<AuthorSong> AuthorSong { get; set; }
        public DbSet<SheetMusic> SheetMusic { get; set; }
        public DbSet<VietnameseLyric> VietnameseLyric { get; set; }
        public DbSet<ReportSong> ReportSong { get; set; }
        public DbSet<FavoriteSongChord> FavoriteSongChord { get; set; }
        public DbSet<LikeSongChords> LikeSongChords { get; set; }
        public DbSet<HopAmNhacThanh.Models.ApplicationUser> ApplicationUser { get; set; }
        public DbSet<HopAmNhacThanh.Models.RequestSong> RequestSong { get; set; }
        public DbSet<HopAmNhacThanh.Models.Images> Images { get; set; }
        public DbSet<HopAmNhacThanh.Models.Audio> Audio { get; set; }
    }
}
