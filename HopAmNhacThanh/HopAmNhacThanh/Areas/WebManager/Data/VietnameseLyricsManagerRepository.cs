using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.VietnameseLyricViewModels;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public class VietnameseLyricsManagerRepository : IVietnameseLyricsManagerRepository
    {
        protected readonly ApplicationDbContext _context;
        public VietnameseLyricsManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateVietnameseLyricViewModel model)
        {
            try
            {
                VietnameseLyric authorSong = new VietnameseLyric
                {
                    Name = model.Name,
                    Slug = StringExtensions.ConvertToUnSign3(model.Name),
                    Content = model.Content,
                    ImageID = model.ImageID,
                };
                _context.VietnameseLyric.Add(authorSong);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        private async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long id)
        {
            var authorSongDbContext = await _context.VietnameseLyric.SingleOrDefaultAsync(m => m.ID == id);
            if (authorSongDbContext.IsDeleted)
                _context.VietnameseLyric.Remove(authorSongDbContext);
            else
            {
                authorSongDbContext.IsDeleted = true;
                _context.VietnameseLyric.Update(authorSongDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.VietnameseLyric.Any(e => e.ID == id);
        }

        public async Task<VietnameseLyric> Get(long? id)
        {
            return await _context.VietnameseLyric.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexVietnameseLyricViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.VietnameseLyric
                                .Include(p => p.Image)
                                .Where(p => !p.IsDeleted)
                                       select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                applicationDbContext = applicationDbContext.Where(s => s.Name.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "NameParm":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Name);
                    break;
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.Name);
                    break;
            }
            var pageList = await PaginatedList<VietnameseLyric>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);



            IndexVietnameseLyricViewModel model = new IndexVietnameseLyricViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "SongManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                List = pageList

            };
            return model;
        }

        public async Task<EditVietnameseLyricViewModel> GetEdit(long? ID)
        {
            var authorSongDbContext = await _context.VietnameseLyric
                .Include(p => p.Image)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (authorSongDbContext != null)
            {
                EditVietnameseLyricViewModel editModel = new EditVietnameseLyricViewModel
                {
                    ID = authorSongDbContext.ID,
                    Name = authorSongDbContext.Name,
                    Slug = authorSongDbContext.Slug,
                    ImageID = authorSongDbContext.ImageID,
                    Content = authorSongDbContext.Content,
                };
                return editModel;
            }
            return null;
        }

      

        public async Task Update(EditVietnameseLyricViewModel model)
        {
            var authorSongDbContext = await _context.VietnameseLyric.SingleOrDefaultAsync(p => p.ID == model.ID);

            authorSongDbContext.Name = model.Name;
            authorSongDbContext.ImageID = model.ImageID;
            authorSongDbContext.Content = model.Content;
            authorSongDbContext.Slug = model.Slug;
            _context.VietnameseLyric.Update(authorSongDbContext);
            await Save();
        }

      
        public async Task<VietnameseLyric> Details(long? id)
        {
            var authorSong = await _context.VietnameseLyric
                .Include(s => s.Image)
                .SingleOrDefaultAsync(m => m.ID == id);
            return authorSong;
        }
    }
}
