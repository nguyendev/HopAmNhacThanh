using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models.HomeViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.HomeRepository
{
    public class HomeRepository : IHomeRepository
    {
        private readonly ApplicationDbContext _context;
        private const int LENGTH_LYRIC = 196;
        public HomeRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<MainContentViewModel> GetMainContent()
        {
            try
            {
                List<SimpleSongViewModel> ListNewSong = new List<SimpleSongViewModel>();
                var application = await _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .OrderByDescending(p => p.CreateDT).Take(10).ToListAsync();
                foreach (var item in application)
                {
                    var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .First();
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        AlbumName = item.Album.Name,
                        AuthorSong = item.AuthorSong.Name,
                        OrtherName = item.OrtherName,
                        View = item.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, LENGTH_LYRIC),
                    };
                    ListNewSong.Add(song);
                }

                List<SimpleSongViewModel> ListPupularSong = new List<SimpleSongViewModel>();
                application = await _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .OrderByDescending(p => p.CreateDT).Take(10).ToListAsync();
                foreach (var item in application)
                {
                    var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .First();
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        AlbumName = item.Album.Name,
                        AuthorSong = item.AuthorSong.Name,
                        OrtherName = item.OrtherName,
                        View = item.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, LENGTH_LYRIC),
                        
                    };
                    ListNewSong.Add(song);
                }
                MainContentViewModel model = new MainContentViewModel
                {
                    ListNewSong = ListNewSong,
                    ListPupularSong = ListPupularSong,

                };
                return model;
            }
            catch (Exception e)
            {
                //var logger = services.GetRequiredService<ILogger<Program>>();
                //logger.LogError(ex.Message, "An error occurred seeding the DB.");
                return null;
            }
        }
    }
}
