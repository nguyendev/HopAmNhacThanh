using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.LinkSongViewModels;
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
    public class LinkSongManagerRepository : ILinkSongManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public LinkSongManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateLinkSongViewModel model, ApplicationUser user)
        {
            try
            {
                LinkSong linksong = new LinkSong
                {
                    Tone = model.Tone,
                    SongID = model.SongID,
                    Name = model.Name,
                    Link = model.Link,
                    SingleSongID = model.SingleSongID,
                    Note = "",

                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.LinkSong.Add(linksong);
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
            var linksongDbContext = await _context.LinkSong.SingleOrDefaultAsync(m => m.ID == id);
            if (linksongDbContext.IsDeleted || linksongDbContext.Approved == Global.UNAPPROVED)
                _context.LinkSong.Remove(linksongDbContext);
            else
            {
                linksongDbContext.IsDeleted = true;
                _context.LinkSong.Update(linksongDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.LinkSong.Any(e => e.ID == id);
        }

        public async Task<LinkSong> Get(long? id)
        {
            return await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexLinkSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.LinkSong
                                .Include(p => p.Song)
                                .Include(p => p.SingleSong)
                                .Where(p => !p.IsDeleted)
                                       select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                applicationDbContext = applicationDbContext.Where(s => s.Name.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "song":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Song.Name);
                    break;
                case "name":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Name);
                    break;
                case "singleSong":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.SingleSong.Name);
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
            var pageList = await PaginatedList<LinkSong>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexLinkSongViewModel> listLinkSong = new List<SimpleIndexLinkSongViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexLinkSongViewModel song = new SimpleIndexLinkSongViewModel
                {
                    Song = item.Song,
                    SingleSong = item.SingleSong,
                    SongID = item.SongID,
                    SingleSongID = item.SingleSongID,
                    Tone = item.Tone,
                    Name = item.Name,
                    Link = item.Link,
                    Approved = item.Approved,
                    ID = item.ID,
                    CreateDT = item.CreateDT
                };
                listLinkSong.Add(song);
            }

            IndexLinkSongViewModel model = new IndexLinkSongViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "LinkSongManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListLinkSong = listLinkSong
            };
            return model;
        }

        public async Task<EditLinkSongViewModel> GetEdit(long? ID)
        {
            var linksongDbContext = await _context.LinkSong
                .Include(p => p.Song)
                .Include(p => p.SingleSong)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (linksongDbContext != null)
            {
                EditLinkSongViewModel editModel = new EditLinkSongViewModel
                {
                    ID = linksongDbContext.ID,
                    Song = linksongDbContext.Song,
                    Tone = linksongDbContext.Tone,
                    SongID = linksongDbContext.SongID,
                    Link = linksongDbContext.Link,
                    SingleSong = linksongDbContext.SingleSong,
                    Name = linksongDbContext.Name,
                    SingleSongID = linksongDbContext.SingleSongID,
                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditLinkSongViewModel model)
        {
            var linksongDbContext = await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == model.ID);

            linksongDbContext.Link = model.Link;
            linksongDbContext.SongID = model.SongID;
            linksongDbContext.SingleSongID = model.SingleSongID;
            linksongDbContext.Tone = model.Tone;
            linksongDbContext.UpdateDT = DateTime.Now;
            linksongDbContext.Name = model.Name;


            _context.LinkSong.Update(linksongDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.LinkSong.Update(single);
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
                var single = await _context.LinkSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.LinkSong.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<LinkSong> Details(long? id)
        {
            var chord = await _context.LinkSong
                .Include(s => s.Author)
                .Include(s => s.Song)
                .Include(s => s.SingleSong)
                .SingleOrDefaultAsync(m => m.ID == id);
            return chord;
        }
    }
}