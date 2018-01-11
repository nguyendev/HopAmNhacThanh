using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.APIManager.ViewModels;
using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class CategoryApiRepository: ICategoryApiRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<SimpleCategoryApiViewModel>> GetList()
        {
            List<SimpleCategoryApiViewModel> list = new List<SimpleCategoryApiViewModel>();
            var appDbContext = await _context.Category.Where(p => !p.IsDeleted).ToListAsync();
            foreach (var item in appDbContext)
            {
                SimpleCategoryApiViewModel categoryApiViewModel = new SimpleCategoryApiViewModel
                {
                    Name = item.Name,
                    Slug = item.Slug,
                };
                list.Add(categoryApiViewModel);
            }
            return list;
        }
        public async Task<SingleCategoryApiViewModel> GetSingle(string slug)
        {
            var appDbContext = await _context.Category
                .Include(p => p.Image)
                .Where(p => !p.IsDeleted)
                .Where(p => p.Slug == slug).SingleOrDefaultAsync();
            List<SimpleSongApiViewModel> list = new List<SimpleSongApiViewModel>();
            if (appDbContext != null)
            {
                var listSongDbContext = await _context.Song
                    .Where(p => p.CategoryID == appDbContext.ID)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                    .ToListAsync();
                if (listSongDbContext != null)
                    foreach (var item in listSongDbContext)
                    {
                        var chords = _context.Chords
                            .Where(p => p.SongID == item.ID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .First();
                        SimpleSongApiViewModel simpleSongApiViewModel = new SimpleSongApiViewModel
                        {
                            Slug = item.Slug,
                            VersionSlug = chords.Slug,
                            Name = item.Name
                        };
                        list.Add(simpleSongApiViewModel);
                    }
            }
            SingleCategoryApiViewModel singleCategoryApiViewModel = new SingleCategoryApiViewModel
            {
                Name = appDbContext.Name,
                Description = appDbContext.Description,
                Image = appDbContext.Image,

                ListSong = list
            };
            return singleCategoryApiViewModel;
        }

    }
}
