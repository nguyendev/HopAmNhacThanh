using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.CommonViewModels;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Models.HomeViewModels;

namespace HopAmNhacThanh.Data.SingleSongRepository
{
    public class SingleSongRepository : ISingleSongRepository
    {
        private readonly ApplicationDbContext _context;
        public SingleSongRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommonListViewModel> GetListSingleSong(int page, int pageSize)
        {
            var applicationDbContext = from s in _context.SingleSong
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreateDT)
                                       select s;
            var paginatedList = await PaginatedList<SingleSong>.CreateAsync(applicationDbContext.AsNoTracking(), page, pageSize);

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
                Controller = "SingleSong",
                Count = paginatedList.Count,
                PageIndex = paginatedList.PageIndex,
                PageSize = paginatedList.PageSize,
                TotalPages = paginatedList.TotalPages,
                List = listAlbum
            };
            return model;
        }

        public async Task<CommonSingleViewModel> GetSingleSingleSong(string slug, int page, int pageSize)
        {
            var single = await _context.SingleSong
                .Include(p => p.Image)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            var linkSong = await _context.LinkSong
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .Where(p => p.SingleSongID == single.ID)
                .ToListAsync();

            List<SimpleSongViewModel> ListSong = new List<SimpleSongViewModel>();

            foreach (var item in linkSong)
            {
                var songDbContext = await _context.Song
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .SingleOrDefaultAsync(p => p.ID == item.SongID);
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
                        Name = songDbContext.Name,
                        Album = songDbContext.Album,
                        AuthorSong = songDbContext.AuthorSong,
                        OrtherName = songDbContext.OrtherName,
                        View = songDbContext.Views,
                        Lyric = SEOExtension.GetStringToLength(chords.Lyric, Global.LENGTH_LYRIC),
                        Slug = songDbContext.Slug,
                        VersionSlug = chords.Slug,
                        Number = songDbContext.NumberSongInAlbum,

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
                Controller = "SingleSong",
            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
