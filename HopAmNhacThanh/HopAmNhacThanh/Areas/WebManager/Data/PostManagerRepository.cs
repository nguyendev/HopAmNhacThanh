//using HopAmNhacThanh.Areas.WebManager.ViewModels.PostViewModels;
//using HopAmNhacThanh.Data;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Services;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Areas.WebManager.Data
//{
//    public class PostManagerRepository : IPostManagerRepository
//    {
//        protected readonly ApplicationDbContext _context;

//        public PostManagerRepository(ApplicationDbContext context)
//        {
//            _context = context;
//        }
//        public async Task Add(CreatePostViewModel model)
//        {
//            Post post = new Post
//            {
//                CreateDT = DateTime.Now,
//                Approved = "U",
//                IsDeleted = false,
//                Active = "A",
//                Title = model.Title,
//                Slug = model.Slug,
//                Content = model.Content,
//                Views = 0,
//                Like = 0,
//                Note = model.Note,
//                Description = model.Description,
//                ImageID = model.ImageID,
//                AuthorID = model.AuthorID,
//            };
//            _context.Post.Add(post);
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

//                _context.Add(new PostTag { TagID = tag.ID, PostID = post.ID });
//            }

//            await Save();
//        }

//        public async Task<Post> Get(int? id)
//        {
//            return await _context.Post
//                .Include(s => s.Image)
//                .Include(s => s.Author)
//                .SingleOrDefaultAsync(m => m.ID == id);
//        }
//        public bool Exists(int id)
//        {
//            return _context.SinglePuzzle.Any(c => c.ID == id);
//        }

//        public async Task<PaginatedList<Post>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize)
//        {
//            var post = from s in _context.Post.Include(p => p.Image)
//                .Include(p => p.Author)
//                                select s;
//            if (!String.IsNullOrEmpty(searchString))
//            {
//                post = post.Where(s => s.Title.Contains(searchString));
//            }
//            switch (sortOrder)
//            {
//                case "title":
//                    post = post.OrderByDescending(s => s.Title);
//                    break;
//                default:
//                    post = post.OrderBy(s => s.CreateDT);
//                    break;
//            }
//            return await PaginatedList<Post>.CreateAsync(post.AsNoTracking(), page ?? 1, pageSize != null ? pageSize.Value : 10);
//        }

//        public async Task Update(EditPostViewModel model)
//        {
//            var postOld = await _context.Post.SingleOrDefaultAsync(p => p.ID == model.ID);
//            Post post = new Post
//            {
//                Active = "A",
//                Approved = "A",
//                AuthorID = postOld.AuthorID,
//                CreateDT = postOld.CreateDT,
//                IsDeleted = model.IsDelete,
//                UpdateDT = DateTime.Now,
//                Description = model.Description,
//                ImageID = model.ImageID,
//                Title = model.Title,
//                Image = model.Image,
//                Note = model.Note,
//                Slug = model.Slug,
//                Like = postOld.Like,
//                Views = postOld.Views,
//                Content = model.Content
//            };
//            _context.Post.Remove(postOld);
//            _context.Post.Add(post);
//            //_context.Film.Update(film);


//            //Tim tat ca tag cu va tien hanh xoa
//            var tags = await _context.SingPuzzleTag.
//                    Include(p => p.Tag).
//                    Where(p => p.SinglePuzzleID == model.ID).
//                    ToListAsync();
//            foreach (var item in tags)
//            {
//                _context.SingPuzzleTag.Remove(item);
//            }


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
//                _context.Add(new PostTag { TagID = tag.ID, PostID = post.ID });
//            }
//            await Save();
//        }

//        public async Task Delete(int id)
//        {
//            var post = await _context.Post.SingleOrDefaultAsync(m => m.ID == id);
//            if (post.IsDeleted)
//                _context.Post.Remove(post);
//            else
//            {
//                post.IsDeleted = true;
//                _context.Post.Update(post);
//            }
//            await Save();
//        }

//        private async Task Save()
//        {
//            await _context.SaveChangesAsync();
//        }
//        public async Task<EditPostViewModel> GetEdit(int? ID)
//        {
//            var postDbContext = await _context.Post.Include(p => p.Image).SingleOrDefaultAsync(p => p.ID == ID);
//            if (postDbContext != null)
//            {
//                var tags = await _context.PostTag.
//                    Include(p => p.Tag).
//                    Where(p => p.PostID == postDbContext.ID).
//                    ToListAsync();
//                string tempTag = "";
//                foreach (var item in tags)
//                {
//                    tempTag = tempTag + item.Tag.Title + ", ";
//                }
//                EditPostViewModel editModel = new EditPostViewModel
//                {
//                    ID = postDbContext.ID,
//                    Title = postDbContext.Title,
//                    Description = postDbContext.Description,
//                    Image = postDbContext.Image,
//                    ImageID = postDbContext.ImageID,
//                    Note = postDbContext.Note,
//                    Slug = postDbContext.Slug,
//                    Active = postDbContext.Active,
//                    Approved = postDbContext.Approved,
//                    IsDelete = postDbContext.IsDeleted,
//                    Content = postDbContext.Content,
//                    AuthorID = postDbContext.AuthorID,
//                    TempTag = tempTag
//                };
//                return editModel;
//            }
//            return null;
//        }
//    }
//}
