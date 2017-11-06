using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SheetMusicViewModels;
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
    public class SheetMusicManagerRepository : ISheetMusicManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public SheetMusicManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long id)
        {
            var SheetMusicDbContext = await _context.SheetMusic.SingleOrDefaultAsync(m => m.ID == id);
            if (SheetMusicDbContext.IsDeleted || SheetMusicDbContext.Approved == Global.UNAPPROVED)
                _context.SheetMusic.Remove(SheetMusicDbContext);
            else
            {
                SheetMusicDbContext.IsDeleted = true;
                _context.SheetMusic.Update(SheetMusicDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.SheetMusic.Any(e => e.ID == id);
        }

        public async Task<SheetMusic> Get(long? id)
        {
            return await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexSheetMusicViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.SheetMusic
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
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.Song.Name);
                    break;
                case "type":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Type);
                    break;
                case "createDT":
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
                case "approved":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Approved);
                    break;
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
            }
            var pageList = await PaginatedList<SheetMusic>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexSheetMusicViewModel> listSheetMusic = new List<SimpleIndexSheetMusicViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexSheetMusicViewModel sheet = new SimpleIndexSheetMusicViewModel
                {
                    Song = item.Song,
                    Name = item.Name,
                    SongID = item.SongID,
                    Number = item.Number,
                    Type = item.Type,
                    Approved = item.Approved,
                    ID = item.ID,
                    CreateDT = item.CreateDT
                };
                listSheetMusic.Add(sheet);
            }

            IndexSheetMusicViewModel model = new IndexSheetMusicViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "SheetMusicManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListSheetMusic = listSheetMusic
            };
            return model;
        }

        public async Task<EditSheetMusicViewModel> GetEdit(long? ID)
        {
            var SheetMusicDbContext = await _context.SheetMusic
                .Include(p => p.Song)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (SheetMusicDbContext != null)
            {
                EditSheetMusicViewModel editModel = new EditSheetMusicViewModel
                {
                    ID = SheetMusicDbContext.ID,
                    Name = SheetMusicDbContext.Name,
                    Type = SheetMusicDbContext.Type,
                    Number = SheetMusicDbContext.Number,
                    Song = SheetMusicDbContext.Song,
                    SongID = SheetMusicDbContext.SongID,
                    Source = SheetMusicDbContext.Source,
                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == ID);
                ApprovedViewModels model = new ApprovedViewModels
                {
                    ID = single.ID,
                    Approved = single.Approved
                };
                return model;
            }
            catch
            {
                return null;
            }
        }

        public async Task<PublishDTViewModels> GetEditPublishDT(long? ID)
        {
            try
            {
                var single = await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == ID);
                PublishDTViewModels model = new PublishDTViewModels
                {
                    ID = single.ID,
                    PublishDT = single.CreateDT
                };
                return model;
            }
            catch
            {
                return null;
            }
        }

        public async Task Update(EditSheetMusicViewModel model)
        {
            var SheetMusicDbContext = await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == model.ID);

            SheetMusicDbContext.SongID = model.SongID;
            SheetMusicDbContext.Type = model.Type;
            SheetMusicDbContext.Number = model.Number;
            SheetMusicDbContext.UpdateDT = DateTime.Now;
            SheetMusicDbContext.Name = model.Name;

            _context.SheetMusic.Update(SheetMusicDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.SheetMusic.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task UpdatePublishDT(PublishDTViewModels model)
        {
            try
            {
                var single = await _context.SheetMusic.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.SheetMusic.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<SheetMusic> Details(long? id)
        {
            var SheetMusic = await _context.SheetMusic
                .Include(s => s.Author)
                .Include(s => s.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            return SheetMusic;
        }
    }
}