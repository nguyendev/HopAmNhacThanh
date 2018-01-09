using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.SidebarViewModels;
using HopAmNhacThanh.Areas.APIManager.ViewModels;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class SongApiRepository : ISongApiRepository
    {
        private readonly ApplicationDbContext _context;
        public SongApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PaginatedList<SimpleSongApiViewModel>> GetNews(int page, int pageSize)
        {
            List<SimpleSongApiViewModel> listSong = new List<SimpleSongApiViewModel>();

            var songDbContext = from s in _context.Song
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                                select s;
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
                SimpleSongApiViewModel song = new SimpleSongApiViewModel
                {
                        Name = item.Name,
                        Lyric = SEOExtension.GetStringToLengthNoEndLine(StringExtensions.RemoveBr(chords.Lyric), Global.LENGTH_LYRIC_MOBILE),
                        Slug = item.Slug,
                        VersionSlug = chords.Slug
                    };
                    listSong.Add(song);
                }
            var songPaginatedList = PaginatedList<SimpleSongApiViewModel>.Create(listSong, page, pageSize);

            return songPaginatedList;
        }

        public async Task<PaginatedList<SimpleSongApiViewModel>> GetPopulars(int page, int pageSize)
        {
            List<SimpleSongApiViewModel> listSong = new List<SimpleSongApiViewModel>();

            var songDbContext = from s in _context.Song
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                                select s;
            var searchInName = songDbContext
                .OrderByDescending(p => p.Name);
            foreach (var item in searchInName)
            {
                var chords = _context.Chords
                        .Where(p => p.SongID == item.ID)
                        .Where(p => p.Approved == Global.APPROVED)
                        .Where(p => p.CreateDT <= DateTime.Now)
                        .Where(p => !p.IsDeleted)
                        .First();
                SimpleSongApiViewModel song = new SimpleSongApiViewModel
                {
                    Name = item.Name,
                    Lyric = SEOExtension.GetStringToLengthNoEndLine(StringExtensions.RemoveBr(chords.Lyric), Global.LENGTH_LYRIC_MOBILE),
                    Slug = item.Slug,
                    VersionSlug = chords.Slug
                };
                listSong.Add(song);
            }
            var songPaginatedList = PaginatedList<SimpleSongApiViewModel>.Create(listSong, page, pageSize);

            return songPaginatedList;
        }

        public async Task<MainSingleViewModel> GetSingle(string slugSong, string slugVersion)
        {
            //try
            //{
            string Intro = "";
            string Lyric = "";
            string Tone = "";
            DateTime? CreateDate = null;
            Style Style = null;
            ApplicationUser AuthorChords = null;
            var songContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Include(p => p.Category)
                .Include(p => p.VietnameseLyric)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .FirstOrDefaultAsync(p => p.Slug == slugSong);

            var chordsContext = await _context.Chords
                .Include(p => p.Author)
                .Include(p => p.Style)
                .Where(p => p.SongID == songContext.ID)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            List<HopAmNhacThanh.Models.HomeViewModels.SimpleChordsViewModel> simpleChords = new List<HopAmNhacThanh.Models.HomeViewModels.SimpleChordsViewModel>();
            foreach (var item in chordsContext)
            {
                bool selected = item.Slug == slugVersion ? true : false;
                HopAmNhacThanh.Models.HomeViewModels.SimpleChordsViewModel simpleChord = new HopAmNhacThanh.Models.HomeViewModels.SimpleChordsViewModel
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
                    CreateDate = item.CreateDT;
                }

                simpleChord.StyleName = item.StyleID.HasValue ? item.Style.Name : "";
                simpleChords.Add(simpleChord);
            };





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
            model.Lyric = Lyric;
            model.Intro = Intro;
            model.Tone = Tone;
            model.CreateDate = CreateDate;
            model.Style = Style;
            model.AuthorChords = AuthorChords;


            return model;
            //}
            //catch
            //{
            //    return null;
            //}
        }
        
    }
}
