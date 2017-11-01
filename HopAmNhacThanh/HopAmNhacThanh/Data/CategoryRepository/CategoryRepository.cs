using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.CommonViewModels;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Models;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models.HomeViewModels;

namespace HopAmNhacThanh.Data.CategoryRepository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommonListViewModel> GetListCategory(int page, int pageSize)
        {
            var applicationDBContext = from s in _context.Category
                .Where(p => !p.IsDeleted)
                                 select s;
            var paginatedList = await PaginatedList<Category>.CreateAsync(applicationDBContext.AsNoTracking(), page, pageSize);

            List<CommonSimpleViewModel> listAlbum = new List<CommonSimpleViewModel>();

            foreach (var item in paginatedList)
            {
                CommonSimpleViewModel simpleAlbum = new CommonSimpleViewModel
                {
                    Content = item.Note,
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
                Controller = "Album",
                Count = paginatedList.Count,
                PageIndex = paginatedList.PageIndex,
                PageSize = paginatedList.PageSize,
                TotalPages = paginatedList.TotalPages,
                List = listAlbum
            };
            return model;
        }

        public async Task<CommonSingleViewModel> GetSingleCategory(string slug, int page, int pageSize)
        {
            var single = await _context.Category
                .Include(p => p.Image)
                .Where(p => !p.IsDeleted)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            var songDbContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Where(p => p.CategoryID == single.ID)
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderBy(p => p.NumberSongInAlbum).Take(10).ToListAsync();

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
            var songPaginatedList = PaginatedList<SimpleSongViewModel>.Create(ListSong, page, pageSize);
            CommonSingleViewModel model = new CommonSingleViewModel
            {
                ImageID = single.ImageID,
                Image = single.Image,
                Content = single.Note,
                Description = single.Description,
                Name = single.Name,
                Slug = single.Slug,
                ListSong = ListSong,
                Count = songPaginatedList.Count,
                PageIndex = songPaginatedList.PageIndex,
                PageSize = songPaginatedList.PageSize,
                TotalPages = songPaginatedList.TotalPages,
                Action = "single",
                Controller = "category",
            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
