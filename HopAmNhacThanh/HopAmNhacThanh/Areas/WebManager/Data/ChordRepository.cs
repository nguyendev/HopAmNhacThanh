using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.WebManager.ViewModels.ChordViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
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
    public class ChordRepository : IChordManagerRepository
    {
        private readonly ApplicationDbContext _context;
        public ChordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Create(CreateChordViewModel model, ApplicationUser user)
        {
            try
            {
                Chords chord = new Chords
                {
                    Info = model.Info,
                    InfoShort = model.Info,
                    Intro = model.Intro,
                    Tone = model.Tone,
                    SongID = model.SongID,
                    Version = model.Version,
                    StyleID = model.StyleID,
                    Lyric = model.Lyric,
                    Slug = user.Slug + "-" + StringExtensions.RandomNumber(2),
                    Note = model.Note,

                    Active = "A",
                    AuthorID = user.Id,
                    Approved = "U",
                    IsDeleted = false,
                    UpdateDT = null,
                    CreateDT = DateTime.Now,
                };
                _context.Chords.Add(chord);
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
            var chordDbContext = await _context.Chords.SingleOrDefaultAsync(m => m.ID == id);
            if (chordDbContext.IsDeleted || chordDbContext.Approved == Global.UNAPPROVED)
                _context.Chords.Remove(chordDbContext);
            else
            {
                chordDbContext.IsDeleted = true;
                _context.Chords.Update(chordDbContext);
            }
            await Save();
        }

        public bool Exists(long id)
        {
            return _context.Chords.Any(e => e.ID == id);
        }

        public async Task<Chords> Get(long? id)
        {
            return await _context.Chords.SingleOrDefaultAsync(p => p.ID == id);
        }

        public async Task<IndexChordViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize)
        {
            var applicationDbContext = from s in _context.Chords
                                .Include(p => p.Song)
                                .Include(p => p.Style)
                                       select s;
            if (!String.IsNullOrEmpty(searchString))
            {
                applicationDbContext = applicationDbContext.Where(s => s.Info.Contains(searchString));
            }
            switch (sortOrder)
            {
                case "SongParm":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Song.Name);
                    break;
                case "StyleParm":
                    applicationDbContext = applicationDbContext.OrderBy(s => s.Style.Name);
                    break;
                default:
                    applicationDbContext = applicationDbContext.OrderByDescending(s => s.CreateDT);
                    break;
            }
            var pageList = await PaginatedList<Chords>.CreateAsync(applicationDbContext.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);

            List<SimpleIndexChordViewModel> listChord = new List<SimpleIndexChordViewModel>();
            foreach (var item in pageList)
            {
                SimpleIndexChordViewModel song = new SimpleIndexChordViewModel
                {
                    Song = item.Song,
                    Style = item.Style,
                    SongID = item.SongID,
                    StyleID = item.StyleID,
                    Tone = item.Tone,
                    Version = item.Version,
                    Approved = item.Approved,
                    ID = item.ID,
                    CreateDT = item.CreateDT
                };
                listChord.Add(song);
            }

            IndexChordViewModel model = new IndexChordViewModel
            {
                PageSize = pageList.PageSize,
                Areas = "WebManager",
                Action = "Index",
                Controller = "ChordManager",
                Count = pageList.Count,
                TotalPages = pageList.TotalPages,
                PageIndex = pageList.PageIndex,
                ListChord = listChord
            };
            return model;
        }

        public async Task<EditChordViewModel> GetEdit(long? ID)
        {
            var chordDbContext = await _context.Chords
                .Include(p => p.Song)
                .Include(p => p.Style)
                .SingleOrDefaultAsync(p => p.ID == ID);
            if (chordDbContext != null)
            {
                EditChordViewModel editModel = new EditChordViewModel
                {
                    ID = chordDbContext.ID,
                    Slug = chordDbContext.Slug,
                    Version = chordDbContext.Version,
                    Info = chordDbContext.Info,
                    InfoShort = chordDbContext.InfoShort,
                    Intro = chordDbContext.Intro,
                    Lyric = chordDbContext.Lyric,
                    Style = chordDbContext.Style,
                    Song = chordDbContext.Song,
                    Tone = chordDbContext.Tone,
                    StyleID = chordDbContext.StyleID,
                    SongID = chordDbContext.SongID,
                };
                return editModel;
            }
            return null;
        }

        public async Task<ApprovedViewModels> GetEditApproved(long? ID)
        {
            try
            {
                var single = await _context.Chords.SingleOrDefaultAsync(p => p.ID == ID);
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
                var single = await _context.Chords.SingleOrDefaultAsync(p => p.ID == ID);
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

        public async Task Update(EditChordViewModel model)
        {
            var chordDbContext = await _context.Chords.SingleOrDefaultAsync(p => p.ID == model.ID);

            chordDbContext.Slug = model.Slug;
            chordDbContext.Info = model.Info;
            chordDbContext.InfoShort = model.InfoShort;
            chordDbContext.Intro = model.Intro;
            chordDbContext.Lyric = model.Lyric;
            chordDbContext.SongID = model.SongID;
            chordDbContext.StyleID = model.StyleID;
            chordDbContext.Tone = model.Tone;
            chordDbContext.UpdateDT = DateTime.Now;
            chordDbContext.Version = model.Version;


            _context.Chords.Update(chordDbContext);
            await Save();
        }

        public async Task UpdateApproved(ApprovedViewModels model)
        {
            try
            {
                var single = await _context.Chords.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.Approved = model.Approved;
                _context.Chords.Update(single);
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
                var single = await _context.Chords.SingleOrDefaultAsync(p => p.ID == model.ID);
                single.CreateDT = model.PublishDT;
                _context.Chords.Update(single);
                await _context.SaveChangesAsync();
            }
            catch
            {

            }
        }

        public async Task<Chords> Details(long? id)
        {
            var chord = await _context.Chords
                .Include(s => s.Author)
                .Include(s => s.Song)
                .Include(s => s.Style)
                .SingleOrDefaultAsync(m => m.ID == id);
            return chord;
        }
    }
}