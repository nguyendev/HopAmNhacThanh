using DoVuiHaiNao.Services;
using HopAmNhacThanh.Models.SidebarViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Data.SidebarRepository
{
    public class SidebarRepository : ISidebarRepository
    {
        private readonly ApplicationDbContext _context;
        public SidebarRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SimpleAlbumViewModel>> GetListAlbum()
        {
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
            return ListAlbum;
        }

        public async Task<List<SimpleCategoryViewModel>> GetListCategory()
        {
            var categoryDbContext = await _context.Category
                .ToListAsync();
            List<SimpleCategoryViewModel> ListCategory = new List<SimpleCategoryViewModel>();
            foreach (var item in categoryDbContext)
            {
                int count = _context.Song
                    .Where(p => p.CategoryID == item.ID)
                    .Count();
                SimpleCategoryViewModel category = new SimpleCategoryViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                    Count = count
                };
                ListCategory.Add(category);
            }
            return ListCategory;
        }

        public async Task<List<SimpleStyleViewModel>> GetListStyle()
        {
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
            return ListStyle;
        }
        public async Task<List<BestSimpleSongViewModel>> GetListTopSong()
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
                    Version = chords.Slug,
                    Views = item.Views
                };
                ListTopSong.Add(song);
            }
            return ListTopSong;
        }
    }
}
