using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.AlbumViewModels;
using Microsoft.EntityFrameworkCore;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Models;

namespace HopAmNhacThanh.Data.AlbumRepository
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly ApplicationDbContext _context;
        public AlbumRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ListAlbumViewModel> GetListAlbum(int page, int pageSize)
        {
            var albumDbContext = from s in _context.Album
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreateDT)
                                 select s;
            var albumPaginatedList = await PaginatedList<Album>.CreateAsync(albumDbContext.AsNoTracking(), page, pageSize);

            List<SimpleAlbumViewModel> listAlbum = new List<SimpleAlbumViewModel>();

            foreach (var item in albumPaginatedList)
            {
                SimpleAlbumViewModel simpleAlbum = new SimpleAlbumViewModel
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
            ListAlbumViewModel model = new ListAlbumViewModel
            {
                Action = "List",
                Areas = "",
                Controller = "Album",
                Count = albumPaginatedList.Count,
                PageIndex = albumPaginatedList.PageIndex,
                PageSize = albumPaginatedList.PageSize,
                TotalPages = albumPaginatedList.TotalPages,
                List = listAlbum
            };
            return model;
        }

        public async Task<SingleAlbumViewModel> GetSingleAlbum(string slug)
        {
            var single = await _context.Album
                .Include(p => p.Image)
                .SingleOrDefaultAsync(p => p.Slug == slug);

            SingleAlbumViewModel model = new SingleAlbumViewModel
            {
                ImageID = single.ImageID,
                Image = single.Image,
                Content = single.Content,
                Description = single.Description,
                Name = single.Name,
                Slug =single.Slug

            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
