using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.AlbumViewModels;
using Microsoft.EntityFrameworkCore;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Models.CommonViewModels;

namespace HopAmNhacThanh.Data.AlbumRepository
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly ApplicationDbContext _context;
        public AlbumRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommonListViewModel> GetListAlbum(int page, int pageSize)
        {
            var albumDbContext = from s in _context.Album
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .OrderByDescending(p => p.CreateDT)
                                 select s;
            var albumPaginatedList = await PaginatedList<Album>.CreateAsync(albumDbContext.AsNoTracking(), page, pageSize);

            List<CommonSimpleViewModel> listAlbum = new List<CommonSimpleViewModel>();

            foreach (var item in albumPaginatedList)
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
                Controller = "Album",
                Count = albumPaginatedList.Count,
                PageIndex = albumPaginatedList.PageIndex,
                PageSize = albumPaginatedList.PageSize,
                TotalPages = albumPaginatedList.TotalPages,
                List = listAlbum
            };
            return model;
        }

        public async Task<CommonSingleViewModel> GetSingleAlbum(string slug, int page, int pageSize)
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
                Content = single.Content,
                Description = single.Description,
                Name = single.Name,
                Slug =single.Slug,
                ListSong = ListSong,
                Count = songPaginatedList.Count,
                PageIndex = songPaginatedList.PageIndex,
                PageSize = songPaginatedList.PageSize,
                TotalPages = songPaginatedList.TotalPages,
                Action = "single",
                Controller = "album",
            };
            model.Description = single.Description != null ? SEOExtension.GetStringToLength(single.Description, 300) : "";
            return model;
        }
    }
}
