using HopAmNhacThanh.Areas.WebManager.ViewModels.VideoViewModels;
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
    public class VideoManagerRepository : IVideoManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public VideoManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(Video model)
        {
            try
            {
                model.IsDeleted = false;
                _context.Video.Add(model);
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
            var single = await _context.Video.SingleOrDefaultAsync(m => m.ID == id);
            if (single.IsDeleted)
                _context.Video.Remove(single);
            else
            {
                single.IsDeleted = true;
                _context.Video.Update(single);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Video.Any(e => e.ID == id);
        }

        public async Task<Video> Get(long? id)
        {
            return await _context.Video.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexVideoViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Video
                                       .Include(p => p.Song)
                                       .Where(p => !p.IsDeleted)
                                       select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                applicationDbContext = applicationDbContext.Where(s => s.Name.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "name":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Name);
                    break;
                case "song":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Song.Name);
                    break;
                case "image":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Image.Name);
                    break;
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.Name);
                    break;
            }
            var pageList = await PaginatedList<Video>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            IndexVideoViewModel model = new IndexVideoViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "VideoManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                List = pageList
            };
            return model;
        }

        public async Task<Video> GetEdit(long? ID)
        {
            var single = await _context.Video
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (single != null)
            {
                return single;
            }
            return null;
        }


        public async Task Update(Video model)
        {
            var single = await _context.Video.SingleOrDefaultAsync(p => p.ID == model.ID);
            single.ImageID = model.ImageID;
            single.Name = model.Name;
            single.Link = model.Link;
            single.SongID = model.SongID;
            single.Type = model.Type;
            _context.Video.Update(single);
            await Save();
        }

        public async Task<Video> Details(long? id)
        {
            var single = await _context.Video
                .SingleOrDefaultAsync(m => m.ID == id);
            return single;
        }
    }
}