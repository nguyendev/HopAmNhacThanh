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
        public async Task<MainContentViewModel> GetMainHome()
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
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
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
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
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

        public async Task<MainSingleViewModel> GetMainSingle(string slugSong, string slugVersion)
        {
            try
            {
                string Intro = "";
                string Lyric = "";
                var songContext = await _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Include(p => p.Category)
                    .Include(p => p.VietnameseLyric)
                    .FirstOrDefaultAsync(p => p.Slug == slugSong);

                var chordsContext = await _context.Chords
                    .Include(p => p.Author)
                    .Where(p => p.SongID == songContext.ID)
                    .ToListAsync();
                List<SimpleChordsViewModel> simpleChords = new List<SimpleChordsViewModel>();
                foreach (var item in chordsContext)
                {
                    bool selected = item.Slug == slugVersion ? true : false;
                    SimpleChordsViewModel simpleChord = new SimpleChordsViewModel
                    {
                        Name = item.Info,
                        AuthorName = item.Author.FullName,
                        Description = item.InfoShort,
                        Slug = item.Slug,
                        Selected = selected
                    };
                    if (selected)
                    {
                        Intro = item.Intro;
                        Lyric = item.Lyric;
                    }
                    simpleChords.Add(simpleChord);
                };

                var linkSongContext = await _context.LinkSong
                    .Include(p => p.SingleSong)
                    .Where(p => p.SongID == songContext.ID)
                    .ToListAsync();
                List<SimpleLinkSongViewModel> listLinkSongs = new List<SimpleLinkSongViewModel>();
                foreach (var item in linkSongContext)
                {
                    SimpleLinkSongViewModel simpleLinkSong = new SimpleLinkSongViewModel
                    {
                        Link = item.Link,
                        SingleSongName = item.SingleSong.Name,
                        Slug = item.SingleSong.Slug
                    };
                    listLinkSongs.Add(simpleLinkSong);
                };

                bool isSheetExisted = await _context.SheetMusic.AnyAsync(p => p.SongID == songContext.ID);

                var videoContext = await _context.Video
                    .Where(p => p.SongID == songContext.ID)
                    .ToListAsync();
                List<SimpleVideoViewModel> listVideo = new List<SimpleVideoViewModel>();
                foreach (var item in videoContext)
                {
                    SimpleVideoViewModel simpleVideo = new SimpleVideoViewModel
                    {
                        Link = item.Link,
                        Name = item.Name,
                        
                    };
                    simpleVideo.Type = item.Type.HasValue ? item.Type.Value : 1;
                    listVideo.Add(simpleVideo);
                };

                MainSingleViewModel model = new MainSingleViewModel();
                model.AlbumName = songContext.Album != null ? songContext.Album.Name : "";
                model.Name = songContext.Name;
                model.AuthorSongName = songContext.AuthorSong != null ? songContext.AuthorSong.Name: "";
                model.CategoryName = songContext.Category != null ? songContext.Category.Name : "";
                model.OrtherName = songContext.OrtherName;
                model.Slug = songContext.Slug;
                model.Views = songContext.Views;
                model.VietnameseLyricName = songContext.VietnameseLyric != null ? songContext.VietnameseLyric.Name : "";
                model.ListChords = simpleChords;
                model.ListLinkSong = listLinkSongs;
                model.IsSheetExisted = isSheetExisted;
                model.ListVideos = listVideo;
                model.Lyric = Lyric;
                model.Intro = Intro;

                return model;
            }
            catch
            {
                return null;
            }
        }
    }
}
