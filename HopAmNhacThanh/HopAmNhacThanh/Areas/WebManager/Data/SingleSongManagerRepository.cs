using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SingleSongViewModels;
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
    public class SingleSongManagerRepository : ISingleSongManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public SingleSongManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateSingleSongViewModel model, ApplicationUser user)
        {
            try
            {
                SingleSong singleSong = new SingleSong
                {
                    Name = model.Name,
                    Slug = StringExtensions.ConvertToUnSign3(model.Name),
                    Note = "",
                    ImageID = model.ImageID,
                    Content = model.Content,
                    Description = model.Description,
                    
                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.SingleSong.Add(singleSong);
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
            var singleSongDbContext = await _context.SingleSong.SingleOrDefaultAsync(m => m.ID == id);
            if (singleSongDbContext.IsDeleted || singleSongDbContext.Approved == Global.UNAPPROVED)
                _context.SingleSong.Remove(singleSongDbContext);
            else
            {
                singleSongDbContext.IsDeleted = true;
                _context.SingleSong.Update(singleSongDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.SingleSong.Any(e => e.ID == id);
        }

        public async Task<SingleSong> Get(long? id)
        {
            return await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexSingleSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.SingleSong
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
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
            }
            var pageList = await PaginatedList<SingleSong>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexSingleSongViewModel> listSingleSong = new List<SimpleIndexSingleSongViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexSingleSongViewModel singleSong = new SimpleIndexSingleSongViewModel
                {
                    Content = item.Content,
                    Description = item.Description,
                    ImageID = item.ImageID,
                    Name = item.Name,
                    Image = item.Image,
                    Slug = item.Slug,
                    Approved = item.Approved,
                    ID = item.ID,
                    CreateDT = item.CreateDT
                };
                listSingleSong.Add(singleSong);
            }

            IndexSingleSongViewModel model = new IndexSingleSongViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "SingleSongManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListSingleSong = listSingleSong
            };
            return model;
        }

        public async Task<EditSingleSongViewModel> GetEdit(long? ID)
        {
            var singleSongDbContext = await _context.SingleSong
                .Include(p => p.Image)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (singleSongDbContext != null)
            {
                EditSingleSongViewModel editModel = new EditSingleSongViewModel
                {
                    ID = singleSongDbContext.ID,
                    Slug = singleSongDbContext.Slug,
                    ImageID = singleSongDbContext.ImageID,
                    Name = singleSongDbContext.Name,
                    Image = singleSongDbContext.Image,
                    Content = singleSongDbContext.Content,
                    Description = singleSongDbContext.Description,
                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditSingleSongViewModel model)
        {
            var singleSongDbContext = await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == model.ID);

            singleSongDbContext.Slug = model.Slug;
            singleSongDbContext.Name = model.Name;
            singleSongDbContext.ImageID = model.ImageID;
            singleSongDbContext.Description = model.Description;
            singleSongDbContext.Content = model.Content;
            singleSongDbContext.UpdateDT = DateTime.Now;

            _context.SingleSong.Update(singleSongDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.SingleSong.Update(single);
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
                var single = await _context.SingleSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.SingleSong.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<SingleSong> Details(long? id)
        {
            var chord = await _context.SingleSong
                .Include(s => s.Image)
                .SingleOrDefaultAsync(m => m.ID == id);
            return chord;
        }
    }
}