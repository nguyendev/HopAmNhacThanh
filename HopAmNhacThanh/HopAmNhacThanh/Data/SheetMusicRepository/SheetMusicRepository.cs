using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models.SheetMusicViewModels;
using Microsoft.EntityFrameworkCore;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Data.SheetMusicRepository
{
    public class SheetMusicRepository : ISheetMusicRepository
    {
        private readonly ApplicationDbContext _context;
        private const string JPG = ".jpg";
        private const string PNG = ".png";
        private const string PDF = ".pdf";
        public SheetMusicRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<SingleSheetMusicViewModel> GetSingle(string slug)
        {
            var songDbContext = await _context.Song
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                                          .SingleOrDefaultAsync(p => p.Slug == slug);

            var chordDbContext = await _context.Chords.FirstOrDefaultAsync(p => p.SongID == songDbContext.ID);

            var sheetDbContext = await _context.SheetMusic
                                           .Include(p => p.Song)
                                           .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                                           .Where(p => p.SongID == songDbContext.ID)
                                           .ToListAsync();
            List<SimpleSheetMusicViewModel> listPNG = new List<SimpleSheetMusicViewModel>();
            List<SimpleSheetMusicViewModel> listJPG = new List<SimpleSheetMusicViewModel>();
            List<SimpleSheetMusicViewModel> listPDF = new List<SimpleSheetMusicViewModel>();
            foreach (var item in sheetDbContext)
            {
                SimpleSheetMusicViewModel simpleSheetMusic = new SimpleSheetMusicViewModel
                {
                    Number = item.Number,
                    Type = item.Type,
                    Source = item.Source,
                    Name = item.Name
                };
                switch (item.Type)
                {
                    case PNG:
                        listPNG.Add(simpleSheetMusic);
                        break;
                    case JPG:
                        listJPG.Add(simpleSheetMusic);
                        break;
                    case PDF:
                        listPDF.Add(simpleSheetMusic);
                        break;
                };
            }

            SingleSheetMusicViewModel model = new SingleSheetMusicViewModel
            {
                Title = songDbContext.Name,
                Slug = songDbContext.Slug,
                SlugVersion = chordDbContext.Slug,
                ListPNG = listPNG.OrderBy(p => p.Number).ToList(),
                ListJPG = listJPG.OrderBy(p => p.Number).ToList(),
                ListPDF = listPDF.OrderBy(p => p.Number).ToList(),
            };

            return model;
        }
    }
}