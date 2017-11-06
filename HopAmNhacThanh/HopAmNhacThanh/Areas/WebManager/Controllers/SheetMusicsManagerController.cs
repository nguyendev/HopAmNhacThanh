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
using HopAmNhacThanh.Areas.WebManager.Data;
using Microsoft.AspNetCore.Identity;
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SheetMusicViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class SheetMusicsManagerController : Controller
    {
        
        private const string DIR_SHEETMUSIC = "sheetmusic";
        private ApplicationDbContext _context;
        private ISheetMusicManagerRepository _repository;
        private UserManager<ApplicationUser> _userManager;
        private readonly IFileProvider _fileProvider;
        public IHostingEnvironment HostingEnvironment { get; set; }

        public SheetMusicsManagerController(IHostingEnvironment hostingEnvironment,
            ApplicationDbContext context,
            ISheetMusicManagerRepository repository,
            UserManager<ApplicationUser> userManager)
        {
            HostingEnvironment = hostingEnvironment;
            _fileProvider = hostingEnvironment.WebRootFileProvider;
            _context = context;
            _userManager = userManager;
            _repository = repository;
        }

        // GET: WebManager/model
        [Route("quan-ly-web/sheet")]
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
            ViewData["NameParm"] = String.IsNullOrEmpty(sortOrder) ? "name" : "";
            ViewData["SongParm"] = String.IsNullOrEmpty(sortOrder) ? "song" : "";
            ViewData["TypeParm"] = String.IsNullOrEmpty(sortOrder) ? "type" : "";
            ViewData["CreateDTParm"] = String.IsNullOrEmpty(sortOrder) ? "createDT" : "";
            ViewData["ApprovedParm"] = String.IsNullOrEmpty(sortOrder) ? "approved" : "";
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

        // GET: WebManager/model/Details/5
        [Route("quan-ly-web/sheet/chi-tiet/{id}")]
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var model = await _repository.Details(id);
            if (model == null)
            {
                return NotFound();
            }

            return View(model);
        }

        // GET: WebManager/model/Create
        [Route("quan-ly-web/sheet/tao-moi")]
        public IActionResult Create()
        {
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/model/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.

        // GET: WebManager/model/Edit/5
        [Route("quan-ly-web/sheet/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var model = await _repository.GetEdit(id);
            if (model == null)
            {
                return NotFound();
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", model.SongID);
            return View(model);
        }

        // POST: WebManager/model/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("quan-ly-web/sheet/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, EditSheetMusicViewModel model)
        {
            if (id != model.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!modelExists(model.ID))
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
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", model.SongID);
            return View(model);
        }

        // GET: WebManager/model/Delete/5
        [Route("quan-ly-web/sheet/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var model = await _repository.Get(id);
            if (model == null)
            {
                return NotFound();
            }

            return View(model);
        }

        // POST: WebManager/model/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route("quan-ly-web/sheet/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        private bool modelExists(long id)
        {
            return _repository.Exists(id);
        }
        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        [Route("/quan-ly-web/sheet/chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/sheet/chinh-sua-xuat-ban/{id}")]
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

        [Route("/quan-ly-web/sheet/chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/sheet/chinh-sua-duyet/{id}")]
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
                    var physicalPath = Path.Combine(HostingEnvironment.WebRootPath, DIR_SHEETMUSIC, fileName);

                    if (file.Length > 0)
                    {
                        using (var stream = new FileStream(physicalPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                            // Image.Load(string path) is a shortcut for our default type. Other pixel formats use Image.Load<TPixel>(string path))
                        }

                        String ext = System.IO.Path.GetExtension(file.FileName);

                        var user = await GetCurrentUserAsync();
                        _context.Add(new Models.SheetMusic
                        {
                            CreateDT = System.DateTime.Now,
                            Source = "\\" + DIR_SHEETMUSIC + "\\" + fileName,
                            Type = ext,
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
                    var physicalPath = Path.Combine(HostingEnvironment.WebRootPath, DIR_SHEETMUSIC, fileName);

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
    }
}
