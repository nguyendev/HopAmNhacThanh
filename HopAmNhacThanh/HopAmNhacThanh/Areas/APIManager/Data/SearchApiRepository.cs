using DoVuiHaiNao.Services;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class SearchApiRepository : ISearchApiRepository
    {
        private readonly ApplicationDbContext _context;
        public SearchApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PaginatedList<SimpleSongViewModel>> GetSearch(string searchString, int page, int pageSize)
        {

            List<SimpleSongViewModel> listSong = new List<SimpleSongViewModel>();

            var songDbContext = from s in _context.Song
                                .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Include(p => p.Category)
                    .Include(p => p.VietnameseLyric)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                                select s;
            if (searchString=="1")
            {
                var searchInName = songDbContext
                    .OrderByDescending(p => p.CreateDT);
                foreach (var item in searchInName)
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
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
                    };
                    listSong.Add(song);
                }
            }
            else {
                


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
                    SimpleSongViewModel song = new SimpleSongViewModel
                    {
                        Name = item.Name,
                        Album = item.Album,
                        AuthorSong = item.AuthorSong,
                        OrtherName = item.OrtherName,
                        View = item.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
                    };
                    listSong.Add(song);
                }
                #endregion
                #region seach in OtherName
                var searchInOtherName = songDbContext.Where(s => s.OrtherName.Contains(searchString))
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
                        SimpleSongViewModel song = new SimpleSongViewModel
                        {
                            Name = item.Name,
                            Album = item.Album,
                            AuthorSong = item.AuthorSong,
                            OrtherName = item.OrtherName,
                            View = item.Views,
                            Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                            Slug = item.Slug,
                            VersionSlug = chords.Slug
                        };
                        listSong.Add(song);
                    }
                }
                #endregion
                #region search in lyric
                var searchInLyric = _context.Chords
                    .Where(s => s.Lyric.Contains(searchString))
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .OrderBy(p => p.CreateDT);
                foreach (var item in searchInLyric)
                {
                    if (!listSong.Any(p => p.VersionSlug == item.Slug))
                    {
                        var songInItem = _context.Song
                            .Where(p => p.ID == item.SongID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .SingleOrDefault();
                        if (songInItem != null)
                        {
                            SimpleSongViewModel song = new SimpleSongViewModel
                            {
                                Name = songInItem.Name,
                                Album = songInItem.Album,
                                AuthorSong = songInItem.AuthorSong,
                                OrtherName = songInItem.OrtherName,
                                View = songInItem.Views,
                                Lyric = SEOExtension.GetStringToLength(item.Lyric, Global.LENGTH_LYRIC),
                                Slug = songInItem.Slug,
                                VersionSlug = item.Slug
                            };
                            listSong.Add(song);
                        }
                    }
                }

                #endregion
            }
            var songPaginatedList = PaginatedList<SimpleSongViewModel>.Create(listSong, page, pageSize);
            
            return songPaginatedList;
        }
    }
}
