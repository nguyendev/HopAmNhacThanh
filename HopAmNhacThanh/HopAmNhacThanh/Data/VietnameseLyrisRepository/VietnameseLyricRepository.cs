using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.CommonViewModels;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Models;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Models.HomeViewModels;

namespace HopAmNhacThanh.Data.VietnameseLyrisRepository
{
    public class VietnameseLyricRepository : IVietnameseLyricRepository
    {
        private readonly ApplicationDbContext _context;
        public VietnameseLyricRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommonListViewModel> GetListVietnameseLyric(int page, int pageSize)
        {
            var applicationDbContext = from s in _context.VietnameseLyric
                .Where(p => !p.IsDeleted)
                                       select s;
            var paginatedList = await PaginatedList<VietnameseLyric>.CreateAsync(applicationDbContext.AsNoTracking(), page, pageSize);

            List<CommonSimpleViewModel> listAlbum = new List<CommonSimpleViewModel>();

            foreach (var item in paginatedList)
            {
                CommonSimpleViewModel simpleAlbum = new CommonSimpleViewModel
                {
                    Content = item.Content,
                    ImageID = item.ImageID,
                    Name = item.Name,
                    Slug = item.Slug,
                    Image = item.Image,
                };
                simpleAlbum.Description = item.Description != null ? SEOExtension.GetStringToLength(item.Description, 300) : "";
                listAlbum.Add(simpleAlbum);
            }
            CommonListViewModel model = new CommonListViewModel
            {
                Action = "List",
                Areas = "",
                Controller = "VietnameseLyric",
                Count = paginatedList.Count,
                PageIndex = paginatedList.PageIndex,
                PageSize = paginatedList.PageSize,
                TotalPages = paginatedList.TotalPages,
                List = listAlbum
            };
            return model;
        }

        public async Task<CommonSingleViewModel> GetSingleVietnameseLyric(string slug, int page, int pageSize)
        {
            var single = await _context.VietnameseLyric
                .Include(p => p.Image)
                .Where(p => !p.IsDeleted)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            var authorSongDbContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Where(p => p.VietnameseLyricID == single.ID)
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.NumberSongInAlbum).ToListAsync();

            List<SimpleSongViewModel> ListSong = new List<SimpleSongViewModel>();

            foreach (var item in authorSongDbContext)
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

            var songPaginatedList = PaginatedList<SimpleSongViewModel>.Create(ListSong, page, pageSize);

            CommonSingleViewModel model = new CommonSingleViewModel
            {
                ImageID = single.ImageID,
                Image = single.Image,
                Content = single.Content,
                Description = single.Description,
                Name = single.Name,
                Slug = single.Slug,
                ListSong = ListSong,
                Count = songPaginatedList.Count,
                PageIndex = songPaginatedList.PageIndex,
                PageSize = songPaginatedList.PageSize,
                TotalPages = songPaginatedList.TotalPages,
                Action = "single",
                Controller = "vietnameselyric",
            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
