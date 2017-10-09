//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Data
//{
//    public interface ISinglePuzzleManagerRepository
//    {
//        Task<SinglePuzzle> Get(int? id);
//        bool Exists(int id);
//        Task<PaginatedList<SinglePuzzle>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize);
//        Task Add(CreateSinglePuzzleViewModel model);
//        Task Update(EditSinglePuzzleViewModels model);
//        Task Delete(int id);

//        Task<EditSinglePuzzleViewModels> GetEdit(int? ID);
//        Task<PublishDatetimeSinglePuzzleViewModel> GetEditPublishDT(int? ID);
//        Task UpdatePublishDT(PublishDatetimeSinglePuzzleViewModel model);
//    }
//}
