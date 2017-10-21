using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using Microsoft.AspNetCore.Authorization;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class ReportSongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReportSongsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/ReportSongsManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.ReportSong.Include(r => r.Song);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/ReportSongsManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var reportSong = await _context.ReportSong
                .Include(r => r.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (reportSong == null)
            {
                return NotFound();
            }

            return View(reportSong);
        }

        // GET: WebManager/ReportSongsManager/Create
        public IActionResult Create()
        {
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/ReportSongsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Type,Error,CreateDT,Deleted,IsFinished")] ReportSong reportSong)
        {
            if (ModelState.IsValid)
            {
                _context.Add(reportSong);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", reportSong.SongID);
            return View(reportSong);
        }

        // GET: WebManager/ReportSongsManager/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var reportSong = await _context.ReportSong.SingleOrDefaultAsync(m => m.ID == id);
            if (reportSong == null)
            {
                return NotFound();
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", reportSong.SongID);
            return View(reportSong);
        }

        // POST: WebManager/ReportSongsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,Type,Error,CreateDT,Deleted,IsFinished")] ReportSong reportSong)
        {
            if (id != reportSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(reportSong);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ReportSongExists(reportSong.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", reportSong.SongID);
            return View(reportSong);
        }

        // GET: WebManager/ReportSongsManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var reportSong = await _context.ReportSong
                .Include(r => r.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (reportSong == null)
            {
                return NotFound();
            }

            return View(reportSong);
        }

        // POST: WebManager/ReportSongsManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var reportSong = await _context.ReportSong.SingleOrDefaultAsync(m => m.ID == id);
            _context.ReportSong.Remove(reportSong);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ReportSongExists(long id)
        {
            return _context.ReportSong.Any(e => e.ID == id);
        }
    }
}
