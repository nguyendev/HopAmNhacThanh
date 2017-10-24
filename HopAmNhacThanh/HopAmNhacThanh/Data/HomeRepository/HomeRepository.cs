﻿using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
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

            List<SimpleSongViewModel> ListNewSong = new List<SimpleSongViewModel>();
            var application = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreateDT).Take(10).ToListAsync();
            foreach (var item in application)
            {
                var chords = _context.Chords
                    .Where(p => p.SongID == item.ID)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .First();
                SimpleSongViewModel song = new SimpleSongViewModel
                {
                    Name = item.Name,
                    Album = item.Album,
                    AuthorSong = item.AuthorSong,
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
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.Views)
                .Take(10).ToListAsync();
            foreach (var item in application)
            {
                var chords = _context.Chords
                    .Where(p => p.SongID == item.ID)
                    .First();
                SimpleSongViewModel song = new SimpleSongViewModel
                {
                    Name = item.Name,
                    Album = item.Album,
                    AuthorSong = item.AuthorSong,
                    OrtherName = item.OrtherName,
                    View = item.Views,
                    Lyric = SEOExtension.GetStringToLength(chords.Lyric, LENGTH_LYRIC),
                    Slug = item.Slug,
                    VersionSlug = chords.Slug
                };
                ListPupularSong.Add(song);
            }


            #region Sidebar
            //Top week
            var topWeekContext = await _context.Song
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .OrderByDescending(p => p.Views)
               .Take(10).ToListAsync();
            List<BestSimpleSongViewModel> ListTopSong = new List<BestSimpleSongViewModel>();
            foreach (var item in topWeekContext)
            {
                var chords = _context.Chords
                    .Where(p => p.SongID == item.ID)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .First();
                BestSimpleSongViewModel song = new BestSimpleSongViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                    Version = item.Slug,
                    Views = item.Views
                };
                ListTopSong.Add(song);
            }

            var styleDbContext = await _context.Style.ToListAsync();

            List<SimpleStyleViewModel> ListStyle = new List<SimpleStyleViewModel>();
            foreach (var item in styleDbContext)
            {
                SimpleStyleViewModel style = new SimpleStyleViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                };
                ListStyle.Add(style);
            }

            var albumDbContext = await _context.Album.Take(10).ToListAsync();

            List<SimpleAlbumViewModel> ListAlbum = new List<SimpleAlbumViewModel>();
            foreach (var item in albumDbContext)
            {
                SimpleAlbumViewModel album = new SimpleAlbumViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                };
                ListAlbum.Add(album);
            }
            #endregion
            MainContentViewModel model = new MainContentViewModel
            {
                ListNewSong = ListNewSong,
                ListPupularSong = ListPupularSong,
                ListTopSong = ListTopSong,
                ListStyle = ListStyle,
                ListTopAlbum = ListAlbum,
            };
            return model;


        }

        public async Task<MainSingleViewModel> GetMainSingle(string slugSong, string slugVersion)
        {
            //try
            //{
                string Intro = "";
                string Lyric = "";
                string Tone = "";
                Style Style = null;
                ApplicationUser AuthorChords = null;
                var songContext = await _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Include(p => p.Category)
                    .Include(p => p.VietnameseLyric)
                    .FirstOrDefaultAsync(p => p.Slug == slugSong);

                var chordsContext = await _context.Chords
                    .Include(p => p.Author)
                    .Include(p => p.Style)
                    .Where(p => p.SongID == songContext.ID)
                    .ToListAsync();
                List<SimpleChordsViewModel> simpleChords = new List<SimpleChordsViewModel>();
                foreach (var item in chordsContext)
                {
                    bool selected = item.Slug == slugVersion ? true : false;
                    SimpleChordsViewModel simpleChord = new SimpleChordsViewModel
                    {
                        Name = item.Info,
                        Author = item.Author,
                        Description = item.InfoShort,
                        Slug = item.Slug,
                        Selected = selected,
                    };
                    if (selected)
                    {
                        Intro = item.Intro;
                        Lyric = item.Lyric;
                        AuthorChords = item.Author;
                        Style = item.Style;
                        Tone = item.Tone;
                    }

                    simpleChord.StyleName = item.StyleID.HasValue ? item.Style.Name : "";
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

                var songInCategoryContext = await _context.Song
                        .Where(p => p.Approved == Global.APPROVED)
                        .Where(p => p.CreateDT <= DateTime.Now)
                        .Where(p => !p.IsDeleted)
                        .Where(p => p.CategoryID == songContext.CategoryID).Take(10).ToListAsync();
                List<SimpleSongInAblumViewModel> ListSongInCategory = new List<SimpleSongInAblumViewModel>();
                foreach (var item in songInCategoryContext)
                {
                    SimpleSongInAblumViewModel songInAblum = new SimpleSongInAblumViewModel
                    {
                        Name = item.Name,
                        Slug = item.Slug,
                        
                    };
                    songInAblum.Number = item.NumberSongInAlbum.HasValue ? item.NumberSongInAlbum.Value : 0;
                    ListSongInCategory.Add(songInAblum);
                }

                

            MainSingleViewModel model = new MainSingleViewModel();
                model.Album = songContext.Album;
                model.Name = songContext.Name;
                model.AuthorSong = songContext.AuthorSong;
                model.Category = songContext.Category;
                model.OrtherName = songContext.OrtherName;
                model.Slug = songContext.Slug;
                model.Views = songContext.Views;
                model.VietnameseLyric = songContext.VietnameseLyric;
                model.ListChords = simpleChords;
                model.ListLinkSong = listLinkSongs;
                model.IsSheetExisted = isSheetExisted;
                model.ListVideos = listVideo;
                model.Lyric = Lyric;
                model.Intro = Intro;
            model.Tone = Tone;
                model.ListSongInCategory = ListSongInCategory;
                model.Style = Style;
                model.AuthorChords = AuthorChords;
                if (songContext.AlbumID.HasValue)
                {
                    var songInAlbumContext = await _context.Song.Where(p => p.AlbumID == songContext.AlbumID).Take(10).ToListAsync();
                    List<SimpleSongInAblumViewModel> ListSongInAlbum = new List<SimpleSongInAblumViewModel>();
                    foreach (var item in songInAlbumContext)
                    {
                        SimpleSongInAblumViewModel songInAblum = new SimpleSongInAblumViewModel
                        {
                            Name = item.Name,
                            Slug = item.Slug,
                            Number = item.NumberSongInAlbum.Value,
                        };
                        ListSongInAlbum.Add(songInAblum);
                    }
                    model.ListSongInAblum = ListSongInAlbum;
                }
                else
                    model.ListSongInAblum = null;

                return model;
            //}
            //catch
            //{
            //    return null;
            //}
        }

        public async Task<MainSearchViewModel> GetSearch(string searchString, int page, int pageSize)
        {
            var songDbContext = from s in _context.Song
                                .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Include(p => p.Category)
                    .Include(p => p.VietnameseLyric)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                                select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                songDbContext = songDbContext.Where(s => s.Name.Contains(searchString))
                    .OrderByDescending(p => p.CreateDT);
                if (songDbContext.Count() == 0)
                {
                    songDbContext = songDbContext.Where(s => s.OrtherName.Contains(searchString))
                        .OrderByDescending(p => p.CreateDT);
                }
                
            }
            var songPaginatedList = await PaginatedList<Song>.CreateAsync(songDbContext.AsNoTracking(), page, pageSize);


            List<SimpleSongViewModel> listSong = new List<SimpleSongViewModel>();
            foreach (var item in songPaginatedList)
            {
                var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .Where(p => p.Approved == Global.APPROVED)
                        .Where(p => p.CreateDT <= DateTime.Now)
                        .Where(p => !p.IsDeleted)
                        .First();
                SimpleSongViewModel song = new SimpleSongViewModel
                {
                    Name = item.Name,
                    Album = item.Album,
                    AuthorSong = item.AuthorSong,
                    OrtherName = item.OrtherName,
                    View = item.Views,
                    Lyric = SEOExtension.GetStringToLength(chords.Lyric, LENGTH_LYRIC),
                    Slug = item.Slug,
                    VersionSlug = chords.Slug
                };
                listSong.Add(song);
            }

            MainSearchViewModel search = new MainSearchViewModel
            {
                Count = songPaginatedList.Count,
                PageIndex = songPaginatedList.PageIndex,
                PageSize = songPaginatedList.PageSize,
                TotalPages = songPaginatedList.TotalPages,
                ListSong = listSong,
                Action = "search",
                Controller = "home",
                Search = searchString
            };
            return search;
        }

        public async Task<MainContentViewModel> GetMainHome(char slug, int page, int pageSize)
        {
            try
            {
                List<SimpleSongViewModel> ListNewSong = new List<SimpleSongViewModel>();
                var application = _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .Where(p => p.Name.ToString().ToLower().First() == slug);

                application = application.OrderByDescending(p => p.CreateDT);

                var songPaginatedList = await PaginatedList<Song>.CreateAsync(application.AsNoTracking(), page, pageSize);


                foreach (var item in songPaginatedList)
                {
                    var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .First();
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        Album = item.Album,
                        AuthorSong = item.AuthorSong,
                        OrtherName = item.OrtherName,
                        View = item.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, LENGTH_LYRIC),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
                    };
                    ListNewSong.Add(song);
                }

                List<SimpleSongViewModel> ListPupularSong = new List<SimpleSongViewModel>();
                application = _context.Song
                    .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Where(p => p.Name.ToString().ToLower().First() == slug);

                application = application.OrderByDescending(p => p.Views);
                foreach (var item in songPaginatedList)
                {
                    var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .First();
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        Album = item.Album,
                        AuthorSong = item.AuthorSong,
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
                    Action = "Home",
                    Controller = "Index",
                    Count = songPaginatedList.Count,
                    PageIndex = songPaginatedList.PageIndex,
                    PageSize = songPaginatedList.PageSize,
                    TotalPages = songPaginatedList.TotalPages
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

        public async Task IncreaseView(string slug)
        {
            var single = await _context.Song.SingleOrDefaultAsync(p => p.Slug == slug);
            single.Views++;

            _context.Song.Update(single);
            await _context.SaveChangesAsync();
        }
    }
}
