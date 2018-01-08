using DoVuiHaiNao.Services;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.SheetMusicViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class SheetApiRepository : ISheetApiRepository
    {
        private readonly ApplicationDbContext _context;

        private const string JPG = ".jpg";
        private const string PNG = ".png";
        private const string PDF = ".pdf";
        public SheetApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        //public async Task<PaginatedList<SimpleLinkSongViewModel>> GetSearch(string searchString, int page, int pageSize)
        //{

        //    List<SimpleLinkSongViewModel> listSong = new List<SimpleLinkSongViewModel>();

        //    var songDbContext = from s in _context.Song
        //                        .Include(p => p.Album)
        //            .Include(p => p.AuthorSong)
        //            .Include(p => p.Category)
        //            .Include(p => p.VietnameseLyric)
        //            .Where(p => p.Approved == Global.APPROVED)
        //            .Where(p => p.CreateDT <= DateTime.Now)
        //            .Where(p => !p.IsDeleted)
        //                        select s;
        //    if (searchString == "1")
        //    {
        //        var searchInName = songDbContext
        //            .OrderByDescending(p => p.CreateDT);
        //        foreach (var item in searchInName)
        //        {
        //            var linkSongs = _context.LinkSong
        //                    .Include(p => p.SingleSong)
        //                    .Where(p => p.SongID == item.ID)
        //                    .Where(p => p.Approved == Global.APPROVED)
        //                    .Where(p => p.CreateDT <= DateTime.Now)
        //                    .Where(p => !p.IsDeleted)
        //                    .First();
        //            SimpleLinkSongViewModel song = new SimpleLinkSongViewModel
        //            {
        //                Link = linkSongs.Link,
        //                SongName = item.Name,
        //                Tone = linkSongs.Tone,
        //                SingleSong = linkSongs.SingleSong,
        //            };
        //            listSong.Add(song);
        //        }
        //    }
        //    else
        //    {



        //        #region search in name
        //        var searchInName = songDbContext.Where(s => s.Name.Contains(searchString))
        //            .OrderByDescending(p => p.CreateDT);
        //        foreach (var item in searchInName)
        //        {
        //            var linkSongs = _context.LinkSong
        //                   .Include(p => p.SingleSong)
        //                   .Where(p => p.SongID == item.ID)
        //                   .Where(p => p.Approved == Global.APPROVED)
        //                   .Where(p => p.CreateDT <= DateTime.Now)
        //                   .Where(p => !p.IsDeleted)
        //                   .First();
        //            SimpleLinkSongViewModel song = new SimpleLinkSongViewModel
        //            {
        //                Link = linkSongs.Link,
        //                SongName = item.Name,
        //                Tone = linkSongs.Tone,
        //                SingleSong = linkSongs.SingleSong,
        //            };
        //            listSong.Add(song);
        //        }
        //        #endregion

        //    }
        //    var songPaginatedList = PaginatedList<SimpleLinkSongViewModel>.Create(listSong, page, pageSize);

        //    return songPaginatedList;
        //}

        public async Task<SingleSheetMusicViewModel> GetSingle(string slug)
        {
            var songDbContext = await _context.Song
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                                          .SingleOrDefaultAsync(p => p.Slug == slug);

            var chordDbContext = await _context.Chords.FirstOrDefaultAsync(p => p.SongID == songDbContext.ID);

            var sheetDbContext = await _context.SheetMusic
                                           .Include(p => p.Song)
                                           .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                                           .Where(p => p.SongID == songDbContext.ID)
                                           .ToListAsync();
            List<SimpleSheetMusicViewModel> listPNG = new List<SimpleSheetMusicViewModel>();
            List<SimpleSheetMusicViewModel> listJPG = new List<SimpleSheetMusicViewModel>();
            List<SimpleSheetMusicViewModel> listPDF = new List<SimpleSheetMusicViewModel>();
            foreach (var item in sheetDbContext)
            {
                SimpleSheetMusicViewModel simpleSheetMusic = new SimpleSheetMusicViewModel
                {
                    Number = item.Number,
                    Type = item.Type,
                    Source = item.Source,
                    Name = item.Name
                };
                switch (item.Type)
                {
                    case PNG:
                        listPNG.Add(simpleSheetMusic);
                        break;
                    case JPG:
                        listJPG.Add(simpleSheetMusic);
                        break;
                    case PDF:
                        listPDF.Add(simpleSheetMusic);
                        break;
                };
            }

            SingleSheetMusicViewModel model = new SingleSheetMusicViewModel
            {
                Title = songDbContext.Name,
                Slug = songDbContext.Slug,
                SlugVersion = chordDbContext.Slug,
                ListPNG = listPNG.OrderBy(p => p.Number).ToList(),
                ListJPG = listJPG.OrderBy(p => p.Number).ToList(),
                ListPDF = listPDF.OrderBy(p => p.Number).ToList(),
            };

            return model;
        }
    }
}
