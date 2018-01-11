using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.APIManager.ViewModels;
using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class AuthorSongApiRepository : IAuthorSongApiRepository
    {
        private readonly ApplicationDbContext _context;

        public AuthorSongApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<SimpleAuthorSongApiViewModel>> GetListAuthorSong()
        {
            var authorSongDbContext = await _context.AuthorSong.ToListAsync();
            List<SimpleAuthorSongApiViewModel> ListAuthorSong = new List<SimpleAuthorSongApiViewModel>();
            foreach (var item in authorSongDbContext)
            {
                int count = _context.Song
                    .Where(p => p.AlbumID == item.ID)
                    .Count();
                SimpleAuthorSongApiViewModel album = new SimpleAuthorSongApiViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                };
                ListAuthorSong.Add(album);
            }
            return ListAuthorSong;
        }
        public async Task<SimpleAuthorSongApiViewModel> GetSingleAuthorSong(string slug)
        {
            var single = await _context.AuthorSong
                .Include(p => p.Image)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            var songDbContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Where(p => p.AuthorSongID == single.ID)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.NumberSongInAlbum).ToListAsync();

            List<SimpleSongApiViewModel> ListSong = new List<SimpleSongApiViewModel>();

            foreach (var item in songDbContext)
            {
                var chords = _context.Chords
                    .Where(p => p.SongID == item.ID)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .First();
                if (chords != null)
                {
                    SimpleSongApiViewModel song = new SimpleSongApiViewModel
                    {
                        Name = item.Name,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug,
                        Number = item.NumberSongInAlbum,
                    };
                    ListSong.Add(song);
                }
            }

            SimpleAuthorSongApiViewModel model = new SimpleAuthorSongApiViewModel
            {
                ImageID = single.ImageID,
                Image = single.Image,
                Content = single.Content,
                Description = single.Description,
                Name = single.Name,
                Slug = single.Slug,
                ListSong = ListSong,
            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
