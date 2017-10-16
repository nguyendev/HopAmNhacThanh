using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public class SongManagerRepository : ISongManagerRepository
    {
        protected readonly ApplicationDbContext _context;

        public SongManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> Create(CreateSongViewModels model, ApplicationUser user)
        {
            try
            {
                Song song = new Song
                {
                    Name = model.NameSong,
                    OrtherName = model.OrtherNameSong,
                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    CategoryID = model.CategoryID,
                    IsDeleted = false,
                    Note = "",
                    YearPublish = model.YearPublish,
                    Views = 0,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                    Slug = StringExtensions.ConvertToUnSign3(model.NameSong),
                };
                song.AuthorSongID = model.AuthorSongID != 0 ? model.AuthorSongID : song.AuthorSongID = null;
                song.VietnameseLyricID = model.VietNameseLyric != 0 ? model.VietNameseLyric : song.VietnameseLyricID = null;
                //AlbumID = null,
                _context.Song.Add(song);
                _context.SaveChanges();

                List<LinkSong> listLinkSong = new List<LinkSong>();
                if (null != model.ArrLinkSong)
                {
                    foreach (var item in model.ArrLinkSong)
                    {
                        LinkSong linkSong = new LinkSong
                        {
                            CreateDT = DateTime.Now,
                            Active = "A",
                            Approved = "A",
                            AuthorID = user.Id,
                            IsDeleted = false,
                            Link = item.Link,
                            Note = "",
                            SongID = song.ID,
                            UpdateDT = null,
                            Tone = item.Tone
                        };
                        linkSong.SingleSongID = item.SongID != 0 ? item.SongID : linkSong.SingleSongID = null;

                        _context.LinkSong.Add(linkSong);
                    }
                }
                List<Chords> listChords = new List<Chords>();
                foreach (var item in model.ArrChords)
                {
                    Chords chords = new Chords
                    {
                        CreateDT = DateTime.Now,
                        Active = "A",
                        Approved = "A",
                        AuthorID = user.Id,
                        IsDeleted = false,
                        Note = "",
                        Info = "",
                        Intro = item.Intro,
                        Lyric = item.Lyric,
                        InfoShort = "",
                        Tone = "",
                        Slug = user.Slug + "-" + StringExtensions.RandomNumber(2),
                        SongID = song.ID,
                        StyleID = null,
                        UpdateDT = null,
                        Version = "",
                    };
                    _context.Chords.Add(chords);
                }
                if (model.ArrVideo != null)
                {
                    List<Video> listVideo = new List<Video>();
                    foreach (var item in model.ArrVideo)
                    {
                        Video video = new Video
                        {
                            IsYoutube = false,
                            Link = item.Link,
                            SongID = song.ID,
                            Name = item.Name

                        };
                        _context.Video.Add(video);
                    }
                }
                List<SheetMusic> listSheetMusic = new List<SheetMusic>();
                if (model.ArrSheetMusic != null)
                {
                    foreach (var item in model.ArrSheetMusic)
                    {
                        SheetMusic sheetMusic = new SheetMusic
                        {
                            CreateDT = DateTime.Now,
                            Active = "A",
                            Approved = "A",
                            AuthorID = user.Id,
                            IsDeleted = false,
                            Note = "",
                            Name = item.Name,
                            SongID = song.ID,
                            Type = item.Type,
                            UpdateDT = null
                        };
                        _context.SheetMusic.Add(sheetMusic);
                    }
                }
            
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception e) {
                return false;
            }
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
