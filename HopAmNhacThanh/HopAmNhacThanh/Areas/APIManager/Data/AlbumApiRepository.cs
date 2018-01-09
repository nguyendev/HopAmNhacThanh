using DoVuiHaiNao.Services;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models.CommonViewModels;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Models.SidebarViewModels;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class AlbumApiRepository : IAlbumApiRepository
    {
        private readonly ApplicationDbContext _context;

        public AlbumApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
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
        public async Task<CommonSingleViewModel> GetSingleAlbum(string slug)
        {
            var single = await _context.Album
                .Include(p => p.Image)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            var songDbContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Where(p => p.AlbumID == single.ID)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.NumberSongInAlbum).ToListAsync();

            List<SimpleSongViewModel> ListSong = new List<SimpleSongViewModel>();

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
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        Album = item.Album,
                        AuthorSong = item.AuthorSong,
                        OrtherName = item.OrtherName,
                        View = item.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug,
                        Number = item.NumberSongInAlbum,
                    };
                    ListSong.Add(song);
                }
            }

            CommonSingleViewModel model = new CommonSingleViewModel
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
        public async Task<List<SimpleSongViewModel>> GetSearch(string searchString, string albumSlug)
        {

            List<SimpleSongViewModel> listSong = new List<SimpleSongViewModel>();
            var albumDbContext = await _context.Album.Where(p => p.Slug == albumSlug).SingleOrDefaultAsync();
            var songDbContext = from s in _context.Song
                                .Include(p => p.Album)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .Where(p => p.AlbumID == albumDbContext.ID)
                                select s;
            if (searchString == "1")
            {
                var searchInName = songDbContext
                    .OrderBy(p => p.NumberSongInAlbum);
                foreach (var item in searchInName)
                {
                    var chords = _context.Chords
                            .Where(p => p.SongID == item.ID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .First();
                    if (chords != null)
                    {
                        SimpleSongViewModel song = new SimpleSongViewModel
                        {
                            Name = item.Name,
                            Slug = item.Slug,
                            Number = item.NumberSongInAlbum,
                            VersionSlug = chords.Slug
                        };
                        listSong.Add(song);
                    }
                }
            }
            else
            {



                #region search in name
                var searchInName = songDbContext.Where(s => s.Name.Contains(searchString))
                    .OrderByDescending(p => p.CreateDT);
                foreach (var item in searchInName)
                {
                    var chords = _context.Chords
                            .Where(p => p.SongID == item.ID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .First();
                    if (chords != null)
                    {
                        SimpleSongViewModel song = new SimpleSongViewModel
                        {
                            Name = item.Name,
                            Slug = item.Slug,
                            Number = item.NumberSongInAlbum,
                            VersionSlug = chords.Slug
                        };
                        listSong.Add(song);
                    }
                }
                #endregion
                #region seach in Number
                var searchInOtherName = songDbContext.Where(s => s.NumberSongInAlbum.Value.ToString().Contains(searchString))
                        .OrderByDescending(p => p.CreateDT);
                foreach (var item in searchInName)
                {
                    if (!listSong.Any(p => p.Slug == item.Slug))
                    {
                        var chords = _context.Chords
                            .Where(p => p.SongID == item.ID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .First();
                        if (chords != null)
                        {
                            SimpleSongViewModel song = new SimpleSongViewModel
                            {
                                Name = item.Name,
                                Slug = item.Slug,
                                VersionSlug = chords.Slug,
                                Number = item.NumberSongInAlbum,
                            };
                            listSong.Add(song);
                        }
                    }
                }
                #endregion
            }
            

            return listSong;
        }
    }
}
