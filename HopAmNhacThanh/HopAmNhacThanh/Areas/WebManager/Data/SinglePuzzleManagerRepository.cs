//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Services;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Data
//{
//    public class SinglePuzzleManagerRepository : ISinglePuzzleManagerRepository
//    {
//        protected readonly ApplicationDbContext _context;

//        public SinglePuzzleManagerRepository(ApplicationDbContext context)
//        {
//            _context = context;
//        }
//        public async Task Add(CreateSinglePuzzleViewModel model)
//        {
//            SinglePuzzle single = new SinglePuzzle
//            {
//                CreateDT = DateTime.Now,
//                Approved = "U",
//                IsDeleted = false,
//                Active = "A",
//                AnswerA = model.AnswerA,
//                AnswerB = model.AnswerB,
//                AnswerC = model.AnswerC,
//                AnswerD = model.AnswerD,
//                Correct = model.Correct,
//                Title = model.Title,
//                Slug = model.Slug,
//                IsYesNo = model.IsYesNo,
//                Like = 0,
//                Reason = model.Reason,
//                Note = model.Note,
//                Level = 0,
//                Description = model.Description,
//                ImageID = model.ImageID,
//                AuthorID = model.AuthorID,

//            };
//            _context.SinglePuzzle.Add(single);
//            // Get and convert string to create tag
//            List<string> listString = StringExtensions.ConvertStringToListString(model.TempTag);
//            List<Tag> listTag = new List<Tag>();

//            // Save all tag
//            foreach (var item in listString)
//            {
//                bool IsExitsTag = await _context.Tag.AnyAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(item));
//                Tag tag;
//                if (IsExitsTag)
//                {
//                    tag = await _context.Tag.SingleOrDefaultAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(item));
//                }
//                else
//                { 
//                    tag = new Tag
//                    {
//                        Title = item,
//                        Slug = StringExtensions.ConvertToUnSign3(item),
//                        CreateDT = DateTime.Now
//                    };
//                    _context.Add(tag);
//                }
               
//                _context.Add(new SinglePuzzleTag { TagID = tag.ID, SinglePuzzleID = single.ID });
//            }

//            await Save();
//        }

//        public async Task<SinglePuzzle> Get(int? id)
//        {
//            return await _context.SinglePuzzle
//                .Include(s => s.Image)
//                .Include(s => s.Author)
//                .SingleOrDefaultAsync(m => m.ID == id);
//        }
//        public bool Exists(int id)
//        {
//            return _context.SinglePuzzle.Any(c => c.ID == id);
//        }

//        public async Task<PaginatedList<SinglePuzzle>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize)
//        {
//            var singlePuzzles = from s in _context.SinglePuzzle.Include(p => p.Image)
//                .Include(p => p.Author).Where(p => !p.IsMMultiPuzzle)
//                         select s;
//            if (!String.IsNullOrEmpty(searchString))
//            {
//                singlePuzzles = singlePuzzles.Where(s => s.Title.Contains(searchString));
//            }
//            switch (sortOrder)
//            {
//                case "title":
//                    singlePuzzles = singlePuzzles.OrderBy(s => s.Title);
//                    break;
//                default:
//                    singlePuzzles = singlePuzzles.OrderByDescending(s => s.CreateDT);
//                    break;
//            }
//            return await PaginatedList<SinglePuzzle>.CreateAsync(singlePuzzles.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);
//        }

//        public async Task Update(EditSinglePuzzleViewModels model)
//        {
//            var singlePuzzleOld = await  _context.SinglePuzzle.SingleOrDefaultAsync(p => p.ID == model.ID);
//            SinglePuzzle film = new SinglePuzzle
//            {
//                Active = "A",
//                Approved = model.Approved,
//                AuthorID = singlePuzzleOld.AuthorID,
//                CreateDT = singlePuzzleOld.CreateDT,
//                IsDeleted = model.IsDelete,
//                UpdateDT = DateTime.Now,
//                Description = model.Description,
//                ImageID = model.ImageID,
//                Title = model.Title,
//                AnswerA = model.AnswerA,
//                AnswerB = model.AnswerB,
//                AnswerC = model.AnswerC,
//                AnswerD = model.AnswerD,
//                Correct = model.Correct,
//                Image = model.Image,
//                IsYesNo = model.IsYesNo,
//                Note = model.Note,
//                Reason = model.Reason,
//                Slug = model.Slug,
//                IsMMultiPuzzle = model.IsMMultiPuzzle,
//                Like = singlePuzzleOld.Like,
//                Views = singlePuzzleOld.Views,
//                Level = singlePuzzleOld.Level,
//                MultiPuzzleID = model.MultiPuzzleID,
//            };
//            _context.SinglePuzzle.Remove(singlePuzzleOld);
//            _context.SinglePuzzle.Add(film);
//            //_context.Film.Update(film);


//            //Tim tat ca tag cu va tien hanh xoa
//            var tags = await _context.SingPuzzleTag.
//                    Where(p => p.SinglePuzzleID == model.ID).
//                    ToListAsync();
//            foreach (var item in tags)
//            {
//                _context.SingPuzzleTag.Remove(item);
//            }
//            try
//            {
//                //Tim tat ca lich su nguoi dung cu va xoa
//                var historyAnswer = await _context.HistoryAnswerPuzzle.
//                    Where(p => p.PuzzleID == model.ID).
//                    ToListAsync();
//                foreach (var item in historyAnswer)
//                {
//                    _context.HistoryAnswerPuzzle.Remove(item);
//                }
//            }
//            catch { }

//            // Get and convert string to create tag
//            List<string> listString = StringExtensions.ConvertStringToListString(model.TempTag);
//            List<Tag> listTag = new List<Tag>(listString.Capacity - 1);


//            // Save all tag
//            foreach (var item in listString)
//            {
//                bool IsExitsTag = await _context.Tag.AnyAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(item));
//                Tag tag;
//                if (IsExitsTag)
//                {
//                    tag = await _context.Tag.SingleOrDefaultAsync(p => p.Slug == StringExtensions.ConvertToUnSign3(item));
//                }
//                else
//                {
//                    tag = new Tag
//                    {
//                        Title = item,
//                        Slug = StringExtensions.ConvertToUnSign3(item),
//                        CreateDT = DateTime.Now
//                    };
//                    _context.Add(tag);
//                }
//                _context.Add(new SinglePuzzleTag { TagID = tag.ID, SinglePuzzleID = film.ID });
//            }
//            await Save();
//        }

//        public async Task Delete(int id)
//        {
//            var singlePuzzle = await _context.SinglePuzzle.SingleOrDefaultAsync(m => m.ID == id);
//            if (singlePuzzle.IsDeleted)
//                _context.SinglePuzzle.Remove(singlePuzzle);
//            else
//            {
//                singlePuzzle.IsDeleted = true;
//                _context.SinglePuzzle.Update(singlePuzzle);
//            }
//            await Save();
//        }

//        private async Task Save()
//        {
//            await _context.SaveChangesAsync();
//        }
//        public async Task<EditSinglePuzzleViewModels> GetEdit(int? ID)
//        {
//            var singlePuzzleDbContext = await _context.SinglePuzzle.Include(p => p.Image).SingleOrDefaultAsync(p => p.ID == ID);
//            if (singlePuzzleDbContext != null)
//            {
//                var tags = await _context.SingPuzzleTag.
//                    Include(p => p.Tag).
//                    Where(p => p.SinglePuzzleID == singlePuzzleDbContext.ID).
//                    ToListAsync();
//                string tempTag = "";
//                foreach (var item in tags)
//                {
//                    tempTag = tempTag + item.Tag.Title + ", ";
//                }
//                EditSinglePuzzleViewModels editModel = new EditSinglePuzzleViewModels
//                {
//                    ID = singlePuzzleDbContext.ID,
//                    Title = singlePuzzleDbContext.Title,
//                    Description = singlePuzzleDbContext.Description,
//                    AnswerA = singlePuzzleDbContext.AnswerA,
//                    AnswerB = singlePuzzleDbContext.AnswerB,
//                    AnswerC = singlePuzzleDbContext.AnswerC,
//                    AnswerD = singlePuzzleDbContext.AnswerD,
//                    Correct = singlePuzzleDbContext.Correct,
//                    Image = singlePuzzleDbContext.Image,
//                    ImageID = singlePuzzleDbContext.ImageID,
//                    IsYesNo = singlePuzzleDbContext.IsYesNo,
//                    Note = singlePuzzleDbContext.Note,
//                    Reason = singlePuzzleDbContext.Reason,
//                    Slug = singlePuzzleDbContext.Slug,
//                    Active = singlePuzzleDbContext.Active,
//                    Approved = singlePuzzleDbContext.Approved,
//                    IsDelete = singlePuzzleDbContext.IsDeleted,
//                    IsMMultiPuzzle = singlePuzzleDbContext.IsMMultiPuzzle,
//                    MultiPuzzleID = singlePuzzleDbContext.MultiPuzzleID,
//                    TempTag = tempTag
//                };
//                return editModel;
//            }
//            return null;
//        }

//        public async Task<PublishDatetimeSinglePuzzleViewModel> GetEditPublishDT(int? ID)
//        {
//            try
//            {
//                var single = await _context.SinglePuzzle.SingleOrDefaultAsync(p => p.ID == ID);
//                PublishDatetimeSinglePuzzleViewModel model = new PublishDatetimeSinglePuzzleViewModel
//                {
//                    ID = single.ID,
//                    PublishDT = single.CreateDT
//                };
//            return model;
//            }
//            catch
//            {
//                return null;
//            }
//        }

//        public async Task UpdatePublishDT(PublishDatetimeSinglePuzzleViewModel model)
//        {
//            try
//            {
//                var single = await _context.SinglePuzzle.SingleOrDefaultAsync(p => p.ID == model.ID);
//                single.CreateDT = model.PublishDT;
//                _context.SinglePuzzle.Update(single);
//                await _context.SaveChangesAsync();
//            }
//            catch
//            {
                
//            }
//        }
//    }
//}
