using HopAmNhacThanh.Areas.WebManager.ViewModels.StyleViewModels;
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
    public class StyleManagerRepository : IStyleManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public StyleManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(Style model)
        {
            try
            {
                model.IsDeleted = false;
                _context.Style.Add(model);
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
            var single = await _context.Style.SingleOrDefaultAsync(m => m.ID == id);
            if (single.IsDeleted)
                _context.Style.Remove(single);
            else
            {
                single.IsDeleted = true;
                _context.Style.Update(single);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Style.Any(e => e.ID == id);
        }

        public async Task<Style> Get(long? id)
        {
            return await _context.Style.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexStyleViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Style
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
            var pageList = await PaginatedList<Style>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            IndexStyleViewModel model = new IndexStyleViewModel
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

        public async Task<Style> GetEdit(long? ID)
        {
            var single = await _context.Style
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (single != null)
            {
                return single;
            }
            return null;
        }


        public async Task Update(Style model)
        {
            var single = await _context.Style.SingleOrDefaultAsync(p => p.ID == model.ID);
            single.Slug = model.Slug;
            single.Name = model.Name;
            single.Note = model.Note;
            _context.Style.Update(single);
            await Save();
        }


        public async Task<Style> Details(long? id)
        {
            var single = await _context.Style
                .SingleOrDefaultAsync(m => m.ID == id);
            return single;
        }
    }
}