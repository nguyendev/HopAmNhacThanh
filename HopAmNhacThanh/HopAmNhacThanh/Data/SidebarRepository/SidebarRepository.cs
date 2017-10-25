using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models.SidebarViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SidebarRepository
{
    public class SidebarRepository : ISidebarRepository
    {
        private readonly ApplicationDbContext _context;
        public SidebarRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CommonSidebarViewModel> GetSidebarCommon()
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
                    Version = item.Slug,
                    Views = item.Views
                };
                ListTopSong.Add(song);
            }

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

            var albumDbContext = await _context.Album.Take(10).ToListAsync();

            List<SimpleAlbumViewModel> ListAlbum = new List<SimpleAlbumViewModel>();
            foreach (var item in albumDbContext)
            {
                SimpleAlbumViewModel album = new SimpleAlbumViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                };
                ListAlbum.Add(album);
            }

            CommonSidebarViewModel model = new CommonSidebarViewModel
            {
                ListSong = ListTopSong,
                ListStyle = ListStyle,
                ListTopAlbum = ListAlbum
            };
            return model;
        }

    }
}
