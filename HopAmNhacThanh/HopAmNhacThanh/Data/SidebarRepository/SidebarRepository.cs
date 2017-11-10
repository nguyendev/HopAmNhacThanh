using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models.SidebarViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Data.SidebarRepository
{
    public class SidebarRepository : ISidebarRepository
    {
        private readonly ApplicationDbContext _context;
        public SidebarRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CommonSidebarViewModel> GetCommonSidebar()
        {
            CommonSidebarViewModel model = new CommonSidebarViewModel
            {
                ListAlbum = await GetListAlbum(),
                ListCategory = await GetListCategory(),
                ListStyle = await GetListStyle(),
                ListTopSong = await GetListTopSong()
            };
            return model;
        }

        #region common sidebar 

        public async Task<List<SimpleAlbumViewModel>> GetListAlbum()
        {
            var albumDbContext = await _context.Album.Take(10).ToListAsync();
            List<SimpleAlbumViewModel> ListAlbum = new List<SimpleAlbumViewModel>();
            foreach (var item in albumDbContext)
            {
                int count = _context.Song
                    .Where(p => p.AlbumID == item.ID)
                    .Count();
                SimpleAlbumViewModel album = new SimpleAlbumViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                    Count = count,
                };
                ListAlbum.Add(album);
            }
            return ListAlbum;
        }

        public async Task<List<SimpleCategoryViewModel>> GetListCategory()
        {
            var categoryDbContext = await _context.Category
                .ToListAsync();
            List<SimpleCategoryViewModel> ListCategory = new List<SimpleCategoryViewModel>();
            foreach (var item in categoryDbContext)
            {
                int count = _context.Song
                    .Where(p => p.CategoryID == item.ID)
                    .Count();
                SimpleCategoryViewModel category = new SimpleCategoryViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                    Count = count
                };
                ListCategory.Add(category);
            }
            return ListCategory;
        }


        public async Task<List<SimpleStyleViewModel>> GetListStyle()
        {
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
            return ListStyle;
        }
        public async Task<List<BestSimpleSongViewModel>> GetListTopSong()
        {
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
                    Version = chords.Slug,
                    Views = item.Views
                };
                ListTopSong.Add(song);
            }
            return ListTopSong;
        }



        #endregion
        #region single song sidebar
        public async Task<List<SimpleLinkSongViewModel>> GetListLinkSong(long songID)
        {
            var linkSongContext = await _context.LinkSong
                .Include(p => p.SingleSong)
                .Where(p => p.SongID == songID)
                .ToListAsync();
            List<SimpleLinkSongViewModel> listLinkSongs = new List<SimpleLinkSongViewModel>();
            if (linkSongContext != null)
            {

                foreach (var item in linkSongContext)
                {
                    SimpleLinkSongViewModel simpleLinkSong = new SimpleLinkSongViewModel
                    {
                        Link = item.Link,
                        SingleSong = item.SingleSong,
                        Tone = item.Tone
                    };
                    listLinkSongs.Add(simpleLinkSong);
                };
            }
            return listLinkSongs;
        }

        public async Task<List<SimpleSongInAblumViewModel>> GetListSongInAlbum(int? AlbumID)
        {
            if (AlbumID.HasValue)
            {
                var songInAlbumContext = await _context.Song.Where(p => p.AlbumID == AlbumID).OrderBy(p => p.NumberSongInAlbum).Take(20).ToListAsync();
                List<SimpleSongInAblumViewModel> ListSongInAlbum = new List<SimpleSongInAblumViewModel>();
                foreach (var item in songInAlbumContext)
                {
                    SimpleSongInAblumViewModel songInAblum = new SimpleSongInAblumViewModel
                    {
                        Name = item.Name,
                        Slug = item.Slug,
                        Number = item.NumberSongInAlbum,
                    };
                    ListSongInAlbum.Add(songInAblum);
                }
                return ListSongInAlbum;
            }
            else
                return null;
        }

        public async Task<List<SimpleSongInAblumViewModel>> GetListSongInCategory(int CategoryID)
        {
            var songInCategoryContext = await _context.Song
                     .Where(p => p.Approved == Global.APPROVED)
                     .Where(p => p.CreateDT <= DateTime.Now)
                     .Where(p => !p.IsDeleted)
                     .Where(p => p.CategoryID == CategoryID).Take(10).ToListAsync();
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
            return ListSongInCategory;
        }
        public async Task<List<SimpleVideoViewModel>> GetListVideo(long songID)
        {
            var videoContext = await _context.Video
                .Where(p => p.SongID == songID)
                .Include(p => p.Image)
                .ToListAsync();
            List<SimpleVideoViewModel> listVideo = new List<SimpleVideoViewModel>();
            foreach (var item in videoContext)
            {
                SimpleVideoViewModel simpleVideo = new SimpleVideoViewModel
                {
                    Link = item.Link,
                    Name = item.Name,
                    ID = item.ID,
                    Images = item.Image

                };
                simpleVideo.Type = item.Type.HasValue ? item.Type.Value : 1;
                listVideo.Add(simpleVideo);
            };
            return listVideo;
        }

        public async Task<SingleSongSidebarViewModel> GetSingleSong(string slugSong, string slugVersion)
        {
            var songContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.Category)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .FirstOrDefaultAsync(p => p.Slug == slugSong);


            bool isSheetExisted = await _context.SheetMusic.AnyAsync(p => p.SongID == songContext.ID);

            List<SimpleLinkSongViewModel> listLinkSong = await GetListLinkSong(songContext.ID);
            List<SimpleSongInAblumViewModel> listCategory = await GetListSongInCategory(songContext.CategoryID);
            List<SimpleVideoViewModel> listVideo = await GetListVideo(songContext.ID);
            List<SimpleSongInAblumViewModel> listSongInAlbum = await GetListSongInAlbum(songContext.AlbumID);



            SingleSongSidebarViewModel model = new SingleSongSidebarViewModel
            {
                ListLinkSong = listLinkSong,
                ListSongInCategory = listCategory,
                ListVideos = listVideo,
                ListSongInAblum = listSongInAlbum,
                IsSheetExisted = isSheetExisted,
                Name = songContext.Name,
                Album = songContext.Album,
                Slug = songContext.Slug,
            };
            return model;
        }
        #endregion
    }
}
