using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Areas.WebManager.ViewModels.AlbumViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Data;
using DoVuiHaiNao.Services;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Services;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public class AlbumManagerRepository : IAlbumManagerRepository
    {
        private readonly ApplicationDbContext _context;

        public AlbumManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateAlbumViewModel model, ApplicationUser user)
        {
            try
            {
                Album album = new Album
                {
                    Content = model.Content,
                    Image = model.Image,
                    Name = model.Name,
                    Slug = StringExtensions.ConvertToUnSign3(model.Name),
                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.Album.Add(album);
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
            var single = await _context.Album.SingleOrDefaultAsync(m => m.ID == id);
            if (single.IsDeleted || single.Approved == Global.UNAPPROVED)
                _context.Album.Remove(single);
            else
            {
                single.IsDeleted = true;
                _context.Album.Update(single);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Album.Any(e => e.ID == id);
        }

        public async Task<Album> Get(long? id)
        {
            return await _context.Album.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexAlbumViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Album
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
            var pageList = await PaginatedList<Album>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexAlbumViewModel> listAlbum = new List<SimpleIndexAlbumViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexAlbumViewModel song = new SimpleIndexAlbumViewModel
                {
                    Content = item.Content,
                    Slug = item.Slug,
                    Name = item.Name,
                    Image = item.Image,
                    Approved = item.Approved,
                    ID = item.ID,
                    CreateDT = item.CreateDT
                };
                listAlbum.Add(song);
            }

            IndexAlbumViewModel model = new IndexAlbumViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "ChordManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListAlbum = listAlbum
            };
            return model;
        }

        public async Task<EditAlbumViewModel> GetEdit(long? ID)
        {
            var single = await _context.Album
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (single != null)
            {
                EditAlbumViewModel editModel = new EditAlbumViewModel
                {
                    ID = single.ID,
                    Slug = single.Slug,
                    Content = single.Content,
                    Image = single.Image,
                    Name = single.Name
                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.Album.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.Album.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditAlbumViewModel model)
        {
            var single = await _context.Album.SingleOrDefaultAsync(p => p.ID == model.ID);

            single.Slug = model.Slug;
            single.UpdateDT = DateTime.Now;
            single.Image = model.Image;
            single.Name = model.Name;
            single.Slug = model.Slug;
            single.Content = model.Content;

            _context.Album.Update(single);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.Album.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.Album.Update(single);
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
                var single = await _context.Album.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.Album.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<Album> Details(long? id)
        {
            var single = await _context.Album
                .SingleOrDefaultAsync(m => m.ID == id);
            return single;
        }
    }
}