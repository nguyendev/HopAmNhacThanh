using HopAmNhacThanh.Areas.WebManager.ViewModels.CategoryViewModels;
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
    public class CategoryManagerRepository : ICategoryManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(Category model)
        {
            try
            {
                model.IsDeleted = false;
                _context.Category.Add(model);
                await Save();
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
            var single = await _context.Category.SingleOrDefaultAsync(m => m.ID == id);
            if (single.IsDeleted)
                _context.Category.Remove(single);
            else
            {
                single.IsDeleted = true;
                _context.Category.Update(single);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Category.Any(e => e.ID == id);
        }

        public async Task<Category> Get(long? id)
        {
            return await _context.Category.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexCategoryViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Category
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
            var pageList = await PaginatedList<Category>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            IndexCategoryViewModel model = new IndexCategoryViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "ChordManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                List = pageList
            };
            return model;
        }

        public async Task<Category> GetEdit(long? ID)
        {
            var single = await _context.Category
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (single != null)
            {
                return single;
            }
            return null;
        }
        

        public async Task Update(Category model)
        {
            var single = await _context.Category.SingleOrDefaultAsync(p => p.ID == model.ID);
            single.Slug = model.Slug;
            single.Name = model.Name;
            single.Note = model.Note;
            single.Image = model.Image;
            _context.Category.Update(single);
            await Save();
        }

   
        public async Task<Category> Details(long? id)
        {
            var single = await _context.Category
                .SingleOrDefaultAsync(m => m.ID == id);
            return single;
        }
    }
}