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
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using HopAmNhacThanh.Areas.WebManager.Data;
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.LinkSongViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class LinkSongsManagerController : Controller
    {
        public static string DIR_AUDIO = "audio";
        private ApplicationDbContext _context;
        private ILinkSongManagerRepository _repository;
        private UserManager<ApplicationUser> _userManager;
        private readonly IFileProvider _fileProvider;
        public IHostingEnvironment HostingEnvironment { get; set; }

        public LinkSongsManagerController(IHostingEnvironment hostingEnvironment,
            ApplicationDbContext context,
            ILinkSongManagerRepository repository,
            UserManager<ApplicationUser> userManager)
        {
            HostingEnvironment = hostingEnvironment;
            _fileProvider = hostingEnvironment.WebRootFileProvider;
            _context = context;
            _userManager = userManager;
            _repository = repository;
        }


        // GET: WebManager/LinkSongs
        [Route("/quan-ly-web/link-song")]
        public async Task<IActionResult> Index(string sortOrder,
 string currentFilter,
    string searchString,
    int? page, int? pageSize)
        {
            List<NumberItem> SoLuong = new List<NumberItem>
            {
                new NumberItem { Value = 10},
                new NumberItem { Value = 20},
                new NumberItem { Value = 50},
                new NumberItem { Value = 100},
            };
            ViewData["SoLuong"] = SoLuong;
            ViewData["CurrentSort"] = sortOrder;
            ViewData["SongParm"] = String.IsNullOrEmpty(sortOrder) ? "song" : "";
            ViewData["CurrentSize"] = pageSize;
            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewData["CurrentFilter"] = searchString;
            var applicationDbContext = await _repository.GetAll(sortOrder, searchString, page, pageSize);
            return View(applicationDbContext);
        }
        [Route("/quan-ly-web/link-song/chi-tiet/{id}")]
        // GET: WebManager/LinkSongs/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _repository.Details(id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // GET: WebManager/LinkSongs/Create
        [Route("/quan-ly-web/link-song/tao-moi")]
        public IActionResult Create()
        {
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name");
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/LinkSongs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("/quan-ly-web/link-song/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateLinkSongViewModel linkSong)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUserAsync();
                bool result = await _repository.Create(linkSong, user);
                if (result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // GET: WebManager/LinkSongs/Edit/5
        [Route("/quan-ly-web/link-song/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var linkSong = await _repository.GetEdit(id);
            if (linkSong == null)
            {
                return NotFound();
            }
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // POST: WebManager/LinkSongs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("/quan-ly-web/link-song/chinh-sua/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, EditLinkSongViewModel linkSong)
        {
            if (id != linkSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(linkSong);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LinkSongExists(linkSong.ID))
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
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // GET: WebManager/LinkSongs/Delete/5
        [Route("/quan-ly-web/link-song/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var linkSong = await _repository.Get(id);
            if (linkSong == null)
            {
                return NotFound();
            }

            return View(linkSong);
        }

        // POST: WebManager/LinkSongs/Delete/5
        [Route("/quan-ly-web/link-song/xoa/{id}")]
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        private bool LinkSongExists(long id)
        {
            return _repository.Exists(id);
        }
        [Route("/quan-ly-web/link-song/tai-len")]
        public IActionResult Upload()
        {
            return View();
        }
        public async Task<ActionResult> Save(IEnumerable<IFormFile> files)
        {
            // The Name of the Upload component is "files"
            if (files != null)
            {
                foreach (var file in files)
                {
                    var fileContent = ContentDispositionHeaderValue.Parse(file.ContentDisposition);

                    // Some browsers send file names with full path.
                    // We are only interested in the file name.
                    var fileName = Path.GetFileName(fileContent.FileName.Trim('"'));
                    var physicalPath = Path.Combine(HostingEnvironment.WebRootPath, DIR_AUDIO, fileName);

                    if (file.Length > 0)
                    {
                        using (var stream = new FileStream(physicalPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                            // Image.Load(string path) is a shortcut for our default type. Other pixel formats use Image.Load<TPixel>(string path))
                        }

                        
                        var user = await GetCurrentUserAsync();
                        _context.Add(new Models.LinkSong
                        {
                            CreateDT = System.DateTime.Now,
                            Link = "\\" + DIR_AUDIO + "\\" + fileName,
                            Name = fileName,
                            Active = "A",
                            Approved = "U",
                            AuthorID = user.Id,
                            IsDeleted = false,
                        });
                        await _context.SaveChangesAsync();
                    }
                }
            }

            // Return an empty string to signify success
            return Content("");
        }

        public async Task<ActionResult> Remove(string[] fileNames)
        {
            // The parameter of the Remove action must be called "fileNames"

            if (fileNames != null)
            {
                foreach (var fullName in fileNames)
                {
                    var fileName = Path.GetFileName(fullName);
                    var physicalPath = Path.Combine(HostingEnvironment.WebRootPath, DIR_AUDIO, fileName);

                    // TODO: Verify user permissions

                    if (System.IO.File.Exists(physicalPath))
                    {
                        // The files are not actually removed in this demo
                        System.IO.File.Delete(physicalPath);
                        var removeDB = await _context.LinkSong.SingleOrDefaultAsync(p => p.Name == fileName);
                        _context.LinkSong.Remove(removeDB);
                        await _context.SaveChangesAsync();
                    }
                }
            }

            // Return an empty string to signify success
            return Content("");
        }
        private async Task<ApplicationUser> GetCurrentUserAsync()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        [Route("/quan-ly-web/link-song/chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/link-song/chinh-sua-xuat-ban/{id}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPublishDT(PublishDTViewModels model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.UpdatePublishDT(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound();
                }
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [Route("/quan-ly-web/link-song/chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/link-song/chinh-sua-duyet/{id}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditApproved(ApprovedViewModels model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.UpdateApproved(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound();
                }
                return RedirectToAction("Index");
            }
            return View(model);
        }

    }

}
