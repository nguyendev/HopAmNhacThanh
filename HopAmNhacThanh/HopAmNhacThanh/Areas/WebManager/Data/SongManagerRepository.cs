using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public class SongManagerRepository : ISongManagerRepository
    {
        protected readonly ApplicationDbContext _context;

        public SongManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public Task Create(CreateSongViewModels model)
        {
            throw new NotImplementedException();
        }

        public Task Delete(long id)
        {
            throw new NotImplementedException();
        }

        public bool Exists(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Song> Get(int? id)
        {
            throw new NotImplementedException();
        }

        public async Task<PaginatedList<Song>> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Song
                                .Include(p => p.ListLinkSong)
                                .Include(p => p.ListSheetMusic)
                                .Include(p => p.ListVideos)
                                .Include(p => p.ListChords)
                                .Include(p => p.Author)
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
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
            }
            return await PaginatedList<Song>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);
        }

        public Task<EditSongViewModels> GetEdit(int? ID)
        {
            throw new NotImplementedException();
        }

        public Task<ApprovedViewModels> GetEditApproved(int? ID)
        {
            throw new NotImplementedException();
        }

        public Task<PublishDTSongViewModels> GetEditPublishDT(int? ID)
        {
            throw new NotImplementedException();
        }

        public Task Update(EditSongViewModels model)
        {
            throw new NotImplementedException();
        }

        public Task UpdateApproved(ApprovedViewModels model)
        {
            throw new NotImplementedException();
        }

        public Task UpdatePublishDT(PublishDTSongViewModels model)
        {
            throw new NotImplementedException();
        }
    }
}
