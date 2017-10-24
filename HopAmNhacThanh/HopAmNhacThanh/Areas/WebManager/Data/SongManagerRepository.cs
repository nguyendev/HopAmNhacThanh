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
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public class SongManagerRepository : ISongManagerRepository
    {
        protected readonly ApplicationDbContext _context;
        public SongManagerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateSongViewModel model, ApplicationUser user)
        {
            try
            {
                Song song = new Song
                {
                    Name = model.Name,
                    OrtherName = model.OrtherName,
                    CategoryID = model.CategoryID,
                    YearPublish = model.YearPublish,
                    AlbumID = model.AlbumID,
                    AuthorSongID = model.AuthorSongID,
                    NumberSongInAlbum = model.NumberSongInAlbum,
                    VietnameseLyricID = model.VietnameseLyricID,
                    Slug = StringExtensions.ConvertToUnSign3(model.Name),
                    Views = 0,
                    Note = model.Note,


                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.Song.Add(song);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CreateFull(CreateSongFullViewModels model, ApplicationUser user)
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
                            Type = 1,
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
        private async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public async Task Delete(long id)
        {
            var songDbContext = await _context.Song.SingleOrDefaultAsync(m => m.ID == id);
            if (songDbContext.IsDeleted || songDbContext.Approved == Global.UNAPPROVED)
                _context.Song.Remove(songDbContext);
            else
            {
                songDbContext.IsDeleted = true;
                _context.Song.Update(songDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Song.Any(e => e.ID == id);
        }

        public async Task<Song> Get(long? id)
        {
            return await _context.Song.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Song
                                .Include(p => p.ListLinkSong)
                                .Include(p => p.ListSheetMusic)
                                .Include(p => p.ListVideos)
                                .Include(p => p.ListChords)
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
                case "CategoryParm":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Category.Name);
                    break;
                case "AlbumParm":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Album.Name);
                    break;
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
            }
            var pageList = await PaginatedList<Song>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexSongViewModel> listSong = new List<SimpleIndexSongViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexSongViewModel song = new SimpleIndexSongViewModel
                {
                    AlbumID = item.AlbumID,
                    Album = item.Album,
                    Approved = item.Approved,
                    Category = item.Category,
                    CategoryID = item.CategoryID,
                    ID = item.ID,
                    Name = item.Name,
                    Views = item.Views,
                    CreateDT = item.CreateDT
                };
                listSong.Add(song);
            }

            IndexSongViewModel model = new IndexSongViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "SongManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListSong = listSong
                
            };
            return model; 
        }

        public async Task<EditSongViewModels> GetEdit(long? ID)
        {
            var songDbContext = await _context.Song
                .Include(p => p.Album)
                .Include(p => p.AuthorSong)
                .Include(p => p.Category)
                .Include(p => p.VietnameseLyric)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (songDbContext != null)
            {
                EditSongViewModels editModel = new EditSongViewModels
                {
                    ID = songDbContext.ID,
                    AlbumID = songDbContext.AlbumID,
                    Album = songDbContext.Album,
                    AuthorSongID = songDbContext.AuthorSongID,
                    AuthorSong = songDbContext.AuthorSong,
                    Category = songDbContext.Category,
                    CategoryID = songDbContext.CategoryID,
                    Name = songDbContext.Name,
                    Slug= songDbContext.Slug,
                    NumberSongInAlbum = songDbContext.NumberSongInAlbum,
                    OrtherName = songDbContext.OrtherName,
                    VietnameseLyric = songDbContext.VietnameseLyric,
                    VietnameseLyricID = songDbContext.VietnameseLyricID,
                    Views = songDbContext.Views,
                    YearPublish = songDbContext.YearPublish,

                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.Song.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.Song.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditSongViewModels model)
        {
            var songDbContext = await _context.Song.SingleOrDefaultAsync(p => p.ID == model.ID);

            songDbContext.AlbumID = model.AlbumID;
            songDbContext.AuthorSongID = model.AuthorSongID;
            songDbContext.CategoryID = model.CategoryID;
            songDbContext.Name = model.Name;

            songDbContext.OrtherName = model.OrtherName;
            songDbContext.YearPublish = model.YearPublish;
            songDbContext.VietnameseLyricID = model.VietnameseLyricID;
            songDbContext.NumberSongInAlbum = model.NumberSongInAlbum;
            songDbContext.Views = model.Views;
            songDbContext.Slug = model.Slug;
            songDbContext.Note = model.Note;

            _context.Song.Update(songDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.Song.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.Song.Update(single);
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
                var single = await _context.Song.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.Song.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<Song> Details(long? id)
        {
            var song = await _context.Song
                .Include(s => s.Author)
                .Include(s => s.AuthorSong)
                .Include(s => s.Category)
                .SingleOrDefaultAsync(m => m.ID == id);
            return song;
        }
    }
}
