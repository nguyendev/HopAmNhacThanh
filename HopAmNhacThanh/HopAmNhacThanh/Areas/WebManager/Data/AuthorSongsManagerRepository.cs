using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.AuthorSongViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels;
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
    public class AuthorSongsManagerRepository : IAuthorSongsManagerRepository
    {
        protected readonly ApplicationDbContext _context;
        public AuthorSongsManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateAuthorSongViewModel model, ApplicationUser user)
        {
            try
            {
                AuthorSong authorSong = new AuthorSong
                {
                    Name = model.Name,
                    Slug = StringExtensions.ConvertToUnSign3(model.Name),
                    Content = model.Content,
                    ImageID = model.ImageID,
                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.AuthorSong.Add(authorSong);
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
            var authorSongDbContext = await _context.AuthorSong.SingleOrDefaultAsync(m => m.ID == id);
            if (authorSongDbContext.IsDeleted || authorSongDbContext.Approved == Global.UNAPPROVED)
                _context.AuthorSong.Remove(authorSongDbContext);
            else
            {
                authorSongDbContext.IsDeleted = true;
                _context.AuthorSong.Update(authorSongDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.AuthorSong.Any(e => e.ID == id);
        }

        public async Task<AuthorSong> Get(long? id)
        {
            return await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexAuthorSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.AuthorSong
                                .Include(p => p.Image)
                                .Include(p => p.Author)
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
            var pageList = await PaginatedList<AuthorSong>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);



            IndexAuthorSongViewModel model = new IndexAuthorSongViewModel
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

        public async Task<EditAuthorSongViewModel> GetEdit(long? ID)
        {
            var authorSongDbContext = await _context.AuthorSong
                .Include(p => p.Image)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (authorSongDbContext != null)
            {
                EditAuthorSongViewModel editModel = new EditAuthorSongViewModel
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

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditAuthorSongViewModel model)
        {
            var authorSongDbContext = await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == model.ID);

            authorSongDbContext.Name = model.Name;
            authorSongDbContext.ImageID = model.ImageID;
            authorSongDbContext.Content = model.Content;
            authorSongDbContext.Slug = model.Slug;
            authorSongDbContext.UpdateDT = DateTime.Now;
            _context.AuthorSong.Update(authorSongDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.AuthorSong.Update(single);
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
                var single = await _context.AuthorSong.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.AuthorSong.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<AuthorSong> Details(long? id)
        {
            var authorSong = await _context.AuthorSong
                .Include(s => s.Author)
                .Include(s => s.Image)
                .SingleOrDefaultAsync(m => m.ID == id);
            return authorSong;
        }
    }
}
