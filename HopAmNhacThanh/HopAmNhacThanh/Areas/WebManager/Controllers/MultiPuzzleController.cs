//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using HopAmNhacThanh.Services;
//using HopAmNhacThanh.Models;
//using Microsoft.AspNetCore.Authorization;
//using HopAmNhacThanh.Data;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Http;
//using Newtonsoft.Json;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using HopAmNhacThanh.Areas.WebManager.ViewModels;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.MultiPuzzleViewModels;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;

//namespace HopAmNhacThanh.Areas.WebManager.Controllers
//{
//    [Area("WebManager")]
//    [Authorize(Roles = "Admin, Manager")]
//    public class MultiPuzzleController : Controller
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly IMultiPuzzleManagerRepsository _repository;
//        private readonly UserManager<ApplicationUser> _userManager;
//        public MultiPuzzleController(
//            ApplicationDbContext context,
//            UserManager<ApplicationUser> userManager,
//            IMultiPuzzleManagerRepsository multiPuzzle)
//        {
//            _context = context;
//            _userManager = userManager;
//            _repository = multiPuzzle;
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet")]
//        public async Task<IActionResult> Index(string sortOrder,
// string currentFilter,
//    string searchString,
//    int? page, int? pageSize)
//        {
//            List<NumberItem> SoLuong = new List<NumberItem>
//            {
//                new NumberItem { Value = 10},
//                new NumberItem { Value = 20},
//                new NumberItem { Value = 50},
//                new NumberItem { Value = 100},
//            };
//            ViewData["SoLuong"] = SoLuong;
//            ViewData["CurrentSort"] = sortOrder;
//            ViewData["TitleParm"] = String.IsNullOrEmpty(sortOrder) ? "title" : "";
//            ViewData["CurrentSize"] = pageSize;
//            if (searchString != null)
//            {
//                page = 1;
//            }
//            else
//            {
//                searchString = currentFilter;
//            }

//            ViewData["CurrentFilter"] = searchString;
//            return View(await _repository.GetAll(sortOrder, searchString, page, pageSize));
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/tao")]
//        public IActionResult Create()
//        {
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
//            return View();
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/tao")]
//        [HttpPost]
//        public IActionResult Create(MultiPuzzle model)
//        {
//            if (ModelState.IsValid)
//            {
//                HttpContext.Session.SetObjectAsJson("MultiPuzzle", model);
                
//                return RedirectToAction("CreateMulti");
//            }
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name",model.ImageID);
//            return View(model);
//        }
//        [HttpPost]
//        public async Task<IActionResult> SaveAll()
//        {
//            var sMultiPuzzle = HttpContext.Session.GetObjectFromJson<MultiPuzzle>("MultiPuzzle");
//            var sListSinglePuzzleDetails = HttpContext.Session.GetObjectFromJson<List<Temp>>("listSinglePuzzleDetails");
//            var user = await GetCurrentUserAsync();
//            MultiPuzzle multipuzzle = new MultiPuzzle
//            {
//                Active = "A",
//                Approved = "U",
//                ImageID = sMultiPuzzle.ImageID,
//                AuthorID = user.Id,
//                CreateDT = DateTime.Now,
//                Description = sMultiPuzzle.Description,
//                Image = sMultiPuzzle.Image,
//                IsDeleted = false,
//                Like = 0,
//                UpdateDT = DateTime.Now,
//                Title = sMultiPuzzle.Title,
//                NumberQuestion = sMultiPuzzle.NumberQuestion,
//                Slug = sMultiPuzzle.Slug,
//                Note = sMultiPuzzle.Note,
//                Level = 1
//            };
//            List<SinglePuzzle> listSinglePuzzleDetails = new List<SinglePuzzle>(multipuzzle.NumberQuestion - 1);
//            await _context.MultiPuzzle.AddAsync(multipuzzle);
//            await _context.SaveChangesAsync();
//            foreach (var item in sListSinglePuzzleDetails)
//            {
//                SinglePuzzle singlePuzzleDetails = new SinglePuzzle
//                {
//                    ImageID = item.Image,
//                    IsMMultiPuzzle = true,
//                    Reason = item.Reason,
//                    AuthorID = (await GetCurrentUserAsync()).Id,
//                    Active = multipuzzle.Active,
//                    Note = multipuzzle.Note,
//                    Title = item.Title,
//                    Description = item.Description,
//                    IsYesNo = item.IsYesNo,
//                    MultiPuzzleID = multipuzzle.ID,
//                    AnswerA = item.AnswerA,
//                    AnswerB = item.AnswerB,
//                    AnswerC = item.AnswerC,
//                    AnswerD = item.AnswerD,
//                    Correct = item.Correct,
//                    IsDeleted = false,
//                    CreateDT = DateTime.Now,
//                    UpdateDT = DateTime.Now,
//                    Approved = "A",
//                };
//                if (singlePuzzleDetails.ImageID == 0)
//                    singlePuzzleDetails.ImageID = null;
//                _context.SinglePuzzle.Add(singlePuzzleDetails);
//                List<string> listString = StringExtensions.ConvertStringToListString(item.TempTag);
//                List<Tag> listTag = new List<Tag>(listString.Capacity - 1);

//                // Save all tag
//                foreach (var itemTag in listString)
//                {
//                    bool IsExitsTag = await _context.Tag.AnyAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(itemTag));
//                    Tag tag;
//                    if (IsExitsTag)
//                    {
//                        tag = await _context.Tag.SingleOrDefaultAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(itemTag));
//                    }
//                    else
//                    {
//                        tag = new Tag
//                        {
//                            Title = itemTag,
//                            Slug = StringExtensions.ConvertToUnSign3(itemTag),
//                            CreateDT = DateTime.Now
//                        };
//                        _context.Tag.Add(tag);
//                    }
//                     _context.SingPuzzleTag.Add(new SinglePuzzleTag { TagID = tag.ID, SinglePuzzleID = singlePuzzleDetails.ID });
//                     await _context.SaveChangesAsync();
//                }
//            }
//            return RedirectToAction("Index", "MultiPuzzle");
//        }

//        public IActionResult CreateMulti()
//        {
//            var multiPuzzle = HttpContext.Session.GetObjectFromJson<MultiPuzzle>("MultiPuzzle");
//            var listSinglePuzzleDetails = HttpContext.Session.GetObjectFromJson<List<Temp>>("listSinglePuzzleDetails");
//            if (listSinglePuzzleDetails == null)
//            {

//                List<Temp> list = new List<Temp>(multiPuzzle.NumberQuestion - 1);
//                for (int i = 0; i <= multiPuzzle.NumberQuestion - 1; i++)
//                {
//                    list.Add(new Temp { ID = i });
//                }
//                ViewData["listSinglePuzzleDetails"] = list.ToList();
//                HttpContext.Session.SetObjectAsJson("listSinglePuzzleDetails", list);
//            }
//            else
//            {
//                ViewData["listSinglePuzzleDetails"] = listSinglePuzzleDetails.ToList();
//            }
//            ViewData["NumberQuestion"] = multiPuzzle.NumberQuestion;
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
//            return View();
//        }
//        [HttpPost]
//        [Route("sendData")]
//        public IActionResult SaveTemp(Temp temp, string id)
//        {
//            var oldListSinglePuzzleDetails = HttpContext.Session.GetObjectFromJson<List<Temp>>("listSinglePuzzleDetails");
//            var multiPuzzle = HttpContext.Session.GetObjectFromJson<MultiPuzzle>("MultiPuzzle");

//            //luu gia tri moi vao session
//            List<Temp> newListSinglePuzzleDetails = new List<Temp>(multiPuzzle.NumberQuestion - 1);
//            foreach (var item in oldListSinglePuzzleDetails)
//            {
//                if (item.ID == Int32.Parse(id))
//                {
//                    item.Title = temp.Title;
//                    item.Description = temp.Description;
//                    item.Image = temp.Image;
//                    item.AnswerA = temp.AnswerA;
//                    item.AnswerB = temp.AnswerB;
//                    item.AnswerC = temp.AnswerC;
//                    item.AnswerD = temp.AnswerD;
//                    item.Correct = temp.Correct;
//                    item.IsYesNo = temp.IsYesNo;
//                    item.TempTag = temp.TempTag;
//                    item.Reason = temp.Reason;
//                }
//                newListSinglePuzzleDetails.Add(item);
//            }
//            HttpContext.Session.SetObjectAsJson("listSinglePuzzleDetails", newListSinglePuzzleDetails);
//            ViewData["listSinglePuzzleDetails"] = newListSinglePuzzleDetails.ToList();

//            var serializedJsonModel = JsonConvert.SerializeObject(newListSinglePuzzleDetails.ToList());
//            return Json(serializedJsonModel);
//        }


//        private async Task<ApplicationUser> GetCurrentUserAsync()
//        {
//            return await _userManager.GetUserAsync(HttpContext.User);
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/chi-tiet/{id}")]
//        public async Task<IActionResult> Details(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var multiPuzzle = await _context.MultiPuzzle
//                .Include(m => m.Author)
//                .Include(m => m.Image)
//                .SingleOrDefaultAsync(m => m.ID == id);
//            if (multiPuzzle == null)
//            {
//                return NotFound();
//            }
//            ViewData["ListSinglePuzzle"] = await _context.SinglePuzzle.Where(p => p.MultiPuzzleID == id).ToListAsync();
//            return View(multiPuzzle);
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var multiPuzzle = await _repository.GetEdit(id);
//            if (multiPuzzle == null)
//            {
//                return NotFound();
//            }
//            AllSelectList allSelectList = new AllSelectList();
//            ViewData["Approved"] = new SelectList(allSelectList.ListApproved, "ID", "Name", multiPuzzle.Approved);
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", multiPuzzle.ImageID);
//            return View(multiPuzzle);
//        }

//        // POST: WebManager/MultiPuzzlesD/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [Route("/quan-ly-web/cau-do-dac-biet/chinh-sua/{id}")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> Edit(int id, EditMultiPuzzleViewModel multiPuzzle)
//        {
//            if (id != multiPuzzle.ID)
//            {
//                return NotFound();
//            }

//            if (ModelState.IsValid)
//            { 
//                try
//                {
//                    await _repository.Update(multiPuzzle);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    if (!MultiPuzzleExists(multiPuzzle.ID))
//                    {
//                        return NotFound();
//                    }
//                    else
//                    {
//                        throw;
//                    }
//                }
//                return RedirectToAction("Index");
//            }
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "ID", multiPuzzle.ImageID);
//            return View(multiPuzzle);
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/xoa/{id}")]
//        // GET: WebManager/MultiPuzzlesD/Delete/5
//        public async Task<IActionResult> Delete(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var multiPuzzle = await _repository.Get(id);
//            if (multiPuzzle == null)
//            {
//                return NotFound();
//            }

//            return View(multiPuzzle);
//        }
//        [Route("/quan-ly-web/cau-do-dac-biet/xoa /{id}")]
//        // POST: WebManager/MultiPuzzlesD/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> DeleteConfirmed(int id)
//        {
//            await _repository.Delete(id);
//            return RedirectToAction("Index");
//        }

//        private bool MultiPuzzleExists(int id)
//        {
//            return _context.MultiPuzzle.Any(e => e.ID == id);
//        }

//        [Route("/quan-ly-web/cau-do-dac-biet/chinh-sua-xuat-ban/{id}")]
//        public async Task<IActionResult> EditPublishDT(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }
//            var singlePuzzle = await _repository.GetEditPublishDT(id);
//            return View(singlePuzzle);
//        }

//        [Route("/quan-ly-web/cau-do-dac-biet/chinh-sua-xuat-ban/{id}")]
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> EditPublishDT(PublishDatetimeSinglePuzzleViewModel model)
//        {
//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    await _repository.UpdatePublishDT(model);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    return NotFound();
//                }
//                return RedirectToAction("Index");
//            }
//            return View(model);
//        }
//    }
    
//}