using DoVuiHaiNao.Services;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public class AudioApiRepository : IAudioApiRepository
    {
        private readonly ApplicationDbContext _context;
        public AudioApiRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PaginatedList<SimpleLinkSongViewModel>> GetSearch(string searchString, int page, int pageSize)
        {

            List<SimpleLinkSongViewModel> listSong = new List<SimpleLinkSongViewModel>();

            var songDbContext = from s in _context.Song
                                .Include(p => p.Album)
                    .Include(p => p.AuthorSong)
                    .Include(p => p.Category)
                    .Include(p => p.VietnameseLyric)
                    .Where(p => p.Approved == Global.APPROVED)
                    .Where(p => p.CreateDT <= DateTime.Now)
                    .Where(p => !p.IsDeleted)
                                select s;
            if (searchString == "1")
            {
                var searchInName = songDbContext
                    .OrderByDescending(p => p.CreateDT);
                foreach (var item in searchInName)
                {
                    var linkSongs = _context.LinkSong
                            .Include(p => p.SingleSong)
                            .Where(p => p.SongID == item.ID)
                            .Where(p => p.Approved == Global.APPROVED)
                            .Where(p => p.CreateDT <= DateTime.Now)
                            .Where(p => !p.IsDeleted)
                            .First();
                    SimpleLinkSongViewModel song = new SimpleLinkSongViewModel
                    {
                        Link = linkSongs.Link,
                        SongName = item.Name,
                        Tone = linkSongs.Tone,
                        SingleSong = linkSongs.SingleSong,
                    };
                    listSong.Add(song);
                }
            }
            else
            {



                #region search in name
                var searchInName = songDbContext.Where(s => s.Name.Contains(searchString))
                    .OrderByDescending(p => p.CreateDT);
                foreach (var item in searchInName)
                {
                    var linkSongs = _context.LinkSong
                           .Include(p => p.SingleSong)
                           .Where(p => p.SongID == item.ID)
                           .Where(p => p.Approved == Global.APPROVED)
                           .Where(p => p.CreateDT <= DateTime.Now)
                           .Where(p => !p.IsDeleted)
                           .First();
                    SimpleLinkSongViewModel song = new SimpleLinkSongViewModel
                    {
                        Link = linkSongs.Link,
                        SongName = item.Name,
                        Tone = linkSongs.Tone,
                        SingleSong = linkSongs.SingleSong,
                    };
                    listSong.Add(song);
                }
                #endregion

            }
            var songPaginatedList = PaginatedList<SimpleLinkSongViewModel>.Create(listSong, page, pageSize);

            return songPaginatedList;
        }

        public async Task<List<LinkSong>> GetAudio(string slug)
        {
            var songContext = await _context.Song
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .FirstOrDefaultAsync(p => p.Slug == slug);
            var audioDbContext = await _context.LinkSong
                .Include(p => p.SingleSong)
                .Where(p => p.SongID == songContext.ID)
                .ToListAsync();
            return audioDbContext;
        }
    }
}
