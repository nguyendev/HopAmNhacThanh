using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Models;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Data.SongRepository
{
    public class SongRepository : ISongRepository
    {
        private readonly ApplicationDbContext _context;
        public SongRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddNewVersionSong(AddNewVersionSong model, ApplicationUser user)
        {
            try
            {
                long songID = _context.Song.First(p => p.Slug == model.Slug).ID;
                Chords chord = new Chords
                {
                    Active = "T",
                    Approved = "U",
                    CreateDT = DateTime.Now,
                    AuthorID = user.Id,
                    Intro = model.Intro,
                    Slug = user.Slug + "-" + StringExtensions.RandomNumber(2),
                    IsDeleted = false,
                    SongID = songID,
                    Lyric = model.Lyric,
                    Note = model.Note,
                };
                _context.Chords.Add(chord);
                await _context.SaveChangesAsync();
            }
            catch { }
        }


        public async Task ReportSong(ReportSongViewModel model)
        {
            try
            {
                long songID = _context.Song.First(p => p.Slug == model.Slug).ID;
                ReportSong report = new ReportSong
                {
                    CreateDT = DateTime.Now,
                    IsFinished = false,
                    SongID = songID,
                    Deleted = false,
                    Error = model.Error,
                    Type = model.Type
                };
                _context.ReportSong.Add(report);
                await _context.SaveChangesAsync();
            }
            catch { }
        }
    }
}
