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
    public class RequestSongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RequestSongsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/RequestSongsManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.RequestSong.Include(r => r.Author);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/RequestSongsManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestSong = await _context.RequestSong
                .Include(r => r.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (requestSong == null)
            {
                return NotFound();
            }

            return View(requestSong);
        }

        // GET: WebManager/RequestSongsManager/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            return View();
        }

        // POST: WebManager/RequestSongsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,IsFinished,Slug,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] RequestSong requestSong)
        {
            if (ModelState.IsValid)
            {
                _context.Add(requestSong);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", requestSong.AuthorID);
            return View(requestSong);
        }

        // GET: WebManager/RequestSongsManager/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestSong = await _context.RequestSong.SingleOrDefaultAsync(m => m.ID == id);
            if (requestSong == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", requestSong.AuthorID);
            return View(requestSong);
        }

        // POST: WebManager/RequestSongsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,IsFinished,Slug,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] RequestSong requestSong)
        {
            if (id != requestSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(requestSong);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RequestSongExists(requestSong.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", requestSong.AuthorID);
            return View(requestSong);
        }

        // GET: WebManager/RequestSongsManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var requestSong = await _context.RequestSong
                .Include(r => r.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (requestSong == null)
            {
                return NotFound();
            }

            return View(requestSong);
        }

        // POST: WebManager/RequestSongsManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var requestSong = await _context.RequestSong.SingleOrDefaultAsync(m => m.ID == id);
            _context.RequestSong.Remove(requestSong);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool RequestSongExists(long id)
        {
            return _context.RequestSong.Any(e => e.ID == id);
        }
    }
}
