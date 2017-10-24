using HopAmNhacThanh.Areas.WebManager.ViewModels.StyleViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface IStyleManagerRepository
    {
        Task<Style> Get(long? id);
        bool Exists(long id);
        Task<IndexStyleViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(Style model);
        Task<Style> GetEdit(long? ID);
        Task Update(Style model);
        Task<Style> Details(long? id);
        Task Delete(long id);
    }
}
