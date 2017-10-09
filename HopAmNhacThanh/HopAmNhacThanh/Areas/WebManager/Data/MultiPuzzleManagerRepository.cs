//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Data;
//using Microsoft.EntityFrameworkCore;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.MultiPuzzleViewModels;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;

//namespace HopAmNhacThanh.Services
//{
//    public class MultiPuzzleManagerRepository : IMultiPuzzleManagerRepsository
//    {
//        protected readonly ApplicationDbContext _context;
//        public MultiPuzzleManagerRepository(ApplicationDbContext context)
//        {
//            _context = context;
//        }
//        public async Task Add(MultiPuzzle model)
//        {
//            _context.Add(model);
//            await Save();
//        }

//        public async Task Delete(int id)
//        {
//            try
//            {

//                var multiPuzzle = await _context.MultiPuzzle.SingleOrDefaultAsync(m => m.ID == id);
//                if (multiPuzzle.IsDeleted)
//                    _context.MultiPuzzle.Remove(multiPuzzle);
//                else
//                {
//                    multiPuzzle.IsDeleted = true;
//                    _context.MultiPuzzle.Update(multiPuzzle);
//                }
//                await _context.SaveChangesAsync();
//            }
//            catch
//            {
//            }
//        }

//        public bool Exists(int id)
//        {
//            throw new NotImplementedException();
//        }

//        public async Task<MultiPuzzle> Get(int? id)
//        {
//            var multiPuzzle = await _context.MultiPuzzle
//                .Include(m => m.Author)
//                .Include(m => m.Image)
//                .SingleOrDefaultAsync(m => m.ID == id);
//            return multiPuzzle;
//        }

//        public async Task<PaginatedList<MultiPuzzle>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize)
//        {
//            var multiPuzzles = from s in _context.MultiPuzzle
//                                        .Include(p => p.Author)
//                                select s;
//            if (!String.IsNullOrEmpty(searchString))
//            {
//                multiPuzzles = multiPuzzles.Where(s => s.Title.Contains(searchString));
//            }
//            switch (sortOrder)
//            {
//                case "title":
//                    multiPuzzles = multiPuzzles.OrderByDescending(s => s.Title);
//                    break;
//                default:
//                    multiPuzzles = multiPuzzles.OrderBy(s => s.CreateDT);
//                    break;
//            }
//            return await PaginatedList<MultiPuzzle>.CreateAsync(multiPuzzles.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);
//        }

//        public async Task<EditMultiPuzzleViewModel> GetEdit(int? id)
//        {
//            var multiPuzzleDbContext = await  _context.MultiPuzzle.SingleOrDefaultAsync(p => p.ID == id);
//            try
//            {
//                EditMultiPuzzleViewModel model = new EditMultiPuzzleViewModel
//                {
//                    ID = multiPuzzleDbContext.ID,
//                    Approved = multiPuzzleDbContext.Approved,
//                    Description = multiPuzzleDbContext.Description,
//                    ImageID = multiPuzzleDbContext.ID,
//                    IsDeleted = multiPuzzleDbContext.IsDeleted,
//                    NumberQuestion = multiPuzzleDbContext.NumberQuestion,
//                    Slug = multiPuzzleDbContext.Slug,
//                    Title = multiPuzzleDbContext.Title,
//                    Note = multiPuzzleDbContext.Note
//                };
//                return model;
//            }
//            catch {
//                return null;
//            }
//        }

//        //public Task<List<MultiPuzzle>> GetAll()
//        //{
//        //    return _context.Puzzle.ToListAsync();

//        //}

//        public async Task Update(EditMultiPuzzleViewModel model)
//        {
//            var multiPuzzle = await _context.MultiPuzzle.SingleOrDefaultAsync(p => p.ID == model.ID);
//            multiPuzzle.Title = model.Title;
//            multiPuzzle.Description = model.Description;
//            multiPuzzle.Slug = model.Slug;
//            multiPuzzle.ImageID = model.ImageID;
//            multiPuzzle.Approved = model.Approved;
//            multiPuzzle.IsDeleted = model.IsDeleted;
//            multiPuzzle.Note = model.Note;
//            _context.MultiPuzzle.Update(multiPuzzle);
//            await _context.SaveChangesAsync();
//        }

//        //public List<PuzzleType> GetPuzzleType()
//        //{
//        //    return _context.PuzzleType.ToList();
//        //}

//        private async Task Save()
//        {
//            await _context.SaveChangesAsync();
//        }
//        public async Task<PublishDatetimeSinglePuzzleViewModel> GetEditPublishDT(int? ID)
//        {
//            try
//            {
//                var single = await _context.MultiPuzzle.SingleOrDefaultAsync(p => p.ID == ID);
//                PublishDatetimeSinglePuzzleViewModel model = new PublishDatetimeSinglePuzzleViewModel
//                {
//                    ID = single.ID,
//                    PublishDT = single.CreateDT
//                };
//                return model;
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
//                var single = await _context.MultiPuzzle.SingleOrDefaultAsync(p => p.ID == model.ID);
//                single.CreateDT = model.PublishDT;
//                _context.MultiPuzzle.Update(single);
//                await _context.SaveChangesAsync();
//            }
//            catch
//            {

//            }
//        }
//    }
//}
